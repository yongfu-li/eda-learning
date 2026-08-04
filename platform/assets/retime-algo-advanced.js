/**
 * Advanced retiming engines for the offline benchmark.
 * Reuses platform/assets/retiming-core.js (Leiserson–Saxe literacy).
 */
import {
  NODES,
  EDGES,
  applyRetime,
  backwardRetime,
  clockPeriod,
  forwardRetime,
  isLegal,
  minPeriodSearch,
  registerCount,
  sequentialRetime,
  zeroRetime,
} from "./retiming-core.js";

export function cloneR(r) {
  return { ...r };
}

export function combIds(nodes = NODES) {
  return nodes.filter((n) => n.kind === "comb").map((n) => n.id);
}

export function retimeCost(period, registers, opts = {}) {
  const pW = opts.periodWeight ?? 100;
  const rW = opts.regWeight ?? 1;
  return period * pW + registers * rW;
}

export function scoreRetime(r, nodes = NODES, edges = EDGES) {
  const legal = isLegal(edges, r);
  const period = legal ? clockPeriod(r, nodes, edges) : Infinity;
  const registers = legal ? registerCount(r, edges) : Infinity;
  return {
    r: cloneR(r),
    legal,
    illegal: legal ? 0 : 1,
    period,
    registers,
    cost: legal ? retimeCost(period, registers) : Infinity,
    edges: applyRetime(edges, r),
  };
}

function better(a, b) {
  if (!a) return true;
  if (a.illegal !== b.illegal) return b.illegal < a.illegal;
  if (Math.abs(a.period - b.period) > 1e-9) return b.period < a.period;
  if (Math.abs(a.registers - b.registers) > 1e-9) return b.registers < a.registers;
  return false;
}

export function pickBest(cands) {
  let best = null;
  for (const c of cands) {
    if (!c) continue;
    const s = c.illegal != null ? c : scoreRetime(c.r || c, c.nodes, c.edges);
    if (better(best, s)) best = s;
  }
  return best;
}

/** Identity: r = 0 everywhere. */
export function identityRetime(nodes = NODES, edges = EDGES) {
  const r = zeroRetime(nodes);
  return { ...scoreRetime(r, nodes, edges), detail: "identity" };
}

/** Course forward-a golden move. */
export function forwardARetime(nodes = NODES, edges = EDGES) {
  const a = nodes.find((n) => n.id === "a");
  if (!a) {
    return identityRetime(nodes, edges);
  }
  const r = forwardRetime("a", zeroRetime(nodes), 1);
  return { ...scoreRetime(r, nodes, edges), detail: "forwardA" };
}

/** Core min-period hand search. */
export function minPeriodRetime(nodes = NODES, edges = EDGES) {
  const out = minPeriodSearch(nodes, edges);
  return {
    ...scoreRetime(out.r || zeroRetime(nodes), nodes, edges),
    detail: "minPeriodSearch",
  };
}

/** Sequential course wrapper. */
export function sequentialMinRetime(nodes = NODES, edges = EDGES) {
  const out = sequentialRetime("min_period", nodes, edges);
  return {
    ...scoreRetime(out.r || zeroRetime(nodes), nodes, edges),
    detail: "sequentialRetime/min_period",
  };
}

/** Greedy: try ±1 forward/backward on each comb node; keep improvements. */
export function greedyLocalRetime(nodes = NODES, edges = EDGES, opts = {}) {
  let r = opts.seedR ? cloneR(opts.seedR) : zeroRetime(nodes);
  let best = scoreRetime(r, nodes, edges);
  const ids = combIds(nodes);
  const rounds = opts.rounds ?? 4;
  for (let round = 0; round < rounds; round++) {
    let improved = false;
    for (const id of ids) {
      for (const [fn, amt] of [
        [forwardRetime, 1],
        [backwardRetime, 1],
        [forwardRetime, 2],
        [backwardRetime, 2],
      ]) {
        const cand = fn(id, r, amt);
        const s = scoreRetime(cand, nodes, edges);
        if (better(best, s)) {
          best = s;
          r = cand;
          improved = true;
        }
      }
    }
    if (!improved) break;
  }
  return { ...best, detail: "greedyLocalRetime" };
}

/**
 * Enumerate integer r on comb nodes in [lo, hi] (PI/PO fixed at 0).
 * Feasible for tiny literacy graphs.
 */
