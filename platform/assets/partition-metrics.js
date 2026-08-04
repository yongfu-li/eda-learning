/**
 * Partition evaluation metrics for the benchmark scoreboard.
 * Browser-feasible measures + explicit N/A for parallel/energy/timing.
 * (Does not import partitioning-core — avoids circular deps.)
 */
import { cutsize, hyperedgeCut, partsString } from "./clustering-core.js";

const BAL_TOL = 0.25;

function normalizeBipartLabels(assignment) {
  const labs = [...new Set(Object.values(assignment).map(String))].sort();
  if (labs.length !== 2) return { ...assignment };
  const map = { [labs[0]]: "0", [labs[1]]: "1" };
  return Object.fromEntries(
    Object.entries(assignment).map(([n, p]) => [n, map[String(p)] ?? String(p)])
  );
}

function balanceMetrics(assignment, sizes = null) {
  const ps = {};
  for (const [n, p] of Object.entries(assignment)) {
    ps[p] = (ps[p] || 0) + (sizes?.[n] ?? 1);
  }
  const labs = Object.keys(ps).sort();
  if (labs.length !== 2) {
    return { parts: ps, labels: labs, ratio: null, imbalance: null, sizes: null };
  }
  const s0 = ps[labs[0]];
  const s1 = ps[labs[1]];
  const total = s0 + s1;
  const lo = Math.min(s0, s1);
  const hi = Math.max(s0, s1);
  return {
    parts: ps,
    labels: labs,
    sizes: [s0, s1],
    ratio: lo / hi,
    imbalance: Math.abs(s0 - s1) / total,
  };
}

function degreeMap(nodes, edges) {
  const deg = Object.fromEntries(nodes.map((n) => [n, 0]));
  for (const { u, v, w } of edges) {
    const ww = w ?? 1;
    deg[u] = (deg[u] || 0) + ww;
    deg[v] = (deg[v] || 0) + ww;
  }
  return deg;
}

function partVolume(nodes, assignment, deg, lab) {
  let v = 0;
  for (const n of nodes) {
    if (String(assignment[n]) === lab) v += deg[n] || 0;
  }
  return v;
}

function partCount(nodes, assignment, lab) {
  return nodes.filter((n) => String(assignment[n]) === lab).length;
}

/** Edges as 2-pin hyperedges when instance has no hedges. */
export function hedgesFromGraph(graph) {
  if (graph.hedges?.length) return graph.hedges;
  return (graph.edges || []).map((e) => ({
    pins: [e.u, e.v],
    w: e.w ?? 1,
  }));
}

/**
 * Geometric HPWL proxy: place each part in a column using layout or synthetic coords.
 * Sums |Δx|+|Δy| over all edges (teaching proxy, not a real placer).
 */
