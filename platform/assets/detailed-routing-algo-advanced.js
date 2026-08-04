/**
 * Advanced detailed routing engines for the DR benchmark.
 */
import {
  BLOCKAGES,
  GRID_NX,
  GRID_NY,
  NETS,
  TRACK_CAPACITY,
  astarRoute,
  gridKey,
  lRouteLayers,
  leeMaze,
  neighbors4,
  pathTrackUsage,
  ripupDetailed,
  sequentialDetailed,
  trackFromStep,
  trackOverflow,
  usageFromDetailedRoutes,
  wireLength,
} from "./detailed-routing-core.js";

export { wireLength };

function cloneRoutes(routes) {
  return (routes || []).map((r) => ({
    netIndex: r.netIndex,
    net: r.net,
    segments: (r.segments || []).map((s) => ({ ...s })),
  }));
}

function blockageSet() {
  const blocked = new Set();
  for (const bkg of BLOCKAGES) {
    for (let x = bkg.x; x < bkg.x + bkg.w; x++) {
      for (let y = bkg.y; y < bkg.y + bkg.h; y++) blocked.add(`${x},${y}`);
    }
  }
  return blocked;
}

function pathToSegs(path) {
  if (!path?.length) return [];
  return path.map((p, k) => ({
    x: p.x,
    y: p.y,
    layer: k === 0 ? "M1" : path[k].x === path[k - 1].x ? "M2" : "M1",
  }));
}

function addUsage(usage, segs) {
  for (const [ek, c] of Object.entries(pathTrackUsage(segs))) {
    usage[ek] = (usage[ek] || 0) + c;
  }
}

function subUsage(usage, segs) {
  for (const [ek, c] of Object.entries(pathTrackUsage(segs))) {
    usage[ek] = Math.max(0, (usage[ek] || 0) - c);
  }
}

function overflowDelta(segs, usage, cap) {
  let delta = 0;
  const seen = new Set();
  const path = segs.map((s) => ({ x: s.x, y: s.y }));
  for (let k = 0; k < path.length - 1; k++) {
    const ek = trackFromStep(path[k], path[k + 1]);
    if (seen.has(ek)) continue;
    seen.add(ek);
    const before = Math.max(0, (usage[ek] || 0) - cap);
    const after = Math.max(0, (usage[ek] || 0) + 1 - cap);
    delta += after - before;
  }
  return delta;
}

function routeTwoPin(a, b, mode, usage, cap) {
  if (mode === "lee") {
    const path = leeMaze(a, b, blockageSet()) || [a, b];
    return pathToSegs(path);
  }
  if (mode === "l_hv") return lRouteLayers(a, b, "HV");
  if (mode === "l_vh") return lRouteLayers(a, b, "VH");
  const path = astarRoute(a, b, usage, cap);
  if (!path) return lRouteLayers(a, b, "HV");
  return pathToSegs(path);
}

function multipinStar(pins, prefer = "HV") {
  const xs = pins.map((p) => p.x);
  const ys = pins.map((p) => p.y);
  const center = {
    x: Math.max(
      0,
      Math.min(GRID_NX - 1, Math.floor((Math.min(...xs) + Math.max(...xs)) / 2))
    ),
    y: Math.max(
      0,
      Math.min(GRID_NY - 1, Math.floor((Math.min(...ys) + Math.max(...ys)) / 2))
    ),
  };
  if ([...blockageSet()].some((k) => k === gridKey(center))) {
    const nb = neighbors4(center)[0];
    if (nb) {
      center.x = nb.x;
      center.y = nb.y;
    }
  }
  let segs = [];
  for (const pin of pins) segs = segs.concat(lRouteLayers(center, pin, prefer));
  return segs;
}

