/**
 * Advanced global routing engines for the GR benchmark.
 */
import {
  EDGE_CAPACITY,
  GCELL_NX,
  GCELL_NY,
  NETS,
  addRouteUsage,
  allEdges,
  edgeKey,
  edgeOverflow,
  gcellKey,
  hpwl,
  lRoute,
  mazeRoute,
  multipinStar,
  neighbors,
  pathEdges,
  ripupReroute,
  routeAllL,
  routeAllMaze,
  subtractRouteUsage,
  usageFromRoutes,
  zRoute,
} from "./global-routing-core.js";

/** Total edge hops across all routed paths. */
export function wireLength(routes) {
  let total = 0;
  for (const r of routes) {
    for (const path of r.paths) {
      total += pathEdges(path).length;
    }
  }
  return total;
}

/** 2-pin zRoute; multi-pin star with HV L-shapes. */
export function routeAllZ(nets, terminals) {
  return nets.map((net, netIndex) => {
    const pins = net.map((id) => terminals[id]);
    if (net.length === 2) {
      return { netIndex, net, paths: [zRoute(pins[0], pins[1])] };
    }
    const star = multipinStar(pins, "HV");
    return { netIndex, net, center: star.center, paths: star.paths };
  });
}

function cloneRoutes(routes) {
  return routes.map((r) => ({
    netIndex: r.netIndex,
    net: r.net,
    center: r.center ? { ...r.center } : undefined,
    paths: r.paths.map((p) => p.map((g) => ({ ...g }))),
  }));
}

function netOrderByHpwl(nets, positions, ascending) {
  return nets
    .map((net, netIndex) => ({ netIndex, net, hpwl: hpwl(net, positions) }))
    .sort((a, b) => (ascending ? a.hpwl - b.hpwl : b.hpwl - a.hpwl));
}

function routeTwoOrStar(pins, usage, cap) {
  if (pins.length === 2) {
    return [mazeRoute(pins[0], pins[1], usage, cap)];
  }
  const ci = Math.round(pins.reduce((s, p) => s + p.i, 0) / pins.length);
  const cj = Math.round(pins.reduce((s, p) => s + p.j, 0) / pins.length);
  const center = {
    i: Math.max(0, Math.min(GCELL_NX - 1, ci)),
    j: Math.max(0, Math.min(GCELL_NY - 1, cj)),
  };
  return pins.map((p) => mazeRoute(center, p, usage, cap));
}

/** Sequential maze routing in a custom net order. */
function routeMazeOrdered(nets, terminals, cap, order) {
  const usage = {};
  const routes = new Array(nets.length);
  for (const { netIndex, net } of order) {
    const pins = net.map((id) => terminals[id]);
    const paths = routeTwoOrStar(pins, usage, cap);
    routes[netIndex] = { netIndex, net, paths };
    addRouteUsage(usage, paths);
  }
  return routes;
}

/** Sort nets by HPWL descending, then sequential maze. */
export function longestFirstMaze(nets, terminals, cap = EDGE_CAPACITY, positions) {
  const order = netOrderByHpwl(nets, positions, false);
  return routeMazeOrdered(nets, terminals, cap, order);
}

/** Sort nets by HPWL ascending, then sequential maze. */
export function shortestFirstMaze(nets, terminals, cap = EDGE_CAPACITY, positions) {
  const order = netOrderByHpwl(nets, positions, true);
  return routeMazeOrdered(nets, terminals, cap, order);
}

/** Maze seed then rip-up / reroute on overflowing edges. */
export function mazeThenRipup(nets, terminals, cap = EDGE_CAPACITY) {
  const routes = routeAllMaze(nets, terminals, cap);
  const usage = usageFromRoutes(routes);
  return ripupReroute(routes, usage, cap, terminals, nets);
}

/** L-shaped seed then rip-up / reroute. */
export function lThenRipup(nets, terminals, cap = EDGE_CAPACITY, prefer = "HV") {
  const routes = routeAllL(nets, terminals, prefer);
  const usage = usageFromRoutes(routes);
  return ripupReroute(routes, usage, cap, terminals, nets);
}

