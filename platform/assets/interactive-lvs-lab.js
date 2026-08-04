/**
 * Interactive LVS lab — select devices/nets, run extract/match/compare, Check challenges.
 */
import {
  STARTER,
  GOLDENS,
  cloneDesign,
  schematicGraph,
  recognizeDevices,
  extractNets,
  layoutGraph,
  pinBinding,
  matchDevices,
  lvsCompare,
  lvsEngine,
  drawLvs,
  hitTestLvs,
} from "./lvs-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveLvsLab(root, opts = {}) {
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
    showSchematic: () => {
      last = schematicGraph(design);
      mode = "schematic";
      highlight = [...last.devices, ...last.nets];
      return last;
    },
    runRecognize: () => {
      last = recognizeDevices(design);
      mode = "recognize";
      highlight = last.devices.map((d) => d.id);
      return last;
    },
    runExtract: () => {
      last = extractNets(design);
      mode = "extract";
      highlight = last.ids;
      return last;
    },
    showLayout: () => {
      last = layoutGraph(design);
      mode = "layout";
      highlight = [...last.devices, ...last.nets];
      return last;
    },
    runBinding: () => {
      last = pinBinding(design);
      mode = "binding";
      highlight = [...Object.keys(last.devices), ...Object.keys(last.nets)];
      return last;
    },
    runMatch: () => {
      last = matchDevices(design);
      mode = "match";
      highlight = last.matched.map((m) => m.layout);
      return last;
    },
    runCompare: () => {
      last = lvsCompare(design);
      mode = "compare";
      highlight = last.matchedNets;
      return last;
    },
    engine: () => {
      last = lvsEngine(design);
      mode = "engine";
      highlight = ["mn1", "mp1", "X0", "X1"];
      return last;
    },
  };

  const applyDefault = () => {
    const m = opts.defaultMode;
    if (m === "schematic") api.showSchematic();
    else if (m === "recognize") api.runRecognize();
    else if (m === "extract") api.runExtract();
    else if (m === "layout") api.showLayout();
    else if (m === "binding") api.runBinding();
    else if (m === "match") api.runMatch();
    else if (m === "compare") api.runCompare();
    else if (m === "engine") api.engine();
  };
  applyDefault();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Select devices/nets, run LVS stages, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_lvs INV — GOLDEN matched devices=${GOLDENS.matchedDevices}, nets=${GOLDENS.matchedNets}.</p>`,
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
        mk("Schematic", () => api.showSchematic()),
        mk("Recognize", () => api.runRecognize()),
        mk("Extract", () => api.runExtract()),
        mk("Layout", () => api.showLayout()),
        mk("Binding", () => api.runBinding()),
        mk("Match", () => api.runMatch()),
        mk("Compare", () => api.runCompare()),
        mk("Engine", () => api.engine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      const metricText = last
        ? last.ok != null
          ? `ok=${last.ok}`
          : last.count != null
            ? `count=${last.count}`
            : last.deviceCount != null
              ? `devices=${last.deviceCount}`
              : last.matchedNetCount != null
                ? `nets=${last.matchedNetCount}`
                : `mode=${mode}`
        : `mode=${mode || "—"}`;
      drawLvs(ctx.canvas, {
        highlight,
        selected: [...selected],
        stageLabel: mode || "LVS",
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestLvs(ctx.canvas, highlight, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: sch=${GOLDENS.schDeviceCount} lay=${GOLDENS.layDeviceCount} match=${GOLDENS.matchedDevices}`,
      ];
      if (last?.ok != null) lines.push(`ok=${last.ok}`);
      if (last?.mismatchCount != null) lines.push(`mismatches=${last.mismatchCount}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
