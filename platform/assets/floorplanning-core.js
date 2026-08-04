/**
 * Tiny fixed-outline floorplanning helpers for browser labs.
 * Outline 10×8; modules A–E match courses/learn_floorplanning/common/tiny_modules.json.
 *
 * Module areas: A6 + B6 + C4 + D3 + E4 = 23
 * Outline area: 80 → deadspace 57 → density 23/80 = 0.2875
 */

import { fitHiDpiCanvas } from "./canvas-hires.js";

export const OUTLINE = { w: 10, h: 8 };

export const TINY_MODULES = [
  { id: "A", w: 3, h: 2, soft: true, aspect_min: 0.5, aspect_max: 2.0 },
  { id: "B", w: 2, h: 3, soft: false },
  { id: "C", w: 2, h: 2, soft: false },
  { id: "D", w: 3, h: 1, soft: false },
  { id: "E", w: 2, h: 2, soft: false },
];

/** Legal packing of A–E inside 10×8 (lower-left coords). */
export const GOLDEN_PACK = {
  A: { x: 0, y: 0, w: 3, h: 2 },
  B: { x: 3, y: 0, w: 2, h: 3 },
  C: { x: 5, y: 0, w: 2, h: 2 },
  D: { x: 0, y: 2, w: 3, h: 1 },
  E: { x: 7, y: 0, w: 2, h: 2 },
};

/** Illegal: E overflows right edge (x+w = 11 > 10). */
export const BAD_PACK = {
  A: { x: 0, y: 0, w: 3, h: 2 },
  B: { x: 3, y: 0, w: 2, h: 3 },
  C: { x: 5, y: 0, w: 2, h: 2 },
  D: { x: 0, y: 2, w: 3, h: 1 },
  E: { x: 9, y: 0, w: 2, h: 2 },
};

/** Overlap illegal: E overlaps C. */
export const OVERLAP_PACK = {
  A: { x: 0, y: 0, w: 3, h: 2 },
  B: { x: 3, y: 0, w: 2, h: 3 },
  C: { x: 5, y: 0, w: 2, h: 2 },
  D: { x: 0, y: 2, w: 3, h: 1 },
  E: { x: 5, y: 0, w: 2, h: 2 },
};

/** Soft A reshaped to 2×3 (area 6) — still legal with adjusted golden. */
export const SOFT_A_PACK = {
  A: { x: 0, y: 0, w: 2, h: 3 },
  B: { x: 2, y: 0, w: 2, h: 3 },
  C: { x: 4, y: 0, w: 2, h: 2 },
  D: { x: 4, y: 2, w: 3, h: 1 },
  E: { x: 7, y: 0, w: 2, h: 2 },
};

/** Macro D fixed at (0,0); others packed around. */
export const MACRO_PACK = {
  D: { x: 0, y: 0, w: 3, h: 1, macro: true },
  A: { x: 0, y: 1, w: 3, h: 2 },
  B: { x: 3, y: 0, w: 2, h: 3 },
  C: { x: 5, y: 0, w: 2, h: 2 },
  E: { x: 7, y: 0, w: 2, h: 2 },
};

export const GOLDEN_PINS = [
  { id: "P0", side: "left", offset: 2 },
  { id: "P1", side: "bottom", offset: 4 },
  { id: "P2", side: "right", offset: 3 },
  { id: "P3", side: "top", offset: 5 },
];

const PALETTE = ["#2a6f6a", "#c45c26", "#3d5a80", "#6b4c9a", "#b08900", "#4a7c59"];

export function cloneModules() {
  return TINY_MODULES.map((m) => ({ ...m }));
}

export function clonePack(pack) {
  const out = {};
  for (const [id, r] of Object.entries(pack)) out[id] = { ...r };
  return out;
}

export function moduleAreaSum(mods = TINY_MODULES) {
  return mods.reduce((s, m) => s + m.w * m.h, 0);
}

export function outlineArea(outline = OUTLINE) {
  return outline.w * outline.h;
}

export function deadspace(outline = OUTLINE, mods = TINY_MODULES) {
  return outlineArea(outline) - moduleAreaSum(mods);
}

export function density(outline = OUTLINE, mods = TINY_MODULES) {
  return moduleAreaSum(mods) / outlineArea(outline);
}

/** Edge-touching allowed; positive-area interior overlap is illegal. */
export function rectsOverlap(a, b) {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

export function insideOutline(r, outline = OUTLINE) {
  return r.x >= 0 && r.y >= 0 && r.x + r.w <= outline.w && r.y + r.h <= outline.h;
}

export function packToList(pack) {
  return Object.entries(pack).map(([id, r]) => ({ id, ...r }));
}

export function isLegalPacking(pack, outline = OUTLINE) {
  const list = Array.isArray(pack) ? pack : packToList(pack);
  for (const r of list) {
    if (!insideOutline(r, outline)) return false;
  }
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (rectsOverlap(list[i], list[j])) return false;
    }
  }
  return true;
}

