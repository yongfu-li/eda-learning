/**
 * partitioning-core.js — bipartition / multiway helpers for learn_partitioning labs.
 * Reuses cutsize, KL, FM, spectral, hyperedgeCut from clustering-core.js.
 */
import {
  BAD_SEED,
  TINY_GRAPH,
  TINY_HYPERGRAPH,
  adjacency,
  cutsize,
  fiducciaMattheyses,
  greedyPairMerge,
  hyperedgeCut,
  hyperedgesToPairEdges,
  kernighanLin,
  partsString,
  spectralBisection,
} from "./clustering-core.js";
import { annealBipartition } from "./partition-algo-anneal.js";
import { championBipartition } from "./partition-algo-champion.js";
import { diffusionBipartition } from "./partition-algo-diffusion.js";
import { gainFillBipartition } from "./partition-algo-gainfill.js";
import { inertialBipartition } from "./partition-algo-inertial.js";
import {
  HARD_BENCHMARK_INSTANCES,
  HARD_SUITE,
} from "./partition-hard-instances.js";
import {
  evaluatePartition,
  summarizeSeedCuts,
} from "./partition-metrics.js";

export { HARD_SUITE };

export { BAD_SEED, TINY_GRAPH, TINY_HYPERGRAPH, cutsize, hyperedgeCut, hyperedgesToPairEdges, partsString };

