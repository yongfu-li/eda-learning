/**
 * Tiny Yosys pass pipeline — proc, flatten, opt, strash, rewrite, techmap for learn_yosys.
 * Goldens mirror courses/learn_yosys/common/solvers.py.
 */
import { fitHiDpiCanvas, fitGraphLayout, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  rtlCellCount: 6,
  moduleCount: 2,
  afterFlattenModules: 1,
  afterOptCells: 5,
  afterStrashCells: 4,
  afterRewriteCells: 3,
  afterRewriteComb: 2,
  afterRewriteSeq: 1,
  techmapNandCountArea: 6,
  techmapNandCountDelay: 7,
  reportCellsSynth: 7,
  reportWiresSynth: 11,
  engineOk: true,
};

export const STARTER = {
  name: "tiny_and_or",
  modules: ["top", "child"],
  cells: [
    { id: "c1", type: "AND", a: "a", b: "b", y: "n1", module: "top" },
    { id: "c2", type: "OR", a: "n1", b: "c", y: "n2", module: "top" },
    { id: "c3", type: "AND", a: "a", b: "b", y: "n3", module: "top" },
    { id: "c4", type: "BUF", a: "const0", y: "dead", module: "top" },
    { id: "c5", type: "NOT", a: "n2", y: "out", module: "top" },
    { id: "c6", type: "DFF", d: "out", q: "q", clk: "clk", module: "child" },
  ],
  ports: { a: "in", b: "in", c: "in", q: "out", clk: "in" },
  const0: true,
};

