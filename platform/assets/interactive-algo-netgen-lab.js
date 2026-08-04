/**
 * Interactive Part C Netgen algo lab.
 */
import {
  ALGO_GOLDENS,
  PARTC_REAL,
  algoHashDevices,
  algoMatchNets,
  algoPermutePins,
  netgenAlgoEngine,
  partcBind,
  drawAlgoNetgen,
  hitTestAlgoNetgen,
} from "./algo-netgen-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveAlgoNetgenLab(root, opts = {}) {
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = new Set();

  const api = {
    getMode: () => mode,
    getLast: () => last,
    getSelected: () => [...selected],
    getHighlight: () => highlight,
    getGoldens: () => ALGO_GOLDENS,
    reset: () => {
      mode = null;
      last = null;
      highlight = [];
      selected = new Set();
    },
    select: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showHashDevices: () => {
      last = algoHashDevices();
      mode = "hash_devices";
      highlight = last.highlight;
      return last;
    },
    showMatchNets: () => {
      last = algoMatchNets();
      mode = "match_nets";
      highlight = last.highlight || last.nets;
      return last;
    },
    showPermutePins: () => {
      last = algoPermutePins();
      mode = "permute_pins";
      highlight = last.highlight;
      return last;
    },
    showEngine: () => {
      last = netgenAlgoEngine();
      mode = "engine";
      highlight = ["mn1", "mp1", "X0", "X1"];
      return last;
    },
    showBind: (stage) => {
      last = partcBind(stage);
      mode = `bind_${stage}`;
      highlight = ["bind"];
      return last;
    },
  };

  const applyDefault = () => {
    const m = opts.defaultMode;
    if (m === "hash_devices") api.showHashDevices();
    else if (m === "match_nets") api.showMatchNets();
    else if (m === "permute_pins") api.showPermutePins();
    else if (m === "engine") api.showEngine();
  };
  applyDefault();

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml: "Pick a challenge and <strong>Start</strong>. Run algo stages / bind, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Part C:</strong> matched=${ALGO_GOLDENS.matchedDevices}/${ALGO_GOLDENS.matchedNets}, mism=${ALGO_GOLDENS.mismatchCount}.</p>`,
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
        el("button", { className: "btn btn-secondary", type: "button", text: label, onClick: () => { fn(); ctx.rerender(); } });
      return [
        mk("Hash", () => api.showHashDevices()),
        mk("Match", () => api.showMatchNets()),
        mk("Permute", () => api.showPermutePins()),
        mk("Bind", () => api.showBind("mismatch")),
        mk("Engine", () => api.showEngine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      drawAlgoNetgen(ctx.canvas, {
        highlight,
        selected: [...selected],
        stageLabel: mode || "Netgen algo",
        metricText: last?.ok != null ? `ok=${last.ok}` : `mode=${mode}`,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestAlgoNetgen(ctx.canvas, highlight, ev.clientX, ev.clientY);
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `GOLDEN: dev=${ALGO_GOLDENS.matchedDevices} nets=${ALGO_GOLDENS.matchedNets} mism=${ALGO_GOLDENS.mismatchCount}`,
        `REAL: dev=${PARTC_REAL.matchedDevices} nets=${PARTC_REAL.matchedNets}`,
      ];
      if (last?.note) lines.push(last.note);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