/** Deterministic LCG for reproducible "random" bipartitions. */
export function mulberry32(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Part → total size (default size 1). */
export function partSizes(assignment, sizes = null) {
  const out = {};
  for (const [n, p] of Object.entries(assignment)) {
    const s = sizes?.[n] ?? 1;
    out[p] = (out[p] || 0) + s;
  }
  return out;
}

/**
 * Balance for a bipartition: ratio = min/max ∈ (0,1], imbalance = |s0-s1|/total.
 * Returns null fields if not exactly two parts.
 */
export function balanceMetrics(assignment, sizes = null) {
  const ps = partSizes(assignment, sizes);
  const labs = Object.keys(ps).sort();
  if (labs.length !== 2) {
    return { parts: ps, labels: labs, ratio: null, imbalance: null, sizes: null };
  }
  const s0 = ps[labs[0]];
  const s1 = ps[labs[1]];
  const total = s0 + s1;
  const lo = Math.min(s0, s1);
  const hi = Math.max(s0, s1);
  return {
    parts: ps,
    labels: labs,
    sizes: [s0, s1],
    ratio: lo / hi,
    imbalance: Math.abs(s0 - s1) / total,
  };
}

/** Golden balanced bipartition on TINY_GRAPH (cut 3). */
export const GOLDEN_BIPART = { A: "0", B: "0", C: "0", D: "1", E: "1" };

/**
 * Random bipartition aiming for roughly half the nodes on each side.
 * Seed 7 on TINY_GRAPH yields AE|BCD (same shape as BAD_SEED) — cut 12.
 */
export function randomBipartition(nodes, seed = 7) {
  const rng = mulberry32(seed);
  const shuffled = [...nodes].sort((a, b) => {
    const ra = rng();
    const rb = rng();
    return ra - rb || (a < b ? -1 : 1);
  });
  const half = Math.floor(nodes.length / 2);
  const left = new Set(shuffled.slice(0, half));
  return Object.fromEntries(nodes.map((n) => [n, left.has(n) ? "0" : "1"]));
}

/**
 * Greedy initial bipartition: start with heaviest edge on side 0,
 * then place remaining nodes to the side that adds less cut weight.
 */
export function greedyInitialBipartition(nodes, edges) {
  if (nodes.length < 2) return Object.fromEntries(nodes.map((n) => [n, "0"]));
  const sorted = [...edges].sort(
    (a, b) => b.w - a.w || (a.u < b.u ? -1 : 1) || (a.v < b.v ? -1 : 1)
  );
  const { u: u0, v: v0 } = sorted[0];
  const asn = Object.fromEntries(nodes.map((n) => [n, null]));
  asn[u0] = "0";
  asn[v0] = "0";
  const adj = adjacency(edges);
  const rest = nodes.filter((n) => asn[n] == null).sort();
  // Seed side 1 with the unplaced node of highest affinity to the other side later;
  // first place one node on side 1 for balance.
  if (rest.length) {
    const first = rest[0];
    asn[first] = "1";
    rest.shift();
  }
  for (const n of rest) {
    let add0 = 0;
    let add1 = 0;
    for (const [nbr, w] of Object.entries(adj[n] || {})) {
      if (asn[nbr] === "0") add0 += w;
      else if (asn[nbr] === "1") add1 += w;
    }
    // Prefer the side where more weight is already internal (less cut added).
    asn[n] = add0 >= add1 ? "0" : "1";
  }
  return asn;
}

/**
 * Grow a bipartition from a seed node: BFS by heaviest neighbor until half filled.
 */
export function growBipartition(nodes, edges, seedNode) {
  const adj = adjacency(edges);
  const target = Math.floor(nodes.length / 2);
  const left = new Set([seedNode]);
  while (left.size < target) {
    let best = null;
    for (const u of left) {
      for (const [v, w] of Object.entries(adj[u] || {})) {
        if (left.has(v)) continue;
        if (!best || w > best.w || (w === best.w && v < best.v)) best = { v, w };
      }
    }
    if (!best) {
      const leftover = nodes.find((n) => !left.has(n));
      if (!leftover) break;
      left.add(leftover);
    } else {
      left.add(best.v);
    }
  }
  return Object.fromEntries(nodes.map((n) => [n, left.has(n) ? "0" : "1"]));
}

/** Induced subgraph on a node subset (edge endpoints both inside). */
export function inducedSubgraph(nodes, edges, sizes) {
  const set = new Set(nodes);
  return {
    nodes: [...nodes],
    edges: edges.filter((e) => set.has(e.u) && set.has(e.v)),
    sizes: Object.fromEntries(nodes.map((n) => [n, sizes?.[n] ?? 1])),
  };
}

/**
 * Recursive bisection to targetK parts.
 * Always bisects the largest part via spectral; returns assignment + history.
 */
export function recursiveBisection(nodes, edges, sizes, targetK = 3) {
  const sz = sizes || Object.fromEntries(nodes.map((n) => [n, 1]));
  let nextLabel = 0;
  let assignment = Object.fromEntries(nodes.map((n) => [n, String(nextLabel)]));
  nextLabel = 1;
  const history = [{ step: 0, event: "start", parts: partsString(assignment), cut: cutsize(assignment, edges) }];

  function largestPart() {
    const groups = {};
    for (const n of nodes) {
      const p = assignment[n];
      (groups[p] ||= []).push(n);
    }
    let bestLab = null;
    let bestNodes = [];
    for (const [lab, mem] of Object.entries(groups)) {
      if (
        mem.length > bestNodes.length ||
        (mem.length === bestNodes.length && (bestLab == null || lab < bestLab))
      ) {
        bestLab = lab;
        bestNodes = mem;
      }
    }
    return { lab: bestLab, members: bestNodes.sort() };
  }

  let step = 1;
  while (new Set(Object.values(assignment)).size < targetK) {
    const { lab, members } = largestPart();
    if (members.length < 2) break;
    const sub = inducedSubgraph(members, edges, sz);
    const { assignment: bip } = spectralBisection(sub.nodes, sub.edges, sub.sizes);
    const newLab = String(nextLabel++);
    for (const n of members) {
      if (bip[n] === "1") assignment[n] = newLab;
      else assignment[n] = lab;
    }
    history.push({
      step,
      event: `bisect part ${lab}`,
      split: members.join(""),
      parts: partsString(assignment),
      cut: cutsize(assignment, edges),
      k: new Set(Object.values(assignment)).size,
    });
    step++;
  }
  return { assignment, history };
}

/**
 * Flat multiway literacy: assign nodes to k buckets by spectral recursive result,
 * or a simple round-robin baseline for contrast.
 */
export function roundRobinMultiway(nodes, k) {
  const sorted = [...nodes].sort();
  return Object.fromEntries(sorted.map((n, i) => [n, String(i % k)]));
}

/**
 * Terminal propagation: fixed terminals keep their side; free nodes take the
 * side of the neighboring terminal (or assigned) with highest affinity weight.
 * Iterates until stable (small graphs).
 */
export function terminalPropagation(nodes, edges, terminals) {
  // terminals: { node: "0"|"1", ... }
  const asn = Object.fromEntries(nodes.map((n) => [n, terminals[n] != null ? String(terminals[n]) : null]));
  const adj = adjacency(edges);
  const free = nodes.filter((n) => asn[n] == null).sort();
  let changed = true;
  let iters = 0;
  const history = [];
  while (changed && iters < 20) {
    changed = false;
    iters++;
    for (const n of free) {
      let w0 = 0;
      let w1 = 0;
      for (const [nbr, w] of Object.entries(adj[n] || {})) {
        if (asn[nbr] === "0") w0 += w;
        else if (asn[nbr] === "1") w1 += w;
      }
      if (w0 === 0 && w1 === 0) continue;
      const next = w0 >= w1 ? "0" : "1";
      if (asn[n] !== next) {
        asn[n] = next;
        changed = true;
      }
    }
    history.push({
      iter: iters,
      assignment: { ...asn },
      cut: cutsize(
        Object.fromEntries(nodes.map((n) => [n, asn[n] ?? "?"])),
        edges.filter((e) => asn[e.u] != null && asn[e.v] != null)
      ),
    });
  }
  // Any still-null free node: put on smaller side
  for (const n of free) {
    if (asn[n] != null) continue;
    const s0 = nodes.filter((u) => asn[u] === "0").length;
    const s1 = nodes.filter((u) => asn[u] === "1").length;
    asn[n] = s0 <= s1 ? "0" : "1";
  }
  return { assignment: asn, history, iters, terminals: { ...terminals } };
}

/**
 * Multilevel V-cycle with explicit stages for literacy labs.
 * coarsen (greedy→2) → partition (identity on coarse) → project → FM refine.
 */
export function multilevelVCycle(nodes, edges, sizes, coarseK = 2) {
  const { assignment: coarse, mergeLog } = greedyPairMerge(nodes, edges, sizes, coarseK);
  const labs = [...new Set(Object.values(coarse))].sort();
  const stages = {
    coarsen: { assignment: { ...coarse }, labels: labs, mergeLog },
  };

  let projected;
  if (labs.length === 2) {
    projected = Object.fromEntries(nodes.map((n) => [n, coarse[n] === labs[0] ? "0" : "1"]));
  } else {
    projected = Object.fromEntries(nodes.map((n, i) => [n, String(i % 2)]));
  }
  stages.project = {
    assignment: { ...projected },
    cut: cutsize(projected, edges),
    parts: partsString(projected),
  };

  const { assignment: refined, history: fmHist } = fiducciaMattheyses(nodes, edges, projected);
  stages.refine = {
    assignment: { ...refined },
    cut: cutsize(refined, edges),
    parts: partsString(refined),
    fmHistory: fmHist,
  };

  const finalAsn = Object.fromEntries(nodes.map((n) => [n, `P${refined[n]}`]));
  stages.final = {
    assignment: finalAsn,
    cut: cutsize(finalAsn, edges),
    parts: partsString(finalAsn),
  };

  return { stages, assignment: finalAsn };
}

/** Hypergraph bipartition via clique-expansion + FM from a seed. */
export function hypergraphBipartition(nodes, hedges, initial) {
  const edges = hyperedgesToPairEdges(hedges);
  const { assignment, history } = fiducciaMattheyses(nodes, edges, initial);
  return {
    assignment,
    history,
    hyperCut: hyperedgeCut(assignment, hedges),
    pairCut: cutsize(assignment, edges),
  };
}

/**
 * Two-community ring graph with 2*half nodes and two unit bridges.
 * half=6 → 12 nodes (same shape as legacy MEDIUM_GRAPH).
 */
export function makeTwoCommunityGraph(half = 6) {
  const h = Math.max(2, Math.floor(half));
  const left = Array.from({ length: h }, (_, i) => `L${i}`);
  const right = Array.from({ length: h }, (_, i) => `R${i}`);
  const nodes = [...left, ...right];
  const edges = [];
  const ring = (ids, w) => {
    for (let i = 0; i < ids.length; i++) {
      edges.push({ u: ids[i], v: ids[(i + 1) % ids.length], w });
      if (ids.length > 3) {
        edges.push({ u: ids[i], v: ids[(i + 2) % ids.length], w });
      }
    }
  };
  ring(left, 4);
  ring(right, 4);
  const b0 = Math.floor(h / 3);
  const b1 = Math.min(h - 1, Math.floor((2 * h) / 3));
  edges.push({ u: left[b0], v: right[b0], w: 1 });
  edges.push({ u: left[b1], v: right[b1], w: 1 });
  const sizes = Object.fromEntries(nodes.map((n) => [n, 1]));
  return { nodes, edges, sizes, half: h };
}

/**
 * Mid-size two-community graph (12 nodes) for browser benchmarks.
 * Dense left / right rings + two unit bridges → golden cut 2 when L*|R*.
 */
export const MEDIUM_GRAPH = makeTwoCommunityGraph(6);

/** Sparse path graph (n nodes) — different structure from communities. */
export function makePathGraph(n = 20) {
  const nodes = Array.from({ length: n }, (_, i) => `P${i}`);
  const edges = [];
  for (let i = 0; i < n - 1; i++) {
    edges.push({ u: nodes[i], v: nodes[i + 1], w: 1 });
  }
  const sizes = Object.fromEntries(nodes.map((id) => [id, 1]));
  return { nodes, edges, sizes };
}

/** Simple 2D grid (rows × cols), 4-neighbor edges. */
export function makeGridGraph(rows = 4, cols = 5) {
  const nodes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) nodes.push(`G${r}_${c}`);
  }
  const edges = [];
  const id = (r, c) => `G${r}_${c}`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols) edges.push({ u: id(r, c), v: id(r, c + 1), w: 1 });
      if (r + 1 < rows) edges.push({ u: id(r, c), v: id(r + 1, c), w: 1 });
    }
  }
  const sizes = Object.fromEntries(nodes.map((n) => [n, 1]));
  return { nodes, edges, sizes, rows, cols };
}

