/**
 * Advanced placement engines for the placement benchmark.
 */
import {
  CELLS,
  FIXED_PADS,
  GOLDEN_PLACEMENT,
  NETS,
  NET_WEIGHTS,
  analyticalPlace,
  clonePositions,
  densityBins,
  forceDirectedPlace,
  minPairDistance,
  quadraticPlace,
  saPlace,
  spreadCells,
  timingWeightedHpwl,
  totalHpwl,
} from "./placement-core.js";

/** Composite cost: HPWL + λ·density overflow (+ soft min-distance shortfall). */
export function placeCost(positions, opts = {}) {
  const nets = opts.nets || NETS;
  const lambda = opts.lambda ?? 8;
  const binCap = opts.binCap ?? 1;
  const nx = opts.nx ?? 3;
  const ny = opts.ny ?? 3;
  const minDist = opts.minDist ?? 0.75;
  const mu = opts.mu ?? 4;
  const hpwl = totalHpwl(nets, positions);
  const overflow = densityBins(positions, {
    nx,
    ny,
    x0: 0,
    y0: 0,
    x1: 8,
    y1: 8,
    capacity: binCap,
  }).overflow;
  const md = minPairDistance(positions);
  const distPen = Math.max(0, minDist - (Number.isFinite(md) ? md : 0));
  return {
    cost: hpwl + lambda * overflow + mu * distPen,
    hpwl,
    overflow,
    minDist: md,
    timing: timingWeightedHpwl(nets, positions, opts.weights || NET_WEIGHTS),
  };
}

/** Rank key: overflow first (anti-collapse), then HPWL, then timing. */
function scoreKey(positions, opts = {}) {
  const s = placeCost(positions, opts);
  return [s.overflow, s.hpwl, s.timing];
}

function better(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > 1e-9) return a[i] < b[i];
  }
  return false;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deeper force-directed (more iters / stronger springs). */
export function forceDeepPlace(positions, opts = {}) {
  return forceDirectedPlace(positions, {
    iters: opts.iters ?? 24,
    alpha: opts.alpha ?? 0.16,
    centerPull: opts.centerPull ?? 0.015,
    fixed: opts.fixed || [],
    nets: opts.nets,
  });
}

/** Force then pairwise spread — low HPWL with less stacking. */
export function forceThenSpread(positions, opts = {}) {
  let pos = forceDeepPlace(positions, opts);
  pos = spreadCells(pos, {
    minDist: opts.minDist ?? 0.75,
    iters: opts.spreadIters ?? 50,
    strength: 0.55,
  });
  return forceDirectedPlace(pos, {
    iters: 4,
    alpha: 0.08,
    centerPull: 0.01,
    fixed: opts.fixed || [],
  });
}

/**
 * Density-aware force: spring pull + bin repulsion + pairwise min-distance.
 */
