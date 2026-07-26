/**
 * Tiny pattern matching — single/multi-layer DRC-style patterns for learn_pattern_matching.
 * Shapes A,B,D (M1), C (M2), V (VIA). Engine markers: width D, space A–B, enclosure V vs M2 → 3.
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const CHIP = { x0: 0, y0: 0, x1: 24, y1: 16 };

export const RULES = {
  min_width: { M1: 3, M2: 3, VIA: 2 },
  min_space: { M1: 2, M2: 2 },
  min_enclosure: { VIA_in_M1: 1, VIA_in_M2: 1 },
};

export const STARTER = [
  { id: "A", layer: "M1", x0: 2, y0: 2, x1: 10, y1: 6 },
  { id: "B", layer: "M1", x0: 11, y0: 2, x1: 15, y1: 5 },
  { id: "D", layer: "M1", x0: 18, y0: 2, x1: 19, y1: 8 },
  { id: "C", layer: "M2", x0: 4, y0: 8, x1: 14, y1: 12 },
  { id: "V", layer: "VIA", x0: 5, y0: 3, x1: 7, y1: 5 },
];

export const GOLDENS = {
  shapeCount: 5,
  layerCount: 3,
  edgeCount: 20,
  m1ShapeCount: 3,
  widthMarkers: 1,
  spaceMarkers: 1,
  enclosureMarkers: 1,
  scanEventsM1: 6,
  booleanAndHits: 1,
  matchEngineMarkers: 3,
};

const LAYER_COLOR = {
  M1: "#2a6f97",
  M2: "#bc4749",
  VIA: "#6a994e",
};

export function cloneShapes(shapes = STARTER) {
  return shapes.map((s) => ({ ...s }));
}

export function width(s) {
  return s.x1 - s.x0;
}
export function height(s) {
  return s.y1 - s.y0;
}

export function onLayer(shapes, layer) {
  return shapes.filter((s) => s.layer === layer);
}

export function geometryStats(shapes = STARTER) {
  const layers = [...new Set(shapes.map((s) => s.layer))].sort();
  return {
    shapeCount: shapes.length,
    layerCount: layers.length,
    layers,
    edgeCount: shapes.length * 4,
    m1ShapeCount: onLayer(shapes, "M1").length,
  };
}

function projectsOverlapX(a, b) {
  return a.y0 < b.y1 && b.y0 < a.y1;
}

function horizGap(a, b) {
  if (!projectsOverlapX(a, b)) return null;
  if (a.x1 <= b.x0) return b.x0 - a.x1;
  if (b.x1 <= a.x0) return a.x0 - b.x1;
  return 0;
}

function contains(outer, inner) {
  return outer.x0 <= inner.x0 && outer.y0 <= inner.y0 && outer.x1 >= inner.x1 && outer.y1 >= inner.y1;
}

function enclosureMargin(outer, inner) {
  if (!contains(outer, inner)) return null;
  return {
    left: inner.x0 - outer.x0,
    right: outer.x1 - inner.x1,
    bottom: inner.y0 - outer.y0,
    top: outer.y1 - inner.y1,
  };
}

function rectsOverlap(a, b) {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

export function matchWidth(shapes = STARTER, layer = null) {
  const markers = [];
  for (const s of shapes) {
    if (layer && s.layer !== layer) continue;
    const mw = RULES.min_width[s.layer];
    if (mw == null) continue;
    const thin = Math.min(width(s), height(s));
    if (thin < mw) {
      markers.push({ type: "width", layer: s.layer, shapes: [s.id], value: thin, limit: mw });
    }
  }
  return markers;
}

export function matchSpace(shapes = STARTER, layer = "M1") {
  const ms = RULES.min_space[layer];
  if (ms == null) return [];
  const layerShapes = onLayer(shapes, layer);
  const markers = [];
  for (let i = 0; i < layerShapes.length; i++) {
    for (let j = i + 1; j < layerShapes.length; j++) {
      const a = layerShapes[i];
      const b = layerShapes[j];
      const gap = horizGap(a, b);
      if (gap == null || gap >= ms) continue;
      const left = a.x0 <= b.x0 ? a : b;
      const right = a.x0 <= b.x0 ? b : a;
      markers.push({ type: "space", layer, shapes: [left.id, right.id], value: gap, limit: ms });
    }
  }
  return markers;
}

export function matchEnclosure(shapes = STARTER, innerLayer = "VIA", outerLayer = "M1") {
  const key = `VIA_in_${outerLayer}`;
  const limit = RULES.min_enclosure[key] ?? 1;
  const inners = onLayer(shapes, innerLayer);
  const outers = onLayer(shapes, outerLayer);
  const markers = [];
  for (const inn of inners) {
    let ok = false;
    let detail = null;
    for (const out of outers) {
      const m = enclosureMargin(out, inn);
      if (!m) continue;
      if (Object.values(m).every((v) => v >= limit)) {
        ok = true;
        break;
      }
      detail = { outer: out.id, margins: m, ok: false };
    }
    if (!ok) {
      markers.push({
        type: "enclosure",
        inner: inn.id,
        outer_layer: outerLayer,
        inner_layer: innerLayer,
        limit,
        detail,
      });
    }
  }
  return markers;
}

export function scanlineEvents(shapes = STARTER, layer = "M1") {
  const events = [];
  for (const s of onLayer(shapes, layer)) {
    events.push({ kind: "enter", x: s.x0, shape: s.id, y0: s.y0, y1: s.y1 });
    events.push({ kind: "leave", x: s.x1, shape: s.id, y0: s.y0, y1: s.y1 });
  }
  events.sort((a, b) => a.x - b.x || (a.kind === "enter" ? 0 : 1) - (b.kind === "enter" ? 0 : 1) || a.shape.localeCompare(b.shape));
  return events;
}

export function emitMarkers(shapes = STARTER) {
  return [...matchWidth(shapes), ...matchSpace(shapes, "M1"), ...matchSpace(shapes, "M2")];
}

export function multiLayerViaCheck(shapes = STARTER) {
  const m1 = matchEnclosure(shapes, "VIA", "M1");
  const m2 = matchEnclosure(shapes, "VIA", "M2");
  return {
    m1_ok: m1.length === 0,
    m2_ok: m2.length === 0,
    markers: [...m1, ...m2],
    enclosure_markers: m1.length + m2.length,
  };
}

export function multiLayerInteractions(shapes = STARTER) {
  const pairs = [];
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const a = shapes[i];
      const b = shapes[j];
      if (a.layer === b.layer) continue;
      if (rectsOverlap(a, b)) pairs.push({ shapes: [a.id, b.id], layers: [a.layer, b.layer] });
    }
  }
  return pairs;
}

export function layeredBoolean(shapes = STARTER, mode = "and_not") {
  const vias = onLayer(shapes, "VIA");
  const m1s = onLayer(shapes, "M1");
  const m2s = onLayer(shapes, "M2");
  const covered = (v, outs) => outs.some((o) => enclosureMargin(o, v) != null);
  const hits = [];
  for (const v of vias) {
    const c1 = covered(v, m1s);
    const c2 = covered(v, m2s);
    let ok = false;
    if (mode === "and_not") ok = c1 && !c2;
    else if (mode === "and") ok = c1 && c2;
    else if (mode === "or") ok = c1 || c2;
    if (ok) hits.push({ type: "boolean", mode, shape: v.id, m1: c1, m2: c2 });
  }
  return hits;
}

export function matchEngine(shapes = STARTER) {
  const widthM = matchWidth(shapes);
  const spaceM = [...matchSpace(shapes, "M1"), ...matchSpace(shapes, "M2")];
  const enc = multiLayerViaCheck(shapes);
  const markers = [...widthM, ...spaceM, ...enc.markers];
  return {
    markers,
    count: markers.length,
    width: widthM.length,
    space: spaceM.length,
    enclosure: enc.enclosure_markers,
    interactions: multiLayerInteractions(shapes),
    boolean_and_not: layeredBoolean(shapes, "and_not"),
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
    scale: s,
  };
}

export function drawPatternMatching(canvas, opts = {}) {
  const shapes = opts.shapes || STARTER;
  const chip = opts.chip || CHIP;
  const selected = opts.selected || null;
  const highlight = new Set(opts.highlight || []);
  const markers = opts.markers || [];
  const metricText = opts.metricText || null;
  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f7f5f0";
  ctx.fillRect(0, 0, W, H);
  const t = worldToScreen(chip, canvas);
  const c0 = t.map(chip.x0, chip.y0);
  const c1 = t.map(chip.x1, chip.y1);
  ctx.strokeStyle = "#c9c3b8";
  ctx.strokeRect(c0.x, c1.y, c1.x - c0.x, c0.y - c1.y);

  for (const s of shapes) {
    const p0 = t.map(s.x0, s.y0);
    const p1 = t.map(s.x1, s.y1);
    const x = p0.x;
    const y = p1.y;
    const w = p1.x - p0.x;
    const h = p0.y - p1.y;
    const col = LAYER_COLOR[s.layer] || "#555";
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = col;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
    ctx.lineWidth = selected === s.id || highlight.has(s.id) ? 3 : 1.5;
    ctx.strokeStyle = selected === s.id ? "#111" : col;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#222";
    ctx.font = "12px ui-monospace, monospace";
    ctx.fillText(`${s.id}/${s.layer}`, x + 4, y + 14);
  }

  // Marker ticks
  for (const m of markers) {
    const ids = m.shapes || (m.inner ? [m.inner] : m.shape ? [m.shape] : []);
    for (const id of ids) {
      const s = shapes.find((x) => x.id === id);
      if (!s) continue;
      const p = t.map((s.x0 + s.x1) / 2, (s.y0 + s.y1) / 2);
      ctx.fillStyle = m.type === "width" ? "#bc4749" : m.type === "space" ? "#e09f3e" : "#9b2226";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (metricText) {
    ctx.fillStyle = "#333";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(metricText, 12, 18);
  }
}

export function hitShape(shapes, canvas, clientX, clientY, chip = CHIP) {
  const rect = canvas.getBoundingClientRect();
  const mx = clientX - rect.left;
  const my = clientY - rect.top;
  const t = worldToScreen(chip, canvas);
  for (let i = shapes.length - 1; i >= 0; i--) {
    const s = shapes[i];
    const p0 = t.map(s.x0, s.y0);
    const p1 = t.map(s.x1, s.y1);
    const x0 = Math.min(p0.x, p1.x);
    const x1 = Math.max(p0.x, p1.x);
    const y0 = Math.min(p0.y, p1.y);
    const y1 = Math.max(p0.y, p1.y);
    if (mx >= x0 && mx <= x1 && my >= y0 && my <= y1) return s.id;
  }
  return null;
}