function pathOverflowDelta(paths, usage, cap) {
  let delta = 0;
  const seen = new Set();
  for (const path of paths) {
    for (const ek of pathEdges(path)) {
      if (seen.has(ek)) continue;
      seen.add(ek);
      const before = Math.max(0, (usage[ek] || 0) - cap);
      const after = Math.max(0, (usage[ek] || 0) + 1 - cap);
      delta += after - before;
    }
  }
  return delta;
}

/**
 * Adaptive L: for each 2-pin net pick HV vs VH minimizing overflow delta
 * given current usage; multi-pin uses adaptive star legs.
 */
export function adaptiveLRoute(nets, terminals, cap = EDGE_CAPACITY) {
  const usage = {};
  const routes = [];
  for (let netIndex = 0; netIndex < nets.length; netIndex++) {
    const net = nets[netIndex];
    const pins = net.map((id) => terminals[id]);
    let paths;
    if (net.length === 2) {
      const hv = [lRoute(pins[0], pins[1], "HV")];
      const vh = [lRoute(pins[0], pins[1], "VH")];
      const dh = pathOverflowDelta(hv, usage, cap);
      const dv = pathOverflowDelta(vh, usage, cap);
      paths = dh <= dv ? hv : vh;
    } else {
      const starH = multipinStar(pins, "HV");
      const starV = multipinStar(pins, "VH");
      const dh = pathOverflowDelta(starH.paths, usage, cap);
      const dv = pathOverflowDelta(starV.paths, usage, cap);
      paths = dh <= dv ? starH.paths : starV.paths;
    }
    routes.push({ netIndex, net, paths });
    addRouteUsage(usage, paths);
  }
  return routes;
}

export function adaptiveLThenRipup(nets, terminals, cap = EDGE_CAPACITY) {
  const routes = adaptiveLRoute(nets, terminals, cap);
  const usage = usageFromRoutes(routes);
  return ripupReroute(routes, usage, cap, terminals, nets);
}

function routeUsesEdge(route, ek) {
  return route.paths.some((path) => pathEdges(path).includes(ek));
}

/** Candidate path sets for a net: L-HV, L-VH, Z/star, maze. */
function topologyCandidates(pins, usage, cap) {
  const cands = [];
  if (pins.length === 2) {
    cands.push([lRoute(pins[0], pins[1], "HV")]);
    cands.push([lRoute(pins[0], pins[1], "VH")]);
    cands.push([zRoute(pins[0], pins[1])]);
    cands.push([mazeRoute(pins[0], pins[1], usage, cap)]);
  } else {
    cands.push(multipinStar(pins, "HV").paths);
    cands.push(multipinStar(pins, "VH").paths);
    cands.push(routeTwoOrStar(pins, usage, cap));
  }
  return cands;
}

function pickBestTopology(pins, usage, cap) {
  let best = null;
  let bestKey = [Infinity, Infinity];
  for (const paths of topologyCandidates(pins, usage, cap)) {
    const delta = pathOverflowDelta(paths, usage, cap);
    let hops = 0;
    for (const p of paths) hops += pathEdges(p).length;
    if (delta < bestKey[0] || (delta === bestKey[0] && hops < bestKey[1])) {
      bestKey = [delta, hops];
      best = paths;
    }
  }
  return best;
}

/**
 * Topology-aware rip-up: on overflow, rip nets on the worst edge and
 * re-place each with the best of L-HV / L-VH / Z / maze.
 */