export function hpwlProxy(graph, assignment, layout = null) {
  const asn = assignment;
  const nodes = graph.nodes;
  const labs = [...new Set(nodes.map((n) => String(asn[n])))].sort();
  const coords = {};
  if (layout) {
    for (const n of nodes) {
      const p = layout[n];
      coords[n] = p ? { x: p.x, y: p.y } : { x: 0, y: 0 };
    }
  } else {
    // Synthetic: part index on x, stable order on y
    const byLab = Object.fromEntries(labs.map((l) => [l, []]));
    for (const n of [...nodes].sort()) byLab[String(asn[n])]?.push(n);
    labs.forEach((lab, li) => {
      (byLab[lab] || []).forEach((n, i) => {
        coords[n] = { x: li * 100, y: i * 10 };
      });
    });
  }
  let hpwl = 0;
  for (const { u, v, w } of graph.edges || []) {
    const a = coords[u];
    const b = coords[v];
    if (!a || !b) continue;
    hpwl += (w ?? 1) * (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
  }
  return hpwl;
}

/** Cut edges counted as geometric border if layout present; else = cut weight. */
export function borderLength(graph, assignment, layout = null) {
  const asn = assignment;
  let border = 0;
  for (const { u, v, w } of graph.edges || []) {
    if (asn[u] == null || asn[v] == null || asn[u] === asn[v]) continue;
    if (layout?.[u] && layout?.[v]) {
      const dx = layout[u].x - layout[v].x;
      const dy = layout[u].y - layout[v].y;
      border += (w ?? 1) * Math.hypot(dx, dy);
    } else {
      border += w ?? 1;
    }
  }
  return border;
}

/**
 * Full metric bundle for one assignment on one graph.
 * @returns {object} metrics (numbers or null) + notes for N/A fields
 */
export function evaluatePartition(assignment, graph, opts = {}) {
  const asn = normalizeBipartLabels(assignment || {});
  const nodes = graph.nodes || [];
  const edges = graph.edges || [];
  const sizes = graph.sizes || null;
  const bal = balanceMetrics(asn, sizes);
  const cut = cutsize(asn, edges);
  const hedges = hedgesFromGraph(graph);
  const hCut = hyperedgeCut(asn, hedges);
  let hCutCount = 0;
  for (const h of hedges) {
    const labs = new Set((h.pins || []).map((p) => asn[p]));
    if (labs.size > 1) hCutCount += 1;
  }

  const deg = degreeMap(nodes, edges);
  const labs = [...new Set(Object.values(asn).map(String))].sort();
  let conductance = null;
  let expansion = null;
  let normalizedCut = null;
  let maxPartFrac = null;

  if (labs.length === 2) {
    const [a, b] = labs;
    const volA = partVolume(nodes, asn, deg, a);
    const volB = partVolume(nodes, asn, deg, b);
    const nA = partCount(nodes, asn, a);
    const nB = partCount(nodes, asn, b);
    const minVol = Math.min(volA, volB) || 1;
    const minN = Math.min(nA, nB) || 1;
    conductance = cut / minVol;
    expansion = cut / minN;
    normalizedCut = cut / (volA || 1) + cut / (volB || 1);
    const totalSize =
      (bal.sizes?.[0] ?? nA) + (bal.sizes?.[1] ?? nB) || nodes.length;
    const maxSize = Math.max(bal.sizes?.[0] ?? nA, bal.sizes?.[1] ?? nB);
    maxPartFrac = maxSize / totalSize;
  } else if (nodes.length) {
    const counts = {};
    for (const n of nodes) {
      const p = String(asn[n] ?? "?");
      counts[p] = (counts[p] || 0) + (sizes?.[n] ?? 1);
    }
    const vals = Object.values(counts);
    const total = vals.reduce((s, x) => s + x, 0) || 1;
    maxPartFrac = Math.max(...vals) / total;
  }

  const layout =
    typeof opts.layout === "function" ? opts.layout() : opts.layout || null;
  const hpwl = hpwlProxy(graph, asn, layout);
  const border = borderLength(graph, asn, layout);
  const imb = bal.imbalance;
  const balanceTol = opts.balanceTol ?? BAL_TOL;
  const balanceOk = imb != null && imb <= balanceTol;

  // Terminal violations
  let terminalViolations = 0;
  const terminals = graph.terminals || null;
  if (terminals) {
    for (const [n, p] of Object.entries(terminals)) {
      if (asn[n] == null) {
        terminalViolations += 1;
        continue;
      }
      if (String(asn[n]) !== String(p)) terminalViolations += 1;
    }
  }

  // Critical-net cut (null if instance has no critical edges)
  let criticalNetCut = null;
  let critWeight = 0;
  let hasCritical = false;
  for (const e of edges) {
    if (!e.critical) continue;
    hasCritical = true;
    if (asn[e.u] != null && asn[e.v] != null && asn[e.u] !== asn[e.v]) {
      critWeight += e.w ?? 1;
    }
  }
  if (hasCritical) criticalNetCut = critWeight;

  const passes =
    typeof opts.passes === "number"
      ? opts.passes
      : Array.isArray(opts.history)
        ? opts.history.length
        : null;

  return {
    cut,
    imbalance: imb,
    ratio: bal.ratio,
    sizes: bal.sizes,
    parts: partsString(asn),
    maxPartFrac,
    balanceOk,
    balanceTol,
    terminalViolations: terminals ? terminalViolations : null,
    conductance,
    expansion,
    normalizedCut,
    hyperCut: hCut,
    hyperCutCount: hCutCount,
    borderLength: border,
    hpwlProxy: hpwl,
    passes,
    criticalNetCut,
    parallelSpeedup: null,
    parallelEfficiency: null,
    energyJ: null,
    seedCutMin: opts.seedCutMin ?? null,
    seedCutMax: opts.seedCutMax ?? null,
    seedCutMean: opts.seedCutMean ?? null,
    seedCutStd: opts.seedCutStd ?? null,
    timeToTargetMs: opts.timeToTargetMs ?? null,
    notes: {
      criticalNetCut: hasCritical
        ? "sum of cut edges marked critical"
        : "N/A — instance has no critical-net annotations",
      terminalViolations: terminals
        ? "nodes whose side differs from fixed terminals"
        : "N/A — instance has no terminals",
      parallelSpeedup: "N/A — single-threaded browser run (no multi-worker partition yet)",
      parallelEfficiency: "N/A — requires parallel baseline",
      energyJ: "N/A — not measurable in-page",
      hyperCut:
        graph.hedges?.length
          ? "instance hyperedges"
          : "pairwise edges as 2-pin hyperedges (= edge cut weight)",
      hpwlProxy: layout
        ? "HPWL using instance layout coords"
        : "HPWL using synthetic part columns",
    },
  };
}

export function stddev(nums) {
  const xs = nums.filter((x) => typeof x === "number" && !Number.isNaN(x));
  if (xs.length < 2) return 0;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length;
  return Math.sqrt(v);
}

/** Summarize cut list from a seed sweep. */
export function summarizeSeedCuts(cuts) {
  const xs = cuts.filter((x) => typeof x === "number" && !Number.isNaN(x));
  if (!xs.length) {
    return { seedCutMin: null, seedCutMax: null, seedCutMean: null, seedCutStd: null };
  }
  const seedCutMean = xs.reduce((a, b) => a + b, 0) / xs.length;
  return {
    seedCutMin: Math.min(...xs),
    seedCutMax: Math.max(...xs),
    seedCutMean,
    seedCutStd: stddev(xs),
  };
}

/** Design balance tolerance for ranking (stricter than classic FM 0.35). */
export const RANK_BALANCE_TOL = 0.25;

export const METRIC_COLUMNS = [
  { key: "ms", label: "Runtime", fmt: "ms" },
  { key: "memBytes", label: "Memory", fmt: "mem" },
  { key: "cut", label: "Edge cut", fmt: "num" },
  { key: "imbalance", label: "Imbalance", fmt: "num3" },
  { key: "ratio", label: "Balance ratio", fmt: "num3" },
  { key: "maxPartFrac", label: "Max part frac", fmt: "num3" },
  { key: "balanceOk", label: "Bal ≤0.25", fmt: "bool" },
  { key: "terminalViolations", label: "Terminal viol.", fmt: "num" },
  { key: "criticalNetCut", label: "Critical-net cut", fmt: "num" },
  { key: "conductance", label: "Conductance", fmt: "num3" },
  { key: "expansion", label: "Expansion", fmt: "num3" },
  { key: "normalizedCut", label: "Norm. cut", fmt: "num3" },
  { key: "hyperCut", label: "Hyperedge cut", fmt: "num" },
  { key: "hyperCutCount", label: "#hedges cut", fmt: "num" },
  { key: "borderLength", label: "Border len", fmt: "num1" },
  { key: "hpwlProxy", label: "HPWL proxy", fmt: "num1" },
  { key: "passes", label: "Passes", fmt: "num" },
  { key: "seedCutMean", label: "Seed cut μ", fmt: "num2" },
  { key: "seedCutStd", label: "Seed cut σ", fmt: "num2" },
  { key: "seedCutMin", label: "Seed cut min", fmt: "num" },
  { key: "seedCutMax", label: "Seed cut max", fmt: "num" },
  { key: "parallelSpeedup", label: "Parallel speedup", fmt: "na" },
  { key: "parallelEfficiency", label: "Parallel eff.", fmt: "na" },
  { key: "energyJ", label: "Energy (J)", fmt: "na" },
];