export function enumerateRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const lo = opts.lo ?? -2;
  const hi = opts.hi ?? 2;
  const ids = combIds(nodes);
  const r = zeroRetime(nodes);
  let best = scoreRetime(r, nodes, edges);

  function rec(i) {
    if (i === ids.length) {
      const s = scoreRetime(r, nodes, edges);
      if (better(best, s)) best = { ...s, r: cloneR(r) };
      return;
    }
    for (let v = lo; v <= hi; v++) {
      r[ids[i]] = v;
      rec(i + 1);
    }
  }
  rec(0);
  return { ...best, detail: `enumerate[${lo},${hi}]` };
}

/** Binary search on period Φ; FEAS via enumeration in range. */
export function binaryFeasRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const base = clockPeriod(null, nodes, edges);
  const sumDelay = nodes.reduce((s, n) => s + n.delay, 0);
  let lo = Math.max(1, Math.min(...nodes.map((n) => n.delay)));
  let hi = Math.max(base, sumDelay);
  let best = identityRetime(nodes, edges);
  const range = opts.range ?? [-3, 3];

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const enumOut = enumerateRetime(nodes, edges, {
      lo: range[0],
      hi: range[1],
    });
    if (enumOut.illegal === 0 && enumOut.period <= mid + 1e-9) {
      if (better(best, enumOut)) best = enumOut;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  // Refine: among period-feasible, pick min period then min regs
  const refined = enumerateRetime(nodes, edges, {
    lo: range[0],
    hi: range[1],
  });
  if (better(best, refined)) best = refined;
  return { ...best, detail: "binaryFeasRetime" };
}

/** Minimize registers subject to not worsening baseline period. */
export function minRegistersRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const baseline = clockPeriod(null, nodes, edges);
  const target = opts.periodTarget ?? baseline;
  const enumOut = enumerateRetime(nodes, edges, {
    lo: opts.lo ?? -2,
    hi: opts.hi ?? 2,
  });
  const r = zeroRetime(nodes);
  let best = scoreRetime(r, nodes, edges);
  const ids = combIds(nodes);

  function rec(i) {
    if (i === ids.length) {
      const s = scoreRetime(r, nodes, edges);
      if (s.illegal) return;
      if (s.period > target + 1e-9) return;
      if (
        !best ||
        s.registers < best.registers - 1e-9 ||
        (Math.abs(s.registers - best.registers) < 1e-9 && s.period < best.period)
      ) {
        best = { ...s, r: cloneR(r) };
      }
      return;
    }
    for (let v = opts.lo ?? -2; v <= (opts.hi ?? 2); v++) {
      r[ids[i]] = v;
      rec(i + 1);
    }
  }
  rec(0);
  if (better(best, enumOut) === false && enumOut.illegal === 0) {
    /* keep best */
  }
  return { ...best, detail: "minRegistersRetime" };
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Simulated annealing on integer r of comb nodes. */
export function saRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const rand = mulberry32(opts.seed ?? 42);
  const ids = combIds(nodes);
  let r = opts.seedR ? cloneR(opts.seedR) : zeroRetime(nodes);
  let cur = scoreRetime(r, nodes, edges);
  let best = { ...cur, r: cloneR(r) };
  const moves = opts.moves ?? 400;
  let temp = opts.temp0 ?? 8;

  for (let i = 0; i < moves; i++) {
    const id = ids[Math.floor(rand() * ids.length)] || ids[0];
    if (!id) break;
    const delta = rand() < 0.5 ? -1 : 1;
    const nextR = cloneR(r);
    nextR[id] = (nextR[id] || 0) + delta;
    const next = scoreRetime(nextR, nodes, edges);
    const dCost = next.cost - cur.cost;
    if (dCost <= 0 || rand() < Math.exp(-dCost / Math.max(temp, 1e-6))) {
      r = nextR;
      cur = next;
      if (better(best, cur)) best = { ...cur, r: cloneR(r) };
    }
    temp *= opts.cool ?? 0.992;
  }
  return { ...best, detail: "saRetime" };
}

export function saMultiRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const seeds = opts.seeds ?? [7, 11, 19, 29, 41];
  const cands = seeds.map((seed) =>
    saRetime(nodes, edges, { ...opts, seed, moves: opts.moves ?? 280 })
  );
  cands.push(enumerateRetime(nodes, edges, { lo: -2, hi: 2 }));
  const best = pickBest(cands);
  return { ...best, detail: "saMultiRetime" };
}

