/**
 * Part A — KLayout viewer/stream/DRC map (mirrors courses/learn_klayout/common/solvers.py)
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  layerCount: 2,
  shapeCount: 2,
  instanceCount: 0,
  streamOk: true,
  widthViolations: 1,
  markerCount: 1,
  engineOk: true,
};

export const STARTER = {
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
  hierarchy: { top: "tiny_rect", instances: 0 },
};

const LAYER_COLOR = {
  poly: "#e76f51",
  metal1: "#457b9d",
};

function width(shape) {
  const [x0, y0, x1, y1] = shape.box;
  return Math.min(Math.abs(x1 - x0), Math.abs(y1 - y0));
}

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

function widthViolations(d) {
  const out = [];
  for (const s of d.shapes) {
    const lim = d.rules[s.layer]?.min_width;
    if (lim == null) continue;
    const w = width(s);
    if (w < lim) out.push({ shape: s.id, layer: s.layer, width: w, limit: lim });
  }
  return out;
}

export function stageLayers(d = STARTER) {
  const ok = Object.keys(d.layers).length === GOLDENS.layerCount;
  return {
    ok,
    layerCount: Object.keys(d.layers).length,
    layers: d.layers,
    highlight: Object.keys(d.layers),
    note: "KLayout layer view maps names to GDS numbers.",
    pass: "layers",
  };
}

export function stageHierarchy(d = STARTER) {
  const ok = d.hierarchy.top === d.cell && d.hierarchy.instances === GOLDENS.instanceCount;
  return {
    ok,
    top: d.hierarchy.top,
    instances: d.hierarchy.instances,
    highlight: [d.hierarchy.top],
    note: "Top cell tiny_rect with zero instances.",
    pass: "hierarchy",
  };
}

export function stageStream(d = STARTER) {
  const ok = GOLDENS.streamOk && d.shapes.length === GOLDENS.shapeCount;
  return {
    ok,
    shapeCount: d.shapes.length,
    streamOk: GOLDENS.streamOk,
    highlight: d.shapes.map((s) => s.id),
    note: "Stream GDS writes shapes with layer map.",
    pass: "stream",
  };
}

export function stageDrc(d = STARTER) {
  const vios = widthViolations(d);
  const ok = vios.length === GOLDENS.widthViolations;
  return {
    ok,
    widthViolations: vios.length,
    violations: vios,
    highlight: vios.map((v) => v.shape),
    markers: vios,
    note: "DRC script finds m0 width 20 < 40.",
    pass: "drc",
  };
}

export function stageMarkers(d = STARTER) {
  const drc = stageDrc(d);
  const markers = drc.violations.map((v) => ({ shape: v.shape, type: "width", layer: v.layer }));
  const ok = markers.length === GOLDENS.markerCount;
  return {
    ok,
    markerCount: markers.length,
    markers,
    highlight: markers.map((m) => m.shape),
    note: "One DRC marker on m0.",
    pass: "markers",
  };
}

export function klayoutEngine(d = STARTER) {
  const stages = [stageLayers(d), stageHierarchy(d), stageStream(d), stageDrc(d), stageMarkers(d)];
  const ok = stages.every((s) => s.ok) && GOLDENS.engineOk;
  return {
    ok,
    layerCount: GOLDENS.layerCount,
    widthViolations: GOLDENS.widthViolations,
    markerCount: GOLDENS.markerCount,
    pass: "engine",
  };
}

function worldToScreen(chip, canvas) {
  const pad = 28;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const sx = (w - 2 * pad) / (chip.x1 - chip.x0);
  const sy = (h - 2 * pad) / (chip.y1 - chip.y0);
  const s = Math.min(sx, sy);
  const ox = pad + ((w - 2 * pad) - s * (chip.x1 - chip.x0)) / 2;
  const oy = pad + ((h - 2 * pad) - s * (chip.y1 - chip.y0)) / 2;
  return {
    map(x, y) {
      return { x: ox + (x - chip.x0) * s, y: oy + (chip.y1 - y) * s };
    },
  };
}

export function drawKlayout(canvas, opts = {}) {
  const d = opts.design || STARTER;
  const chip = { x0: 0, y0: 0, x1: 220, y1: 60 };
  const selected = new Set(opts.selected || []);
  const highlight = new Set(opts.highlight || []);
  const markers = opts.markers || [];
  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f7f5f0";
  ctx.fillRect(0, 0, W, H);
  const t = worldToScreen(chip, canvas);
  ctx.strokeStyle = "#c9c3b8";
  const c0 = t.map(chip.x0, chip.y0);
  const c1 = t.map(chip.x1, chip.y1);
  ctx.strokeRect(c0.x, c1.y, c1.x - c0.x, c0.y - c1.y);

  for (const s of d.shapes) {
    const [x0, y0, x1, y1] = s.box;
    const p0 = t.map(x0, y0);
    const p1 = t.map(x1, y1);
    const x = Math.min(p0.x, p1.x);
    const y = Math.min(p0.y, p1.y);
    const w = Math.abs(p1.x - p0.x);
    const h = Math.abs(p0.y - p1.y);
    const col = LAYER_COLOR[s.layer] || "#555";
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = col;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
    ctx.lineWidth = selected.has(s.id) || highlight.has(s.id) ? 3 : 1.5;
    ctx.strokeStyle = selected.has(s.id) ? "#111" : col;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#222";
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillText(`${s.id}(${s.layer})`, x + 2, y + 12);
  }

  for (const m of markers) {
    const s = d.shapes.find((x) => x.id === m.shape);
    if (!s) continue;
    const [x0, y0, x1, y1] = s.box;
    const p = t.map((x0 + x1) / 2, (y0 + y1) / 2);
    ctx.fillStyle = "#bc4749";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.fillStyle = "#333";
  ctx.font = "13px system-ui, sans-serif";
  ctx.fillText(opts.stageLabel || "KLayout", 12, 18);
  if (opts.metricText) ctx.fillText(opts.metricText, 12, 36);
}

export function hitTestKlayout(canvas, design, clientX, clientY) {
  const chip = { x0: 0, y0: 0, x1: 220, y1: 60 };
  const rect = canvas.getBoundingClientRect();
  const mx = clientX - rect.left;
  const my = clientY - rect.top;
  const t = worldToScreen(chip, canvas);
  for (let i = design.shapes.length - 1; i >= 0; i--) {
    const s = design.shapes[i];
    const [x0, y0, x1, y1] = s.box;
    const p0 = t.map(x0, y0);
    const p1 = t.map(x1, y1);
    const x0s = Math.min(p0.x, p1.x);
    const x1s = Math.max(p0.x, p1.x);
    const y0s = Math.min(p0.y, p1.y);
    const y1s = Math.max(p0.y, p1.y);
    if (mx >= x0s && mx <= x1s && my >= y0s && my <= y1s) return s.id;
  }
  return null;
}
