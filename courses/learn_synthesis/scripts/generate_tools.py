#!/usr/bin/env python3
"""Generate learn_synthesis tools + wire walkthrough."""
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

IMP = """import { GOLDENS, LIBRARY, AIG_NODES } from "../../assets/synthesis-core.js";
import { createInteractiveSynthesisLab } from "../../assets/interactive-synthesis-lab.js";
const root = document.getElementById("lab-root");
"""

def ch(lab, title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP + f"\ncreateInteractiveSynthesisLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }

LABS = {
    "boolean-network": ch("boolean-network", "Boolean network / subject graph", "Explore the toy AIG subject graph.",
        """    { id: "and4", title: "Four ANDs", level: "Intro", prompt: "AIG has 4 AND nodes.", check: (_c, api) => api.getStats().and === GOLDENS.and },
    { id: "pi3", title: "Three PIs", level: "Intro", prompt: "Three PIs.", check: (_c, api) => api.getStats().pi === GOLDENS.pi },
    { id: "po", title: "One PO", level: "Intro", prompt: "One PO.", check: (_c, api) => api.getStats().po === GOLDENS.po },
    { id: "nodes7", title: "Seven nodes", level: "Practice", prompt: "Seven nodes total.", check: (_c, api) => api.getNodes().length === 7 },
    { id: "f101", title: "f at 101", level: "Practice", prompt: "Set a=1,b=0,c=1 → f=1.",
      setup: (_c, api) => api.setAssignment({a:1,b:0,c:1}),
      check: (_c, api) => api.output() === GOLDENS.fAt101 },
    { id: "f111", title: "f at 111", level: "Practice", prompt: "a=b=c=1 → f=0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:1}),
      check: (_c, api) => api.output() === GOLDENS.fAt111 },
    { id: "sel", title: "Select 7", level: "Practice", prompt: "Select node 7.", check: (_c, api) => api.getSelected() === 7 },
    { id: "toggle", title: "Toggle b", level: "Challenge", prompt: "Set b=1.", check: (_c, api) => api.getAssignment().b === 1 },"""),
    "aig-nodes": ch("aig-nodes", "And-Inverter Graph nodes", "Identify PI/AND/complements and evaluate.",
        """    { id: "pi", title: "PI count", level: "Intro", prompt: "PI=3.", check: (_c, api) => api.getStats().pi === 3 },
    { id: "and", title: "AND count", level: "Intro", prompt: "AND=4.", check: (_c, api) => api.getStats().and === 4 },
    { id: "eval", title: "Eval f", level: "Practice", prompt: "f finite.", check: (_c, api) => api.output() === 0 || api.output() === 1 },
    { id: "101", title: "Golden 101", level: "Practice", prompt: "a1b0c1 → f1.",
      setup: (_c, api) => api.setAssignment({a:1,b:0,c:1}), check: (_c, api) => api.output() === 1 },
    { id: "111", title: "Golden 111", level: "Practice", prompt: "111 → f0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:1}), check: (_c, api) => api.output() === 0 },
    { id: "sel5", title: "Select 5", level: "Practice", prompt: "Select node 5.", check: (_c, api) => { api.setSelected(5); return api.getSelected() === 5; } },
    { id: "vals", title: "Eval map", level: "Practice", prompt: "eval returns node 7.", check: (_c, api) => 7 in api.eval() },
    { id: "golden", title: "Goldens", level: "Intro", prompt: "GOLDENS.and is 4.", check: () => GOLDENS.and === 4 },"""),
    "aig-strash": ch("aig-strash", "Structural hashing", "Confirm strash table size.",
        """    { id: "entries", title: "4 entries", level: "Intro", prompt: "Strash has 4 entries.", check: (_c, api) => Object.keys(api.strash()).length === GOLDENS.strashEntries },
    { id: "and", title: "Matches AND", level: "Practice", prompt: "Entries equal AND count.", check: (_c, api) => Object.keys(api.strash()).length === api.getStats().and },
    { id: "obj", title: "Object keys", level: "Practice", prompt: "Strash is object.", check: (_c, api) => typeof api.strash() === "object" },
    { id: "stats", title: "Stats ok", level: "Intro", prompt: "Stats and=4.", check: (_c, api) => api.getStats().and === 4 },
    { id: "f", title: "f still works", level: "Practice", prompt: "Output defined.", check: (_c, api) => Number.isFinite(api.output()) },
    { id: "golden", title: "Golden entries", level: "Intro", prompt: "GOLDENS.strashEntries=4.", check: () => GOLDENS.strashEntries === 4 },
    { id: "sel", title: "Select AND", level: "Practice", prompt: "Select node 4.", check: (_c, api) => { api.setSelected(4); return api.getSelected() === 4; } },
    { id: "nodes", title: "7 nodes", level: "Challenge", prompt: "Seven nodes.", check: (_c, api) => api.getNodes().length === 7 },"""),
    "rewrite-local": ch("rewrite-local", "Local AIG rewrite", "Count rewrite opportunities.",
        """    { id: "count", title: "Opportunities ≥1", level: "Intro", prompt: "Rewrite count ≥1.", check: (_c, api) => api.rewriteCount().count >= 1 },
    { id: "push", title: "Inverter push", level: "Practice", prompt: "inverterPush returns applied.", check: (_c, api) => typeof api.inverterPush().applied === "number" },
    { id: "fn", title: "f preserved 101", level: "Practice", prompt: "f(1,0,1)=1.",
      setup: (_c, api) => api.setAssignment({a:1,b:0,c:1}), check: (_c, api) => api.output() === 1 },
    { id: "nodes", title: "Has node list", level: "Practice", prompt: "rewrite nodes array.", check: (_c, api) => Array.isArray(api.rewriteCount().nodes) },
    { id: "and", title: "AND=4", level: "Intro", prompt: "Still 4 ANDs.", check: (_c, api) => api.getStats().and === 4 },
    { id: "sel", title: "Select 5", level: "Practice", prompt: "Select 5.", check: (_c, api) => { api.setSelected(5); return api.getSelected()===5; } },
    { id: "push2", title: "Push list", level: "Practice", prompt: "rewrites is array.", check: (_c, api) => Array.isArray(api.inverterPush().rewrites) },
    { id: "golden", title: "fAt111", level: "Challenge", prompt: "111→0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:1}), check: (_c, api) => api.output() === 0 },"""),
    "cut-enumeration": ch("cut-enumeration", "K-feasible cuts", "Enumerate cuts with k=3.",
        """    { id: "run", title: "Enumerate", level: "Intro", prompt: "Click Enumerate cuts.",
      setup: (_c, api) => api.runCuts(), check: (_c, api) => api.getMode() === "cuts" },
    { id: "total", title: "Total cuts >0", level: "Intro", prompt: "totalCuts > 0.",
      check: (_c, api) => { if (!api.getCuts()) api.runCuts(); return api.cutStats().totalCuts > 0; } },
    { id: "k", title: "cutK golden", level: "Intro", prompt: "GOLDENS.cutK=3.", check: () => GOLDENS.cutK === 3 },
    { id: "po", title: "Node 7 cuts", level: "Practice", prompt: "Node 7 has ≥1 cut.",
      check: (_c, api) => { if (!api.getCuts()) api.runCuts(); return api.getCuts()[7].length >= 1; } },
    { id: "pi", title: "PI cut size 1", level: "Practice", prompt: "PI 1 cut size 1.",
      check: (_c, api) => { if (!api.getCuts()) api.runCuts(); return api.getCuts()[1].length >= 1; } },
    { id: "mode", title: "Mode cuts", level: "Practice", prompt: "Mode is cuts.",
      setup: (_c, api) => api.runCuts(), check: (_c, api) => api.getMode() === "cuts" },
    { id: "max", title: "maxPerNode", level: "Practice", prompt: "maxPerNode ≥1.",
      check: (_c, api) => { if (!api.getCuts()) api.runCuts(); return api.cutStats().maxPerNode >= 1; } },
    { id: "clear", title: "Clear", level: "Challenge", prompt: "Clear then re-run.",
      check: (_c, api) => { api.clearMap(); api.runCuts(); return api.getMode()==="cuts"; } },"""),
    "library-cells": ch("library-cells", "Cell library", "Inspect the six-cell library.",
        """    { id: "six", title: "Six cells", level: "Intro", prompt: "Library length 6.", check: () => LIBRARY.length === GOLDENS.libCount },
    { id: "and2", title: "Has AND2", level: "Intro", prompt: "AND2 present.", check: () => LIBRARY.some(c => c.id==="AND2") },
    { id: "inv", title: "Has INV", level: "Intro", prompt: "INV present.", check: () => LIBRARY.some(c => c.id==="INV") },
    { id: "api", title: "getLibrary", level: "Practice", prompt: "API library length 6.", check: (_c, api) => api.getLibrary().length === 6 },
    { id: "area", title: "AND2 area 2", level: "Practice", prompt: "AND2.area=2.", check: () => LIBRARY.find(c=>c.id==="AND2").area === 2 },
    { id: "map", title: "Techmap runs", level: "Practice", prompt: "Techmap area mode.",
      setup: (_c, api) => api.runTechmapArea(), check: (_c, api) => api.getMode()==="techmap-area" },
    { id: "nor", title: "NOR2", level: "Practice", prompt: "NOR2 in library.", check: () => LIBRARY.some(c=>c.id==="NOR2") },
    { id: "golden", title: "libCount", level: "Intro", prompt: "GOLDENS.libCount=6.", check: () => GOLDENS.libCount===6 },"""),
    "techmap-cover": ch("techmap-cover", "Techmapping cover", "Map AIG to library cells by area.",
        """    { id: "run", title: "Techmap area", level: "Intro", prompt: "Run Techmap area.",
      setup: (_c, api) => api.runTechmapArea(), check: (_c, api) => api.getMode()==="techmap-area" },
    { id: "map4", title: "4 mappings", level: "Intro", prompt: "Four mapped ANDs.",
      check: (_c, api) => { if (!api.getMapping()) api.runTechmapArea(); return api.getMapping().length===4; } },
    { id: "area", title: "Area ≥ min", level: "Practice", prompt: "Area ≥ mapAreaMin.",
      check: (_c, api) => { const m=api.runTechmapArea(); return m.area >= GOLDENS.mapAreaMin; } },
    { id: "cells", title: "Cell ids", level: "Practice", prompt: "Mappings have cell ids.",
      check: (_c, api) => { if (!api.getMapping()) api.runTechmapArea(); return api.getMapping().every(x=>x.cell); } },
    { id: "inv", title: "invCount ≥0", level: "Practice", prompt: "invCount number.",
      check: (_c, api) => typeof api.runTechmapArea().invCount === "number" },
    { id: "mode", title: "Mode", level: "Practice", prompt: "Mode techmap-area.",
      setup: (_c, api) => api.runTechmapArea(), check: (_c, api) => api.getMode()==="techmap-area" },
    { id: "clear", title: "Clear map", level: "Practice", prompt: "Clear empties mapping.",
      check: (_c, api) => { api.runTechmapArea(); api.clearMap(); return api.getMapping()==null; } },
    { id: "rerun", title: "Rerun", level: "Challenge", prompt: "Rerun after clear.",
      check: (_c, api) => { api.clearMap(); api.runTechmapArea(); return api.getMapping().length===4; } },"""),
    "area-delay": ch("area-delay", "Area vs delay", "Compare area and delay mode metrics.",
        """    { id: "trade", title: "Tradeoff object", level: "Intro", prompt: "runTradeoff works.",
      check: (_c, api) => api.runTradeoff().librarySize === 6 },
    { id: "area", title: "Area mode", level: "Practice", prompt: "areaMode.area > 0.",
      check: (_c, api) => api.runTradeoff().areaMode.area > 0 },
    { id: "delay", title: "Delay depth", level: "Practice", prompt: "delayDepth > 0.",
      check: (_c, api) => api.runTradeoff().delayMode.delayDepth > 0 },
    { id: "tm-a", title: "Techmap area btn", level: "Practice", prompt: "Techmap area.",
      setup: (_c, api) => api.runTechmapArea(), check: (_c, api) => api.getMode()==="techmap-area" },
    { id: "tm-d", title: "Techmap delay", level: "Practice", prompt: "Techmap delay.",
      setup: (_c, api) => api.runTechmapDelay(), check: (_c, api) => api.getMode()==="techmap-delay" },
    { id: "lib", title: "Lib size", level: "Intro", prompt: "librarySize 6.", check: (_c, api) => api.runTradeoff().librarySize===6 },
    { id: "map", title: "Has mapping", level: "Practice", prompt: "After delay map, mapping exists.",
      check: (_c, api) => { api.runTechmapDelay(); return api.getMapping().length===4; } },
    { id: "golden", title: "mapAreaMin", level: "Challenge", prompt: "Area ≥ golden min.",
      check: (_c, api) => api.runTechmapArea().area >= GOLDENS.mapAreaMin },"""),
    "sequential-synth": ch("sequential-synth", "Sequential synthesis pass", "Run the full toy pipeline.",
        """    { id: "run", title: "Sequential", level: "Intro", prompt: "Click Sequential synth.",
      setup: (_c, api) => api.runSequential(), check: (_c, api) => api.getMode()==="sequential" },
    { id: "seq", title: "Seq object", level: "Intro", prompt: "getSeq exists.",
      check: (_c, api) => { if (!api.getSeq()) api.runSequential(); return !!api.getSeq(); } },
    { id: "area", title: "Area >0", level: "Practice", prompt: "Mapped area >0.",
      check: (_c, api) => { if (!api.getSeq()) api.runSequential(); return api.getSeq().mapping.area > 0; } },
    { id: "cuts", title: "Cuts present", level: "Practice", prompt: "Cuts after seq.",
      check: (_c, api) => { api.runSequential(); return !!api.getCuts(); } },
    { id: "map", title: "Mapping 4", level: "Practice", prompt: "4 mapped nodes.",
      check: (_c, api) => { api.runSequential(); return api.getMapping().length===4; } },
    { id: "stats", title: "Stats AND 4", level: "Practice", prompt: "seq.stats.and=4.",
      check: (_c, api) => { api.runSequential(); return api.getSeq().stats.and===4; } },
    { id: "strash", title: "Strash entries", level: "Practice", prompt: "strashEntries=4.",
      check: (_c, api) => { api.runSequential(); return api.getSeq().strashEntries===4; } },
    { id: "mode", title: "Mode sequential", level: "Challenge", prompt: "Mode sequential.",
      setup: (_c, api) => api.runSequential(), check: (_c, api) => api.getMode()==="sequential" },"""),
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def main() -> None:
    for lab, meta in LABS.items():
        write(TOOLS / lab / "index.html", HTML.format(title=meta["title"], lead=meta["lead"], lab=lab))
        write(TOOLS / lab / f"{lab}.js", meta["js"])
    print(f"Wrote {len(LABS)} tools")
    write(WALK / "synthesis-algos.js", (Path(__file__).parent / "_synthesis_algos.js").read_text(encoding="utf-8"))
    print("Wrote synthesis-algos.js")

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "SYNTHESIS_ALGOS" not in text:
        text = text.replace(
            'import { BUFFERING_ALGOS } from "./buffering-algos.js";\n',
            'import { BUFFERING_ALGOS } from "./buffering-algos.js";\n'
            'import { SYNTHESIS_ALGOS } from "./synthesis-algos.js";\n'
            'import { drawSynthesis } from "../../assets/synthesis-core.js";\n',
        )
        text = text.replace(
            "  ...BUFFERING_ALGOS,\n};",
            "  ...BUFFERING_ALGOS,\n  ...SYNTHESIS_ALGOS,\n};",
        )
        if 'pack.kind === "synthesis"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "buffering") {',
                '''  } else if (pack.kind === "synthesis") {
    drawSynthesis(canvas, {
      nodes: s.nodes,
      layout: s.layout,
      selectedNode: s.selectedNode ?? null,
      mapping: s.mapping || null,
      cuts: s.cuts || null,
      highlight: s.highlight || [],
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "buffering") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"boolean-network"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        # append before closing brace of LAB_TO_ALGO
        if '"sequential-buffer": ("sequential-buffer", 5),' in cap:
            cap = cap.replace(
                '"sequential-buffer": ("sequential-buffer", 5),',
                '"sequential-buffer": ("sequential-buffer", 5),\n    ' + block + ",",
            )
        else:
            cap = cap.replace("\n}", ",\n    " + block + ",\n}", 1)
        CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
        print("Patched LAB_TO_ALGO")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="synthesis"' not in it:
        section = """
    <section class="tool-section" id="synthesis">
      <h2>Logic synthesis</h2>
      <ul class="tool-list">
        <li><a href="boolean-network/">Boolean network</a></li>
        <li><a href="aig-nodes/">AIG nodes</a></li>
        <li><a href="aig-strash/">Structural hashing</a></li>
        <li><a href="rewrite-local/">Local rewrite</a></li>
        <li><a href="cut-enumeration/">Cut enumeration</a></li>
        <li><a href="library-cells/">Cell library</a></li>
        <li><a href="techmap-cover/">Techmap cover</a></li>
        <li><a href="area-delay/">Area vs delay</a></li>
        <li><a href="sequential-synth/">Sequential synth</a></li>
      </ul>
    </section>
"""
        it = it.replace("</main>", section + "\n</main>")
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools index")
    print("OK")


if __name__ == "__main__":
    main()
