/**
 * Interactive real-OpenSTA evidence lab — build Tcl recipe, view stages.
 */
import {
  CMD_PALETTE,
  GOLDEN_RECIPE_IDS,
  REAL_GOLDENS,
  STAGES,
  drawRealOpensta,
  hitTestRealOpensta,
  realEngine,
  recipePrefixOk,
  stageForRecipe,
} from "./real-opensta-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveRealOpenstaLab(root, opts = {}) {
  let recipe = [];
  let stage = STAGES.empty;
  let selected = new Set();
  let mode = null;

  const api = {
    getRecipe: () => [...recipe],
    getStage: () => stage,
    getMode: () => mode,
    getSelected: () => [...selected],
    getGoldens: () => REAL_GOLDENS,
    reset: () => {
      recipe = [];
      stage = STAGES.empty;
      selected = new Set();
      mode = null;
    },
    pushCmd: (id) => {
      if (!id) return;
      recipe = [...recipe, id];
      stage = stageForRecipe(recipe);
      mode = "recipe";
    },
    popCmd: () => {
      recipe = recipe.slice(0, -1);
      stage = stageForRecipe(recipe);
      mode = "recipe";
    },
    setRecipe: (ids) => {
      recipe = [...(ids || [])];
      stage = stageForRecipe(recipe);
      mode = "recipe";
    },
    loadGoldenRecipe: () => {
      recipe = [...GOLDEN_RECIPE_IDS];
      stage = stageForRecipe(recipe);
      mode = "golden";
    },
    showStage: (name) => {
      stage = STAGES[name] || STAGES.empty;
      mode = name;
      return stage;
    },
    select: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    checkPrefix: (n) => recipePrefixOk(recipe, n),
    engine: () => {
      const r = realEngine(recipe.length ? recipe : GOLDEN_RECIPE_IDS);
      mode = "engine";
      stage = r.stage;
      return r;
    },
  };

  if (opts.defaultStage) api.showStage(opts.defaultStage);
  if (opts.defaultGoldenRecipe) api.loadGoldenRecipe();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml: "Pick a challenge and <strong>Start</strong>. Build the Tcl recipe or open a stage, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Part B:</strong> Real OpenSTA evidence — cells=${REAL_GOLDENS.afterReadCells}, delay=${REAL_GOLDENS.pathDelay}, slack=${REAL_GOLDENS.slack}.</p>`,
    loadStarter() {
      api.reset();
      if (opts.defaultStage) api.showStage(opts.defaultStage);
      if (opts.defaultGoldenRecipe) api.loadGoldenRecipe();
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        api.reset();
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
      const cmds = CMD_PALETTE.map((c) => mk(c.label.split(" ")[0], () => api.pushCmd(c.id)));
      return [
        ...cmds,
        mk("Undo", () => api.popCmd()),
        mk("Golden recipe", () => api.loadGoldenRecipe()),
        mk("Engine", () => api.engine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      drawRealOpensta(ctx.canvas, {
        stage,
        selected: [...selected],
        highlight: stage.cells || [],
        stageLabel: stage.title,
        metricText: `recipe=${recipe.length} cells=${stage.cellCount ?? "—"} slack=${stage.slack ?? "—"}`,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestRealOpensta(ctx.canvas, stage, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(
        metricsBlock([
          `mode: ${mode || "—"}`,
          `recipe: ${recipe.join(" → ") || "—"}`,
          `stage: ${stage.id}`,
          stage.note || "",
          `GOLDENS: cells=${REAL_GOLDENS.afterReadCells} delay=${REAL_GOLDENS.pathDelay} slack=${REAL_GOLDENS.slack}`,
        ])
      );
    },
  });

  return api;
}

export { el, metricsBlock, REAL_GOLDENS, STAGES };
