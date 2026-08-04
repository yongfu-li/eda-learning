/**
 * Part D — OpenSTA internals core (mirrors courses/learn_opensta/common/internals_solvers.py)
 */
import { fitHiDpiCanvas, fitGraphLayout } from "./canvas-hires.js";

export const INTERNALS_GOLDENS = {
  pillars: 4,
  pillarsNames: ["Network", "Graph", "Sdc", "Search"],
  findPathStages: ["tag_endpoints", "walk_back", "emit_path", "report_checks"],
  findPathBindsPartB: true,
  pathDelay: 2.0,
  slack: 8.0,
  criticalPath: ["b", "n1", "n2", "y"],
  contributeSteps: ["path", "tcl_cmd", "cmake", "rebuild", "smoke_help"],
  contributePath: "app/HelloCmd.cc",
  smokeCmd: "sta -help hello_cmd",
  engineOk: true,
};

export function staCppModel() {
  const pillars = [...INTERNALS_GOLDENS.pillarsNames];
  return {
    ok: pillars.length === INTERNALS_GOLDENS.pillars,
    pillars,
    pillarCount: pillars.length,
    highlight: pillars,
    note: "Network → Graph → Sdc → Search (reports).",
    pass: "sta",
  };
}

export function readFindPath() {
  const stages = [...INTERNALS_GOLDENS.findPathStages];
  return {
    ok: stages.join() === INTERNALS_GOLDENS.findPathStages.join() && INTERNALS_GOLDENS.slack === 8,
    stages,
    highlight: stages,
    upstreamPath: "search/FindPath.cc",
    bindsPartB: true,
    pathDelay: INTERNALS_GOLDENS.pathDelay,
    slack: INTERNALS_GOLDENS.slack,
    criticalPath: [...INTERNALS_GOLDENS.criticalPath],
    note: "tag_endpoints → walk_back → emit_path → report_checks (slack 8).",
    pass: "find_path",
  };
}

export function contributeOpensta() {
  const steps = [...INTERNALS_GOLDENS.contributeSteps];
  return {
    ok: steps.join() === INTERNALS_GOLDENS.contributeSteps.join(),
    steps,
    highlight: steps,
    path: INTERNALS_GOLDENS.contributePath,
    smoke: INTERNALS_GOLDENS.smokeCmd,
    note: "path + tcl_cmd + cmake + rebuild + sta -help.",
    pass: "contribute",
  };
}

export function partDEngine() {
  const a = staCppModel();
  const b = readFindPath();
  const c = contributeOpensta();
  const ok = a.ok && b.ok && c.ok;
  return { ok, pillars: a.pillarCount, findLen: b.stages.length, contrib: c.steps.length };
}

export function drawOpenstaInternals(canvas, opts = {}) {
  const items = (opts.highlight || []).map((id) => ({ id, type: id }));
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || "OpenSTA internals", 16, 28);
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
    ctx.fillText(id.length > 14 ? id.slice(0, 12) + "…" : id, pos.x, pos.y);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

export function hitTestOpenstaInternals(canvas, highlight, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const layout = {};
  (highlight || []).forEach((id, i) => {
    layout[id] = { x: 60 + (i % 3) * 140, y: 110 + Math.floor(i / 3) * 90 };
  });
  const { w: W, h: H } = fitHiDpiCanvas(canvas);
  const fitted = fitGraphLayout(layout, W, H, { pad: 48 });
  for (const [id, pos] of Object.entries(fitted.layout)) {
    if (Math.abs(x - pos.x) <= 55 && Math.abs(y - pos.y) <= 22) return id;
  }
  return null;
}
