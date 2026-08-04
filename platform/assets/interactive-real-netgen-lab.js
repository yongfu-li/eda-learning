/**
 * Interactive real-Netgen evidence lab — build Tcl recipe, view stages.
 */
import {
  CMD_PALETTE,
  GOLDEN_RECIPE_IDS,
  REAL_GOLDENS,
  STAGES,
  drawRealNetgen,
  hitTestRealNetgen,
  realNetgenEngine,
  recipePrefixOk,
  stageForRecipe,
} from "./real-netgen-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveRealNetgenLab(root, opts = {}) {
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
    checkPrefix: (n) => recipePrefixOk(recipe, n),
    select: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    engine: () => {
      const eng = realNetgenEngine(recipe.length ? recipe : GOLDEN_RECIPE_IDS);
      stage = eng.stage;
      mode = "engine";
      return eng;
    },
  };

  if (opts.defaultStage) api.showStage(opts.defaultStage);

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Build the Netgen recipe or open stages, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Real Netgen:</strong> matched=${REAL_GOLDENS.matchedDevices}/${REAL_GOLDENS.matchedNets} nets, mism=${REAL_GOLDENS.mismatchCount}.</p>`,
    loadStarter() {
      api.reset();
      if (opts.defaultStage) api.showStage(opts.defaultStage);
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        api.reset();
        if (opts.defaultStage) api.showStage(opts.defaultStage);
        if (typeof ch.setup === "function") ch.setup(ctx, api);
      },
      check: (ctx) => (typeof ch.check === "function" ? !!ch.check(ctx, api) : false),
    })),
    extraActions(ctx) {
      const mk = (label, fn) =>
        el("button", { className: "btn btn-secondary", type: "button", text: label, onClick: () => { fn(); ctx.rerender(); } });
      return [
        ...CMD_PALETTE.map((c) => mk(c.label, () => api.pushCmd(c.id))),
        mk("Undo", () => api.popCmd()),
        mk("Golden", () => api.loadGoldenRecipe()),
        mk("Engine", () => api.engine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      const highlight = stage.matchedDevices != null ? ["mn1", "mp1", "X0", "X1"] : ["read_sch", "read_lay"];
      drawRealNetgen(ctx.canvas, {
        stage,
        highlight,
        selected: [...selected],
        stageLabel: stage.title || mode,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestRealNetgen(ctx.canvas, highlight, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `recipe: ${recipe.join(" → ") || "—"}`,
        `GOLDEN: dev=${REAL_GOLDENS.matchedDevices} nets=${REAL_GOLDENS.matchedNets} mism=${REAL_GOLDENS.mismatchCount}`,
      ];
      if (stage.note) lines.push(stage.note);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
