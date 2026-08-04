/**
 * Compaction benchmark — shared layouts, builtins, dataset runner.
 * Reuses platform/assets/compaction-core.js (learn_compaction labs).
 */
import {
  CHIP,
  MIN_GAP,
  STARTER,
  cloneObjects,
  compact1d,
  compact2d,
  isLegal,
  layoutStats,
  sequentialCompact,
} from "./compaction-core.js";
import {
  areaParetoCompact,
  compactCost,
  deepSaCompact,
  dualShearCompact,
  gapRelaxCompact,
  graphThenSa,
  greedyPushCompact,
  hierarchicalCompact,
  iterative2d,
  jogAwareCompact,
  multistartCompact,
  orderSearchCompact,
  portfolioCompact,
  saShiftCompact,
  saShiftMulti,
  shearThenCompact,
  swapSaCompact,
  tilePackCompact,
} from "./compact-algo-advanced.js";

export const TEACH_SUITE = ["starter", "wide_gap", "compacted"];
export const HARD_SUITE = [
  "starter",
  "wide_gap",
  "tall_stack",
  "scattered",
  "shear_ready",
  "wire_long",
  "reverse_x",
];
export const SCALE_SUITE = ["starter", "wide_gap", "scattered", "wire_long"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

function makeInst(id, title, objectsFn, notes) {
  return {
    id,
    title,
    notes,
    nObjects: STARTER.length,
    instance: () => ({
      objects: cloneObjects(objectsFn()),
      chip: { ...CHIP },
      minGap: MIN_GAP,
    }),
  };
}

export const BENCHMARK_INSTANCES = {
  starter: makeInst(
    "starter",
    "Course starter (W=20)",
    () => STARTER,
    "Canonical A/B/C + wire — 1-D X should reach golden width 14."
  ),
  wide_gap: makeInst(
    "wide_gap",
    "Teach · Extra-wide gaps",
    () => [
      { id: "A", x0: 0, y0: 2, x1: 4, y1: 5, kind: "cell" },
      { id: "B", x0: 10, y0: 2, x1: 14, y1: 5, kind: "cell" },
      { id: "C", x0: 20, y0: 1, x1: 24, y1: 6, kind: "cell" },
      { id: "W", x0: 4, y0: 7, x1: 20, y1: 7, kind: "wire", layer: "M1" },
    ],
    "Larger X gaps — graph compact should crush span hard."
  ),
  compacted: makeInst(
    "compacted",
    "Teach · Near-compact seed",
    () => sequentialCompact(STARTER).objects,
    "Already compacted — identity should tie; others must not worsen legality."
  ),
  tall_stack: makeInst(
    "tall_stack",
    "Hard · Tall Y stack",
    () => [
      { id: "A", x0: 2, y0: 0, x1: 6, y1: 2, kind: "cell" },
      { id: "B", x0: 2, y0: 4, x1: 6, y1: 6, kind: "cell" },
      { id: "C", x0: 2, y0: 8, x1: 6, y1: 10, kind: "cell" },
      { id: "W", x0: 6, y0: 5, x1: 14, y1: 5, kind: "wire", layer: "M1" },
    ],
    "Vertical whitespace — Y-first / order search should win height."
  ),
  scattered: makeInst(
    "scattered",
    "Hard · Corner scatter",
    () => [
      { id: "A", x0: 0, y0: 0, x1: 3, y1: 2, kind: "cell" },
      { id: "B", x0: 18, y0: 0, x1: 22, y1: 3, kind: "cell" },
      { id: "C", x0: 10, y0: 7, x1: 14, y1: 10, kind: "cell" },
      { id: "W", x0: 3, y0: 5, x1: 18, y1: 5, kind: "wire", layer: "M1" },
    ],
    "Cells in corners — 2-D / SA / portfolio should shrink bbox area."
  ),
  shear_ready: makeInst(
    "shear_ready",
    "Hard · Shear channel",
    () => [
      { id: "A", x0: 0, y0: 3, x1: 4, y1: 6, kind: "cell" },
      { id: "B", x0: 8, y0: 3, x1: 12, y1: 6, kind: "cell" },
      { id: "C", x0: 16, y0: 3, x1: 20, y1: 6, kind: "cell" },
      { id: "W", x0: 4, y0: 8, x1: 16, y1: 8, kind: "wire", layer: "M1" },
    ],
    "Aligned mid-row — shear then compact can unlock Y."
  ),
  wire_long: makeInst(
    "wire_long",
    "Hard · Long wire span",
    () => [
      { id: "A", x0: 1, y0: 1, x1: 5, y1: 4, kind: "cell" },
      { id: "B", x0: 9, y0: 2, x1: 13, y1: 5, kind: "cell" },
      { id: "C", x0: 17, y0: 1, x1: 21, y1: 5, kind: "cell" },
      { id: "W", x0: 0, y0: 8, x1: 23, y1: 8, kind: "wire", layer: "M1" },
    ],
    "Wire spans chip — jog-aware / sequential retarget matters."
  ),
  reverse_x: makeInst(
    "reverse_x",
    "Hard · Reverse X order",
    () => [
      { id: "C", x0: 0, y0: 1, x1: 4, y1: 6, kind: "cell" },
      { id: "B", x0: 8, y0: 2, x1: 12, y1: 5, kind: "cell" },
      { id: "A", x0: 16, y0: 2, x1: 20, y1: 5, kind: "cell" },
      { id: "W", x0: 4, y0: 7, x1: 16, y1: 7, kind: "wire", layer: "M1" },
    ],
    "C-B-A left-to-right — constraint edges follow geometry, not labels."
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "identity", title: "Identity (seed)", needsSeed: false },
  { id: "compact_x", title: "1-D compact X", needsSeed: false },
  { id: "compact_y", title: "1-D compact Y", needsSeed: false },
  { id: "compact_xy", title: "2-D X→Y", needsSeed: false },
  { id: "compact_yx", title: "2-D Y→X", needsSeed: false },
  { id: "sequential", title: "Sequential + wire", needsSeed: false },
  { id: "iterative", title: "Iterative 2-D", needsSeed: false },
  { id: "order_search", title: "Axis-order search", needsSeed: false },
  { id: "greedy_push", title: "Greedy push origin", needsSeed: false },
  { id: "shear", title: "Shear → compact", needsSeed: false },
  { id: "dual_shear", title: "Multi-channel shear", needsSeed: false },
  { id: "jog", title: "Jog-aware compact", needsSeed: false },
  { id: "hierarchical", title: "Hierarchical abut", needsSeed: false },
  { id: "tile_pack", title: "Tile / BL re-pack", needsSeed: false },
  { id: "gap_relax", title: "Gap-relax compact", needsSeed: false },
  { id: "sa", title: "SA cell shifts", needsSeed: false },
  { id: "sa_multi", title: "SA multiseed", needsSeed: false },
  { id: "swap_sa", title: "Swap + shift SA", needsSeed: false },
  { id: "deep_sa", title: "Order → deep SA", needsSeed: false },
  { id: "graph_sa", title: "Graph → SA", needsSeed: false },
  { id: "area_pareto", title: "Area Pareto", needsSeed: false },
  { id: "multistart", title: "Multistart compact", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
];

export const COMPACT_METRIC_COLUMNS = [
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
    key: "illegal",
    label: "Illegal",
    fmt: (v) => (v == null ? "—" : String(Math.round(v))),
  },
  {
    key: "area",
    label: "BB area",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(0)),
  },
  {
    key: "width",
    label: "W",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(0)),
  },
  {
    key: "height",
    label: "H",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(0)),
  },
  {
    key: "cost",
    label: "Cost",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
];

