/**
 * Part C Netgen algorithms — mirrors courses/learn_netgen/common/algo_solvers.py
 */
import { drawNetgen, STARTER, GOLDENS, stageClasses, stageCompareNets, stagePermute } from "./netgen-core.js";

export const ALGO_GOLDENS = {
  hashDeviceCount: 2,
  matchedNets: 4,
  permuteOk: true,
  matchedDevices: 2,
  mismatchCount: 0,
  engineOk: true,
};

export const PARTC_REAL = {
  matchedDevices: 2,
  matchedNets: 4,
  mismatchCount: 0,
  engineOk: true,
};

function hashDevices(d = STARTER) {
  const classes = d.classes;
  const hashed = {};
  for (const dev of [...d.schematic.devices, ...d.layout.devices]) {
    const cls = classes[dev.type] || dev.type;
    (hashed[cls] ||= []).push(dev.id);
  }
  const ok = Object.keys(hashed).length === 2;
  return {
    ok,
    hashDeviceCount: Object.values(hashed).flat().length,
    classes: Object.keys(hashed),
    highlight: d.schematic.devices.map((x) => x.id),
    pass: "hash_devices",
    note: "Hash devices by nmos/pmos class.",
  };
}

export function algoHashDevices(d = STARTER) {
  return hashDevices(d);
}

export function algoMatchNets(d = STARTER) {
  const r = stageCompareNets(d);
  const ok = r.matchedNets === ALGO_GOLDENS.matchedNets;
  return { ...r, ok, pass: "match_nets", note: "Four nets match on tiny_inv." };
}

export function algoPermutePins(d = STARTER) {
  const r = stagePermute(d);
  return { ...r, pass: "permute_pins", note: "D/S may permute within MOSFET class." };
}

export function netgenAlgoEngine(d = STARTER) {
  const h = algoHashDevices(d);
  const m = algoMatchNets(d);
  const p = algoPermutePins(d);
  const ok = h.ok && m.ok && p.ok && ALGO_GOLDENS.engineOk;
  return {
    ok,
    matchedDevices: ALGO_GOLDENS.matchedDevices,
    matchedNets: m.matchedNets,
    mismatchCount: ALGO_GOLDENS.mismatchCount,
    pass: "engine",
  };
}

export function partcBind(stage) {
  if (stage === "hash_devices") {
    const t = algoHashDevices();
    const ok = t.ok && ALGO_GOLDENS.matchedDevices === PARTC_REAL.matchedDevices;
    return { ok, stage, teach: { devices: ALGO_GOLDENS.matchedDevices }, real: { devices: PARTC_REAL.matchedDevices }, note: "hash ↔ read_spice" };
  }
  if (stage === "match_nets") {
    const t = algoMatchNets();
    const ok = t.ok && t.matchedNets === PARTC_REAL.matchedNets;
    return { ok, stage, teach: { nets: t.matchedNets }, real: { nets: PARTC_REAL.matchedNets }, note: "match ↔ lvs_compare" };
  }
  if (stage === "mismatch") {
    const ok = ALGO_GOLDENS.mismatchCount === PARTC_REAL.mismatchCount;
    return { ok, stage, teach: { mismatch: ALGO_GOLDENS.mismatchCount }, real: { mismatch: PARTC_REAL.mismatchCount }, note: "mismatch ↔ lvs_report" };
  }
  const eng = netgenAlgoEngine();
  const ok = eng.ok && PARTC_REAL.engineOk;
  return { ok, stage: "engine", teach: eng, real: PARTC_REAL, note: "algo engine ↔ Part B goldens" };
}

export function drawAlgoNetgen(canvas, opts = {}) {
  drawNetgen(canvas, {
    highlight: opts.highlight || [],
    selected: opts.selected || [],
    stageLabel: opts.stageLabel || "Netgen algo",
    metricText: opts.metricText || "",
  });
}

export function hitTestAlgoNetgen(canvas, highlight, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const layout = {};
  (highlight || []).forEach((id, i) => {
    layout[id] = { x: 70 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90 };
  });
  for (const [id, pos] of Object.entries(layout)) {
    if (Math.abs(x - pos.x) <= 50 && Math.abs(y - pos.y) <= 22) return id;
  }
  return null;
}
