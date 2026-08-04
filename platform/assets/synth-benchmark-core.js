/**
 * Synthesis benchmark — shared AIGs, builtins, dataset runner.
 * Reuses platform/assets/synthesis-core.js (learn_synthesis labs).
 */
import {
  AIG_NODES,
  GOLDENS,
  LIBRARY,
  LAYOUT,
  techmapArea,
} from "./synthesis-core.js";
import {
  aoiCoverSynth,
  areaMapSynth,
  areaParetoSynth,
  cloneLibrary,
  cloneNodes,
  cutCoverSynth,
  delayFirstSynth,
  delayMapSynth,
  functionalMatch,
  identitySynth,
  multistartSynth,
  nandMapSynth,
  norAwareMapSynth,
  portfolioSynth,
  rewriteThenMapSynth,
  sequentialPipeSynth,
  strashMapSynth,
} from "./synth-algo-advanced.js";

export const TEACH_SUITE = ["course", "area_focus", "delay_focus"];
export const HARD_SUITE = [
  "course",
  "area_focus",
  "delay_focus",
  "fat_and",
  "inv_heavy",
  "wide_lib",
  "deep_chain",
];
export const SCALE_SUITE = ["course", "fat_and", "inv_heavy", "deep_chain"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

function autoLayout(nodes) {
  const layout = {};
  const pis = nodes.filter((n) => n.type === "pi");
  const ands = nodes.filter((n) => n.type === "and");
  pis.forEach((n, i) => {
    layout[n.id] = { x: 1.5 + i * 2.5, y: 6.5 };
  });
  ands.forEach((n, i) => {
    layout[n.id] = {
      x: 2 + (i % 4) * 2.2,
      y: 4.5 - Math.floor(i / 4) * 1.8,
    };
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
        library: cloneLibrary(g.library || LIBRARY),
        layout: g.layout || LAYOUT,
        origin: cloneNodes(g.nodes),
        runOpts: { ...runOpts },
      };
    },
  };
}

function fatAnd() {
  return {
    nodes: [
      { id: 1, type: "pi", name: "a" },
      { id: 2, type: "pi", name: "b" },
      { id: 3, type: "pi", name: "c" },
      { id: 4, type: "and", fanin: [[1, false], [2, false]] },
      { id: 5, type: "and", fanin: [[2, false], [3, false]] },
      { id: 6, type: "and", fanin: [[4, false], [5, false]] },
      { id: 7, type: "and", fanin: [[6, false], [3, false]] },
      { id: 8, type: "and", fanin: [[7, false], [1, false]], po: "f" },
    ],
  };
}

function invHeavy() {
  return {
    nodes: [
      { id: 1, type: "pi", name: "a" },
      { id: 2, type: "pi", name: "b" },
      { id: 3, type: "pi", name: "c" },
      { id: 4, type: "and", fanin: [[1, true], [2, true]] },
      { id: 5, type: "and", fanin: [[4, true], [3, true]] },
      { id: 6, type: "and", fanin: [[1, true], [3, false]] },
      { id: 7, type: "and", fanin: [[5, false], [6, true]], po: "f" },
    ],
  };
}

function deepChain() {
  return {
    nodes: [
      { id: 1, type: "pi", name: "a" },
      { id: 2, type: "pi", name: "b" },
      { id: 3, type: "pi", name: "c" },
      { id: 4, type: "and", fanin: [[1, false], [2, false]] },
      { id: 5, type: "and", fanin: [[4, false], [3, false]] },
      { id: 6, type: "and", fanin: [[5, false], [1, false]] },
      { id: 7, type: "and", fanin: [[6, false], [2, false]] },
      { id: 8, type: "and", fanin: [[7, false], [3, false]], po: "f" },
    ],
  };
}

function wideLib() {
  return {
    nodes: cloneNodes(AIG_NODES),
    library: [
      ...LIBRARY,
      { id: "XOR2", area: 4, delay: 3, inputs: 2 },
      { id: "OA21", area: 3, delay: 3, inputs: 3 },
    ],
  };
}

