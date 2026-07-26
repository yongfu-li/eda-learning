/** Walkthrough packs for learn_spice (kind: spice). */
import {
  STARTER,
  GOLDENS,
  cloneNet,
  netlistStats,
  buildMnaLinearDc,
  dcLinearSolve,
  sparseLuLite,
  newtonRaphsonDc,
  diodeLoopNewton,
  transientBe,
  spiceEngine,
} from "../../assets/spice-core.js";

function step(id, title, caption, bullets, metrics, extra = {}) {
  return {
    id,
    title,
    caption,
    bullets,
    metrics,
    net: cloneNet(STARTER),
    ...extra,
  };
}

export const SPICE_ALGOS = {
  "netlist-nodes": {
    title: "Netlist nodes",
    module: "module01-01-netlist-nodes",
    kind: "spice",
    steps: [
      step("nl", "Netlist", "Toy netlist with five elements.", ["JSON"], [`n=${GOLDENS.elementCount}`], { highlight: ["Vin", "R1", "R2", "Cload", "Dprot"], metricText: "5 elements" }),
      step("gnd", "Ground", "Node 0 is ground reference.", ["gnd"], ["0"], { metricText: "ground=0" }),
      step("un", "Unknowns", "Unknown voltages: nodes 1 and 2.", ["MNA"], [`${GOLDENS.unknownNodes}`], { metricText: "unknowns=2" }),
      step("el", "Elements", "V, R, R, C, D types.", ["types"], ["V/R/C/D"], { highlight: ["Vin", "R1"], metricText: "types" }),
      step("cnt", "Count", "GOLDEN element_count=5.", ["GOLDEN"], ["5"], { metricText: JSON.stringify(netlistStats()) }),
    ],
  },
  "mna-stamps": {
    title: "MNA stamps",
    module: "module01-03-mna-stamps",
    kind: "spice",
    steps: [
      step("r", "Stamp R", "Conductance 1/R into G.", ["stamp"], ["1/R"], { highlight: ["R1", "R2"] }),
      step("v", "Stamp V", "Voltage source adds branch current unknown.", ["branch"], ["i_Vin"], { highlight: ["Vin"] }),
      step("g", "Matrix G", "Build dense G for the toy.", ["G"], ["3×3"], (() => {
        const m = buildMnaLinearDc();
        return { metricText: `size=${m.size}` };
      })()),
      step("b", "RHS b", "RHS holds source values.", ["b"], ["Vin.dc"], { metricText: "b[Vin]=5" }),
      step("sz", "Size 3", "GOLDEN MNA size=3.", ["GOLDEN"], [`${GOLDENS.mnaSize}`], (() => {
        const m = buildMnaLinearDc();
        return { metricText: `size=${m.size}` };
      })()),
    ],
  },
  "dc-linear": {
    title: "DC linear",
    module: "module02-01-dc-linear",
    kind: "spice",
    steps: [
      step("build", "Build", "Stamp linear R+V system.", ["build"], ["MNA"], { highlight: ["Vin", "R1", "R2"] }),
      step("solve", "Solve", "Dense solve Gx=b.", ["solve"], ["x"], (() => {
        const r = dcLinearSolve();
        return { volts: r.volts, metricText: "solved" };
      })()),
      step("v1", "V1=5", "Node 1 fixed by Vin.", ["V1"], ["5"], (() => {
        const r = dcLinearSolve();
        return { volts: r.volts, metricText: `v1=${r.volts["1"]}` };
      })()),
      step("v2", "V2=3", "Divider 5·3/(2+3)=3.", ["V2"], ["3"], (() => {
        const r = dcLinearSolve();
        return { volts: r.volts, metricText: `v2=${r.volts["2"]}` };
      })()),
      step("g", "Golden", "GOLDEN v2_dc=3.", ["GOLDEN"], ["3"], (() => {
        const r = dcLinearSolve();
        return { volts: r.volts, metricText: "GOLDEN 3" };
      })()),
    ],
  },
  "sparse-lu": {
    title: "Sparse LU",
    module: "module02-03-sparse-lu",
    kind: "spice",
    steps: [
      step("nnz", "NNZ", "Count nonzeros in G.", ["nnz"], [`${GOLDENS.nnz}`], (() => {
        const lu = sparseLuLite(buildMnaLinearDc().G);
        return { metricText: `nnz=${lu.nnz}` };
      })()),
      step("l", "Factor L", "Lower triangular factor.", ["L"], ["unit diag"], {}),
      step("u", "Factor U", "Upper triangular factor.", ["U"], ["pivots"], {}),
      step("fb", "Fwd/back idea", "Solve Ly=b then Ux=y.", ["solve"], ["2 sweeps"], {}),
      step("n6", "NNZ 6", "GOLDEN nnz=6 on toy G.", ["GOLDEN"], ["6"], (() => {
        const lu = sparseLuLite(buildMnaLinearDc().G);
        return { metricText: `nnz=${lu.nnz}` };
      })()),
    ],
  },
  "newton-raphson": {
    title: "Newton–Raphson",
    module: "module03-01-newton-raphson",
    kind: "spice",
    steps: [
      step("guess", "Guess", "Start from linear OP.", ["x0"], ["linear"], (() => {
        const r = dcLinearSolve();
        return { volts: r.volts, metricText: "guess" };
      })()),
      step("jac", "Jacobian", "Restamp G each iteration.", ["J"], ["G(x)"], {}),
      step("upd", "Update", "Solve and update x.", ["dx"], ["x←x+dx"], {}),
      step("res", "Residual", "Stop when |dx| small.", ["tol"], ["1e-9"], {}),
      step("conv", "Converged", "GOLDEN: 1 iter, v2=3.", ["GOLDEN"], ["1"], (() => {
        const r = newtonRaphsonDc(STARTER, false);
        return { volts: r.volts, metricText: `iters=${r.iters}` };
      })()),
    ],
  },
  "device-callbacks": {
    title: "Device callbacks",
    module: "module03-03-device-callbacks",
    kind: "spice",
    steps: [
      step("i", "i(v)", "Diode current Is(exp(v/Vt)-1).", ["i"], ["exp"], { highlight: ["Dprot"] }),
      step("g", "g=di/dv", "Conductance for Jacobian.", ["g"], ["Is/Vt·exp"], { highlight: ["Dprot"] }),
      step("loop", "1-D loop", "Series R+diode Newton.", ["1-D"], ["NR"], {}),
      step("cv", "Converge", "diode_loop_newton converges.", ["ok"], ["true"], (() => {
        const r = diodeLoopNewton();
        return { metricText: `conv=${r.converged} iters=${r.iters}` };
      })()),
      step("hook", "Hook", "Callbacks plug into MNA stamps.", ["API"], ["i,g"], { highlight: ["Dprot"], metricText: "callbacks" }),
    ],
  },
  "transient-be": {
    title: "Transient BE",
    module: "module04-01-transient-be",
    kind: "spice",
    steps: [
      step("comp", "Companion", "C → G=C/dt + history current.", ["BE"], ["C/dt"], { highlight: ["Cload"] }),
      step("dt", "dt", "dt=0.5 on the toy.", ["dt"], ["0.5"], { metricText: "dt=0.5" }),
      step("s1", "Step 1", "First BE step from v2=0.", ["step"], ["t=0.5"], (() => {
        const tr = transientBe();
        return { history: tr.history.slice(0, 1), volts: tr.history[0].volts, metricText: `v2=${tr.history[0].v2.toFixed(3)}` };
      })()),
      step("wav", "Waveform", "Four steps toward DC.", ["wave"], ["4"], (() => {
        const tr = transientBe();
        return { history: tr.history, metricText: "waveform" };
      })()),
      step("fin", "Final", "GOLDEN final≈2.255.", ["GOLDEN"], ["2.255"], (() => {
        const tr = transientBe();
        return { history: tr.history, volts: tr.history.at(-1).volts, metricText: `final=${tr.finalV2.toFixed(6)}` };
      })()),
    ],
  },
  "op-tran-pipeline": {
    title: "OP→TRAN pipeline",
    module: "module04-03-op-tran-pipeline",
    kind: "spice",
    steps: [
      step("op", "OP", "Compute DC operating point.", ["OP"], ["V2=3"], (() => {
        const r = dcLinearSolve();
        return { volts: r.volts, metricText: "OP" };
      })()),
      step("init", "Init C", "Start capacitor from 0 for TRAN demo.", ["init"], ["0"], { highlight: ["Cload"] }),
      step("loop", "Step loop", "Repeat BE steps.", ["loop"], ["4"], (() => {
        const tr = transientBe();
        return { history: tr.history, metricText: "steps" };
      })()),
      step("pipe", "Pipeline", "OP then TRAN is the classic flow.", ["flow"], ["OP→TRAN"], {}),
      step("rep", "Report", "Report DC and TRAN endpoints.", ["report"], ["metrics"], (() => {
        const r = dcLinearSolve();
        const tr = transientBe();
        return { volts: r.volts, history: tr.history, metricText: `dc=${r.volts["2"]} tran=${tr.finalV2.toFixed(3)}` };
      })()),
    ],
  },
  "spice-engine": {
    title: "SPICE engine",
    module: "module05-01-spice-engine",
    kind: "spice",
    steps: [
      step("dc", "DC", "Linear DC V2=3.", ["DC"], ["3"], (() => {
        const e = spiceEngine();
        return { volts: { "1": 5, "2": e.dcV2, "0": 0 }, metricText: `dc=${e.dcV2}` };
      })()),
      step("nr", "NR", "NR converges in 1 iter.", ["NR"], ["1"], {}),
      step("tr", "TRAN", "BE transient runs.", ["TRAN"], ["4 steps"], (() => {
        const tr = transientBe();
        return { history: tr.history, metricText: "TRAN" };
      })()),
      step("d", "Diode NR", "1-D diode Newton ok.", ["diode"], ["ok"], (() => {
        const e = spiceEngine();
        return { metricText: `diode=${e.diode.converged}` };
      })()),
      step("ok", "OK", "GOLDEN engine ok.", ["GOLDEN"], ["ok"], (() => {
        const e = spiceEngine();
        return { volts: { "1": 5, "2": e.dcV2, "0": 0 }, history: transientBe().history, metricText: `ok=${e.ok}` };
      })()),
    ],
  },
};
