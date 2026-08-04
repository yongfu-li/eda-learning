/**
 * Tiny legalization instance for browser labs (6 cells, 3 rows).
 * Coordinates: lower-left of each cell; x in site units, y = row bottom.
 *
 * Chip: 12 sites × 3 rows (rowH=2 → H=6). Site pitch = 1.
 * Cell widths: A–D=2, E–F=1. Total width 10 ≤ 12.
 */

import { fitHiDpiCanvas } from "./canvas-hires.js";

export const CELLS = ["A", "B", "C", "D", "E", "F"];

export const WIDTHS = { A: 2, B: 2, C: 2, D: 2, E: 1, F: 1 };

/** Nets (reuse placement connectivity for HPWL). */
export const NETS = [
  ["A", "B"],
  ["C", "D"],
  ["A", "C"],
  ["B", "D"],
  ["A", "B", "C", "D"],
  ["E", "F"],
];

export const SITE_W = 1;
export const ROW_H = 2;
export const N_ROWS = 3;
export const CHIP_W = 12;
export const CHIP_H = N_ROWS * ROW_H; // 6

/** Row bottom y coordinates. */
export const ROW_YS = [0, 2, 4];

/** Macro D locked (fixed-macros lab). */
export const FIXED_MACROS = { D: { x: 8, y: 4 } };

/**
 * Illegal integer overlap seed — A,B,C stacked at (4,2) on middle row.
 * F at (10,0), E at (0,4), D at (8,4).
 */
export const OVERLAP_PLACEMENT = {
  A: { x: 4, y: 2 },
  B: { x: 4, y: 2 },
  C: { x: 4, y: 2 },
  D: { x: 8, y: 4 },
  E: { x: 0, y: 4 },
  F: { x: 10, y: 0 },
};

/** Float placement from a sloppy global place (greedy-snap lab). */
export const FLOAT_PLACEMENT = {
  A: { x: 3.7, y: 1.2 },
  B: { x: 4.1, y: 1.4 },
  C: { x: 5.2, y: 2.3 },
  D: { x: 8.4, y: 3.8 },
  E: { x: 0.3, y: 4.6 },
  F: { x: 10.2, y: 0.4 },
};

/**
 * Legal reference packing (no overlap, site-aligned, in-row).
 * Row0 (y=0): F@10, A@0, B@2
 * Row1 (y=2): C@0
 * Row2 (y=4): E@0, D@8
 * (Actual golden computed by Abacus on OVERLAP — see GOLDENS.)
 */
export const GOLDEN_PLACEMENT = {
  A: { x: 0, y: 0 },
  B: { x: 2, y: 0 },
  C: { x: 0, y: 2 },
  D: { x: 8, y: 4 },
  E: { x: 0, y: 4 },
  F: { x: 10, y: 0 },
};

/**
 * Numeric goldens (deterministic on OVERLAP / FLOAT starters).
 *
 * | Metric | Value |
 * |--------|-------|
 * | Overlap starter legal? | false (A/B) |
 * | Golden legal? | true |
 * | Float greedy-snap legal? | false (A/B still overlap) |
 * | Overlap-removal / Tetris | legal, disp **6**, HPWL **32** |
 * | Abacus | legal, disp **4**, HPWL **38** |
 * | Cost λ=1 / λ=5 (Abacus vs origin) | **42** / **58** |
 */
export const GOLDENS = {
  chipW: 12,
  chipH: 6,
  nRows: 3,
  siteW: 1,
  rowH: 2,
  totalCellWidth: 10,
  floatSnapLegal: false,
  overlapIllegal: true,
  goldenLegal: true,
  overlapRemovalDisp: 6,
  overlapRemovalHpwl: 32,
  abacusDisp: 4,
  abacusHpwl: 38,
  tetrisDisp: 6,
  tetrisHpwl: 32,
  abacusLegal: true,
  tetrisLegal: true,
  abacusCostLambda1: 42,
  abacusCostLambda5: 58,
  detailedDisp: 4,
  globalDisp: 6,
};

