/**
 * Advanced buffer-insertion solvers for the buffering benchmark.
 * Site-DP (candidate locations + library), slew-then-VG polish, composite portfolio.
 */
import {
  BUFFER_LIBRARY,
  DRIVER,
  EDGES,
  SINKS,
  SLEW_LIMIT,
  CANDIDATE_STEP,
  candidateSites,
  dominatePrune,
  edgeLength,
  elmoreDelay,
  estimateSlew,
  fanoutBufferTree,
  nodeMap,
  slewDrivenInsert,
  slewOk,
  vanGinnekenEdge,
  vanGinnekenNet,
  wireRc,
} from "./buffering-core.js";

function buffersFromVg(vg, driver, sinks, edges) {
  const buffers = [];
  const nodes = nodeMap(driver, sinks);
  for (const [eid, res] of Object.entries(vg.perEdge || {})) {
    if (!res?.best?.buf) continue;
    const e = edges.find((x) => x.id === eid);
    if (!e) continue;
    const a = nodes[e.a];
    const b = nodes[e.b];
    buffers.push({
      edge: eid,
      buf: res.best.buf,
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    });
  }
  return buffers;
}

function countSlewViolations(driver, sinks, edges, slewLimit) {
  const nodes = nodeMap(driver, sinks);
  let v = 0;
  for (const e of edges) {
    const cl = nodes[e.b]?.cload ?? 2;
    const rc = wireRc(edgeLength(e, nodes));
    const sl = estimateSlew(rc.R, rc.C + cl);
    if (!slewOk(sl, slewLimit)) v++;
  }
  return v;
}

function polarityFlips(buffers, library = BUFFER_LIBRARY) {
  const byId = Object.fromEntries(library.map((b) => [b.id, b]));
  let flips = 0;
  for (const b of buffers || []) {
    const cell = byId[b.buf];
    if (cell?.invert) flips++;
  }
  return flips;
}

/**
 * Evaluate placing `buf` at fraction t along an edge of length L into load cload.
 * Upstream segment sees cin; downstream sees cload.
 */
function delayWithSite(length, t, cload, buf) {
  const L1 = Math.max(1e-9, length * t);
  const L2 = Math.max(1e-9, length * (1 - t));
  const rc1 = wireRc(L1);
  const rc2 = wireRc(L2);
  const dDown = elmoreDelay(rc2.R, rc2.C, cload) + buf.delay;
  const dUp = elmoreDelay(rc1.R, rc1.C, buf.cin) + dDown;
  return { c: rc1.C + buf.cin, d: dUp, buf: buf.id, t, kind: "site" };
}

/**
 * Per-edge DP over candidate sites × library (non-inverting by default).
 * Falls back to classic mid-edge VG options.
 */
export function siteDpEdge(
  length,
  cload,
  sitesOnEdge = [],
  library = BUFFER_LIBRARY,
  allowInvert = false
) {
  const options = [];
  const rc = wireRc(length);
  const dWire = elmoreDelay(rc.R, rc.C, cload);
  options.push({ c: rc.C + cload, d: dWire, buf: null, t: null, kind: "wire" });

  // Classic mid-edge options (same as vanGinnekenEdge)
  const mid = vanGinnekenEdge(length, cload, library, allowInvert);
  for (const o of mid.options) {
    if (o.kind === "wire") continue;
    options.push({ ...o, t: 0.5 });
  }

  for (const site of sitesOnEdge) {
    const t = site.t ?? 0.5;
    for (const buf of library) {
      if (buf.invert && !allowInvert) continue;
      options.push(delayWithSite(length, t, cload, buf));
    }
  }

  const pruned = dominatePrune(options);
  const best = pruned.reduce((a, b) => (a.d <= b.d ? a : b));
  return { options: pruned, best, wireOnly: options[0] };
}