export function topoRipupReroute(routes, usage, cap, terminals, nets = NETS) {
  let current = cloneRoutes(routes);
  let u = { ...usage };
  let guard = 0;
  while (guard++ < 48) {
    const ov = edgeOverflow(u, cap);
    if (ov.total <= 0) break;
    let worstEk = null;
    let worstOv = 0;
    for (const ek of allEdges()) {
      const o = Math.max(0, (u[ek] || 0) - cap);
      if (o > worstOv) {
        worstOv = o;
        worstEk = ek;
      }
    }
    if (!worstEk) break;
    const toRip = current
      .filter((r) => routeUsesEdge(r, worstEk))
      .map((r) => r.netIndex);
    if (!toRip.length) break;
    // Rip longer nets first so short nets can reclaim corridors.
    toRip.sort((a, b) => {
      const ha = current[a].paths.reduce((s, p) => s + pathEdges(p).length, 0);
      const hb = current[b].paths.reduce((s, p) => s + pathEdges(p).length, 0);
      return hb - ha;
    });
    for (const ni of toRip) {
      const r = current[ni];
      subtractRouteUsage(u, r.paths);
      const pins = r.net.map((id) => terminals[id]);
      r.paths = pickBestTopology(pins, u, cap);
      addRouteUsage(u, r.paths);
    }
  }
  return current;
}

export function lThenTopoRipup(nets, terminals, cap = EDGE_CAPACITY, prefer = "HV") {
  const routes = routeAllL(nets, terminals, prefer);
  return topoRipupReroute(routes, usageFromRoutes(routes), cap, terminals, nets);
}

export function adaptiveThenTopoRipup(nets, terminals, cap = EDGE_CAPACITY) {
  const routes = adaptiveLRoute(nets, terminals, cap);
  return topoRipupReroute(routes, usageFromRoutes(routes), cap, terminals, nets);
}

export function mazeThenTopoRipup(nets, terminals, cap = EDGE_CAPACITY) {
  const routes = routeAllMaze(nets, terminals, cap);
  return topoRipupReroute(routes, usageFromRoutes(routes), cap, terminals, nets);
}

/** Dijkstra with history + present congestion (PathFinder-lite). */
function mazeRouteNegotiated(a, b, usage, history, cap, presentScale = 8) {
  if (a.i === b.i && a.j === b.j) return [{ ...a }];
  const start = gcellKey(a);
  const goal = gcellKey(b);
  const dist = { [start]: 0 };
  const prev = {};
  const open = [{ k: start, d: 0 }];
  while (open.length) {
    open.sort((x, y) => x.d - y.d);
    const { k, d } = open.shift();
    if (d > dist[k]) continue;
    if (k === goal) break;
    const [i, j] = k.split(",").map(Number);
    for (const nb of neighbors({ i, j })) {
      const nk = gcellKey(nb);
      const ek = edgeKey({ i, j }, nb);
      const u = usage[ek] || 0;
      const h = history[ek] || 0;
      const present =
        u >= cap
          ? 1 + presentScale * (u - cap + 1)
          : 1 + 0.5 * (u / Math.max(cap, 1));
      const nd = d + present * (1 + h);
      if (dist[nk] == null || nd < dist[nk]) {
        dist[nk] = nd;
        prev[nk] = k;
        open.push({ k: nk, d: nd });
      }
    }
  }
  if (dist[goal] == null) return lRoute(a, b, "HV");
  const keys = [];
  for (let cur = goal; cur; cur = prev[cur]) keys.push(cur);
  keys.reverse();
  return keys.map((k) => {
    const [i, j] = k.split(",").map(Number);
    return { i, j };
  });
}

function routeNetNegotiated(pins, usage, history, cap, presentScale) {
  if (pins.length === 2) {
    return [mazeRouteNegotiated(pins[0], pins[1], usage, history, cap, presentScale)];
  }
  const ci = Math.round(pins.reduce((s, p) => s + p.i, 0) / pins.length);
  const cj = Math.round(pins.reduce((s, p) => s + p.j, 0) / pins.length);
  const center = {
    i: Math.max(0, Math.min(GCELL_NX - 1, ci)),
    j: Math.max(0, Math.min(GCELL_NY - 1, cj)),
  };
  return pins.map((p) =>
    mazeRouteNegotiated(center, p, usage, history, cap, presentScale)
  );
}

/**
 * Negotiated-congestion (PathFinder-lite): iterate maze with edge history.
 */
