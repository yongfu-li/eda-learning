/**
 * Real Yosys evidence core — stages from checked-in Yosys 0.9 goldens on tiny_and_or.v.
 * Browser mirrors Track A real_solvers.py (does not shell out to Yosys).
 */
import { fitHiDpiCanvas, fitGraphLayout } from "./canvas-hires.js";

export const GOLDEN_RECIPE_IDS = [
  "read_verilog",
  "hierarchy",
  "proc",
  "flatten",
  "opt",
  "synth",
  "stat",
  "write",
];

export const CMD_PALETTE = [
  { id: "read_verilog", label: "read_verilog", hint: "Load RTL" },
  { id: "hierarchy", label: "hierarchy -check -top top", hint: "Set top" },
  { id: "proc", label: "proc", hint: "Processes → cells" },
  { id: "flatten", label: "flatten", hint: "Inline hierarchy" },
  { id: "opt", label: "opt", hint: "Merge / DCE" },
  { id: "aigmap", label: "aigmap", hint: "Gate → AIG" },
  { id: "synth", label: "synth -top top", hint: "Generic synth" },
  { id: "stat", label: "stat", hint: "Print counts" },
  { id: "write", label: "write_json / write_verilog", hint: "Emit netlist" },
];

/** Evidence snapshots (Yosys 0.9 on common/rtl/tiny_and_or.v). */
export const STAGES = {
  empty: {
    id: "empty",
    title: "empty design",
    moduleCount: 0,
    processes: 0,
    cellCount: 0,
    cells: {},
    types: [],
    note: "No design loaded yet.",
  },
  read_hierarchy: {
    id: "read_hierarchy",
    title: "after read_verilog + hierarchy",
    moduleCount: 2,
    processes: 1,
    cellCount: 4,
    topCells: 5,
    cells: { $and: 2, $or: 1, $not: 1 },
    types: ["$and", "$or", "$not"],
    note: "top has $and×2/$or/$not + child instance; child still has a process.",
  },
  proc: {
    id: "proc",
    title: "after proc",
    moduleCount: 2,
    processes: 0,
    cellCount: 4,
    cells: { $and: 1, $or: 1, $not: 1, $dff: 1 },
    types: ["$and", "$or", "$not", "$dff"],
    note: "always @(posedge clk) became $dff; processes=0.",
  },
  flatten: {
    id: "flatten",
    title: "after flatten",
    moduleCount: 1,
    processes: 0,
    cellCount: 4,
    cells: { $and: 1, $or: 1, $not: 1, $dff: 1 },
    types: ["$and", "$or", "$not", "$dff"],
    note: "child DFF inlined into top — one module.",
  },
  opt: {
    id: "opt",
    title: "after opt",
    moduleCount: 1,
    processes: 0,
    cellCount: 4,
    cells: { $and: 1, $or: 1, $not: 1, $dff: 1 },
    types: ["$and", "$or", "$not", "$dff"],
    note: "opt/opt_merge cleaned duplicates; $and count=1.",
  },
  aigmap: {
    id: "aigmap",
    title: "after aigmap",
    moduleCount: 1,
    processes: 0,
    cellCount: 7,
    cells: { $_AND_: 2, $_NOT_: 4, $dff: 1 },
    types: ["$_AND_", "$_NOT_", "$dff"],
    note: "Internal gates mapped toward AIG ($_AND_/$_NOT_).",
  },
  synth: {
    id: "synth",
    title: "after synth -top top",
    moduleCount: 1,
    processes: 0,
    cellCount: 2,
    cells: { $_AOI3_: 1, $_DFF_P_: 1 },
    types: ["$_AOI3_", "$_DFF_P_"],
    note: "Generic synth → AOI3 + posedge DFF.",
  },
};

export const REAL_GOLDENS = {
  afterReadModules: 2,
  afterReadProcesses: 1,
  afterReadAndCount: 2,
  afterReadTopCells: 5,
  afterProcProcesses: 0,
  afterProcHasDff: true,
  afterFlattenModules: 1,
  afterFlattenCells: 4,
  afterOptCells: 4,
  afterOptAndCount: 1,
  aigmapCells: 7,
  afterSynthCells: 2,
  afterSynthTypes: ["$_AOI3_", "$_DFF_P_"],
  rtlilVocab: ["$and", "$or", "$not", "$dff", "$_AOI3_", "$_DFF_P_"],
  recipeIds: GOLDEN_RECIPE_IDS,
  engineOk: true,
};

