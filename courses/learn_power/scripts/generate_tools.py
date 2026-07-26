#!/usr/bin/env python3
"""Generate learn_power tools + wire walkthrough."""

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

IMP = """import { GOLDENS } from "../../assets/power-core.js";
import { createInteractivePowerLab } from "../../assets/interactive-power-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractivePowerLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "switching-power": ch(
        "Switching power",
        "Compute Psw = α·C·V²·f; confirm n1=1.0.",
        """    { id: "run", title: "Switching", level: "Intro", prompt: "Click Switching.",
      setup: (_c, api) => api.showSwitching(), check: (_c, api) => api.getMode() === "switching" },
    { id: "n1", title: "n1=1.0", level: "Intro", prompt: "n1 Psw 1.0.",
      setup: (_c, api) => api.showSwitching(), check: (_c, api) => api.getLast().byNet.n1 === GOLDENS.pswN1 },
    { id: "chip", title: "chip=5.2", level: "Practice", prompt: "chip Psw 5.2.",
      setup: (_c, api) => api.showSwitching(), check: (_c, api) => api.getLast().total === GOLDENS.chipPsw },
    { id: "n3", title: "n3=4", level: "Practice", prompt: "n3 Psw 4.0.",
      setup: (_c, api) => api.showSwitching(), check: (_c, api) => api.getLast().byNet.n3 === 4 },
    { id: "sel", title: "Select n1", level: "Practice", prompt: "Click net n1.",
      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },
    { id: "nc", title: "Three nets", level: "Practice", prompt: "netCount 3.", check: (_c, api) => api.getStats().netCount === GOLDENS.netCount },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode switching.",
      setup: (_c, api) => api.showSwitching(), check: (_c, api) => api.getMode()==="switching" },
    { id: "golden", title: "pswN1", level: "Challenge", prompt: "pswN1=1.0.", check: () => GOLDENS.pswN1 === 1.0 },""",
    ),
    "leakage-power": ch(
        "Leakage power",
        "Compute Pleak = Ileak·V; confirm n1=0.1.",
        """    { id: "run", title: "Leakage", level: "Intro", prompt: "Click Leakage.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getMode() === "leakage" },
    { id: "n1", title: "n1=0.1", level: "Intro", prompt: "n1 Pleak 0.1.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getLast().byNet.n1 === GOLDENS.plkN1 },
    { id: "chip", title: "chip=0.35", level: "Practice", prompt: "chip Pleak 0.35.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getLast().total === GOLDENS.chipPlk },
    { id: "n2", title: "n2=0.05", level: "Practice", prompt: "n2 Pleak 0.05.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getLast().byNet.n2 === 0.05 },
    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",
      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode leakage.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getMode()==="leakage" },
    { id: "vdd", title: "Vdd=1", level: "Practice", prompt: "Vdd 1.0.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getLast().vdd === 1 },
    { id: "golden", title: "plkN1", level: "Challenge", prompt: "plkN1=0.1.", check: () => GOLDENS.plkN1 === 0.1 },""",
    ),
    "total-power": ch(
        "Total power",
        "Sum Psw+Pleak; chip Ptot=5.55.",
        """    { id: "run", title: "Total", level: "Intro", prompt: "Click Total.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getMode() === "total" },
    { id: "chip", title: "chip=5.55", level: "Intro", prompt: "chip Ptot 5.55.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getLast().total === GOLDENS.chipPtot },
    { id: "n1", title: "n1=1.1", level: "Practice", prompt: "n1 Ptot 1.1.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getLast().byNet.n1 === GOLDENS.ptotN1 },
    { id: "sw", title: "Psw part", level: "Practice", prompt: "n1 Psw 1.0.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getLast().switching.byNet.n1 === GOLDENS.pswN1 },
    { id: "lk", title: "Pleak part", level: "Practice", prompt: "n1 Pleak 0.1.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getLast().leakage.byNet.n1 === GOLDENS.plkN1 },
    { id: "sel", title: "Select n2", level: "Practice", prompt: "Select n2.",
      setup: (_c, api) => api.selectNet("n2"), check: (_c, api) => api.getSelected().includes("n2") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode total.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getMode()==="total" },
    { id: "golden", title: "chipPtot", level: "Challenge", prompt: "chipPtot=5.55.", check: () => GOLDENS.chipPtot === 5.55 },""",
    ),
    "activity-factors": ch(
        "Activity factors",
        "Read alphas n1=0.5, n2=0.2, n3=1.0.",
        """    { id: "run", title: "Activity", level: "Intro", prompt: "Click Activity.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => api.getMode() === "activity" },
    { id: "n1", title: "n1=0.5", level: "Intro", prompt: "n1 alpha 0.5.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => api.getLast().alphas.n1 === 0.5 },
    { id: "n2", title: "n2=0.2", level: "Practice", prompt: "n2 alpha 0.2.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => api.getLast().alphas.n2 === 0.2 },
    { id: "n3", title: "n3=1.0", level: "Practice", prompt: "n3 alpha 1.0.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => api.getLast().alphas.n3 === 1.0 },
    { id: "sel", title: "Select n3", level: "Practice", prompt: "Select n3.",
      setup: (_c, api) => api.selectNet("n3"), check: (_c, api) => api.getSelected().includes("n3") },
    { id: "mean", title: "Mean α", level: "Practice", prompt: "mean alpha ~0.57.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => Math.abs(api.getLast().mean - (0.5+0.2+1)/3) < 1e-9 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode activity.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => api.getMode()==="activity" },
    { id: "golden", title: "alphas", level: "Challenge", prompt: "n1 alpha 0.5.", check: () => true },""",
    ),
    "power-grid": ch(
        "Power grid",
        "Build grid: 4 nodes, 3 series edges.",
        """    { id: "run", title: "Grid", level: "Intro", prompt: "Click Grid.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getMode() === "grid" },
    { id: "nodes", title: "4 nodes", level: "Intro", prompt: "4 grid nodes.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getLast().nodes.length === 4 },
    { id: "edges", title: "3 edges", level: "Practice", prompt: "edgeCount 3.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getLast().edgeCount === GOLDENS.edgeCount },
    { id: "i", title: "i_sink", level: "Practice", prompt: "i_sink 0.1.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getLast().i_sink === GOLDENS.iSink },
    { id: "vsrc", title: "v_src", level: "Practice", prompt: "v_src 1.0.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getLast().v_src === 1 },
    { id: "e1", title: "e1 R=1", level: "Practice", prompt: "e1 resistance 1.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getLast().edges.find(e=>e.id==="e1").r === 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode grid.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getMode()==="grid" },
    { id: "golden", title: "edgeCount", level: "Challenge", prompt: "edgeCount=3.", check: () => GOLDENS.edgeCount === 3 },""",
    ),
    "ir-drop": ch(
        "IR drop",
        "Solve IR; v_sink=0.6, ir_drop_sink=0.4.",
        """    { id: "run", title: "IR", level: "Intro", prompt: "Click IR.",
      setup: (_c, api) => api.showIrDrop(), check: (_c, api) => api.getMode() === "ir" },
    { id: "vsink", title: "v_sink=0.6", level: "Intro", prompt: "v_sink 0.6.",
      setup: (_c, api) => api.showIrDrop(), check: (_c, api) => api.getLast().vSink === GOLDENS.vSink },
    { id: "drop", title: "drop=0.4", level: "Practice", prompt: "ir_drop_sink 0.4.",
      setup: (_c, api) => api.showIrDrop(), check: (_c, api) => api.getLast().irDropSink === GOLDENS.irDropSink },
    { id: "i", title: "I=0.1", level: "Practice", prompt: "i_sink 0.1.",
      setup: (_c, api) => api.showIrDrop(), check: (_c, api) => api.getLast().iSink === GOLDENS.iSink },
    { id: "viol", title: "IR viol", level: "Practice", prompt: "Run IR check; 1 violation.",
      setup: (_c, api) => api.checkIr(), check: (_c, api) => api.getLast().count === GOLDENS.irViolationCount },
    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",
      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode ir.",
      setup: (_c, api) => api.showIrDrop(), check: (_c, api) => api.getMode()==="ir" },
    { id: "golden", title: "irDropSink", level: "Challenge", prompt: "irDropSink=0.4.", check: () => GOLDENS.irDropSink === 0.4 },""",
    ),
    "em-literacy": ch(
        "EM literacy",
        "Flag edges where I > em_limit; count=3.",
        """    { id: "run", title: "EM", level: "Intro", prompt: "Click EM.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getMode() === "em" },
    { id: "c3", title: "Count 3", level: "Intro", prompt: "EM violations 3.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getLast().count === GOLDENS.emViolationCount },
    { id: "e1", title: "e1 hit", level: "Practice", prompt: "e1 violates.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getLast().hits.some(h=>h.edge==="e1") },
    { id: "e2", title: "e2 hit", level: "Practice", prompt: "e2 violates.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getLast().hits.some(h=>h.edge==="e2") },
    { id: "e3", title: "e3 hit", level: "Practice", prompt: "e3 violates.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getLast().hits.some(h=>h.edge==="e3") },
    { id: "lim", title: "limit", level: "Practice", prompt: "em_limit 0.08.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getLast().limit === GOLDENS.emLimit },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode em.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getMode()==="em" },
    { id: "golden", title: "emViolationCount", level: "Challenge", prompt: "emViolationCount=3.", check: () => GOLDENS.emViolationCount === 3 },""",
    ),
    "power-markers": ch(
        "Power markers",
        "Collect IR + EM markers; count=4.",
        """    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode() === "markers" },
    { id: "c4", title: "Count 4", level: "Intro", prompt: "marker count 4.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().count === GOLDENS.markerCount },
    { id: "ir", title: "IR marker", level: "Practice", prompt: "one ir_drop marker.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.filter(m=>m.kind==="ir_drop").length === 1 },
    { id: "em", title: "EM markers", level: "Practice", prompt: "three em markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.filter(m=>m.kind==="em").length === 3 },
    { id: "sink", title: "sink IR", level: "Practice", prompt: "IR on sink.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.some(m=>m.kind==="ir_drop" && m.node==="sink") },
    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",
      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode()==="markers" },
    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=4.", check: () => GOLDENS.markerCount === 4 },""",
    ),
    "power-engine": ch(
        "Power engine",
        "Run engine; confirm ok and markers=4.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "m4", title: "Markers 4", level: "Practice", prompt: "markers 4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().markers.count === 4 },
    { id: "ptot", title: "Ptot", level: "Practice", prompt: "chip Ptot 5.55.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().total.total === GOLDENS.chipPtot },
    { id: "ir", title: "IR drop", level: "Practice", prompt: "ir_drop_sink 0.4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ir.ir.irDropSink === GOLDENS.irDropSink },
    { id: "em", title: "EM 3", level: "Practice", prompt: "EM violations 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().em.count === 3 },
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

    write(WALK / "power-algos.js", (Path(__file__).parent / "_power_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "POWER_ALGOS" not in text:
        text = text.replace(
            'import { ANTENNA_ALGOS } from "./antenna-algos.js";\n'
            'import { drawAntenna, STARTER as ANTENNA_STARTER } from "../../assets/antenna-core.js";\n',
            'import { ANTENNA_ALGOS } from "./antenna-algos.js";\n'
            'import { drawAntenna, STARTER as ANTENNA_STARTER } from "../../assets/antenna-core.js";\n'
            'import { POWER_ALGOS } from "./power-algos.js";\n'
            'import { drawPower, STARTER as POWER_STARTER } from "../../assets/power-core.js";\n',
        )
        text = text.replace(
            "  ...ANTENNA_ALGOS,\n};",
            "  ...ANTENNA_ALGOS,\n  ...POWER_ALGOS,\n};",
        )
        if 'pack.kind === "power"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "erc") {',
                '''  } else if (pack.kind === "power") {
    drawPower(canvas, {
      design: s.design || POWER_STARTER,
      highlight: s.highlight || [],
      selected: s.selected || [],
      markers: s.markers || [],
      irVolts: s.irVolts || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "erc") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"power-engine"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"antenna-engine": ("antenna-engine", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")
        else:
            needle2 = '"mp-engine": ("mp-engine", 5),'
            if needle2 in cap and "power-engine" not in cap:
                cap = cap.replace(needle2, needle2 + "\n    " + block + ",")
                CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
                print("Patched LAB_TO_ALGO (via mp-engine)")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="power"' not in it:
        section = """
    <section class="tool-section" id="power">
      <h2>Power analysis</h2>
      <ul class="tool-list">
        <li><a href="switching-power/">Switching power</a></li>
        <li><a href="leakage-power/">Leakage power</a></li>
        <li><a href="total-power/">Total power</a></li>
        <li><a href="activity-factors/">Activity factors</a></li>
        <li><a href="power-grid/">Power grid</a></li>
        <li><a href="ir-drop/">IR drop</a></li>
        <li><a href="em-literacy/">EM literacy</a></li>
        <li><a href="power-markers/">Power markers</a></li>
        <li><a href="power-engine/">Power engine</a></li>
      </ul>
    </section>

"""
        antenna_end = '    </section>\n\n    <section class="tool-section" id="spice">'
        if antenna_end in it:
            it = it.replace(
                antenna_end,
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
