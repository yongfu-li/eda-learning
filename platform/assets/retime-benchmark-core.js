/**
 * Retiming benchmark — shared graphs, builtins, dataset runner.
 * Reuses platform/assets/retiming-core.js (learn_retiming labs).
 */
import {
  EDGES,
  LAYOUT,
  NODES,
  PERIOD_TARGET,
  cloneEdges,
  clockPeriod,
  registerCount,
  zeroRetime,
} from "./retiming-core.js";
import {
  areaAwareRetime,
  balanceRegsRetime,
  beamSearchRetime,
  binaryFeasRetime,
  criticalPushRetime,
  cutsetRetime,
  deepEnumerateRetime,
  enumerateRetime,
  forwardARetime,
  geneticRetime,
  greedyLocalRetime,
  identityRetime,
  ilsRetime,
  minPeriodRetime,
  minRegistersRetime,
  multistartRetime,
  pathGuidedSaRetime,
  periodParetoRetime,
  portfolioRetime,
  saMultiRetime,
  saRetime,
  scoreRetime,
  sequentialMinRetime,
  tabuRetime,
  wdFeasRetime,
} from "./retime-algo-advanced.js";

export const TEACH_SUITE = ["course", "forward_ready", "period_target"];
export const HARD_SUITE = [
  "course",
  "forward_ready",
  "heavy_delay",
  "sparse_regs",
  "branched",
  "long_chain",
  "period_target",
];
export const SCALE_SUITE = ["course", "heavy_delay", "branched", "long_chain"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

export function cloneNodes(nodes = NODES) {
  return nodes.map((n) => ({ ...n }));
}

export function autoLayout(nodes) {
  const layout = {};
  const pi = nodes.filter((n) => n.kind === "pi");
  const po = nodes.filter((n) => n.kind === "po");
  const comb = nodes.filter((n) => n.kind === "comb");
  pi.forEach((n, i) => {
    layout[n.id] = { x: 1.5, y: 3 + i * 1.5 };
  });
  comb.forEach((n, i) => {
    const col = 4 + (i % 3) * 2.2;
    const row = 2.2 + Math.floor(i / 3) * 2.2;
    layout[n.id] = { x: col, y: row };
  });
  po.forEach((n, i) => {
    layout[n.id] = { x: 10, y: 3 + i * 1.5 };
  });
  return layout;
}

function makeInst(id, title, graphFn, notes, runOpts = {}) {
  return {
    id,
    title,
    notes,
    runOpts,
    instance: () => {
      const g = graphFn();
      return {
        nodes: cloneNodes(g.nodes),
        edges: cloneEdges(g.edges),
        layout: g.layout || autoLayout(g.nodes),
        periodTarget: g.periodTarget ?? PERIOD_TARGET,
        runOpts: { ...runOpts },
      };
    },
  };
}

function courseGraph() {
  return {
    nodes: NODES,
    edges: EDGES,
    layout: LAYOUT,
    periodTarget: PERIOD_TARGET,
  };
}

function heavyDelay() {
  return {
    nodes: [
      { id: "u", delay: 1, kind: "pi" },
      { id: "a", delay: 5, kind: "comb" },
      { id: "b", delay: 4, kind: "comb" },
      { id: "c", delay: 6, kind: "comb" },
      { id: "v", delay: 1, kind: "po" },
    ],
    edges: cloneEdges(EDGES),
    layout: LAYOUT,
    periodTarget: 8,
  };
}

function sparseRegs() {
  return {
    nodes: cloneNodes(NODES),
    edges: [
      { id: "e0", src: "u", dst: "a", w: 1 },
      { id: "e1", src: "a", dst: "b", w: 0 },
      { id: "e2", src: "b", dst: "c", w: 0 },
      { id: "e3", src: "c", dst: "v", w: 0 },
      { id: "e4", src: "a", dst: "c", w: 0 },
    ],
    layout: LAYOUT,
    periodTarget: 6,
  };
}

function branched() {
  return {
    nodes: [
      { id: "u", delay: 1, kind: "pi" },
      { id: "a", delay: 2, kind: "comb" },
      { id: "b", delay: 3, kind: "comb" },
      { id: "c", delay: 2, kind: "comb" },
      { id: "d", delay: 3, kind: "comb" },
      { id: "v", delay: 1, kind: "po" },
    ],
    edges: [
      { id: "e0", src: "u", dst: "a", w: 1 },
      { id: "e1", src: "a", dst: "b", w: 0 },
      { id: "e2", src: "a", dst: "c", w: 0 },
      { id: "e3", src: "b", dst: "d", w: 1 },
      { id: "e4", src: "c", dst: "d", w: 0 },
      { id: "e5", src: "d", dst: "v", w: 0 },
    ],
    periodTarget: 6,
  };
}

function longChain() {
  const nodes = [
    { id: "u", delay: 1, kind: "pi" },
    { id: "a", delay: 2, kind: "comb" },
    { id: "b", delay: 2, kind: "comb" },
    { id: "c", delay: 2, kind: "comb" },
    { id: "d", delay: 3, kind: "comb" },
    { id: "e", delay: 2, kind: "comb" },
    { id: "v", delay: 1, kind: "po" },
  ];
  const edges = [
    { id: "e0", src: "u", dst: "a", w: 1 },
    { id: "e1", src: "a", dst: "b", w: 0 },
    { id: "e2", src: "b", dst: "c", w: 0 },
    { id: "e3", src: "c", dst: "d", w: 1 },
    { id: "e4", src: "d", dst: "e", w: 0 },
    { id: "e5", src: "e", dst: "v", w: 0 },
  ];
  return { nodes, edges, periodTarget: 5 };
}

export const BENCHMARK_INSTANCES = {
  course: makeInst(
    "course",
    "Course tiny graph",
    courseGraph,
    "Baseline period 8; forward-a reaches 5 / 3 regs — enumerate / portfolio should match."
  ),
  forward_ready: makeInst(
    "forward_ready",
    "Teach · Forward-a ready",
    courseGraph,
    "Same graph — forward_a is the literacy golden for period 5."
  ),
  heavy_delay: makeInst(
    "heavy_delay",
    "Hard · Heavy comb delays",
    heavyDelay,
    "Larger d(a,b,c) — need stronger retimes to cut zero-weight path."
  ),
  sparse_regs: makeInst(
    "sparse_regs",
    "Hard · Sparse registers",
    sparseRegs,
    "Only one register on u→a — legality + period tradeoff is tight."
  ),
  branched: makeInst(
    "branched",
    "Hard · Branch / reconverge",
    branched,
    "a→b/c→d diamond — retiming must keep all edge weights ≥ 0."
  ),
  long_chain: makeInst(
    "long_chain",
    "Hard · Longer chain",
    longChain,
    "Five comb nodes — enumeration range matters; SA / portfolio scale better."
  ),
  period_target: makeInst(
    "period_target",
    "Hard · Period target=5",
    courseGraph,
    "Same course graph with periodTarget 5 — min-registers under target.",
    { periodTarget: 5 }
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "identity", title: "Identity (r=0)", needsSeed: false },
  { id: "forward_a", title: "Forward retime a", needsSeed: false },
  { id: "min_period", title: "Min-period hand search", needsSeed: false },
  { id: "sequential", title: "Sequential min-period", needsSeed: false },
  { id: "greedy", title: "Greedy local ±r", needsSeed: false },
  { id: "critical_push", title: "Critical-path push", needsSeed: false },
  { id: "cutset", title: "Cutset retime", needsSeed: false },
  { id: "enumerate", title: "Enumerate r∈[-2,2]", needsSeed: false },
  { id: "deep_enum", title: "Deep enumerate", needsSeed: false },
  { id: "binary_feas", title: "Binary FEAS + enum", needsSeed: false },
  { id: "wd_feas", title: "W/D + Bellman FEAS", needsSeed: false },
  { id: "min_registers", title: "Min registers @target", needsSeed: false },
  { id: "balance_regs", title: "Balance registers", needsSeed: false },
  { id: "area_aware", title: "Area-aware (regs)", needsSeed: false },
  { id: "beam", title: "Beam search lags", needsSeed: false },
  { id: "tabu", title: "Tabu lag search", needsSeed: false },
  { id: "ils", title: "Iterated local search", needsSeed: false },
  { id: "genetic", title: "Genetic r-vector", needsSeed: false },
  { id: "path_sa", title: "Path-guided SA", needsSeed: false },
  { id: "sa", title: "SA on r-lag", needsSeed: false },
  { id: "sa_multi", title: "SA multiseed", needsSeed: false },
  { id: "period_pareto", title: "Period/regs Pareto", needsSeed: false },
  { id: "multistart", title: "Multistart retime", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
];

export const RETIME_METRIC_COLUMNS = [
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
    key: "period",
    label: "Period",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(0)),
  },
  {
    key: "registers",
    label: "Regs",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(0)),
  },
  {
    key: "cost",
    label: "Cost",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
  {
    key: "baselinePeriod",
    label: "Base Φ",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(0)),
  },
];

