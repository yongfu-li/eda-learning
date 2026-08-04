/**
 * Tiny logic synthesis instance — AIG + library for learn_synthesis.
 * f = (~(a&b) & c) & (a&c)
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const PI = ["a", "b", "c"];
export const PO = "f";

/** AIG nodes: pi | and with fanin [[id, comp], ...] */
export const AIG_NODES = [
  { id: 1, type: "pi", name: "a" },
  { id: 2, type: "pi", name: "b" },
  { id: 3, type: "pi", name: "c" },
  { id: 4, type: "and", fanin: [[1, false], [2, false]] },
  { id: 5, type: "and", fanin: [[4, true], [3, false]] },
  { id: 6, type: "and", fanin: [[1, false], [3, false]] },
  { id: 7, type: "and", fanin: [[5, false], [6, false]], po: "f" },
];

export const LIBRARY = [
  { id: "INV", area: 1, delay: 1, inputs: 1, invert: true },
  { id: "BUF", area: 1, delay: 1, inputs: 1 },
  { id: "NAND2", area: 2, delay: 2, inputs: 2 },
  { id: "NOR2", area: 2, delay: 2, inputs: 2 },
  { id: "AND2", area: 2, delay: 2, inputs: 2 },
  { id: "AOI21", area: 3, delay: 3, inputs: 3 },
];

export const CUT_K = 3;

export const GOLDENS = {
  pi: 3,
  and: 4,
  po: 1,
  libCount: 6,
  cutK: 3,
  strashEntries: 4,
  mapAreaMin: 8,
  fAt101: 1,
  fAt111: 0,
};

export function nodeById(nodes = AIG_NODES) {
  const m = {};
  for (const n of nodes) m[n.id] = n;
  return m;
}

export function aigStats(nodes = AIG_NODES) {
  return {
    pi: nodes.filter((n) => n.type === "pi").length,
    and: nodes.filter((n) => n.type === "and").length,
    po: nodes.filter((n) => n.po).length,
    total: nodes.length,
  };
}

export function evalAig(assignment, nodes = AIG_NODES) {
  const by = nodeById(nodes);
  const values = {};
  for (const id of Object.keys(by).map(Number).sort((a, b) => a - b)) {
    const n = by[id];
    if (n.type === "pi") values[id] = assignment[n.name] & 1;
    else {
      const bits = n.fanin.map(([cid, comp]) => (comp ? 1 - values[cid] : values[cid]));
      values[id] = bits[0] & bits[1];
    }
  }
  return values;
}

export function outputValue(assignment, nodes = AIG_NODES, po = PO) {
  const vals = evalAig(assignment, nodes);
  const n = nodes.find((x) => x.po === po);
  return vals[n.id];
}

