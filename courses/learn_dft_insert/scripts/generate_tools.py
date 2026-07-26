#!/usr/bin/env python3
"""Generate learn_dft_insert tools + wire walkthrough."""

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

IMP = """import { GOLDENS } from "../../assets/dft-core.js";
import { createInteractiveDftLab } from "../../assets/interactive-dft-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveDftLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "scan-flops": ch(
        "Scan flops",
        "Identify SDFF scan cells; confirm count=4.",
        """    { id: "run", title: "Flops", level: "Intro", prompt: "Click Flops.",
      setup: (_c, api) => api.showFlops(), check: (_c, api) => api.getMode() === "flops" },
    { id: "c4", title: "Count 4", level: "Intro", prompt: "scan cell count 4.",
      setup: (_c, api) => api.showFlops(), check: (_c, api) => api.getLast().count === GOLDENS.scanCellCount },
    { id: "sdff", title: "SDFF", level: "Practice", prompt: "All cells type SDFF.",
      setup: (_c, api) => api.showFlops(), check: (_c, api) => api.getLast().cells.every(c => c.type === "SDFF") },
    { id: "f1", title: "Select f1", level: "Practice", prompt: "Click flop f1.",
      setup: (_c, api) => api.selectFlop("f1"), check: (_c, api) => api.getSelected().includes("f1") },
    { id: "f4", title: "Select f4", level: "Practice", prompt: "Click flop f4.",
      setup: (_c, api) => api.selectFlop("f4"), check: (_c, api) => api.getSelected().includes("f4") },
    { id: "dom", title: "2 domains", level: "Practice", prompt: "domainCount 2.",
      check: (_c, api) => api.getStats().domainCount === GOLDENS.domainCount },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode flops.",
      setup: (_c, api) => api.showFlops(), check: (_c, api) => api.getMode()==="flops" },
    { id: "golden", title: "scanCellCount", level: "Challenge", prompt: "scanCellCount=4.", check: () => GOLDENS.scanCellCount === 4 },""",
    ),
    "scan-enable": ch(
        "Scan enable",
        "Read SE/SI/SO ports: si=scan_in, so=scan_out, se=scan_enable.",
        """    { id: "run", title: "SE", level: "Intro", prompt: "Click SE.",
      setup: (_c, api) => api.showSe(), check: (_c, api) => api.getMode() === "se" },
    { id: "se", title: "scan_enable", level: "Intro", prompt: "se=scan_enable.",
      setup: (_c, api) => api.showSe(), check: (_c, api) => api.getLast().se === "scan_enable" },
    { id: "si", title: "scan_in", level: "Practice", prompt: "si=scan_in.",
      setup: (_c, api) => api.showSe(), check: (_c, api) => api.getLast().si === "scan_in" },
    { id: "so", title: "scan_out", level: "Practice", prompt: "so=scan_out.",
      setup: (_c, api) => api.showSe(), check: (_c, api) => api.getLast().so === "scan_out" },
    { id: "sel", title: "Select f1", level: "Practice", prompt: "Select f1.",
      setup: (_c, api) => api.selectFlop("f1"), check: (_c, api) => api.getSelected().includes("f1") },
    { id: "flops", title: "4 flops", level: "Practice", prompt: "flopCount 4.",
      check: (_c, api) => api.getStats().flopCount === GOLDENS.flopCount },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode se.",
      setup: (_c, api) => api.showSe(), check: (_c, api) => api.getMode()==="se" },
    { id: "golden", title: "ports", level: "Challenge", prompt: "All three ports named.", check: () => true },""",
    ),
    "chain-stitch": ch(
        "Chain stitch",
        "Stitch Q→SI between flops; stitch_count=3.",
        """    { id: "run", title: "Stitch", level: "Intro", prompt: "Click Stitch.",
      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getMode() === "stitch" },
    { id: "c3", title: "Count 3", level: "Intro", prompt: "stitch count 3.",
      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getLast().stitchCount === GOLDENS.stitchCount },
    { id: "ord", title: "Order", level: "Practice", prompt: "order f1→f2→f3→f4.",
      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getLast().order.join(",") === "f1,f2,f3,f4" },
    { id: "s12", title: "f1→f2", level: "Practice", prompt: "First stitch f1→f2.",
      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getLast().stitches[0].from === "f1" },
    { id: "s34", title: "f3→f4", level: "Practice", prompt: "Last stitch f3→f4.",
      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getLast().stitches[2].to === "f4" },
    { id: "sel", title: "Select f3", level: "Practice", prompt: "Select f3.",
      setup: (_c, api) => api.selectFlop("f3"), check: (_c, api) => api.getSelected().includes("f3") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode stitch.",
      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getMode()==="stitch" },
    { id: "golden", title: "stitchCount", level: "Challenge", prompt: "stitchCount=3.", check: () => GOLDENS.stitchCount === 3 },""",
    ),
    "scan-order": ch(
        "Scan order",
        "Verify scan_order covers all flops; chain_length=4.",
        """    { id: "run", title: "Order", level: "Intro", prompt: "Click Order.",
      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getMode() === "order" },
    { id: "len", title: "Length 4", level: "Intro", prompt: "chain length 4.",
      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getLast().length === GOLDENS.chainLength },
    { id: "cov", title: "Covers all", level: "Practice", prompt: "covers_all true.",
      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getLast().coversAll === true },
    { id: "head", title: "Head f1", level: "Practice", prompt: "First flop f1.",
      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getLast().order[0] === "f1" },
    { id: "tail", title: "Tail f4", level: "Practice", prompt: "Last flop f4.",
      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getLast().order[3] === "f4" },
    { id: "sel", title: "Select f2", level: "Practice", prompt: "Select f2.",
      setup: (_c, api) => api.selectFlop("f2"), check: (_c, api) => api.getSelected().includes("f2") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode order.",
      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getMode()==="order" },
    { id: "golden", title: "chainLength", level: "Challenge", prompt: "chainLength=4.", check: () => GOLDENS.chainLength === 4 },""",
    ),
    "lockup-latch": ch(
        "Lockup latch",
        "Find lockup on d0→d1 crossing; lockup_count=1 on f3→f4.",
        """    { id: "run", title: "Lockup", level: "Intro", prompt: "Click Lockup.",
      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getMode() === "lockup" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "lockup count 1.",
      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getLast().count === GOLDENS.lockupCount },
    { id: "f34", title: "f3→f4", level: "Practice", prompt: "Lockup between f3 and f4.",
      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getLast().hits[0].from === "f3" && api.getLast().hits[0].to === "f4" },
    { id: "dom", title: "d0→d1", level: "Practice", prompt: "Domains d0 and d1.",
      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getLast().hits[0].domains.join(",") === "d0,d1" },
    { id: "sel", title: "Select f4", level: "Practice", prompt: "Select f4.",
      setup: (_c, api) => api.selectFlop("f4"), check: (_c, api) => api.getSelected().includes("f4") },
    { id: "mark", title: "Marker", level: "Practice", prompt: "One lockup marker shown.",
      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getMarkers().length === 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode lockup.",
      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getMode()==="lockup" },
    { id: "golden", title: "lockupCount", level: "Challenge", prompt: "lockupCount=1.", check: () => GOLDENS.lockupCount === 1 },""",
    ),
    "netlist-transform": ch(
        "Netlist transform",
        "Apply DFT insert edges; transform_edge_count=6.",
        """    { id: "run", title: "Transform", level: "Intro", prompt: "Click Transform.",
      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getMode() === "transform" },
    { id: "e6", title: "Edges 6", level: "Intro", prompt: "edge count 6.",
      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getLast().edgeCount === GOLDENS.transformEdgeCount },
    { id: "st", title: "Stitches 3", level: "Practice", prompt: "stitchCount 3.",
      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getLast().stitchCount === GOLDENS.stitchCount },
    { id: "lk", title: "Lockup 1", level: "Practice", prompt: "lockupCount 1.",
      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getLast().lockupCount === GOLDENS.lockupCount },
    { id: "si", title: "SI edge", level: "Practice", prompt: "One SI edge.",
      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getLast().edges.some(e => e.kind === "si") },
    { id: "so", title: "SO edge", level: "Practice", prompt: "One SO edge.",
      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getLast().edges.some(e => e.kind === "so") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode transform.",
      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getMode()==="transform" },
    { id: "golden", title: "transformEdgeCount", level: "Challenge", prompt: "transformEdgeCount=6.", check: () => GOLDENS.transformEdgeCount === 6 },""",
    ),
    "dft-markers": ch(
        "DFT markers",
        "Collect lockup markers; marker_count=1.",
        """    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getMode() === "markers" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "marker count 1.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().count === GOLDENS.markerCount },
    { id: "kind", title: "Lockup kind", level: "Practice", prompt: "kind lockup.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().markers[0].kind === "lockup" },
    { id: "f34", title: "f3→f4", level: "Practice", prompt: "Marker on f3→f4.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().markers[0].from === "f3" },
    { id: "sel", title: "Select f3", level: "Practice", prompt: "Select f3.",
      setup: (_c, api) => api.selectFlop("f3"), check: (_c, api) => api.getSelected().includes("f3") },
    { id: "dom", title: "Domains", level: "Practice", prompt: "Two clock domains.",
      check: (_c, api) => api.getStats().domainCount === 2 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode markers.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getMode()==="markers" },
    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=1.", check: () => GOLDENS.markerCount === 1 },""",
    ),
    "scan-chain-view": ch(
        "Scan chain view",
        "Visualize full chain SI→f1→f2→f3→f4→SO with lockup highlight.",
        """    { id: "run", title: "Chain", level: "Intro", prompt: "Click Chain.",
      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getMode() === "chain" },
    { id: "ord", title: "Order", level: "Intro", prompt: "Chain f1→f2→f3→f4.",
      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getDesign().scan_order.join(",") === "f1,f2,f3,f4" },
    { id: "st", title: "Stitches 3", level: "Practice", prompt: "stitch count 3.",
      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getLast().chain.stitchCount === 3 },
    { id: "lk", title: "Lockup 1", level: "Practice", prompt: "lockup count 1.",
      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getLast().lockups.count === 1 },
    { id: "mark", title: "Marker", level: "Practice", prompt: "One marker shown.",
      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getMarkers().length === 1 },
    { id: "sel", title: "Select f1", level: "Practice", prompt: "Select f1.",
      setup: (_c, api) => api.selectFlop("f1"), check: (_c, api) => api.getSelected().includes("f1") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode chain.",
      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getMode()==="chain" },
    { id: "golden", title: "chain ok", level: "Challenge", prompt: "Full chain golden.", check: () => GOLDENS.chainLength === 4 },""",
    ),
    "dft-engine": ch(
        "DFT engine",
        "Run engine; confirm ok and markers=1.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "m1", title: "Markers 1", level: "Practice", prompt: "markers 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().markers.count === 1 },
    { id: "cells", title: "Cells 4", level: "Practice", prompt: "scan cells 4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().cells.count === GOLDENS.scanCellCount },
    { id: "st", title: "Stitches 3", level: "Practice", prompt: "stitch count 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().chain.stitchCount === 3 },
    { id: "edges", title: "Edges 6", level: "Practice", prompt: "transform edges 6.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().transform.edgeCount === 6 },
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

    write(WALK / "dft-algos.js", (Path(__file__).parent / "_dft_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "DFT_ALGOS" not in text:
        text = text.replace(
            'import { POWER_ALGOS } from "./power-algos.js";\n'
            'import { drawPower, STARTER as POWER_STARTER } from "../../assets/power-core.js";\n',
            'import { POWER_ALGOS } from "./power-algos.js";\n'
            'import { drawPower, STARTER as POWER_STARTER } from "../../assets/power-core.js";\n'
            'import { DFT_ALGOS } from "./dft-algos.js";\n'
            'import { drawDft, STARTER as DFT_STARTER } from "../../assets/dft-core.js";\n',
        )
        text = text.replace(
            "  ...POWER_ALGOS,\n};",
            "  ...POWER_ALGOS,\n  ...DFT_ALGOS,\n};",
        )
        if 'pack.kind === "dft"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "erc") {',
                '''  } else if (pack.kind === "dft") {
    drawDft(canvas, {
      design: s.design || DFT_STARTER,
      highlight: s.highlight || [],
      selected: s.selected || [],
      markers: s.markers || [],
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "erc") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"dft-engine"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"power-engine": ("power-engine", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")
        else:
            print("WARN: could not patch LAB_TO_ALGO — power-engine needle missing")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="dft"' not in it:
        section = """
    <section class="tool-section" id="dft">
      <h2>DFT insert</h2>
      <ul class="tool-list">
        <li><a href="scan-flops/">Scan flops</a></li>
        <li><a href="scan-enable/">Scan enable</a></li>
        <li><a href="chain-stitch/">Chain stitch</a></li>
        <li><a href="scan-order/">Scan order</a></li>
        <li><a href="lockup-latch/">Lockup latch</a></li>
        <li><a href="netlist-transform/">Netlist transform</a></li>
        <li><a href="dft-markers/">DFT markers</a></li>
        <li><a href="scan-chain-view/">Scan chain view</a></li>
        <li><a href="dft-engine/">DFT engine</a></li>
      </ul>
    </section>

"""
        power_end = '    </section>\n\n\n    <section class="tool-section" id="spice">'
        if power_end in it:
            it = it.replace(
                power_end,
                '    </section>\n' + section + '\n    <section class="tool-section" id="spice">',
            )
        elif 'id="spice"' in it:
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
