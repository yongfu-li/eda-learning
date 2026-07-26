/** Walkthrough packs for learn_yosys (kind: yosys). */

import {
  STARTER,
  GOLDENS,
  cloneDesign,
  passHierarchyFlatten,
  passOptDce,
  passAigStrash,
  passRewrite,
  passTechmap,
  passSynthScript,
} from "../../assets/yosys-core.js";

function step(id, title, caption, bullets, metrics, extra = {}) {
  return {
    id,
    title,
    caption,
    bullets,
    metrics,
    design: extra.design || cloneDesign(STARTER),
    ...extra,
  };
}

export const YOSYS_ALGOS = {
  "proc-elaborate": {
    kind: "yosys",
    title: "Proc elaborate",
    module: "module01-01-proc-elaborate",
    steps: [
      step("gates", "RTL gate view", "Six gate-level cells after proc on tiny_and_or.", ["proc"], ["6"], { highlight: ["c1", "c2", "c3", "c4", "c5", "c6"], stageLabel: "proc", metricText: "cells=6" }),
      step("and1", "AND c1", "c1: AND(a,b)→n1 in top module.", ["AND"], ["c1"], { highlight: ["c1"], metricText: "c1 AND" }),
      step("or", "OR c2", "c2: OR(n1,c)→n2 feeds NOT.", ["OR"], ["c2"], { highlight: ["c2"], metricText: "c2 OR" }),
      step("dup", "Duplicate AND", "c3 duplicates c1 — strash target later.", ["AND"], ["c3"], { highlight: ["c3"], metricText: "c3 dup" }),
      step("golden", "Golden", "GOLDEN: rtl_cell_count=6.", ["GOLDEN"], ["6"], { highlight: ["c1", "c2", "c3", "c4", "c5", "c6"], metricText: "cells=6" }),
    ],
  },
  "hierarchy-flatten": {
    kind: "yosys",
    title: "Hierarchy flatten",
    module: "module01-03-hierarchy-flatten",
    steps: [
      step("two", "Two modules", "top holds comb; child holds DFF c6.", ["modules"], ["2"], { highlight: ["c6"], stageLabel: "before flatten", metricText: "modules=2" }),
      step("child", "child DFF", "c6 DFF lives in child before flatten.", ["DFF"], ["child"], { highlight: ["c6"], metricText: "module=child" }),
      step("flat", "Flatten pass", "flatten moves all cells into top.", ["flatten"], ["1"], { design: passHierarchyFlatten(STARTER).design, highlight: ["c6"], stageLabel: "flatten", metricText: "modules=1" }),
      step("top", "All in top", "Every cell module field becomes top.", ["top"], ["6"], { design: passHierarchyFlatten(STARTER).design, highlight: ["c1", "c6"], metricText: "all top" }),
      step("golden", "Golden", "GOLDEN: after_flatten_modules=1.", ["GOLDEN"], ["1"], { design: passHierarchyFlatten(STARTER).design, metricText: "modules=1" }),
    ],
  },
  "opt-dce": {
    kind: "yosys",
    title: "Opt / DCE",
    module: "module02-01-opt-dce",
    steps: [
      step("scan", "Dead BUF scan", "opt finds BUF tied to const0.", ["opt"], ["c4"], { highlight: ["c4"], stageLabel: "opt/DCE", metricText: "dead c4" }),
      step("buf", "BUF c4", "c4: BUF(const0)→dead never reaches PO.", ["BUF"], ["dead"], { highlight: ["c4"], metricText: "BUF dead" }),
      step("drop", "Remove c4", "DCE drops unreachable dead cell.", ["DCE"], ["−1"], { design: passOptDce(STARTER).design, removed: ["c4"], highlight: ["c4"], metricText: "removed c4" }),
      step("five", "Five cells", "Remaining comb+seq after opt.", ["cells"], ["5"], { design: passOptDce(STARTER).design, metricText: "cells=5" }),
      step("golden", "Golden", "GOLDEN: after_opt_cells=5.", ["GOLDEN"], ["5"], { design: passOptDce(STARTER).design, metricText: "cells=5" }),
    ],
  },
  "aig-strash": {
    kind: "yosys",
    title: "AIG strash",
    module: "module02-03-aig-strash",
    steps: [
      step("hash", "Hash key table", "Identical AND(a,b) keys merge.", ["strash"], ["AND"], { stageLabel: "strash", metricText: "hash AND" }),
      step("c1c3", "c1 and c3", "Both AND(a,b) — c3 is duplicate.", ["dup"], ["c1,c3"], { highlight: ["c1", "c3"], metricText: "dup AND" }),
      step("merge", "Merge n3→n1", "Retarget fans; drop c3.", ["merge"], ["n3"], { design: passAigStrash(STARTER).design, removed: ["c3"], merged: ["n3"], highlight: ["c3"], metricText: "merge n3" }),
      step("four", "Four cells", "One AND remains after strash.", ["cells"], ["4"], { design: passAigStrash(STARTER).design, metricText: "cells=4" }),
      step("golden", "Golden", "GOLDEN: after_strash_cells=4.", ["GOLDEN"], ["4"], { design: passAigStrash(STARTER).design, metricText: "cells=4" }),
    ],
  },
  "rewrite-balance": {
    kind: "yosys",
    title: "Rewrite balance",
    module: "module03-01-rewrite-balance",
    steps: [
      step("pair", "OR+NOT pair", "c2 OR feeds c5 NOT on out.", ["rewrite"], ["OR,NOT"], { highlight: ["c2", "c5"], stageLabel: "rewrite", metricText: "OR+NOT" }),
      step("absorb", "Absorb to NOR", "Replace OR+NOT with single NOR.", ["NOR"], ["rw_c2"], { design: passRewrite(STARTER).design, removed: ["c2", "c5"], highlight: ["rw_c2"], metricText: "NOR" }),
      step("comb", "Comb count", "Two combinational cells after rewrite.", ["comb"], ["2"], { design: passRewrite(STARTER).design, metricText: "comb=2" }),
      step("seq", "Seq hold", "DFF c6 unchanged — seq=1.", ["DFF"], ["1"], { design: passRewrite(STARTER).design, highlight: ["c6"], metricText: "seq=1" }),
      step("golden", "Golden", "GOLDEN: after_rewrite_cells=3.", ["GOLDEN"], ["3"], { design: passRewrite(STARTER).design, metricText: "cells=3" }),
    ],
  },
  "techmap-area": {
    kind: "yosys",
    title: "Techmap area",
    module: "module03-03-techmap-area",
    steps: [
      step("lib", "NAND2 library", "Map AND/NOR to NAND2 cells.", ["techmap"], ["NAND2"], { stageLabel: "techmap area", showNand: true, metricText: "NAND lib" }),
      step("and", "AND → 2 NAND", "Each AND uses two NAND (inverter trick).", ["AND"], ["2"], { design: passTechmap(STARTER, "area").design, showNand: true, metricText: "AND map" }),
      step("nor", "NOR → 4 NAND", "NOR mapped with four NAND in area mode.", ["NOR"], ["4"], { design: passTechmap(STARTER, "area").design, showNand: true, metricText: "NOR map" }),
      step("count", "NAND count", "Count pure NAND2 instances.", ["count"], ["6"], { design: passTechmap(STARTER, "area").design, showNand: true, metricText: "nand=6" }),
      step("golden", "Golden", "GOLDEN: techmap_nand_count_area=6.", ["GOLDEN"], ["6"], { design: passTechmap(STARTER, "area").design, showNand: true, metricText: "nand=6" }),
    ],
  },
  "techmap-delay": {
    kind: "yosys",
    title: "Techmap delay",
    module: "module04-01-techmap-delay",
    steps: [
      step("extra", "Extra buffer NAND", "Delay mode adds buffer NAND on NOR path.", ["delay"], ["+1"], { stageLabel: "techmap delay", showNand: true, metricText: "delay mode" }),
      step("nor5", "NOR five NAND", "NOR path uses five NAND vs four in area.", ["NOR"], ["5"], { design: passTechmap(STARTER, "delay").design, showNand: true, metricText: "NOR delay" }),
      step("total", "Total NAND", "Seven NAND2 cells in delay mapping.", ["total"], ["7"], { design: passTechmap(STARTER, "delay").design, showNand: true, metricText: "nand=7" }),
      step("trade", "Area vs delay", "Compare nand=6 area vs nand=7 delay.", ["trade"], ["6/7"], { metricText: "6 vs 7" }),
      step("golden", "Golden", "GOLDEN: techmap_nand_count_delay=7.", ["GOLDEN"], ["7"], { design: passTechmap(STARTER, "delay").design, showNand: true, metricText: "nand=7" }),
    ],
  },
  "synth-script": {
    kind: "yosys",
    title: "Synth script",
    module: "module04-03-synth-script",
    steps: [
      step("chain", "Pass recipe chain", "proc → flatten → opt → strash → rewrite → techmap.", ["synth"], ["6 passes"], { stageLabel: "synth recipe", metricText: "full chain" }),
      step("proc", "proc step", "Start from RTL gate netlist.", ["proc"], ["6"], { metricText: "proc" }),
      step("mid", "Mid passes", "opt/strash/rewrite shrink to mapped base.", ["opt"], ["3"], { design: passRewrite(STARTER).design, metricText: "rewrite=3" }),
      step("map", "techmap area", "Final techmap emits NAND library.", ["techmap"], ["6 nand"], { design: passSynthScript(STARTER).design, showNand: true, metricText: "mapped" }),
      step("golden", "Golden", "GOLDEN: synth recipe completes.", ["GOLDEN"], ["ok"], { design: passSynthScript(STARTER).design, showNand: true, metricText: "synth ok" }),
    ],
  },
  "yosys-engine": {
    kind: "yosys",
    title: "Yosys engine",
    module: "module05-01-yosys-engine",
    steps: [
      step("snap", "Pipeline snapshot", "Engine runs all passes and compares goldens.", ["engine"], ["all"], { stageLabel: "yosys_engine", metricText: "pipeline" }),
      step("opt", "Opt golden", "after_opt_cells=5.", ["opt"], ["5"], { metricText: "opt=5" }),
      step("strash", "Strash golden", "after_strash_cells=4.", ["strash"], ["4"], { metricText: "strash=4" }),
      step("report", "Report stats", "report cells=7 wires=11 after synth.", ["report"], ["7/11"], { design: passSynthScript(STARTER).design, showNand: true, metricText: "7/11" }),
      step("golden", "Golden", "GOLDEN: engine_ok=True.", ["GOLDEN"], ["ok"], { metricText: `ok=${GOLDENS.engineOk}` }),
    ],
  },
};
