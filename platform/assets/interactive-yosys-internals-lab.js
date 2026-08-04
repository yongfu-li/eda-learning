/**
 * Interactive Part D Yosys internals lab.
 */
import {
  INTERNALS_GOLDENS,
  contributePass,
  drawInternals,
  hitTestInternals,
  partDEngine,
  passRegistration,
  readOptClean,
  rtlilCppModel,
} from "./yosys-internals-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveYosysInternalsLab(root, opts = {}) {
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = new Set();
  let stageLabel = null;

  const api = {
    getMode: () => mode,
    getLast: () => last,
    getSelected: () => [...selected],
    getHighlight: () => highlight,
    getGoldens: () => INTERNALS_GOLDENS,
    reset: () => {
      mode = null;
      last = null;
      highlight = [];
      selected = new Set();
      stageLabel = null;
    },
    select: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showMode: (m) => {
      if (m === "rtlil") {
        last = rtlilCppModel();
        highlight = last.highlight;
        stageLabel = "RTLIL C++ model";
      } else if (m === "pass") {
        last = passRegistration();
        highlight = last.highlight;
        stageLabel = "Pass registration";
      } else if (m === "opt_clean") {
        last = readOptClean();
        highlight = last.highlight;
        stageLabel = "Read opt_clean";
      } else if (m === "contribute") {
        last = contributePass();
        highlight = last.highlight;
        stageLabel = "Contribute a pass";
      }
      mode = m;
      return last;
    },
    runEngine: () => {
      last = partDEngine();
      mode = "engine";
      highlight = ["ok"];
      stageLabel = "Part D engine";
      return last;
    },
  };

  if (opts.defaultMode) api.showMode(opts.defaultMode);

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml: "Pick a challenge and <strong>Start</strong>. Explore internals stages, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Part D:</strong> Yosys internals — pillars=${INTERNALS_GOLDENS.pillars}, pass steps=${INTERNALS_GOLDENS.passRecipe.length}.</p>`,
    loadStarter() {
      api.reset();
      if (opts.defaultMode) api.showMode(opts.defaultMode);
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        api.reset();
        if (opts.defaultMode) api.showMode(opts.defaultMode);
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
        mk("RTLIL", () => api.showMode("rtlil")),
        mk("Pass", () => api.showMode("pass")),
        mk("opt_clean", () => api.showMode("opt_clean")),
        mk("Contribute", () => api.showMode("contribute")),
        mk("Engine", () => api.runEngine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      const metricText = last
        ? last.ok != null
          ? `ok=${last.ok}`
          : `items=${(highlight || []).length}`
        : `mode=${mode || "—"}`;
      drawInternals(ctx.canvas, {
        highlight,
        selected: [...selected],
        stageLabel,
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestInternals(ctx.canvas, highlight, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: pillars=${INTERNALS_GOLDENS.pillars} pass=${INTERNALS_GOLDENS.passRecipe.length}`,
      ];
      if (last?.note) lines.push(last.note);
      if (last?.upstreamPath) lines.push(`upstream: ${last.upstreamPath}`);
      if (last?.smoke) lines.push(`smoke: ${last.smoke}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
