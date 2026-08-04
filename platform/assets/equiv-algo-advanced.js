/**
 * Advanced CEC / SEC engines for the equivalence benchmark.
 */
import {
  GOLDENS,
  IMPL_BAD,
  IMPL_GOOD,
  SEQ_BAD,
  SEQ_GOOD,
  SEQ_SPEC,
  SPEC,
  allAssignments,
  buildMiter,
  dontCareMask,
  encodeSatCnfLite,
  evaluateCircuit,
  fraigLite,
  satSatisfiable,
  sequentialCecLite,
  structuralHashStats,
  truthTableCec,
} from "./equivalence-core.js";

export function cloneCircuit(c) {
  return {
    ...c,
    pis: [...(c.pis || [])],
    pos: [...(c.pos || [])],
    state: c.state ? [...c.state] : undefined,
    init: c.init ? { ...c.init } : undefined,
    gates: (c.gates || []).map((g) => ({ ...g, inputs: [...g.inputs] })),
    ffs: c.ffs ? c.ffs.map((f) => ({ ...f })) : undefined,
  };
}

export function cexEqual(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if ((a[k] ?? 0) !== (b[k] ?? 0)) return false;
  }
  return true;
}

export function resultPack(out, detail) {
  return {
    equivalent: !!out.equivalent,
    counterexample: out.counterexample || null,
    rowsChecked: out.rowsChecked ?? null,
    specOut: out.specOut ?? null,
    implOut: out.implOut ?? null,
    failed: 0,
    detail,
  };
}

/** Always claim equivalent (intentionally weak). */
export function identityCheck(spec, impl, opts = {}) {
  void impl;
  void opts;
  return {
    equivalent: true,
    counterexample: null,
    rowsChecked: 0,
    failed: 0,
    detail: "identity/always-equiv",
  };
}

/** Exact truth-table CEC (gold for combo). */
export function truthTableCheck(spec, impl, opts = {}) {
  const out = truthTableCec(spec, impl, opts.dontCare || null);
  return resultPack(out, "truthTableCec");
}

/** Evaluate miter over all PI assignments. */
export function miterEvalCheck(spec, impl, opts = {}) {
  void opts;
  const miter = buildMiter(spec, impl);
  let rows = 0;
  for (const asn of allAssignments(miter.pis)) {
    rows++;
    if (evaluateCircuit(miter, asn) !== 0) {
      return resultPack(
        {
          equivalent: false,
          rowsChecked: rows,
          counterexample: { ...asn },
          specOut: evaluateCircuit(spec, asn),
          implOut: evaluateCircuit(impl, asn),
        },
        "miterEval"
      );
    }
  }
  return resultPack({ equivalent: true, rowsChecked: rows }, "miterEval");
}

/** Structural hash of PO cones — may false-positive on non-iso but equiv. */
export function structuralHashCheck(spec, impl, opts = {}) {
  void opts;
  const hs = structuralHashStats(spec);
  const hi = structuralHashStats(impl);
  const specOut = (spec.gates || []).find((g) => g.output);
  const implOut = (impl.gates || []).find((g) => g.output);
  const same =
    specOut &&
    implOut &&
    hs.gateHashes[specOut.id] === hi.gateHashes[implOut.id];
  if (same) {
    return resultPack({ equivalent: true, rowsChecked: 0 }, "structuralHash");
  }
  // Fall back to truth table for cex when hashes differ
  const tt = truthTableCec(spec, impl);
  return resultPack(
    { ...tt, equivalent: tt.equivalent },
    "structuralHash/fallback"
  );
}

/** FRAIG-lite unique nodes + hash compare. */
export function fraigCheck(spec, impl, opts = {}) {
  void opts;
  const fs = fraigLite(spec);
  const fi = fraigLite(impl);
  if (fs.fraigNodes === fi.fraigNodes) {
    // Same node count is weak — confirm with TT
    return resultPack(truthTableCec(spec, impl), "fraigLite+tt");
  }
  return resultPack(truthTableCec(spec, impl), "fraigLite+tt");
}

/** SAT on miter with output forced to 1 (bug = satisfiable). */
export function satMiterCheck(spec, impl, opts = {}) {
  void opts;
  const miter = buildMiter(spec, impl);
  const cnf = encodeSatCnfLite(miter, 1);
  const sat = satSatisfiable(cnf);
  if (!sat) {
    return resultPack(
      { equivalent: true, rowsChecked: cnf.numClauses },
      "satMiter/unsat"
    );
  }
  // Recover a cex via truth table (tiny literacy graphs)
  const tt = truthTableCec(spec, impl);
  return resultPack(
    {
      equivalent: false,
      rowsChecked: cnf.numClauses,
      counterexample: tt.counterexample,
      specOut: tt.specOut,
      implOut: tt.implOut,
    },
    "satMiter/sat"
  );
}