function sitePoint(a, b, t) {
  // Approximate L-route: horizontal then vertical
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const hlen = Math.abs(dx);
  const vlen = Math.abs(dy);
  const length = hlen + vlen;
  if (length < 1e-9) return { x: a.x, y: a.y };
  const dist = t * length;
  if (dist <= hlen) {
    return { x: a.x + (dx >= 0 ? dist : -dist), y: a.y };
  }
  const rem = dist - hlen;
  return { x: b.x, y: a.y + (dy >= 0 ? rem : -rem) };
}

/**
 * Net-level site DP on the D→S0→{S1,S2} teaching topology.
 */
export function siteDpNet(
  driver = DRIVER,
  sinks = SINKS,
  edges = EDGES,
  opts = {}
) {
  const nodes = nodeMap(driver, sinks);
  const step = opts.candidateStep ?? CANDIDATE_STEP;
  const allowInvert = !!opts.allowInvert;
  const library = opts.library || BUFFER_LIBRARY;
  const allSites = candidateSites(step, edges, nodes);
  const byEdge = {};
  for (const s of allSites) {
    (byEdge[s.edge] ||= []).push(s);
  }

  const branchC = sinks.reduce((s, x) => s + (x.cload ?? 1), 0);
  const per = {};
  const e0 = edges.find((e) => e.id === "e0");
  per.e0 = siteDpEdge(
    edgeLength(e0, nodes),
    branchC,
    byEdge.e0 || [],
    library,
    allowInvert
  );

  for (const [eid, sid] of [
    ["e1", "S1"],
    ["e2", "S2"],
  ]) {
    const e = edges.find((x) => x.id === eid);
    const sink = sinks.find((s) => s.id === sid);
    per[eid] = siteDpEdge(
      edgeLength(e, nodes),
      sink?.cload ?? 1,
      byEdge[eid] || [],
      library,
      allowInvert
    );
  }

  const bestDelay = per.e0.best.d + Math.max(per.e1.best.d, per.e2.best.d);
  const wireDelay = per.e0.wireOnly.d + Math.max(per.e1.wireOnly.d, per.e2.wireOnly.d);

  const buffers = [];
  for (const [eid, res] of Object.entries(per)) {
    if (!res.best?.buf) continue;
    const e = edges.find((x) => x.id === eid);
    const a = nodes[e.a];
    const b = nodes[e.b];
    const t = res.best.t != null ? res.best.t : 0.5;
    const pt = sitePoint(a, b, t);
    buffers.push({ edge: eid, buf: res.best.buf, x: pt.x, y: pt.y, t });
  }

  return {
    perEdge: per,
    bestDelay,
    wireDelay,
    improved: bestDelay < wireDelay - 1e-9,
    buffers,
    siteCount: allSites.length,
  };
}

/**
 * Slew-driven seed, then Van Ginneken polish on edges that still need delay help.
 * Keeps slew buffers; adds VG mid-edge buffers on other edges when VG wants them.
 */
export function slewThenPolish(
  driver = DRIVER,
  sinks = SINKS,
  edges = EDGES,
  opts = {}
) {
  const slewLimit = opts.slewLimit ?? SLEW_LIMIT;
  const slew = slewDrivenInsert(slewLimit, driver, sinks, edges);
  const vg = vanGinnekenNet(driver, sinks, edges);
  const slewEdges = new Set(slew.insertions.map((i) => i.edge));
  const buffers = slew.insertions.map((i) => ({ ...i, source: "slew" }));

  for (const b of buffersFromVg(vg, driver, sinks, edges)) {
    if (slewEdges.has(b.edge)) continue;
    buffers.push({ ...b, source: "vg" });
  }

  // Delay proxy: VG best on slew-free edges + VG best (buffered) on slew edges
  let delay = 0;
  const nodes = nodeMap(driver, sinks);
  const branchC = sinks.reduce((s, x) => s + (x.cload ?? 1), 0);
  const edgeLoad = { e0: branchC };
  for (const s of sinks) {
    if (s.id === "S1") edgeLoad.e1 = s.cload ?? 1;
    if (s.id === "S2") edgeLoad.e2 = s.cload ?? 1;
  }
  const dEdge = {};
  for (const e of edges) {
    const L = edgeLength(e, nodes);
    const cl = edgeLoad[e.id] ?? 1;
    if (slewEdges.has(e.id) || vg.perEdge[e.id]?.best?.buf) {
      dEdge[e.id] = vanGinnekenEdge(L, cl).best.d;
    } else {
      dEdge[e.id] = vanGinnekenEdge(L, cl).wireOnly.d;
    }
  }
  delay = (dEdge.e0 ?? 0) + Math.max(dEdge.e1 ?? 0, dEdge.e2 ?? 0);

  const remainingSlew = Math.max(
    0,
    countSlewViolations(driver, sinks, edges, slewLimit) - slew.count
  );

  return {
    buffers,
    delay,
    wireDelay: vg.wireDelay,
    slewViolations: remainingSlew,
    detail: `slew_polish slew=${slew.count} vg_extra=${buffers.length - slew.count}`,
  };
}

