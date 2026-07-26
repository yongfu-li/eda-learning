/** Walkthrough packs for learn_antenna (kind: antenna). */
import { STARTER, GOLDENS, cloneDesign } from "../../assets/antenna-core.js";

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

export const ANTENNA_ALGOS = {
  "metal-area": {
    kind: "antenna",
    title: "Metal area per net",
    module: "module01-01-metal-area",
    steps: [
      step("sum", "Sum metal", "Sum metal area per net from layer shapes.", ["metals"], ["area"], { highlight: ["n1", "m1"], metricText: "metal area" }),
      step("n1", "Net n1", "n1 has one layer-2 metal m1 area 25.", ["n1"], ["25"], { highlight: ["n1", "m1"], metricText: "n1=25" }),
      step("n2", "Net n2", "n2 metal m2 area 8.", ["n2"], ["8"], { highlight: ["n2", "m2"], metricText: "n2=8" }),
      step("n3", "Net n3", "n3 metals m3+m3b sum to 45.", ["n3"], ["45"], { highlight: ["n3", "m3", "m3b"], metricText: "n3=45" }),
      step("golden", "Golden", "GOLDEN: metal_area n1=25.", ["GOLDEN"], ["25"], { highlight: ["n1"], metricText: "n1=25" }),
    ],
  },
  "gate-area": {
    kind: "antenna",
    title: "Gate area per net",
    module: "module01-03-gate-area",
    steps: [
      step("gates", "Gate shapes", "Each gate polygon contributes area on its net.", ["gates"], ["area"], { highlight: ["g1", "g2", "g3"], metricText: "gate area" }),
      step("n1g", "n1 gate", "g1 on n1 area 1.", ["n1"], ["1"], { highlight: ["n1", "g1"], metricText: "n1 gate=1" }),
      step("n2g", "n2 gate", "g2 on n2 area 2.", ["n2"], ["2"], { highlight: ["n2", "g2"], metricText: "n2 gate=2" }),
      step("n3g", "n3 gate", "g3 on n3 area 1.", ["n3"], ["1"], { highlight: ["n3", "g3"], metricText: "n3 gate=1" }),
      step("golden", "Golden", "GOLDEN: gate_area n1=1.", ["GOLDEN"], ["1"], { highlight: ["n1", "g1"], metricText: "n1=1" }),
    ],
  },
  "antenna-ratio": {
    kind: "antenna",
    title: "Antenna ratio",
    module: "module02-01-antenna-ratio",
    steps: [
      step("formula", "Ratio formula", "ratio = metal_area / gate_area per net.", ["ratio"], ["m/g"], { highlight: ["n1", "n2", "n3"], metricText: "metal/gate" }),
      step("n1r", "n1", "n1: 25/1 = 25.", ["n1"], ["25"], { highlight: ["n1", "m1", "g1"], metricText: "n1=25" }),
      step("n2r", "n2", "n2: 8/2 = 4.", ["n2"], ["4"], { highlight: ["n2", "m2", "g2"], metricText: "n2=4" }),
      step("n3r", "n3", "n3: 45/1 = 45.", ["n3"], ["45"], { highlight: ["n3", "m3", "g3"], metricText: "n3=45" }),
      step("golden", "Golden", "GOLDEN: n1=25, n2=4, n3=45.", ["GOLDEN"], ["25/4/45"], { highlight: ["n1", "n2", "n3"], metricText: "ratios ok" }),
    ],
  },
  "charge-accumulation": {
    kind: "antenna",
    title: "Charge accumulation",
    module: "module02-03-charge-accumulation",
    steps: [
      step("k", "Charge k", "Q = k × metal_area; k=1 on toy.", ["charge_k"], ["1"], { highlight: ["n1"], metricText: "Q=k×metal" }),
      step("n1q", "n1 Q", "n1 metal 25 → Q=25.", ["n1"], ["25"], { highlight: ["n1", "m1"], metricText: "Q n1=25" }),
      step("n2q", "n2 Q", "n2 Q=8.", ["n2"], ["8"], { highlight: ["n2"], metricText: "Q n2=8" }),
      step("n3q", "n3 Q", "n3 Q=45.", ["n3"], ["45"], { highlight: ["n3"], metricText: "Q n3=45" }),
      step("golden", "Golden", "GOLDEN: charge_n1=25.", ["GOLDEN"], ["25"], { highlight: ["n1"], metricText: "Q n1=25" }),
    ],
  },
  "threshold-rules": {
    kind: "antenna",
    title: "Threshold rules",
    module: "module03-01-threshold-rules",
    steps: [
      step("limit", "Limit", "limit_ratio=10; flag ratio > limit.", ["limit"], ["10"], { metricText: "limit=10" }),
      step("n1v", "n1 fail", "n1 ratio 25 > 10 — violation.", ["n1"], ["25"], { highlight: ["n1"], metricText: "n1 fail" }),
      step("n2ok", "n2 ok", "n2 ratio 4 ≤ 10 — pass.", ["n2"], ["4"], { highlight: ["n2"], metricText: "n2 ok" }),
      step("n3v", "n3 fail", "n3 ratio 45 > 10 — violation.", ["n3"], ["45"], { highlight: ["n3"], metricText: "n3 fail" }),
      step("golden", "Golden", "GOLDEN: raw violations=2 (n1,n3).", ["GOLDEN"], ["2"], { highlight: ["n1", "n3"], markers: [{ kind: "antenna_ratio", net: "n1" }, { kind: "antenna_ratio", net: "n3" }], metricText: "raw=2" }),
    ],
  },
  "diode-protection": {
    kind: "antenna",
    title: "Diode protection",
    module: "module03-03-diode-protection",
    steps: [
      step("diode", "Protect diode", "d1 on n3 protects that net.", ["diode"], ["n3"], { highlight: ["n3", "d1"], metricText: "diode n3" }),
      step("skip", "Skip protected", "Protected nets skip ratio check.", ["protected"], ["n3"], { highlight: ["d1", "n3"], metricText: "skip n3" }),
      step("n1v", "n1 still", "n1 ratio 25 still violates.", ["n1"], ["25"], { highlight: ["n1"], metricText: "n1 fail" }),
      step("n3ok", "n3 waived", "n3 waived by diode.", ["n3"], ["waived"], { highlight: ["n3", "d1"], metricText: "n3 waived" }),
      step("golden", "Golden", "GOLDEN: violations=1 (n1 only).", ["GOLDEN"], ["1"], { highlight: ["n1"], markers: [{ kind: "antenna_ratio", net: "n1" }], metricText: "violations=1" }),
    ],
  },
  "jumper-break": {
    kind: "antenna",
    title: "Jumper break",
    module: "module04-01-jumper-break",
    steps: [
      step("jumper", "Add jumper", "Jumper caps max metal layer on a net.", ["jumper"], ["max_layer"], { highlight: ["n1"], metricText: "jumper" }),
      step("before", "Before", "n1 ratio 25 with layer-2 metal.", ["before"], ["25"], { highlight: ["n1", "m1"], metricText: "before=25" }),
      step("cap", "Cap L1", "max_layer=1 drops m1 (layer 2).", ["cap"], ["L1"], { highlight: ["m1"], metricText: "drop L2" }),
      step("after", "After", "n1 metal area 0 → ratio 0.", ["after"], ["0"], { highlight: ["n1"], metricText: "after=0" }),
      step("golden", "Golden", "GOLDEN: jumper_n1_ratio=0.", ["GOLDEN"], ["0"], { highlight: ["n1"], metricText: "n1=0" }),
    ],
  },
  "antenna-markers": {
    kind: "antenna",
    title: "Antenna markers",
    module: "module04-03-antenna-markers",
    steps: [
      step("viol", "Violations", "Each ratio hit becomes a marker.", ["violations"], ["hits"], { highlight: ["n1"], metricText: "hits" }),
      step("n1m", "n1 marker", "n1 ratio 25 > limit.", ["n1"], ["1"], { highlight: ["n1"], markers: [{ kind: "antenna_ratio", net: "n1" }], metricText: "n1 marker" }),
      step("n3skip", "n3 skipped", "n3 protected by diode — no marker.", ["n3"], ["0"], { highlight: ["n3", "d1"], metricText: "n3 none" }),
      step("kind", "Kind", "kind=antenna_ratio on each hit.", ["kind"], ["antenna_ratio"], { metricText: "antenna_ratio" }),
      step("golden", "Golden", "GOLDEN: marker_count=1.", ["GOLDEN"], ["1"], { highlight: ["n1"], markers: [{ kind: "antenna_ratio", net: "n1" }], metricText: "markers=1" }),
    ],
  },
  "antenna-engine": {
    kind: "antenna",
    title: "Antenna engine",
    module: "module05-01-antenna-engine",
    steps: [
      step("stats", "Stats", "3 gates, 4 metals, 3 nets.", ["stats"], ["3/4/3"], { metricText: "3 gates / 4 metals" }),
      step("ratios", "Ratios", "n1=25, n2=4, n3=45.", ["ratios"], ["25/4/45"], { highlight: ["n1", "n2", "n3"], metricText: "ratios" }),
      step("viol", "Violations", "After diode: 1 violation on n1.", ["violations"], ["1"], { highlight: ["n1"], metricText: "viol=1" }),
      step("jmp", "Jumper", "Jumper demo: n1 ratio → 0.", ["jumper"], ["0"], { highlight: ["n1"], metricText: "jumper n1=0" }),
      step("ok", "OK", "GOLDEN: engine ok=True.", ["GOLDEN"], ["ok"], { highlight: ["n1", "n2", "n3"], metricText: "ok=true" }),
    ],
  },
};
