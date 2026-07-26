/**
 * Tiny multi-patterning — DP/TP/QP coloring + SADP/stitch for learn_multi_patterning.
 * Features A–F; triangle A-B-C blocks DP; path D-E-F 2-colorable; TP best_masks=3.
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const CHIP = { x0: 0, y0: 0, x1: 24, y1: 12 };
export const MIN_SAME_MASK = 2;

export const STARTER = [
  { id: "A", x0: 1, y0: 1, x1: 4, y1: 4 },
  { id: "B", x0: 5, y0: 1, x1: 8, y1: 4 },
  { id: "C", x0: 3, y0: 5, x1: 6, y1: 8 },
  { id: "D", x0: 10, y0: 1, x1: 13, y1: 4 },
  { id: "E", x0: 14, y0: 1, x1: 17, y1: 4 },
  { id: "F", x0: 18, y0: 1, x1: 21, y1: 4 },
];

export const GOLDENS = {
  featureCount: 6,
  conflictEdges: 5,
  dpColorable: false,
  pathDpColorable: true,
  tpColorsUsed: 3,
  qpColorsUsed: 3,
  sadpMandrelCount: 3,
  stitchMakesDp: true,
  engineBestMasks: 3,
};

const MASK_COLORS = ["#2a6f97", "#bc4749", "#6a994e", "#e09f3e", "#9b2226"];

export function cloneFeatures(feats = STARTER) {
  return feats.map((f) => ({ ...f }));
}

export function bboxGap(a, b) {
  const dx = Math.max(0, Math.max(a.x0 - b.x1, b.x0 - a.x1));
  const dy = Math.max(0, Math.max(a.y0 - b.y1, b.y0 - a.y1));
  if (dx === 0 && dy === 0) return 0;
  return Math.floor(Math.hypot(dx, dy));
}

export function geometryStats(features = STARTER) {
  return {
    featureCount: features.length,
    minSameMask: MIN_SAME_MASK,
    ids: features.map((f) => f.id),
  };
}

export function buildConflictGraph(features = STARTER, minSame = MIN_SAME_MASK) {
  const nodes = features.map((f) => f.id);
  const edges = [];
  const adj = Object.fromEntries(nodes.map((n) => [n, []]));
  for (let i = 0; i < features.length; i++) {
    for (let j = i + 1; j < features.length; j++) {
      const a = features[i];
      const b = features[j];
      const g = bboxGap(a, b);
      if (g < minSame) {
        edges.push([a.id, b.id, g]);
        adj[a.id].push(b.id);
        adj[b.id].push(a.id);
      }
    }
  }
  return { nodes, edges, adj, minSameMask: minSame, edgeCount: edges.length };
}

export function isBipartite(graph, subset = null) {
  const nodes = subset || graph.nodes;
  const nodeSet = new Set(nodes);
  const color = {};
  for (const start of nodes) {
    if (color[start] != null) continue;
    color[start] = 0;
    const q = [start];
    while (q.length) {
      const u = q.shift();
      for (const v of graph.adj[u] || []) {
        if (!nodeSet.has(v)) continue;
        if (color[v] == null) {
          color[v] = 1 - color[u];
          q.push(v);
        } else if (color[v] === color[u]) {
          return { ok: false, colors: color, conflict: [u, v] };
        }
      }
    }
  }
  return { ok: true, colors: color, conflict: null };
}

export function leleDouble(features = STARTER) {
  const g = buildConflictGraph(features);
  const r = isBipartite(g);
  return {
    ok: r.ok,
    colors: r.colors,
    masks: r.ok ? 2 : null,
    conflict: r.conflict,
    edgeCount: g.edgeCount,
    graph: g,
  };
}

export function pathLele(features = STARTER) {
  const g = buildConflictGraph(features);
  const r = isBipartite(g, ["D", "E", "F"].filter((id) => g.nodes.includes(id)));
  return { ok: r.ok, colors: r.colors };
}

export function colorGreedy(graph, k) {
  const colors = {};
  for (const u of graph.nodes) {
    const used = new Set((graph.adj[u] || []).map((v) => colors[v]).filter((c) => c != null));
    let assigned = null;
    for (let c = 1; c <= k; c++) {
      if (!used.has(c)) {
        assigned = c;
        break;
      }
    }
    if (assigned == null) return { ok: false, colors, failed: u, k };
    colors[u] = assigned;
  }
  const usedN = Math.max(...Object.values(colors), 0);
  return { ok: true, colors, colorsUsed: usedN, k };
}

export function colorBacktrack(graph, k) {
  const nodes = graph.nodes;
  const colors = {};
  const ok = (u, c) => (graph.adj[u] || []).every((v) => colors[v] !== c);
  function rec(i) {
    if (i === nodes.length) return true;
    const u = nodes[i];
    for (let c = 1; c <= k; c++) {
      if (!ok(u, c)) continue;
      colors[u] = c;
      if (rec(i + 1)) return true;
      delete colors[u];
    }
    return false;
  }
  const success = rec(0);
  const used = success ? Math.max(...Object.values(colors), 0) : 0;
  return { ok: success, colors: { ...colors }, colorsUsed: used, k };
}

export function triplePattern(features = STARTER, method = "backtrack") {
  const g = buildConflictGraph(features);
  const r = method === "backtrack" ? colorBacktrack(g, 3) : colorGreedy(g, 3);
  return { ...r, masks: r.ok ? 3 : null, method, graph: g };
}

export function quadPattern(features = STARTER, method = "greedy") {
  const g = buildConflictGraph(features);
  const r = method === "greedy" ? colorGreedy(g, 4) : colorBacktrack(g, 4);
  return { ...r, masks: r.ok ? 4 : null, method, graph: g };
}

export function sadpAssign(features = STARTER) {
  const g = buildConflictGraph(features);
  const mandrels = [];
  const blocked = new Set();
  for (const u of g.nodes) {
    if (blocked.has(u)) continue;
    mandrels.push(u);
    blocked.add(u);
    for (const v of g.adj[u] || []) blocked.add(v);
  }
  const spacers = g.nodes.filter((n) => !mandrels.includes(n));
  return { mandrels, spacers, mandrelCount: mandrels.length, ok: true, graph: g };
}

export function stitchFeature(features = STARTER, featureId = "C") {
  const feats = features.filter((f) => f.id !== featureId).map((f) => ({ ...f }));
  feats.push({ id: "C1", x0: 1, y0: 5, x1: 3, y1: 7 });
  feats.push({ id: "C2", x0: 6, y0: 5, x1: 8, y1: 7 });
  const g = buildConflictGraph(feats);
  const r = isBipartite(g);
  return {
    features: feats,
    removed: featureId,
    added: ["C1", "C2"],
    dpOk: r.ok,
    colors: r.colors,
    edgeCount: g.edgeCount,
    graph: g,
  };
}

export function mpEngine(features = STARTER) {
  const dp = leleDouble(features);
  const tp = triplePattern(features, "backtrack");
  const qp = quadPattern(features, "greedy");
  let best = null;
  if (dp.ok) best = 2;
  else if (tp.ok) best = 3;
  else if (qp.ok) best = 4;
  return {
    dpOk: dp.ok,
    tpOk: tp.ok,
    qpOk: qp.ok,
    tpColorsUsed: tp.colorsUsed,
    qpColorsUsed: qp.colorsUsed,
    bestMasks: best,
    sadp: sadpAssign(features),
    colors: tp.ok ? tp.colors : qp.colors,
  };
}

function worldToScreen(chip, canvas) {
  const pad = 28;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const sx = (w - 2 * pad) / (chip.x1 - chip.x0);
  const sy = (h - 2 * pad) / (chip.y1 - chip.y0);
  const s = Math.min(sx, sy);
  const ox = pad + (w - 2 * pad - s * (chip.x1 - chip.x0)) / 2;
  const oy = pad + (h - 2 * pad - s * (chip.y1 - chip.y0)) / 2;
  return {
    map(x, y) {
      return { x: ox + (x - chip.x0) * s, y: oy + (chip.y1 - y) * s };
    },
  };
}

export function drawMultiPatterning(canvas, opts = {}) {
  const features = opts.features || STARTER;
  const chip = opts.chip || CHIP;
  const selected = opts.selected || null;
  const highlight = new Set(opts.highlight || []);
  const colors = opts.colors || null;
  const graph = opts.graph || null;
  const mandrels = new Set(opts.mandrels || []);
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

  if (graph) {
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    for (const [a, b] of graph.edges) {
      const fa = features.find((f) => f.id === a);
      const fb = features.find((f) => f.id === b);
      if (!fa || !fb) continue;
      const pa = t.map((fa.x0 + fa.x1) / 2, (fa.y0 + fa.y1) / 2);
      const pb = t.map((fb.x0 + fb.x1) / 2, (fb.y0 + fb.y1) / 2);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }
  }

  for (const f of features) {
    const p0 = t.map(f.x0, f.y0);
    const p1 = t.map(f.x1, f.y1);
    const x = Math.min(p0.x, p1.x);
    const y = Math.min(p0.y, p1.y);
    const w = Math.abs(p1.x - p0.x);
    const h = Math.abs(p0.y - p1.y);
    let col = "#555";
    if (colors && colors[f.id] != null) {
      const ci = typeof colors[f.id] === "number" ? colors[f.id] : 0;
      col = MASK_COLORS[(ci - (ci >= 1 ? 1 : 0)) % MASK_COLORS.length];
    } else if (mandrels.has(f.id)) col = "#2a6f97";
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = col;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
    ctx.lineWidth = selected === f.id || highlight.has(f.id) ? 3 : 1.5;
    ctx.strokeStyle = selected === f.id ? "#111" : col;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#222";
    ctx.font = "12px ui-monospace, monospace";
    const tag = colors && colors[f.id] != null ? `${f.id}:${colors[f.id]}` : f.id;
    ctx.fillText(tag, x + 4, y + 14);
  }

  if (metricText) {
    ctx.fillStyle = "#333";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(metricText, 12, 18);
  }
}

export function hitFeature(features, canvas, clientX, clientY, chip = CHIP) {
  const rect = canvas.getBoundingClientRect();
  const mx = clientX - rect.left;
  const my = clientY - rect.top;
  const t = worldToScreen(chip, canvas);
  for (let i = features.length - 1; i >= 0; i--) {
    const f = features[i];
    const p0 = t.map(f.x0, f.y0);
    const p1 = t.map(f.x1, f.y1);
    const x0 = Math.min(p0.x, p1.x);
    const x1 = Math.max(p0.x, p1.x);
    const y0 = Math.min(p0.y, p1.y);
    const y1 = Math.max(p0.y, p1.y);
    if (mx >= x0 && mx <= x1 && my >= y0 && my <= y1) return f.id;
  }
  return null;
}