/**
 * Composite portfolio: evaluate candidates, pick best under
 * slew viol → delay → buffer count → polarity flips.
 */
export function portfolioBuffer(
  driver = DRIVER,
  sinks = SINKS,
  edges = EDGES,
  opts = {}
) {
  const slewLimit = opts.slewLimit ?? SLEW_LIMIT;
  const vg = vanGinnekenNet(driver, sinks, edges);
  const site = siteDpNet(driver, sinks, edges, opts);
  const polish = slewThenPolish(driver, sinks, edges, opts);
  const slew = slewDrivenInsert(slewLimit, driver, sinks, edges);
  const fan = fanoutBufferTree(sinks);

  const cands = [
    {
      id: "van_ginneken",
      buffers: buffersFromVg(vg, driver, sinks, edges),
      delay: vg.bestDelay,
      wireDelay: vg.wireDelay,
      slewViolations: countSlewViolations(driver, sinks, edges, slewLimit),
    },
    {
      id: "site_dp",
      buffers: site.buffers,
      delay: site.bestDelay,
      wireDelay: site.wireDelay,
      slewViolations: countSlewViolations(driver, sinks, edges, slewLimit),
    },
    {
      id: "slew_polish",
      buffers: polish.buffers,
      delay: polish.delay,
      wireDelay: polish.wireDelay,
      slewViolations: polish.slewViolations,
    },
    {
      id: "slew_driven",
      buffers: slew.insertions.map((i) => ({ ...i })),
      delay: vg.wireDelay,
      wireDelay: vg.wireDelay,
      slewViolations: Math.max(
        0,
        countSlewViolations(driver, sinks, edges, slewLimit) - slew.count
      ),
    },
    {
      id: "sequential",
      buffers: [
        ...buffersFromVg(vg, driver, sinks, edges),
        ...(fan.inserted ? fan.buffers.map((b) => ({ ...b })) : []),
      ],
      delay: vg.bestDelay,
      wireDelay: vg.wireDelay,
      slewViolations: countSlewViolations(driver, sinks, edges, slewLimit),
    },
  ];

  function better(a, b) {
    const as = a.slewViolations ?? 0;
    const bs = b.slewViolations ?? 0;
    if (as !== bs) return as < bs;
    const ad = a.delay ?? Infinity;
    const bd = b.delay ?? Infinity;
    if (Math.abs(ad - bd) > 1e-9) return ad < bd;
    const ab = a.buffers?.length ?? 0;
    const bb = b.buffers?.length ?? 0;
    if (ab !== bb) return ab < bb;
    const ap = polarityFlips(a.buffers) % 2;
    const bp = polarityFlips(b.buffers) % 2;
    if (ap !== bp) return ap < bp; // prefer even polarity
    return false;
  }

  let best = cands[0];
  for (const c of cands.slice(1)) {
    if (better(c, best)) best = c;
  }

  return {
    buffers: best.buffers,
    delay: best.delay,
    wireDelay: best.wireDelay,
    slewViolations: best.slewViolations,
    polarityFlips: polarityFlips(best.buffers),
    detail: `portfolio from=${best.id} delay=${best.delay}`,
  };
}

export { polarityFlips, countSlewViolations, buffersFromVg };
