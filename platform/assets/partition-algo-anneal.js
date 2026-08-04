/**
 * partition-algo-anneal.js — simulated-annealing bipartition via balance-preserving swaps.
 * Self-contained; deterministic given opts.randomSeed (default 7).
 */

/** Deterministic LCG for reproducible randomness. */
function mulberry32(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Weighted cut size across edges whose endpoints lie in different parts. */
function cutsize(assignment, edges) {
  let total = 0;
  for (const { u, v, w } of edges) {
    if (assignment[u] !== assignment[v]) total += w;
  }
  return total;
}

/** Map arbitrary two-label assignment onto "0"/"1". */
function normalizeBipartLabels(assignment) {
  const labs = [...new Set(Object.values(assignment).map(String))].sort();
  if (labs.length !== 2) return { ...assignment };
  const map = { [labs[0]]: "0", [labs[1]]: "1" };
  return Object.fromEntries(
    Object.entries(assignment).map(([n, p]) => [n, map[String(p)] ?? String(p)])
  );
}

/** Random half-split bipartition (same spirit as partitioning-core randomBipartition). */
function randomBipartition(nodes, seed) {
  const rng = mulberry32(seed);
  const shuffled = [...nodes].sort((a, b) => {
    const ra = rng();
    const rb = rng();
    return ra - rb || (a < b ? -1 : 1);
  });
  const half = Math.floor(nodes.length / 2);
  const left = new Set(shuffled.slice(0, half));
  return Object.fromEntries(nodes.map((n) => [n, left.has(n) ? "0" : "1"]));
}

/** |s0 - s1| / total for weighted parts (default unit size). */
function imbalance(assignment, nodes, sizes) {
  let s0 = 0;
  let s1 = 0;
  for (const n of nodes) {
    const s = sizes?.[n] ?? 1;
    if (assignment[n] === "0") s0 += s;
    else s1 += s;
  }
  const total = s0 + s1;
  return total > 0 ? Math.abs(s0 - s1) / total : 0;
}

/** Lower cut wins; equal cut → lower imbalance wins. */
function isBetter(cutA, imbA, cutB, imbB) {
  if (cutA !== cutB) return cutA < cutB;
  return imbA < imbB;
}

/**
 * Simulated-annealing bipartition: swap one node from each side per move.
 * @returns {{ assignment: Object, detail: string, bestCut: number }}
 */
export function annealBipartition(nodes, edges, sizes = null, opts = {}) {
  const seed = opts.randomSeed ?? 7;
  const rng = mulberry32(seed);
  const iters = opts.iters ?? Math.max(50, nodes.length * 20);
  const cool = opts.cool ?? 0.95;

  let assignment;
  if (opts.seedAsn) {
    assignment = normalizeBipartLabels({ ...opts.seedAsn });
    for (const n of nodes) {
      if (!(n in assignment)) {
        throw new Error(`seedAsn missing node: ${n}`);
      }
    }
  } else {
    assignment = randomBipartition(nodes, seed);
  }

  assignment = normalizeBipartLabels(assignment);

  const side0 = [];
  const side1 = [];
  for (const n of nodes) {
    if (assignment[n] === "0") side0.push(n);
    else side1.push(n);
  }

  let curCut = cutsize(assignment, edges);
  let T = opts.t0 ?? Math.max(1, curCut * 0.5);

  let bestAssignment = { ...assignment };
  let bestCut = curCut;
  let bestImb = imbalance(assignment, nodes, sizes);

  for (let i = 0; i < iters; i++) {
    if (!side0.length || !side1.length) break;

    const u = side0[Math.floor(rng() * side0.length)];
    const v = side1[Math.floor(rng() * side1.length)];

    assignment[u] = "1";
    assignment[v] = "0";

    const newCut = cutsize(assignment, edges);
    const deltaCut = newCut - curCut;

    let accepted = false;
    if (deltaCut <= 0 || rng() < Math.exp(-deltaCut / Math.max(T, 1e-12))) {
      accepted = true;
      curCut = newCut;
      const ui = side0.indexOf(u);
      const vi = side1.indexOf(v);
      side0[ui] = v;
      side1[vi] = u;

      const imb = imbalance(assignment, nodes, sizes);
      if (isBetter(curCut, imb, bestCut, bestImb)) {
        bestCut = curCut;
        bestImb = imb;
        bestAssignment = { ...assignment };
      }
    }

    if (!accepted) {
      assignment[u] = "0";
      assignment[v] = "1";
    }

    if ((i + 1) % nodes.length === 0 || i === iters - 1) {
      T *= cool;
    }
  }

  return {
    assignment: bestAssignment,
    detail: `metropolis_swap iters=${iters} bestCut=${bestCut} seed=${seed}`,
    bestCut,
  };
}

/** Graph wrapper: { nodes, edges, sizes? }. */
export function runAnneal(graph, opts = {}) {
  const { nodes, edges, sizes } = graph;
  return annealBipartition(nodes, edges, sizes ?? null, opts);
}
