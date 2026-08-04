/**
 * Interactive PEX lab — select segments/nodes, run R/C/reduce/SPEF, Check challenges.
 */
import {
  STARTER,
  GOLDENS,
  cloneDesign,
  loadGeometry,
  extractResistance,
  extractCapacitance,
  buildRcNetwork,
  reduceNetwork,
  backAnnotate,
  emitSpefLite,
  pexEngine,
  drawPex,
  hitTestPex,
} from "./pex-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractivePexLab(root, opts = {}) {
  let design = cloneDesign(opts.initialDesign || STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
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
      selected = new Set();
    },
    select: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showGeometry: () => {
      last = loadGeometry(design);
      mode = "geometry";
      highlight = last.segments;
      return last;
    },
    runResistance: () => {
      last = extractResistance(design);
      mode = "resistance";
      highlight = last.resistors.map((r) => r.segment);
      return last;
    },
    runCapacitance: () => {
      last = extractCapacitance(design);
      mode = "capacitance";
      highlight = last.capacitors.map((c) => c.segment);
      return last;
    },
    showNetwork: () => {
      last = buildRcNetwork(design);
      mode = "network";
      highlight = last.nodes;
      return last;
    },
    runReduce: () => {
      last = reduceNetwork(design);
      mode = "reduce";
      highlight = ["in", "out", "R_eq", "C_eq"];
      return last;
    },
    runAnnotate: () => {
      last = backAnnotate(design);
      mode = "annotate";
      highlight = ["n1"];
      return last;
    },
    runSpef: () => {
      last = emitSpefLite(design);
      mode = "spef";
      highlight = ["R_eq", "C_eq", "n1"];
      return last;
    },
    engine: () => {
      last = pexEngine(design);
      mode = "engine";
      highlight = ["s1", "s2", "v1", "s3"];
      return last;
    },
  };

  const applyDefault = () => {
    const m = opts.defaultMode;
    if (m === "geometry") api.showGeometry();
    else if (m === "resistance") api.runResistance();
    else if (m === "capacitance") api.runCapacitance();
    else if (m === "network") api.showNetwork();
    else if (m === "reduce") api.runReduce();
    else if (m === "annotate") api.runAnnotate();
    else if (m === "spef") api.runSpef();
    else if (m === "engine") api.engine();
  };
  applyDefault();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Select segments/nodes, run PEX stages, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_pex net n1 — GOLDEN R=${GOLDENS.rTotal}, C=${GOLDENS.cTotal}.</p>`,
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
        mk("Geometry", () => api.showGeometry()),
        mk("Resistance", () => api.runResistance()),
        mk("Capacitance", () => api.runCapacitance()),
        mk("Network", () => api.showNetwork()),
        mk("Reduce", () => api.runReduce()),
        mk("Annotate", () => api.runAnnotate()),
        mk("SPEF", () => api.runSpef()),
        mk("Engine", () => api.engine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      const metricText = last
        ? last.ok != null
          ? `ok=${last.ok}`
          : last.rTotal != null
            ? `R=${last.rTotal}`
            : last.cTotal != null
              ? `C=${last.cTotal}`
              : last.rEq != null
                ? `Req=${last.rEq}`
                : last.segmentCount != null
                  ? `segs=${last.segmentCount}`
                  : `mode=${mode}`
        : `mode=${mode || "—"}`;
      drawPex(ctx.canvas, {
        highlight,
        selected: [...selected],
        stageLabel: mode || "PEX",
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestPex(ctx.canvas, highlight, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: R=${GOLDENS.rTotal} C=${GOLDENS.cTotal}`,
      ];
      if (last?.ok != null) lines.push(`ok=${last.ok}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