/** Prefer lower period×regs cost among enumerated + greedy + SA. */
export function periodParetoRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const cands = [
    identityRetime(nodes, edges),
    forwardARetime(nodes, edges),
    minPeriodRetime(nodes, edges),
    greedyLocalRetime(nodes, edges),
    enumerateRetime(nodes, edges, { lo: -2, hi: 2 }),
    minRegistersRetime(nodes, edges, opts),
    saRetime(nodes, edges, { ...opts, moves: 320 }),
  ];
  const best = pickBest(cands);
  return { ...best, detail: "periodParetoRetime" };
}

export function multistartRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const cands = [
    identityRetime(nodes, edges),
    forwardARetime(nodes, edges),
    minPeriodRetime(nodes, edges),
    greedyLocalRetime(nodes, edges),
    binaryFeasRetime(nodes, edges),
    wdFeasRetime(nodes, edges, opts),
    enumerateRetime(nodes, edges, { lo: -3, hi: 3 }),
    deepEnumerateRetime(nodes, edges, opts),
    criticalPushRetime(nodes, edges, opts),
    beamSearchRetime(nodes, edges, opts),
    tabuRetime(nodes, edges, opts),
    ilsRetime(nodes, edges, opts),
    geneticRetime(nodes, edges, opts),
    saMultiRetime(nodes, edges, opts),
  ];
  const best = pickBest(cands);
  return { ...best, detail: "multistartRetime" };
}

export function portfolioRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const cands = [
    identityRetime(nodes, edges),
    forwardARetime(nodes, edges),
    minPeriodRetime(nodes, edges),
    sequentialMinRetime(nodes, edges),
    greedyLocalRetime(nodes, edges),
    enumerateRetime(nodes, edges, { lo: -3, hi: 3 }),
    deepEnumerateRetime(nodes, edges, opts),
    binaryFeasRetime(nodes, edges),
    wdFeasRetime(nodes, edges, opts),
    minRegistersRetime(nodes, edges, opts),
    criticalPushRetime(nodes, edges, opts),
    cutsetRetime(nodes, edges, opts),
    balanceRegsRetime(nodes, edges, opts),
    areaAwareRetime(nodes, edges, opts),
    beamSearchRetime(nodes, edges, opts),
    tabuRetime(nodes, edges, opts),
    ilsRetime(nodes, edges, opts),
    geneticRetime(nodes, edges, opts),
    pathGuidedSaRetime(nodes, edges, opts),
    saRetime(nodes, edges, { ...opts, moves: 360 }),
    saMultiRetime(nodes, edges, opts),
    periodParetoRetime(nodes, edges, opts),
    multistartRetime(nodes, edges, opts),
  ];
  const best = pickBest(cands);
  return { ...best, detail: `portfolio/${best?.detail || "best"}` };
}

/* ─── Wave 2 engines ─────────────────────────────────────────────── */

function nodeById(nodes) {
  return Object.fromEntries(nodes.map((n) => [n.id, n]));
}

/** Longest zero-weight path node ids (approx via DP on w'=0 edges). */
export function criticalZeroPath(nodes, edges, r = null) {
  const drawn = r ? applyRetime(edges, r) : edges;
  const by = nodeById(nodes);
  const ids = nodes.map((n) => n.id);
  const succ = Object.fromEntries(ids.map((i) => [i, []]));
  for (const e of drawn) {
    if (e.w === 0) succ[e.src].push(e.dst);
  }
  const best = Object.fromEntries(ids.map((i) => [i, by[i].delay]));
  const pred = Object.fromEntries(ids.map((i) => [i, null]));
  const indeg = Object.fromEntries(ids.map((i) => [i, 0]));
  for (const u of ids) for (const v of succ[u]) indeg[v]++;
  const q = ids.filter((i) => indeg[i] === 0);
  const order = [];
  const deg = { ...indeg };
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of succ[u]) {
      const cand = best[u] + by[v].delay;
      if (cand > best[v]) {
        best[v] = cand;
        pred[v] = u;
      }
      deg[v]--;
      if (deg[v] === 0) q.push(v);
    }
  }
  let sink = ids[0];
  for (const id of ids) if (best[id] > best[sink]) sink = id;
  const path = [];
  for (let cur = sink; cur; cur = pred[cur]) path.push(cur);
  path.reverse();
  return { path, delay: best[sink] };
}