export function legalityReport(pack, outline = OUTLINE) {
  const list = Array.isArray(pack) ? pack : packToList(pack);
  for (const r of list) {
    if (!insideOutline(r, outline)) {
      return { legal: false, reason: `${r.id} outside outline` };
    }
  }
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (rectsOverlap(list[i], list[j])) {
        return { legal: false, reason: `${list[i].id} overlaps ${list[j].id}` };
      }
    }
  }
  return { legal: true, reason: "ok" };
}

/**
 * Evaluate reverse-polish slicing: operands = module ids, operators H|V.
 * H = horizontal cut (stack vertically: bottom then top).
 * V = vertical cut (side by side: left then right).
 */
export function evalPolish(tokens, modules = TINY_MODULES) {
  const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
  const stack = [];
  for (const t of tokens) {
    if (t === "H" || t === "V") {
      if (stack.length < 2) throw new Error("polish underflow");
      const b = stack.pop();
      const a = stack.pop();
      if (t === "V") {
        const h = Math.max(a.h, b.h);
        const w = a.w + b.w;
        const kids = [
          ...a.kids.map((k) => ({ ...k, x: k.x, y: k.y })),
          ...b.kids.map((k) => ({ ...k, x: k.x + a.w, y: k.y })),
        ];
        stack.push({ w, h, kids });
      } else {
        const w = Math.max(a.w, b.w);
        const h = a.h + b.h;
        const kids = [
          ...a.kids.map((k) => ({ ...k, x: k.x, y: k.y })),
          ...b.kids.map((k) => ({ ...k, x: k.x, y: k.y + a.h })),
        ];
        stack.push({ w, h, kids });
      }
    } else {
      const m = byId[t];
      if (!m) throw new Error(`unknown module ${t}`);
      stack.push({
        w: m.w,
        h: m.h,
        kids: [{ id: m.id, x: 0, y: 0, w: m.w, h: m.h }],
      });
    }
  }
  if (stack.length !== 1) throw new Error("polish leftover");
  const root = stack[0];
  const pack = {};
  for (const k of root.kids) pack[k.id] = { x: k.x, y: k.y, w: k.w, h: k.h };
  return { pack, w: root.w, h: root.h };
}

/** Golden polish for A–E → bounding 9×3, legal in 10×8. */
export const GOLDEN_POLISH = ["A", "D", "H", "B", "V", "C", "V", "E", "V"];

/**
 * Compact B*-tree packing: root Contour style — left child = right-of, right child = above.
 * tree: { id, left?, right? }
 */
export function packBstar(tree, modules = TINY_MODULES) {
  const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
  const pack = {};
  const contour = []; // y-contour as list of {x1,x2,h}

  function contourY(x1, x2) {
    let y = 0;
    for (const seg of contour) {
      if (!(seg.x2 <= x1 || seg.x1 >= x2)) y = Math.max(y, seg.h);
    }
    return y;
  }

  function setContour(x1, x2, h) {
    const next = [];
    for (const seg of contour) {
      if (seg.x2 <= x1 || seg.x1 >= x2) next.push(seg);
      else {
        if (seg.x1 < x1) next.push({ x1: seg.x1, x2: x1, h: seg.h });
        if (seg.x2 > x2) next.push({ x1: x2, x2: seg.x2, h: seg.h });
      }
    }
    next.push({ x1, x2, h });
    next.sort((a, b) => a.x1 - b.x1);
    contour.length = 0;
    contour.push(...next);
  }

  function place(node, x) {
    if (!node) return;
    const m = byId[node.id];
    const y = contourY(x, x + m.w);
    pack[node.id] = { x, y, w: m.w, h: m.h };
    setContour(x, x + m.w, y + m.h);
    if (node.left) place(node.left, x + m.w);
    if (node.right) place(node.right, x);
  }

  place(tree, 0);
  return pack;
}

/** Golden B*: A root, left=B→C→E chain, right=D above A. */
export const GOLDEN_BSTAR = {
  id: "A",
  left: { id: "B", left: { id: "C", left: { id: "E" } } },
  right: { id: "D" },
};

/**
 * Sequence-pair packing (Murata): pos + neg permutations.
 * x order from pos/neg longest common; simplified: pack left-to-right by pos,
 * y by longest-path constraint from SP rules.
 */