export const BENCHMARK_INSTANCES = {
  course: makeInst(
    "course",
    "Course tiny AIG",
    () => ({ nodes: AIG_NODES, layout: LAYOUT }),
    `Canonical f=(~(a∧b)∧c)∧(a∧c) — area map ≥ GOLDENS.mapAreaMin (${GOLDENS.mapAreaMin}).`
  ),
  area_focus: makeInst(
    "area_focus",
    "Teach · Area focus",
    () => ({ nodes: AIG_NODES, layout: LAYOUT }),
    "Same graph — area engines should beat identity; portfolio picks min area."
  ),
  delay_focus: makeInst(
    "delay_focus",
    "Teach · Delay focus",
    () => ({ nodes: AIG_NODES, layout: LAYOUT }),
    "Prefer delayDepth / delay-first over pure area when ranking ties broken by delay."
  ),
  fat_and: makeInst(
    "fat_and",
    "Hard · Extra AND depth",
    fatAnd,
    "More AND nodes — cut cover / AOI can reduce mapped area."
  ),
  inv_heavy: makeInst(
    "inv_heavy",
    "Hard · Heavy complements",
    invHeavy,
    "Many complemented fanins — NOR-aware / rewrite should cut INV area."
  ),
  wide_lib: makeInst(
    "wide_lib",
    "Hard · Wider library",
    wideLib,
    "Extra XOR/OA cells in library — area map still legal; AOI may win."
  ),
  deep_chain: makeInst(
    "deep_chain",
    "Hard · Deep AND chain",
    deepChain,
    "Chain depth stresses delay engines vs area."
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "identity", title: "Identity (unmapped)", needsSeed: false },
  { id: "area_map", title: "Techmap area", needsSeed: false },
  { id: "delay_map", title: "Techmap delay", needsSeed: false },
  { id: "nand_map", title: "NAND2+INV map", needsSeed: false },
  { id: "nor_aware", title: "NOR-aware map", needsSeed: false },
  { id: "aoi_cover", title: "AOI21 cover", needsSeed: false },
  { id: "cut_cover", title: "Cut cover map", needsSeed: false },
  { id: "rewrite_map", title: "Rewrite → map", needsSeed: false },
  { id: "strash_map", title: "Strash → map", needsSeed: false },
  { id: "delay_first", title: "Delay-first pick", needsSeed: false },
  { id: "area_pareto", title: "Area Pareto", needsSeed: false },
  { id: "sequential", title: "Sequential pipe", needsSeed: false },
  { id: "multistart", title: "Multistart synth", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
];

export const SYNTH_METRIC_COLUMNS = [
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
    label: "Area",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(0)),
  },
  {
    key: "delay",
    label: "Delay",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(0)),
  },
  {
    key: "cost",
    label: "Cost",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
  {
    key: "mapped",
    label: "Mapped",
    fmt: (v) => (v == null ? "—" : String(Math.round(v))),
  },
];

export function seedStress(nodes) {
  return nodes.filter((n) => n.type === "and").length * 10;
}

