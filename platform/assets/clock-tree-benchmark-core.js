/**
 * Clock-tree benchmark — shared sink placements, builtins, dataset runner.
 * Reuses platform/assets/clock-tree-core.js (learn_clock_tree labs).
 */
import {
  CELLS,
  CHIP_H,
  CHIP_W,
  CLOCK_SOURCE,
  GOLDENS,
  PLACEMENT,
  bufferedLatencies,
  clonePositions,
  hTree,
  insertBuffers,
  latency,
  manhattan,
  mmmTree,
  sequentialCts,
  skew,
  zeroSkewMerge,
} from "./clock-tree-core.js";

export const TEACH_SUITE = ["spread", "clustered", "asymmetric"];
export const HARD_SUITE = ["spread", "clustered", "asymmetric", "corners", "ring"];
export const SCALE_SUITE = ["spread", "clustered", "corners"];

/** Cluster sinks near the clock source (harder for H-tree balance narrative / easy WL). */
function makeClustered() {
  const src = { ...CLOCK_SOURCE };
  return {
    A: { x: src.x - 1, y: src.y - 1 },
    B: { x: src.x + 1, y: src.y - 1 },
    C: { x: src.x - 1, y: src.y + 1 },
    D: { x: src.x + 1, y: src.y + 1 },
    E: { x: src.x, y: src.y - 0.5 },
    F: { x: src.x + 0.5, y: src.y },
  };
}

/** Heavy left side — stresses naive sequential / unbalanced merges. */
function makeAsymmetric() {
  return {
    A: { x: 1, y: 1 },
    B: { x: 2, y: 2 },
    C: { x: 1, y: 5 },
    D: { x: 2, y: 6 },
    E: { x: 3, y: 3.5 },
    F: { x: 10, y: 4 },
  };
}

/** Extreme corners (E/F still near mid for CELLS completeness). */
function makeCorners() {
  return {
    A: { x: 0.5, y: 0.5 },
    B: { x: 11.5, y: 0.5 },
    C: { x: 0.5, y: 7.5 },
    D: { x: 11.5, y: 7.5 },
    E: { x: 0.5, y: 4 },
    F: { x: 11.5, y: 4 },
  };
}

/** Ring around source — good zero-skew / bad sequential. */
function makeRing() {
  const src = { ...CLOCK_SOURCE };
  const r = 3;
  const angles = [0, 60, 120, 180, 240, 300].map((d) => (d * Math.PI) / 180);
  const ids = CELLS;
  const out = {};
  ids.forEach((id, i) => {
    out[id] = {
      x: Math.max(0.5, Math.min(CHIP_W - 0.5, src.x + r * Math.cos(angles[i]))),
      y: Math.max(0.5, Math.min(CHIP_H - 0.5, src.y + r * Math.sin(angles[i]))),
    };
  });
  return out;
}

function makeInstance(id, title, positionsFn, notes) {
  const positions = positionsFn();
  return {
    id,
    title,
    nSinks: CELLS.length,
    notes,
    instance: () => ({
      positions: clonePositions(positionsFn()),
      source: { ...CLOCK_SOURCE },
      chipW: CHIP_W,
      chipH: CHIP_H,
      cells: [...CELLS],
    }),
    // stable snapshot for nSinks display
    _preview: positions,
  };
}

export const BENCHMARK_INSTANCES = {
  spread: makeInstance(
    "spread",
    "Course spread (6 sinks)",
    () => clonePositions(PLACEMENT),
    "Canonical learn_clock_tree placement; H-tree skew golden ≈ 2."
  ),
  clustered: makeInstance(
    "clustered",
    "Clustered near CLK",
    makeClustered,
    "Sinks packed near source — low WL, algorithms still differ on skew."
  ),
  asymmetric: makeInstance(
    "asymmetric",
    "Asymmetric (left-heavy)",
    makeAsymmetric,
    "Five sinks left, one far right — sequential often worse skew."
  ),
  corners: makeInstance(
    "corners",
    "Hard · Far corners",
    makeCorners,
    "Corner-heavy load; zero-skew merge should dominate skew."
  ),
  ring: makeInstance(
    "ring",
    "Hard · Ring around source",
    makeRing,
    "Angular ring — stresses sequential attach order."
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "h_tree", title: "Recursive H-tree", needsSeed: false },
  { id: "mmm", title: "Greedy MMM merge", needsSeed: false },
  { id: "zero_skew", title: "Zero-skew merge (DME lite)", needsSeed: false },
  { id: "sequential", title: "Sequential nearest attach", needsSeed: false },
  { id: "h_tree_buf", title: "H-tree + buffers", needsSeed: false },
  { id: "mmm_buf", title: "MMM + buffers", needsSeed: false },
  { id: "zero_skew_buf", title: "Zero-skew + buffers", needsSeed: false },
  { id: "best_skew", title: "Portfolio min-skew (H/MMM/ZS)", needsSeed: false },
];

