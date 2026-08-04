/**
 * clustering-core.js — tiny-graph algorithms for EDA platform labs.
 * Mirrors courses/learn_clustering/common (Track A reference).
 */
export const TINY_GRAPH = {
  nodes: ["A", "B", "C", "D", "E"],
  edges: [
    { u: "A", v: "B", w: 5 },
    { u: "A", v: "C", w: 1 },
    { u: "B", v: "C", w: 4 },
    { u: "C", v: "D", w: 2 },
    { u: "D", v: "E", w: 5 },
    { u: "C", v: "E", w: 1 },
  ],
  sizes: { A: 1, B: 1, C: 1, D: 1, E: 1 },
};

export const BAD_SEED = { A: "0", E: "0", B: "1", C: "1", D: "1" };

export function cloneGraph(g = TINY_GRAPH) {
  return {
    nodes: [...g.nodes],
    edges: g.edges.map((e) => ({ ...e })),
    sizes: { ...g.sizes },
  };
}

export function adjacency(edges) {
  const adj = {};
  for (const { u, v, w } of edges) {
    if (!adj[u]) adj[u] = {};
    if (!adj[v]) adj[v] = {};
    adj[u][v] = (adj[u][v] || 0) + w;
    adj[v][u] = (adj[v][u] || 0) + w;
  }
  return adj;
}

export function cutsize(assignment, edges) {
  let total = 0;
  for (const { u, v, w } of edges) {
    if (assignment[u] !== assignment[v]) total += w;
  }
  return total;
}

export function affinityEdgeWeight(edges) {
  return edges
    .map(({ u, v, w }) => {
      const a = u < v ? u : v;
      const b = u < v ? v : u;
      return [a, b, w];
    })
    .sort((x, y) => y[2] - x[2] || (x[0] < y[0] ? -1 : 1) || (x[1] < y[1] ? -1 : 1));
}

export function affinitySharedNeighbors(nodes, edges) {
  const adj = adjacency(edges);
  const scores = new Map();
  for (const { u, v, w } of edges) {
    const a = u < v ? u : v;
    const b = u < v ? v : u;
    const key = `${a}|${b}`;
    scores.set(key, (scores.get(key) || 0) + w);
  }
  for (let i = 0; i < nodes.length; i++) {
    const u = nodes[i];
    const nu = adj[u] || {};
    for (let j = i + 1; j < nodes.length; j++) {
      const v = nodes[j];
      const nv = adj[v] || {};
      let shared = 0;
      for (const [x, wu] of Object.entries(nu)) {
        if (x === v) continue;
        if (nv[x] != null) shared += Math.min(wu, nv[x]);
      }
      const a = u < v ? u : v;
      const b = u < v ? v : u;
      const key = `${a}|${b}`;
      if (shared <= 0 && !scores.has(key)) continue;
      scores.set(key, (scores.get(key) || 0) + shared);
    }
  }
  return [...scores.entries()]
    .map(([k, s]) => {
      const [u, v] = k.split("|");
      return [u, v, s];
    })
    .sort((x, y) => y[2] - x[2] || (x[0] < y[0] ? -1 : 1));
}

function contractPair(nodes, edges, sizes, a, b, newId) {
  const keep = nodes.filter((n) => n !== a && n !== b).concat(newId);
  const newSizes = {};
  for (const n of keep) {
    if (n !== newId) newSizes[n] = sizes[n];
  }
  newSizes[newId] = sizes[a] + sizes[b];
  const weight = new Map();
  for (const { u, v, w } of edges) {
    let u2 = u === a || u === b ? newId : u;
    let v2 = v === a || v === b ? newId : v;
    if (u2 === v2) continue;
    if (u2 > v2) [u2, v2] = [v2, u2];
    const key = `${u2}|${v2}`;
    weight.set(key, (weight.get(key) || 0) + w);
  }
  const newEdges = [...weight.entries()].map(([k, w]) => {
    const [u, v] = k.split("|");
    return { u, v, w };
  });
  return { nodes: keep, edges: newEdges, sizes: newSizes };
}

