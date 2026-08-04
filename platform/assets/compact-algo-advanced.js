/**
 * Advanced compaction engines for the compaction benchmark.
 */
import {
  CHIP,
  MIN_GAP,
  STARTER,
  addJog,
  bbox,
  cloneObjects,
  compact1d,
  compact2d,
  isLegal,
  layoutStats,
  sequentialCompact,
  shearChannelLite,
  stretchWireToBbox,
} from "./compaction-core.js";

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

export function compactCost(objects, chip = CHIP, minGap = MIN_GAP) {
  const st = layoutStats(objects, chip);
  const illegal = isLegal(objects, minGap) ? 0 : 1000;
  return illegal + st.width * 10 + st.height * 10 + st.width * st.height * 0.05;
}

function scoreKey(objects, chip = CHIP, minGap = MIN_GAP) {
  const legal = isLegal(objects, minGap) ? 0 : 1;
  const st = layoutStats(objects, chip);
  const area = st.width * st.height;
  return [legal, area, st.width, st.height];
}

function better(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > 1e-9) return a[i] < b[i];
  }
  return false;
}

function retargetWires(objects) {
  const bb = bbox(objects);
  return objects.map((o) => (o.kind === "wire" ? stretchWireToBbox(o, bb) : o));
}

/** Alternate X/Y longest-path until span stops improving. */
export function iterative2d(objects, opts = {}) {
  const maxPasses = opts.maxPasses ?? 6;
  let cur = cloneObjects(objects);
  let st = layoutStats(cur);
  for (let p = 0; p < maxPasses; p++) {
    const axis = p % 2 === 0 ? "x" : "y";
    const r = compact1d(cur, axis);
    cur = r.objects;
    const next = layoutStats(cur);
    if (next.width >= st.width - 1e-9 && next.height >= st.height - 1e-9 && p >= 1) {
      break;
    }
    st = next;
  }
  cur = retargetWires(cur);
  return cur;
}

/** Try several 2-D axis orders; keep best area/legal. */
export function orderSearchCompact(objects, opts = {}) {
  const chip = opts.chip || CHIP;
  const orders = opts.orders || [
    ["x", "y"],
    ["y", "x"],
    ["x", "x", "y"],
    ["y", "y", "x"],
    ["x", "y", "x"],
    ["y", "x", "y"],
  ];
  let best = cloneObjects(objects);
  let bestK = scoreKey(best, chip);
  for (const order of orders) {
    let cur = cloneObjects(objects);
    for (const axis of order) cur = compact1d(cur, axis).objects;
    cur = retargetWires(cur);
    const k = scoreKey(cur, chip);
    if (better(k, bestK)) {
      bestK = k;
      best = cur;
    }
  }
  return best;
}

/** Shear a channel then 2-D compact. */
export function shearThenCompact(objects, opts = {}) {
  const xLo = opts.xLo ?? 6;
  const xHi = opts.xHi ?? 14;
  const deltaY = opts.deltaY ?? -1;
  const sheared = shearChannelLite(objects, xLo, xHi, deltaY).objects;
  return iterative2d(sheared, opts);
}

/** Add a wire jog, then sequential compact. */
export function jogAwareCompact(objects, opts = {}) {
  const jogX = opts.jogX ?? 10;
  const jogY = opts.jogY ?? 8;
  let cur = cloneObjects(objects).map((o) =>
    o.kind === "wire" ? addJog(o, jogX, jogY) : o
  );
  cur = sequentialCompact(cur).objects;
  return cur;
}

/** Push all cells toward origin greedily while legal (per-axis). */
export function greedyPushCompact(objects, opts = {}) {
  const minGap = opts.minGap ?? MIN_GAP;
  const chip = opts.chip || CHIP;
  let cur = cloneObjects(objects);
  const cells = cur.filter((o) => o.kind !== "wire");
  for (const axis of ["x", "y"]) {
    const sorted = [...cells].sort((a, b) =>
      axis === "x" ? a.x0 - b.x0 : a.y0 - b.y0
    );
    for (const cell of sorted) {
      const o = cur.find((x) => x.id === cell.id);
      if (!o || o.kind === "wire") continue;
      const w = o.x1 - o.x0;
      const h = o.y1 - o.y0;
      for (;;) {
        const trial = cloneObjects(cur).map((x) => {
          if (x.id !== o.id) return x;
          if (axis === "x") {
            const nx0 = x.x0 - 1;
            if (nx0 < chip.x0) return x;
            return { ...x, x0: nx0, x1: nx0 + w };
          }
          const ny0 = x.y0 - 1;
          if (ny0 < chip.y0) return x;
          return { ...x, y0: ny0, y1: ny0 + h };
        });
        const moved = trial.find((x) => x.id === o.id);
        if (
          (axis === "x" && moved.x0 === o.x0) ||
          (axis === "y" && moved.y0 === o.y0)
        ) {
          break;
        }
        if (!isLegal(trial, minGap)) break;
        cur = trial;
        Object.assign(o, moved);
      }
    }
  }
  return retargetWires(cur);
}