/**
 * Critical-path push: repeatedly forward-retime internal comb nodes on the
 * current zero-weight critical path (classic intuition for cutting Φ).
 */
export function criticalPushRetime(nodes = NODES, edges = EDGES, opts = {}) {
  let r = opts.seedR ? cloneR(opts.seedR) : zeroRetime(nodes);
  let best = scoreRetime(r, nodes, edges);
  const rounds = opts.rounds ?? 8;
  for (let i = 0; i < rounds; i++) {
    const { path } = criticalZeroPath(nodes, edges, r);
    const internals = path.filter((id) => {
      const n = nodes.find((x) => x.id === id);
      return n && n.kind === "comb";
    });
    let moved = false;
    for (const id of internals) {
      for (const amt of [1, 2]) {
        const cand = forwardRetime(id, r, amt);
        const s = scoreRetime(cand, nodes, edges);
        if (better(best, s)) {
          best = s;
          r = cand;
          moved = true;
          break;
        }
        const candB = backwardRetime(id, r, amt);
        const sB = scoreRetime(candB, nodes, edges);
        if (better(best, sB)) {
          best = sB;
          r = candB;
          moved = true;
          break;
        }
      }
      if (moved) break;
    }
    if (!moved) break;
  }
  return { ...best, detail: "criticalPushRetime" };
}

/**
 * W/D matrices (all-pairs via enumeration of simple paths on tiny graphs)
 * + Bellman-Ford FEAS for a candidate period, binary-searched.
 */
export function computeWD(nodes = NODES, edges = EDGES) {
  const ids = nodes.map((n) => n.id);
  const by = nodeById(nodes);
  const W = {};
  const D = {};
  for (const u of ids) {
    W[u] = {};
    D[u] = {};
    for (const v of ids) {
      W[u][v] = u === v ? 0 : Infinity;
      D[u][v] = u === v ? by[u].delay : -Infinity;
    }
  }
  // Path DP: iterate |V| times over edges (DAG-friendly; still ok on tiny graphs)
  for (let iter = 0; iter < ids.length; iter++) {
    for (const e of edges) {
      const u = e.src;
      const v = e.dst;
      for (const s of ids) {
        if (!Number.isFinite(W[s][u])) continue;
        const wCand = W[s][u] + e.w;
        const dCand = D[s][u] + by[v].delay;
        if (
          wCand < W[s][v] - 1e-12 ||
          (Math.abs(wCand - W[s][v]) < 1e-12 && dCand > D[s][v])
        ) {
          W[s][v] = wCand;
          D[s][v] = dCand;
        }
      }
    }
  }
  return { W, D, ids };
}

/** Bellman-Ford on difference constraints for FEAS(Φ). Returns r or null. */
export function feasBellman(nodes, edges, Phi, WD = null) {
  const { W, D, ids } = WD || computeWD(nodes, edges);
  const host = "__host__";
  const verts = [...ids, host];
  const dist = Object.fromEntries(verts.map((v) => [v, 0]));
  const constr = [];
  for (const e of edges) {
    // r(u) - r(v) ≤ w(e)  ⇒  edge v→u weight w(e)
    constr.push({ from: e.dst, to: e.src, w: e.w });
  }
  for (const u of ids) {
    for (const v of ids) {
      if (u === v) continue;
      if (D[u][v] > Phi + 1e-9 && Number.isFinite(W[u][v])) {
        // r(u) - r(v) ≤ W(u,v) - 1
        constr.push({ from: v, to: u, w: W[u][v] - 1 });
      }
    }
  }
  for (const v of ids) constr.push({ from: host, to: v, w: 0 });

  for (let i = 0; i < verts.length; i++) {
    let updated = false;
    for (const c of constr) {
      const cand = dist[c.from] + c.w;
      if (cand < dist[c.to] - 1e-12) {
        dist[c.to] = cand;
        updated = true;
        if (i === verts.length - 1) return null;
      }
    }
    if (!updated) break;
  }

  // r(v) = -dist(v) rounded toward legality (integer lags)
  const r = zeroRetime(nodes);
  for (const id of ids) {
    r[id] = Math.round(-dist[id]);
  }
  // PI/PO often fixed at 0 in literacy labs — pin them
  for (const n of nodes) {
    if (n.kind === "pi" || n.kind === "po") r[n.id] = 0;
  }
  if (!isLegal(edges, r)) {
    // small repair: clamp comb lags toward legal via enum neighborhood
    const fixed = greedyLocalRetime(nodes, edges, { seedR: r, rounds: 3 });
    return fixed.illegal ? null : fixed.r;
  }
  return r;
}

