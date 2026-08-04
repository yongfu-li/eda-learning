/**
 * Tiny DRC — rule deck → width/space/enclosure/boolean → violations for learn_drc.
 * Same geometry as learn_pattern_matching; checkers are deck-driven with rule_id.
 */
import {
  CHIP,
  STARTER as SHAPE_STARTER,
  drawPatternMatching,
  hitShape,
  width,
  height,
  onLayer,
} from "./pattern-matching-core.js";
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export { CHIP, drawPatternMatching, hitShape };

export const GOLDENS = {
  shapeCount: 5,
  layerCount: 3,
  ruleCount: 8,
  widthRules: 3,
  spaceRules: 2,
  enclosureRules: 2,
  booleanRules: 1,
  widthViolations: 1,
  spaceViolations: 1,
  enclosureViolations: 1,
  booleanHits: 1,
  violationCount: 3,
};

export const DECK = [
  { id: "W.M1", type: "width", layer: "M1", limit: 3 },
  { id: "W.M2", type: "width", layer: "M2", limit: 3 },
  { id: "W.VIA", type: "width", layer: "VIA", limit: 2 },
  { id: "S.M1", type: "space", layer: "M1", limit: 2 },
  { id: "S.M2", type: "space", layer: "M2", limit: 2 },
  { id: "E.VIA_M1", type: "enclosure", inner: "VIA", outer: "M1", limit: 1 },
  { id: "E.VIA_M2", type: "enclosure", inner: "VIA", outer: "M2", limit: 1 },
  { id: "B.VIA_M1_not_M2", type: "boolean", mode: "and_not", inner: "VIA", must: "M1", must_not: "M2" },
];

export const STARTER = {
  chip: CHIP,
  layers: ["M1", "M2", "VIA"],
  shapes: SHAPE_STARTER.map((s) => ({ ...s })),
  deck: DECK.map((r) => ({ ...r })),
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

function projectsOverlapX(a, b) {
  return a.y0 < b.y1 && b.y0 < a.y1;
}

function horizGap(a, b) {
  if (!projectsOverlapX(a, b)) return null;
  if (a.x1 <= b.x0) return b.x0 - a.x1;
  if (b.x1 <= a.x0) return a.x0 - b.x1;
  return 0;
}

function contains(outer, inner) {
  return outer.x0 <= inner.x0 && outer.y0 <= inner.y0 && outer.x1 >= inner.x1 && outer.y1 >= inner.y1;
}

function enclosureMargin(outer, inner) {
  if (!contains(outer, inner)) return null;
  return {
    left: inner.x0 - outer.x0,
    right: outer.x1 - inner.x1,
    bottom: inner.y0 - outer.y0,
    top: outer.y1 - inner.y1,
  };
}

function rectsOverlap(a, b) {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

export function loadDeck(d = STARTER) {
  const byType = {};
  for (const r of d.deck) {
    (byType[r.type] ||= []).push(r.id);
  }
  return {
    ruleCount: d.deck.length,
    rules: d.deck,
    byType,
    layers: [...d.layers],
    shapeCount: d.shapes.length,
  };
}

export function checkWidth(d = STARTER) {
  const violations = [];
  for (const rule of d.deck.filter((r) => r.type === "width")) {
    for (const s of onLayer(d.shapes, rule.layer)) {
      const thin = Math.min(width(s), height(s));
      if (thin < rule.limit) {
        violations.push({
          rule_id: rule.id,
          type: "width",
          layer: rule.layer,
          shapes: [s.id],
          value: thin,
          limit: rule.limit,
        });
      }
    }
  }
  return { violations, count: violations.length };
}

export function checkSpacing(d = STARTER) {
  const violations = [];
  for (const rule of d.deck.filter((r) => r.type === "space")) {
    const shapes = onLayer(d.shapes, rule.layer);
    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const a = shapes[i];
        const b = shapes[j];
        const gap = horizGap(a, b);
        if (gap == null) continue;
        if (gap < rule.limit) {
          const left = a.x0 <= b.x0 ? a : b;
          const right = a.x0 <= b.x0 ? b : a;
          violations.push({
            rule_id: rule.id,
            type: "space",
            layer: rule.layer,
            shapes: [left.id, right.id],
            value: gap,
            limit: rule.limit,
          });
        }
      }
    }
  }
  return { violations, count: violations.length };
}

