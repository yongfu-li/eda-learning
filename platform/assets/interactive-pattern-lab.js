/**
 * Interactive pattern-matching lab — match width/space/via/boolean, Check challenges.
 */
import {
  STARTER,
  CHIP,
  GOLDENS,
  RULES,
  cloneShapes,
  geometryStats,
  matchWidth,
  matchSpace,
  matchEnclosure,
  scanlineEvents,
  emitMarkers,
  multiLayerViaCheck,
  multiLayerInteractions,
  layeredBoolean,
  matchEngine,
  drawPatternMatching,
  hitShape,
} from "./pattern-matching-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractivePatternLab(root, opts = {}) {
  let shapes = cloneShapes(opts.initialShapes || STARTER);
  let selected = "A";
  let mode = null;
  let markers = [];
  let last = null;

  const api = {
    getShapes: () => shapes,
    setShapes: (s) => {
      shapes = cloneShapes(s);
    },
    getSelected: () => selected,
    setSelected: (id) => {
      selected = id;
    },
    getMode: () => mode,
    getStats: () => geometryStats(shapes),
    getMarkers: () => markers,
    getLast: () => last,
    getGoldens: () => GOLDENS,
    getRules: () => RULES,
    reset: () => {
      shapes = cloneShapes(STARTER);
      mode = null;
      markers = [];
      last = null;
      selected = "A";
    },
    matchWidth: () => {
      markers = matchWidth(shapes);
      mode = "width";
      last = { markers };
      return markers;
    },
    matchSpace: () => {
      markers = matchSpace(shapes, "M1");
      mode = "space";
      last = { markers };
      return markers;
    },
    scanline: () => {
      last = { events: scanlineEvents(shapes, "M1") };
      mode = "scanline";
      markers = [];
      return last.events;
    },
    emitMarkers: () => {
      markers = emitMarkers(shapes);
      mode = "emit";
      last = { markers };
      return markers;
    },
    viaCheck: () => {
      last = multiLayerViaCheck(shapes);
      markers = last.markers;
      mode = "via";
      return last;
    },
    interactions: () => {
      last = { pairs: multiLayerInteractions(shapes) };
      markers = [];
      mode = "interactions";
      return last.pairs;
    },
    booleanAndNot: () => {
      last = { hits: layeredBoolean(shapes, "and_not") };
      markers = last.hits.map((h) => ({ type: "boolean", shapes: [h.shape] }));
      mode = "boolean";
      return last.hits;
    },
    matchEngine: () => {
      last = matchEngine(shapes);
      markers = last.markers;
      mode = "engine";
      return last;
    },
    enclosureM1: () => matchEnclosure(shapes, "VIA", "M1"),
    enclosureM2: () => matchEnclosure(shapes, "VIA", "M2"),
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Run match actions, inspect markers, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> M1 A,B,D · M2 C · VIA V.
      GOLDEN engine markers = ${GOLDENS.matchEngineMarkers}.</p>`,
    loadStarter() {
      api.reset();
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
      return [
        ...["A", "B", "D", "C", "V"].map((id) =>
          el("button", {
            className: "btn " + (selected === id ? "btn-primary" : "btn-secondary"),
            type: "button",
            text: id,
            onClick: () => {
              selected = id;
              ctx.rerender();
            },
          })
        ),
        el("button", { className: "btn btn-secondary", type: "button", text: "Match width", onClick: () => { api.matchWidth(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Match space", onClick: () => { api.matchSpace(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Scanline M1", onClick: () => { api.scanline(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Emit markers", onClick: () => { api.emitMarkers(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Via check", onClick: () => { api.viaCheck(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Interactions", onClick: () => { api.interactions(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Boolean and_not", onClick: () => { api.booleanAndNot(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Match engine", onClick: () => { api.matchEngine(); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "Reset", onClick: () => { api.reset(); ctx.rerender(); } }),
      ];
    },
    renderWorkspace(ctx) {
      const st = api.getStats();
      drawPatternMatching(ctx.canvas, {
        shapes,
        chip: CHIP,
        selected,
        highlight: selected ? [selected] : [],
        markers,
        metricText: `shapes=${st.shapeCount} edges=${st.edgeCount} markers=${markers.length} mode=${mode || "—"}`,
      });
      ctx.canvas.onclick = (ev) => {
        const hit = hitShape(shapes, ctx.canvas, ev.clientX, ev.clientY);
        if (hit) {
          selected = hit;
          ctx.rerender();
        }
      };
      const lines = [
        `selected: ${selected}`,
        `shapes: ${st.shapeCount} · layers: ${st.layerCount} · edges: ${st.edgeCount}`,
        `mode: ${mode || "—"} · markers: ${markers.length}`,
        `GOLDENS: engine ${GOLDENS.matchEngineMarkers} (W${GOLDENS.widthMarkers}+S${GOLDENS.spaceMarkers}+E${GOLDENS.enclosureMarkers})`,
      ];
      if (last && last.events) lines.push(`scan events: ${last.events.length}`);
      if (last && last.count != null) lines.push(`engine count: ${last.count}`);
      if (last && last.m1_ok != null) lines.push(`via m1_ok=${last.m1_ok} m2_ok=${last.m2_ok}`);
      if (last && last.pairs) lines.push(`interactions: ${last.pairs.length}`);
      if (last && last.hits) lines.push(`boolean hits: ${last.hits.length}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