export function wdFeasRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const WD = computeWD(nodes, edges);
  const base = clockPeriod(null, nodes, edges);
  const sumDelay = nodes.reduce((s, n) => s + n.delay, 0);
  let lo = Math.max(1, Math.min(...nodes.map((n) => n.delay)));
  let hi = Math.max(base, sumDelay);
  let best = identityRetime(nodes, edges);

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const r = feasBellman(nodes, edges, mid, WD);
    if (r) {
      const s = scoreRetime(r, nodes, edges);
      if (s.illegal === 0 && s.period <= mid + 1e-9) {
        if (better(best, s)) best = s;
        hi = mid - 1;
        continue;
      }
    }
    lo = mid + 1;
  }
  // Final FEAS at best known period
  if (Number.isFinite(best.period)) {
    const r2 = feasBellman(nodes, edges, best.period, WD);
    if (r2) {
      const s2 = scoreRetime(r2, nodes, edges);
      if (better(best, s2)) best = s2;
    }
  }
  return { ...best, detail: "wdFeasRetime" };
}

/** Push registers across successive topological cuts. */
export function cutsetRetime(nodes = NODES, edges = EDGES, opts = {}) {
  let r = zeroRetime(nodes);
  let best = scoreRetime(r, nodes, edges);
  const comb = combIds(nodes);
  for (const id of comb) {
    for (const fn of [forwardRetime, backwardRetime]) {
      const cand = fn(id, r, 1);
      const s = scoreRetime(cand, nodes, edges);
      if (better(best, s)) {
        best = s;
        r = cand;
      }
    }
  }
  // Second pass: simultaneous cut (all comb ±1)
  for (const sign of [-1, 1]) {
    const cand = cloneR(r);
    for (const id of comb) cand[id] = (cand[id] || 0) + sign;
    const s = scoreRetime(cand, nodes, edges);
    if (better(best, s)) best = s;
  }
  const polished = greedyLocalRetime(nodes, edges, {
    seedR: best.r,
    rounds: opts.rounds ?? 3,
  });
  if (better(best, polished)) best = polished;
  return { ...best, detail: "cutsetRetime" };
}

/** Wider enumerate with pruning on partial illegal / dominated period. */
export function deepEnumerateRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const lo = opts.lo ?? -4;
  const hi = opts.hi ?? 4;
  const ids = combIds(nodes);
  // Cap explosion: if too many comb nodes, shrink range
  const range =
    ids.length >= 5 ? [Math.max(lo, -2), Math.min(hi, 2)] : [lo, hi];
  return {
    ...enumerateRetime(nodes, edges, { lo: range[0], hi: range[1] }),
    detail: `deepEnumerate[${range[0]},${range[1]}]`,
  };
}

/** Beam search over lag assignments. */
export function beamSearchRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const ids = combIds(nodes);
  const beamW = opts.beam ?? 12;
  const vals = opts.vals || [-2, -1, 0, 1, 2];
  let beam = [{ r: zeroRetime(nodes), score: scoreRetime(zeroRetime(nodes), nodes, edges) }];

  for (const id of ids) {
    const next = [];
    for (const b of beam) {
      for (const v of vals) {
        const r = cloneR(b.r);
        r[id] = v;
        next.push({ r, score: scoreRetime(r, nodes, edges) });
      }
    }
    next.sort((a, b) => {
      if (a.score.illegal !== b.score.illegal) return a.score.illegal - b.score.illegal;
      if (Math.abs(a.score.period - b.score.period) > 1e-9)
        return a.score.period - b.score.period;
      return a.score.registers - b.score.registers;
    });
    beam = next.slice(0, beamW);
  }
  const best = beam[0]?.score || identityRetime(nodes, edges);
  return { ...best, detail: "beamSearchRetime" };
}