export const CTS_METRIC_COLUMNS = [
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
  {
    key: "skew",
    label: "Skew",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "skewOk",
    label: `Skew≤${GOLDENS.skewBoundDefault}`,
    fmt: (v) => (v == null ? "—" : v ? "yes" : "no"),
  },
  {
    key: "maxLatency",
    label: "Max lat",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "wl",
    label: "WL",
    fmt: (v) => (v == null ? "—" : Number(v).toFixed(1)),
  },
  {
    key: "buffers",
    label: "Bufs",
    fmt: (v) => (v == null ? "—" : String(v)),
  },
  {
    key: "steiners",
    label: "Steiners",
    fmt: (v) => (v == null ? "—" : String(v)),
  },
];

function wirelength(tree) {
  let total = 0;
  for (const e of tree.edges || []) {
    total += manhattan({ x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 });
  }
  return total;
}

/** Mean Manhattan distance from clock source to sinks (placement difficulty proxy). */
export function sinkExtent(positions, source = CLOCK_SOURCE, cells = CELLS) {
  const ids = cells?.length ? cells : Object.keys(positions);
  if (!ids.length) return 0;
  let sum = 0;
  for (const id of ids) {
    const p = positions[id];
    if (!p) continue;
    sum += manhattan(source, p);
  }
  return sum / ids.length;
}

export function scoreTree(tree, positions, opts = {}) {
  const bound = opts.skewBound ?? GOLDENS.skewBoundDefault;
  const hasBuf = (tree.buffers || []).length > 0;
  let skewVal;
  let maxLat;
  if (hasBuf) {
    const lats = bufferedLatencies(tree, positions);
    const vals = CELLS.map((id) => lats[id]).filter((v) => Number.isFinite(v));
    maxLat = vals.length ? Math.max(...vals) : Infinity;
    const minLat = vals.length ? Math.min(...vals) : 0;
    skewVal = vals.length ? maxLat - minLat : Infinity;
  } else {
    skewVal = skew(tree, positions);
    const vals = CELLS.map((id) => latency(tree, id, positions)).filter((v) =>
      Number.isFinite(v)
    );
    maxLat = vals.length ? Math.max(...vals) : Infinity;
  }
  return {
    skew: skewVal,
    skewOk: Number.isFinite(skewVal) && skewVal <= bound + 1e-9,
    maxLatency: maxLat,
    wl: wirelength(tree),
    buffers: (tree.buffers || []).length,
    steiners: (tree.steiners || []).length,
    tree,
  };
}

/**
 * Run one CTS builtin or uploaded solver.
 * Upload contract: synthesize(instance, opts) → { tree, detail? }
 * instance: { positions, source, chipW, chipH, cells }
 */
export async function runCtsAlgo(algoId, instance, opts = {}) {
  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra) {
    const out = await Promise.resolve(extra.run(instance, opts));
    if (!out || !out.tree) {
      throw new Error(`${extra.title || algoId}: run() must return { tree }`);
    }
    return {
      tree: out.tree,
      detail: out.detail || (extra.isUser ? "uploaded" : ""),
    };
  }

  const positions = instance.positions;
  const source = instance.source || CLOCK_SOURCE;
  const maxWire = opts.maxWireLen ?? GOLDENS.maxWireLenDefault;

  switch (algoId) {
    case "h_tree":
      return { tree: hTree(positions, source), detail: "hTree" };
    case "mmm":
      return { tree: mmmTree(positions, source), detail: "mmmTree" };
    case "zero_skew":
      return { tree: zeroSkewMerge(positions, source), detail: "zeroSkewMerge" };
    case "sequential":
      return {
        tree: sequentialCts(positions, instance.cells || CELLS, source),
        detail: "sequentialCts",
      };
    case "h_tree_buf":
      return {
        tree: insertBuffers(hTree(positions, source), maxWire),
        detail: `hTree+buf maxWire=${maxWire}`,
      };
    case "mmm_buf":
      return {
        tree: insertBuffers(mmmTree(positions, source), maxWire),
        detail: `mmm+buf maxWire=${maxWire}`,
      };
    case "zero_skew_buf":
      return {
        tree: insertBuffers(zeroSkewMerge(positions, source), maxWire),
        detail: `zs+buf maxWire=${maxWire}`,
      };
    case "best_skew": {
      const cands = [
        { name: "h_tree", tree: hTree(positions, source) },
        { name: "mmm", tree: mmmTree(positions, source) },
        { name: "zero_skew", tree: zeroSkewMerge(positions, source) },
      ];
      let best = null;
      for (const c of cands) {
        const s = scoreTree(c.tree, positions, opts);
        if (
          !best ||
          s.skew < best.skew - 1e-12 ||
          (Math.abs(s.skew - best.skew) < 1e-12 && s.wl < best.wl)
        ) {
          best = { ...s, name: c.name, tree: c.tree };
        }
      }
      return {
        tree: best.tree,
        detail: `best_skew from=${best.name} skew=${best.skew}`,
      };
    }
    default:
      throw new Error(`Unknown CTS algo: ${algoId}`);
  }
}

