/**
 * Tiny clock-tree instance (12×8 chip, six sinks A–F, source at chip center).
 * Mirrors learn_routing spread placement for PD spine continuity.
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const CELLS = ["A", "B", "C", "D", "E", "F"];

export const CHIP_W = 12;
export const CHIP_H = 8;

/** Spread placement — same as learn_routing / learn_global_routing. */
export const PLACEMENT = {
  A: { x: 1, y: 1 },
  B: { x: 8, y: 1 },
  C: { x: 1, y: 5 },
  D: { x: 8, y: 5 },
  E: { x: 5, y: 3 },
  F: { x: 6, y: 3 },
};

export const CLOCK_SOURCE = { x: 6, y: 4 };

/**
 * Skew goldens on spread PLACEMENT (wire delay = Manhattan distance).
 * Recompute with: node --input-type=module -e "import('./platform/assets/clock-tree-core.js')..."
 */
export const GOLDENS = {
  sinkCount: 6,
  sourceX: 6,
  sourceY: 4,
  spreadHTreeSkew: 2,
  spreadMmmSkew: 3,
  spreadZeroSkewMergeSkew: 0,
  spreadBufferedSkew: 1,
  spreadSequentialSkew: 4,
  skewBoundDefault: 2,
  maxWireLenDefault: 4,
  bufferDelay: 1,
};

export function clonePositions(pos) {
  const out = {};
  for (const [id, p] of Object.entries(pos)) out[id] = { x: p.x, y: p.y };
  return out;
}

export function sinkPoints(positions = PLACEMENT) {
  return CELLS.map((id) => {
    const p = positions[id] || PLACEMENT[id] || { x: 0, y: 0 };
    return { id, x: p.x, y: p.y };
  });
}

export function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function samePoint(a, b, eps = 1e-6) {
  return Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps;
}

function pushSteiner(steiners, pt) {
  if (!steiners.some((s) => samePoint(s, pt))) steiners.push({ x: pt.x, y: pt.y });
}

/** L-route (HV) between two points; returns axis-aligned segments. */
export function lSegments(a, b) {
  if (samePoint(a, b)) return [];
  if (a.x === b.x || a.y === b.y) return [{ x1: a.x, y1: a.y, x2: b.x, y2: b.y }];
  const mid = { x: b.x, y: b.y };
  return [
    { x1: a.x, y1: a.y, x2: mid.x, y2: a.y },
    { x1: mid.x, y1: a.y, x2: b.x, y2: b.y },
  ];
}

function appendSegments(edges, steiners, a, b) {
  for (const seg of lSegments(a, b)) {
    edges.push(seg);
    if (seg.x1 !== seg.x2 && seg.y1 !== seg.y2) {
      pushSteiner(steiners, { x: seg.x1, y: seg.y2 });
    }
  }
}

function emptyTree(positions = PLACEMENT, source = CLOCK_SOURCE) {
  return {
    source: { ...source },
    sinks: sinkPoints(positions),
    edges: [],
    steiners: [],
    buffers: [],
  };
}

/** Recursive H-tree on sink set; alternates horizontal / vertical splits. */
export function hTree(positions = PLACEMENT, source = CLOCK_SOURCE) {
  const sinks = sinkPoints(positions);
  const edges = [];
  const steiners = [];

  function build(pts, root, horizontal) {
    if (!pts.length) return;
    if (pts.length === 1) {
      appendSegments(edges, steiners, root, pts[0]);
      return;
    }
    const key = horizontal ? "x" : "y";
    const sorted = [...pts].sort((a, b) => a[key] - b[key]);
    const mid = Math.floor(sorted.length / 2);
    const left = sorted.slice(0, mid);
    const right = sorted.slice(mid);
    const avg = (arr) => arr.reduce((s, p) => s + p[key], 0) / arr.length;
    const sL = horizontal ? { x: avg(left), y: root.y } : { x: root.x, y: avg(left) };
    const sR = horizontal ? { x: avg(right), y: root.y } : { x: root.x, y: avg(right) };
    appendSegments(edges, steiners, root, sL);
    appendSegments(edges, steiners, root, sR);
    pushSteiner(steiners, sL);
    pushSteiner(steiners, sR);
    build(left, sL, !horizontal);
    build(right, sR, !horizontal);
  }

  build(sinks, source, true);
  return { source: { ...source }, sinks, edges, steiners, buffers: [] };
}

