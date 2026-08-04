/**
 * Placement canvas + re-exports of challenge chrome from clustering-ui.
 */
import { fitHiDpiCanvas } from "./canvas-hires.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";
import { CELLS, NETS } from "./placement-core.js";

const PALETTE = ["#2a6f6a", "#c45c26", "#3d5a80", "#6b4c9a", "#b08900", "#4a7c59"];

export { createChallengeLab, el, metricsBlock };

function cellColor(id) {
  const i = CELLS.indexOf(id);
  return PALETTE[i >= 0 ? i % PALETTE.length : 0];
}

/**
 * Draw cells + net bounding boxes / edges on a canvas.
 * World coords roughly [0,8]×[0,8] mapped into the canvas with padding.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {string[]} cells
 * @param {Record<string,{x:number,y:number}>} positions
 * @param {string[][]} nets
 * @param {object} [opts]
 * @param {boolean} [opts.showNets=true]
 * @param {boolean} [opts.showBBox=true]
 * @param {number} [opts.grid=2] — draw nxn density grid (0 to hide)
 * @param {Set<string>|string[]} [opts.highlightNets] — net indices or "0","4"
 * @param {string[]} [opts.highlightCells]
 * @param {boolean} [opts.paper] — white bg, black ink, legend (benchmark figures)
 * @param {string} [opts.metricText]
 */
export function drawPlacement(canvas, cells, positions, nets, opts = {}) {
  const paper = !!opts.paper;
  const ink = paper ? "#000000" : "#0f172a";
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

  const { ctx, w, h } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = paper ? "#ffffff" : "#f7faf9";
  ctx.fillRect(0, 0, w, h);

  const pad = 28;
  const legendH = paper ? 28 : 0;
  const worldMin = opts.worldMin ?? -0.5;
  const worldMax = opts.worldMax ?? 8.5;
  const span = worldMax - worldMin;
  const scale = Math.min(
    (w - 2 * pad) / span,
    (h - 2 * pad - legendH) / span
  );
  const ox = (w - span * scale) / 2;
  const oy = (h - 2 * pad - legendH - span * scale) / 2 + pad;

  function map(p) {
    return {
      x: ox + (p.x - worldMin) * scale,
      y: oy + (worldMax - p.y) * scale, // y-up in world
    };
  }

  // density grid
  const grid = opts.grid ?? 2;
  if (grid > 0) {
    ctx.strokeStyle = paper ? "#cbd5e1" : "#e2e8f0";
    ctx.lineWidth = paper ? 1.1 : 1;
    for (let i = 0; i <= grid; i++) {
      const t = worldMin + (span * i) / grid;
      const a = map({ x: t, y: worldMin });
      const b = map({ x: t, y: worldMax });
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      const c = map({ x: worldMin, y: t });
      const d = map({ x: worldMax, y: t });
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(d.x, d.y);
      ctx.stroke();
    }
  }

  // Chip outline
  const o0 = map({ x: 0, y: 8 });
  ctx.strokeStyle = paper ? "#000000" : "#334155";
  ctx.lineWidth = paper ? 2.25 : 1.5;
  ctx.strokeRect(o0.x, o0.y, 8 * scale, 8 * scale);

  const netList = nets || NETS;
  const hiNets = new Set((opts.highlightNets || []).map((x) => String(x)));
  const hiCells = new Set(opts.highlightCells || []);
  const showNets = opts.showNets !== false;
  const showBBox = opts.showBBox !== false;

  if (showNets || showBBox) {
    netList.forEach((net, idx) => {
      const pts = net.map((id) => positions[id]).filter(Boolean);
      if (pts.length < 2) return;
      const hot = hiNets.has(String(idx));
      if (showBBox) {
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const p of pts) {
          minX = Math.min(minX, p.x);
          maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y);
          maxY = Math.max(maxY, p.y);
        }
        const tl = map({ x: minX, y: maxY });
        const br = map({ x: maxX, y: minY });
        ctx.strokeStyle = paper
          ? hot
            ? "#b45309"
            : "#94a3b8"
          : hot
            ? "#b45309"
            : "#cbd5e1";
        ctx.lineWidth = hot ? 2 : paper ? 1.25 : 1;
        ctx.setLineDash(hot ? [] : [4, 3]);
        ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        ctx.setLineDash([]);
      }
      if (showNets) {
        const hub = map(pts[0]);
        ctx.strokeStyle = paper
          ? hot
            ? "#b45309"
            : PAPER_PALETTE[idx % PAPER_PALETTE.length]
          : hot
            ? "#c45c26"
            : "#94a3b8";
        ctx.lineWidth = hot ? 2.5 : paper ? 1.75 : 1.5;
        for (let i = 1; i < pts.length; i++) {
          const q = map(pts[i]);
          ctx.beginPath();
          ctx.moveTo(hub.x, hub.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });
  }

  const list = cells || CELLS;
  const cellR = Math.max(paper ? 12 : 14, Math.min(22, scale * 0.35));
  for (const id of list) {
    const p = positions[id];
    if (!p) continue;
    const m = map(p);
    const r = hiCells.has(id) ? cellR + 2 : cellR;
    const idx = CELLS.indexOf(id);
    ctx.beginPath();
    ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
    ctx.fillStyle = paper
      ? PAPER_PALETTE[idx >= 0 ? idx % PAPER_PALETTE.length : 0]
      : cellColor(id);
    ctx.fill();
    ctx.strokeStyle = paper ? ink : hiCells.has(id) ? "#b45309" : "#0f172a";
    ctx.lineWidth = hiCells.has(id) ? 2.5 : paper ? 1.5 : 1.5;
    ctx.stroke();
    ctx.fillStyle = paper ? "#ffffff" : "#fff";
    ctx.font = paper
      ? `bold ${Math.max(11, Math.min(15, cellR))}px ${PAPER_FONT}`
      : `bold ${Math.max(12, Math.min(16, cellR))}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(id, m.x, m.y);
  }

  if (paper) {
    if (opts.metricText) {
      ctx.fillStyle = ink;
      ctx.font = `bold 12px ${PAPER_FONT}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(opts.metricText, pad, pad - 8);
    }
    const ly = h - Math.round(legendH / 2) - 2;
    let lx = pad;
    ctx.font = `11px ${PAPER_FONT}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (const id of list) {
      if (!positions[id]) continue;
      const idx = CELLS.indexOf(id);
      ctx.beginPath();
      ctx.arc(lx + 5, ly, 4, 0, Math.PI * 2);
      ctx.fillStyle = PAPER_PALETTE[idx >= 0 ? idx % PAPER_PALETTE.length : 0];
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.fillText(id, lx + 12, ly);
      lx += 36;
    }
  }
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

export { PALETTE, cellColor };
