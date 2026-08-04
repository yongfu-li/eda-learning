/**
 * Placement benchmark — shared seeds, builtins, dataset runner.
 * Reuses platform/assets/placement-core.js (learn_placement labs).
 */
import {
  CELLS,
  FIXED_PADS,
  GOLDEN_PLACEMENT,
  NETS,
  NET_WEIGHTS,
  OVERLAP_PLACEMENT,
  STARTER_PLACEMENT,
  analyticalPlace,
  clonePositions,
  densityBins,
  forceDirectedPlace,
  minPairDistance,
  quadraticPlace,
  saPlace,
  spreadCells,
  totalHpwl,
} from "./placement-core.js";
import {
  analyticalDeepPlace,
  densForcePlace,
  densParetoPlace,
  densSaMultiPlace,
  densSaPlace,
  forceDeepPlace,
  forceQuadSaPlace,
  forceThenSpread,
  goldenRefPlace,
  legalizeAwarePlace,
  multistartPlace,
  placeCost,
  portfolioPlace,
  saDeepPlace,
  saMultiseedPlace,
  timingForcePlace,
} from "./placement-algo-advanced.js";

export const TEACH_SUITE = ["starter", "overlap", "fixed_pads"];
export const HARD_SUITE = [
  "starter",
  "overlap",
  "corner_spread",
  "center_crush",
  "net_pull",
  "timing_stress",
  "fixed_pads",
];
export const SCALE_SUITE = ["starter", "overlap", "corner_spread", "net_pull"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

function makeInst(id, title, positionsFn, notes, fixed = null) {
  return {
    id,
    title,
    notes,
    nCells: CELLS.length,
    instance: () => ({
      positions: clonePositions(positionsFn()),
      fixed: fixed ? [...fixed] : [],
      cells: [...CELLS],
      nets: NETS.map((n) => [...n]),
      weights: [...NET_WEIGHTS],
    }),
  };
}

export const BENCHMARK_INSTANCES = {
  starter: makeInst(
    "starter",
    "Course starter (HPWL 52)",
    () => STARTER_PLACEMENT,
    "Spread corners — force / SA should cut HPWL sharply."
  ),
  overlap: makeInst(
    "overlap",
    "Course overlap seed",
    () => OVERLAP_PLACEMENT,
    "Triple stack at (4,4) — spread / analytical matter for density."
  ),
  golden_ref: makeInst(
    "golden_ref",
    "Teach · Near-golden seed",
    () => GOLDEN_PLACEMENT,
    "Already compact (HPWL 14) — identity should win; others must not worsen."
  ),
  fixed_pads: makeInst(
    "fixed_pads",
    "Hard · Fixed pads A,D",
    () => STARTER_PLACEMENT,
    "A and D locked — quadratic / analytical with FIXED_PADS.",
    FIXED_PADS
  ),
  corner_spread: makeInst(
    "corner_spread",
    "Hard · Extreme corners",
    () => ({
      A: { x: 0, y: 0 },
      B: { x: 8, y: 0 },
      C: { x: 0, y: 8 },
      D: { x: 8, y: 8 },
      E: { x: 0, y: 4 },
      F: { x: 8, y: 4 },
    }),
    "All cells on boundary — deep force / portfolio should compact."
  ),
  center_crush: makeInst(
    "center_crush",
    "Hard · Center crush",
    () => ({
      A: { x: 4, y: 4 },
      B: { x: 4.1, y: 4 },
      C: { x: 4, y: 4.1 },
      D: { x: 3.9, y: 4 },
      E: { x: 4, y: 3.9 },
      F: { x: 4.2, y: 4.2 },
    }),
    "Near-total overlap — spread first, then wirelength."
  ),
  net_pull: makeInst(
    "net_pull",
    "Hard · Long net pull",
    () => ({
      A: { x: 0.5, y: 0.5 },
      B: { x: 7.5, y: 0.5 },
      C: { x: 0.5, y: 7.5 },
      D: { x: 7.5, y: 7.5 },
      E: { x: 2, y: 6 },
      F: { x: 6, y: 2 },
    }),
    "Connected pairs far apart — timing / force-deep should win."
  ),
  timing_stress: makeInst(
    "timing_stress",
    "Hard · Timing-critical net 4",
    () => STARTER_PLACEMENT,
    "Same starter geometry; score emphasizes weighted HPWL (net 4 ×5)."
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "identity", title: "Identity (seed)", needsSeed: false },
  { id: "force", title: "Force-directed", needsSeed: false },
  { id: "force_deep", title: "Force-directed deep", needsSeed: false },
  { id: "force_spread", title: "Force + spread", needsSeed: false },
  { id: "dens_force", title: "Density-aware force", needsSeed: false },
  { id: "timing_force", title: "Timing-weighted force", needsSeed: false },
  { id: "quadratic", title: "Quadratic (pads)", needsSeed: false },
  { id: "analytical", title: "Analytical lite", needsSeed: false },
  { id: "analytical_deep", title: "Analytical deep", needsSeed: false },
  { id: "sa", title: "Simulated annealing", needsSeed: false },
  { id: "sa_deep", title: "SA deep", needsSeed: false },
  { id: "sa_multi", title: "SA multiseed", needsSeed: false },
  { id: "dens_sa", title: "Density-penalized SA", needsSeed: false },
  { id: "dens_sa_multi", title: "Dens-SA multiseed", needsSeed: false },
  { id: "legalize_aware", title: "Legalize-aware place", needsSeed: false },
  { id: "fqs", title: "Force→quad→SA", needsSeed: false },
  { id: "spread", title: "Spread cells", needsSeed: false },
  { id: "dens_pareto", title: "Density Pareto (ov≤1)", needsSeed: false },
  { id: "multistart", title: "Multistart place", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
  { id: "golden", title: "Golden reference", needsSeed: false },
];

export const PLACE_METRIC_COLUMNS = [
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
    key: "hpwl",
    label: "HPWL",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
  {
    key: "overflow",
    label: "Σ dens",
    fmt: (v) => (v == null ? "—" : String(Math.round(v))),
  },
  {
    key: "cost",
    label: "Cost λ=8",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
  {
    key: "timingHpwl",
    label: "τ-HPWL",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
  {
    key: "minDist",
    label: "minΔ",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(2)),
  },
];

/** Mean L1 from chip center — seed difficulty proxy. */
export function placementExtent(positions) {
  const origin = { x: 4, y: 4 };
  let s = 0;
  for (const id of CELLS) {
    const p = positions[id];
    if (!p) continue;
    s += Math.abs(p.x - origin.x) + Math.abs(p.y - origin.y);
  }
  return s / CELLS.length;
}

export function seedStress(positions) {
  return totalHpwl(NETS, positions);
}

export function scoreSolution(run, origin, opts = {}) {
  const positions = run.positions || run.placement || origin;
  const nets = opts.nets || NETS;
  const weights = opts.weights || NET_WEIGHTS;
  const binCap = opts.binCap ?? 1;
  const nx = opts.nx ?? 3;
  const ny = opts.ny ?? 3;
  const dens = densityBins(positions, {
    nx,
    ny,
    x0: 0,
    y0: 0,
    x1: 8,
    y1: 8,
    capacity: binCap,
  });
  const scored = placeCost(positions, {
    nets,
    weights,
    binCap,
    nx,
    ny,
    lambda: opts.lambda ?? 8,
    minDist: opts.minDist ?? 0.75,
  });
  return {
    positions,
    hpwl: scored.hpwl,
    timingHpwl: scored.timing,
    overflow: dens.overflow,
    cost: scored.cost,
    minDist: minPairDistance(positions),
    stress: seedStress(origin),
    extent: placementExtent(origin),
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

export async function runPlaceAlgo(algoId, instance, opts = {}) {
  const positions = instance.positions;
  const fixed = instance.fixed || [];
  const packOpts = {
    fixed,
    nets: instance.nets || NETS,
    weights: instance.weights || NET_WEIGHTS,
  };

  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra?.run) {
    const out = await extra.run(clonePositions(positions), {
      ...packOpts,
      cells: instance.cells,
    });
    const pl = out?.positions || out?.placement || out;
    return {
      positions: clonePositions(pl),
      detail: out?.detail || "upload",
    };
  }

  switch (algoId) {
    case "identity":
      return { positions: clonePositions(positions), detail: "identity" };
    case "force":
      return {
        positions: forceDirectedPlace(positions, { fixed }),
        detail: "forceDirectedPlace",
      };
    case "force_deep":
      return {
        positions: forceDeepPlace(positions, packOpts),
        detail: "forceDeepPlace",
      };
    case "force_spread":
      return {
        positions: forceThenSpread(positions, packOpts),
        detail: "forceThenSpread",
      };
    case "dens_force":
      return {
        positions: densForcePlace(positions, packOpts),
        detail: "densForcePlace",
      };
    case "timing_force":
      return {
        positions: timingForcePlace(positions, packOpts),
        detail: "timingForcePlace",
      };
    case "quadratic":
      return {
        positions: quadraticPlace(positions, {
          fixed: fixed.length ? fixed : FIXED_PADS,
        }),
        detail: "quadraticPlace",
      };
    case "analytical":
      return {
        positions: analyticalPlace(positions, {
          fixed: fixed.length ? fixed : FIXED_PADS,
        }),
        detail: "analyticalPlace",
      };
    case "analytical_deep":
      return {
        positions: analyticalDeepPlace(positions, {
          ...packOpts,
          fixed: fixed.length ? fixed : FIXED_PADS,
        }),
        detail: "analyticalDeepPlace",
      };
    case "sa":
      return {
        positions: saPlace(positions, { seed: 42 }).positions,
        detail: "saPlace/42",
      };
    case "sa_deep":
      return {
        positions: saDeepPlace(positions, packOpts),
        detail: "saDeepPlace",
      };
    case "sa_multi":
      return {
        positions: saMultiseedPlace(positions, packOpts),
        detail: "saMultiseedPlace",
      };
    case "dens_sa":
      return {
        positions: densSaPlace(positions, packOpts),
        detail: "densSaPlace",
      };
    case "dens_sa_multi":
      return {
        positions: densSaMultiPlace(positions, packOpts),
        detail: "densSaMultiPlace",
      };
    case "legalize_aware":
      return {
        positions: legalizeAwarePlace(positions, packOpts),
        detail: "legalizeAwarePlace",
      };
    case "fqs":
      return {
        positions: forceQuadSaPlace(positions, packOpts),
        detail: "forceQuadSaPlace",
      };
    case "spread":
      return {
        positions: spreadCells(positions),
        detail: "spreadCells",
      };
    case "dens_pareto": {
      const out = densParetoPlace(positions, packOpts);
      return { positions: out.positions, detail: out.detail };
    }
    case "multistart":
      return {
        positions: multistartPlace(positions, packOpts),
        detail: "multistartPlace",
      };
    case "portfolio": {
      const out = portfolioPlace(positions, packOpts);
      return {
        positions: out.positions,
        detail: out.detail,
      };
    }
    case "golden":
      return {
        positions: goldenRefPlace(positions),
        detail: "GOLDEN_PLACEMENT",
      };
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
  const base = n * 128 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 64;
  switch (algoId) {
    case "portfolio":
    case "multistart":
    case "dens_pareto":
    case "dens_sa_multi":
    case "legalize_aware":
    case "sa_multi":
    case "fqs":
    case "sa_deep":
    case "dens_sa":
    case "analytical_deep":
      return base + n * 260;
    case "sa":
    case "analytical":
    case "force_deep":
    case "force_spread":
    case "dens_force":
    case "timing_force":
      return base + n * 160;
    default:
      return base + n * 80;
  }
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  // Anti-collapse: density overflow first, then composite cost, then HPWL.
  const ao = a.overflow ?? Infinity;
  const bo = b.overflow ?? Infinity;
  if (ao !== bo) return ao - bo;
  const ac = a.cost ?? Infinity;
  const bc = b.cost ?? Infinity;
  if (Math.abs(ac - bc) > 1e-9) return ac - bc;
  const ah = a.hpwl ?? Infinity;
  const bh = b.hpwl ?? Infinity;
  if (Math.abs(ah - bh) > 1e-9) return ah - bh;
  const at = a.timingHpwl ?? Infinity;
  const bt = b.timingHpwl ?? Infinity;
  if (Math.abs(at - bt) > 1e-9) return at - bt;
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runPlaceBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const origin = clonePositions(instance.positions);
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];
  const scoreOpts = {
    nets: instance.nets,
    weights: instance.weights,
    binCap: 1,
    nx: 3,
    ny: 3,
  };

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runPlaceAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runPlaceAlgo(algoId, instance, opts);
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
        hpwl: scored.hpwl,
        timingHpwl: scored.timingHpwl,
        overflow: scored.overflow,
        cost: scored.cost,
        minDist: scored.minDist,
        positions: scored.positions,
        stress: scored.stress,
        extent: scored.extent,
        detail: run.detail || "",
        ms: Math.max(0, t1 - t0),
        memBytes: heapDelta != null && heapDelta > 0 ? heapDelta : memEst,
        memEstBytes: memEst,
        heapDeltaBytes: heapDelta,
        memSource: heapDelta != null && heapDelta > 0 ? "heap-delta" : "estimate",
        instanceId,
        nCells: CELLS.length,
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
    instance: { ...instance, positions: origin },
    rows,
  };
}

export async function runPlaceBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runPlaceBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runPlaceBenchmark(id, algoIds, opts));
  }

  const byAlgo = new Map();
  for (const rep of perInstance) {
    for (const row of rep.rows) {
      if (!byAlgo.has(row.algoId)) byAlgo.set(row.algoId, []);
      byAlgo.get(row.algoId).push(row);
    }
  }

  const metricKeys = [
    "hpwl",
    "timingHpwl",
    "overflow",
    "cost",
    "minDist",
    "stress",
    "extent",
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
