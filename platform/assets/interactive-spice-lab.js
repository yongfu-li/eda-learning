/**
 * Interactive SPICE-lite lab — MNA / NR / TRAN / Check challenges.
 */
import {
  STARTER,
  GOLDENS,
  cloneNet,
  netlistStats,
  buildMnaLinearDc,
  dcLinearSolve,
  sparseLuLite,
  newtonRaphsonDc,
  deviceCallbackDiode,
  diodeLoopNewton,
  transientBe,
  spiceEngine,
  drawSpice,
} from "./spice-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveSpiceLab(root, opts = {}) {
  let net = cloneNet(opts.initialNet || STARTER);
  let mode = null;
  let volts = null;
  let history = null;
  let last = null;
  let highlight = [];

  const api = {
    getNet: () => net,
    getStats: () => netlistStats(net),
    getVolts: () => volts,
    getHistory: () => history,
    getLast: () => last,
    getMode: () => mode,
    getGoldens: () => GOLDENS,
    reset: () => {
      net = cloneNet(STARTER);
      mode = null;
      volts = null;
      history = null;
      last = null;
      highlight = [];
    },
    showNetlist: () => {
      last = netlistStats(net);
      mode = "netlist";
      highlight = net.elements.map((e) => e.id);
      return last;
    },
    stampMna: () => {
      last = buildMnaLinearDc(net);
      mode = "mna";
      highlight = ["Vin", "R1", "R2"];
      return last;
    },
    dcSolve: () => {
      last = dcLinearSolve(net);
      volts = last.volts;
      mode = "dc";
      highlight = ["R1", "R2", "Vin"];
      return last;
    },
    sparseLu: () => {
      const m = buildMnaLinearDc(net);
      last = sparseLuLite(m.G);
      mode = "lu";
      return last;
    },
    newton: () => {
      last = newtonRaphsonDc(net, false);
      volts = last.volts;
      mode = "nr";
      return last;
    },
    diodeCb: () => {
      last = { cb: deviceCallbackDiode(0), loop: diodeLoopNewton() };
      mode = "diode";
      highlight = ["Dprot"];
      return last;
    },
    transient: () => {
      last = transientBe(net, GOLDENS.tranDt, GOLDENS.tranSteps, 0);
      history = last.history;
      volts = history.at(-1)?.volts || null;
      mode = "tran";
      highlight = ["Cload", "R1", "R2"];
      return last;
    },
    pipeline: () => {
      const dc = dcLinearSolve(net);
      const tr = transientBe(net, GOLDENS.tranDt, GOLDENS.tranSteps, 0);
      last = { dc, tr };
      volts = dc.volts;
      history = tr.history;
      mode = "pipeline";
      return last;
    },
    engine: () => {
      last = spiceEngine(net);
      volts = { "1": GOLDENS.v1Dc, "2": last.dcV2, "0": 0 };
      history = transientBe(net).history;
      mode = "engine";
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Run DC / NR / TRAN / Engine, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> Vin=5, R1=2, R2=3 → V2=3. GOLDEN DC V2=${GOLDENS.v2Dc}.</p>`,
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
        el("button", { className: "btn btn-secondary", type: "button", text: "Netlist", onClick: () => { api.showNetlist(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Stamp MNA", onClick: () => { api.stampMna(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "DC solve", onClick: () => { api.dcSolve(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Sparse LU", onClick: () => { api.sparseLu(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Newton", onClick: () => { api.newton(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Diode NR", onClick: () => { api.diodeCb(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "TRAN BE", onClick: () => { api.transient(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "OP→TRAN", onClick: () => { api.pipeline(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Engine", onClick: () => { api.engine(); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "Reset", onClick: () => { api.reset(); ctx.rerender(); } }),
      ];
    },
    renderWorkspace(ctx) {
      const st = api.getStats();
      drawSpice(ctx.canvas, {
        net,
        volts,
        history,
        highlight,
        metricText: `elems=${st.elementCount} mode=${mode || "—"}`,
      });
      const lines = [
        `elements: ${st.elementCount} · unknowns: ${st.unknownNodes}`,
        `mode: ${mode || "—"}`,
        `GOLDENS: V2_dc=${GOLDENS.v2Dc} · MNA=${GOLDENS.mnaSize} · TRAN≈${GOLDENS.tranFinalV2}`,
      ];
      if (volts) lines.push(`volts: n1=${volts["1"]?.toFixed?.(4) ?? volts["1"]} n2=${volts["2"]?.toFixed?.(4) ?? volts["2"]}`);
      if (last?.size != null) lines.push(`MNA size=${last.size}`);
      if (last?.nnz != null) lines.push(`nnz=${last.nnz}`);
      if (last?.iters != null) lines.push(`iters=${last.iters} conv=${last.converged}`);
      if (last?.finalV2 != null) lines.push(`tran final v2=${last.finalV2.toFixed(6)}`);
      if (last?.dcV2 != null) lines.push(`engine dcV2=${last.dcV2} ok=${last.ok}`);
      if (last?.loop) lines.push(`diode NR conv=${last.loop.converged} iters=${last.loop.iters}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
