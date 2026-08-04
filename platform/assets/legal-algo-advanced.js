/**
 * Advanced legalizers for the legalization benchmark.
 * Built on abacusLegalize with alternate orders, HPWL costs, polish, portfolio.
 */
import {
  CELLS,
  CHIP_W,
  NETS,
  ROW_YS,
  abacusLegalize,
  cellWidth,
  clonePositions,
  isLegal,
  legalizeCost,
  totalDisplacement,
  totalHpwl,
} from "./legalization-core.js";

function xOrder(positions) {
  return [...CELLS].sort(
    (a, b) => positions[a].x - positions[b].x || a.localeCompare(b)
  );
}

function widthOrder(positions) {
  return [...CELLS].sort(
    (a, b) =>
      cellWidth(b) - cellWidth(a) ||
      positions[a].x - positions[b].x ||
      a.localeCompare(b)
  );
}

function yThenXOrder(positions) {
  return [...CELLS].sort(
    (a, b) =>
      positions[a].y - positions[b].y ||
      positions[a].x - positions[b].x ||
      a.localeCompare(b)
  );
}

function reverseXOrder(positions) {
  return [...CELLS].sort(
    (a, b) => positions[b].x - positions[a].x || a.localeCompare(b)
  );
}

/** First-fit decreasing width → Abacus with that order. */
export function widthFirstLegalize(positions, opts = {}) {
  return abacusLegalize(positions, {
    ...opts,
    order: widthOrder(positions),
  });
}

/**
 * HPWL-aware Abacus: cost = L1 disp + λ · incremental HPWL contribution
 * of nets that touch this cell (unplaced pins use origin).
 */
export function hpwlAwareLegalize(positions, opts = {}) {
  const lambda = opts.lambda ?? 1.5;
  const origin = clonePositions(positions);

  const partialHpwl = (id, cand, placed) => {
    const trial = { ...placed, [id]: cand };
    let s = 0;
    for (const net of NETS) {
      if (!net.includes(id)) continue;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const pin of net) {
        const p = trial[pin] || origin[pin];
        const cx = p.x + cellWidth(pin) / 2;
        const cy = p.y + 1; // ROW_H/2
        minX = Math.min(minX, cx);
        maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy);
        maxY = Math.max(maxY, cy);
      }
      s += maxX - minX + (maxY - minY);
    }
    return s;
  };

  return abacusLegalize(positions, {
    ...opts,
    order: xOrder(positions),
    costFn: (id, cand, placed) => {
      const disp =
        Math.abs(cand.x - origin[id].x) + Math.abs(cand.y - origin[id].y);
      return disp + lambda * partialHpwl(id, cand, placed);
    },
  });
}

/** Try several Abacus orders; keep legal min cost (λ=1), else best disp. */
export function multistartAbacus(positions, opts = {}) {
  const candidates = [
    abacusLegalize(positions, { ...opts, order: xOrder(positions) }),
    abacusLegalize(positions, { ...opts, order: reverseXOrder(positions) }),
    abacusLegalize(positions, { ...opts, order: widthOrder(positions) }),
    abacusLegalize(positions, { ...opts, order: yThenXOrder(positions) }),
    widthFirstLegalize(positions, opts),
    hpwlAwareLegalize(positions, opts),
  ];
  let best = candidates[0];
  let bestScore = Infinity;
  for (const pl of candidates) {
    const legal = isLegal(pl, opts) ? 0 : 1e9;
    const score = legal + legalizeCost(pl, positions, 1);
    if (score < bestScore) {
      bestScore = score;
      best = pl;
    }
  }
  return best;
}

/**
 * Abacus seed + local polish: same-row adjacent swaps and single-cell reinsert
 * that reduce cost while staying legal.
 */
export function localPolishLegalize(positions, opts = {}) {
  const fixed = opts.fixed || {};
  let cur = abacusLegalize(positions, opts);
  const origin = clonePositions(positions);
  let bestCost = legalizeCost(cur, origin, 1);

  const tryAccept = (next) => {
    if (!isLegal(next, opts)) return false;
    const c = legalizeCost(next, origin, 1);
    if (c + 1e-9 < bestCost) {
      cur = next;
      bestCost = c;
      return true;
    }
    return false;
  };

  // Same-row pairwise swaps (fixed cells stay)
  for (let pass = 0; pass < 3; pass++) {
    let improved = false;
    for (let i = 0; i < CELLS.length; i++) {
      for (let j = i + 1; j < CELLS.length; j++) {
        const a = CELLS[i];
        const b = CELLS[j];
        if (fixed[a] || fixed[b]) continue;
        if (cur[a].y !== cur[b].y) continue;
        if (cellWidth(a) !== cellWidth(b)) continue;
        const next = clonePositions(cur);
        const ax = next[a].x;
        next[a] = { x: next[b].x, y: next[a].y };
        next[b] = { x: ax, y: next[b].y };
        if (tryAccept(next)) improved = true;
      }
    }
    if (!improved) break;
  }

  // Single-cell reinsert via mini Abacus on that cell alone
  for (const id of CELLS) {
    if (fixed[id]) continue;
    const without = clonePositions(cur);
    delete without[id];
    // Build occupied from without and try rows
    let bestLocal = null;
    let bestLocalCost = Infinity;
    const w = cellWidth(id);
    for (const y of ROW_YS) {
      const occupied = Object.entries(without)
        .filter(([, p]) => p.y === y)
        .map(([cid, p]) => ({
          x0: p.x,
          x1: p.x + cellWidth(cid),
        }))
        .sort((a, b) => a.x0 - b.x0);
      for (let xx = 0; xx <= CHIP_W - w; xx++) {
        let hit = false;
        for (const o of occupied) {
          if (xx < o.x1 && xx + w > o.x0) {
            hit = true;
            break;
          }
        }
        if (hit) continue;
        const trial = { ...without, [id]: { x: xx, y } };
        if (!isLegal(trial, opts)) continue;
        const c = legalizeCost(trial, origin, 1);
        if (c < bestLocalCost) {
          bestLocalCost = c;
          bestLocal = trial;
        }
      }
    }
    if (bestLocal && bestLocalCost + 1e-9 < bestCost) {
      cur = bestLocal;
      bestCost = bestLocalCost;
    }
  }

  return cur;
}

/**
 * Composite portfolio: run several engines, pick legal min cost then min disp.
 */
export function portfolioLegalize(positions, opts = {}) {
  const candidates = [
    { pl: abacusLegalize(positions, opts), tag: "abacus" },
    { pl: widthFirstLegalize(positions, opts), tag: "width_first" },
    { pl: hpwlAwareLegalize(positions, opts), tag: "hpwl_aware" },
    { pl: multistartAbacus(positions, opts), tag: "multistart" },
    { pl: localPolishLegalize(positions, opts), tag: "polish" },
  ];
  let best = candidates[0];
  let bestKey = [1, Infinity, Infinity];
  for (const c of candidates) {
    const legal = isLegal(c.pl, opts);
    const disp = totalDisplacement(positions, c.pl);
    const cost = legalizeCost(c.pl, positions, 1);
    const key = [legal ? 0 : 1, cost, disp];
    if (
      key[0] < bestKey[0] ||
      (key[0] === bestKey[0] && key[1] < bestKey[1]) ||
      (key[0] === bestKey[0] && key[1] === bestKey[1] && key[2] < bestKey[2])
    ) {
      bestKey = key;
      best = c;
    }
  }
  return { positions: best.pl, detail: `portfolio:${best.tag}`, hpwl: totalHpwl(best.pl) };
}