function algoMeta(algoId, extraAlgos = []) {
  const extra = extraAlgos.find((a) => a.id === algoId);
  if (extra) return { id: algoId, title: extra.title || algoId, isUser: !!extra.isUser };
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

export function estimateWorkingSetBytes(algoId, instance, isUser = false) {
  const n = (instance.cells || CELLS).length;
  const base = n * 96 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 64;
  if (String(algoId).includes("buf") || algoId === "best_skew") return base + n * 128;
  return base + n * 48;
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  // Composite: skew bound fail → skew → max latency → WL → buffers → runtime
  const aOk = a.skewOk === false ? 1 : 0;
  const bOk = b.skewOk === false ? 1 : 0;
  if (aOk !== bOk) return aOk - bOk;
  const as = a.skew ?? Infinity;
  const bs = b.skew ?? Infinity;
  if (Math.abs(as - bs) > 1e-9) return as - bs;
  const al = a.maxLatency ?? Infinity;
  const bl = b.maxLatency ?? Infinity;
  if (Math.abs(al - bl) > 1e-9) return al - bl;
  const aw = a.wl ?? Infinity;
  const bw = b.wl ?? Infinity;
  if (Math.abs(aw - bw) > 1e-9) return aw - bw;
  const ab = a.buffers ?? 0;
  const bb = b.buffers ?? 0;
  if (ab !== bb) return ab - bb;
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runCtsBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];
  const extent = sinkExtent(instance.positions, instance.source, instance.cells);

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runCtsAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runCtsAlgo(algoId, instance, opts);
      const t1 = nowMs();
      const heap1 = readHeapUsed();
      const scored = scoreTree(run.tree, instance.positions, opts);
      const memEst = estimateWorkingSetBytes(algoId, instance, isUser);
      const heapDelta =
        heap0 != null && heap1 != null ? Math.max(0, heap1 - heap0) : null;

      rows.push({
        algoId,
        title,
        isUser,
        skew: scored.skew,
        skewOk: scored.skewOk,
        maxLatency: scored.maxLatency,
        wl: scored.wl,
        buffers: scored.buffers,
        steiners: scored.steiners,
        tree: scored.tree,
        detail: run.detail || "",
        ms: Math.max(0, t1 - t0),
        memBytes: heapDelta != null && heapDelta > 0 ? heapDelta : memEst,
        memEstBytes: memEst,
        heapDeltaBytes: heapDelta,
        memSource: heapDelta != null && heapDelta > 0 ? "heap-delta" : "estimate",
        instanceId,
        nSinks: instance.cells?.length ?? CELLS.length,
        extent,
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
        nSinks: CELLS.length,
        extent,
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
    instance,
    rows,
  };
}

export async function runCtsBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length ? instanceIds : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runCtsBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runCtsBenchmark(id, algoIds, opts));
  }

  const byAlgo = new Map();
  for (const rep of perInstance) {
    for (const row of rep.rows) {
      if (!byAlgo.has(row.algoId)) byAlgo.set(row.algoId, []);
      byAlgo.get(row.algoId).push(row);
    }
  }

  const metricKeys = [
    "skew",
    "maxLatency",
    "wl",
    "buffers",
    "steiners",
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
      tree: head.tree,
      detail: `avg over ${ok.length} instances`,
      samples: ok.length,
      vizInstanceId: perInstance[0]?.instanceId,
      skewOk: ok.every((r) => r.skewOk !== false),
      nSinks: mean("nSinks"),
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