export function negotiatedRoute(nets, terminals, cap = EDGE_CAPACITY, opts = {}) {
  const iters = opts.iters ?? 4;
  const presentScale = opts.presentScale ?? 8;
  const decay = opts.decay ?? 1;
  const history = {};
  for (const ek of allEdges()) history[ek] = 0;
  let best = null;
  let bestTotal = Infinity;

  for (let it = 0; it < iters; it++) {
    const usage = {};
    const routes = [];
    const order = opts.order
      ? opts.order.map((netIndex) => ({ netIndex, net: nets[netIndex] }))
      : nets.map((net, netIndex) => ({ netIndex, net }));
    const placed = new Array(nets.length);
    for (const { netIndex, net } of order) {
      const pins = net.map((id) => terminals[id]);
      const paths = routeNetNegotiated(pins, usage, history, cap, presentScale);
      placed[netIndex] = { netIndex, net, paths };
      addRouteUsage(usage, paths);
    }
    for (let i = 0; i < nets.length; i++) routes.push(placed[i]);
    const ov = edgeOverflow(usage, cap);
    if (ov.total < bestTotal) {
      bestTotal = ov.total;
      best = cloneRoutes(routes);
    }
    for (const ek of allEdges()) {
      history[ek] = (history[ek] || 0) * decay;
      const u = usage[ek] || 0;
      if (u > cap) history[ek] += u - cap;
    }
    if (ov.total <= 0) break;
  }
  return best || routeAllMaze(nets, terminals, cap);
}

/**
 * Stronger PathFinder: more iters, history decay, hot-net ordering,
 * then topology-aware rip-up polish.
 */
export function strongNegotiatedRoute(nets, terminals, cap = EDGE_CAPACITY, opts = {}) {
  const iters = opts.iters ?? 10;
  const history = {};
  for (const ek of allEdges()) history[ek] = 0;
  let best = null;
  let bestKey = [Infinity, Infinity];
  let lastRoutes = null;

  // Seed orderings: default, reverse, longest-first (by pin bbox hops).
  const orders = [
    nets.map((_, i) => i),
    nets.map((_, i) => i).reverse(),
  ];
  const byLen = nets
    .map((net, netIndex) => {
      const pins = net.map((id) => terminals[id]);
      const di = Math.max(...pins.map((p) => p.i)) - Math.min(...pins.map((p) => p.i));
      const dj = Math.max(...pins.map((p) => p.j)) - Math.min(...pins.map((p) => p.j));
      return { netIndex, span: di + dj };
    })
    .sort((a, b) => b.span - a.span)
    .map((x) => x.netIndex);
  orders.push(byLen);

  for (const order of orders) {
    for (const ek of allEdges()) history[ek] = 0;
    for (let it = 0; it < iters; it++) {
      const usage = {};
      const placed = new Array(nets.length);
      // After first pass, reorder by overflow contribution on current history.
      let passOrder = order;
      if (it > 0 && lastRoutes) {
        passOrder = [...order].sort((a, b) => {
          const score = (ni) => {
            let s = 0;
            for (const path of lastRoutes[ni].paths) {
              for (const ek of pathEdges(path)) s += history[ek] || 0;
            }
            return s;
          };
          return score(b) - score(a);
        });
      }
      for (const netIndex of passOrder) {
        const net = nets[netIndex];
        const pins = net.map((id) => terminals[id]);
        const paths = routeNetNegotiated(pins, usage, history, cap, 12);
        placed[netIndex] = { netIndex, net, paths };
        addRouteUsage(usage, paths);
      }
      const routes = placed;
      lastRoutes = routes;
      const [total, , wl] = scoreRoutes(routes, cap);
      if (total < bestKey[0] || (total === bestKey[0] && wl < bestKey[1])) {
        bestKey = [total, wl];
        best = cloneRoutes(routes);
      }
      for (const ek of allEdges()) {
        history[ek] = (history[ek] || 0) * 0.85;
        const u = usage[ek] || 0;
        if (u > cap) history[ek] += (u - cap) * 1.25;
      }
      if (total <= 0) break;
    }
  }

  if (!best) best = routeAllMaze(nets, terminals, cap);
  // Polish with topology rip-up.
  return topoRipupReroute(best, usageFromRoutes(best), cap, terminals, nets);
}