export function clonePositions(pos) {
  const out = {};
  for (const [id, p] of Object.entries(pos)) out[id] = { x: p.x, y: p.y };
  return out;
}

export function cellWidth(id) {
  return WIDTHS[id] ?? 1;
}

export function near(a, b, eps = 1e-6) {
  return Math.abs(a - b) <= eps;
}

export function round1(x) {
  return Math.round(x * 10) / 10;
}

export function rowIndexForY(y) {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < ROW_YS.length; i++) {
    const d = Math.abs(y - ROW_YS[i]);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

export function snapX(x, w = 1) {
  const maxX = CHIP_W - w;
  const s = Math.round(x / SITE_W) * SITE_W;
  return Math.max(0, Math.min(maxX, s));
}

export function snapY(y) {
  return ROW_YS[rowIndexForY(y)];
}

/** Snap every cell to nearest site x and row y (no overlap repair). */
export function greedySnap(positions, opts = {}) {
  const fixed = opts.fixed || {};
  const out = clonePositions(positions);
  for (const id of CELLS) {
    if (fixed[id]) {
      out[id] = { x: fixed[id].x, y: fixed[id].y };
      continue;
    }
    const w = cellWidth(id);
    out[id] = {
      x: snapX(positions[id].x, w),
      y: snapY(positions[id].y),
    };
  }
  return out;
}

function intervalsOverlap(a0, a1, b0, b1) {
  return a0 < b1 && b0 < a1;
}

/** True if two axis-aligned cells overlap in area (edge-touch OK). */
export function cellsOverlap(idA, posA, idB, posB) {
  if (posA.y !== posB.y) return false;
  const a0 = posA.x;
  const a1 = posA.x + cellWidth(idA);
  const b0 = posB.x;
  const b1 = posB.x + cellWidth(idB);
  return intervalsOverlap(a0, a1, b0, b1);
}

export function legalityReport(positions, opts = {}) {
  const fixed = opts.fixed || {};
  const reasons = [];
  for (const id of CELLS) {
    const p = positions[id];
    const w = cellWidth(id);
    if (p.x < 0 || p.x + w > CHIP_W + 1e-9) {
      reasons.push(`${id} outside chip X`);
    }
    if (!ROW_YS.includes(p.y)) {
      reasons.push(`${id} not on a row`);
    }
    if (Math.abs(p.x / SITE_W - Math.round(p.x / SITE_W)) > 1e-9) {
      reasons.push(`${id} not site-aligned`);
    }
    if (fixed[id]) {
      if (!near(p.x, fixed[id].x) || !near(p.y, fixed[id].y)) {
        reasons.push(`${id} moved off fixed macro`);
      }
    }
  }
  for (let i = 0; i < CELLS.length; i++) {
    for (let j = i + 1; j < CELLS.length; j++) {
      const a = CELLS[i];
      const b = CELLS[j];
      if (cellsOverlap(a, positions[a], b, positions[b])) {
        reasons.push(`overlap ${a}/${b}`);
      }
    }
  }
  return {
    legal: reasons.length === 0,
    reason: reasons.length === 0 ? "ok" : reasons[0],
    reasons,
  };
}

export function isLegal(positions, opts = {}) {
  return legalityReport(positions, opts).legal;
}

/** L1 displacement vs original (centers use lower-left for simplicity). */
export function totalDisplacement(from, to) {
  let s = 0;
  for (const id of CELLS) {
    s += Math.abs(to[id].x - from[id].x) + Math.abs(to[id].y - from[id].y);
  }
  return s;
}

export function hpwl(net, positions) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const id of net) {
    const p = positions[id];
    const w = cellWidth(id);
    // Use cell center for HPWL
    const cx = p.x + w / 2;
    const cy = p.y + ROW_H / 2;
    minX = Math.min(minX, cx);
    maxX = Math.max(maxX, cx);
    minY = Math.min(minY, cy);
    maxY = Math.max(maxY, cy);
  }
  return maxX - minX + (maxY - minY);
}