/** Tabu search on ±1 lag moves. */
export function tabuRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const rand = mulberry32(opts.seed ?? 99);
  const ids = combIds(nodes);
  let r = opts.seedR ? cloneR(opts.seedR) : zeroRetime(nodes);
  let cur = scoreRetime(r, nodes, edges);
  let best = { ...cur, r: cloneR(r) };
  const tabu = new Map();
  const tenure = opts.tenure ?? 7;
  const moves = opts.moves ?? 320;

  for (let i = 0; i < moves; i++) {
    let chosen = null;
    let chosenScore = null;
    let chosenKey = null;
    for (const id of ids) {
      for (const delta of [-1, 1]) {
        const key = `${id}:${delta}`;
        if ((tabu.get(key) || 0) > i) continue;
        const nextR = cloneR(r);
        nextR[id] = (nextR[id] || 0) + delta;
        const s = scoreRetime(nextR, nodes, edges);
        if (!chosenScore || better(chosenScore, s)) {
          chosen = nextR;
          chosenScore = s;
          chosenKey = key;
        }
      }
    }
    // aspiration: allow tabu if globally best
    if (!chosen) {
      for (const id of ids) {
        for (const delta of [-1, 1]) {
          const nextR = cloneR(r);
          nextR[id] = (nextR[id] || 0) + delta;
          const s = scoreRetime(nextR, nodes, edges);
          if (better(best, s)) {
            chosen = nextR;
            chosenScore = s;
            chosenKey = `${id}:${delta}`;
          }
        }
      }
    }
    if (!chosen) {
      const id = ids[Math.floor(rand() * ids.length)];
      const nextR = cloneR(r);
      nextR[id] = (nextR[id] || 0) + (rand() < 0.5 ? -1 : 1);
      chosen = nextR;
      chosenScore = scoreRetime(nextR, nodes, edges);
      chosenKey = `${id}:rnd`;
    }
    r = chosen;
    cur = chosenScore;
    if (chosenKey) tabu.set(chosenKey, i + tenure);
    if (better(best, cur)) best = { ...cur, r: cloneR(r) };
  }
  return { ...best, detail: "tabuRetime" };
}

/** Iterated local search: perturb + greedy polish. */
export function ilsRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const rand = mulberry32(opts.seed ?? 17);
  const ids = combIds(nodes);
  let best = greedyLocalRetime(nodes, edges, { rounds: 4 });
  const iters = opts.iters ?? 10;
  for (let i = 0; i < iters; i++) {
    const r = cloneR(best.r);
    const k = 1 + Math.floor(rand() * Math.min(3, ids.length));
    for (let j = 0; j < k; j++) {
      const id = ids[Math.floor(rand() * ids.length)];
      r[id] = (r[id] || 0) + (rand() < 0.5 ? -1 : 1);
    }
    const polished = greedyLocalRetime(nodes, edges, { seedR: r, rounds: 5 });
    if (better(best, polished)) best = polished;
  }
  return { ...best, detail: "ilsRetime" };
}

/** Genetic algorithm on integer lag vectors. */
export function geneticRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const rand = mulberry32(opts.seed ?? 53);
  const ids = combIds(nodes);
  const popSize = opts.pop ?? 16;
  const gens = opts.gens ?? 24;
  const lo = opts.lo ?? -3;
  const hi = opts.hi ?? 3;

  function randomR() {
    const r = zeroRetime(nodes);
    for (const id of ids) {
      r[id] = lo + Math.floor(rand() * (hi - lo + 1));
    }
    return r;
  }

  let pop = Array.from({ length: popSize }, () => {
    const r = randomR();
    return { r, score: scoreRetime(r, nodes, edges) };
  });
  pop[0] = {
    r: zeroRetime(nodes),
    score: scoreRetime(zeroRetime(nodes), nodes, edges),
  };
  const fwd = forwardARetime(nodes, edges);
  pop[1] = { r: fwd.r, score: fwd };

  let best = pickBest(pop.map((p) => p.score));

  for (let g = 0; g < gens; g++) {
    pop.sort((a, b) => {
      if (a.score.illegal !== b.score.illegal) return a.score.illegal - b.score.illegal;
      if (Math.abs(a.score.period - b.score.period) > 1e-9)
        return a.score.period - b.score.period;
      return a.score.registers - b.score.registers;
    });
    if (better(best, pop[0].score)) best = pop[0].score;
    const next = pop.slice(0, Math.max(2, Math.floor(popSize / 4)));
    while (next.length < popSize) {
      const a = pop[Math.floor(rand() * Math.min(8, pop.length))];
      const b = pop[Math.floor(rand() * Math.min(8, pop.length))];
      const child = zeroRetime(nodes);
      for (const id of ids) {
        child[id] = rand() < 0.5 ? a.r[id] || 0 : b.r[id] || 0;
        if (rand() < 0.15) {
          child[id] = Math.max(lo, Math.min(hi, (child[id] || 0) + (rand() < 0.5 ? -1 : 1)));
        }
      }
      next.push({ r: child, score: scoreRetime(child, nodes, edges) });
    }
    pop = next;
  }
  return { ...best, detail: "geneticRetime" };
}

