/**
 * Interactive real-Yosys lab — build a .ys-style recipe, inspect RTLIL stage evidence.
 */
import {
  CMD_PALETTE,
  GOLDEN_RECIPE_IDS,
  REAL_GOLDENS,
  STAGES,
  drawRealYosys,
  hitTestType,
  recipePrefixOk,
  realEngine,
  stageForRecipe,
} from "./real-yosys-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveRealYosysLab(root, opts = {}) {
  let recipe = [];
  let stage = STAGES.empty;
  let selectedTypes = new Set();
  let highlightTypes = [];
  let mode = null;
  let last = null;

  const api = {
    getRecipe: () => [...recipe],
    getStage: () => stage,
    getSelected: () => [...selectedTypes],
    getMode: () => mode,
    getLast: () => last,
    getGoldens: () => REAL_GOLDENS,
    reset: () => {
      recipe = [];
      stage = STAGES.empty;
      selectedTypes = new Set();
      highlightTypes = [];
      mode = null;
      last = null;
    },
    pushCmd: (id) => {
      if (!CMD_PALETTE.some((c) => c.id === id)) return;
      recipe.push(id);
      stage = stageForRecipe(recipe);
      mode = "edit";
    },
    popCmd: () => {
      recipe.pop();
      stage = stageForRecipe(recipe);
      mode = "edit";
    },
    setRecipe: (ids) => {
      recipe = [...ids];
      stage = stageForRecipe(recipe);
      mode = "edit";
    },
    loadGoldenRecipe: () => {
      recipe = [...GOLDEN_RECIPE_IDS];
      stage = STAGES.synth;
      mode = "golden_recipe";
      last = { recipeOk: true };
    },
    showStage: (name) => {
      const map = {
        read_hierarchy: ["read_verilog", "hierarchy"],
        proc: ["read_verilog", "hierarchy", "proc"],
        flatten: ["read_verilog", "hierarchy", "proc", "flatten"],
        opt: ["read_verilog", "hierarchy", "proc", "flatten", "opt"],
        aigmap: ["read_verilog", "hierarchy", "proc", "flatten", "opt", "aigmap"],
        synth: ["read_verilog", "hierarchy", "proc", "flatten", "opt", "synth", "stat", "write"],
      };
      recipe = [...(map[name] || [])];
      stage = STAGES[name] || stageForRecipe(recipe);
      mode = name;
      highlightTypes = stage.types || [];
      last = { stage: name, ...stage };
    },
    selectType: (t) => {
      if (!t) return;
      if (selectedTypes.has(t)) selectedTypes.delete(t);
      else selectedTypes.add(t);
    },
    checkPrefix: (n) => recipePrefixOk(recipe, n),
    engine: () => {
      last = realEngine(recipe);
      mode = "engine";
      stage = last.stage;
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Build a Yosys recipe from commands, click cell types, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> real Yosys evidence on <code>tiny_and_or.v</code> — GOLDEN synth cells=${REAL_GOLDENS.afterSynthCells} types=${REAL_GOLDENS.afterSynthTypes.join(",")}.</p>`,
    loadStarter() {
      api.reset();
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
      const btns = CMD_PALETTE.map((c) =>
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: c.id,
          title: c.hint,
          onClick: () => {
            api.pushCmd(c.id);
            ctx.rerender();
          },
        }),
      );
      btns.push(
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Undo",
          onClick: () => {
            api.popCmd();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Engine",
          onClick: () => {
            api.engine();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-ghost",
          type: "button",
          text: "Reveal golden recipe (study)",
          onClick: () => {
            api.loadGoldenRecipe();
            ctx.rerender();
          },
        }),
      );
      return btns;
    },
    renderWorkspace(ctx) {
      drawRealYosys(ctx.canvas, {
        stage,
        selected: [...selectedTypes],
        highlightTypes,
        metricText: mode ? `mode=${mode}` : null,
      });
      ctx.canvas.onclick = (ev) => {
        const t = hitTestType(ctx.canvas, stage, ev.clientX, ev.clientY);
        if (t) {
          api.selectType(t);
          ctx.rerender();
        }
      };
      const lines = [
        `recipe: ${recipe.length ? recipe.join(" → ") : "(empty)"}`,
        `stage: ${stage.id} · modules=${stage.moduleCount} processes=${stage.processes} cells=${stage.cellCount}`,
        `types: ${(stage.types || []).join(", ") || "—"}`,
        `selected: ${[...selectedTypes].join(",") || "—"}`,
        `GOLDENS: read_mods=${REAL_GOLDENS.afterReadModules} flat_cells=${REAL_GOLDENS.afterFlattenCells} synth=${REAL_GOLDENS.afterSynthCells}`,
      ];
      if (last && last.ok != null) lines.push(`engine ok: ${last.ok}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, REAL_GOLDENS, STAGES };
