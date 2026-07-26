#!/usr/bin/env python3
"""Generate learn_pattern_matching tools + wire walkthrough."""
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

IMP = """import { GOLDENS } from "../../assets/pattern-matching-core.js";
import { createInteractivePatternLab } from "../../assets/interactive-pattern-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractivePatternLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "edges-polygons": ch(
        "Edges and polygons",
        "Inspect shapes and edge counts.",
        """    { id: "n5", title: "Five shapes", level: "Intro", prompt: "shapeCount is 5.", check: (_c, api) => api.getStats().shapeCount === GOLDENS.shapeCount },
    { id: "e20", title: "Edges 20", level: "Intro", prompt: "edgeCount is 20.", check: (_c, api) => api.getStats().edgeCount === GOLDENS.edgeCount },
    { id: "layers", title: "3 layers", level: "Practice", prompt: "layerCount is 3.", check: (_c, api) => api.getStats().layerCount === GOLDENS.layerCount },
    { id: "m1", title: "3 on M1", level: "Practice", prompt: "m1ShapeCount is 3.", check: (_c, api) => api.getStats().m1ShapeCount === GOLDENS.m1ShapeCount },
    { id: "sel-a", title: "Select A", level: "Practice", prompt: "Select A.", check: (_c, api) => api.getSelected() === "A" },
    { id: "has-v", title: "Has via V", level: "Practice", prompt: "Shapes include V.", check: (_c, api) => api.getShapes().some(s => s.id==="V") },
    { id: "has-d", title: "Has thin D", level: "Practice", prompt: "D present.", check: (_c, api) => api.getShapes().some(s => s.id==="D") },
    { id: "golden", title: "GOLDENS", level: "Challenge", prompt: "shapeCount golden 5.", check: () => GOLDENS.shapeCount === 5 },""",
    ),
    "single-layer-edge-pair": ch(
        "Single-layer edge-pair (space)",
        "Match M1 spacing; confirm A–B marker.",
        """    { id: "run", title: "Run space", level: "Intro", prompt: "Click Match space.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => api.getMode() === "space" },
    { id: "one", title: "One marker", level: "Intro", prompt: "Exactly one space marker.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => api.getMarkers().length === GOLDENS.spaceMarkers },
    { id: "ab", title: "A and B", level: "Practice", prompt: "Marker shapes are A and B.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => { const m=api.getMarkers()[0]; return m && new Set(m.shapes).has("A") && new Set(m.shapes).has("B"); } },
    { id: "gap", title: "Gap 1", level: "Practice", prompt: "value is 1.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => api.getMarkers()[0].value === 1 },
    { id: "limit", title: "Limit 2", level: "Practice", prompt: "limit is 2.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => api.getMarkers()[0].limit === 2 },
    { id: "type", title: "Type space", level: "Practice", prompt: "type is space.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => api.getMarkers()[0].type === "space" },
    { id: "reset", title: "Reset clears", level: "Practice", prompt: "After reset markers empty.",
      setup: (_c, api) => { api.matchSpace(); api.reset(); }, check: (_c, api) => api.getMarkers().length === 0 },
    { id: "golden", title: "spaceMarkers", level: "Challenge", prompt: "spaceMarkers=1.", check: () => GOLDENS.spaceMarkers === 1 },""",
    ),
    "single-layer-region": ch(
        "Single-layer region (width)",
        "Match width; confirm marker on D.",
        """    { id: "run", title: "Run width", level: "Intro", prompt: "Click Match width.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMode() === "width" },
    { id: "one", title: "One marker", level: "Intro", prompt: "One width marker.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMarkers().length === GOLDENS.widthMarkers },
    { id: "d", title: "On D", level: "Practice", prompt: "Marker on D.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMarkers()[0].shapes[0] === "D" },
    { id: "val", title: "Value 1", level: "Practice", prompt: "value is 1.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMarkers()[0].value === 1 },
    { id: "lim", title: "Limit 3", level: "Practice", prompt: "limit is 3.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMarkers()[0].limit === 3 },
    { id: "sel", title: "Select D", level: "Practice", prompt: "Select D.", check: (_c, api) => { api.setSelected("D"); return api.getSelected()==="D"; } },
    { id: "type", title: "Type width", level: "Practice", prompt: "type width.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMarkers()[0].type === "width" },
    { id: "golden", title: "widthMarkers", level: "Challenge", prompt: "widthMarkers=1.", check: () => GOLDENS.widthMarkers === 1 },""",
    ),
    "scanline-sweep": ch(
        "Scanline edge sweep",
        "Build M1 scanline events; confirm 6.",
        """    { id: "run", title: "Run scanline", level: "Intro", prompt: "Click Scanline M1.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => api.getMode() === "scanline" },
    { id: "six", title: "Six events", level: "Intro", prompt: "6 events.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => api.getLast().events.length === GOLDENS.scanEventsM1 },
    { id: "enter", title: "Has enter", level: "Practice", prompt: "Has enter kind.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => api.getLast().events.some(e => e.kind==="enter") },
    { id: "leave", title: "Has leave", level: "Practice", prompt: "Has leave kind.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => api.getLast().events.some(e => e.kind==="leave") },
    { id: "a", title: "Includes A", level: "Practice", prompt: "Events mention A.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => api.getLast().events.some(e => e.shape==="A") },
    { id: "sorted", title: "Sorted x", level: "Practice", prompt: "Nondecreasing x.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => { const e=api.getLast().events; return e.every((x,i)=> i===0 || e[i-1].x<=x.x); } },
    { id: "m1", title: "M1 shapes 3", level: "Practice", prompt: "m1ShapeCount 3.", check: (_c, api) => api.getStats().m1ShapeCount === 3 },
    { id: "golden", title: "scanEventsM1", level: "Challenge", prompt: "scanEventsM1=6.", check: () => GOLDENS.scanEventsM1 === 6 },""",
    ),
    "marker-emit": ch(
        "Marker emit",
        "Emit width+space markers; confirm ≥2.",
        """    { id: "run", title: "Emit", level: "Intro", prompt: "Click Emit markers.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMode() === "emit" },
    { id: "ge2", title: "At least 2", level: "Intro", prompt: "markers.length ≥ 2.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMarkers().length >= 2 },
    { id: "has-w", title: "Has width", level: "Practice", prompt: "Includes width.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMarkers().some(m => m.type==="width") },
    { id: "has-s", title: "Has space", level: "Practice", prompt: "Includes space.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMarkers().some(m => m.type==="space") },
    { id: "d", title: "Width on D", level: "Practice", prompt: "Width shapes D.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMarkers().some(m => m.type==="width" && m.shapes[0]==="D") },
    { id: "ab", title: "Space A B", level: "Practice", prompt: "Space involves A.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMarkers().some(m => m.type==="space" && m.shapes.includes("A")) },
    { id: "reset", title: "Reset", level: "Practice", prompt: "Reset clears markers.",
      setup: (_c, api) => { api.emitMarkers(); api.reset(); }, check: (_c, api) => api.getMarkers().length === 0 },
    { id: "golden", title: "W+S", level: "Challenge", prompt: "width+space goldens 1+1.", check: () => GOLDENS.widthMarkers+GOLDENS.spaceMarkers === 2 },""",
    ),
    "multi-layer-via": ch(
        "Multi-layer via enclosure",
        "Via check: M1 OK, M2 fails.",
        """    { id: "run", title: "Via check", level: "Intro", prompt: "Click Via check.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getMode() === "via" },
    { id: "m1", title: "m1_ok", level: "Intro", prompt: "m1_ok true.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getLast().m1_ok === true },
    { id: "m2", title: "m2 fail", level: "Practice", prompt: "m2_ok false.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getLast().m2_ok === false },
    { id: "one", title: "One marker", level: "Practice", prompt: "enclosure_markers=1.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getLast().enclosure_markers === GOLDENS.enclosureMarkers },
    { id: "type", title: "Type encl", level: "Practice", prompt: "type enclosure.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getMarkers()[0].type === "enclosure" },
    { id: "inner", title: "Inner V", level: "Practice", prompt: "inner is V.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getMarkers()[0].inner === "V" },
    { id: "sel", title: "Select V", level: "Practice", prompt: "Select V.", check: (_c, api) => { api.setSelected("V"); return api.getSelected()==="V"; } },
    { id: "golden", title: "enclosureMarkers", level: "Challenge", prompt: "enclosureMarkers=1.", check: () => GOLDENS.enclosureMarkers === 1 },""",
    ),
    "multi-layer-interaction": ch(
        "Multi-layer interactions",
        "List cross-layer overlaps; confirm A–V.",
        """    { id: "run", title: "Interactions", level: "Intro", prompt: "Click Interactions.",
      setup: (_c, api) => api.interactions(), check: (_c, api) => api.getMode() === "interactions" },
    { id: "ge1", title: "At least 1", level: "Intro", prompt: "pairs.length ≥ 1.",
      setup: (_c, api) => api.interactions(), check: (_c, api) => api.getLast().pairs.length >= 1 },
    { id: "av", title: "Has A-V", level: "Practice", prompt: "Includes A and V.",
      setup: (_c, api) => api.interactions(), check: (_c, api) => api.getLast().pairs.some(p => { const s=new Set(p.shapes); return s.has("A")&&s.has("V"); }) },
    { id: "cross", title: "Cross layer", level: "Practice", prompt: "layers differ.",
      setup: (_c, api) => api.interactions(), check: (_c, api) => api.getLast().pairs.every(p => p.layers[0]!==p.layers[1]) },
    { id: "sel", title: "Select V", level: "Practice", prompt: "Select V.", check: (_c, api) => { api.setSelected("V"); return api.getSelected()==="V"; } },
    { id: "shapes5", title: "5 shapes", level: "Practice", prompt: "shapeCount 5.", check: (_c, api) => api.getStats().shapeCount === 5 },
    { id: "mode", title: "Mode set", level: "Practice", prompt: "mode interactions.",
      setup: (_c, api) => api.interactions(), check: (_c, api) => api.getMode()==="interactions" },
    { id: "golden", title: "shapeCount", level: "Challenge", prompt: "shapeCount=5.", check: () => GOLDENS.shapeCount === 5 },""",
    ),
    "layered-boolean": ch(
        "Layered boolean (AND/OR)",
        "Boolean and_not hits V.",
        """    { id: "run", title: "Boolean", level: "Intro", prompt: "Click Boolean and_not.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getMode() === "boolean" },
    { id: "one", title: "One hit", level: "Intro", prompt: "hits.length=1.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getLast().hits.length === GOLDENS.booleanAndHits },
    { id: "v", title: "On V", level: "Practice", prompt: "hit shape V.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getLast().hits[0].shape === "V" },
    { id: "m1", title: "m1 true", level: "Practice", prompt: "m1 covered.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getLast().hits[0].m1 === true },
    { id: "m2", title: "m2 false", level: "Practice", prompt: "m2 not covered.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getLast().hits[0].m2 === false },
    { id: "mode", title: "Mode and_not", level: "Practice", prompt: "mode and_not.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getLast().hits[0].mode === "and_not" },
    { id: "sel", title: "Select V", level: "Practice", prompt: "Select V.", check: (_c, api) => { api.setSelected("V"); return api.getSelected()==="V"; } },
    { id: "golden", title: "booleanAndHits", level: "Challenge", prompt: "booleanAndHits=1.", check: () => GOLDENS.booleanAndHits === 1 },""",
    ),
    "match-engine": ch(
        "Match engine pass",
        "Run full engine; confirm count=3.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Match engine.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "three", title: "Count 3", level: "Intro", prompt: "count is 3.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getLast().count === GOLDENS.matchEngineMarkers },
    { id: "w", title: "Width 1", level: "Practice", prompt: "width=1.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getLast().width === 1 },
    { id: "s", title: "Space 1", level: "Practice", prompt: "space=1.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getLast().space === 1 },
    { id: "e", title: "Encl 1", level: "Practice", prompt: "enclosure=1.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getLast().enclosure === 1 },
    { id: "markers", title: "Markers 3", level: "Practice", prompt: "markers.length 3.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getMarkers().length === 3 },
    { id: "bool", title: "Boolean hit", level: "Practice", prompt: "boolean_and_not length 1.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getLast().boolean_and_not.length === 1 },
    { id: "golden", title: "matchEngineMarkers", level: "Challenge", prompt: "matchEngineMarkers=3.", check: () => GOLDENS.matchEngineMarkers === 3 },""",
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
    write(WALK / "pattern-algos.js", (Path(__file__).parent / "_pattern_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "PATTERN_ALGOS" not in text:
        text = text.replace(
            'import { COMPACTION_ALGOS } from "./compaction-algos.js";\n'
            'import { drawCompaction } from "../../assets/compaction-core.js";\n',
            'import { COMPACTION_ALGOS } from "./compaction-algos.js";\n'
            'import { drawCompaction } from "../../assets/compaction-core.js";\n'
            'import { PATTERN_ALGOS } from "./pattern-algos.js";\n'
            'import { drawPatternMatching, STARTER as PATTERN_STARTER, CHIP as PATTERN_CHIP } from "../../assets/pattern-matching-core.js";\n',
        )
        text = text.replace(
            "  ...COMPACTION_ALGOS,\n};",
            "  ...COMPACTION_ALGOS,\n  ...PATTERN_ALGOS,\n};",
        )
        if 'pack.kind === "pattern"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "compaction") {',
                '''  } else if (pack.kind === "pattern") {
    drawPatternMatching(canvas, {
      shapes: s.shapes || PATTERN_STARTER,
      chip: s.chip || PATTERN_CHIP,
      selected: s.selected || null,
      highlight: s.highlight || [],
      markers: s.markers || [],
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "compaction") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"edges-polygons"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"sequential-compact": ("sequential-compact", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="pattern-matching"' not in it:
        section = """
    <section class="tool-section" id="pattern-matching">
      <h2>Pattern matching</h2>
      <ul class="tool-list">
        <li><a href="edges-polygons/">Edges and polygons</a></li>
        <li><a href="single-layer-edge-pair/">Single-layer edge-pair</a></li>
        <li><a href="single-layer-region/">Single-layer region</a></li>
        <li><a href="scanline-sweep/">Scanline sweep</a></li>
        <li><a href="marker-emit/">Marker emit</a></li>
        <li><a href="multi-layer-via/">Multi-layer via</a></li>
        <li><a href="multi-layer-interaction/">Multi-layer interactions</a></li>
        <li><a href="layered-boolean/">Layered boolean</a></li>
        <li><a href="match-engine/">Match engine</a></li>
      </ul>
    </section>

"""
        it = it.replace(
            '    <section class="tool-section" id="compaction">',
            section + '    <section class="tool-section" id="compaction">',
        )
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools/index.html")
    print("OK")


if __name__ == "__main__":
    main()
