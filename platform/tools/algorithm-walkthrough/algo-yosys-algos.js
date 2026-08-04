/** Part C Yosys algorithm walkthroughs (kind: algo_yosys). */
import {
  STARTER,
  algoProcMux,
  algoProcDff,
  algoOptClean,
  algoOptExpr,
  algoOptMerge,
  algoTechmapMapfile,
  algoExtractIso,
  algoMemoryMap,
  algoFsmDetect,
  algoAbcHandoff,
  yosysAlgoEngine,
} from "../../assets/algo-yosys-core.js";

function step(id, title, caption, bullets, metrics, extra = {}) {
  return { id, title, caption, bullets, metrics, design: extra.design || STARTER, ...extra };
}

export const ALGO_YOSYS_ALGOS = {
  "proc-mux": {
    kind: "algo_yosys",
    title: "proc_mux",
    module: "module09-01-proc-mux",
    steps: [
      step("start", "Combo process", "Case on s assigns y from a or b.", ['process'], ['combo'], { design: STARTER, stageLabel: "Combo process", metricText: "combo" }),
      step("mux", "Emit $mux", "proc_mux builds one $mux.", ['$mux'], ['1'], { design: algoProcMux(STARTER).design, stageLabel: "Emit $mux", metricText: "1" }),
      step("ports", "S/A/B/Y", "Sel s; A=a; B=b; Y=y.", ['ports'], ['s'], { design: STARTER, stageLabel: "S/A/B/Y", metricText: "s" }),
      step("gone", "Combo removed", "Combo process is gone.", ['clean'], ['0'], { design: STARTER, stageLabel: "Combo removed", metricText: "0" }),
      step("golden", "Golden", "GOLDEN: mux_count=1.", ['GOLDEN'], ['1'], { design: STARTER, stageLabel: "Golden", metricText: "1" }),
    ],
  },
  "proc-dff-arst": {
    kind: "algo_yosys",
    title: "proc_dff",
    module: "module09-03-proc-dff-arst",
    steps: [
      step("sync", "Sync process", "Posedge clk with async reset.", ['sync'], ['clk'], { design: STARTER, stageLabel: "Sync process", metricText: "clk" }),
      step("dff", "Emit $adff", "Real Yosys emits $adff when async reset is present.", ['$adff'], ['1'], { design: algoProcDff(STARTER).design, stageLabel: "Emit $adff", metricText: "1" }),
      step("arst", "ARST port", "Reset becomes ARST on the $adff.", ['ARST'], ['rst'], { design: STARTER, stageLabel: "ARST port", metricText: "rst" }),
      step("done", "Processes=0", "All processes lowered.", ['0'], ['proc'], { design: STARTER, stageLabel: "Processes=0", metricText: "proc" }),
      step("golden", "Golden", "GOLDEN: type=$adff has_arst=True.", ['GOLDEN'], ['ok'], { design: STARTER, stageLabel: "Golden", metricText: "ok" }),
    ],
  },
  "opt-clean-expr": {
    kind: "algo_yosys",
    title: "opt_clean/expr",
    module: "module10-01-opt-clean-expr",
    steps: [
      step("scan", "Dead cells", "OR to dead and BUF const0.", ['dead'], ['2'], { design: STARTER, stageLabel: "Dead cells", metricText: "2" }),
      step("clean", "opt_clean", "Remove 2 unused cells.", ['opt_clean'], ['2'], { design: algoOptClean(STARTER).design, stageLabel: "opt_clean", metricText: "2" }),
      step("expr", "opt_expr", "Fold const0 BUF.", ['opt_expr'], ['1'], { design: algoOptExpr(STARTER).design, stageLabel: "opt_expr", metricText: "1" }),
      step("keep", "Keep live", "Mux/DFF/ANDs that fan out stay.", ['keep'], ['live'], { design: STARTER, stageLabel: "Keep live", metricText: "live" }),
      step("golden", "Golden", "GOLDEN: removed=2 folded=1.", ['GOLDEN'], ['2/1'], { design: STARTER, stageLabel: "Golden", metricText: "2/1" }),
    ],
  },
  "opt-merge-algo": {
    kind: "algo_yosys",
    title: "opt_merge",
    module: "module10-03-opt-merge-algo",
    steps: [
      step("dup", "Duplicate AND", "Two $and(a,b) cells.", ['dup'], ['2'], { design: STARTER, stageLabel: "Duplicate AND", metricText: "2" }),
      step("hash", "Hash key", "Key is type+A+B.", ['hash'], ['key'], { design: STARTER, stageLabel: "Hash key", metricText: "key" }),
      step("merge", "Merge", "Drop duplicate; retarget fans.", ['merge'], ['1'], { design: algoOptMerge(STARTER).design, stageLabel: "Merge", metricText: "1" }),
      step("one", "One AND", "and_count=1.", ['$and'], ['1'], { design: STARTER, stageLabel: "One AND", metricText: "1" }),
      step("golden", "Golden", "GOLDEN: and_count=1.", ['GOLDEN'], ['1'], { design: STARTER, stageLabel: "Golden", metricText: "1" }),
    ],
  },
  "techmap-mapfile": {
    kind: "algo_yosys",
    title: "techmap",
    module: "module11-01-techmap-mapfile",
    steps: [
      step("rule", "Map rule", "$and → NAND then NOT.", ['mapfile'], ['rule'], { design: STARTER, stageLabel: "Map rule", metricText: "rule" }),
      step("nand", "Emit NAND", "First cell $_NAND_.", ['$_NAND_'], ['1'], { design: algoTechmapMapfile(STARTER).design, stageLabel: "Emit NAND", metricText: "1" }),
      step("not", "Emit NOT", "Second cell $_NOT_.", ['$_NOT_'], ['1'], { design: STARTER, stageLabel: "Emit NOT", metricText: "1" }),
      step("count", "Count 2", "nand_not_count=2.", ['2'], ['cells'], { design: STARTER, stageLabel: "Count 2", metricText: "cells" }),
      step("golden", "Golden", "GOLDEN: nand_not=2.", ['GOLDEN'], ['2'], { design: STARTER, stageLabel: "Golden", metricText: "2" }),
    ],
  },
  "extract-subcircuit": {
    kind: "algo_yosys",
    title: "extract",
    module: "module11-03-extract-subcircuit",
    steps: [
      step("pat", "Pattern", "AND feeding OR is ANDOR2.", ['pattern'], ['ANDOR'], { design: STARTER, stageLabel: "Pattern", metricText: "ANDOR" }),
      step("match", "Match", "Find isomorphic subgraph.", ['match'], ['1'], { design: algoExtractIso(STARTER).design, stageLabel: "Match", metricText: "1" }),
      step("macro", "Macro cell", "Replace with ANDOR2.", ['ANDOR2'], ['1'], { design: STARTER, stageLabel: "Macro cell", metricText: "1" }),
      step("drop", "Drop pair", "Remove matched $and/$or.", ['drop'], ['2'], { design: STARTER, stageLabel: "Drop pair", metricText: "2" }),
      step("golden", "Golden", "GOLDEN: matches=1.", ['GOLDEN'], ['1'], { design: STARTER, stageLabel: "Golden", metricText: "1" }),
    ],
  },
  "memory-map-algo": {
    kind: "algo_yosys",
    title: "memory_map",
    module: "module12-01-memory-map-algo",
    steps: [
      step("arr", "Array", "Width 4 depth 8.", ['array'], ['4x8'], { design: STARTER, stageLabel: "Array", metricText: "4x8" }),
      step("infer", "Infer", "memory_* → $mem.", ['$mem'], ['1'], { design: STARTER, stageLabel: "Infer", metricText: "1", showMemory: true }),
      step("ports", "Ports", "Read and write ports counted.", ['ports'], ['rd/wr'], { design: STARTER, stageLabel: "Ports", metricText: "rd/wr" }),
      step("size", "SIZE", "SIZE=depth=8.", ['SIZE'], ['8'], { design: STARTER, stageLabel: "SIZE", metricText: "8" }),
      step("golden", "Golden", "GOLDEN: depth=8 width=4.", ['GOLDEN'], ['8/4'], { design: STARTER, stageLabel: "Golden", metricText: "8/4" }),
    ],
  },
  "fsm-detect": {
    kind: "algo_yosys",
    title: "fsm_detect",
    module: "module12-03-fsm-detect",
    steps: [
      step("states", "States", "IDLE RUN DONE.", ['states'], ['3'], { design: STARTER, stageLabel: "States", metricText: "3", showFsm: true }),
      step("trans", "Transitions", "Three edges.", ['trans'], ['3'], { design: STARTER, stageLabel: "Transitions", metricText: "3" }),
      step("enc", "Encoding", "Two bits encode three states.", ['enc'], ['2'], { design: STARTER, stageLabel: "Encoding", metricText: "2" }),
      step("reset", "Reset", "Reset state IDLE.", ['reset'], ['IDLE'], { design: STARTER, stageLabel: "Reset", metricText: "IDLE" }),
      step("golden", "Golden", "GOLDEN: states=3 bits=2.", ['GOLDEN'], ['3/2'], { design: STARTER, stageLabel: "Golden", metricText: "3/2" }),
    ],
  },
  "abc-handoff": {
    kind: "algo_yosys",
    title: "abc handoff",
    module: "module13-01-abc-handoff",
    steps: [
      step("opt", "After opt", "Merged netlist ready for ABC.", ['opt'], ['ready'], { design: STARTER, stageLabel: "After opt", metricText: "ready" }),
      step("count", "AND budget", "Count AND-ish nodes.", ['AIG'], ['3'], { design: algoOptMerge(STARTER).design, stageLabel: "AND budget", metricText: "3" }),
      step("mux", "Mux cost", "Each $mux counts as two ANDs.", ['$mux'], ['2'], { design: STARTER, stageLabel: "Mux cost", metricText: "2" }),
      step("bridge", "abc pass", "Yosys abc bridges to ABC/ABC9.", ['abc'], ['bridge'], { design: STARTER, stageLabel: "abc pass", metricText: "bridge" }),
      step("golden", "Golden", "GOLDEN: aig_ands=3.", ['GOLDEN'], ['3'], { design: STARTER, stageLabel: "Golden", metricText: "3" }),
    ],
  },
  "yosys-algo-engine": {
    kind: "algo_yosys",
    title: "algo engine",
    module: "module13-03-yosys-algo-engine",
    steps: [
      step("all", "All checks", "Engine runs every Part C pass.", ['engine'], ['all'], { design: yosysAlgoEngine(STARTER).design, stageLabel: "All checks", metricText: "all" }),
      step("proc", "proc goldens", "mux=1 dff=1.", ['proc'], ['1/1'], { design: STARTER, stageLabel: "proc goldens", metricText: "1/1" }),
      step("opt", "opt goldens", "clean 2 merge ands=1.", ['opt'], ['2/1'], { design: STARTER, stageLabel: "opt goldens", metricText: "2/1" }),
      step("map", "map goldens", "techmap 2 extract 1.", ['map'], ['2/1'], { design: STARTER, stageLabel: "map goldens", metricText: "2/1" }),
      step("ok", "OK", "GOLDEN: engine ok=True.", ['GOLDEN'], ['ok'], { design: STARTER, stageLabel: "OK", metricText: "ok" }),
    ],
  },
};
