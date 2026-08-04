/**
 * partition-algo-inertial.js — geometric / inertial median bipartition.
 * Self-contained ES module for learn_partitioning labs and benchmarks.
 */

function buildAdjacency(edges) {
  const adj = {};
  for (const { u, v } of edges) {
    if (!adj[u]) adj[u] = new Set();
    if (!adj[v]) adj[v] = new Set();
    adj[u].add(v);
    adj[v].add(u);
  }
  return adj;
}

function bfsDistances(adj, nodes, root) {
  const dist = Object.fromEntries(nodes.map((n) => [n, -1]));
  if (!nodes.includes(root)) return dist;
  const q = [root];
  dist[root] = 0;
  for (let i = 0; i < q.length; i++) {
    const u = q[i];
    for (const v of adj[u] || []) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        q.push(v);
      }
    }
  }
  return dist;
}

function placeUnreachable(dist, nodes) {
  const reachable = nodes.filter((n) => dist[n] >= 0);
  const maxD = reachable.length ? Math.max(...reachable.map((n) => dist[n])) : -1;
  const fallback = maxD + 1;
  for (const n of nodes) {
    if (dist[n] < 0) dist[n] = fallback;
  }
  return dist;
}

function farthestNode(nodes, dist) {
  let best = nodes[0];
  for (const n of nodes) {
    if (dist[n] > dist[best] || (dist[n] === dist[best] && n < best)) best = n;
  }
  return best;
}

function variance(values) {
  const n = values.length;
  if (n === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  return values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
}

function inventCoords(nodes, edges) {
  const sorted = [...nodes].sort();
  if (!sorted.length) return {};

  const adj = buildAdjacency(edges);
  const root = sorted[0];
  const xDist = placeUnreachable(bfsDistances(adj, sorted, root), sorted);
  const anchor = farthestNode(sorted, xDist);
  const yDist = placeUnreachable(bfsDistances(adj, sorted, anchor), sorted);

  const coords = {};
  for (const n of sorted) {
    coords[n] = { x: xDist[n], y: yDist[n] };
  }
  return coords;
}

function resolveCoords(nodes, edges, opts) {
  if (opts.layout && typeof opts.layout === "object") {
    const coords = {};
    for (const n of nodes) {
      const p = opts.layout[n];
      coords[n] = { x: p?.x ?? 0, y: p?.y ?? 0 };
    }
    return coords;
  }
  return inventCoords(nodes, edges);
}

function medianSizeSplit(sortedNodes, sizes) {
  const sz = sizes || {};
  const total = sortedNodes.reduce((s, n) => s + (sz[n] ?? 1), 0);
  const half = total / 2;
  const assignment = {};
  let acc = 0;
  for (const n of sortedNodes) {
    const w = sz[n] ?? 1;
    if (acc < half) {
      assignment[n] = "0";
      acc += w;
    } else {
      assignment[n] = "1";
    }
  }
  return assignment;
}

/**
 * Inertial median bipartition from node coords (supplied or invented).
 * @returns {{ assignment: Record<string,string>, detail: string, coords: Record<string,{x:number,y:number}> }}
 */
export function inertialBipartition(nodes, edges, sizes = null, opts = {}) {
  const sorted = [...nodes].sort();
  if (!sorted.length) {
    return { assignment: {}, detail: "inertial axis=x", coords: {} };
  }
  if (sorted.length === 1) {
    const coords = resolveCoords(sorted, edges, opts);
    return { assignment: { [sorted[0]]: "0" }, detail: "inertial axis=x", coords };
  }

  const coords = resolveCoords(sorted, edges, opts);
  const xs = sorted.map((n) => coords[n].x);
  const ys = sorted.map((n) => coords[n].y);
  const varX = variance(xs);
  const varY = variance(ys);
  const axis = varX >= varY ? "x" : "y";

  const ordered = [...sorted].sort(
    (a, b) => coords[a][axis] - coords[b][axis] || (a < b ? -1 : 1)
  );
  const assignment = medianSizeSplit(ordered, sizes);

  return {
    assignment,
    detail: `bfs_inertial axis=${axis}`,
    coords,
  };
}

/**
 * Graph wrapper: `{ nodes, edges, sizes? }` → `{ assignment, detail, coords }`.
 */
export function runInertial(graph, opts = {}) {
  const { nodes, edges, sizes } = graph;
  const layout = opts.layout ?? graph.layout ?? null;
  return inertialBipartition(nodes, edges, sizes ?? null, { ...opts, layout });
}
