/**
 * Interactive Part D OpenSTA internals lab.
 */
import {
  INTERNALS_GOLDENS,
  contributeOpensta,
  drawOpenstaInternals,
  hitTestOpenstaInternals,
  partDEngine,
  readFindPath,
  staCppModel,
} from "./opensta-internals-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveOpenstaInternalsLab(root, opts = {}) {
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
      if (m === "sta") {
        last = staCppModel();
        highlight = last.highlight;
        stageLabel = "STA C++ model";
      } else if (m === "find_path") {
        last = readFindPath();
        highlight = last.highlight;
        stageLabel = "Read find_path";
      } else if (m === "contribute") {
        last = contributeOpensta();
        highlight = last.highlight;
        stageLabel = "Contribute to OpenSTA";
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
      `<p><strong>Part D:</strong> OpenSTA internals — pillars=${INTERNALS_GOLDENS.pillars}, find_path=${INTERNALS_GOLDENS.findPathStages.length}.</p>`,
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
        mk("STA C++", () => api.showMode("sta")),
        mk("find_path", () => api.showMode("find_path")),
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
      drawOpenstaInternals(ctx.canvas, {
        highlight,
        selected: [...selected],
        stageLabel,
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestOpenstaInternals(ctx.canvas, highlight, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: pillars=${INTERNALS_GOLDENS.pillars} find=${INTERNALS_GOLDENS.findPathStages.length}`,
      ];
      if (last?.note) lines.push(last.note);
      if (last?.upstreamPath) lines.push(`upstream: ${last.upstreamPath}`);
      if (last?.smoke) lines.push(`smoke: ${last.smoke}`);
      if (last?.slack != null) lines.push(`slack=${last.slack} delay=${last.pathDelay}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
