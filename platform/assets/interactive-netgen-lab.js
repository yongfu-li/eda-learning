/**
 * Interactive Netgen Part A lab.
 */
import {
  STARTER,
  GOLDENS,
  cloneDesign,
  stageRead,
  stageClasses,
  stagePermute,
  stageCompareNets,
  stageReport,
  netgenEngine,
  drawNetgen,
  hitTestNetgen,
} from "./netgen-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveNetgenLab(root, opts = {}) {
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
    showRead: () => {
      last = stageRead(design);
      mode = "read";
      highlight = last.highlight;
      return last;
    },
    showClasses: () => {
      last = stageClasses(design);
      mode = "classes";
      highlight = last.highlight;
      return last;
    },
    showPermute: () => {
      last = stagePermute(design);
      mode = "permute";
      highlight = last.highlight;
      return last;
    },
    showCompare: () => {
      last = stageCompareNets(design);
      mode = "compare";
      highlight = last.highlight;
      return last;
    },
    showReport: () => {
      last = stageReport(design);
      mode = "report";
      highlight = last.highlight;
      return last;
    },
    engine: () => {
      last = netgenEngine(design);
      mode = "engine";
      highlight = ["mn1", "mp1", "X0", "X1"];
      return last;
    },
  };

  const applyDefault = () => {
    const m = opts.defaultMode;
    if (m === "read") api.showRead();
    else if (m === "classes") api.showClasses();
    else if (m === "permute") api.showPermute();
    else if (m === "compare") api.showCompare();
    else if (m === "report") api.showReport();
    else if (m === "engine") api.engine();
  };
  applyDefault();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Select devices/nets, run Netgen map stages, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_inv LVS — GOLDEN matched devices=${GOLDENS.matchedDevices}, nets=${GOLDENS.matchedNets}.</p>`,
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
        mk("Read", () => api.showRead()),
        mk("Classes", () => api.showClasses()),
        mk("Permute", () => api.showPermute()),
        mk("Compare", () => api.showCompare()),
        mk("Report", () => api.showReport()),
        mk("Engine", () => api.engine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      const metricText = last
        ? last.ok != null
          ? `ok=${last.ok}`
          : last.matchedDevices != null
            ? `dev=${last.matchedDevices}`
            : `mode=${mode}`
        : `mode=${mode || "—"}`;
      drawNetgen(ctx.canvas, {
        highlight,
        selected: [...selected],
        stageLabel: mode || "Netgen",
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestNetgen(ctx.canvas, highlight, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: match=${GOLDENS.matchedDevices}/${GOLDENS.matchedNets} mism=${GOLDENS.mismatchCount}`,
      ];
      if (last?.note) lines.push(last.note);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
