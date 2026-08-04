/**
 * Interactive KLayout Part D internals lab.
 */
import {
  INTERNALS_GOLDENS,
  layoutCellModel,
  readDrcRunner,
  contributeKlayout,
  partDEngine,
  drawKlayoutInternals,
} from "./klayout-internals-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveKlayoutInternalsLab(root, opts = {}) {
  let mode = null;
  let last = null;

  const api = {
    getMode: () => mode,
    getLast: () => last,
    showMode: (m) => {
      mode = m;
      if (m === "layout_cell_model") last = layoutCellModel();
      else if (m === "read_drc_runner") last = readDrcRunner();
      else if (m === "contribute_klayout") last = contributeKlayout();
      else last = { ok: false };
      return last;
    },
    runEngine: () => {
      last = partDEngine();
      mode = "engine";
      return last;
    },
  };

  if (opts.defaultMode) api.showMode(opts.defaultMode);

  createChallengeLab(root, {
    starterHtml: opts.starterHtml || `<p>KLayout internals: Layout/Cell/Instance + DRC runner + contribute.</p>`,
    loadStarter() {
      mode = null;
      last = null;
      if (opts.defaultMode) api.showMode(opts.defaultMode);
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        mode = null;
        last = null;
        if (typeof ch.setup === "function") ch.setup(ctx, api);
        else if (opts.defaultMode) api.showMode(opts.defaultMode);
      },
      check: (ctx) => (typeof ch.check === "function" ? !!ch.check(ctx, api) : false),
    })),
    extraActions(ctx) {
      const mk = (label, fn) =>
        el("button", { className: "btn btn-secondary", type: "button", text: label, onClick: () => { fn(); ctx.rerender(); } });
      return [
        mk("Layout model", () => api.showMode("layout_cell_model")),
        mk("DRC runner", () => api.showMode("read_drc_runner")),
        mk("Contribute", () => api.showMode("contribute_klayout")),
        mk("Engine", () => api.runEngine()),
      ];
    },
    renderWorkspace(ctx) {
      const hl =
        mode === "layout_cell_model"
          ? INTERNALS_GOLDENS.pillarsNames
          : mode === "read_drc_runner"
            ? INTERNALS_GOLDENS.drcStages.slice(0, 3)
            : ["m0"];
      drawKlayoutInternals(ctx.canvas, { highlight: hl, stageLabel: mode || "internals" });
      const lines = [`mode: ${mode || "—"}`, `pillars: ${INTERNALS_GOLDENS.pillars}`, `viol: ${INTERNALS_GOLDENS.widthViolations}`];
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
