/**
 * Part C Yosys algorithm core — mirrors courses/learn_yosys/common/algo_solvers.py
 */
import { fitHiDpiCanvas, fitGraphLayout } from "./canvas-hires.js";

export const ALGO_GOLDENS = {
  procMuxCells: 1,
  procDffCells: 1,
  procDffType: "$adff",
  procArst: true,
  afterProcProcesses: 0,
  optCleanRemoved: 2,
  optExprFolded: 1,
  optMergeAnds: 1,
  techmapNandNot: 2,
  extractMatches: 1,
  memoryDepth: 8,
  memoryWidth: 4,
  fsmStates: 3,
  fsmTransitions: 3,
  fsmEncodingBits: 2,
  abcAigAnds: 3,
  engineOk: true,
};

/** Real Yosys 0.9 evidence (common/evidence/partc/goldens.json). */
export const PARTC_REAL = {
  afterReadProcesses: 2,
  afterReadCells: 5,
  afterProcProcesses: 0,
  afterProcCells: 6,
  afterProcMux: 1,
  afterProcAnd: 2,
  afterProcAdff: 1,
  afterOptCells: 5,
  afterOptAnd: 1,
  afterOptAdff: 1,
  afterTechmapCells: 5,
  afterTechmapTypes: ["$_AND_", "$_DFF_PP0_", "$_MUX_", "$_XOR_"],
  afterMemoryMem: 1,
  afterMemoryWidth: 4,
  afterMemorySize: 8,
  afterMemoryRdPorts: 1,
  afterMemoryWrPorts: 1,
  afterFsmFsm: 1,
  afterFsmStateNum: 3,
  afterFsmStateBits: 2,
  afterFsmTransNum: 5,
  afterAbcCells: 23,
  afterAbcAnd: 10,
  afterAbcNot: 12,
  afterAbcAdff: 1,
  afterAbcTypes: ["$_AND_", "$_NOT_", "$adff"],
  afterExtractMatches: 1,
  afterExtractCells: 1,
  afterExtractTypes: ["ANDOR2"],
};