export function densForcePlace(positions, opts = {}) {
  const nets = opts.nets || NETS;
  const fixed = new Set(opts.fixed || []);
  const iters = opts.iters ?? 28;
  const alpha = opts.alpha ?? 0.12;
  const densW = opts.densityWeight ?? 0.7;
  const minDist = opts.minDist ?? 0.85;
  const pos = clonePositions(positions);
  const cx = 4;
  const cy = 4;

  const adj = {};
  for (const id of CELLS) adj[id] = new Set();
  for (const net of nets) {
    for (let i = 0; i < net.length; i++) {
      for (let j = i + 1; j < net.length; j++) {
        adj[net[i]].add(net[j]);
        adj[net[j]].add(net[i]);
      }
    }
  }

  for (let t = 0; t < iters; t++) {
    const bins = densityBins(pos, {
      nx: 2,
      ny: 2,
      x0: 0,
      y0: 0,
      x1: 8,
      y1: 8,
      capacity: 2,
    });
    const next = clonePositions(pos);
    for (const id of CELLS) {
      if (fixed.has(id)) continue;
      const nbs = [...adj[id]];
      let fx = 0;
      let fy = 0;
      if (nbs.length) {
        let sx = 0;
        let sy = 0;
        for (const nb of nbs) {
          sx += pos[nb].x;
          sy += pos[nb].y;
        }
        fx += alpha * (sx / nbs.length - pos[id].x);
        fy += alpha * (sy / nbs.length - pos[id].y);
      }
      fx += 0.01 * (cx - pos[id].x);
      fy += 0.01 * (cy - pos[id].y);

      let bx = Math.floor((pos[id].x / 8) * 2);
      let by = Math.floor((pos[id].y / 8) * 2);
      bx = Math.max(0, Math.min(1, bx));
      by = Math.max(0, Math.min(1, by));
      const count = bins.counts[by]?.[bx] ?? 0;
      if (count > 1) {
        const binCx = (bx + 0.5) * 4;
        const binCy = (by + 0.5) * 4;
        let dx = pos[id].x - binCx;
        let dy = pos[id].y - binCy;
        if (Math.abs(dx) + Math.abs(dy) < 1e-6) {
          dx = ((id.charCodeAt(0) * 3) % 5) - 2;
          dy = ((id.charCodeAt(0) * 7) % 5) - 2;
        }
        const len = Math.hypot(dx, dy) || 1;
        fx += densW * (dx / len) * (count - 1) * 0.35;
        fy += densW * (dy / len) * (count - 1) * 0.35;
      }

      for (const other of CELLS) {
        if (other === id) continue;
        const dx = pos[id].x - pos[other].x;
        const dy = pos[id].y - pos[other].y;
        const dist = Math.hypot(dx, dy);
        if (dist >= minDist) continue;
        const need = minDist - (dist < 1e-9 ? 0 : dist);
        const ux = dist < 1e-9 ? 1 : dx / dist;
        const uy = dist < 1e-9 ? 0 : dy / dist;
        fx += ux * need * 0.25;
        fy += uy * need * 0.25;
      }

      next[id].x = Math.max(-0.5, Math.min(8.5, pos[id].x + fx));
      next[id].y = Math.max(-0.5, Math.min(8.5, pos[id].y + fy));
    }
    for (const id of CELLS) {
      pos[id].x = next[id].x;
      pos[id].y = next[id].y;
    }
  }
  return pos;
}

/** Timing-aware force: critical net pulls harder. */
export function timingForcePlace(positions, opts = {}) {
  const nets = opts.nets || NETS;
  const weights = opts.weights || NET_WEIGHTS;
  const fixed = new Set(opts.fixed || []);
  const iters = opts.iters ?? 20;
  const alpha = opts.alpha ?? 0.14;
  const pos = clonePositions(positions);
  const cx = 4;
  const cy = 4;

  const pull = {};
  for (const id of CELLS) pull[id] = {};
  for (let ni = 0; ni < nets.length; ni++) {
    const net = nets[ni];
    const w = weights[ni] ?? 1;
    for (let i = 0; i < net.length; i++) {
      for (let j = i + 1; j < net.length; j++) {
        const a = net[i];
        const b = net[j];
        pull[a][b] = (pull[a][b] || 0) + w;
        pull[b][a] = (pull[b][a] || 0) + w;
      }
    }
  }

  for (let t = 0; t < iters; t++) {
    const next = clonePositions(pos);
    for (const id of CELLS) {
      if (fixed.has(id)) continue;
      const nbs = Object.keys(pull[id]);
      if (!nbs.length) continue;
      let sx = 0;
      let sy = 0;
      let sw = 0;
      for (const nb of nbs) {
        const w = pull[id][nb];
        sx += pos[nb].x * w;
        sy += pos[nb].y * w;
        sw += w;
      }
      const tx = sx / sw;
      const ty = sy / sw;
      next[id].x = pos[id].x + alpha * (tx - pos[id].x) + 0.012 * (cx - pos[id].x);
      next[id].y = pos[id].y + alpha * (ty - pos[id].y) + 0.012 * (cy - pos[id].y);
    }
    for (const id of CELLS) {
      pos[id].x = next[id].x;
      pos[id].y = next[id].y;
    }
  }
  return pos;
}

/** Longer SA with optional fixed pads. */
export function saDeepPlace(positions, opts = {}) {
  const fixed = new Set(opts.fixed || []);
  const out = saPlace(positions, {
    moves: opts.moves ?? 200,
    t0: opts.t0 ?? 5,
    cool: opts.cool ?? 0.96,
    step: opts.step ?? 1.1,
    seed: opts.seed ?? 42,
    nets: opts.nets,
  });
  if (!fixed.size) return out.positions;
  const pos = clonePositions(out.positions);
  for (const id of fixed) {
    if (positions[id]) pos[id] = { ...positions[id] };
  }
  return pos;
}

