/**
 * Buffering benchmark — shared nets, builtins, dataset runner.
 * Reuses platform/assets/buffering-core.js (learn_buffering labs).
 */
import {
  BUFFER_LIBRARY,
  DRIVER,
  EDGES,
  SINKS,
  SLEW_LIMIT,
  candidateSites,
  edgeLength,
  fanoutBufferTree,
  nodeMap,
  slewDrivenInsert,
  vanGinnekenNet,
} from "./buffering-core.js";
import {
  buffersFromVg,
  countSlewViolations as countSlewViolAdv,
  polarityFlips,
  portfolioBuffer,
  siteDpNet,
  slewThenPolish,
} from "./buffer-algo-advanced.js";

export const TEACH_SUITE = ["tiny", "heavy_load", "long_wire"];
/** Hard suite — differentiates site-DP / slew-polish / portfolio. */
export const HARD_SUITE = [
  "mega_load",
  "ultra_long",
  "micro_slew",
  "dual_heavy",
  "asymmetric",
  "tight_slew",
];
export const SCALE_SUITE = ["tiny", "heavy_load", "long_wire", "ultra_long"];
export const ALL_TEACH_HARD = [...new Set([...TEACH_SUITE, ...HARD_SUITE])];

function cloneSinks(sinks) {
  return sinks.map((s) => ({ ...s }));
}

function cloneEdges(edges) {
  return edges.map((e) => ({ ...e }));
}

function makeNet(id, title, sinksFn, notes, slewLimit = SLEW_LIMIT) {
  const sinks = sinksFn();
  return {
    id,
    title,
    nSinks: sinks.length,
    notes,
    slewLimit,
    instance: () => ({
      driver: { ...DRIVER },
      sinks: cloneSinks(sinksFn()),
      edges: cloneEdges(EDGES),
      slewLimit,
      library: BUFFER_LIBRARY.map((b) => ({ ...b })),
    }),
  };
}

export const BENCHMARK_INSTANCES = {
  tiny: makeNet(
    "tiny",
    "Course tiny net (D→S0→S1/S2)",
    () => cloneSinks(SINKS),
    "Canonical learn_buffering topology."
  ),
  heavy_load: makeNet(
    "heavy_load",
    "Heavy sink capacitance",
    () => [
      { id: "S0", x: 5, y: 4, cload: 2.5 },
      { id: "S1", x: 9, y: 2, cload: 4.0 },
      { id: "S2", x: 9, y: 6, cload: 3.5 },
    ],
    "Larger Cload — Van Ginneken should buffer more aggressively."
  ),
  long_wire: makeNet(
    "long_wire",
    "Long trunk + arms",
    () => [
      { id: "S0", x: 7, y: 4, cload: 1.0 },
      { id: "S1", x: 11, y: 1, cload: 1.5 },
      { id: "S2", x: 11, y: 7, cload: 1.2 },
    ],
    "Longer Manhattan spans raise Elmore delay and slew."
  ),
  tight_slew: makeNet(
    "tight_slew",
    "Hard · Tight slew limit",
    () => cloneSinks(SINKS),
    "Same geometry, slew limit 4 — slew-driven inserts more.",
    4
  ),
  asymmetric: makeNet(
    "asymmetric",
    "Hard · Asymmetric fanout",
    () => [
      { id: "S0", x: 4, y: 4, cload: 1.0 },
      { id: "S1", x: 11, y: 1, cload: 5.0 },
      { id: "S2", x: 6, y: 5, cload: 0.8 },
    ],
    "One heavy far sink — delay and slew diverge across engines."
  ),
  mega_load: makeNet(
    "mega_load",
    "Hard · Mega capacitance",
    () => [
      { id: "S0", x: 5, y: 4, cload: 4.0 },
      { id: "S1", x: 9, y: 2, cload: 8.0 },
      { id: "S2", x: 9, y: 6, cload: 7.0 },
    ],
    "Very large Cload — library-aware / site-DP should pick stronger buffers."
  ),
  ultra_long: makeNet(
    "ultra_long",
    "Hard · Ultra-long spans",
    () => [
      { id: "S0", x: 8, y: 4, cload: 1.5 },
      { id: "S1", x: 11.5, y: 0.5, cload: 2.0 },
      { id: "S2", x: 11.5, y: 7.5, cload: 2.0 },
    ],
    "Near-corner sinks — candidate sites matter more than mid-edge only."
  ),
  micro_slew: makeNet(
    "micro_slew",
    "Hard · Micro slew limit",
    () => [
      { id: "S0", x: 6, y: 4, cload: 2.0 },
      { id: "S1", x: 10, y: 1, cload: 2.5 },
      { id: "S2", x: 10, y: 7, cload: 2.5 },
    ],
    "Slew limit 3 — slew-polish should dominate pure VG on violations.",
    3
  ),
  dual_heavy: makeNet(
    "dual_heavy",
    "Hard · Dual heavy arms",
    () => [
      { id: "S0", x: 5, y: 4, cload: 2.0 },
      { id: "S1", x: 11, y: 1, cload: 6.0 },
      { id: "S2", x: 11, y: 7, cload: 6.0 },
    ],
    "Both arms long and heavy — portfolio can mix strategies."
  ),
};

