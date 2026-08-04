/**
 * Clustering benchmark — shared instances, builtins, dataset runner.
 * Mirrors partitioning-core benchmark APIs for learn_clustering.
 */
import {
  BAD_SEED,
  EDGE_CONGESTION,
  EDGE_CRITICALITY,
  TINY_GRAPH,
  TINY_HYPERGRAPH,
  congestionAwarePartition,
  cutsize,
  fiducciaMattheyses,
  greedyPairMerge,
  hyperedgeCut,
  hyperedgesToPairEdges,
  hypergraphGreedyCluster,
  kernighanLin,
  labelPropagation,
  multilevelCluster,
  partsString,
  spectralBisection,
  timingAwarePartition,
} from "./clustering-core.js";
import { multistartFmCluster } from "./cluster-algo-multistart.js";
import {
  HARD_BENCHMARK_INSTANCES,
  HARD_SUITE,
} from "./cluster-hard-instances.js";
import { gainFillBipartition } from "./partition-algo-gainfill.js";

export { HARD_SUITE };

/** Teaching / scale suite. */
export const TEACH_SUITE = ["tiny", "community12", "path16", "grid4x4", "community24"];
/** Include hypergraph instance. */
export const HYPER_SUITE = ["tiny", "tiny_hyper", "community12", "community24", "hyper20"];
/** Scaling ladder. */
export const SCALE_SUITE = ["tiny", "community12", "community24", "large"];

/** Default hard suite (differentiates portfolio solvers). */
export { HARD_SUITE as DEFAULT_SUITE };

function cloneGraph(g) {
  return {
    nodes: [...g.nodes],
    edges: (g.edges || []).map((e) => ({ ...e })),
    sizes: { ...(g.sizes || {}) },
    hedges: g.hedges ? g.hedges.map((h) => ({ pins: [...h.pins], w: h.w, id: h.id })) : undefined,
    meta: g.meta ? { ...g.meta } : undefined,
  };
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic random bipartition (seed for KL/FM). */
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

function makeTwoCommunities(half = 6, seed = 11, crossW = 1, innerW = 4) {
  const rng = mulberry32(seed);
  const left = Array.from({ length: half }, (_, i) => `L${i}`);
  const right = Array.from({ length: half }, (_, i) => `R${i}`);
  const nodes = [...left, ...right];
  const edges = [];
  for (let i = 0; i < half; i++) {
    for (let j = i + 1; j < half; j++) {
      if (rng() < 0.85) edges.push({ u: left[i], v: left[j], w: innerW });
      if (rng() < 0.85) edges.push({ u: right[i], v: right[j], w: innerW });
    }
  }
  const crossN = Math.max(2, Math.floor(half / 2));
  for (let c = 0; c < crossN; c++) {
    const a = left[Math.floor(rng() * half)];
    const b = right[Math.floor(rng() * half)];
    edges.push({ u: a, v: b, w: crossW });
  }
  const sizes = Object.fromEntries(nodes.map((n) => [n, 1]));
  return { nodes, edges, sizes };
}

function makePath(n = 16) {
  const nodes = Array.from({ length: n }, (_, i) => `P${i}`);
  const edges = [];
  for (let i = 0; i < n - 1; i++) edges.push({ u: nodes[i], v: nodes[i + 1], w: 1 });
  return { nodes, edges, sizes: Object.fromEntries(nodes.map((x) => [x, 1])) };
}

function makeGrid(rows = 4, cols = 4) {
  const nodes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) nodes.push(`G${r}_${c}`);
  }
  const edges = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const u = `G${r}_${c}`;
      if (c + 1 < cols) edges.push({ u, v: `G${r}_${c + 1}`, w: 1 });
      if (r + 1 < rows) edges.push({ u, v: `G${r + 1}_${c}`, w: 1 });
    }
  }
  return { nodes, edges, sizes: Object.fromEntries(nodes.map((x) => [x, 1])) };
}

function tinyHyperGraph() {
  const hedges = TINY_HYPERGRAPH.hyperedges.map((h) => ({
    pins: [...h.pins],
    w: h.w,
    id: h.id,
  }));
  return {
    nodes: [...TINY_HYPERGRAPH.nodes],
    edges: hyperedgesToPairEdges(hedges),
    sizes: { ...TINY_HYPERGRAPH.sizes },
    hedges,
  };
}