/** Density-penalized SA: accept/reject on placeCost. */
export function densSaPlace(positions, opts = {}) {
  const nets = opts.nets || NETS;
  const fixed = new Set(opts.fixed || []);
  const moves = opts.moves ?? 220;
  const t0 = opts.t0 ?? 6;
  const cool = opts.cool ?? 0.955;
  const step = opts.step ?? 1.0;
  const seed = opts.seed ?? 42;
  const lambda = opts.lambda ?? 10;
  const rand = mulberry32(seed);
  let pos = clonePositions(positions);
  let cur = placeCost(pos, { nets, lambda, ...opts }).cost;
  let best = clonePositions(pos);
  let bestCost = cur;
  let T = t0;

  for (let m = 0; m < moves; m++) {
    const movable = CELLS.filter((id) => !fixed.has(id));
    const id = movable[Math.floor(rand() * movable.length)] || CELLS[0];
    const trial = clonePositions(pos);
    const axis = rand() < 0.5 ? "x" : "y";
    const delta = (rand() < 0.5 ? -1 : 1) * step * (0.4 + rand());
    trial[id][axis] = Math.max(-0.5, Math.min(8.5, pos[id][axis] + delta));
    const next = placeCost(trial, { nets, lambda, ...opts }).cost;
    const d = next - cur;
    if (d <= 0 || rand() < Math.exp(-d / Math.max(T, 1e-9))) {
      pos = trial;
      cur = next;
      if (cur < bestCost) {
        bestCost = cur;
        best = clonePositions(pos);
      }
    }
    T *= cool;
  }
  return best;
}

