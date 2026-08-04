/**
 * Real Magic evidence core — mirrors courses/learn_magic/common/real_solvers.py.
 */
import { drawMagic, STARTER, stageDrc, hitShape } from "./magic-core.js";
import { fitHiDpiCanvas } from "./canvas-hires.js";

export const GOLDEN_RECIPE_IDS = [
  "tech_load",
  "load_cell",
  "paint_verify",
  "save",
  "drc_check",
  "gds_write",
];

export const CMD_PALETTE = [
  { id: "tech_load", label: "tech load", hint: "Load tech file" },
  { id: "load_cell", label: "load cell", hint: "Open tiny_inv" },
  { id: "paint_verify", label: "paint verify", hint: "Count rects/contacts" },
  { id: "save", label: "save", hint: "Write .mag" },
  { id: "drc_check", label: "drc check", hint: "Width/space rules" },
  { id: "gds_write", label: "gds write", hint: "Stream GDS" },
];

export const STAGES = {
  empty: {
    id: "empty",
    title: "empty",
    rectCount: 0,
    contactCount: 0,
    drcErrors: null,
    gdsLayers: null,
    cell: null,
    note: "No layout loaded yet.",
  },
  tech_vocab: {
    id: "tech_vocab",
    title: "after tech load",
    layerCount: 6,
    layers: ["ndiff", "pdiff", "poly", "metal1", "nwell", "contact"],
    rectCount: null,
    contactCount: null,
    drcErrors: null,
    gdsLayers: null,
    cell: null,
    note: "Tech vocabulary — six teaching layers.",
  },
  paint_save: {
    id: "paint_save",
    title: "after paint verify + save",
    rectCount: 6,
    contactCount: 1,
    cell: "tiny_inv",
    drcErrors: null,
    gdsLayers: null,
    note: "tiny_inv saved — 6 rects, 1 contact (ca).",
  },
  drc: {
    id: "drc",
    title: "after drc check",
    rectCount: 6,
    contactCount: 1,
    drcErrors: 1,
    thinShape: "thin",
    layer: "metal1",
    gdsLayers: null,
    cell: "tiny_inv",
    note: "DRC width error on thin metal1 (width=1).",
  },
  gds: {
    id: "gds",
    title: "after gds write",
    rectCount: 6,
    contactCount: 1,
    drcErrors: 1,
    gdsLayers: 6,
    metal1Gds: 49,
    cell: "tiny_inv",
    note: "GDS map — 6 layers; metal1→49.",
  },
};

export const REAL_GOLDENS = {
  rectCount: 6,
  contactCount: 1,
  drcErrorCount: 1,
  gdsLayerCount: 6,
  techLayers: STAGES.tech_vocab.layers,
  cell: "tiny_inv",
  recipeIds: GOLDEN_RECIPE_IDS,
  engineOk: true,
};

export function recipePrefixOk(ids, n = null) {
  const want = n == null ? GOLDEN_RECIPE_IDS : GOLDEN_RECIPE_IDS.slice(0, n);
  return (ids || []).slice(0, want.length).join() === want.join();
}

export function stageForRecipe(ids = []) {
  if (!ids.length) return STAGES.empty;
  if (ids.includes("gds_write")) return STAGES.gds;
  if (ids.includes("drc_check")) return STAGES.drc;
  if (ids.includes("save") || ids.includes("paint_verify")) return STAGES.paint_save;
  if (ids.includes("load_cell") || ids.includes("tech_load")) return STAGES.tech_vocab;
  return STAGES.empty;
}

export function realMagicEngine(ids = GOLDEN_RECIPE_IDS) {
  const stage = stageForRecipe(ids);
  const ok =
    recipePrefixOk(ids) &&
    stage.rectCount === REAL_GOLDENS.rectCount &&
    stage.contactCount === REAL_GOLDENS.contactCount &&
    stage.drcErrors === REAL_GOLDENS.drcErrorCount &&
    stage.gdsLayers === REAL_GOLDENS.gdsLayerCount &&
    REAL_GOLDENS.engineOk;
  return { ok, recipeOk: recipePrefixOk(ids), stage, goldens: REAL_GOLDENS };
}

export function drawRealMagic(canvas, opts = {}) {
  const stage = opts.stage || STAGES.empty;
  if (stage.rectCount != null && stage.id !== "empty") {
    const drc = stageDrc(STARTER);
    drawMagic(canvas, {
      cell: STARTER,
      highlight: opts.highlight || (stage.thinShape ? [stage.thinShape] : drc.highlight),
      selected: opts.selected?.[0] || null,
      markers: stage.drcErrors ? drc.errors.map((e) => ({ ...e, shape: e.shape })) : [],
      metricText:
        opts.metricText ||
        `rects=${stage.rectCount ?? "—"} contacts=${stage.contactCount ?? "—"} drc=${stage.drcErrors ?? "—"} gds=${stage.gdsLayers ?? "—"}`,
    });
    return;
  }
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || stage.title || "Magic evidence", 16, 28);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.fillText(stage.note || "", 16, 52);
}

export function hitTestRealMagic(canvas, stage, clientX, clientY) {
  if (stage?.rectCount != null && stage.id !== "empty") {
    return hitShape(STARTER, canvas, clientX, clientY);
  }
  return null;
}