/** Circle layout: one community on the left, one on the right. */
export function communityLayout(nodes, leftPrefix = "L") {
  const left = nodes.filter((n) => String(n).startsWith(leftPrefix));
  const right = nodes.filter((n) => !String(n).startsWith(leftPrefix));
  const place = (ids, cx, cy, r) => {
    const out = {};
    const n = Math.max(ids.length, 1);
    ids.forEach((id, i) => {
      const a = (2 * Math.PI * i) / n - Math.PI / 2;
      out[id] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
    return out;
  };
  return { ...place(left, 120, 160, 90), ...place(right, 340, 160, 90) };
}

function pathLayout(nodes) {
  const out = {};
  const n = nodes.length;
  nodes.forEach((id, i) => {
    out[id] = { x: 40 + (i / Math.max(n - 1, 1)) * 380, y: 160 + (i % 2) * 40 };
  });
  return out;
}

function gridLayout(nodes, rows, cols) {
  const out = {};
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `G${r}_${c}`;
      if (!nodes.includes(id)) continue;
      out[id] = { x: 60 + c * 70, y: 50 + r * 70 };
    }
  }
  return out;
}

function registerCommunityInstance(id, half, title) {
  const template = makeTwoCommunityGraph(half);
  return {
    id,
    title,
    nNodes: template.nodes.length,
    graph: () => {
      const g = makeTwoCommunityGraph(half);
      return {
        nodes: [...g.nodes],
        edges: g.edges.map((e) => ({ ...e })),
        sizes: { ...g.sizes },
      };
    },
    seedAssignment: (g) => randomBipartition(g.nodes, 11 + half),
    layout: () => communityLayout(template.nodes, "L"),
    notes: `Two communities (${half}+${half}), bridges. n=${template.nodes.length}.`,
  };
}

