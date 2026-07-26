/**
 * Interactive power lab — click nets, run checks, score learner selection + goldens.
 */
import {
  STARTER,
  GOLDENS,
  cloneDesign,
  designStats,
  switchingPower,
  leakagePower,
  totalPower,
  activityFactors,
  buildPowerGrid,
  irDropSolve,
  findIrViolations,
  findEmViolations,
  collectMarkers,
  powerEngine,
  drawPower,
  hitTestNet,
} from "./power-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractivePowerLab(root, opts = {}) {
  let design = cloneDesign(opts.initialDesign || STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = new Set();
  let markers = [];
  let irVolts = null;

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
      irVolts = null;
    },
    selectNet: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showSwitching: () => {
      last = switchingPower(design);
      mode = "switching";
      highlight = Object.keys(last.byNet);
      irVolts = null;
      return last;
    },
    showLeakage: () => {
      last = leakagePower(design);
      mode = "leakage";
      highlight = Object.keys(last.byNet);
      irVolts = null;
      return last;
    },
    showTotal: () => {
      last = totalPower(design);
      mode = "total";
      highlight = Object.keys(last.byNet);
      irVolts = null;
      return last;
    },
    showActivity: () => {
      last = activityFactors(design);
      mode = "activity";
      highlight = Object.keys(last.alphas);
      irVolts = null;
      return last;
    },
    showGrid: () => {
      last = buildPowerGrid(design);
      mode = "grid";
      highlight = [...last.nodes, ...last.edges.map((e) => e.id)];
      irVolts = null;
      return last;
    },
    showIrDrop: () => {
      last = irDropSolve(design);
      mode = "ir";
      irVolts = last.volts;
      highlight = [...design.grid.nodes, ...design.grid.edges.map((e) => e.id)];
      return last;
    },
    checkIr: () => {
      last = findIrViolations(design);
      mode = "ir_viol";
      irVolts = last.ir.volts;
      highlight = last.hits.map((h) => h.node).filter(Boolean);
      markers = last.hits.map((h) => ({ kind: "ir_drop", ...h }));
      return last;
    },
    checkEm: () => {
      last = findEmViolations(design);
      mode = "em";
      highlight = last.hits.map((h) => h.edge);
      markers = last.hits.map((h) => ({ kind: "em", ...h }));
      return last;
    },
    collect: () => {
      last = collectMarkers(design);
      mode = "markers";
      markers = last.markers;
      highlight = [
        ...last.markers.map((m) => m.node || m.edge).filter(Boolean),
      ];
      const ir = irDropSolve(design);
      irVolts = ir.volts;
      return last;
    },
    engine: () => {
      last = powerEngine(design);
      mode = "engine";
      markers = last.markers.markers;
      highlight = design.nets.map((n) => n.id);
      irVolts = last.ir.ir.volts;
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Click nets to select, run checks, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_power — GOLDEN Psw n1=${GOLDENS.pswN1}, chip Ptot=${GOLDENS.chipPtot}, markers=${GOLDENS.markerCount}.</p>`,
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
        el("button", { className: "btn btn-secondary", type: "button", text: "Switching", onClick: () => { api.showSwitching(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Leakage", onClick: () => { api.showLeakage(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Total", onClick: () => { api.showTotal(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Activity", onClick: () => { api.showActivity(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Grid", onClick: () => { api.showGrid(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "IR", onClick: () => { api.showIrDrop(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "EM", onClick: () => { api.checkEm(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Markers", onClick: () => { api.collect(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Engine", onClick: () => { api.engine(); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "Reset", onClick: () => { api.reset(); ctx.rerender(); } }),
      ];
    },
    renderWorkspace(ctx) {
      const st = api.getStats();
      let metricText = `nets=${st.netCount} edges=${st.edgeCount} selected=${[...selected].join(",") || "—"}`;
      if (mode === "switching" && last?.byNet) {
        metricText = `Psw n1=${last.byNet.n1?.toFixed(2) ?? "—"} total=${last.total?.toFixed(2) ?? "—"}`;
      } else if (mode === "leakage" && last?.byNet) {
        metricText = `Pleak n1=${last.byNet.n1?.toFixed(2) ?? "—"} total=${last.total?.toFixed(2) ?? "—"}`;
      } else if (mode === "total" && last) {
        metricText = `Ptot n1=${last.byNet?.n1?.toFixed(2) ?? "—"} chip=${last.total?.toFixed(2) ?? "—"}`;
      } else if (mode === "activity" && last?.alphas) {
        metricText = `α n1=${last.alphas.n1} n2=${last.alphas.n2} n3=${last.alphas.n3}`;
      } else if (mode === "grid" && last) {
        metricText = `nodes=${last.nodes.length} edges=${last.edgeCount}`;
      } else if (mode === "ir" && last) {
        metricText = `v_sink=${last.vSink?.toFixed(2)} ir_drop=${last.irDropSink?.toFixed(2)}`;
      } else if (mode === "ir_viol" && last) {
        metricText = `IR violations=${last.count}`;
      } else if (mode === "em" && last) {
        metricText = `EM violations=${last.count}`;
      } else if (mode === "markers" && last) {
        metricText = `markers=${last.count}`;
      } else if (mode === "engine" && last) {
        metricText = `ok=${last.ok} markers=${last.markers.count}`;
      }
      drawPower(ctx.canvas, {
        design,
        highlight,
        selected: [...selected],
        markers,
        irVolts,
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
        `nets: ${st.netCount} · edges: ${st.edgeCount} · Vdd: ${st.vdd}`,
        `mode: ${mode || "—"} · markers: ${markers.length}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: pswN1=${GOLDENS.pswN1} chipPtot=${GOLDENS.chipPtot} markers=${GOLDENS.markerCount}`,
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
