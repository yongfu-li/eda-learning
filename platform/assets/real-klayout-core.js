/**
 * Real KLayout evidence core — mirrors courses/learn_klayout/common/real_solvers.py.
 */
import { drawKlayout, STARTER, GOLDENS, stageDrc } from "./klayout-core.js";

export const GOLDEN_RECIPE_IDS = [
  "stream_gds",
  "load_drc",
  "run_drc",
  "markers",
  "drc_done",
];

export const CMD_PALETTE = [
  { id: "stream_gds", label: "stream gds", hint: "Stream tiny_rect.gds" },
  { id: "load_drc", label: "load drc", hint: "Load DRC script" },
  { id: "run_drc", label: "run drc", hint: "Run width/spacing checks" },
  { id: "markers", label: "markers", hint: "Emit violation markers" },
  { id: "drc_done", label: "drc done", hint: "Finish DRC run" },
];

export const STAGES = {
  empty: {
    id: "empty",
    title: "empty",
    shapeCount: null,
    widthViolations: null,
    markerCount: null,
    note: "No layout loaded yet.",
  },
  gds_vocab: {
    id: "gds_vocab",
    title: "GDS vocabulary",
    layerCount: 2,
    shapeCount: 2,
    dbu: 0.001,
    widthViolations: null,
    markerCount: null,
    note: "poly=66, metal1=68; two shapes.",
  },
  stream_gds: {
    id: "stream_gds",
    title: "after stream gds",
    shapeCount: 2,
    streamOk: true,
    cell: "tiny_rect",
    widthViolations: null,
    markerCount: null,
    note: "tiny_rect — 2 shapes streamed.",
  },
  drc_script: {
    id: "drc_script",
    title: "after run drc",
    shapeCount: 2,
    widthViolations: 1,
    violationShape: "m0",
    markerCount: null,
    note: "One width violation on m0.",
  },
  markers: {
    id: "markers",
    title: "after markers",
    shapeCount: 2,
    widthViolations: 1,
    markerCount: 1,
    markerShape: "m0",
    note: "One DRC marker emitted for m0.",
  },
};

export const REAL_GOLDENS = {
  layerCount: 2,
  shapeCount: 2,
  streamOk: true,
  widthViolations: 1,
  markerCount: 1,
  cell: "tiny_rect",
  recipeIds: GOLDEN_RECIPE_IDS,
  engineOk: true,
};

export function recipePrefixOk(ids, n = null) {
  const want = n == null ? GOLDEN_RECIPE_IDS : GOLDEN_RECIPE_IDS.slice(0, n);
  return (ids || []).slice(0, want.length).join() === want.join();
}

export function stageForRecipe(ids = []) {
  if (!ids.length) return STAGES.empty;
  if (ids.includes("markers") || ids.includes("drc_done")) return STAGES.markers;
  if (ids.includes("run_drc")) return STAGES.drc_script;
  if (ids.includes("stream_gds") || ids.includes("load_drc")) return STAGES.stream_gds;
  return STAGES.empty;
}

export function realKlayoutEngine(ids = GOLDEN_RECIPE_IDS) {
  const stage = stageForRecipe(ids);
  const ok =
    recipePrefixOk(ids) &&
    stage.widthViolations === REAL_GOLDENS.widthViolations &&
    stage.markerCount === REAL_GOLDENS.markerCount &&
    REAL_GOLDENS.engineOk;
  return { ok, recipeOk: recipePrefixOk(ids), stage, goldens: REAL_GOLDENS };
}

export function drawRealKlayout(canvas, opts = {}) {
  const drc = stageDrc(STARTER);
  drawKlayout(canvas, {
    design: STARTER,
    highlight: opts.highlight || drc.highlight,
    selected: opts.selected || [],
    markers: drc.violations || [],
    stageLabel: opts.stageLabel || opts.stage?.title || "Real KLayout",
    metricText: opts.metricText || null,
  });
}
