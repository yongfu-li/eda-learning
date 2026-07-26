#!/usr/bin/env python3
"""Generate learn_erc tools + wire walkthrough."""
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

IMP = """import { GOLDENS } from "../../assets/erc-core.js";
import { createInteractiveErcLab } from "../../assets/interactive-erc-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveErcLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "netlist-graph": ch(
        "Netlist graph",
        "Inspect connectivity; confirm 8 nets and 14 edges.",
        """    { id: "run", title: "Show graph", level: "Intro", prompt: "Click Graph.",
      setup: (_c, api) => api.showGraph(), check: (_c, api) => api.getMode() === "graph" },
    { id: "n8", title: "Eight nets", level: "Intro", prompt: "netCount 8.", check: (_c, api) => api.getStats().netCount === GOLDENS.netCount },
    { id: "e14", title: "Fourteen edges", level: "Practice", prompt: "edgeCount 14.",
      setup: (_c, api) => api.showGraph(), check: (_c, api) => api.getLast().edgeCount === GOLDENS.edgeCount },
    { id: "i4", title: "Four instances", level: "Practice", prompt: "instanceCount 4.", check: (_c, api) => api.getStats().instanceCount === GOLDENS.instanceCount },
    { id: "sel", title: "Select a", level: "Practice", prompt: "Click net a.",
      setup: (_c, api) => api.selectNet("a"), check: (_c, api) => api.getSelected().includes("a") },
    { id: "has", title: "Has float_n", level: "Practice", prompt: "float_n in nets.", check: (_c, api) => api.getDesign().nets.includes("float_n") },
    { id: "u1", title: "Has u1", level: "Practice", prompt: "u1 present.", check: (_c, api) => api.getDesign().instances.some(i=>i.id==="u1") },
    { id: "golden", title: "edgeCount", level: "Challenge", prompt: "edgeCount=14.", check: () => GOLDENS.edgeCount === 14 },""",
    ),
    "drivers-loads": ch(
        "Drivers and loads",
        "Classify drivers; z has 2, float_n has 0.",
        """    { id: "run", title: "Drivers", level: "Intro", prompt: "Click Drivers.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getMode() === "drivers" },
    { id: "z2", title: "z drivers 2", level: "Intro", prompt: "z has 2 drivers.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getLast().byNet.z.drivers.length === 2 },
    { id: "f0", title: "float 0", level: "Practice", prompt: "float_n drivers 0.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getLast().byNet.float_n.drivers.length === 0 },
    { id: "fl", title: "float load", level: "Practice", prompt: "float_n has a load.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getLast().byNet.float_n.loads.length === 1 },
    { id: "y1", title: "y one", level: "Practice", prompt: "y has 1 driver.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getLast().byNet.y.drivers.length === 1 },
    { id: "selz", title: "Select z", level: "Practice", prompt: "Select net z.",
      setup: (_c, api) => api.selectNet("z"), check: (_c, api) => api.getSelected().includes("z") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode drivers.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getMode()==="drivers" },
    { id: "golden", title: "multi nets", level: "Challenge", prompt: "multiDrivenNets has z.", check: () => GOLDENS.multiDrivenNets[0]==="z" },""",
    ),
    "floating-nets": ch(
        "Floating nets",
        "Find float_n; select it and confirm count=1.",
        """    { id: "run", title: "Floating", level: "Intro", prompt: "Click Floating.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => api.getMode() === "floating" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "floating count 1.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => api.getLast().count === GOLDENS.floatingCount },
    { id: "net", title: "float_n", level: "Practice", prompt: "nets include float_n.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => api.getLast().nets.includes("float_n") },
    { id: "sel", title: "Select float_n", level: "Practice", prompt: "Click float_n.",
      setup: (_c, api) => api.selectNet("float_n"), check: (_c, api) => api.getSelected().includes("float_n") },
    { id: "notz", title: "Not z", level: "Practice", prompt: "z is not floating.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => !api.getLast().nets.includes("z") },
    { id: "mk", title: "Marker", level: "Practice", prompt: "markers length 1.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => api.getMarkers().length === 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode floating.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => api.getMode()==="floating" },
    { id: "golden", title: "floatingCount", level: "Challenge", prompt: "floatingCount=1.", check: () => GOLDENS.floatingCount === 1 },""",
    ),
    "undriven-inputs": ch(
        "Undriven inputs",
        "Confirm u2.A undriven on float_n.",
        """    { id: "run", title: "Undriven", level: "Intro", prompt: "Click Undriven.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => api.getMode() === "undriven" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "undriven count 1.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => api.getLast().count === GOLDENS.undrivenCount },
    { id: "u2", title: "u2.A", level: "Practice", prompt: "hit is u2.A.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => api.getLast().hits[0].inst==="u2" && api.getLast().hits[0].pin==="A" },
    { id: "net", title: "float_n", level: "Practice", prompt: "hit net float_n.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => api.getLast().hits[0].net==="float_n" },
    { id: "sel", title: "Select float_n", level: "Practice", prompt: "Select float_n.",
      setup: (_c, api) => api.selectNet("float_n"), check: (_c, api) => api.getSelected().includes("float_n") },
    { id: "nota", title: "Not port a", level: "Practice", prompt: "no hit on port a.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => !api.getLast().hits.some(h=>h.net==="a") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode undriven.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => api.getMode()==="undriven" },
    { id: "golden", title: "undrivenCount", level: "Challenge", prompt: "undrivenCount=1.", check: () => GOLDENS.undrivenCount === 1 },""",
    ),
    "multi-driven": ch(
        "Multi-driven",
        "Select z; confirm multi-driven count=1.",
        """    { id: "run", title: "Multi", level: "Intro", prompt: "Click Multi.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => api.getMode() === "multi" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "multi count 1.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => api.getLast().count === GOLDENS.multiDrivenCount },
    { id: "z", title: "Net z", level: "Practice", prompt: "nets include z.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => api.getLast().nets.includes("z") },
    { id: "sel", title: "Select z", level: "Practice", prompt: "Select z.",
      setup: (_c, api) => api.selectNet("z"), check: (_c, api) => api.getSelected().includes("z") },
    { id: "drv", title: "Two drivers", level: "Practice", prompt: "z detail length 2.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => api.getLast().detail.z.length === 2 },
    { id: "noty", title: "Not y", level: "Practice", prompt: "y not multi.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => !api.getLast().nets.includes("y") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode multi.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => api.getMode()==="multi" },
    { id: "golden", title: "multiDrivenCount", level: "Challenge", prompt: "multiDrivenCount=1.", check: () => GOLDENS.multiDrivenCount === 1 },""",
    ),
    "supply-shorts": ch(
        "Supply shorts",
        "Confirm short1 bridges vdd↔vss.",
        """    { id: "run", title: "Shorts", level: "Intro", prompt: "Click Shorts.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getMode() === "shorts" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "short count 1.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getLast().count === GOLDENS.supplyShortCount },
    { id: "id", title: "short1", level: "Practice", prompt: "hit inst short1.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getLast().hits[0].inst==="short1" },
    { id: "selv", title: "Select vdd", level: "Practice", prompt: "Select vdd.",
      setup: (_c, api) => api.selectNet("vdd"), check: (_c, api) => api.getSelected().includes("vdd") },
    { id: "nets", title: "Has vss", level: "Practice", prompt: "hit nets include vss.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getLast().hits[0].nets.includes("vss") },
    { id: "mk", title: "Marker", level: "Practice", prompt: "markers nonempty.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getMarkers().length >= 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode shorts.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getMode()==="shorts" },
    { id: "golden", title: "supplyShortCount", level: "Challenge", prompt: "supplyShortCount=1.", check: () => GOLDENS.supplyShortCount === 1 },""",
    ),
    "well-substrate": ch(
        "Well / substrate",
        "Confirm nw1 nwell error.",
        """    { id: "run", title: "Wells", level: "Intro", prompt: "Click Wells.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getMode() === "wells" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "well errors 1.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getLast().count === GOLDENS.wellErrorCount },
    { id: "nw1", title: "nw1", level: "Practice", prompt: "hit id nw1.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getLast().hits[0].id==="nw1" },
    { id: "exp", title: "Expect power", level: "Practice", prompt: "expected power.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getLast().hits[0].expected==="power" },
    { id: "sel", title: "Select well_n", level: "Practice", prompt: "Select well_n.",
      setup: (_c, api) => api.selectNet("well_n"), check: (_c, api) => api.getSelected().includes("well_n") },
    { id: "got", title: "Got ground", level: "Practice", prompt: "got ground.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getLast().hits[0].got==="ground" },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode wells.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getMode()==="wells" },
    { id: "golden", title: "wellErrorCount", level: "Challenge", prompt: "wellErrorCount=1.", check: () => GOLDENS.wellErrorCount === 1 },""",
    ),
    "erc-markers": ch(
        "ERC markers",
        "Collect markers; confirm count=5.",
        """    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode() === "markers" },
    { id: "c5", title: "Count 5", level: "Intro", prompt: "marker count 5.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().count === GOLDENS.markerCount },
    { id: "kinds", title: "Has floating", level: "Practice", prompt: "has floating kind.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.some(m=>m.kind==="floating") },
    { id: "multi", title: "Has multi", level: "Practice", prompt: "has multi_driven.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.some(m=>m.kind==="multi_driven") },
    { id: "well", title: "Has well", level: "Practice", prompt: "has well_error.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.some(m=>m.kind==="well_error") },
    { id: "short", title: "Has short", level: "Practice", prompt: "has supply_short.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.some(m=>m.kind==="supply_short") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode()==="markers" },
    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=5.", check: () => GOLDENS.markerCount === 5 },""",
    ),
    "erc-engine": ch(
        "ERC engine",
        "Run engine; confirm ok and markers=5.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "m5", title: "Markers 5", level: "Practice", prompt: "markers 5.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().markers.count === 5 },
    { id: "fl", title: "Floating 1", level: "Practice", prompt: "floating 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().floating.count === 1 },
    { id: "multi", title: "Multi 1", level: "Practice", prompt: "multi 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().multi.count === 1 },
    { id: "short", title: "Short 1", level: "Practice", prompt: "shorts 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().shorts.count === 1 },
    { id: "well", title: "Well 1", level: "Practice", prompt: "wells 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().wells.count === 1 },
    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=5.", check: () => GOLDENS.markerCount === 5 },""",
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
    write(WALK / "erc-algos.js", (Path(__file__).parent / "_erc_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "ERC_ALGOS" not in text:
        text = text.replace(
            'import { SPICE_ALGOS } from "./spice-algos.js";\n'
            'import { drawSpice, STARTER as SPICE_STARTER } from "../../assets/spice-core.js";\n',
            'import { SPICE_ALGOS } from "./spice-algos.js";\n'
            'import { drawSpice, STARTER as SPICE_STARTER } from "../../assets/spice-core.js";\n'
            'import { ERC_ALGOS } from "./erc-algos.js";\n'
            'import { drawErc, STARTER as ERC_STARTER } from "../../assets/erc-core.js";\n',
        )
        text = text.replace(
            "  ...SPICE_ALGOS,\n};",
            "  ...SPICE_ALGOS,\n  ...ERC_ALGOS,\n};",
        )
        if 'pack.kind === "erc"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "spice") {',
                '''  } else if (pack.kind === "erc") {
    drawErc(canvas, {
      design: s.design || ERC_STARTER,
      highlight: s.highlight || [],
      selected: s.selected || [],
      markers: s.markers || [],
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "spice") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"erc-engine"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"spice-engine": ("spice-engine", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")
        else:
            # append near end of LAB_TO_ALGO dict
            needle2 = '"mp-engine": ("mp-engine", 5),'
            if needle2 in cap and "erc-engine" not in cap:
                cap = cap.replace(needle2, needle2 + "\n    " + block + ",")
                CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
                print("Patched LAB_TO_ALGO (via mp-engine)")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="erc"' not in it:
        section = """
    <section class="tool-section" id="erc">
      <h2>ERC / electrical rules</h2>
      <ul class="tool-list">
        <li><a href="netlist-graph/">Netlist graph</a></li>
        <li><a href="drivers-loads/">Drivers and loads</a></li>
        <li><a href="floating-nets/">Floating nets</a></li>
        <li><a href="undriven-inputs/">Undriven inputs</a></li>
        <li><a href="multi-driven/">Multi-driven</a></li>
        <li><a href="supply-shorts/">Supply shorts</a></li>
        <li><a href="well-substrate/">Well / substrate</a></li>
        <li><a href="erc-markers/">ERC markers</a></li>
        <li><a href="erc-engine/">ERC engine</a></li>
      </ul>
    </section>

"""
        if 'id="spice"' in it:
            it = it.replace(
                '    <section class="tool-section" id="spice">',
                section + '    <section class="tool-section" id="spice">',
            )
        else:
            it = it.replace(
                '    <section class="tool-section" id="multi-patterning">',
                section + '    <section class="tool-section" id="multi-patterning">',
            )
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools/index.html")
    print("OK")


if __name__ == "__main__":
    main()
