/**
 * Harder partitioning instances — noise, irregular topology, terminals, critical nets.
 * Used to differentiate solvers under the composite scoreboard.
 */

function mulberry32(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function cloneGraph(g) {
  return {
    nodes: [...g.nodes],
    edges: g.edges.map((e) => ({ ...e })),
    sizes: { ...(g.sizes || {}) },
    terminals: g.terminals ? { ...g.terminals } : undefined,
    hedges: g.hedges ? g.hedges.map((h) => ({ pins: [...h.pins], w: h.w })) : undefined,
    meta: g.meta ? { ...g.meta } : undefined,
    rows: g.rows,
    cols: g.cols,
  };
}

/** Two communities with many noisy cross edges (weights 1–3). */
export function makeNoisyCommunities(half = 16, seed = 21) {
  const rng = mulberry32(seed);
  const h = Math.max(4, half);
  const left = Array.from({ length: h }, (_, i) => `L${i}`);
  const right = Array.from({ length: h }, (_, i) => `R${i}`);
  const nodes = [...left, ...right];
  const edges = [];
  const ring = (ids, w) => {
    for (let i = 0; i < ids.length; i++) {
      edges.push({ u: ids[i], v: ids[(i + 1) % ids.length], w });
      edges.push({ u: ids[i], v: ids[(i + 2) % ids.length], w: Math.max(1, w - 1) });
    }
  };
  ring(left, 5);
  ring(right, 5);
  for (let i = 0; i < h; i++) {
    if (i % 4 === 0) edges.push({ u: left[i], v: right[i], w: 1 });
  }
  const noiseN = Math.floor(h * 1.5);
  for (let k = 0; k < noiseN; k++) {
    const u = left[Math.floor(rng() * h)];
    const v = right[Math.floor(rng() * h)];
    edges.push({ u, v, w: 1 + Math.floor(rng() * 3) });
  }
  const sizes = Object.fromEntries(nodes.map((n) => [n, 1]));
  return {
    nodes,
    edges,
    sizes,
    meta: { kind: "noisy_communities", half: h },
  };
}

/** Preferential-attachment style irregular graph. */
export function makePreferentialGraph(n = 36, seed = 9) {
  const rng = mulberry32(seed);
  const nodes = Array.from({ length: n }, (_, i) => `A${i}`);
  const edges = [];
  const deg = Object.fromEntries(nodes.map((id) => [id, 0]));
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      edges.push({ u: nodes[i], v: nodes[j], w: 2 });
      deg[nodes[i]]++;
      deg[nodes[j]]++;
    }
  }
  for (let i = 3; i < n; i++) {
    const u = nodes[i];
    const targets = 2 + Math.floor(rng() * 2);
    const bag = [];
    for (const v of nodes.slice(0, i)) {
      for (let k = 0; k < Math.max(1, deg[v]); k++) bag.push(v);
    }
    const chosen = new Set();
    for (let t = 0; t < targets && bag.length; t++) {
      const v = bag[Math.floor(rng() * bag.length)];
      if (chosen.has(v)) continue;
      chosen.add(v);
      const w = 1 + Math.floor(rng() * 3);
      edges.push({ u, v, w });
      deg[u]++;
      deg[v]++;
    }
  }
  const sizes = Object.fromEntries(nodes.map((id) => [id, 1]));
  return { nodes, edges, sizes, meta: { kind: "preferential", n } };
}

/** Grid with long-range noisy chords. */
export function makePerturbedGrid(rows = 6, cols = 6, seed = 13) {
  const rng = mulberry32(seed);
  const nodes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) nodes.push(`G${r}_${c}`);
  }
  const id = (r, c) => `G${r}_${c}`;
  const edges = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols) edges.push({ u: id(r, c), v: id(r, c + 1), w: 1 });
      if (r + 1 < rows) edges.push({ u: id(r, c), v: id(r + 1, c), w: 1 });
    }
  }
  const chords = Math.floor(nodes.length * 0.35);
  for (let k = 0; k < chords; k++) {
    const a = nodes[Math.floor(rng() * nodes.length)];
    const b = nodes[Math.floor(rng() * nodes.length)];
    if (a === b) continue;
    edges.push({ u: a, v: b, w: 1 + Math.floor(rng() * 2) });
  }
  const sizes = Object.fromEntries(nodes.map((n) => [n, 1]));
  return { nodes, edges, sizes, rows, cols, meta: { kind: "perturbed_grid" } };
}

/** Community graph with fixed terminals. */
export function makeTerminalCommunities(half = 12, seed = 5) {
  const g = makeNoisyCommunities(half, seed);
  const left = g.nodes.filter((n) => n.startsWith("L"));
  const right = g.nodes.filter((n) => n.startsWith("R"));
  const terminals = {
    [left[0]]: "0",
    [left[1]]: "0",
    [right[0]]: "1",
    [right[1]]: "1",
  };
  return {
    ...g,
    terminals,
    meta: { ...(g.meta || {}), kind: "terminal_communities" },
  };
}