export function totalHpwl(positions, nets = NETS) {
  return nets.reduce((s, n) => s + hpwl(n, positions), 0);
}

/**
 * Cost = HPWL + λ · displacement(from origin).
 */
export function legalizeCost(positions, origin, lambda = 1) {
  return totalHpwl(positions) + lambda * totalDisplacement(origin, positions);
}

/**
 * Within each row, sort by x and pack left-to-right without overlap
 * (simple shelf / tetris pack for one row).
 */
function packRowLeft(ids, positions, startX = 0) {
  const sorted = [...ids].sort((a, b) => positions[a].x - positions[b].x || a.localeCompare(b));
  let x = startX;
  const out = {};
  for (const id of sorted) {
    out[id] = x;
    x += cellWidth(id);
  }
  return out;
}

/**
 * Overlap removal: snap first, then per-row left pack keeping relative order.
 * Preserves row assignment from snap.
 */
export function overlapRemoval(positions, opts = {}) {
  const fixed = opts.fixed || {};
  const snapped = greedySnap(positions, { fixed });
  const byRow = ROW_YS.map(() => []);
  for (const id of CELLS) {
    if (fixed[id]) continue;
    const ri = rowIndexForY(snapped[id].y);
    byRow[ri].push(id);
  }
  const out = clonePositions(snapped);
  for (const id of Object.keys(fixed)) {
    out[id] = { x: fixed[id].x, y: fixed[id].y };
  }
  for (let ri = 0; ri < ROW_YS.length; ri++) {
    const ids = byRow[ri];
    if (!ids.length) continue;
    // Reserve sites occupied by fixed macros on this row
    const blocked = [];
    for (const [fid, fp] of Object.entries(fixed)) {
      if (fp.y === ROW_YS[ri]) {
        blocked.push({ x0: fp.x, x1: fp.x + cellWidth(fid) });
      }
    }
    blocked.sort((a, b) => a.x0 - b.x0);
    const placed = packRowAvoiding(ids, snapped, blocked);
    for (const id of ids) {
      out[id] = { x: placed[id], y: ROW_YS[ri] };
    }
  }
  return out;
}

function packRowAvoiding(ids, positions, blocked) {
  const sorted = [...ids].sort((a, b) => positions[a].x - positions[b].x || a.localeCompare(b));
  const out = {};
  let cursor = 0;
  for (const id of sorted) {
    const w = cellWidth(id);
    let x = Math.max(cursor, snapX(positions[id].x, w));
    // Push past blocked intervals
    let moved = true;
    while (moved) {
      moved = false;
      for (const b of blocked) {
        if (intervalsOverlap(x, x + w, b.x0, b.x1)) {
          x = b.x1;
          moved = true;
        }
      }
    }
    if (x + w > CHIP_W) {
      // Overflow: clamp left as far as possible (lab still reports illegal)
      x = Math.max(0, CHIP_W - w);
    }
    out[id] = x;
    cursor = x + w;
    blocked = [...blocked, { x0: x, x1: x + w }].sort((a, b) => a.x0 - b.x0);
  }
  return out;
}

/**
 * Abacus-lite: process cells by increasing original x (or opts.order); for each
 * cell try each row, place at a feasible site, pick min L1 displacement
 * (or opts.costFn(id, cand, partial) when provided).
 */
