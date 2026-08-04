/**
 * Bipartition canvas view for the partitioning benchmark.
 * Layouts each part in its own half so the cut is readable.
 */
import { fitGraphLayout, fitHiDpiCanvas } from "./canvas-hires.js";
import { cutsize } from "./clustering-core.js";
import { balanceMetrics, normalizeBipartLabels } from "./partitioning-core.js";

const FONT =
  "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
/** Same order as partition-benchmark-plots. */
const PART_COLORS = {
  "0": "#1d4ed8",
  "1": "#0f6b5c",
};
const CUT_COLOR = "#9f1239";
const EDGE_IN = "#cbd5e1";
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

function boldFont(px) {
  return `bold ${Math.round(px)}px ${FONT}`;
}

/** Pack nodes of one side into a rectangular region (design coords). */
function placeSide(ids, x0, x1, y0, y1) {
  const layout = {};
  const n = ids.length;
  if (!n) return layout;
  if (n === 1) {
    layout[ids[0]] = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
    return layout;
  }
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  const rows = Math.max(1, Math.ceil(n / cols));
  ids.forEach((id, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x =
      cols === 1 ? (x0 + x1) / 2 : x0 + ((c + 0.5) / cols) * (x1 - x0);
    const y =
      rows === 1 ? (y0 + y1) / 2 : y0 + ((r + 0.5) / rows) * (y1 - y0);
    layout[id] = { x, y };
  });
  return layout;
}

/**
 * Design-space layout: part 0 left, part 1 right (or multiway in strips).
 */
export function layoutByAssignment(graph, assignment) {
  const asn = normalizeBipartLabels(assignment || {});
  const buckets = new Map();
  for (const n of graph.nodes) {
    const lab = String(asn[n] ?? "?");
    if (!buckets.has(lab)) buckets.set(lab, []);
    buckets.get(lab).push(n);
  }
  for (const ids of buckets.values()) ids.sort();
  const labels = [...buckets.keys()].sort();
  const layout = {};
  const W = 640;
  const H = 400;
  const padY = 36;
  const gap = 56;
  if (labels.length <= 2) {
    const left = buckets.get(labels[0]) || [];
    const right = buckets.get(labels[1]) || [];
    Object.assign(layout, placeSide(left, 40, 280, padY, H - padY));
    Object.assign(layout, placeSide(right, 360, 600, padY, H - padY));
  } else {
    const stripW = (W - gap) / labels.length;
    labels.forEach((lab, i) => {
      const x0 = 24 + i * stripW;
      const x1 = x0 + stripW - 28;
      Object.assign(layout, placeSide(buckets.get(lab), x0, x1, padY, H - padY));
    });
  }
  // Keep any missing nodes centered
  for (const n of graph.nodes) {
    if (!layout[n]) layout[n] = { x: W / 2, y: H / 2 };
  }
  return { layout, labels, asn };
}

function partColor(lab, i) {
  if (PART_COLORS[lab]) return PART_COLORS[lab];
  return PAPER_PALETTE[i % PAPER_PALETTE.length];
}

/**
 * Draw bipartition: sides spatially separated, cut edges emphasized.
 * opts: { assignment, title?, subtitle? }
 */
