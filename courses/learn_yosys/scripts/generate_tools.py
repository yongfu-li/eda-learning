#!/usr/bin/env python3
"""Generate learn_yosys tools + wire walkthrough."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
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

IMP = """import { GOLDENS } from "../../assets/yosys-core.js";
import { createInteractiveYosysLab } from "../../assets/interactive-yosys-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveYosysLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "proc-elaborate": ch(
        "Proc elaborate",
        "Run proc; confirm rtl_cell_count=6.",
        """    { id: "run", title: "Proc", level: "Intro", prompt: "Click Proc.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getMode() === "proc" },
    { id: "c6", title: "Cells 6", level: "Intro", prompt: "cell count 6.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getLast().cellCount === GOLDENS.rtlCellCount },
    { id: "c1", title: "AND c1", level: "Practice", prompt: "c1 present.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getDesign().cells.some(c => c.id === "c1" && c.type === "AND") },
    { id: "c2", title: "OR c2", level: "Practice", prompt: "c2 OR present.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getDesign().cells.some(c => c.id === "c2") },
    { id: "sel", title: "Select c3", level: "Practice", prompt: "Click c3.",
      setup: (_c, api) => { api.showProc(); api.selectCell("c3"); }, check: (_c, api) => api.getSelected().includes("c3") },
    { id: "mod", title: "Modules 2", level: "Practice", prompt: "module count 2.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getStats().moduleCount === GOLDENS.moduleCount },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode proc.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getMode()==="proc" },
    { id: "golden", title: "rtlCellCount", level: "Challenge", prompt: "rtlCellCount=6.", check: () => GOLDENS.rtlCellCount === 6 },""",
    ),
    "hierarchy-flatten": ch(
        "Hierarchy flatten",
        "Run flatten; module_count→1.",
        """    { id: "run", title: "Flatten", level: "Intro", prompt: "Click Flatten.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getMode() === "flatten" },
    { id: "m1", title: "Modules 1", level: "Intro", prompt: "module count 1.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getLast().moduleCount === GOLDENS.afterFlattenModules },
    { id: "top", title: "All top", level: "Practice", prompt: "c6 module top.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getDesign().cells.find(c => c.id === "c6")?.module === "top" },
    { id: "c6", title: "DFF kept", level: "Practice", prompt: "c6 still present.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getDesign().cells.some(c => c.id === "c6") },
    { id: "sel", title: "Select c6", level: "Practice", prompt: "Select c6.",
      setup: (_c, api) => { api.showFlatten(); api.selectCell("c6"); }, check: (_c, api) => api.getSelected().includes("c6") },
    { id: "cells", title: "Cells 6", level: "Practice", prompt: "still 6 cells.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getDesign().cells.length === 6 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode flatten.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getMode()==="flatten" },
    { id: "golden", title: "afterFlattenModules", level: "Challenge", prompt: "afterFlattenModules=1.", check: () => GOLDENS.afterFlattenModules === 1 },""",
    ),
    "opt-dce": ch(
        "Opt / DCE",
        "Run opt; remove c4; cells=5.",
        """    { id: "run", title: "Opt", level: "Intro", prompt: "Click Opt.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => api.getMode() === "opt" },
    { id: "c5", title: "Cells 5", level: "Intro", prompt: "cell count 5.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => api.getLast().cellCount === GOLDENS.afterOptCells },
    { id: "rm", title: "Removed c4", level: "Practice", prompt: "c4 removed.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => api.getLast().removed.includes("c4") },
    { id: "no", title: "No c4", level: "Practice", prompt: "c4 gone from design.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => !api.getDesign().cells.some(c => c.id === "c4") },
    { id: "sel", title: "Select c1", level: "Practice", prompt: "Select c1.",
      setup: (_c, api) => { api.showOpt(); api.selectCell("c1"); }, check: (_c, api) => api.getSelected().includes("c1") },
    { id: "dff", title: "DFF kept", level: "Practice", prompt: "c6 still present.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => api.getDesign().cells.some(c => c.id === "c6") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode opt.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => api.getMode()==="opt" },
    { id: "golden", title: "afterOptCells", level: "Challenge", prompt: "afterOptCells=5.", check: () => GOLDENS.afterOptCells === 5 },""",
    ),
    "aig-strash": ch(
        "AIG strash",
        "Run strash; merge c3; cells=4.",
        """    { id: "run", title: "Strash", level: "Intro", prompt: "Click Strash.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => api.getMode() === "strash" },
    { id: "c4", title: "Cells 4", level: "Intro", prompt: "cell count 4.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => api.getLast().cellCount === GOLDENS.afterStrashCells },
    { id: "mg", title: "Merged n3", level: "Practice", prompt: "n3 merged.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => api.getLast().merged.includes("n3") },
    { id: "no", title: "No c3", level: "Practice", prompt: "c3 removed.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => !api.getDesign().cells.some(c => c.id === "c3") },
    { id: "sel", title: "Select c1", level: "Practice", prompt: "Select c1.",
      setup: (_c, api) => { api.showStrash(); api.selectCell("c1"); }, check: (_c, api) => api.getSelected().includes("c1") },
    { id: "and", title: "One AND", level: "Practice", prompt: "one AND left.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => api.getDesign().cells.filter(c => c.type === "AND").length === 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode strash.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => api.getMode()==="strash" },
    { id: "golden", title: "afterStrashCells", level: "Challenge", prompt: "afterStrashCells=4.", check: () => GOLDENS.afterStrashCells === 4 },""",
    ),
    "rewrite-balance": ch(
        "Rewrite balance",
        "Run rewrite; OR+NOT→NOR; cells=3.",
        """    { id: "run", title: "Rewrite", level: "Intro", prompt: "Click Rewrite.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getMode() === "rewrite" },
    { id: "c3", title: "Cells 3", level: "Intro", prompt: "cell count 3.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getLast().cellCount === GOLDENS.afterRewriteCells },
    { id: "comb", title: "Comb 2", level: "Practice", prompt: "comb count 2.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getLast().combCount === GOLDENS.afterRewriteComb },
    { id: "seq", title: "Seq 1", level: "Practice", prompt: "seq count 1.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getLast().seqCount === GOLDENS.afterRewriteSeq },
    { id: "nor", title: "NOR cell", level: "Practice", prompt: "NOR present.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "NOR") },
    { id: "sel", title: "Select DFF", level: "Practice", prompt: "Select c6.",
      setup: (_c, api) => { api.showRewrite(); api.selectCell("c6"); }, check: (_c, api) => api.getSelected().includes("c6") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode rewrite.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getMode()==="rewrite" },
    { id: "golden", title: "afterRewriteCells", level: "Challenge", prompt: "afterRewriteCells=3.", check: () => GOLDENS.afterRewriteCells === 3 },""",
    ),
    "techmap-area": ch(
        "Techmap area",
        "Run TechmapArea; nand_count=6.",
        """    { id: "run", title: "TechmapArea", level: "Intro", prompt: "Click TechmapArea.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getMode() === "techmap_area" },
    { id: "n6", title: "NAND 6", level: "Intro", prompt: "nand count 6.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getLast().nandCount === GOLDENS.techmapNandCountArea },
    { id: "nand", title: "NAND2 cells", level: "Practice", prompt: "NAND2 present.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "NAND2") },
    { id: "dff", title: "DFF kept", level: "Practice", prompt: "DFF still present.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "DFF") },
    { id: "mode", title: "area mode", level: "Practice", prompt: "mode area.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getLast().mode === "area" },
    { id: "sel", title: "Select NAND", level: "Practice", prompt: "Select a NAND2.",
      setup: (_c, api) => { api.showTechmapArea(); api.selectCell("nd1"); }, check: (_c, api) => api.getSelected().includes("nd1") },
    { id: "cells", title: "Cell count", level: "Practice", prompt: "cells > 3.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getLast().cellCount > 3 },
    { id: "golden", title: "techmapNandCountArea", level: "Challenge", prompt: "techmapNandCountArea=6.", check: () => GOLDENS.techmapNandCountArea === 6 },""",
    ),
    "techmap-delay": ch(
        "Techmap delay",
        "Run TechmapDelay; nand_count=7.",
        """    { id: "run", title: "TechmapDelay", level: "Intro", prompt: "Click TechmapDelay.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getMode() === "techmap_delay" },
    { id: "n7", title: "NAND 7", level: "Intro", prompt: "nand count 7.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getLast().nandCount === GOLDENS.techmapNandCountDelay },
    { id: "gt", title: "More than area", level: "Practice", prompt: "nand > area count.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getLast().nandCount > GOLDENS.techmapNandCountArea },
    { id: "mode", title: "delay mode", level: "Practice", prompt: "mode delay.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getLast().mode === "delay" },
    { id: "nand", title: "NAND2 cells", level: "Practice", prompt: "NAND2 present.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getDesign().cells.filter(c => c.type === "NAND2").length === 7 },
    { id: "sel", title: "Select nd1", level: "Practice", prompt: "Select nd1.",
      setup: (_c, api) => { api.showTechmapDelay(); api.selectCell("nd1"); }, check: (_c, api) => api.getSelected().includes("nd1") },
    { id: "dff", title: "DFF kept", level: "Practice", prompt: "DFF present.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "DFF") },
    { id: "golden", title: "techmapNandCountDelay", level: "Challenge", prompt: "techmapNandCountDelay=7.", check: () => GOLDENS.techmapNandCountDelay === 7 },""",
    ),
    "synth-script": ch(
        "Synth script",
        "Run Synth; full pass recipe completes.",
        """    { id: "run", title: "Synth", level: "Intro", prompt: "Click Synth.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getMode() === "synth" },
    { id: "nand", title: "NAND mapped", level: "Intro", prompt: "nand count 6.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getLast().nandCount === GOLDENS.techmapNandCountArea },
    { id: "pass", title: "synth pass", level: "Practice", prompt: "pass synth.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getLast().pass === "synth" },
    { id: "nand2", title: "NAND2 cells", level: "Practice", prompt: "NAND2 in design.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "NAND2") },
    { id: "dff", title: "DFF kept", level: "Practice", prompt: "DFF present.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "DFF") },
    { id: "cells", title: "Cell count", level: "Practice", prompt: "cells > 6.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getLast().cellCount >= 7 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode synth.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getMode()==="synth" },
    { id: "golden", title: "techmapNandCountArea", level: "Challenge", prompt: "recipe nand=6.", check: (_c, api) => { api.showSynth(); return api.getLast().nandCount === 6; } },""",
    ),
    "yosys-engine": ch(
        "Yosys engine",
        "Run Engine; confirm ok and report 7/11.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "opt", title: "Opt 5", level: "Practice", prompt: "opt cells 5.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().opt.cellCount === GOLDENS.afterOptCells },
    { id: "st", title: "Strash 4", level: "Practice", prompt: "strash cells 4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().strash.cellCount === GOLDENS.afterStrashCells },
    { id: "rep", title: "Report 7/11", level: "Practice", prompt: "report cells 7 wires 11.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().report.cellCount === GOLDENS.reportCellsSynth && api.getLast().report.wireCount === GOLDENS.reportWiresSynth },
    { id: "area", title: "NAND area 6", level: "Practice", prompt: "area nand 6.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().area.nandCount === GOLDENS.techmapNandCountArea },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode()==="engine" },
    { id: "golden", title: "engineOk", level: "Challenge", prompt: "engineOk=true.", check: () => GOLDENS.engineOk === true },""",
    ),
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def main() -> None:
    for lab, meta in LABS.items():
        write(TOOLS / lab / "index.html", HTML.format(title=meta["title"], lead=meta["lead"], lab=lab))
        write(TOOLS / lab / f"{lab}.js", meta["js"])
    print(f"Wrote {len(LABS)} tools")

    write(WALK / "yosys-algos.js", (Path(__file__).parent / "_yosys_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "YOSYS_ALGOS" not in text:
        text = text.replace(
            'import { SIGNOFF_ALGOS } from "./signoff-algos.js";\n'
            'import { drawSignoff, STARTER as SIGNOFF_STARTER } from "../../assets/signoff-core.js";\n',
            'import { SIGNOFF_ALGOS } from "./signoff-algos.js";\n'
            'import { drawSignoff, STARTER as SIGNOFF_STARTER } from "../../assets/signoff-core.js";\n'
            'import { YOSYS_ALGOS } from "./yosys-algos.js";\n'
            'import { drawYosys, STARTER as YOSYS_STARTER } from "../../assets/yosys-core.js";\n',
        )
        text = text.replace(
            "  ...SIGNOFF_ALGOS,\n};",
            "  ...SIGNOFF_ALGOS,\n  ...YOSYS_ALGOS,\n};",
        )
        if 'pack.kind === "yosys"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "erc") {',
                '''  } else if (pack.kind === "yosys") {
    drawYosys(canvas, {
      design: s.design || YOSYS_STARTER,
      highlight: s.highlight || [],
      removed: s.removed || [],
      merged: s.merged || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
      showNand: s.showNand === true,
    });
  } else if (pack.kind === "erc") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"proc-elaborate"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"signoff-engine": ("signoff-engine", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")
        else:
            print("WARN: could not patch LAB_TO_ALGO — signoff-engine needle missing")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="yosys"' not in it:
        section = """
    <section class="tool-section" id="yosys">
      <h2>Yosys passes</h2>
      <ul class="tool-list">
        <li><a href="proc-elaborate/">Proc elaborate</a></li>
        <li><a href="hierarchy-flatten/">Hierarchy flatten</a></li>
        <li><a href="opt-dce/">Opt / DCE</a></li>
        <li><a href="aig-strash/">AIG strash</a></li>
        <li><a href="rewrite-balance/">Rewrite balance</a></li>
        <li><a href="techmap-area/">Techmap area</a></li>
        <li><a href="techmap-delay/">Techmap delay</a></li>
        <li><a href="synth-script/">Synth script</a></li>
        <li><a href="yosys-engine/">Yosys engine</a></li>
      </ul>
    </section>

"""
        signoff_end = '    </section>\n\n    <section class="tool-section" id="spice">'
        if signoff_end in it:
            it = it.replace(signoff_end, '    </section>\n' + section + '\n    <section class="tool-section" id="spice">')
        elif 'id="spice"' in it:
            it = it.replace(
                '    <section class="tool-section" id="spice">',
                section + '    <section class="tool-section" id="spice">',
            )
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools/index.html")
    print("OK")


if __name__ == "__main__":
    main()
