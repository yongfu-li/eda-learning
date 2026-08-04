/**
 * Interactive Part A OpenSTA map lab.
 */
import {
  GOLDENS,
  STARTER,
  cloneDesign,
  drawOpensta,
  hitTestOpensta,
  openstaEngine,
  stageArrival,
  stageReportChecks,
  stageRequired,
  stageSdcClocks,
  stageSlack,
  stageTimingGraph,
} from "./opensta-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveOpenstaLab(root, opts = {}) {
  let design = cloneDesign(STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = new Set();
  let stageLabel = null;
  let metricText = "";

  const api = {
    getDesign: () => design,
    getMode: () => mode,
    getLast: () => last,
    getSelected: () => [...selected],
    getHighlight: () => highlight,
    getGoldens: () => GOLDENS,
    reset: () => {
      design = cloneDesign(STARTER);
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
    showGraph: () => apply(stageTimingGraph(), "timing_graph"),
    showClocks: () => apply(stageSdcClocks(), "sdc_clocks"),
    showArrival: () => apply(stageArrival(), "arrival"),
    showRequired: () => apply(stageRequired(), "required"),
    showSlack: () => apply(stageSlack(), "slack"),
    showReport: () => apply(stageReportChecks(), "report_checks"),
    showEngine: () => apply(openstaEngine(), "engine"),
  };

  function apply(result, m) {
    last = result;
    mode = m;
    design = result.design || design;
    highlight = result.highlight || [];
    stageLabel = result.stageLabel || m;
    metricText = result.metricText || "";
    return result;
  }

  if (opts.defaultMode === "timing_graph") api.showGraph();
  else if (opts.defaultMode === "sdc_clocks") api.showClocks();
  else if (opts.defaultMode === "arrival") api.showArrival();
  else if (opts.defaultMode === "required") api.showRequired();
  else if (opts.defaultMode === "slack") api.showSlack();
  else if (opts.defaultMode === "report_checks") api.showReport();
  else if (opts.defaultMode === "engine") api.showEngine();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml: "Pick a challenge and <strong>Start</strong>. Run map stages, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Part A:</strong> OpenSTA map — cells=${GOLDENS.cellCount}, path=${GOLDENS.pathDelay}, slack=${GOLDENS.slackAtPeriod10}.</p>`,
    loadStarter() {
      api.reset();
      if (opts.defaultMode) {
        const map = {
          timing_graph: () => api.showGraph(),
          sdc_clocks: () => api.showClocks(),
          arrival: () => api.showArrival(),
          required: () => api.showRequired(),
          slack: () => api.showSlack(),
          report_checks: () => api.showReport(),
          engine: () => api.showEngine(),
        };
        map[opts.defaultMode]?.();
      }
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
        mk("Clocks", () => api.showClocks()),
        mk("Arrival", () => api.showArrival()),
        mk("Required", () => api.showRequired()),
        mk("Slack", () => api.showSlack()),
        mk("Report", () => api.showReport()),
        mk("Engine", () => api.showEngine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      drawOpensta(ctx.canvas, {
        design,
        highlight,
        selected: [...selected],
        stageLabel,
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestOpensta(ctx.canvas, design, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: cells=${GOLDENS.cellCount} delay=${GOLDENS.pathDelay} slack=${GOLDENS.slackAtPeriod10}`,
      ];
      if (last?.note) lines.push(last.note);
      if (last?.slack != null) lines.push(`slack=${last.slack}`);
      if (last?.arrivalY != null) lines.push(`A(y)=${last.arrivalY}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
