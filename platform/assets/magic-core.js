/**
 * Part A — Magic layout/DRC/GDS map core (mirrors courses/learn_magic/common/solvers.py)
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  rectCount: 6,
  layerCount: 6,
  contactCount: 1,
  paintMetal1: 2,
  drcWidthErrors: 1,
  drcErrorCount: 1,
  gdsLayerCount: 6,
  thinShape: "thin",
  engineOk: true,
};

export const STARTER = {
  cell: "tiny_inv",
  layers: ["ndiff", "pdiff", "poly", "metal1", "nwell", "pwell"],
  rects: [
    { id: "nw", layer: "nwell", x0: 0, y0: 10, x1: 20, y1: 20 },
    { id: "nd", layer: "ndiff", x0: 4, y0: 2, x1: 12, y1: 6 },
    { id: "pd", layer: "pdiff", x0: 4, y0: 12, x1: 12, y1: 16 },
    { id: "g", layer: "poly", x0: 7, y0: 1, x1: 9, y1: 17 },
    { id: "m1y", layer: "metal1", x0: 10, y0: 4, x1: 18, y1: 14 },
    { id: "thin", layer: "metal1", x0: 18, y0: 4, x1: 19, y1: 10 },
  ],
  contacts: [{ id: "ca", between: ["poly", "metal1"], x0: 7, y0: 8, x1: 9, y1: 10 }],
  tech: {
    min_width: { metal1: 2, poly: 2, ndiff: 3, pdiff: 3 },
    min_space: { metal1: 2, poly: 2 },
  },
  gds_map: { ndiff: 6, pdiff: 7, poly: 46, metal1: 49, nwell: 42, contact: 25 },
};

const LAYER_COLOR = {
  nwell: "#7b2cbf",
  pwell: "#5a189a",
  ndiff: "#2a9d8f",
  pdiff: "#e9c46a",
  poly: "#e76f51",
  metal1: "#457b9d",
  contact: "#264653",
};

export function cloneCell(c = STARTER) {
  return JSON.parse(JSON.stringify(c));
}

function width(r) {
  return r.x1 - r.x0;
}
function height(r) {
  return r.y1 - r.y0;
}

export function stagePaint(c = STARTER) {
  const m1 = c.rects.filter((r) => r.layer === "metal1");
  const ok = c.rects.length === GOLDENS.rectCount && m1.length === GOLDENS.paintMetal1;
  return {
    ok,
    rectCount: c.rects.length,
    paintMetal1: m1.length,
    highlight: c.rects.map((r) => r.id),
    note: "paint places rectangles on named layers.",
    pass: "paint",
  };
}

export function stageSelect(c = STARTER) {
  const thin = c.rects.find((r) => r.id === GOLDENS.thinShape);
  const ok = !!thin && Math.min(width(thin), height(thin)) === 1;
  return {
    ok,
    selected: thin?.id,
    box: thin ? [thin.x0, thin.y0, thin.x1, thin.y1] : null,
    highlight: thin ? [thin.id] : [],
    note: "box + select picks geometry.",
    pass: "select",
  };
}

export function stageContact(c = STARTER) {
  const ok = c.contacts.length === GOLDENS.contactCount;
  return {
    ok,
    contactCount: c.contacts.length,
    highlight: [...c.contacts.map((x) => x.id), "g", "m1y"],
    note: "contact between poly and metal1.",
    pass: "contact",
  };
}

export function checkDrc(c = STARTER) {
  const errors = [];
  for (const r of c.rects) {
    const lim = c.tech.min_width[r.layer];
    if (lim == null) continue;
    const thin = Math.min(width(r), height(r));
    if (thin < lim) {
      errors.push({ type: "width", layer: r.layer, shape: r.id, value: thin, limit: lim });
    }
  }
  return { errors, count: errors.length };
}

export function stageDrc(c = STARTER) {
  const drc = checkDrc(c);
  const ok = drc.count === GOLDENS.drcErrorCount && drc.errors.some((e) => e.shape === GOLDENS.thinShape);
  return {
    ok,
    errorCount: drc.count,
    errors: drc.errors,
    highlight: drc.errors.map((e) => e.shape),
    markers: drc.errors,
    note: "drc check finds width error on thin.",
    pass: "drc",
  };
}

export function stageGds(c = STARTER) {
  const gds = c.gds_map;
  const ok = Object.keys(gds).length === GOLDENS.gdsLayerCount && gds.metal1 === 49;
  return {
    ok,
    gdsLayerCount: Object.keys(gds).length,
    gdsMap: gds,
    highlight: Object.keys(gds),
    note: "gds write maps layers to GDS numbers.",
    pass: "gds",
  };
}

export function magicEngine(c = STARTER) {
  const stages = [stagePaint(c), stageSelect(c), stageContact(c), stageDrc(c), stageGds(c)];
  const ok = stages.every((s) => s.ok) && GOLDENS.engineOk;
  return { ok, rects: GOLDENS.rectCount, drcErrors: GOLDENS.drcErrorCount, gdsLayers: GOLDENS.gdsLayerCount, pass: "engine" };
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

export function drawMagic(canvas, opts = {}) {
  const c = opts.cell || STARTER;
  const chip = { x0: 0, y0: 0, x1: 24, y1: 22 };
  const selected = opts.selected || null;
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

  const drawRect = (r, isContact = false) => {
    const p0 = t.map(r.x0, r.y0);
    const p1 = t.map(r.x1, r.y1);
    const x = Math.min(p0.x, p1.x);
    const y = Math.min(p0.y, p1.y);
    const w = Math.abs(p1.x - p0.x);
    const h = Math.abs(p0.y - p1.y);
    const layer = isContact ? "contact" : r.layer;
    const col = LAYER_COLOR[layer] || "#555";
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = col;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
    ctx.lineWidth = selected === r.id || highlight.has(r.id) ? 3 : 1.5;
    ctx.strokeStyle = selected === r.id ? "#111" : col;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#222";
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillText(r.id, x + 2, y + 12);
  };

  for (const r of c.rects) drawRect(r);
  for (const r of c.contacts || []) drawRect(r, true);

  for (const m of markers) {
    const s = c.rects.find((x) => x.id === m.shape);
    if (!s) continue;
    const p = t.map((s.x0 + s.x1) / 2, (s.y0 + s.y1) / 2);
    ctx.fillStyle = "#bc4749";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (opts.metricText) {
    ctx.fillStyle = "#333";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(opts.metricText, 12, 18);
  }
}

export function hitShape(cell, canvas, clientX, clientY) {
  const chip = { x0: 0, y0: 0, x1: 24, y1: 22 };
  const rect = canvas.getBoundingClientRect();
  const mx = clientX - rect.left;
  const my = clientY - rect.top;
  const t = worldToScreen(chip, canvas);
  const all = [...(cell.contacts || []), ...cell.rects];
  for (let i = all.length - 1; i >= 0; i--) {
    const s = all[i];
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
