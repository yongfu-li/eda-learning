/**
 * Tiny power-lite — switching/leakage, IR drop, EM for learn_power.
 * Goldens: psw n1=1.0, chip_ptot=5.55, ir_drop_sink=0.4, markers=4, engine ok.
 */
import { fitHiDpiCanvas, fitGraphLayout, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  netCount: 3,
  edgeCount: 3,
  pswN1: 1.0,
  plkN1: 0.1,
  ptotN1: 1.1,
  chipPsw: 5.2,
  chipPlk: 0.35,
  chipPtot: 5.55,
  iSink: 0.1,
  vSink: 0.6,
  irDropSink: 0.4,
  irViolationCount: 1,
  emViolationCount: 3,
  markerCount: 4,
  engineOk: true,
  irLimit: 0.3,
  emLimit: 0.08,
};

export const STARTER = {
  vdd: 1.0,
  freq: 1.0,
  nets: [
    { id: "n1", c: 2.0, alpha: 0.5, ileak: 0.1 },
    { id: "n2", c: 1.0, alpha: 0.2, ileak: 0.05 },
    { id: "n3", c: 4.0, alpha: 1.0, ileak: 0.2 },
  ],
  grid: {
    nodes: ["src", "a", "b", "sink"],
    v_src: 1.0,
    edges: [
      { id: "e1", u: "src", v: "a", r: 1.0 },
      { id: "e2", u: "a", v: "b", r: 2.0 },
      { id: "e3", u: "b", v: "sink", r: 1.0 },
    ],
    i_sink: 0.1,
  },
  ir_limit: 0.3,
  em_limit: 0.08,
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

export function designStats(d = STARTER) {
  return {
    netCount: d.nets.length,
    edgeCount: d.grid.edges.length,
    nodeCount: d.grid.nodes.length,
    vdd: d.vdd,
    freq: d.freq,
    nets: d.nets.map((n) => n.id),
  };
}

export function switchingPower(d = STARTER) {
  const v2 = d.vdd ** 2;
  const f = d.freq;
  const byNet = {};
  for (const n of d.nets) {
    byNet[n.id] = n.alpha * n.c * v2 * f;
  }
  return { byNet, total: Object.values(byNet).reduce((a, b) => a + b, 0), vdd: d.vdd, freq: f };
}

export function leakagePower(d = STARTER) {
  const v = d.vdd;
  const byNet = {};
  for (const n of d.nets) {
    byNet[n.id] = n.ileak * v;
  }
  return { byNet, total: Object.values(byNet).reduce((a, b) => a + b, 0), vdd: v };
}

export function totalPower(d = STARTER) {
  const sw = switchingPower(d);
  const lk = leakagePower(d);
  const byNet = {};
  for (const id of Object.keys(sw.byNet)) {
    byNet[id] = sw.byNet[id] + lk.byNet[id];
  }
  return { switching: sw, leakage: lk, byNet, total: sw.total + lk.total };
}

export function activityFactors(d = STARTER) {
  const alphas = Object.fromEntries(d.nets.map((n) => [n.id, n.alpha]));
  const vals = Object.values(alphas);
  return { alphas, mean: vals.reduce((a, b) => a + b, 0) / vals.length };
}

export function buildPowerGrid(d = STARTER) {
  const g = d.grid;
  return {
    nodes: [...g.nodes],
    edges: g.edges.map((e) => ({ ...e })),
    v_src: g.v_src,
    i_sink: g.i_sink,
    edgeCount: g.edges.length,
  };
}

export function irDropSolve(d = STARTER) {
  const g = d.grid;
  const i = g.i_sink;
  let v = g.v_src;
  const volts = { [g.nodes[0]]: v };
  const edgeDrops = [];
  for (const e of g.edges) {
    const drop = i * e.r;
    edgeDrops.push({ id: e.id, i, r: e.r, drop });
    v -= drop;
    volts[e.v] = v;
  }
  const sink = g.nodes[g.nodes.length - 1];
  return {
    volts,
    edgeDrops,
    iSink: i,
    vSink: volts[sink],
    irDropSink: g.v_src - volts[sink],
  };
}

export function findIrViolations(d = STARTER) {
  const limit = d.ir_limit;
  const ir = irDropSolve(d);
  const hits = [];
  if (ir.irDropSink > limit) {
    hits.push({
      node: d.grid.nodes[d.grid.nodes.length - 1],
      drop: ir.irDropSink,
      limit,
    });
  }
  return { limit, hits, count: hits.length, ir };
}

export function findEmViolations(d = STARTER) {
  const limit = d.em_limit;
  const i = d.grid.i_sink;
  const hits = [];
  for (const e of d.grid.edges) {
    if (i > limit) {
      hits.push({ edge: e.id, i, limit });
    }
  }
  return { limit, hits, count: hits.length };
}

export function collectMarkers(d = STARTER) {
  const markers = [];
  for (const h of findIrViolations(d).hits) {
    markers.push({ kind: "ir_drop", ...h });
  }
  for (const h of findEmViolations(d).hits) {
    markers.push({ kind: "em", ...h });
  }
  return { markers, count: markers.length };
}

export function powerEngine(d = STARTER) {
  const stats = designStats(d);
  const total = totalPower(d);
  const ir = findIrViolations(d);
  const em = findEmViolations(d);
  const markers = collectMarkers(d);
  const ok =
    Math.abs(total.switching.byNet.n1 - GOLDENS.pswN1) < 1e-9 &&
    Math.abs(total.total - GOLDENS.chipPtot) < 1e-9 &&
    Math.abs(ir.ir.irDropSink - GOLDENS.irDropSink) < 1e-9 &&
    ir.count === GOLDENS.irViolationCount &&
    em.count === GOLDENS.emViolationCount &&
    markers.count === GOLDENS.markerCount;
  return { stats, total, ir, em, markers, ok };
}

function layoutPositions(d = STARTER, irVolts = null) {
  const nodes = {};
  const maxPsw = Math.max(...d.nets.map((n) => n.alpha * n.c * d.vdd ** 2 * d.freq), 0.01);
  const leftX = 90;
  const barW = 100;
  d.nets.forEach((n, i) => {
    const y = 50 + i * 70;
    const psw = n.alpha * n.c * d.vdd ** 2 * d.freq;
    nodes[n.id] = { x: leftX, y, kind: "net", psw, barW: (psw / maxPsw) * barW };
  });

  const gridNodes = d.grid.nodes;
  const rightBaseX = 320;
  const gridY = 200;
  const colW = 90;
  gridNodes.forEach((id, i) => {
    nodes[id] = {
      x: rightBaseX + i * colW,
      y: gridY,
      kind: "grid",
      volt: irVolts?.[id] ?? null,
    };
  });
  d.grid.edges.forEach((e, i) => {
    const u = nodes[e.u];
    const v = nodes[e.v];
    if (!u || !v) return;
    nodes[e.id] = {
      x: (u.x + v.x) / 2,
      y: gridY - 28 - i * 4,
      kind: "edge",
      u: e.u,
      v: e.v,
      r: e.r,
    };
  });
  return nodes;
}

export function drawPower(canvas, opts = {}) {
  const d = opts.design || STARTER;
  const highlight = new Set(opts.highlight || []);
  const selected = new Set(opts.selected || []);
  const metricText = opts.metricText || null;
  const markers = opts.markers || [];
  const irVolts = opts.irVolts || null;
  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight || LAB_CANVAS_CSS_HEIGHT;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f7f5f0";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#5c6570";
  ctx.font = "600 11px ui-sans-serif, system-ui";
  ctx.textAlign = "left";
  ctx.fillText("Nets (Psw)", 12, 18);
  ctx.fillText("Power grid (IR)", 280, 18);

  const raw = layoutPositions(d, irVolts);
  const { layout, nodeR, fontPx } = fitGraphLayout(raw, W, H, { pad: 36 });

  for (const e of d.grid.edges) {
    const s = layout[e.u];
    const t = layout[e.v];
    if (!s || !t) continue;
    const hot = highlight.has(e.id) || highlight.has(e.u) || highlight.has(e.v);
    ctx.strokeStyle = hot ? "#c45c26" : "#7a8a99";
    ctx.lineWidth = hot ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(t.x, t.y);
    ctx.stroke();
    const mid = layout[e.id];
    if (mid) {
      ctx.fillStyle = hot ? "#c45c26" : "#4a6fa5";
      ctx.font = `${Math.max(9, fontPx - 3)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(`R=${e.r}`, mid.x, mid.y);
    }
  }

  for (const [id, s] of Object.entries(layout)) {
    const kind = raw[id]?.kind;
    const on = highlight.has(id) || selected.has(id);
    if (kind === "net") {
      const barLen = raw[id].barW;
      ctx.fillStyle = on ? "#ffd9a8" : "#d4e4f7";
      ctx.fillRect(s.x, s.y - 10, barLen, 20);
      ctx.strokeStyle = on ? "#c45c26" : "#4a6fa5";
      ctx.lineWidth = on ? 2 : 1.5;
      ctx.strokeRect(s.x, s.y - 10, barLen, 20);
      ctx.fillStyle = "#1a1f24";
      ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(id, s.x - 28, s.y);
      ctx.font = `${Math.max(10, fontPx - 2)}px ui-sans-serif, system-ui`;
      ctx.fillText(raw[id].psw.toFixed(2), s.x + barLen + 6, s.y);
    } else if (kind === "grid") {
      const r = nodeR * 0.85;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = on ? "#ffe8d6" : "#e8eef5";
      ctx.fill();
      ctx.strokeStyle = on ? "#c45c26" : "#5c6570";
      ctx.lineWidth = on ? 2.5 : 1.5;
      ctx.stroke();
      ctx.fillStyle = "#1a1f24";
      ctx.font = `600 ${Math.max(10, fontPx - 1)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(id, s.x, s.y - 8);
      if (raw[id].volt != null) {
        ctx.font = `${Math.max(9, fontPx - 2)}px ui-sans-serif, system-ui`;
        ctx.fillText(`${raw[id].volt.toFixed(2)}V`, s.x, s.y + 10);
      }
    }
  }

  if (markers.length) {
    ctx.fillStyle = "#8b1e1e";
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.textAlign = "left";
    markers.slice(0, 8).forEach((m, i) => {
      const label = m.kind + (m.node ? `:${m.node}` : m.edge ? `:${m.edge}` : "");
      ctx.fillText(`• ${label}`, 12, H - 80 + i * 14);
    });
  }
  if (metricText) {
    ctx.fillStyle = "#1a1f24";
    ctx.font = "600 13px ui-sans-serif, system-ui";
    ctx.textAlign = "right";
    ctx.fillText(metricText, W - 12, H - 14);
  }
}

export function hitTestNet(canvas, design, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const W = canvas.clientWidth;
  const H = canvas.clientHeight || LAB_CANVAS_CSS_HEIGHT;
  const raw = layoutPositions(design);
  const { layout } = fitGraphLayout(raw, W, H, { pad: 36 });
  for (const n of design.nets) {
    const s = layout[n.id];
    if (!s) continue;
    const barLen = raw[n.id].barW;
    if (x >= s.x && x <= s.x + barLen && y >= s.y - 12 && y <= s.y + 12) return n.id;
  }
  return null;
}
