import {
  NODES,
  EDGES,
  LAYOUT,
  GOLDENS,
  PERIOD_TARGET,
  zeroRetime,
  graphStats,
  forwardRetime,
  backwardRetime,
  clockPeriod,
  registerCount,
  isLegal,
  applyRetime,
  minPeriodSearch,
  sequentialRetime,
} from "../../assets/retiming-core.js";

function step(id, title, caption, bullets, metrics, _positions, extra = {}) {
  return {
    id,
    title,
    caption,
    bullets,
    metrics,
    nodes: NODES,
    layout: LAYOUT,
    edges: EDGES,
    r: zeroRetime(),
    ...extra,
  };
}

function withForwardA(extra = {}) {
  const r = forwardRetime("a", zeroRetime(), 1);
  return {
    r,
    selectedNode: "a",
    metricText: `P=${clockPeriod(r)} regs=${registerCount(r)}`,
    ...extra,
  };
}

function withBackwardC(extra = {}) {
  const r = backwardRetime("c", zeroRetime(), 1);
  return {
    r,
    selectedNode: "c",
    metricText: `legal=${isLegal(EDGES, r)} P=${clockPeriod(r)}`,
    highlight: ["e3", "c"],
    ...extra,
  };
}

export const RETIMING_ALGOS = {
  "sequential-graph": {
    title: "Sequential graph",
    module: "module01-01-sequential-graph",
    kind: "retiming",
    steps: [
      step("topo", "Topology", "Five nodes: PI u, comb a/b/c, PO v, plus shortcut a→c.", ["DAG"], [`nodes=${GOLDENS.nodeCount}`], null),
      step("pi", "PI/PO", "Blue circle u is the primary input; red v is the primary output.", ["Ports"], ["u / v"], null, { highlight: ["u", "v"], selectedNode: "u" }),
      step("comb", "Comb boxes", "Green boxes a, b, c carry combinational delay.", ["delay d"], ["a=3 b=2 c=4"], null, { highlight: ["a", "b", "c"] }),
      step("edges", "Five edges", "Edge labels show register weight w. Five edges total.", ["w labels"], [`edges=${GOLDENS.edgeCount}`], null, { highlight: ["e0", "e1", "e2", "e3", "e4"] }),
      step("stats", "Stats", "GOLDENS: 5 nodes, 5 edges, 3 comb, 2 base registers.", ["graphStats"], [`regs=${GOLDENS.baseRegisters}`], null, { metricText: JSON.stringify(graphStats()) }),
    ],
  },
  "register-count": {
    title: "Register counts",
    module: "module01-03-register-count",
    kind: "retiming",
    steps: [
      step("w", "Weights", "Edge w is the number of registers on that arc.", ["w(e)"], ["integers"], null),
      step("e0", "e0 has 1", "u→a starts with one register (w=1).", ["PI edge"], ["w=1"], null, { highlight: ["e0"] }),
      step("e1", "e1 has 0", "a→b is pure combo (w=0).", ["Zero weight"], ["path fuel"], null, { highlight: ["e1"] }),
      step("sum", "Sum = 2", "Total registers = sum of w = 2 on the starter.", ["area proxy"], [`regs=${GOLDENS.baseRegisters}`], null, { metricText: `regs=${registerCount(null)}` }),
      step("move", "Retiming moves w", "Changing r redistributes w without changing function (when legal).", ["w_r"], ["later labs"], null),
    ],
  },
  "path-delay": {
    title: "Path delay",
    module: "module02-01-path-delay",
    kind: "retiming",
    steps: [
      step("zero", "Zero-weight paths", "Clock period is the longest path that only uses edges with w=0.", ["combo path"], ["P"], null),
      step("hot", "Hot path", "a→b and a→c and c→v create long zero-weight stretches.", ["w=0"], ["a b c"], null, { highlight: ["e1", "e4", "e3"] }),
      step("base", "Baseline P=8", "On the starter, longest zero-weight delay is 8.", ["GOLDENS"], [`P=${GOLDENS.baselinePeriod}`], null, { metricText: `P=${clockPeriod(null)}` }),
      step("target", "Target 5", "We want period ≤ 5 — retiming must break the long path.", ["target"], [`T=${PERIOD_TARGET}`], null, { metricText: `target ${PERIOD_TARGET}` }),
      step("idea", "Break with registers", "Pushing a register onto a zero-weight edge splits the combo path.", ["forward/back"], ["Next labs"], null),
    ],
  },
  "forward-retime": {
    title: "Forward retime",
    module: "module02-03-forward-retime",
    kind: "retiming",
    steps: [
      step("def", "Forward −r", "Forward retiming decreases r(v): registers move toward outputs across v.", ["−r(v)"], ["toward PO"], null),
      step("pick", "Pick a", "Select node a — the first comb after the PI register.", ["node a"], ["d=3"], null, { selectedNode: "a", highlight: ["a"] }),
      step("apply", "Apply forward", "Set r(a)=−1. Edge weights become w + r(dst) − r(src).", ["w_r"], ["formula"], null, withForwardA({ highlight: ["a", "e0", "e1"] })),
      step("period", "Period 8→5", "After forward on a, period drops from 8 to 5.", ["improved"], [`P=${GOLDENS.forwardAPeriod}`], null, withForwardA()),
      step("regs", "Registers 2→3", "Register count rises to 3 — timing vs area tradeoff.", ["area"], [`regs=${GOLDENS.forwardARegisters}`], null, withForwardA()),
    ],
  },
  "backward-retime": {
    title: "Backward retime",
    module: "module02-05-backward-retime",
    kind: "retiming",
    steps: [
      step("def", "Backward +r", "Backward retiming increases r(v): registers move toward inputs across v.", ["+r(v)"], ["toward PI"], null),
      step("pick", "Pick c", "Try backward on c (the slow comb, d=4).", ["node c"], ["d=4"], null, { selectedNode: "c", highlight: ["c"] }),
      step("apply", "Apply +1", "r(c)=+1 changes outbound e3 weight to −1.", ["w_r(e3)"], ["danger"], null, withBackwardC()),
      step("illegal", "Illegal edge", "Negative weight means illegal retiming — red edge.", ["w≥0 required"], ["fail"], null, withBackwardC({ highlight: ["e3"] })),
      step("lesson", "Not every move", "Backward is valid only when every w_r stays non-negative.", ["legality"], ["Next lab"], null, withBackwardC()),
    ],
  },
  "legal-retime": {
    title: "Legal retime",
    module: "module02-07-legal-retime",
    kind: "retiming",
    steps: [
      step("rule", "All w_r ≥ 0", "A retiming is legal iff every edge keeps non-negative weight.", ["constraint"], ["hard"], null),
      step("zero", "Zero is legal", "r≡0 is always legal on the starter.", ["baseline"], ["yes"], null, { metricText: `legal=${isLegal(EDGES, zeroRetime())}` }),
      step("fwd", "Forward a legal", "Forward on a stays legal and improves period.", ["ok"], ["P=5"], null, withForwardA()),
      step("bwd", "Backward c illegal", "Backward on c alone violates e3.", ["fail"], ["w=-1"], null, withBackwardC()),
      step("check", "Always check", "Before trusting period, assert legality.", ["is_legal"], ["gate"], null),
    ],
  },
  "period-bound": {
    title: "Period bound",
    module: "module03-01-period-bound",
    kind: "retiming",
    steps: [
      step("feas", "FEAS lite", "feas_check: legal AND period ≤ target.", ["FEAS"], ["toy"], null),
      step("target", "Target 5", "GOLDENS.periodTarget = 5.", ["clock"], [`T=${PERIOD_TARGET}`], null),
      step("base-fail", "Baseline fails", "Period 8 > 5, so baseline is not feasible for the target.", ["P=8"], ["fail"], null, { metricText: `P=${clockPeriod(null)} feas=false` }),
      step("fwd-pass", "Forward passes", "Forward on a: legal and P=5 ≤ 5 — feasible.", ["pass"], ["P=5"], null, withForwardA({ metricText: `P=5 feas=true` })),
      step("wd", "Full WD later", "Real tools use W/D matrices; we only try a few retimings.", ["literacy"], ["not full LP"], null),
    ],
  },
  "min-period": {
    title: "Min period",
    module: "module03-03-min-period",
    kind: "retiming",
    steps: [
      step("search", "Try candidates", "Lite search tries zero, forward a, backward c, forward b.", ["enumerate"], ["pick best"], null),
      step("best", "Best P=5", "Best legal period found is 5 (forward on a).", ["min"], [`P=${GOLDENS.forwardAPeriod}`], null, (() => {
        const m = minPeriodSearch();
        return { r: m.r, metricText: `P=${m.period} improved=${m.improved}`, selectedNode: "a" };
      })()),
      step("improve", "Improved", "improved=true because 5 < baseline 8.", ["delta"], ["−3"], null, (() => {
        const m = minPeriodSearch();
        return { r: m.r, metricText: `base ${m.baselinePeriod} → ${m.period}` };
      })()),
      step("regs", "Cost registers", "Best solution uses 3 registers vs 2 baseline.", ["area"], ["+1 FF"], null, (() => {
        const m = minPeriodSearch();
        return { r: m.r, metricText: `regs ${m.registers}` };
      })()),
      step("seq", "Sequential API", "sequential_retime(min_period) wraps the same search.", ["pipeline"], ["one call"], null, (() => {
        const s = sequentialRetime("min_period");
        return { r: s.r, metricText: `mode ${s.mode} P=${s.period}` };
      })()),
    ],
  },
  "area-registers": {
    title: "Area / registers",
    module: "module03-05-area-registers",
    kind: "retiming",
    steps: [
      step("proxy", "Registers ≈ area", "Total w is a stand-in for flip-flop area.", ["FF count"], ["sum w"], null),
      step("base", "Baseline 2", "Starter has two registers.", ["cheap"], [`regs=${GOLDENS.baseRegisters}`], null, { metricText: `regs=${registerCount(null)}` }),
      step("trade", "Timing vs area", "Forward on a buys P=5 for one extra register.", ["tradeoff"], ["2→3"], null, withForwardA()),
      step("edges", "Where they sit", "After forward a, registers sit on e1, e2, e4.", ["moved"], ["labels"], null, (() => {
        const r = forwardRetime("a", zeroRetime(), 1);
        const e = applyRetime(EDGES, r);
        return { r, metricText: e.map((x) => `${x.id}:${x.w}`).join(" "), highlight: ["e1", "e2", "e4"] };
      })()),
      step("done", "Done", "Next: offline compare, then wrap toward equivalence or STA.", ["learn_equivalence"], ["Wrap"], null, withForwardA()),
    ],
  },
};

void NODES;