function multipinAstar(pins, usage, cap) {
  const xs = pins.map((p) => p.x);
  const ys = pins.map((p) => p.y);
  const center = {
    x: Math.max(
      0,
      Math.min(GRID_NX - 1, Math.floor((Math.min(...xs) + Math.max(...xs)) / 2))
    ),
    y: Math.max(
      0,
      Math.min(GRID_NY - 1, Math.floor((Math.min(...ys) + Math.max(...ys)) / 2))
    ),
  };
  let segs = [];
  for (const pin of pins) {
    const path = astarRoute(center, pin, usage, cap);
    segs = segs.concat(path ? pathToSegs(path) : lRouteLayers(center, pin, "HV"));
  }
  return segs;
}

function netHpwl(net, terminals) {
  const pins = net.map((id) => terminals[id]).filter(Boolean);
  if (!pins.length) return 0;
  const xs = pins.map((p) => p.x);
  const ys = pins.map((p) => p.y);
  return Math.max(...xs) - Math.min(...xs) + (Math.max(...ys) - Math.min(...ys));
}

function routeOrdered(nets, terminals, cap, order, mode = "astar") {
  const usage = {};
  const routes = new Array(nets.length);
  for (const { netIndex, net } of order) {
    const pins = net.map((id) => terminals[id]);
    let segs;
    if (pins.length < 2) segs = [];
    else if (pins.length === 2) segs = routeTwoPin(pins[0], pins[1], mode, usage, cap);
    else segs = mode.startsWith("l_")
      ? multipinStar(pins, mode === "l_vh" ? "VH" : "HV")
      : multipinAstar(pins, usage, cap);
    routes[netIndex] = { netIndex, net, segments: segs };
    addUsage(usage, segs);
  }
  return routes;
}

export function longestFirstAstar(nets, terminals, cap = TRACK_CAPACITY) {
  const order = nets
    .map((net, netIndex) => ({
      netIndex,
      net,
      hpwl: netHpwl(net, terminals),
    }))
    .sort((a, b) => b.hpwl - a.hpwl);
  return routeOrdered(nets, terminals, cap, order, "astar");
}

export function shortestFirstAstar(nets, terminals, cap = TRACK_CAPACITY) {
  const order = nets
    .map((net, netIndex) => ({
      netIndex,
      net,
      hpwl: netHpwl(net, terminals),
    }))
    .sort((a, b) => a.hpwl - b.hpwl);
  return routeOrdered(nets, terminals, cap, order, "astar");
}

/** Adaptive L: pick HV vs VH by overflow delta. */
export function adaptiveLRoute(nets, terminals, cap = TRACK_CAPACITY) {
  const usage = {};
  const routes = [];
  for (let netIndex = 0; netIndex < nets.length; netIndex++) {
    const net = nets[netIndex];
    const pins = net.map((id) => terminals[id]);
    let segs;
    if (pins.length < 2) segs = [];
    else if (pins.length === 2) {
      const hv = lRouteLayers(pins[0], pins[1], "HV");
      const vh = lRouteLayers(pins[0], pins[1], "VH");
      segs =
        overflowDelta(hv, usage, cap) <= overflowDelta(vh, usage, cap) ? hv : vh;
    } else {
      const hv = multipinStar(pins, "HV");
      const vh = multipinStar(pins, "VH");
      segs =
        overflowDelta(hv, usage, cap) <= overflowDelta(vh, usage, cap) ? hv : vh;
    }
    routes.push({ netIndex, net, segments: segs });
    addUsage(usage, segs);
  }
  return routes;
}

/** A* seed then repeated rip-up / A* reroute. */
export function astarThenRipup(nets, terminals, cap = TRACK_CAPACITY, passes = 8) {
  let { routes, usage } = sequentialDetailed(nets, terminals, "astar", cap);
  routes = cloneRoutes(routes);
  usage = { ...usage };
  for (let i = 0; i < passes; i++) {
    const ov = trackOverflow(usage, cap);
    if (ov.total <= 0) break;
    routes = ripupDetailed(routes, usage, cap, terminals, nets);
    usage = usageFromDetailedRoutes(routes);
  }
  return routes;
}