/** Negotiated seed + topology rip-up (lighter than strongNegotiated). */
export function negotiatedThenTopoRipup(nets, terminals, cap = EDGE_CAPACITY) {
  const routes = negotiatedRoute(nets, terminals, cap, { iters: 6, decay: 0.9 });
  return topoRipupReroute(routes, usageFromRoutes(routes), cap, terminals, nets);
}

function scoreRoutes(routes, cap) {
  const ov = edgeOverflow(usageFromRoutes(routes), cap);
  return [ov.total, ov.max, wireLength(routes)];
}

/**
 * Multistart: several maze orderings (+ adaptive / negotiated / strong);
 * keep min overflow then wirelen.
 */
export function multistartMaze(nets, terminals, cap = EDGE_CAPACITY, positions) {
  const candidates = [
    routeAllMaze(nets, terminals, cap),
    longestFirstMaze(nets, terminals, cap, positions),
    shortestFirstMaze(nets, terminals, cap, positions),
    adaptiveLRoute(nets, terminals, cap),
    negotiatedRoute(nets, terminals, cap, { iters: 3 }),
    negotiatedThenTopoRipup(nets, terminals, cap),
    strongNegotiatedRoute(nets, terminals, cap),
  ];
  const rev = [...nets]
    .map((net, netIndex) => ({ netIndex, net }))
    .reverse();
  candidates.push(routeMazeOrdered(nets, terminals, cap, rev));

  let best = candidates[0];
  let bestKey = [Infinity, Infinity];
  for (const routes of candidates) {
    const [total, , wl] = scoreRoutes(routes, cap);
    if (total < bestKey[0] || (total === bestKey[0] && wl < bestKey[1])) {
      bestKey = [total, wl];
      best = routes;
    }
  }
  return best;
}

/**
 * Composite portfolio — includes rip-up / adaptive / negotiated / topo / strong.
 */
export function portfolioRoute(nets, terminals, positions, cap = EDGE_CAPACITY) {
  const candidates = [
    { routes: routeAllL(nets, terminals, "HV"), tag: "l_hv" },
    { routes: routeAllL(nets, terminals, "VH"), tag: "l_vh" },
    { routes: routeAllZ(nets, terminals), tag: "z" },
    { routes: adaptiveLRoute(nets, terminals, cap), tag: "adaptive_l" },
    { routes: routeAllMaze(nets, terminals, cap), tag: "maze" },
    { routes: mazeThenRipup(nets, terminals, cap), tag: "maze_ripup" },
    { routes: lThenRipup(nets, terminals, cap, "HV"), tag: "l_ripup" },
    { routes: adaptiveLThenRipup(nets, terminals, cap), tag: "adapt_ripup" },
    { routes: lThenTopoRipup(nets, terminals, cap, "HV"), tag: "l_topo" },
    { routes: adaptiveThenTopoRipup(nets, terminals, cap), tag: "adapt_topo" },
    { routes: mazeThenTopoRipup(nets, terminals, cap), tag: "maze_topo" },
    {
      routes: longestFirstMaze(nets, terminals, cap, positions),
      tag: "longest_first",
    },
    {
      routes: shortestFirstMaze(nets, terminals, cap, positions),
      tag: "shortest_first",
    },
    { routes: negotiatedRoute(nets, terminals, cap), tag: "negotiated" },
    { routes: negotiatedThenTopoRipup(nets, terminals, cap), tag: "neg_topo" },
    { routes: strongNegotiatedRoute(nets, terminals, cap), tag: "strong_neg" },
    {
      routes: multistartMaze(nets, terminals, cap, positions),
      tag: "multistart",
    },
  ];
  let best = candidates[0];
  let bestKey = [Infinity, Infinity];
  for (const c of candidates) {
    const [total, , wl] = scoreRoutes(c.routes, cap);
    const key = [total, wl];
    if (
      key[0] < bestKey[0] ||
      (key[0] === bestKey[0] && key[1] < bestKey[1])
    ) {
      bestKey = key;
      best = c;
    }
  }
  return {
    routes: cloneRoutes(best.routes),
    detail: `portfolio:${best.tag}`,
  };
}

void NETS;
