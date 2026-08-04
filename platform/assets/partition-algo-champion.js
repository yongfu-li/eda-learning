/**
 * House champion bipartitioner — portfolio of constructors + FM refine.
 * Optimizes cut under a balance tolerance (default 0.35, matching FM labs).
 * Avoids importing partitioning-core.js (would cycle).
 */
import {
  cutsize,
  fiducciaMattheyses,
  spectralBisection,
} from "./clustering-core.js";
import { annealBipartition } from "./partition-algo-anneal.js";
import { inertialBipartition } from "./partition-algo-inertial.js";

function mulberry32(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

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
    return { imbalance: 1, ratio: null };
  }
  const s0 = ps[labs[0]];
  const s1 = ps[labs[1]];
  const total = s0 + s1;
  const lo = Math.min(s0, s1);
  const hi = Math.max(s0, s1);
  return { imbalance: Math.abs(s0 - s1) / total, ratio: lo / hi };
}

function randomBipartition(nodes, seed = 7) {
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

function growBipartition(nodes, edges, seedNode) {
  const adj = {};
  for (const { u, v, w } of edges) {
    if (!adj[u]) adj[u] = {};
    if (!adj[v]) adj[v] = {};
    adj[u][v] = (adj[u][v] || 0) + w;
    adj[v][u] = (adj[v][u] || 0) + w;
  }
  const target = Math.floor(nodes.length / 2);
  const left = new Set([seedNode]);
  while (left.size < target) {
    let best = null;
    for (const u of left) {
      for (const [v, w] of Object.entries(adj[u] || {})) {
        if (left.has(v)) continue;
        if (!best || w > best.w || (w === best.w && v < best.v)) best = { v, w };
      }
    }
    if (!best) {
      const leftover = nodes.find((n) => !left.has(n));
      if (!leftover) break;
      left.add(leftover);
    } else left.add(best.v);
  }
  return Object.fromEntries(nodes.map((n) => [n, left.has(n) ? "0" : "1"]));
}

function scoreRow(assignment, edges, sizes, balanceTol) {
  const asn = normalizeBipartLabels(assignment);
  const bal = balanceMetrics(asn, sizes);
  const cut = cutsize(asn, edges);
  const imb = bal.imbalance ?? 1;
  return {
    assignment: asn,
    cut,
    imbalance: imb,
    ratio: bal.ratio,
    feasible: imb <= balanceTol,
  };
}

function better(a, b) {
  if (a.feasible !== b.feasible) return a.feasible ? a : b;
  if (a.feasible) {
    if (a.cut !== b.cut) return a.cut < b.cut ? a : b;
    if (a.imbalance !== b.imbalance) return a.imbalance < b.imbalance ? a : b;
  } else {
    // Both violate balanceTol: prefer healthier balance, then cut.
    if (a.imbalance !== b.imbalance) return a.imbalance < b.imbalance ? a : b;
    if (a.cut !== b.cut) return a.cut < b.cut ? a : b;
  }
  return a;
}

/**
 * Portfolio champion: many constructive starts → FM refine → best under balanceTol.
 */
export function championBipartition(nodes, edges, sizes = null, opts = {}) {
  if (!nodes.length) return { assignment: {}, detail: "empty" };
  if (nodes.length === 1) {
    return { assignment: { [nodes[0]]: "0" }, detail: "single node" };
  }

  const balanceTol = opts.balanceTol ?? 0.25;
  const maxPasses = opts.maxPasses ?? 12;
  const seed = opts.randomSeed ?? 7;
  const growN = opts.growSeeds ?? Math.min(6, nodes.length);
  const randN = opts.randomStarts ?? 4;
  const useAnneal = opts.useAnneal !== false;
  const terminals = opts.terminals || null;

  function enforceTerminals(asn) {
    if (!terminals) return { ...asn };
    const out = { ...asn };
    for (const [n, p] of Object.entries(terminals)) out[n] = String(p);
    return out;
  }

  const constructors = [];

  try {
    const { assignment } = spectralBisection(nodes, edges, sizes);
    constructors.push({ name: "spectral", assignment });
  } catch {
    /* ignore */
  }
  try {
    const { assignment } = inertialBipartition(nodes, edges, sizes);
    constructors.push({ name: "inertial", assignment });
  } catch {
    /* ignore */
  }

  const sorted = [...nodes].sort();
  const step = Math.max(1, Math.floor(sorted.length / growN));
  for (let i = 0; i < growN; i++) {
    const s = sorted[Math.min(sorted.length - 1, i * step)];
    constructors.push({
      name: `grow:${s}`,
      assignment: growBipartition(nodes, edges, s),
    });
  }

  for (let i = 0; i < randN; i++) {
    constructors.push({
      name: `rand:${seed + i}`,
      assignment: randomBipartition(nodes, seed + i * 17),
    });
  }

  if (useAnneal && nodes.length <= 48) {
    try {
      const { assignment } = annealBipartition(nodes, edges, sizes, {
        randomSeed: seed,
        iters: Math.max(40, nodes.length * 8),
        cool: 0.92,
      });
      constructors.push({ name: "anneal", assignment });
    } catch {
      /* ignore */
    }
  }

  let best = null;
  for (const c of constructors) {
    let refined;
    try {
      const { assignment } = fiducciaMattheyses(
        nodes,
        edges,
        enforceTerminals(c.assignment),
        maxPasses,
        balanceTol
      );
      refined = scoreRow(enforceTerminals(assignment), edges, sizes, balanceTol);
    } catch {
      refined = scoreRow(enforceTerminals(c.assignment), edges, sizes, balanceTol);
    }
    best = best ? better(best, refined) : refined;
  }

  if (best) {
    try {
      const { assignment } = fiducciaMattheyses(
        nodes,
        edges,
        enforceTerminals(best.assignment),
        maxPasses + 8,
        balanceTol
      );
      best = better(
        best,
        scoreRow(enforceTerminals(assignment), edges, sizes, balanceTol)
      );
    } catch {
      /* keep */
    }
  }

  return {
    assignment: enforceTerminals(best.assignment),
    detail: `multistart_fm cut=${best.cut} bal=${best.ratio?.toFixed?.(2) ?? "—"} tol=${balanceTol} starts=${constructors.length}`,
    cut: best.cut,
    imbalance: best.imbalance,
  };
}

export function runChampion(graph, opts = {}) {
  return championBipartition(graph.nodes, graph.edges, graph.sizes, opts);
}
