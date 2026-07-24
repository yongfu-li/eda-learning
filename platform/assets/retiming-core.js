/**
 * Tiny retiming graph — Leiserson–Saxe literacy for learn_retiming.
 * PI u → a → b → c → PO v, plus a→c. Edge w = register count.
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const NODES = [
  { id: "u", delay: 1, kind: "pi" },
  { id: "a", delay: 3, kind: "comb" },
  { id: "b", delay: 2, kind: "comb" },
  { id: "c", delay: 4, kind: "comb" },
  { id: "v", delay: 1, kind: "po" },
];

export const EDGES = [
  { id: "e0", src: "u", dst: "a", w: 1 },
  { id: "e1", src: "a", dst: "b", w: 0 },
  { id: "e2", src: "b", dst: "c", w: 1 },
  { id: "e3", src: "c", dst: "v", w: 0 },
  { id: "e4", src: "a", dst: "c", w: 0 },
];

export const PERIOD_TARGET = 5;

export const GOLDENS = {
  nodeCount: 5,
  edgeCount: 5,
  baseRegisters: 2,
  combCount: 3,
  periodTarget: 5,
  baselinePeriod: 8,
  forwardAPeriod: 5,
  forwardARegisters: 3,
};

export const LAYOUT = {
  u: { x: 1.5, y: 4 },
  a: { x: 4, y: 4 },
  b: { x: 6.5, y: 5.5 },
  c: { x: 6.5, y: 2.5 },
  v: { x: 10, y: 4 },
};

export function cloneEdges(edges = EDGES) {
  return edges.map((e) => ({ ...e }));
}

export function zeroRetime(nodes = NODES) {
  const r = {};
  for (const n of nodes) r[n.id] = 0;
  return r;
}

export function graphStats(nodes = NODES, edges = EDGES) {
  return {
    nodes: nodes.length,
    edges: edges.length,
    registers: edges.reduce((s, e) => s + e.w, 0),
    comb: nodes.filter((n) => n.kind === "comb").length,
  };
}

export function retimeEdgeWeight(edge, r) {
  return edge.w + (r[edge.dst] || 0) - (r[edge.src] || 0);
}

export function applyRetime(edges, r) {
  return edges.map((e) => ({ ...e, w: retimeEdgeWeight(e, r) }));
}

export function isLegal(edges, r) {
  return edges.every((e) => retimeEdgeWeight(e, r) >= 0);
}

export function forwardRetime(node, r, amount = 1) {
  const out = { ...r };
  out[node] = (out[node] || 0) - amount;
  return out;
}

export function backwardRetime(node, r, amount = 1) {
  const out = { ...r };
  out[node] = (out[node] || 0) + amount;
  return out;
}

export function longestZeroWeightPathDelay(nodes = NODES, edges = EDGES) {
  const by = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const ids = nodes.map((n) => n.id);
  const succ = Object.fromEntries(ids.map((i) => [i, []]));
  for (const e of edges) {
    if (e.w === 0) succ[e.src].push(e.dst);
  }
  const indeg = Object.fromEntries(ids.map((i) => [i, 0]));
  for (const u of ids) for (const v of succ[u]) indeg[v]++;
  const queue = ids.filter((i) => indeg[i] === 0);
  const order = [];
  const indegMut = { ...indeg };
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (const v of succ[u]) {
      indegMut[v]--;
      if (indegMut[v] === 0) queue.push(v);
    }
  }
  if (order.length < ids.length) {
    return Math.max(...nodes.map((n) => n.delay));
  }
  const best = Object.fromEntries(ids.map((i) => [i, by[i].delay]));
  for (const u of order) {
    for (const v of succ[u]) {
      const cand = best[u] + by[v].delay;
      if (cand > best[v]) best[v] = cand;
    }
  }
  return Math.max(...Object.values(best));
}

export function clockPeriod(r = null, nodes = NODES, edges = EDGES) {
  const e = r ? applyRetime(edges, r) : edges;
  return longestZeroWeightPathDelay(nodes, e);
}

export function registerCount(r = null, edges = EDGES) {
  const e = r ? applyRetime(edges, r) : edges;
  return e.reduce((s, x) => s + x.w, 0);
}

export function feasCheck(period, r, nodes = NODES, edges = EDGES) {
  return isLegal(edges, r) && clockPeriod(r, nodes, edges) <= period + 1e-9;
}

export function minPeriodSearch(nodes = NODES, edges = EDGES) {
  const opts = [zeroRetime(nodes)];
  opts.push(forwardRetime("a", zeroRetime(nodes), 1));
  opts.push(backwardRetime("c", zeroRetime(nodes), 1));
  opts.push(forwardRetime("b", zeroRetime(nodes), 1));
  let best = null;
  let bestP = Infinity;
  const baseline = clockPeriod(null, nodes, edges);
  for (const r of opts) {
    if (!isLegal(edges, r)) continue;
    const p = clockPeriod(r, nodes, edges);
    if (p < bestP - 1e-12) {
      bestP = p;
      best = r;
    }
  }
  return {
    r: best,
    period: bestP,
    registers: registerCount(best, edges),
    baselinePeriod: baseline,
    improved: bestP < baseline - 1e-9,
  };
}

export function sequentialRetime(mode = "min_period", nodes = NODES, edges = EDGES) {
  const stats = graphStats(nodes, edges);
  if (mode === "forward_a") {
    const r = forwardRetime("a", zeroRetime(nodes), 1);
    return {
      mode,
      stats,
      r,
      legal: isLegal(edges, r),
      period: clockPeriod(r, nodes, edges),
      registers: registerCount(r, edges),
      baselinePeriod: clockPeriod(null, nodes, edges),
    };
  }
  return { mode, stats, ...minPeriodSearch(nodes, edges), legal: true };
}

export function drawRetiming(canvas, opts = {}) {
  const nodes = opts.nodes || NODES;
  const edges = opts.edges || EDGES;
  const r = opts.r || zeroRetime(nodes);
  const layout = opts.layout || LAYOUT;
  const highlight = new Set(opts.highlight || []);
  const selected = opts.selectedNode || null;
  const showWeights = opts.showWeights !== false;
  const drawn = applyRetime(edges, r);

  const { ctx, w, h } = fitHiDpiCanvas(canvas, { w: 640, h: LAB_CANVAS_CSS_HEIGHT });
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, w, h);
  const pad = 28;
  const CHIP_W = 12;
  const CHIP_H = 8;
  const scale = Math.min((w - 2 * pad) / CHIP_W, (h - 2 * pad) / CHIP_H);
  const ox = (w - CHIP_W * scale) / 2;
  const oy = h - pad - (h - 2 * pad - CHIP_H * scale) / 2;
  const toScreen = (x, y) => ({ sx: ox + x * scale, sy: oy - y * scale });

  for (const e of drawn) {
    const a = layout[e.src];
    const b = layout[e.dst];
    if (!a || !b) continue;
    const p0 = toScreen(a.x, a.y);
    const p1 = toScreen(b.x, b.y);
    const hot = highlight.has(e.id) || highlight.has(e.src) || highlight.has(e.dst);
    const illegal = e.w < 0;
    ctx.strokeStyle = illegal ? "#ef4444" : hot ? "rgba(234,179,8,0.95)" : "rgba(100,116,139,0.8)";
    ctx.lineWidth = hot || illegal ? 3.5 : 2.5;
    ctx.beginPath();
    ctx.moveTo(p0.sx, p0.sy);
    ctx.lineTo(p1.sx, p1.sy);
    ctx.stroke();
    if (showWeights) {
      const mx = (p0.sx + p1.sx) / 2;
      const my = (p0.sy + p1.sy) / 2;
      ctx.fillStyle = e.w > 0 ? "#f59e0b" : "#e2e8f0";
      ctx.beginPath();
      ctx.arc(mx, my, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.font = "12px ui-sans-serif, system-ui";
      ctx.fillText(String(e.w), mx - 4, my + 4);
    }
  }

  for (const n of nodes) {
    const p = layout[n.id];
    if (!p) continue;
    const { sx, sy } = toScreen(p.x, p.y);
    const active = selected === n.id || highlight.has(n.id);
    if (n.kind === "pi" || n.kind === "po") {
      ctx.fillStyle = n.kind === "pi" ? "#3b82f6" : "#ef4444";
      ctx.beginPath();
      ctx.arc(sx, sy, active ? 16 : 14, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = active ? "#22c55e" : "#4ade80";
      ctx.fillRect(sx - 18, sy - 14, 36, 28);
      ctx.strokeStyle = "#14532d";
      ctx.strokeRect(sx - 18, sy - 14, 36, 28);
    }
    ctx.fillStyle = "#0f172a";
    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.fillText(`${n.id}`, sx - 6, sy + 4);
    ctx.font = "10px ui-sans-serif, system-ui";
    ctx.fillText(`d=${n.delay}`, sx - 10, sy + 22);
    const rv = r[n.id] || 0;
    if (rv !== 0) {
      ctx.fillStyle = "#7c3aed";
      ctx.fillText(`r=${rv}`, sx - 10, sy - 18);
    }
  }

  if (opts.metricText) {
    ctx.fillStyle = "rgba(15,23,42,0.85)";
    ctx.fillRect(pad, pad - 4, 260, 22);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "13px ui-sans-serif, system-ui";
    ctx.fillText(opts.metricText, pad + 8, pad + 12);
  }

  return { scale, toScreen };
}

export function hitNode(layout, canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const w = canvas.clientWidth || rect.width || 640;
  const h = canvas.clientHeight || rect.height || LAB_CANVAS_CSS_HEIGHT;
  const pad = 28;
  const CHIP_W = 12;
  const CHIP_H = 8;
  const scale = Math.min((w - 2 * pad) / CHIP_W, (h - 2 * pad) / CHIP_H);
  const ox = (w - CHIP_W * scale) / 2;
  const oy = h - pad - (h - 2 * pad - CHIP_H * scale) / 2;
  const wx = (clientX - rect.left - ox) / scale;
  const wy = (oy - (clientY - rect.top)) / scale;
  let best = null;
  let bestD = 0.7;
  for (const [id, p] of Object.entries(layout)) {
    const d = Math.hypot(p.x - wx, p.y - wy);
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  }
  return best;
}
