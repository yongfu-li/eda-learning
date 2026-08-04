/**
 * Part D — Magic internals core (mirrors courses/learn_magic/common/internals_solvers.py)
 */
import { fitHiDpiCanvas, fitGraphLayout } from "./canvas-hires.js";

export const INTERNALS_GOLDENS = {
  pillars: 3,
  pillarsNames: ["Tile", "Plane", "CellDef"],
  drcStages: ["load_rules", "scan_region", "emit_marker"],
  drcBindsPartB: true,
  drcErrorCount: 1,
  cifwriteStages: ["flatten", "write_cif", "verify_layers"],
  gdsLayerCount: 6,
  contributeSteps: ["path", "tcl_cmd", "makefile", "rebuild", "smoke_help"],
  contributePath: "commands/cmd_drc.c",
  smokeCmd: "magic -help drc",
  engineOk: true,
};

export function tilePlaneModel() {
  const pillars = [...INTERNALS_GOLDENS.pillarsNames];
  return {
    ok: pillars.length === INTERNALS_GOLDENS.pillars,
    pillars,
    pillarCount: pillars.length,
    highlight: pillars,
    note: "Tile → Plane → CellDef (geometry, rules, cell metadata).",
    pass: "tile",
  };
}

export function readDrcCifwrite() {
  const drc = [...INTERNALS_GOLDENS.drcStages];
  const cif = [...INTERNALS_GOLDENS.cifwriteStages];
  return {
    ok:
      drc.join() === INTERNALS_GOLDENS.drcStages.join() &&
      INTERNALS_GOLDENS.drcBindsPartB &&
      INTERNALS_GOLDENS.drcErrorCount === 1,
    drcStages: drc,
    cifwriteStages: cif,
    highlight: [...drc, ...cif],
    upstreamPath: "drc/DRCcheck.c",
    bindsPartB: true,
    drcErrors: INTERNALS_GOLDENS.drcErrorCount,
    gdsLayers: INTERNALS_GOLDENS.gdsLayerCount,
    note: "DRC load→scan→emit; cifwrite flatten→write→verify.",
    pass: "drc_cif",
  };
}

export function contributeMagic() {
  const steps = [...INTERNALS_GOLDENS.contributeSteps];
  return {
    ok: steps.join() === INTERNALS_GOLDENS.contributeSteps.join(),
    steps,
    highlight: steps,
    path: INTERNALS_GOLDENS.contributePath,
    smoke: INTERNALS_GOLDENS.smokeCmd,
    note: "path + tcl_cmd + makefile + rebuild + magic -help.",
    pass: "contribute",
  };
}

export function partDEngine() {
  const a = tilePlaneModel();
  const b = readDrcCifwrite();
  const c = contributeMagic();
  const ok = a.ok && b.ok && c.ok;
  return { ok, pillars: a.pillarCount, drcLen: b.drcStages.length, contrib: c.steps.length };
}

export function drawMagicInternals(canvas, opts = {}) {
  const items = (opts.highlight || []).map((id) => ({ id, type: id }));
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || "Magic internals", 16, 28);
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

export function hitTestMagicInternals(canvas, highlight, clientX, clientY) {
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
