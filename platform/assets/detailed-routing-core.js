/**
 * Tiny detailed routing instance (12×8 grid, M1 horizontal / M2 vertical, cap=2).
 * Mirrors courses/learn_routing/common/tiny_dr.json (track_capacity=2 in browser labs).
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
export const GRID_NX = 12;
export const GRID_NY = 8;
export const TRACK_CAPACITY = 2;

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

export const BLOCKAGES = [{ x: 5, y: 2, w: 2, h: 2 }];

export const GOLDENS = {
  trackCapacity: 2,
  gridNx: 12,
  gridNy: 8,
  hTracks: 88,
  vTracks: 84,
  neighborCountMid: 4,
  aPin: [1, 1],
  dPin: [8, 5],
  spreadLhvTotalOv: 3,
  spreadLhvMaxOv: 1,
  spreadAstarTotalOv: 0,
  spreadLeeTotalOv: 0,
  clusterLhvTotalOv: 3,
  leeDetourLen: 4,
  ripupImproves: true,
};

export function clonePositions(pos) {
  const out = {};
  for (const [id, p] of Object.entries(pos)) out[id] = { x: p.x, y: p.y };
  return out;
}

export function pinGrid(x, y) {
  return {
    x: Math.max(0, Math.min(GRID_NX - 1, Math.round(x))),
    y: Math.max(0, Math.min(GRID_NY - 1, Math.round(y))),
  };
}

export function cellBlocked(gx, gy) {
  for (const b of BLOCKAGES) {
    if (gx >= b.x && gx < b.x + b.w && gy >= b.y && gy < b.y + b.h) return true;
  }
  return false;
}

export function isBlocked(gx, gy) {
  return cellBlocked(gx, gy);
}

export function neighbors4(g) {
  const out = [];
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nx = g.x + dx;
    const ny = g.y + dy;
    if (nx >= 0 && nx < GRID_NX && ny >= 0 && ny < GRID_NY && !cellBlocked(nx, ny)) {
      out.push({ x: nx, y: ny });
    }
  }
  return out;
}

export function gridKey(g) {
  return `${g.x},${g.y}`;
}

export function hEdge(a, b) {
  const left = a.x <= b.x ? a : b;
  const right = a.x <= b.x ? b : a;
  return `M1|${left.x},${left.y}|${right.x},${right.y}`;
}

export function vEdge(a, b) {
  const low = a.y <= b.y ? a : b;
  const high = a.y <= b.y ? b : a;
  return `M2|${low.x},${low.y}|${high.x},${high.y}`;
}

export function trackFromStep(a, b) {
  return a.x === b.x ? vEdge(a, b) : hEdge(a, b);
}

export function leeMaze(start, goal, blocked = new Set()) {
  if (start.x === goal.x && start.y === goal.y) return [start];
  const sk = gridKey(start);
  const gk = gridKey(goal);
  if (blocked.has(sk) || blocked.has(gk)) return null;
  const q = [[start, [start]]];
  const vis = new Set([sk]);
  while (q.length) {
    const [cur, path] = q.shift();
    for (const nb of neighbors4(cur)) {
      const nk = gridKey(nb);
      if (blocked.has(nk)) continue;
      if (nk === gk) return path.concat([nb]);
      if (!vis.has(nk)) {
        vis.add(nk);
        q.push([nb, path.concat([nb])]);
      }
    }
  }
  return null;
}

function astarCost(usage, cap, a, b) {
  const ek = trackFromStep(a, b);
  const u = usage[ek] || 0;
  if (u >= cap) return 1 + 10 * (u - cap + 1);
  return 1;
}

export function astarRoute(start, goal, usage = {}, cap = TRACK_CAPACITY) {
  if (start.x === goal.x && start.y === goal.y) return [start];
  const h = (g) => Math.abs(g.x - goal.x) + Math.abs(g.y - goal.y);
  const open = [{ f: h(start), g: 0, node: start, path: [start] }];
  const best = { [gridKey(start)]: 0 };
  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const { g, node, path } = open.shift();
    if (gridKey(node) === gridKey(goal)) return path;
    if (g > (best[gridKey(node)] ?? Infinity)) continue;
    for (const nb of neighbors4(node)) {
      const ng = g + astarCost(usage, cap, node, nb);
      const nk = gridKey(nb);
      if (ng < (best[nk] ?? Infinity)) {
        best[nk] = ng;
        open.push({ f: ng + h(nb), g: ng, node: nb, path: path.concat([nb]) });
      }
    }
  }
  return null;
}

export function lRouteLayers(start, goal, prefer = "HV") {
  const segs = [{ x: start.x, y: start.y, layer: "M1" }];
  if (start.x === goal.x && start.y === goal.y) return segs;
  if (prefer === "VH") {
    const ys = start.y < goal.y ? range(start.y + 1, goal.y) : range(start.y - 1, goal.y, -1);
    for (const y of ys) segs.push({ x: start.x, y, layer: "M2" });
    if (start.y !== goal.y) segs.push({ x: start.x, y: goal.y, layer: "M1", via: true });
    const xs = start.x < goal.x ? range(start.x + 1, goal.x) : range(start.x - 1, goal.x, -1);
    for (const x of xs) segs.push({ x, y: goal.y, layer: "M1" });
  } else {
    const xs = start.x < goal.x ? range(start.x + 1, goal.x) : range(start.x - 1, goal.x, -1);
    for (const x of xs) segs.push({ x, y: start.y, layer: "M1" });
    if (start.x !== goal.x) segs.push({ x: goal.x, y: start.y, layer: "M2", via: true });
    const ys = start.y < goal.y ? range(start.y + 1, goal.y) : range(start.y - 1, goal.y, -1);
    for (const y of ys) segs.push({ x: goal.x, y, layer: "M2" });
  }
  const last = segs[segs.length - 1];
  if (last.x !== goal.x || last.y !== goal.y) segs.push({ x: goal.x, y: goal.y, layer: last.layer });
  return segs;
}

function range(a, b, step = 1) {
  const out = [];
  if (step > 0) for (let i = a; i <= b; i += step) out.push(i);
  else for (let i = a; i >= b; i += step) out.push(i);
  return out;
}

export function segmentsToPath(segs) {
  return segs.map((s) => ({ x: s.x, y: s.y }));
}

export function pathTrackUsage(segs) {
  const usage = {};
  const path = segmentsToPath(segs);
  for (let k = 0; k < path.length - 1; k++) {
    const ek = trackFromStep(path[k], path[k + 1]);
    usage[ek] = (usage[ek] || 0) + 1;
  }
  return usage;
}

export function usageFromDetailedRoutes(routes) {
  const usage = {};
  for (const r of routes) {
    for (const [ek, c] of Object.entries(pathTrackUsage(r.segments || []))) {
      usage[ek] = (usage[ek] || 0) + c;
    }
  }
  return usage;
}

export function trackOverflow(usage, cap = TRACK_CAPACITY) {
  let total = 0;
  let max = 0;
  let count = 0;
  for (const u of Object.values(usage)) {
    const ov = Math.max(0, u - cap);
    total += ov;
    if (ov > max) max = ov;
    if (ov > 0) count++;
  }
  return { total, max, count };
}

export function drcSpacingLite(segs, minDist = 1) {
  const byLayer = { M1: [], M2: [] };
  for (const s of segs) byLayer[s.layer]?.push({ x: s.x, y: s.y });
  for (const [layer, pts] of Object.entries(byLayer)) {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i];
        const b = pts[j];
        if (layer === "M1" && a.y === b.y) {
          const d = Math.abs(a.x - b.x);
          if (d > 0 && d <= minDist) return { pass: false, violation: { layer, a, b, dist: d } };
        }
        if (layer === "M2" && a.x === b.x) {
          const d = Math.abs(a.y - b.y);
          if (d > 0 && d <= minDist) return { pass: false, violation: { layer, a, b, dist: d } };
        }
      }
    }
  }
  return { pass: true, violation: null };
}

export function terminalsFromPositions(positions) {
  const t = {};
  for (const id of CELLS) {
    const p = positions[id];
    if (p) {
      let g = pinGrid(p.x, p.y);
      if (cellBlocked(g.x, g.y)) {
        const nb = neighbors4(g)[0];
        if (nb) g = nb;
      }
      t[id] = g;
    }
  }
  return t;
}

function routeTwoPin(a, b, mode, usage, cap) {
  if (mode === "lee") {
    const blocked = new Set();
    for (const bkg of BLOCKAGES) {
      for (let x = bkg.x; x < bkg.x + bkg.w; x++) {
        for (let y = bkg.y; y < bkg.y + bkg.h; y++) blocked.add(`${x},${y}`);
      }
    }
    const path = leeMaze(a, b, blocked) || [a, b];
    return path.map((p, k) => ({
      x: p.x,
      y: p.y,
      layer: k === 0 ? "M1" : path[k].x === path[k - 1].x ? "M2" : "M1",
    }));
  }
  if (mode === "l_hv") return lRouteLayers(a, b, "HV");
  if (mode === "l_vh") return lRouteLayers(a, b, "VH");
  const path = astarRoute(a, b, usage, cap);
  if (!path) return lRouteLayers(a, b, "HV");
  return path.map((p, k) => ({
    x: p.x,
    y: p.y,
    layer: k === 0 ? "M1" : path[k].x === path[k - 1].x ? "M2" : "M1",
  }));
}

function multipinStar(pins, prefer = "HV") {
  const xs = pins.map((p) => p.x);
  const ys = pins.map((p) => p.y);
  const center = {
    x: Math.floor((Math.min(...xs) + Math.max(...xs)) / 2),
    y: Math.floor((Math.min(...ys) + Math.max(...ys)) / 2),
  };
  let segs = [];
  for (const pin of pins) segs = segs.concat(lRouteLayers(center, pin, prefer));
  return segs;
}

export function sequentialDetailed(nets, terminals, mode = "astar", cap = TRACK_CAPACITY) {
  const usage = {};
  const routes = nets.map((net, netIndex) => {
    const pins = net.map((id) => terminals[id]);
    if (pins.length < 2) return { netIndex, net, segments: [] };
    const segs =
      pins.length === 2 ? routeTwoPin(pins[0], pins[1], mode, usage, cap) : multipinStar(pins, mode.includes("vh") ? "VH" : "HV");
    for (const [ek, c] of Object.entries(pathTrackUsage(segs))) {
      usage[ek] = (usage[ek] || 0) + c;
    }
    return { netIndex, net, segments: segs };
  });
  return { routes, usage };
}

export function ripupDetailed(routes, usage, cap, terminals, nets = NETS) {
  const u = { ...usage };
  let worst = 0;
  let worstOv = -1;
  for (const r of routes) {
    if (!r.segments.length) continue;
    const local = pathTrackUsage(r.segments);
    let ov = 0;
    for (const [ek, c] of Object.entries(local)) {
      ov += Math.max(0, (u[ek] || 0) - cap);
    }
    if (ov > worstOv) {
      worstOv = ov;
      worst = r.netIndex;
    }
  }
  const wr = routes[worst];
  if (!wr?.segments?.length) return routes;
  for (const [ek, c] of Object.entries(pathTrackUsage(wr.segments))) {
    u[ek] = Math.max(0, (u[ek] || 0) - c);
  }
  const pins = wr.net.map((id) => terminals[id]);
  const newSegs = pins.length === 2 ? routeTwoPin(pins[0], pins[1], "astar", u, cap) : multipinStar(pins, "VH");
  for (const [ek, c] of Object.entries(pathTrackUsage(newSegs))) {
    u[ek] = (u[ek] || 0) + c;
  }
  return routes.map((r) => (r.netIndex === worst ? { ...r, segments: newSegs } : r));
}

/** Total grid hops across all detailed routes. */
export function wireLength(routes) {
  let total = 0;
  for (const r of routes || []) {
    const path = segmentsToPath(r.segments || []);
    total += Math.max(0, path.length - 1);
  }
  return total;
}

