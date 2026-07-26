/**
 * Interactive ERC lab — click nets, run checks, score learner selection + goldens.
 */
import {
  STARTER,
  GOLDENS,
  cloneDesign,
  designStats,
  buildConnectivity,
  driversAndLoads,
  findFloatingNets,
  findUndrivenInputs,
  findMultiDriven,
  findSupplyShorts,
  findWellErrors,
  collectMarkers,
  ercEngine,
  drawErc,
  hitTestNet,
} from "./erc-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveErcLab(root, opts = {}) {
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
    showGraph: () => {
      last = buildConnectivity(design);
      mode = "graph";
      highlight = design.instances.map((i) => i.id);
      return last;
    },
    showDrivers: () => {
      last = driversAndLoads(design);
      mode = "drivers";
      highlight = ["z", "float_n", "y"];
      return last;
    },
    checkFloating: () => {
      last = findFloatingNets(design);
      mode = "floating";
      highlight = last.nets;
      markers = last.nets.map((n) => ({ kind: "floating", net: n }));
      return last;
    },
    checkUndriven: () => {
      last = findUndrivenInputs(design);
      mode = "undriven";
      highlight = last.hits.map((h) => h.net);
      markers = last.hits.map((h) => ({ kind: "undriven", ...h }));
      return last;
    },
    checkMulti: () => {
      last = findMultiDriven(design);
      mode = "multi";
      highlight = last.nets;
      markers = last.nets.map((n) => ({ kind: "multi_driven", net: n }));
      return last;
    },
    checkShorts: () => {
      last = findSupplyShorts(design);
      mode = "shorts";
      highlight = ["vdd", "vss", "short1"];
      markers = last.hits.map((h) => ({ kind: "supply_short", ...h }));
      return last;
    },
    checkWells: () => {
      last = findWellErrors(design);
      mode = "wells";
      highlight = last.hits.map((h) => h.net);
      markers = last.hits.map((h) => ({ kind: "well_error", well: h.id, net: h.net }));
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
      last = ercEngine(design);
      mode = "engine";
      markers = last.markers.markers;
      highlight = ["float_n", "z", "vdd", "vss", "well_n"];
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Click nets to select, run checks, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_erc — GOLDEN markers=${GOLDENS.markerCount} (float_n, z, short, well).</p>`,
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
        el("button", { className: "btn btn-secondary", type: "button", text: "Graph", onClick: () => { api.showGraph(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Drivers", onClick: () => { api.showDrivers(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Floating", onClick: () => { api.checkFloating(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Undriven", onClick: () => { api.checkUndriven(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Multi", onClick: () => { api.checkMulti(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Shorts", onClick: () => { api.checkShorts(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Wells", onClick: () => { api.checkWells(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Markers", onClick: () => { api.collect(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Engine", onClick: () => { api.engine(); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "Reset", onClick: () => { api.reset(); ctx.rerender(); } }),
      ];
    },
    renderWorkspace(ctx) {
      const st = api.getStats();
      drawErc(ctx.canvas, {
        design,
        highlight,
        selected: [...selected],
        markers,
        metricText:
          mode === "engine" && last
            ? `ok=${last.ok} markers=${last.markers.count}`
            : mode === "markers" && last
              ? `markers=${last.count}`
              : `edges=${st.edgeCount} selected=${[...selected].join(",") || "—"}`,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestNet(ctx.canvas, design, ev.clientX, ev.clientY);
        if (id) {
          api.selectNet(id);
          ctx.rerender();
        }
      };
      const lines = [
        `nets: ${st.netCount} · instances: ${st.instanceCount} · edges: ${st.edgeCount}`,
        `mode: ${mode || "—"} · markers: ${markers.length}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: floating=${GOLDENS.floatingCount} multi=${GOLDENS.multiDrivenCount} markers=${GOLDENS.markerCount}`,
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
