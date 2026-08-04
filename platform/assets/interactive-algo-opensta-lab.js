/**
 * Interactive Part C OpenSTA algorithm lab.
 */
import {
  ALGO_GOLDENS,
  PARTC_REAL,
  algoGraphBuild,
  algoLevelize,
  algoPropagate,
  algoSlack,
  drawAlgoOpensta,
  hitTestAlgoOpensta,
  openstaAlgoEngine,
  partcBind,
} from "./algo-opensta-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveAlgoOpenstaLab(root, opts = {}) {
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = new Set();
  let stageLabel = null;
  let metricText = "";

  const api = {
    getMode: () => mode,
    getLast: () => last,
    getSelected: () => [...selected],
    getHighlight: () => highlight,
    getGoldens: () => ALGO_GOLDENS,
    reset: () => {
      mode = null;
      last = null;
      highlight = [];
      selected = new Set();
      stageLabel = null;
      metricText = "";
    },
    select: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showGraph: () => apply(algoGraphBuild(), "graph"),
    showLevelize: () => apply(algoLevelize(), "levelize"),
    showPropagate: () => apply(algoPropagate(), "propagate"),
    showSlack: () => apply(algoSlack(), "slack"),
    showEngine: () => apply(openstaAlgoEngine(), "engine"),
    showBind: (stage = "slack") => {
      last = partcBind(stage);
      mode = "bind";
      highlight = last.teach?.path || ["y"];
      stageLabel = `bind:${stage}`;
      metricText = `ok=${last.ok}`;
      return last;
    },
  };

  function apply(result, m) {
    last = result;
    mode = m;
    highlight = result.highlight || [];
    stageLabel = result.pass || m;
    metricText = result.note || `ok=${result.ok}`;
    return result;
  }

  const defaults = {
    graph: () => api.showGraph(),
    levelize: () => api.showLevelize(),
    propagate: () => api.showPropagate(),
    slack: () => api.showSlack(),
    engine: () => api.showEngine(),
  };
  if (opts.defaultMode) defaults[opts.defaultMode]?.();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml: "Pick a challenge and <strong>Start</strong>. Run algo stages / bind, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Part C:</strong> OpenSTA algorithms — A(y)=${ALGO_GOLDENS.arrivalY}, slack=${ALGO_GOLDENS.slackY}; bound to real report.</p>`,
    loadStarter() {
      api.reset();
      if (opts.defaultMode) defaults[opts.defaultMode]?.();
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
      return [
        mk("Graph", () => api.showGraph()),
        mk("Levelize", () => api.showLevelize()),
        mk("Propagate", () => api.showPropagate()),
        mk("Slack", () => api.showSlack()),
        mk("Engine", () => api.showEngine()),
        mk("Bind", () => api.showBind("slack")),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      drawAlgoOpensta(ctx.canvas, { highlight, selected: [...selected], stageLabel, metricText });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestAlgoOpensta(ctx.canvas, highlight, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(
        metricsBlock([
          `mode: ${mode || "—"}`,
          `selected: ${[...selected].join(",") || "—"}`,
          `ALGO: slack=${ALGO_GOLDENS.slackY} path=${ALGO_GOLDENS.criticalPath.join("→")}`,
          `REAL: slack=${PARTC_REAL.slack} cells=${PARTC_REAL.afterReadCells}`,
          last?.note || "",
        ])
      );
    },
  });

  return api;
}
