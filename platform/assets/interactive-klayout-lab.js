/**
 * Interactive KLayout Part A lab.
 */
import {
  STARTER,
  GOLDENS,
  cloneDesign,
  stageLayers,
  stageHierarchy,
  stageStream,
  stageDrc,
  stageMarkers,
  klayoutEngine,
  drawKlayout,
  hitTestKlayout,
} from "./klayout-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveKlayoutLab(root, opts = {}) {
  let design = cloneDesign(opts.initialDesign || STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
  let markers = [];
  let selected = new Set();

  const api = {
    getDesign: () => design,
    getLast: () => last,
    getMode: () => mode,
    getSelected: () => [...selected],
    getHighlight: () => highlight,
    getGoldens: () => GOLDENS,
    reset: () => {
      design = cloneDesign(STARTER);
      mode = null;
      last = null;
      highlight = [];
      markers = [];
      selected = new Set();
    },
    select: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showLayers: () => {
      last = stageLayers(design);
      mode = "layers";
      highlight = last.highlight;
      markers = [];
      return last;
    },
    showHierarchy: () => {
      last = stageHierarchy(design);
      mode = "hierarchy";
      highlight = last.highlight;
      markers = [];
      return last;
    },
    showStream: () => {
      last = stageStream(design);
      mode = "stream";
      highlight = last.highlight;
      markers = [];
      return last;
    },
    showDrc: () => {
      last = stageDrc(design);
      mode = "drc";
      highlight = last.highlight;
      markers = last.violations || [];
      return last;
    },
    showMarkers: () => {
      last = stageMarkers(design);
      mode = "markers";
      highlight = last.highlight;
      markers = last.markers || [];
      return last;
    },
    engine: () => {
      last = klayoutEngine(design);
      mode = "engine";
      const drc = stageDrc(design);
      highlight = drc.highlight;
      markers = drc.violations || [];
      return last;
    },
  };

  const applyDefault = () => {
    const m = opts.defaultMode;
    if (m === "layers") api.showLayers();
    else if (m === "hierarchy") api.showHierarchy();
    else if (m === "stream") api.showStream();
    else if (m === "drc") api.showDrc();
    else if (m === "markers") api.showMarkers();
    else if (m === "engine") api.engine();
  };
  applyDefault();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Run KLayout map stages on tiny_rect, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_rect — GOLDEN layers=${GOLDENS.layerCount}, width_violations=${GOLDENS.widthViolations}, markers=${GOLDENS.markerCount}.</p>`,
    loadStarter() {
      api.reset();
      applyDefault();
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        api.reset();
        applyDefault();
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
        mk("Layers", () => api.showLayers()),
        mk("Hierarchy", () => api.showHierarchy()),
        mk("Stream", () => api.showStream()),
        mk("DRC", () => api.showDrc()),
        mk("Markers", () => api.showMarkers()),
        mk("Engine", () => api.engine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      const metricText = last
        ? last.ok != null
          ? `ok=${last.ok}`
          : last.widthViolations != null
            ? `violations=${last.widthViolations}`
            : `mode=${mode}`
        : `mode=${mode || "—"}`;
      drawKlayout(ctx.canvas, {
        design,
        highlight,
        selected: [...selected],
        markers,
        stageLabel: mode || "KLayout",
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestKlayout(ctx.canvas, design, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: layers=${GOLDENS.layerCount} viol=${GOLDENS.widthViolations} markers=${GOLDENS.markerCount}`,
      ];
      if (last?.note) lines.push(last.note);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
