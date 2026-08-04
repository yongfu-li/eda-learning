/**
 * Advanced congestion relievers for the congestion benchmark.
 */
import {
  CAPACITY,
  CELLS,
  CELL_H,
  CELL_W,
  CHIP_H,
  CHIP_W,
  GCELL_NX,
  GCELL_NY,
  NETS,
  cellGcell,
  clonePositions,
  congestionMap,
  netWeightsFromCongestion,
  overflowMetrics,
  placementFeedbackLite,
  probabilisticDemand,
  rudyDemand,
  totalHpwl,
} from "./congestion-core.js";

function pushFromOverflow(positions, capacity, demandFn, strength = 0.5) {
  const demand = demandFn(positions);
  const ov = overflowMetrics(demand, capacity).perCell;
  const out = clonePositions(positions);
  for (const id of Object.keys(out)) {
    const p = out[id];
    const { i, j } = cellGcell(p.x, p.y);
    if (ov[i][j] <= 0) continue;
    let best = { i, j, v: ov[i][j] };
    for (const [di, dj] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ]) {
      const ni = i + di;
      const nj = j + dj;
      if (
        ni >= 0 &&
        ni < GCELL_NX &&
        nj >= 0 &&
        nj < GCELL_NY &&
        ov[ni][nj] < best.v
      ) {
        best = { i: ni, j: nj, v: ov[ni][nj] };
      }
    }
    const tx = (best.i + 0.5) * CELL_W;
    const ty = (best.j + 0.5) * CELL_H;
    out[id] = {
      x: Math.max(0, Math.min(CHIP_W - 1, (1 - strength) * p.x + strength * tx)),
      y: Math.max(0, Math.min(CHIP_H - 1, (1 - strength) * p.y + strength * ty)),
    };
  }
  return out;
}

/** Multi-pass RUDY feedback. */
export function multipassFeedback(positions, opts = {}) {
  const capacity = opts.capacity ?? CAPACITY;
  const passes = opts.passes ?? 3;
  let cur = clonePositions(positions);
  for (let i = 0; i < passes; i++) {
    cur = placementFeedbackLite(cur, capacity);
  }
  return cur;
}

/** Feedback driven by probabilistic demand corridors. */
export function probabilisticFeedback(positions, opts = {}) {
  const capacity = opts.capacity ?? CAPACITY;
  const passes = opts.passes ?? 2;
  let cur = clonePositions(positions);
  for (let i = 0; i < passes; i++) {
    cur = pushFromOverflow(cur, capacity, probabilisticDemand, 0.55);
  }
  return cur;
}

/** Stronger diagonal-aware push (RUDY). */
export function strongSpreadFeedback(positions, opts = {}) {
  const capacity = opts.capacity ?? CAPACITY;
  const passes = opts.passes ?? 2;
  let cur = clonePositions(positions);
  for (let i = 0; i < passes; i++) {
    cur = pushFromOverflow(cur, capacity, rudyDemand, 0.65);
  }
  return cur;
}

/**
 * Net-weight guided: overweight nets through hot tiles, then pull endpoints
 * slightly toward bbox center of quieter nets / away from hot center.
 */
export function netWeightRelieve(positions, opts = {}) {
  const capacity = opts.capacity ?? CAPACITY;
  const demand = rudyDemand(positions);
  const cong = congestionMap(demand, capacity);
  const weights = netWeightsFromCongestion(positions, cong, opts.beta ?? 1.5);
  const out = clonePositions(positions);
  // For each heavily weighted net, nudge pins apart along bbox diagonal
  NETS.forEach((net, ni) => {
    const w = weights[ni] || 1;
    if (w <= 1.15 || net.length < 2) return;
    let cx = 0;
    let cy = 0;
    for (const id of net) {
      cx += out[id].x;
      cy += out[id].y;
    }
    cx /= net.length;
    cy /= net.length;
    const push = Math.min(0.35, 0.08 * (w - 1));
    for (const id of net) {
      const p = out[id];
      const dx = p.x - cx;
      const dy = p.y - cy;
      const len = Math.hypot(dx, dy) || 1;
      out[id] = {
        x: Math.max(0, Math.min(CHIP_W - 1, p.x + (dx / len) * push * 2)),
        y: Math.max(0, Math.min(CHIP_H - 1, p.y + (dy / len) * push * 2)),
      };
    }
  });
  return placementFeedbackLite(out, capacity);
}

function scoreOv(positions, capacity) {
  return overflowMetrics(rudyDemand(positions), capacity);
}

/** Portfolio: try several relievers; keep legal min total overflow then max then HPWL. */
export function portfolioRelieve(positions, opts = {}) {
  const capacity = opts.capacity ?? CAPACITY;
  const candidates = [
    { pl: clonePositions(positions), tag: "identity" },
    { pl: placementFeedbackLite(positions, capacity), tag: "feedback" },
    { pl: multipassFeedback(positions, { ...opts, passes: 3 }), tag: "multipass" },
    { pl: probabilisticFeedback(positions, opts), tag: "prob_fb" },
    { pl: strongSpreadFeedback(positions, opts), tag: "strong" },
    { pl: netWeightRelieve(positions, opts), tag: "net_weight" },
  ];
  let best = candidates[0];
  let bestKey = [Infinity, Infinity, Infinity];
  for (const c of candidates) {
    const ov = scoreOv(c.pl, capacity);
    const hpwl = totalHpwl(c.pl);
    const key = [ov.total, ov.max, hpwl];
    if (
      key[0] < bestKey[0] ||
      (key[0] === bestKey[0] && key[1] < bestKey[1]) ||
      (key[0] === bestKey[0] && key[1] === bestKey[1] && key[2] < bestKey[2])
    ) {
      bestKey = key;
      best = c;
    }
  }
  return {
    positions: best.pl,
    detail: `portfolio:${best.tag}`,
    demand: rudyDemand(best.pl),
  };
}

/** Pure estimators — return demand without moving cells. */
export function rudyEstimate(positions) {
  return { positions: clonePositions(positions), demand: rudyDemand(positions), detail: "rudy" };
}

export function probabilisticEstimate(positions) {
  return {
    positions: clonePositions(positions),
    demand: probabilisticDemand(positions),
    detail: "probabilistic",
  };
}

void CELLS;
