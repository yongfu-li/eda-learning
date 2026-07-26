/** Walkthrough packs for learn_signoff (kind: signoff). */

import { STARTER, GOLDENS, cloneDesign } from "../../assets/signoff-core.js";

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

export const SIGNOFF_ALGOS = {
  corners: {
    kind: "signoff",
    title: "PVT corners",
    module: "module01-01-corners",
    steps: [
      step("pvt", "PVT triple", "Three process/voltage/temperature corners in tiny_signoff.", ["PVT"], ["3"], { highlight: ["ss_0p9_125", "tt_1p0_25", "ff_1p1_m40"], metricText: "corners=3" }),
      step("ss", "Slow slow", "ss_0p9_125: Vdd=0.9, temp=125, derate=1.1.", ["ss"], ["0.9V"], { highlight: ["ss_0p9_125"], metricText: "ss corner" }),
      step("tt", "Typical", "tt_1p0_25: nominal Vdd and temp.", ["tt"], ["1.0V"], { highlight: ["tt_1p0_25"], metricText: "tt corner" }),
      step("ff", "Fast fast", "ff_1p1_m40: fast process, low temp.", ["ff"], ["1.1V"], { highlight: ["ff_1p1_m40"], metricText: "ff corner" }),
      step("golden", "Golden", "GOLDEN: corner_count=3.", ["GOLDEN"], ["3"], { highlight: ["ss_0p9_125", "tt_1p0_25", "ff_1p1_m40"], metricText: "corners=3" }),
    ],
  },
  "signoff-corner": {
    kind: "signoff",
    title: "Signoff corner pick",
    module: "module01-03-signoff-corner",
    steps: [
      step("pick", "Pick corner", "signoff_corner selects the slow-slow signoff PVT.", ["pick"], ["ss"], { highlight: ["ss_0p9_125"], metricText: "ss_0p9_125" }),
      step("vdd", "Vdd 0.9", "Lower Vdd at high temp is the pessimistic corner.", ["vdd"], ["0.9"], { highlight: ["ss_0p9_125"], metricText: "Vdd=0.9" }),
      step("temp", "Temp 125", "Hot slow corner for max delay.", ["temp"], ["125"], { highlight: ["ss_0p9_125"], metricText: "125°C" }),
      step("derate", "Derate 1.1", "Corner derate scales reported delay.", ["derate"], ["1.1"], { highlight: ["ss_0p9_125"], metricText: "derate=1.1" }),
      step("golden", "Golden", "GOLDEN: ss_0p9_125 derate=1.1.", ["GOLDEN"], ["1.1"], { highlight: ["ss_0p9_125"], metricText: "signoff ok" }),
    ],
  },
  derate: {
    kind: "signoff",
    title: "Derate formula",
    module: "module02-01-derate",
    steps: [
      step("formula", "Delay scale", "derated = delay × signoff derate.", ["formula"], ["×1.1"], { highlight: ["ss_0p9_125"], metricText: "delay×derate" }),
      step("in", "Input 1.0", "Nominal path delay before derate.", ["delay"], ["1.0"], { metricText: "delay=1.0" }),
      step("rate", "Derate 1.1", "Read derate from signoff corner.", ["derate"], ["1.1"], { highlight: ["ss_0p9_125"], metricText: "derate=1.1" }),
      step("out", "Result 1.1", "1.0 × 1.1 = 1.1 ns derated.", ["result"], ["1.1"], { metricText: "derated=1.1" }),
      step("golden", "Golden", "GOLDEN: derated=1.1 for delay=1.0.", ["GOLDEN"], ["1.1"], { highlight: ["ss_0p9_125"], metricText: "derated=1.1" }),
    ],
  },
  "check-suite": {
    kind: "signoff",
    title: "Check suite",
    module: "module02-03-check-suite",
    steps: [
      step("suite", "Six checks", "STA, DRC, LVS, ERC, Antenna, IR in the suite.", ["checks"], ["6"], { highlight: ["sta", "drc", "lvs", "erc", "antenna", "ir"], metricText: "checks=6" }),
      step("sta", "STA fail", "STA slack −0.05 — timing fail.", ["sta"], ["fail"], { highlight: ["sta"], metricText: "STA fail" }),
      step("layout", "Layout pass", "DRC, LVS, ERC all pass.", ["drc", "lvs", "erc"], ["pass"], { highlight: ["drc", "lvs", "erc"], metricText: "layout ok" }),
      step("ant", "Antenna fail", "One antenna violation remains.", ["antenna"], ["fail"], { highlight: ["antenna"], metricText: "antenna fail" }),
      step("golden", "Golden", "GOLDEN: fail_count=2 (sta, antenna).", ["GOLDEN"], ["2"], { highlight: ["sta", "antenna"], metricText: "fails=2" }),
    ],
  },
  "eco-loop": {
    kind: "signoff",
    title: "ECO plan",
    module: "module03-01-eco-loop",
    steps: [
      step("plan", "ECO list", "Two ECOs planned for failing checks.", ["ecos"], ["2"], { highlight: ["eco1", "eco2", "sta", "antenna"], showEcos: true, metricText: "ecos=2" }),
      step("eco1", "Buffer ECO", "eco1 buffer on n_crit fixes STA.", ["eco1"], ["sta"], { highlight: ["eco1", "sta"], metricText: "eco1→sta" }),
      step("eco2", "Jumper ECO", "eco2 jumper on n_ant fixes antenna.", ["eco2"], ["antenna"], { highlight: ["eco2", "antenna"], metricText: "eco2→antenna" }),
      step("cover", "Covers all", "Both fails covered by ECO fixes.", ["cover"], ["all"], { highlight: ["sta", "antenna", "eco1", "eco2"], metricText: "fixes_all" }),
      step("golden", "Golden", "GOLDEN: eco_count=2, fixes_all=true.", ["GOLDEN"], ["2"], { highlight: ["eco1", "eco2"], metricText: "ecos=2" }),
    ],
  },
  "apply-ecos": {
    kind: "signoff",
    title: "Apply fixes",
    module: "module03-03-apply-ecos",
    steps: [
      step("apply", "Flip fails", "Apply ECOs — flip sta and antenna to pass.", ["apply"], ["0 fail"], { highlight: ["sta", "antenna"], metricText: "apply ECO" }),
      step("sta", "STA fixed", "STA slack becomes +0.02 after buffer.", ["sta"], ["pass"], { highlight: ["sta"], checks: STARTER.checks.map((c) => (c.id === "sta" ? { ...c, status: "pass", slack: 0.02 } : c)), metricText: "STA pass" }),
      step("ant", "Antenna fixed", "Antenna count zero after jumper.", ["antenna"], ["pass"], { highlight: ["antenna"], checks: STARTER.checks.map((c) => (c.id === "antenna" ? { ...c, status: "pass", count: 0 } : c)), metricText: "antenna pass" }),
      step("rest", "Others hold", "DRC/LVS/ERC/IR remain pass.", ["pass"], ["4"], { highlight: ["drc", "lvs", "erc", "ir"], metricText: "still pass" }),
      step("golden", "Golden", "GOLDEN: fail_count→0 after ECO.", ["GOLDEN"], ["0"], { highlight: ["sta", "antenna", "drc", "lvs", "erc", "ir"], metricText: "fails=0" }),
    ],
  },
  "tapeout-checklist": {
    kind: "signoff",
    title: "Tapeout items",
    module: "module04-01-tapeout-checklist",
    steps: [
      step("items", "Checklist", "Four required tapeout gates plus optional docs.", ["tapeout"], ["4 req"], { showTapeout: true, metricText: "required=4" }),
      step("before", "Before ECO", "Antenna fail blocks tapeout ready.", ["before"], ["not ready"], { highlight: ["t3"], showTapeout: true, metricText: "ready=false" }),
      step("t2", "Layout gate", "DRC/LVS/ERC must pass for t2.", ["t2"], ["pass"], { highlight: ["t2", "drc", "lvs", "erc"], metricText: "layout gate" }),
      step("after", "After ECO", "All required items green after ECO apply.", ["after"], ["ready"], { highlight: ["t1", "t2", "t3", "t4"], showTapeout: true, metricText: "ready=true" }),
      step("golden", "Golden", "GOLDEN: ready only after ECO.", ["GOLDEN"], ["after"], { showTapeout: true, metricText: "tapeout ok" }),
    ],
  },
  "signoff-markers": {
    kind: "signoff",
    title: "Fail markers",
    module: "module04-03-signoff-markers",
    steps: [
      step("kind", "Check fail", "Markers tag each failing check for review.", ["markers"], ["2"], { highlight: ["sta", "antenna"], markers: [{ kind: "check_fail", check: "sta" }, { kind: "check_fail", check: "antenna" }], metricText: "markers=2" }),
      step("sta", "STA marker", "STA fail emits check_fail marker.", ["sta"], ["1"], { highlight: ["sta"], markers: [{ kind: "check_fail", check: "sta", name: "STA" }], metricText: "STA marker" }),
      step("ant", "Antenna marker", "Antenna fail emits second marker.", ["antenna"], ["1"], { highlight: ["antenna"], markers: [{ kind: "check_fail", check: "antenna", name: "Antenna" }], metricText: "antenna marker" }),
      step("pass", "No pass markers", "Passing checks do not emit markers.", ["pass"], ["0"], { highlight: ["drc", "lvs"], metricText: "pass silent" }),
      step("golden", "Golden", "GOLDEN: marker_count=2.", ["GOLDEN"], ["2"], { highlight: ["sta", "antenna"], markers: [{ kind: "check_fail", check: "sta" }, { kind: "check_fail", check: "antenna" }], metricText: "markers=2" }),
    ],
  },
  "signoff-engine": {
    kind: "signoff",
    title: "Stats snapshot",
    module: "module05-01-signoff-engine",
    steps: [
      step("stats", "Design stats", "3 corners, 6 checks, 2 ECOs in toy.", ["stats"], ["3/6/2"], { metricText: "stats ok" }),
      step("corner", "Corner pick", "Signoff corner ss_0p9_125 derate 1.1.", ["corner"], ["ss"], { highlight: ["ss_0p9_125"], metricText: "corner ok" }),
      step("checks", "Check fails", "Two fails before ECO; tapeout blocked.", ["checks"], ["2"], { highlight: ["sta", "antenna"], metricText: "fails=2" }),
      step("eco", "ECO + tapeout", "ECOs fix all; tapeout ready after.", ["eco"], ["ready"], { highlight: ["eco1", "eco2"], metricText: "eco ok" }),
      step("golden", "Golden", "GOLDEN: engine ok=True.", ["GOLDEN"], ["ok"], { metricText: `ok=${GOLDENS.engineOk}` }),
    ],
  },
};
