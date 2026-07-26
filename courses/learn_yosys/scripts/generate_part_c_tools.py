#!/usr/bin/env python3
"""Generate Part C Yosys algorithm tools + walkthrough packs."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
COURSE = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "platform" / "tools"
WALK = TOOLS / "algorithm-walkthrough"
CAPTURE = ROOT / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} — EDA Algorithms Platform</title>
  <link rel="stylesheet" href="../../assets/site.css">
  <link rel="stylesheet" href="../../assets/tools-shared.css">
  <link rel="stylesheet" href="../../assets/clustering-lab.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="site-header-inner">
    <p class="brand"><a href="../../index.html">EDA Algorithms Platform</a></p>
    <nav class="site-nav"><a href="../index.html" class="is-active">Tools</a></nav>
  </div></header>
  <main id="main">
    <div class="eyebrow">Interactive tool</div>
    <section class="hero"><h1>{title}</h1><p class="lead">{lead}</p></section>
    <div id="lab-root"></div>
  </main>
  <script type="module" src="{lab}.js"></script>
  <script src="../../assets/site.js"></script>
</body>
</html>
"""

IMP = """import { ALGO_GOLDENS } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, body):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveAlgoYosysLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{body}\n  ],\n}});\n",
    }


LABS = {
    "proc-mux": ch(
        "proc_mux",
        "Run ProcMux; confirm one $mux cell.",
        """    { id: "run", title: "ProcMux", level: "Intro", prompt: "Click ProcMux.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => api.getMode() === "proc_mux" },
    { id: "mux1", title: "mux=1", level: "Intro", prompt: "muxCount 1.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => api.getLast().muxCount === ALGO_GOLDENS.procMuxCells },
    { id: "type", title: "$mux type", level: "Practice", prompt: "$mux present.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$mux") },
    { id: "no-combo", title: "Combo gone", level: "Practice", prompt: "no combo process.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => !api.getDesign().processes.some(p => p.kind === "combo") },
    { id: "sel", title: "Select mux", level: "Practice", prompt: "Select mux cell.",
      setup: (_c, api) => { api.showProcMux(); api.select(api.getLast().added[0]); },
      check: (_c, api) => api.getSelected().length === 1 },
    { id: "y", title: "Y is y", level: "Practice", prompt: "mux Y=y.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => api.getDesign().cells.find(c => c.type === "$mux")?.Y === "y" },
    { id: "sync-kept", title: "Sync kept", level: "Challenge", prompt: "sync process still there.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => api.getDesign().processes.some(p => p.kind === "sync") },
    { id: "golden", title: "procMuxCells", level: "Challenge", prompt: "procMuxCells=1.",
      check: () => ALGO_GOLDENS.procMuxCells === 1 },""",
    ),
    "proc-dff-arst": ch(
        "proc_dff + ARST",
        "Run ProcDff; $dff with ARST; processes=0.",
        """    { id: "run", title: "ProcDff", level: "Intro", prompt: "Click ProcDff.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getMode() === "proc_dff" },
    { id: "dff1", title: "dff=1", level: "Intro", prompt: "dffCount 1.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getLast().dffCount === 1 },
    { id: "arst", title: "Has ARST", level: "Practice", prompt: "hasArst true.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getLast().hasArst === true },
    { id: "proc0", title: "processes=0", level: "Practice", prompt: "no processes.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getLast().processes === 0 },
    { id: "mux", title: "Mux too", level: "Practice", prompt: "$mux also present.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$mux") },
    { id: "sel", title: "Select dff", level: "Practice", prompt: "Select dff.",
      setup: (_c, api) => { api.showProcDff(); api.select(api.getLast().added[0]); },
      check: (_c, api) => api.getSelected().length === 1 },
    { id: "q", title: "Q is q", level: "Challenge", prompt: "dff Q=q.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getDesign().cells.find(c => c.type === "$dff")?.Q === "q" },
    { id: "golden", title: "procDffCells", level: "Challenge", prompt: "procDffCells=1.",
      check: () => ALGO_GOLDENS.procDffCells === 1 },""",
    ),
    "opt-clean-expr": ch(
        "opt_clean + opt_expr",
        "OptClean removes 2; OptExpr folds 1 const buf.",
        """    { id: "clean", title: "OptClean", level: "Intro", prompt: "Click OptClean.",
      setup: (_c, api) => api.showOptClean(), check: (_c, api) => api.getMode() === "opt_clean" },
    { id: "rm2", title: "removed=2", level: "Intro", prompt: "removedCount 2.",
      setup: (_c, api) => api.showOptClean(), check: (_c, api) => api.getLast().removedCount === ALGO_GOLDENS.optCleanRemoved },
    { id: "expr", title: "OptExpr", level: "Practice", prompt: "Click OptExpr.",
      setup: (_c, api) => api.showOptExpr(), check: (_c, api) => api.getMode() === "opt_expr" },
    { id: "fold1", title: "folded=1", level: "Practice", prompt: "foldedCount 1.",
      setup: (_c, api) => api.showOptExpr(), check: (_c, api) => api.getLast().foldedCount === ALGO_GOLDENS.optExprFolded },
    { id: "no-buf", title: "No dead buf", level: "Practice", prompt: "c_buf0 gone after clean.",
      setup: (_c, api) => api.showOptClean(), check: (_c, api) => !api.getDesign().cells.some(c => c.id === "c_buf0") },
    { id: "keep-mux", title: "Keep mux", level: "Practice", prompt: "$mux kept.",
      setup: (_c, api) => api.showOptClean(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$mux") },
    { id: "sel", title: "Select and", level: "Challenge", prompt: "Select an $and.",
      setup: (_c, api) => { api.showOptClean(); const a = api.getDesign().cells.find(c => c.type === "$and"); if (a) api.select(a.id); },
      check: (_c, api) => api.getSelected().some(id => api.getDesign().cells.find(c => c.id === id)?.type === "$and") },
    { id: "golden", title: "clean+expr goldens", level: "Challenge", prompt: "removed=2 folded=1.",
      check: () => ALGO_GOLDENS.optCleanRemoved === 2 && ALGO_GOLDENS.optExprFolded === 1 },""",
    ),
    "opt-merge-algo": ch(
        "opt_merge",
        "OptMerge duplicate $and; andCount=1.",
        """    { id: "run", title: "OptMerge", level: "Intro", prompt: "Click OptMerge.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getMode() === "opt_merge" },
    { id: "and1", title: "ands=1", level: "Intro", prompt: "andCount 1.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getLast().andCount === ALGO_GOLDENS.optMergeAnds },
    { id: "rm", title: "Removed dup", level: "Practice", prompt: "removed has c_and2.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getLast().removed.includes("c_and2") },
    { id: "one-and", title: "One $and", level: "Practice", prompt: "exactly one $and.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getDesign().cells.filter(c => c.type === "$and").length === 1 },
    { id: "keep-dff", title: "Keep dff", level: "Practice", prompt: "$dff kept.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$dff") },
    { id: "sel", title: "Select and", level: "Practice", prompt: "Select remaining $and.",
      setup: (_c, api) => { api.showOptMerge(); const a = api.getDesign().cells.find(c => c.type === "$and"); if (a) api.select(a.id); },
      check: (_c, api) => api.getSelected().length === 1 },
    { id: "mode", title: "Mode", level: "Challenge", prompt: "mode opt_merge.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getMode() === "opt_merge" },
    { id: "golden", title: "optMergeAnds", level: "Challenge", prompt: "optMergeAnds=1.",
      check: () => ALGO_GOLDENS.optMergeAnds === 1 },""",
    ),
    "techmap-mapfile": ch(
        "techmap mapfile",
        "Techmap $and → NAND+NOT; nand_not=2.",
        """    { id: "run", title: "Techmap", level: "Intro", prompt: "Click Techmap.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getMode() === "techmap" },
    { id: "nn2", title: "nand_not=2", level: "Intro", prompt: "nandNotCount 2.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getLast().nandNotCount === ALGO_GOLDENS.techmapNandNot },
    { id: "nand", title: "Has NAND", level: "Practice", prompt: "$_NAND_ present.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$_NAND_") },
    { id: "not", title: "Has NOT", level: "Practice", prompt: "$_NOT_ present.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$_NOT_") },
    { id: "mapped", title: "Mapped and", level: "Practice", prompt: "mapped includes c_and1.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getLast().mapped.includes("c_and1") },
    { id: "sel", title: "Select NAND", level: "Practice", prompt: "Select $_NAND_.",
      setup: (_c, api) => { api.showTechmap(); const n = api.getDesign().cells.find(c => c.type === "$_NAND_"); if (n) api.select(n.id); },
      check: (_c, api) => api.getSelected().some(id => api.getDesign().cells.find(c => c.id === id)?.type === "$_NAND_") },
    { id: "keep-dff", title: "Keep dff", level: "Challenge", prompt: "$dff kept.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$dff") },
    { id: "golden", title: "techmapNandNot", level: "Challenge", prompt: "techmapNandNot=2.",
      check: () => ALGO_GOLDENS.techmapNandNot === 2 },""",
    ),
    "extract-subcircuit": ch(
        "extract",
        "Extract AND→OR as ANDOR2 macro; matches=1.",
        """    { id: "run", title: "Extract", level: "Intro", prompt: "Click Extract.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => api.getMode() === "extract" },
    { id: "m1", title: "matches=1", level: "Intro", prompt: "matches 1.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => api.getLast().matches === ALGO_GOLDENS.extractMatches },
    { id: "macro", title: "ANDOR2", level: "Practice", prompt: "macro ANDOR2.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => api.getLast().macro === "ANDOR2" },
    { id: "cell", title: "Macro cell", level: "Practice", prompt: "ANDOR2 cell present.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "ANDOR2") },
    { id: "no-or", title: "OR absorbed", level: "Practice", prompt: "no $or left from pattern.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => !api.getDesign().cells.some(c => c.id === "c_or") },
    { id: "sel", title: "Select macro", level: "Practice", prompt: "Select ANDOR2.",
      setup: (_c, api) => { api.showExtract(); const m = api.getDesign().cells.find(c => c.type === "ANDOR2"); if (m) api.select(m.id); },
      check: (_c, api) => api.getSelected().some(id => api.getDesign().cells.find(c => c.id === id)?.type === "ANDOR2") },
    { id: "mux", title: "Mux kept", level: "Challenge", prompt: "$mux kept.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$mux") },
    { id: "golden", title: "extractMatches", level: "Challenge", prompt: "extractMatches=1.",
      check: () => ALGO_GOLDENS.extractMatches === 1 },""",
    ),
    "memory-map-algo": ch(
        "memory_map",
        "Memory map → $mem width=4 depth=8.",
        """    { id: "run", title: "Memory", level: "Intro", prompt: "Click Memory.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getMode() === "memory" },
    { id: "d8", title: "depth=8", level: "Intro", prompt: "depth 8.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getLast().depth === ALGO_GOLDENS.memoryDepth },
    { id: "w4", title: "width=4", level: "Practice", prompt: "width 4.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getLast().width === ALGO_GOLDENS.memoryWidth },
    { id: "type", title: "$mem type", level: "Practice", prompt: "cell type $mem.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getLast().cell.type === "$mem" },
    { id: "sel", title: "Select mem", level: "Practice", prompt: "Select mem0.",
      setup: (_c, api) => { api.showMemory(); api.select("mem0"); }, check: (_c, api) => api.getSelected().includes("mem0") },
    { id: "count", title: "memCount 1", level: "Practice", prompt: "memCount 1.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getLast().memCount === 1 },
    { id: "mode", title: "Mode", level: "Challenge", prompt: "mode memory.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getMode() === "memory" },
    { id: "golden", title: "memoryDepth", level: "Challenge", prompt: "memoryDepth=8.",
      check: () => ALGO_GOLDENS.memoryDepth === 8 },""",
    ),
    "fsm-detect": ch(
        "fsm_detect",
        "FSM detect: 3 states, 3 transitions, 2 encoding bits.",
        """    { id: "run", title: "FSM", level: "Intro", prompt: "Click FSM.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getMode() === "fsm" },
    { id: "s3", title: "states=3", level: "Intro", prompt: "states 3.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getLast().states === ALGO_GOLDENS.fsmStates },
    { id: "t3", title: "transitions=3", level: "Practice", prompt: "transitions 3.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getLast().transitions === ALGO_GOLDENS.fsmTransitions },
    { id: "bits", title: "encoding bits", level: "Practice", prompt: "encodingBits 2.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getLast().encodingBits === ALGO_GOLDENS.fsmEncodingBits },
    { id: "reset", title: "Reset IDLE", level: "Practice", prompt: "reset IDLE.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getLast().resetState === "IDLE" },
    { id: "sel", title: "Select fsm", level: "Practice", prompt: "Select fsm0.",
      setup: (_c, api) => { api.showFsm(); api.select("fsm0"); }, check: (_c, api) => api.getSelected().includes("fsm0") },
    { id: "names", title: "Has RUN", level: "Challenge", prompt: "RUN in states.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getLast().stateNames.includes("RUN") },
    { id: "golden", title: "fsmStates", level: "Challenge", prompt: "fsmStates=3.",
      check: () => ALGO_GOLDENS.fsmStates === 3 },""",
    ),
    "abc-handoff": ch(
        "ABC handoff",
        "ABC handoff aig_ands=3 after opt_merge.",
        """    { id: "run", title: "ABC", level: "Intro", prompt: "Click ABC.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getMode() === "abc" },
    { id: "a3", title: "aig_ands=3", level: "Intro", prompt: "aigAnds 3.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getLast().aigAnds === ALGO_GOLDENS.abcAigAnds },
    { id: "types", title: "Has $and", level: "Practice", prompt: "$and in types.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getLast().cellTypes.includes("$and") },
    { id: "mux", title: "Has $mux", level: "Practice", prompt: "$mux in types.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getLast().cellTypes.includes("$mux") },
    { id: "note", title: "External ABC", level: "Practice", prompt: "mode abc.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getMode() === "abc" },
    { id: "sel", title: "Select and/mux", level: "Practice", prompt: "Select a cell.",
      setup: (_c, api) => { api.showAbc(); const c = api.getDesign().cells[0]; if (c) api.select(c.id); },
      check: (_c, api) => api.getSelected().length === 1 },
    { id: "gt0", title: "ands>0", level: "Challenge", prompt: "aigAnds > 0.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getLast().aigAnds > 0 },
    { id: "golden", title: "abcAigAnds", level: "Challenge", prompt: "abcAigAnds=3.",
      check: () => ALGO_GOLDENS.abcAigAnds === 3 },""",
    ),
    "yosys-algo-engine": ch(
        "Yosys algo engine",
        "Run Engine; all Part C goldens; ok=True.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "ok", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "mux", title: "mux golden", level: "Practice", prompt: "mux=1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().mux === 1 },
    { id: "clean", title: "clean golden", level: "Practice", prompt: "cleanRemoved=2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().cleanRemoved === 2 },
    { id: "abc", title: "abc golden", level: "Practice", prompt: "abcAnds=3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().abcAnds === 3 },
    { id: "fsm", title: "fsm golden", level: "Practice", prompt: "fsmStates=3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().fsmStates === 3 },
    { id: "tech", title: "techmap golden", level: "Challenge", prompt: "techmapNandNot=2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().techmapNandNot === 2 },
    { id: "golden", title: "engineOk", level: "Challenge", prompt: "engineOk.",
      check: () => ALGO_GOLDENS.engineOk === true },""",
    ),
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def write_algos():
    lines = [
        '/** Part C Yosys algorithm walkthroughs (kind: algo_yosys). */',
        'import {',
        "  STARTER,",
        "  algoProcMux,",
        "  algoProcDff,",
        "  algoOptClean,",
        "  algoOptExpr,",
        "  algoOptMerge,",
        "  algoTechmapMapfile,",
        "  algoExtractIso,",
        "  algoMemoryMap,",
        "  algoFsmDetect,",
        "  algoAbcHandoff,",
        "  yosysAlgoEngine,",
        '} from "../../assets/algo-yosys-core.js";',
        "",
        "function step(id, title, caption, bullets, metrics, extra = {}) {",
        "  return { id, title, caption, bullets, metrics, design: extra.design || STARTER, ...extra };",
        "}",
        "",
        "export const ALGO_YOSYS_ALGOS = {",
    ]
    packs = {
        "proc-mux": (
            "module09-01-proc-mux",
            "proc_mux",
            [
                ("start", "Combo process", "Case on s assigns y from a or b.", ["process"], ["combo"]),
                ("mux", "Emit $mux", "proc_mux builds one $mux.", ["$mux"], ["1"], {"design": None, "fn": "mux"}),
                ("ports", "S/A/B/Y", "Sel s; A=a; B=b; Y=y.", ["ports"], ["s"]),
                ("gone", "Combo removed", "Combo process is gone.", ["clean"], ["0"]),
                ("golden", "Golden", "GOLDEN: mux_count=1.", ["GOLDEN"], ["1"]),
            ],
        ),
        "proc-dff-arst": (
            "module09-03-proc-dff-arst",
            "proc_dff",
            [
                ("sync", "Sync process", "Posedge clk with async reset.", ["sync"], ["clk"]),
                ("dff", "Emit $dff", "proc_dff creates $dff.", ["$dff"], ["1"], {"fn": "dff"}),
                ("arst", "ARST port", "Reset becomes ARST.", ["ARST"], ["rst"]),
                ("done", "Processes=0", "All processes lowered.", ["0"], ["proc"]),
                ("golden", "Golden", "GOLDEN: dff=1 has_arst=True.", ["GOLDEN"], ["ok"]),
            ],
        ),
        "opt-clean-expr": (
            "module10-01-opt-clean-expr",
            "opt_clean/expr",
            [
                ("scan", "Dead cells", "OR to dead and BUF const0.", ["dead"], ["2"]),
                ("clean", "opt_clean", "Remove 2 unused cells.", ["opt_clean"], ["2"], {"fn": "clean"}),
                ("expr", "opt_expr", "Fold const0 BUF.", ["opt_expr"], ["1"], {"fn": "expr"}),
                ("keep", "Keep live", "Mux/DFF/ANDs that fan out stay.", ["keep"], ["live"]),
                ("golden", "Golden", "GOLDEN: removed=2 folded=1.", ["GOLDEN"], ["2/1"]),
            ],
        ),
        "opt-merge-algo": (
            "module10-03-opt-merge-algo",
            "opt_merge",
            [
                ("dup", "Duplicate AND", "Two $and(a,b) cells.", ["dup"], ["2"]),
                ("hash", "Hash key", "Key is type+A+B.", ["hash"], ["key"]),
                ("merge", "Merge", "Drop duplicate; retarget fans.", ["merge"], ["1"], {"fn": "merge"}),
                ("one", "One AND", "and_count=1.", ["$and"], ["1"]),
                ("golden", "Golden", "GOLDEN: and_count=1.", ["GOLDEN"], ["1"]),
            ],
        ),
        "techmap-mapfile": (
            "module11-01-techmap-mapfile",
            "techmap",
            [
                ("rule", "Map rule", "$and → NAND then NOT.", ["mapfile"], ["rule"]),
                ("nand", "Emit NAND", "First cell $_NAND_.", ["$_NAND_"], ["1"], {"fn": "tech"}),
                ("not", "Emit NOT", "Second cell $_NOT_.", ["$_NOT_"], ["1"]),
                ("count", "Count 2", "nand_not_count=2.", ["2"], ["cells"]),
                ("golden", "Golden", "GOLDEN: nand_not=2.", ["GOLDEN"], ["2"]),
            ],
        ),
        "extract-subcircuit": (
            "module11-03-extract-subcircuit",
            "extract",
            [
                ("pat", "Pattern", "AND feeding OR is ANDOR2.", ["pattern"], ["ANDOR"]),
                ("match", "Match", "Find isomorphic subgraph.", ["match"], ["1"], {"fn": "ext"}),
                ("macro", "Macro cell", "Replace with ANDOR2.", ["ANDOR2"], ["1"]),
                ("drop", "Drop pair", "Remove matched $and/$or.", ["drop"], ["2"]),
                ("golden", "Golden", "GOLDEN: matches=1.", ["GOLDEN"], ["1"]),
            ],
        ),
        "memory-map-algo": (
            "module12-01-memory-map-algo",
            "memory_map",
            [
                ("arr", "Array", "Width 4 depth 8.", ["array"], ["4x8"]),
                ("infer", "Infer", "memory_* → $mem.", ["$mem"], ["1"], {"fn": "mem", "showMemory": True}),
                ("ports", "Ports", "Read and write ports counted.", ["ports"], ["rd/wr"]),
                ("size", "SIZE", "SIZE=depth=8.", ["SIZE"], ["8"]),
                ("golden", "Golden", "GOLDEN: depth=8 width=4.", ["GOLDEN"], ["8/4"]),
            ],
        ),
        "fsm-detect": (
            "module12-03-fsm-detect",
            "fsm_detect",
            [
                ("states", "States", "IDLE RUN DONE.", ["states"], ["3"], {"fn": "fsm", "showFsm": True}),
                ("trans", "Transitions", "Three edges.", ["trans"], ["3"]),
                ("enc", "Encoding", "Two bits encode three states.", ["enc"], ["2"]),
                ("reset", "Reset", "Reset state IDLE.", ["reset"], ["IDLE"]),
                ("golden", "Golden", "GOLDEN: states=3 bits=2.", ["GOLDEN"], ["3/2"]),
            ],
        ),
        "abc-handoff": (
            "module13-01-abc-handoff",
            "abc handoff",
            [
                ("opt", "After opt", "Merged netlist ready for ABC.", ["opt"], ["ready"]),
                ("count", "AND budget", "Count AND-ish nodes.", ["AIG"], ["3"], {"fn": "abc"}),
                ("mux", "Mux cost", "Each $mux counts as two ANDs.", ["$mux"], ["2"]),
                ("bridge", "abc pass", "Yosys abc bridges to ABC/ABC9.", ["abc"], ["bridge"]),
                ("golden", "Golden", "GOLDEN: aig_ands=3.", ["GOLDEN"], ["3"]),
            ],
        ),
        "yosys-algo-engine": (
            "module13-03-yosys-algo-engine",
            "algo engine",
            [
                ("all", "All checks", "Engine runs every Part C pass.", ["engine"], ["all"], {"fn": "eng"}),
                ("proc", "proc goldens", "mux=1 dff=1.", ["proc"], ["1/1"]),
                ("opt", "opt goldens", "clean 2 merge ands=1.", ["opt"], ["2/1"]),
                ("map", "map goldens", "techmap 2 extract 1.", ["map"], ["2/1"]),
                ("ok", "OK", "GOLDEN: engine ok=True.", ["GOLDEN"], ["ok"]),
            ],
        ),
    }

    for lab, (mod, title, steps) in packs.items():
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "algo_yosys",')
        lines.append(f'    title: "{title}",')
        lines.append(f'    module: "{mod}",')
        lines.append("    steps: [")
        for st in steps:
            sid, stitle, cap, bullets, metrics = st[0], st[1], st[2], st[3], st[4]
            extra = st[5] if len(st) > 5 else {}
            fn = extra.get("fn")
            design_expr = "STARTER"
            if fn == "mux":
                design_expr = "algoProcMux(STARTER).design"
            elif fn == "dff":
                design_expr = "algoProcDff(STARTER).design"
            elif fn == "clean":
                design_expr = "algoOptClean(STARTER).design"
            elif fn == "expr":
                design_expr = "algoOptExpr(STARTER).design"
            elif fn == "merge":
                design_expr = "algoOptMerge(STARTER).design"
            elif fn == "tech":
                design_expr = "algoTechmapMapfile(STARTER).design"
            elif fn == "ext":
                design_expr = "algoExtractIso(STARTER).design"
            elif fn == "abc":
                design_expr = "algoOptMerge(STARTER).design"
            elif fn == "eng":
                design_expr = "yosysAlgoEngine(STARTER).design"
            show_m = ", showMemory: true" if extra.get("showMemory") else ""
            show_f = ", showFsm: true" if extra.get("showFsm") else ""
            lines.append(
                f'      step("{sid}", "{stitle}", "{cap}", {bullets}, {metrics}, '
                f'{{ design: {design_expr}, stageLabel: "{stitle}", metricText: "{metrics[0]}"{show_m}{show_f} }}),'
            )
        lines.append("    ],")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    text = "\n".join(lines)
    write(COURSE / "scripts" / "_algo_yosys_algos.js", text)
    write(WALK / "algo-yosys-algos.js", text)


def main() -> None:
    for lab, meta in LABS.items():
        write(TOOLS / lab / "index.html", HTML.format(title=meta["title"], lead=meta["lead"], lab=lab))
        write(TOOLS / lab / f"{lab}.js", meta["js"])
    print(f"Wrote {len(LABS)} tools")
    write_algos()

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "ALGO_YOSYS_ALGOS" not in text:
        text = text.replace(
            'import { REAL_YOSYS_ALGOS } from "./real-yosys-algos.js";\n'
            'import { drawRealYosys, STAGES as REAL_YOSYS_STAGES } from "../../assets/real-yosys-core.js";\n',
            'import { REAL_YOSYS_ALGOS } from "./real-yosys-algos.js";\n'
            'import { drawRealYosys, STAGES as REAL_YOSYS_STAGES } from "../../assets/real-yosys-core.js";\n'
            'import { ALGO_YOSYS_ALGOS } from "./algo-yosys-algos.js";\n'
            'import { drawAlgoYosys, STARTER as ALGO_YOSYS_STARTER } from "../../assets/algo-yosys-core.js";\n',
        )
        text = text.replace(
            "  ...REAL_YOSYS_ALGOS,\n};",
            "  ...REAL_YOSYS_ALGOS,\n  ...ALGO_YOSYS_ALGOS,\n};",
        )
        if 'pack.kind === "algo_yosys"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "real_yosys") {',
                '''  } else if (pack.kind === "algo_yosys") {
    drawAlgoYosys(canvas, {
      design: s.design || ALGO_YOSYS_STARTER,
      highlight: s.highlight || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
      showMemory: s.showMemory === true,
      showFsm: s.showFsm === true,
    });
  } else if (pack.kind === "real_yosys") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"proc-mux"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"real-evidence": ("real-evidence", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if "proc-mux" not in it:
        block = """
        <li><a href="proc-mux/">proc_mux</a></li>
        <li><a href="proc-dff-arst/">proc_dff + ARST</a></li>
        <li><a href="opt-clean-expr/">opt_clean + opt_expr</a></li>
        <li><a href="opt-merge-algo/">opt_merge</a></li>
        <li><a href="techmap-mapfile/">techmap mapfile</a></li>
        <li><a href="extract-subcircuit/">extract</a></li>
        <li><a href="memory-map-algo/">memory_map</a></li>
        <li><a href="fsm-detect/">fsm_detect</a></li>
        <li><a href="abc-handoff/">ABC handoff</a></li>
        <li><a href="yosys-algo-engine/">Yosys algo engine</a></li>
"""
        it = it.replace(
            '        <li><a href="real-evidence/">Real Yosys evidence</a></li>\n      </ul>',
            '        <li><a href="real-evidence/">Real Yosys evidence</a></li>\n' + block + "      </ul>",
        )
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools/index.html")

    # capture/media script updates
    write_scripts()
    print("OK")


def write_scripts() -> None:
    labs = [
        ("proc-mux", "module09-01-proc-mux"),
        ("proc-dff-arst", "module09-03-proc-dff-arst"),
        ("opt-clean-expr", "module10-01-opt-clean-expr"),
        ("opt-merge-algo", "module10-03-opt-merge-algo"),
        ("techmap-mapfile", "module11-01-techmap-mapfile"),
        ("extract-subcircuit", "module11-03-extract-subcircuit"),
        ("memory-map-algo", "module12-01-memory-map-algo"),
        ("fsm-detect", "module12-03-fsm-detect"),
        ("abc-handoff", "module13-01-abc-handoff"),
        ("yosys-algo-engine", "module13-03-yosys-algo-engine"),
    ]
    lines = [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        'ROOT=$(cd "$(dirname "$0")/../../.." && pwd)',
        'CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"',
        'SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"',
        'cd "$ROOT"',
    ]
    for lab, mid in labs:
        lines.append(f'python3 "$CAP" "courses/learn_yosys/{mid}" --algo {lab} --inject-transcript')
        lines.append(f'python3 "$SNAP" --lab {lab} --out "courses/learn_yosys/{mid}/assets"')
    lines.append("echo CAPTURE_PARTC_OK")
    write(COURSE / "scripts" / "capture_part_c.sh", "\n".join(lines) + "\n")

    media = [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        'ROOT=$(cd "$(dirname "$0")/../../.." && pwd)',
        'NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"',
        'cd "$ROOT"',
        'bash "$NAR" courses/learn_yosys/module00-00-intro',
    ]
    for _, mid in labs:
        media.append(f'bash "$NAR" "courses/learn_yosys/{mid}"')
    media += [
        'bash "$NAR" courses/learn_yosys/module05-03-offline-benchmark-compare',
        'bash "$NAR" courses/learn_yosys/module99-00-wrap',
        "python3 platform/scripts/publish_course_platform.py learn_yosys",
        "echo MEDIA_PARTC_OK",
    ]
    write(COURSE / "scripts" / "build_part_c_media.sh", "\n".join(media) + "\n")


if __name__ == "__main__":
    main()