export const BENCHMARK_INSTANCES = {
  tiny: {
    id: "tiny",
    title: "Tiny · 5 nodes (teaching)",
    nNodes: 5,
    graph: () => ({
      nodes: [...TINY_GRAPH.nodes],
      edges: TINY_GRAPH.edges.map((e) => ({ ...e })),
      sizes: { ...TINY_GRAPH.sizes },
    }),
    seedAssignment: () => ({ ...BAD_SEED }),
    layout: null,
    notes: "Same graph as KL/FM labs. Bad seed cut 12; golden cut 3.",
  },
  small: registerCommunityInstance("small", 4, "Small · 8 nodes (2 communities)"),
  medium: registerCommunityInstance("medium", 6, "Medium · 12 nodes (2 communities)"),
  large: registerCommunityInstance("large", 12, "Large · 24 nodes (2 communities)"),
  xl: registerCommunityInstance("xl", 20, "XL · 40 nodes (2 communities)"),
  path20: (() => {
    const template = makePathGraph(20);
    return {
      id: "path20",
      title: "Path · 20 nodes",
      nNodes: 20,
      graph: () => {
        const g = makePathGraph(20);
        return {
          nodes: [...g.nodes],
          edges: g.edges.map((e) => ({ ...e })),
          sizes: { ...g.sizes },
        };
      },
      seedAssignment: (g) => randomBipartition(g.nodes, 3),
      layout: () => pathLayout(template.nodes),
      notes: "Sparse path — cut structure differs from communities.",
    };
  })(),
  grid4x5: (() => {
    const template = makeGridGraph(4, 5);
    return {
      id: "grid4x5",
      title: "Grid · 20 nodes (4×5)",
      nNodes: 20,
      graph: () => {
        const g = makeGridGraph(4, 5);
        return {
          nodes: [...g.nodes],
          edges: g.edges.map((e) => ({ ...e })),
          sizes: { ...g.sizes },
        };
      },
      seedAssignment: (g) => randomBipartition(g.nodes, 5),
      layout: () => gridLayout(template.nodes, 4, 5),
      notes: "4×5 grid, unit edges.",
    };
  })(),
};

Object.assign(BENCHMARK_INSTANCES, HARD_BENCHMARK_INSTANCES);

export const BENCHMARK_ALGOS = [
  { id: "random", title: "Random half-split", needsSeed: false },
  { id: "greedy", title: "Greedy heaviest-edge fill", needsSeed: false },
  { id: "grow", title: "Heaviest-neighbor BFS grow", needsSeed: false },
  { id: "gain_fill", title: "Opposite-seed gain fill", needsSeed: false },
  { id: "jacobi_diffusion", title: "Jacobi diffusion potential cut", needsSeed: false },
  { id: "bfs_inertial", title: "BFS-inertial median cut", needsSeed: false },
  { id: "metropolis_swap", title: "Metropolis pair-swap annealing", needsSeed: true },
  { id: "kl", title: "Kernighan–Lin pair swaps", needsSeed: true },
  { id: "fm", title: "Fiduccia–Mattheyses single-move", needsSeed: true },
  { id: "spectral", title: "Fiedler spectral bisection", needsSeed: false },
  { id: "multilevel", title: "Greedy-coarsen V-cycle + FM", needsSeed: false },
  { id: "multistart_fm", title: "Multi-start constructive + FM", needsSeed: false },
  { id: "terminal_fm", title: "Terminal propagation + FM", needsSeed: true },
];

