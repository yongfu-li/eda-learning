/**
 * Interactive multi-patterning lab — DP/TP/QP, SADP, stitch, Check challenges.
 */
import {
  STARTER,
  CHIP,
  GOLDENS,
  MIN_SAME_MASK,
  cloneFeatures,
  geometryStats,
  buildConflictGraph,
  leleDouble,
  pathLele,
  triplePattern,
  quadPattern,
  sadpAssign,
  stitchFeature,
  mpEngine,
  drawMultiPatterning,
  hitFeature,
} from "./multi-patterning-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveMpLab(root, opts = {}) {
  let features = cloneFeatures(opts.initialFeatures || STARTER);
  let selected = "A";
  let mode = null;
  let colors = null;
  let graph = null;
  let mandrels = [];
  let last = null;

  const api = {
    getFeatures: () => features,
    setFeatures: (f) => {
      features = cloneFeatures(f);
    },
    getSelected: () => selected,
    setSelected: (id) => {
      selected = id;
    },
    getMode: () => mode,
    getStats: () => geometryStats(features),
    getColors: () => colors,
    getGraph: () => graph,
    getMandrels: () => mandrels,
    getLast: () => last,
    getGoldens: () => GOLDENS,
    reset: () => {
      features = cloneFeatures(STARTER);
      mode = null;
      colors = null;
      graph = null;
      mandrels = [];
      last = null;
      selected = "A";
    },
    showGraph: () => {
      graph = buildConflictGraph(features);
      mode = "graph";
      last = { edgeCount: graph.edgeCount };
      return graph;
    },
    lele: () => {
      last = leleDouble(features);
      graph = last.graph;
      colors = last.colors;
      mode = "lele";
      return last;
    },
    pathLele: () => {
      last = pathLele(features);
      graph = buildConflictGraph(features);
      colors = last.colors;
      mode = "path-lele";
      return last;
    },
    sadp: () => {
      last = sadpAssign(features);
      graph = last.graph;
      mandrels = last.mandrels;
      colors = null;
      mode = "sadp";
      return last;
    },
    stitch: () => {
      last = stitchFeature(features);
      features = last.features;
      graph = last.graph;
      colors = last.colors;
      mode = "stitch";
      return last;
    },
    triple: () => {
      last = triplePattern(features, "backtrack");
      graph = last.graph;
      colors = last.colors;
      mode = "triple";
      return last;
    },
    tripleGreedy: () => {
      last = triplePattern(features, "greedy");
      graph = last.graph;
      colors = last.colors;
      mode = "triple-greedy";
      return last;
    },
    quad: () => {
      last = quadPattern(features, "greedy");
      graph = last.graph;
      colors = last.colors;
      mode = "quad";
      return last;
    },
    engine: () => {
      last = mpEngine(features);
      colors = last.colors;
      graph = buildConflictGraph(features);
      mode = "engine";
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Run LELE / TP / QP / SADP / stitch, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> features A–F, min_same_mask=${MIN_SAME_MASK}.
      GOLDEN best masks = ${GOLDENS.engineBestMasks} (TP).</p>`,
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
      const ids = features.map((f) => f.id);
      return [
        ...ids.slice(0, 8).map((id) =>
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
        el("button", { className: "btn btn-secondary", type: "button", text: "Conflict graph", onClick: () => { api.showGraph(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "LELE DP", onClick: () => { api.lele(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Path DEF", onClick: () => { api.pathLele(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "SADP", onClick: () => { api.sadp(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Stitch C", onClick: () => { api.stitch(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Triple BT", onClick: () => { api.triple(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Triple greedy", onClick: () => { api.tripleGreedy(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Quad", onClick: () => { api.quad(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "MP engine", onClick: () => { api.engine(); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "Reset", onClick: () => { api.reset(); ctx.rerender(); } }),
      ];
    },
    renderWorkspace(ctx) {
      const st = api.getStats();
      drawMultiPatterning(ctx.canvas, {
        features,
        chip: CHIP,
        selected,
        highlight: selected ? [selected] : [],
        colors,
        graph,
        mandrels,
        metricText: `n=${st.featureCount} edges=${graph ? graph.edgeCount : "—"} mode=${mode || "—"}`,
      });
      ctx.canvas.onclick = (ev) => {
        const hit = hitFeature(features, ctx.canvas, ev.clientX, ev.clientY);
        if (hit) {
          selected = hit;
          ctx.rerender();
        }
      };
      const lines = [
        `selected: ${selected}`,
        `features: ${st.featureCount} · min_same_mask=${MIN_SAME_MASK}`,
        `mode: ${mode || "—"} · edges: ${graph ? graph.edgeCount : "—"}`,
        `GOLDENS: DP fail · TP ${GOLDENS.tpColorsUsed} · best ${GOLDENS.engineBestMasks}`,
      ];
      if (last && last.ok != null) lines.push(`last ok=${last.ok}`);
      if (last && last.dpOk != null) lines.push(`stitch dpOk=${last.dpOk}`);
      if (last && last.bestMasks != null) lines.push(`engine best=${last.bestMasks}`);
      if (last && last.mandrelCount != null) lines.push(`mandrels=${last.mandrelCount}`);
      if (last && last.colorsUsed != null) lines.push(`colorsUsed=${last.colorsUsed}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