function litKey(a, b) {
  const ka = `${a[0]}:${a[1] ? 1 : 0}`;
  const kb = `${b[0]}:${b[1] ? 1 : 0}`;
  return ka <= kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

export function buildStrashTable(nodes = AIG_NODES) {
  const table = {};
  for (const n of nodes) {
    if (n.type !== "and") continue;
    table[litKey(n.fanin[0], n.fanin[1])] = n.id;
  }
  return table;
}

export function localRewriteCount(nodes = AIG_NODES) {
  const by = nodeById(nodes);
  const opportunities = [];
  for (const n of nodes) {
    if (n.type !== "and") continue;
    const comps = n.fanin.filter(([, c]) => c).length;
    const andChildren = n.fanin.filter(([cid]) => by[cid].type === "and").length;
    if (comps >= 1 || andChildren >= 1) opportunities.push({ node: n.id, comps, andChildren });
  }
  return { count: opportunities.length, nodes: opportunities };
}

export function applyInverterPush(nodes = AIG_NODES) {
  const rewrites = [];
  for (const n of nodes) {
    if (n.type !== "and") continue;
    if (n.fanin[0][1] && n.fanin[1][1]) {
      rewrites.push({ node: n.id, rule: "both_comp_and", note: "AND(~x,~y) ≡ NOR(x,y)" });
    }
  }
  return { rewrites, applied: rewrites.length };
}

export function enumerateCuts(nodes = AIG_NODES, k = CUT_K) {
  const by = nodeById(nodes);
  const cuts = {};
  for (const id of Object.keys(by).map(Number).sort((a, b) => a - b)) {
    const n = by[id];
    if (n.type === "pi") {
      cuts[id] = [new Set([id])];
      continue;
    }
    const left = cuts[n.fanin[0][0]];
    const right = cuts[n.fanin[1][0]];
    const combined = [new Set([id])];
    const seen = new Set([`${id}`]);
    for (const c1 of left) {
      for (const c2 of right) {
        const u = new Set([...c1, ...c2]);
        if (u.size <= k) {
          const key = [...u].sort((a, b) => a - b).join(",");
          if (!seen.has(key)) {
            seen.add(key);
            combined.push(u);
          }
        }
      }
    }
    cuts[id] = combined.slice(0, 16);
  }
  return cuts;
}

export function cutStats(cuts) {
  const vals = Object.values(cuts);
  return {
    nodes: vals.length,
    totalCuts: vals.reduce((s, v) => s + v.length, 0),
    maxPerNode: Math.max(0, ...vals.map((v) => v.length)),
  };
}

export function techmapArea(nodes = AIG_NODES, library = LIBRARY) {
  const lib = Object.fromEntries(library.map((c) => [c.id, c]));
  const mapping = [];
  let area = 0;
  let delaySum = 0;
  let invCount = 0;
  for (const n of nodes) {
    if (n.type !== "and") continue;
    const bothComp = n.fanin[0][1] && n.fanin[1][1];
    const cell = bothComp && lib.NOR2 ? lib.NOR2 : lib.AND2 || lib.NAND2;
    mapping.push({ node: n.id, cell: cell.id, area: cell.area });
    area += cell.area;
    delaySum += cell.delay;
    for (const [, comp] of n.fanin) if (comp) invCount++;
  }
  const invArea = invCount * (lib.INV?.area || 1);
  return {
    mapping,
    area: area + invArea,
    andArea: area,
    invArea,
    invCount,
    delaySum,
    cuts: cutStats(enumerateCuts(nodes)),
  };
}

export function techmapDelay(nodes = AIG_NODES, library = LIBRARY) {
  const m = techmapArea(nodes, library);
  const andDelay = library.find((c) => c.id === "AND2")?.delay || 2;
  const depth = nodes.filter((n) => n.type === "and").length;
  return { ...m, delayDepth: depth * andDelay, mode: "delay" };
}

export function areaDelayTradeoff(nodes = AIG_NODES, library = LIBRARY) {
  const a = techmapArea(nodes, library);
  const d = techmapDelay(nodes, library);
  return {
    areaMode: { area: a.area, delaySum: a.delaySum },
    delayMode: { area: d.area, delayDepth: d.delayDepth },
    librarySize: library.length,
  };
}

export function sequentialSynth(nodes = AIG_NODES) {
  return {
    stats: aigStats(nodes),
    strashEntries: Object.keys(buildStrashTable(nodes)).length,
    rewrite: applyInverterPush(nodes),
    cuts: cutStats(enumerateCuts(nodes)),
    mapping: techmapArea(nodes),
    tradeoff: areaDelayTradeoff(nodes),
  };
}

/** Layout positions for drawing (fixed toy graph). */
export const LAYOUT = {
  1: { x: 1.5, y: 6 },
  2: { x: 4, y: 6 },
  3: { x: 6.5, y: 6 },
  4: { x: 2.5, y: 4 },
  5: { x: 5, y: 3 },
  6: { x: 7.5, y: 4 },
  7: { x: 6, y: 1.5 },
};

export function drawSynthesis(canvas, opts = {}) {
  const nodes = opts.nodes || AIG_NODES;
  const layout = opts.layout || LAYOUT;
  const highlight = new Set(opts.highlight || []);
  const mapping = opts.mapping || null;
  const cuts = opts.cuts || null;
  const selected = opts.selectedNode ?? null;
  const paper = !!opts.paper;
  const ink = paper ? "#000000" : "#0f172a";
  const PAPER_FONT =
    "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const PAPER_FILL = {
    pi: "#1d4ed8",
    and: "#0f6b5c",
    mapped: "#b45309",
    po: "#9f1239",
    bubble: "#6d28d9",
  };
  const PAPER_AND = ["#0f6b5c", "#0369a1", "#c2410c", "#7c3aed"];

  if (paper) canvas.style.background = "#ffffff";

  const { ctx, w, h } = fitHiDpiCanvas(canvas, { w: 640, h: LAB_CANVAS_CSS_HEIGHT });
  ctx.clearRect(0, 0, w, h);
  const pad = paper ? 36 : 28;
  const legendH = paper ? 28 : 0;
  const titleH = paper && opts.metricText ? 22 : 0;
  const CHIP_W = 12;
  const CHIP_H = 8;
  const scale = Math.min(
    (w - 2 * pad) / CHIP_W,
    (h - 2 * pad - legendH - titleH) / CHIP_H
  );
  const ox = (w - CHIP_W * scale) / 2;
  const oy =
    h - pad - legendH - (h - 2 * pad - legendH - titleH - CHIP_H * scale) / 2;
  const toScreen = (x, y) => ({ sx: ox + x * scale, sy: oy - y * scale });

  ctx.fillStyle = paper ? "#ffffff" : "#f8fafc";
  ctx.fillRect(0, 0, w, h);

  if (paper) {
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      pad * 0.55,
      pad * 0.55 + titleH * 0.3,
      w - pad * 1.1,
      h - pad * 1.1 - legendH
    );
  }

  // edges
  for (const n of nodes) {
    if (n.type !== "and") continue;
    const p1 = layout[n.id];
    if (!p1) continue;
    for (const [cid, comp] of n.fanin) {
      const p0 = layout[cid];
      if (!p0) continue;
      const a = toScreen(p0.x, p0.y);
      const b = toScreen(p1.x, p1.y);
      const hot = highlight.has(n.id) || highlight.has(cid) || selected === n.id;
      ctx.strokeStyle = paper
        ? hot
          ? "#b45309"
          : "#64748b"
        : hot
          ? "rgba(234,179,8,0.95)"
          : "rgba(100,116,139,0.75)";
      ctx.lineWidth = paper ? (hot ? 3 : 1.75) : hot ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
      if (paper) {
        const ang = Math.atan2(b.sy - a.sy, b.sx - a.sx);
        const tipX = b.sx - 12 * Math.cos(ang);
        const tipY = b.sy - 12 * Math.sin(ang);
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - 7 * Math.cos(ang - 0.4), tipY - 7 * Math.sin(ang - 0.4));
        ctx.lineTo(tipX - 7 * Math.cos(ang + 0.4), tipY - 7 * Math.sin(ang + 0.4));
        ctx.closePath();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      }
      if (comp) {
        const mx = (a.sx + b.sx) / 2;
        const my = (a.sy + b.sy) / 2;
        ctx.beginPath();
        ctx.arc(mx, my, paper ? 5.5 : 5, 0, Math.PI * 2);
        ctx.fillStyle = paper ? PAPER_FILL.bubble : "#a855f7";
        ctx.fill();
        if (paper) {
          ctx.strokeStyle = ink;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }
  }

  let andIdx = 0;
  for (const n of nodes) {
    const p = layout[n.id];
    if (!p) continue;
    const { sx, sy } = toScreen(p.x, p.y);
    const active = selected === n.id || highlight.has(n.id);
    if (n.type === "pi") {
      const rad = paper ? (active ? 15 : 13) : active ? 14 : 12;
      ctx.beginPath();
      ctx.arc(sx, sy, rad, 0, Math.PI * 2);
      ctx.fillStyle = paper ? PAPER_FILL.pi : active ? "#3b82f6" : "#60a5fa";
      ctx.fill();
      if (paper) {
        ctx.strokeStyle = ink;
        ctx.lineWidth = active ? 2.25 : 1.35;
        ctx.stroke();
      }
      ctx.fillStyle = paper ? "#ffffff" : "#0f172a";
      ctx.font = paper ? `bold 13px ${PAPER_FONT}` : "13px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.name, sx, sy);
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    } else {
      const cell = mapping?.find((m) => m.node === n.id);
      const bw = paper ? 40 : 32;
      const bh = paper ? 28 : 24;
      ctx.fillStyle = paper
        ? cell
          ? PAPER_FILL.mapped
          : PAPER_AND[andIdx % PAPER_AND.length]
        : cell
          ? "#f59e0b"
          : active
            ? "#22c55e"
            : "#4ade80";
      andIdx += 1;
      if (paper) ctx.globalAlpha = 0.92;
      ctx.fillRect(sx - bw / 2, sy - bh / 2, bw, bh);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = paper ? ink : "#14532d";
      ctx.lineWidth = paper ? (active ? 2.25 : 1.5) : 1.5;
      ctx.strokeRect(sx - bw / 2, sy - bh / 2, bw, bh);
      ctx.fillStyle = "#ffffff";
      ctx.font = paper
        ? `bold 10px ${PAPER_FONT}`
        : "11px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(cell ? cell.cell : `∧${n.id}`, sx, sy);
      if (n.po) {
        ctx.fillStyle = paper ? PAPER_FILL.po : "#ef4444";
        ctx.font = paper ? `bold 11px ${PAPER_FONT}` : "11px ui-sans-serif, system-ui";
        ctx.fillText(n.po, sx + bw / 2 + 10, sy - 10);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }
    if (cuts && cuts[n.id] && selected === n.id) {
      ctx.fillStyle = paper ? ink : "rgba(15,23,42,0.8)";
      ctx.font = paper ? `11px ${PAPER_FONT}` : "11px ui-sans-serif, system-ui";
      ctx.fillText(`cuts:${cuts[n.id].length}`, sx - 16, sy + 26);
    }
  }

  if (opts.metricText) {
    if (paper) {
      ctx.fillStyle = ink;
      ctx.font = `bold 13px ${PAPER_FONT}`;
      ctx.textAlign = "left";
      ctx.fillText(opts.metricText, pad, pad - 10);
    } else {
      ctx.fillStyle = "rgba(15,23,42,0.85)";
      ctx.fillRect(pad, pad - 4, Math.min(420, w - 2 * pad), 22);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "13px ui-sans-serif, system-ui";
      ctx.fillText(opts.metricText, pad + 8, pad + 12);
    }
  }

  if (paper) {
    const ly = h - Math.round(legendH / 2) - 2;
    let lx = pad;
    ctx.font = `11px ${PAPER_FONT}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const items = [
      { label: "PI", color: PAPER_FILL.pi, shape: "circle" },
      { label: "AND", color: PAPER_FILL.and, shape: "rect" },
      { label: "mapped", color: PAPER_FILL.mapped, shape: "rect" },
      { label: "comp", color: PAPER_FILL.bubble, shape: "circle" },
    ];
    for (const it of items) {
      if (it.shape === "circle") {
        ctx.beginPath();
        ctx.arc(lx + 5, ly, 5, 0, Math.PI * 2);
        ctx.fillStyle = it.color;
        ctx.fill();
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else {
        ctx.fillStyle = it.color;
        ctx.fillRect(lx, ly - 5, 10, 10);
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(lx, ly - 5, 10, 10);
      }
      ctx.fillStyle = ink;
      ctx.fillText(it.label, lx + 16, ly);
      lx += 16 + ctx.measureText(it.label).width + 16;
    }
    ctx.textBaseline = "alphabetic";
  }

  return { scale, toScreen };
}

export function hitNode(layout, canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const w = canvas.clientWidth || rect.width || 640;
  const h = canvas.clientHeight || rect.height || LAB_CANVAS_CSS_HEIGHT;
  const pad = 28;
  const CHIP_W = 12;
  const CHIP_H = 8;
  const scale = Math.min((w - 2 * pad) / CHIP_W, (h - 2 * pad) / CHIP_H);
  const ox = (w - CHIP_W * scale) / 2;
  const oy = h - pad - (h - 2 * pad - CHIP_H * scale) / 2;
  const wx = (clientX - rect.left - ox) / scale;
  const wy = (oy - (clientY - rect.top)) / scale;
  let best = null;
  let bestD = 0.8;
  for (const [id, p] of Object.entries(layout)) {
    const d = Math.hypot(p.x - wx, p.y - wy);
    if (d < bestD) {
      bestD = d;
      best = Number(id);
    }
  }
  return best;
}
