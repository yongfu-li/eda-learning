/**
 * Interactive logic synthesis lab — AIG, cuts, techmap, Check challenges.
 */
import {
  AIG_NODES,
  LIBRARY,
  LAYOUT,
  GOLDENS,
  PI,
  aigStats,
  evalAig,
  outputValue,
  buildStrashTable,
  localRewriteCount,
  applyInverterPush,
  enumerateCuts,
  cutStats,
  techmapArea,
  techmapDelay,
  areaDelayTradeoff,
  sequentialSynth,
  drawSynthesis,
  hitNode,
} from "./synthesis-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveSynthesisLab(root, opts = {}) {
  const nodes = opts.nodes || AIG_NODES;
  let assignment = { a: 1, b: 0, c: 1 };
  let selectedNode = 7;
  let mapping = null;
  let cuts = null;
  let mode = null;
  let seq = null;

  const api = {
    getNodes: () => nodes,
    getAssignment: () => ({ ...assignment }),
    setAssignment: (a) => {
      assignment = { ...assignment, ...a };
    },
    getSelected: () => selectedNode,
    setSelected: (id) => {
      selectedNode = id;
    },
    getMapping: () => mapping,
    getCuts: () => cuts,
    getMode: () => mode,
    getStats: () => aigStats(nodes),
    getLibrary: () => LIBRARY,
    eval: () => evalAig(assignment, nodes),
    output: () => outputValue(assignment, nodes),
    strash: () => buildStrashTable(nodes),
    rewriteCount: () => localRewriteCount(nodes),
    inverterPush: () => applyInverterPush(nodes),
    runCuts: () => {
      cuts = enumerateCuts(nodes);
      mode = "cuts";
      return cutStats(cuts);
    },
    runTechmapArea: () => {
      mapping = techmapArea(nodes).mapping;
      mode = "techmap-area";
      return techmapArea(nodes);
    },
    runTechmapDelay: () => {
      const d = techmapDelay(nodes);
      mapping = d.mapping;
      mode = "techmap-delay";
      return d;
    },
    runTradeoff: () => areaDelayTradeoff(nodes),
    runSequential: () => {
      seq = sequentialSynth(nodes);
      mapping = seq.mapping.mapping;
      cuts = enumerateCuts(nodes);
      mode = "sequential";
      return seq;
    },
    getSeq: () => seq,
    clearMap: () => {
      mapping = null;
      cuts = null;
      mode = null;
      seq = null;
    },
    cutStats: () => (cuts ? cutStats(cuts) : null),
  };

  function togglePi(name) {
    assignment = { ...assignment, [name]: assignment[name] ? 0 : 1 };
  }

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Toggle PIs, run cuts/techmap, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> toy AIG for <code>f = (~(a∧b) ∧ c) ∧ (a∧c)</code>.
      Explore strash, rewrite, k-cuts, and area/delay techmap.</p>`,
    loadStarter() {
      assignment = { a: 1, b: 0, c: 1 };
      selectedNode = 7;
      mapping = null;
      cuts = null;
      mode = null;
      seq = null;
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        assignment = { a: 1, b: 0, c: 1 };
        selectedNode = 7;
        mapping = null;
        cuts = null;
        mode = null;
        seq = null;
        if (typeof ch.setup === "function") ch.setup(ctx, api);
      },
      check: (ctx) => (typeof ch.check === "function" ? !!ch.check(ctx, api) : false),
    })),
    extraActions(ctx) {
      const btns = [];
      for (const name of PI) {
        btns.push(
          el("button", {
            className: "btn " + (assignment[name] ? "btn-primary" : "btn-secondary"),
            type: "button",
            text: `${name}=${assignment[name]}`,
            onClick: () => {
              togglePi(name);
              ctx.rerender();
            },
          })
        );
      }
      btns.push(
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Enumerate cuts",
          onClick: () => {
            api.runCuts();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Techmap area",
          onClick: () => {
            api.runTechmapArea();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Techmap delay",
          onClick: () => {
            api.runTechmapDelay();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Sequential synth",
          onClick: () => {
            api.runSequential();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-ghost",
          type: "button",
          text: "Clear map",
          onClick: () => {
            api.clearMap();
            ctx.rerender();
          },
        })
      );
      return btns;
    },
    renderWorkspace(ctx) {
      const f = api.output();
      const st = api.getStats();
      drawSynthesis(ctx.canvas, {
        nodes,
        layout: LAYOUT,
        selectedNode,
        mapping,
        cuts,
        highlight: selectedNode != null ? [selectedNode] : [],
        metricText: `f=${f} · AND=${st.and} · mode=${mode || "—"}`,
      });
      ctx.canvas.onclick = (ev) => {
        const hit = hitNode(LAYOUT, ctx.canvas, ev.clientX, ev.clientY);
        if (hit != null) {
          selectedNode = hit;
          ctx.rerender();
        }
      };
      const lines = [
        `PIs: a=${assignment.a} b=${assignment.b} c=${assignment.c} → f=${f}`,
        `selected node: ${selectedNode}`,
        `stats: PI=${st.pi} AND=${st.and} PO=${st.po}`,
        `strash entries: ${Object.keys(api.strash()).length}`,
        `rewrite opportunities: ${api.rewriteCount().count}`,
        `library: ${LIBRARY.length} cells`,
      ];
      if (mapping) lines.push(`mapped cells: ${mapping.map((m) => m.cell).join(", ")}`);
      if (cuts) lines.push(`cuts total: ${cutStats(cuts).totalCuts}`);
      if (seq) lines.push(`seq area: ${seq.mapping.area}`);
      if (typeof opts.extraMetrics === "function") lines.push(...opts.extraMetrics(api));
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