export const BENCHMARK_INSTANCES = {
  tiny: {
    id: "tiny",
    title: "Tiny 5-node (course starter)",
    nNodes: 5,
    notes: "Same graph as learn_clustering labs; natural cut 3.",
    graph: () => cloneGraph(TINY_GRAPH),
    seedAssignment: () => ({ ...BAD_SEED }),
  },
  tiny_hyper: {
    id: "tiny_hyper",
    title: "Tiny hypergraph",
    nNodes: 5,
    notes: "Clique-expanded for pair cut; hyperCut uses nets.",
    graph: () => tinyHyperGraph(),
    seedAssignment: (g) => randomBipartition(g.nodes, 7),
  },
  community12: {
    id: "community12",
    title: "Two communities (n=12)",
    nNodes: 12,
    notes: "Dense intra-cluster, sparse cross edges.",
    graph: () => makeTwoCommunities(6, 11),
    seedAssignment: (g) => randomBipartition(g.nodes, 7),
  },
  path16: {
    id: "path16",
    title: "Path n=16",
    nNodes: 16,
    notes: "Chain — spectral / multilevel should bisect near middle.",
    graph: () => makePath(16),
    seedAssignment: (g) => randomBipartition(g.nodes, 7),
  },
  grid4x4: {
    id: "grid4x4",
    title: "Grid 4×4",
    nNodes: 16,
    notes: "Mesh connectivity.",
    graph: () => makeGrid(4, 4),
    seedAssignment: (g) => randomBipartition(g.nodes, 7),
  },
  community24: {
    id: "community24",
    title: "Two communities (n=24)",
    nNodes: 24,
    notes: "Larger community instance.",
    graph: () => makeTwoCommunities(12, 21),
    seedAssignment: (g) => randomBipartition(g.nodes, 7),
  },
  large: {
    id: "large",
    title: "Two communities (n=48)",
    nNodes: 48,
    notes: "Scaling stress (still browser-friendly).",
    graph: () => makeTwoCommunities(24, 33, 1, 3),
    seedAssignment: (g) => randomBipartition(g.nodes, 7),
  },
  ...HARD_BENCHMARK_INSTANCES,
};

export const BENCHMARK_ALGOS = [
  { id: "greedy_k2", title: "Greedy pair-merge (k=2)", needsSeed: false },
  { id: "greedy_k3", title: "Greedy pair-merge (k=3)", needsSeed: false },
  { id: "gain_fill", title: "Opposite-seed gain fill", needsSeed: false },
  { id: "label_prop", title: "Label propagation", needsSeed: false },
  { id: "spectral", title: "Fiedler spectral bisection", needsSeed: false },
  { id: "multilevel", title: "Multilevel (greedy + FM)", needsSeed: false },
  { id: "kl", title: "Kernighan–Lin (from seed)", needsSeed: true },
  { id: "fm", title: "Fiduccia–Mattheyses (from seed)", needsSeed: true },
  { id: "multistart_fm", title: "Multi-start constructive + FM", needsSeed: false },
  { id: "hyper_greedy", title: "Hypergraph greedy (k=2)", needsSeed: false },
  { id: "congestion", title: "Congestion-aware FM (λ=1)", needsSeed: true },
  { id: "timing", title: "Timing-aware FM", needsSeed: true },
];