/** Mark a subset of cross edges as timing-critical. */
export function makeCriticalCommunities(half = 14, seed = 17) {
  const g = makeNoisyCommunities(half, seed);
  const left = g.nodes.filter((n) => n.startsWith("L"));
  const right = g.nodes.filter((n) => n.startsWith("R"));
  let marked = 0;
  for (const e of g.edges) {
    const cross =
      (e.u.startsWith("L") && e.v.startsWith("R")) ||
      (e.u.startsWith("R") && e.v.startsWith("L"));
    if (!cross) continue;
    if (marked < Math.max(4, Math.floor(half / 2))) {
      e.critical = true;
      e.w = Math.max(e.w, 4);
      marked++;
    }
  }
  if (marked === 0) {
    g.edges.push({ u: left[0], v: right[0], w: 5, critical: true });
    g.edges.push({ u: left[2], v: right[2], w: 5, critical: true });
  }
  return { ...g, meta: { ...(g.meta || {}), kind: "critical_communities" } };
}

/** Larger multi-bridge community. */
export function makeDenseCommunities(half = 18, seed = 29) {
  const rng = mulberry32(seed);
  const g = makeNoisyCommunities(half, seed + 1);
  const left = g.nodes.filter((n) => n.startsWith("L"));
  const right = g.nodes.filter((n) => n.startsWith("R"));
  for (let i = 0; i < left.length; i++) {
    for (let j = i + 3; j < left.length; j += 3) {
      if (rng() < 0.5) g.edges.push({ u: left[i], v: left[j], w: 2 });
    }
  }
  for (let i = 0; i < right.length; i++) {
    for (let j = i + 3; j < right.length; j += 3) {
      if (rng() < 0.5) g.edges.push({ u: right[i], v: right[j], w: 2 });
    }
  }
  return { ...g, meta: { ...(g.meta || {}), kind: "dense_communities" } };
}

function communityLayoutFromNodes(nodes) {
  const left = nodes.filter((n) => String(n).startsWith("L"));
  const right = nodes.filter((n) => !String(n).startsWith("L"));
  const place = (ids, cx, cy, r) => {
    const out = {};
    const n = Math.max(ids.length, 1);
    ids.forEach((id, i) => {
      const a = (2 * Math.PI * i) / n - Math.PI / 2;
      out[id] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
    return out;
  };
  return { ...place(left, 120, 180, 110), ...place(right, 380, 180, 110) };
}

function gridLayoutFromGraph(g) {
  const out = {};
  const rows = g.rows || 6;
  const cols = g.cols || 6;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `G${r}_${c}`;
      if (!g.nodes.includes(id)) continue;
      out[id] = { x: 40 + c * 55, y: 40 + r * 55 };
    }
  }
  return out;
}

function circleLayout(nodes) {
  const out = {};
  const n = nodes.length;
  nodes.forEach((id, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    out[id] = { x: 260 + 160 * Math.cos(a), y: 200 + 160 * Math.sin(a) };
  });
  return out;
}

function registerHard(id, title, build, layoutFn, notes) {
  const template = build();
  return {
    id,
    title,
    nNodes: template.nodes.length,
    hard: true,
    graph: () => cloneGraph(build()),
    seedAssignment: (g) => {
      const order = [...g.nodes].sort((a, b) => {
        const ra = mulberry32(a.charCodeAt(0) * 13 + id.length)();
        const rb = mulberry32(b.charCodeAt(0) * 13 + id.length)();
        return ra - rb || (a < b ? -1 : 1);
      });
      const half = Math.floor(order.length / 2);
      const left = new Set(order.slice(0, half));
      const asn = Object.fromEntries(g.nodes.map((n) => [n, left.has(n) ? "0" : "1"]));
      if (g.terminals) {
        for (const [n, p] of Object.entries(g.terminals)) asn[n] = String(p);
      }
      return asn;
    },
    layout: () => layoutFn(template),
    notes,
  };
}

/** Hard suite registry entries (merged into BENCHMARK_INSTANCES). */
export const HARD_BENCHMARK_INSTANCES = {
  noisy32: registerHard(
    "noisy32",
    "Hard · Noisy communities (32)",
    () => makeNoisyCommunities(16, 21),
    (t) => communityLayoutFromNodes(t.nodes),
    "Two communities + many noisy cross edges. Differentiates cut quality."
  ),
  pref36: registerHard(
    "pref36",
    "Hard · Preferential (36)",
    () => makePreferentialGraph(36, 9),
    (t) => circleLayout(t.nodes),
    "Irregular degree structure — spectral/grow diverge more."
  ),
  grid6x6n: registerHard(
    "grid6x6n",
    "Hard · Perturbed grid 6×6",
    () => makePerturbedGrid(6, 6, 13),
    (t) => gridLayoutFromGraph(t),
    "Grid plus random long-range chords."
  ),
  term24: registerHard(
    "term24",
    "Hard · Terminals (24)",
    () => makeTerminalCommunities(12, 5),
    (t) => communityLayoutFromNodes(t.nodes),
    "Fixed terminals on both sides — violations count in ranking."
  ),
  crit28: registerHard(
    "crit28",
    "Hard · Critical nets (28)",
    () => makeCriticalCommunities(14, 17),
    (t) => communityLayoutFromNodes(t.nodes),
    "Timing-critical cross edges; critical-net cut is scored."
  ),
  dense36: registerHard(
    "dense36",
    "Hard · Dense communities (36)",
    () => makeDenseCommunities(18, 29),
    (t) => communityLayoutFromNodes(t.nodes),
    "Dense intra-community links + noise bridges."
  ),
};

export const HARD_SUITE = Object.keys(HARD_BENCHMARK_INSTANCES);
