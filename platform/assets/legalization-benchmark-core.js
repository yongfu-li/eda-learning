/**
 * Legalization benchmark — shared placements, builtins, dataset runner.
 * Reuses platform/assets/legalization-core.js (learn_legalization labs).
 */
import {
  CELLS,
  FIXED_MACROS,
  FLOAT_PLACEMENT,
  OVERLAP_PLACEMENT,
  abacusLegalize,
  clonePositions,
  detailedLegalize,
  globalLegalize,
  greedySnap,
  isLegal,
  legalizeCost,
  overlapRemoval,
  tetrisLegalize,
  totalDisplacement,
  totalHpwl,
} from "./legalization-core.js";
import {
  hpwlAwareLegalize,
  localPolishLegalize,
  multistartAbacus,
  portfolioLegalize,
  widthFirstLegalize,
} from "./legal-algo-advanced.js";

export const TEACH_SUITE = ["overlap", "float", "fixed_macro"];
/** Hard suite — Abacus / portfolio should beat snap & identity on legality + disp. */
export const HARD_SUITE = [
  "triple_stack",
  "float_messy",
  "corner_crush",
  "row_jam",
  "net_pull",
  "fixed_macro",
  "overlap",
];
export const SCALE_SUITE = ["overlap", "float", "triple_stack", "corner_crush", "net_pull"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

function makeInst(id, title, positionsFn, notes, fixed = null) {
  return {
    id,
    title,
    notes,
    nCells: CELLS.length,
    instance: () => ({
      positions: clonePositions(positionsFn()),
      fixed: fixed ? { ...fixed } : {},
      cells: [...CELLS],
    }),
  };
}

export const BENCHMARK_INSTANCES = {
  overlap: makeInst(
    "overlap",
    "Course overlap seed (A/B/C stacked)",
    () => OVERLAP_PLACEMENT,
    "Canonical illegal stack — Abacus lower displacement than Tetris."
  ),
  float: makeInst(
    "float",
    "Float global-place seed",
    () => FLOAT_PLACEMENT,
    "Greedy snap alone stays illegal; packers repair overlaps."
  ),
  fixed_macro: makeInst(
    "fixed_macro",
    "Hard · Fixed macro D",
    () => OVERLAP_PLACEMENT,
    "D locked at (8,4) — engines must pack around the macro.",
    FIXED_MACROS
  ),
  triple_stack: makeInst(
    "triple_stack",
    "Hard · Triple mid-row crush",
    () => ({
      A: { x: 5, y: 2 },
      B: { x: 5, y: 2 },
      C: { x: 5, y: 2 },
      D: { x: 5, y: 2 },
      E: { x: 5, y: 2 },
      F: { x: 5, y: 2 },
    }),
    "All six at same site — row assignment & pack order matter."
  ),
  float_messy: makeInst(
    "float_messy",
    "Hard · Messy float",
    () => ({
      A: { x: 4.8, y: 1.1 },
      B: { x: 5.1, y: 1.6 },
      C: { x: 5.4, y: 2.2 },
      D: { x: 5.0, y: 3.7 },
      E: { x: 4.6, y: 4.4 },
      F: { x: 5.3, y: 0.3 },
    }),
    "Nearly co-located floats — snap clusters; Abacus spreads with less L1."
  ),
  corner_crush: makeInst(
    "corner_crush",
    "Hard · Corner crush",
    () => ({
      A: { x: 0, y: 0 },
      B: { x: 0, y: 0 },
      C: { x: 0, y: 0 },
      D: { x: 10, y: 4 },
      E: { x: 11, y: 4 },
      F: { x: 11, y: 0 },
    }),
    "Left-corner stack + right-edge cells — overflow risk for left packers."
  ),
  row_jam: makeInst(
    "row_jam",
    "Hard · Single-row jam",
    () => ({
      A: { x: 1, y: 2 },
      B: { x: 2, y: 2 },
      C: { x: 3, y: 2 },
      D: { x: 4, y: 2 },
      E: { x: 5, y: 2 },
      F: { x: 6, y: 2 },
    }),
    "All prefer middle row — Tetris overflows; Abacus can spill to other rows."
  ),
  net_pull: makeInst(
    "net_pull",
    "Hard · Net-pull conflict",
    () => ({
      A: { x: 0.2, y: 0.1 },
      B: { x: 10.5, y: 0.2 },
      C: { x: 0.3, y: 4.5 },
      D: { x: 10.2, y: 4.4 },
      E: { x: 5.1, y: 2.1 },
      F: { x: 5.4, y: 2.3 },
    }),
    "Connected pairs pulled apart — HPWL-aware / polish should beat pure L1 Abacus."
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "identity", title: "Identity (no legalize)", needsSeed: false },
  { id: "greedy_snap", title: "Greedy site/row snap", needsSeed: false },
  { id: "overlap_removal", title: "Overlap removal (shelf)", needsSeed: false },
  { id: "tetris", title: "Tetris / global legalize", needsSeed: false },
  { id: "abacus", title: "Abacus / detailed legalize", needsSeed: false },
  { id: "width_first", title: "Width-first Abacus (FFD)", needsSeed: false },
  { id: "hpwl_aware", title: "HPWL-aware Abacus", needsSeed: false },
  { id: "multistart", title: "Multistart Abacus", needsSeed: false },
  { id: "polish", title: "Abacus + local polish", needsSeed: false },
  { id: "best_disp", title: "Portfolio min-displacement (legacy)", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
];

export const LEGAL_METRIC_COLUMNS = [
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
    key: "legal",
    label: "Legal",
    fmt: (v) => (v == null ? "—" : v ? "yes" : "no"),
  },
  {
    key: "disp",
    label: "Disp",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
  {
    key: "hpwl",
    label: "HPWL",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
  {
    key: "cost",
    label: "Cost λ=1",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
];

/** Mean L1 from origin — difficulty proxy (all instances share 6 cells). */
export function placementExtent(positions) {
  const origin = { x: 6, y: 2 };
  let s = 0;
  for (const id of CELLS) {
    const p = positions[id];
    if (!p) continue;
    s += Math.abs(p.x - origin.x) + Math.abs(p.y - origin.y);
  }
  return s / CELLS.length;
}

function portfolioMinDisp(positions, opts = {}) {
  const candidates = [
    abacusLegalize(positions, opts),
    tetrisLegalize(positions, opts),
    overlapRemoval(positions, opts),
    detailedLegalize(positions, opts),
    widthFirstLegalize(positions, opts),
    hpwlAwareLegalize(positions, opts),
  ];
  let best = null;
  let bestDisp = Infinity;
  for (const pl of candidates) {
    if (!isLegal(pl, opts)) continue;
    const d = totalDisplacement(positions, pl);
    if (d < bestDisp) {
      bestDisp = d;
      best = pl;
    }
  }
  return best || abacusLegalize(positions, opts);
}

export function scoreSolution(run, origin, opts = {}) {
  const positions = run.positions || run.placement || origin;
  const fixed = opts.fixed || {};
  const legal = isLegal(positions, { fixed });
  const disp = totalDisplacement(origin, positions);
  const hpwl = totalHpwl(positions);
  const cost = legalizeCost(positions, origin, 1);
  return {
    positions,
    legal,
    disp,
    hpwl,
    cost,
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
  return {
    title: up?.title || algoId,
    isUser: true,
  };
}

export async function runLegalAlgo(algoId, instance, opts = {}) {
  const positions = instance.positions;
  const fixed = instance.fixed || {};
  const packOpts = { fixed };

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
    case "greedy_snap":
      return {
        positions: greedySnap(positions, packOpts),
        detail: "greedySnap",
      };
    case "overlap_removal":
      return {
        positions: overlapRemoval(positions, packOpts),
        detail: "overlapRemoval",
      };
    case "tetris":
    case "global":
      return {
        positions: globalLegalize(positions, packOpts),
        detail: "tetris/global",
      };
    case "abacus":
    case "detailed":
      return {
        positions: abacusLegalize(positions, packOpts),
        detail: "abacus/detailed",
      };
    case "width_first":
      return {
        positions: widthFirstLegalize(positions, packOpts),
        detail: "widthFirstLegalize",
      };
    case "hpwl_aware":
      return {
        positions: hpwlAwareLegalize(positions, packOpts),
        detail: "hpwlAwareLegalize",
      };
    case "multistart":
      return {
        positions: multistartAbacus(positions, packOpts),
        detail: "multistartAbacus",
      };
    case "polish":
      return {
        positions: localPolishLegalize(positions, packOpts),
        detail: "localPolishLegalize",
      };
    case "best_disp":
      return {
        positions: portfolioMinDisp(positions, packOpts),
        detail: "portfolioMinDisp",
      };
    case "portfolio": {
      const out = portfolioLegalize(positions, packOpts);
      return {
        positions: out.positions || out,
        detail: out.detail || "portfolioLegalize",
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
  const base = n * 128 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 64;
  switch (algoId) {
    case "portfolio":
    case "best_disp":
    case "multistart":
    case "polish":
    case "hpwl_aware":
      return base + n * 220;
    case "width_first":
    case "abacus":
    case "detailed":
      return base + n * 160;
    case "tetris":
    case "overlap_removal":
    case "global":
      return base + n * 96;
    default:
      return base + n * 48;
  }
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  // Illegal last, then cost (HPWL+λ·disp) → disp → hpwl → ms
  const al = a.legal === true ? 0 : 1;
  const bl = b.legal === true ? 0 : 1;
  if (al !== bl) return al - bl;
  const ac = a.cost ?? Infinity;
  const bc = b.cost ?? Infinity;
  if (Math.abs(ac - bc) > 1e-9) return ac - bc;
  const ad = a.disp ?? Infinity;
  const bd = b.disp ?? Infinity;
  if (Math.abs(ad - bd) > 1e-9) return ad - bd;
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

export async function runLegalBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const origin = clonePositions(instance.positions);
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runLegalAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runLegalAlgo(algoId, instance, opts);
      const t1 = nowMs();
      const heap1 = readHeapUsed();
      const scored = scoreSolution(run, origin, { fixed: instance.fixed });
      const memEst = estimateWorkingSetBytes(algoId, instance, isUser);
      const heapDelta =
        heap0 != null && heap1 != null ? Math.max(0, heap1 - heap0) : null;

      rows.push({
        algoId,
        title,
        isUser,
        legal: scored.legal,
        disp: scored.disp,
        hpwl: scored.hpwl,
        cost: scored.cost,
        positions: scored.positions,
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
        extent: placementExtent(origin),
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

export async function runLegalBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runLegalBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runLegalBenchmark(id, algoIds, opts));
  }

  const byAlgo = new Map();
  for (const rep of perInstance) {
    for (const row of rep.rows) {
      if (!byAlgo.has(row.algoId)) byAlgo.set(row.algoId, []);
      byAlgo.get(row.algoId).push(row);
    }
  }

  const metricKeys = ["disp", "hpwl", "cost", "extent", "ms", "memBytes"];
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
      legal: ok.every((r) => r.legal),
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