export const CLUSTER_METRIC_COLUMNS = [
  { key: "ms", label: "ms", fmt: (v) => (v == null ? "—" : Number(v).toFixed(2)) },
  {
    key: "memBytes",
    label: "Mem",
    fmt: (v, row) => {
      if (v == null) return "—";
      const kb = v / 1024;
      const s = kb >= 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
      return row?.memSource === "estimate" ? `${s}*` : s;
    },
  },
  { key: "cut", label: "Cut", fmt: (v) => (v == null ? "—" : String(v)) },
  { key: "hyperCut", label: "Hypercut", fmt: (v) => (v == null ? "—" : String(v)) },
  {
    key: "criticalNetCut",
    label: "Crit cut",
    fmt: (v) => (v == null ? "—" : String(v)),
  },
  {
    key: "terminalViolations",
    label: "Term viol",
    fmt: (v) => (v == null ? "—" : String(v)),
  },
  { key: "k", label: "k", fmt: (v) => (v == null ? "—" : String(v)) },
  {
    key: "imbalance",
    label: "Imbal",
    fmt: (v) => (v == null || Number.isNaN(v) ? "—" : Number(v).toFixed(3)),
  },
  {
    key: "balanceOk",
    label: "Bal≤0.25",
    fmt: (v) => (v == null ? "—" : v ? "yes" : "no"),
  },
  {
    key: "maxPartFrac",
    label: "Max frac",
    fmt: (v) => (v == null || Number.isNaN(v) ? "—" : Number(v).toFixed(3)),
  },
  {
    key: "seedCutMean",
    label: "Seed μ",
    fmt: (v) => (v == null ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "seedCutStd",
    label: "Seed σ",
    fmt: (v) => (v == null ? "—" : Number(v).toFixed(2)),
  },
];

const RANK_BALANCE_TOL = 0.25;

function hedgesOf(graph) {
  if (graph.hedges?.length) return graph.hedges;
  return (graph.edges || []).map((e) => ({ pins: [e.u, e.v], w: e.w ?? 1 }));
}

function balanceKWay(assignment, sizes = null) {
  const ps = {};
  for (const [n, p] of Object.entries(assignment)) {
    ps[p] = (ps[p] || 0) + (sizes?.[n] ?? 1);
  }
  const vals = Object.values(ps);
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  const hi = Math.max(...vals);
  const lo = Math.min(...vals);
  const imbalance = (hi - lo) / total;
  return {
    k: vals.length,
    sizes: vals,
    imbalance,
    maxPartFrac: hi / total,
    ratio: lo / hi,
    balanceOk: imbalance <= RANK_BALANCE_TOL + 1e-12,
  };
}

function criticalNetCut(assignment, edges) {
  let total = 0;
  let any = false;
  for (const e of edges || []) {
    if (!e.critical) continue;
    any = true;
    if (assignment[e.u] !== assignment[e.v]) total += e.w ?? 1;
  }
  return any ? total : null;
}

function terminalViolations(assignment, terminals) {
  if (!terminals || !Object.keys(terminals).length) return 0;
  let v = 0;
  for (const [n, p] of Object.entries(terminals)) {
    if (assignment[n] == null || String(assignment[n]) !== String(p)) v++;
  }
  return v;
}

export function scoreCluster(assignment, graph) {
  const asn = { ...assignment };
  const bal = balanceKWay(asn, graph.sizes);
  const hedges = hedgesOf(graph);
  return {
    assignment: asn,
    cut: cutsize(asn, graph.edges || []),
    hyperCut: hyperedgeCut(asn, hedges),
    criticalNetCut: criticalNetCut(asn, graph.edges),
    terminalViolations: terminalViolations(asn, graph.terminals),
    parts: partsString(asn),
    k: bal.k,
    imbalance: bal.imbalance,
    maxPartFrac: bal.maxPartFrac,
    ratio: bal.ratio,
    balanceOk: bal.balanceOk,
    sizes: bal.sizes,
  };
}

function summarizeSeedCuts(cuts) {
  if (!cuts.length) {
    return { seedCutMin: null, seedCutMax: null, seedCutMean: null, seedCutStd: null };
  }
  const min = Math.min(...cuts);
  const max = Math.max(...cuts);
  const mean = cuts.reduce((a, b) => a + b, 0) / cuts.length;
  const var0 =
    cuts.reduce((s, c) => s + (c - mean) ** 2, 0) / Math.max(1, cuts.length);
  return {
    seedCutMin: min,
    seedCutMax: max,
    seedCutMean: mean,
    seedCutStd: Math.sqrt(var0),
  };
}

/**
 * Run one clustering builtin or uploaded solver.
 * opts.extraAlgos: [{ id, title, run(graph, opts), isUser }]
 */
export async function runClusterAlgo(algoId, graph, opts = {}) {
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
    opts.seedAsn || randomBipartition(nodes, opts.randomSeed ?? 7);
  const maxPasses = opts.maxPasses ?? 10;
  const targetK = opts.targetK ?? 2;

  switch (algoId) {
    case "greedy_k2": {
      const { assignment, mergeLog } = greedyPairMerge(nodes, edges, sizes, 2);
      return { assignment, detail: `merges=${mergeLog?.length ?? 0}` };
    }
    case "greedy_k3": {
      const { assignment, mergeLog } = greedyPairMerge(nodes, edges, sizes, 3);
      return { assignment, detail: `merges=${mergeLog?.length ?? 0}` };
    }
    case "gain_fill": {
      const { assignment, detail } = gainFillBipartition(nodes, edges, sizes, opts);
      return { assignment, detail };
    }
    case "label_prop": {
      const { labels, iters } = labelPropagation(nodes, edges, opts.maxIters ?? 50);
      return { assignment: labels, detail: `iters=${iters}` };
    }
    case "spectral": {
      const { assignment, order } = spectralBisection(nodes, edges, sizes);
      return {
        assignment,
        detail: `fiedler ${order?.map(([n]) => n).join("") || "?"}`,
        order,
      };
    }
    case "multilevel": {
      const assignment = multilevelCluster(nodes, edges, sizes, targetK);
      return { assignment, detail: "coarsen→FM" };
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
    case "multistart_fm": {
      const { assignment, detail } = multistartFmCluster(nodes, edges, sizes, {
        balanceTol: opts.balanceTol ?? 0.25,
        maxPasses: opts.maxPasses ?? 12,
        randomSeed: opts.randomSeed ?? 7,
        terminals: graph.terminals || opts.terminals || null,
      });
      return { assignment, detail };
    }
    case "hyper_greedy": {
      const hedges = hedgesOf(graph);
      const assignment = hypergraphGreedyCluster(nodes, hedges, sizes, 2);
      return { assignment, detail: `nets=${hedges.length}` };
    }
    case "congestion": {
      const cong =
        nodes.length <= 5 && nodes.includes("C")
          ? EDGE_CONGESTION
          : opts.congestionMap || {};
      const { assignment, plain, pen, objective } = congestionAwarePartition(
        nodes,
        edges,
        seedAsn,
        cong,
        opts.lam ?? 1
      );
      return {
        assignment,
        detail: `plain=${plain} pen=${pen} obj=${objective}`,
        seedUsed: { ...seedAsn },
      };
    }
    case "timing": {
      const crit =
        nodes.length <= 5 && nodes.includes("A")
          ? EDGE_CRITICALITY
          : opts.critMap || {};
      const { assignment, plain, weightedCut } = timingAwarePartition(
        nodes,
        edges,
        seedAsn,
        crit
      );
      return {
        assignment,
        detail: `plain=${plain} wcut=${weightedCut}`,
        seedUsed: { ...seedAsn },
      };
    }
    default:
      throw new Error(`Unknown cluster algo: ${algoId}`);
  }
}

function algoMeta(algoId, extraAlgos = []) {
  const extra = extraAlgos.find((a) => a.id === algoId);
  if (extra) {
    return { id: algoId, title: extra.title || algoId, isUser: !!extra.isUser };
  }
  const builtin = BENCHMARK_ALGOS.find((a) => a.id === algoId);
  return { id: algoId, title: builtin?.title || algoId, isUser: false };
}

function resolveAlgoIds(algoIds, extraAlgos = []) {
  const extras = (extraAlgos || []).filter((a) => a && a.id && typeof a.run === "function");
  const builtinIds = algoIds?.length ? algoIds : BENCHMARK_ALGOS.map((a) => a.id);
  const userIds = extras.filter((a) => a.isUser).map((a) => a.id);
  const otherExtra = extras.filter((a) => !a.isUser).map((a) => a.id);
  const seen = new Set([...userIds, ...otherExtra]);
  return [...userIds, ...otherExtra, ...builtinIds.filter((id) => !seen.has(id))];
}

function nowMs() {
  return typeof performance !== "undefined" && performance.now
    ? performance.now()
    : Date.now();
}

export function readHeapUsed() {
  try {
    const m = typeof performance !== "undefined" ? performance.memory : null;
    return m && typeof m.usedJSHeapSize === "number" ? m.usedJSHeapSize : null;
  } catch {
    return null;
  }
}

export function estimateWorkingSetBytes(algoId, graph, isUser = false) {
  const n = graph.nodes.length;
  const m = (graph.edges || []).length;
  const base = n * 64 + m * 48 + n * 32;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 48 + m * 16;
  switch (algoId) {
    case "spectral":
      return base + n * n * 8 + n * 64;
    case "kl":
      return base + n * n * 16 + n * 48;
    case "fm":
    case "congestion":
    case "timing":
      return base + n * 96 + m * 16;
    case "multilevel":
      return base + n * 128 + m * 32;
    case "multistart_fm":
      return base + n * 160 + m * 24 + n * n * 2;
    case "gain_fill":
      return base + n * 48 + m * 8;
    case "hyper_greedy":
      return base + n * 80 + m * 24;
    default:
      return base + n * 32;
  }
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  // Composite: terminals → balance ≤ 0.25 → cut → critical-net cut → hyperCut → seed σ → runtime
  const aTerm = a.terminalViolations ?? 0;
  const bTerm = b.terminalViolations ?? 0;
  if (aTerm !== bTerm) return aTerm - bTerm;
  const aBal = a.balanceOk === false ? 1 : 0;
  const bBal = b.balanceOk === false ? 1 : 0;
  if (aBal !== bBal) return aBal - bBal;
  const ac = a.cut ?? Infinity;
  const bc = b.cut ?? Infinity;
  if (ac !== bc) return ac - bc;
  const aCrit = a.criticalNetCut ?? 0;
  const bCrit = b.criticalNetCut ?? 0;
  if (aCrit !== bCrit) return aCrit - bCrit;
  const ah = a.hyperCut ?? Infinity;
  const bh = b.hyperCut ?? Infinity;
  if (ah !== bh) return ah - bh;
  const aSig = a.seedCutStd ?? 0;
  const bSig = b.seedCutStd ?? 0;
  if (Math.abs(aSig - bSig) > 1e-9) return aSig - bSig;
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runClusterBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const graph = inst.graph();
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
    const { title, isUser } = meta;
    try {
      if (warm) {
        await runClusterAlgo(algoId, graph, { ...opts, seedAsn });
      }
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runClusterAlgo(algoId, graph, { ...opts, seedAsn });
      const t1 = nowMs();
      const heap1 = readHeapUsed();

      const seedCuts = [cutsize(run.assignment, graph.edges || [])];
      if (seedTrials > 1 && BENCHMARK_ALGOS.find((a) => a.id === algoId)?.needsSeed) {
        for (let t = 1; t < seedTrials; t++) {
          const trialSeed = (opts.randomSeed ?? 7) + t * 19;
          const trialAsn = randomBipartition(graph.nodes, trialSeed);
          const trial = await runClusterAlgo(algoId, graph, {
            ...opts,
            seedAsn: trialAsn,
            randomSeed: trialSeed,
          });
          seedCuts.push(cutsize(trial.assignment, graph.edges || []));
        }
      }
      const seedStats = summarizeSeedCuts(seedCuts);
      const scored = scoreCluster(run.assignment, graph);
      const memEst = estimateWorkingSetBytes(algoId, graph, isUser);
      const heapDelta =
        heap0 != null && heap1 != null ? Math.max(0, heap1 - heap0) : null;

      rows.push({
        algoId,
        title,
        isUser,
        cut: scored.cut,
        hyperCut: scored.hyperCut,
        criticalNetCut: scored.criticalNetCut,
        terminalViolations: scored.terminalViolations,
        imbalance: scored.imbalance,
        balanceOk: scored.balanceOk,
        maxPartFrac: scored.maxPartFrac,
        ratio: scored.ratio,
        k: scored.k,
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
        ...seedStats,
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

/**
 * Dataset runner: selective (one instance) or average across many.
 */
export async function runClusterBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runClusterBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runClusterBenchmark(id, algoIds, opts));
  }

  const byAlgo = new Map();
  for (const rep of perInstance) {
    for (const row of rep.rows) {
      if (!byAlgo.has(row.algoId)) byAlgo.set(row.algoId, []);
      byAlgo.get(row.algoId).push(row);
    }
  }

  const metricKeys = [
    "cut",
    "hyperCut",
    "criticalNetCut",
    "terminalViolations",
    "imbalance",
    "maxPartFrac",
    "ms",
    "memBytes",
    "k",
    "seedCutMean",
    "seedCutStd",
  ];
  const rows = [];
  for (const [algoId, list] of byAlgo) {
    const ok = list.filter((r) => !r.error);
    const bad = list.find((r) => r.error);
    if (!ok.length) {
      rows.push({
        algoId,
        title: bad?.title || algoId,
        isUser: !!bad?.isUser,
        error: bad?.error || "all instances failed",
        ms: 0,
        memBytes: 0,
      });
      continue;
    }
    const mean = (key) =>
      ok.reduce((s, r) => s + (Number(r[key]) || 0), 0) / ok.length;
    const head = ok[0];
    const averaged = {
      algoId,
      title: head.title,
      isUser: head.isUser,
      parts: head.parts,
      assignment: head.assignment,
      detail: `avg over ${ok.length} instances`,
      samples: ok.length,
      vizInstanceId: perInstance[0]?.instanceId,
      cutMin: Math.min(...ok.map((r) => r.cut ?? Infinity)),
      cutMax: Math.max(...ok.map((r) => r.cut ?? -Infinity)),
      msMin: Math.min(...ok.map((r) => r.ms ?? Infinity)),
      msMax: Math.max(...ok.map((r) => r.ms ?? -Infinity)),
      nNodes: mean("nNodes"),
      balanceOk: ok.every((r) => r.balanceOk !== false),
    };
    for (const k of metricKeys) averaged[k] = mean(k);
    rows.push(averaged);
  }
  rows.sort(compareBenchRowsUserFirst);

  return {
    instanceId: "average",
    instanceIds: ids,
    instanceTitle: `Average of ${ids.length} instances`,
    notes: "Means across selected instances (uploads ranked first).",
    mode: "average",
    graph: perInstance[0]?.graph || null,
    seedAsn: perInstance[0]?.seedAsn || null,
    perInstance,
    rows,
  };
}
