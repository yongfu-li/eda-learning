/**
 * Tiny congestion instance for browser labs (4×2 GCells, 6 cells, 6 nets).
 * Mirrors courses/learn_congestion/common/tiny_cong.json + solvers.py.
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const CELLS = ["A", "B", "C", "D", "E", "F"];

export const NETS = [
  ["A", "B"],
  ["C", "D"],
  ["A", "C"],
  ["B", "D"],
  ["A", "B", "C", "D"],
  ["E", "F"],
];

export const WIDTHS = { A: 2, B: 2, C: 2, D: 2, E: 1, F: 1 };

export const CHIP_W = 12;
export const CHIP_H = 8;
export const GCELL_NX = 4;
export const GCELL_NY = 2;
export const CELL_W = 3;
export const CELL_H = 4;
export const CAPACITY = 2.0;

/** Spread placement — long nets, demand painted across many tiles. */
export const PLACEMENT = {
  A: { x: 1, y: 1 },
  B: { x: 8, y: 1 },
  C: { x: 1, y: 5 },
  D: { x: 8, y: 5 },
  E: { x: 5, y: 3 },
  F: { x: 6, y: 3 },
};

/** Center-clustered seed — hotspots for feedback labs. */
export const CONGESTED_SEED = {
  A: { x: 4, y: 2 },
  B: { x: 5, y: 2 },
  C: { x: 4, y: 3 },
  D: { x: 5, y: 3 },
  E: { x: 4.5, y: 2.5 },
  F: { x: 5.5, y: 2.5 },
};

/**
 * Numeric goldens (RUDY @ Cap=2). Recompute via common/test_solvers.py if logic changes.
 * Spread paints many tiles → higher total overflow; cluster spikes local demand.
 */
export const GOLDENS = {
  capacity: 2,
  gcellNx: 4,
  gcellNy: 2,
  aGcell: [0, 0],
  dGcell: [2, 1],
  spreadRudyTotalOv: 22,
  congestedRudyMaxOv: 5,
  feedbackReduces: true,
};

export function clonePositions(pos) {
  const out = {};
  for (const [id, p] of Object.entries(pos)) out[id] = { x: p.x, y: p.y };
  return out;
}

export function cellGcell(x, y) {
  const i = Math.max(0, Math.min(GCELL_NX - 1, Math.floor(x / CELL_W)));
  const j = Math.max(0, Math.min(GCELL_NY - 1, Math.floor(y / CELL_H)));
  return { i, j };
}

export function gcellRect(i, j) {
  return { x: i * CELL_W, y: j * CELL_H, w: CELL_W, h: CELL_H };
}

export function netBBox(net, positions) {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const id of net) {
    const p = positions[id];
    if (!p) continue;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { x0: minX, y0: minY, x1: maxX, y1: maxY };
}

export function hpwl(net, positions) {
  const b = netBBox(net, positions);
  if (!Number.isFinite(b.x0)) return 0;
  return b.x1 - b.x0 + (b.y1 - b.y0);
}

export function totalHpwl(positions, nets = NETS) {
  return nets.reduce((s, n) => s + hpwl(n, positions), 0);
}

function zeros() {
  return Array.from({ length: GCELL_NX }, () => Array(GCELL_NY).fill(0));
}

function tilesForBBox(x0, y0, x1, y1) {
  const a = cellGcell(x0, y0);
  const b = cellGcell(x1, y1);
  const i0 = Math.min(a.i, b.i);
  const i1 = Math.max(a.i, b.i);
  const j0 = Math.min(a.j, b.j);
  const j1 = Math.max(a.j, b.j);
  const tiles = [];
  for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) tiles.push({ i, j });
  return tiles;
}

/** RUDY: HPWL / #overlapping GCells deposited into each overlapping tile. */
export function rudyDemand(positions, nets = NETS) {
  const demand = zeros();
  for (const net of nets) {
    const b = netBBox(net, positions);
    const wl = hpwl(net, positions);
    const tiles = tilesForBBox(b.x0, b.y0, b.x1, b.y1);
    const dens = wl / Math.max(1, tiles.length);
    for (const t of tiles) demand[t.i][t.j] += dens;
  }
  return demand;
}

