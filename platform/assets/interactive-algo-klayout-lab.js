/**
 * Interactive KLayout Part C algo lab.
 */
import {
  ALGO_GOLDENS,
  PARTC_REAL,
  klayoutAlgoEngine,
  algoLayerQuery,
  algoWidthSpacing,
  algoMarkerEmit,
  partcBind,
  drawAlgoKlayout,
} from "./algo-klayout-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveAlgoKlayoutLab(root, opts = {}) {
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = new Set();

  const api = {
    getMode: () => mode,
    getLast: () => last,
    getSelected: () => [...selected],
    getHighlight: () => highlight,
    showLayerQuery: () => {
      last = algoLayerQuery();
      mode = "layer_query";
      highlight = last.highlight;
      return last;
    },
    showWidthSpacing: () => {
      last = algoWidthSpacing();
      mode = "width_spacing";
      highlight = last.highlight;
      return last;
    },
    showMarkerEmit: () => {
      last = algoMarkerEmit();
      mode = "marker_emit";
      highlight = last.highlight;
      return last;
    },
    showEngine: () => {
      last = klayoutAlgoEngine();
      mode = "engine";
      highlight = ["m0"];
      return last;
    },
    showBind: (field) => {
      last = partcBind(field);
      mode = `bind_${field}`;
      return last;
    },
  };

  const applyDefault = () => {
    const m = opts.defaultMode;
    if (m === "layer_query") api.showLayerQuery();
    else if (m === "width_spacing") api.showWidthSpacing();
    else if (m === "marker_emit") api.showMarkerEmit();
    else if (m === "engine") api.showEngine();
  };
  applyDefault();

  createChallengeLab(root, {
    starterHtml: opts.starterHtml || `<p>Part C algorithms bound to Part B goldens.</p>`,
    loadStarter() {
      mode = null;
      last = null;
      highlight = [];
      selected = new Set();
      applyDefault();
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        mode = null;
        last = null;
        applyDefault();
        if (typeof ch.setup === "function") ch.setup(ctx, api);
      },
      check: (ctx) => (typeof ch.check === "function" ? !!ch.check(ctx, api) : false),
    })),
    extraActions(ctx) {
      const mk = (label, fn) =>
        el("button", { className: "btn btn-secondary", type: "button", text: label, onClick: () => { fn(); ctx.rerender(); } });
      return [
        mk("Layer query", () => api.showLayerQuery()),
        mk("Width/spacing", () => api.showWidthSpacing()),
        mk("Marker emit", () => api.showMarkerEmit()),
        mk("Engine", () => api.showEngine()),
      ];
    },
    renderWorkspace(ctx) {
      drawAlgoKlayout(ctx.canvas, { highlight, selected: [...selected], stageLabel: mode || "algo" });
      const lines = [
        `mode: ${mode || "—"}`,
        `GOLDENS: viol=${ALGO_GOLDENS.widthViolations} markers=${ALGO_GOLDENS.markerCount}`,
        `PARTC_REAL: viol=${PARTC_REAL.widthViolations}`,
      ];
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
