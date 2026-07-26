/**
 * Interactive signoff lab — click checks, run corners/ECO/tapeout, score goldens.
 */
import {
  STARTER,
  GOLDENS,
  cloneDesign,
  designStats,
  listCorners,
  pickSignoffCorner,
  applyDerate,
  runChecks,
  ecoPlan,
  applyEcos,
  tapeoutChecklist,
  collectMarkers,
  signoffEngine,
  drawSignoff,
  hitTestCheck,
} from "./signoff-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveSignoffLab(root, opts = {}) {
  let design = cloneDesign(opts.initialDesign || STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = new Set();
  let markers = [];
  let displayChecks = null;
  let tapeoutItems = null;
  let afterEco = false;

  const api = {
    getDesign: () => design,
    getStats: () => designStats(design),
    getLast: () => last,
    getMode: () => mode,
    getSelected: () => [...selected],
    getMarkers: () => markers,
    getGoldens: () => GOLDENS,
    reset: () => {
      design = cloneDesign(STARTER);
      mode = null;
      last = null;
      highlight = [];
      selected = new Set();
      markers = [];
      displayChecks = null;
      tapeoutItems = null;
      afterEco = false;
    },
    selectCheck: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showCorners: () => {
      last = listCorners(design);
      mode = "corners";
      highlight = last.corners.map((c) => c.id);
      displayChecks = null;
      tapeoutItems = null;
      return last;
    },
    showSignoffCorner: () => {
      last = pickSignoffCorner(design);
      mode = "signoff_corner";
      highlight = [last.corner.id];
      displayChecks = null;
      tapeoutItems = null;
      return last;
    },
    showDerate: (delay = 1.0) => {
      last = applyDerate(delay, design);
      mode = "derate";
      highlight = [design.signoff_corner];
      displayChecks = null;
      tapeoutItems = null;
      return last;
    },
    showChecks: () => {
      last = runChecks(design);
      mode = "checks";
      displayChecks = last.checks;
      highlight = last.fails.map((c) => c.id);
      tapeoutItems = null;
      afterEco = false;
      return last;
    },
    showEco: () => {
      last = ecoPlan(design);
      mode = "eco";
      highlight = [...last.fails, ...last.ecos.map((e) => e.id)];
      displayChecks = design.checks;
      tapeoutItems = null;
      return last;
    },
    applyEco: () => {
      last = applyEcos(design);
      design = last.design;
      mode = "apply_eco";
      displayChecks = last.checks;
      highlight = last.checks.filter((c) => c.status === "pass").map((c) => c.id);
      tapeoutItems = null;
      afterEco = true;
      return last;
    },
    showTapeout: (useAfterEco = false) => {
      last = tapeoutChecklist(design, useAfterEco);
      mode = "tapeout";
      tapeoutItems = last;
      displayChecks = useAfterEco ? applyEcos(cloneDesign(STARTER)).checks : design.checks;
      afterEco = useAfterEco;
      highlight = last.items.filter((i) => !i.ok && i.required).map((i) => i.id);
      return last;
    },
    showMarkers: () => {
      last = collectMarkers(design);
      mode = "markers";
      markers = last.markers;
      displayChecks = design.checks;
      highlight = last.markers.map((m) => m.check);
      tapeoutItems = null;
      return last;
    },
    engine: () => {
      last = signoffEngine(design);
      mode = "engine";
      markers = last.markers.markers;
      displayChecks = design.checks;
      tapeoutItems = last.tapeoutAfter;
      highlight = [design.signoff_corner, ...last.checks.fails.map((c) => c.id)];
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Click checks to select, run signoff steps, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_signoff — GOLDEN corners=${GOLDENS.cornerCount}, fails=${GOLDENS.failCount}, markers=${GOLDENS.markerCount}.</p>`,
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
        el("button", { className: "btn btn-secondary", type: "button", text: "Corners", onClick: () => { api.showCorners(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "SignoffCorner", onClick: () => { api.showSignoffCorner(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Derate", onClick: () => { api.showDerate(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Checks", onClick: () => { api.showChecks(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "ECO", onClick: () => { api.showEco(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "ApplyECO", onClick: () => { api.applyEco(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Tapeout", onClick: () => { api.showTapeout(afterEco); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Markers", onClick: () => { api.showMarkers(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Engine", onClick: () => { api.engine(); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "Reset", onClick: () => { api.reset(); ctx.rerender(); } }),
      ];
    },
    renderWorkspace(ctx) {
      const st = api.getStats();
      let metricText = `corners=${st.cornerCount} checks=${st.checkCount} selected=${[...selected].join(",") || "—"}`;
      if (mode === "corners" && last) {
        metricText = `corners=${last.count}`;
      } else if (mode === "signoff_corner" && last) {
        metricText = `corner=${last.corner.id} derate=${last.derate}`;
      } else if (mode === "derate" && last) {
        metricText = `delay=${last.delay} derated=${last.derated.toFixed(2)}`;
      } else if (mode === "checks" && last) {
        metricText = `fail=${last.failCount} pass=${last.passCount}`;
      } else if (mode === "eco" && last) {
        metricText = `ecos=${last.ecoCount} fixes_all=${last.fixesAll}`;
      } else if (mode === "apply_eco" && last) {
        metricText = `fail_count=${last.failCount}`;
      } else if (mode === "tapeout" && last) {
        metricText = `ready=${last.ready} required=${last.requiredCount}`;
      } else if (mode === "markers" && last) {
        metricText = `markers=${last.count}`;
      } else if (mode === "engine" && last) {
        metricText = `ok=${last.ok} markers=${last.markers.count}`;
      }
      drawSignoff(ctx.canvas, {
        design,
        checks: displayChecks || design.checks,
        highlight,
        selected: [...selected],
        markers,
        tapeoutItems,
        showEcos: mode === "eco" || mode === "apply_eco" || mode === "engine",
        showTapeout: mode === "tapeout" || mode === "engine",
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestCheck(ctx.canvas, design, ev.clientX, ev.clientY, displayChecks || design.checks);
        if (id) {
          api.selectCheck(id);
          ctx.rerender();
        }
      };
      const lines = [
        `corners: ${st.cornerCount} · checks: ${st.checkCount} · ecos: ${st.ecoCount}`,
        `mode: ${mode || "—"} · markers: ${markers.length}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: corner=${GOLDENS.signoffCorner} fails=${GOLDENS.failCount} markers=${GOLDENS.markerCount}`,
      ];
      if (last && last.failCount != null && mode !== "engine") lines.push(`fail_count: ${last.failCount}`);
      if (last && last.ok != null) lines.push(`engine ok: ${last.ok}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
