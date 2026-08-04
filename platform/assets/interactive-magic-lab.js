/**
 * Interactive Magic Part A lab.
 */
import {
  STARTER,
  GOLDENS,
  cloneCell,
  stagePaint,
  stageSelect,
  stageContact,
  stageDrc,
  stageGds,
  magicEngine,
  drawMagic,
  hitShape,
} from "./magic-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveMagicLab(root, opts = {}) {
  let cell = cloneCell(opts.initialCell || STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = null;
  let markers = [];

  const api = {
    getCell: () => cell,
    getLast: () => last,
    getMode: () => mode,
    getSelected: () => (selected ? [selected] : []),
    getHighlight: () => highlight,
    getGoldens: () => GOLDENS,
    reset: () => {
      cell = cloneCell(STARTER);
      mode = null;
      last = null;
      highlight = [];
      selected = null;
      markers = [];
    },
    select: (id) => {
      selected = id || null;
    },
    showPaint: () => {
      last = stagePaint(cell);
      mode = "paint";
      highlight = last.highlight;
      markers = [];
      return last;
    },
    showSelect: () => {
      last = stageSelect(cell);
      mode = "select";
      highlight = last.highlight;
      selected = last.selected;
      markers = [];
      return last;
    },
    showContact: () => {
      last = stageContact(cell);
      mode = "contact";
      highlight = last.highlight;
      markers = [];
      return last;
    },
    runDrc: () => {
      last = stageDrc(cell);
      mode = "drc";
      highlight = last.highlight;
      markers = last.markers || [];
      return last;
    },
    showGds: () => {
      last = stageGds(cell);
      mode = "gds";
      highlight = last.highlight;
      markers = [];
      return last;
    },
    engine: () => {
      last = magicEngine(cell);
      mode = "engine";
      highlight = ["thin", "ca", "m1y"];
      markers = [];
      return last;
    },
  };

  const applyDefault = () => {
    const m = opts.defaultMode;
    if (m === "paint") api.showPaint();
    else if (m === "select") api.showSelect();
    else if (m === "contact") api.showContact();
    else if (m === "drc") api.runDrc();
    else if (m === "gds") api.showGds();
    else if (m === "engine") api.engine();
  };
  applyDefault();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Select shapes, run Magic map stages, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_inv — GOLDEN DRC errors=${GOLDENS.drcErrorCount} on thin metal.</p>`,
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
        mk("Paint", () => api.showPaint()),
        mk("Select", () => api.showSelect()),
        mk("Contact", () => api.showContact()),
        mk("DRC", () => api.runDrc()),
        mk("GDS", () => api.showGds()),
        mk("Engine", () => api.engine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      const metricText = last
        ? last.ok != null
          ? `ok=${last.ok}`
          : last.errorCount != null
            ? `drc=${last.errorCount}`
            : `mode=${mode}`
        : `mode=${mode || "—"}`;
      drawMagic(ctx.canvas, {
        cell,
        selected,
        highlight,
        markers,
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitShape(cell, ctx.canvas, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `selected: ${selected || "—"}`,
        `GOLDENS: rects=${GOLDENS.rectCount} drc=${GOLDENS.drcErrorCount}`,
      ];
      if (last?.note) lines.push(last.note);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