/** Greedy minimum-matching merge (MMM) — repeatedly merge closest fragment roots. */
export function mmmTree(positions = PLACEMENT, source = CLOCK_SOURCE) {
  let fragments = sinkPoints(positions).map((s) => ({
    root: { x: s.x, y: s.y },
    edges: [],
  }));

  while (fragments.length > 1) {
    let bestD = Infinity;
    let bestI = 0;
    let bestJ = 1;
    for (let i = 0; i < fragments.length; i++) {
      for (let j = i + 1; j < fragments.length; j++) {
        const d = manhattan(fragments[i].root, fragments[j].root);
        if (d < bestD) {
          bestD = d;
          bestI = i;
          bestJ = j;
        }
      }
    }
    const f1 = fragments[bestI];
    const f2 = fragments[bestJ];
    const merge = {
      x: (f1.root.x + f2.root.x) / 2,
      y: (f1.root.y + f2.root.y) / 2,
    };
    const merged = {
      root: merge,
      edges: [
        ...f1.edges,
        ...f2.edges,
        { x1: merge.x, y1: merge.y, x2: f1.root.x, y2: f1.root.y },
        { x1: merge.x, y1: merge.y, x2: f2.root.x, y2: f2.root.y },
      ],
    };
    fragments = fragments.filter((_, k) => k !== bestI && k !== bestJ);
    fragments.push(merged);
  }

  const trunk = fragments[0];
  const edges = [...trunk.edges];
  const steiners = [{ ...trunk.root }];
  appendSegments(edges, steiners, source, trunk.root);
  return {
    source: { ...source },
    sinks: sinkPoints(positions),
    edges,
    steiners,
    buffers: [],
  };
}

/**
 * Zero-skew merge demo: balance two partial trees by meeting at a steiner
 * whose max sink latency matches on both sides.
 */
export function zeroSkewMerge(positions = PLACEMENT, source = CLOCK_SOURCE) {
  const sinks = sinkPoints(positions);
  const left = sinks.filter((s) => s.x <= source.x);
  const right = sinks.filter((s) => s.x > source.x);
  const edges = [];
  const steiners = [];

  function subtreeMax(root, pts) {
    if (!pts.length) return 0;
    return Math.max(...pts.map((p) => manhattan(root, p)));
  }

  const lRoot = { x: source.x - 1.5, y: source.y };
  const rRoot = { x: source.x + 1.5, y: source.y };
  const lMax = subtreeMax(lRoot, left);
  const rMax = subtreeMax(rRoot, right);
  const meetY = source.y + (lMax - rMax) / 2;
  const merge = { x: source.x, y: meetY };

  appendSegments(edges, steiners, source, merge);
  pushSteiner(steiners, merge);
  for (const s of left) appendSegments(edges, steiners, merge, s);
  for (const s of right) appendSegments(edges, steiners, merge, s);

  return {
    source: { ...source },
    sinks,
    edges,
    steiners,
    buffers: [],
  };
}

/** Branch tap points — steiner nodes with three or more incident segments. */
export function tappingPoints(tree) {
  const pts = [];
  const add = (x, y) => {
    if (!pts.some((p) => samePoint(p, { x, y }))) pts.push({ x, y });
  };
  add(tree.source.x, tree.source.y);
  for (const s of tree.steiners || []) add(s.x, s.y);
  for (const e of tree.edges || []) {
    add(e.x1, e.y1);
    add(e.x2, e.y2);
  }
  const deg = {};
  const key = (x, y) => `${x.toFixed(4)},${y.toFixed(4)}`;
  for (const e of tree.edges || []) {
    for (const [x, y] of [
      [e.x1, e.y1],
      [e.x2, e.y2],
    ]) {
      const k = key(x, y);
      deg[k] = (deg[k] || 0) + 1;
    }
  }
  return pts.filter((p) => (deg[key(p.x, p.y)] || 0) >= 3);
}

function graphFromTree(tree) {
  const nodes = new Map();
  const edges = [];
  const addNode = (x, y, meta = {}) => {
    const k = `${x.toFixed(4)},${y.toFixed(4)}`;
    if (!nodes.has(k)) nodes.set(k, { x, y, k, ...meta });
    return k;
  };
  addNode(tree.source.x, tree.source.y, { kind: "source" });
  for (const s of tree.sinks || []) addNode(s.x, s.y, { kind: "sink", id: s.id });
  for (const s of tree.steiners || []) addNode(s.x, s.y, { kind: "steiner" });
  for (const b of tree.buffers || []) addNode(b.x, b.y, { kind: "buffer" });
  for (const e of tree.edges || []) {
    const a = addNode(e.x1, e.y1);
    const b = addNode(e.x2, e.y2);
    const len = manhattan({ x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 });
    edges.push({ a, b, len });
  }
  return { nodes, edges };
}