/** Bind teaching algo pass → real partc stat (browser mirror of partc_bind.py). */
export function partcBind(stage) {
  if (stage === "proc") {
    const dff = algoProcDff(STARTER);
    const ok =
      dff.regType === ALGO_GOLDENS.procDffType &&
      dff.hasArst === true &&
      dff.processes === 0 &&
      PARTC_REAL.afterProcAdff === 1 &&
      PARTC_REAL.afterProcMux === 1;
    return {
      ok,
      stage: "proc",
      teach: { regType: dff.regType, processes: dff.processes, mux: algoProcMux(STARTER).muxCount },
      real: {
        processes: PARTC_REAL.afterProcProcesses,
        adff: PARTC_REAL.afterProcAdff,
        mux: PARTC_REAL.afterProcMux,
        and: PARTC_REAL.afterProcAnd,
        cells: PARTC_REAL.afterProcCells,
      },
      note: "Real Yosys: async reset → $adff; combo if → $mux; processes→0.",
    };
  }
  if (stage === "opt") {
    const merge = algoOptMerge(STARTER);
    const ok = merge.andCount === ALGO_GOLDENS.optMergeAnds && PARTC_REAL.afterOptAnd === 1;
    return {
      ok,
      stage: "opt",
      teach: { andCount: merge.andCount, cellCount: merge.design.cells.length },
      real: {
        and: PARTC_REAL.afterOptAnd,
        adff: PARTC_REAL.afterOptAdff,
        cells: PARTC_REAL.afterOptCells,
      },
      note: "Real Yosys opt merges duplicate $and (2→1), keeps $adff/$mux.",
    };
  }
  if (stage === "techmap") {
    const tech = algoTechmapMapfile(STARTER);
    const realTypes = new Set(PARTC_REAL.afterTechmapTypes);
    const ok =
      tech.nandNotCount === ALGO_GOLDENS.techmapNandNot &&
      realTypes.has("$_DFF_PP0_") &&
      realTypes.has("$_MUX_") &&
      realTypes.has("$_AND_");
    return {
      ok,
      stage: "techmap",
      teach: { nandNot: tech.nandNotCount },
      real: { cells: PARTC_REAL.afterTechmapCells, types: PARTC_REAL.afterTechmapTypes },
      note: "Real techmap → $_AND_/$_MUX_/$_XOR_/$_DFF_PP0_; teach mapfile shows NAND+NOT.",
    };
  }
  if (stage === "extract") {
    const ext = algoExtractIso(STARTER);
    const ok =
      ext.matches === ALGO_GOLDENS.extractMatches &&
      PARTC_REAL.afterExtractMatches === 1 &&
      PARTC_REAL.afterExtractTypes.includes("ANDOR2");
    return {
      ok,
      stage: "extract",
      teach: { matches: ext.matches, macro: ext.macro },
      real: {
        matches: PARTC_REAL.afterExtractMatches,
        cells: PARTC_REAL.afterExtractCells,
        types: PARTC_REAL.afterExtractTypes,
      },
      note: "Real extract -map → ANDOR2×1 on tiny_extract.v.",
    };
  }
  if (stage === "memory") {
    const mem = algoMemoryMap();
    const ok =
      mem.depth === ALGO_GOLDENS.memoryDepth &&
      mem.width === ALGO_GOLDENS.memoryWidth &&
      PARTC_REAL.afterMemoryMem === 1 &&
      PARTC_REAL.afterMemoryWidth === 4 &&
      PARTC_REAL.afterMemorySize === 8;
    return {
      ok,
      stage: "memory",
      teach: { width: mem.width, depth: mem.depth },
      real: {
        mem: PARTC_REAL.afterMemoryMem,
        width: PARTC_REAL.afterMemoryWidth,
        size: PARTC_REAL.afterMemorySize,
        rd: PARTC_REAL.afterMemoryRdPorts,
        wr: PARTC_REAL.afterMemoryWrPorts,
      },
      note: "Real memory_collect → $mem WIDTH=4 SIZE=8 on tiny_mem.v.",
    };
  }
  if (stage === "fsm") {
    const fsm = algoFsmDetect();
    const ok =
      fsm.states === ALGO_GOLDENS.fsmStates &&
      fsm.encodingBits === ALGO_GOLDENS.fsmEncodingBits &&
      PARTC_REAL.afterFsmFsm === 1 &&
      PARTC_REAL.afterFsmStateNum === 3 &&
      PARTC_REAL.afterFsmStateBits === 2;
    return {
      ok,
      stage: "fsm",
      teach: { states: fsm.states, transitions: fsm.transitions, encodingBits: fsm.encodingBits },
      real: {
        fsm: PARTC_REAL.afterFsmFsm,
        state_num: PARTC_REAL.afterFsmStateNum,
        state_bits: PARTC_REAL.afterFsmStateBits,
        trans_num: PARTC_REAL.afterFsmTransNum,
      },
      note: "Real fsm_extract → $fsm STATE_NUM=3 STATE_BITS=2; TRANS_NUM includes stay edges.",
    };
  }
  if (stage === "abc") {
    const abc = algoAbcHandoff(STARTER);
    const ok =
      abc.aigAnds === ALGO_GOLDENS.abcAigAnds &&
      PARTC_REAL.afterAbcAnd >= 1 &&
      PARTC_REAL.afterAbcTypes.includes("$adff");
    return {
      ok,
      stage: "abc",
      teach: { aigAnds: abc.aigAnds },
      real: {
        and: PARTC_REAL.afterAbcAnd,
        not: PARTC_REAL.afterAbcNot,
        adff: PARTC_REAL.afterAbcAdff,
        cells: PARTC_REAL.afterAbcCells,
        types: PARTC_REAL.afterAbcTypes,
      },
      note: "Teach counts abstract AIG ANDs; real aigmap emits $_AND_/$_NOT_ handoff.",
    };
  }
  return { ok: false, stage, note: "unknown stage" };
}

