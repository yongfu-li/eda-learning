/**
 * Multi-start constructive + FM portfolio for clustering benchmarks.
 * Avoids importing clustering-benchmark-core (would cycle).
 */
import {
  cutsize,
  fiducciaMattheyses,
  greedyPairMerge,
  spectralBisection,
} from "./clustering-core.js";
import { gainFillBipartition } from "./partition-algo-gainfill.js";

function mulberry32(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
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
    adj[u][v] = (adj[u][v] || 0) + (w ?? 1);
    adj[v][u] = (adj[v][u] || 0) + (w ?? 1);
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

function normalizeBipartLabels(assignment) {
  const labs = [...new Set(Object.values(assignment).map(String))].sort();
  if (labs.length !== 2) return { ...assignment };
  const map = { [labs[0]]: "0", [labs[1]]: "1" };
  return Object.fromEntries(
    Object.entries(assignment).map(([n, p]) => [n, map[String(p)] ?? String(p)])
  );
}

function imbalanceOf(assignment, sizes = null) {
  const ps = {};
  for (const [n, p] of Object.entries(assignment)) {
    ps[p] = (ps[p] || 0) + (sizes?.[n] ?? 1);
  }
  const vals = Object.values(ps);
  if (vals.length < 2) return 1;
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  return (Math.max(...vals) - Math.min(...vals)) / total;
}

function scoreRow(assignment, edges, sizes, balanceTol) {
  const asn = normalizeBipartLabels(assignment);
  const cut = cutsize(asn, edges);
  const imb = imbalanceOf(asn, sizes);
  return {
    assignment: asn,
    cut,
    imbalance: imb,
    balanceOk: imb <= balanceTol + 1e-12,
  };
}

function better(a, b) {
  if (a.balanceOk !== b.balanceOk) return a.balanceOk ? a : b;
  if (a.cut !== b.cut) return a.cut < b.cut ? a : b;
  return a.imbalance <= b.imbalance ? a : b;
}

/**
 * Portfolio: spectral / gain-fill / greedy / grow / random → FM refine → best under balanceTol.
 */
export function multistartFmCluster(nodes, edges, sizes = null, opts = {}) {
  if (!nodes.length) return { assignment: {}, detail: "empty" };
  if (nodes.length === 1) {
    return { assignment: { [nodes[0]]: "0" }, detail: "single node" };
  }

  const balanceTol = opts.balanceTol ?? 0.25;
  const maxPasses = opts.maxPasses ?? 12;
  const seed = opts.randomSeed ?? 7;
  const growN = opts.growSeeds ?? Math.min(6, nodes.length);
  const randN = opts.randomStarts ?? 4;
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
    const { assignment } = gainFillBipartition(nodes, edges, sizes);
    constructors.push({ name: "gain_fill", assignment });
  } catch {
    /* ignore */
  }
  try {
    const { assignment } = greedyPairMerge(nodes, edges, sizes, 2);
    constructors.push({ name: "greedy", assignment });
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

  let best = null;
  let bestName = "";
  for (const c of constructors) {
    let refined;
    try {
      const { assignment } = fiducciaMattheyses(
        nodes,
        edges,
        enforceTerminals(normalizeBipartLabels(c.assignment)),
        maxPasses,
        balanceTol
      );
      refined = scoreRow(enforceTerminals(assignment), edges, sizes, balanceTol);
    } catch {
      refined = scoreRow(
        enforceTerminals(normalizeBipartLabels(c.assignment)),
        edges,
        sizes,
        balanceTol
      );
    }
    if (!best || better(refined, best) === refined) {
      best = refined;
      bestName = c.name;
    }
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
      const polished = scoreRow(
        enforceTerminals(assignment),
        edges,
        sizes,
        balanceTol
      );
      if (better(polished, best) === polished) {
        best = polished;
        bestName = `${bestName}+polish`;
      }
    } catch {
      /* keep best */
    }
  }

  return {
    assignment: best?.assignment || randomBipartition(nodes, seed),
    detail: `multistart_fm from=${bestName} cut=${best?.cut ?? "?"}`,
  };
}
