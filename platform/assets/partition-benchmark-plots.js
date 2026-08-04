/**
 * Paper-ready XY plots for partitioning benchmarks.
 * Stroke/fonts/markers scale with canvas size so on-screen and PNG exports stay readable.
 */
import { LAB_CANVAS_MAX_DPR } from "./canvas-hires.js";

export const PAPER_EXPORT = { w: 2400, h: 1600 };
export const PAPER_EXPORT_SCALE = 2;
export const SCATTER_CSS_H = 520;

/** Design reference — scale factors are relative to this box. */
const REF_W = 640;
const REF_H = 400;

const SHAPES = ["circle", "square", "triangle", "diamond", "cross"];
/** Distinct hues for many solvers — only one teal/green (brand #0f6b5c). */
export const PAPER_SERIES_PALETTE = [
  "#1d4ed8", // blue
  "#0f6b5c", // teal (brand)
  "#b45309", // amber
  "#9f1239", // crimson
  "#6d28d9", // violet
  "#c2410c", // burnt orange
  "#0369a1", // sky
  "#a21caf", // fuchsia
  "#4f46e5", // indigo
  "#ca8a04", // gold
];
const PALETTE = PAPER_SERIES_PALETTE;
const FONT =
  "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function drawMarker(ctx, shape, x, y, r) {
  ctx.beginPath();
  if (shape === "square") {
    ctx.rect(x - r, y - r, r * 2, r * 2);
  } else if (shape === "triangle") {
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y + r);
    ctx.lineTo(x - r, y + r);
    ctx.closePath();
  } else if (shape === "diamond") {
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
  } else if (shape === "cross") {
    const w = Math.max(2, r * 0.35);
    ctx.lineWidth = w;
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.moveTo(x, y - r);
    ctx.lineTo(x, y + r);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    return;
  } else {
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();
}

function plotScale(cssW, cssH) {
  return Math.max(cssW / REF_W, cssH / REF_H, 1);
}

/** Switch to log when positive values span ≥ this ratio (one decade). */
const LOG_SPAN_RATIO = 10;

function positiveFinite(values) {
  return (values || []).filter((v) => Number.isFinite(v) && v > 0);
}

/**
 * Auto / forced scale choice.
 * mode: "auto" | "linear" | "log" (default auto)
 */
export function chooseAxisScale(values, mode = "auto") {
  const forced = mode === "log" || mode === "linear" ? mode : "auto";
  const pos = positiveFinite(values);
  if (forced === "linear") return "linear";
  if (pos.length < 2) return "linear";
  const lo = Math.min(...pos);
  const hi = Math.max(...pos);
  const wide = hi / lo >= LOG_SPAN_RATIO;
  if (forced === "log") return wide || hi / lo > 1 ? "log" : "linear";
  return wide ? "log" : "linear";
}

function logDomain(pos) {
  const lo = Math.min(...pos);
  const hi = Math.max(...pos);
  let a = Math.log10(lo);
  let b = Math.log10(hi);
  if (!(b > a)) {
    a -= 0.5;
    b += 0.5;
  }
  const pad = Math.max(0.08, (b - a) * 0.06);
  return {
    min: 10 ** (a - pad),
    max: 10 ** (b + pad),
  };
}

function linearDomainX(allX) {
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX, minX + 1e-9);
  const pad = (maxX - minX) * 0.04 || maxX * 0.04 || 1;
  return { min: minX - pad * 0.25, max: maxX + pad };
}

function linearDomainY(allY) {
  const maxY = Math.max(...allY, 1e-9) * 1.15;
  return { min: 0, max: maxY };
}

function logTicks(minV, maxV) {
  const lo = Math.floor(Math.log10(minV) + 1e-12);
  const hi = Math.ceil(Math.log10(maxV) - 1e-12);
  const ticks = [];
  for (let e = lo; e <= hi; e++) {
    const t = 10 ** e;
    if (t >= minV * 0.999 && t <= maxV * 1.001) ticks.push(t);
  }
  if (!ticks.length) ticks.push(minV, maxV);
  return ticks;
}