export function greedyPairMerge(nodes, edges, sizes, targetK, capacity = null) {
  const members = Object.fromEntries(nodes.map((n) => [n, new Set([n])]));
  let curNodes = [...nodes];
  let curEdges = edges.map((e) => ({ ...e }));
  let curSizes = { ...sizes };
  let nextId = 0;
  const mergeLog = [];

  while (curNodes.length > targetK) {
    const ranked = affinityEdgeWeight(curEdges);
    let picked = null;
    for (const [u, v, w] of ranked) {
      if (capacity != null && curSizes[u] + curSizes[v] > capacity + 1e-12) continue;
      picked = [u, v, w];
      break;
    }
    if (!picked) break;
    const [u, v, w] = picked;
    const newId = `C${nextId++}`;
    members[newId] = new Set([...members[u], ...members[v]]);
    delete members[u];
    delete members[v];
    mergeLog.push({ u, v, w, into: newId });
    const c = contractPair(curNodes, curEdges, curSizes, u, v, newId);
    curNodes = c.nodes;
    curEdges = c.edges;
    curSizes = c.sizes;
  }

  const assignment = {};
  for (const [cid, origs] of Object.entries(members)) {
    for (const n of origs) assignment[n] = cid;
  }
  return { assignment, mergeLog };
}

export function labelPropagation(nodes, edges, maxIters = 50) {
  const adj = adjacency(edges);
  const labels = Object.fromEntries(nodes.map((n) => [n, n]));
  const seq = [...nodes].sort();
  let iters = 0;
  for (let it = 1; it <= maxIters; it++) {
    iters = it;
    let changed = 0;
    for (const v of seq) {
      const votes = {};
      for (const [nbr, w] of Object.entries(adj[v] || {})) {
        votes[labels[nbr]] = (votes[labels[nbr]] || 0) + w;
      }
      const keys = Object.keys(votes);
      if (!keys.length) continue;
      const bestW = Math.max(...Object.values(votes));
      const candidates = keys.filter((k) => Math.abs(votes[k] - bestW) < 1e-12).sort();
      const neu = candidates[0];
      if (neu !== labels[v]) {
        labels[v] = neu;
        changed += 1;
      }
    }
    if (changed === 0) break;
  }
  return { labels: { ...labels }, iters };
}

function dValues(side, adj) {
  const d = {};
  for (const [v, s] of Object.entries(side)) {
    let ext = 0;
    let inn = 0;
    for (const [nbr, w] of Object.entries(adj[v] || {})) {
      if (side[nbr] === s) inn += w;
      else ext += w;
    }
    d[v] = ext - inn;
  }
  return d;
}

export function kernighanLin(nodes, edges, initial, maxPasses = 10) {
  let sides = Object.fromEntries(nodes.map((n) => [n, String(initial[n])]));
  const adj = adjacency(edges);
  const history = [];

  for (let pass = 0; pass < maxPasses; pass++) {
    const locked = new Set();
    const work = { ...sides };
    let d = dValues(work, adj);
    const sequence = [];
    let cum = 0;
    let bestCum = 0;
    let bestK = 0;

    while (true) {
      const aFree = nodes.filter((n) => work[n] === "0" && !locked.has(n));
      const bFree = nodes.filter((n) => work[n] === "1" && !locked.has(n));
      if (!aFree.length || !bFree.length) break;
      let best = null;
      for (const a of aFree) {
        for (const b of bFree) {
          const cab = (adj[a] && adj[a][b]) || 0;
          const g = d[a] + d[b] - 2 * cab;
          if (!best || g > best.g || (g === best.g && (a < best.a || (a === best.a && b < best.b)))) {
            best = { a, b, g };
          }
        }
      }
      const { a, b, g } = best;
      cum += g;
      sequence.push({ a, b, g });
      if (cum > bestCum + 1e-12) {
        bestCum = cum;
        bestK = sequence.length;
      }
      const tmp = work[a];
      work[a] = work[b];
      work[b] = tmp;
      locked.add(a);
      locked.add(b);
      d = dValues(work, adj);
    }

    if (bestK <= 0 || bestCum <= 1e-12) {
      history.push({
        pass,
        bestK,
        bestCum,
        cutBefore: cutsize(sides, edges),
        cutAfter: cutsize(sides, edges),
        improved: false,
        swaps: [],
      });
      break;
    }

    const applied = { ...sides };
    for (let i = 0; i < bestK; i++) {
      const { a, b } = sequence[i];
      const tmp = applied[a];
      applied[a] = applied[b];
      applied[b] = tmp;
    }
    const cutBefore = cutsize(sides, edges);
    const cutAfter = cutsize(applied, edges);
    history.push({
      pass,
      bestK,
      bestCum,
      cutBefore,
      cutAfter,
      improved: cutAfter + 1e-12 < cutBefore,
      swaps: sequence.slice(0, bestK),
    });
    sides = applied;
    if (!history[history.length - 1].improved) break;
  }
  return { assignment: sides, history };
}

