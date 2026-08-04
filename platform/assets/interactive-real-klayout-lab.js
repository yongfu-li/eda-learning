/**
 * Interactive real KLayout Part B lab.
 */
import {
  REAL_GOLDENS,
  GOLDEN_RECIPE_IDS,
  STAGES,
  realKlayoutEngine,
  recipePrefixOk,
  stageForRecipe,
  drawRealKlayout,
  CMD_PALETTE,
} from "./real-klayout-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveRealKlayoutLab(root, opts = {}) {
  let recipe = [];
  let stage = STAGES.empty;
  let selected = new Set();
  let last = null;

  const api = {
    getRecipe: () => [...recipe],
    getStage: () => stage,
    getMode: () => stage.id,
    getSelected: () => [...selected],
    getLast: () => last,
    select: (id) => {
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showStage: (id) => {
      stage = STAGES[id] || STAGES.empty;
      last = { ok: true, stage: stage.id };
      return last;
    },
    loadGoldenRecipe: () => {
      recipe = [...GOLDEN_RECIPE_IDS];
      stage = stageForRecipe(recipe);
      last = realKlayoutEngine(recipe);
      return last;
    },
    checkPrefix: (n) => recipePrefixOk(recipe, n),
    engine: () => {
      last = realKlayoutEngine(recipe.length ? recipe : GOLDEN_RECIPE_IDS);
      stage = last.stage;
      return last;
    },
  };

  if (opts.defaultStage && STAGES[opts.defaultStage]) {
    api.showStage(opts.defaultStage);
  }

  createChallengeLab(root, {
    starterButtonLabel: "Reset recipe",
    starterHtml: opts.starterHtml || `<p>Real KLayout evidence on tiny_rect.gds + tiny_rect.drc.</p>`,
    loadStarter() {
      recipe = [];
      stage = STAGES.empty;
      selected = new Set();
      last = null;
      if (opts.defaultStage) api.showStage(opts.defaultStage);
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        recipe = [];
        stage = STAGES.empty;
        selected = new Set();
        if (typeof ch.setup === "function") ch.setup(ctx, api);
      },
      check: (ctx) => (typeof ch.check === "function" ? !!ch.check(ctx, api) : false),
    })),
    extraActions(ctx) {
      const mk = (label, fn) =>
        el("button", { className: "btn btn-secondary", type: "button", text: label, onClick: () => { fn(); ctx.rerender(); } });
      return [
        ...CMD_PALETTE.slice(0, 3).map((c) => mk(c.label, () => { recipe.push(c.id); stage = stageForRecipe(recipe); })),
        mk("Golden recipe", () => api.loadGoldenRecipe()),
        mk("Engine", () => api.engine()),
      ];
    },
    renderWorkspace(ctx) {
      const drcStage = stage.widthViolations != null;
      drawRealKlayout(ctx.canvas, {
        stage,
        highlight: drcStage ? ["m0"] : ["p0", "m0"],
        selected: [...selected],
        stageLabel: stage.title,
        metricText: stage.markerCount != null ? `markers=${stage.markerCount}` : stage.shapeCount != null ? `shapes=${stage.shapeCount}` : "",
      });
      const lines = [
        `stage: ${stage.id}`,
        `recipe: ${recipe.join("→") || "—"}`,
        `GOLDENS: viol=${REAL_GOLDENS.widthViolations} markers=${REAL_GOLDENS.markerCount}`,
      ];
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