/** Map arbitrary part labels onto "0"/"1" (sorted label order) for fair cut/balance. */
export function normalizeBipartLabels(assignment) {
  const labs = [...new Set(Object.values(assignment).map(String))].sort();
  if (labs.length !== 2) return { ...assignment };
  const map = { [labs[0]]: "0", [labs[1]]: "1" };
  return Object.fromEntries(
    Object.entries(assignment).map(([n, p]) => [n, map[String(p)] ?? String(p)])
  );
}

/**
 * Run one educational (or uploaded) partitioner.
 * opts.extraAlgos: [{ id, title, run(graph, opts), isUser }]
 */
export async function runPartitionAlgo(algoId, graph, opts = {}) {
  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra) {
    const out = await Promise.resolve(extra.run(graph, opts));
    if (!out || !out.assignment) {
      throw new Error(`${extra.title || algoId}: run() must return { assignment }`);
    }
    return {
      assignment: out.assignment,
      detail: out.detail || (extra.isUser ? "uploaded" : ""),
      history: out.history,
      seedUsed: out.seedUsed,
    };
  }

  const { nodes, edges, sizes } = graph;
  const seedAsn =
    opts.seedAsn ||
    randomBipartition(nodes, opts.randomSeed ?? 7);
  const maxPasses = opts.maxPasses ?? 10;

  switch (algoId) {
    case "random": {
      const assignment = randomBipartition(nodes, opts.randomSeed ?? 7);
      return { assignment, detail: `seed=${opts.randomSeed ?? 7}` };
    }
    case "greedy": {
      const assignment = greedyInitialBipartition(nodes, edges);
      return { assignment, detail: "heaviest-edge seed" };
    }
    case "grow": {
      const growSeed =
        opts.growSeed && nodes.includes(opts.growSeed)
          ? opts.growSeed
          : [...nodes].sort()[0];
      const assignment = growBipartition(nodes, edges, growSeed);
      return { assignment, detail: `seed=${growSeed}` };
    }
    case "gain_fill":
    case "gainfill": {
      const { assignment, detail } = gainFillBipartition(nodes, edges, sizes, opts);
      return { assignment, detail };
    }
    case "jacobi_diffusion":
    case "diffusion": {
      const { assignment, detail } = diffusionBipartition(nodes, edges, sizes, opts);
      return { assignment, detail };
    }
    case "bfs_inertial":
    case "inertial": {
      const { assignment, detail } = inertialBipartition(nodes, edges, sizes, {
        ...opts,
        layout: opts.layout,
      });
      return { assignment, detail };
    }
    case "metropolis_swap":
    case "anneal": {
      const { assignment, detail, bestCut } = annealBipartition(nodes, edges, sizes, {
        ...opts,
        seedAsn,
        randomSeed: opts.randomSeed ?? 7,
      });
      return {
        assignment,
        detail: detail || `metropolis_swap bestCut=${bestCut}`,
        seedUsed: { ...seedAsn },
      };
    }
    case "multistart_fm":
    case "champion": {
      const { assignment, detail } = championBipartition(nodes, edges, sizes, {
        balanceTol: opts.balanceTol ?? 0.25,
        maxPasses: opts.maxPasses ?? 12,
        randomSeed: opts.randomSeed ?? 7,
        terminals: graph.terminals || opts.terminals || null,
      });
      return { assignment, detail };
    }
    case "terminal_fm": {
      const terminals = graph.terminals || opts.terminals || {};
      const seeded = { ...seedAsn };
      for (const [n, p] of Object.entries(terminals)) seeded[n] = String(p);
      let start = seeded;
      if (Object.keys(terminals).length) {
        try {
          const { assignment } = terminalPropagation(nodes, edges, terminals);
          start = assignment;
        } catch {
          start = seeded;
        }
      }
      const { assignment, history } = fiducciaMattheyses(
        nodes,
        edges,
        start,
        maxPasses,
        opts.balanceTol ?? 0.25
      );
      const asn = { ...assignment };
      for (const [n, p] of Object.entries(terminals)) asn[n] = String(p);
      return {
        assignment: asn,
        detail: `terminal_fm locks=${Object.keys(terminals).length}`,
        history,
      };
    }
    case "kl": {
      const { assignment, history } = kernighanLin(nodes, edges, seedAsn, maxPasses);
      return {
        assignment,
        detail: `passes=${history?.length ?? 0}`,
        history,
        seedUsed: { ...seedAsn },
      };
    }
    case "fm": {
      const { assignment, history } = fiducciaMattheyses(
        nodes,
        edges,
        seedAsn,
        maxPasses
      );
      return {
        assignment,
        detail: `passes=${history?.length ?? 0}`,
        history,
        seedUsed: { ...seedAsn },
      };
    }
    case "spectral": {
      const { assignment, order } = spectralBisection(nodes, edges, sizes);
      return {
        assignment,
        detail: `fiedler order ${order?.map(([n]) => n).join("") || "?"}`,
        order,
      };
    }
    case "multilevel": {
      const { assignment, stages } = multilevelVCycle(nodes, edges, sizes, 2);
      return {
        assignment: normalizeBipartLabels(assignment),
        detail: "coarsen→project→FM",
        stages,
        rawAssignment: assignment,
      };
    }
    default:
      throw new Error(`Unknown partition algo: ${algoId}`);
  }
}