function linearTicks(minV, maxY, count = 5) {
  const ticks = [];
  for (let i = 0; i < count; i++) {
    ticks.push(minV + ((maxY - minV) * i) / (count - 1));
  }
  return ticks;
}

function axisProject(v, minV, maxV, log) {
  if (log) {
    const safe = Math.max(v, minV);
    const a = Math.log10(minV);
    const b = Math.log10(maxV);
    return (Math.log10(safe) - a) / (b - a || 1);
  }
  return (v - minV) / (maxV - minV || 1);
}

function axisLabel(base, isLog) {
  if (!base) return isLog ? "log" : "";
  return isLog ? `${base} (log)` : base;
}

/** Bold upright text — never italic. */
function boldFont(px) {
  return `bold ${Math.round(px)}px ${FONT}`;
}

function drawLegend(ctx, entries, x0, y0, opts) {
  const {
    labelPx,
    markR,
    ink,
    rowH,
    selectedId,
  } = opts;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = boldFont(labelPx);
  entries.forEach((e, i) => {
    const y = y0 + i * rowH;
    const sel = e.id === selectedId;
    const r = sel ? markR * 1.15 : markR;
    ctx.fillStyle = e.color;
    ctx.strokeStyle = ink;
    ctx.lineWidth = sel ? Math.max(2.5, r * 0.35) : Math.max(1.75, r * 0.28);
    drawMarker(ctx, e.shape, x0 + r + 2, y, r);
    ctx.fillStyle = ink;
    ctx.fillText(e.title, x0 + r * 2 + Math.max(10, labelPx * 0.55), y);
  });
}

/**
 * Generic paper XY plot.
 * series: [{ id, title, isUser, points: [{x,y}] }]
 * opts: xLabel, yLabel, formatX, formatY, selectedId, connect, emptyText,
 *       xScale, yScale ("auto"|"linear"|"log"), paper
 */
