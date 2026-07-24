/**
 * Interactive retiming lab — Leiserson–Saxe literacy, Check challenges.
 */
import {
  NODES,
  EDGES,
  PERIOD_TARGET,
  GOLDENS,
  LAYOUT,
  zeroRetime,
  graphStats,
  isLegal,
  forwardRetime,
  backwardRetime,
  clockPeriod,
  registerCount,
  feasCheck,
  minPeriodSearch,
  sequentialRetime,
  applyRetime,
  drawRetiming,
  hitNode,
} from "./retiming-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveRetimingLab(root, opts = {}) {
  let r = zeroRetime();
  let selectedNode = "a";
  let mode = null;
  let lastSearch = null;

  const api = {
    getR: () => ({ ...r }),
    setR: (nr) => {
      r = { ...nr };
    },
    getSelected: () => selectedNode,
    setSelected: (id) => {
      selectedNode = id;
    },
    getMode: () => mode,
    getStats: () => graphStats(),
    getPeriod: () => clockPeriod(r),
    getBaselinePeriod: () => clockPeriod(null),
    getRegisters: () => registerCount(r),
    getBaselineRegisters: () => registerCount(null),
    isLegal: () => isLegal(EDGES, r),
    getEdges: () => applyRetime(EDGES, r),
    getTarget: () => PERIOD_TARGET,
    feas: (period) => feasCheck(period ?? PERIOD_TARGET, r),
    forward: (node, amount = 1) => {
      r = forwardRetime(node || selectedNode, r, amount);
      mode = "forward";
      return api.getR();
    },
    backward: (node, amount = 1) => {
      r = backwardRetime(node || selectedNode, r, amount);
      mode = "backward";
      return api.getR();
    },
    resetR: () => {
      r = zeroRetime();
      mode = null;
      lastSearch = null;
    },
    runMinPeriod: () => {
      lastSearch = minPeriodSearch();
      r = { ...lastSearch.r };
      mode = "min-period";
      return lastSearch;
    },
    runSequential: (m = "min_period") => {
      const seq = sequentialRetime(m);
      r = { ...seq.r };
      mode = "sequential";
      lastSearch = seq;
      return seq;
    },
    getSearch: () => lastSearch,
    forwardA: () => {
      r = zeroRetime();
      r = forwardRetime("a", r, 1);
      selectedNode = "a";
      mode = "forward-a";
      return api.getR();
    },
    backwardC: () => {
      r = zeroRetime();
      r = backwardRetime("c", r, 1);
      selectedNode = "c";
      mode = "backward-c";
      return api.getR();
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Select a node, push registers forward/backward, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> toy sequential graph
      <code>u→a→b→c→v</code> (+ <code>a→c</code>). Edge labels are register counts <code>w</code>.
      Retiming lag <code>r(v)</code> moves registers; period is longest zero-weight path delay.</p>`,
    loadStarter() {
      r = zeroRetime();
      selectedNode = "a";
      mode = null;
      lastSearch = null;
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        r = zeroRetime();
        selectedNode = "a";
        mode = null;
        lastSearch = null;
        if (typeof ch.setup === "function") ch.setup(ctx, api);
      },
      check: (ctx) => (typeof ch.check === "function" ? !!ch.check(ctx, api) : false),
    })),
    extraActions(ctx) {
      const btns = [];
      for (const n of NODES) {
        btns.push(
          el("button", {
            className: "btn " + (selectedNode === n.id ? "btn-primary" : "btn-secondary"),
            type: "button",
            text: n.id,
            onClick: () => {
              selectedNode = n.id;
              ctx.rerender();
            },
          })
        );
      }
      btns.push(
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Forward −r",
          onClick: () => {
            api.forward();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Backward +r",
          onClick: () => {
            api.backward();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Forward on a",
          onClick: () => {
            api.forwardA();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Backward on c",
          onClick: () => {
            api.backwardC();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Min period",
          onClick: () => {
            api.runMinPeriod();
            ctx.rerender();
          },
        }),
        el("button", {
          className: "btn btn-ghost",
          type: "button",
          text: "Zero r",
          onClick: () => {
            api.resetR();
            ctx.rerender();
          },
        })
      );
      return btns;
    },
    renderWorkspace(ctx) {
      const period = api.getPeriod();
      const regs = api.getRegisters();
      const legal = api.isLegal();
      drawRetiming(ctx.canvas, {
        r,
        selectedNode,
        highlight: selectedNode ? [selectedNode] : [],
        metricText: `P=${period}  regs=${regs}  ${legal ? "legal" : "ILLEGAL"}  target=${PERIOD_TARGET}`,
      });
      ctx.canvas.onclick = (ev) => {
        const hit = hitNode(LAYOUT, ctx.canvas, ev.clientX, ev.clientY);
        if (hit) {
          selectedNode = hit;
          ctx.rerender();
        }
      };
      const lines = [
        `selected: ${selectedNode}  r=${r[selectedNode] || 0}`,
        `period: ${period} (baseline ${api.getBaselinePeriod()})  target ${PERIOD_TARGET}`,
        `registers: ${regs} (baseline ${api.getBaselineRegisters()})`,
        `legal: ${legal ? "yes" : "NO"}  mode: ${mode || "—"}`,
        `edges: ${api
          .getEdges()
          .map((e) => `${e.id}:${e.w}`)
          .join(" ")}`,
      ];
      if (typeof opts.extraMetrics === "function") lines.push(...opts.extraMetrics(api));
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