export function lThenRipup(nets, terminals, cap = TRACK_CAPACITY, prefer = "HV") {
  const mode = prefer === "VH" ? "l_vh" : "l_hv";
  let { routes, usage } = sequentialDetailed(nets, terminals, mode, cap);
  routes = cloneRoutes(routes);
  for (let i = 0; i < 8; i++) {
    if (trackOverflow(usage, cap).total <= 0) break;
    routes = ripupDetailed(routes, usage, cap, terminals, nets);
    usage = usageFromDetailedRoutes(routes);
  }
  return routes;
}

export function adaptiveThenRipup(nets, terminals, cap = TRACK_CAPACITY) {
  let routes = adaptiveLRoute(nets, terminals, cap);
  let usage = usageFromDetailedRoutes(routes);
  for (let i = 0; i < 8; i++) {
    if (trackOverflow(usage, cap).total <= 0) break;
    routes = ripupDetailed(routes, usage, cap, terminals, nets);
    usage = usageFromDetailedRoutes(routes);
  }
  return routes;
}

/** Topology-aware rip-up: try L-HV / L-VH / Lee / A* for ripped nets. */
export function topoRipupReroute(routes, usage, cap, terminals, nets = NETS) {
  let current = cloneRoutes(routes);
  let u = { ...usage };
  let guard = 0;
  while (guard++ < 48) {
    if (trackOverflow(u, cap).total <= 0) break;
    let worst = -1;
    let worstOv = -1;
    for (const r of current) {
      if (!r.segments?.length) continue;
      let ov = 0;
      for (const [ek, c] of Object.entries(pathTrackUsage(r.segments))) {
        void c;
        ov += Math.max(0, (u[ek] || 0) - cap);
      }
      if (ov > worstOv) {
        worstOv = ov;
        worst = r.netIndex;
      }
    }
    if (worst < 0) break;
    const wr = current[worst];
    subUsage(u, wr.segments);
    const pins = wr.net.map((id) => terminals[id]);
    let best = wr.segments;
    let bestKey = [Infinity, Infinity];
    const cands = [];
    if (pins.length === 2) {
      cands.push(lRouteLayers(pins[0], pins[1], "HV"));
      cands.push(lRouteLayers(pins[0], pins[1], "VH"));
      cands.push(routeTwoPin(pins[0], pins[1], "lee", u, cap));
      cands.push(routeTwoPin(pins[0], pins[1], "astar", u, cap));
    } else if (pins.length > 2) {
      cands.push(multipinStar(pins, "HV"));
      cands.push(multipinStar(pins, "VH"));
      cands.push(multipinAstar(pins, u, cap));
    }
    for (const segs of cands) {
      const d = overflowDelta(segs, u, cap);
      const hops = Math.max(0, segs.length - 1);
      if (d < bestKey[0] || (d === bestKey[0] && hops < bestKey[1])) {
        bestKey = [d, hops];
        best = segs;
      }
    }
    wr.segments = best;
    addUsage(u, best);
  }
  return current;
}

export function astarThenTopoRipup(nets, terminals, cap = TRACK_CAPACITY) {
  const { routes } = sequentialDetailed(nets, terminals, "astar", cap);
  return topoRipupReroute(
    routes,
    usageFromDetailedRoutes(routes),
    cap,
    terminals,
    nets
  );
}

export function adaptiveThenTopoRipup(nets, terminals, cap = TRACK_CAPACITY) {
  const routes = adaptiveLRoute(nets, terminals, cap);
  return topoRipupReroute(
    routes,
    usageFromDetailedRoutes(routes),
    cap,
    terminals,
    nets
  );
}

