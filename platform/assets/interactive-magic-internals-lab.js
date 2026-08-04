/**
 * Interactive Part D Magic internals lab.
 */
import {
  INTERNALS_GOLDENS,
  contributeMagic,
  drawMagicInternals,
  hitTestMagicInternals,
  partDEngine,
  readDrcCifwrite,
  tilePlaneModel,
} from "./magic-internals-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveMagicInternalsLab(root, opts = {}) {
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
      if (m === "tile") {
        last = tilePlaneModel();
        highlight = last.highlight;
        stageLabel = "Tile / Plane model";
      } else if (m === "drc_cif") {
        last = readDrcCifwrite();
        highlight = last.highlight;
        stageLabel = "Read DRC / cifwrite";
      } else if (m === "contribute") {
        last = contributeMagic();
        highlight = last.highlight;
        stageLabel = "Contribute to Magic";
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
      `<p><strong>Part D:</strong> Magic internals — pillars=${INTERNALS_GOLDENS.pillars}, DRC stages=${INTERNALS_GOLDENS.drcStages.length}.</p>`,
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
        mk("Tile/Plane", () => api.showMode("tile")),
        mk("DRC/cifwrite", () => api.showMode("drc_cif")),
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
      drawMagicInternals(ctx.canvas, {
        highlight,
        selected: [...selected],
        stageLabel,
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestMagicInternals(ctx.canvas, highlight, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: pillars=${INTERNALS_GOLDENS.pillars} drc=${INTERNALS_GOLDENS.drcErrorCount}`,
      ];
      if (last?.note) lines.push(last.note);
      if (last?.upstreamPath) lines.push(`upstream: ${last.upstreamPath}`);
      if (last?.smoke) lines.push(`smoke: ${last.smoke}`);
      if (last?.drcErrors != null) lines.push(`drc=${last.drcErrors} gds=${last.gdsLayers}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