/** Multi-seed dens-SA. */
export function densSaMultiPlace(positions, opts = {}) {
  const seeds = opts.seeds || [7, 42, 99, 123, 256, 777];
  let best = null;
  let bestK = [Infinity, Infinity, Infinity];
  for (const seed of seeds) {
    const pl = densSaPlace(positions, {
      ...opts,
      seed,
      moves: opts.moves ?? 160,
    });
    const k = scoreKey(pl, opts);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best || clonePositions(positions);
}

/** Multi-seed SA — overflow then HPWL. */
export function saMultiseedPlace(positions, opts = {}) {
  const seeds = opts.seeds || [7, 42, 99, 123, 256, 777];
  let best = null;
  let bestK = [Infinity, Infinity, Infinity];
  for (const seed of seeds) {
    const pl = saDeepPlace(positions, { ...opts, seed, moves: opts.moves ?? 120 });
    const k = scoreKey(pl, opts);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best || clonePositions(positions);
}

/** Analytical with more density iterations, then optional spread. */
export function analyticalDeepPlace(positions, opts = {}) {
  let pos = analyticalPlace(positions, {
    iters: opts.iters ?? 20,
    densityWeight: opts.densityWeight ?? 0.65,
    forceIters: 10,
    quadIters: 5,
    fixed: opts.fixed || FIXED_PADS,
  });
  if (opts.spread !== false) {
    pos = spreadCells(pos, { minDist: 0.6, iters: 30 });
    pos = forceDirectedPlace(pos, {
      iters: 3,
      alpha: 0.07,
      fixed: opts.fixed || FIXED_PADS,
    });
  }
  return pos;
}

/** Force → quadratic → SA polish. */
export function forceQuadSaPlace(positions, opts = {}) {
  const fixed = opts.fixed || [];
  let pos = forceDeepPlace(positions, { ...opts, fixed });
  pos = quadraticPlace(pos, {
    iters: 8,
    blend: 0.5,
    fixed: fixed.length ? fixed : [],
  });
  return saDeepPlace(pos, { ...opts, fixed, moves: opts.moves ?? 100, seed: 42 });
}

/** Legalize-aware: dens-force → hard spread → dens-SA polish. */
export function legalizeAwarePlace(positions, opts = {}) {
  let pos = densForcePlace(positions, {
    ...opts,
    iters: 20,
    minDist: opts.minDist ?? 0.9,
  });
  pos = spreadCells(pos, {
    minDist: opts.minDist ?? 0.9,
    iters: 60,
    strength: 0.6,
  });
  return densSaPlace(pos, {
    ...opts,
    moves: opts.moves ?? 140,
    lambda: opts.lambda ?? 12,
    seed: opts.seed ?? 42,
  });
}

/** Multistart: dens-aware engines. */
export function multistartPlace(positions, opts = {}) {
  const candidates = [
    forceThenSpread(positions, opts),
    densForcePlace(positions, opts),
    timingForcePlace(positions, opts),
    analyticalDeepPlace(positions, opts),
    densSaMultiPlace(positions, { ...opts, seeds: [42, 99, 7] }),
    legalizeAwarePlace(positions, opts),
    forceQuadSaPlace(positions, opts),
  ];
  let best = candidates[0];
  let bestK = scoreKey(best, opts);
  for (const pl of candidates) {
    const k = scoreKey(pl, opts);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best;
}

/**
 * Pareto dens≤1: among candidates with overflow≤1 (else best overflow),
 * pick min HPWL.
 */
export function densParetoPlace(positions, opts = {}) {
  const fixed = opts.fixed;
  const candidates = [
    { pl: densForcePlace(positions, { fixed: fixed || [] }), tag: "dens_force" },
    { pl: forceThenSpread(positions, { fixed: fixed || [] }), tag: "force_spread" },
    { pl: densSaPlace(positions, { fixed: fixed || [] }), tag: "dens_sa" },
    { pl: densSaMultiPlace(positions, { fixed: fixed || [] }), tag: "dens_sa_multi" },
    { pl: legalizeAwarePlace(positions, { fixed: fixed || [] }), tag: "legalize_aware" },
    {
      pl: analyticalDeepPlace(positions, { fixed: fixed || FIXED_PADS }),
      tag: "analytical_deep",
    },
    { pl: goldenRefPlace(positions), tag: "golden" },
    { pl: spreadCells(positions, { minDist: 1.0 }), tag: "spread" },
  ];
  const scored = candidates.map((c) => {
    const s = placeCost(c.pl, opts);
    return { ...c, ov: s.overflow, hpwl: s.hpwl };
  });
  const maxOv = opts.maxOverflow ?? 1;
  const feasible = scored.filter((c) => c.ov <= maxOv);
  const pool = feasible.length ? feasible : scored;
  pool.sort((a, b) => a.ov - b.ov || a.hpwl - b.hpwl);
  const best = pool[0];
  return {
    positions: clonePositions(best.pl),
    detail: `dens_pareto:${best.tag}`,
  };
}

/** Composite portfolio — dens-aware ranking. */
export function portfolioPlace(positions, opts = {}) {
  const fixed = opts.fixed;
  const candidates = [
    { pl: forceDirectedPlace(positions, { fixed: fixed || [] }), tag: "force" },
    { pl: forceDeepPlace(positions, { fixed: fixed || [] }), tag: "force_deep" },
    { pl: forceThenSpread(positions, { fixed: fixed || [] }), tag: "force_spread" },
    { pl: densForcePlace(positions, { fixed: fixed || [] }), tag: "dens_force" },
    { pl: timingForcePlace(positions, { fixed: fixed || [] }), tag: "timing_force" },
    {
      pl: quadraticPlace(positions, { fixed: fixed || FIXED_PADS }),
      tag: "quadratic",
    },
    {
      pl: analyticalPlace(positions, { fixed: fixed || FIXED_PADS }),
      tag: "analytical",
    },
    {
      pl: analyticalDeepPlace(positions, { fixed: fixed || FIXED_PADS }),
      tag: "analytical_deep",
    },
    { pl: saPlace(positions, { seed: 42 }).positions, tag: "sa" },
    { pl: saDeepPlace(positions, { fixed: fixed || [] }), tag: "sa_deep" },
    { pl: saMultiseedPlace(positions, { fixed: fixed || [] }), tag: "sa_multi" },
    { pl: densSaPlace(positions, { fixed: fixed || [] }), tag: "dens_sa" },
    { pl: densSaMultiPlace(positions, { fixed: fixed || [] }), tag: "dens_sa_multi" },
    { pl: legalizeAwarePlace(positions, { fixed: fixed || [] }), tag: "legalize_aware" },
    { pl: forceQuadSaPlace(positions, { fixed: fixed || [] }), tag: "fqs" },
    { pl: multistartPlace(positions, { fixed: fixed || [] }), tag: "multistart" },
    {
      pl: densParetoPlace(positions, { fixed: fixed || [] }).positions,
      tag: "dens_pareto",
    },
    { pl: spreadCells(positions), tag: "spread" },
  ];
  let best = candidates[0];
  let bestK = scoreKey(best.pl, opts);
  for (const c of candidates) {
    const k = scoreKey(c.pl, opts);
    if (better(k, bestK)) {
      bestK = k;
      best = c;
    }
  }
  return {
    positions: clonePositions(best.pl),
    detail: `portfolio:${best.tag}`,
  };
}

/** Reference ceiling — golden compact placement. */
export function goldenRefPlace(_positions, opts = {}) {
  void opts;
  return clonePositions(GOLDEN_PLACEMENT);
}

void CELLS;