export function drawBipartitionView(canvas, graph, opts = {}) {
  if (!canvas || !graph?.nodes?.length) return null;

  canvas.style.width = "100%";
  canvas.style.height = canvas.style.height || "440px";
  canvas.style.background = "#ffffff";

  const { ctx, w, h } = fitHiDpiCanvas(canvas, { w: 720, h: 440 });
  const s = Math.max(w / 720, h / 440, 1);
  const titlePx = Math.max(14, Math.round(15 * Math.min(s, 1.4)));
  const metaPx = Math.max(12, Math.round(13 * Math.min(s, 1.4)));
  const topBand = Math.round(52 * Math.min(s, 1.35));
  const bottomBand = Math.round(36 * Math.min(s, 1.35));

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const { layout: design, labels, asn } = layoutByAssignment(
    graph,
    opts.assignment
  );
  const plotH = Math.max(80, h - topBand - bottomBand);
  const { layout, nodeR, fontPx, edgeW } = fitGraphLayout(design, w, plotH, {
    pad: Math.round(28 * Math.min(s, 1.3)),
    nodeMargin: Math.round(22 * Math.min(s, 1.3)),
  });
  // Shift fitted layout down below the metric band
  for (const id of Object.keys(layout)) {
    layout[id] = { x: layout[id].x, y: layout[id].y + topBand };
  }

  const bal = balanceMetrics(asn, graph.sizes || null);
  const cut = cutsize(asn, graph.edges);
  const colorOf = new Map(labels.map((lab, i) => [lab, partColor(lab, i)]));

  // Midline between two parts
  if (labels.length === 2) {
    const xs0 = (bucketsXs(graph, asn, labels[0], layout));
    const xs1 = (bucketsXs(graph, asn, labels[1], layout));
    if (xs0.length && xs1.length) {
      const mid =
        (Math.max(...xs0) + Math.min(...xs1)) / 2 ||
        w / 2;
      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = Math.max(1.25, 1.4 * Math.min(s, 1.3));
      ctx.beginPath();
      ctx.moveTo(mid, topBand + 8);
      ctx.lineTo(mid, h - bottomBand - 8);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#64748b";
      ctx.font = boldFont(metaPx);
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("cut", mid, topBand + 10);
    }
  }

  const showWeights = graph.edges.length <= 18 && graph.nodes.length <= 16;
  const showLabels = graph.nodes.length <= 28;

  // Internal edges first, then cut edges on top
  const internals = [];
  const cuts = [];
  for (const e of graph.edges) {
    const cross = asn[e.u] != null && asn[e.u] !== asn[e.v];
    (cross ? cuts : internals).push(e);
  }

  function strokeEdge(e, color, width) {
    const a = layout[e.u];
    const b = layout[e.v];
    if (!a || !b) return;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    if (showWeights) {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      ctx.fillStyle = "#334155";
      ctx.font = `${Math.max(10, fontPx - 2)}px ui-monospace, Menlo, Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(String(e.w), mx, my - 2);
    }
  }

  for (const e of internals) {
    strokeEdge(e, EDGE_IN, Math.max(1, edgeW * 0.85));
  }
  for (const e of cuts) {
    strokeEdge(e, CUT_COLOR, Math.max(2, edgeW * 1.6));
  }

  for (const n of graph.nodes) {
    const p = layout[n];
    if (!p) continue;
    const lab = String(asn[n] ?? "?");
    const r = Math.max(8, nodeR * (showLabels ? 1 : 0.75));
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = colorOf.get(lab) || "#64748b";
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = Math.max(1.5, 1.6 * Math.min(s, 1.3));
    ctx.stroke();
    if (showLabels) {
      ctx.fillStyle = "#ffffff";
      ctx.font = boldFont(Math.max(11, fontPx));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n, p.x, p.y);
    }
  }

  // Top metric band
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, topBand - 4);
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, topBand - 4);
  ctx.lineTo(w, topBand - 4);
  ctx.stroke();

  const title = opts.title || "Partition";
  ctx.fillStyle = "#000000";
  ctx.font = boldFont(titlePx);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(title, 14, Math.round(titlePx + 8));

  const ratio = bal.ratio != null ? bal.ratio.toFixed(2) : "—";
  const meta = `cut ${cut} · balance ${ratio} · |V|=${graph.nodes.length} · |E|=${graph.edges.length}`;
  ctx.fillStyle = "#334155";
  ctx.font = boldFont(metaPx);
  ctx.fillText(meta, 14, Math.round(titlePx + metaPx + 14));

  // Bottom legend
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, h - bottomBand + 2, w, bottomBand);
  ctx.strokeStyle = "#e5e5e5";
  ctx.beginPath();
  ctx.moveTo(0, h - bottomBand + 2);
  ctx.lineTo(w, h - bottomBand + 2);
  ctx.stroke();

  let lx = 14;
  const ly = h - bottomBand / 2 + 2;
  ctx.font = boldFont(metaPx);
  ctx.textBaseline = "middle";
  labels.forEach((lab) => {
    const col = colorOf.get(lab);
    const count = graph.nodes.filter((n) => String(asn[n]) === lab).length;
    const sizeSum = bal.sizes?.[lab];
    ctx.beginPath();
    ctx.arc(lx + 7, ly, 7, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.25;
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    const label = `Part ${lab} · ${count} nodes${
      sizeSum != null ? ` · size ${sizeSum}` : ""
    }`;
    ctx.fillText(label, lx + 18, ly);
    lx += ctx.measureText(label).width + 36;
  });
  if (labels.length === 2) {
    ctx.strokeStyle = CUT_COLOR;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx + 18, ly);
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.fillText("cut edge", lx + 24, ly);
  }

  return { cut, balance: bal, labels, asn };
}

function bucketsXs(graph, asn, lab, layout) {
  const xs = [];
  for (const n of graph.nodes) {
    if (String(asn[n]) === lab && layout[n]) xs.push(layout[n].x);
  }
  return xs;
}

export function wirePartitionCanvasResize(canvas, redraw) {
  if (!canvas) return;
  if (typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", redraw);
    return;
  }
  if (canvas._partRo) canvas._partRo.disconnect();
  const ro = new ResizeObserver(() => redraw());
  canvas._partRo = ro;
  ro.observe(canvas.parentElement || canvas);
}
