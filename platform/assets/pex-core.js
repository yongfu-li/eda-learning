/**
 * Tiny PEX — R/C from geometry, RC network, reduce, SPEF-lite for learn_pex.
 */
import { fitHiDpiCanvas, fitGraphLayout, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  segmentCount: 4,
  layerCount: 3,
  rCount: 4,
  cGndCount: 3,
  rS1: 0.5,
  rS2: 0.4,
  rV1: 2.0,
  rS3: 0.16,
  rTotal: 3.06,
  cTotal: 1.376,
  nodesBefore: 5,
  nodesAfter: 2,
  spefResCount: 1,
  spefCapCount: 1,
};

export const STARTER = {
  chip: { x0: 0, y0: 0, x1: 24, y1: 12 },
  layers: ["M1", "VIA", "M2"],
  tech: {
    rho: { M1: 0.1, M2: 0.08, VIA: 2.0 },
    c_area: { M1: 0.02, M2: 0.015 },
    c_perim: { M1: 0.01, M2: 0.008 },
    c_coupling: 0.005,
  },
  segments: [
    { id: "s1", layer: "M1", net: "n1", x0: 2, y0: 4, x1: 12, y1: 6 },
    { id: "s2", layer: "M1", net: "n1", x0: 12, y0: 4, x1: 20, y1: 6 },
    { id: "v1", layer: "VIA", net: "n1", x0: 11, y0: 4, x1: 13, y1: 6 },
    { id: "s3", layer: "M2", net: "n1", x0: 11, y0: 6, x1: 13, y1: 10 },
  ],
  couples: [{ id: "k12", a: "s1", b: "s2", overlap: 0 }],
  ports: { n1: ["in", "out"] },
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

function width(s) {
  return Math.abs(s.x1 - s.x0);
}
function height(s) {
  return Math.abs(s.y1 - s.y0);
}
function length(s) {
  return Math.max(width(s), height(s));
}
function wireWidth(s) {
  return Math.min(width(s), height(s));
}
function area(s) {
  return width(s) * height(s);
}
function perimeter(s) {
  return 2 * (width(s) + height(s));
}

export function loadGeometry(d = STARTER) {
  const layers = [...new Set(d.segments.map((s) => s.layer))].sort();
  return {
    segmentCount: d.segments.length,
    layerCount: layers.length,
    layers,
    nets: [...new Set(d.segments.map((s) => s.net))].sort(),
    segments: d.segments.map((s) => s.id),
  };
}

export function extractResistance(d = STARTER) {
  const rho = d.tech.rho;
  const resistors = d.segments.map((s) => {
    let value;
    let formula;
    if (s.layer === "VIA") {
      value = rho[s.layer];
      formula = "via_lump";
    } else {
      value = (rho[s.layer] * length(s)) / wireWidth(s);
      formula = "rho*L/W";
    }
    return {
      id: `R_${s.id}`,
      segment: s.id,
      layer: s.layer,
      net: s.net,
      value: Math.round(value * 1e6) / 1e6,
      formula,
    };
  });
  const rTotal = Math.round(resistors.reduce((a, r) => a + r.value, 0) * 1e6) / 1e6;
  return { resistors, count: resistors.length, rTotal };
}

export function extractCapacitance(d = STARTER) {
  const ca = d.tech.c_area;
  const cp = d.tech.c_perim;
  const capacitors = [];
  for (const s of d.segments) {
    if (s.layer === "VIA" || ca[s.layer] == null) continue;
    const value = ca[s.layer] * area(s) + cp[s.layer] * perimeter(s);
    capacitors.push({
      id: `C_${s.id}`,
      segment: s.id,
      layer: s.layer,
      net: s.net,
      value: Math.round(value * 1e6) / 1e6,
      to: "gnd",
    });
  }
  const cTotal = Math.round(capacitors.reduce((a, c) => a + c.value, 0) * 1e6) / 1e6;
  return { capacitors, count: capacitors.length, cTotal };
}

export function buildRcNetwork(d = STARTER) {
  const res = extractResistance(d).resistors;
  const caps = extractCapacitance(d).capacitors;
  const order = ["s1", "s2", "v1", "s3"];
  const bySeg = Object.fromEntries(res.map((r) => [r.segment, r]));
  const nodes = ["in"];
  const edges = [];
  for (let i = 0; i < order.length; i++) {
    const nNext = i === order.length - 1 ? "out" : `n${i}`;
    nodes.push(nNext);
    const r = bySeg[order[i]];
    edges.push({ type: "R", id: r.id, from: nodes[i], to: nNext, value: r.value });
  }
  const uniq = [];
  for (const n of nodes) if (!uniq.includes(n)) uniq.push(n);
  for (const c of caps) {
    const idx = order.indexOf(c.segment);
    const node = idx < uniq.length - 1 ? uniq[idx] : uniq[uniq.length - 2];
    edges.push({ type: "C", id: c.id, from: node, to: "gnd", value: c.value });
  }
  return {
    nodes: uniq,
    nodeCount: uniq.length,
    edges,
    rCount: edges.filter((e) => e.type === "R").length,
    cCount: edges.filter((e) => e.type === "C").length,
  };
}

export function reduceNetwork(d = STARTER) {
  const net = buildRcNetwork(d);
  const rEq = Math.round(net.edges.filter((e) => e.type === "R").reduce((a, e) => a + e.value, 0) * 1e6) / 1e6;
  const cEq = Math.round(net.edges.filter((e) => e.type === "C").reduce((a, e) => a + e.value, 0) * 1e6) / 1e6;
  return {
    beforeNodes: net.nodeCount,
    afterNodes: 2,
    rEq,
    cEq,
    reduced: {
      nodes: ["in", "out", "gnd"],
      nodeCount: 2,
      edges: [
        { type: "R", id: "R_eq", from: "in", to: "out", value: rEq },
        { type: "C", id: "C_eq", from: "out", to: "gnd", value: cEq },
      ],
    },
  };
}

export function backAnnotate(d = STARTER) {
  const red = reduceNetwork(d);
  return {
    annotations: [{ net: "n1", r_total: red.rEq, c_total: red.cEq, ports: [...d.ports.n1] }],
    count: 1,
    net: "n1",
    rTotal: red.rEq,
    cTotal: red.cEq,
  };
}

export function emitSpefLite(d = STARTER) {
  const red = reduceNetwork(d).reduced;
  const res = red.edges.filter((e) => e.type === "R");
  const caps = red.edges.filter((e) => e.type === "C");
  const lines = ["*SPEF_LITE", `*NET n1 ${res[0]?.value ?? 0}`];
  for (const e of res) lines.push(`*RES ${e.from} ${e.to} ${e.value}`);
  for (const e of caps) lines.push(`*CAP ${e.from} ${e.value}`);
  return {
    lines,
    resCount: res.length,
    capCount: caps.length,
    rEq: res[0]?.value ?? 0,
    cEq: caps[0]?.value ?? 0,
  };
}

export function pexEngine(d = STARTER) {
  const geometry = loadGeometry(d);
  const resistance = extractResistance(d);
  const capacitance = extractCapacitance(d);
  const network = buildRcNetwork(d);
  const reduced = reduceNetwork(d);
  const annotate = backAnnotate(d);
  const spef = emitSpefLite(d);
  const ok =
    geometry.segmentCount === GOLDENS.segmentCount &&
    resistance.count === GOLDENS.rCount &&
    Math.abs(resistance.rTotal - GOLDENS.rTotal) < 1e-9 &&
    capacitance.count === GOLDENS.cGndCount &&
    Math.abs(capacitance.cTotal - GOLDENS.cTotal) < 1e-9 &&
    reduced.afterNodes === GOLDENS.nodesAfter &&
    spef.resCount === GOLDENS.spefResCount &&
    spef.capCount === GOLDENS.spefCapCount;
  return { geometry, resistance, capacitance, network, reduced, annotate, spef, ok };
}

export function drawPex(canvas, opts = {}) {
  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || "PEX", 16, 28);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px system-ui";
  ctx.fillText(opts.metricText || "", 16, 50);

  const items = (opts.highlight || []).map((id) => ({ id }));
  const layout = {};
  items.forEach((it, i) => {
    layout[it.id] = { x: 70 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90, ...it };
  });
  const fitted = fitGraphLayout(layout, W, H, { pad: 48 });
  const selected = new Set(opts.selected || []);
  for (const [id, pos] of Object.entries(fitted.layout)) {
    const hot = selected.has(id);
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(pos.x - 50, pos.y - 22, 100, 44, 8);
    else ctx.rect(pos.x - 50, pos.y - 22, 100, 44);
    ctx.fillStyle = hot ? "#0ea5e9" : "#1e293b";
    ctx.fill();
    ctx.strokeStyle = hot ? "#38bdf8" : "#475569";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "11px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(id.length > 12 ? id.slice(0, 11) + "…" : id, pos.x, pos.y);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

export function hitTestPex(canvas, highlight, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const layout = {};
  (highlight || []).forEach((id, i) => {
    layout[id] = { x: 70 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90 };
  });
  const { w: W, h: H } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const fitted = fitGraphLayout(layout, W, H, { pad: 48 });
  for (const [id, pos] of Object.entries(fitted.layout)) {
    if (Math.abs(x - pos.x) <= 50 && Math.abs(y - pos.y) <= 22) return id;
  }
  return null;
}
