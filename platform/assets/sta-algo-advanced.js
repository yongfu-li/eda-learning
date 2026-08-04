/**
 * Advanced STA engines for the timing benchmark.
 */
import {
  PROP_GOLDENS,
  TINY_TIMING,
  analyzeSetup,
  cellDelaySum,
  cloneTiming,
  criticalPathTo,
  incrementalArrival,
  levelize,
  pathDelaySum,
  propagateArrival,
  propagateRequired,
  round6,
  setupSlack,
  sinks,
} from "./sta-core.js";

export function pathEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export function resultFromAnalyze(t, analysis, detail) {
  if (!analysis) {
    return {
      timing: cloneTiming(t),
      arrival: null,
      required: null,
      slackAtSink: null,
      path: null,
      sink: sinks(t)[0],
      failed: 1,
      detail,
    };
  }
  return {
    timing: cloneTiming(t),
    arrival: analysis.arrival,
    required: analysis.required,
    slackAtSink: analysis.slackAtSink,
    path: analysis.path,
    sink: analysis.sink,
    failed: analysis.slackAtSink == null ? 1 : 0,
    detail,
  };
}

/** Exact course setup analysis. */
export function fullSetupAnalyze(t, opts = {}) {
  return resultFromAnalyze(t, analyzeSetup(t, opts), "analyzeSetup");
}

/** Setup + hold required at sinks. */
export function setupHoldAnalyze(t, opts = {}) {
  const setup = analyzeSetup(t, opts);
  if (!setup) return resultFromAnalyze(t, null, "setupHold/fail");
  const reqHold = propagateRequired(t, { ...opts, mode: "hold" });
  const sink = setup.sink;
  const hold =
    setup.arrival && reqHold
      ? round6(setup.arrival[sink] - (reqHold[sink] ?? 0))
      : null;
  return {
    ...resultFromAnalyze(t, setup, "setupHold"),
    holdSlackAtSink: hold,
    requiredHold: reqHold,
  };
}

/** Approximate arrival: level × mean arc delay (intentionally coarse). */
export function approxLevelAnalyze(t, opts = {}) {
  const levels = levelize(t);
  if (!levels) return resultFromAnalyze(t, null, "approx/cyclic");
  const mean =
    t.arcs.length > 0
      ? t.arcs.reduce((s, a) => s + a.delay, 0) / t.arcs.length
      : 1;
  const arr = {};
  for (const [id, lv] of Object.entries(levels)) {
    arr[id] = round6(lv * mean);
  }
  const period = t.clock?.period ?? 10;
  const cycles = opts.setupCycles ?? 1;
  const snk = sinks(t)[0];
  const req = propagateRequired(t, { ...opts, mode: "setup" }) || {
    [snk]: period * cycles,
  };
  const slack = setupSlack(arr, req, snk);
  return {
    timing: cloneTiming(t),
    arrival: arr,
    required: req,
    slackAtSink: slack,
    path: criticalPathTo(t, arr, snk),
    sink: snk,
    failed: slack == null ? 1 : 0,
    detail: "approxLevelAnalyze",
  };
}

/** DFS longest path delay into sink. */
export function dfsCriticalAnalyze(t, opts = {}) {
  const snk = sinks(t)[0];
  const memo = {};
  const prev = {};
  function longest(pin) {
    if (memo[pin] != null) return memo[pin];
    const incoming = t.arcs.filter((a) => a.to === pin);
    if (!incoming.length) {
      memo[pin] = opts.arrivalAt?.[pin] ?? 0;
      return memo[pin];
    }
    let best = -Infinity;
    let bestArc = null;
    for (const a of incoming) {
      const cand = longest(a.from) + a.delay;
      if (cand > best) {
        best = cand;
        bestArc = a;
      }
    }
    memo[pin] = round6(best);
    prev[pin] = bestArc?.from;
    return memo[pin];
  }
  const arrOut = longest(snk);
  const path = [snk];
  let cur = snk;
  while (prev[cur]) {
    path.push(prev[cur]);
    cur = prev[cur];
  }
  path.reverse();
  const period = (t.clock?.period ?? 10) * (opts.setupCycles ?? 1);
  const req = { [snk]: period };
  const slack = round6(period - arrOut);
  return {
    timing: cloneTiming(t),
    arrival: { ...memo },
    required: req,
    slackAtSink: slack,
    path,
    sink: snk,
    failed: 0,
    detail: "dfsCriticalAnalyze",
  };
}

