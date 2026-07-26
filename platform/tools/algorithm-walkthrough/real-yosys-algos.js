/** Walkthrough packs for real Yosys labs (kind: real_yosys). */
import { STAGES } from "../../assets/real-yosys-core.js";

function step(id, title, caption, bullets, metrics, extra = {}) {
  return { id, title, caption, bullets, metrics, ...extra };
}

export const REAL_YOSYS_ALGOS = {
  "yosys-cli": {
    kind: "real_yosys",
    title: "Yosys CLI",
    module: "module06-01-yosys-cli",
    steps: [
      step("empty", "Empty design", "No RTL loaded — recipe starts empty.", ["CLI"], ["empty"], { stage: STAGES.empty }),
      step("read", "read_verilog", "Load rtl/tiny_and_or.v into Yosys.", ["read_verilog"], ["RTL"], { stage: STAGES.read_hierarchy }),
      step("hier", "hierarchy -top", "hierarchy -check -top top sets the design root.", ["hierarchy"], ["top"], { stage: STAGES.read_hierarchy }),
      step("proc", "proc next", "Third command is proc — processes become cells.", ["proc"], ["3rd"], { stage: STAGES.proc }),
      step("golden", "Golden order", "GOLDEN: read → hierarchy → proc.", ["GOLDEN"], ["prefix"], { stage: STAGES.proc, metricText: "prefix ok" }),
    ],
  },
  "rtlil-vocab": {
    kind: "real_yosys",
    title: "RTLIL vocabulary",
    module: "module06-03-rtlil-vocab",
    steps: [
      step("mods", "Two modules", "top + child after hierarchy.", ["modules"], ["2"], { stage: STAGES.read_hierarchy, highlightTypes: ["$and"] }),
      step("proc", "Process in child", "Child still has 1 process.", ["process"], ["1"], { stage: STAGES.read_hierarchy, metricText: "processes=1" }),
      step("and", "$and×2", "Two $and cells — duplicate assign.", ["$and"], ["2"], { stage: STAGES.read_hierarchy, highlightTypes: ["$and"] }),
      step("ornot", "$or and $not", "OR/NOT appear as $or / $not.", ["$or", "$not"], ["types"], { stage: STAGES.read_hierarchy, highlightTypes: ["$or", "$not"] }),
      step("golden", "Golden", "GOLDEN: modules=2 processes=1 and=2.", ["GOLDEN"], ["2/1/2"], { stage: STAGES.read_hierarchy, highlightTypes: ["$and"], metricText: "GOLDEN" }),
    ],
  },
  "real-proc": {
    kind: "real_yosys",
    title: "Real proc",
    module: "module07-01-real-proc",
    steps: [
      step("before", "Before: process", "No $dff yet — child still has a process.", ["before"], ["process"], { stage: STAGES.read_hierarchy }),
      step("run", "proc runs", "proc creates $dff from always @(posedge clk).", ["proc"], ["$dff"], { stage: STAGES.proc, highlightTypes: ["$dff"] }),
      step("clear", "Processes cleared", "processes → 0 after proc.", ["processes"], ["0"], { stage: STAGES.proc, metricText: "processes=0" }),
      step("dff", "$dff present", "$dff cell appears in the design.", ["$dff"], ["1"], { stage: STAGES.proc, highlightTypes: ["$dff"] }),
      step("golden", "Golden", "GOLDEN: processes=0 has_dff=True.", ["GOLDEN"], ["ok"], { stage: STAGES.proc, highlightTypes: ["$dff"], metricText: "GOLDEN" }),
    ],
  },
  "real-flatten-opt": {
    kind: "real_yosys",
    title: "Real flatten & opt",
    module: "module07-03-real-flatten-opt",
    steps: [
      step("hier", "Before flatten", "Still two modules with a child instance.", ["hierarchy"], ["2"], { stage: STAGES.proc }),
      step("flat", "flatten", "Child $dff inlined — module_count=1.", ["flatten"], ["1"], { stage: STAGES.flatten }),
      step("four", "Four cells", "$and $or $not $dff remain.", ["cells"], ["4"], { stage: STAGES.flatten, highlightTypes: ["$and", "$dff"] }),
      step("opt", "opt merge", "opt leaves and_count=1.", ["opt"], ["and=1"], { stage: STAGES.opt, highlightTypes: ["$and"] }),
      step("golden", "Golden", "GOLDEN: flat cells=4; opt and=1.", ["GOLDEN"], ["4/1"], { stage: STAGES.opt, metricText: "GOLDEN" }),
    ],
  },
  "aigmap-synth": {
    kind: "real_yosys",
    title: "aigmap & synth",
    module: "module08-01-aigmap-synth",
    steps: [
      step("opt", "Before aigmap", "opt netlist with $and/$or/$not/$dff.", ["opt"], ["4"], { stage: STAGES.opt }),
      step("aig", "aigmap", "Maps to $_AND_/$_NOT_ — cells=7.", ["aigmap"], ["7"], { stage: STAGES.aigmap, highlightTypes: ["$_AND_", "$_NOT_"] }),
      step("synth", "synth recipe", "synth -top top runs the built-in flow.", ["synth"], ["recipe"], { stage: STAGES.synth }),
      step("out", "AOI3 + DFF", "Result: $_AOI3_ and $_DFF_P_.", ["$_AOI3_", "$_DFF_P_"], ["2"], { stage: STAGES.synth, highlightTypes: ["$_AOI3_", "$_DFF_P_"] }),
      step("golden", "Golden", "GOLDEN: synth cells=2.", ["GOLDEN"], ["2"], { stage: STAGES.synth, highlightTypes: ["$_AOI3_"], metricText: "GOLDEN" }),
    ],
  },
  "real-evidence": {
    kind: "real_yosys",
    title: "Real evidence engine",
    module: "module08-03-real-evidence",
    steps: [
      step("recipe", "Full recipe", "read→hierarchy→proc→flatten→opt→synth→stat→write.", ["recipe"], ["8"], { stage: STAGES.synth, metricText: "recipe" }),
      step("rtlil", "RTLIL checks", "modules/processes/$and goldens hold.", ["RTLIL"], ["ok"], { stage: STAGES.read_hierarchy, highlightTypes: ["$and"] }),
      step("mid", "proc+flatten", "dff created; flatten cells=4.", ["proc", "flatten"], ["4"], { stage: STAGES.flatten, highlightTypes: ["$dff"] }),
      step("synth", "synth out", "$_AOI3_ + $_DFF_P_.", ["synth"], ["2"], { stage: STAGES.synth, highlightTypes: ["$_AOI3_", "$_DFF_P_"] }),
      step("ok", "OK", "GOLDEN: engine_ok=True.", ["GOLDEN"], ["ok"], { stage: STAGES.synth, metricText: "ok=True" }),
    ],
  },
};