export function paintXyPlot(ctx, cssW, cssH, series, opts = {}) {
  const ink = "#000000";
  const bg = "#ffffff";
  const grid = "#e5e5e5";
  const formatX = opts.formatX || ((v) => String(Math.round(v)));
  const formatY =
    opts.formatY || ((v) => (Number.isInteger(v) ? String(v) : v.toFixed(2)));
  const connect = opts.connect !== false;
  const selectedId = opts.selectedId;
  const s = plotScale(cssW, cssH);
  const typeBoost = opts.paper ? 1.15 : 1;

  const titlePx = Math.max(15, Math.round(16 * s * typeBoost));
  const tickPx = Math.max(13, Math.round(14 * s * typeBoost));
  const labelPx = Math.max(14, Math.round(15 * s * typeBoost));
  const markR = Math.max(7, 7.5 * s);
  const markRSel = Math.max(9, 9.5 * s);

  const alive = (series || []).filter((ser) => ser.points?.length);

  ctx.clearRect(0, 0, cssW, cssH);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cssW, cssH);

  if (!alive.length) {
    ctx.fillStyle = ink;
    ctx.font = boldFont(titlePx);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(
      opts.emptyText || "Not enough data to plot",
      Math.round(20 * s),
      Math.round(36 * s)
    );
    return;
  }

  // Stable series order for color/shape + legend (selected last drawn on top).
  const legendOrder = [...alive].sort((a, b) => {
    if (!!a.isUser !== !!b.isUser) return a.isUser ? -1 : 1;
    return String(a.title || a.id).localeCompare(String(b.title || b.id));
  });
  const styleOf = new Map();
  legendOrder.forEach((ser, si) => {
    styleOf.set(ser.id, {
      color: ser.isUser ? "#b45309" : PALETTE[si % PALETTE.length],
      shape: SHAPES[si % SHAPES.length],
      title: ser.title || ser.id,
    });
  });

  ctx.font = boldFont(labelPx);
  const maxLabelW = Math.max(
    ...legendOrder.map((ser) => ctx.measureText(ser.title || ser.id).width),
    40
  );
  ctx.font = boldFont(tickPx);
  const tickSample = ["0", "10", "100", "0.10", "1.7 KB", "12.0 KB", "7.0 KB"];
  const maxTickW = Math.max(...tickSample.map((t) => ctx.measureText(t).width));

  const legendMarkBudget = markRSel * 2 + Math.max(10, labelPx * 0.55);
  const pad = {
    l: Math.ceil(titlePx + maxTickW + 22 * s),
    r: Math.ceil(legendMarkBudget + maxLabelW + 28 * s),
    t: Math.ceil(22 * s),
    b: Math.ceil(tickPx + titlePx + 28 * s),
  };

  const axisW = Math.max(2, 2.25 * s);
  const gridW = Math.max(1, 1.1 * s);
  const tickLen = Math.max(6, 7 * s);

  const plotW = Math.max(40, cssW - pad.l - pad.r);
  const plotH = Math.max(40, cssH - pad.t - pad.b);
  const allX = alive.flatMap((ser) => ser.points.map((p) => p.x));
  const allY = alive.flatMap((ser) => ser.points.map((p) => p.y));
  const xLog = chooseAxisScale(allX, opts.xScale) === "log";
  const yLog = chooseAxisScale(allY, opts.yScale) === "log";
  const xDom = xLog ? logDomain(positiveFinite(allX)) : linearDomainX(allX);
  const yDom = yLog ? logDomain(positiveFinite(allY)) : linearDomainY(allY);
  const xOf = (v) => pad.l + axisProject(v, xDom.min, xDom.max, xLog) * plotW;
  const yOf = (v) =>
    pad.t + plotH - axisProject(v, yDom.min, yDom.max, yLog) * plotH;

  const xTicks = xLog
    ? logTicks(xDom.min, xDom.max)
    : linearTicks(xDom.min, xDom.max);
  const yTicks = yLog
    ? logTicks(yDom.min, yDom.max)
    : linearTicks(yDom.min, yDom.max);

  // Soft grid
  ctx.strokeStyle = grid;
  ctx.lineWidth = gridW;
  for (const tv of yTicks) {
    const gy = yOf(tv);
    if (gy < pad.t - 1 || gy > pad.t + plotH + 1) continue;
    ctx.beginPath();
    ctx.moveTo(pad.l, gy);
    ctx.lineTo(pad.l + plotW, gy);
    ctx.stroke();
  }
  for (const tv of xTicks) {
    const gx = xOf(tv);
    if (gx < pad.l - 1 || gx > pad.l + plotW + 1) continue;
    ctx.beginPath();
    ctx.moveTo(gx, pad.t);
    ctx.lineTo(gx, pad.t + plotH);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = axisW;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t);
  ctx.lineTo(pad.l, pad.t + plotH);
  ctx.lineTo(pad.l + plotW, pad.t + plotH);
  ctx.stroke();

  ctx.font = boldFont(tickPx);
  for (const tv of xTicks) {
    const gx = xOf(tv);
    ctx.beginPath();
    ctx.moveTo(gx, pad.t + plotH);
    ctx.lineTo(gx, pad.t + plotH + tickLen);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = ink;
    ctx.fillText(formatX(tv), gx, pad.t + plotH + tickLen + Math.round(3 * s));
  }
  for (const tv of yTicks) {
    const gy = yOf(tv);
    ctx.beginPath();
    ctx.moveTo(pad.l - tickLen, gy);
    ctx.lineTo(pad.l, gy);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = ink;
    ctx.fillText(formatY(tv), pad.l - tickLen - Math.round(6 * s), gy);
  }

  ctx.font = boldFont(titlePx);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = ink;
  ctx.fillText(
    axisLabel(opts.xLabel || "x", xLog),
    pad.l + plotW / 2,
    cssH - Math.round(10 * s)
  );

  ctx.save();
  ctx.translate(Math.round(titlePx * 0.65), pad.t + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = boldFont(titlePx);
  ctx.fillStyle = ink;
  ctx.fillText(axisLabel(opts.yLabel || "y", yLog), 0, 0);
  ctx.restore();

  // Draw series: non-selected first, selected on top.
  const drawOrder = [...legendOrder].sort((a, b) => {
    const as = a.id === selectedId ? 1 : 0;
    const bs = b.id === selectedId ? 1 : 0;
    return as - bs;
  });

  for (const ser of drawOrder) {
    const st = styleOf.get(ser.id);
    const pts = [...ser.points].sort((a, b) => a.x - b.x);
    const sel = ser.id === selectedId;

    if (connect && pts.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = st.color;
      ctx.lineWidth = sel ? Math.max(2.75, 2.8 * s) : Math.max(2, 2.1 * s);
      pts.forEach((p, i) => {
        const x = xOf(p.x);
        const y = yOf(p.y);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    for (const p of pts) {
      const x = xOf(p.x);
      const y = yOf(p.y);
      const rad = sel ? markRSel : markR;
      ctx.fillStyle = st.color;
      ctx.strokeStyle = ink;
      ctx.lineWidth = sel ? Math.max(2.25, 2.4 * s) : Math.max(1.75, 1.9 * s);
      drawMarker(ctx, st.shape, x, y, rad);
    }
  }

  // Side legend — names never sit on the data.
  const rowH = Math.max(
    labelPx * 1.55,
    Math.min((plotH - 8) / Math.max(legendOrder.length, 1), labelPx * 2.1)
  );
  const legendH = rowH * legendOrder.length;
  const legendY0 =
    pad.t + Math.max(0, (plotH - legendH) / 2) + rowH / 2;
  drawLegend(
    ctx,
    legendOrder.map((ser) => ({
      id: ser.id,
      title: styleOf.get(ser.id).title,
      color: styleOf.get(ser.id).color,
      shape: styleOf.get(ser.id).shape,
    })),
    pad.l + plotW + Math.round(18 * s),
    legendY0,
    { labelPx, markR, ink, rowH, selectedId }
  );
}

/** Runtime–memory points: one point per algo (current scoreboard rows). */
export function rowsToRuntimeMemorySeries(rows) {
  return rowsToMetricXySeries(rows, "ms", "memBytes");
}

/**
 * One scatter point per scoreboard row for arbitrary metric keys.
 * Skips rows missing either coordinate.
 */
export function rowsToMetricXySeries(rows, xKey, yKey) {
  return (rows || [])
    .filter(
      (r) =>
        !r.error &&
        typeof r[xKey] === "number" &&
        !Number.isNaN(r[xKey]) &&
        typeof r[yKey] === "number" &&
        !Number.isNaN(r[yKey])
    )
    .map((r) => ({
      id: r.algoId,
      title: r.title,
      isUser: !!r.isUser,
      points: [{ x: r[xKey], y: r[yKey] }],
    }));
}

/**
 * Build scaling series from report.perInstance.
 * metric: any numeric row field (ms, memBytes, cut, conductance, …)
 */
export function buildScalingSeries(report, metric) {
  const per = report?.perInstance;
  if (!per?.length) return [];
  const map = new Map();
  for (const inst of per) {
    for (const row of inst.rows || []) {
      if (row.error) continue;
      const n = row.nNodes ?? inst.graph?.nodes?.length;
      const y = row[metric];
      if (n == null || y == null || Number.isNaN(y)) continue;
      if (!map.has(row.algoId)) {
        map.set(row.algoId, {
          id: row.algoId,
          title: row.title,
          isUser: !!row.isUser,
          points: [],
        });
      }
      map.get(row.algoId).points.push({ x: n, y });
    }
  }
  return [...map.values()].map((s) => ({
    ...s,
    points: s.points.sort((a, b) => a.x - b.x),
  }));
}

export function drawPaperCanvas(canvas, series, plotOpts) {
  canvas.style.width = "100%";
  canvas.style.height = `${SCATTER_CSS_H}px`;
  canvas.style.maxHeight = `min(${SCATTER_CSS_H}px, 60vh)`;
  canvas.style.background = "#ffffff";
  const dpr = Math.min(window.devicePixelRatio || 1, LAB_CANVAS_MAX_DPR);
  const cssW = Math.max(1, Math.floor(canvas.clientWidth || 720));
  const cssH = Math.max(1, Math.floor(canvas.clientHeight || SCATTER_CSS_H));
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  paintXyPlot(ctx, cssW, cssH, series, { ...plotOpts, paper: false });
}

/** Match XY plot chrome: white field, black hairline, plot-height canvas. */
export const GRAPH_CSS_H = SCATTER_CSS_H;

export function stylePaperGraphCanvas(canvas, cssH = GRAPH_CSS_H) {
  if (!canvas) return;
  canvas.classList.add("bench-paper");
  canvas.style.width = "100%";
  canvas.style.height = `${cssH}px`;
  canvas.style.maxHeight = `min(${cssH}px, 55vh)`;
  canvas.style.minHeight = "320px";
  canvas.style.background = "#ffffff";
  canvas.style.border = "1px solid #000";
  canvas.style.borderRadius = "0";
  canvas.style.display = "block";
}

/**
 * Export a domain view by painting onto an off-screen paper-sized canvas.
 * @param {(canvas: HTMLCanvasElement) => void} paintFn
 */
export function downloadRedrawnPng(paintFn, filenameStem, size = PAPER_EXPORT) {
  const off = document.createElement("canvas");
  off.style.cssText = `position:fixed;left:-10000px;top:0;width:${size.w}px;height:${size.h}px;background:#fff;`;
  document.body.appendChild(off);
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  try {
    paintFn(off);
    return new Promise((resolve) => {
      off.toBlob((blob) => {
        document.body.removeChild(off);
        if (!blob) {
          resolve({ ok: false, message: "Save failed — could not encode PNG" });
          return;
        }
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${filenameStem}-${stamp}.png`;
        a.click();
        URL.revokeObjectURL(a.href);
        resolve({
          ok: true,
          message: `Saved PNG (${off.width}×${off.height} px)`,
        });
      }, "image/png");
    });
  } catch (err) {
    if (off.parentNode) document.body.removeChild(off);
    return Promise.resolve({
      ok: false,
      message: `Save failed — ${err?.message || err}`,
    });
  }
}

export function downloadPaperPng(series, plotOpts, filenameStem) {
  const { w, h } = PAPER_EXPORT;
  const scale = PAPER_EXPORT_SCALE;
  const off = document.createElement("canvas");
  off.width = w * scale;
  off.height = h * scale;
  const ctx = off.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  paintXyPlot(ctx, w, h, series, { ...plotOpts, paper: true });
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return new Promise((resolve) => {
    off.toBlob((blob) => {
      if (!blob) {
        resolve({ ok: false, message: "Save failed — could not encode PNG" });
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${filenameStem}-${stamp}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
      resolve({ ok: true, message: `Saved PNG (${w * scale}×${h * scale} px)` });
    }, "image/png");
  });
}

export function wireCanvasResize(canvas, redraw) {
  if (typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", redraw);
    return;
  }
  if (canvas._benchRo) canvas._benchRo.disconnect();
  const ro = new ResizeObserver(redraw);
  canvas._benchRo = ro;
  ro.observe(canvas.parentElement || canvas);
}

export function fmtMem(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return "—";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
