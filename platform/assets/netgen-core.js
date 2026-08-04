/**
 * Part A — Netgen LVS compare map (mirrors courses/learn_netgen/common/solvers.py)
 */
import { fitHiDpiCanvas, fitGraphLayout, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  schDevices: 2,
  layDevices: 2,
  schNets: 4,
  layNets: 4,
  classCount: 2,
  matchedDevices: 2,
  matchedNets: 4,
  mismatchCount: 0,
  permuteOk: true,
  engineOk: true,
};

export const STARTER = {
  cell: "tiny_inv",
  schematic: {
    ports: { A: "input", Y: "output", VDD: "power", VSS: "ground" },
    devices: [
      { id: "mn1", type: "nmos", pins: { G: "A", D: "Y", S: "VSS" } },
      { id: "mp1", type: "pmos", pins: { G: "A", D: "Y", S: "VDD" } },
    ],
  },
  layout: {
    ports: { A: "input", Y: "output", VDD: "power", VSS: "ground" },
    devices: [
      { id: "X0", type: "nmos", pins: { G: "A", D: "Y", S: "VSS" } },
      { id: "X1", type: "pmos", pins: { G: "A", D: "Y", S: "VDD" } },
    ],
  },
  classes: { nmos: "nmos", pmos: "pmos" },
  permute: { nmos: ["D", "S"], pmos: ["D", "S"] },
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

function nets(side) {
  const s = new Set(Object.keys(side.ports));
  for (const d of side.devices) Object.values(d.pins).forEach((n) => s.add(n));
  return [...s].sort();
}

export function stageRead(d = STARTER) {
  const ok = d.schematic.devices.length === GOLDENS.schDevices && d.layout.devices.length === GOLDENS.layDevices;
  return {
    ok,
    schDevices: d.schematic.devices.length,
    layDevices: d.layout.devices.length,
    highlight: ["mn1", "mp1", "X0", "X1"],
    note: "Read schematic and layout netlists.",
    pass: "read",
  };
}

export function stageClasses(d = STARTER) {
  const ok = Object.keys(d.classes).length === GOLDENS.classCount;
  return {
    ok,
    classCount: Object.keys(d.classes).length,
    classes: d.classes,
    highlight: Object.keys(d.classes),
    note: "nmos/pmos device classes.",
    pass: "classes",
  };
}

export function stagePermute(d = STARTER) {
  const p = d.permute.nmos || [];
  const ok = GOLDENS.permuteOk && p.includes("D") && p.includes("S");
  return {
    ok,
    permute: d.permute,
    highlight: ["D", "S", "nmos", "pmos"],
    note: "Source/drain may permute.",
    pass: "permute",
  };
}

export function stageCompareNets(d = STARTER) {
  const sch = nets(d.schematic);
  const lay = nets(d.layout);
  const matched = sch.filter((n) => lay.includes(n));
  const ok = matched.length === GOLDENS.matchedNets;
  return {
    ok,
    matchedNets: matched.length,
    nets: matched,
    highlight: matched,
    note: "Four nets match on tiny_inv.",
    pass: "compare_nets",
  };
}

export function stageReport(d = STARTER) {
  const schTypes = d.schematic.devices.map((x) => x.type).sort();
  const layTypes = d.layout.devices.map((x) => x.type).sort();
  const matchedDevices = schTypes.filter((t, i) => t === layTypes[i]).length;
  const mismatchCount = schTypes.join() === layTypes.join() ? 0 : 1;
  const ok = matchedDevices === GOLDENS.matchedDevices && mismatchCount === GOLDENS.mismatchCount;
  return {
    ok,
    matchedDevices,
    mismatchCount,
    highlight: ["mn1", "mp1", "X0", "X1"],
    note: "LVS report: 2 matched, 0 mismatches.",
    pass: "report",
  };
}

export function netgenEngine(d = STARTER) {
  const stages = [stageRead(d), stageClasses(d), stagePermute(d), stageCompareNets(d), stageReport(d)];
  const ok = stages.every((s) => s.ok) && GOLDENS.engineOk;
  return {
    ok,
    matchedDevices: GOLDENS.matchedDevices,
    matchedNets: GOLDENS.matchedNets,
    mismatchCount: GOLDENS.mismatchCount,
    pass: "engine",
  };
}

export function drawNetgen(canvas, opts = {}) {
  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || "Netgen LVS", 16, 28);
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
    ctx.fillText(id, pos.x, pos.y);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

export function hitTestNetgen(canvas, highlight, clientX, clientY) {
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