function algoMeta(algoId, extraAlgos = []) {
  const extra = extraAlgos.find((a) => a.id === algoId);
  if (extra) {
    return {
      id: algoId,
      title: extra.title || algoId,
      isUser: !!extra.isUser,
    };
  }
  const builtin = BENCHMARK_ALGOS.find((a) => a.id === algoId);
  return {
    id: algoId,
    title: builtin?.title || algoId,
    isUser: false,
  };
}

function resolveAlgoIds(algoIds, extraAlgos = []) {
  const extras = (extraAlgos || []).filter((a) => a && a.id && typeof a.run === "function");
  const builtinIds = algoIds?.length ? algoIds : BENCHMARK_ALGOS.map((a) => a.id);
  // Uploaded solvers first, then builtins (stable).
  const userIds = extras.filter((a) => a.isUser).map((a) => a.id);
  const otherExtra = extras.filter((a) => !a.isUser).map((a) => a.id);
  const seen = new Set([...userIds, ...otherExtra]);
  return [...userIds, ...otherExtra, ...builtinIds.filter((id) => !seen.has(id))];
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

/**
 * Score an assignment: cutsize, balance, parts string + extended metrics.
 * Normalizes to two labels when possible.
 */
export function scorePartition(assignment, graph, opts = {}) {
  const asn = normalizeBipartLabels(assignment);
  const bal = balanceMetrics(asn, graph.sizes);
  const ext = evaluatePartition(asn, graph, opts);
  return {
    assignment: asn,
    cut: cutsize(asn, graph.edges),
    parts: partsString(asn),
    imbalance: bal.imbalance,
    ratio: bal.ratio,
    sizes: bal.sizes,
    metrics: ext,
  };
}

/**
 * Run selected algorithms on one instance.
 * opts.extraAlgos — uploaded / custom solvers (listed first on the scoreboard).
 */
export async function runPartitionBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const graph = inst.graph();
  const layout = typeof inst.layout === "function" ? inst.layout() : null;
  const seedAsn =
    typeof inst.seedAssignment === "function"
      ? inst.seedAssignment(graph)
      : randomBipartition(graph.nodes, opts.randomSeed ?? 7);
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const seedTrials = opts.seedTrials ?? 2;
  const rows = [];
  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const title = meta.title;
    const isUser = meta.isUser;
    try {
      if (warm) {
        await runPartitionAlgo(algoId, graph, { ...opts, seedAsn });
      }
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runPartitionAlgo(algoId, graph, { ...opts, seedAsn });
      const t1 = nowMs();
      const heap1 = readHeapUsed();

      // Seed sweep for variance (extra runs; skipped when seedTrials <= 1).
      const seedCuts = [cutsize(normalizeBipartLabels(run.assignment), graph.edges)];
      if (seedTrials > 1) {
        for (let t = 1; t < seedTrials; t++) {
          const trialSeed = (opts.randomSeed ?? 7) + t * 19;
          const trialAsn =
            typeof inst.seedAssignment === "function"
              ? inst.seedAssignment(graph)
              : randomBipartition(graph.nodes, trialSeed);
          const trial = await runPartitionAlgo(algoId, graph, {
            ...opts,
            seedAsn: trialAsn,
            randomSeed: trialSeed,
          });
          seedCuts.push(
            cutsize(normalizeBipartLabels(trial.assignment), graph.edges)
          );
        }
      }
      const seedStats = summarizeSeedCuts(seedCuts);
      const passes = Array.isArray(run.history) ? run.history.length : null;
      const scored = scorePartition(run.assignment, graph, {
        layout,
        history: run.history,
        passes,
        balanceTol: 0.25,
        ...seedStats,
      });
      const memEst = estimateWorkingSetBytes(algoId, graph, isUser);
      const heapDelta =
        heap0 != null && heap1 != null ? Math.max(0, heap1 - heap0) : null;
      const m = scored.metrics || {};
      rows.push({
        algoId,
        title,
        isUser,
        cut: scored.cut,
        imbalance: scored.imbalance,
        ratio: scored.ratio,
        parts: scored.parts,
        sizes: scored.sizes,
        assignment: scored.assignment,
        detail: run.detail || "",
        ms: Math.max(0, t1 - t0),
        memBytes: heapDelta != null && heapDelta > 0 ? heapDelta : memEst,
        memEstBytes: memEst,
        heapDeltaBytes: heapDelta,
        memSource: heapDelta != null && heapDelta > 0 ? "heap-delta" : "estimate",
        seedUsed: run.seedUsed || null,
        instanceId,
        nNodes: graph.nodes.length,
        // Extended metrics (flattened for the scoreboard)
        maxPartFrac: m.maxPartFrac,
        balanceOk: m.balanceOk,
        terminalViolations: m.terminalViolations,
        conductance: m.conductance,
        expansion: m.expansion,
        normalizedCut: m.normalizedCut,
        hyperCut: m.hyperCut,
        hyperCutCount: m.hyperCutCount,
        borderLength: m.borderLength,
        hpwlProxy: m.hpwlProxy,
        passes: m.passes,
        seedCutMin: m.seedCutMin,
        seedCutMax: m.seedCutMax,
        seedCutMean: m.seedCutMean,
        seedCutStd: m.seedCutStd,
        criticalNetCut: m.criticalNetCut,
        parallelSpeedup: m.parallelSpeedup,
        parallelEfficiency: m.parallelEfficiency,
        energyJ: m.energyJ,
        metricNotes: m.notes,
        metrics: m,
      });
    } catch (err) {
      rows.push({
        algoId,
        title,
        isUser,
        error: String(err?.message || err),
        ms: 0,
        memBytes: 0,
        instanceId,
        nNodes: graph.nodes.length,
      });
    }
  }
  rows.sort(compareBenchRowsUserFirst);
  return {
    instanceId,
    instanceIds: [instanceId],
    instanceTitle: inst.title,
    notes: inst.notes,
    mode: "selective",
    graph,
    seedAsn,
    rows,
  };
}

