/**
 * STA benchmark — shared timing graphs, builtins, dataset runner.
 * Reuses platform/assets/sta-core.js (learn_sta labs).
 */
import {
  PROP_GOLDENS,
  TINY_TIMING,
  cellDelaySum,
  cloneTiming,
  pathDelaySum,
  sinks,
} from "./sta-core.js";
import {
  approxLevelAnalyze,
  budgetDeepAnalyze,
  budgetResizeAnalyze,
  dfsCriticalAnalyze,
  dijkstraCriticalAnalyze,
  earlyModeAnalyze,
  ecoRecoverAnalyze,
  falsePathAnalyze,
  fanoutDerateAnalyze,
  fullAfterEditAnalyze,
  fullSetupAnalyze,
  incrementalAnalyze,
  kWorstPathAnalyze,
  lateModeAnalyze,
  multicycleAnalyze,
  multistartSta,
  pathEqual,
  pessimisticAnalyze,
  portfolioAnalyze,
  sdcComboAnalyze,
  setupHoldAnalyze,
  slewLiteAnalyze,
  tnsAnalyze,
  uncertaintyAnalyze,
} from "./sta-algo-advanced.js";

export const TEACH_SUITE = ["tiny", "tight", "incremental"];
export const HARD_SUITE = [
  "tiny",
  "long_chain",
  "diamond",
  "tight",
  "false_path",
  "multicycle",
  "incremental",
  "fat_cells",
];
export const SCALE_SUITE = ["tiny", "long_chain", "diamond", "fat_cells"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

function makeInst(id, title, timingFn, notes, runOpts = {}) {
  return {
    id,
    title,
    notes,
    runOpts,
    instance: () => ({
      timing: cloneTiming(timingFn()),
      runOpts: { ...runOpts },
    }),
  };
}

function longChain() {
  const pins = [
    { id: "in", kind: "port" },
    { id: "out", kind: "port" },
  ];
  const arcs = [];
  let prev = "in";
  for (let i = 1; i <= 4; i++) {
    const a = `u${i}/A`;
    const y = `u${i}/Y`;
    pins.splice(pins.length - 1, 0, { id: a, kind: "cell_in", cell: `u${i}` });
    pins.splice(pins.length - 1, 0, { id: y, kind: "cell_out", cell: `u${i}` });
    arcs.push({ from: prev, to: a, delay: 0.1, kind: "net" });
    arcs.push({ from: a, to: y, delay: 1.0 + i * 0.1, kind: "cell" });
    prev = y;
  }
  arcs.push({ from: prev, to: "out", delay: 0.2, kind: "net" });
  return {
    name: "long_chain",
    clock: { name: "clk", period: 12.0 },
    pins,
    arcs,
  };
}

function diamond() {
  return {
    name: "diamond",
    clock: { name: "clk", period: 10.0 },
    pins: [
      { id: "in", kind: "port" },
      { id: "a/A", kind: "cell_in", cell: "a" },
      { id: "a/Y", kind: "cell_out", cell: "a" },
      { id: "b/A", kind: "cell_in", cell: "b" },
      { id: "b/Y", kind: "cell_out", cell: "b" },
      { id: "c/A", kind: "cell_in", cell: "c" },
      { id: "c/Y", kind: "cell_out", cell: "c" },
      { id: "out", kind: "port" },
    ],
    arcs: [
      { from: "in", to: "a/A", delay: 0.0, kind: "net" },
      { from: "a/A", to: "a/Y", delay: 1.0, kind: "cell" },
      { from: "a/Y", to: "b/A", delay: 0.2, kind: "net" },
      { from: "a/Y", to: "c/A", delay: 0.5, kind: "net" },
      { from: "b/A", to: "b/Y", delay: 2.0, kind: "cell" },
      { from: "c/A", to: "c/Y", delay: 1.1, kind: "cell" },
      { from: "b/Y", to: "out", delay: 0.2, kind: "net" },
      { from: "c/Y", to: "out", delay: 0.2, kind: "net" },
    ],
  };
}

export const BENCHMARK_INSTANCES = {
  tiny: makeInst(
    "tiny",
    "Course tiny chain",
    () => TINY_TIMING,
    "Arrival out=3.2, setup slack=6.8 — exact engines should match goldens."
  ),
  long_chain: makeInst(
    "long_chain",
    "Hard · 4-cell chain",
    longChain,
    "Longer topo — DFS / full setup should agree; approx drifts."
  ),
  diamond: makeInst(
    "diamond",
    "Hard · Diamond reconvergence",
    diamond,
    "Two paths into out — critical path is the slower branch."
  ),
  tight: makeInst(
    "tight",
    "Hard · Tight period",
    () => {
      const t = cloneTiming(TINY_TIMING);
      t.clock.period = 3.5;
      t.name = "tight";
      return t;
    },
    "Period 3.5 → small/negative slack — resize engines can recover."
  ),
  false_path: makeInst(
    "false_path",
    "Hard · False path u1/Y→u2/A",
    () => TINY_TIMING,
    "With disable, chain breaks — false-path engine handles; others may still time.",
    {
      disableArcs: PROP_GOLDENS.falsePath.arcs.map(([f, to]) => `${f}|${to}`),
    }
  ),
  multicycle: makeInst(
    "multicycle",
    "Hard · Multicycle setup×2",
    () => TINY_TIMING,
    "Required = 20 → slack 16.8 for exact multicycle.",
    { setupCycles: 2 }
  ),
  incremental: makeInst(
    "incremental",
    "Hard · Incremental delay bump",
    () => TINY_TIMING,
    "Edit u1 cell 1.2→2.0 — incremental should match full recompute slack 6.0.",
    {
      edit: {
        from: PROP_GOLDENS.incremental.editFrom,
        to: PROP_GOLDENS.incremental.editTo,
        delay: PROP_GOLDENS.incremental.newDelay,
      },
    }
  ),
  fat_cells: makeInst(
    "fat_cells",
    "Hard · Fat cell delays",
    () => {
      const t = cloneTiming(TINY_TIMING);
      for (const a of t.arcs) {
        if (a.kind === "cell") a.delay = a.delay * 2.5;
      }
      t.clock.period = 8;
      t.name = "fat_cells";
      return t;
    },
    "Large cell delays / period 8 — budget resize should raise slack."
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "identity", title: "Identity (no STA)", needsSeed: false },
  { id: "full_setup", title: "Full setup propagate", needsSeed: false },
  { id: "setup_hold", title: "Setup + hold", needsSeed: false },
  { id: "dfs_critical", title: "DFS critical path", needsSeed: false },
  { id: "dijkstra", title: "Dijkstra / topo max", needsSeed: false },
  { id: "k_worst", title: "K-worst path enum", needsSeed: false },
  { id: "tns", title: "TNS + WNS report", needsSeed: false },
  { id: "approx_level", title: "Approx level×mean", needsSeed: false },
  { id: "false_path", title: "False-path aware", needsSeed: false },
  { id: "multicycle", title: "Multicycle setup", needsSeed: false },
  { id: "uncertainty", title: "Clock uncertainty", needsSeed: false },
  { id: "sdc_combo", title: "SDC uncertainty+MC", needsSeed: false },
  { id: "incremental", title: "Incremental cone", needsSeed: false },
  { id: "full_edit", title: "Full recompute after edit", needsSeed: false },
  { id: "slew_lite", title: "Slew / fanout derate", needsSeed: false },
  { id: "fanout_derate", title: "Net fanout derate", needsSeed: false },
  { id: "early", title: "Early (min-delay) mode", needsSeed: false },
  { id: "late", title: "Late (max-delay) mode", needsSeed: false },
  { id: "pessimistic", title: "Pessimistic margin", needsSeed: false },
  { id: "budget", title: "Budget resize", needsSeed: false },
  { id: "budget_deep", title: "Budget deep", needsSeed: false },
  { id: "eco", title: "ECO slack recover", needsSeed: false },
  { id: "multistart", title: "Multistart STA", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
];

export const STA_METRIC_COLUMNS = [
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
    key: "failed",
    label: "Fail",
    fmt: (v) => (v == null ? "—" : String(Math.round(v))),
  },
  {
    key: "slackErr",
    label: "|Δslack|",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(3)),
  },
  {
    key: "slack",
    label: "Slack",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "pathBad",
    label: "Path≠",
    fmt: (v) => (v == null ? "—" : String(Math.round(v))),
  },
  {
    key: "pathDelay",
    label: "Σd",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(2)),
  },
];

