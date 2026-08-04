/**
 * Equivalence benchmark — shared pairs, builtins, dataset runner.
 * Reuses platform/assets/equivalence-core.js (learn_equivalence labs).
 */
import {
  GOLDENS,
  IMPL_BAD,
  IMPL_GOOD,
  SEQ_BAD,
  SEQ_GOOD,
  SEQ_SPEC,
  SPEC,
  buildMiter,
  sequentialCecLite,
  truthTableCec,
} from "./equivalence-core.js";
import {
  cexEqual,
  cloneCircuit,
  dontCareCheck,
  fraigCheck,
  grayWalkCheck,
  guidedCexCheck,
  identityCheck,
  miterEvalCheck,
  multistartCheck,
  portfolioCheck,
  randomSimCheck,
  satMiterCheck,
  sequentialCheck,
  structuralHashCheck,
  truthTableCheck,
} from "./equiv-algo-advanced.js";

export const TEACH_SUITE = ["course_good", "course_bad", "miter_bad"];
export const HARD_SUITE = [
  "course_good",
  "course_bad",
  "miter_bad",
  "seq_good",
  "seq_bad",
  "dont_care_a",
  "xor_trap",
];
export const SCALE_SUITE = ["course_good", "course_bad", "seq_good", "seq_bad"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

function makeInst(id, title, pairFn, notes, runOpts = {}) {
  return {
    id,
    title,
    notes,
    runOpts,
    instance: () => {
      const p = pairFn();
      return {
        spec: cloneCircuit(p.spec),
        impl: cloneCircuit(p.impl),
        layoutHint: p.layoutHint || "spec",
        viewCircuit: p.viewCircuit || null,
        runOpts: { ...runOpts },
        sequential: !!p.sequential,
      };
    },
  };
}

function xorTrapImpl() {
  // Looks structural-ish but OR vs XOR on (a∧b) with c — not equiv to SPEC
  return {
    pis: ["a", "b", "c"],
    pos: ["f"],
    gates: [
      { id: "g1", op: "XOR", inputs: ["a", "b"] },
      { id: "g2", op: "OR", inputs: ["g1", "c"], output: true },
    ],
  };
}

export const BENCHMARK_INSTANCES = {
  course_good: makeInst(
    "course_good",
    "Course · Spec ≡ De Morgan impl",
    () => ({
      spec: SPEC,
      impl: IMPL_GOOD,
      layoutHint: "good",
      viewCircuit: IMPL_GOOD,
    }),
    "Gold: equivalent. Exact engines should agree; identity/random may luck-pass."
  ),
  course_bad: makeInst(
    "course_bad",
    "Course · Spec ≢ AND impl",
    () => ({
      spec: SPEC,
      impl: IMPL_BAD,
      layoutHint: "bad",
      viewCircuit: IMPL_BAD,
    }),
    `Gold: not equivalent; cex a=1,b=1,c=0 (GOLDENS.cex).`
  ),
  miter_bad: makeInst(
    "miter_bad",
    "Teach · Miter view (bad pair)",
    () => ({
      spec: SPEC,
      impl: IMPL_BAD,
      layoutHint: "miter",
      viewCircuit: buildMiter(SPEC, IMPL_BAD),
    }),
    "Same bad pair — miter_eval / sat should find a bug; draw shows miter."
  ),
  seq_good: makeInst(
    "seq_good",
    "Hard · Seq XOR ≡ mux form",
    () => ({
      spec: SEQ_SPEC,
      impl: SEQ_GOOD,
      sequential: true,
      layoutHint: "spec",
      viewCircuit: SEQ_GOOD,
    }),
    "Sequential CEC steps=2 — gold equivalent.",
    { steps: 2 }
  ),
  seq_bad: makeInst(
    "seq_bad",
    "Hard · Seq toggle ≢",
    () => ({
      spec: SEQ_SPEC,
      impl: SEQ_BAD,
      sequential: true,
      layoutHint: "spec",
      viewCircuit: SEQ_BAD,
    }),
    "Sequential not equivalent — combo engines may mis-handle.",
    { steps: 2 }
  ),
  dont_care_a: makeInst(
    "dont_care_a",
    "Hard · Don't-care a=1",
    () => ({
      spec: SPEC,
      impl: IMPL_BAD,
      layoutHint: "bad",
      viewCircuit: IMPL_BAD,
    }),
    "With a fixed to 1, still find cex at a=1,b=1,c=0.",
    { dontCare: { a: 1, b: -1, c: -1 } }
  ),
  xor_trap: makeInst(
    "xor_trap",
    "Hard · XOR/OR trap",
    () => ({
      spec: SPEC,
      impl: xorTrapImpl(),
      layoutHint: "spec",
      viewCircuit: xorTrapImpl(),
    }),
    "Structural hash alone is weak — exact CEC must report not equivalent."
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "identity", title: "Identity (always ≡)", needsSeed: false },
  { id: "truth_table", title: "Truth-table CEC", needsSeed: false },
  { id: "miter_eval", title: "Miter evaluate", needsSeed: false },
  { id: "gray_walk", title: "Gray-code walk", needsSeed: false },
  { id: "structural", title: "Structural hash", needsSeed: false },
  { id: "fraig", title: "FRAIG lite + TT", needsSeed: false },
  { id: "sat_miter", title: "SAT miter (DPLL)", needsSeed: false },
  { id: "random_sim", title: "Random simulation", needsSeed: false },
  { id: "guided_cex", title: "Guided cex + TT", needsSeed: false },
  { id: "dont_care", title: "Don't-care CEC", needsSeed: false },
  { id: "sequential", title: "Sequential CEC lite", needsSeed: false },
  { id: "multistart", title: "Multistart check", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
];

export const EQUIV_METRIC_COLUMNS = [
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
    key: "fail",
    label: "Fail",
    fmt: (v) => (v == null ? "—" : String(Math.round(v))),
  },
  {
    key: "equivalent",
    label: "≡?",
    fmt: (v) => (v == null ? "—" : v ? "yes" : "no"),
  },
  {
    key: "goldEquiv",
    label: "Gold",
    fmt: (v) => (v == null ? "—" : v ? "yes" : "no"),
  },
  {
    key: "cexMatch",
    label: "Cex✓",
    fmt: (v) => (v == null ? "—" : v ? "1" : "0"),
  },
  {
    key: "rowsChecked",
    label: "Rows",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(0)),
  },
];

