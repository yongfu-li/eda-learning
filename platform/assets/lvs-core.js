/**
 * Tiny LVS — schematic/layout graphs, device match, compare for learn_lvs.
 */
import { fitHiDpiCanvas, fitGraphLayout, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  schDeviceCount: 2,
  schNetCount: 4,
  schPortCount: 4,
  layShapeCount: 9,
  layDeviceCount: 2,
  layNetCount: 4,
  recogNmos: 1,
  recogPmos: 1,
  matchedDevices: 2,
  matchedNets: 4,
  mismatchCount: 0,
};

export const STARTER = {
  schematic: {
    ports: { a: "input", y: "output", vdd: "power", vss: "ground" },
    devices: [
      { id: "mn1", type: "nmos", pins: { G: "a", D: "y", S: "vss" } },
      { id: "mp1", type: "pmos", pins: { G: "a", D: "y", S: "vdd" } },
    ],
  },
  layout: {
    layers: ["DIFF", "POLY", "M1", "NPLUS", "PPLUS"],
    shapes: [
      { id: "ndiff", layer: "DIFF", x0: 2, y0: 2, x1: 10, y1: 6 },
      { id: "pdiff", layer: "DIFF", x0: 2, y0: 10, x1: 10, y1: 14 },
      { id: "poly", layer: "POLY", x0: 5, y0: 1, x1: 7, y1: 15 },
      { id: "nplus", layer: "NPLUS", x0: 2, y0: 2, x1: 10, y1: 6 },
      { id: "pplus", layer: "PPLUS", x0: 2, y0: 10, x1: 10, y1: 14 },
      { id: "m1_a", layer: "M1", x0: 5, y0: 7, x1: 7, y1: 9 },
      { id: "m1_y", layer: "M1", x0: 8, y0: 4, x1: 14, y1: 12 },
      { id: "m1_vss", layer: "M1", x0: 0, y0: 2, x1: 3, y1: 6 },
      { id: "m1_vdd", layer: "M1", x0: 0, y0: 10, x1: 3, y1: 14 },
    ],
    devices: [
      { id: "X0", type: "nmos", pins: { G: "net_a", D: "net_y", S: "net_vss" }, from_shapes: ["ndiff", "poly", "nplus"] },
      { id: "X1", type: "pmos", pins: { G: "net_a", D: "net_y", S: "net_vdd" }, from_shapes: ["pdiff", "poly", "pplus"] },
    ],
    nets: {
      net_a: { shapes: ["poly", "m1_a"], port: "a" },
      net_y: { shapes: ["m1_y"], port: "y" },
      net_vss: { shapes: ["m1_vss", "ndiff"], port: "vss" },
      net_vdd: { shapes: ["m1_vdd", "pdiff"], port: "vdd" },
    },
  },
  binding: {
    devices: { X0: "mn1", X1: "mp1" },
    nets: { net_a: "a", net_y: "y", net_vss: "vss", net_vdd: "vdd" },
  },
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

function schNets(d) {
  const nets = new Set(Object.keys(d.schematic.ports));
  for (const dev of d.schematic.devices) Object.values(dev.pins).forEach((n) => nets.add(n));
  return [...nets].sort();
}

export function schematicGraph(d = STARTER) {
  const devices = d.schematic.devices;
  const nets = schNets(d);
  const edges = [];
  for (const dev of devices) {
    for (const [pin, net] of Object.entries(dev.pins).sort()) {
      edges.push({ device: dev.id, pin, net, type: dev.type });
    }
  }
  return {
    devices: devices.map((x) => x.id),
    types: Object.fromEntries(devices.map((x) => [x.id, x.type])),
    nets,
    ports: { ...d.schematic.ports },
    edges,
    deviceCount: devices.length,
    netCount: nets.length,
    portCount: Object.keys(d.schematic.ports).length,
    edgeCount: edges.length,
  };
}

export function recognizeDevices(d = STARTER) {
  const devices = d.layout.devices;
  const byType = {};
  for (const dev of devices) (byType[dev.type] ||= []).push(dev.id);
  return {
    devices,
    count: devices.length,
    byType,
    nmos: (byType.nmos || []).length,
    pmos: (byType.pmos || []).length,
    shapeCount: d.layout.shapes.length,
  };
}

export function extractNets(d = STARTER) {
  const rows = Object.entries(d.layout.nets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, info]) => ({
      id,
      shapes: [...info.shapes],
      port: info.port,
      shapeCount: info.shapes.length,
    }));
  return { nets: rows, count: rows.length, ids: rows.map((r) => r.id) };
}

