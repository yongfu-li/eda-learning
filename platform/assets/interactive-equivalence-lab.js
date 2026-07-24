/**
 * Interactive equivalence lab — CEC/SEC literacy, Check challenges.
 */
import {
  SPEC,
  IMPL_GOOD,
  IMPL_BAD,
  SEQ_SPEC,
  SEQ_GOOD,
  SEQ_BAD,
  GOLDENS,
  CIRCUIT_LAYOUTS,
  evaluateCircuit,
  buildMiter,
  truthTableCec,
  findCounterexample,
  structuralHashStats,
  fraigLite,
  encodeSatCnfLite,
  satSatisfiable,
  dontCareMask,
  sequentialUnroll,
  sequentialCecLite,
  allAssignments,
  drawEquivalence,
  hitNode,
} from "./equivalence-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

const CIRCUITS = {
  spec: SPEC,
  good: IMPL_GOOD,
  bad: IMPL_BAD,
  seqSpec: SEQ_SPEC,
  seqGood: SEQ_GOOD,
  seqBad: SEQ_BAD,
};

export function createInteractiveEquivalenceLab(root, opts = {}) {
  let view = opts.defaultView || "spec"; // spec | good | bad | miter-good | miter-bad
  let assignment = { a: 1, b: 1, c: 0 };
  let selected = "g1";
  let mode = null;
  let lastCec = null;
  let lastCnf = null;
  let lastSeq = null;
  let dontCare = { a: -1, b: -1, c: -1 };

  function activeCircuit() {
    if (view === "miter-good") return buildMiter(SPEC, IMPL_GOOD);
    if (view === "miter-bad") return buildMiter(SPEC, IMPL_BAD);
    if (view === "seqSpec") return SEQ_SPEC;
    if (view === "seqGood") return SEQ_GOOD;
    if (view === "seqBad") return SEQ_BAD;
    if (view === "good") return IMPL_GOOD;
    if (view === "bad") return IMPL_BAD;
    return SPEC;
  }

  function layoutHint() {
    if (view.startsWith("miter")) return "miter";
    if (view === "good") return "good";
    if (view === "bad") return "bad";
    return "spec";
  }

  const api = {
    getView: () => view,
    setView: (v) => {
      view = v;
    },
    getAssignment: () => ({ ...assignment }),
    setAssignment: (a) => {
      assignment = { ...assignment, ...a };
    },
    getSelected: () => selected,
    setSelected: (id) => {
      selected = id;
    },
    getMode: () => mode,
    getCircuit: () => activeCircuit(),
    eval: () => evaluateCircuit(activeCircuit(), assignment),
    evalSpec: () => evaluateCircuit(SPEC, assignment),
    evalGood: () => evaluateCircuit(IMPL_GOOD, assignment),
    evalBad: () => evaluateCircuit(IMPL_BAD, assignment),
    cecGood: () => truthTableCec(SPEC, IMPL_GOOD),
    cecBad: () => truthTableCec(SPEC, IMPL_BAD),
    findCex: () => findCounterexample(SPEC, IMPL_BAD),
    miterGood: () => buildMiter(SPEC, IMPL_GOOD),
    miterBad: () => buildMiter(SPEC, IMPL_BAD),
    miterOut: () => evaluateCircuit(buildMiter(SPEC, view.includes("bad") ? IMPL_BAD : IMPL_GOOD), assignment),
    hashSpec: () => structuralHashStats(SPEC),
    fraigGood: () => fraigLite(IMPL_GOOD),
    cnfSpec: () => encodeSatCnfLite(SPEC),
    cnfMiterAssertOne: () => encodeSatCnfLite(buildMiter(SPEC, IMPL_BAD), 1),
    satMiterDiff: () => {
      const cnf = encodeSatCnfLite(buildMiter(SPEC, IMPL_BAD), 1);
      lastCnf = cnf;
      mode = "sat";
      return satSatisfiable(cnf);
    },
    dontCareCheck: (mask) => {
      const m = mask || dontCare;
      lastCec = dontCareMask(SPEC, IMPL_BAD, m);
      mode = "dont-care";
      return lastCec;
    },
    setDontCare: (m) => {
      dontCare = { ...dontCare, ...m };
    },
    getDontCare: () => ({ ...dontCare }),
    unroll: (steps = 2) => sequentialUnroll(SEQ_SPEC, steps),
    seqCecGood: () => {
      lastSeq = sequentialCecLite(SEQ_SPEC, SEQ_GOOD, 2);
      mode = "seq-good";
      return lastSeq;
    },
    seqCecBad: () => {
      lastSeq = sequentialCecLite(SEQ_SPEC, SEQ_BAD, 2);
      mode = "seq-bad";
      return lastSeq;
    },
    getLastCec: () => lastCec,
    getLastCnf: () => lastCnf,
    getLastSeq: () => lastSeq,
    showSpec: () => {
      view = "spec";
      mode = "spec";
    },
    showGood: () => {
      view = "good";
      mode = "good";
    },
    showBad: () => {
      view = "bad";
      mode = "bad";
    },
    showMiterGood: () => {
      view = "miter-good";
      mode = "miter-good";
    },
    showMiterBad: () => {
      view = "miter-bad";
      mode = "miter-bad";
    },
    runCecGood: () => {
      lastCec = truthTableCec(SPEC, IMPL_GOOD);
      mode = "cec-good";
      return lastCec;
    },
    runCecBad: () => {
      lastCec = truthTableCec(SPEC, IMPL_BAD);
      mode = "cec-bad";
      return lastCec;
    },
    allAssignments: () => allAssignments(),
  };

  function togglePi(name) {
    assignment = { ...assignment, [name]: assignment[name] ? 0 : 1 };
  }

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Toggle PIs, switch spec/impl/miter, run CEC, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> toy CEC. Spec <code>f=(a∧b)∨c</code>,
      good De Morgan rewrite, bad <code>(a∧b)∧c</code>. Counterexample <code>a=1,b=1,c=0</code>.</p>`,
    loadStarter() {
      view = opts.defaultView || "spec";
      assignment = { a: 1, b: 1, c: 0 };
      selected = "g1";
      mode = null;
      lastCec = null;
      lastCnf = null;
      lastSeq = null;
      dontCare = { a: -1, b: -1, c: -1 };
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        view = opts.defaultView || "spec";
        assignment = { a: 1, b: 1, c: 0 };
        selected = "g1";
        mode = null;
        lastCec = null;
        lastCnf = null;
        lastSeq = null;
        dontCare = { a: -1, b: -1, c: -1 };
        if (typeof ch.setup === "function") ch.setup(ctx, api);
      },
      check: (ctx) => (typeof ch.check === "function" ? !!ch.check(ctx, api) : false),
    })),
    extraActions(ctx) {
      const btns = [];
      for (const name of ["a", "b", "c"]) {
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
      const views = [
        ["Spec", () => api.showSpec()],
        ["Good", () => api.showGood()],
        ["Bad", () => api.showBad()],
        ["Miter good", () => api.showMiterGood()],
        ["Miter bad", () => api.showMiterBad()],
        ["CEC good", () => api.runCecGood()],
        ["CEC bad", () => api.runCecBad()],
        ["SAT miter≠0", () => api.satMiterDiff()],
        ["SEC good", () => api.seqCecGood()],
        ["SEC bad", () => api.seqCecBad()],
      ];
      for (const [label, fn] of views) {
        btns.push(
          el("button", {
            className: "btn btn-secondary",
            type: "button",
            text: label,
            onClick: () => {
              fn();
              ctx.rerender();
            },
          })
        );
      }
      return btns;
    },
    renderWorkspace(ctx) {
      const circuit = activeCircuit();
      const layout = CIRCUIT_LAYOUTS[layoutHint()] || CIRCUIT_LAYOUTS.spec;
      const f = evaluateCircuit(circuit, assignment);
      drawEquivalence(ctx.canvas, {
        circuit,
        layout,
        assignment,
        selected,
        highlight: selected ? [selected] : [],
        layoutHint: layoutHint(),
        metricText: `view=${view}  f/miter=${f}  mode=${mode || "—"}`,
      });
      ctx.canvas.onclick = (ev) => {
        const hit = hitNode(layout, ctx.canvas, ev.clientX, ev.clientY);
        if (hit) {
          selected = hit;
          ctx.rerender();
        }
      };
      const lines = [
        `view: ${view} · selected: ${selected}`,
        `assignment: a=${assignment.a} b=${assignment.b} c=${assignment.c}`,
        `eval(current)=${f}  spec=${api.evalSpec()} good=${api.evalGood()} bad=${api.evalBad()}`,
        `GOLDENS: rows=${GOLDENS.truthRows} cex=a1b1c0`,
      ];
      if (lastCec) {
        lines.push(
          `CEC: equiv=${lastCec.equivalent} rows=${lastCec.rowsChecked} cex=${JSON.stringify(lastCec.counterexample)}`
        );
      }
      if (lastCnf) lines.push(`CNF: vars=${lastCnf.numVars} clauses=${lastCnf.numClauses}`);
      if (lastSeq) lines.push(`SEC: equiv=${lastSeq.equivalent} steps=${lastSeq.steps}`);
      if (typeof opts.extraMetrics === "function") lines.push(...opts.extraMetrics(api));
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS, CIRCUITS };
