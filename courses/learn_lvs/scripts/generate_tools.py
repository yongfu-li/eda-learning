#!/usr/bin/env python3
"""Generate learn_lvs tools + wire walkthrough."""
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

IMP = """import { GOLDENS } from "../../assets/lvs-core.js";
import { createInteractiveLvsLab } from "../../assets/interactive-lvs-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js, default_mode=None):
    mode_line = f'\n  defaultMode: "{default_mode}",' if default_mode else ""
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveLvsLab(root, {{{mode_line}\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "schematic-graph": ch(
        "Schematic graph",
        "Inspect schematic graph; select mn1 and confirm 2 devices, 4 nets.",
        """    { id: "run", title: "Schematic", level: "Intro", prompt: "Click Schematic.",
      setup: (_c, api) => api.showSchematic(), check: (_c, api) => api.getMode() === "schematic" },
    { id: "d2", title: "Two devices", level: "Intro", prompt: "deviceCount 2.",
      setup: (_c, api) => api.showSchematic(), check: (_c, api) => api.getLast().deviceCount === GOLDENS.schDeviceCount },
    { id: "n4", title: "Four nets", level: "Practice", prompt: "netCount 4.",
      setup: (_c, api) => api.showSchematic(), check: (_c, api) => api.getLast().netCount === GOLDENS.schNetCount },
    { id: "mn1", title: "Select mn1", level: "Practice", prompt: "Click mn1.",
      setup: (_c, api) => { api.showSchematic(); api.select("mn1"); }, check: (_c, api) => api.getSelected().includes("mn1") },
    { id: "mp1", title: "Select mp1", level: "Practice", prompt: "Click mp1.",
      setup: (_c, api) => { api.showSchematic(); api.select("mp1"); }, check: (_c, api) => api.getSelected().includes("mp1") },
    { id: "a", title: "Net a", level: "Practice", prompt: "Select net a.",
      setup: (_c, api) => { api.showSchematic(); api.select("a"); }, check: (_c, api) => api.getSelected().includes("a") },
    { id: "e6", title: "Six edges", level: "Practice", prompt: "edgeCount 6.",
      setup: (_c, api) => api.showSchematic(), check: (_c, api) => api.getLast().edgeCount === 6 },
    { id: "golden", title: "schDeviceCount", level: "Challenge", prompt: "schDeviceCount=2.", check: () => GOLDENS.schDeviceCount === 2 },""",
        "schematic",
    ),
    "device-recog": ch(
        "Device recognition",
        "Recognize layout MOS; select X0/X1 and confirm nmos=1, pmos=1.",
        """    { id: "run", title: "Recognize", level: "Intro", prompt: "Click Recognize.",
      setup: (_c, api) => api.runRecognize(), check: (_c, api) => api.getMode() === "recognize" },
    { id: "c2", title: "Two devices", level: "Intro", prompt: "count 2.",
      setup: (_c, api) => api.runRecognize(), check: (_c, api) => api.getLast().count === GOLDENS.layDeviceCount },
    { id: "n1", title: "One nmos", level: "Practice", prompt: "nmos 1.",
      setup: (_c, api) => api.runRecognize(), check: (_c, api) => api.getLast().nmos === GOLDENS.recogNmos },
    { id: "p1", title: "One pmos", level: "Practice", prompt: "pmos 1.",
      setup: (_c, api) => api.runRecognize(), check: (_c, api) => api.getLast().pmos === GOLDENS.recogPmos },
    { id: "x0", title: "Select X0", level: "Practice", prompt: "Click X0.",
      setup: (_c, api) => { api.runRecognize(); api.select("X0"); }, check: (_c, api) => api.getSelected().includes("X0") },
    { id: "x1", title: "Select X1", level: "Practice", prompt: "Click X1.",
      setup: (_c, api) => { api.runRecognize(); api.select("X1"); }, check: (_c, api) => api.getSelected().includes("X1") },
    { id: "sh9", title: "Nine shapes", level: "Practice", prompt: "shapeCount 9.",
      setup: (_c, api) => api.runRecognize(), check: (_c, api) => api.getLast().shapeCount === GOLDENS.layShapeCount },
    { id: "golden", title: "recogNmos", level: "Challenge", prompt: "recogNmos=1.", check: () => GOLDENS.recogNmos === 1 },""",
        "recognize",
    ),
    "net-extract": ch(
        "Net extraction",
        "Extract layout nets; select net_a and net_y; confirm 4 nets.",
        """    { id: "run", title: "Extract", level: "Intro", prompt: "Click Extract.",
      setup: (_c, api) => api.runExtract(), check: (_c, api) => api.getMode() === "extract" },
    { id: "c4", title: "Four nets", level: "Intro", prompt: "count 4.",
      setup: (_c, api) => api.runExtract(), check: (_c, api) => api.getLast().count === GOLDENS.layNetCount },
    { id: "na", title: "net_a", level: "Practice", prompt: "ids include net_a.",
      setup: (_c, api) => api.runExtract(), check: (_c, api) => api.getLast().ids.includes("net_a") },
    { id: "ny", title: "net_y", level: "Practice", prompt: "ids include net_y.",
      setup: (_c, api) => api.runExtract(), check: (_c, api) => api.getLast().ids.includes("net_y") },
    { id: "sela", title: "Select net_a", level: "Practice", prompt: "Click net_a.",
      setup: (_c, api) => { api.runExtract(); api.select("net_a"); }, check: (_c, api) => api.getSelected().includes("net_a") },
    { id: "sely", title: "Select net_y", level: "Practice", prompt: "Click net_y.",
      setup: (_c, api) => { api.runExtract(); api.select("net_y"); }, check: (_c, api) => api.getSelected().includes("net_y") },
    { id: "vdd", title: "net_vdd", level: "Practice", prompt: "ids include net_vdd.",
      setup: (_c, api) => api.runExtract(), check: (_c, api) => api.getLast().ids.includes("net_vdd") },
    { id: "golden", title: "layNetCount", level: "Challenge", prompt: "layNetCount=4.", check: () => GOLDENS.layNetCount === 4 },""",
        "extract",
    ),
    "layout-graph": ch(
        "Layout graph",
        "Build layout graph; select X0 and confirm 2 devices, 6 edges.",
        """    { id: "run", title: "Layout", level: "Intro", prompt: "Click Layout.",
      setup: (_c, api) => api.showLayout(), check: (_c, api) => api.getMode() === "layout" },
    { id: "d2", title: "Two devices", level: "Intro", prompt: "deviceCount 2.",
      setup: (_c, api) => api.showLayout(), check: (_c, api) => api.getLast().deviceCount === GOLDENS.layDeviceCount },
    { id: "n4", title: "Four nets", level: "Practice", prompt: "netCount 4.",
      setup: (_c, api) => api.showLayout(), check: (_c, api) => api.getLast().netCount === GOLDENS.layNetCount },
    { id: "e6", title: "Six edges", level: "Practice", prompt: "edgeCount 6.",
      setup: (_c, api) => api.showLayout(), check: (_c, api) => api.getLast().edgeCount === 6 },
    { id: "x0", title: "Select X0", level: "Practice", prompt: "Click X0.",
      setup: (_c, api) => { api.showLayout(); api.select("X0"); }, check: (_c, api) => api.getSelected().includes("X0") },
    { id: "x1", title: "Select X1", level: "Practice", prompt: "Click X1.",
      setup: (_c, api) => { api.showLayout(); api.select("X1"); }, check: (_c, api) => api.getSelected().includes("X1") },
    { id: "net", title: "Select net_a", level: "Practice", prompt: "Click net_a.",
      setup: (_c, api) => { api.showLayout(); api.select("net_a"); }, check: (_c, api) => api.getSelected().includes("net_a") },
    { id: "golden", title: "layDeviceCount", level: "Challenge", prompt: "layDeviceCount=2.", check: () => GOLDENS.layDeviceCount === 2 },""",
        "layout",
    ),
    "pin-binding": ch(
        "Pin binding",
        "Inspect binding table; select X0 and mn1; confirm 4 net binds.",
        """    { id: "run", title: "Binding", level: "Intro", prompt: "Click Binding.",
      setup: (_c, api) => api.runBinding(), check: (_c, api) => api.getMode() === "binding" },
    { id: "x0mn1", title: "X0→mn1", level: "Intro", prompt: "devices X0 maps mn1.",
      setup: (_c, api) => api.runBinding(), check: (_c, api) => api.getLast().devices.X0 === "mn1" },
    { id: "x1mp1", title: "X1→mp1", level: "Practice", prompt: "devices X1 maps mp1.",
      setup: (_c, api) => api.runBinding(), check: (_c, api) => api.getLast().devices.X1 === "mp1" },
    { id: "n4", title: "Four nets", level: "Practice", prompt: "netCount 4.",
      setup: (_c, api) => api.runBinding(), check: (_c, api) => api.getLast().netCount === 4 },
    { id: "selx0", title: "Select X0", level: "Practice", prompt: "Click X0.",
      setup: (_c, api) => { api.runBinding(); api.select("X0"); }, check: (_c, api) => api.getSelected().includes("X0") },
    { id: "selmn1", title: "Select mn1", level: "Practice", prompt: "Click mn1.",
      setup: (_c, api) => { api.runBinding(); api.select("mn1"); }, check: (_c, api) => api.getSelected().includes("mn1") },
    { id: "neta", title: "net_a→a", level: "Practice", prompt: "nets net_a maps a.",
      setup: (_c, api) => api.runBinding(), check: (_c, api) => api.getLast().nets.net_a === "a" },
    { id: "golden", title: "device binds", level: "Challenge", prompt: "deviceCount=2.", check: (_c, api) => api.runBinding().deviceCount === 2 },""",
        "binding",
    ),
    "device-match": ch(
        "Device match",
        "Run match; select X0; confirm matched_devices=2, mismatch_count=0.",
        """    { id: "run", title: "Match", level: "Intro", prompt: "Click Match.",
      setup: (_c, api) => api.runMatch(), check: (_c, api) => api.getMode() === "match" },
    { id: "m2", title: "Matched 2", level: "Intro", prompt: "count 2.",
      setup: (_c, api) => api.runMatch(), check: (_c, api) => api.getLast().count === GOLDENS.matchedDevices },
    { id: "mm0", title: "No mismatch", level: "Practice", prompt: "mismatchCount 0.",
      setup: (_c, api) => api.runMatch(), check: (_c, api) => api.getLast().mismatchCount === 0 },
    { id: "x0", title: "Select X0", level: "Practice", prompt: "Click X0.",
      setup: (_c, api) => { api.runMatch(); api.select("X0"); }, check: (_c, api) => api.getSelected().includes("X0") },
    { id: "x1", title: "Select X1", level: "Practice", prompt: "Click X1.",
      setup: (_c, api) => { api.runMatch(); api.select("X1"); }, check: (_c, api) => api.getSelected().includes("X1") },
    { id: "mn1", title: "mn1 pair", level: "Practice", prompt: "matched includes X0→mn1.",
      setup: (_c, api) => api.runMatch(), check: (_c, api) => api.getLast().matched.some(m => m.layout === "X0" && m.schematic === "mn1") },
    { id: "mp1", title: "mp1 pair", level: "Practice", prompt: "matched includes X1→mp1.",
      setup: (_c, api) => api.runMatch(), check: (_c, api) => api.getLast().matched.some(m => m.layout === "X1" && m.schematic === "mp1") },
    { id: "golden", title: "matchedDevices", level: "Challenge", prompt: "matchedDevices=2.", check: () => GOLDENS.matchedDevices === 2 },""",
        "match",
    ),
    "lvs-compare": ch(
        "LVS compare",
        "Run compare; select net_a; confirm mismatch_count=0, matched_nets=4.",
        """    { id: "run", title: "Compare", level: "Intro", prompt: "Click Compare.",
      setup: (_c, api) => api.runCompare(), check: (_c, api) => api.getMode() === "compare" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.runCompare(), check: (_c, api) => api.getLast().ok === true },
    { id: "mm0", title: "Zero mismatch", level: "Practice", prompt: "mismatchCount 0.",
      setup: (_c, api) => api.runCompare(), check: (_c, api) => api.getLast().mismatchCount === GOLDENS.mismatchCount },
    { id: "mn4", title: "Four nets", level: "Practice", prompt: "matchedNetCount 4.",
      setup: (_c, api) => api.runCompare(), check: (_c, api) => api.getLast().matchedNetCount === GOLDENS.matchedNets },
    { id: "sel", title: "Select net_a", level: "Practice", prompt: "Click net_a.",
      setup: (_c, api) => { api.runCompare(); api.select("net_a"); }, check: (_c, api) => api.getSelected().includes("net_a") },
    { id: "sely", title: "Select net_y", level: "Practice", prompt: "Click net_y.",
      setup: (_c, api) => { api.runCompare(); api.select("net_y"); }, check: (_c, api) => api.getSelected().includes("net_y") },
    { id: "md2", title: "Devices 2", level: "Practice", prompt: "matchedDevices 2.",
      setup: (_c, api) => api.runCompare(), check: (_c, api) => api.getLast().matchedDevices === GOLDENS.matchedDevices },
    { id: "golden", title: "mismatchCount", level: "Challenge", prompt: "mismatchCount=0.", check: () => GOLDENS.mismatchCount === 0 },""",
        "compare",
    ),
    "lvs-engine": ch(
        "LVS engine",
        "Run engine; select mn1; confirm ok=True.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "sch2", title: "Sch devices", level: "Practice", prompt: "schematic deviceCount 2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().schematic.deviceCount === GOLDENS.schDeviceCount },
    { id: "lay2", title: "Lay devices", level: "Practice", prompt: "recognize count 2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().recognize.count === GOLDENS.layDeviceCount },
    { id: "nets4", title: "Four nets", level: "Practice", prompt: "extract count 4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().extract.count === GOLDENS.layNetCount },
    { id: "cmp", title: "Compare ok", level: "Practice", prompt: "compare ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().compare.ok === true },
    { id: "sel", title: "Select mn1", level: "Practice", prompt: "Click mn1.",
      setup: (_c, api) => { api.engine(); api.select("mn1"); }, check: (_c, api) => api.getSelected().includes("mn1") },
    { id: "golden", title: "matchedNets", level: "Challenge", prompt: "matchedNets=4.", check: () => GOLDENS.matchedNets === 4 },""",
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
    write(WALK / "lvs-algos.js", (Path(__file__).parent / "_lvs_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "LVS_ALGOS" not in text:
        text = text.replace(
            'import { DRC_ALGOS } from "./drc-algos.js";\n'
            'import { drawDrc, STARTER as DRC_STARTER } from "../../assets/drc-core.js";\n',
            'import { DRC_ALGOS } from "./drc-algos.js";\n'
            'import { drawDrc, STARTER as DRC_STARTER } from "../../assets/drc-core.js";\n'
            'import { LVS_ALGOS } from "./lvs-algos.js";\n'
            'import { drawLvs, STARTER as LVS_STARTER } from "../../assets/lvs-core.js";\n',
        )
        text = text.replace(
            "  ...DRC_ALGOS,\n",
            "  ...DRC_ALGOS,\n  ...LVS_ALGOS,\n",
        )
        if 'pack.kind === "lvs"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "drc") {',
                '''  } else if (pack.kind === "lvs") {
    drawLvs(canvas, {
      highlight: s.highlight || [],
      selected: s.selected || [],
      metricText: s.metricText || null,
      stageLabel: s.stageLabel || s.mode || null,
    });
  } else if (pack.kind === "drc") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"schematic-graph"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"drc-engine": ("drc-engine", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="lvs"' not in it:
        section = """
    <section class="tool-section" id="lvs">
      <h2>LVS / layout vs schematic</h2>
      <ul class="tool-list">
        <li><a href="schematic-graph/">Schematic graph</a></li>
        <li><a href="device-recog/">Device recognition</a></li>
        <li><a href="net-extract/">Net extraction</a></li>
        <li><a href="layout-graph/">Layout graph</a></li>
        <li><a href="pin-binding/">Pin binding</a></li>
        <li><a href="device-match/">Device match</a></li>
        <li><a href="lvs-compare/">LVS compare</a></li>
        <li><a href="lvs-engine/">LVS engine</a></li>
      </ul>
    </section>

"""
        if 'id="drc"' in it:
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
    if '"repo": "learn_lvs"' not in course_meta:
        entry = '''    "learn_lvs": {
        "title": "LVS for EDA",
        "focus": "Schematic graph → device recog → net extract → layout graph → binding → match → compare → engine",
        "prereq": "learn_drc",
        "status": "ready",
        "repo": "learn_lvs",
        "modules_md": ROOT / "courses" / "learn_lvs" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_lvs",
        "lead": (
            "Layout vs schematic compare literacy on tiny_lvs — schematic graph, device recognition, "
            "net extraction, layout graph, pin binding, device match, LVS compare, engine. Clips and decks load from "
            "<code>courses/learn_lvs</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#lvs",
        "tools_label": "LVS tools",
        "first_lab": "schematic-graph",
        "first_n": "02",
    },
'''
        anchor = '        "first_n": "02",\n    },\n    "learn_multi_patterning": {'
        if anchor in course_meta:
            pub = pub.replace(anchor, '        "first_n": "02",\n    },\n' + entry + '    "learn_multi_patterning": {', 1)
            PUBLISH.write_text(pub, encoding="utf-8", newline="\n")
            print("Patched publish_course_platform.py COURSE_META learn_lvs")
    print("OK")


if __name__ == "__main__":
    main()
