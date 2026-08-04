/**
 * Interactive Part C Magic algorithm lab.
 */
import {
  ALGO_GOLDENS,
  PARTC_REAL,
  algoDrcRegion,
  algoExtract,
  algoPaintConnectivity,
  drawAlgoMagic,
  hitTestAlgoMagic,
  magicAlgoEngine,
  partcBind,
} from "./algo-magic-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveAlgoMagicLab(root, opts = {}) {
  let mode = null;
  let last = null;
  let highlight = [];
  let markers = [];
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
      markers = [];
      selected = new Set();
      stageLabel = null;
      metricText = "";
    },
    select: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showConnectivity: () => apply(algoPaintConnectivity(), "connectivity"),
    showDrcRegion: () => apply(algoDrcRegion(), "drc_region"),
    showExtract: () => apply(algoExtract(), "extract"),
    showEngine: () => apply(magicAlgoEngine(), "engine"),
    showBind: (stage = "drc") => {
      last = partcBind(stage);
      mode = "bind";
      highlight = last.teach?.highlight || ["thin"];
      stageLabel = `bind:${stage}`;
      metricText = `ok=${last.ok}`;
      return last;
    },
  };

  function apply(result, m) {
    last = result;
    mode = m;
    highlight = result.highlight || [];
    markers = result.markers || [];
    stageLabel = result.pass || m;
    metricText = result.note || `ok=${result.ok}`;
    return result;
  }

  const defaults = {
    connectivity: () => api.showConnectivity(),
    drc_region: () => api.showDrcRegion(),
    extract: () => api.showExtract(),
    engine: () => api.showEngine(),
  };
  if (opts.defaultMode) defaults[opts.defaultMode]?.();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml: "Pick a challenge and <strong>Start</strong>. Run algo stages / bind, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Part C:</strong> Magic algorithms — contact=${ALGO_GOLDENS.contactCount}, DRC=${ALGO_GOLDENS.drcErrorCount}, GDS=${ALGO_GOLDENS.gdsLayerCount}; bound to real logs.</p>`,
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
        mk("Connectivity", () => api.showConnectivity()),
        mk("DRC region", () => api.showDrcRegion()),
        mk("Extract", () => api.showExtract()),
        mk("Engine", () => api.showEngine()),
        mk("Bind DRC", () => api.showBind("drc")),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      drawAlgoMagic(ctx.canvas, {
        highlight,
        selected: [...selected],
        markers,
        stageLabel,
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestAlgoMagic(ctx.canvas, highlight, ev.clientX, ev.clientY);
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
          `ALGO: contact=${ALGO_GOLDENS.contactCount} drc=${ALGO_GOLDENS.drcErrorCount} gds=${ALGO_GOLDENS.gdsLayerCount}`,
          `REAL: drc=${PARTC_REAL.drcErrorCount} contacts=${PARTC_REAL.contactCount}`,
          last?.note || "",
        ])
      );
    },
  });

  return api;
}