export function packSequencePair(pos, neg, modules = TINY_MODULES) {
  const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
  const ids = [...pos];
  const pack = {};
  const posIdx = Object.fromEntries(pos.map((id, i) => [id, i]));
  const negIdx = Object.fromEntries(neg.map((id, i) => [id, i]));

  // Horizontal: i left of j if pos(i)<pos(j) and neg(i)<neg(j)
  // Vertical: i below j if pos(i)<pos(j) and neg(i)>neg(j)
  for (const id of ids) {
    pack[id] = { x: 0, y: 0, w: byId[id].w, h: byId[id].h };
  }
  // Longest-path DP for x
  const orderX = [...ids].sort((a, b) => posIdx[a] - posIdx[b]);
  for (const id of orderX) {
    let x = 0;
    for (const other of ids) {
      if (other === id) continue;
      if (posIdx[other] < posIdx[id] && negIdx[other] < negIdx[id]) {
        x = Math.max(x, pack[other].x + pack[other].w);
      }
    }
    pack[id].x = x;
  }
  for (const id of orderX) {
    let y = 0;
    for (const other of ids) {
      if (other === id) continue;
      if (posIdx[other] < posIdx[id] && negIdx[other] > negIdx[id]) {
        y = Math.max(y, pack[other].y + pack[other].h);
      }
    }
    pack[id].y = y;
  }
  return pack;
}

export const GOLDEN_SP = {
  pos: ["A", "B", "C", "E", "D"],
  neg: ["D", "A", "B", "C", "E"],
};

/** Keep area ≈ constant for soft modules; round to integers. */
export function resizeSoft(mod, aspect) {
  if (!mod.soft) return { ...mod };
  const area = mod.w * mod.h;
  let w = Math.max(1, Math.round(Math.sqrt(area * aspect)));
  let h = Math.max(1, Math.round(area / w));
  // Adjust to preserve area as closely as possible
  while (w * h > area && w > 1) w -= 1;
  while (w * h < area) h += 1;
  if (mod.aspect_min != null && w / h < mod.aspect_min) {
    /* keep best effort */
  }
  return { ...mod, w, h };
}

/** HPWL proxy: sum of half-perimeter of bounding boxes of adjacent pairs in a fixed netlist. */
export const TINY_NETS = [
  ["A", "B"],
  ["B", "C"],
  ["C", "E"],
  ["A", "D"],
  ["D", "B"],
];

export function hpwl(pack, nets = TINY_NETS) {
  let sum = 0;
  for (const net of nets) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const id of net) {
      const r = pack[id];
      if (!r) continue;
      const cx = r.x + r.w / 2;
      const cy = r.y + r.h / 2;
      minX = Math.min(minX, cx);
      maxX = Math.max(maxX, cx);
      minY = Math.min(minY, cy);
      maxY = Math.max(maxY, cy);
    }
    sum += maxX - minX + (maxY - minY);
  }
  return sum;
}

export function cost(pack, outline = OUTLINE) {
  const legal = isLegalPacking(pack, outline) ? 0 : 1000;
  const ds = deadspace(outline);
  const wire = hpwl(pack);
  const bbW = Math.max(...packToList(pack).map((r) => r.x + r.w));
  const bbH = Math.max(...packToList(pack).map((r) => r.y + r.h));
  const aspectPenalty = Math.abs(bbW / bbH - outline.w / outline.h) * 10;
  return legal + ds * 0.1 + wire + aspectPenalty;
}

/** One SA-style neighbor: swap two modules' positions (keep sizes). */
export function saSwap(pack, idA, idB) {
  const next = clonePack(pack);
  const ax = next[idA].x;
  const ay = next[idA].y;
  next[idA].x = next[idB].x;
  next[idA].y = next[idB].y;
  next[idB].x = ax;
  next[idB].y = ay;
  return next;
}

/** Hierarchical: pack cluster AB and CDE separately, then place clusters. */
export function packHierarchical() {
  const left = {
    A: { x: 0, y: 0, w: 3, h: 2 },
    B: { x: 3, y: 0, w: 2, h: 3 },
  };
  const right = {
    C: { x: 0, y: 0, w: 2, h: 2 },
    D: { x: 2, y: 0, w: 3, h: 1 },
    E: { x: 2, y: 1, w: 2, h: 2 },
  };
  const pack = {};
  for (const [id, r] of Object.entries(left)) pack[id] = { ...r };
  const ox = 5;
  for (const [id, r] of Object.entries(right)) {
    pack[id] = { x: r.x + ox, y: r.y, w: r.w, h: r.h };
  }
  return pack;
}

export function pinsValid(pins, outline = OUTLINE) {
  const sides = new Set();
  for (const p of pins) {
    if (!["left", "right", "top", "bottom"].includes(p.side)) return false;
    const lim = p.side === "left" || p.side === "right" ? outline.h : outline.w;
    if (p.offset < 0 || p.offset > lim) return false;
    sides.add(p.side);
  }
  return sides.size === 4;
}