export const BENCHMARK_ALGOS = [
  { id: "wire_only", title: "Wire-only (no buffers)", needsSeed: false },
  { id: "van_ginneken", title: "Van Ginneken DP lite", needsSeed: false },
  { id: "site_dp", title: "Candidate-site DP + library", needsSeed: false },
  { id: "slew_driven", title: "Slew-driven insertion", needsSeed: false },
  { id: "slew_polish", title: "Slew seed + VG polish", needsSeed: false },
  { id: "fanout", title: "Fanout buffer tree", needsSeed: false },
  { id: "sequential", title: "Sequential (VG + fanout)", needsSeed: false },
  { id: "best_delay", title: "Portfolio min-delay (legacy)", needsSeed: false },
  { id: "portfolio", title: "Composite portfolio (site/slew/VG)", needsSeed: false },
];

export const BUF_METRIC_COLUMNS = [
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
    key: "delay",
    label: "Delay",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "wireDelay",
    label: "Wire Δ",
    fmt: (v) => (v == null || !Number.isFinite(v) ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "improved",
    label: "Improved",
    fmt: (v) => (v == null ? "—" : v ? "yes" : "no"),
  },
  {
    key: "buffers",
    label: "Bufs",
    fmt: (v) => (v == null ? "—" : String(v)),
  },
  {
    key: "slewViolations",
    label: "Slew viol",
    fmt: (v) => (v == null ? "—" : String(v)),
  },
  {
    key: "polarityFlips",
    label: "Polarity",
    fmt: (v) => (v == null ? "—" : String(v)),
  },
  {
    key: "sites",
    label: "Sites",
    fmt: (v) => (v == null ? "—" : String(v)),
  },
];

function countSlewViolations(driver, sinks, edges, slewLimit) {
  return countSlewViolAdv(driver, sinks, edges, slewLimit);
}

/** Mean trunk+arm length (geometry only — many nets share this). */
export function netExtent(driver, sinks, edges) {
  const nodes = nodeMap(driver, sinks);
  if (!edges.length) return 0;
  let sum = 0;
  for (const e of edges) sum += edgeLength(e, nodes);
  return sum / edges.length;
}

/**
 * Difficulty proxy that actually separates the suite:
 * mean edge length × Σ Cload / slewLimit.
 * Pure span collapses (tiny/heavy/mega share geometry).
 */
export function netRcStress(driver, sinks, edges, slewLimit = SLEW_LIMIT) {
  const span = netExtent(driver, sinks, edges);
  const load = (sinks || []).reduce((s, sk) => s + (Number(sk.cload) || 0), 0);
  const lim = Math.max(Number(slewLimit) || SLEW_LIMIT, 1e-9);
  return (span * load) / lim;
}

function scoreSolution(out, net) {
  const { driver, sinks, edges, slewLimit } = net;
  const vg = vanGinnekenNet(driver, sinks, edges);
  const delay = out.delay != null ? out.delay : vg.wireDelay;
  const wireDelay = out.wireDelay != null ? out.wireDelay : vg.wireDelay;
  const buffers = out.buffers || [];
  return {
    delay,
    wireDelay,
    improved: delay < wireDelay - 1e-9,
    buffers: buffers.length,
    bufferList: buffers,
    slewViolations:
      out.slewViolations != null
        ? out.slewViolations
        : countSlewViolations(driver, sinks, edges, slewLimit ?? SLEW_LIMIT),
    polarityFlips:
      out.polarityFlips != null ? out.polarityFlips : polarityFlips(buffers),
    sites: candidateSites(undefined, edges, nodeMap(driver, sinks)).length,
    extent: netExtent(driver, sinks, edges),
    rcStress: netRcStress(driver, sinks, edges, slewLimit ?? SLEW_LIMIT),
  };
}

/**
 * Run one buffering builtin or uploaded solver.
 * Upload: buffer(net, opts) → { buffers, delay?, wireDelay?, detail? }
 */