export function fiducciaMattheyses(nodes, edges, initial, maxPasses = 10, balanceTol = 0.35) {
  let sides = Object.fromEntries(nodes.map((n) => [n, String(initial[n])]));
  const adj = adjacency(edges);
  const n = nodes.length;
  const minSide = Math.max(1, Math.ceil(n * balanceTol));
  const history = [];

  for (let pass = 0; pass < maxPasses; pass++) {
    const locked = new Set();
    const work = { ...sides };
    let d = dValues(work, adj);
    const sequence = [];
    let cum = 0;
    let bestCum = 0;
    let bestK = 0;

    while (true) {
      const free = nodes.filter((v) => !locked.has(v));
      if (!free.length) break;
      let best = null;
      for (const v of free) {
        const cur = work[v];
        const szCur = nodes.filter((u) => work[u] === cur).length;
        if (szCur - 1 < minSide) continue;
        if (n - (szCur - 1) < minSide) continue;
        const g = d[v];
        if (!best || g > best.g || (g === best.g && v < best.v)) best = { v, g };
      }
      if (!best) break;
      const { v, g } = best;
      cum += g;
      sequence.push({ v, g });
      if (cum > bestCum + 1e-12) {
        bestCum = cum;
        bestK = sequence.length;
      }
      work[v] = work[v] === "0" ? "1" : "0";
      locked.add(v);
      d = dValues(work, adj);
    }

    if (bestK <= 0 || bestCum <= 1e-12) {
      history.push({
        pass,
        bestK,
        bestCum,
        cutBefore: cutsize(sides, edges),
        cutAfter: cutsize(sides, edges),
        improved: false,
        moves: [],
      });
      break;
    }

    const applied = { ...sides };
    for (let i = 0; i < bestK; i++) {
      const { v } = sequence[i];
      applied[v] = applied[v] === "0" ? "1" : "0";
    }
    const cutBefore = cutsize(sides, edges);
    const cutAfter = cutsize(applied, edges);
    history.push({
      pass,
      bestK,
      bestCum,
      cutBefore,
      cutAfter,
      improved: cutAfter + 1e-12 < cutBefore,
      moves: sequence.slice(0, bestK),
    });
    sides = applied;
    if (!history[history.length - 1].improved) break;
  }
  return { assignment: sides, history };
}

export function partsString(asn) {
  const g = {};
  for (const [n, c] of Object.entries(asn)) (g[c] ||= []).push(n);
  return Object.values(g)
    .map((a) => a.sort().join(""))
    .sort()
    .join("|");
}

function pairKey(u, v) {
  return u < v ? `${u}|${v}` : `${v}|${u}`;
}

