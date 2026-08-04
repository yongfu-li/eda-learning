/**
 * STA canvas helpers + re-export of challenge chrome from clustering-ui.
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export { createChallengeLab, el, metricsBlock };

const KIND_FILL = {
  port: "#2a6f6a",
  cell_in: "#3d5a80",
  cell_out: "#6b4c9a",
  default: "#4a5568",
};

/**
 * Compute pin screen positions for a timing DAG (same layout as drawTimingGraph).
 * @returns {Record<string,{x:number,y:number,pin:object}>}
 */
export function pinPositions(canvas, timing, levels = null) {
  const w = canvas.clientWidth || 640;
  const h = canvas.clientHeight || LAB_CANVAS_CSS_HEIGHT;
  const pins = timing.pins;
  const byLevel = {};
  for (const p of pins) {
    const lv = levels ? levels[p.id] ?? 0 : pins.indexOf(p);
    if (!byLevel[lv]) byLevel[lv] = [];
    byLevel[lv].push(p);
  }
  const levelKeys = Object.keys(byLevel)
    .map(Number)
    .sort((a, b) => a - b);
  const maxLv = levelKeys.length ? levelKeys[levelKeys.length - 1] : 0;
  const padX = 48;
  const padY = 36;
  const pos = {};
  for (const lv of levelKeys) {
    const col = byLevel[lv];
    const x =
      maxLv === 0 ? w / 2 : padX + ((w - 2 * padX) * lv) / Math.max(maxLv, 1);
    col.forEach((p, i) => {
      const y =
        col.length === 1
          ? h / 2
          : padY + ((h - 2 * padY) * i) / Math.max(col.length - 1, 1);
      pos[p.id] = { x, y, pin: p };
    });
  }
  return pos;
}

/** Hit-test pin under canvas click. */
export function hitPin(canvas, timing, clientX, clientY, levels = null, radius = 18) {
  const rect = canvas.getBoundingClientRect();
  const mx = clientX - rect.left;
  const my = clientY - rect.top;
  const pos = pinPositions(canvas, timing, levels);
  let best = null;
  let bestD = radius * radius;
  for (const [id, p] of Object.entries(pos)) {
    const dx = mx - p.x;
    const dy = my - p.y;
    const d = dx * dx + dy * dy;
    if (d <= bestD) {
      bestD = d;
      best = id;
    }
  }
  return best;
}

/**
 * Draw a levelized timing DAG left→right by level.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {object} timing
 * @param {object} [opts]
 * @param {Record<string,number>|null} [opts.levels]
 * @param {string[]} [opts.highlightPins]
 * @param {string[]} [opts.highlightArcs] — "from|to"
 * @param {Record<string,number|string>} [opts.tags] — pin → label under L#
 * @param {boolean} [opts.showDelay=true]
 */
export function drawTimingGraph(canvas, timing, opts = {}) {
  const paper = !!opts.paper;
  const ink = paper ? "#000000" : "#0f172a";
  const PAPER_FONT =
    "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  if (paper) canvas.style.background = "#ffffff";

  const { ctx, w, h } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = paper ? "#ffffff" : "#f7faf9";
  ctx.fillRect(0, 0, w, h);

  const levels = opts.levels || null;
  const highlightPins = new Set(opts.highlightPins || []);
  const highlightArcs = new Set(opts.highlightArcs || []);
  const tags = opts.tags || {};
  const showDelay = opts.showDelay !== false;
  const pos = pinPositions(canvas, timing, levels);
  const PAPER_FILL = {
    port: "#0f6b5c",
    cell_in: "#1d4ed8",
    cell_out: "#7c3aed",
    default: "#334155",
  };

  for (const a of timing.arcs) {
    const A = pos[a.from];
    const B = pos[a.to];
    if (!A || !B) continue;
    const key = `${a.from}|${a.to}`;
    const hi = highlightArcs.has(key);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.strokeStyle = paper
      ? hi
        ? "#be123c"
        : a.kind === "cell"
          ? "#7c3aed"
          : "#64748b"
      : hi
        ? "#c45c26"
        : a.kind === "cell"
          ? "#6b4c9a"
          : "#94a3b8";
    ctx.lineWidth = paper
      ? hi
        ? 3
        : a.kind === "cell"
          ? 2.25
          : 1.5
      : hi
        ? 3
        : a.kind === "cell"
          ? 2.5
          : 1.5;
    if (a.kind === "net" && !hi) ctx.setLineDash([5, 4]);
    else ctx.setLineDash([]);
    ctx.stroke();
    ctx.setLineDash([]);

    const ang = Math.atan2(B.y - A.y, B.x - A.x);
    const tipX = B.x - 14 * Math.cos(ang);
    const tipY = B.y - 14 * Math.sin(ang);
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(
      tipX - 8 * Math.cos(ang - 0.4),
      tipY - 8 * Math.sin(ang - 0.4)
    );
    ctx.lineTo(
      tipX - 8 * Math.cos(ang + 0.4),
      tipY - 8 * Math.sin(ang + 0.4)
    );
    ctx.closePath();
    ctx.fillStyle = paper
      ? hi
        ? "#be123c"
        : a.kind === "cell"
          ? "#7c3aed"
          : "#64748b"
      : hi
        ? "#c45c26"
        : a.kind === "cell"
          ? "#6b4c9a"
          : "#94a3b8";
    ctx.fill();

    if (showDelay) {
      const mx = (A.x + B.x) / 2;
      const my = (A.y + B.y) / 2 - 8;
      ctx.fillStyle = paper ? ink : "#334155";
      ctx.font = paper
        ? `11px ${PAPER_FONT}`
        : "11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(String(a.delay), mx, my);
    }
  }

  const pinR = Math.max(13, Math.min(20, Math.min(w, h) * 0.028));
  for (const p of timing.pins) {
    const P = pos[p.id];
    if (!P) continue;
    const hi = highlightPins.has(p.id);
    const r = hi ? pinR + 3 : pinR;
    ctx.beginPath();
    ctx.arc(P.x, P.y, r, 0, Math.PI * 2);
    ctx.fillStyle = paper
      ? PAPER_FILL[p.kind] || PAPER_FILL.default
      : KIND_FILL[p.kind] || KIND_FILL.default;
    ctx.fill();
    ctx.strokeStyle = paper ? ink : hi ? "#c45c26" : "transparent";
    ctx.lineWidth = paper ? (hi ? 2.5 : 1.25) : 3;
    if (paper || hi) ctx.stroke();
    ctx.fillStyle = paper ? ink : "#0f172a";
    ctx.font = paper
      ? `${Math.max(11, Math.min(14, pinR))}px ${PAPER_FONT}`
      : `${Math.max(11, Math.min(14, pinR))}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(p.id, P.x, P.y + r + 14);
    if (levels) {
      ctx.fillStyle = paper ? "#475569" : "#64748b";
      ctx.font = paper
        ? `10px ${PAPER_FONT}`
        : "10px ui-monospace, monospace";
      ctx.fillText(`L${levels[p.id]}`, P.x, P.y + 4);
    }
    if (tags[p.id] != null && tags[p.id] !== "") {
      ctx.fillStyle = paper ? ink : "#0f172a";
      ctx.font = paper
        ? `10px ${PAPER_FONT}`
        : "10px ui-monospace, monospace";
      ctx.fillText(String(tags[p.id]), P.x, P.y - r - 4);
    }
  }

  if (paper && opts.metricText) {
    ctx.fillStyle = ink;
    ctx.font = `bold 12px ${PAPER_FONT}`;
    ctx.textAlign = "left";
    ctx.fillText(opts.metricText, 16, 18);
  }
}
