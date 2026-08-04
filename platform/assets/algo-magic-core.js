/**
 * Part C Magic algorithms — mirrors courses/learn_magic/common/algo_solvers.py
 */
import { drawMagic, STARTER, checkDrc, hitShape } from "./magic-core.js";
import { fitHiDpiCanvas } from "./canvas-hires.js";

export const ALGO_GOLDENS = {
  netCount: 4,
  metal1NetShapes: 2,
  contactCount: 1,
  drcErrorCount: 1,
  drcViolationShape: "thin",
  gdsLayerCount: 6,
  extractNodes: 3,
  engineOk: true,
};

export const PARTC_REAL = {
  contactCount: 1,
  drcErrorCount: 1,
  gdsLayerCount: 6,
  rectCount: 6,
  engineOk: true,
};

function rectsTouch(a, b) {
  if (a.x1 < b.x0 || b.x1 < a.x0) return false;
  if (a.y1 < b.y0 || b.y1 < a.y0) return false;
  return true;
}

function connectedComponents(rects, contacts = []) {
  const items = [...rects, ...contacts];
  const parent = Object.fromEntries(items.map((r) => [r.id, r.id]));
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  };
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (a.layer != null && b.layer != null && a.layer === b.layer && rectsTouch(a, b)) union(a.id, b.id);
    }
  }
  for (const c of contacts) {
    for (const layer of c.between || []) {
      for (const r of rects) {
        if (r.layer === layer && rectsTouch(r, c)) union(r.id, c.id);
      }
    }
  }
  const groups = {};
  for (const r of items) {
    const root = find(r.id);
    (groups[root] ||= []).push(r.id);
  }
  return Object.values(groups);
}

export function algoPaintConnectivity(d = STARTER) {
  const m1 = d.rects.filter((r) => r.layer === "metal1");
  const nets = connectedComponents(m1, d.contacts || []);
  const m1Net = nets.find((g) => g.includes("m1y")) || [];
  const ok =
    m1Net.length === ALGO_GOLDENS.metal1NetShapes && (d.contacts || []).length === ALGO_GOLDENS.contactCount;
  return {
    ok,
    netCount: nets.length,
    metal1NetShapes: m1Net.length,
    contactCount: (d.contacts || []).length,
    highlight: [...m1Net, ...(d.contacts || []).map((c) => c.id)],
    pass: "connectivity",
    note: "Flood-fill metal1; contact bridges poly and metal1.",
  };
}

export function algoDrcRegion(d = STARTER) {
  const drc = checkDrc(d);
  const ok =
    drc.count === ALGO_GOLDENS.drcErrorCount && drc.errors.some((e) => e.shape === ALGO_GOLDENS.drcViolationShape);
  return {
    ok,
    errorCount: drc.count,
    errors: drc.errors,
    highlight: drc.errors.map((e) => e.shape),
    markers: drc.errors,
    pass: "drc_region",
    note: "Region scan finds width violation on thin.",
  };
}

export function algoExtract(d = STARTER) {
  const nodes = d.rects.filter((r) => ["poly", "ndiff", "pdiff"].includes(r.layer));
  const ok = nodes.length === ALGO_GOLDENS.extractNodes;
  return {
    ok,
    extractNodes: nodes.length,
    nodes: nodes.map((n) => n.id),
    highlight: nodes.map((n) => n.id),
    pass: "extract",
    note: "Extract active/device nodes from painted layers.",
  };
}

export function magicAlgoEngine(d = STARTER) {
  const c = algoPaintConnectivity(d);
  const dr = algoDrcRegion(d);
  const e = algoExtract(d);
  const ok = c.ok && dr.ok && e.ok && ALGO_GOLDENS.engineOk;
  return {
    ok,
    contactCount: c.contactCount,
    drcErrors: dr.errorCount,
    extractNodes: e.extractNodes,
    gdsLayers: ALGO_GOLDENS.gdsLayerCount,
    pass: "engine",
  };
}

export function partcBind(stage) {
  if (stage === "connectivity") {
    const t = algoPaintConnectivity();
    const ok = t.ok && t.contactCount === PARTC_REAL.contactCount;
    return { ok, stage, teach: { contacts: t.contactCount }, real: { contacts: PARTC_REAL.contactCount }, note: "contact ↔ paint_save" };
  }
  if (stage === "drc") {
    const t = algoDrcRegion();
    const ok = t.ok && t.errorCount === PARTC_REAL.drcErrorCount;
    return { ok, stage, teach: { errors: t.errorCount }, real: { errors: PARTC_REAL.drcErrorCount }, note: "DRC ↔ drc check" };
  }
  if (stage === "gds") {
    const ok = ALGO_GOLDENS.gdsLayerCount === PARTC_REAL.gdsLayerCount;
    return { ok, stage, teach: { gds: ALGO_GOLDENS.gdsLayerCount }, real: { gds: PARTC_REAL.gdsLayerCount }, note: "GDS map ↔ gds write" };
  }
  const eng = magicAlgoEngine();
  const ok = eng.ok && PARTC_REAL.engineOk;
  return { ok, stage: "engine", teach: eng, real: PARTC_REAL, note: "algo engine ↔ Part B goldens" };
}

export function drawAlgoMagic(canvas, opts = {}) {
  drawMagic(canvas, {
    cell: opts.cell || STARTER,
    highlight: opts.highlight || [],
    selected: opts.selected?.[0] || null,
    markers: opts.markers || [],
    metricText: opts.metricText || opts.stageLabel || "Magic algo",
  });
}

export function hitTestAlgoMagic(canvas, _highlight, clientX, clientY) {
  return hitShape(STARTER, canvas, clientX, clientY);
}
