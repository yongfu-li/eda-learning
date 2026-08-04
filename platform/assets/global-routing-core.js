/**
 * Tiny global routing instance for browser labs (4×2 GCells, 6 cells, 6 nets).
 * Mirrors congestion geometry; routes on GCell graph edges with capacity.
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

export const CHIP_W = 12;
export const CHIP_H = 8;
export const GCELL_NX = 4;
export const GCELL_NY = 2;
export const CELL_W = 3;
export const CELL_H = 4;
export const EDGE_CAPACITY = 2;

/** Spread placement — same as congestion PLACEMENT. */
export const PLACEMENT = {
  A: { x: 1, y: 1 },
  B: { x: 8, y: 1 },
  C: { x: 1, y: 5 },
  D: { x: 8, y: 5 },
  E: { x: 5, y: 3 },
  F: { x: 6, y: 3 },
};

/** Center cluster — hot corridors for overflow labs. */
export const CLUSTER_SEED = {
  A: { x: 4, y: 2 },
  B: { x: 5, y: 2 },
  C: { x: 4, y: 3 },
  D: { x: 5, y: 3 },
  E: { x: 4.5, y: 2.5 },
  F: { x: 5.5, y: 2.5 },
};

/**
 * Numeric goldens (edge overflow @ Cap=2). Recompute if routing logic changes.
 * spreadLhvTotalOv: sequential L-HV on spread placement.
 * clusterLhvTotalOv: same on cluster seed (many shared edges).
 * mazeSpreadTotalOv: maze sequential on spread (often 0).
 */