export async function runBufAlgo(algoId, net, opts = {}) {
  const extra = (opts.extraAlgos || []).find((a) => a.id === algoId);
  if (extra) {
    const out = await Promise.resolve(extra.run(net, opts));
    if (!out || !Array.isArray(out.buffers)) {
      throw new Error(`${extra.title || algoId}: run() must return { buffers: [] }`);
    }
    return {
      buffers: out.buffers,
      delay: out.delay,
      wireDelay: out.wireDelay,
      slewViolations: out.slewViolations,
      detail: out.detail || (extra.isUser ? "uploaded" : ""),
    };
  }

  const { driver, sinks, edges } = net;
  const slewLimit = net.slewLimit ?? opts.slewLimit ?? SLEW_LIMIT;

  switch (algoId) {
    case "wire_only": {
      const vg = vanGinnekenNet(driver, sinks, edges);
      return {
        buffers: [],
        delay: vg.wireDelay,
        wireDelay: vg.wireDelay,
        detail: "wire-only",
      };
    }
    case "van_ginneken": {
      const vg = vanGinnekenNet(driver, sinks, edges);
      return {
        buffers: buffersFromVg(vg, driver, sinks, edges),
        delay: vg.bestDelay,
        wireDelay: vg.wireDelay,
        detail: `vg improved=${vg.improved}`,
      };
    }
    case "site_dp": {
      const site = siteDpNet(driver, sinks, edges, {
        library: net.library || BUFFER_LIBRARY,
      });
      return {
        buffers: site.buffers,
        delay: site.bestDelay,
        wireDelay: site.wireDelay,
        detail: `site_dp sites=${site.siteCount} improved=${site.improved}`,
      };
    }
    case "slew_driven": {
      const sl = slewDrivenInsert(slewLimit, driver, sinks, edges);
      const vg = vanGinnekenNet(driver, sinks, edges);
      return {
        buffers: sl.insertions.map((i) => ({ ...i })),
        delay: vg.wireDelay,
        wireDelay: vg.wireDelay,
        slewViolations: Math.max(
          0,
          countSlewViolations(driver, sinks, edges, slewLimit) - sl.count
        ),
        detail: `slew inserts=${sl.count} limit=${slewLimit}`,
      };
    }
    case "slew_polish": {
      return slewThenPolish(driver, sinks, edges, { slewLimit });
    }
    case "fanout": {
      const f = fanoutBufferTree(sinks);
      const vg = vanGinnekenNet(driver, sinks, edges);
      return {
        buffers: f.buffers.map((b) => ({ ...b })),
        delay: vg.wireDelay,
        wireDelay: vg.wireDelay,
        detail: `fanout inserted=${f.inserted}`,
      };
    }
    case "sequential": {
      const vg = vanGinnekenNet(driver, sinks, edges);
      const fan = fanoutBufferTree(sinks);
      const buffers = [
        ...buffersFromVg(vg, driver, sinks, edges),
        ...(fan.inserted ? fan.buffers.map((b) => ({ ...b })) : []),
      ];
      return {
        buffers,
        delay: vg.bestDelay,
        wireDelay: vg.wireDelay,
        detail: `seq vg+fanout bufs=${buffers.length}`,
      };
    }
    case "best_delay": {
      const cands = [];
      for (const id of ["van_ginneken", "site_dp", "slew_polish", "sequential"]) {
        const r = await runBufAlgo(id, net, { ...opts, extraAlgos: [] });
        cands.push({ id, ...r });
      }
      cands.sort((a, b) => {
        const ad = a.delay ?? Infinity;
        const bd = b.delay ?? Infinity;
        if (Math.abs(ad - bd) > 1e-9) return ad - bd;
        return (a.buffers?.length ?? 0) - (b.buffers?.length ?? 0);
      });
      const best = cands[0];
      return {
        buffers: best.buffers,
        delay: best.delay,
        wireDelay: best.wireDelay,
        slewViolations: best.slewViolations,
        detail: `best_delay from=${best.id}`,
      };
    }
    case "portfolio": {
      return portfolioBuffer(driver, sinks, edges, {
        slewLimit,
        library: net.library || BUFFER_LIBRARY,
      });
    }
    default:
      throw new Error(`Unknown buffer algo: ${algoId}`);
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

export function estimateWorkingSetBytes(algoId, net, isUser = false) {
  const n = (net.sinks || []).length;
  const m = (net.edges || []).length;
  const base = n * 96 + m * 64 + 2048;
  if (isUser || String(algoId).startsWith("user:")) return base + n * 64;
  switch (algoId) {
    case "portfolio":
    case "best_delay":
    case "site_dp":
    case "slew_polish":
      return base + n * 160 + m * 48;
    case "van_ginneken":
    case "sequential":
      return base + n * 128;
    default:
      return base + n * 48;
  }
}

function compareBenchRows(a, b) {
  if (a.error && !b.error) return 1;
  if (b.error && !a.error) return -1;
  // Composite: slew viol → delay → buffers → polarity (even better) → runtime
  const as = a.slewViolations ?? 0;
  const bs = b.slewViolations ?? 0;
  if (as !== bs) return as - bs;
  const ad = a.delay ?? Infinity;
  const bd = b.delay ?? Infinity;
  if (Math.abs(ad - bd) > 1e-9) return ad - bd;
  const ab = a.buffers ?? 0;
  const bb = b.buffers ?? 0;
  if (ab !== bb) return ab - bb;
  const ap = (a.polarityFlips ?? 0) % 2;
  const bp = (b.polarityFlips ?? 0) % 2;
  if (ap !== bp) return ap - bp;
  return (a.ms ?? 0) - (b.ms ?? 0);
}

function compareBenchRowsUserFirst(a, b) {
  const ua = a.isUser ? 0 : 1;
  const ub = b.isUser ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return compareBenchRows(a, b);
}

export async function runBufBenchmark(instanceId, algoIds, opts = {}) {
  const inst = BENCHMARK_INSTANCES[instanceId];
  if (!inst) throw new Error(`Unknown instance: ${instanceId}`);
  const net = inst.instance();
  const ids = resolveAlgoIds(algoIds, opts.extraAlgos);
  const warm = opts.warmup !== false;
  const rows = [];

  for (const algoId of ids) {
    const meta = algoMeta(algoId, opts.extraAlgos);
    const { title, isUser } = meta;
    try {
      if (warm) await runBufAlgo(algoId, net, opts);
      const heap0 = readHeapUsed();
      const t0 = nowMs();
      const run = await runBufAlgo(algoId, net, opts);
      const t1 = nowMs();
      const heap1 = readHeapUsed();
      const scored = scoreSolution(run, net);
      const memEst = estimateWorkingSetBytes(algoId, net, isUser);
      const heapDelta =
        heap0 != null && heap1 != null ? Math.max(0, heap1 - heap0) : null;

      rows.push({
        algoId,
        title,
        isUser,
        delay: scored.delay,
        wireDelay: scored.wireDelay,
        improved: scored.improved,
        buffers: scored.buffers,
        bufferList: scored.bufferList,
        slewViolations: scored.slewViolations,
        polarityFlips: scored.polarityFlips,
        sites: scored.sites,
        extent: scored.extent,
        rcStress: scored.rcStress,
        detail: run.detail || "",
        ms: Math.max(0, t1 - t0),
        memBytes: heapDelta != null && heapDelta > 0 ? heapDelta : memEst,
        memEstBytes: memEst,
        heapDeltaBytes: heapDelta,
        memSource: heapDelta != null && heapDelta > 0 ? "heap-delta" : "estimate",
        instanceId,
        nSinks: net.sinks.length,
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
        nSinks: net.sinks.length,
        extent: netExtent(net.driver, net.sinks, net.edges),
        rcStress: netRcStress(
          net.driver,
          net.sinks,
          net.edges,
          net.slewLimit ?? SLEW_LIMIT
        ),
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
    instance: net,
    rows,
  };
}

export async function runBufBenchmarkDataset(instanceIds, algoIds, opts = {}) {
  const mode = opts.mode || "selective";
  const ids = instanceIds?.length ? instanceIds : Object.keys(BENCHMARK_INSTANCES);

  if (mode === "selective" || ids.length === 1) {
    return runBufBenchmark(ids[0], algoIds, opts);
  }

  const perInstance = [];
  for (const id of ids) {
    perInstance.push(await runBufBenchmark(id, algoIds, opts));
  }

  const byAlgo = new Map();
  for (const rep of perInstance) {
    for (const row of rep.rows) {
      if (!byAlgo.has(row.algoId)) byAlgo.set(row.algoId, []);
      byAlgo.get(row.algoId).push(row);
    }
  }

  const metricKeys = [
    "delay",
    "wireDelay",
    "buffers",
    "slewViolations",
    "polarityFlips",
    "sites",
    "extent",
    "rcStress",
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
      bufferList: head.bufferList,
      detail: `avg over ${ok.length} instances`,
      samples: ok.length,
      vizInstanceId: perInstance[0]?.instanceId,
      improved: ok.every((r) => r.improved),
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