function astarNegotiated(a, b, usage, history, cap) {
  if (a.x === b.x && a.y === b.y) return [a];
  const h = (g) => Math.abs(g.x - b.x) + Math.abs(g.y - b.y);
  const open = [{ f: h(a), g: 0, node: a, path: [a] }];
  const best = { [gridKey(a)]: 0 };
  while (open.length) {
    open.sort((x, y) => x.f - y.f);
    const { g, node, path } = open.shift();
    if (gridKey(node) === gridKey(b)) return path;
    if (g > (best[gridKey(node)] ?? Infinity)) continue;
    for (const nb of neighbors4(node)) {
      const ek = trackFromStep(node, nb);
      const u = usage[ek] || 0;
      const hist = history[ek] || 0;
      const present =
        u >= cap ? 1 + 10 * (u - cap + 1) : 1 + 0.4 * (u / Math.max(cap, 1));
      const ng = g + present * (1 + hist);
      const nk = gridKey(nb);
      if (ng < (best[nk] ?? Infinity)) {
        best[nk] = ng;
        open.push({ f: ng + h(nb), g: ng, node: nb, path: path.concat([nb]) });
      }
    }
  }
  return null;
}

function routeNetNegotiated(pins, usage, history, cap) {
  if (pins.length < 2) return [];
  if (pins.length === 2) {
    const path = astarNegotiated(pins[0], pins[1], usage, history, cap);
    return path ? pathToSegs(path) : lRouteLayers(pins[0], pins[1], "HV");
  }
  const xs = pins.map((p) => p.x);
  const ys = pins.map((p) => p.y);
  const center = {
    x: Math.floor((Math.min(...xs) + Math.max(...xs)) / 2),
    y: Math.floor((Math.min(...ys) + Math.max(...ys)) / 2),
  };
  let segs = [];
  for (const pin of pins) {
    const path = astarNegotiated(center, pin, usage, history, cap);
    segs = segs.concat(path ? pathToSegs(path) : lRouteLayers(center, pin, "HV"));
  }
  return segs;
}

/** PathFinder-lite negotiated congestion on the track graph. */
export function negotiatedRoute(nets, terminals, cap = TRACK_CAPACITY, opts = {}) {
  const iters = opts.iters ?? 6;
  const history = {};
  let best = null;
  let bestKey = [Infinity, Infinity];

  for (let it = 0; it < iters; it++) {
    const usage = {};
    const routes = [];
    for (let netIndex = 0; netIndex < nets.length; netIndex++) {
      const net = nets[netIndex];
      const pins = net.map((id) => terminals[id]);
      const segs = routeNetNegotiated(pins, usage, history, cap);
      routes.push({ netIndex, net, segments: segs });
      addUsage(usage, segs);
    }
    const ov = trackOverflow(usage, cap);
    const wl = wireLength(routes);
    if (ov.total < bestKey[0] || (ov.total === bestKey[0] && wl < bestKey[1])) {
      bestKey = [ov.total, wl];
      best = cloneRoutes(routes);
    }
    for (const [ek, u] of Object.entries(usage)) {
      history[ek] = (history[ek] || 0) * 0.9;
      if (u > cap) history[ek] += u - cap;
    }
    if (ov.total <= 0) break;
  }
  return best || sequentialDetailed(nets, terminals, "astar", cap).routes;
}

export function negotiatedThenTopoRipup(nets, terminals, cap = TRACK_CAPACITY) {
  const routes = negotiatedRoute(nets, terminals, cap);
  return topoRipupReroute(
    routes,
    usageFromDetailedRoutes(routes),
    cap,
    terminals,
    nets
  );
}

/**
 * Strong negotiated: multi-order + more iters + topo polish.
 */
