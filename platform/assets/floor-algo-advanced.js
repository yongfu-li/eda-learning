/**
 * Advanced floorplanning engines for the floorplan benchmark.
 */
import {
  GOLDEN_BSTAR,
  GOLDEN_PACK,
  GOLDEN_POLISH,
  GOLDEN_SP,
  OUTLINE,
  TINY_MODULES,
  clonePack,
  cost,
  evalPolish,
  hpwl,
  isLegalPacking,
  packBstar,
  packHierarchical,
  packSequencePair,
  packToList,
  resizeSoft,
  saSwap,
} from "./floorplanning-core.js";

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

export function bboxStats(pack) {
  const list = packToList(pack);
  if (!list.length) return { w: 0, h: 0, area: 0, aspect: 1 };
  const w = Math.max(...list.map((r) => r.x + r.w));
  const h = Math.max(...list.map((r) => r.y + r.h));
  return { w, h, area: w * h, aspect: h > 0 ? w / h : 1 };
}

function scoreKey(pack, outline = OUTLINE) {
  const legal = isLegalPacking(pack, outline) ? 0 : 1;
  const c = cost(pack, outline);
  const wire = hpwl(pack);
  const bb = bboxStats(pack);
  return [legal, c, wire, bb.area];
}

function better(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > 1e-9) return a[i] < b[i];
  }
  return false;
}

/** Clamp modules into outline; leave overlaps for a later pass. */
export function clampToOutline(pack, outline = OUTLINE) {
  const next = clonePack(pack);
  for (const id of Object.keys(next)) {
    const r = next[id];
    r.x = Math.max(0, Math.min(outline.w - r.w, r.x));
    r.y = Math.max(0, Math.min(outline.h - r.h, r.y));
  }
  return next;
}

/**
 * Greedy overlap repair: for each overlapping pair, nudge the later id
 * right or up until clear or outline-bound.
 */
export function repairOverlaps(pack, outline = OUTLINE) {
  let next = clampToOutline(pack, outline);
  const ids = Object.keys(next).sort();
  for (let pass = 0; pass < 40; pass++) {
    let moved = false;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = next[ids[i]];
        const b = next[ids[j]];
        if (
          a.x + a.w <= b.x ||
          b.x + b.w <= a.x ||
          a.y + a.h <= b.y ||
          b.y + b.h <= a.y
        ) {
          continue;
        }
        // Prefer push b right; else up
        const rightX = a.x + a.w;
        const upY = a.y + a.h;
        if (rightX + b.w <= outline.w) {
          b.x = rightX;
          moved = true;
        } else if (upY + b.h <= outline.h) {
          b.y = upY;
          moved = true;
        } else {
          b.x = Math.max(0, outline.w - b.w);
          b.y = Math.max(0, outline.h - b.h);
          moved = true;
        }
      }
    }
    next = clampToOutline(next, outline);
    if (!moved && isLegalPacking(next, outline)) break;
  }
  return next;
}

/** Bottom-left fill: place modules in given order at lowest-left free slot. */
export function bottomLeftPack(order, modules = TINY_MODULES, outline = OUTLINE) {
  const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
  const placed = [];
  const pack = {};
  for (const id of order) {
    const m = byId[id];
    if (!m) continue;
    let best = null;
    for (let y = 0; y <= outline.h - m.h; y++) {
      for (let x = 0; x <= outline.w - m.w; x++) {
        const cand = { id, x, y, w: m.w, h: m.h };
        let ok = true;
        for (const p of placed) {
          if (
            !(
              cand.x + cand.w <= p.x ||
              p.x + p.w <= cand.x ||
              cand.y + cand.h <= p.y ||
              p.y + p.h <= cand.y
            )
          ) {
            ok = false;
            break;
          }
        }
        if (ok) {
          best = cand;
          break;
        }
      }
      if (best) break;
    }
    if (!best) {
      // Fallback: clamp at origin-ish
      best = {
        id,
        x: 0,
        y: 0,
        w: m.w,
        h: m.h,
      };
    }
    placed.push(best);
    pack[id] = { x: best.x, y: best.y, w: best.w, h: best.h };
  }
  return pack;
}

