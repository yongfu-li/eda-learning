/**
 * Interactive Part D Netgen internals lab.
 */
import {
  INTERNALS_GOLDENS,
  contributeNetgen,
  drawNetgenInternals,
  hitTestNetgenInternals,
  partDEngine,
  readCompareC,
  netcompModel,
} from "./netgen-internals-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveNetgenInternalsLab(root, opts = {}) {
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
      if (m === "netcomp") {
        last = netcompModel();
        highlight = last.highlight;
        stageLabel = "Obj / Netlist / Element";
      } else if (m === "read_compare_c") {
        last = readCompareC();
        highlight = last.highlight;
        stageLabel = "Read compare C";
      } else if (m === "contribute") {
        last = contributeNetgen();
        highlight = last.highlight;
        stageLabel = "Contribute to Netgen";
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
      `<p><strong>Part D:</strong> Netgen internals — pillars=${INTERNALS_GOLDENS.pillars}, compare stages=${INTERNALS_GOLDENS.compareStages.length}.</p>`,
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
        el("button", { className: "btn btn-secondary", type: "button", text: label, onClick: () => { fn(); ctx.rerender(); } });
      return [
        mk("Netcomp", () => api.showMode("netcomp")),
        mk("Compare C", () => api.showMode("read_compare_c")),
        mk("Contribute", () => api.showMode("contribute")),
        mk("Engine", () => api.runEngine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      drawNetgenInternals(ctx.canvas, {
        highlight,
        selected: [...selected],
        stageLabel: stageLabel || mode,
        metricText: last?.ok != null ? `ok=${last.ok}` : "",
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestNetgenInternals(ctx.canvas, highlight, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `pillars: ${INTERNALS_GOLDENS.pillars}`,
        `bind Part B: dev=${INTERNALS_GOLDENS.matchedDevices} nets=${INTERNALS_GOLDENS.matchedNets}`,
      ];
      if (last?.note) lines.push(last.note);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