function depositLine(demand, x0, y0, x1, y1, amt) {
  const tiles = tilesForBBox(x0, y0, x1, y1);
  const share = amt / Math.max(1, tiles.length);
  for (const t of tiles) demand[t.i][t.j] += share;
}

function twoPin(demand, positions, a, b, scale = 1) {
  const ax = positions[a].x;
  const ay = positions[a].y;
  const bx = positions[b].x;
  const by = positions[b].y;
  depositLine(demand, ax, ay, bx, ay, 0.5 * scale);
  depositLine(demand, bx, ay, bx, by, 0.5 * scale);
  depositLine(demand, ax, ay, ax, by, 0.5 * scale);
  depositLine(demand, ax, by, bx, by, 0.5 * scale);
}

/** Probabilistic L-shape demand (half each bend); multi-pin stars from bbox center. */
export function probabilisticDemand(positions, nets = NETS) {
  const demand = zeros();
  for (const net of nets) {
    if (net.length === 2) {
      twoPin(demand, positions, net[0], net[1]);
    } else {
      const b = netBBox(net, positions);
      const ext = { ...clonePositions(positions), __c: { x: 0.5 * (b.x0 + b.x1), y: 0.5 * (b.y0 + b.y1) } };
      const scale = 1 / Math.max(1, net.length);
      for (const p of net) twoPin(demand, ext, "__c", p, scale);
    }
  }
  return demand;
}

export function congestionMap(demand, capacity = CAPACITY) {
  return demand.map((col) => col.map((d) => d / capacity));
}

export function overflowMetrics(demand, capacity = CAPACITY) {
  const perCell = demand.map((col) => col.map((d) => Math.max(0, d - capacity)));
  let total = 0;
  let max = 0;
  let count = 0;
  for (const col of perCell) {
    for (const v of col) {
      total += v;
      if (v > max) max = v;
      if (v > 0) count++;
    }
  }
  return { total, max, count, perCell };
}

export function hottest(cong) {
  let best = { i: 0, j: 0, v: -1 };
  for (let i = 0; i < cong.length; i++) {
    for (let j = 0; j < cong[i].length; j++) {
      if (cong[i][j] > best.v) best = { i, j, v: cong[i][j] };
    }
  }
  return best;
}

export function inflateWidths(positions, widths = WIDTHS, cong, alpha = 0.5) {
  const out = { ...widths };
  for (const id of Object.keys(positions)) {
    const p = positions[id];
    const { i, j } = cellGcell(p.x, p.y);
    const c = cong[i][j];
    if (c > 1) out[id] = (widths[id] || 1) * (1 + alpha * (c - 1));
  }
  return out;
}

export function netWeightsFromCongestion(positions, cong, beta = 1, nets = NETS) {
  return nets.map((net) => {
    const b = netBBox(net, positions);
    const tiles = tilesForBBox(b.x0, b.y0, b.x1, b.y1);
    const mean = tiles.reduce((s, t) => s + cong[t.i][t.j], 0) / Math.max(1, tiles.length);
    return 1 + beta * mean;
  });
}

/** One-pass: RUDY → push cells in overflowing GCells toward quieter neighbors. */
export function placementFeedbackLite(positions, capacity = CAPACITY) {
  const demand = rudyDemand(positions);
  const ov = overflowMetrics(demand, capacity).perCell;
  const out = clonePositions(positions);
  for (const id of Object.keys(out)) {
    const p = out[id];
    const { i, j } = cellGcell(p.x, p.y);
    if (ov[i][j] <= 0) continue;
    let best = { i, j, v: ov[i][j] };
    for (const [di, dj] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < GCELL_NX && nj >= 0 && nj < GCELL_NY && ov[ni][nj] < best.v) {
        best = { i: ni, j: nj, v: ov[ni][nj] };
      }
    }
    const tx = (best.i + 0.5) * CELL_W;
    const ty = (best.j + 0.5) * CELL_H;
    out[id] = {
      x: Math.max(0, Math.min(CHIP_W - 1, 0.5 * (p.x + tx))),
      y: Math.max(0, Math.min(CHIP_H - 1, 0.5 * (p.y + ty))),
    };
  }
  return out;
}