/** False-path aware: disable listed arcs then setup. */
export function falsePathAnalyze(t, opts = {}) {
  const disable =
    opts.disableArcs ||
    PROP_GOLDENS.falsePath.arcs.map(([f, to]) => `${f}|${to}`);
  return resultFromAnalyze(
    t,
    analyzeSetup(t, { ...opts, disableArcs: disable }),
    "falsePathAnalyze"
  );
}

/** Multicycle setup. */
export function multicycleAnalyze(t, opts = {}) {
  const cycles = opts.setupCycles ?? PROP_GOLDENS.multicycle.setupCycles;
  return resultFromAnalyze(
    t,
    analyzeSetup(t, { ...opts, setupCycles: cycles }),
    `multicycle/${cycles}`
  );
}

/** Incremental: apply edit then cone update. */
export function incrementalAnalyze(t, opts = {}) {
  const edit = opts.edit || {
    from: PROP_GOLDENS.incremental.editFrom,
    to: PROP_GOLDENS.incremental.editTo,
    delay: PROP_GOLDENS.incremental.newDelay,
  };
  const base = propagateArrival(t, opts);
  if (!base) return resultFromAnalyze(t, null, "incremental/fail");
  const { timing, arrival } = incrementalArrival(t, edit, base);
  const req = propagateRequired(timing, { ...opts, mode: "setup" });
  const snk = sinks(timing)[0];
  const slack = setupSlack(arrival, req, snk);
  return {
    timing,
    arrival,
    required: req,
    slackAtSink: slack,
    path: criticalPathTo(timing, arrival, snk),
    sink: snk,
    failed: slack == null ? 1 : 0,
    detail: "incrementalAnalyze",
  };
}

/** Pessimistic: add margin to every cell delay before analyze. */
export function pessimisticAnalyze(t, opts = {}) {
  const margin = opts.margin ?? 0.25;
  const tt = cloneTiming(t);
  for (const a of tt.arcs) {
    if (a.kind === "cell") a.delay = round6(a.delay + margin);
  }
  return resultFromAnalyze(tt, analyzeSetup(tt, opts), `pessimistic/${margin}`);
}

/** Shrink cell delays on critical path to maximize setup slack. */
export function budgetResizeAnalyze(t, opts = {}) {
  const minCell = opts.minCell ?? 0.4;
  const step = opts.step ?? 0.1;
  const tt = cloneTiming(t);
  let best = analyzeSetup(tt, opts);
  let guard = 80;
  while (guard-- > 0 && best) {
    const path = best.path || [];
    let shrunk = false;
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const arc = tt.arcs.find((a) => a.from === from && a.to === to);
      if (!arc || arc.kind !== "cell") continue;
      if (arc.delay - step < minCell - 1e-12) continue;
      arc.delay = round6(arc.delay - step);
      shrunk = true;
      break;
    }
    if (!shrunk) break;
    const next = analyzeSetup(tt, opts);
    if (!next || next.slackAtSink == null) break;
    best = next;
  }
  return {
    ...resultFromAnalyze(tt, best, "budgetResizeAnalyze"),
    cellDelaySum: cellDelaySum(tt),
    pathDelay: pathDelaySum(tt),
  };
}