export function seedStress(nodes, edges) {
  return clockPeriod(null, nodes, edges) * 10 + registerCount(null, edges);
}

export function scoreSolution(run, origin) {
  const nodes = origin.nodes;
  const edges = origin.edges;
  const r = run.r || zeroRetime(nodes);
  const scored = scoreRetime(r, nodes, edges);
  return {
    ...scored,
    baselinePeriod: clockPeriod(null, nodes, edges),
    stress: seedStress(nodes, edges),
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

export async function runRetimeAlgo(algoId, instance, opts = {}) {
  const nodes = instance.nodes;
  const edges = instance.edges;
  const periodTarget =
    instance.runOpts?.periodTarget ?? instance.periodTarget ?? PERIOD_TARGET;
  const packOpts = { seed: 42, periodTarget, ...(opts.runOpts || {}) };

  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra?.run) {
    const out = await extra.run(
      { nodes: cloneNodes(nodes), edges: cloneEdges(edges) },
      packOpts
    );
    const r = out?.r || out;
    return {
      r: { ...zeroRetime(nodes), ...(r || {}) },
      detail: out?.detail || "upload",
    };
  }

  switch (algoId) {
    case "identity":
      return identityRetime(nodes, edges);
    case "forward_a":
      return forwardARetime(nodes, edges);
    case "min_period":
      return minPeriodRetime(nodes, edges);
    case "sequential":
      return sequentialMinRetime(nodes, edges);
    case "greedy":
      return greedyLocalRetime(nodes, edges, packOpts);
    case "critical_push":
      return criticalPushRetime(nodes, edges, packOpts);
    case "cutset":
      return cutsetRetime(nodes, edges, packOpts);
    case "enumerate":
      return enumerateRetime(nodes, edges, { lo: -2, hi: 2 });
    case "deep_enum":
      return deepEnumerateRetime(nodes, edges, packOpts);
    case "binary_feas":
      return binaryFeasRetime(nodes, edges, packOpts);
    case "wd_feas":
      return wdFeasRetime(nodes, edges, packOpts);
    case "min_registers":
      return minRegistersRetime(nodes, edges, packOpts);
    case "balance_regs":
      return balanceRegsRetime(nodes, edges, packOpts);
    case "area_aware":
      return areaAwareRetime(nodes, edges, packOpts);
    case "beam":
      return beamSearchRetime(nodes, edges, packOpts);
    case "tabu":
      return tabuRetime(nodes, edges, packOpts);
    case "ils":
      return ilsRetime(nodes, edges, packOpts);
    case "genetic":
      return geneticRetime(nodes, edges, packOpts);
    case "path_sa":
      return pathGuidedSaRetime(nodes, edges, packOpts);
    case "sa":
      return saRetime(nodes, edges, { ...packOpts, moves: 360 });
    case "sa_multi":
      return saMultiRetime(nodes, edges, packOpts);
    case "period_pareto":
      return periodParetoRetime(nodes, edges, packOpts);
    case "multistart":
      return multistartRetime(nodes, edges, packOpts);
    case "portfolio":
      return portfolioRetime(nodes, edges, packOpts);
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
  const n = (instance.nodes || NODES).length;
  const base = n * 220 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 80;
  switch (algoId) {
    case "portfolio":
    case "multistart":
    case "period_pareto":
    case "sa_multi":
    case "enumerate":
    case "deep_enum":
    case "binary_feas":
    case "wd_feas":
    case "min_registers":
    case "beam":
    case "tabu":
    case "ils":
    case "genetic":
    case "path_sa":
      return base + n * 420;
    case "sa":
    case "greedy":
    case "critical_push":
    case "cutset":
    case "balance_regs":
    case "area_aware":
      return base + n * 260;
    default:
      return base + n * 120;
  }
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  const ai = a.illegal ?? Infinity;
  const bi = b.illegal ?? Infinity;
  if (ai !== bi) return ai - bi;
  const ap = a.period ?? Infinity;
  const bp = b.period ?? Infinity;
  if (Math.abs(ap - bp) > 1e-9) return ap - bp;
  const ar = a.registers ?? Infinity;
  const br = b.registers ?? Infinity;
  if (Math.abs(ar - br) > 1e-9) return ar - br;
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

export async function runRetimeBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const origin = {
    nodes: cloneNodes(instance.nodes),
    edges: cloneEdges(instance.edges),
    layout: { ...instance.layout },
    periodTarget: instance.periodTarget,
    runOpts: { ...instance.runOpts },
  };
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runRetimeAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runRetimeAlgo(algoId, instance, opts);
      const t1 = nowMs();
      const heap1 = readHeapUsed();
      const scored = scoreSolution(run, origin);
      const memEst = estimateWorkingSetBytes(algoId, instance, isUser);
      const heapDelta =
        heap0 != null && heap1 != null ? Math.max(0, heap1 - heap0) : null;

      rows.push({
        algoId,
        title,
        isUser,
        illegal: scored.illegal,
        period: scored.period,
        registers: scored.registers,
        cost: scored.cost,
        baselinePeriod: scored.baselinePeriod,
        r: scored.r,
        edges: scored.edges,
        stress: scored.stress,
        detail: run.detail || "",
        ms: Math.max(0, t1 - t0),
        memBytes: heapDelta != null && heapDelta > 0 ? heapDelta : memEst,
        memEstBytes: memEst,
        heapDeltaBytes: heapDelta,
        memSource: heapDelta != null && heapDelta > 0 ? "heap-delta" : "estimate",
        instanceId,
        nNodes: origin.nodes.length,
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
        nNodes: origin.nodes.length,
        stress: seedStress(origin.nodes, origin.edges),
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
    instance: origin,
    rows,
  };
}

export async function runRetimeBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runRetimeBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runRetimeBenchmark(id, algoIds, opts));
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
    "period",
    "registers",
    "cost",
    "baselinePeriod",
    "stress",
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
    avg.r = ok[0].r;
    avg.edges = ok[0].edges;
    avg.memSource = "estimate";
    rows.push(avg);
  }

  rows.sort(compareBenchRowsUserFirst);
  return {
    instanceId: ids.join("+"),
    instanceIds: ids,
    instanceTitle: `Average · ${ids.length} instances`,
    notes: "Means across selected instances; ranking uses illegal → period → regs.",
    mode: "average",
    instance: perInstance[0]?.instance || null,
    perInstance,
    rows,
  };
}
