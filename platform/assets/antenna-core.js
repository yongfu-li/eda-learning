/**
 * Tiny antenna-lite — metal/gate area, ratio, charge, diode, jumper for learn_antenna.
 * Goldens: n1 ratio=25, n2=4, n3=45; raw violations=2; after diode=1; jumper n1→0.
 */
import { fitHiDpiCanvas, fitGraphLayout, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  gateCount: 3,
  metalCount: 4,
  netCount: 3,
  metalAreaN1: 25,
  gateAreaN1: 1,
  ratioN1: 25,
  ratioN2: 4,
  ratioN3: 45,
  chargeN1: 25,
  limitRatio: 10,
  rawViolationCount: 2,
  violationCount: 1,
  violationNets: ["n1"],
  diodeProtected: ["n3"],
  jumperN1Ratio: 0,
  markerCount: 1,
  engineOk: true,
};

export const STARTER = {
  limit_ratio: 10.0,
  charge_k: 1.0,
  gates: [
    { id: "g1", net: "n1", area: 1.0 },
    { id: "g2", net: "n2", area: 2.0 },
    { id: "g3", net: "n3", area: 1.0 },
  ],
  metals: [
    { id: "m1", net: "n1", layer: 2, area: 25.0 },
    { id: "m2", net: "n2", layer: 2, area: 8.0 },
    { id: "m3", net: "n3", layer: 3, area: 40.0 },
    { id: "m3b", net: "n3", layer: 1, area: 5.0 },
  ],
  diodes: [{ id: "d1", net: "n3" }],
  jumpers: [],
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

function netsOf(d) {
  const s = new Set();
  for (const g of d.gates) s.add(g.net);
  for (const m of d.metals) s.add(m.net);
  return [...s].sort();
}

export function designStats(d = STARTER) {
  return {
    gateCount: d.gates.length,
    metalCount: d.metals.length,
    diodeCount: d.diodes.length,
    jumperCount: d.jumpers.length,
    netCount: netsOf(d).length,
    limitRatio: d.limit_ratio,
    nets: netsOf(d),
  };
}

export function metalAreaByNet(d = STARTER, maxLayer = null) {
  const jumperCaps = Object.fromEntries(d.jumpers.map((j) => [j.net, j.max_layer]));
  const out = {};
  for (const m of d.metals) {
    const cap = jumperCaps[m.net] != null ? jumperCaps[m.net] : maxLayer;
    if (cap != null && m.layer > cap) continue;
    out[m.net] = (out[m.net] || 0) + m.area;
  }
  return out;
}

export function gateAreaByNet(d = STARTER) {
  const out = {};
  for (const g of d.gates) out[g.net] = (out[g.net] || 0) + g.area;
  return out;
}

export function antennaRatios(d = STARTER) {
  const metal = metalAreaByNet(d);
  const gate = gateAreaByNet(d);
  const ratios = {};
  for (const net of [...new Set([...Object.keys(metal), ...Object.keys(gate)])].sort()) {
    const ga = gate[net] || 0;
    const ma = metal[net] || 0;
    ratios[net] = ga > 0 ? ma / ga : Infinity;
  }
  return { metal, gate, ratios };
}

export function chargeByNet(d = STARTER) {
  const metal = metalAreaByNet(d);
  const k = d.charge_k ?? 1.0;
  const charge = {};
  for (const [n, a] of Object.entries(metal)) charge[n] = k * a;
  return { k, charge, metal };
}

export function diodeNets(d = STARTER) {
  return [...new Set(d.diodes.map((x) => x.net))].sort();
}

export function findViolations(d = STARTER, applyDiodes = true) {
  const limit = d.limit_ratio;
  const ratios = antennaRatios(d).ratios;
  const protectedNets = applyDiodes ? new Set(diodeNets(d)) : new Set();
  const hits = [];
  for (const [net, ratio] of Object.entries(ratios)) {
    if (protectedNets.has(net)) continue;
    if (ratio > limit) hits.push({ net, ratio, limit });
  }
  hits.sort((a, b) => a.net.localeCompare(b.net));
  return { limit, protected: [...protectedNets].sort(), hits, count: hits.length };
}

export function applyJumper(d = STARTER, net = "n1", maxLayer = 1) {
  const out = cloneDesign(d);
  out.jumpers = out.jumpers.filter((j) => j.net !== net);
  out.jumpers.push({ id: `j_${net}`, net, max_layer: maxLayer });
  return out;
}

export function jumperEffect(d = STARTER) {
  const base = cloneDesign(d);
  const beforeRatio = antennaRatios(base).ratios.n1 ?? 0;
  const afterDesign = applyJumper(base, "n1", 1);
  const afterRatio = antennaRatios(afterDesign).ratios.n1 ?? 0;
  return { beforeRatio, afterRatio, design: afterDesign };
}

export function collectMarkers(d = STARTER) {
  const viol = findViolations(d, true);
  const markers = viol.hits.map((h) => ({ kind: "antenna_ratio", ...h }));
  return { markers, count: markers.length };
}

export function antennaEngine(d = STARTER) {
  const stats = designStats(d);
  const ratios = antennaRatios(d);
  const charge = chargeByNet(d);
  const raw = findViolations(d, false);
  const violations = findViolations(d, true);
  const markers = collectMarkers(d);
  const jumper = jumperEffect(d);
  const ok =
    Math.abs(ratios.ratios.n1 - GOLDENS.ratioN1) < 1e-9 &&
    Math.abs(ratios.ratios.n2 - GOLDENS.ratioN2) < 1e-9 &&
    violations.count === GOLDENS.violationCount &&
    markers.count === GOLDENS.markerCount &&
    Math.abs(jumper.afterRatio - GOLDENS.jumperN1Ratio) < 1e-9;
  return { stats, ratios, charge, raw, violations, markers, jumper, ok };
}

function layoutPositions(d = STARTER) {
  const nodes = {};
  const nets = netsOf(d);
  const colW = 140;
  const baseX = 100;
  const netY = 200;
  nets.forEach((n, i) => {
    nodes[n] = { x: baseX + i * colW, y: netY, kind: "net" };
  });
  d.metals.forEach((m, i) => {
    const nx = nodes[m.net];
    if (!nx) return;
    nodes[m.id] = {
      x: nx.x,
      y: nx.y - 70 - i * 4,
      kind: "metal",
      area: m.area,
      layer: m.layer,
      net: m.net,
    };
  });
  d.gates.forEach((g, i) => {
    const nx = nodes[g.net];
    if (!nx) return;
    nodes[g.id] = {
      x: nx.x,
      y: nx.y + 60 + i * 4,
      kind: "gate",
      area: g.area,
      net: g.net,
    };
  });
  for (const dio of d.diodes) {
    const nx = nodes[dio.net];
    if (!nx) continue;
    nodes[dio.id] = { x: nx.x + 36, y: nx.y + 18, kind: "diode", net: dio.net };
  }
  return nodes;
}

function boxSize(area, nodeR) {
  const side = Math.max(nodeR * 1.2, Math.min(nodeR * 3.5, nodeR * 0.6 + Math.sqrt(area) * 4));
  return side;
}

export function drawAntenna(canvas, opts = {}) {
  const d = opts.design || STARTER;
  const highlight = new Set(opts.highlight || []);
  const selected = new Set(opts.selected || []);
  const metricText = opts.metricText || null;
  const markers = opts.markers || [];
  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight || LAB_CANVAS_CSS_HEIGHT;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f7f5f0";
  ctx.fillRect(0, 0, W, H);

  const raw = layoutPositions(d);
  const { layout, nodeR, fontPx } = fitGraphLayout(raw, W, H, { pad: 40 });

  for (const m of d.metals) {
    const s = layout[m.id];
    const nx = layout[m.net];
    if (!s || !nx) continue;
    const hot = highlight.has(m.net) || highlight.has(m.id);
    ctx.strokeStyle = hot ? "#c45c26" : "#7a8a99";
    ctx.lineWidth = hot ? 2 : 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(nx.x, nx.y - nodeR);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  for (const g of d.gates) {
    const s = layout[g.id];
    const nx = layout[g.net];
    if (!s || !nx) continue;
    const hot = highlight.has(g.net) || highlight.has(g.id);
    ctx.strokeStyle = hot ? "#c45c26" : "#9aa3ad";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(nx.x, nx.y + nodeR);
    ctx.stroke();
  }

  for (const [id, s] of Object.entries(layout)) {
    const kind = raw[id]?.kind;
    const on = highlight.has(id) || selected.has(id) || (raw[id]?.net && selected.has(raw[id].net));
    if (kind === "net") {
      const r = nodeR * 0.9;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = on ? "#ffe8d6" : "#e8eef5";
      ctx.fill();
      ctx.strokeStyle = on ? "#c45c26" : "#5c6570";
      ctx.lineWidth = on ? 2.5 : 1.5;
      ctx.stroke();
      ctx.fillStyle = "#1a1f24";
      ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(id, s.x, s.y);
    } else if (kind === "metal") {
      const side = boxSize(raw[id].area, nodeR);
      ctx.beginPath();
      ctx.roundRect(s.x - side / 2, s.y - side / 2, side, side, 4);
      ctx.fillStyle = on ? "#ffd9a8" : "#d4e4f7";
      ctx.fill();
      ctx.strokeStyle = on ? "#c45c26" : "#4a6fa5";
      ctx.lineWidth = on ? 2 : 1.5;
      ctx.stroke();
      ctx.fillStyle = "#1a1f24";
      ctx.font = `${Math.max(10, fontPx - 2)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`L${raw[id].layer}`, s.x, s.y - 6);
      ctx.fillText(String(raw[id].area), s.x, s.y + 8);
    } else if (kind === "gate") {
      const side = boxSize(raw[id].area, nodeR * 0.85);
      ctx.beginPath();
      ctx.roundRect(s.x - side / 2, s.y - side / 2, side, side, 3);
      ctx.fillStyle = on ? "#d4f0d4" : "#dfe8e2";
      ctx.fill();
      ctx.strokeStyle = on ? "#2a6f4e" : "#5c8570";
      ctx.lineWidth = on ? 2 : 1.5;
      ctx.stroke();
      ctx.fillStyle = "#1a1f24";
      ctx.font = `${Math.max(10, fontPx - 2)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(raw[id].area), s.x, s.y);
    } else if (kind === "diode") {
      ctx.beginPath();
      ctx.moveTo(s.x - 10, s.y);
      ctx.lineTo(s.x + 10, s.y);
      ctx.lineTo(s.x, s.y + 12);
      ctx.closePath();
      ctx.fillStyle = on ? "#ffb3b3" : "#f5c6c6";
      ctx.fill();
      ctx.strokeStyle = "#8b1e1e";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#8b1e1e";
      ctx.font = "10px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.fillText("D", s.x, s.y - 14);
    }
  }

  if (markers.length) {
    ctx.fillStyle = "#8b1e1e";
    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.textAlign = "left";
    markers.slice(0, 6).forEach((m, i) => {
      const label = m.kind + (m.net ? `:${m.net}` : "");
      ctx.fillText(`• ${label}`, 12, 18 + i * 16);
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
  const { layout, nodeR } = fitGraphLayout(raw, W, H, { pad: 40 });
  for (const [id, s] of Object.entries(layout)) {
    if (raw[id]?.kind !== "net") continue;
    if ((x - s.x) ** 2 + (y - s.y) ** 2 <= (nodeR * 0.9) ** 2) return id;
  }
  return null;
}