/** Aggressive budget: shrink all critical cell arcs each round. */
export function budgetDeepAnalyze(t, opts = {}) {
  const minCell = opts.minCell ?? 0.35;
  const step = opts.step ?? 0.05;
  const tt = cloneTiming(t);
  for (let round = 0; round < 40; round++) {
    const an = analyzeSetup(tt, opts);
    if (!an?.path) break;
    let any = false;
    for (let i = 0; i < an.path.length - 1; i++) {
      const arc = tt.arcs.find(
        (a) => a.from === an.path[i] && a.to === an.path[i + 1] && a.kind === "cell"
      );
      if (arc && arc.delay - step >= minCell - 1e-12) {
        arc.delay = round6(arc.delay - step);
        any = true;
      }
    }
    if (!any) break;
  }
  const best = analyzeSetup(tt, opts);
  return {
    ...resultFromAnalyze(tt, best, "budgetDeepAnalyze"),
    cellDelaySum: cellDelaySum(tt),
    pathDelay: pathDelaySum(tt),
  };
}

/** Clock uncertainty: shrink effective period by uncertainty before setup. */
export function uncertaintyAnalyze(t, opts = {}) {
  const unc = opts.uncertainty ?? 0.2;
  const tt = cloneTiming(t);
  const period = tt.clock?.period ?? 10;
  tt.clock = { ...(tt.clock || { name: "clk" }), period: round6(period - unc) };
  return resultFromAnalyze(
    tt,
    analyzeSetup(tt, opts),
    `uncertainty/${unc}`
  );
}

/**
 * Slew-lite: derate cell delay by (1 + α·fanout) as a crude load model.
 */
export function slewLiteAnalyze(t, opts = {}) {
  const alpha = opts.slewAlpha ?? 0.08;
  const tt = cloneTiming(t);
  const fanout = {};
  for (const a of tt.arcs) {
    fanout[a.from] = (fanout[a.from] || 0) + 1;
  }
  for (const a of tt.arcs) {
    if (a.kind !== "cell") continue;
    const fo = fanout[a.to] || 1;
    a.delay = round6(a.delay * (1 + alpha * Math.max(0, fo - 1)));
  }
  return resultFromAnalyze(tt, analyzeSetup(tt, opts), `slewLite/${alpha}`);
}

/** Early mode: use min delay on each arc (scale factor). */
export function earlyModeAnalyze(t, opts = {}) {
  const scale = opts.earlyScale ?? 0.7;
  const tt = cloneTiming(t);
  for (const a of tt.arcs) a.delay = round6(a.delay * scale);
  return resultFromAnalyze(tt, analyzeSetup(tt, opts), `early/${scale}`);
}

/** Late mode: max-delay scale (OCV-lite). */
export function lateModeAnalyze(t, opts = {}) {
  const scale = opts.lateScale ?? 1.15;
  const tt = cloneTiming(t);
  for (const a of tt.arcs) a.delay = round6(a.delay * scale);
  return resultFromAnalyze(tt, analyzeSetup(tt, opts), `late/${scale}`);
}

/**
 * TNS report: setup analysis + sum of negative pin slacks (WNS at sink still primary).
 */
export function tnsAnalyze(t, opts = {}) {
  const setup = analyzeSetup(t, opts);
  if (!setup) return resultFromAnalyze(t, null, "tns/fail");
  let tns = 0;
  let wns = Infinity;
  for (const pin of Object.keys(setup.arrival || {})) {
    const s = setupSlack(setup.arrival, setup.required, pin);
    if (s == null) continue;
    if (s < wns) wns = s;
    if (s < 0) tns = round6(tns + s);
  }
  if (wns === Infinity) wns = setup.slackAtSink;
  return {
    ...resultFromAnalyze(t, setup, "tnsAnalyze"),
    tns,
    wns,
  };
}

/**
 * Enumerate simple source→sink paths; pick worst delay (k-worst lite).
 */