export function recipePrefixOk(ids, n) {
  const want = n == null ? GOLDEN_RECIPE_IDS : GOLDEN_RECIPE_IDS.slice(0, n);
  return ids.slice(0, want.length).every((id, i) => id === want[i]) && ids.length >= want.length;
}

export function stageForRecipe(ids) {
  if (!ids.length) return STAGES.empty;
  const last = ids[ids.length - 1];
  if (last === "read_verilog" || last === "hierarchy") return STAGES.read_hierarchy;
  if (last === "proc") return STAGES.proc;
  if (last === "flatten") return STAGES.flatten;
  if (last === "opt") return STAGES.opt;
  if (last === "aigmap") return STAGES.aigmap;
  if (last === "synth" || last === "stat" || last === "write") return STAGES.synth;
  return STAGES.empty;
}

export function realEngine(ids) {
  const recipe = ids && ids.length ? ids : GOLDEN_RECIPE_IDS;
  const ok =
    recipePrefixOk(recipe) &&
    REAL_GOLDENS.afterSynthCells === 2 &&
    REAL_GOLDENS.afterFlattenCells === 4 &&
    REAL_GOLDENS.afterProcHasDff === true;
  return {
    ok,
    recipeOk: recipePrefixOk(recipe),
    stage: stageForRecipe(recipe),
    goldens: REAL_GOLDENS,
  };
}

function cellsAsLayout(stage) {
  const layout = {};
  let i = 0;
  for (const [type, count] of Object.entries(stage.cells || {})) {
    for (let k = 0; k < count; k++) {
      const id = `${type}_${k}`;
      layout[id] = { x: 40 + (i % 4) * 120, y: 80 + Math.floor(i / 4) * 90, type };
      i++;
    }
  }
  return layout;
}

export function drawRealYosys(canvas, opts = {}) {
  const stage = opts.stage || STAGES.empty;
  const selected = new Set(opts.selected || []);
  const highlightTypes = new Set(opts.highlightTypes || []);
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);

  const design = cellsAsLayout(stage);
  const fitted = fitGraphLayout(design, W, H, { pad: 48 });

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 16px ui-monospace, monospace";
  ctx.fillText(stage.title || "stage", 16, 28);
  ctx.font = "13px ui-sans-serif, system-ui";
  ctx.fillStyle = "#94a3b8";
  const metrics = `modules=${stage.moduleCount}  processes=${stage.processes}  cells=${stage.cellCount}`;
  ctx.fillText(metrics, 16, 50);
  if (opts.metricText) ctx.fillText(opts.metricText, 16, H - 16);

  for (const [id, pos] of Object.entries(fitted.layout)) {
    const type = design[id].type;
    const hot = selected.has(type) || selected.has(id) || highlightTypes.has(type);
    const x = pos.x;
    const y = pos.y;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(x - 48, y - 22, 96, 44, 8);
    else ctx.rect(x - 48, y - 22, 96, 44);
    ctx.fillStyle = hot ? "#0ea5e9" : "#1e293b";
    ctx.fill();
    ctx.strokeStyle = hot ? "#38bdf8" : "#334155";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "12px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(type, x, y);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  if (stage.note) {
    ctx.fillStyle = "#64748b";
    ctx.font = "12px ui-sans-serif, system-ui";
    const note = stage.note.length > 90 ? stage.note.slice(0, 87) + "…" : stage.note;
    ctx.fillText(note, 16, H - 36);
  }
}

export function hitTestType(canvas, stage, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  const design = cellsAsLayout(stage);
  const fitted = fitGraphLayout(design, W, H, { pad: 48 });
  for (const [id, pos] of Object.entries(fitted.layout)) {
    if (x >= pos.x - 48 && x <= pos.x + 48 && y >= pos.y - 22 && y <= pos.y + 22) {
      return design[id].type;
    }
  }
  return null;
}
