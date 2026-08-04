/**
 * Part C — KLayout DRC algorithms (mirrors algo_solvers.py)
 */
import { drawKlayout, STARTER, GOLDENS as PARTA_GOLDENS } from "./klayout-core.js";

export const ALGO_STARTER = {
  cell: "tiny_rect",
  dbu: 0.001,
  layers: { poly: 66, metal1: 68 },
  shapes: [
    { id: "p0", layer: "poly", box: [0, 0, 100, 50] },
    { id: "m0", layer: "metal1", box: [0, 0, 200, 20] },
  ],
  rules: {
    poly: { min_width: 40 },
    metal1: { min_width: 40, min_spacing: 40 },
  },
};

export const ALGO_GOLDENS = {
  layerQueryCount: 2,
  widthViolations: 1,
  markerCount: 1,
  engineOk: true,
};

export const PARTC_REAL = {
  widthViolations: 1,
  markerCount: 1,
  layerCount: 2,
};

function width(shape) {
  const [x0, y0, x1, y1] = shape.box;
  return Math.min(Math.abs(x1 - x0), Math.abs(y1 - y0));
}

export function cloneAlgo(d = ALGO_STARTER) {
  return JSON.parse(JSON.stringify(d));
}

export function algoLayerQuery(d = ALGO_STARTER) {
  const byLayer = {};
  for (const s of d.shapes) {
    byLayer[s.layer] = byLayer[s.layer] || [];
    byLayer[s.layer].push(s.id);
  }
  const ok = Object.keys(d.layers).length === ALGO_GOLDENS.layerQueryCount;
  return { ok, layerQueryCount: Object.keys(d.layers).length, byLayer, highlight: Object.keys(d.layers), pass: "layer_query" };
}

export function algoWidthSpacing(d = ALGO_STARTER) {
  const violations = [];
  for (const s of d.shapes) {
    const lim = d.rules[s.layer]?.min_width;
    if (lim == null) continue;
    const w = width(s);
    if (w < lim) violations.push({ shape: s.id, layer: s.layer, width: w, limit: lim });
  }
  const ok = violations.length === ALGO_GOLDENS.widthViolations;
  return { ok, widthViolations: violations.length, violations, highlight: violations.map((v) => v.shape), pass: "width_spacing" };
}

export function algoMarkerEmit(d = ALGO_STARTER) {
  const ws = algoWidthSpacing(d);
  const markers = ws.violations.map((v) => ({ shape: v.shape, type: "width" }));
  const ok = markers.length === ALGO_GOLDENS.markerCount;
  return { ok, markerCount: markers.length, markers, highlight: markers.map((m) => m.shape), pass: "marker_emit" };
}

export function klayoutAlgoEngine(d = ALGO_STARTER) {
  const lq = algoLayerQuery(d);
  const ws = algoWidthSpacing(d);
  const me = algoMarkerEmit(d);
  const ok = lq.ok && ws.ok && me.ok && ALGO_GOLDENS.engineOk;
  return { ok, layerQueryCount: lq.layerQueryCount, widthViolations: ws.widthViolations, markerCount: me.markerCount, pass: "engine" };
}

export function partcBind(field) {
  const teach = klayoutAlgoEngine();
  const map = {
    width: teach.widthViolations === PARTC_REAL.widthViolations,
    markers: teach.markerCount === PARTC_REAL.markerCount,
    layers: teach.layerQueryCount === PARTC_REAL.layerCount,
    mismatch: teach.widthViolations === PARTC_REAL.widthViolations,
  };
  return { ok: map[field] ?? teach.ok, field, teach, real: PARTC_REAL };
}

export function drawAlgoKlayout(canvas, opts = {}) {
  const d = opts.design || ALGO_STARTER;
  const ws = algoWidthSpacing(d);
  drawKlayout(canvas, {
    design: d,
    highlight: opts.highlight || ws.highlight,
    selected: opts.selected || [],
    markers: ws.violations,
    stageLabel: opts.stageLabel || "Algo KLayout",
    metricText: opts.metricText || `violations=${ws.widthViolations}`,
  });
}

export { PARTA_GOLDENS as GOLDENS };