export function strongNegotiatedRoute(nets, terminals, cap = TRACK_CAPACITY) {
  const orders = [
    nets.map((_, i) => i),
    nets.map((_, i) => i).reverse(),
    nets
      .map((net, netIndex) => ({ netIndex, hpwl: netHpwl(net, terminals) }))
      .sort((a, b) => b.hpwl - a.hpwl)
      .map((x) => x.netIndex),
  ];
  let best = null;
  let bestKey = [Infinity, Infinity];

  for (const order of orders) {
    const history = {};
    for (let it = 0; it < 8; it++) {
      const usage = {};
      const placed = new Array(nets.length);
      for (const netIndex of order) {
        const net = nets[netIndex];
        const pins = net.map((id) => terminals[id]);
        const segs = routeNetNegotiated(pins, usage, history, cap);
        placed[netIndex] = { netIndex, net, segments: segs };
        addUsage(usage, segs);
      }
      const routes = placed;
      const ov = trackOverflow(usage, cap);
      const wl = wireLength(routes);
      if (ov.total < bestKey[0] || (ov.total === bestKey[0] && wl < bestKey[1])) {
        bestKey = [ov.total, wl];
        best = cloneRoutes(routes);
      }
      for (const [ek, u] of Object.entries(usage)) {
        history[ek] = (history[ek] || 0) * 0.85;
        if (u > cap) history[ek] += (u - cap) * 1.2;
      }
      if (ov.total <= 0) break;
    }
  }
  if (!best) best = sequentialDetailed(nets, terminals, "astar", cap).routes;
  return topoRipupReroute(
    best,
    usageFromDetailedRoutes(best),
    cap,
    terminals,
    nets
  );
}

/** Predicted L-route pressure of a net on empty usage. */
function predictedPressure(net, terminals, cap) {
  const pins = net.map((id) => terminals[id]);
  if (pins.length < 2) return 0;
  const segs =
    pins.length === 2
      ? lRouteLayers(pins[0], pins[1], "HV")
      : multipinStar(pins, "HV");
  return overflowDelta(segs, {}, cap) + Math.max(0, segs.length - 1) * 0.01;
}

/**
 * Pressure-first A*: route nets with highest predicted corridor pressure first.
 */
export function pressureFirstAstar(nets, terminals, cap = TRACK_CAPACITY) {
  const order = nets
    .map((net, netIndex) => ({
      netIndex,
      net,
      p: predictedPressure(net, terminals, cap),
    }))
    .sort((a, b) => b.p - a.p);
  return routeOrdered(nets, terminals, cap, order, "astar");
}

/**
 * Hybrid: for each net try HV / VH / Lee / A* and keep min overflow delta.
 */
export function hybridPatternAstar(nets, terminals, cap = TRACK_CAPACITY) {
  const usage = {};
  const routes = [];
  for (let netIndex = 0; netIndex < nets.length; netIndex++) {
    const net = nets[netIndex];
    const pins = net.map((id) => terminals[id]);
    let best = [];
    let bestKey = [Infinity, Infinity];
    const cands = [];
    if (pins.length < 2) {
      routes.push({ netIndex, net, segments: [] });
      continue;
    }
    if (pins.length === 2) {
      cands.push(lRouteLayers(pins[0], pins[1], "HV"));
      cands.push(lRouteLayers(pins[0], pins[1], "VH"));
      cands.push(routeTwoPin(pins[0], pins[1], "lee", usage, cap));
      cands.push(routeTwoPin(pins[0], pins[1], "astar", usage, cap));
    } else {
      cands.push(multipinStar(pins, "HV"));
      cands.push(multipinStar(pins, "VH"));
      cands.push(multipinAstar(pins, usage, cap));
      cands.push(steinerMultipin(pins, usage, cap));
    }
    for (const segs of cands) {
      const d = overflowDelta(segs, usage, cap);
      const hops = Math.max(0, segs.length - 1);
      if (d < bestKey[0] || (d === bestKey[0] && hops < bestKey[1])) {
        bestKey = [d, hops];
        best = segs;
      }
    }
    routes.push({ netIndex, net, segments: best });
    addUsage(usage, best);
  }
  return routes;
}