export function kWorstPathAnalyze(t, opts = {}) {
  const snk = sinks(t)[0];
  const srcs = new Set(
    t.pins.filter((p) => !t.arcs.some((a) => a.to === p.id)).map((p) => p.id)
  );
  if (!srcs.size) {
    for (const p of t.pins) {
      if (!t.arcs.some((a) => a.to === p.id)) srcs.add(p.id);
    }
  }
  const succ = {};
  for (const p of t.pins) succ[p.id] = [];
  for (const a of t.arcs) succ[a.from].push(a);

  const paths = [];
  function dfs(pin, path, delay, seen) {
    if (paths.length > 200) return;
    if (pin === snk) {
      paths.push({ path: [...path], delay: round6(delay) });
      return;
    }
    for (const a of succ[pin] || []) {
      if (seen.has(a.to)) continue;
      seen.add(a.to);
      path.push(a.to);
      dfs(a.to, path, delay + a.delay, seen);
      path.pop();
      seen.delete(a.to);
    }
  }
  for (const s of srcs) {
    dfs(s, [s], 0, new Set([s]));
  }
  if (!paths.length) return resultFromAnalyze(t, analyzeSetup(t, opts), "kWorst/empty");
  paths.sort((a, b) => b.delay - a.delay);
  const worst = paths[0];
  const period = (t.clock?.period ?? 10) * (opts.setupCycles ?? 1);
  const slack = round6(period - worst.delay);
  const arr = propagateArrival(t, opts) || {};
  const req = propagateRequired(t, { ...opts, mode: "setup" }) || { [snk]: period };
  return {
    timing: cloneTiming(t),
    arrival: arr,
    required: req,
    slackAtSink: slack,
    path: worst.path,
    sink: snk,
    failed: 0,
    detail: `kWorst/${paths.length}`,
    kPaths: paths.slice(0, opts.k ?? 5),
  };
}

/**
 * Dijkstra-style longest-path on DAG (relax in topo order) — same as arrival max.
 * Kept as a named engine for literacy / teaching.
 */
export function dijkstraCriticalAnalyze(t, opts = {}) {
  const order = levelize(t);
  if (!order) return resultFromAnalyze(t, null, "dijkstra/cyclic");
  return fullSetupAnalyze(t, opts);
}

/** Fanout derate on nets leaving high-fanout pins. */
export function fanoutDerateAnalyze(t, opts = {}) {
  const beta = opts.fanoutBeta ?? 0.05;
  const tt = cloneTiming(t);
  const fanout = {};
  for (const a of tt.arcs) fanout[a.from] = (fanout[a.from] || 0) + 1;
  for (const a of tt.arcs) {
    if (a.kind !== "net") continue;
    const fo = fanout[a.from] || 1;
    if (fo > 1) a.delay = round6(a.delay * (1 + beta * (fo - 1)));
  }
  return resultFromAnalyze(tt, analyzeSetup(tt, opts), `fanoutDerate/${beta}`);
}

/**
 * ECO slack recovery: bump period slightly OR shrink one critical cell (min change).
 * Prefers delay shrink; falls back to reporting full setup.
 */
export function ecoRecoverAnalyze(t, opts = {}) {
  const base = analyzeSetup(t, opts);
  if (!base) return resultFromAnalyze(t, null, "eco/fail");
  if ((base.slackAtSink ?? 0) >= 0) {
    return resultFromAnalyze(t, base, "eco/ok");
  }
  const resized = budgetResizeAnalyze(t, { ...opts, minCell: opts.minCell ?? 0.35, step: 0.05 });
  if ((resized.slackAtSink ?? -Infinity) > (base.slackAtSink ?? -Infinity)) {
    return { ...resized, detail: "ecoRecover/resize" };
  }
  const tt = cloneTiming(t);
  const need = round6(Math.abs(base.slackAtSink) + 0.05);
  tt.clock = {
    ...(tt.clock || { name: "clk" }),
    period: round6((tt.clock?.period ?? 10) + need),
  };
  return resultFromAnalyze(tt, analyzeSetup(tt, opts), "ecoRecover/period");
}

