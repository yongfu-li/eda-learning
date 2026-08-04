#!/usr/bin/env python3
"""Generate learn_pex tools + wire walkthrough."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
TOOLS = ROOT / "platform" / "tools"
WALK = TOOLS / "algorithm-walkthrough"
CAPTURE = ROOT / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"
PUBLISH = ROOT / "platform" / "scripts" / "publish_course_platform.py"

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

IMP = """import { GOLDENS } from "../../assets/pex-core.js";
import { createInteractivePexLab } from "../../assets/interactive-pex-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js, default_mode=None):
    mode_line = f'\n  defaultMode: "{default_mode}",' if default_mode else ""
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractivePexLab(root, {{{mode_line}\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "geometry-load": ch(
        "Geometry load",
        "Inspect geometry; select s1 and confirm 4 segments, 3 layers.",
        """    { id: "run", title: "Geometry", level: "Intro", prompt: "Click Geometry.",
      setup: (_c, api) => api.showGeometry(), check: (_c, api) => api.getMode() === "geometry" },
    { id: "s4", title: "Four segments", level: "Intro", prompt: "segmentCount 4.",
      setup: (_c, api) => api.showGeometry(), check: (_c, api) => api.getLast().segmentCount === GOLDENS.segmentCount },
    { id: "l3", title: "Three layers", level: "Practice", prompt: "layerCount 3.",
      setup: (_c, api) => api.showGeometry(), check: (_c, api) => api.getLast().layerCount === GOLDENS.layerCount },
    { id: "s1", title: "Select s1", level: "Practice", prompt: "Click s1.",
      setup: (_c, api) => { api.showGeometry(); api.select("s1"); }, check: (_c, api) => api.getSelected().includes("s1") },
    { id: "s2", title: "Select s2", level: "Practice", prompt: "Click s2.",
      setup: (_c, api) => { api.showGeometry(); api.select("s2"); }, check: (_c, api) => api.getSelected().includes("s2") },
    { id: "v1", title: "Select v1", level: "Practice", prompt: "Click v1.",
      setup: (_c, api) => { api.showGeometry(); api.select("v1"); }, check: (_c, api) => api.getSelected().includes("v1") },
    { id: "s3", title: "Select s3", level: "Practice", prompt: "Click s3.",
      setup: (_c, api) => { api.showGeometry(); api.select("s3"); }, check: (_c, api) => api.getSelected().includes("s3") },
    { id: "golden", title: "segmentCount", level: "Challenge", prompt: "segmentCount=4.", check: () => GOLDENS.segmentCount === 4 },""",
        "geometry",
    ),
    "resistance-extract": ch(
        "Resistance extract",
        "Extract segment R; select s1 and confirm R_total=3.06.",
        """    { id: "run", title: "Resistance", level: "Intro", prompt: "Click Resistance.",
      setup: (_c, api) => api.runResistance(), check: (_c, api) => api.getMode() === "resistance" },
    { id: "rt", title: "R total", level: "Intro", prompt: "rTotal 3.06.",
      setup: (_c, api) => api.runResistance(), check: (_c, api) => api.getLast().rTotal === GOLDENS.rTotal },
    { id: "c4", title: "Four R", level: "Practice", prompt: "count 4.",
      setup: (_c, api) => api.runResistance(), check: (_c, api) => api.getLast().count === GOLDENS.rCount },
    { id: "s1", title: "Select s1", level: "Practice", prompt: "Click s1.",
      setup: (_c, api) => { api.runResistance(); api.select("s1"); }, check: (_c, api) => api.getSelected().includes("s1") },
    { id: "s2", title: "Select s2", level: "Practice", prompt: "Click s2.",
      setup: (_c, api) => { api.runResistance(); api.select("s2"); }, check: (_c, api) => api.getSelected().includes("s2") },
    { id: "v1", title: "Select v1", level: "Practice", prompt: "Click v1.",
      setup: (_c, api) => { api.runResistance(); api.select("v1"); }, check: (_c, api) => api.getSelected().includes("v1") },
    { id: "rs1", title: "R s1", level: "Practice", prompt: "s1 R=0.5.",
      setup: (_c, api) => api.runResistance(), check: (_c, api) => api.getLast().resistors.find(r => r.segment === "s1").value === GOLDENS.rS1 },
    { id: "golden", title: "rTotal", level: "Challenge", prompt: "rTotal=3.06.", check: () => GOLDENS.rTotal === 3.06 },""",
        "resistance",
    ),
    "capacitance-extract": ch(
        "Capacitance extract",
        "Extract ground C; select s1 and confirm C_total=1.376, 3 caps.",
        """    { id: "run", title: "Capacitance", level: "Intro", prompt: "Click Capacitance.",
      setup: (_c, api) => api.runCapacitance(), check: (_c, api) => api.getMode() === "capacitance" },
    { id: "ct", title: "C total", level: "Intro", prompt: "cTotal 1.376.",
      setup: (_c, api) => api.runCapacitance(), check: (_c, api) => api.getLast().cTotal === GOLDENS.cTotal },
    { id: "c3", title: "Three caps", level: "Practice", prompt: "count 3.",
      setup: (_c, api) => api.runCapacitance(), check: (_c, api) => api.getLast().count === GOLDENS.cGndCount },
    { id: "s1", title: "Select s1", level: "Practice", prompt: "Click s1.",
      setup: (_c, api) => { api.runCapacitance(); api.select("s1"); }, check: (_c, api) => api.getSelected().includes("s1") },
    { id: "s2", title: "Select s2", level: "Practice", prompt: "Click s2.",
      setup: (_c, api) => { api.runCapacitance(); api.select("s2"); }, check: (_c, api) => api.getSelected().includes("s2") },
    { id: "s3", title: "Select s3", level: "Practice", prompt: "Click s3.",
      setup: (_c, api) => { api.runCapacitance(); api.select("s3"); }, check: (_c, api) => api.getSelected().includes("s3") },
    { id: "skip", title: "No VIA C", level: "Practice", prompt: "No capacitor on v1.",
      setup: (_c, api) => api.runCapacitance(), check: (_c, api) => !api.getLast().capacitors.some(c => c.segment === "v1") },
    { id: "golden", title: "cTotal", level: "Challenge", prompt: "cTotal=1.376.", check: () => GOLDENS.cTotal === 1.376 },""",
        "capacitance",
    ),
    "rc-network": ch(
        "RC network build",
        "Build RC network; select in/out; confirm series chain with 4 R edges.",
        """    { id: "run", title: "Network", level: "Intro", prompt: "Click Network.",
      setup: (_c, api) => api.showNetwork(), check: (_c, api) => api.getMode() === "network" },
    { id: "in", title: "Node in", level: "Intro", prompt: "nodes include in.",
      setup: (_c, api) => api.showNetwork(), check: (_c, api) => api.getLast().nodes.includes("in") },
    { id: "out", title: "Node out", level: "Practice", prompt: "nodes include out.",
      setup: (_c, api) => api.showNetwork(), check: (_c, api) => api.getLast().nodes.includes("out") },
    { id: "selin", title: "Select in", level: "Practice", prompt: "Click in.",
      setup: (_c, api) => { api.showNetwork(); api.select("in"); }, check: (_c, api) => api.getSelected().includes("in") },
    { id: "selout", title: "Select out", level: "Practice", prompt: "Click out.",
      setup: (_c, api) => { api.showNetwork(); api.select("out"); }, check: (_c, api) => api.getSelected().includes("out") },
    { id: "r4", title: "Four R", level: "Practice", prompt: "rCount 4.",
      setup: (_c, api) => api.showNetwork(), check: (_c, api) => api.getLast().rCount === GOLDENS.rCount },
    { id: "c3", title: "Three C", level: "Practice", prompt: "cCount 3.",
      setup: (_c, api) => api.showNetwork(), check: (_c, api) => api.getLast().cCount === GOLDENS.cGndCount },
    { id: "golden", title: "in/out", level: "Challenge", prompt: "nodes include in and out.", check: (_c, api) => { const n = api.showNetwork().nodes; return n.includes("in") && n.includes("out"); } },""",
        "network",
    ),
    "network-reduce": ch(
        "Network reduction",
        "Reduce network; select R_eq; confirm after_nodes=2, R_eq=3.06, C_eq=1.376.",
        """    { id: "run", title: "Reduce", level: "Intro", prompt: "Click Reduce.",
      setup: (_c, api) => api.runReduce(), check: (_c, api) => api.getMode() === "reduce" },
    { id: "n2", title: "Two nodes", level: "Intro", prompt: "afterNodes 2.",
      setup: (_c, api) => api.runReduce(), check: (_c, api) => api.getLast().afterNodes === GOLDENS.nodesAfter },
    { id: "req", title: "R_eq", level: "Practice", prompt: "rEq 3.06.",
      setup: (_c, api) => api.runReduce(), check: (_c, api) => api.getLast().rEq === GOLDENS.rTotal },
    { id: "ceq", title: "C_eq", level: "Practice", prompt: "cEq 1.376.",
      setup: (_c, api) => api.runReduce(), check: (_c, api) => api.getLast().cEq === GOLDENS.cTotal },
    { id: "selr", title: "Select R_eq", level: "Practice", prompt: "Click R_eq.",
      setup: (_c, api) => { api.runReduce(); api.select("R_eq"); }, check: (_c, api) => api.getSelected().includes("R_eq") },
    { id: "selc", title: "Select C_eq", level: "Practice", prompt: "Click C_eq.",
      setup: (_c, api) => { api.runReduce(); api.select("C_eq"); }, check: (_c, api) => api.getSelected().includes("C_eq") },
    { id: "in", title: "Select in", level: "Practice", prompt: "Click in.",
      setup: (_c, api) => { api.runReduce(); api.select("in"); }, check: (_c, api) => api.getSelected().includes("in") },
    { id: "golden", title: "rEq", level: "Challenge", prompt: "rEq=3.06.", check: () => GOLDENS.rTotal === 3.06 },""",
        "reduce",
    ),
    "back-annotate": ch(
        "Back-annotate nets",
        "Annotate net n1; select n1; confirm r_total and c_total goldens.",
        """    { id: "run", title: "Annotate", level: "Intro", prompt: "Click Annotate.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getMode() === "annotate" },
    { id: "n1", title: "Net n1", level: "Intro", prompt: "net n1.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getLast().net === "n1" },
    { id: "c1", title: "One ann", level: "Practice", prompt: "count 1.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getLast().count === 1 },
    { id: "rt", title: "R total", level: "Practice", prompt: "rTotal 3.06.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getLast().rTotal === GOLDENS.rTotal },
    { id: "ct", title: "C total", level: "Practice", prompt: "cTotal 1.376.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getLast().cTotal === GOLDENS.cTotal },
    { id: "sel", title: "Select n1", level: "Practice", prompt: "Click n1.",
      setup: (_c, api) => { api.runAnnotate(); api.select("n1"); }, check: (_c, api) => api.getSelected().includes("n1") },
    { id: "ports", title: "Ports", level: "Practice", prompt: "annotations include in/out ports.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getLast().annotations[0].ports.includes("in") },
    { id: "golden", title: "net n1", level: "Challenge", prompt: "net n1 annotated.", check: (_c, api) => api.runAnnotate().net === "n1" },""",
        "annotate",
    ),
    "spef-lite": ch(
        "SPEF-lite emit",
        "Emit SPEF-lite; confirm 1 RES + 1 CAP.",
        """    { id: "run", title: "SPEF", level: "Intro", prompt: "Click SPEF.",
      setup: (_c, api) => api.runSpef(), check: (_c, api) => api.getMode() === "spef" },
    { id: "r1", title: "One RES", level: "Intro", prompt: "resCount 1.",
      setup: (_c, api) => api.runSpef(), check: (_c, api) => api.getLast().resCount === GOLDENS.spefResCount },
    { id: "c1", title: "One CAP", level: "Practice", prompt: "capCount 1.",
      setup: (_c, api) => api.runSpef(), check: (_c, api) => api.getLast().capCount === GOLDENS.spefCapCount },
    { id: "req", title: "R_eq", level: "Practice", prompt: "rEq 3.06.",
      setup: (_c, api) => api.runSpef(), check: (_c, api) => api.getLast().rEq === GOLDENS.rTotal },
    { id: "ceq", title: "C_eq", level: "Practice", prompt: "cEq 1.376.",
      setup: (_c, api) => api.runSpef(), check: (_c, api) => api.getLast().cEq === GOLDENS.cTotal },
    { id: "selr", title: "Select R_eq", level: "Practice", prompt: "Click R_eq.",
      setup: (_c, api) => { api.runSpef(); api.select("R_eq"); }, check: (_c, api) => api.getSelected().includes("R_eq") },
    { id: "seln", title: "Select n1", level: "Practice", prompt: "Click n1.",
      setup: (_c, api) => { api.runSpef(); api.select("n1"); }, check: (_c, api) => api.getSelected().includes("n1") },
    { id: "golden", title: "resCount", level: "Challenge", prompt: "resCount=1.", check: () => GOLDENS.spefResCount === 1 },""",
        "spef",
    ),
    "pex-engine": ch(
        "PEX engine",
        "Run engine; select s1; confirm ok=True.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "geo", title: "Geometry", level: "Practice", prompt: "segmentCount 4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().geometry.segmentCount === GOLDENS.segmentCount },
    { id: "rt", title: "R total", level: "Practice", prompt: "resistance rTotal 3.06.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().resistance.rTotal === GOLDENS.rTotal },
    { id: "ct", title: "C total", level: "Practice", prompt: "capacitance cTotal 1.376.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().capacitance.cTotal === GOLDENS.cTotal },
    { id: "red", title: "Reduce", level: "Practice", prompt: "reduced afterNodes 2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().reduced.afterNodes === GOLDENS.nodesAfter },
    { id: "s1", title: "Select s1", level: "Practice", prompt: "Click s1.",
      setup: (_c, api) => { api.engine(); api.select("s1"); }, check: (_c, api) => api.getSelected().includes("s1") },
    { id: "golden", title: "ok", level: "Challenge", prompt: "ok=true.", check: (_c, api) => api.engine().ok === true },""",
        "engine",
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
    write(WALK / "pex-algos.js", (Path(__file__).parent / "_pex_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "PEX_ALGOS" not in text:
        text = text.replace(
            'import { LVS_ALGOS } from "./lvs-algos.js";\n'
            'import { drawLvs, STARTER as LVS_STARTER } from "../../assets/lvs-core.js";\n',
            'import { LVS_ALGOS } from "./lvs-algos.js";\n'
            'import { drawLvs, STARTER as LVS_STARTER } from "../../assets/lvs-core.js";\n'
            'import { PEX_ALGOS } from "./pex-algos.js";\n'
            'import { drawPex, STARTER as PEX_STARTER } from "../../assets/pex-core.js";\n',
        )
        text = text.replace(
            "  ...LVS_ALGOS,\n",
            "  ...LVS_ALGOS,\n  ...PEX_ALGOS,\n",
        )
        if 'pack.kind === "pex"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "lvs") {',
                '''  } else if (pack.kind === "pex") {
    drawPex(canvas, {
      highlight: s.highlight || [],
      selected: s.selected || [],
      metricText: s.metricText || null,
      stageLabel: s.stageLabel || s.mode || null,
    });
  } else if (pack.kind === "lvs") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"geometry-load"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"lvs-engine": ("lvs-engine", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="pex"' not in it:
        section = """
    <section class="tool-section" id="pex">
      <h2>PEX / parasitic extract</h2>
      <ul class="tool-list">
        <li><a href="geometry-load/">Geometry load</a></li>
        <li><a href="resistance-extract/">Resistance extract</a></li>
        <li><a href="capacitance-extract/">Capacitance extract</a></li>
        <li><a href="rc-network/">RC network build</a></li>
        <li><a href="network-reduce/">Network reduction</a></li>
        <li><a href="back-annotate/">Back-annotate nets</a></li>
        <li><a href="spef-lite/">SPEF-lite emit</a></li>
        <li><a href="pex-engine/">PEX engine</a></li>
      </ul>
    </section>

"""
        if 'id="lvs"' in it:
            it = it.replace(
                '    <section class="tool-section" id="pattern-matching">',
                section + '    <section class="tool-section" id="pattern-matching">',
            )
        elif 'id="drc"' in it:
            it = it.replace(
                '    <section class="tool-section" id="pattern-matching">',
                section + '    <section class="tool-section" id="pattern-matching">',
            )
        else:
            it = it.replace(
                '    <section class="tool-section" id="compaction">',
                section + '    <section class="tool-section" id="compaction">',
            )
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools/index.html")

    pub = PUBLISH.read_text(encoding="utf-8")
    course_meta = pub.split("COURSE_META")[1].split("LADDER_STUBS")[0]
    if '"repo": "learn_pex"' not in course_meta:
        entry = '''    "learn_pex": {
        "title": "PEX for EDA",
        "focus": "Geometry load → R extract → C extract → RC network → reduce → annotate → SPEF-lite → engine",
        "prereq": "learn_lvs",
        "status": "ready",
        "repo": "learn_pex",
        "modules_md": ROOT / "courses" / "learn_pex" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_pex",
        "lead": (
            "Parasitic extraction literacy on tiny_pex — geometry load, resistance/capacitance extract, "
            "RC network build, network reduction, back-annotate, SPEF-lite emit, engine. Clips and decks load from "
            "<code>courses/learn_pex</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#pex",
        "tools_label": "PEX tools",
        "first_lab": "geometry-load",
        "first_n": "02",
    },
'''
        anchor = '        "first_n": "02",\n    },\n    "learn_multi_patterning": {'
        if anchor in course_meta:
            pub = pub.replace(anchor, '        "first_n": "02",\n    },\n' + entry + '    "learn_multi_patterning": {', 1)
            PUBLISH.write_text(pub, encoding="utf-8", newline="\n")
            print("Patched publish_course_platform.py COURSE_META learn_pex")
    print("OK")


if __name__ == "__main__":
    main()