export function goldForInstance(instance) {
  const opts = instance.runOpts || {};
  if (instance.sequential || instance.spec?.ffs) {
    return sequentialCecLite(
      instance.spec,
      instance.impl,
      opts.steps ?? 2
    );
  }
  return truthTableCec(instance.spec, instance.impl, opts.dontCare || null);
}

export function scoreSolution(run, gold) {
  const equivalent = !!run.equivalent;
  const goldEquiv = !!gold.equivalent;
  const fail = equivalent === goldEquiv ? 0 : 1;
  let cexMatch = 1;
  if (!goldEquiv) {
    cexMatch = cexEqual(run.counterexample, gold.counterexample) ? 1 : 0;
  } else if (run.counterexample) {
    cexMatch = 0;
  }
  return {
    equivalent,
    goldEquiv,
    fail,
    cexMatch,
    counterexample: run.counterexample || null,
    rowsChecked: run.rowsChecked,
    stress: goldEquiv ? 0 : 1,
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

export async function runEquivAlgo(algoId, instance, opts = {}) {
  const spec = instance.spec;
  const impl = instance.impl;
  const packOpts = { ...(instance.runOpts || {}), ...(opts.runOpts || {}) };

  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra?.run) {
    const out = await extra.run(
      { spec: cloneCircuit(spec), impl: cloneCircuit(impl) },
      packOpts
    );
    return {
      equivalent: !!out?.equivalent,
      counterexample: out?.counterexample || null,
      rowsChecked: out?.rowsChecked ?? null,
      detail: out?.detail || "upload",
    };
  }

  switch (algoId) {
    case "identity":
      return identityCheck(spec, impl, packOpts);
    case "truth_table":
      return truthTableCheck(spec, impl, packOpts);
    case "miter_eval":
      return miterEvalCheck(spec, impl, packOpts);
    case "gray_walk":
      return grayWalkCheck(spec, impl, packOpts);
    case "structural":
      return structuralHashCheck(spec, impl, packOpts);
    case "fraig":
      return fraigCheck(spec, impl, packOpts);
    case "sat_miter":
      return satMiterCheck(spec, impl, packOpts);
    case "random_sim":
      return randomSimCheck(spec, impl, { ...packOpts, trials: 20 });
    case "guided_cex":
      return guidedCexCheck(spec, impl, packOpts);
    case "dont_care":
      return dontCareCheck(spec, impl, packOpts);
    case "sequential":
      return sequentialCheck(spec, impl, packOpts);
    case "multistart":
      return multistartCheck(spec, impl, packOpts);
    case "portfolio":
      return portfolioCheck(spec, impl, packOpts);
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
  const n =
    (instance.spec?.gates?.length || 0) + (instance.impl?.gates?.length || 0);
  const base = n * 240 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 80;
  switch (algoId) {
    case "portfolio":
    case "multistart":
    case "sat_miter":
    case "sequential":
      return base + n * 420;
    case "truth_table":
    case "miter_eval":
    case "gray_walk":
    case "structural":
    case "fraig":
      return base + n * 260;
    default:
      return base + n * 120;
  }
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  const af = a.fail ?? Infinity;
  const bf = b.fail ?? Infinity;
  if (af !== bf) return af - bf;
  const ac = a.cexMatch ?? -1;
  const bc = b.cexMatch ?? -1;
  if (ac !== bc) return bc - ac; // higher cexMatch first
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runEquivBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const gold = goldForInstance(instance);
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runEquivAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runEquivAlgo(algoId, instance, opts);
      const t1 = nowMs();
      const heap1 = readHeapUsed();
      const scored = scoreSolution(run, gold);
      const memEst = estimateWorkingSetBytes(algoId, instance, isUser);
      const heapDelta =
        heap0 != null && heap1 != null ? Math.max(0, heap1 - heap0) : null;

      rows.push({
        algoId,
        title,
        isUser,
        fail: scored.fail,
        equivalent: scored.equivalent,
        goldEquiv: scored.goldEquiv,
        cexMatch: scored.cexMatch,
        counterexample: scored.counterexample,
        rowsChecked: scored.rowsChecked,
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
        ms: 0,
        memBytes: 0,
        instanceId,
        stress: gold.equivalent ? 0 : 1,
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
    gold,
    rows,
  };
}

export async function runEquivBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runEquivBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runEquivBenchmark(id, algoIds, opts));
  }

  const byAlgo = new Map();
  for (const rep of perInstance) {
    for (const row of rep.rows) {
      if (!byAlgo.has(row.algoId)) byAlgo.set(row.algoId, []);
      byAlgo.get(row.algoId).push(row);
    }
  }

  const metricKeys = [
    "fail",
    "cexMatch",
    "rowsChecked",
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
    // Majority vote for ≡ display
    const yes = ok.filter((r) => r.equivalent).length;
    avg.equivalent = yes >= ok.length / 2;
    avg.goldEquiv = null;
    avg.detail = `avg/${ok.length}`;
    avg.counterexample = ok.find((r) => r.counterexample)?.counterexample || null;
    avg.memSource = "estimate";
    rows.push(avg);
  }

  rows.sort(compareBenchRowsUserFirst);
  return {
    instanceId: ids.join("+"),
    instanceIds: ids,
    instanceTitle: `Average · ${ids.length} instances`,
    notes: "Means across selected instances; ranking uses fail → cex✓ → ms.",
    mode: "average",
    instance: perInstance[0]?.instance || null,
    gold: perInstance[0]?.gold || null,
    perInstance,
    rows,
  };
}

export { GOLDENS };