function laplacian(nodes, edges) {
  const idx = Object.fromEntries(nodes.map((n, i) => [n, i]));
  const n = nodes.length;
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  for (const { u, v, w } of edges) {
    const i = idx[u];
    const j = idx[v];
    L[i][j] -= w;
    L[j][i] -= w;
    L[i][i] += w;
    L[j][j] += w;
  }
  return L;
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function norm(a) {
  return Math.sqrt(dot(a, a));
}

/** Fiedler bisection via shifted inverse iteration (mirrors advanced.py). */
export function spectralBisection(nodes, edges, sizes) {
  const n = nodes.length;
  if (n < 2) return { assignment: { [nodes[0]]: "0" }, order: [[nodes[0], 0]] };
  const L = laplacian(nodes, edges);
  const ones = Array(n).fill(1 / Math.sqrt(n));
  let x = Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 1 : -1));
  const proj = dot(x, ones);
  x = x.map((xi, i) => xi - proj * ones[i]);
  let xn = norm(x) || 1;
  x = x.map((xi) => xi / xn);

  const eps = 1e-3;
  const M = L.map((row) => row.slice());
  for (let i = 0; i < n; i++) M[i][i] += eps;

  for (let iter = 0; iter < 80; iter++) {
    let y = x.slice();
    for (let sweep = 0; sweep < 40; sweep++) {
      const yNew = y.slice();
      for (let i = 0; i < n; i++) {
        let s = x[i];
        for (let j = 0; j < n; j++) {
          if (j !== i) s -= M[i][j] * y[j];
        }
        yNew[i] = s / M[i][i];
      }
      y = yNew;
    }
    const yp = dot(y, ones);
    y = y.map((yi, i) => yi - yp * ones[i]);
    const yn = norm(y) || 1;
    x = y.map((yi) => yi / yn);
  }

  const order = nodes
    .map((name, i) => [name, x[i]])
    .sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1));
  const sz = sizes || Object.fromEntries(nodes.map((n) => [n, 1]));
  const total = nodes.reduce((s, n) => s + sz[n], 0);
  let bestAsn = null;
  let bestCut = Infinity;
  for (let k = 1; k < n; k++) {
    const left = new Set(order.slice(0, k).map(([name]) => name));
    const asn = Object.fromEntries(nodes.map((n) => [n, left.has(n) ? "0" : "1"]));
    const frac = [...left].reduce((s, n) => s + sz[n], 0) / total;
    if (frac < 0.2 || frac > 0.8) continue;
    const c = cutsize(asn, edges);
    if (c < bestCut - 1e-12) {
      bestCut = c;
      bestAsn = asn;
    }
  }
  if (!bestAsn) {
    const k = Math.floor(n / 2);
    const left = new Set(order.slice(0, k).map(([name]) => name));
    bestAsn = Object.fromEntries(nodes.map((n) => [n, left.has(n) ? "0" : "1"]));
  }
  return { assignment: bestAsn, order };
}

/** Coarsen with greedy, then FM-refine the projected bipartition. */
export function multilevelCluster(nodes, edges, sizes, coarseK = 2) {
  const { assignment: coarse } = greedyPairMerge(nodes, edges, sizes, coarseK);
  const labs = [...new Set(Object.values(coarse))].sort();
  if (labs.length !== 2) return coarse;
  const bip = Object.fromEntries(nodes.map((n) => [n, coarse[n] === labs[0] ? "0" : "1"]));
  const { assignment: refined } = fiducciaMattheyses(nodes, edges, bip);
  return Object.fromEntries(nodes.map((n) => [n, `P${refined[n]}`]));
}

export const TINY_HYPERGRAPH = {
  nodes: ["A", "B", "C", "D", "E"],
  hyperedges: [
    { pins: ["A", "B", "C"], w: 3, id: "n1" },
    { pins: ["D", "E"], w: 2, id: "n2" },
    { pins: ["C", "D"], w: 1, id: "n3" },
    { pins: ["A", "B"], w: 1, id: "n4" },
  ],
  sizes: { A: 1, B: 1, C: 1, D: 1, E: 1 },
};

export function hyperedgeCut(assignment, hedges) {
  let total = 0;
  for (const h of hedges) {
    const labs = new Set(h.pins.map((p) => assignment[p]));
    if (labs.size > 1) total += h.w;
  }
  return total;
}

/** Clique-expand hyperedges to pairwise edges for drawGraph. */
export function hyperedgesToPairEdges(hedges) {
  const weight = new Map();
  for (const h of hedges) {
    const pins = h.pins;
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const key = pairKey(pins[i], pins[j]);
        weight.set(key, (weight.get(key) || 0) + h.w);
      }
    }
  }
  return [...weight.entries()].map(([k, w]) => {
    const [u, v] = k.split("|");
    return { u, v, w };
  });
}