/** Uncertainty + multicycle combined SDC-lite. */
export function sdcComboAnalyze(t, opts = {}) {
  const unc = opts.uncertainty ?? 0.15;
  const cycles = opts.setupCycles ?? 1;
  const tt = cloneTiming(t);
  const period = tt.clock?.period ?? 10;
  tt.clock = { ...(tt.clock || { name: "clk" }), period: round6(period - unc) };
  return resultFromAnalyze(
    tt,
    analyzeSetup(tt, { ...opts, setupCycles: cycles }),
    `sdcCombo/u${unc}/c${cycles}`
  );
}

/** Exact recompute after applying instance edit (full, not cone). */
export function fullAfterEditAnalyze(t, opts = {}) {
  if (!opts.edit) return fullSetupAnalyze(t, opts);
  const tt = cloneTiming(t);
  const arc = tt.arcs.find(
    (a) => a.from === opts.edit.from && a.to === opts.edit.to
  );
  if (arc) arc.delay = opts.edit.delay;
  return resultFromAnalyze(tt, analyzeSetup(tt, opts), "fullAfterEdit");
}

/** Portfolio: prefer exact setup match to golden. */
export function portfolioAnalyze(t, opts = {}) {
  const candidates = [
    fullSetupAnalyze(t, opts),
    setupHoldAnalyze(t, opts),
    dfsCriticalAnalyze(t, opts),
    dijkstraCriticalAnalyze(t, opts),
    kWorstPathAnalyze(t, opts),
    tnsAnalyze(t, opts),
    falsePathAnalyze(t, {
      ...opts,
      disableArcs: opts.disableArcs || [],
    }),
    multicycleAnalyze(t, { ...opts, setupCycles: opts.setupCycles ?? 1 }),
    fullAfterEditAnalyze(t, opts),
  ];
  const gold = analyzeSetup(t, opts);
  let best = candidates[0];
  let bestScore = [1, Infinity];
  for (const c of candidates) {
    const fail = c.failed || c.slackAtSink == null ? 1 : 0;
    const err =
      gold?.slackAtSink != null && c.slackAtSink != null
        ? Math.abs(c.slackAtSink - gold.slackAtSink)
        : 999;
    const score = [fail, err];
    if (
      score[0] < bestScore[0] ||
      (score[0] === bestScore[0] && score[1] < bestScore[1] - 1e-12)
    ) {
      bestScore = score;
      best = c;
    }
  }
  return { ...best, detail: `portfolio:${best.detail}` };
}

/** Multistart resize + exact analyze. */
export function multistartSta(t, opts = {}) {
  const candidates = [
    fullSetupAnalyze(t, opts),
    budgetResizeAnalyze(t, opts),
    budgetDeepAnalyze(t, opts),
    ecoRecoverAnalyze(t, opts),
    slewLiteAnalyze(t, opts),
    fanoutDerateAnalyze(t, opts),
    pessimisticAnalyze(t, { ...opts, margin: 0.1 }),
    lateModeAnalyze(t, opts),
  ];
  let best = candidates[0];
  for (const c of candidates) {
    if ((c.failed || 0) > (best.failed || 0)) continue;
    if ((c.failed || 0) < (best.failed || 0)) {
      best = c;
      continue;
    }
    const cs = c.slackAtSink ?? -Infinity;
    const bs = best.slackAtSink ?? -Infinity;
    if (cs > bs + 1e-9) best = c;
    else if (
      Math.abs(cs - bs) < 1e-9 &&
      (c.cellDelaySum ?? 999) < (best.cellDelaySum ?? 999)
    ) {
      best = c;
    }
  }
  return { ...best, detail: `multistart:${best.detail}` };
}

void TINY_TIMING;