/** Random vector simulation (incomplete). */
export function randomSimCheck(spec, impl, opts = {}) {
  const trials = opts.trials ?? 16;
  const seed = opts.seed ?? 42;
  let t = seed >>> 0;
  const rand = () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const pis = spec.pis || [];
  for (let i = 0; i < trials; i++) {
    const asn = {};
    for (const p of pis) asn[p] = rand() < 0.5 ? 0 : 1;
    const s = evaluateCircuit(spec, asn);
    const im = evaluateCircuit(impl, asn);
    if (s !== im) {
      return resultPack(
        {
          equivalent: false,
          rowsChecked: i + 1,
          counterexample: asn,
          specOut: s,
          implOut: im,
        },
        "randomSim"
      );
    }
  }
  // Incomplete: claim equivalent after trials (may be wrong)
  return resultPack(
    { equivalent: true, rowsChecked: trials },
    "randomSim/incomplete"
  );
}

/** Guided: try golden cex first, then TT. */
export function guidedCexCheck(spec, impl, opts = {}) {
  const hint = opts.cexHint || GOLDENS.cex;
  if (hint) {
    const s = evaluateCircuit(spec, hint);
    const i = evaluateCircuit(impl, hint);
    if (s !== i) {
      return resultPack(
        {
          equivalent: false,
          rowsChecked: 1,
          counterexample: { ...hint },
          specOut: s,
          implOut: i,
        },
        "guidedCex/hint"
      );
    }
  }
  return resultPack(truthTableCec(spec, impl), "guidedCex/tt");
}

/** Don't-care aware CEC. */
export function dontCareCheck(spec, impl, opts = {}) {
  const mask = opts.dontCare || { a: -1, b: -1, c: -1 };
  return resultPack(dontCareMask(spec, impl, mask), "dontCareMask");
}

/** Sequential CEC lite. */
export function sequentialCheck(spec, impl, opts = {}) {
  const steps = opts.steps ?? 2;
  if (!spec.ffs && !impl.ffs) {
    return resultPack(truthTableCec(spec, impl), "sequential/fallback-tt");
  }
  const out = sequentialCecLite(spec, impl, steps);
  return resultPack(
    {
      equivalent: out.equivalent,
      counterexample: out.counterexample,
      rowsChecked: out.steps,
    },
    "sequentialCecLite"
  );
}

/** Bit-parallel-ish: walk Gray code of assignments (same as TT, different order). */
export function grayWalkCheck(spec, impl, opts = {}) {
  void opts;
  const pis = spec.pis || [];
  const n = pis.length;
  let rows = 0;
  let prev = 0;
  for (let i = 0; i < 1 << n; i++) {
    const gray = i ^ (i >> 1);
    const asn = {};
    for (let b = 0; b < n; b++) asn[pis[b]] = (gray >> b) & 1;
    rows++;
    const s = evaluateCircuit(spec, asn);
    const im = evaluateCircuit(impl, asn);
    if (s !== im) {
      return resultPack(
        {
          equivalent: false,
          rowsChecked: rows,
          counterexample: asn,
          specOut: s,
          implOut: im,
        },
        "grayWalk"
      );
    }
    prev = gray;
    void prev;
  }
  return resultPack({ equivalent: true, rowsChecked: rows }, "grayWalk");
}

/** Portfolio: exact engines + sequential when needed. */
export function portfolioCheck(spec, impl, opts = {}) {
  const isSeq = !!(spec.ffs || impl.ffs);
  if (isSeq) {
    const seq = sequentialCheck(spec, impl, opts);
    return { ...seq, detail: `portfolio/${seq.detail}` };
  }
  const cands = [
    truthTableCheck(spec, impl, opts),
    miterEvalCheck(spec, impl, opts),
    satMiterCheck(spec, impl, opts),
    grayWalkCheck(spec, impl, opts),
    guidedCexCheck(spec, impl, opts),
  ];
  // Prefer exact agreement with truth table gold
  const gold = truthTableCheck(spec, impl, opts);
  const match = cands.find((c) => c.equivalent === gold.equivalent);
  const best = match || gold;
  if (!best.equivalent && !best.counterexample && gold.counterexample) {
    best.counterexample = gold.counterexample;
  }
  return { ...best, detail: `portfolio/${best.detail}` };
}

export function multistartCheck(spec, impl, opts = {}) {
  const cands = [
    randomSimCheck(spec, impl, { ...opts, seed: 7, trials: 8 }),
    randomSimCheck(spec, impl, { ...opts, seed: 19, trials: 12 }),
    guidedCexCheck(spec, impl, opts),
    miterEvalCheck(spec, impl, opts),
  ];
  const gold = (spec.ffs || impl.ffs)
    ? sequentialCheck(spec, impl, opts)
    : truthTableCheck(spec, impl, opts);
  // If any finds a cex matching gold non-equiv, take it
  if (!gold.equivalent) {
    const hit = cands.find(
      (c) => !c.equivalent && cexEqual(c.counterexample, gold.counterexample)
    );
    if (hit) return { ...hit, detail: `multistart/${hit.detail}` };
    return { ...gold, detail: "multistart/gold" };
  }
  // Gold equivalent — only accept engines that also say yes with enough coverage
  const ok = cands.find((c) => c.equivalent && (c.rowsChecked || 0) >= 4);
  return { ...(ok || gold), detail: `multistart/${(ok || gold).detail}` };
}

export {
  SPEC,
  IMPL_GOOD,
  IMPL_BAD,
  SEQ_SPEC,
  SEQ_GOOD,
  SEQ_BAD,
  GOLDENS,
};
