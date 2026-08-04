/**
 * Congestion benchmark — shared placements, builtins, dataset runner.
 * Reuses platform/assets/congestion-core.js (learn_congestion labs).
 */
import {
  CAPACITY,
  CELLS,
  CONGESTED_SEED,
  NETS,
  PLACEMENT,
  clonePositions,
  overflowMetrics,
  placementFeedbackLite,
  probabilisticDemand,
  rudyDemand,
  totalHpwl,
} from "./congestion-core.js";
import {
  multipassFeedback,
  netWeightRelieve,
  portfolioRelieve,
  probabilisticEstimate,
  probabilisticFeedback,
  rudyEstimate,
  strongSpreadFeedback,
} from "./congestion-algo-advanced.js";

export const TEACH_SUITE = ["spread", "cluster", "tight_cap"];
export const HARD_SUITE = [
  "hot_center",
  "corner_pile",
  "cross_traffic",
  "micro_cap",
  "cluster",
  "tight_cap",
];
export const SCALE_SUITE = ["spread", "cluster", "hot_center", "cross_traffic"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

function makeInst(id, title, positionsFn, notes, capacity = CAPACITY) {
  return {
    id,
    title,
    notes,
    nCells: CELLS.length,
    capacity,
    instance: () => ({
      positions: clonePositions(positionsFn()),
      capacity,
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
    "Long nets paint many tiles — higher total overflow, milder peaks."
  ),
  cluster: makeInst(
    "cluster",
    "Course congested seed",
    () => CONGESTED_SEED,
    "Center pile — max overflow spikes; feedback should cool it."
  ),
  tight_cap: makeInst(
    "tight_cap",
    "Hard · Tight capacity (Cap=1)",
    () => CONGESTED_SEED,
    "Same cluster, Cap=1 — more overflowing tiles.",
    1
  ),
  hot_center: makeInst(
    "hot_center",
    "Hard · Hot center crush",
    () => ({
      A: { x: 5.5, y: 3.5 },
      B: { x: 6.0, y: 3.5 },
      C: { x: 5.5, y: 4.0 },
      D: { x: 6.0, y: 4.0 },
      E: { x: 5.7, y: 3.7 },
      F: { x: 5.9, y: 3.8 },
    }),
    "All pins near tile boundary — RUDY and probabilistic diverge."
  ),
  corner_pile: makeInst(
    "corner_pile",
    "Hard · Corner pile",
    () => ({
      A: { x: 0.5, y: 0.5 },
      B: { x: 1.0, y: 0.5 },
      C: { x: 0.5, y: 1.0 },
      D: { x: 1.2, y: 1.2 },
      E: { x: 0.8, y: 0.8 },
      F: { x: 1.5, y: 0.4 },
    }),
    "Everything in GCell (0,0) — strongSpread / multipass should move out."
  ),
  cross_traffic: makeInst(
    "cross_traffic",
    "Hard · Cross traffic",
    () => ({
      A: { x: 1, y: 1 },
      B: { x: 10, y: 6 },
      C: { x: 10, y: 1 },
      D: { x: 1, y: 6 },
      E: { x: 5.5, y: 3.5 },
      F: { x: 6.5, y: 4.0 },
    }),
    "Crossing long nets — probabilistic corridors vs RUDY bbox."
  ),
  micro_cap: makeInst(
    "micro_cap",
    "Hard · Micro capacity (Cap=0.75)",
    () => PLACEMENT,
    "Spread geometry with Cap=0.75 — estimators show large totals.",
    0.75
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "identity", title: "Identity (RUDY on seed)", needsSeed: false },
  { id: "rudy", title: "RUDY estimate", needsSeed: false },
  { id: "probabilistic", title: "Probabilistic L-shape", needsSeed: false },
  { id: "feedback", title: "Placement feedback (1-pass)", needsSeed: false },
  { id: "multipass", title: "Multipass RUDY feedback", needsSeed: false },
  { id: "prob_feedback", title: "Probabilistic feedback", needsSeed: false },
  { id: "strong_spread", title: "Strong diagonal spread", needsSeed: false },
  { id: "net_weight", title: "Net-weight + feedback", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
];

export const CONG_METRIC_COLUMNS = [
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
    key: "hpwl",
    label: "HPWL",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
];

/** Seed overflow total — difficulty proxy that separates Cap + packing. */
export function seedStress(positions, capacity = CAPACITY) {
  return overflowMetrics(rudyDemand(positions), capacity).total;
}

export function scoreSolution(run, origin, capacity = CAPACITY) {
  const positions = run.positions || run.placement || origin;
  // Always rank with RUDY on the final placement so estimators vs feedback compare fairly.
  // Keep run.demand for the heat-map view when an estimator returns its own map.
  const demandForScore = rudyDemand(positions);
  const demandForViz = run.demand || demandForScore;
  const ov = overflowMetrics(demandForScore, capacity);
  return {
    positions: clonePositions(positions),
    demand: demandForViz,
    totalOv: ov.total,
    maxOv: ov.max,
    countOv: ov.count,
    hpwl: totalHpwl(positions),
    stress: seedStress(origin, capacity),
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

export async function runCongAlgo(algoId, instance, opts = {}) {
  const positions = instance.positions;
  const capacity = instance.capacity ?? CAPACITY;

  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra?.run) {
    const out = await extra.run(
      {
        positions: clonePositions(positions),
        capacity,
        nets: instance.nets,
        cells: instance.cells,
      },
      { capacity }
    );
    return {
      positions: clonePositions(out?.positions || out?.placement || positions),
      demand: out?.demand,
      detail: out?.detail || "upload",
      estimator: out?.estimator,
    };
  }

  switch (algoId) {
    case "identity":
      return {
        positions: clonePositions(positions),
        demand: rudyDemand(positions),
        detail: "identity/rudy",
      };
    case "rudy":
      return rudyEstimate(positions);
    case "probabilistic":
      return probabilisticEstimate(positions);
    case "feedback":
      return {
        positions: placementFeedbackLite(positions, capacity),
        detail: "placementFeedbackLite",
      };
    case "multipass":
      return {
        positions: multipassFeedback(positions, { capacity, passes: 3 }),
        detail: "multipassFeedback",
      };
    case "prob_feedback":
      return {
        positions: probabilisticFeedback(positions, { capacity }),
        detail: "probabilisticFeedback",
      };
    case "strong_spread":
      return {
        positions: strongSpreadFeedback(positions, { capacity }),
        detail: "strongSpreadFeedback",
      };
    case "net_weight":
      return {
        positions: netWeightRelieve(positions, { capacity }),
        detail: "netWeightRelieve",
      };
    case "portfolio": {
      const out = portfolioRelieve(positions, { capacity });
      return {
        positions: out.positions,
        demand: out.demand,
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
  const base = n * 128 + GCELL_BYTES() + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 64;
  switch (algoId) {
    case "portfolio":
    case "multipass":
    case "net_weight":
      return base + n * 220;
    case "prob_feedback":
    case "strong_spread":
    case "feedback":
      return base + n * 160;
    default:
      return base + n * 80;
  }
}

function GCELL_BYTES() {
  return 4 * 2 * 24;
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  // Lower overflow wins; then HPWL; then runtime
  const at = a.totalOv ?? Infinity;
  const bt = b.totalOv ?? Infinity;
  if (Math.abs(at - bt) > 1e-9) return at - bt;
  const am = a.maxOv ?? Infinity;
  const bm = b.maxOv ?? Infinity;
  if (Math.abs(am - bm) > 1e-9) return am - bm;
  const ac = a.countOv ?? Infinity;
  const bc = b.countOv ?? Infinity;
  if (ac !== bc) return ac - bc;
  const ah = a.hpwl ?? Infinity;
  const bh = b.hpwl ?? Infinity;
  if (Math.abs(ah - bh) > 1e-9) return ah - bh;
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runCongBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const origin = clonePositions(instance.positions);
  const capacity = instance.capacity ?? CAPACITY;
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runCongAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runCongAlgo(algoId, instance, opts);
      const t1 = nowMs();
      const heap1 = readHeapUsed();
      const scored = scoreSolution(run, origin, capacity);
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
        hpwl: scored.hpwl,
        positions: scored.positions,
        demand: scored.demand,
        stress: scored.stress,
        detail: run.detail || "",
        ms: Math.max(0, t1 - t0),
        memBytes: heapDelta != null && heapDelta > 0 ? heapDelta : memEst,
        memEstBytes: memEst,
        heapDeltaBytes: heapDelta,
        memSource: heapDelta != null && heapDelta > 0 ? "heap-delta" : "estimate",
        instanceId,
        nCells: CELLS.length,
        capacity,
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
        stress: seedStress(origin, capacity),
        capacity,
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

export async function runCongBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runCongBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runCongBenchmark(id, algoIds, opts));
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
      positions: head.positions,
      demand: head.demand,
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
