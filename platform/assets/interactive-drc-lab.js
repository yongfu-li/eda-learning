/**
 * Interactive DRC lab — select shapes/rules, run deck-driven checkers, Check challenges.
 */
import {
  STARTER,
  GOLDENS,
  CHIP,
  cloneDesign,
  loadDeck,
  checkWidth,
  checkSpacing,
  checkEnclosure,
  checkBoolean,
  collectViolations,
  multiLayerRules,
  drcEngine,
  drawDrc,
  hitShape,
} from "./drc-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveDrcLab(root, opts = {}) {
  let design = cloneDesign(opts.initialDesign || STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
  let selectedShapes = new Set();
  let selectedRules = new Set();
  let markers = [];

  const api = {
    getDesign: () => design,
    getDeck: () => loadDeck(design),
    getLast: () => last,
    getMode: () => mode,
    getSelectedShapes: () => [...selectedShapes],
    getSelectedRules: () => [...selectedRules],
    getSelected: () => [...selectedShapes, ...selectedRules],
    getMarkers: () => markers,
    getGoldens: () => GOLDENS,
    reset: () => {
      design = cloneDesign(STARTER);
      mode = null;
      last = null;
      highlight = [];
      selectedShapes = new Set();
      selectedRules = new Set();
      markers = [];
    },
    selectShape: (id) => {
      if (!id) return;
      if (selectedShapes.has(id)) selectedShapes.delete(id);
      else selectedShapes.add(id);
    },
    selectRule: (id) => {
      if (!id) return;
      if (selectedRules.has(id)) selectedRules.delete(id);
      else selectedRules.add(id);
    },
    showDeck: () => {
      last = loadDeck(design);
      mode = "deck";
      highlight = design.deck.map((r) => r.id);
      markers = [];
      return last;
    },
    runWidth: () => {
      last = checkWidth(design);
      mode = "width";
      markers = last.violations;
      highlight = last.violations.flatMap((v) => v.shapes);
      return last;
    },
    runSpace: () => {
      last = checkSpacing(design);
      mode = "space";
      markers = last.violations;
      highlight = last.violations.flatMap((v) => v.shapes);
      return last;
    },
    runEnclosure: () => {
      last = checkEnclosure(design);
      mode = "enclosure";
      markers = last.violations;
      highlight = last.violations.flatMap((v) => v.shapes);
      return last;
    },
    runBoolean: () => {
      last = checkBoolean(design);
      mode = "boolean";
      markers = last.hits;
      highlight = last.hits.flatMap((h) => h.shapes);
      return last;
    },
    collect: () => {
      last = collectViolations(design);
      mode = "markers";
      markers = last.violations;
      highlight = last.violations.flatMap((v) => v.shapes);
      return last;
    },
    multiLayer: () => {
      last = multiLayerRules(design);
      mode = "multilayer";
      markers = last.fires.violations;
      highlight = last.enclosureRules;
      return last;
    },
    engine: () => {
      last = drcEngine(design);
      mode = "engine";
      markers = last.violations.violations;
      highlight = ["D", "A", "B", "V"];
      return last;
    },
  };

  if (opts.defaultMode === "deck") api.showDeck();
  else if (opts.defaultMode === "width") api.runWidth();
  else if (opts.defaultMode === "space") api.runSpace();
  else if (opts.defaultMode === "enclosure") api.runEnclosure();
  else if (opts.defaultMode === "boolean") api.runBoolean();
  else if (opts.defaultMode === "markers") api.collect();
  else if (opts.defaultMode === "multilayer") api.multiLayer();
  else if (opts.defaultMode === "engine") api.engine();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Select shapes (or rules on deck view), run checkers, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_drc — GOLDEN violations=${GOLDENS.violationCount} (D width, A–B space, V enclosure).</p>`,
    loadStarter() {
      api.reset();
      if (opts.defaultMode) {
        const m = opts.defaultMode;
        if (m === "deck") api.showDeck();
        else if (m === "width") api.runWidth();
        else if (m === "space") api.runSpace();
        else if (m === "enclosure") api.runEnclosure();
        else if (m === "boolean") api.runBoolean();
        else if (m === "markers") api.collect();
        else if (m === "multilayer") api.multiLayer();
        else if (m === "engine") api.engine();
      }
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        api.reset();
        if (opts.defaultMode === "deck") api.showDeck();
        if (typeof ch.setup === "function") ch.setup(ctx, api);
      },
      check: (ctx) => (typeof ch.check === "function" ? !!ch.check(ctx, api) : false),
    })),
    extraActions(ctx) {
      const mk = (label, fn) =>
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: label,
          onClick: () => {
            fn();
            ctx.rerender();
          },
        });
      return [
        mk("Deck", () => api.showDeck()),
        mk("Width", () => api.runWidth()),
        mk("Space", () => api.runSpace()),
        mk("Enclosure", () => api.runEnclosure()),
        mk("Boolean", () => api.runBoolean()),
        mk("Markers", () => api.collect()),
        mk("Multi-layer", () => api.multiLayer()),
        mk("Engine", () => api.engine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      const deckMode = mode === "deck" || mode === "multilayer";
      const metricText = last
        ? last.count != null
          ? `count=${last.count}`
          : last.ok != null
            ? `ok=${last.ok}`
            : last.ruleCount != null
              ? `rules=${last.ruleCount}`
              : `mode=${mode}`
        : `mode=${mode || "—"}`;
      drawDrc(ctx.canvas, {
        design,
        mode: deckMode ? "deck" : "layout",
        selectedShape: [...selectedShapes][0] || null,
        selected: [...selectedRules],
        highlight,
        markers,
        metricText,
        stageLabel: mode || "DRC",
      });
      ctx.canvas.onclick = (ev) => {
        if (deckMode) {
          // approximate rule hit by index grid
          const rect = ctx.canvas.getBoundingClientRect();
          const mx = ev.clientX - rect.left;
          const my = ev.clientY - rect.top;
          design.deck.forEach((r, i) => {
            const x = 40 + (i % 4) * 150;
            const y = 90 + Math.floor(i / 4) * 70;
            if (Math.abs(mx - x) <= 60 && Math.abs(my - y) <= 20) api.selectRule(r.id);
          });
        } else {
          const id = hitShape(design.shapes, ctx.canvas, ev.clientX, ev.clientY, design.chip || CHIP);
          if (id) api.selectShape(id);
        }
        ctx.rerender();
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `shapes: ${[...selectedShapes].join(",") || "—"}`,
        `rules: ${[...selectedRules].join(",") || "—"}`,
        `GOLDENS: rules=${GOLDENS.ruleCount} viol=${GOLDENS.violationCount}`,
      ];
      if (last?.violations) lines.push(`violations: ${last.count ?? last.violations.length}`);
      if (last?.ok != null) lines.push(`ok=${last.ok}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
