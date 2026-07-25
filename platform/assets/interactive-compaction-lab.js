/**
 * Interactive compaction lab — constraint graph, 1-D/2-D, Check challenges.
 */
import {
  STARTER,
  CHIP,
  MIN_GAP,
  GOLDENS,
  cloneObjects,
  layoutStats,
  buildConstraintGraph,
  longestPathCompact,
  compact1d,
  compact2d,
  addJog,
  shearChannelLite,
  isLegal,
  sequentialCompact,
  drawCompaction,
  hitObject,
} from "./compaction-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveCompactionLab(root, opts = {}) {
  let objects = cloneObjects(opts.initialObjects || STARTER);
  let selected = "A";
  let mode = null;
  let graph = null;
  let last = null;

  const api = {
    getObjects: () => objects,
    setObjects: (o) => {
      objects = cloneObjects(o);
    },
    getSelected: () => selected,
    setSelected: (id) => {
      selected = id;
    },
    getMode: () => mode,
    getStats: () => layoutStats(objects),
    getGraph: () => graph,
    getLast: () => last,
    isLegal: () => isLegal(objects),
    reset: () => {
      objects = cloneObjects(STARTER);
      mode = null;
      graph = null;
      last = null;
      selected = "A";
    },
    showGraphX: () => {
      graph = buildConstraintGraph(objects, "x");
      mode = "graph-x";
      return graph;
    },
    longestX: () => {
      graph = buildConstraintGraph(objects, "x");
      last = { positions: longestPathCompact(graph) };
      mode = "longest-x";
      return last;
    },
    compactX: () => {
      last = compact1d(objects, "x");
      objects = last.objects;
      graph = last.graph;
      mode = "compact-x";
      return last;
    },
    compactY: () => {
      last = compact1d(objects, "y");
      objects = last.objects;
      graph = last.graph;
      mode = "compact-y";
      return last;
    },
    compact2d: () => {
      last = compact2d(objects);
      objects = last.objects;
      mode = "compact-2d";
      return last;
    },
    jogW: () => {
      objects = objects.map((o) => (o.id === "W" ? addJog(o, 10, 8) : o));
      mode = "jog";
      return objects.find((o) => o.id === "W");
    },
    shear: () => {
      last = shearChannelLite(objects, 7, 13, 1);
      objects = last.objects;
      mode = "shear";
      return last;
    },
    sequential: () => {
      last = sequentialCompact(objects);
      objects = last.objects;
      mode = "sequential";
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Compact X/Y, inspect constraints, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> cells A,B,C plus wire W.
      Compact under <code>min_gap=${MIN_GAP}</code>. GOLDEN X span 20→14.</p>`,
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
        ...["A", "B", "C", "W"].map((id) =>
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
        el("button", { className: "btn btn-secondary", type: "button", text: "X graph", onClick: () => { api.showGraphX(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Compact X", onClick: () => { api.compactX(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Compact Y", onClick: () => { api.compactY(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Compact 2D", onClick: () => { api.compact2d(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Jog W", onClick: () => { api.jogW(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Shear", onClick: () => { api.shear(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Sequential", onClick: () => { api.sequential(); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "Reset", onClick: () => { api.reset(); ctx.rerender(); } }),
      ];
    },
    renderWorkspace(ctx) {
      const st = api.getStats();
      drawCompaction(ctx.canvas, {
        objects,
        chip: CHIP,
        selected,
        highlight: selected ? [selected] : [],
        graph,
        metricText: `W=${st.width} H=${st.height} legal=${api.isLegal()} mode=${mode || "—"}`,
      });
      ctx.canvas.onclick = (ev) => {
        const hit = hitObject(objects, ctx.canvas, ev.clientX, ev.clientY);
        if (hit) {
          selected = hit;
          ctx.rerender();
        }
      };
      const lines = [
        `selected: ${selected}`,
        `span: ${st.width} × ${st.height} (chip ${CHIP.x1}×${CHIP.y1})`,
        `objects: ${st.objectCount} · whitespace≈${st.whitespace} · legal=${api.isLegal()}`,
        `mode: ${mode || "—"} · constraints: ${graph ? graph.edges.length : "—"}`,
        `GOLDENS: width ${GOLDENS.initialWidth}→${GOLDENS.compactXWidth}`,
      ];
      if (last && last.afterSpan != null) lines.push(`last 1-D: ${last.beforeSpan}→${last.afterSpan}`);
      if (last && last.finalWidth != null) lines.push(`last 2-D/seq: ${last.initialWidth}→${last.finalWidth}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