function usageColor(u, cap, paper = false) {
  const t = Math.max(0, Math.min(1, u / Math.max(cap, 1)));
  if (paper) {
    const stops = [
      [226, 232, 240],
      [15, 107, 92],
      [180, 83, 9],
      [159, 18, 57],
    ];
    const i = t < 0.33 ? 0 : t < 0.66 ? 1 : t < 0.9 ? 2 : 3;
    const [r, g, b] = stops[i];
    return `rgb(${r},${g},${b})`;
  }
  return `rgba(${Math.round(60 + 180 * t)},${Math.round(160 - 100 * t)},${Math.round(220 - 80 * t)},0.85)`;
}

/**
 * opts: positions, usage, routes, highlight, selectedNet, cap, paper, metricText
 */
export function drawDetailedRoute(canvas, opts = {}) {
  const positions = opts.positions || PLACEMENT;
  const routes = opts.routes || [];
  const usage = opts.usage || {};
  const cap = opts.cap ?? TRACK_CAPACITY;
  const highlight = new Set(opts.highlight || []);
  const paper = !!opts.paper;
  const ink = paper ? "#000000" : "#0f172a";
  const PAPER_FONT =
    "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const PAPER_PALETTE = [
    "#1d4ed8",
    "#0f6b5c",
    "#b45309",
    "#7c3aed",
    "#be123c",
    "#0e7490",
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

  for (const b of BLOCKAGES) {
    const p0 = toScreen(b.x, b.y + b.h);
    ctx.fillStyle = paper ? "#e2e8f0" : "rgba(100,116,139,0.45)";
    ctx.fillRect(p0.sx, p0.sy, b.w * scale, b.h * scale);
    if (paper) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      ctx.strokeRect(p0.sx, p0.sy, b.w * scale, b.h * scale);
    }
  }

  ctx.strokeStyle = paper ? "#cbd5e1" : "#cbd5e1";
  ctx.lineWidth = paper ? 1.1 : 1;
  for (let x = 0; x <= GRID_NX; x++) {
    const a = toScreen(x, 0);
    const b = toScreen(x, CHIP_H);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }
  for (let y = 0; y <= GRID_NY; y++) {
    const a = toScreen(0, y);
    const b = toScreen(CHIP_W, y);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }

  for (const [ek, u] of Object.entries(usage)) {
    const [, a, b] = ek.split("|");
    const [x0, y0] = a.split(",").map(Number);
    const [x1, y1] = b.split(",").map(Number);
    const p0 = toScreen(x0 + 0.5, y0 + 0.5);
    const p1 = toScreen(x1 + 0.5, y1 + 0.5);
    ctx.strokeStyle = usageColor(u, cap, paper);
    ctx.lineWidth = paper ? 2 + Math.min(5, u * 1.25) : 2 + Math.min(5, u * 2);
    ctx.beginPath();
    ctx.moveTo(p0.sx, p0.sy);
    ctx.lineTo(p1.sx, p1.sy);
    ctx.stroke();
    if (u > cap) {
      ctx.strokeStyle = paper ? "#9f1239" : "rgba(220,38,38,0.9)";
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(p0.sx, p0.sy);
      ctx.lineTo(p1.sx, p1.sy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  const sel = opts.selectedNet;
  routes.forEach((r, idx) => {
    if (!r.segments?.length) return;
    const path = segmentsToPath(r.segments);
    const active = sel == null || sel === idx;
    ctx.strokeStyle = paper
      ? active
        ? PAPER_PALETTE[idx % PAPER_PALETTE.length]
        : "rgba(148,163,184,0.35)"
      : active
        ? "rgba(14,165,233,0.8)"
        : "rgba(148,163,184,0.35)";
    ctx.lineWidth = active ? (paper ? 2.75 : 3) : 1.5;
    ctx.beginPath();
    const s0 = toScreen(path[0].x + 0.5, path[0].y + 0.5);
    ctx.moveTo(s0.sx, s0.sy);
    for (let k = 1; k < path.length; k++) {
      const s = toScreen(path[k].x + 0.5, path[k].y + 0.5);
      ctx.lineTo(s.sx, s.sy);
    }
    ctx.stroke();
    for (const s of r.segments) {
      if (s.via) {
        const v = toScreen(s.x + 0.5, s.y + 0.5);
        ctx.fillStyle = paper ? "#b45309" : "#f59e0b";
        ctx.beginPath();
        ctx.arc(v.sx, v.sy, paper ? 3.5 : 4, 0, Math.PI * 2);
        ctx.fill();
        if (paper) {
          ctx.strokeStyle = ink;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  });

  const origin = toScreen(0, CHIP_H);
  ctx.strokeStyle = paper ? "#000000" : "#334155";
  ctx.lineWidth = paper ? 2.25 : 2;
  ctx.strokeRect(origin.sx, origin.sy, CHIP_W * scale, CHIP_H * scale);

  for (const id of CELLS) {
    const p = positions[id];
    if (!p) continue;
    const { sx, sy } = toScreen(p.x, p.y);
    const idx = CELLS.indexOf(id);
    ctx.beginPath();
    ctx.arc(sx, sy, highlight.has(id) ? 10 : paper ? 6.5 : 7, 0, Math.PI * 2);
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
  }

  if (paper) {
    if (opts.metricText) {
      ctx.fillStyle = ink;
      ctx.font = `bold 12px ${PAPER_FONT}`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(opts.metricText, pad, pad - 8);
    }
    const ly = h - Math.round(legendH / 2) - 2;
    let lx = pad;
    ctx.font = `11px ${PAPER_FONT}`;
    routes.forEach((r, idx) => {
      if (!r.segments?.length) return;
      ctx.beginPath();
      ctx.arc(lx + 5, ly, 4, 0, Math.PI * 2);
      ctx.fillStyle = PAPER_PALETTE[idx % PAPER_PALETTE.length];
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.fillText(`N${idx}`, lx + 12, ly + 4);
      lx += 42;
    });
  }
  return { scale, ox, oy, toScreen };
}

export function canvasToGrid(canvas, clientX, clientY) {
  return canvasToChip(canvas, clientX, clientY);
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
  return { x: (mx - ox) / scale, y: (oy - my) / scale, scale };
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

export function totalHpwl(positions, nets = NETS) {
  return nets.reduce((s, net) => {
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const id of net) {
      const p = positions[id];
      if (!p) continue;
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
    return s + (maxX - minX) + (maxY - minY);
  }, 0);
}