const CELL_COLORS = {
  AND: "#d4e4f7",
  OR: "#e8dff5",
  NOT: "#ffe8d6",
  NOR: "#ffd9a8",
  BUF: "#eef2f6",
  DFF: "#d4edda",
  NAND2: "#f5e6d3",
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

export function designStats(d = STARTER) {
  return {
    cellCount: d.cells.length,
    moduleCount: d.modules.length,
    types: [...new Set(d.cells.map((c) => c.type))].sort(),
    ids: d.cells.map((c) => c.id),
  };
}

export function passProc(d = STARTER) {
  const design = cloneDesign(d);
  return { design, cellCount: design.cells.length, pass: "proc" };
}

export function passHierarchyFlatten(d = STARTER) {
  const design = cloneDesign(d);
  for (const c of design.cells) c.module = "top";
  design.modules = ["top"];
  return { design, moduleCount: design.modules.length, pass: "flatten" };
}

export function passOptDce(d = STARTER) {
  const design = cloneDesign(d);
  const keep = [];
  const removed = [];
  for (const c of design.cells) {
    if (c.type === "BUF" && c.a === "const0") {
      removed.push(c.id);
      continue;
    }
    keep.push(c);
  }
  design.cells = keep;
  return { design, cellCount: keep.length, removed, pass: "opt" };
}

export function passAigStrash(d = STARTER) {
  const design = passOptDce(d).design;
  const keyToId = {};
  const remap = {};
  const keep = [];
  for (const c of design.cells) {
    if (c.type === "AND") {
      const key = `AND|${c.a}|${c.b}`;
      if (keyToId[key]) {
        remap[c.y] = keyToId[key];
        continue;
      }
      keyToId[key] = c.y;
    }
    keep.push(c);
  }
  for (const c of keep) {
    for (const p of ["a", "b", "d"]) {
      if (p in c && remap[c[p]]) c[p] = remap[c[p]];
    }
  }
  design.cells = keep;
  return { design, cellCount: keep.length, merged: Object.keys(remap), pass: "strash" };
}

export function passRewrite(d = STARTER) {
  const design = passAigStrash(d).design;
  const byY = {};
  for (const c of design.cells) {
    const y = c.y || c.q;
    if (y) byY[y] = c;
  }
  const nots = design.cells.filter((c) => c.type === "NOT");
  const remove = new Set();
  const add = [];
  for (const n of nots) {
    const src = byY[n.a];
    if (src && src.type === "OR") {
      remove.add(src.id);
      remove.add(n.id);
      add.push({
        id: `rw_${src.id}`,
        type: "NOR",
        a: src.a,
        b: src.b,
        y: n.y,
        module: "top",
      });
    }
  }
  const keep = design.cells.filter((c) => !remove.has(c.id)).concat(add);
  design.cells = keep;
  const comb = keep.filter((c) => c.type !== "DFF");
  const seq = keep.filter((c) => c.type === "DFF");
  return {
    design,
    cellCount: keep.length,
    combCount: comb.length,
    seqCount: seq.length,
    pass: "rewrite",
  };
}

export function passTechmap(d = STARTER, mode = "area") {
  const design = passRewrite(d).design;
  const nands = [];
  let nid = 0;

  function nand(a, b, y) {
    nid += 1;
    nands.push({ id: `nd${nid}`, type: "NAND2", a, b, y, module: "top" });
  }

  for (const c of design.cells) {
    if (c.type === "DFF") {
      nands.push({ ...c });
    } else if (c.type === "AND") {
      const t = `t_${c.id}`;
      nand(c.a, c.b, t);
      nand(t, t, c.y);
    } else if (c.type === "NOR") {
      if (mode === "area") {
        const t1 = `t1_${c.id}`;
        const t2 = `t2_${c.id}`;
        const t3 = `t3_${c.id}`;
        nand(c.a, c.a, t1);
        nand(c.b, c.b, t2);
        nand(t1, t2, t3);
        nand(t3, t3, c.y);
      } else {
        const t1 = `t1_${c.id}`;
        const t2 = `t2_${c.id}`;
        const t3 = `t3_${c.id}`;
        const t4 = `t4_${c.id}`;
        nand(c.a, c.a, t1);
        nand(c.b, c.b, t2);
        nand(t1, t2, t3);
        nand(t3, t3, t4);
        nand(t4, t4, c.y);
      }
    } else if (c.type === "OR") {
      const t1 = `t1_${c.id}`;
      const t2 = `t2_${c.id}`;
      nand(c.a, c.a, t1);
      nand(c.b, c.b, t2);
      nand(t1, t2, c.y);
    } else if (c.type === "NOT") {
      nand(c.a, c.a, c.y);
    } else {
      nands.push({ ...c });
    }
  }

  const nandOnly = nands.filter((x) => x.type === "NAND2");
  const d2 = cloneDesign(design);
  d2.cells = nands;
  return {
    design: d2,
    mode,
    nandCount: nandOnly.length,
    cellCount: nands.length,
    pass: `techmap_${mode}`,
  };
}

export function passSynthScript(d = STARTER) {
  let design = cloneDesign(d);
  design = passProc(design).design;
  design = passHierarchyFlatten(design).design;
  design = passOptDce(design).design;
  design = passAigStrash(design).design;
  design = passRewrite(design).design;
  const mapped = passTechmap(design, "area");
  return {
    design: mapped.design,
    cellCount: mapped.cellCount,
    nandCount: mapped.nandCount,
    pass: "synth",
  };
}

export function reportStats(d = STARTER) {
  const syn = passSynthScript(d);
  const design = syn.design;
  const wires = new Set();
  for (const c of design.cells) {
    for (const [k, v] of Object.entries(c)) {
      if (["a", "b", "d", "clk", "y", "q"].includes(k) && typeof v === "string") wires.add(v);
    }
  }
  return {
    cellCount: design.cells.length,
    nandCount: syn.nandCount,
    wireCount: wires.size,
    design,
  };
}

export function yosysEngine(d = STARTER) {
  const d0 = cloneDesign(d);
  const proc = passProc(d0);
  const flatten = passHierarchyFlatten(d0);
  const opt = passOptDce(d0);
  const strash = passAigStrash(d0);
  const rewrite = passRewrite(d0);
  const area = passTechmap(d0, "area");
  const delay = passTechmap(d0, "delay");
  const report = reportStats(d0);
  const ok =
    proc.cellCount === GOLDENS.rtlCellCount &&
    flatten.moduleCount === GOLDENS.afterFlattenModules &&
    opt.cellCount === GOLDENS.afterOptCells &&
    strash.cellCount === GOLDENS.afterStrashCells &&
    rewrite.cellCount === GOLDENS.afterRewriteCells &&
    area.nandCount === GOLDENS.techmapNandCountArea &&
    delay.nandCount === GOLDENS.techmapNandCountDelay &&
    report.cellCount === GOLDENS.reportCellsSynth &&
    report.wireCount === GOLDENS.reportWiresSynth;
  return { proc, flatten, opt, strash, rewrite, area, delay, report, ok };
}

export function yosysCompare(d = STARTER) {
  const eng = yosysEngine(d);
  return {
    rtlCells: eng.proc.cellCount,
    afterOpt: eng.opt.cellCount,
    afterStrash: eng.strash.cellCount,
    afterRewrite: eng.rewrite.cellCount,
    nandArea: eng.area.nandCount,
    nandDelay: eng.delay.nandCount,
    reportCells: eng.report.cellCount,
    reportWires: eng.report.wireCount,
    ok: eng.ok,
  };
}

function cellLayout(cells, opts = {}) {
  const nodes = {};
  const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(cells.length))));
  cells.forEach((c, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    nodes[c.id] = {
      x: 70 + col * 120,
      y: 60 + row * 72,
      kind: "cell",
      type: c.type,
      label: c.id,
      module: c.module,
    };
  });
  return nodes;
}