/** SA: shift one cell by ±1 on an axis; Metropolis on compactCost. */
export function saShiftCompact(objects, opts = {}) {
  const chip = opts.chip || CHIP;
  const minGap = opts.minGap ?? MIN_GAP;
  const moves = opts.moves ?? 240;
  const seed = opts.seed ?? 42;
  const rand = mulberry32(seed);
  let cur = cloneObjects(objects);
  let curCost = compactCost(cur, chip, minGap);
  let best = cloneObjects(cur);
  let bestCost = curCost;
  let T = opts.t0 ?? 20;
  const cool = opts.cool ?? 0.97;
  const cells = cur.filter((o) => o.kind !== "wire").map((o) => o.id);

  for (let m = 0; m < moves; m++) {
    if (!cells.length) break;
    const id = cells[Math.floor(rand() * cells.length)];
    const axis = rand() < 0.5 ? "x" : "y";
    const delta = rand() < 0.5 ? -1 : 1;
    const trial = cloneObjects(cur).map((o) => {
      if (o.id !== id) return o;
      if (axis === "x") {
        const nx0 = o.x0 + delta;
        const nx1 = o.x1 + delta;
        if (nx0 < chip.x0 || nx1 > chip.x1) return o;
        return { ...o, x0: nx0, x1: nx1 };
      }
      const ny0 = o.y0 + delta;
      const ny1 = o.y1 + delta;
      if (ny0 < chip.y0 || ny1 > chip.y1) return o;
      return { ...o, y0: ny0, y1: ny1 };
    });
    const nextCost = compactCost(trial, chip, minGap);
    const d = nextCost - curCost;
    if (d <= 0 || rand() < Math.exp(-d / Math.max(T, 1e-9))) {
      cur = trial;
      curCost = nextCost;
      if (curCost < bestCost) {
        bestCost = curCost;
        best = cloneObjects(cur);
      }
    }
    T *= cool;
  }
  return retargetWires(best);
}

