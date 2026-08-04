/**
 * Detailed routing benchmark — shared placements, builtins, dataset runner.
 * Reuses platform/assets/detailed-routing-core.js (learn_routing labs).
 */
import {
  CELLS,
  CLUSTER_SEED,
  NETS,
  PLACEMENT,
  TRACK_CAPACITY,
  clonePositions,
  sequentialDetailed,
  terminalsFromPositions,
  totalHpwl,
  trackOverflow,
  usageFromDetailedRoutes,
  wireLength,
} from "./detailed-routing-core.js";
import {
  adaptiveLRoute,
  adaptiveThenRipup,
  adaptiveThenTopoRipup,
  astarThenRipup,
  astarThenTopoRipup,
  bulkRipupReroute,
  capHardNegotiated,
  hybridPatternAstar,
  lThenRipup,
  longestFirstAstar,
  multistartDetailed,
  negotiatedRoute,
  negotiatedThenTopoRipup,
  portfolioDetailed,
  pressureFirstAstar,
  shortestFirstAstar,
  steinerAstar,
  strongNegotiatedRoute,
} from "./detailed-routing-algo-advanced.js";

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

function makeInst(id, title, positionsFn, notes, trackCapacity = TRACK_CAPACITY) {
  return {
    id,
    title,
    notes,
    nCells: CELLS.length,
    trackCapacity,
    edgeCapacity: trackCapacity,
    instance: () => ({
      positions: clonePositions(positionsFn()),
      trackCapacity,
      edgeCapacity: trackCapacity,
      capacity: trackCapacity,
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
    "Long nets share M1/M2 tracks — L-HV often overflows."
  ),
  cluster: makeInst(
    "cluster",
    "Course cluster seed",
    () => CLUSTER_SEED,
    "Center pile — hot tracks around the blockage."
  ),
  tight_cap: makeInst(
    "tight_cap",
    "Hard · Tight capacity (Cap=1)",
    () => CLUSTER_SEED,
    "Same cluster, Cap=1 — more overflowing tracks.",
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
    "Crossing AB/CD nets — A* order and rip-up matter."
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
    "Pins near center columns — shared vertical M2 tracks."
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
  { id: "lee", title: "Lee maze", needsSeed: false },
  { id: "astar", title: "Sequential A*", needsSeed: false },
  { id: "adaptive_l", title: "Adaptive L (HV/VH)", needsSeed: false },
  { id: "longest_first", title: "Longest-first A*", needsSeed: false },
  { id: "shortest_first", title: "Shortest-first A*", needsSeed: false },
  { id: "pressure_first", title: "Pressure-first A*", needsSeed: false },
  { id: "hybrid", title: "Hybrid pattern/A*", needsSeed: false },
  { id: "steiner", title: "Steiner multipin A*", needsSeed: false },
  { id: "astar_ripup", title: "A* + rip-up", needsSeed: false },
  { id: "l_ripup", title: "L-HV + rip-up", needsSeed: false },
  { id: "adapt_ripup", title: "Adaptive L + rip-up", needsSeed: false },
  { id: "astar_topo", title: "A* + topo rip-up", needsSeed: false },
  { id: "adapt_topo", title: "Adaptive L + topo rip-up", needsSeed: false },
  { id: "bulk_ripup", title: "Bulk rip-up / hybrid", needsSeed: false },
  { id: "negotiated", title: "Negotiated congestion", needsSeed: false },
  { id: "neg_topo", title: "Negotiated + topo rip-up", needsSeed: false },
  { id: "strong_neg", title: "Strong negotiated", needsSeed: false },
  { id: "cap_hard", title: "Cap-hard negotiated", needsSeed: false },
  { id: "multistart", title: "Multistart detailed", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
];

export const DR_METRIC_COLUMNS = [
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

export function seedStress(positions, trackCapacity = TRACK_CAPACITY) {
  const terminals = terminalsFromPositions(positions);
  const { usage } = sequentialDetailed(NETS, terminals, "l_hv", trackCapacity);
  return trackOverflow(usage, trackCapacity).total;
}

export function scoreSolution(run, origin, trackCapacity = TRACK_CAPACITY) {
  const routes = run.routes || [];
  const usage = usageFromDetailedRoutes(routes);
  const ov = trackOverflow(usage, trackCapacity);
  return {
    routes,
    usage,
    totalOv: ov.total,
    maxOv: ov.max,
    countOv: ov.count,
    wirelen: wireLength(routes),
    hpwl: totalHpwl(origin),
    stress: seedStress(origin, trackCapacity),
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
    segments: (r.segments || []).map((s) => ({ ...s })),
  }));
}

export async function runDrAlgo(algoId, instance, opts = {}) {
  const positions = instance.positions;
  const cap =
    instance.trackCapacity ??
    instance.edgeCapacity ??
    instance.capacity ??
    TRACK_CAPACITY;
  const nets = instance.nets || NETS;
  const terminals = terminalsFromPositions(positions);

  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra?.run) {
    const out = await extra.run(
      {
        positions: clonePositions(positions),
        trackCapacity: cap,
        edgeCapacity: cap,
        capacity: cap,
        nets,
        cells: instance.cells,
      },
      { trackCapacity: cap, capacity: cap }
    );
    return {
      routes: cloneRoutes(out?.routes || []),
      detail: out?.detail || "upload",
    };
  }

  switch (algoId) {
    case "identity_lhv":
      return {
        routes: sequentialDetailed(nets, terminals, "l_hv", cap).routes,
        detail: "sequentialDetailed/l_hv",
      };
    case "l_vh":
      return {
        routes: sequentialDetailed(nets, terminals, "l_vh", cap).routes,
        detail: "sequentialDetailed/l_vh",
      };
    case "lee":
      return {
        routes: sequentialDetailed(nets, terminals, "lee", cap).routes,
        detail: "sequentialDetailed/lee",
      };
    case "astar":
      return {
        routes: sequentialDetailed(nets, terminals, "astar", cap).routes,
        detail: "sequentialDetailed/astar",
      };
    case "adaptive_l":
      return {
        routes: adaptiveLRoute(nets, terminals, cap),
        detail: "adaptiveLRoute",
      };
    case "longest_first":
      return {
        routes: longestFirstAstar(nets, terminals, cap),
        detail: "longestFirstAstar",
      };
    case "shortest_first":
      return {
        routes: shortestFirstAstar(nets, terminals, cap),
        detail: "shortestFirstAstar",
      };
    case "pressure_first":
      return {
        routes: pressureFirstAstar(nets, terminals, cap),
        detail: "pressureFirstAstar",
      };
    case "hybrid":
      return {
        routes: hybridPatternAstar(nets, terminals, cap),
        detail: "hybridPatternAstar",
      };
    case "steiner":
      return {
        routes: steinerAstar(nets, terminals, cap),
        detail: "steinerAstar",
      };
    case "astar_ripup":
      return {
        routes: astarThenRipup(nets, terminals, cap),
        detail: "astarThenRipup",
      };
    case "l_ripup":
      return {
        routes: lThenRipup(nets, terminals, cap, "HV"),
        detail: "lThenRipup/HV",
      };
    case "adapt_ripup":
      return {
        routes: adaptiveThenRipup(nets, terminals, cap),
        detail: "adaptiveThenRipup",
      };
    case "astar_topo":
      return {
        routes: astarThenTopoRipup(nets, terminals, cap),
        detail: "astarThenTopoRipup",
      };
    case "adapt_topo":
      return {
        routes: adaptiveThenTopoRipup(nets, terminals, cap),
        detail: "adaptiveThenTopoRipup",
      };
    case "bulk_ripup":
      return {
        routes: bulkRipupReroute(nets, terminals, cap),
        detail: "bulkRipupReroute",
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
    case "strong_neg":
      return {
        routes: strongNegotiatedRoute(nets, terminals, cap),
        detail: "strongNegotiatedRoute",
      };
    case "cap_hard":
      return {
        routes: capHardNegotiated(nets, terminals, cap),
        detail: "capHardNegotiated",
      };
    case "multistart":
      return {
        routes: multistartDetailed(nets, terminals, cap),
        detail: "multistartDetailed",
      };
    case "portfolio": {
      const out = portfolioDetailed(nets, terminals, cap);
      return { routes: out.routes, detail: out.detail };
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
  const base = n * 128 + GRID_BYTES() + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 64;
  switch (algoId) {
    case "portfolio":
    case "multistart":
    case "cap_hard":
    case "strong_neg":
    case "neg_topo":
    case "negotiated":
    case "bulk_ripup":
    case "astar_ripup":
    case "l_ripup":
    case "adapt_ripup":
    case "astar_topo":
    case "adapt_topo":
      return base + n * 280;
    case "longest_first":
    case "shortest_first":
    case "pressure_first":
    case "hybrid":
    case "steiner":
    case "astar":
    case "lee":
    case "adaptive_l":
      return base + n * 180;
    default:
      return base + n * 90;
  }
}

function GRID_BYTES() {
  return 12 * 8 * 16;
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

export async function runDrBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const origin = clonePositions(instance.positions);
  const cap = instance.trackCapacity ?? TRACK_CAPACITY;
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runDrAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runDrAlgo(algoId, instance, opts);
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
        trackCapacity: cap,
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
        trackCapacity: cap,
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

export async function runDrBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runDrBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runDrBenchmark(id, algoIds, opts));
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
