/**
 * Floorplanning benchmark — shared packs, builtins, dataset runner.
 * Reuses platform/assets/floorplanning-core.js (learn_floorplanning labs).
 */
import {
  BAD_PACK,
  GOLDEN_BSTAR,
  GOLDEN_PACK,
  GOLDEN_POLISH,
  GOLDEN_SP,
  MACRO_PACK,
  OUTLINE,
  OVERLAP_PACK,
  SOFT_A_PACK,
  TINY_MODULES,
  clonePack,
  cost,
  deadspace,
  density,
  evalPolish,
  hpwl,
  isLegalPacking,
  packBstar,
  packHierarchical,
  packSequencePair,
} from "./floorplanning-core.js";
import {
  bboxStats,
  blPermutePack,
  bottomLeftDefault,
  clampToOutline,
  compactPack,
  hpwlSaPack,
  legalParetoPack,
  multistartFloorplan,
  polishSearch,
  portfolioFloorplan,
  repairOverlaps,
  repairThenSa,
  saFloorplan,
  saMultiseedFloorplan,
  skylinePack,
  softAwarePack,
  spMultistart,
  spSaMultiPack,
  spSaPack,
  wireForcePack,
  wirePolishPack,
} from "./floor-algo-advanced.js";

export const TEACH_SUITE = ["golden", "overlap", "overflow"];
export const HARD_SUITE = [
  "overlap",
  "overflow",
  "scattered",
  "soft_seed",
  "macro_lock",
  "corner_jam",
  "wire_stress",
];
export const SCALE_SUITE = ["golden", "overlap", "scattered", "wire_stress"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

function makeInst(id, title, packFn, notes, lockedIds = null) {
  return {
    id,
    title,
    notes,
    nModules: TINY_MODULES.length,
    instance: () => ({
      pack: clonePack(packFn()),
      lockedIds: lockedIds ? [...lockedIds] : [],
      modules: TINY_MODULES.map((m) => ({ ...m })),
      outline: { ...OUTLINE },
    }),
  };
}

export const BENCHMARK_INSTANCES = {
  golden: makeInst(
    "golden",
    "Teach · Golden packing",
    () => GOLDEN_PACK,
    "Already legal — identity / golden should win; others must not worsen."
  ),
  overlap: makeInst(
    "overlap",
    "Course overlap (E∩C)",
    () => OVERLAP_PACK,
    "Illegal overlap — repair / SA / portfolio must restore legality."
  ),
  overflow: makeInst(
    "overflow",
    "Course overflow (E past right)",
    () => BAD_PACK,
    "E overflows outline — clamp + repair before polish."
  ),
  scattered: makeInst(
    "scattered",
    "Hard · Scattered corners",
    () => ({
      A: { x: 0, y: 0, w: 3, h: 2 },
      B: { x: 8, y: 0, w: 2, h: 3 },
      C: { x: 0, y: 6, w: 2, h: 2 },
      D: { x: 7, y: 7, w: 3, h: 1 },
      E: { x: 8, y: 5, w: 2, h: 2 },
    }),
    "Legal but high HPWL — SA / SP / portfolio should compact wire."
  ),
  soft_seed: makeInst(
    "soft_seed",
    "Hard · Soft-A reshape seed",
    () => SOFT_A_PACK,
    "Soft A already 2×3 — soft-aware / polish variants explore aspect."
  ),
  macro_lock: makeInst(
    "macro_lock",
    "Hard · Macro D locked",
    () => MACRO_PACK,
    "D fixed at (0,0) — SA must not move the macro.",
    ["D"]
  ),
  corner_jam: makeInst(
    "corner_jam",
    "Hard · Corner jam",
    () => ({
      A: { x: 0, y: 0, w: 3, h: 2 },
      B: { x: 0, y: 0, w: 2, h: 3 },
      C: { x: 0, y: 0, w: 2, h: 2 },
      D: { x: 0, y: 0, w: 3, h: 1 },
      E: { x: 0, y: 0, w: 2, h: 2 },
    }),
    "All stacked at origin — bottom-left / repair / multistart."
  ),
  wire_stress: makeInst(
    "wire_stress",
    "Hard · Wire-stress spread",
    () => ({
      A: { x: 0, y: 0, w: 3, h: 2 },
      B: { x: 7, y: 0, w: 2, h: 3 },
      C: { x: 0, y: 5, w: 2, h: 2 },
      D: { x: 6, y: 6, w: 3, h: 1 },
      E: { x: 4, y: 3, w: 2, h: 2 },
    }),
    "Connected modules far apart — HPWL-sensitive engines should win."
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "identity", title: "Identity (seed)", needsSeed: false },
  { id: "clamp", title: "Clamp to outline", needsSeed: false },
  { id: "repair", title: "Overlap repair", needsSeed: false },
  { id: "bottom_left", title: "Bottom-left pack", needsSeed: false },
  { id: "bl_permute", title: "BL order search", needsSeed: false },
  { id: "skyline", title: "Skyline / shelf", needsSeed: false },
  { id: "compact", title: "Left-down compact", needsSeed: false },
  { id: "polish", title: "Polish (golden)", needsSeed: false },
  { id: "polish_search", title: "Polish operand search", needsSeed: false },
  { id: "bstar", title: "B*-tree (golden)", needsSeed: false },
  { id: "sp", title: "Sequence-pair (golden)", needsSeed: false },
  { id: "sp_multi", title: "SP multistart", needsSeed: false },
  { id: "sp_sa", title: "SP simulated annealing", needsSeed: false },
  { id: "sp_sa_multi", title: "SP-SA multiseed", needsSeed: false },
  { id: "hierarchical", title: "Hierarchical pack", needsSeed: false },
  { id: "soft", title: "Soft-module aware", needsSeed: false },
  { id: "wire_force", title: "Wire-force + repair", needsSeed: false },
  { id: "sa", title: "Simulated annealing", needsSeed: false },
  { id: "sa_multi", title: "SA multiseed", needsSeed: false },
  { id: "hpwl_sa", title: "HPWL-deep SA", needsSeed: false },
  { id: "repair_sa", title: "Repair → SA", needsSeed: false },
  { id: "wire_polish", title: "Wire force → SA", needsSeed: false },
  { id: "legal_pareto", title: "Legal HPWL Pareto", needsSeed: false },
  { id: "multistart", title: "Multistart floorplan", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio", needsSeed: false },
  { id: "golden", title: "Golden reference", needsSeed: false },
];

export const FLOOR_METRIC_COLUMNS = [
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
    key: "cost",
    label: "Cost",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
  {
    key: "hpwl",
    label: "HPWL",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(1)),
  },
  {
    key: "bbArea",
    label: "BB area",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(0)),
  },
  {
    key: "deadspace",
    label: "Dead",
    fmt: (v) => (v == null ? "—" : String(Math.round(v))),
  },
];

