/**
 * Global routing benchmark — shared placements, builtins, dataset runner.
 * Reuses platform/assets/global-routing-core.js (learn_global_routing labs).
 */
import {
  CELLS,
  CLUSTER_SEED,
  EDGE_CAPACITY,
  NETS,
  PLACEMENT,
  clonePositions,
  edgeOverflow,
  routeAllL,
  routeAllMaze,
  terminalsFromPositions,
  totalHpwl,
  usageFromRoutes,
} from "./global-routing-core.js";
import {
  adaptiveLRoute,
  adaptiveLThenRipup,
  adaptiveThenTopoRipup,
  lThenRipup,
  lThenTopoRipup,
  longestFirstMaze,
  mazeThenRipup,
  multistartMaze,
  negotiatedRoute,
  negotiatedThenTopoRipup,
  portfolioRoute,
  routeAllZ,
  shortestFirstMaze,
  strongNegotiatedRoute,
  wireLength,
} from "./global-routing-algo-advanced.js";

export const TEACH_SUITE = ["spread", "cluster", "tight_cap"];
export const HARD_SUITE = [
  "cross_nets",
  "hot_corridor",
  "micro_cap",
  "cluster",
  "tight_cap",
  "spread_jam",
];
export const SCALE_SUITE = ["spread", "cluster", "cross_nets", "hot_corridor"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

function makeInst(id, title, positionsFn, notes, edgeCapacity = EDGE_CAPACITY) {
  return {
    id,
    title,
    notes,
    nCells: CELLS.length,
    edgeCapacity,
    instance: () => ({
      positions: clonePositions(positionsFn()),
      edgeCapacity,
      capacity: edgeCapacity,
      nets: NETS.map((n) => [...n]),
      cells: [...CELLS],
    }),
  };
}

export const BENCHMARK_INSTANCES = {
  spread: makeInst(
    "spread",
    "Course spread placement",
    () => PLACEMENT,
    "Long nets share corridors — L-HV often overflows."
  ),
  cluster: makeInst(
    "cluster",
    "Course cluster seed",
    () => CLUSTER_SEED,
    "Center pile — hot GCell edges between pins."
  ),
  tight_cap: makeInst(
    "tight_cap",
    "Hard · Tight capacity (Cap=1)",
    () => CLUSTER_SEED,
    "Same cluster, Cap=1 — more overflowing edges.",
    1
  ),
  micro_cap: makeInst(
    "micro_cap",
    "Hard · Micro capacity (Cap=1 spread)",
    () => PLACEMENT,
    "Spread geometry with Cap=1.",
    1
  ),
  cross_nets: makeInst(
    "cross_nets",
    "Hard · Crossing long nets",
    () => ({
      A: { x: 1, y: 1 },
      B: { x: 10, y: 6 },
      C: { x: 10, y: 1 },
      D: { x: 1, y: 6 },
      E: { x: 5.5, y: 3.5 },
      F: { x: 6.5, y: 4.0 },
    }),
    "Crossing AB/CD nets — maze order and rip-up matter."
  ),
  hot_corridor: makeInst(
    "hot_corridor",
    "Hard · Hot center corridor",
    () => ({
      A: { x: 5.0, y: 2.0 },
      B: { x: 6.0, y: 2.0 },
      C: { x: 5.0, y: 5.0 },
      D: { x: 6.0, y: 5.0 },
      E: { x: 5.5, y: 3.5 },
      F: { x: 5.5, y: 4.5 },
    }),
    "All pins near center columns — shared vertical edges."
  ),
  spread_jam: makeInst(
    "spread_jam",
    "Hard · Spread jam (Cap=1)",
    () => PLACEMENT,
    "Spread placement with Cap=1 — sequential L fails hard.",
    1
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "identity_lhv", title: "Identity L-HV (seed)", needsSeed: false },
  { id: "l_vh", title: "L-route VH", needsSeed: false },
  { id: "z_route", title: "Z-route + star", needsSeed: false },
  { id: "adaptive_l", title: "Adaptive L (HV/VH)", needsSeed: false },
  { id: "maze", title: "Sequential maze", needsSeed: false },
  { id: "maze_ripup", title: "Maze + rip-up", needsSeed: false },
  { id: "longest_first", title: "Longest-first maze", needsSeed: false },
  { id: "shortest_first", title: "Shortest-first maze", needsSeed: false },
  { id: "l_ripup", title: "L-HV + rip-up", needsSeed: false },
  { id: "adapt_ripup", title: "Adaptive L + rip-up", needsSeed: false },
  { id: "negotiated", title: "Negotiated congestion", needsSeed: false },
  { id: "neg_topo", title: "Negotiated + topo rip-up", needsSeed: false },
  { id: "l_topo", title: "L-HV + topo rip-up", needsSeed: false },
  { id: "adapt_topo", title: "Adaptive L + topo rip-up", needsSeed: false },
  { id: "strong_neg", title: "Strong negotiated", needsSeed: false },
  { id: "multistart", title: "Multistart maze", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
];

export const GR_METRIC_COLUMNS = [
  {
    key: "ms",
    label: "ms",
    fmt: (v) => (v == null ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "memBytes",
    label: "Mem",
    fmt: (v, row) => {
      if (v == null) return "—";
      const kb = v / 1024;
      const s =
        kb >= 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
      return row?.memSource === "estimate" ? `${s}*` : s;
    },
  },
  {
    key: "totalOv",
    label: "Σ ov",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "maxOv",
    label: "max ov",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "countOv",
    label: "#ov",
    fmt: (v) => (v == null ? "—" : String(Math.round(v))),
  },
  {
    key: "wirelen",
    label: "Wire",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : String(Math.round(v))),
  },
  {
    key: "hpwl",
    label: "HPWL",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
];

/** Seed overflow — routeAllL HV on placement (difficulty proxy). */
export function seedStress(positions, edgeCapacity = EDGE_CAPACITY) {
  const terminals = terminalsFromPositions(positions);
  const routes = routeAllL(NETS, terminals, "HV");
  return edgeOverflow(usageFromRoutes(routes), edgeCapacity).total;
}

export function scoreSolution(run, origin, edgeCapacity = EDGE_CAPACITY) {
  const routes = run.routes || [];
  const usage = usageFromRoutes(routes);
  const ov = edgeOverflow(usage, edgeCapacity);
  return {
    routes,
    usage,
    totalOv: ov.total,
    maxOv: ov.max,
    countOv: ov.count,
    wirelen: wireLength(routes),
    hpwl: totalHpwl(origin),
    stress: seedStress(origin, edgeCapacity),
  };
}

function nowMs() {
  return typeof performance !== "undefined" && performance.now
    ? performance.now()
    : Date.now();
}

function resolveAlgoIds(algoIds, extraAlgos) {
  const base = algoIds?.length ? [...algoIds] : BENCHMARK_ALGOS.map((a) => a.id);
  for (const a of extraAlgos || []) {
    if (a?.id && !base.includes(a.id)) base.push(a.id);
  }
  return base;
}

function algoMeta(algoId, extraAlgos) {
  const builtin = BENCHMARK_ALGOS.find((a) => a.id === algoId);
  if (builtin) return { title: builtin.title, isUser: false };
  const up = (extraAlgos || []).find((a) => a.id === algoId);
  return { title: up?.title || algoId, isUser: true };
}

function cloneRoutes(routes) {
  return (routes || []).map((r) => ({
    netIndex: r.netIndex,
    net: r.net,
    center: r.center ? { ...r.center } : undefined,
    paths: r.paths.map((p) => p.map((g) => ({ ...g }))),
  }));
}

export async function runGrAlgo(algoId, instance, opts = {}) {
  const positions = instance.positions;
  const cap = instance.edgeCapacity ?? instance.capacity ?? EDGE_CAPACITY;
  const nets = instance.nets || NETS;
  const terminals = terminalsFromPositions(positions);

  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra?.run) {
    const out = await extra.run(
      {
        positions: clonePositions(positions),
        edgeCapacity: cap,
        capacity: cap,
        nets,
        cells: instance.cells,
      },
      { edgeCapacity: cap, capacity: cap }
    );
    return {
      routes: cloneRoutes(out?.routes || []),
      detail: out?.detail || "upload",
    };
  }

  switch (algoId) {
    case "identity_lhv":
      return {
        routes: routeAllL(nets, terminals, "HV"),
        detail: "routeAllL/HV",
      };
    case "l_vh":
      return {
        routes: routeAllL(nets, terminals, "VH"),
        detail: "routeAllL/VH",
      };
    case "z_route":
      return {
        routes: routeAllZ(nets, terminals),
        detail: "routeAllZ",
      };
    case "maze":
      return {
        routes: routeAllMaze(nets, terminals, cap),
        detail: "routeAllMaze",
      };
    case "maze_ripup":
      return {
        routes: mazeThenRipup(nets, terminals, cap),
        detail: "mazeThenRipup",
      };
    case "longest_first":
      return {
        routes: longestFirstMaze(nets, terminals, cap, positions),
        detail: "longestFirstMaze",
      };
    case "shortest_first":
      return {
        routes: shortestFirstMaze(nets, terminals, cap, positions),
        detail: "shortestFirstMaze",
      };
    case "adaptive_l":
      return {
        routes: adaptiveLRoute(nets, terminals, cap),
        detail: "adaptiveLRoute",
      };
    case "l_ripup":
      return {
        routes: lThenRipup(nets, terminals, cap, "HV"),
        detail: "lThenRipup/HV",
      };
    case "adapt_ripup":
      return {
        routes: adaptiveLThenRipup(nets, terminals, cap),
        detail: "adaptiveLThenRipup",
      };
    case "negotiated":
      return {
        routes: negotiatedRoute(nets, terminals, cap),
        detail: "negotiatedRoute",
      };
    case "neg_topo":
      return {
        routes: negotiatedThenTopoRipup(nets, terminals, cap),
        detail: "negotiatedThenTopoRipup",
      };
    case "l_topo":
      return {
        routes: lThenTopoRipup(nets, terminals, cap, "HV"),
        detail: "lThenTopoRipup/HV",
      };
    case "adapt_topo":
      return {
        routes: adaptiveThenTopoRipup(nets, terminals, cap),
        detail: "adaptiveThenTopoRipup",
      };
    case "strong_neg":
      return {
        routes: strongNegotiatedRoute(nets, terminals, cap),
        detail: "strongNegotiatedRoute",
      };
    case "multistart":
      return {
        routes: multistartMaze(nets, terminals, cap, positions),
        detail: "multistartMaze",
      };
    case "portfolio": {
      const out = portfolioRoute(nets, terminals, positions, cap);
      return {
        routes: out.routes,
        detail: out.detail,
      };
    }
    default:
      throw new Error(`Unknown algo: ${algoId}`);
  }
}

function readHeapUsed() {
  try {
    const m = typeof performance !== "undefined" ? performance.memory : null;
    return m && typeof m.usedJSHeapSize === "number" ? m.usedJSHeapSize : null;
  } catch {
    return null;
  }
}

export function estimateWorkingSetBytes(algoId, instance, isUser = false) {
  const n = (instance.cells || CELLS).length;
  const base = n * 128 + 10 * 24 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 64;
  switch (algoId) {
    case "portfolio":
    case "multistart":
    case "strong_neg":
    case "neg_topo":
    case "negotiated":
    case "maze_ripup":
    case "l_ripup":
    case "adapt_ripup":
    case "l_topo":
    case "adapt_topo":
      return base + n * 220;
    case "longest_first":
    case "shortest_first":
    case "maze":
    case "adaptive_l":
      return base + n * 160;
    default:
      return base + n * 80;
  }
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  const at = a.totalOv ?? Infinity;
  const bt = b.totalOv ?? Infinity;
  if (Math.abs(at - bt) > 1e-9) return at - bt;
  const am = a.maxOv ?? Infinity;
  const bm = b.maxOv ?? Infinity;
  if (Math.abs(am - bm) > 1e-9) return am - bm;
  const aw = a.wirelen ?? Infinity;
  const bw = b.wirelen ?? Infinity;
  if (aw !== bw) return aw - bw;
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runGrBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const origin = clonePositions(instance.positions);
  const cap = instance.edgeCapacity ?? EDGE_CAPACITY;
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runGrAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runGrAlgo(algoId, instance, opts);
      const t1 = nowMs();
      const heap1 = readHeapUsed();
      const scored = scoreSolution(run, origin, cap);
      const memEst = estimateWorkingSetBytes(algoId, instance, isUser);
      const heapDelta =
        heap0 != null && heap1 != null ? Math.max(0, heap1 - heap0) : null;

      rows.push({
        algoId,
        title,
        isUser,
        totalOv: scored.totalOv,
        maxOv: scored.maxOv,
        countOv: scored.countOv,
        wirelen: scored.wirelen,
        hpwl: scored.hpwl,
        routes: scored.routes,
        usage: scored.usage,
        stress: scored.stress,
        detail: run.detail || "",
        ms: Math.max(0, t1 - t0),
        memBytes: heapDelta != null && heapDelta > 0 ? heapDelta : memEst,
        memEstBytes: memEst,
        heapDeltaBytes: heapDelta,
        memSource: heapDelta != null && heapDelta > 0 ? "heap-delta" : "estimate",
        instanceId,
        nCells: CELLS.length,
        edgeCapacity: cap,
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
        nCells: CELLS.length,
        stress: seedStress(origin, cap),
        edgeCapacity: cap,
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
    instance: { ...instance, positions: origin },
    rows,
  };
}

export async function runGrBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runGrBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runGrBenchmark(id, algoIds, opts));
  }

  const byAlgo = new Map();
  for (const rep of perInstance) {
    for (const row of rep.rows) {
      if (!byAlgo.has(row.algoId)) byAlgo.set(row.algoId, []);
      byAlgo.get(row.algoId).push(row);
    }
  }

  const metricKeys = [
    "totalOv",
    "maxOv",
    "countOv",
    "wirelen",
    "hpwl",
    "stress",
    "ms",
    "memBytes",
  ];
  const rows = [];
  for (const [, list] of byAlgo) {
    const ok = list.filter((r) => !r.error);
    const bad = list.find((r) => r.error);
    if (!ok.length) {
      rows.push({
        algoId: bad.algoId,
        title: bad?.title || bad.algoId,
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
      algoId: head.algoId,
      title: head.title,
      isUser: head.isUser,
      routes: head.routes,
      usage: head.usage,
      detail: `avg over ${ok.length} instances`,
      samples: ok.length,
      vizInstanceId: perInstance[0]?.instanceId,
      nCells: mean("nCells"),
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
    instance: perInstance[0]?.instance || null,
    perInstance,
    rows,
  };
}
