#!/usr/bin/env python3
"""Generate learn_drc tools + wire walkthrough."""
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

IMP = """import { GOLDENS } from "../../assets/drc-core.js";
import { createInteractiveDrcLab } from "../../assets/interactive-drc-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js, default_mode=None):
    mode_line = f'\n  defaultMode: "{default_mode}",' if default_mode else ""
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveDrcLab(root, {{{mode_line}\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "rule-deck": ch(
        "Rule deck",
        "Inspect the deck; confirm 8 rules and select W.M1.",
        """    { id: "run", title: "Show deck", level: "Intro", prompt: "Click Deck.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => api.getMode() === "deck" },
    { id: "r8", title: "Eight rules", level: "Intro", prompt: "ruleCount 8.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => api.getLast().ruleCount === GOLDENS.ruleCount },
    { id: "w3", title: "Width rules", level: "Practice", prompt: "Three width rules.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => (api.getLast().byType.width || []).length === GOLDENS.widthRules },
    { id: "enc2", title: "Enclosure rules", level: "Practice", prompt: "Two enclosure rules.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => (api.getLast().byType.enclosure || []).length === GOLDENS.enclosureRules },
    { id: "sel", title: "Select W.M1", level: "Practice", prompt: "Click rule W.M1.",
      setup: (_c, api) => { api.showDeck(); api.selectRule("W.M1"); }, check: (_c, api) => api.getSelectedRules().includes("W.M1") },
    { id: "layers", title: "Three layers", level: "Practice", prompt: "layers length 3.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => api.getLast().layers.length === GOLDENS.layerCount },
    { id: "shapes", title: "Five shapes", level: "Practice", prompt: "shapeCount 5.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => api.getLast().shapeCount === GOLDENS.shapeCount },
    { id: "golden", title: "ruleCount", level: "Challenge", prompt: "ruleCount=8.", check: () => GOLDENS.ruleCount === 8 },""",
        "deck",
    ),
    "width-checker": ch(
        "Width checker",
        "Find the width violator; select D and confirm W.M1.",
        """    { id: "run", title: "Width", level: "Intro", prompt: "Click Width.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => api.getMode() === "width" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "width count 1.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => api.getLast().count === GOLDENS.widthViolations },
    { id: "d", title: "Shape D", level: "Practice", prompt: "violator is D.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => api.getLast().violations[0].shapes[0] === "D" },
    { id: "sel", title: "Select D", level: "Practice", prompt: "Click shape D.",
      setup: (_c, api) => { api.runWidth(); api.selectShape("D"); }, check: (_c, api) => api.getSelectedShapes().includes("D") },
    { id: "rule", title: "W.M1", level: "Practice", prompt: "rule_id W.M1.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => api.getLast().violations[0].rule_id === "W.M1" },
    { id: "layer", title: "M1 layer", level: "Practice", prompt: "violation on M1.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => api.getLast().violations[0].layer === "M1" },
    { id: "notab", title: "Not A/B", level: "Practice", prompt: "A and B pass width.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => !api.getLast().violations.some(v => v.shapes.includes("A") || v.shapes.includes("B")) },
    { id: "golden", title: "widthViolations", level: "Challenge", prompt: "widthViolations=1.", check: () => GOLDENS.widthViolations === 1 },""",
        "width",
    ),
    "spacing-checker": ch(
        "Spacing checker",
        "Find the spacing pair A–B; select both and confirm S.M1.",
        """    { id: "run", title: "Space", level: "Intro", prompt: "Click Space.",
      setup: (_c, api) => api.runSpace(), check: (_c, api) => api.getMode() === "space" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "space count 1.",
      setup: (_c, api) => api.runSpace(), check: (_c, api) => api.getLast().count === GOLDENS.spaceViolations },
    { id: "ab", title: "A and B", level: "Practice", prompt: "shapes A,B.",
      setup: (_c, api) => api.runSpace(), check: (_c, api) => {
        const s = new Set(api.getLast().violations[0].shapes);
        return s.has("A") && s.has("B");
      } },
    { id: "sela", title: "Select A", level: "Practice", prompt: "Click shape A.",
      setup: (_c, api) => { api.runSpace(); api.selectShape("A"); }, check: (_c, api) => api.getSelectedShapes().includes("A") },
    { id: "selb", title: "Select B", level: "Practice", prompt: "Click shape B too.",
      setup: (_c, api) => { api.runSpace(); api.selectShape("A"); api.selectShape("B"); },
      check: (_c, api) => api.getSelectedShapes().includes("A") && api.getSelectedShapes().includes("B") },
    { id: "rule", title: "S.M1", level: "Practice", prompt: "rule_id S.M1.",
      setup: (_c, api) => api.runSpace(), check: (_c, api) => api.getLast().violations[0].rule_id === "S.M1" },
    { id: "gap", title: "Gap 1", level: "Practice", prompt: "gap value 1.",
      setup: (_c, api) => api.runSpace(), check: (_c, api) => api.getLast().violations[0].value === 1 },
    { id: "golden", title: "spaceViolations", level: "Challenge", prompt: "spaceViolations=1.", check: () => GOLDENS.spaceViolations === 1 },""",
        "space",
    ),
    "enclosure-checker": ch(
        "Enclosure checker",
        "Select V; confirm VIA not enclosed by M2 (E.VIA_M2).",
        """    { id: "run", title: "Enclosure", level: "Intro", prompt: "Click Enclosure.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getMode() === "enclosure" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "enc count 1.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getLast().count === GOLDENS.enclosureViolations },
    { id: "v", title: "Inner V", level: "Practice", prompt: "inner V.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getLast().violations[0].inner === "V" },
    { id: "sel", title: "Select V", level: "Practice", prompt: "Click shape V.",
      setup: (_c, api) => { api.runEnclosure(); api.selectShape("V"); }, check: (_c, api) => api.getSelectedShapes().includes("V") },
    { id: "rule", title: "E.VIA_M2", level: "Practice", prompt: "rule_id E.VIA_M2.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getLast().violations[0].rule_id === "E.VIA_M2" },
    { id: "m2", title: "M2 outer", level: "Practice", prompt: "outer_layer M2.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getLast().violations[0].outer_layer === "M2" },
    { id: "mk", title: "Marker", level: "Practice", prompt: "markers nonempty.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getMarkers().length >= 1 },
    { id: "golden", title: "enclosureViolations", level: "Challenge", prompt: "enclosureViolations=1.", check: () => GOLDENS.enclosureViolations === 1 },""",
        "enclosure",
    ),
    "violation-markers": ch(
        "DRC violations",
        "Collect markers; confirm 3 violations with rule_id.",
        """    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode() === "markers" },
    { id: "c3", title: "Count 3", level: "Intro", prompt: "violation count 3.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().count === GOLDENS.violationCount },
    { id: "width", title: "Width kind", level: "Practice", prompt: "has width violation.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().violations.some(v => v.type === "width") },
    { id: "space", title: "Space kind", level: "Practice", prompt: "has space violation.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().violations.some(v => v.type === "space") },
    { id: "enc", title: "Enc kind", level: "Practice", prompt: "has enclosure violation.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().violations.some(v => v.type === "enclosure") },
    { id: "seld", title: "Select D", level: "Practice", prompt: "Click shape D.",
      setup: (_c, api) => { api.collect(); api.selectShape("D"); }, check: (_c, api) => api.getSelectedShapes().includes("D") },
    { id: "rid", title: "rule_id", level: "Practice", prompt: "all have rule_id.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().violations.every(v => v.rule_id) },
    { id: "golden", title: "violationCount", level: "Challenge", prompt: "violationCount=3.", check: () => GOLDENS.violationCount === 3 },""",
        "markers",
    ),
    "multi-layer-deck": ch(
        "Multi-layer deck",
        "Confirm 2 enclosure rules; E.VIA_M2 fires on V.",
        """    { id: "run", title: "Multi-layer", level: "Intro", prompt: "Click Multi-layer.",
      setup: (_c, api) => api.multiLayer(), check: (_c, api) => api.getMode() === "multilayer" },
    { id: "enc2", title: "Two enc", level: "Intro", prompt: "enclosure_count 2.",
      setup: (_c, api) => api.multiLayer(), check: (_c, api) => api.getLast().enclosureCount === GOLDENS.enclosureRules },
    { id: "fire", title: "Fire", level: "Practice", prompt: "fires count 1.",
      setup: (_c, api) => api.multiLayer(), check: (_c, api) => api.getLast().fires.count === 1 },
    { id: "rule", title: "E.VIA_M2", level: "Practice", prompt: "fire rule E.VIA_M2.",
      setup: (_c, api) => api.multiLayer(), check: (_c, api) => api.getLast().fires.violations[0].rule_id === "E.VIA_M2" },
    { id: "sel", title: "Select rule", level: "Practice", prompt: "Select E.VIA_M2.",
      setup: (_c, api) => { api.multiLayer(); api.selectRule("E.VIA_M2"); },
      check: (_c, api) => api.getSelectedRules().includes("E.VIA_M2") },
    { id: "selv", title: "Select V", level: "Practice", prompt: "Click shape V.",
      setup: (_c, api) => { api.multiLayer(); api.selectShape("V"); }, check: (_c, api) => api.getSelectedShapes().includes("V") },
    { id: "bool", title: "Boolean rule", level: "Practice", prompt: "has boolean rule.",
      setup: (_c, api) => api.multiLayer(), check: (_c, api) => api.getLast().booleanRules.includes("B.VIA_M1_not_M2") },
    { id: "golden", title: "enclosureRules", level: "Challenge", prompt: "enclosureRules=2.", check: () => GOLDENS.enclosureRules === 2 },""",
        "multilayer",
    ),
    "deck-boolean": ch(
        "Deck boolean",
        "Select V; confirm boolean hit=1 (V in M1 not M2).",
        """    { id: "run", title: "Boolean", level: "Intro", prompt: "Click Boolean.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getMode() === "boolean" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "boolean count 1.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getLast().count === GOLDENS.booleanHits },
    { id: "v", title: "Shape V", level: "Practice", prompt: "hit shape V.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getLast().hits[0].shapes[0] === "V" },
    { id: "sel", title: "Select V", level: "Practice", prompt: "Click shape V.",
      setup: (_c, api) => { api.runBoolean(); api.selectShape("V"); }, check: (_c, api) => api.getSelectedShapes().includes("V") },
    { id: "rule", title: "Deck rule", level: "Practice", prompt: "rule B.VIA_M1_not_M2.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getLast().hits[0].rule_id === "B.VIA_M1_not_M2" },
    { id: "mode", title: "and_not", level: "Practice", prompt: "mode and_not.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getLast().hits[0].mode === "and_not" },
    { id: "mk", title: "Marker", level: "Practice", prompt: "markers length 1.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getMarkers().length === 1 },
    { id: "golden", title: "booleanHits", level: "Challenge", prompt: "booleanHits=1.", check: () => GOLDENS.booleanHits === 1 },""",
        "boolean",
    ),
    "drc-engine": ch(
        "DRC engine",
        "Run engine; confirm ok and violations=3.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "v3", title: "Viol 3", level: "Practice", prompt: "violations 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().violations.count === GOLDENS.violationCount },
    { id: "w1", title: "Width 1", level: "Practice", prompt: "width 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().width.count === 1 },
    { id: "s1", title: "Space 1", level: "Practice", prompt: "space 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().space.count === 1 },
    { id: "e1", title: "Enc 1", level: "Practice", prompt: "enclosure 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().enclosure.count === 1 },
    { id: "sel", title: "Select D", level: "Practice", prompt: "Click shape D.",
      setup: (_c, api) => { api.engine(); api.selectShape("D"); }, check: (_c, api) => api.getSelectedShapes().includes("D") },
    { id: "golden", title: "violationCount", level: "Challenge", prompt: "violationCount=3.", check: () => GOLDENS.violationCount === 3 },""",
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
    write(WALK / "drc-algos.js", (Path(__file__).parent / "_drc_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "DRC_ALGOS" not in text:
        text = text.replace(
            'import { ERC_ALGOS } from "./erc-algos.js";\n'
            'import { drawErc, STARTER as ERC_STARTER } from "../../assets/erc-core.js";\n',
            'import { ERC_ALGOS } from "./erc-algos.js";\n'
            'import { drawErc, STARTER as ERC_STARTER } from "../../assets/erc-core.js";\n'
            'import { DRC_ALGOS } from "./drc-algos.js";\n'
            'import { drawDrc, STARTER as DRC_STARTER } from "../../assets/drc-core.js";\n',
        )
        text = text.replace(
            "  ...ERC_ALGOS,\n",
            "  ...ERC_ALGOS,\n  ...DRC_ALGOS,\n",
        )
        if 'pack.kind === "drc"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "erc") {',
                '''  } else if (pack.kind === "drc") {
    drawDrc(canvas, {
      design: s.design || DRC_STARTER,
      mode: s.mode || "layout",
      highlight: s.highlight || [],
      selected: s.selected || [],
      selectedShape: s.selectedShape || null,
      markers: s.markers || [],
      metricText: s.metricText || null,
      stageLabel: s.stageLabel || null,
    });
  } else if (pack.kind === "erc") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"rule-deck"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"erc-engine": ("erc-engine", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="drc"' not in it:
        section = """
    <section class="tool-section" id="drc">
      <h2>DRC / design rules</h2>
      <ul class="tool-list">
        <li><a href="rule-deck/">Rule deck</a></li>
        <li><a href="width-checker/">Width checker</a></li>
        <li><a href="spacing-checker/">Spacing checker</a></li>
        <li><a href="enclosure-checker/">Enclosure checker</a></li>
        <li><a href="violation-markers/">DRC violations</a></li>
        <li><a href="multi-layer-deck/">Multi-layer deck</a></li>
        <li><a href="deck-boolean/">Deck boolean</a></li>
        <li><a href="drc-engine/">DRC engine</a></li>
      </ul>
    </section>

"""
        if 'id="pattern-matching"' in it:
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
    if '"learn_drc": {' not in pub or '"repo": "learn_drc"' not in pub:
        entry = '''    "learn_drc": {
        "title": "DRC for EDA",
        "focus": "Rule deck → width/spacing/enclosure → markers → multi-layer → boolean → engine",
        "prereq": "learn_pattern_matching",
        "status": "ready",
        "repo": "learn_drc",
        "modules_md": ROOT / "courses" / "learn_drc" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_drc",
        "lead": (
            "Design rule check literacy on tiny_drc — rule deck load, width/spacing/enclosure checkers, "
            "violation markers, multi-layer rules, deck boolean, engine. Clips and decks load from "
            "<code>courses/learn_drc</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#drc",
        "tools_label": "DRC tools",
        "first_lab": "rule-deck",
        "first_n": "02",
    },
'''
        anchor = '    "learn_multi_patterning": {'
        if anchor in pub and '"repo": "learn_drc"' not in pub:
            pub = pub.replace(anchor, entry + anchor)
            PUBLISH.write_text(pub, encoding="utf-8", newline="\n")
            print("Patched publish_course_platform.py COURSE_META learn_drc")
    print("OK")


if __name__ == "__main__":
    main()