/** Mean center-to-outline-center L1 — seed difficulty proxy. */
export function packExtent(pack, outline = OUTLINE) {
  const ox = outline.w / 2;
  const oy = outline.h / 2;
  const ids = Object.keys(pack);
  if (!ids.length) return 0;
  let s = 0;
  for (const id of ids) {
    const r = pack[id];
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    s += Math.abs(cx - ox) + Math.abs(cy - oy);
  }
  return s / ids.length;
}

export function seedStress(pack) {
  return hpwl(pack) + (isLegalPacking(pack) ? 0 : 100);
}

export function scoreSolution(run, origin, opts = {}) {
  const pack = run.pack || origin;
  const outline = opts.outline || OUTLINE;
  const legal = isLegalPacking(pack, outline);
  const bb = bboxStats(pack);
  return {
    pack,
    illegal: legal ? 0 : 1,
    cost: cost(pack, outline),
    hpwl: hpwl(pack),
    bbArea: bb.area,
    deadspace: deadspace(outline),
    density: density(outline),
    stress: seedStress(origin),
    extent: packExtent(origin, outline),
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

export async function runFloorAlgo(algoId, instance, opts = {}) {
  const pack = instance.pack;
  const outline = instance.outline || OUTLINE;
  const modules = instance.modules || TINY_MODULES;
  const lockedIds = instance.lockedIds || [];
  const packOpts = { outline, modules, lockedIds, seed: 42 };

  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra?.run) {
    const out = await extra.run(clonePack(pack), {
      ...packOpts,
      outline,
      modules,
      lockedIds,
    });
    const pl = out?.pack || out;
    return {
      pack: clonePack(pl),
      detail: out?.detail || "upload",
    };
  }

  switch (algoId) {
    case "identity":
      return { pack: clonePack(pack), detail: "identity" };
    case "clamp":
      return {
        pack: clampToOutline(pack, outline),
        detail: "clampToOutline",
      };
    case "repair":
      return {
        pack: repairOverlaps(pack, outline),
        detail: "repairOverlaps",
      };
    case "bottom_left":
      return {
        pack: bottomLeftDefault(modules, outline),
        detail: "bottomLeftDefault",
      };
    case "bl_permute":
      return {
        pack: blPermutePack(modules, outline, { seed: 42, trials: 20 }),
        detail: "blPermutePack",
      };
    case "skyline":
      return {
        pack: skylinePack(modules, outline),
        detail: "skylinePack",
      };
    case "compact":
      return {
        pack: compactPack(repairOverlaps(pack, outline), packOpts),
        detail: "compactPack",
      };
    case "polish":
      return {
        pack: evalPolish(GOLDEN_POLISH, modules).pack,
        detail: "evalPolish/GOLDEN",
      };
    case "polish_search":
      return {
        pack: polishSearch(modules, outline),
        detail: "polishSearch",
      };
    case "bstar":
      return {
        pack: packBstar(GOLDEN_BSTAR, modules),
        detail: "packBstar/GOLDEN",
      };
    case "sp":
      return {
        pack: packSequencePair(GOLDEN_SP.pos, GOLDEN_SP.neg, modules),
        detail: "packSequencePair/GOLDEN",
      };
    case "sp_multi":
      return {
        pack: spMultistart(modules, outline, { seed: 42, trials: 24 }),
        detail: "spMultistart",
      };
    case "sp_sa":
      return {
        pack: spSaPack(modules, outline, { ...packOpts, moves: 280 }),
        detail: "spSaPack",
      };
    case "sp_sa_multi":
      return {
        pack: spSaMultiPack(modules, outline, packOpts),
        detail: "spSaMultiPack",
      };
    case "hierarchical":
      return { pack: packHierarchical(), detail: "packHierarchical" };
    case "soft":
      return {
        pack: softAwarePack(modules, outline),
        detail: "softAwarePack",
      };
    case "wire_force":
      return {
        pack: wireForcePack(pack, packOpts),
        detail: "wireForcePack",
      };
    case "sa":
      return {
        pack: saFloorplan(pack, { ...packOpts, moves: 200 }),
        detail: "saFloorplan/42",
      };
    case "sa_multi":
      return {
        pack: saMultiseedFloorplan(pack, packOpts),
        detail: "saMultiseedFloorplan",
      };
    case "hpwl_sa":
      return {
        pack: hpwlSaPack(pack, packOpts),
        detail: "hpwlSaPack",
      };
    case "repair_sa":
      return {
        pack: repairThenSa(pack, packOpts),
        detail: "repairThenSa",
      };
    case "wire_polish":
      return {
        pack: wirePolishPack(pack, packOpts),
        detail: "wirePolishPack",
      };
    case "legal_pareto":
      return {
        pack: legalParetoPack(pack, packOpts),
        detail: "legalParetoPack",
      };
    case "multistart":
      return {
        pack: multistartFloorplan(pack, packOpts),
        detail: "multistartFloorplan",
      };
    case "portfolio": {
      const out = portfolioFloorplan(pack, packOpts);
      return { pack: out.pack, detail: out.detail };
    }
    case "golden":
      return { pack: clonePack(GOLDEN_PACK), detail: "GOLDEN_PACK" };
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
  const n = (instance.modules || TINY_MODULES).length;
  const base = n * 160 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 80;
  switch (algoId) {
    case "portfolio":
    case "multistart":
    case "legal_pareto":
    case "sp_sa_multi":
    case "sp_multi":
    case "bl_permute":
    case "sa_multi":
    case "wire_polish":
    case "hpwl_sa":
    case "polish_search":
    case "soft":
      return base + n * 360;
    case "sp_sa":
    case "sa":
    case "repair_sa":
    case "wire_force":
      return base + n * 220;
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
  const ac = a.cost ?? Infinity;
  const bc = b.cost ?? Infinity;
  if (Math.abs(ac - bc) > 1e-9) return ac - bc;
  const ah = a.hpwl ?? Infinity;
  const bh = b.hpwl ?? Infinity;
  if (Math.abs(ah - bh) > 1e-9) return ah - bh;
  const aa = a.bbArea ?? Infinity;
  const ba = b.bbArea ?? Infinity;
  if (Math.abs(aa - ba) > 1e-9) return aa - ba;
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runFloorBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const instance = inst.instance();
  const origin = clonePack(instance.pack);
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];
  const scoreOpts = { outline: instance.outline || OUTLINE };

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runFloorAlgo(algoId, instance, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runFloorAlgo(algoId, instance, opts);
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
        cost: scored.cost,
        hpwl: scored.hpwl,
        bbArea: scored.bbArea,
        deadspace: scored.deadspace,
        density: scored.density,
        pack: scored.pack,
        stress: scored.stress,
        extent: scored.extent,
        detail: run.detail || "",
        ms: Math.max(0, t1 - t0),
        memBytes: heapDelta != null && heapDelta > 0 ? heapDelta : memEst,
        memEstBytes: memEst,
        heapDeltaBytes: heapDelta,
        memSource: heapDelta != null && heapDelta > 0 ? "heap-delta" : "estimate",
        instanceId,
        nModules: TINY_MODULES.length,
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
        nModules: TINY_MODULES.length,
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
    instance: { ...instance, pack: origin },
    rows,
  };
}

export async function runFloorBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length
    ? instanceIds
    : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runFloorBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runFloorBenchmark(id, algoIds, opts));
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
    "cost",
    "hpwl",
    "bbArea",
    "deadspace",
    "density",
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
    avg.pack = ok[0].pack;
    avg.memSource = "estimate";
    rows.push(avg);
  }

  rows.sort(compareBenchRowsUserFirst);
  return {
    instanceId: ids.join("+"),
    instanceIds: ids,
    instanceTitle: `Average · ${ids.length} instances`,
    notes: "Means across selected instances; ranking uses illegal → cost → HPWL.",
    mode: "average",
    instance: perInstance[0]?.instance || null,
    perInstance,
    rows,
  };
}
