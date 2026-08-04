/**
 * partition-algo-gainfill.js — constructive gain-fill bipartition (educational).
 * Self-contained: builds adjacency locally; no clustering-core FM import.
 */

/** @param {{ u: string, v: string, w: number }[]} edges */
function buildAdjacency(edges) {
  const adj = {};
  for (const { u, v, w } of edges) {
    if (!adj[u]) adj[u] = {};
    if (!adj[v]) adj[v] = {};
    adj[u][v] = (adj[u][v] || 0) + w;
    adj[v][u] = (adj[v][u] || 0) + w;
  }
  return adj;
}

function nodeSize(n, sizes) {
  return sizes?.[n] ?? 1;
}

/** FM-style external − internal gain if free node n joins side s (assigned neighbors only). */
function placementGain(n, side, adj, assignment) {
  let ext = 0;
  let inn = 0;
  for (const [nbr, w] of Object.entries(adj[n] || {})) {
    const p = assignment[nbr];
    if (p == null) continue;
    if (p === side) inn += w;
    else ext += w;
  }
  return ext - inn;
}

function sideSizes(assignment, sizes) {
  let s0 = 0;
  let s1 = 0;
  for (const [n, p] of Object.entries(assignment)) {
    if (p == null) continue;
    const sz = nodeSize(n, sizes);
    if (p === "0") s0 += sz;
    else s1 += sz;
  }
  return { s0, s1 };
}

function pickHeaviestEdge(edges) {
  const sorted = [...edges].sort(
    (a, b) => b.w - a.w || (a.u < b.u ? -1 : a.u > b.u ? 1 : 0) || (a.v < b.v ? -1 : 1)
  );
  return sorted[0] || null;
}

/**
 * Constructive gain-fill bipartition.
 * @param {string[]} nodes
 * @param {{ u: string, v: string, w: number }[]} edges
 * @param {Record<string, number> | null} [sizes]
 * @param {{ polishFm?: boolean }} [opts]
 * @returns {{ assignment: Record<string, "0"|"1">, detail: string }}
 */
export function gainFillBipartition(nodes, edges, sizes = null, opts = {}) {
  if (nodes.length < 2) {
    return {
      assignment: Object.fromEntries(nodes.map((n) => [n, "0"])),
      detail: "fewer than 2 nodes — all on side 0",
    };
  }

  const adj = buildAdjacency(edges);
  const totalSize = nodes.reduce((sum, n) => sum + nodeSize(n, sizes), 0);
  const maxNodeSize = Math.max(...nodes.map((n) => nodeSize(n, sizes)));
  const softCap = Math.ceil(totalSize / 2) + maxNodeSize;
  const targetHalf = totalSize / 2;

  /** @type {Record<string, "0"|"1"|null>} */
  const assignment = Object.fromEntries(nodes.map((n) => [n, null]));
  const steps = [];

  const seedEdge = pickHeaviestEdge(edges);
  if (!seedEdge) {
    const sorted = [...nodes].sort();
    assignment[sorted[0]] = "0";
    assignment[sorted[1]] = "1";
    steps.push(`seed no edges — ${sorted[0]}→0, ${sorted[1]}→1`);
  } else {
    const { u, v, w } = seedEdge;
    assignment[u] = "0";
    assignment[v] = "1";
    steps.push(`seed heaviest edge ${u}—${v} (w=${w}): ${u}→0, ${v}→1`);
  }

  while (true) {
    const free = nodes.filter((n) => assignment[n] == null).sort();
    if (!free.length) break;

    const { s0, s1 } = sideSizes(assignment, sizes);
    let best = null;

    for (const n of free) {
      const sz = nodeSize(n, sizes);
      const gain0 = placementGain(n, "0", adj, assignment);
      const gain1 = placementGain(n, "1", adj, assignment);
      const newS0If0 = s0 + sz;
      const newS1If1 = s1 + sz;
      const viol0 = newS0If0 > softCap;
      const viol1 = newS1If1 > softCap;

      /** @type {Array<{ side: "0"|"1", gain: number, newS0: number, newS1: number, viol: boolean }>} */
      const options = [
        { side: "0", gain: gain0, newS0: newS0If0, newS1: s1, viol: viol0 },
        { side: "1", gain: gain1, newS0: s0, newS1: newS1If1, viol: viol1 },
      ];

      let feasible = options.filter((o) => !o.viol);
      if (!feasible.length) {
        const imb = (o) => Math.abs(o.newS0 - o.newS1);
        feasible = [...options].sort((a, b) => imb(a) - imb(b) || (a.side === "0" ? -1 : 1));
        feasible = [feasible[0]];
      }

      for (const opt of feasible) {
        const cand = { n, ...opt, imbalance: Math.abs(opt.newS0 - opt.newS1) };
        if (!best) {
          best = cand;
          continue;
        }
        if (cand.gain > best.gain + 1e-12) {
          best = cand;
          continue;
        }
        if (Math.abs(cand.gain - best.gain) <= 1e-12) {
          if (cand.imbalance < best.imbalance - 1e-12) {
            best = cand;
            continue;
          }
          if (Math.abs(cand.imbalance - best.imbalance) <= 1e-12) {
            if (cand.n < best.n) {
              best = cand;
              continue;
            }
            if (cand.n === best.n && cand.side === "0" && best.side === "1") {
              best = cand;
            }
          }
        }
      }
    }

    if (!best) break;
    assignment[best.n] = best.side;
    const violNote = best.viol ? " (soft-cap override)" : "";
    steps.push(
      `fill ${best.n}→${best.side} gain=${best.gain} sizes ${best.newS0}/${best.newS1}${violNote}`
    );
  }

  /** @type {Record<string, "0"|"1">} */
  const out = Object.fromEntries(
    nodes.map((n) => [n, assignment[n] ?? "0"])
  );

  let detail = steps.join("; ");
  if (opts.polishFm) {
    detail += "; FM polish skipped (self-contained module)";
  }

  return { assignment: out, detail };
}

/**
 * Thin runner on a graph object.
 * @param {{ nodes: string[], edges: { u: string, v: string, w: number }[], sizes?: Record<string, number> }} graph
 * @param {{ polishFm?: boolean }} [opts]
 */
export function runGainFill(graph, opts = {}) {
  return gainFillBipartition(graph.nodes, graph.edges, graph.sizes ?? null, opts);
}
