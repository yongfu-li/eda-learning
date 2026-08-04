/**
 * Part D — Netgen internals core (mirrors courses/learn_netgen/common/internals_solvers.py)
 */
import { fitHiDpiCanvas, fitGraphLayout } from "./canvas-hires.js";

export const INTERNALS_GOLDENS = {
  pillars: 3,
  pillarsNames: ["Obj", "Netlist", "Element"],
  compareStages: ["read_sch", "read_lay", "hash_devices", "match_nets", "emit_report"],
  compareBindsPartB: true,
  matchedDevices: 2,
  matchedNets: 4,
  mismatchCount: 0,
  contributeSteps: ["path", "tcl_cmd", "makefile", "rebuild", "smoke_help"],
  contributePath: "tclcmd/cmd_lvs.c",
  smokeCmd: "netgen help lvs",
  engineOk: true,
};

export function netcompModel() {
  const pillars = [...INTERNALS_GOLDENS.pillarsNames];
  return {
    ok: pillars.length === INTERNALS_GOLDENS.pillars,
    pillars,
    pillarCount: pillars.length,
    highlight: pillars,
    note: "Obj → Netlist → Element (Tcl values, SPICE graph, device pins).",
    pass: "netcomp",
  };
}

export function readCompareC() {
  const stages = [...INTERNALS_GOLDENS.compareStages];
  return {
    ok:
      stages.join() === INTERNALS_GOLDENS.compareStages.join() &&
      INTERNALS_GOLDENS.compareBindsPartB &&
      INTERNALS_GOLDENS.matchedDevices === 2 &&
      INTERNALS_GOLDENS.mismatchCount === 0,
    compareStages: stages,
    highlight: [...stages],
    upstreamPath: "netcomp/compare.c",
    bindsPartB: true,
    matchedDevices: INTERNALS_GOLDENS.matchedDevices,
    matchedNets: INTERNALS_GOLDENS.matchedNets,
    mismatchCount: INTERNALS_GOLDENS.mismatchCount,
    note: "read→hash→match→emit_report.",
    pass: "read_compare_c",
  };
}

export function contributeNetgen() {
  const steps = [...INTERNALS_GOLDENS.contributeSteps];
  return {
    ok: steps.join() === INTERNALS_GOLDENS.contributeSteps.join(),
    steps,
    highlight: steps,
    path: INTERNALS_GOLDENS.contributePath,
    smoke: INTERNALS_GOLDENS.smokeCmd,
    note: "path + tcl_cmd + makefile + rebuild + netgen help.",
    pass: "contribute",
  };
}

export function partDEngine() {
  const a = netcompModel();
  const b = readCompareC();
  const c = contributeNetgen();
  const ok = a.ok && b.ok && c.ok;
  return { ok, pillars: a.pillarCount, compareLen: b.compareStages.length, contrib: c.steps.length };
}

export function drawNetgenInternals(canvas, opts = {}) {
  const items = (opts.highlight || []).map((id) => ({ id, type: id }));
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || "Netgen internals", 16, 28);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px system-ui";
  ctx.fillText(opts.metricText || "", 16, 50);
  const layout = {};
  items.forEach((it, i) => {
    layout[it.id] = { x: 70 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90, ...it };
  });
  const fitted = fitGraphLayout(layout, W, H, { pad: 48 });
  const selected = new Set(opts.selected || []);
  for (const [id, pos] of Object.entries(fitted.layout)) {
    const hot = selected.has(id);
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(pos.x - 50, pos.y - 22, 100, 44, 8);
    else ctx.rect(pos.x - 50, pos.y - 22, 100, 44);
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

export function hitTestNetgenInternals(canvas, highlight, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const layout = {};
  (highlight || []).forEach((id, i) => {
    layout[id] = { x: 70 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90 };
  });
  const { w: W, h: H } = fitHiDpiCanvas(canvas);
  const fitted = fitGraphLayout(layout, W, H, { pad: 48 });
  for (const [id, pos] of Object.entries(fitted.layout)) {
    if (Math.abs(x - pos.x) <= 50 && Math.abs(y - pos.y) <= 22) return id;
  }
  return null;
}
