/**
 * Part D — Yosys internals core (mirrors courses/learn_yosys/common/internals_solvers.py)
 */
import { fitHiDpiCanvas, fitGraphLayout } from "./canvas-hires.js";

export const INTERNALS_GOLDENS = {
  pillars: 5,
  pillarsNames: ["Design", "Module", "Wire", "Cell", "SigSpec"],
  passRecipe: ["subclass_Pass", "REGISTER_PASS", "execute", "selection"],
  optCleanStages: ["mark_used", "rm_cells", "rm_wires"],
  optCleanNeedsProc: true,
  contributeSteps: ["path", "REGISTER_PASS", "makefile", "rebuild", "smoke_help"],
  contributePath: "passes/demo/hello_pass.cc",
  smokeCmd: "yosys -h hello_pass",
  engineOk: true,
};

export function rtlilCppModel() {
  const pillars = [...INTERNALS_GOLDENS.pillarsNames];
  return {
    ok: pillars.length === INTERNALS_GOLDENS.pillars,
    pillars,
    pillarCount: pillars.length,
    highlight: pillars,
    note: "kernel/rtlil.h — Design → Module → Wire/Cell; ports are SigSpec.",
    pass: "rtlil",
  };
}

export function passRegistration() {
  const recipe = [...INTERNALS_GOLDENS.passRecipe];
  return {
    ok: recipe.join() === INTERNALS_GOLDENS.passRecipe.join(),
    recipe,
    highlight: recipe,
    note: "REGISTER_PASS installs execute(args, Design*).",
    pass: "pass",
  };
}

export function readOptClean() {
  const stages = [...INTERNALS_GOLDENS.optCleanStages];
  return {
    ok: stages.join() === INTERNALS_GOLDENS.optCleanStages.join(),
    stages,
    highlight: stages,
    needsEmptyProcesses: true,
    upstreamPath: "passes/opt/opt_clean.cc",
    note: "mark_used → rm_cells → rm_wires.",
    pass: "opt_clean",
  };
}

export function contributePass() {
  const steps = [...INTERNALS_GOLDENS.contributeSteps];
  return {
    ok: steps.join() === INTERNALS_GOLDENS.contributeSteps.join(),
    steps,
    highlight: steps,
    path: INTERNALS_GOLDENS.contributePath,
    smoke: INTERNALS_GOLDENS.smokeCmd,
    note: "path + REGISTER_PASS + Makefile + rebuild + yosys -h.",
    pass: "contribute",
  };
}

export function partDEngine() {
  const a = rtlilCppModel();
  const b = passRegistration();
  const c = readOptClean();
  const d = contributePass();
  const ok = a.ok && b.ok && c.ok && d.ok;
  return { ok, rtlil: a.pillarCount, passLen: b.recipe.length, clean: c.stages.length, contrib: d.steps.length };
}

export function drawInternals(canvas, opts = {}) {
  const items = (opts.highlight || []).map((id) => ({ id, type: id }));
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || "Yosys internals", 16, 28);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.fillText(opts.metricText || "", 16, 50);

  const layout = {};
  items.forEach((it, i) => {
    layout[it.id] = { x: 60 + (i % 3) * 140, y: 110 + Math.floor(i / 3) * 90, ...it };
  });
  const fitted = fitGraphLayout(layout, W, H, { pad: 48 });
  const selected = new Set(opts.selected || []);
  for (const [id, pos] of Object.entries(fitted.layout)) {
    const hot = selected.has(id);
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(pos.x - 55, pos.y - 22, 110, 44, 8);
    else ctx.rect(pos.x - 55, pos.y - 22, 110, 44);
    ctx.fillStyle = hot ? "#0ea5e9" : "#1e293b";
    ctx.fill();
    ctx.strokeStyle = hot ? "#38bdf8" : "#475569";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "11px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(id, pos.x, pos.y);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

export function hitTestInternals(canvas, highlight, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const layout = {};
  (highlight || []).forEach((id, i) => {
    layout[id] = { x: 60 + (i % 3) * 140, y: 110 + Math.floor(i / 3) * 90 };
  });
  const fitted = fitGraphLayout(layout, canvas.clientWidth, canvas.clientHeight, { pad: 48 });
  for (const [id, pos] of Object.entries(fitted.layout)) {
    if (x >= pos.x - 55 && x <= pos.x + 55 && y >= pos.y - 22 && y <= pos.y + 22) return id;
  }
  return null;
}