export function drawYosys(canvas, opts = {}) {
  const design = opts.design || STARTER;
  const highlight = new Set(opts.highlight || []);
  const removed = new Set(opts.removed || []);
  const merged = new Set(opts.merged || []);
  const selected = new Set(opts.selected || []);
  const stageLabel = opts.stageLabel || opts.stage || null;
  const metricText = opts.metricText || null;
  const showNand = opts.showNand === true || design.cells.some((c) => c.type === "NAND2");

  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight || LAB_CANVAS_CSS_HEIGHT;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f7f5f0";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#5c6570";
  ctx.font = "600 11px ui-sans-serif, system-ui";
  ctx.textAlign = "left";
  ctx.fillText(
    stageLabel || "Yosys pass pipeline (proc → flatten → opt → strash → rewrite → techmap)",
    12,
    16,
  );

  const raw = cellLayout(design.cells, opts);
  const { layout, fontPx } = fitGraphLayout(raw, W, H, { pad: 36, nodeMargin: 40 });

  for (const c of design.cells) {
    const s = layout[c.id];
    if (!s) continue;
    const meta = raw[c.id];
    const isRemoved = removed.has(c.id);
    const isMerged = merged.has(c.id) || merged.has(c.y);
    const on = highlight.has(c.id) || selected.has(c.id);
    const w = showNand && c.type === "NAND2" ? 68 : 76;
    const h = 34;

    if (isRemoved) {
      ctx.fillStyle = "#f0ebe3";
      ctx.setLineDash([4, 3]);
    } else if (on || isMerged) {
      ctx.fillStyle = on ? "#ffd9a8" : "#ffe8d6";
      ctx.setLineDash([]);
    } else {
      ctx.fillStyle = CELL_COLORS[c.type] || "#eef2f6";
      ctx.setLineDash([]);
    }

    ctx.fillRect(s.x - w / 2, s.y - h / 2, w, h);
    ctx.strokeStyle = isRemoved ? "#aaa" : on ? "#c45c26" : isMerged ? "#c45c26" : "#7a8a99";
    ctx.lineWidth = on || isMerged ? 2 : 1.2;
    ctx.strokeRect(s.x - w / 2, s.y - h / 2, w, h);
    ctx.setLineDash([]);

    ctx.fillStyle = isRemoved ? "#888" : "#1a1f24";
    ctx.font = `600 ${Math.max(9, fontPx - 2)}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(c.type, s.x, s.y - 5);
    ctx.font = `${Math.max(8, fontPx - 3)}px ui-sans-serif, system-ui`;
    ctx.fillText(meta.label, s.x, s.y + 8);

    if (c.module && c.module !== "top") {
      ctx.fillStyle = "#4a6fa5";
      ctx.font = `${Math.max(7, fontPx - 4)}px ui-sans-serif, system-ui`;
      ctx.fillText(c.module, s.x, s.y + h / 2 + 8);
    }
  }

  if (metricText) {
    ctx.fillStyle = "#1a1f24";
    ctx.font = "600 13px ui-sans-serif, system-ui";
    ctx.textAlign = "right";
    ctx.fillText(metricText, W - 12, H - 14);
  }
}

export function hitTestCell(canvas, design, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const W = canvas.clientWidth;
  const H = canvas.clientHeight || LAB_CANVAS_CSS_HEIGHT;
  const raw = cellLayout(design.cells);
  const { layout } = fitGraphLayout(raw, W, H, { pad: 36, nodeMargin: 40 });
  const showNand = design.cells.some((c) => c.type === "NAND2");
  for (const c of design.cells) {
    const s = layout[c.id];
    if (!s) continue;
    const w = showNand && c.type === "NAND2" ? 68 : 76;
    const h = 34;
    if (x >= s.x - w / 2 && x <= s.x + w / 2 && y >= s.y - h / 2 && y <= s.y + h / 2) return c.id;
  }
  return null;
}