/** Multipin star trying several candidate centers (bbox + pin + midpoints). */
function steinerMultipin(pins, usage, cap) {
  const xs = pins.map((p) => p.x);
  const ys = pins.map((p) => p.y);
  const centers = [
    {
      x: Math.floor((Math.min(...xs) + Math.max(...xs)) / 2),
      y: Math.floor((Math.min(...ys) + Math.max(...ys)) / 2),
    },
    ...pins,
  ];
  // Midpoints between first pin and others.
  for (let i = 1; i < pins.length; i++) {
    centers.push({
      x: Math.floor((pins[0].x + pins[i].x) / 2),
      y: Math.floor((pins[0].y + pins[i].y) / 2),
    });
  }
  let best = null;
  let bestKey = [Infinity, Infinity];
  for (const raw of centers) {
    const center = {
      x: Math.max(0, Math.min(GRID_NX - 1, raw.x)),
      y: Math.max(0, Math.min(GRID_NY - 1, raw.y)),
    };
    if ([...blockageSet()].includes(gridKey(center))) {
      const nb = neighbors4(center)[0];
      if (nb) {
        center.x = nb.x;
        center.y = nb.y;
      }
    }
    let segs = [];
    for (const pin of pins) {
      const path = astarRoute(center, pin, usage, cap);
      segs = segs.concat(
        path ? pathToSegs(path) : lRouteLayers(center, pin, "HV")
      );
    }
    const d = overflowDelta(segs, usage, cap);
    const hops = Math.max(0, segs.length - 1);
    if (d < bestKey[0] || (d === bestKey[0] && hops < bestKey[1])) {
      bestKey = [d, hops];
      best = segs;
    }
  }
  return best || multipinAstar(pins, usage, cap);
}

export function steinerAstar(nets, terminals, cap = TRACK_CAPACITY) {
  const usage = {};
  const routes = [];
  for (let netIndex = 0; netIndex < nets.length; netIndex++) {
    const net = nets[netIndex];
    const pins = net.map((id) => terminals[id]);
    let segs;
    if (pins.length < 2) segs = [];
    else if (pins.length === 2)
      segs = routeTwoPin(pins[0], pins[1], "astar", usage, cap);
    else segs = steinerMultipin(pins, usage, cap);
    routes.push({ netIndex, net, segments: segs });
    addUsage(usage, segs);
  }
  return routes;
}

/**
 * Bulk rip-up: remove every net that touches an overflowing track,
 * then re-route them longest-first with hybrid topologies.
 */
export function bulkRipupReroute(nets, terminals, cap = TRACK_CAPACITY) {
  let routes = hybridPatternAstar(nets, terminals, cap);
  let usage = usageFromDetailedRoutes(routes);
  for (let pass = 0; pass < 6; pass++) {
    const ov = trackOverflow(usage, cap);
    if (ov.total <= 0) break;
    const hot = new Set();
    for (const [ek, u] of Object.entries(usage)) {
      if (u > cap) hot.add(ek);
    }
    const toRip = [];
    for (const r of routes) {
      const local = pathTrackUsage(r.segments || []);
      if (Object.keys(local).some((ek) => hot.has(ek))) toRip.push(r.netIndex);
    }
    if (!toRip.length) break;
    toRip.sort((a, b) => {
      const ha = Math.max(0, (routes[a].segments || []).length - 1);
      const hb = Math.max(0, (routes[b].segments || []).length - 1);
      return hb - ha;
    });
    for (const ni of toRip) subUsage(usage, routes[ni].segments);
    for (const ni of toRip) {
      const net = routes[ni].net;
      const pins = net.map((id) => terminals[id]);
      let best = [];
      let bestKey = [Infinity, Infinity];
      const cands = [];
      if (pins.length === 2) {
        cands.push(lRouteLayers(pins[0], pins[1], "HV"));
        cands.push(lRouteLayers(pins[0], pins[1], "VH"));
        cands.push(routeTwoPin(pins[0], pins[1], "lee", usage, cap));
        cands.push(routeTwoPin(pins[0], pins[1], "astar", usage, cap));
      } else if (pins.length > 2) {
        cands.push(multipinStar(pins, "HV"));
        cands.push(multipinStar(pins, "VH"));
        cands.push(steinerMultipin(pins, usage, cap));
      }
      for (const segs of cands) {
        const d = overflowDelta(segs, usage, cap);
        const hops = Math.max(0, segs.length - 1);
        if (d < bestKey[0] || (d === bestKey[0] && hops < bestKey[1])) {
          bestKey = [d, hops];
          best = segs;
        }
      }
      routes[ni] = { ...routes[ni], segments: best };
      addUsage(usage, best);
    }
  }
  return routes;
}