export function layoutGraph(d = STARTER) {
  const devices = d.layout.devices;
  const nets = Object.keys(d.layout.nets).sort();
  const edges = [];
  for (const dev of devices) {
    for (const [pin, net] of Object.entries(dev.pins).sort()) {
      edges.push({ device: dev.id, pin, net, type: dev.type });
    }
  }
  return {
    devices: devices.map((x) => x.id),
    types: Object.fromEntries(devices.map((x) => [x.id, x.type])),
    nets,
    edges,
    deviceCount: devices.length,
    netCount: nets.length,
    edgeCount: edges.length,
  };
}

export function pinBinding(d = STARTER) {
  const bind = d.binding;
  return {
    devices: { ...bind.devices },
    nets: { ...bind.nets },
    devicePairs: Object.entries(bind.devices).sort(),
    netPairs: Object.entries(bind.nets).sort(),
    deviceCount: Object.keys(bind.devices).length,
    netCount: Object.keys(bind.nets).length,
  };
}

export function matchDevices(d = STARTER) {
  const bind = d.binding.devices;
  const sch = Object.fromEntries(d.schematic.devices.map((x) => [x.id, x]));
  const lay = Object.fromEntries(d.layout.devices.map((x) => [x.id, x]));
  const matched = [];
  const mismatches = [];
  for (const [lid, sid] of Object.entries(bind).sort()) {
    const L = lay[lid];
    const S = sch[sid];
    const ok = L.type === S.type;
    const entry = { layout: lid, schematic: sid, type: L.type, ok };
    if (ok) matched.push(entry);
    else mismatches.push(entry);
  }
  return { matched, mismatches, count: matched.length, mismatchCount: mismatches.length };
}

export function lvsCompare(d = STARTER) {
  const bindDev = d.binding.devices;
  const bindNet = d.binding.nets;
  const sch = Object.fromEntries(d.schematic.devices.map((x) => [x.id, x]));
  const lay = Object.fromEntries(d.layout.devices.map((x) => [x.id, x]));
  const mismatches = [];
  const matchedNets = new Set();
  for (const [lid, sid] of Object.entries(bindDev).sort()) {
    const L = lay[lid];
    const S = sch[sid];
    if (L.type !== S.type) {
      mismatches.push({ kind: "device_type", layout: lid, schematic: sid });
      continue;
    }
    for (const pin of [...new Set([...Object.keys(L.pins), ...Object.keys(S.pins)])].sort()) {
      const ln = L.pins[pin];
      const sn = S.pins[pin];
      if (ln == null || sn == null) {
        mismatches.push({ kind: "pin_missing", device: lid, pin });
        continue;
      }
      const mapped = bindNet[ln];
      if (mapped !== sn) {
        mismatches.push({ kind: "net_mismatch", device: lid, pin, layout_net: ln, expected: sn, mapped });
      } else matchedNets.add(ln);
    }
  }
  for (const [ln, sn] of Object.entries(bindNet)) {
    if (d.layout.nets[ln] && schNets(d).includes(sn)) matchedNets.add(ln);
  }
  return {
    mismatches,
    mismatchCount: mismatches.length,
    matchedNets: [...matchedNets].sort(),
    matchedNetCount: matchedNets.size,
    matchedDevices: matchDevices(d).count,
    ok: mismatches.length === 0,
  };
}

export function lvsEngine(d = STARTER) {
  const schematic = schematicGraph(d);
  const recognize = recognizeDevices(d);
  const extract = extractNets(d);
  const layout = layoutGraph(d);
  const binding = pinBinding(d);
  const match = matchDevices(d);
  const compare = lvsCompare(d);
  const ok =
    schematic.deviceCount === GOLDENS.schDeviceCount &&
    schematic.netCount === GOLDENS.schNetCount &&
    recognize.count === GOLDENS.layDeviceCount &&
    recognize.nmos === GOLDENS.recogNmos &&
    recognize.pmos === GOLDENS.recogPmos &&
    extract.count === GOLDENS.layNetCount &&
    match.count === GOLDENS.matchedDevices &&
    compare.matchedNetCount === GOLDENS.matchedNets &&
    compare.mismatchCount === GOLDENS.mismatchCount &&
    compare.ok;
  return { schematic, recognize, extract, layout, binding, match, compare, ok };
}

export function drawLvs(canvas, opts = {}) {
  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || "LVS", 16, 28);
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

export function hitTestLvs(canvas, highlight, clientX, clientY) {
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