export function hypergraphGreedyCluster(nodes, hedges, sizes, targetK) {
  const members = Object.fromEntries(nodes.map((n) => [n, new Set([n])]));
  const cur = new Set(nodes);
  let workHedges = hedges.map((h) => ({ ...h, pins: [...h.pins] }));
  let nextId = 0;

  function pairAffinity(a, b) {
    return workHedges
      .filter((h) => h.pins.includes(a) && h.pins.includes(b))
      .reduce((s, h) => s + h.w, 0);
  }

  while (cur.size > targetK) {
    let best = null;
    const sorted = [...cur].sort();
    for (const a of sorted) {
      for (const b of sorted) {
        if (b <= a) continue;
        const aff = pairAffinity(a, b);
        if (aff <= 0) continue;
        if (
          !best ||
          aff > best.aff ||
          (aff === best.aff && (a > best.a || (a === best.a && b > best.b)))
        ) {
          best = { aff, a, b };
        }
      }
    }
    if (!best) break;
    const { a, b } = best;
    const newId = `H${nextId++}`;
    members[newId] = new Set([...members[a], ...members[b]]);
    delete members[a];
    delete members[b];
    cur.delete(a);
    cur.delete(b);
    cur.add(newId);
    for (const h of workHedges) {
      const pins2 = [];
      const seen = new Set();
      for (const p of h.pins) {
        const q = p === a || p === b ? newId : p;
        if (!seen.has(q)) {
          pins2.push(q);
          seen.add(q);
        }
      }
      h.pins = pins2;
    }
    workHedges = workHedges.filter((h) => h.pins.length >= 2);
  }

  const assignment = {};
  for (const [cid, origs] of Object.entries(members)) {
    for (const n of origs) assignment[n] = cid;
  }
  return assignment;
}

/** Congestion on C–D and C–E; keys sorted "u|v". */
export const EDGE_CONGESTION = {
  "C|D": 5,
  "C|E": 4,
};

export function congestionAwarePartition(nodes, edges, initial, congestionMap, lam) {
  const boosted = edges.map(({ u, v, w }) => {
    const cong = congestionMap[pairKey(u, v)] || 0;
    return { u, v, w: w + lam * cong };
  });
  const { assignment } = fiducciaMattheyses(nodes, boosted, initial);
  const plain = cutsize(assignment, edges);
  let pen = 0;
  for (const { u, v } of edges) {
    if (assignment[u] !== assignment[v]) pen += congestionMap[pairKey(u, v)] || 0;
  }
  return { assignment, plain, pen, objective: plain + lam * pen };
}

export const EDGE_CRITICALITY = {
  "A|B": 5,
  "B|C": 4,
  "A|C": 1,
  "C|D": 3,
  "D|E": 1,
  "C|E": 1,
};

export function timingAwarePartition(nodes, edges, initial, critMap) {
  const weighted = edges.map(({ u, v, w }) => {
    const c = critMap[pairKey(u, v)];
    return { u, v, w: w * (c != null ? c : 1) };
  });
  const { assignment } = fiducciaMattheyses(nodes, weighted, initial);
  return {
    assignment,
    plain: cutsize(assignment, edges),
    weightedCut: cutsize(assignment, weighted),
  };
}

/** Simple force-ish fixed layout for the 5-node starter. */
export function starterLayout() {
  return {
    A: { x: 90, y: 80 },
    B: { x: 220, y: 60 },
    C: { x: 160, y: 160 },
    D: { x: 280, y: 200 },
    E: { x: 120, y: 240 },
  };
}

export function clusterColor(id, palette) {
  if (id === "0" || String(id).endsWith("0")) return palette[0];
  if (id === "1" || String(id).endsWith("1")) return palette[1];
  let h = 0;
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[h % palette.length];
}

export const PALETTE = [
  "#1d4ed8",
  "#0f6b5c",
  "#b45309",
  "#9f1239",
  "#6d28d9",
  "#c2410c",
  "#0369a1",
  "#a21caf",
];