export function drawFloorplan(canvas, opts = {}) {
  const outline = opts.outline || OUTLINE;
  const pack = opts.pack || {};
  const pins = opts.pins || [];
  const paper = !!opts.paper;
  const ink = paper ? "#000000" : "#1a1a1a";
  const PAPER_FONT =
    "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const PAPER_PALETTE = [
    "#1d4ed8",
    "#0f6b5c",
    "#b45309",
    "#7c3aed",
    "#be123c",
    "#0e7490",
  ];
  if (paper) canvas.style.background = "#ffffff";

  const { ctx, w: cw, h: ch } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = paper ? "#ffffff" : "#f4f7f6";
  ctx.fillRect(0, 0, cw, ch);

  const pad = 28;
  const legendH = paper ? 28 : 0;
  const scale = Math.min(
    (cw - pad * 2) / outline.w,
    (ch - pad * 2 - legendH) / outline.h
  );
  const ox = pad + ((cw - pad * 2) - outline.w * scale) / 2;
  const oy = pad + ((ch - pad * 2 - legendH) - outline.h * scale) / 2;

  function sx(x) {
    return ox + x * scale;
  }
  function sy(y) {
    return oy + (outline.h - y) * scale;
  }

  ctx.strokeStyle = ink;
  ctx.lineWidth = paper ? 2.25 : 2;
  ctx.strokeRect(sx(0), sy(outline.h), outline.w * scale, outline.h * scale);
  ctx.fillStyle = paper ? "#f8fafc" : "#ffffff";
  ctx.fillRect(sx(0), sy(outline.h), outline.w * scale, outline.h * scale);

  // Light grid
  if (paper) {
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let x = 1; x < outline.w; x++) {
      ctx.beginPath();
      ctx.moveTo(sx(x), sy(0));
      ctx.lineTo(sx(x), sy(outline.h));
      ctx.stroke();
    }
    for (let y = 1; y < outline.h; y++) {
      ctx.beginPath();
      ctx.moveTo(sx(0), sy(y));
      ctx.lineTo(sx(outline.w), sy(y));
      ctx.stroke();
    }
  }

  const ids = Object.keys(pack).sort();
  ids.forEach((id, i) => {
    const r = pack[id];
    ctx.fillStyle = paper
      ? PAPER_PALETTE[i % PAPER_PALETTE.length]
      : PALETTE[i % PALETTE.length];
    ctx.globalAlpha = paper ? 0.9 : 0.85;
    ctx.fillRect(sx(r.x), sy(r.y + r.h), r.w * scale, r.h * scale);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = ink;
    ctx.lineWidth = paper ? 1.5 : 1;
    ctx.strokeRect(sx(r.x), sy(r.y + r.h), r.w * scale, r.h * scale);
    ctx.fillStyle = "#fff";
    ctx.font = paper
      ? `bold ${Math.max(11, scale * 0.45)}px ${PAPER_FONT}`
      : `bold ${Math.max(11, scale * 0.45)}px system-ui,sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(id, sx(r.x + r.w / 2), sy(r.y + r.h / 2));
  });

  for (const p of pins) {
    let px;
    let py;
    if (p.side === "left") {
      px = sx(0);
      py = sy(p.offset);
    } else if (p.side === "right") {
      px = sx(outline.w);
      py = sy(p.offset);
    } else if (p.side === "bottom") {
      px = sx(p.offset);
      py = sy(0);
    } else {
      px = sx(p.offset);
      py = sy(outline.h);
    }
    ctx.fillStyle = paper ? "#be123c" : "#c0392b";
    ctx.beginPath();
    ctx.arc(px, py, paper ? 4 : 5, 0, Math.PI * 2);
    ctx.fill();
    if (paper) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.fillStyle = paper ? ink : "#333";
    ctx.font = paper ? `10px ${PAPER_FONT}` : "10px system-ui,sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(p.id, px + 6, py - 6);
  }

  if (paper && opts.metricText) {
    ctx.fillStyle = ink;
    ctx.font = `bold 12px ${PAPER_FONT}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(opts.metricText, pad, pad - 8);
  } else if (!paper) {
    ctx.fillStyle = "#555";
    ctx.font = "11px system-ui,sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${outline.w}×${outline.h}`, sx(0), sy(outline.h) - 8);
  }

  if (paper) {
    const ly = ch - Math.round(legendH / 2) - 2;
    let lx = pad;
    ctx.font = `11px ${PAPER_FONT}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ids.forEach((id, i) => {
      ctx.beginPath();
      ctx.arc(lx + 5, ly, 4, 0, Math.PI * 2);
      ctx.fillStyle = PAPER_PALETTE[i % PAPER_PALETTE.length];
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.fillText(id, lx + 12, ly);
      lx += 36;
    });
  }
}

export { PALETTE };
