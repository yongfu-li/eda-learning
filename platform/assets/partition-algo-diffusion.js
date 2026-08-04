/**
 * Diffusion / potential-cut bipartition (deterministic, educational).
 * Self-contained — no external imports.
 */

function buildAdjacency(edges) {
  const adj = {};
  for (const { u, v, w } of edges) {
    const weight = w ?? 1;
    if (!adj[u]) adj[u] = {};
    if (!adj[v]) adj[v] = {};
    adj[u][v] = (adj[u][v] || 0) + weight;
    adj[v][u] = (adj[v][u] || 0) + weight;
  }
  return adj;
}

function heaviestEdge(edges) {
  if (!edges.length) return null;
  const sorted = [...edges].sort(
    (a, b) =>
      (b.w ?? 1) - (a.w ?? 1) ||
      (a.u < b.u ? -1 : a.u > b.u ? 1 : 0) ||
      (a.v < b.v ? -1 : a.v > b.v ? 1 : 0)
  );
  return sorted[0];
}

function heaviestNeighbor(node, adj) {
  let best = null;
  let bestW = -Infinity;
  for (const [nbr, w] of Object.entries(adj[node] || {})) {
    if (w > bestW || (w === bestW && (best == null || nbr < best))) {
      bestW = w;
      best = nbr;
    }
  }
  return best;
}

function farthestNode(from, nodes, adj) {
  const dist = { [from]: 0 };
  const queue = [from];
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    for (const v of Object.keys(adj[u] || {})) {
      if (dist[v] == null) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  let best = null;
  let bestD = -Infinity;
  for (const n of nodes) {
    if (n === from) continue;
    const d = dist[n] ?? Infinity;
    if (d > bestD || (d === bestD && (best == null || n < best))) {
      bestD = d;
      best = n;
    }
  }
  return best;
}

function pickAnchors(nodes, edges, adj, opts) {
  const seedNode = opts.seedNode;
  if (seedNode && nodes.includes(seedNode)) {
    const seedHigh = seedNode;
    const seedLow =
      heaviestNeighbor(seedHigh, adj) ||
      farthestNode(seedHigh, nodes, adj) ||
      nodes.find((n) => n !== seedHigh);
    return { seedHigh, seedLow };
  }
  const heaviest = heaviestEdge(edges);
  if (heaviest) {
    return { seedHigh: heaviest.u, seedLow: heaviest.v };
  }
  const sorted = [...nodes].sort();
  return { seedHigh: sorted[0], seedLow: sorted[1] ?? sorted[0] };
}

function runDiffusionIterations(nodes, adj, seedHigh, seedLow, steps) {
  const potential = Object.fromEntries(nodes.map((n) => [n, 0]));
  potential[seedHigh] = 1;
  potential[seedLow] = 0;

  for (let step = 0; step < steps; step++) {
    const next = { ...potential };
    for (const n of nodes) {
      if (n === seedHigh || n === seedLow) continue;
      const nbrs = adj[n] || {};
      let sum = 0;
      let deg = 0;
      for (const [nbr, w] of Object.entries(nbrs)) {
        sum += w * potential[nbr];
        deg += w;
      }
      next[n] = deg > 0 ? sum / deg : 0;
    }
    next[seedHigh] = 1;
    next[seedLow] = 0;
    Object.assign(potential, next);
  }
  return potential;
}

function assignBySizeBudget(sortedNodes, sizes) {
  const sz = sizes || Object.fromEntries(sortedNodes.map((n) => [n, 1]));
  const total = sortedNodes.reduce((s, n) => s + (sz[n] ?? 1), 0);
  const half = total / 2;
  let cum = 0;
  const left = new Set();
  for (const n of sortedNodes) {
    const s = sz[n] ?? 1;
    if (cum + s <= half) {
      left.add(n);
      cum += s;
    }
  }
  if (left.size === 0) left.add(sortedNodes[0]);
  if (left.size === sortedNodes.length) {
    left.delete(sortedNodes[sortedNodes.length - 1]);
  }
  return Object.fromEntries(sortedNodes.map((n) => [n, left.has(n) ? "0" : "1"]));
}

/**
 * Diffusion bipartition: Jacobi potential flow from anchor seeds, then size-budget split.
 *
 * @param {string[]} nodes
 * @param {{ u: string, v: string, w?: number }[]} edges
 * @param {Record<string, number>|null} sizes
 * @param {{ steps?: number, seedNode?: string }} opts
 * @returns {{ assignment: Record<string, "0"|"1">, detail: string, potential: Record<string, number> }}
 */
export function diffusionBipartition(nodes, edges, sizes = null, opts = {}) {
  if (nodes.length === 0) {
    return { assignment: {}, detail: "diffusion steps=0 anchors=|", potential: {} };
  }
  if (nodes.length === 1) {
    const n = nodes[0];
    return {
      assignment: { [n]: "0" },
      detail: `diffusion steps=0 anchors=${n}|${n}`,
      potential: { [n]: 0 },
    };
  }

  const adj = buildAdjacency(edges);
  const { seedHigh, seedLow } = pickAnchors(nodes, edges, adj, opts);
  const steps = opts.steps ?? Math.max(8, Math.ceil(2 * Math.sqrt(nodes.length)));
  const potential = runDiffusionIterations(nodes, adj, seedHigh, seedLow, steps);

  const order = [...nodes].sort(
    (a, b) => potential[a] - potential[b] || (a < b ? -1 : a > b ? 1 : 0)
  );
  const assignment = assignBySizeBudget(order, sizes);
  const detail = `jacobi_diffusion steps=${steps} anchors=${seedHigh}|${seedLow}`;

  return { assignment, detail, potential };
}

/**
 * Graph wrapper: `{ nodes, edges, sizes? }` → diffusion bipartition result.
 */
export function runDiffusion(graph, opts = {}) {
  const { nodes, edges, sizes } = graph;
  return diffusionBipartition(nodes, edges, sizes ?? null, opts);
}
