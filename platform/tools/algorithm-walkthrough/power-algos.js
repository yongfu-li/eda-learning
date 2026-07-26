/** Walkthrough packs for learn_power (kind: power). */
import { STARTER, GOLDENS, cloneDesign } from "../../assets/power-core.js";

function step(id, title, caption, bullets, metrics, extra = {}) {
  return {
    id,
    title,
    caption,
    bullets,
    metrics,
    design: cloneDesign(STARTER),
    ...extra,
  };
}

export const POWER_ALGOS = {
  "switching-power": {
    kind: "power",
    title: "Switching power",
    module: "module01-01-switching-power",
    steps: [
      step("formula", "Psw formula", "Psw = α · C · V² · f per net.", ["Psw"], ["α·C·V²·f"], { highlight: ["n1"], metricText: "Psw=α·C·V²·f" }),
      step("n1", "Net n1", "n1: α=0.5, C=2, V=1, f=1 → Psw=1.0.", ["n1"], ["1.0"], { highlight: ["n1"], metricText: "n1=1.0" }),
      step("n2", "Net n2", "n2: α=0.2, C=1 → Psw=0.2.", ["n2"], ["0.2"], { highlight: ["n2"], metricText: "n2=0.2" }),
      step("n3", "Net n3", "n3: α=1.0, C=4 → Psw=4.0.", ["n3"], ["4.0"], { highlight: ["n3"], metricText: "n3=4.0" }),
      step("golden", "Golden", "GOLDEN: psw_n1=1.0; chip_psw=5.2.", ["GOLDEN"], ["1.0/5.2"], { highlight: ["n1"], metricText: "psw n1=1.0" }),
    ],
  },
  "leakage-power": {
    kind: "power",
    title: "Leakage power",
    module: "module01-03-leakage-power",
    steps: [
      step("formula", "Pleak formula", "Pleak = Ileak · V per net.", ["Pleak"], ["I·V"], { highlight: ["n1"], metricText: "Pleak=Ileak·V" }),
      step("n1", "Net n1", "n1: Ileak=0.1, V=1 → Pleak=0.1.", ["n1"], ["0.1"], { highlight: ["n1"], metricText: "n1=0.1" }),
      step("n2", "Net n2", "n2: Ileak=0.05 → Pleak=0.05.", ["n2"], ["0.05"], { highlight: ["n2"], metricText: "n2=0.05" }),
      step("n3", "Net n3", "n3: Ileak=0.2 → Pleak=0.2.", ["n3"], ["0.2"], { highlight: ["n3"], metricText: "n3=0.2" }),
      step("golden", "Golden", "GOLDEN: plk_n1=0.1; chip_plk=0.35.", ["GOLDEN"], ["0.1/0.35"], { highlight: ["n1"], metricText: "plk n1=0.1" }),
    ],
  },
  "total-power": {
    kind: "power",
    title: "Total power",
    module: "module02-01-total-power",
    steps: [
      step("sum", "Chip Ptot", "Ptot = Psw + Pleak per net; sum for chip.", ["Ptot"], ["sw+lk"], { highlight: ["n1", "n2", "n3"], metricText: "Psw+Pleak" }),
      step("n1", "Net n1", "n1: 1.0 + 0.1 = 1.1.", ["n1"], ["1.1"], { highlight: ["n1"], metricText: "n1=1.1" }),
      step("chip_sw", "Chip Psw", "Chip switching total 5.2.", ["chip"], ["5.2"], { highlight: ["n1", "n2", "n3"], metricText: "Psw=5.2" }),
      step("chip_lk", "Chip Pleak", "Chip leakage total 0.35.", ["chip"], ["0.35"], { metricText: "Pleak=0.35" }),
      step("golden", "Golden", "GOLDEN: chip_ptot=5.55.", ["GOLDEN"], ["5.55"], { highlight: ["n1", "n2", "n3"], metricText: "chip=5.55" }),
    ],
  },
  "activity-factors": {
    kind: "power",
    title: "Activity factors",
    module: "module02-03-activity-factors",
    steps: [
      step("alpha", "Alpha per net", "Activity α scales switching — read per net.", ["alpha"], ["α"], { highlight: ["n1", "n2", "n3"], metricText: "activity α" }),
      step("n1a", "n1 α", "n1 α=0.5.", ["n1"], ["0.5"], { highlight: ["n1"], metricText: "α n1=0.5" }),
      step("n2a", "n2 α", "n2 α=0.2.", ["n2"], ["0.2"], { highlight: ["n2"], metricText: "α n2=0.2" }),
      step("n3a", "n3 α", "n3 α=1.0 (fully active).", ["n3"], ["1.0"], { highlight: ["n3"], metricText: "α n3=1.0" }),
      step("golden", "Golden", "GOLDEN: alphas n1=0.5, n2=0.2, n3=1.0.", ["GOLDEN"], ["0.5/0.2/1.0"], { highlight: ["n1", "n2", "n3"], metricText: "alphas ok" }),
    ],
  },
  "power-grid": {
    kind: "power",
    title: "Power grid",
    module: "module03-01-power-grid",
    steps: [
      step("path", "Series path", "Grid src→a→b→sink with 3 series edges.", ["grid"], ["4 nodes"], { highlight: ["src", "a", "b", "sink", "e1", "e2", "e3"], metricText: "series path" }),
      step("e1", "Edge e1", "e1: src→a, R=1.", ["e1"], ["R=1"], { highlight: ["e1", "src", "a"], metricText: "e1 R=1" }),
      step("e2", "Edge e2", "e2: a→b, R=2.", ["e2"], ["R=2"], { highlight: ["e2", "a", "b"], metricText: "e2 R=2" }),
      step("e3", "Edge e3", "e3: b→sink, R=1.", ["e3"], ["R=1"], { highlight: ["e3", "b", "sink"], metricText: "e3 R=1" }),
      step("golden", "Golden", "GOLDEN: 4 nodes, 3 edges series.", ["GOLDEN"], ["4/3"], { highlight: ["src", "a", "b", "sink"], metricText: "4 nodes / 3 edges" }),
    ],
  },
  "ir-drop": {
    kind: "power",
    title: "IR drop",
    module: "module03-03-ir-drop",
    steps: [
      step("solve", "IR solve", "Same I on series path; accumulate IR drops.", ["IR"], ["I·R"], { highlight: ["e1", "e2", "e3"], metricText: "IR series" }),
      step("i", "Current", "i_sink=0.1 A on every edge.", ["i_sink"], ["0.1"], { metricText: "I=0.1" }),
      step("drops", "Edge drops", "Drops 0.1 + 0.2 + 0.1 = 0.4 V.", ["drops"], ["0.4"], { highlight: ["e1", "e2", "e3"], metricText: "drop=0.4" }),
      step("vsink", "Sink voltage", "v_sink = 1.0 − 0.4 = 0.6 V.", ["sink"], ["0.6"], { highlight: ["sink"], irVolts: { src: 1.0, a: 0.9, b: 0.7, sink: 0.6 }, metricText: "v_sink=0.6" }),
      step("golden", "Golden", "GOLDEN: ir_drop_sink=0.4, v_sink=0.6.", ["GOLDEN"], ["0.4/0.6"], { highlight: ["sink"], irVolts: { src: 1.0, a: 0.9, b: 0.7, sink: 0.6 }, metricText: "ir_drop=0.4" }),
    ],
  },
  "em-literacy": {
    kind: "power",
    title: "EM literacy",
    module: "module04-01-em-literacy",
    steps: [
      step("limit", "Current limit", "em_limit=0.08 A per edge.", ["em_limit"], ["0.08"], { metricText: "limit=0.08" }),
      step("i", "Grid current", "i_sink=0.1 exceeds limit on all edges.", ["i_sink"], ["0.1"], { highlight: ["e1", "e2", "e3"], metricText: "I=0.1" }),
      step("e1", "Edge e1", "e1: 0.1 > 0.08 — EM violation.", ["e1"], ["fail"], { highlight: ["e1"], markers: [{ kind: "em", edge: "e1" }], metricText: "e1 fail" }),
      step("e23", "Edges e2 e3", "e2 and e3 also violate.", ["e2", "e3"], ["fail"], { highlight: ["e2", "e3"], metricText: "e2/e3 fail" }),
      step("golden", "Golden", "GOLDEN: em_violation_count=3.", ["GOLDEN"], ["3"], { highlight: ["e1", "e2", "e3"], markers: [{ kind: "em", edge: "e1" }, { kind: "em", edge: "e2" }, { kind: "em", edge: "e3" }], metricText: "em=3" }),
    ],
  },
  "power-markers": {
    kind: "power",
    title: "Power markers",
    module: "module04-03-power-markers",
    steps: [
      step("ir", "IR marker", "One IR drop hit at sink.", ["ir_drop"], ["1"], { highlight: ["sink"], markers: [{ kind: "ir_drop", node: "sink" }], metricText: "IR=1" }),
      step("em", "EM markers", "Three EM hits on e1,e2,e3.", ["em"], ["3"], { highlight: ["e1", "e2", "e3"], metricText: "EM=3" }),
      step("kind", "Marker kinds", "kind=ir_drop or em on each hit.", ["kind"], ["ir/em"], { metricText: "ir_drop + em" }),
      step("collect", "Collect all", "Union IR + EM markers for signoff.", ["collect"], ["4"], { metricText: "collect" }),
      step("golden", "Golden", "GOLDEN: marker_count=4.", ["GOLDEN"], ["4"], { highlight: ["sink", "e1", "e2", "e3"], markers: [{ kind: "ir_drop", node: "sink" }, { kind: "em", edge: "e1" }, { kind: "em", edge: "e2" }, { kind: "em", edge: "e3" }], metricText: "markers=4" }),
    ],
  },
  "power-engine": {
    kind: "power",
    title: "Power engine",
    module: "module05-01-power-engine",
    steps: [
      step("stats", "Stats snapshot", "3 nets, 3 grid edges, Vdd=1.", ["stats"], ["3/3"], { metricText: "3 nets / 3 edges" }),
      step("power", "Power totals", "Psw n1=1.0; chip Ptot=5.55.", ["power"], ["5.55"], { highlight: ["n1"], metricText: "chip Ptot" }),
      step("ir", "IR check", "ir_drop_sink=0.4; 1 IR violation.", ["ir"], ["0.4"], { highlight: ["sink"], metricText: "IR viol=1" }),
      step("em", "EM check", "3 EM violations on grid edges.", ["em"], ["3"], { highlight: ["e1", "e2", "e3"], metricText: "EM=3" }),
      step("ok", "Engine OK", "GOLDEN: engine ok=True.", ["GOLDEN"], ["ok"], { highlight: ["n1", "sink"], metricText: "ok=true" }),
    ],
  },
};