function nowMs() {
  return typeof performance !== "undefined" && performance.now
    ? performance.now()
    : Date.now();
}

/** Chrome-only heap sample; null elsewhere. */
export function readHeapUsed() {
  try {
    const m = typeof performance !== "undefined" ? performance.memory : null;
    return m && typeof m.usedJSHeapSize === "number" ? m.usedJSHeapSize : null;
  } catch {
    return null;
  }
}

/**
 * Deterministic structural working-set estimate (bytes) so memory compares
 * work even when performance.memory is unavailable.
 */
export function estimateWorkingSetBytes(algoId, graph, isUser = false) {
  const n = graph.nodes.length;
  const m = graph.edges.length;
  const base = n * 64 + m * 48 + n * 32; // nodes + edges + assignment
  if (isUser || String(algoId).startsWith("user:")) {
    return base + n * 48 + m * 16;
  }
  switch (algoId) {
    case "random":
    case "greedy":
    case "grow":
    case "gain_fill":
    case "gainfill":
    case "bfs_inertial":
    case "inertial":
      return base + n * 24;
    case "jacobi_diffusion":
    case "diffusion":
      return base + n * 48 + m * 8;
    case "metropolis_swap":
    case "anneal":
      return base + n * 64 + m * 8;
    case "multistart_fm":
    case "champion":
    case "terminal_fm":
      return base + n * 160 + m * 24 + n * n * 2;
    case "kl":
      return base + n * n * 16 + n * 48;
    case "fm":
      return base + n * 96 + m * 16;
    case "spectral":
      return base + n * n * 8 + n * 64;
    case "multilevel":
      return base + n * 128 + m * 32 + n * n * 4;
    default:
      return base;
  }
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  // Composite game (hard-suite aware):
  // 1) terminal violations  2) balance ≤ 0.25  3) edge cut
  // 4) critical-net cut  5) HPWL proxy  6) seed σ  7) runtime
  const aTerm = a.terminalViolations ?? 0;
  const bTerm = b.terminalViolations ?? 0;
  if (aTerm !== bTerm) return aTerm - bTerm;
  const BAL_TOL = 0.25;
  const aFeas = (a.imbalance ?? 1) <= BAL_TOL;
  const bFeas = (b.imbalance ?? 1) <= BAL_TOL;
  if (aFeas !== bFeas) return aFeas ? -1 : 1;
  if ((a.cut ?? Infinity) !== (b.cut ?? Infinity)) {
    return (a.cut ?? Infinity) - (b.cut ?? Infinity);
  }
  const aCrit = a.criticalNetCut ?? 0;
  const bCrit = b.criticalNetCut ?? 0;
  if (aCrit !== bCrit) return aCrit - bCrit;
  const aHpwl = a.hpwlProxy ?? Infinity;
  const bHpwl = b.hpwlProxy ?? Infinity;
  if (aHpwl !== bHpwl) return aHpwl - bHpwl;
  const aSig = a.seedCutStd ?? 0;
  const bSig = b.seedCutStd ?? 0;
  if (aSig !== bSig) return aSig - bSig;
  const ia = a.imbalance ?? 1;
  const ib = b.imbalance ?? 1;
  if (ia !== ib) return ia - ib;
  if ((a.ms ?? 0) !== (b.ms ?? 0)) return (a.ms ?? 0) - (b.ms ?? 0);
  if ((a.memBytes ?? 0) !== (b.memBytes ?? 0)) return (a.memBytes ?? 0) - (b.memBytes ?? 0);
  return a.algoId < b.algoId ? -1 : 1;
}