function heatColor(t, paper = false) {
  const u = Math.max(0, Math.min(1, t));
  if (paper) {
    // Cool white → brand teal → amber → crimson (readable on white bg)
    const stops = [
      [255, 255, 255],
      [15, 107, 92],
      [180, 83, 9],
      [159, 18, 57],
    ];
    const x = u * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(x));
    const f = x - i;
    const a = stops[i];
    const b = stops[i + 1];
    const r = Math.round(a[0] + (b[0] - a[0]) * f);
    const g = Math.round(a[1] + (b[1] - a[1]) * f);
    const bl = Math.round(a[2] + (b[2] - a[2]) * f);
    return `rgba(${r},${g},${bl},${0.15 + 0.7 * u})`;
  }
  const r = Math.round(40 + 200 * u);
  const g = Math.round(180 - 140 * u);
  const b = Math.round(80 - 40 * u);
  return `rgba(${r},${g},${b},0.55)`;
}

/**
 * Draw chip + GCell heat + cell markers. `heat` is demand or congestion matrix.
 * opts.paper — white bg + plot palette (benchmark figures).
 */
export function drawCongestion(canvas, opts = {}) {
  const positions = opts.positions || PLACEMENT;
  const capacity = opts.capacity ?? CAPACITY;
  const heatMode = opts.heatMode || "cong"; // cong | demand
  const paper = !!opts.paper;
  const ink = paper ? "#000000" : "#0f172a";
  const PAPER_FONT =
    "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const PAPER_PALETTE = [
    "#1d4ed8",
    "#0f6b5c",
    "#b45309",
    "#9f1239",
    "#6d28d9",
    "#c2410c",
    "#0369a1",
    "#a21caf",
  ];

  if (paper) canvas.style.background = "#ffffff";

  const heat =
    opts.heat != null
      ? opts.heat
      : heatMode === "demand"
        ? rudyDemand(positions)
        : congestionMap(rudyDemand(positions), capacity);
  const highlight = new Set(opts.highlight || []);
  const { ctx, w, h } = fitHiDpiCanvas(canvas, { w: 640, h: LAB_CANVAS_CSS_HEIGHT });
  ctx.clearRect(0, 0, w, h);
  if (paper) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  const pad = 28;
  const legendH = paper ? 28 : 0;
  const scale = Math.min((w - 2 * pad) / CHIP_W, (h - 2 * pad - legendH) / CHIP_H);
  const ox = (w - CHIP_W * scale) / 2;
  const oy = h - pad - legendH - (h - 2 * pad - legendH - CHIP_H * scale) / 2;

  const toScreen = (x, y) => ({ sx: ox + x * scale, sy: oy - y * scale });

  let cong = null;
  if (heat) {
    cong = heatMode === "demand" ? congestionMap(heat, capacity) : heat;
    let maxC = 0;
    for (const col of cong) for (const v of col) if (v > maxC) maxC = v;
    for (let i = 0; i < GCELL_NX; i++) {
      for (let j = 0; j < GCELL_NY; j++) {
        const r = gcellRect(i, j);
        const p0 = toScreen(r.x, r.y + r.h);
        ctx.fillStyle = heatColor(maxC > 0 ? cong[i][j] / maxC : 0, paper);
        ctx.fillRect(p0.sx, p0.sy, r.w * scale, r.h * scale);
      }
    }
  }

  const origin = toScreen(0, CHIP_H);
  ctx.strokeStyle = paper ? "#000000" : "#334155";
  ctx.lineWidth = paper ? 2.25 : 2;
  ctx.strokeRect(origin.sx, origin.sy, CHIP_W * scale, CHIP_H * scale);
  ctx.strokeStyle = paper ? "#94a3b8" : "#94a3b8";
  ctx.lineWidth = paper ? 1.25 : 1;
  for (let i = 1; i < GCELL_NX; i++) {
    const a = toScreen(i * CELL_W, 0);
    const b = toScreen(i * CELL_W, CHIP_H);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }
  for (let j = 1; j < GCELL_NY; j++) {
    const a = toScreen(0, j * CELL_H);
    const b = toScreen(CHIP_W, j * CELL_H);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }

  if (opts.showNets !== false) {
    ctx.strokeStyle = paper ? "rgba(51,65,85,0.45)" : "rgba(100,116,139,0.45)";
    ctx.lineWidth = paper ? 1.25 : 1;
    for (const net of NETS) {
      if (net.length < 2) continue;
      const b = netBBox(net, positions);
      const p0 = toScreen(b.x0, b.y0);
      const p1 = toScreen(b.x1, b.y1);
      ctx.strokeRect(p0.sx, p1.sy, (b.x1 - b.x0) * scale, (b.y1 - b.y0) * scale);
    }
  }

  CELLS.forEach((id, idx) => {
    const p = positions[id];
    if (!p) return;
    const { sx, sy } = toScreen(p.x, p.y);
    ctx.beginPath();
    ctx.arc(sx, sy, highlight.has(id) ? 10 : 7, 0, Math.PI * 2);
    ctx.fillStyle = paper
      ? PAPER_PALETTE[idx % PAPER_PALETTE.length]
      : highlight.has(id)
        ? "#0ea5e9"
        : "#1e293b";
    ctx.fill();
    if (paper) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.fillStyle = ink;
    ctx.font = paper ? `bold 12px ${PAPER_FONT}` : "12px ui-sans-serif, system-ui";
    ctx.fillText(id, sx + 8, sy - 8);
  });

  if (paper) {
    const ly = h - Math.round(legendH / 2) - 2;
    let lx = pad;
    ctx.font = `bold 12px ${PAPER_FONT}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    CELLS.forEach((id, idx) => {
      ctx.beginPath();
      ctx.arc(lx + 5, ly, 5, 0, Math.PI * 2);
      ctx.fillStyle = PAPER_PALETTE[idx % PAPER_PALETTE.length];
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.fillText(id, lx + 14, ly);
      lx += ctx.measureText(id).width + 28;
    });
    if (opts.metricText) {
      ctx.fillStyle = ink;
      ctx.font = `bold 12px ${PAPER_FONT}`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(opts.metricText, pad, pad - 8);
    }
  }

  return { scale, ox, oy, toScreen, cong };
}

export function canvasToChip(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const w = canvas.clientWidth || rect.width || 640;
  const h = canvas.clientHeight || rect.height || LAB_CANVAS_CSS_HEIGHT;
  const pad = 28;
  const scale = Math.min((w - 2 * pad) / CHIP_W, (h - 2 * pad) / CHIP_H);
  const ox = (w - CHIP_W * scale) / 2;
  const oy = h - pad - (h - 2 * pad - CHIP_H * scale) / 2;
  const mx = clientX - rect.left;
  const my = clientY - rect.top;
  return {
    x: (mx - ox) / scale,
    y: (oy - my) / scale,
    scale,
  };
}

export function hitCell(positions, canvas, clientX, clientY) {
  const world = canvasToChip(canvas, clientX, clientY);
  let best = null;
  let bestD = 12 / Math.max(world.scale, 1e-9);
  for (const id of CELLS) {
    const p = positions[id];
    if (!p) continue;
    const d = Math.hypot(p.x - world.x, p.y - world.y);
    if (d <= bestD) {
      bestD = d;
      best = id;
    }
  }
  return best;
}