export const GOLDENS = {
  edgeCapacity: 2,
  gcellNx: 4,
  gcellNy: 2,
  edgeCount: 10,
  neighborCountMid: 3,
  aGcell: [0, 0],
  dGcell: [2, 1],
  spreadLhvTotalOv: 2,
  spreadLhvMaxOv: 1,
  spreadLvhTotalOv: 1,
  clusterLhvTotalOv: 0,
  mazeSpreadTotalOv: 2,
  ripupImproves: true,
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

export function gcellCenter(i, j) {
  return { x: (i + 0.5) * CELL_W, y: (j + 0.5) * CELL_H };
}

export function gcellKey(g) {
  return `${g.i},${g.j}`;
}

export function edgeKey(a, b) {
  const ka = gcellKey(a);
  const kb = gcellKey(b);
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

export function parseEdgeKey(ek) {
  const [a, b] = ek.split("|");
  const [i0, j0] = a.split(",").map(Number);
  const [i1, j1] = b.split(",").map(Number);
  return [{ i: i0, j: j0 }, { i: i1, j: j1 }];
}

export function allEdges() {
  const edges = [];
  for (let j = 0; j < GCELL_NY; j++) {
    for (let i = 0; i < GCELL_NX - 1; i++) {
      edges.push(edgeKey({ i, j }, { i: i + 1, j }));
    }
  }
  for (let i = 0; i < GCELL_NX; i++) {
    for (let j = 0; j < GCELL_NY - 1; j++) {
      edges.push(edgeKey({ i, j }, { i, j: j + 1 }));
    }
  }
  return edges;
}

export function neighbors(g) {
  const out = [];
  for (const [di, dj] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const ni = g.i + di;
    const nj = g.j + dj;
    if (ni >= 0 && ni < GCELL_NX && nj >= 0 && nj < GCELL_NY) out.push({ i: ni, j: nj });
  }
  return out;
}

function sameG(g1, g2) {
  return g1.i === g2.i && g1.j === g2.j;
}

function appendSegment(path, from, to) {
  if (sameG(from, to)) return;
  const last = path[path.length - 1];
  if (last && sameG(last, from)) {
    /* continue */
  } else if (!last || !sameG(last, from)) {
    path.push({ ...from });
  }
  if (from.i === to.i) {
    const dj = to.j > from.j ? 1 : -1;
    for (let j = from.j + dj; dj > 0 ? j <= to.j : j >= to.j; j += dj) {
      path.push({ i: from.i, j });
    }
  } else if (from.j === to.j) {
    const di = to.i > from.i ? 1 : -1;
    for (let i = from.i + di; di > 0 ? i <= to.i : i >= to.i; i += di) {
      path.push({ i, j: from.j });
    }
  }
}

/** Manhattan L-route; prefer "HV" or "VH". */
export function lRoute(a, b, prefer = "HV") {
  if (sameG(a, b)) return [{ ...a }];
  const path = [{ ...a }];
  if (prefer === "VH") {
    appendSegment(path, a, { i: a.i, j: b.j });
    appendSegment(path, { i: a.i, j: b.j }, b);
  } else {
    appendSegment(path, a, { i: b.i, j: a.j });
    appendSegment(path, { i: b.i, j: a.j }, b);
  }
  return path;
}

/** Z-route via column midpoint (two bends when both Δi,Δj ≠ 0). */
export function zRoute(a, b) {
  if (sameG(a, b)) return [{ ...a }];
  if (a.i === b.i || a.j === b.j) return lRoute(a, b, "HV");
  const im = Math.round((a.i + b.i) / 2);
  const path = [{ ...a }];
  appendSegment(path, a, { i: im, j: a.j });
  appendSegment(path, { i: im, j: a.j }, { i: im, j: b.j });
  appendSegment(path, { i: im, j: b.j }, b);
  return path;
}

function edgeCost(usage, cap, ek) {
  const u = usage[ek] || 0;
  if (u >= cap) return 1 + 10 * (u - cap + 1);
  return 1;
}

/** Dijkstra maze route penalizing saturated edges. */
export function mazeRoute(a, b, usage = {}, cap = EDGE_CAPACITY) {
  if (sameG(a, b)) return [{ ...a }];
  const start = gcellKey(a);
  const goal = gcellKey(b);
  const dist = { [start]: 0 };
  const prev = {};
  const open = [{ k: start, d: 0 }];
  while (open.length) {
    open.sort((x, y) => x.d - y.d);
    const { k, d } = open.shift();
    if (d > dist[k]) continue;
    if (k === goal) break;
    const [i, j] = k.split(",").map(Number);
    for (const nb of neighbors({ i, j })) {
      const nk = gcellKey(nb);
      const ek = edgeKey({ i, j }, nb);
      const nd = d + edgeCost(usage, cap, ek);
      if (dist[nk] == null || nd < dist[nk]) {
        dist[nk] = nd;
        prev[nk] = k;
        open.push({ k: nk, d: nd });
      }
    }
  }
  if (dist[goal] == null) return lRoute(a, b, "HV");
  const keys = [];
  for (let cur = goal; cur; cur = prev[cur]) keys.push(cur);
  keys.reverse();
  return keys.map((k) => {
    const [i, j] = k.split(",").map(Number);
    return { i, j };
  });
}

/** Star from bbox center of pin GCells; returns { center, paths }. */
export function multipinStar(pins, prefer = "HV") {
  const ci = Math.round(pins.reduce((s, p) => s + p.i, 0) / pins.length);
  const cj = Math.round(pins.reduce((s, p) => s + p.j, 0) / pins.length);
  const center = {
    i: Math.max(0, Math.min(GCELL_NX - 1, ci)),
    j: Math.max(0, Math.min(GCELL_NY - 1, cj)),
  };
  const paths = pins.map((p) => lRoute(center, p, prefer));
  return { center, paths };
}

export function pathEdges(path) {
  const edges = [];
  for (let k = 0; k < path.length - 1; k++) {
    edges.push(edgeKey(path[k], path[k + 1]));
  }
  return edges;
}

export function terminalsFromPositions(positions) {
  const t = {};
  for (const id of CELLS) {
    const p = positions[id];
    if (p) t[id] = cellGcell(p.x, p.y);
  }
  return t;
}

/** Route every net with L-shapes (2-pin) or star (multi-pin). */
export function routeAllL(nets, terminals, prefer = "HV") {
  return nets.map((net, netIndex) => {
    const pins = net.map((id) => terminals[id]);
    if (net.length === 2) {
      return { netIndex, net, paths: [lRoute(pins[0], pins[1], prefer)] };
    }
    const star = multipinStar(pins, prefer);
    return { netIndex, net, center: star.center, paths: star.paths };
  });
}

/** Sequential maze routing in net order. */
export function routeAllMaze(nets, terminals, cap = EDGE_CAPACITY) {
  const usage = {};
  const routes = [];
  for (let netIndex = 0; netIndex < nets.length; netIndex++) {
    const net = nets[netIndex];
    const pins = net.map((id) => terminals[id]);
    let paths;
    if (net.length === 2) {
      paths = [mazeRoute(pins[0], pins[1], usage, cap)];
    } else {
      const ci = Math.round(pins.reduce((s, p) => s + p.i, 0) / pins.length);
      const cj = Math.round(pins.reduce((s, p) => s + p.j, 0) / pins.length);
      const center = {
        i: Math.max(0, Math.min(GCELL_NX - 1, ci)),
        j: Math.max(0, Math.min(GCELL_NY - 1, cj)),
      };
      paths = pins.map((p) => mazeRoute(center, p, usage, cap));
    }
    routes.push({ netIndex, net, paths });
    addRouteUsage(usage, paths);
  }
  return routes;
}

export function addRouteUsage(usage, paths) {
  for (const path of paths) {
    for (const ek of pathEdges(path)) {
      usage[ek] = (usage[ek] || 0) + 1;
    }
  }
  return usage;
}

export function usageFromRoutes(routes) {
  const usage = {};
  for (const r of routes) addRouteUsage(usage, r.paths);
  return usage;
}

export function subtractRouteUsage(usage, paths) {
  for (const path of paths) {
    for (const ek of pathEdges(path)) {
      usage[ek] = Math.max(0, (usage[ek] || 0) - 1);
    }
  }
}

export function edgeOverflow(usage, cap = EDGE_CAPACITY) {
  let total = 0;
  let max = 0;
  let count = 0;
  for (const ek of allEdges()) {
    const ov = Math.max(0, (usage[ek] || 0) - cap);
    total += ov;
    if (ov > max) max = ov;
    if (ov > 0) count++;
  }
  return { total, max, count };
}

function routeUsesEdge(route, ek) {
  return route.paths.some((path) => pathEdges(path).includes(ek));
}

/** Rip nets on overflowing edges and reroute with maze. */
export function ripupReroute(routes, usage, cap, terminals, nets = NETS) {
  let current = routes.map((r) => ({
    netIndex: r.netIndex,
    net: r.net,
    paths: r.paths.map((p) => p.map((g) => ({ ...g }))),
  }));
  let u = { ...usage };
  let guard = 0;
  while (guard++ < 32) {
    const ov = edgeOverflow(u, cap);
    if (ov.total <= 0) break;
    let worstEk = null;
    let worstOv = 0;
    for (const ek of allEdges()) {
      const o = Math.max(0, (u[ek] || 0) - cap);
      if (o > worstOv) {
        worstOv = o;
        worstEk = ek;
      }
    }
    if (!worstEk) break;
    const toRip = current.filter((r) => routeUsesEdge(r, worstEk)).map((r) => r.netIndex);
    if (!toRip.length) break;
    for (const ni of toRip) {
      const r = current[ni];
      subtractRouteUsage(u, r.paths);
      const pins = r.net.map((id) => terminals[id]);
      let paths;
      if (r.net.length === 2) {
        paths = [mazeRoute(pins[0], pins[1], u, cap)];
      } else {
        const ci = Math.round(pins.reduce((s, p) => s + p.i, 0) / pins.length);
        const cj = Math.round(pins.reduce((s, p) => s + p.j, 0) / pins.length);
        const center = {
          i: Math.max(0, Math.min(GCELL_NX - 1, ci)),
          j: Math.max(0, Math.min(GCELL_NY - 1, cj)),
        };
        paths = pins.map((p) => mazeRoute(center, p, u, cap));
      }
      r.paths = paths;
      addRouteUsage(u, paths);
    }
  }
  return current;
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

function usageColor(u, cap, paper = false) {
  const t = Math.max(0, Math.min(1, u / Math.max(cap, 1)));
  if (paper) {
    // white → teal → amber → crimson
    const stops = [
      [226, 232, 240],
      [15, 107, 92],
      [180, 83, 9],
      [159, 18, 57],
    ];
    const x = t * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(x));
    const f = x - i;
    const a = stops[i];
    const b = stops[i + 1];
    const r = Math.round(a[0] + (b[0] - a[0]) * f);
    const g = Math.round(a[1] + (b[1] - a[1]) * f);
    const bl = Math.round(a[2] + (b[2] - a[2]) * f);
    return `rgba(${r},${g},${bl},${0.35 + 0.55 * t})`;
  }
  const r = Math.round(60 + 180 * t);
  const g = Math.round(160 - 100 * t);
  const b = Math.round(220 - 80 * t);
  return `rgba(${r},${g},${b},0.85)`;
}

/**
 * Draw chip + GCell grid + edge usage + routes.
 * opts: positions, usage, routes, highlightPath, selectedNet, cap, paper
 */
export function drawGlobalRoute(canvas, opts = {}) {
  const positions = opts.positions || PLACEMENT;
  const cap = opts.cap ?? EDGE_CAPACITY;
  const usage = opts.usage || {};
  const routes = opts.routes || [];
  const highlight = new Set(opts.highlight || []);
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

  for (let i = 0; i < GCELL_NX; i++) {
    for (let j = 0; j < GCELL_NY; j++) {
      const r = gcellRect(i, j);
      const p0 = toScreen(r.x, r.y + r.h);
      ctx.fillStyle = paper
        ? (i + j) % 2 === 0
          ? "#f8fafc"
          : "#f1f5f9"
        : (i + j) % 2 === 0
          ? "rgba(241,245,249,0.6)"
          : "rgba(226,232,240,0.5)";
      ctx.fillRect(p0.sx, p0.sy, r.w * scale, r.h * scale);
    }
  }

  for (const ek of allEdges()) {
    const [a, b] = parseEdgeKey(ek);
    const ca = gcellCenter(a.i, a.j);
    const cb = gcellCenter(b.i, b.j);
    const p0 = toScreen(ca.x, ca.y);
    const p1 = toScreen(cb.x, cb.y);
    const u = usage[ek] || 0;
    ctx.strokeStyle = usageColor(u, cap, paper);
    ctx.lineWidth = paper ? 2.25 + Math.min(5, u * 1.25) : 2 + Math.min(6, u * 1.5);
    ctx.beginPath();
    ctx.moveTo(p0.sx, p0.sy);
    ctx.lineTo(p1.sx, p1.sy);
    ctx.stroke();
    if (u > cap) {
      ctx.strokeStyle = paper ? "#9f1239" : "rgba(220,38,38,0.9)";
      ctx.lineWidth = paper ? 1.5 : 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(p0.sx, p0.sy);
      ctx.lineTo(p1.sx, p1.sy);
      ctx.stroke();
      ctx.setLineDash([]);
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

  const sel = opts.selectedNet;
  routes.forEach((r, idx) => {
    const active = sel == null || sel === idx;
    ctx.strokeStyle = paper
      ? active
        ? PAPER_PALETTE[idx % PAPER_PALETTE.length]
        : "rgba(148,163,184,0.35)"
      : active
        ? "rgba(14,165,233,0.75)"
        : "rgba(148,163,184,0.35)";
    ctx.lineWidth = active ? (paper ? 2.75 : 3) : 1.5;
    for (const path of r.paths) {
      if (path.length < 2) continue;
      ctx.beginPath();
      const c0 = gcellCenter(path[0].i, path[0].j);
      const s0 = toScreen(c0.x, c0.y);
      ctx.moveTo(s0.sx, s0.sy);
      for (let k = 1; k < path.length; k++) {
        const c = gcellCenter(path[k].i, path[k].j);
        const s = toScreen(c.x, c.y);
        ctx.lineTo(s.sx, s.sy);
      }
      ctx.stroke();
    }
  });

  if (opts.highlightPath && opts.highlightPath.length > 1) {
    ctx.strokeStyle = paper ? "#b45309" : "#f59e0b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    const c0 = gcellCenter(opts.highlightPath[0].i, opts.highlightPath[0].j);
    const s0 = toScreen(c0.x, c0.y);
    ctx.moveTo(s0.sx, s0.sy);
    for (let k = 1; k < opts.highlightPath.length; k++) {
      const c = gcellCenter(opts.highlightPath[k].i, opts.highlightPath[k].j);
        const s = toScreen(c.x, c.y);
        ctx.lineTo(s.sx, s.sy);
    }
    ctx.stroke();
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
    if (opts.metricText) {
      ctx.fillStyle = ink;
      ctx.font = `bold 12px ${PAPER_FONT}`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(opts.metricText, pad, pad - 8);
    }
    const ly = h - Math.round(legendH / 2) - 2;
    let lx = pad;
    ctx.font = `bold 12px ${PAPER_FONT}`;
    ctx.textBaseline = "middle";
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
  }

  return { scale, ox, oy, toScreen };
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