function pathFromSource(tree, target) {
  if (!target || target.x == null || target.y == null) return { length: Infinity, keys: [] };
  const { nodes, edges } = graphFromTree(tree);
  const srcK = `${tree.source.x.toFixed(4)},${tree.source.y.toFixed(4)}`;
  const tgtK = `${target.x.toFixed(4)},${target.y.toFixed(4)}`;
  const adj = {};
  for (const e of edges) {
    if (!adj[e.a]) adj[e.a] = [];
    if (!adj[e.b]) adj[e.b] = [];
    adj[e.a].push({ k: e.b, len: e.len });
    adj[e.b].push({ k: e.a, len: e.len });
  }
  const q = [srcK];
  const dist = { [srcK]: 0 };
  const prev = {};
  while (q.length) {
    const cur = q.shift();
    if (cur === tgtK) break;
    for (const nb of adj[cur] || []) {
      if (dist[nb.k] == null) {
        dist[nb.k] = dist[cur] + nb.len;
        prev[nb.k] = cur;
        q.push(nb.k);
      }
    }
  }
  if (dist[tgtK] == null) return { length: Infinity, keys: [] };
  const keys = [];
  let cur = tgtK;
  while (cur) {
    keys.unshift(cur);
    cur = prev[cur];
  }
  return { length: dist[tgtK], keys };
}

/** Wire latency from source to sink (Manhattan along tree). */
export function latency(tree, sinkId, positions = PLACEMENT) {
  const sink = sinkPoints(positions).find((s) => s.id === sinkId);
  if (!sink) return Infinity;
  return pathFromSource(tree, sink).length;
}

/** Max − min sink latency. */
export function skew(tree, positions = PLACEMENT) {
  const lats = CELLS.map((id) => latency(tree, id, positions));
  const finite = lats.filter((v) => Number.isFinite(v));
  if (!finite.length) return Infinity;
  return Math.max(...finite) - Math.min(...finite);
}

/** Split long edges; place buffers at segment joints. */
export function insertBuffers(tree, maxWireLen = GOLDENS.maxWireLenDefault) {
  const edges = [];
  const buffers = [...(tree.buffers || [])];
  for (const e of tree.edges || []) {
    const len = manhattan({ x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 });
    if (len <= maxWireLen + 1e-9) {
      edges.push(e);
      continue;
    }
    const dx = e.x2 - e.x1;
    const dy = e.y2 - e.y1;
    const steps = Math.ceil(len / maxWireLen);
    let px = e.x1;
    let py = e.y1;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const nx = e.x1 + dx * t;
      const ny = e.y1 + dy * t;
      edges.push({ x1: px, y1: py, x2: nx, y2: ny });
      if (i < steps) {
        const buf = { x: nx, y: ny };
        buffers.push(buf);
      }
      px = nx;
      py = ny;
    }
  }
  return { ...tree, edges, buffers };
}

/** Latencies after buffer insertion (wire + buffer delay per buffer on path). */
export function bufferedLatencies(tree, positions = PLACEMENT, bufferDelay = GOLDENS.bufferDelay) {
  const out = {};
  for (const id of CELLS) {
    const sink = sinkPoints(positions).find((s) => s.id === id);
    const { keys } = pathFromSource(tree, sink);
    let wire = 0;
    let bufs = 0;
    const { nodes, edges } = graphFromTree(tree);
    for (let i = 0; i < keys.length - 1; i++) {
      const e = edges.find(
        (ed) =>
          (ed.a === keys[i] && ed.b === keys[i + 1]) || (ed.b === keys[i] && ed.a === keys[i + 1])
      );
      if (e) wire += e.len;
    }
    for (const k of keys) {
      const n = nodes.get(k);
      if (n?.kind === "buffer") bufs += 1;
    }
    out[id] = wire + bufs * bufferDelay;
  }
  return out;
}

export function skewBoundOk(tree, bound = GOLDENS.skewBoundDefault, positions = PLACEMENT) {
  return skew(tree, positions) <= bound + 1e-9;
}

