/**
 * Tiny ERC-lite — connectivity / floating / multi-drive / shorts / wells for learn_erc.
 * Goldens: float_n, z multi-drive, short1 vdd↔vss, nw1 bad nwell → 5 markers.
 */
import { fitHiDpiCanvas, fitGraphLayout, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  netCount: 8,
  instanceCount: 4,
  edgeCount: 14,
  floatingCount: 1,
  floatingNets: ["float_n"],
  undrivenCount: 1,
  multiDrivenCount: 1,
  multiDrivenNets: ["z"],
  supplyShortCount: 1,
  wellErrorCount: 1,
  markerCount: 5,
};

export const STARTER = {
  nets: ["vdd", "vss", "a", "b", "y", "float_n", "z", "well_n"],
  supplies: { vdd: "power", vss: "ground" },
  ports: { a: "input", b: "input", y: "output" },
  instances: [
    { id: "u1", cell: "INV", pins: { A: "a", Y: "y", VDD: "vdd", VSS: "vss" } },
    { id: "u2", cell: "INV", pins: { A: "float_n", Y: "z", VDD: "vdd", VSS: "vss" } },
    { id: "u3", cell: "BUF", pins: { A: "b", Y: "z", VDD: "vdd", VSS: "vss" } },
    { id: "short1", cell: "SHORT", pins: { P1: "vdd", P2: "vss" } },
  ],
  wells: [{ id: "nw1", type: "nwell", net: "well_n", tied_to: "vss" }],
  pin_dirs: {
    INV: { A: "in", Y: "out", VDD: "power", VSS: "ground" },
    BUF: { A: "in", Y: "out", VDD: "power", VSS: "ground" },
    SHORT: { P1: "io", P2: "io" },
  },
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

function pinDir(d, cell, pin) {
  return d.pin_dirs[cell][pin];
}

function iterPins(d) {
  const out = [];
  for (const inst of d.instances) {
    for (const [pin, net] of Object.entries(inst.pins)) {
      out.push({ inst: inst.id, pin, net, dir: pinDir(d, inst.cell, pin) });
    }
  }
  return out;
}

export function designStats(d = STARTER) {
  const edges = iterPins(d);
  return {
    netCount: d.nets.length,
    instanceCount: d.instances.length,
    edgeCount: edges.length,
    portCount: Object.keys(d.ports).length,
    supplyCount: Object.keys(d.supplies).length,
    wellCount: d.wells.length,
    nets: [...d.nets],
    instances: d.instances.map((i) => i.id),
  };
}

export function buildConnectivity(d = STARTER) {
  const edges = iterPins(d);
  return {
    nets: [...d.nets],
    instances: d.instances.map((i) => i.id),
    edges,
    edgeCount: edges.length,
  };
}

export function driversAndLoads(d = STARTER) {
  const byNet = Object.fromEntries(
    d.nets.map((n) => [n, { drivers: [], loads: [], power: [], ground: [], io: [] }]),
  );
  for (const e of iterPins(d)) {
    const entry = { inst: e.inst, pin: e.pin };
    if (e.dir === "out") byNet[e.net].drivers.push(entry);
    else if (e.dir === "in") byNet[e.net].loads.push(entry);
    else if (e.dir === "power") byNet[e.net].power.push(entry);
    else if (e.dir === "ground") byNet[e.net].ground.push(entry);
    else byNet[e.net].io.push(entry);
  }
  return {
    byNet,
    driverPinCount: Object.values(byNet).reduce((s, v) => s + v.drivers.length, 0),
  };
}

export function findFloatingNets(d = STARTER) {
  const dl = driversAndLoads(d);
  const nets = [];
  for (const [net, info] of Object.entries(dl.byNet)) {
    if (d.supplies[net] || d.ports[net]) continue;
    if (info.drivers.length) continue;
    if (!info.loads.length && !info.io.length) continue;
    nets.push(net);
  }
  nets.sort();
  return { nets, count: nets.length };
}

export function findUndrivenInputs(d = STARTER) {
  const dl = driversAndLoads(d);
  const hits = [];
  for (const [net, info] of Object.entries(dl.byNet)) {
    if (d.ports[net] === "input") continue;
    if (info.drivers.length) continue;
    for (const load of info.loads) hits.push({ ...load, net });
  }
  hits.sort((a, b) => (a.inst + a.pin).localeCompare(b.inst + b.pin));
  return { hits, count: hits.length };
}

export function findMultiDriven(d = STARTER) {
  const dl = driversAndLoads(d);
  const nets = [];
  const detail = {};
  for (const [net, info] of Object.entries(dl.byNet)) {
    if (info.drivers.length >= 2) {
      nets.push(net);
      detail[net] = info.drivers;
    }
  }
  nets.sort();
  return { nets, count: nets.length, detail };
}

export function findSupplyShorts(d = STARTER) {
  const hits = [];
  for (const inst of d.instances) {
    if (inst.cell !== "SHORT") continue;
    const nets = Object.values(inst.pins);
    const kinds = new Set(nets.map((n) => d.supplies[n]));
    if (kinds.has("power") && kinds.has("ground")) hits.push({ inst: inst.id, nets });
  }
  return { hits, count: hits.length };
}

export function findWellErrors(d = STARTER) {
  const hits = [];
  for (const w of d.wells) {
    const kind = d.supplies[w.tied_to];
    if (w.type === "nwell" && kind !== "power") hits.push({ ...w, expected: "power", got: kind });
    if (w.type === "pwell" && kind !== "ground") hits.push({ ...w, expected: "ground", got: kind });
  }
  return { hits, count: hits.length };
}

export function collectMarkers(d = STARTER) {
  const markers = [];
  for (const net of findFloatingNets(d).nets) markers.push({ kind: "floating", net });
  for (const h of findUndrivenInputs(d).hits) markers.push({ kind: "undriven", ...h });
  for (const net of findMultiDriven(d).nets) markers.push({ kind: "multi_driven", net });
  for (const h of findSupplyShorts(d).hits) markers.push({ kind: "supply_short", ...h });
  for (const h of findWellErrors(d).hits) {
    markers.push({ kind: "well_error", well: h.id, net: h.net });
  }
  return { markers, count: markers.length };
}

export function ercEngine(d = STARTER) {
  const stats = designStats(d);
  const floating = findFloatingNets(d);
  const undriven = findUndrivenInputs(d);
  const multi = findMultiDriven(d);
  const shorts = findSupplyShorts(d);
  const wells = findWellErrors(d);
  const markers = collectMarkers(d);
  const ok =
    floating.count === GOLDENS.floatingCount &&
    undriven.count === GOLDENS.undrivenCount &&
    multi.count === GOLDENS.multiDrivenCount &&
    shorts.count === GOLDENS.supplyShortCount &&
    wells.count === GOLDENS.wellErrorCount &&
    markers.count === GOLDENS.markerCount;
  return { stats, floating, undriven, multi, shorts, wells, markers, ok };
}

export function layoutPositions(d = STARTER) {
  const nodes = {};
  d.instances.forEach((inst, i) => {
    nodes[inst.id] = { x: 80, y: 60 + i * 90, kind: "inst" };
  });
  const netCols = { vdd: 0, vss: 1, a: 2, b: 3, y: 4, float_n: 5, z: 6, well_n: 7 };
  d.nets.forEach((n, i) => {
    const col = netCols[n] ?? i;
    nodes[n] = { x: 320 + (col % 4) * 90, y: 50 + Math.floor(col / 4) * 120, kind: "net" };
  });
  return nodes;
}

export function drawErc(canvas, opts = {}) {
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
  const { layout, nodeR, fontPx, edgeW } = fitGraphLayout(raw, W, H, { pad: 36 });

  const edges = iterPins(d);
  for (const e of edges) {
    const a = layout[e.inst];
    const b = layout[e.net];
    if (!a || !b) continue;
    const hot = highlight.has(e.net) || highlight.has(e.inst);
    ctx.strokeStyle = hot ? "#c45c26" : e.dir === "out" ? "#2a6f4e" : "#9aa3ad";
    ctx.lineWidth = edgeW;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  for (const [id, s] of Object.entries(layout)) {
    const isNet = raw[id]?.kind === "net";
    const r = isNet ? nodeR * 0.85 : nodeR;
    const on = highlight.has(id) || selected.has(id);
    ctx.beginPath();
    if (isNet) ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
    else ctx.roundRect(s.x - r, s.y - r * 0.7, r * 2, r * 1.4, 6);
    ctx.fillStyle = on ? "#ffe8d6" : isNet ? "#e8eef5" : "#dfe8e2";
    ctx.fill();
    ctx.strokeStyle = on ? "#c45c26" : "#5c6570";
    ctx.lineWidth = on ? 2.5 : 1.5;
    ctx.stroke();
    ctx.fillStyle = "#1a1f24";
    ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(id, s.x, s.y);
  }

  if (markers.length) {
    ctx.fillStyle = "#8b1e1e";
    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.textAlign = "left";
    markers.slice(0, 6).forEach((m, i) => {
      const label = m.kind + (m.net ? `:${m.net}` : m.well ? `:${m.well}` : "");
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
  const { layout, nodeR } = fitGraphLayout(raw, W, H, { pad: 36 });
  for (const [id, s] of Object.entries(layout)) {
    if (raw[id]?.kind !== "net") continue;
    if ((x - s.x) ** 2 + (y - s.y) ** 2 <= (nodeR * 0.85) ** 2) return id;
  }
  return null;
}