export function seedStress(objects, chip = CHIP) {
  const st = layoutStats(objects, chip);
  return st.width * st.height + (isLegal(objects) ? 0 : 500);
}

export function scoreSolution(run, origin, opts = {}) {
  const objects = run.objects || origin;
  const chip = opts.chip || CHIP;
  const minGap = opts.minGap ?? MIN_GAP;
  const st = layoutStats(objects, chip);
  return {
    objects,
    illegal: isLegal(objects, minGap) ? 0 : 1,
    width: st.width,
    height: st.height,
    area: st.width * st.height,
    cost: compactCost(objects, chip, minGap),
    stress: seedStress(origin, chip),
    extent: (st.width + st.height) / 2,
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

export async function runCompactAlgo(algoId, instance, opts = {}) {
  const objects = instance.objects;
  const chip = instance.chip || CHIP;
  const minGap = instance.minGap ?? MIN_GAP;
  const packOpts = { chip, minGap, seed: 42 };

  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra?.run) {
    const out = await extra.run(cloneObjects(objects), packOpts);
    const pl = out?.objects || out;
    return {
      objects: cloneObjects(pl),
      detail: out?.detail || "upload",
    };
  }

  switch (algoId) {
    case "identity":
      return { objects: cloneObjects(objects), detail: "identity" };
    case "compact_x":
      return { objects: compact1d(objects, "x").objects, detail: "compact1d/x" };
    case "compact_y":
      return { objects: compact1d(objects, "y").objects, detail: "compact1d/y" };
    case "compact_xy":
      return {
        objects: compact2d(objects, ["x", "y"]).objects,
        detail: "compact2d/xy",
      };
    case "compact_yx":
      return {
        objects: compact2d(objects, ["y", "x"]).objects,
        detail: "compact2d/yx",
      };
    case "sequential":
      return {
        objects: sequentialCompact(objects).objects,
        detail: "sequentialCompact",
      };
    case "iterative":
      return { objects: iterative2d(objects, packOpts), detail: "iterative2d" };
    case "order_search":
      return {
        objects: orderSearchCompact(objects, packOpts),
        detail: "orderSearchCompact",
      };
    case "greedy_push":
      return {
        objects: greedyPushCompact(objects, packOpts),
        detail: "greedyPushCompact",
      };
    case "shear":
      return {
        objects: shearThenCompact(objects, packOpts),
        detail: "shearThenCompact",
      };
    case "dual_shear":
      return {
        objects: dualShearCompact(objects, packOpts),
        detail: "dualShearCompact",
      };
    case "jog":
      return {
        objects: jogAwareCompact(objects, packOpts),
        detail: "jogAwareCompact",
      };
    case "hierarchical":
      return {
        objects: hierarchicalCompact(objects, packOpts),
        detail: "hierarchicalCompact",
      };
    case "tile_pack":
      return {
        objects: tilePackCompact(objects, packOpts),
        detail: "tilePackCompact",
      };
    case "gap_relax":
      return {
        objects: gapRelaxCompact(objects, packOpts),
        detail: "gapRelaxCompact",
      };
    case "sa":
      return {
        objects: saShiftCompact(objects, { ...packOpts, moves: 240 }),
        detail: "saShiftCompact",
      };
    case "sa_multi":
      return {
        objects: saShiftMulti(objects, packOpts),
        detail: "saShiftMulti",
      };
    case "swap_sa":
      return {
        objects: swapSaCompact(objects, { ...packOpts, moves: 280 }),
        detail: "swapSaCompact",
      };
    case "deep_sa":
      return {
        objects: deepSaCompact(objects, packOpts),
        detail: "deepSaCompact",
      };
    case "graph_sa":
      return {
        objects: graphThenSa(objects, packOpts),
        detail: "graphThenSa",
      };
    case "area_pareto":
      return {
        objects: areaParetoCompact(objects, packOpts),
        detail: "areaParetoCompact",
      };
    case "multistart":
      return {
        objects: multistartCompact(objects, packOpts),
        detail: "multistartCompact",
      };
    case "portfolio": {
      const out = portfolioCompact(objects, packOpts);
      return { objects: out.objects, detail: out.detail };
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
  const n = (instance.objects || STARTER).length;
  const base = n * 180 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 80;
  switch (algoId) {
    case "portfolio":
    case "multistart":
    case "area_pareto":
    case "order_search":
    case "sa_multi":
    case "deep_sa":
    case "swap_sa":
    case "dual_shear":
    case "graph_sa":
      return base + n * 380;
    case "sa":
    case "iterative":
    case "shear":
    case "jog":
    case "hierarchical":
    case "tile_pack":
    case "gap_relax":
      return base + n * 240;
    default:
      return base + n * 100;
  }
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  const ai = a.illegal ?? Infinity;
  const bi = b.illegal ?? Infinity;
  if (ai !== bi) return ai - bi;
  const aa = a.area ?? Infinity;
  const ba = b.area ?? Infinity;
  if (Math.abs(aa - ba) > 1e-9) return aa - ba;
  const aw = a.width ?? Infinity;
  const bw = b.width ?? Infinity;
  if (Math.abs(aw - bw) > 1e-9) return aw - bw;
  const ah = a.height ?? Infinity;
  const bh = b.height ?? Infinity;
  if (Math.abs(ah - bh) > 1e-9) return ah - bh;
  const ac = a.cost ?? Infinity;
  const bc = b.cost ?? Infinity;
  if (Math.abs(ac - bc) > 1e-9) return ac - bc;
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runCompactBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const origin = cloneObjects(instance.objects);
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];
  const scoreOpts = { chip: instance.chip, minGap: instance.minGap };

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runCompactAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runCompactAlgo(algoId, instance, opts);
      const t1 = nowMs();
      const heap1 = readHeapUsed();
      const scored = scoreSolution(run, origin, scoreOpts);
      const memEst = estimateWorkingSetBytes(algoId, instance, isUser);
      const heapDelta =
        heap0 != null && heap1 != null ? Math.max(0, heap1 - heap0) : null;

      rows.push({
        algoId,
        title,
        isUser,
        illegal: scored.illegal,
        width: scored.width,
        height: scored.height,
        area: scored.area,
        cost: scored.cost,
        objects: scored.objects,
        stress: scored.stress,
        extent: scored.extent,
        detail: run.detail || "",
        ms: Math.max(0, t1 - t0),
        memBytes: heapDelta != null && heapDelta > 0 ? heapDelta : memEst,
        memEstBytes: memEst,
        heapDeltaBytes: heapDelta,
        memSource: heapDelta != null && heapDelta > 0 ? "heap-delta" : "estimate",
        instanceId,
        nObjects: STARTER.length,
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
        nObjects: STARTER.length,
        stress: seedStress(origin),
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
    instance: { ...instance, objects: origin },
    rows,
  };
}

export async function runCompactBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runCompactBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runCompactBenchmark(id, algoIds, opts));
  }

  const byAlgo = new Map();
  for (const rep of perInstance) {
    for (const row of rep.rows) {
      if (!byAlgo.has(row.algoId)) byAlgo.set(row.algoId, []);
      byAlgo.get(row.algoId).push(row);
    }
  }

  const metricKeys = [
    "illegal",
    "area",
    "width",
    "height",
    "cost",
    "stress",
    "extent",
    "ms",
    "memBytes",
  ];

  const rows = [];
  for (const [algoId, list] of byAlgo) {
    const sample = list[0];
    const ok = list.filter((r) => !r.error);
    if (!ok.length) {
      rows.push({
        algoId,
        title: sample.title,
        isUser: sample.isUser,
        error: list.map((r) => r.error).filter(Boolean).join("; "),
        ms: 0,
        memBytes: 0,
      });
      continue;
    }
    const avg = { algoId, title: sample.title, isUser: sample.isUser };
    for (const k of metricKeys) {
      const vals = ok.map((r) => r[k]).filter((v) => v != null && Number.isFinite(v));
      avg[k] = vals.length
        ? vals.reduce((s, v) => s + v, 0) / vals.length
        : null;
    }
    avg.detail = `avg/${ok.length}`;
    avg.objects = ok[0].objects;
    avg.memSource = "estimate";
    rows.push(avg);
  }

  rows.sort(compareBenchRowsUserFirst);
  return {
    instanceId: ids.join("+"),
    instanceIds: ids,
    instanceTitle: `Average · ${ids.length} instances`,
    notes: "Means across selected instances; ranking uses illegal → area → W/H.",
    mode: "average",
    instance: perInstance[0]?.instance || null,
    perInstance,
    rows,
  };
}