/** Connect sinks one-by-one to nearest existing tree node. */
export function sequentialCts(positions = PLACEMENT, order = CELLS, source = CLOCK_SOURCE) {
  const edges = [];
  const steiners = [];
  const nodes = [{ ...source }];

  for (const id of order) {
    const p = positions[id];
    const sink = { id, x: p.x, y: p.y };
    let best = nodes[0];
    let bestD = manhattan(nodes[0], sink);
    for (const n of nodes) {
      const d = manhattan(n, sink);
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    }
    appendSegments(edges, steiners, best, sink);
    nodes.push(sink);
    for (const s of steiners) {
      if (!nodes.some((n) => samePoint(n, s))) nodes.push({ ...s });
    }
  }

  return {
    source: { ...source },
    sinks: sinkPoints(positions),
    edges,
    steiners,
    buffers: [],
  };
}

/** Matches partition-benchmark-plots PALETTE (paper figures). */
const PAPER_PALETTE = [
  "#1d4ed8",
  "#0f6b5c",
  "#b45309",
  "#9f1239",
  "#6d28d9",
  "#c2410c",
  "#0369a1",
  "#a21caf",
  "#4f46e5",
  "#ca8a04",
];
const PAPER_FONT =
  "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const LAB_SINK_COLORS = {
  A: "#ef4444",
  B: "#f97316",
  C: "#22c55e",
  D: "#3b82f6",
  E: "#a855f7",
  F: "#ec4899",
};

function paperSinkColor(id, index) {
  const i = CELLS.indexOf(id);
  return PAPER_PALETTE[(i >= 0 ? i : index) % PAPER_PALETTE.length];
}

