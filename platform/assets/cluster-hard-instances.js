/**
 * Harder clustering instances — noise, irregular topology, terminals, critical nets, multi-pin nets.
 * Reuses partition hard generators; adds a hypergraph-heavy instance.
 */
import {
  HARD_BENCHMARK_INSTANCES as PARTITION_HARD,
  HARD_SUITE as PARTITION_HARD_SUITE,
  makeNoisyCommunities,
  makePreferentialGraph,
  makePerturbedGrid,
  makeTerminalCommunities,
  makeCriticalCommunities,
  makeDenseCommunities,
} from "./partition-hard-instances.js";

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
    edges: (g.edges || []).map((e) => ({ ...e })),
    sizes: { ...(g.sizes || {}) },
    terminals: g.terminals ? { ...g.terminals } : undefined,
    hedges: g.hedges
      ? g.hedges.map((h) => ({ pins: [...h.pins], w: h.w, id: h.id }))
      : undefined,
    meta: g.meta ? { ...g.meta } : undefined,
    rows: g.rows,
    cols: g.cols,
  };
}

/**
 * Communities plus multi-pin hyperedges that span both sides (hurts naive pair cutters).
 */
export function makeHyperNoisy(half = 10, seed = 41) {
  const g = makeNoisyCommunities(half, seed);
  const left = g.nodes.filter((n) => n.startsWith("L"));
  const right = g.nodes.filter((n) => n.startsWith("R"));
  const rng = mulberry32(seed + 7);
  const hedges = [];
  // Local nets (should stay uncut)
  for (let i = 0; i < Math.min(4, left.length - 1); i++) {
    hedges.push({
      pins: [left[i], left[i + 1], left[(i + 2) % left.length]],
      w: 3,
      id: `HL${i}`,
    });
    hedges.push({
      pins: [right[i], right[i + 1], right[(i + 2) % right.length]],
      w: 3,
      id: `HR${i}`,
    });
  }
  // Bridging 3-pin nets (cut pressure)
  for (let i = 0; i < 5; i++) {
    const a = left[Math.floor(rng() * left.length)];
    const b = right[Math.floor(rng() * right.length)];
    const c = rng() < 0.5 ? left[Math.floor(rng() * left.length)] : right[Math.floor(rng() * right.length)];
    hedges.push({ pins: [...new Set([a, b, c])], w: 2 + (i % 2), id: `HX${i}` });
  }
  return {
    ...g,
    hedges,
    meta: { ...(g.meta || {}), kind: "hyper_noisy" },
  };
}

function badSeedFromGraph(g, seedTag = 3) {
  const order = [...g.nodes].sort((a, b) => {
    const ra = mulberry32(a.charCodeAt(0) * 17 + seedTag)();
    const rb = mulberry32(b.charCodeAt(0) * 17 + seedTag)();
    return ra - rb || (a < b ? -1 : 1);
  });
  const half = Math.floor(order.length / 2);
  const left = new Set(order.slice(0, half));
  const asn = Object.fromEntries(g.nodes.map((n) => [n, left.has(n) ? "0" : "1"]));
  if (g.terminals) {
    for (const [n, p] of Object.entries(g.terminals)) asn[n] = String(p);
  }
  return asn;
}

function wrapPartitionHard(entry) {
  return {
    ...entry,
    hard: true,
    graph: () => cloneGraph(entry.graph()),
    seedAssignment: (g) =>
      typeof entry.seedAssignment === "function"
        ? entry.seedAssignment(g)
        : badSeedFromGraph(g),
  };
}

const hyperTemplate = makeHyperNoisy(10, 41);

export const HARD_BENCHMARK_INSTANCES = {
  ...Object.fromEntries(
    Object.entries(PARTITION_HARD).map(([id, entry]) => [id, wrapPartitionHard(entry)])
  ),
  hyper20: {
    id: "hyper20",
    title: "Hard · Hyper + noise (20)",
    nNodes: hyperTemplate.nodes.length,
    hard: true,
    notes: "Multi-pin nets across communities — hyperCut separates engines.",
    graph: () => cloneGraph(makeHyperNoisy(10, 41)),
    seedAssignment: (g) => badSeedFromGraph(g, 41),
  },
};

export const HARD_SUITE = [...PARTITION_HARD_SUITE, "hyper20"];

export {
  makeNoisyCommunities,
  makePreferentialGraph,
  makePerturbedGrid,
  makeTerminalCommunities,
  makeCriticalCommunities,
  makeDenseCommunities,
};
