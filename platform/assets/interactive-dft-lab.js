/**
 * Interactive DFT lab — click flops, run scan checks, score learner selection + goldens.
 */
import {
  STARTER,
  GOLDENS,
  cloneDesign,
  designStats,
  identifyScanFlops,
  scanEnablePort,
  stitchChain,
  scanOrderCheck,
  findLockups,
  netlistTransform,
  collectMarkers,
  dftEngine,
  drawDft,
  hitTestFlop,
} from "./dft-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveDftLab(root, opts = {}) {
  let design = cloneDesign(opts.initialDesign || STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = new Set();
  let markers = [];
  let showChain = true;

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
      showChain = true;
    },
    selectFlop: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showFlops: () => {
      last = identifyScanFlops(design);
      mode = "flops";
      highlight = last.cells.map((c) => c.id);
      return last;
    },
    showSe: () => {
      last = scanEnablePort(design);
      mode = "se";
      highlight = ["si", "so", "se"];
      return last;
    },
    showStitch: () => {
      last = stitchChain(design);
      mode = "stitch";
      highlight = [...last.order, ...last.stitches.map((s) => `stitch_${s.from}_${s.to}`)];
      showChain = true;
      return last;
    },
    showOrder: () => {
      last = scanOrderCheck(design);
      mode = "order";
      highlight = last.order;
      return last;
    },
    showLockup: () => {
      last = findLockups(design);
      mode = "lockup";
      highlight = last.hits.flatMap((h) => [h.from, h.to]);
      markers = last.hits.map((h) => ({ kind: "lockup", ...h }));
      showChain = true;
      return last;
    },
    showTransform: () => {
      last = netlistTransform(design);
      mode = "transform";
      highlight = last.edges.flatMap((e) => [e.from, e.to].filter(Boolean));
      showChain = true;
      return last;
    },
    showMarkers: () => {
      last = collectMarkers(design);
      mode = "markers";
      markers = last.markers;
      highlight = last.markers.flatMap((m) => [m.from, m.to].filter(Boolean));
      showChain = true;
      return last;
    },
    showChain: () => {
      last = dftEngine(design);
      mode = "chain";
      markers = last.markers.markers;
      highlight = design.scan_order;
      showChain = true;
      return last;
    },
    engine: () => {
      last = dftEngine(design);
      mode = "engine";
      markers = last.markers.markers;
      highlight = design.scan_order;
      showChain = true;
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Click flops to select, run checks, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_dft — GOLDEN scan cells=${GOLDENS.scanCellCount}, stitches=${GOLDENS.stitchCount}, lockups=${GOLDENS.lockupCount}, markers=${GOLDENS.markerCount}.</p>`,
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
        el("button", { className: "btn btn-secondary", type: "button", text: "Flops", onClick: () => { api.showFlops(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "SE", onClick: () => { api.showSe(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Stitch", onClick: () => { api.showStitch(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Order", onClick: () => { api.showOrder(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Lockup", onClick: () => { api.showLockup(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Transform", onClick: () => { api.showTransform(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Markers", onClick: () => { api.showMarkers(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Chain", onClick: () => { api.showChain(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Engine", onClick: () => { api.engine(); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "Reset", onClick: () => { api.reset(); ctx.rerender(); } }),
      ];
    },
    renderWorkspace(ctx) {
      const st = api.getStats();
      let metricText = `flops=${st.flopCount} domains=${st.domainCount} selected=${[...selected].join(",") || "—"}`;
      if (mode === "flops" && last) {
        metricText = `scan_cells=${last.count} type=SDFF`;
      } else if (mode === "se" && last) {
        metricText = `si=${last.si} so=${last.so} se=${last.se}`;
      } else if (mode === "stitch" && last) {
        metricText = `stitches=${last.stitchCount} order=${last.order.join("→")}`;
      } else if (mode === "order" && last) {
        metricText = `length=${last.length} covers_all=${last.coversAll}`;
      } else if (mode === "lockup" && last) {
        metricText = `lockups=${last.count}`;
      } else if (mode === "transform" && last) {
        metricText = `edges=${last.edgeCount} stitches=${last.stitchCount} lockups=${last.lockupCount}`;
      } else if (mode === "markers" && last) {
        metricText = `markers=${last.count}`;
      } else if (mode === "chain" && last) {
        metricText = `chain=${design.scan_order.join("→")} lockups=${last.lockups.count}`;
      } else if (mode === "engine" && last) {
        metricText = `ok=${last.ok} markers=${last.markers.count}`;
      }
      drawDft(ctx.canvas, {
        design,
        highlight,
        selected: [...selected],
        markers,
        showChain,
        metricText,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestFlop(ctx.canvas, design, ev.clientX, ev.clientY);
        if (id) {
          api.selectFlop(id);
          ctx.rerender();
        }
      };
      const lines = [
        `flops: ${st.flopCount} · domains: ${st.domainCount} · ports: si/so/se`,
        `mode: ${mode || "—"} · markers: ${markers.length}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: scanCells=${GOLDENS.scanCellCount} stitches=${GOLDENS.stitchCount} lockups=${GOLDENS.lockupCount}`,
      ];
      if (last && last.count != null && mode !== "engine" && mode !== "chain") lines.push(`last.count: ${last.count}`);
      if (last && last.ok != null) lines.push(`engine ok: ${last.ok}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