export function abacusLegalize(positions, opts = {}) {
  const fixed = opts.fixed || {};
  const origin = clonePositions(positions);
  const order = (opts.order || [...CELLS])
    .filter((id) => !fixed[id] && CELLS.includes(id))
    .concat(
      [...CELLS].filter(
        (id) =>
          !fixed[id] &&
          !(opts.order || []).includes(id)
      )
    );
  // Deduplicate while preserving order preference
  const seen = new Set();
  const seq = [];
  for (const id of order) {
    if (seen.has(id) || fixed[id]) continue;
    seen.add(id);
    seq.push(id);
  }
  for (const id of CELLS) {
    if (!seen.has(id) && !fixed[id]) seq.push(id);
  }

  const placed = {};
  for (const [fid, fp] of Object.entries(fixed)) {
    placed[fid] = { x: fp.x, y: fp.y };
  }

  const costFn =
    typeof opts.costFn === "function"
      ? opts.costFn
      : (id, cand) =>
          Math.abs(cand.x - origin[id].x) + Math.abs(cand.y - origin[id].y);

  for (const id of seq) {
    const w = cellWidth(id);
    let best = null;
    let bestCost = Infinity;
    for (let ri = 0; ri < ROW_YS.length; ri++) {
      const y = ROW_YS[ri];
      const occupied = Object.entries(placed)
        .filter(([, p]) => p.y === y)
        .map(([cid, p]) => ({ x0: p.x, x1: p.x + cellWidth(cid) }))
        .sort((a, b) => a.x0 - b.x0);
      const prefer = snapX(origin[id].x, w);
      const tryPlace = (start) => {
        let xx = start;
        let guard = 0;
        while (guard++ < CHIP_W + 2) {
          let hit = null;
          for (const o of occupied) {
            if (intervalsOverlap(xx, xx + w, o.x0, o.x1)) {
              hit = o;
              break;
            }
          }
          if (!hit) {
            if (xx + w <= CHIP_W) return xx;
            return null;
          }
          xx = hit.x1;
        }
        return null;
      };
      // Try prefer, 0, and a few site offsets near prefer
      const starts = [
        prefer,
        0,
        Math.max(0, prefer - 2),
        Math.max(0, prefer - 4),
      ];
      for (const start of starts) {
        const candX = tryPlace(start);
        if (candX == null) continue;
        const cand = { x: candX, y };
        const cost = costFn(id, cand, placed, origin);
        if (
          cost < bestCost ||
          (near(cost, bestCost) && (best == null || cand.x < best.x))
        ) {
          bestCost = cost;
          best = cand;
        }
      }
    }
    if (!best) {
      best = { x: snapX(origin[id].x, w), y: snapY(origin[id].y) };
    }
    placed[id] = best;
  }
  const out = {};
  for (const id of CELLS) out[id] = placed[id] || greedySnap(positions)[id];
  return out;
}

/**
 * Tetris-lite: assign nearest row, then pack left-to-right by original x
 * within each row (no cross-row moves after assignment).
 */
export function tetrisLegalize(positions, opts = {}) {
  return overlapRemoval(positions, opts);
}

/**
 * Global legalize lite = Tetris / per-row shelf (faster, more displacement).
 * Detailed legalize = Abacus (tries rows, lower displacement).
 */
export function globalLegalize(positions, opts = {}) {
  return tetrisLegalize(positions, opts);
}

export function detailedLegalize(positions, opts = {}) {
  return abacusLegalize(positions, opts);
}

/**
 * Draw legalization canvas: chip outline, row lines, cell rectangles.
 * opts.paper — white bg + plot palette (benchmark figures).
 */