export function bottomLeftDefault(modules = TINY_MODULES, outline = OUTLINE) {
  return bottomLeftPack(
    modules.map((m) => m.id),
    modules,
    outline
  );
}

/** SA on pack via coordinate swaps + small jogs; Metropolis on cost(). */
export function saFloorplan(pack, opts = {}) {
  const outline = opts.outline || OUTLINE;
  const moves = opts.moves ?? 200;
  const t0 = opts.t0 ?? 8;
  const cool = opts.cool ?? 0.96;
  const seed = opts.seed ?? 42;
  const locked = new Set(opts.lockedIds || []);
  const rand = mulberry32(seed);
  let cur = clonePack(pack);
  let curCost = cost(cur, outline);
  let best = clonePack(cur);
  let bestCost = curCost;
  let T = t0;
  const ids = Object.keys(cur).filter((id) => !locked.has(id));

  for (let m = 0; m < moves; m++) {
    let trial;
    if (ids.length >= 2 && rand() < 0.55) {
      const a = ids[Math.floor(rand() * ids.length)];
      let b = ids[Math.floor(rand() * ids.length)];
      if (b === a) b = ids[(ids.indexOf(a) + 1) % ids.length];
      trial = saSwap(cur, a, b);
    } else {
      trial = clonePack(cur);
      const id = ids[Math.floor(rand() * ids.length)] || Object.keys(cur)[0];
      const axis = rand() < 0.5 ? "x" : "y";
      const delta = (rand() < 0.5 ? -1 : 1) * (1 + Math.floor(rand() * 2));
      trial[id][axis] += delta;
      trial = clampToOutline(trial, outline);
    }
    const nextCost = cost(trial, outline);
    const d = nextCost - curCost;
    if (d <= 0 || rand() < Math.exp(-d / Math.max(T, 1e-9))) {
      cur = trial;
      curCost = nextCost;
      if (curCost < bestCost) {
        bestCost = curCost;
        best = clonePack(cur);
      }
    }
    T *= cool;
  }
  return best;
}