/**
 * Cap-hardened negotiated: steeper present cost, pressure order, topo polish.
 */
export function capHardNegotiated(nets, terminals, cap = TRACK_CAPACITY) {
  const order = nets
    .map((net, netIndex) => ({
      netIndex,
      p: predictedPressure(net, terminals, cap),
    }))
    .sort((a, b) => b.p - a.p)
    .map((x) => x.netIndex);

  const history = {};
  let best = null;
  let bestKey = [Infinity, Infinity];
  const scale = cap <= 1 ? 24 : 14;

  for (let it = 0; it < 12; it++) {
    const usage = {};
    const placed = new Array(nets.length);
    for (const netIndex of order) {
      const net = nets[netIndex];
      const pins = net.map((id) => terminals[id]);
      // Local negotiated with steeper scale via history bias.
      let segs;
      if (pins.length < 2) segs = [];
      else if (pins.length === 2) {
        const path = astarNegotiatedScaled(
          pins[0],
          pins[1],
          usage,
          history,
          cap,
          scale
        );
        segs = path ? pathToSegs(path) : lRouteLayers(pins[0], pins[1], "HV");
      } else {
        segs = steinerMultipinNegotiated(pins, usage, history, cap, scale);
      }
      placed[netIndex] = { netIndex, net, segments: segs };
      addUsage(usage, segs);
    }
    const routes = placed;
    const ov = trackOverflow(usage, cap);
    const wl = wireLength(routes);
    if (ov.total < bestKey[0] || (ov.total === bestKey[0] && wl < bestKey[1])) {
      bestKey = [ov.total, wl];
      best = cloneRoutes(routes);
    }
    for (const [ek, u] of Object.entries(usage)) {
      history[ek] = (history[ek] || 0) * 0.8;
      if (u > cap) history[ek] += (u - cap) * 1.5;
    }
    if (ov.total <= 0) break;
  }
  if (!best) best = sequentialDetailed(nets, terminals, "astar", cap).routes;
  return topoRipupReroute(
    best,
    usageFromDetailedRoutes(best),
    cap,
    terminals,
    nets
  );
}

function astarNegotiatedScaled(a, b, usage, history, cap, presentScale) {
  if (a.x === b.x && a.y === b.y) return [a];
  const h = (g) => Math.abs(g.x - b.x) + Math.abs(g.y - b.y);
  const open = [{ f: h(a), g: 0, node: a, path: [a] }];
  const best = { [gridKey(a)]: 0 };
  while (open.length) {
    open.sort((x, y) => x.f - y.f);
    const { g, node, path } = open.shift();
    if (gridKey(node) === gridKey(b)) return path;
    if (g > (best[gridKey(node)] ?? Infinity)) continue;
    for (const nb of neighbors4(node)) {
      const ek = trackFromStep(node, nb);
      const u = usage[ek] || 0;
      const hist = history[ek] || 0;
      const present =
        u >= cap
          ? 1 + presentScale * (u - cap + 1)
          : 1 + 0.35 * (u / Math.max(cap, 1));
      const ng = g + present * (1 + hist);
      const nk = gridKey(nb);
      if (ng < (best[nk] ?? Infinity)) {
        best[nk] = ng;
        open.push({ f: ng + h(nb), g: ng, node: nb, path: path.concat([nb]) });
      }
    }
  }
  return null;
}

function steinerMultipinNegotiated(pins, usage, history, cap, scale) {
  const xs = pins.map((p) => p.x);
  const ys = pins.map((p) => p.y);
  const center = {
    x: Math.floor((Math.min(...xs) + Math.max(...xs)) / 2),
    y: Math.floor((Math.min(...ys) + Math.max(...ys)) / 2),
  };
  let segs = [];
  for (const pin of pins) {
    const path = astarNegotiatedScaled(center, pin, usage, history, cap, scale);
    segs = segs.concat(
      path ? pathToSegs(path) : lRouteLayers(center, pin, "HV")
    );
  }
  return segs;
}