export function checkEnclosure(d = STARTER) {
  const violations = [];
  for (const rule of d.deck.filter((r) => r.type === "enclosure")) {
    for (const inn of onLayer(d.shapes, rule.inner)) {
      let bestOk = false;
      let best = null;
      for (const out of onLayer(d.shapes, rule.outer)) {
        const m = enclosureMargin(out, inn);
        if (!m) continue;
        if (Object.values(m).every((v) => v >= rule.limit)) {
          bestOk = true;
          break;
        }
        if (!best) best = { outer: out.id, margins: m };
      }
      if (!bestOk) {
        violations.push({
          rule_id: rule.id,
          type: "enclosure",
          shapes: [inn.id],
          inner: inn.id,
          outer_layer: rule.outer,
          inner_layer: rule.inner,
          limit: rule.limit,
          detail: best,
        });
      }
    }
  }
  return { violations, count: violations.length };
}

export function checkBoolean(d = STARTER) {
  const hits = [];
  for (const rule of d.deck.filter((r) => r.type === "boolean" && r.mode === "and_not")) {
    const must = onLayer(d.shapes, rule.must);
    const mustNot = onLayer(d.shapes, rule.must_not);
    for (const inn of onLayer(d.shapes, rule.inner)) {
      const inMust = must.some((o) => rectsOverlap(o, inn));
      const inNot = mustNot.some((o) => rectsOverlap(o, inn));
      if (inMust && !inNot) {
        hits.push({ rule_id: rule.id, type: "boolean", shapes: [inn.id], mode: "and_not" });
      }
    }
  }
  return { hits, count: hits.length };
}

export function collectViolations(d = STARTER) {
  const violations = [
    ...checkWidth(d).violations,
    ...checkSpacing(d).violations,
    ...checkEnclosure(d).violations,
  ];
  return { violations, count: violations.length };
}

export function multiLayerRules(d = STARTER) {
  const enc = d.deck.filter((r) => r.type === "enclosure");
  const boolean = d.deck.filter((r) => r.type === "boolean");
  return {
    enclosureRules: enc.map((r) => r.id),
    booleanRules: boolean.map((r) => r.id),
    enclosureCount: enc.length,
    fires: checkEnclosure(d),
  };
}

export function drcEngine(d = STARTER) {
  const deck = loadDeck(d);
  const widthR = checkWidth(d);
  const space = checkSpacing(d);
  const enc = checkEnclosure(d);
  const boolean = checkBoolean(d);
  const viols = collectViolations(d);
  const ok =
    deck.ruleCount === GOLDENS.ruleCount &&
    widthR.count === GOLDENS.widthViolations &&
    space.count === GOLDENS.spaceViolations &&
    enc.count === GOLDENS.enclosureViolations &&
    viols.count === GOLDENS.violationCount &&
    boolean.count === GOLDENS.booleanHits;
  return { deck, width: widthR, space, enclosure: enc, boolean, violations: viols, ok };
}

/** Draw deck as pill list (walkthrough / rule-deck lab). */
export function drawDrc(canvas, opts = {}) {
  const d = opts.design || STARTER;
  const mode = opts.mode || "layout";
  if (mode === "deck") {
    const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "600 15px ui-monospace, monospace";
    ctx.fillText(opts.stageLabel || "Rule deck", 16, 28);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui";
    ctx.fillText(opts.metricText || `rules=${d.deck.length}`, 16, 50);
    const highlight = new Set(opts.highlight || []);
    const selected = new Set(opts.selected || []);
    d.deck.forEach((r, i) => {
      const x = 40 + (i % 4) * 150;
      const y = 90 + Math.floor(i / 4) * 70;
      const hot = highlight.has(r.id) || selected.has(r.id);
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") ctx.roundRect(x - 60, y - 20, 120, 40, 8);
      else ctx.rect(x - 60, y - 20, 120, 40);
      ctx.fillStyle = hot ? "#0ea5e9" : "#1e293b";
      ctx.fill();
      ctx.strokeStyle = hot ? "#38bdf8" : "#475569";
      ctx.stroke();
      ctx.fillStyle = "#f8fafc";
      ctx.font = "11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(r.id, x, y);
      ctx.textAlign = "left";
    });
    return;
  }
  drawPatternMatching(canvas, {
    shapes: d.shapes,
    chip: d.chip || CHIP,
    selected: opts.selectedShape || null,
    highlight: opts.highlight || [],
    markers: opts.markers || [],
    metricText: opts.metricText || null,
  });
}