export function scoreSolution(run, origin) {
  const nodes = run.nodes || origin;
  const mapping = run.mapping || [];
  const ands = origin.filter((n) => n.type === "and").length;
  const mapped = mapping.length;
  const funcOk = functionalMatch(origin, nodes);
  const fullyMapped = mapped >= ands;
  const area = Number.isFinite(run.area) ? run.area : Infinity;
  const delay = Number.isFinite(run.delay) ? run.delay : Infinity;
  const illegal = !funcOk || (!fullyMapped && !Number.isFinite(run.area))
    ? 1
    : mapped === 0 && !Number.isFinite(area)
      ? 1
      : 0;
  // identity: unmapped → illegal for ranking purposes
  const ill = mapped === 0 ? 1 : illegal;
  return {
    nodes,
    mapping,
    illegal: ill,
    area: ill ? Infinity : area,
    delay: ill ? Infinity : delay,
    cost: ill ? Infinity : area * 10 + delay,
    mapped,
    stress: seedStress(origin),
    funcOk,
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

export async function runSynthAlgo(algoId, instance, opts = {}) {
  const nodes = instance.nodes;
  const library = instance.library || LIBRARY;
  const packOpts = { ...(instance.runOpts || {}), ...(opts.runOpts || {}) };

  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra?.run) {
    const out = await extra.run(cloneNodes(nodes), {
      library: cloneLibrary(library),
      ...packOpts,
    });
    return {
      nodes: out?.nodes ? cloneNodes(out.nodes) : cloneNodes(nodes),
      mapping: out?.mapping || [],
      area: out?.area,
      delay: out?.delay,
      detail: out?.detail || "upload",
    };
  }

  switch (algoId) {
    case "identity":
      return identitySynth(nodes, library, packOpts);
    case "area_map":
      return areaMapSynth(nodes, library, packOpts);
    case "delay_map":
      return delayMapSynth(nodes, library, packOpts);
    case "nand_map":
      return nandMapSynth(nodes, library, packOpts);
    case "nor_aware":
      return norAwareMapSynth(nodes, library, packOpts);
    case "aoi_cover":
      return aoiCoverSynth(nodes, library, packOpts);
    case "cut_cover":
      return cutCoverSynth(nodes, library, packOpts);
    case "rewrite_map":
      return rewriteThenMapSynth(nodes, library, packOpts);
    case "strash_map":
      return strashMapSynth(nodes, library, packOpts);
    case "delay_first":
      return delayFirstSynth(nodes, library, packOpts);
    case "area_pareto":
      return areaParetoSynth(nodes, library, packOpts);
    case "sequential":
      return sequentialPipeSynth(nodes, library, packOpts);
    case "multistart":
      return multistartSynth(nodes, library, packOpts);
    case "portfolio":
      return portfolioSynth(nodes, library, packOpts);
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
  const n = (instance.nodes || AIG_NODES).length;
  const base = n * 220 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 80;
  switch (algoId) {
    case "portfolio":
    case "multistart":
    case "area_pareto":
    case "cut_cover":
      return base + n * 400;
    case "aoi_cover":
    case "rewrite_map":
    case "strash_map":
    case "sequential":
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
  const aa = a.area ?? Infinity;
  const ba = b.area ?? Infinity;
  if (Math.abs(aa - ba) > 1e-9) return aa - ba;
  const ad = a.delay ?? Infinity;
  const bd = b.delay ?? Infinity;
  if (Math.abs(ad - bd) > 1e-9) return ad - bd;
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runSynthBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  if (!instance.layout || Object.keys(instance.layout).length < instance.nodes.length) {
    instance.layout = autoLayout(instance.nodes);
  }
  const origin = cloneNodes(instance.origin || instance.nodes);
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runSynthAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runSynthAlgo(algoId, instance, opts);
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
        area: scored.area,
        delay: scored.delay,
        cost: scored.cost,
        mapped: scored.mapped,
        mapping: scored.mapping,
        nodes: scored.nodes,
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
    instance: { ...instance, origin },
    goldArea: techmapArea(origin).area,
    rows,
  };
}

export async function runSynthBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runSynthBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runSynthBenchmark(id, algoIds, opts));
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
    "delay",
    "cost",
    "mapped",
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
      const vals = ok
        .map((r) => r[k])
        .filter((v) => v != null && Number.isFinite(v));
      avg[k] = vals.length
        ? vals.reduce((s, v) => s + v, 0) / vals.length
        : null;
    }
    avg.detail = `avg/${ok.length}`;
    avg.mapping = ok[0].mapping;
    avg.nodes = ok[0].nodes;
    avg.memSource = "estimate";
    rows.push(avg);
  }

  rows.sort(compareBenchRowsUserFirst);
  return {
    instanceId: ids.join("+"),
    instanceIds: ids,
    instanceTitle: `Average · ${ids.length} instances`,
    notes: "Means across selected instances; ranking uses illegal → area → delay.",
    mode: "average",
    instance: perInstance[0]?.instance || null,
    perInstance,
    rows,
  };
}

export { GOLDENS, LIBRARY };