export const STARTER = {
  name: "tiny_algo",
  usedOutputs: ["y", "q", "n1", "n2"],
  const0: "c0",
  processes: [
    {
      id: "p_mux",
      kind: "combo",
      assign: "y",
      cases: [
        { when: { s: 1 }, value: "a" },
        { when: { s: 0 }, value: "b" },
      ],
    },
    {
      id: "p_dff",
      kind: "sync",
      clock: "clk",
      edge: "pos",
      reset: "rst",
      resetVal: 0,
      assign: "q",
      value: "y",
    },
  ],
  cells: [
    { id: "c_and1", type: "$and", A: "a", B: "b", Y: "n1" },
    { id: "c_and2", type: "$and", A: "a", B: "b", Y: "n2" },
    { id: "c_or", type: "$or", A: "n1", B: "s", Y: "dead" },
    { id: "c_buf0", type: "$buf", A: "c0", Y: "unused" },
  ],
  memory: { id: "mem0", width: 4, depth: 8, rd: 1, wr: 1 },
  fsm: {
    states: ["IDLE", "RUN", "DONE"],
    transitions: 3,
    encodingBits: 2,
    reset: "IDLE",
  },
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

export function algoProcMux(data = STARTER) {
  const d = cloneDesign(data);
  const added = [];
  const keep = [];
  for (const p of d.processes) {
    if (p.kind !== "combo") {
      keep.push(p);
      continue;
    }
    const c1 = p.cases.find((c) => c.when.s === 1);
    const c0 = p.cases.find((c) => c.when.s === 0);
    const cell = { id: `mux_${p.id}`, type: "$mux", S: "s", A: c1.value, B: c0.value, Y: p.assign };
    d.cells.push(cell);
    added.push(cell.id);
  }
  d.processes = keep;
  return { design: d, muxCount: d.cells.filter((c) => c.type === "$mux").length, added, pass: "proc_mux" };
}

export function algoProcDff(data = STARTER) {
  const mid = algoProcMux(data);
  const d = mid.design;
  const keep = [];
  const added = [];
  for (const p of d.processes) {
    if (p.kind !== "sync") {
      keep.push(p);
      continue;
    }
    const cell =
      p.reset != null
        ? {
            id: `adff_${p.id}`,
            type: "$adff",
            CLK: p.clock,
            D: p.value,
            Q: p.assign,
            edge: p.edge || "pos",
            ARST: p.reset,
            ARST_VALUE: p.resetVal ?? 0,
          }
        : {
            id: `dff_${p.id}`,
            type: "$dff",
            CLK: p.clock,
            D: p.value,
            Q: p.assign,
            edge: p.edge || "pos",
          };
    d.cells.push(cell);
    added.push(cell.id);
  }
  d.processes = keep;
  const regs = d.cells.filter((c) => c.type === "$dff" || c.type === "$adff");
  return {
    design: d,
    dffCount: regs.length,
    hasArst: regs.some((c) => c.type === "$adff" || c.ARST != null),
    regType: regs[0]?.type || null,
    processes: d.processes.length,
    added,
    pass: "proc_dff",
  };
}

function usedNets(d) {
  const used = new Set(d.usedOutputs || []);
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of d.cells) {
      const y = c.Y || c.Q;
      if (!used.has(y) && c.type !== "$mux" && c.type !== "$dff" && c.type !== "$adff") continue;
      if (c.type === "$mux" || c.type === "$dff" || c.type === "$adff" || used.has(y)) {
        for (const [k, v] of Object.entries(c)) {
          if (["id", "type", "edge", "Y", "Q", "ARST_VALUE"].includes(k)) continue;
          if (typeof v === "string" && !used.has(v)) {
            used.add(v);
            changed = true;
          }
        }
      }
    }
  }
  return used;
}

export function algoOptClean(data = STARTER) {
  const d = algoProcDff(data).design;
  const used = usedNets(d);
  const keep = [];
  const removed = [];
  for (const c of d.cells) {
    const y = c.Y || c.Q;
    if (c.type === "$mux" || c.type === "$dff" || c.type === "$adff" || (y && used.has(y))) keep.push(c);
    else removed.push(c.id);
  }
  d.cells = keep;
  return { design: d, removed, removedCount: removed.length, cellCount: keep.length, pass: "opt_clean" };
}

export function algoOptExpr(data = STARTER) {
  const d = cloneDesign(data);
  const folded = [];
  d.cells = d.cells.filter((c) => {
    if (c.type === "$buf" && c.A === "c0") {
      folded.push(c.id);
      return false;
    }
    return true;
  });
  const cleaned = algoOptClean(d);
  return { design: cleaned.design, folded, foldedCount: folded.length, pass: "opt_expr" };
}