export function hybridThenBulkRipup(nets, terminals, cap = TRACK_CAPACITY) {
  return bulkRipupReroute(nets, terminals, cap);
}

function scoreRoutes(routes, cap) {
  const ov = trackOverflow(usageFromDetailedRoutes(routes), cap);
  return [ov.total, ov.max, wireLength(routes)];
}

export function multistartDetailed(nets, terminals, cap = TRACK_CAPACITY) {
  const candidates = [
    sequentialDetailed(nets, terminals, "astar", cap).routes,
    sequentialDetailed(nets, terminals, "lee", cap).routes,
    longestFirstAstar(nets, terminals, cap),
    shortestFirstAstar(nets, terminals, cap),
    pressureFirstAstar(nets, terminals, cap),
    adaptiveLRoute(nets, terminals, cap),
    hybridPatternAstar(nets, terminals, cap),
    steinerAstar(nets, terminals, cap),
    negotiatedRoute(nets, terminals, cap, { iters: 4 }),
    negotiatedThenTopoRipup(nets, terminals, cap),
    bulkRipupReroute(nets, terminals, cap),
    capHardNegotiated(nets, terminals, cap),
  ];
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

export function portfolioDetailed(nets, terminals, cap = TRACK_CAPACITY) {
  const candidates = [
    { routes: sequentialDetailed(nets, terminals, "l_hv", cap).routes, tag: "l_hv" },
    { routes: sequentialDetailed(nets, terminals, "l_vh", cap).routes, tag: "l_vh" },
    { routes: sequentialDetailed(nets, terminals, "lee", cap).routes, tag: "lee" },
    { routes: sequentialDetailed(nets, terminals, "astar", cap).routes, tag: "astar" },
    { routes: adaptiveLRoute(nets, terminals, cap), tag: "adaptive_l" },
    { routes: longestFirstAstar(nets, terminals, cap), tag: "longest_first" },
    { routes: shortestFirstAstar(nets, terminals, cap), tag: "shortest_first" },
    { routes: pressureFirstAstar(nets, terminals, cap), tag: "pressure_first" },
    { routes: hybridPatternAstar(nets, terminals, cap), tag: "hybrid" },
    { routes: steinerAstar(nets, terminals, cap), tag: "steiner" },
    { routes: astarThenRipup(nets, terminals, cap), tag: "astar_ripup" },
    { routes: lThenRipup(nets, terminals, cap, "HV"), tag: "l_ripup" },
    { routes: adaptiveThenRipup(nets, terminals, cap), tag: "adapt_ripup" },
    { routes: astarThenTopoRipup(nets, terminals, cap), tag: "astar_topo" },
    { routes: adaptiveThenTopoRipup(nets, terminals, cap), tag: "adapt_topo" },
    { routes: bulkRipupReroute(nets, terminals, cap), tag: "bulk_ripup" },
    { routes: negotiatedRoute(nets, terminals, cap), tag: "negotiated" },
    { routes: negotiatedThenTopoRipup(nets, terminals, cap), tag: "neg_topo" },
    { routes: strongNegotiatedRoute(nets, terminals, cap), tag: "strong_neg" },
    { routes: capHardNegotiated(nets, terminals, cap), tag: "cap_hard" },
    { routes: multistartDetailed(nets, terminals, cap), tag: "multistart" },
  ];
  let best = candidates[0];
  let bestKey = [Infinity, Infinity];
  for (const c of candidates) {
    const [total, , wl] = scoreRoutes(c.routes, cap);
    if (total < bestKey[0] || (total === bestKey[0] && wl < bestKey[1])) {
      bestKey = [total, wl];
      best = c;
    }
  }
  return {
    routes: cloneRoutes(best.routes),
    detail: `portfolio:${best.tag}`,
  };
}