export function drawLegalization(canvas, opts = {}) {
  const positions = opts.positions || {};
  const highlight = new Set(opts.highlight || []);
  const paper = !!opts.paper;
  const ink = paper ? "#000000" : "#263238";
  const bg = paper ? "#ffffff" : "#f7f4ef";
  const grid = paper ? "#e5e5e5" : "#eceff1";
  const rowStroke = paper ? "#94a3b8" : "#b0bec5";
  const chipStroke = paper ? "#000000" : "#2c3e50";
  const PAPER_FONT =
    "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const PAPER_PALETTE = [
  "#1d4ed8",
  "#0f6b5c",
  "#b45309",
  "#9f1239",
  "#6d28d9",
  "#c2410c",
  "#0369a1",
  "#a21caf",
  "#4f46e5",
  "#ca8a04",
];
  const labPalette = {
    A: "#1565c0",
    B: "#2e7d32",
    C: "#6a1b9a",
    D: "#ef6c00",
    E: "#00838f",
    F: "#ad1457",
  };

  if (paper) canvas.style.background = "#ffffff";

  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const pad = 28;
  const legendH = paper ? 28 : 0;
  const scaleX = (W - 2 * pad) / CHIP_W;
  const scaleY = (H - 2 * pad - legendH) / CHIP_H;

  const toX = (x) => pad + x * scaleX;
  const toY = (y) => H - pad - legendH - y * scaleY; // lower-left origin

  ctx.strokeStyle = chipStroke;
  ctx.lineWidth = paper ? 2.25 : 2;
  ctx.strokeRect(toX(0), toY(CHIP_H), CHIP_W * scaleX, CHIP_H * scaleY);

  ctx.strokeStyle = rowStroke;
  ctx.lineWidth = paper ? 1.25 : 1;
  ctx.setLineDash(paper ? [5, 4] : [4, 4]);
  for (const y of ROW_YS) {
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(y));
    ctx.lineTo(toX(CHIP_W), toY(y));
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.strokeStyle = grid;
  ctx.lineWidth = paper ? 1.1 : 1;
  for (let s = 0; s <= CHIP_W; s++) {
    ctx.beginPath();
    ctx.moveTo(toX(s), toY(0));
    ctx.lineTo(toX(s), toY(CHIP_H));
    ctx.stroke();
  }

  const labelPx = Math.max(
    13,
    Math.min(20, Math.round(14 * Math.min(scaleX, scaleY)))
  );

  CELLS.forEach((id, i) => {
    const p = positions[id];
    if (!p) return;
    const w = cellWidth(id);
    const x0 = toX(p.x);
    const y0 = toY(p.y + ROW_H);
    const ww = w * scaleX;
    const hh = ROW_H * scaleY;
    ctx.fillStyle = paper
      ? PAPER_PALETTE[i % PAPER_PALETTE.length]
      : labPalette[id] || "#455a64";
    ctx.globalAlpha = highlight.size && !highlight.has(id) ? 0.35 : paper ? 0.92 : 0.85;
    ctx.fillRect(x0, y0, ww, hh);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = highlight.has(id) ? (paper ? "#b45309" : "#c62828") : ink;
    ctx.lineWidth = highlight.has(id) ? 3 : paper ? 1.75 : 1.5;
    ctx.strokeRect(x0, y0, ww, hh);
    ctx.fillStyle = "#fff";
    ctx.font = paper
      ? `bold ${labelPx}px ${PAPER_FONT}`
      : `bold ${labelPx}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(id, x0 + ww / 2, y0 + hh / 2);
  });

  if (paper) {
    const ly = H - Math.round(legendH / 2) - 2;
    let lx = pad;
    ctx.font = `bold 12px ${PAPER_FONT}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    CELLS.forEach((id, i) => {
      ctx.fillStyle = PAPER_PALETTE[i % PAPER_PALETTE.length];
      ctx.fillRect(lx, ly - 5, 14, 11);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.25;
      ctx.strokeRect(lx, ly - 5, 14, 11);
      ctx.fillStyle = ink;
      ctx.fillText(id, lx + 18, ly);
      lx += ctx.measureText(id).width + 34;
    });
  }

  ctx.fillStyle = paper ? ink : "#546e7a";
  ctx.font = paper ? `bold 12px ${PAPER_FONT}` : "12px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const meta =
    opts.metricText ||
    `chip ${CHIP_W}×${CHIP_H} · ${N_ROWS} rows · site ${SITE_W}`;
  ctx.fillText(meta, pad, paper ? pad - 8 : 16);
}