/** SA biased to nodes on the critical zero-weight path. */
export function pathGuidedSaRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const rand = mulberry32(opts.seed ?? 71);
  const ids = combIds(nodes);
  let r = opts.seedR ? cloneR(opts.seedR) : zeroRetime(nodes);
  let cur = scoreRetime(r, nodes, edges);
  let best = { ...cur, r: cloneR(r) };
  const moves = opts.moves ?? 420;
  let temp = opts.temp0 ?? 10;

  for (let i = 0; i < moves; i++) {
    const { path } = criticalZeroPath(nodes, edges, r);
    const crit = path.filter((id) => ids.includes(id));
    const pool = crit.length && rand() < 0.7 ? crit : ids;
    const id = pool[Math.floor(rand() * pool.length)] || ids[0];
    if (!id) break;
    const nextR = cloneR(r);
    nextR[id] = (nextR[id] || 0) + (rand() < 0.5 ? -1 : 1);
    const next = scoreRetime(nextR, nodes, edges);
    const dCost = next.cost - cur.cost;
    if (dCost <= 0 || rand() < Math.exp(-dCost / Math.max(temp, 1e-6))) {
      r = nextR;
      cur = next;
      if (better(best, cur)) best = { ...cur, r: cloneR(r) };
    }
    temp *= opts.cool ?? 0.993;
  }
  return { ...best, detail: "pathGuidedSaRetime" };
}

/** Emphasize register count (area) in the objective. */
export function areaAwareRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const regW = opts.regWeight ?? 25;
  const cands = [
    identityRetime(nodes, edges),
    minRegistersRetime(nodes, edges, opts),
    enumerateRetime(nodes, edges, { lo: -2, hi: 2 }),
    greedyLocalRetime(nodes, edges),
    saRetime(nodes, edges, { ...opts, moves: 300 }),
  ];
  let best = null;
  for (const c of cands) {
    if (!c || c.illegal) continue;
    const cost = retimeCost(c.period, c.registers, {
      periodWeight: 10,
      regWeight: regW,
    });
    const tagged = { ...c, cost };
    if (
      !best ||
      tagged.illegal < best.illegal ||
      (tagged.illegal === best.illegal &&
        (tagged.registers < best.registers - 1e-9 ||
          (Math.abs(tagged.registers - best.registers) < 1e-9 &&
            tagged.period < best.period)))
    ) {
      best = tagged;
    }
  }
  return { ...(best || identityRetime(nodes, edges)), detail: "areaAwareRetime" };
}

/** Flatten register histogram while holding period ≤ baseline. */
export function balanceRegsRetime(nodes = NODES, edges = EDGES, opts = {}) {
  const baseline = clockPeriod(null, nodes, edges);
  let best = identityRetime(nodes, edges);
  const enumOut = enumerateRetime(nodes, edges, {
    lo: opts.lo ?? -2,
    hi: opts.hi ?? 2,
  });
  const pool = [best, enumOut, greedyLocalRetime(nodes, edges), minPeriodRetime(nodes, edges)];

  function variance(r) {
    const ws = applyRetime(edges, r).map((e) => e.w);
    if (!ws.length) return 0;
    const mean = ws.reduce((s, w) => s + w, 0) / ws.length;
    return ws.reduce((s, w) => s + (w - mean) ** 2, 0) / ws.length;
  }

  for (const c of pool) {
    if (!c || c.illegal) continue;
    if (c.period > baseline + 1e-9) continue;
    if (
      !best ||
      c.period < best.period - 1e-9 ||
      (Math.abs(c.period - best.period) < 1e-9 &&
        variance(c.r) < variance(best.r) - 1e-12)
    ) {
      best = c;
    }
  }
  return { ...best, detail: "balanceRegsRetime" };
}