export function saShiftMulti(objects, opts = {}) {
  const seeds = opts.seeds || [7, 42, 99, 123];
  const chip = opts.chip || CHIP;
  let best = null;
  let bestK = [Infinity, Infinity, Infinity, Infinity];
  for (const seed of seeds) {
    const pl = saShiftCompact(objects, { ...opts, seed, moves: opts.moves ?? 180 });
    const k = scoreKey(pl, chip);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best || cloneObjects(objects);
}

/** Constraint-graph compact → SA polish. */
export function graphThenSa(objects, opts = {}) {
  const base = sequentialCompact(objects).objects;
  return saShiftCompact(base, { ...opts, moves: opts.moves ?? 160, t0: 8 });
}

/**
 * Dual / multi shear: try several channels and ΔY, then iterative compact.
 */
export function dualShearCompact(objects, opts = {}) {
  const chip = opts.chip || CHIP;
  const trials = [
    { xLo: 4, xHi: 12, deltaY: -1 },
    { xLo: 6, xHi: 14, deltaY: -1 },
    { xLo: 8, xHi: 16, deltaY: -1 },
    { xLo: 4, xHi: 12, deltaY: 1 },
    { xLo: 6, xHi: 14, deltaY: 1 },
    { xLo: 2, xHi: 10, deltaY: -2 },
    { xLo: 10, xHi: 18, deltaY: -1 },
  ];
  let best = iterative2d(objects, opts);
  let bestK = scoreKey(best, chip);
  for (const t of trials) {
    const sheared = shearChannelLite(objects, t.xLo, t.xHi, t.deltaY).objects;
    const pl = iterative2d(sheared, opts);
    const k = scoreKey(pl, chip);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best;
}

/**
 * Hierarchical: split cells by median X, compact each side, abut with minGap.
 */
export function hierarchicalCompact(objects, opts = {}) {
  const chip = opts.chip || CHIP;
  const minGap = opts.minGap ?? MIN_GAP;
  const cells = objects.filter((o) => o.kind !== "wire");
  const wires = objects.filter((o) => o.kind === "wire");
  if (cells.length < 2) return iterative2d(objects, opts);

  const sorted = [...cells].sort((a, b) => a.x0 - b.x0);
  const mid = Math.ceil(sorted.length / 2);
  const leftIds = new Set(sorted.slice(0, mid).map((c) => c.id));
  const rightIds = new Set(sorted.slice(mid).map((c) => c.id));

  const leftObjs = objects.filter(
    (o) => o.kind === "wire" || leftIds.has(o.id)
  );
  const rightObjs = objects.filter(
    (o) => o.kind === "wire" || rightIds.has(o.id)
  );
  let left = sequentialCompact(leftObjs).objects.filter((o) => o.kind !== "wire");
  let right = sequentialCompact(rightObjs).objects.filter((o) => o.kind !== "wire");

  const leftBb = bbox(left);
  const rightBb = bbox(right);
  const shiftX = leftBb.x1 + minGap - rightBb.x0;
  right = right.map((o) => ({
    ...o,
    x0: o.x0 + shiftX,
    x1: o.x1 + shiftX,
  }));

  let merged = [...left, ...right, ...wires.map((w) => ({ ...w }))];
  merged = iterative2d(merged, opts);
  // Keep inside chip if possible
  const st = layoutStats(merged, chip);
  if (st.bbox.x1 > chip.x1 || st.bbox.y1 > chip.y1) {
    return orderSearchCompact(objects, opts);
  }
  return merged;
}

/**
 * Bottom-left re-pack of cells (fixed sizes) into a tight packing, then wire retarget.
 */
export function tilePackCompact(objects, opts = {}) {
  const chip = opts.chip || CHIP;
  const minGap = opts.minGap ?? MIN_GAP;
  const cells = objects
    .filter((o) => o.kind !== "wire")
    .map((o) => ({
      id: o.id,
      w: o.x1 - o.x0,
      h: o.y1 - o.y0,
      kind: "cell",
    }));
  const wires = objects.filter((o) => o.kind === "wire");
  const orders = [
    [...cells].sort((a, b) => b.h - a.h || b.w - a.w),
    [...cells].sort((a, b) => b.w * b.h - a.w * a.h),
    [...cells].sort((a, b) => b.w - a.w),
    cells,
  ];

  function packOrder(order) {
    const placed = [];
    const out = [];
    for (const m of order) {
      let best = null;
      for (let y = chip.y0; y <= chip.y1 - m.h; y++) {
        for (let x = chip.x0; x <= chip.x1 - m.w; x++) {
          const cand = { id: m.id, x0: x, y0: y, x1: x + m.w, y1: y + m.h, kind: "cell" };
          let ok = true;
          for (const p of placed) {
            const dx = Math.max(0, Math.max(cand.x0 - p.x1, p.x0 - cand.x1));
            const dy = Math.max(0, Math.max(cand.y0 - p.y1, p.y0 - cand.y1));
            if (dx === 0 && dy === 0) {
              ok = false;
              break;
            }
            if (dx === 0 && dy > 0 && dy < minGap) {
              ok = false;
              break;
            }
            if (dy === 0 && dx > 0 && dx < minGap) {
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
        best = {
          id: m.id,
          x0: chip.x0,
          y0: chip.y0,
          x1: chip.x0 + m.w,
          y1: chip.y0 + m.h,
          kind: "cell",
        };
      }
      placed.push(best);
      out.push(best);
    }
    return retargetWires([...out, ...wires.map((w) => ({ ...w }))]);
  }

  let best = packOrder(orders[0]);
  let bestK = scoreKey(best, chip);
  for (const o of orders) {
    const pl = packOrder(o);
    const k = scoreKey(pl, chip);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best;
}

/**
 * SA with swaps of cell origins (exchange lower-left) + small jogs.
 */
export function swapSaCompact(objects, opts = {}) {
  const chip = opts.chip || CHIP;
  const minGap = opts.minGap ?? MIN_GAP;
  const moves = opts.moves ?? 280;
  const rand = mulberry32(opts.seed ?? 42);
  let cur = cloneObjects(objects);
  let curCost = compactCost(cur, chip, minGap);
  let best = cloneObjects(cur);
  let bestCost = curCost;
  let T = opts.t0 ?? 24;
  const cool = opts.cool ?? 0.975;
  const cellIds = cur.filter((o) => o.kind !== "wire").map((o) => o.id);

  for (let m = 0; m < moves; m++) {
    let trial = cloneObjects(cur);
    if (cellIds.length >= 2 && rand() < 0.45) {
      const a = cellIds[Math.floor(rand() * cellIds.length)];
      let b = cellIds[Math.floor(rand() * cellIds.length)];
      if (b === a) b = cellIds[(cellIds.indexOf(a) + 1) % cellIds.length];
      const oa = trial.find((o) => o.id === a);
      const ob = trial.find((o) => o.id === b);
      const aw = oa.x1 - oa.x0;
      const ah = oa.y1 - oa.y0;
      const bw = ob.x1 - ob.x0;
      const bh = ob.y1 - ob.y0;
      const ax0 = oa.x0;
      const ay0 = oa.y0;
      oa.x0 = ob.x0;
      oa.y0 = ob.y0;
      oa.x1 = oa.x0 + aw;
      oa.y1 = oa.y0 + ah;
      ob.x0 = ax0;
      ob.y0 = ay0;
      ob.x1 = ob.x0 + bw;
      ob.y1 = ob.y0 + bh;
    } else {
      const id = cellIds[Math.floor(rand() * cellIds.length)];
      const o = trial.find((x) => x.id === id);
      const axis = rand() < 0.5 ? "x" : "y";
      const delta = rand() < 0.5 ? -1 : 1;
      if (axis === "x") {
        o.x0 += delta;
        o.x1 += delta;
        if (o.x0 < chip.x0 || o.x1 > chip.x1) trial = cur;
      } else {
        o.y0 += delta;
        o.y1 += delta;
        if (o.y0 < chip.y0 || o.y1 > chip.y1) trial = cur;
      }
    }
    const nextCost = compactCost(trial, chip, minGap);
    const d = nextCost - curCost;
    if (d <= 0 || rand() < Math.exp(-d / Math.max(T, 1e-9))) {
      cur = trial;
      curCost = nextCost;
      if (curCost < bestCost) {
        bestCost = curCost;
        best = cloneObjects(cur);
      }
    }
    T *= cool;
  }
  return retargetWires(best);
}

/** Order-search seed → deep SA. */
export function deepSaCompact(objects, opts = {}) {
  const seed = orderSearchCompact(objects, opts);
  return saShiftCompact(seed, {
    ...opts,
    moves: opts.moves ?? 400,
    t0: opts.t0 ?? 16,
    cool: opts.cool ?? 0.985,
  });
}

/**
 * Gap-relax: compact with minGap=0 via greedy push, then expand neighbors by MIN_GAP.
 * Falls back to sequential if illegal after expand.
 */
export function gapRelaxCompact(objects, opts = {}) {
  const chip = opts.chip || CHIP;
  const minGap = opts.minGap ?? MIN_GAP;
  let cur = greedyPushCompact(objects, { ...opts, minGap: 0 });
  // Expand: for each overlapping-in-projection pair with gap < minGap, nudge
  const cells = cur.filter((o) => o.kind !== "wire");
  for (let pass = 0; pass < 12; pass++) {
    let moved = false;
    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const a = cur.find((o) => o.id === cells[i].id);
        const b = cur.find((o) => o.id === cells[j].id);
        const dx = Math.max(0, Math.max(a.x0 - b.x1, b.x0 - a.x1));
        const dy = Math.max(0, Math.max(a.y0 - b.y1, b.y0 - a.y1));
        if (dx === 0 && dy === 0) {
          // hard overlap: push b right
          const shift = a.x1 + minGap - b.x0;
          if (shift > 0) {
            b.x0 += shift;
            b.x1 += shift;
            moved = true;
          }
        } else if (dx === 0 && dy > 0 && dy < minGap) {
          const need = minGap - dy;
          if (b.y0 >= a.y1) {
            b.y0 += need;
            b.y1 += need;
          } else {
            a.y0 += need;
            a.y1 += need;
          }
          moved = true;
        } else if (dy === 0 && dx > 0 && dx < minGap) {
          const need = minGap - dx;
          if (b.x0 >= a.x1) {
            b.x0 += need;
            b.x1 += need;
          } else {
            a.x0 += need;
            a.x1 += need;
          }
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  cur = retargetWires(cur);
  if (!isLegal(cur, minGap)) return sequentialCompact(objects).objects;
  // Final graph polish
  return iterative2d(cur, opts);
}

/** Legal area Pareto across engines. */
export function areaParetoCompact(objects, opts = {}) {
  const chip = opts.chip || CHIP;
  const candidates = [
    sequentialCompact(objects).objects,
    orderSearchCompact(objects, opts),
    iterative2d(objects, opts),
    greedyPushCompact(objects, opts),
    dualShearCompact(objects, opts),
    hierarchicalCompact(objects, opts),
    tilePackCompact(objects, opts),
    gapRelaxCompact(objects, opts),
    deepSaCompact(objects, { ...opts, moves: 200 }),
    swapSaCompact(objects, { ...opts, moves: 180 }),
  ];
  const legal = candidates.filter((p) => isLegal(p, opts.minGap ?? MIN_GAP));
  const pool = legal.length ? legal : candidates;
  let best = pool[0];
  let bestK = scoreKey(best, chip);
  for (const pl of pool) {
    const k = scoreKey(pl, chip);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return cloneObjects(best);
}

/** Multistart across geometry engines. */
export function multistartCompact(objects, opts = {}) {
  const chip = opts.chip || CHIP;
  const candidates = [
    cloneObjects(STARTER),
    compact1d(objects, "x").objects,
    compact1d(objects, "y").objects,
    compact2d(objects, ["x", "y"]).objects,
    compact2d(objects, ["y", "x"]).objects,
    sequentialCompact(objects).objects,
    iterative2d(objects, opts),
    orderSearchCompact(objects, opts),
    greedyPushCompact(objects, opts),
    shearThenCompact(objects, opts),
    dualShearCompact(objects, opts),
    jogAwareCompact(objects, opts),
    hierarchicalCompact(objects, opts),
    tilePackCompact(objects, opts),
    gapRelaxCompact(objects, opts),
    deepSaCompact(objects, { ...opts, moves: 160 }),
    graphThenSa(objects, { ...opts, moves: 120 }),
  ];
  let best = candidates[0];
  let bestK = scoreKey(best, chip);
  for (const pl of candidates) {
    const k = scoreKey(pl, chip);
    if (better(k, bestK)) {
      bestK = k;
      best = pl;
    }
  }
  return best;
}

/** Portfolio — best legal/area across engines. */
export function portfolioCompact(objects, opts = {}) {
  const chip = opts.chip || CHIP;
  const candidates = [
    { objects: compact1d(objects, "x").objects, tag: "x" },
    { objects: compact1d(objects, "y").objects, tag: "y" },
    { objects: compact2d(objects, ["x", "y"]).objects, tag: "xy" },
    { objects: compact2d(objects, ["y", "x"]).objects, tag: "yx" },
    { objects: sequentialCompact(objects).objects, tag: "sequential" },
    { objects: iterative2d(objects, opts), tag: "iterative" },
    { objects: orderSearchCompact(objects, opts), tag: "order" },
    { objects: greedyPushCompact(objects, opts), tag: "greedy" },
    { objects: shearThenCompact(objects, opts), tag: "shear" },
    { objects: dualShearCompact(objects, opts), tag: "dual_shear" },
    { objects: jogAwareCompact(objects, opts), tag: "jog" },
    { objects: hierarchicalCompact(objects, opts), tag: "hierarchical" },
    { objects: tilePackCompact(objects, opts), tag: "tile_pack" },
    { objects: gapRelaxCompact(objects, opts), tag: "gap_relax" },
    { objects: swapSaCompact(objects, opts), tag: "swap_sa" },
    { objects: deepSaCompact(objects, opts), tag: "deep_sa" },
    { objects: areaParetoCompact(objects, opts), tag: "area_pareto" },
    { objects: saShiftCompact(objects, opts), tag: "sa" },
    { objects: saShiftMulti(objects, opts), tag: "sa_multi" },
    { objects: graphThenSa(objects, opts), tag: "graph_sa" },
    { objects: multistartCompact(objects, opts), tag: "multistart" },
  ];
  let best = candidates[0];
  let bestK = scoreKey(best.objects, chip);
  for (const c of candidates) {
    const k = scoreKey(c.objects, chip);
    if (better(k, bestK)) {
      bestK = k;
      best = c;
    }
  }
  return {
    objects: cloneObjects(best.objects),
    detail: `portfolio:${best.tag}`,
  };
}