/** Multi-seed SA from a seed pack. */
export function saMultiseedFloorplan(pack, opts = {}) {
  const seeds = opts.seeds || [7, 42, 99, 123, 256];
  let best = null;
  let bestK = [Infinity, Infinity, Infinity, Infinity];
  for (const seed of seeds) {
    const pl = saFloorplan(pack, {
      ...opts,
      seed,
      moves: opts.moves ?? 160,
    });
    const k = scoreKey(pl, opts.outline || OUTLINE);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best || clonePack(pack);
}

/** Repair illegal seed then SA polish. */
export function repairThenSa(pack, opts = {}) {
  const repaired = repairOverlaps(pack, opts.outline || OUTLINE);
  return saFloorplan(repaired, { ...opts, moves: opts.moves ?? 180 });
}

/** Enumerate a few polish permutations (token operand swaps). */
export function polishSearch(modules = TINY_MODULES, outline = OUTLINE) {
  const base = [...GOLDEN_POLISH];
  const operands = base.filter((t) => t !== "H" && t !== "V");
  const candidates = [evalPolish(base, modules).pack];
  for (let i = 0; i < operands.length; i++) {
    for (let j = i + 1; j < operands.length; j++) {
      const tokens = [...base];
      const ai = tokens.indexOf(operands[i]);
      const bi = tokens.indexOf(operands[j]);
      if (ai < 0 || bi < 0) continue;
      const tmp = tokens[ai];
      tokens[ai] = tokens[bi];
      tokens[bi] = tmp;
      try {
        candidates.push(evalPolish(tokens, modules).pack);
      } catch {
        /* skip invalid */
      }
    }
  }
  let best = candidates[0];
  let bestK = scoreKey(best, outline);
  for (const pl of candidates) {
    const k = scoreKey(pl, outline);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best;
}

/** Random SP pairs + pack; keep best legal/cost. */
export function spMultistart(modules = TINY_MODULES, outline = OUTLINE, opts = {}) {
  const ids = modules.map((m) => m.id);
  const rand = mulberry32(opts.seed ?? 42);
  const trials = opts.trials ?? 24;
  const candidates = [
    packSequencePair(GOLDEN_SP.pos, GOLDEN_SP.neg, modules),
  ];
  for (let t = 0; t < trials; t++) {
    const pos = [...ids];
    const neg = [...ids];
    // Fisher–Yates
    for (let i = pos.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [pos[i], pos[j]] = [pos[j], pos[i]];
    }
    for (let i = neg.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [neg[i], neg[j]] = [neg[j], neg[i]];
    }
    candidates.push(packSequencePair(pos, neg, modules));
  }
  let best = candidates[0];
  let bestK = scoreKey(best, outline);
  for (const pl of candidates) {
    const k = scoreKey(pl, outline);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best;
}

/** Soft-A reshape then bottom-left / golden soft pack variants. */
export function softAwarePack(modules = TINY_MODULES, outline = OUTLINE) {
  const aspects = [0.5, 0.75, 1, 1.5, 2];
  const candidates = [];
  for (const a of aspects) {
    const mods = modules.map((m) => (m.id === "A" && m.soft ? resizeSoft(m, a) : { ...m }));
    candidates.push(bottomLeftPack(mods.map((m) => m.id), mods, outline));
    try {
      candidates.push(evalPolish(GOLDEN_POLISH, mods).pack);
    } catch {
      /* skip */
    }
    candidates.push(packBstar(GOLDEN_BSTAR, mods));
  }
  let best = candidates[0];
  let bestK = scoreKey(best, outline);
  for (const pl of candidates) {
    const k = scoreKey(pl, outline);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best;
}

/**
 * Skyline / shelf packing: place next module on the lowest shelf that fits,
 * else open a new shelf.
 */
export function skylinePack(modules = TINY_MODULES, outline = OUTLINE, opts = {}) {
  const order = opts.order || [...modules].sort((a, b) => b.h - a.h || b.w - a.w);
  const pack = {};
  /** @type {{ y: number, h: number, x: number }[]} */
  const shelves = [];
  for (const m of order) {
    let placed = false;
    for (const sh of shelves) {
      if (m.h <= sh.h && sh.x + m.w <= outline.w) {
        pack[m.id] = { x: sh.x, y: sh.y, w: m.w, h: m.h };
        sh.x += m.w;
        placed = true;
        break;
      }
    }
    if (!placed) {
      const y = shelves.length
        ? Math.max(...shelves.map((s) => s.y + s.h))
        : 0;
      if (y + m.h > outline.h) {
        // Fallback: clamp bottom-left remnant
        pack[m.id] = {
          x: Math.max(0, outline.w - m.w),
          y: Math.max(0, outline.h - m.h),
          w: m.w,
          h: m.h,
        };
      } else {
        pack[m.id] = { x: 0, y, w: m.w, h: m.h };
        shelves.push({ y, h: m.h, x: m.w });
      }
    }
  }
  return repairOverlaps(pack, outline);
}

/** Bottom-left over several order heuristics + random perms. */
export function blPermutePack(modules = TINY_MODULES, outline = OUTLINE, opts = {}) {
  const ids = modules.map((m) => m.id);
  const byArea = [...modules]
    .sort((a, b) => b.w * b.h - a.w * a.h)
    .map((m) => m.id);
  const byHeight = [...modules].sort((a, b) => b.h - a.h).map((m) => m.id);
  const byWidth = [...modules].sort((a, b) => b.w - a.w).map((m) => m.id);
  const orders = [ids, byArea, byHeight, byWidth, [...byArea].reverse()];
  const rand = mulberry32(opts.seed ?? 7);
  const trials = opts.trials ?? 20;
  for (let t = 0; t < trials; t++) {
    const o = [...ids];
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [o[i], o[j]] = [o[j], o[i]];
    }
    orders.push(o);
  }
  let best = bottomLeftPack(orders[0], modules, outline);
  let bestK = scoreKey(best, outline);
  for (const o of orders) {
    const pl = bottomLeftPack(o, modules, outline);
    const k = scoreKey(pl, outline);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best;
}

/**
 * Compact: repeatedly push each unlocked module left then down while legal.
 */
export function compactPack(pack, opts = {}) {
  const outline = opts.outline || OUTLINE;
  const locked = new Set(opts.lockedIds || []);
  let next = clampToOutline(pack, outline);
  const ids = Object.keys(next)
    .filter((id) => !locked.has(id))
    .sort();
  for (let pass = 0; pass < 8; pass++) {
    let moved = false;
    for (const id of ids) {
      for (const axis of ["x", "y"]) {
        while (next[id][axis] > 0) {
          const trial = clonePack(next);
          trial[id][axis] -= 1;
          if (!isLegalPacking(trial, outline)) break;
          next = trial;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return next;
}

/**
 * Wire force: spring attraction along TINY_NETS centers, then repair + compact.
 */
export function wireForcePack(pack, opts = {}) {
  const outline = opts.outline || OUTLINE;
  const locked = new Set(opts.lockedIds || []);
  const nets = opts.nets || [
    ["A", "B"],
    ["B", "C"],
    ["C", "E"],
    ["A", "D"],
    ["D", "B"],
  ];
  const iters = opts.iters ?? 40;
  const strength = opts.strength ?? 0.35;
  let cur = clonePack(pack);
  const ids = Object.keys(cur);

  for (let it = 0; it < iters; it++) {
    const force = Object.fromEntries(ids.map((id) => [id, { x: 0, y: 0 }]));
    for (const net of nets) {
      const pts = net.map((id) => cur[id]).filter(Boolean);
      if (pts.length < 2) continue;
      let cx = 0;
      let cy = 0;
      for (const r of pts) {
        cx += r.x + r.w / 2;
        cy += r.y + r.h / 2;
      }
      cx /= pts.length;
      cy /= pts.length;
      for (const id of net) {
        if (!cur[id] || locked.has(id)) continue;
        const r = cur[id];
        force[id].x += (cx - (r.x + r.w / 2)) * strength;
        force[id].y += (cy - (r.y + r.h / 2)) * strength;
      }
    }
    for (const id of ids) {
      if (locked.has(id)) continue;
      cur[id].x += force[id].x;
      cur[id].y += force[id].y;
    }
    cur = clampToOutline(cur, outline);
  }
  // Snap to integers
  for (const id of ids) {
    cur[id].x = Math.round(cur[id].x);
    cur[id].y = Math.round(cur[id].y);
  }
  cur = repairOverlaps(cur, outline);
  return compactPack(cur, opts);
}

/**
 * Sequence-pair simulated annealing: swap two modules in Γ+ or Γ−.
 */
export function spSaPack(modules = TINY_MODULES, outline = OUTLINE, opts = {}) {
  const ids = modules.map((m) => m.id);
  const rand = mulberry32(opts.seed ?? 42);
  const moves = opts.moves ?? 280;
  let pos = [...(opts.pos || GOLDEN_SP.pos)];
  let neg = [...(opts.neg || GOLDEN_SP.neg)];
  // Ensure all ids present
  for (const id of ids) {
    if (!pos.includes(id)) pos.push(id);
    if (!neg.includes(id)) neg.push(id);
  }
  pos = pos.filter((id) => ids.includes(id));
  neg = neg.filter((id) => ids.includes(id));

  let curPack = packSequencePair(pos, neg, modules);
  let curCost = cost(curPack, outline);
  let bestPack = clonePack(curPack);
  let bestCost = curCost;
  let bestPos = [...pos];
  let bestNeg = [...neg];
  let T = opts.t0 ?? 12;
  const cool = opts.cool ?? 0.97;

  for (let m = 0; m < moves; m++) {
    const trialPos = [...pos];
    const trialNeg = [...neg];
    const which = rand() < 0.5 ? trialPos : trialNeg;
    if (which.length >= 2) {
      const i = Math.floor(rand() * which.length);
      let j = Math.floor(rand() * which.length);
      if (j === i) j = (i + 1) % which.length;
      [which[i], which[j]] = [which[j], which[i]];
    }
    const trialPack = packSequencePair(trialPos, trialNeg, modules);
    const nextCost = cost(trialPack, outline);
    const d = nextCost - curCost;
    if (d <= 0 || rand() < Math.exp(-d / Math.max(T, 1e-9))) {
      pos = trialPos;
      neg = trialNeg;
      curPack = trialPack;
      curCost = nextCost;
      if (curCost < bestCost) {
        bestCost = curCost;
        bestPack = clonePack(curPack);
        bestPos = [...pos];
        bestNeg = [...neg];
      }
    }
    T *= cool;
  }
  void bestPos;
  void bestNeg;
  return bestPack;
}

/** Multi-seed SP-SA. */
export function spSaMultiPack(modules = TINY_MODULES, outline = OUTLINE, opts = {}) {
  const seeds = opts.seeds || [3, 42, 77, 101, 211];
  let best = null;
  let bestK = [Infinity, Infinity, Infinity, Infinity];
  for (const seed of seeds) {
    const pl = spSaPack(modules, outline, {
      ...opts,
      seed,
      moves: opts.moves ?? 220,
    });
    const k = scoreKey(pl, outline);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best || packSequencePair(GOLDEN_SP.pos, GOLDEN_SP.neg, modules);
}

/** Deep SA: more moves, cooler schedule, HPWL-sensitive seed repair. */
export function hpwlSaPack(pack, opts = {}) {
  const outline = opts.outline || OUTLINE;
  const repaired = repairOverlaps(pack, outline);
  return saFloorplan(repaired, {
    ...opts,
    moves: opts.moves ?? 420,
    t0: opts.t0 ?? 14,
    cool: opts.cool ?? 0.985,
    seed: opts.seed ?? 42,
  });
}

/**
 * Wire polish chain: force → compact → HPWL SA.
 */
export function wirePolishPack(pack, opts = {}) {
  const forced = wireForcePack(pack, opts);
  return hpwlSaPack(forced, { ...opts, moves: opts.moves ?? 260 });
}

/**
 * Legal Pareto: among legal candidates pick min HPWL; else min illegal/cost.
 */
export function legalParetoPack(seedPack, opts = {}) {
  const modules = opts.modules || TINY_MODULES;
  const outline = opts.outline || OUTLINE;
  const candidates = [
    clonePack(GOLDEN_PACK),
    skylinePack(modules, outline),
    blPermutePack(modules, outline),
    spMultistart(modules, outline, { trials: 20 }),
    spSaPack(modules, outline, { moves: 200 }),
    softAwarePack(modules, outline),
    wireForcePack(seedPack, opts),
    repairThenSa(seedPack, { ...opts, moves: 140 }),
    wirePolishPack(seedPack, { ...opts, moves: 180 }),
    compactPack(repairOverlaps(seedPack, outline), opts),
  ];
  const legal = candidates.filter((p) => isLegalPacking(p, outline));
  const pool = legal.length ? legal : candidates;
  let best = pool[0];
  let bestWire = hpwl(best);
  let bestK = scoreKey(best, outline);
  for (const pl of pool) {
    if (legal.length) {
      const w = hpwl(pl);
      if (w < bestWire - 1e-9) {
        bestWire = w;
        best = pl;
      } else if (Math.abs(w - bestWire) < 1e-9) {
        const k = scoreKey(pl, outline);
        if (better(k, bestK)) {
          bestK = k;
          best = pl;
        }
      }
    } else {
      const k = scoreKey(pl, outline);
      if (better(k, bestK)) {
        bestK = k;
        best = pl;
      }
    }
  }
  return clonePack(best);
}

/** Multistart across representations + SA. */
export function multistartFloorplan(seedPack, opts = {}) {
  const modules = opts.modules || TINY_MODULES;
  const outline = opts.outline || OUTLINE;
  const candidates = [
    clonePack(GOLDEN_PACK),
    evalPolish(GOLDEN_POLISH, modules).pack,
    packBstar(GOLDEN_BSTAR, modules),
    packSequencePair(GOLDEN_SP.pos, GOLDEN_SP.neg, modules),
    packHierarchical(),
    bottomLeftDefault(modules, outline),
    polishSearch(modules, outline),
    spMultistart(modules, outline, { seed: 42, trials: 16 }),
    skylinePack(modules, outline),
    blPermutePack(modules, outline),
    spSaPack(modules, outline, { moves: 180 }),
    wireForcePack(seedPack, opts),
    wirePolishPack(seedPack, { ...opts, moves: 160 }),
    repairThenSa(seedPack, { ...opts, moves: 120 }),
    saMultiseedFloorplan(seedPack, { ...opts, seeds: [42, 7, 99] }),
  ];
  let best = candidates[0];
  let bestK = scoreKey(best, outline);
  for (const pl of candidates) {
    const k = scoreKey(pl, outline);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best;
}

/** Portfolio — min legal/cost across engines. */
export function portfolioFloorplan(seedPack, opts = {}) {
  const modules = opts.modules || TINY_MODULES;
  const outline = opts.outline || OUTLINE;
  const candidates = [
    { pack: clonePack(GOLDEN_PACK), tag: "golden" },
    { pack: evalPolish(GOLDEN_POLISH, modules).pack, tag: "polish" },
    { pack: packBstar(GOLDEN_BSTAR, modules), tag: "bstar" },
    {
      pack: packSequencePair(GOLDEN_SP.pos, GOLDEN_SP.neg, modules),
      tag: "sp",
    },
    { pack: packHierarchical(), tag: "hierarchical" },
    { pack: bottomLeftDefault(modules, outline), tag: "bottom_left" },
    { pack: polishSearch(modules, outline), tag: "polish_search" },
    { pack: spMultistart(modules, outline), tag: "sp_multi" },
    { pack: softAwarePack(modules, outline), tag: "soft" },
    { pack: skylinePack(modules, outline), tag: "skyline" },
    { pack: blPermutePack(modules, outline), tag: "bl_permute" },
    { pack: spSaPack(modules, outline), tag: "sp_sa" },
    { pack: spSaMultiPack(modules, outline), tag: "sp_sa_multi" },
    { pack: wireForcePack(seedPack, opts), tag: "wire_force" },
    { pack: compactPack(repairOverlaps(seedPack, outline), opts), tag: "compact" },
    { pack: hpwlSaPack(seedPack, opts), tag: "hpwl_sa" },
    { pack: wirePolishPack(seedPack, opts), tag: "wire_polish" },
    { pack: legalParetoPack(seedPack, opts), tag: "legal_pareto" },
    { pack: repairOverlaps(seedPack, outline), tag: "repair" },
    { pack: repairThenSa(seedPack, opts), tag: "repair_sa" },
    { pack: saFloorplan(seedPack, opts), tag: "sa" },
    { pack: saMultiseedFloorplan(seedPack, opts), tag: "sa_multi" },
    { pack: multistartFloorplan(seedPack, opts), tag: "multistart" },
  ];
  let best = candidates[0];
  let bestK = scoreKey(best.pack, outline);
  for (const c of candidates) {
    const k = scoreKey(c.pack, outline);
    if (better(k, bestK)) {
      bestK = k;
      best = c;
    }
  }
  return {
    pack: clonePack(best.pack),
    detail: `portfolio:${best.tag}`,
  };
}
