/**
 * Tiny layout compaction — constraint-graph literacy for learn_compaction.
 * Cells A,B,C + wire W; min_gap=1; X span 20 → 14.
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const MIN_GAP = 1;
export const CHIP = { x0: 0, y0: 0, x1: 24, y1: 10 };

export const STARTER = [
  { id: "A", x0: 0, y0: 2, x1: 4, y1: 5, kind: "cell" },
  { id: "B", x0: 8, y0: 2, x1: 12, y1: 5, kind: "cell" },
  { id: "C", x0: 16, y0: 1, x1: 20, y1: 6, kind: "cell" },
  { id: "W", x0: 4, y0: 7, x1: 16, y1: 7, kind: "wire", layer: "M1" },
];

export const GOLDENS = {
  objectCount: 4,
  initialWidth: 20,
  initialHeight: 6,
  compactXWidth: 14,
  minGap: 1,
  xConstraintMin: 8,
};

export function cloneObjects(objs = STARTER) {
  return objs.map((o) => ({ ...o, jog: o.jog ? { ...o.jog } : undefined, points: o.points ? o.points.map((p) => ({ ...p })) : undefined }));
}

export function dataFrom(objects, chip = CHIP, minGap = MIN_GAP) {
  return { chip: { ...chip }, min_gap: minGap, objects: cloneObjects(objects) };
}

export function bbox(objects) {
  const cells = objects.filter((o) => o.kind !== "wire");
  const xs0 = cells.map((o) => o.x0);
  const ys0 = cells.map((o) => o.y0);
  const xs1 = cells.map((o) => o.x1);
  const ys1 = cells.map((o) => o.y1);
  return { x0: Math.min(...xs0), y0: Math.min(...ys0), x1: Math.max(...xs1), y1: Math.max(...ys1) };
}

export function layoutStats(objects, chip = CHIP) {
  const bb = bbox(objects);
  const w = bb.x1 - bb.x0;
  const h = bb.y1 - bb.y0;
  const chipW = chip.x1 - chip.x0;
  const chipH = chip.y1 - chip.y0;
  const objArea = objects.filter((o) => o.kind !== "wire").reduce((s, o) => s + (o.x1 - o.x0) * (o.y1 - o.y0), 0);
  return {
    bbox: bb,
    width: w,
    height: h,
    chipWidth: chipW,
    chipHeight: chipH,
    objectArea: objArea,
    whitespace: chipW * chipH - objArea,
    objectCount: objects.length,
  };
}

function edgeNodes(id, axis) {
  return axis === "x" ? [`L_${id}`, `R_${id}`] : [`B_${id}`, `T_${id}`];
}

function interval(o, axis) {
  return axis === "x" ? [o.x0, o.x1] : [o.y0, o.y1];
}

function projectsOverlap(a, b, axis) {
  if (axis === "x") return a.y0 < b.y1 && b.y0 < a.y1;
  return a.x0 < b.x1 && b.x0 < a.x1;
}

export function buildConstraintGraph(objects, axis = "x", minGap = MIN_GAP, chip = CHIP) {
  const objs = objects.filter((o) => o.kind !== "wire" || axis === "x");
  const edges = [];
  const nodes = new Set();
  for (const o of objs) {
    const [lo, hi] = edgeNodes(o.id, axis);
    nodes.add(lo);
    nodes.add(hi);
    const size = axis === "x" ? o.x1 - o.x0 : o.y1 - o.y0;
    edges.push([hi, lo, Math.max(size, 1)]);
  }
  const ordered = [...objs].sort((a, b) => interval(a, axis)[0] - interval(b, axis)[0]);
  for (let i = 0; i < ordered.length; i++) {
    for (let j = i + 1; j < ordered.length; j++) {
      const left = ordered[i];
      const right = ordered[j];
      if (!projectsOverlap(left, right, axis)) continue;
      const [, hiL] = edgeNodes(left.id, axis);
      const [loR] = edgeNodes(right.id, axis);
      if (interval(left, axis)[1] <= interval(right, axis)[0]) {
        edges.push([loR, hiL, minGap]);
      }
      break;
    }
  }
  const anchor = axis === "x" ? "SRC_X" : "SRC_Y";
  nodes.add(anchor);
  for (const o of objs) {
    const [lo] = edgeNodes(o.id, axis);
    edges.push([lo, anchor, 0]);
  }
  void chip;
  return { axis, nodes: [...nodes].sort(), edges, minGap };
}

export function longestPathCompact(graph) {
  const pos = Object.fromEntries(graph.nodes.map((n) => [n, 0]));
  for (let i = 0; i < graph.edges.length + graph.nodes.length + 1; i++) {
    let changed = false;
    for (const [dst, src, w] of graph.edges) {
      const cand = (pos[src] || 0) + w;
      if (cand > (pos[dst] || 0) + 1e-12) {
        pos[dst] = cand;
        changed = true;
      }
    }
    if (!changed) break;
  }
  for (const n of graph.nodes) if (n.startsWith("SRC_")) pos[n] = 0;
  return pos;
}

function applyPositions(objects, axis, positions) {
  return objects.map((o) => {
    const [lo, hi] = edgeNodes(o.id, axis);
    if (!(lo in positions) || !(hi in positions)) return { ...o };
    const loV = Math.round(positions[lo]);
    const hiV = Math.round(positions[hi]);
    if (axis === "x") return { ...o, x0: loV, x1: hiV };
    return { ...o, y0: loV, y1: hiV };
  });
}

export function compact1d(objects, axis = "x") {
  const before = layoutStats(objects);
  const graph = buildConstraintGraph(objects, axis);
  const positions = longestPathCompact(graph);
  const next = applyPositions(objects, axis, positions);
  const after = layoutStats(next);
  const key = axis === "x" ? "width" : "height";
  return {
    objects: next,
    axis,
    graph,
    positions,
    constraintCount: graph.edges.length,
    beforeSpan: before[key],
    afterSpan: after[key],
    improved: after[key] < before[key],
  };
}

export function compact2d(objects, order = ["x", "y"]) {
  let cur = cloneObjects(objects);
  const init = layoutStats(cur);
  const steps = [];
  for (const axis of order) {
    const r = compact1d(cur, axis);
    cur = r.objects;
    const st = layoutStats(cur);
    steps.push({ axis, constraintCount: r.constraintCount, width: st.width, height: st.height });
  }
  const final = layoutStats(cur);
  return {
    objects: cur,
    order,
    initialWidth: init.width,
    initialHeight: init.height,
    finalWidth: final.width,
    finalHeight: final.height,
    widthImproved: final.width < init.width,
    steps,
  };
}

export function addJog(wire, jogX, jogY) {
  const w = { ...wire };
  w.jog = { x: jogX, y: jogY };
  w.points = [
    { x: w.x0, y: w.y0 },
    { x: jogX, y: jogY },
    { x: w.x1, y: w.y1 },
  ];
  w.stretched = true;
  return w;
}

export function stretchWireToBbox(wire, bb) {
  const w = { ...wire };
  const y = w.y0;
  w.x0 = bb.x0;
  w.x1 = bb.x1;
  w.y0 = y;
  w.y1 = y;
  if (w.jog) w.jog = { ...w.jog, x: Math.floor((bb.x0 + bb.x1) / 2) };
  return w;
}

export function shearChannelLite(objects, xLo, xHi, deltaY) {
  const moved = [];
  const next = objects.map((o) => {
    if (o.x1 <= xLo || o.x0 >= xHi) return { ...o };
    moved.push(o.id);
    return { ...o, y0: o.y0 + deltaY, y1: o.y1 + deltaY };
  });
  return { objects: next, moved, deltaY, channel: [xLo, xHi] };
}

export function isLegal(objects, minGap = MIN_GAP) {
  const rects = objects.filter((o) => o.kind !== "wire");
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i];
      const b = rects[j];
      const dx = Math.max(0, Math.max(a.x0 - b.x1, b.x0 - a.x1));
      const dy = Math.max(0, Math.max(a.y0 - b.y1, b.y0 - a.y1));
      if (dx === 0 && dy === 0) return false;
      if (dx === 0 && dy > 0 && dy < minGap) return false;
      if (dy === 0 && dx > 0 && dx < minGap) return false;
    }
  }
  return true;
}

export function sequentialCompact(objects) {
  const init = layoutStats(objects);
  let cur = cloneObjects(objects);
  const xPass = compact1d(cur, "x");
  cur = xPass.objects;
  const yPass = compact1d(cur, "y");
  cur = yPass.objects;
  const bb = bbox(cur);
  cur = cur.map((o) => (o.kind === "wire" ? stretchWireToBbox(o, bb) : o));
  const final = layoutStats(cur);
  return {
    objects: cur,
    initialWidth: init.width,
    initialHeight: init.height,
    finalWidth: final.width,
    finalHeight: final.height,
    xConstraints: xPass.constraintCount,
    yConstraints: yPass.constraintCount,
    legal: isLegal(cur),
    improved: final.width < init.width || final.height < init.height,
  };
}

export function drawCompaction(canvas, opts = {}) {
  const objects = opts.objects || STARTER;
  const chip = opts.chip || CHIP;
  const highlight = new Set(opts.highlight || []);
  const selected = opts.selected || null;
  const graph = opts.graph || null;
  const paper = !!opts.paper;
  const ink = paper ? "#000000" : "#0f172a";
  const PAPER_FONT =
    "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const PAPER_FILL = ["#1d4ed8", "#0f6b5c", "#b45309", "#7c3aed", "#be123c"];
  if (paper) canvas.style.background = "#ffffff";

  const { ctx, w, h } = fitHiDpiCanvas(canvas, { w: 640, h: LAB_CANVAS_CSS_HEIGHT });
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = paper ? "#ffffff" : "#f8fafc";
  ctx.fillRect(0, 0, w, h);
  const pad = 28;
  const legendH = paper ? 26 : 0;
  const CW = chip.x1 - chip.x0;
  const CH = chip.y1 - chip.y0;
  const scale = Math.min((w - 2 * pad) / CW, (h - 2 * pad - legendH) / CH);
  const ox = (w - CW * scale) / 2;
  const oy = h - pad - legendH - (h - 2 * pad - legendH - CH * scale) / 2;
  const toScreen = (x, y) => ({ sx: ox + (x - chip.x0) * scale, sy: oy - (y - chip.y0) * scale });

  const c0 = toScreen(chip.x0, chip.y0);
  const c1 = toScreen(chip.x1, chip.y1);
  ctx.strokeStyle = paper ? ink : "rgba(148,163,184,0.8)";
  ctx.lineWidth = paper ? 2 : 1;
  ctx.strokeRect(c0.sx, c1.sy, c1.sx - c0.sx, c0.sy - c1.sy);
  if (paper) {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(c0.sx, c1.sy, c1.sx - c0.sx, c0.sy - c1.sy);
  }

  if (graph && !paper) {
    ctx.strokeStyle = "rgba(234,179,8,0.35)";
    ctx.setLineDash([4, 4]);
    for (const [dst, src] of graph.edges) {
      void dst;
      void src;
    }
    ctx.setLineDash([]);
  }

  let cellIdx = 0;
  for (const o of objects) {
    const p0 = toScreen(o.x0, o.y0);
    const p1 = toScreen(o.x1, o.y1);
    const hot = selected === o.id || highlight.has(o.id);
    if (o.kind === "wire") {
      ctx.strokeStyle = paper ? (hot ? "#be123c" : "#334155") : hot ? "#f59e0b" : "#64748b";
      ctx.lineWidth = paper ? (hot ? 3.5 : 2.5) : hot ? 4 : 3;
      ctx.beginPath();
      if (o.points && o.points.length >= 2) {
        const pts = o.points.map((p) => toScreen(p.x, p.y));
        ctx.moveTo(pts[0].sx, pts[0].sy);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy);
      } else {
        ctx.moveTo(p0.sx, p0.sy);
        ctx.lineTo(p1.sx, p1.sy);
      }
      ctx.stroke();
      ctx.fillStyle = paper ? ink : "#0f172a";
      ctx.font = paper ? `11px ${PAPER_FONT}` : "11px ui-sans-serif, system-ui";
      ctx.fillText(o.id, (p0.sx + p1.sx) / 2, p0.sy - 6);
    } else {
      ctx.fillStyle = paper
        ? PAPER_FILL[cellIdx % PAPER_FILL.length]
        : hot
          ? "#22c55e"
          : "#86efac";
      if (paper) ctx.globalAlpha = 0.88;
      ctx.fillRect(p0.sx, p1.sy, p1.sx - p0.sx, p0.sy - p1.sy);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = paper ? ink : "#14532d";
      ctx.lineWidth = paper ? 1.5 : 1;
      ctx.strokeRect(p0.sx, p1.sy, p1.sx - p0.sx, p0.sy - p1.sy);
      ctx.fillStyle = paper ? "#ffffff" : "#0f172a";
      ctx.font = paper
        ? `bold 12px ${PAPER_FONT}`
        : "12px ui-sans-serif, system-ui";
      ctx.fillText(o.id, p0.sx + 6, (p0.sy + p1.sy) / 2 + 4);
      cellIdx += 1;
    }
  }

  if (opts.metricText) {
    if (paper) {
      ctx.fillStyle = ink;
      ctx.font = `bold 12px ${PAPER_FONT}`;
      ctx.fillText(opts.metricText, pad, pad - 6);
    } else {
      ctx.fillStyle = "rgba(15,23,42,0.85)";
      ctx.fillRect(pad, pad - 4, Math.min(440, w - 2 * pad), 22);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "13px ui-sans-serif, system-ui";
      ctx.fillText(opts.metricText, pad + 8, pad + 12);
    }
  }

  if (paper) {
    const ly = h - Math.round(legendH / 2) - 2;
    let lx = pad;
    ctx.font = `11px ${PAPER_FONT}`;
    ctx.textBaseline = "middle";
    const cells = objects.filter((o) => o.kind !== "wire");
    cells.forEach((o, i) => {
      ctx.beginPath();
      ctx.arc(lx + 5, ly, 4, 0, Math.PI * 2);
      ctx.fillStyle = PAPER_FILL[i % PAPER_FILL.length];
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.fillText(o.id, lx + 12, ly);
      lx += 36;
    });
  }
  return { scale, toScreen };
}

export function hitObject(objects, canvas, clientX, clientY, chip = CHIP) {
  const rect = canvas.getBoundingClientRect();
  const w = canvas.clientWidth || rect.width || 640;
  const h = canvas.clientHeight || rect.height || LAB_CANVAS_CSS_HEIGHT;
  const pad = 28;
  const CW = chip.x1 - chip.x0;
  const CH = chip.y1 - chip.y0;
  const scale = Math.min((w - 2 * pad) / CW, (h - 2 * pad) / CH);
  const ox = (w - CW * scale) / 2;
  const oy = h - pad - (h - 2 * pad - CH * scale) / 2;
  const wx = chip.x0 + (clientX - rect.left - ox) / scale;
  const wy = chip.y0 + (oy - (clientY - rect.top)) / scale;
  for (const o of [...objects].reverse()) {
    const padY = o.kind === "wire" ? 0.4 : 0;
    if (wx >= o.x0 && wx <= o.x1 && wy >= o.y0 - padY && wy <= o.y1 + padY) return o.id;
  }
  return null;
}