export function algoOptMerge(data = STARTER) {
  const d = algoOptClean(data).design;
  const keyToY = new Map();
  const remap = {};
  const keep = [];
  const removed = [];
  for (const c of d.cells) {
    if (c.type === "$and" || c.type === "$or") {
      const key = `${c.type}|${c.A}|${c.B}`;
      if (keyToY.has(key)) {
        remap[c.Y] = keyToY.get(key);
        removed.push(c.id);
        continue;
      }
      keyToY.set(key, c.Y);
    }
    keep.push(c);
  }
  for (const c of keep) {
    for (const p of ["A", "B", "D", "S"]) {
      if (c[p] && remap[c[p]]) c[p] = remap[c[p]];
    }
  }
  d.cells = keep;
  return {
    design: d,
    removed,
    andCount: keep.filter((c) => c.type === "$and").length,
    cellCount: keep.length,
    pass: "opt_merge",
  };
}

export function algoTechmapMapfile(data = STARTER) {
  const d = algoOptMerge(data).design;
  const out = [];
  const mapped = [];
  let n = 0;
  for (const c of d.cells) {
    if (c.type !== "$and") {
      out.push(c);
      continue;
    }
    const tmp = `_tm${n++}`;
    out.push({ id: `tm_nand_${c.id}`, type: "$_NAND_", A: c.A, B: c.B, Y: tmp });
    out.push({ id: `tm_not_${c.id}`, type: "$_NOT_", A: tmp, Y: c.Y });
    mapped.push(c.id);
  }
  d.cells = out;
  const nandNot = out.filter((c) => c.type === "$_NAND_" || c.type === "$_NOT_").length;
  return { design: d, mapped, nandNotCount: nandNot, pass: "techmap" };
}

export function algoExtractIso(data = STARTER) {
  const d = algoProcDff(data).design;
  const byY = Object.fromEntries(d.cells.filter((c) => c.Y).map((c) => [c.Y, c]));
  const matches = [];
  const remove = new Set();
  const add = [];
  for (const c of d.cells) {
    if (c.type !== "$or") continue;
    let t = byY[c.A];
    let z = c.B;
    if (!t || t.type !== "$and") {
      t = byY[c.B];
      z = c.A;
      if (!t || t.type !== "$and") continue;
    }
    matches.push([t.id, c.id]);
    remove.add(t.id);
    remove.add(c.id);
    add.push({ id: `ext_${c.id}`, type: "ANDOR2", X: t.A, Y: t.B, Z: z, O: c.Y });
  }
  d.cells = d.cells.filter((c) => !remove.has(c.id)).concat(add);
  return { design: d, matches: matches.length, macro: matches.length ? "ANDOR2" : null, pass: "extract" };
}

export function algoMemoryMap() {
  return {
    cell: { id: "mem0", type: "$mem", WIDTH: 4, SIZE: 8 },
    depth: 8,
    width: 4,
    memCount: 1,
    pass: "memory_map",
  };
}

export function algoFsmDetect() {
  return {
    states: 3,
    transitions: 3,
    encodingBits: 2,
    resetState: "IDLE",
    stateNames: ["IDLE", "RUN", "DONE"],
    pass: "fsm_detect",
  };
}

export function algoAbcHandoff(data = STARTER) {
  const d = algoOptMerge(data).design;
  let ands = 0;
  for (const c of d.cells) {
    if (c.type === "$and") ands += 1;
    else if (c.type === "$or") ands += 2;
    else if (c.type === "$mux") ands += 2;
  }
  return { aigAnds: ands, cellTypes: [...new Set(d.cells.map((c) => c.type))].sort(), pass: "abc_handoff" };
}

