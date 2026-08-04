/**
 * Real OpenSTA evidence core — mirrors courses/learn_opensta/common/real_solvers.py.
 */
import { fitHiDpiCanvas, fitGraphLayout } from "./canvas-hires.js";

export const GOLDEN_RECIPE_IDS = [
  "read_liberty",
  "read_verilog",
  "link_design",
  "create_clock",
  "set_input_delay",
  "set_output_delay",
  "report_checks",
];

export const CMD_PALETTE = [
  { id: "read_liberty", label: "read_liberty", hint: "Load liberty" },
  { id: "read_verilog", label: "read_verilog", hint: "Load netlist" },
  { id: "link_design", label: "link_design", hint: "Bind cells" },
  { id: "create_clock", label: "create_clock -period 10", hint: "Virtual clk" },
  { id: "set_input_delay", label: "set_input_delay", hint: "Input external" },
  { id: "set_output_delay", label: "set_output_delay", hint: "Output external" },
  { id: "report_checks", label: "report_checks -path_delay max", hint: "Worst path" },
];

export const STAGES = {
  empty: {
    id: "empty",
    title: "empty",
    cellCount: 0,
    cells: [],
    clock: null,
    period: null,
    pathDelay: null,
    slack: null,
    endpoint: null,
    note: "No design loaded yet.",
  },
  read_link: {
    id: "read_link",
    title: "after read_liberty + read_verilog + link_design",
    cellCount: 3,
    cells: ["u1", "u2", "u3"],
    libCells: ["AND2", "BUF", "INV"],
    clock: null,
    period: null,
    pathDelay: null,
    slack: null,
    endpoint: null,
    note: "Linked tiny_combo — 3 liberty cells.",
  },
  sdc: {
    id: "sdc",
    title: "after create_clock + I/O delays",
    cellCount: 3,
    cells: ["u1", "u2", "u3"],
    clock: "clk",
    period: 10,
    pathDelay: null,
    slack: null,
    endpoint: null,
    note: "Virtual clock clk period=10; input/output delay 0.",
  },
  report_checks: {
    id: "report_checks",
    title: "after report_checks",
    cellCount: 3,
    cells: ["u1", "u2", "u3"],
    clock: "clk",
    period: 10,
    pathDelay: 2.0,
    slack: 8.0,
    endpoint: "y",
    startpoint: "b",
    note: "Max path b→y delay 2.0 slack 8.0 MET.",
  },
};

export const REAL_GOLDENS = {
  afterReadCells: 3,
  libertyCells: ["AND2", "BUF", "INV"],
  clockName: "clk",
  clockPeriod: 10,
  pathDelay: 2.0,
  slack: 8.0,
  endpoint: "y",
  recipeIds: GOLDEN_RECIPE_IDS,
  engineOk: true,
};

export function recipePrefixOk(ids, n = null) {
  const want = n == null ? GOLDEN_RECIPE_IDS : GOLDEN_RECIPE_IDS.slice(0, n);
  return (ids || []).slice(0, want.length).join() === want.join();
}

export function stageForRecipe(ids = []) {
  if (!ids.length) return STAGES.empty;
  if (ids.includes("report_checks")) return STAGES.report_checks;
  if (ids.includes("create_clock")) return STAGES.sdc;
  if (ids.includes("link_design") || ids.includes("read_verilog") || ids.includes("read_liberty")) {
    return STAGES.read_link;
  }
  return STAGES.empty;
}

export function realEngine(ids = GOLDEN_RECIPE_IDS) {
  const stage = stageForRecipe(ids);
  const ok =
    recipePrefixOk(ids) &&
    stage.cellCount === REAL_GOLDENS.afterReadCells &&
    stage.slack === REAL_GOLDENS.slack &&
    REAL_GOLDENS.engineOk;
  return { ok, recipeOk: recipePrefixOk(ids), stage, goldens: REAL_GOLDENS };
}

export function drawRealOpensta(canvas, opts = {}) {
  const stage = opts.stage || STAGES.empty;
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || stage.title || "OpenSTA evidence", 16, 28);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px ui-sans-serif, system-ui";
  const metric =
    opts.metricText ||
    `cells=${stage.cellCount ?? "—"} delay=${stage.pathDelay ?? "—"} slack=${stage.slack ?? "—"}`;
  ctx.fillText(metric, 16, 50);

  const items = (stage.cells || []).map((id) => ({ id, kind: "cell" }));
  if (stage.endpoint) items.push({ id: stage.endpoint, kind: "pin" });
  if (stage.clock) items.push({ id: stage.clock, kind: "clk" });

  const layout = {};
  items.forEach((it, i) => {
    layout[it.id] = { x: 80 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90, ...it };
  });
  const fitted = fitGraphLayout(layout, W, H, { pad: 48 });
  const selected = new Set(opts.selected || []);
  const highlight = new Set(opts.highlight || opts.highlightTypes || []);

  for (const [id, pos] of Object.entries(fitted.layout)) {
    const hot = selected.has(id) || highlight.has(id);
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(pos.x - 48, pos.y - 22, 96, 44, 8);
    else ctx.rect(pos.x - 48, pos.y - 22, 96, 44);
    ctx.fillStyle = hot ? "#0ea5e9" : "#1e293b";
    ctx.fill();
    ctx.strokeStyle = hot ? "#38bdf8" : "#475569";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "12px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(id, pos.x, pos.y);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  if (stage.note) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.fillText(stage.note, 16, H - 24);
  }
}

export function hitTestRealOpensta(canvas, stage, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const items = [...(stage.cells || [])];
  if (stage.endpoint) items.push(stage.endpoint);
  if (stage.clock) items.push(stage.clock);
  const layout = {};
  items.forEach((id, i) => {
    layout[id] = { x: 80 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90 };
  });
  const fitted = fitGraphLayout(layout, canvas.clientWidth, canvas.clientHeight, { pad: 48 });
  for (const [id, pos] of Object.entries(fitted.layout)) {
    if (x >= pos.x - 48 && x <= pos.x + 48 && y >= pos.y - 22 && y <= pos.y + 22) return id;
  }
  return null;
}
