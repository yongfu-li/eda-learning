/**
 * Interactive antenna lab — click nets, run checks, score learner selection + goldens.
 */
import {
  STARTER,
  GOLDENS,
  cloneDesign,
  designStats,
  metalAreaByNet,
  gateAreaByNet,
  antennaRatios,
  chargeByNet,
  findViolations,
  applyJumper,
  jumperEffect,
  collectMarkers,
  antennaEngine,
  drawAntenna,
  hitTestNet,
} from "./antenna-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveAntennaLab(root, opts = {}) {
  let design = cloneDesign(opts.initialDesign || STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = new Set();
  let markers = [];

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
    },
    selectNet: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showMetal: () => {
      last = metalAreaByNet(design);
      mode = "metal";
      highlight = Object.keys(last);
      return last;
    },
    showGates: () => {
      last = gateAreaByNet(design);
      mode = "gates";
      highlight = Object.keys(last);
      return last;
    },
    showRatio: () => {
      last = antennaRatios(design);
      mode = "ratio";
      highlight = Object.keys(last.ratios);
      return last;
    },
    showCharge: () => {
      last = chargeByNet(design);
      mode = "charge";
      highlight = Object.keys(last.charge);
      return last;
    },
    checkThreshold: () => {
      last = findViolations(design, false);
      mode = "threshold";
      highlight = last.hits.map((h) => h.net);
      markers = last.hits.map((h) => ({ kind: "antenna_ratio", ...h }));
      return last;
    },
    checkDiode: () => {
      last = findViolations(design, true);
      mode = "diode";
      highlight = [...last.protected, ...last.hits.map((h) => h.net)];
      markers = last.hits.map((h) => ({ kind: "antenna_ratio", ...h }));
      return last;
    },
    applyJumperBreak: () => {
      const jmp = jumperEffect(design);
      design = jmp.design;
      last = jmp;
      mode = "jumper";
      highlight = ["n1", "m1"];
      return last;
    },
    collect: () => {
      last = collectMarkers(design);
      mode = "markers";
      markers = last.markers;
      highlight = last.markers.map((m) => m.net).filter(Boolean);
      return last;
    },
    engine: () => {
      last = antennaEngine(design);
      mode = "engine";
      markers = last.markers.markers;
      highlight = ["n1", "n2", "n3"];
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Click nets to select, run checks, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_antenna — GOLDEN ratio n1=${GOLDENS.ratioN1}, violations=${GOLDENS.violationCount} after diode.</p>`,
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
        el("button", { className: "btn btn-secondary", type: "button", text: "Metal", onClick: () => { api.showMetal(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Gates", onClick: () => { api.showGates(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Ratio", onClick: () => { api.showRatio(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Charge", onClick: () => { api.showCharge(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Threshold", onClick: () => { api.checkThreshold(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Diode", onClick: () => { api.checkDiode(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Jumper", onClick: () => { api.applyJumperBreak(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Markers", onClick: () => { api.collect(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Engine", onClick: () => { api.engine(); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "Reset", onClick: () => { api.reset(); ctx.rerender(); } }),
      ];
    },
    renderWorkspace(ctx) {
      const st = api.getStats();
      let metricText = `gates=${st.gateCount} metals=${st.metalCount} selected=${[...selected].join(",") || "—"}`;
      if (mode === "ratio" && last?.ratios) {
        metricText = `n1=${last.ratios.n1?.toFixed(0) ?? "—"} n2=${last.ratios.n2?.toFixed(0) ?? "—"} n3=${last.ratios.n3?.toFixed(0) ?? "—"}`;
      } else if (mode === "metal" && last) {
        metricText = `n1=${last.n1 ?? 0} n2=${last.n2 ?? 0} n3=${last.n3 ?? 0}`;
      } else if (mode === "gates" && last) {
        metricText = `n1=${last.n1 ?? 0} n2=${last.n2 ?? 0} n3=${last.n3 ?? 0}`;
      } else if (mode === "charge" && last?.charge) {
        metricText = `Q n1=${last.charge.n1 ?? 0}`;
      } else if (mode === "threshold" && last) {
        metricText = `raw violations=${last.count}`;
      } else if (mode === "diode" && last) {
        metricText = `violations=${last.count} protected=${last.protected.join(",")}`;
      } else if (mode === "jumper" && last) {
        metricText = `n1 before=${last.beforeRatio} after=${last.afterRatio}`;
      } else if (mode === "markers" && last) {
        metricText = `markers=${last.count}`;
      } else if (mode === "engine" && last) {
        metricText = `ok=${last.ok} violations=${last.violations.count}`;
      }
      drawAntenna(ctx.canvas, {
        design,
        highlight,
        selected: [...selected],
        markers,
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestNet(ctx.canvas, design, ev.clientX, ev.clientY);
        if (id) {
          api.selectNet(id);
          ctx.rerender();
        }
      };
      const lines = [
        `nets: ${st.netCount} · gates: ${st.gateCount} · metals: ${st.metalCount}`,
        `mode: ${mode || "—"} · markers: ${markers.length}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: ratioN1=${GOLDENS.ratioN1} violations=${GOLDENS.violationCount} markers=${GOLDENS.markerCount}`,
      ];
      if (last && last.count != null && mode !== "engine") lines.push(`last.count: ${last.count}`);
      if (last && last.ok != null) lines.push(`engine ok: ${last.ok}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
