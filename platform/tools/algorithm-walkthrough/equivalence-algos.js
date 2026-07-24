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
  sequentialUnroll,
  sequentialCecLite,
} from "../../assets/equivalence-core.js";

function step(id, title, caption, bullets, metrics, _positions, extra = {}) {
  return {
    id,
    title,
    caption,
    bullets,
    metrics,
    circuit: SPEC,
    layout: CIRCUIT_LAYOUTS.spec,
    layoutHint: "spec",
    ...extra,
  };
}

export const EQUIVALENCE_ALGOS = {
  "spec-impl": {
    title: "Spec vs impl",
    module: "module01-01-spec-impl",
    kind: "equivalence",
    steps: [
      step("spec", "Spec netlist", "Spec computes f = (a∧b)∨c with two gates.", ["AND then OR"], [`gates=${GOLDENS.specGateCount}`], null, { highlight: ["g1", "g2"] }),
      step("good", "Good rewrite", "Impl good is a De Morgan form of the same function.", ["NOT/AND/NOT"], [`gates=${GOLDENS.goodGateCount}`], null, { circuit: IMPL_GOOD, layout: CIRCUIT_LAYOUTS.good, layoutHint: "good" }),
      step("bad", "Bad rewrite", "Impl bad uses (a∧b)∧c — wrong when c=0.", ["AND AND"], [`gates=${GOLDENS.badGateCount}`], null, { circuit: IMPL_BAD, layout: CIRCUIT_LAYOUTS.bad, layoutHint: "bad" }),
      step("eval", "Eval at cex", "At a=1,b=1,c=0: spec=1, good=1, bad=0.", ["Simulate"], ["cex"], null, {
        assignment: { a: 1, b: 1, c: 0 },
        metricText: `spec=${evaluateCircuit(SPEC, { a: 1, b: 1, c: 0 })} bad=${evaluateCircuit(IMPL_BAD, { a: 1, b: 1, c: 0 })}`,
      }),
      step("goal", "CEC goal", "Prove good ≡ spec; find a witness that bad ≢ spec.", ["Prove / disprove"], ["8 rows"], null),
    ],
  },
  "miter-build": {
    title: "Miter",
    module: "module01-03-miter-build",
    kind: "equivalence",
    steps: [
      step("idea", "XOR outputs", "A miter XORs the two POs under shared PIs.", ["miter_out"], ["diff detect"], null),
      step("build", "Build good miter", "Prefix impl gates, XOR spec g2 with i_g5.", ["build_miter"], ["shared PIs"], null, (() => {
        const m = buildMiter(SPEC, IMPL_GOOD);
        return { circuit: m, layout: CIRCUIT_LAYOUTS.miter, layoutHint: "miter", highlight: ["miter_xor"] };
      })()),
      step("zero", "Good → all zero", "For the good pair, miter output is 0 on every input.", ["equiv"], ["8 zeros"], null, (() => {
        const m = buildMiter(SPEC, IMPL_GOOD);
        return { circuit: m, layout: CIRCUIT_LAYOUTS.miter, layoutHint: "miter", assignment: { a: 1, b: 1, c: 0 }, metricText: `miter=${evaluateCircuit(m, { a: 1, b: 1, c: 0 })}` };
      })()),
      step("one", "Bad → one", "At the cex, bad miter outputs 1.", ["diff"], ["a1b1c0"], null, (() => {
        const m = buildMiter(SPEC, IMPL_BAD);
        return { circuit: m, layout: CIRCUIT_LAYOUTS.miter, layoutHint: "miter", assignment: GOLDENS.cex, metricText: `miter=${evaluateCircuit(m, GOLDENS.cex)}`, highlight: ["miter_xor"] };
      })()),
      step("use", "Why miters", "SAT/BDD CEC asks whether miter_out can be 1.", ["UNSAT ⇒ equiv"], ["Next TT"], null),
    ],
  },
  "truth-table-cec": {
    title: "Truth-table CEC",
    module: "module02-01-truth-table-cec",
    kind: "equivalence",
    steps: [
      step("eight", "Eight rows", "Three PIs → 8 assignments to exhaust.", ["2^n"], [`rows=${GOLDENS.truthRows}`], null),
      step("good", "Good passes", "truth_table_cec(spec, good) → equivalent true.", ["pass"], ["8 checked"], null, {
        metricText: JSON.stringify(truthTableCec(SPEC, IMPL_GOOD)),
      }),
      step("bad", "Bad fails", "Bad fails; first mismatch is the counterexample.", ["fail"], ["cex"], null, {
        metricText: JSON.stringify(truthTableCec(SPEC, IMPL_BAD)),
      }),
      step("cex", "Cex a1b1c0", "GOLDEN counterexample a=1, b=1, c=0.", ["witness"], ["spec1 bad0"], null, {
        assignment: GOLDENS.cex,
        highlight: ["g2"],
        metricText: `cex ${JSON.stringify(GOLDENS.cex)}`,
      }),
      step("scale", "Scales poorly", "Exhaustive CEC is literacy; real tools use SAT/BDD.", ["toy only"], ["Next hash"], null),
    ],
  },
  "structural-hash": {
    title: "Structural hash",
    module: "module02-03-structural-hash",
    kind: "equivalence",
    steps: [
      step("idea", "Hash signatures", "FRAIG-lite hashes each gate by (op, sorted child hashes).", ["structural"], ["not functional"], null),
      step("spec", "Spec hashes", "Spec has 2 gates → 2 unique hashes on the toy.", ["unique"], [`n=${structuralHashStats(SPEC).uniqueHashes}`], null, {
        metricText: JSON.stringify(structuralHashStats(SPEC)),
        highlight: ["g1", "g2"],
      }),
      step("good", "Good fraig", "Good rewrite has more gates; fraig_nodes = unique hashes.", ["fraig"], [`nodes=${fraigLite(IMPL_GOOD).fraigNodes}`], null, {
        circuit: IMPL_GOOD,
        layout: CIRCUIT_LAYOUTS.good,
        layoutHint: "good",
        metricText: `fraig ${fraigLite(IMPL_GOOD).fraigNodes}`,
      }),
      step("limit", "Not enough alone", "Different structures can still be functionally equal.", ["need SAT/TT"], ["literacy"], null),
      step("use", "Cleanup first", "Structural hashing cleans duplicates before CEC.", ["strash/FRAIG"], ["Next SAT"], null),
    ],
  },
  "sat-cnf-lite": {
    title: "SAT CNF",
    module: "module02-05-sat-cnf-lite",
    kind: "equivalence",
    steps: [
      step("tseitin", "Tseitin encode", "Each gate becomes a few CNF clauses (Tseitin).", ["encode"], ["vars+clauses"], null),
      step("spec", "Spec CNF", "encode_sat_cnf_lite(spec) yields positive clause count.", ["clauses"], [`n=${encodeSatCnfLite(SPEC).numClauses}`], null, {
        metricText: `clauses=${encodeSatCnfLite(SPEC).numClauses}`,
      }),
      step("assert", "Assert miter=1", "Ask SAT: can bad miter output be 1?", ["SAT query"], ["diff?"], null, (() => {
        const m = buildMiter(SPEC, IMPL_BAD);
        const cnf = encodeSatCnfLite(m, 1);
        return { circuit: m, layout: CIRCUIT_LAYOUTS.miter, layoutHint: "miter", metricText: `clauses=${cnf.numClauses}` };
      })()),
      step("sat", "SAT finds diff", "Tiny DPLL finds the bad miter satisfiable → not equivalent.", ["SAT"], ["cex exists"], null),
      step("unsat", "UNSAT means equiv", "If miter=1 is UNSAT, circuits are equivalent.", ["proof"], ["gold standard"], null),
    ],
  },
  counterexample: {
    title: "Counterexample",
    module: "module02-07-counterexample",
    kind: "equivalence",
    steps: [
      step("find", "Find cex", "find_counterexample(spec, bad) returns a=1,b=1,c=0.", ["witness"], ["GOLDEN"], null, {
        assignment: GOLDENS.cex,
        metricText: JSON.stringify(findCounterexample(SPEC, IMPL_BAD)),
      }),
      step("sim", "Simulate both", "At the cex, spec=1 and bad=0 — clear mismatch.", ["debug"], ["wave"], null, {
        assignment: GOLDENS.cex,
        metricText: `spec=${evaluateCircuit(SPEC, GOLDENS.cex)} bad=${evaluateCircuit(IMPL_BAD, GOLDENS.cex)}`,
      }),
      step("miter", "Miter lights", "Bad miter at cex outputs 1.", ["XOR=1"], ["diff"], null, (() => {
        const m = buildMiter(SPEC, IMPL_BAD);
        return { circuit: m, layout: CIRCUIT_LAYOUTS.miter, layoutHint: "miter", assignment: GOLDENS.cex, metricText: `miter=${evaluateCircuit(m, GOLDENS.cex)}` };
      })()),
      step("fix", "Fix the bug", "Change bad AND to OR with c (or use good rewrite).", ["root cause"], ["impl"], null),
      step("recheck", "Recheck CEC", "After fix, truth-table CEC should pass.", ["regress"], ["Next DC"], null),
    ],
  },
  "dont-care": {
    title: "Don't-care",
    module: "module03-01-dont-care",
    kind: "equivalence",
    steps: [
      step("mask", "Care mask", "Don't-cares mark PIs as X (−1) or fixed 0/1.", ["X bits"], ["care set"], null),
      step("fix-c", "Fix c=0", "Mask with c fixed to 0 still catches the bad cex.", ["partial"], ["still fail"], null, {
        metricText: JSON.stringify(truthTableCec(SPEC, IMPL_BAD, { a: -1, b: -1, c: 0 })),
        assignment: { a: 1, b: 1, c: 0 },
      }),
      step("fewer", "Fewer rows", "Fixed bits shrink the checked assignment set.", ["rows_checked"], ["<8"], null),
      step("x-ok", "X means ignore", "X on a bit means both 0/1 are allowed for that PI.", ["don't care"], ["spec care"], null),
      step("use", "Real DC", "Synthesis don't-cares feed CEC care sets in industrial flows.", ["ODC/SDC"], ["Next SEC"], null),
    ],
  },
  "sequential-unroll": {
    title: "Unroll",
    module: "module03-03-sequential-unroll",
    kind: "equivalence",
    steps: [
      step("ff", "Flip-flop", "Sequential toy: state q, next_q = a XOR q, output y=q.", ["FF"], ["init 0"], null, {
        circuit: SEQ_SPEC,
        layoutHint: "spec",
        highlight: ["d_q", "y"],
      }),
      step("steps", "Unroll k", "Unrolling k steps builds a combo circuit over time frames.", ["frames"], [`k=${GOLDENS.seqSteps}`], null),
      step("pis", "Frame PIs", "Unroll adds a_0, a_1, … and q_0 as inputs.", ["time"], ["frames"], null, {
        metricText: `unroll pis=${sequentialUnroll(SEQ_SPEC, 2).pis.length}`,
      }),
      step("gates", "Copied gates", "Each frame copies the combo cone.", ["gates_t"], ["BUF next"], null),
      step("why", "Why unroll", "Bounded SEC compares unrolled behaviors for k cycles.", ["BMC-ish"], ["Next SEC"], null),
    ],
  },
  "sequential-cec": {
    title: "Sequential CEC",
    module: "module03-05-sequential-cec",
    kind: "equivalence",
    steps: [
      step("good", "Good SEC", "XOR impl matches OR-of-ANDs for 2 steps.", ["equiv"], ["pass"], null, {
        metricText: JSON.stringify(sequentialCecLite(SEQ_SPEC, SEQ_GOOD, 2)),
      }),
      step("bad", "Bad SEC", "NOT-q impl ignores a and fails within 2 steps.", ["fail"], ["cex"], null, {
        metricText: JSON.stringify(sequentialCecLite(SEQ_SPEC, SEQ_BAD, 2)),
      }),
      step("bound", "Bounded only", "This is bounded SEC — not full infinite-horizon proof.", ["literacy"], ["k=2"], null),
      step("init", "Same init", "Both start from q=0.", ["reset"], ["fair"], null),
      step("done", "Done", "Next: offline compare, then wrap toward formal / STA.", ["learn_formal"], ["Wrap"], null),
    ],
  },
};