export function goldAnalyze(timing, runOpts = {}) {
  if (runOpts.edit) {
    return fullAfterEditAnalyze(timing, runOpts);
  }
  return fullSetupAnalyze(timing, runOpts);
}

export function scoreSolution(run, origin, opts = {}) {
  const runOpts = opts.runOpts || {};
  const gold = goldAnalyze(origin, runOpts);
  const timing = run.timing || origin;
  const slack = run.slackAtSink;
  const goldSlack = gold.slackAtSink;
  const slackErr =
    slack == null || goldSlack == null
      ? slack == null && goldSlack == null
        ? 0
        : 999
      : Math.abs(slack - goldSlack);
  const pathBad = pathEqual(run.path, gold.path) ? 0 : 1;
  const failed = run.failed || slack == null ? 1 : 0;
  return {
    timing,
    arrival: run.arrival,
    required: run.required,
    path: run.path,
    sink: run.sink || sinks(timing)[0],
    slack,
    slackErr,
    pathBad,
    failed: failed && !(gold.failed && slack == null) ? failed : run.failed || 0,
    pathDelay: pathDelaySum(timing),
    cellDelaySum: cellDelaySum(timing),
    stress: pathDelaySum(origin),
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

export async function runStaAlgo(algoId, instance, opts = {}) {
  const timing = instance.timing;
  const runOpts = { ...(instance.runOpts || {}), ...(opts.runOpts || {}) };

  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra?.run) {
    const out = await extra.run(cloneTiming(timing), runOpts);
    return {
      timing: out?.timing ? cloneTiming(out.timing) : cloneTiming(timing),
      arrival: out?.arrival ?? null,
      required: out?.required ?? null,
      slackAtSink: out?.slackAtSink ?? out?.slack ?? null,
      path: out?.path ?? null,
      sink: out?.sink ?? sinks(timing)[0],
      failed: out?.failed ?? (out?.slackAtSink == null && out?.slack == null ? 1 : 0),
      detail: out?.detail || "upload",
      cellDelaySum: out?.cellDelaySum,
      pathDelay: out?.pathDelay,
    };
  }

  switch (algoId) {
    case "identity":
      return {
        timing: cloneTiming(timing),
        arrival: null,
        required: null,
        slackAtSink: null,
        path: null,
        sink: sinks(timing)[0],
        failed: 1,
        detail: "identity",
      };
    case "full_setup":
      return fullSetupAnalyze(timing, runOpts);
    case "setup_hold":
      return setupHoldAnalyze(timing, runOpts);
    case "dfs_critical":
      return dfsCriticalAnalyze(timing, runOpts);
    case "dijkstra":
      return dijkstraCriticalAnalyze(timing, runOpts);
    case "k_worst":
      return kWorstPathAnalyze(timing, runOpts);
    case "tns":
      return tnsAnalyze(timing, runOpts);
    case "approx_level":
      return approxLevelAnalyze(timing, runOpts);
    case "false_path":
      return falsePathAnalyze(timing, runOpts);
    case "multicycle":
      return multicycleAnalyze(timing, {
        ...runOpts,
        setupCycles: runOpts.setupCycles ?? 2,
      });
    case "uncertainty":
      return uncertaintyAnalyze(timing, runOpts);
    case "sdc_combo":
      return sdcComboAnalyze(timing, {
        ...runOpts,
        setupCycles: runOpts.setupCycles ?? 1,
      });
    case "incremental":
      return incrementalAnalyze(timing, runOpts);
    case "full_edit":
      return fullAfterEditAnalyze(timing, runOpts);
    case "slew_lite":
      return slewLiteAnalyze(timing, runOpts);
    case "fanout_derate":
      return fanoutDerateAnalyze(timing, runOpts);
    case "early":
      return earlyModeAnalyze(timing, runOpts);
    case "late":
      return lateModeAnalyze(timing, runOpts);
    case "pessimistic":
      return pessimisticAnalyze(timing, runOpts);
    case "budget":
      return budgetResizeAnalyze(timing, runOpts);
    case "budget_deep":
      return budgetDeepAnalyze(timing, runOpts);
    case "eco":
      return ecoRecoverAnalyze(timing, runOpts);
    case "multistart":
      return multistartSta(timing, runOpts);
    case "portfolio":
      return portfolioAnalyze(timing, runOpts);
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
  const n = (instance.timing?.pins || TINY_TIMING.pins).length;
  const base = n * 200 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 80;
  switch (algoId) {
    case "portfolio":
    case "multistart":
    case "budget_deep":
    case "budget":
    case "eco":
    case "k_worst":
      return base + n * 380;
    case "incremental":
    case "full_edit":
    case "setup_hold":
    case "tns":
    case "slew_lite":
    case "fanout_derate":
    case "pessimistic":
    case "sdc_combo":
      return base + n * 240;
    default:
      return base + n * 100;
  }
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  const af = a.failed ?? 1;
  const bf = b.failed ?? 1;
  if (af !== bf) return af - bf;
  const ae = a.slackErr ?? Infinity;
  const be = b.slackErr ?? Infinity;
  if (Math.abs(ae - be) > 1e-9) return ae - be;
  const ap = a.pathBad ?? 1;
  const bp = b.pathBad ?? 1;
  if (ap !== bp) return ap - bp;
  if (Math.abs(ae) < 1e-9 && Math.abs(be) < 1e-9) {
    const as = a.slack ?? -Infinity;
    const bs = b.slack ?? -Infinity;
    if (Math.abs(as - bs) > 1e-9) return bs - as;
  }
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runStaBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const origin = cloneTiming(instance.timing);
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];
  const scoreOpts = { runOpts: instance.runOpts };

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runStaAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runStaAlgo(algoId, instance, opts);
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
        failed: scored.failed,
        slackErr: scored.slackErr,
        slack: scored.slack,
        pathBad: scored.pathBad,
        pathDelay: scored.pathDelay,
        cellDelaySum: scored.cellDelaySum,
        timing: scored.timing,
        arrival: scored.arrival,
        required: scored.required,
        path: scored.path,
        sink: scored.sink,
        stress: scored.stress,
        detail: run.detail || "",
        ms: Math.max(0, t1 - t0),
        memBytes: heapDelta != null && heapDelta > 0 ? heapDelta : memEst,
        memEstBytes: memEst,
        heapDeltaBytes: heapDelta,
        memSource: heapDelta != null && heapDelta > 0 ? "heap-delta" : "estimate",
        instanceId,
      });
    } catch (err) {
      rows.push({
        algoId,
        title,
        isUser,
        error: String(err?.message || err),
        failed: 1,
        ms: 0,
        memBytes: 0,
        instanceId,
        stress: pathDelaySum(origin),
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
    instance: { ...instance, timing: origin },
    rows,
  };
}

export async function runStaBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runStaBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runStaBenchmark(id, algoIds, opts));
  }

  const byAlgo = new Map();
  for (const rep of perInstance) {
    for (const row of rep.rows) {
      if (!byAlgo.has(row.algoId)) byAlgo.set(row.algoId, []);
      byAlgo.get(row.algoId).push(row);
    }
  }

  const metricKeys = [
    "failed",
    "slackErr",
    "slack",
    "pathBad",
    "pathDelay",
    "cellDelaySum",
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
        failed: 1,
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
    avg.timing = ok[0].timing;
    avg.arrival = ok[0].arrival;
    avg.path = ok[0].path;
    avg.memSource = "estimate";
    rows.push(avg);
  }

  rows.sort(compareBenchRowsUserFirst);
  return {
    instanceId: ids.join("+"),
    instanceIds: ids,
    instanceTitle: `Average · ${ids.length} instances`,
    notes: "Means across instances; ranking uses fail → |Δslack| → path≠ → slack.",
    mode: "average",
    instance: perInstance[0]?.instance || null,
    perInstance,
    rows,
  };
}