function mean(nums) {
  const xs = nums.filter((x) => typeof x === "number" && !Number.isNaN(x));
  if (!xs.length) return null;
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

/**
 * Run algorithms across one or more instances.
 * opts.mode: "selective" | "average"
 * opts.extraAlgos: uploaded solvers (appear above builtins).
 */
export async function runPartitionBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const ids = (instanceIds?.length ? instanceIds : Object.keys(BENCHMARK_INSTANCES)).filter(
    (id) => BENCHMARK_INSTANCES[id]
  );
  if (!ids.length) throw new Error("No benchmark instances selected");
  const mode = opts.mode === "average" ? "average" : "selective";

  if (mode === "selective") {
    const only = ids[0];
    const report = await runPartitionBenchmark(only, algoIds, opts);
    report.mode = "selective";
    report.instanceIds = [only];
    return report;
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runPartitionBenchmark(id, algoIds, opts));
  }
  const algoOrder = resolveAlgoIds(algoIds, opts.extraAlgos);
  const rows = [];
  for (const algoId of algoOrder) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const title = meta.title;
    const isUser = meta.isUser;
    const samples = perInstance
      .map((rep) => rep.rows.find((r) => r.algoId === algoId))
      .filter(Boolean);
    const errors = samples.filter((s) => s.error);
    if (!samples.length || errors.length === samples.length) {
      rows.push({
        algoId,
        title,
        isUser,
        error: (errors[0] || samples[0])?.error || "no samples",
        ms: 0,
        memBytes: 0,
        instanceIds: ids,
      });
      continue;
    }
    const ok = samples.filter((s) => !s.error);
    const avgKeys = [
      "maxPartFrac",
      "conductance",
      "expansion",
      "normalizedCut",
      "hyperCut",
      "hyperCutCount",
      "borderLength",
      "hpwlProxy",
      "passes",
      "seedCutMin",
      "seedCutMax",
      "seedCutMean",
      "seedCutStd",
      "terminalViolations",
      "criticalNetCut",
    ];
    const ext = {};
    for (const k of avgKeys) {
      ext[k] = mean(ok.map((s) => s[k]));
    }
    const bestSample = [...ok].sort(compareBenchRows)[0];
    const primaryRep = perInstance.find((r) => r.instanceId === bestSample.instanceId);
    rows.push({
      algoId,
      title,
      isUser,
      cut: mean(ok.map((s) => s.cut)),
      cutMin: Math.min(...ok.map((s) => s.cut)),
      cutMax: Math.max(...ok.map((s) => s.cut)),
      imbalance: mean(ok.map((s) => s.imbalance)),
      ratio: mean(ok.map((s) => s.ratio).filter((x) => x != null)),
      parts: bestSample.parts,
      assignment: bestSample.assignment,
      detail: `avg over ${ok.length} instances`,
      ms: mean(ok.map((s) => s.ms)),
      msMin: Math.min(...ok.map((s) => s.ms)),
      msMax: Math.max(...ok.map((s) => s.ms)),
      memBytes: mean(ok.map((s) => s.memBytes)),
      memEstBytes: mean(ok.map((s) => s.memEstBytes)),
      heapDeltaBytes: mean(ok.map((s) => s.heapDeltaBytes).filter((x) => x != null)),
      memSource: ok.some((s) => s.memSource === "heap-delta") ? "mixed" : "estimate",
      samples: ok,
      instanceIds: ids,
      vizInstanceId: bestSample.instanceId,
      graph: primaryRep?.graph || null,
      seedAsn: primaryRep?.seedAsn || null,
      balanceOk: (mean(ok.map((s) => s.imbalance)) ?? 1) <= 0.25,
      parallelSpeedup: null,
      parallelEfficiency: null,
      energyJ: null,
      metricNotes: bestSample.metricNotes,
      metrics: bestSample.metrics,
      ...ext,
    });
  }
  rows.sort(compareBenchRowsUserFirst);
  const titles = ids.map((id) => BENCHMARK_INSTANCES[id].title).join("; ");
  return {
    instanceId: "average",
    instanceIds: ids,
    instanceTitle: `Average (${ids.length} instances)`,
    notes: `Mean runtime & memory across: ${titles}. Uploaded solvers listed above builtins.`,
    mode: "average",
    graph: rows.find((r) => r.graph)?.graph || perInstance[0].graph,
    seedAsn: rows.find((r) => r.seedAsn)?.seedAsn || perInstance[0].seedAsn,
    perInstance,
    rows,
  };
}