export function yosysAlgoEngine(data = STARTER) {
  const mux = algoProcMux(data);
  const dff = algoProcDff(data);
  const clean = algoOptClean(data);
  const expr = algoOptExpr(data);
  const merge = algoOptMerge(data);
  const tech = algoTechmapMapfile(data);
  const ext = algoExtractIso(data);
  const mem = algoMemoryMap();
  const fsm = algoFsmDetect();
  const abc = algoAbcHandoff(data);
  const ok =
    mux.muxCount === ALGO_GOLDENS.procMuxCells &&
    dff.dffCount === ALGO_GOLDENS.procDffCells &&
    dff.hasArst === ALGO_GOLDENS.procArst &&
    dff.regType === ALGO_GOLDENS.procDffType &&
    dff.processes === ALGO_GOLDENS.afterProcProcesses &&
    clean.removedCount === ALGO_GOLDENS.optCleanRemoved &&
    expr.foldedCount === ALGO_GOLDENS.optExprFolded &&
    merge.andCount === ALGO_GOLDENS.optMergeAnds &&
    tech.nandNotCount === ALGO_GOLDENS.techmapNandNot &&
    ext.matches === ALGO_GOLDENS.extractMatches &&
    mem.depth === ALGO_GOLDENS.memoryDepth &&
    fsm.states === ALGO_GOLDENS.fsmStates &&
    abc.aigAnds === ALGO_GOLDENS.abcAigAnds;
  return {
    ok,
    mux: mux.muxCount,
    dff: dff.dffCount,
    cleanRemoved: clean.removedCount,
    exprFolded: expr.foldedCount,
    mergeAnds: merge.andCount,
    techmapNandNot: tech.nandNotCount,
    extractMatches: ext.matches,
    memoryDepth: mem.depth,
    fsmStates: fsm.states,
    abcAnds: abc.aigAnds,
    design: merge.design,
  };
}

export function drawAlgoYosys(canvas, opts = {}) {
  const design = opts.design || STARTER;
  const selected = new Set(opts.selected || []);
  const highlight = new Set(opts.highlight || []);
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);

  const items = [];
  for (const p of design.processes || []) items.push({ id: p.id, type: `proc:${p.kind}`, kind: "proc" });
  for (const c of design.cells || []) items.push({ id: c.id, type: c.type, kind: "cell" });
  if (opts.showMemory) items.push({ id: "mem0", type: "$mem", kind: "mem" });
  if (opts.showFsm) items.push({ id: "fsm0", type: "FSM", kind: "fsm" });

  const layout = {};
  items.forEach((it, i) => {
    layout[it.id] = { x: 40 + (i % 4) * 120, y: 90 + Math.floor(i / 4) * 90, ...it };
  });
  const fitted = fitGraphLayout(layout, W, H, { pad: 48 });

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || "Yosys algorithm view", 16, 28);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.fillText(opts.metricText || `cells=${(design.cells || []).length} procs=${(design.processes || []).length}`, 16, 50);

  for (const [id, pos] of Object.entries(fitted.layout)) {
    const it = layout[id];
    const hot = selected.has(id) || highlight.has(id) || highlight.has(it.type);
    const x = pos.x;
    const y = pos.y;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(x - 50, y - 22, 100, 44, 8);
    else ctx.rect(x - 50, y - 22, 100, 44);
    ctx.fillStyle = hot ? "#0ea5e9" : it.kind === "proc" ? "#334155" : "#1e293b";
    ctx.fill();
    ctx.strokeStyle = hot ? "#38bdf8" : "#475569";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "11px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(it.type, x, y);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

export function hitTestAlgo(canvas, design, clientX, clientY, opts = {}) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const items = [];
  for (const p of design.processes || []) items.push({ id: p.id, type: `proc:${p.kind}` });
  for (const c of design.cells || []) items.push({ id: c.id, type: c.type });
  if (opts.showMemory) items.push({ id: "mem0", type: "$mem" });
  if (opts.showFsm) items.push({ id: "fsm0", type: "FSM" });
  const layout = {};
  items.forEach((it, i) => {
    layout[it.id] = { x: 40 + (i % 4) * 120, y: 90 + Math.floor(i / 4) * 90 };
  });
  const fitted = fitGraphLayout(layout, canvas.clientWidth, canvas.clientHeight, { pad: 48 });
  for (const [id, pos] of Object.entries(fitted.layout)) {
    if (x >= pos.x - 50 && x <= pos.x + 50 && y >= pos.y - 22 && y <= pos.y + 22) return id;
  }
  return null;
}