export function drawClockTree(canvas, opts = {}) {
  const positions = opts.positions || PLACEMENT;
  const tree = opts.tree || emptyTree(positions);
  const selectedSink = opts.selectedSink || null;
  const highlight = new Set(opts.highlight || []);
  const paper = !!opts.paper;
  const ink = paper ? "#000000" : "#0f172a";
  const bg = paper ? "#ffffff" : null;
  const grid = paper ? "#e5e5e5" : "#cbd5e1";
  const edgeColor = paper ? "#334155" : "rgba(14,165,233,0.75)";
  const edgeHot = paper ? "#b45309" : "rgba(234,179,8,0.95)";
  const chipStroke = paper ? "#000000" : "#334155";
  const bufFill = paper ? PAPER_PALETTE[2] : "#f59e0b";
  const bufStroke = paper ? "#000000" : "#92400e";
  const srcFill = paper ? "#000000" : "#eab308";
  const labelFont = paper
    ? `bold 12px ${PAPER_FONT}`
    : "12px ui-sans-serif, system-ui";
  const metricFont = paper
    ? `bold 13px ${PAPER_FONT}`
    : "13px ui-sans-serif, system-ui";

  if (paper) canvas.style.background = "#ffffff";

  const { ctx, w, h } = fitHiDpiCanvas(canvas, { w: 640, h: LAB_CANVAS_CSS_HEIGHT });
  ctx.clearRect(0, 0, w, h);
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }
  const pad = 28;
  const legendH = paper ? 28 : 0;
  const scale = Math.min((w - 2 * pad) / CHIP_W, (h - 2 * pad - legendH) / CHIP_H);
  const ox = (w - CHIP_W * scale) / 2;
  const oy = h - pad - legendH - (h - 2 * pad - legendH - CHIP_H * scale) / 2;
  const toScreen = (x, y) => ({ sx: ox + x * scale, sy: oy - y * scale });

  ctx.strokeStyle = grid;
  ctx.lineWidth = paper ? 1.1 : 1;
  for (let x = 0; x <= CHIP_W; x++) {
    const a = toScreen(x, 0);
    const b = toScreen(x, CHIP_H);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }
  for (let y = 0; y <= CHIP_H; y++) {
    const a = toScreen(0, y);
    const b = toScreen(CHIP_W, y);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }

  const pathKeys =
    selectedSink != null
      ? pathFromSource(tree, sinkPoints(positions).find((s) => s.id === selectedSink))
          .keys
      : [];

  for (const e of tree.edges || []) {
    const p0 = toScreen(e.x1 + 0.5, e.y1 + 0.5);
    const p1 = toScreen(e.x2 + 0.5, e.y2 + 0.5);
    const onPath =
      selectedSink != null &&
      pathKeys.some((k) => {
        const [x, y] = k.split(",").map(Number);
        return (
          (samePoint({ x, y }, { x: e.x1, y: e.y1 }) &&
            samePoint({ x, y }, { x: e.x2, y: e.y2 })) ||
          (Math.abs(x - e.x1) < 0.01 && Math.abs(y - e.y1) < 0.01) ||
          (Math.abs(x - e.x2) < 0.01 && Math.abs(y - e.y2) < 0.01)
        );
      });
    ctx.strokeStyle = onPath ? edgeHot : edgeColor;
    ctx.lineWidth = onPath ? (paper ? 3.25 : 3.5) : paper ? 2.25 : 2.5;
    ctx.beginPath();
    ctx.moveTo(p0.sx, p0.sy);
    ctx.lineTo(p1.sx, p1.sy);
    ctx.stroke();
  }

  for (const b of tree.buffers || []) {
    const { sx, sy } = toScreen(b.x, b.y);
    ctx.fillStyle = bufFill;
    ctx.fillRect(sx - 6, sy - 6, 12, 12);
    ctx.strokeStyle = bufStroke;
    ctx.lineWidth = paper ? 1.75 : 1.5;
    ctx.strokeRect(sx - 6, sy - 6, 12, 12);
  }

  const src = tree.source || CLOCK_SOURCE;
  const srcSc = toScreen(src.x, src.y);
  ctx.fillStyle = srcFill;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const r = highlight.has("__source") ? 12 : 9;
    const x = srcSc.sx + Math.cos(a) * r;
    const y = srcSc.sy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  if (paper) {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.fillStyle = paper ? ink : "#713f12";
  ctx.font = paper ? `bold 11px ${PAPER_FONT}` : "11px ui-sans-serif, system-ui";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("CLK", srcSc.sx + 10, srcSc.sy - 6);

  CELLS.forEach((id, i) => {
    const p = positions[id];
    if (!p) return;
    const { sx, sy } = toScreen(p.x, p.y);
    const active = selectedSink === id || highlight.has(id);
    ctx.beginPath();
    ctx.arc(sx, sy, active ? 10 : 7, 0, Math.PI * 2);
    ctx.fillStyle = paper ? paperSinkColor(id, i) : LAB_SINK_COLORS[id] || "#1e293b";
    ctx.fill();
    ctx.strokeStyle = paper ? ink : active ? "#0f172a" : "rgba(15,23,42,0.35)";
    ctx.lineWidth = paper ? 1.5 : active ? 2 : 1;
    ctx.stroke();
    ctx.fillStyle = ink;
    ctx.font = labelFont;
    ctx.fillText(id, sx + 8, sy - 8);
  });

  const origin = toScreen(0, CHIP_H);
  ctx.strokeStyle = chipStroke;
  ctx.lineWidth = paper ? 2.25 : 2;
  ctx.strokeRect(origin.sx, origin.sy, CHIP_W * scale, CHIP_H * scale);

  if (paper) {
    const ly = h - Math.round(legendH / 2) - 2;
    let lx = pad;
    ctx.font = `bold 12px ${PAPER_FONT}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    // CLK star swatch
    ctx.fillStyle = srcFill;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const x = lx + 6 + Math.cos(a) * 6;
      const y = ly + Math.sin(a) * 6;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.25;
    ctx.stroke();
    ctx.fillStyle = ink;
    ctx.fillText("CLK", lx + 16, ly);
    lx += ctx.measureText("CLK").width + 36;
    CELLS.forEach((id, i) => {
      ctx.beginPath();
      ctx.arc(lx + 5, ly, 5, 0, Math.PI * 2);
      ctx.fillStyle = paperSinkColor(id, i);
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.fillText(id, lx + 14, ly);
      lx += ctx.measureText(id).width + 28;
    });
    if ((tree.buffers || []).length) {
      ctx.fillStyle = bufFill;
      ctx.fillRect(lx, ly - 5, 11, 11);
      ctx.strokeStyle = ink;
      ctx.strokeRect(lx, ly - 5, 11, 11);
      ctx.fillStyle = ink;
      ctx.fillText("BUF", lx + 16, ly);
    }
  }

  if (opts.showSkew !== false && (tree.edges?.length || 0) > 0) {
    const sk = skew(tree, positions);
    if (paper) {
      ctx.fillStyle = ink;
      ctx.font = metricFont;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(`skew: ${sk.toFixed(2)}`, pad, pad + 8);
    } else {
      ctx.fillStyle = "rgba(15,23,42,0.82)";
      ctx.fillRect(pad, pad - 4, 132, 22);
      ctx.fillStyle = "#f8fafc";
      ctx.font = metricFont;
      ctx.fillText(`skew: ${sk.toFixed(2)}`, pad + 8, pad + 12);
    }
  }

  return { scale, ox, oy, toScreen };
}

export function canvasToPoint(canvas, clientX, clientY) {
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

export function hitSink(positions, canvas, clientX, clientY) {
  const world = canvasToPoint(canvas, clientX, clientY);
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
