#!/usr/bin/env python3
"""Generate learn_compaction tools + wire walkthrough."""
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

IMP = """import { GOLDENS } from "../../assets/compaction-core.js";
import { createInteractiveCompactionLab } from "../../assets/interactive-compaction-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveCompactionLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "leaf-cells": ch(
        "Leaf cells and bounding boxes",
        "Inspect leaf cells and bbox metrics.",
        """    { id: "n4", title: "Four objects", level: "Intro", prompt: "objectCount is 4.", check: (_c, api) => api.getStats().objectCount === GOLDENS.objectCount },
    { id: "w20", title: "Width 20", level: "Intro", prompt: "Initial width is 20.", check: (_c, api) => api.getStats().width === GOLDENS.initialWidth },
    { id: "h6", title: "Height 6", level: "Practice", prompt: "Initial height is 6.", check: (_c, api) => api.getStats().height === GOLDENS.initialHeight },
    { id: "sel-a", title: "Select A", level: "Practice", prompt: "Select cell A.", check: (_c, api) => api.getSelected() === "A" },
    { id: "has-w", title: "Has wire W", level: "Practice", prompt: "Objects include W.", check: (_c, api) => api.getObjects().some(o => o.id==="W") },
    { id: "cells3", title: "Three cells", level: "Practice", prompt: "Three kind=cell.", check: (_c, api) => api.getObjects().filter(o=>o.kind==="cell").length===3 },
    { id: "legal", title: "Legal", level: "Practice", prompt: "Starter is legal.", check: (_c, api) => api.isLegal() },
    { id: "golden", title: "GOLDENS", level: "Challenge", prompt: "initialWidth golden 20.", check: () => GOLDENS.initialWidth === 20 },""",
    ),
    "spacing-rules": ch(
        "Spacing / gap rules",
        "Check min_gap legality on the toy.",
        """    { id: "gap", title: "min_gap 1", level: "Intro", prompt: "GOLDENS.minGap is 1.", check: () => GOLDENS.minGap === 1 },
    { id: "legal", title: "Legal starter", level: "Intro", prompt: "isLegal true.", check: (_c, api) => api.isLegal() },
    { id: "reset", title: "Reset legal", level: "Practice", prompt: "After reset still legal.", check: (_c, api) => { api.reset(); return api.isLegal(); } },
    { id: "sel", title: "Select B", level: "Practice", prompt: "Select B.", check: (_c, api) => { api.setSelected("B"); return api.getSelected()==="B"; } },
    { id: "width", title: "Width 20", level: "Practice", prompt: "Width still 20 before compact.", check: (_c, api) => api.getStats().width === 20 },
    { id: "cells", title: "Cells exist", level: "Practice", prompt: "A present.", check: (_c, api) => api.getObjects().some(o=>o.id==="A") },
    { id: "ws", title: "Whitespace >0", level: "Practice", prompt: "whitespace positive.", check: (_c, api) => api.getStats().whitespace > 0 },
    { id: "golden", title: "objectCount", level: "Challenge", prompt: "objectCount=4.", check: () => GOLDENS.objectCount === 4 },""",
    ),
    "constraint-graph": ch(
        "Constraint graph",
        "Build and inspect the X constraint graph.",
        """    { id: "show", title: "Show X graph", level: "Intro", prompt: "Click X graph.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getMode() === "graph-x" },
    { id: "edges", title: "Edges ≥8", level: "Intro", prompt: "constraint edges ≥ 8.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getGraph().edges.length >= GOLDENS.xConstraintMin },
    { id: "nodes", title: "Has SRC_X", level: "Practice", prompt: "nodes include SRC_X.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getGraph().nodes.includes("SRC_X") },
    { id: "axis", title: "Axis x", level: "Practice", prompt: "graph.axis is x.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getGraph().axis === "x" },
    { id: "gap", title: "minGap 1", level: "Practice", prompt: "graph.minGap is 1.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getGraph().minGap === 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode graph-x.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getMode()==="graph-x" },
    { id: "legal", title: "Still legal", level: "Practice", prompt: "Layout still legal.", check: (_c, api) => api.isLegal() },
    { id: "golden", title: "xConstraintMin", level: "Challenge", prompt: "xConstraintMin=8.", check: () => GOLDENS.xConstraintMin === 8 },""",
    ),
    "longest-path": ch(
        "Longest-path compaction",
        "Run longest-path on the X graph.",
        """    { id: "run", title: "Longest X", level: "Intro", prompt: "Run longest path bookkeeping.",
      setup: (_c, api) => api.longestX(), check: (_c, api) => api.getMode() === "longest-x" },
    { id: "pos", title: "Has positions", level: "Intro", prompt: "last.positions exists.",
      setup: (_c, api) => api.longestX(), check: (_c, api) => !!api.getLast().positions },
    { id: "src0", title: "SRC at 0", level: "Practice", prompt: "SRC_X position is 0.",
      setup: (_c, api) => api.longestX(), check: (_c, api) => api.getLast().positions.SRC_X === 0 },
    { id: "graph", title: "Graph set", level: "Practice", prompt: "getGraph non-null.",
      setup: (_c, api) => api.longestX(), check: (_c, api) => !!api.getGraph() },
    { id: "compact", title: "Then compact", level: "Practice", prompt: "Compact X works after.",
      check: (_c, api) => { api.longestX(); return api.compactX().afterSpan === 14; } },
    { id: "legal", title: "Legal", level: "Practice", prompt: "Still legal before apply.", check: (_c, api) => api.isLegal() },
    { id: "width", title: "Width unchanged yet", level: "Practice", prompt: "Longest alone doesn't move geometry until compact.",
      setup: (_c, api) => api.longestX(), check: (_c, api) => api.getStats().width === 20 },
    { id: "golden", title: "compactXWidth", level: "Challenge", prompt: "compactXWidth=14.", check: () => GOLDENS.compactXWidth === 14 },""",
    ),
    "compact-1d": ch(
        "1-D compaction (X or Y)",
        "Compact along X and confirm 20→14.",
        """    { id: "run", title: "Compact X", level: "Intro", prompt: "Click Compact X.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.getMode() === "compact-x" },
    { id: "after", title: "After 14", level: "Intro", prompt: "afterSpan is 14.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.getLast().afterSpan === GOLDENS.compactXWidth },
    { id: "before", title: "Before 20", level: "Practice", prompt: "beforeSpan was 20.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.getLast().beforeSpan === 20 },
    { id: "improved", title: "Improved", level: "Practice", prompt: "improved true.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.getLast().improved === true },
    { id: "width", title: "Stats width 14", level: "Practice", prompt: "layout width 14.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.getStats().width === 14 },
    { id: "legal", title: "Legal after", level: "Practice", prompt: "Still legal.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.isLegal() },
    { id: "reset", title: "Reset restores 20", level: "Practice", prompt: "Reset → width 20.",
      check: (_c, api) => { api.compactX(); api.reset(); return api.getStats().width === 20; } },
    { id: "golden", title: "GOLDEN", level: "Challenge", prompt: "compactXWidth=14.", check: () => GOLDENS.compactXWidth === 14 },""",
    ),
    "compact-2d": ch(
        "2-D compaction",
        "Run X then Y compaction.",
        """    { id: "run", title: "Compact 2D", level: "Intro", prompt: "Click Compact 2D.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getMode() === "compact-2d" },
    { id: "fw", title: "Final width 14", level: "Intro", prompt: "finalWidth 14.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getLast().finalWidth === 14 },
    { id: "iw", title: "Initial width 20", level: "Practice", prompt: "initialWidth 20.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getLast().initialWidth === 20 },
    { id: "imp", title: "Width improved", level: "Practice", prompt: "widthImproved true.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getLast().widthImproved === true },
    { id: "steps", title: "Two steps", level: "Practice", prompt: "steps length 2.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getLast().steps.length === 2 },
    { id: "legal", title: "Legal", level: "Practice", prompt: "Legal after 2D.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.isLegal() },
    { id: "order", title: "Order x,y", level: "Practice", prompt: "order starts with x.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getLast().order[0] === "x" },
    { id: "golden", title: "initialWidth", level: "Challenge", prompt: "initialWidth golden 20.", check: () => GOLDENS.initialWidth === 20 },""",
    ),
    "wire-jogs": ch(
        "Wire jogs / stretch",
        "Add a jog on wire W.",
        """    { id: "jog", title: "Jog W", level: "Intro", prompt: "Click Jog W.",
      setup: (_c, api) => api.jogW(), check: (_c, api) => api.getMode() === "jog" },
    { id: "has-jog", title: "Has jog field", level: "Intro", prompt: "W has jog.",
      setup: (_c, api) => api.jogW(), check: (_c, api) => !!api.getObjects().find(o=>o.id==="W").jog },
    { id: "points", title: "Has points", level: "Practice", prompt: "W.points length ≥3.",
      setup: (_c, api) => api.jogW(), check: (_c, api) => api.getObjects().find(o=>o.id==="W").points.length >= 3 },
    { id: "sel", title: "Select W", level: "Practice", prompt: "Select W.",
      check: (_c, api) => { api.setSelected("W"); return api.getSelected()==="W"; } },
    { id: "stretched", title: "stretched flag", level: "Practice", prompt: "W.stretched true.",
      setup: (_c, api) => api.jogW(), check: (_c, api) => api.getObjects().find(o=>o.id==="W").stretched === true },
    { id: "compact", title: "Compact after jog", level: "Practice", prompt: "Compact X still works.",
      check: (_c, api) => { api.jogW(); return api.compactX().afterSpan === 14; } },
    { id: "legal", title: "Legal", level: "Practice", prompt: "Legal after jog.",
      setup: (_c, api) => api.jogW(), check: (_c, api) => api.isLegal() },
    { id: "golden", title: "minGap", level: "Challenge", prompt: "minGap=1.", check: () => GOLDENS.minGap === 1 },""",
    ),
    "shear-lite": ch(
        "Shear / channel lite",
        "Shear a channel band covering B.",
        """    { id: "run", title: "Shear", level: "Intro", prompt: "Click Shear.",
      setup: (_c, api) => api.shear(), check: (_c, api) => api.getMode() === "shear" },
    { id: "moved", title: "Moved nonempty", level: "Intro", prompt: "moved has ids.",
      setup: (_c, api) => api.shear(), check: (_c, api) => api.getLast().moved.length > 0 },
    { id: "b", title: "B moved", level: "Practice", prompt: "B is among moved.",
      setup: (_c, api) => api.shear(), check: (_c, api) => api.getLast().moved.includes("B") },
    { id: "dy", title: "deltaY 1", level: "Practice", prompt: "deltaY is 1.",
      setup: (_c, api) => api.shear(), check: (_c, api) => api.getLast().deltaY === 1 },
    { id: "channel", title: "Channel band", level: "Practice", prompt: "channel is array.",
      setup: (_c, api) => api.shear(), check: (_c, api) => Array.isArray(api.getLast().channel) },
    { id: "reset", title: "Reset", level: "Practice", prompt: "Reset restores y of B.",
      check: (_c, api) => { api.shear(); api.reset(); return api.getObjects().find(o=>o.id==="B").y0 === 2; } },
    { id: "legal", title: "Check legal", level: "Practice", prompt: "Call isLegal after shear.",
      setup: (_c, api) => api.shear(), check: (_c, api) => typeof api.isLegal() === "boolean" },
    { id: "golden", title: "objectCount", level: "Challenge", prompt: "objectCount=4.", check: () => GOLDENS.objectCount === 4 },""",
    ),
    "sequential-compact": ch(
        "Sequential compact pass",
        "Run the full sequential compaction pipeline.",
        """    { id: "run", title: "Sequential", level: "Intro", prompt: "Click Sequential.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getMode() === "sequential" },
    { id: "fw", title: "Final 14", level: "Intro", prompt: "finalWidth 14.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getLast().finalWidth === 14 },
    { id: "legal", title: "Legal true", level: "Practice", prompt: "legal true.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getLast().legal === true },
    { id: "imp", title: "Improved", level: "Practice", prompt: "improved true.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getLast().improved === true },
    { id: "iw", title: "Initial 20", level: "Practice", prompt: "initialWidth 20.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getLast().initialWidth === 20 },
    { id: "xc", title: "X constraints", level: "Practice", prompt: "xConstraints > 0.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getLast().xConstraints > 0 },
    { id: "stats", title: "Stats width 14", level: "Practice", prompt: "stats.width 14.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getStats().width === 14 },
    { id: "golden", title: "compactXWidth", level: "Challenge", prompt: "compactXWidth=14.", check: () => GOLDENS.compactXWidth === 14 },""",
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
    write(WALK / "compaction-algos.js", (Path(__file__).parent / "_compaction_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "COMPACTION_ALGOS" not in text:
        text = text.replace(
            'import { EQUIVALENCE_ALGOS } from "./equivalence-algos.js";\n',
            'import { EQUIVALENCE_ALGOS } from "./equivalence-algos.js";\n'
            'import { COMPACTION_ALGOS } from "./compaction-algos.js";\n'
            'import { drawCompaction } from "../../assets/compaction-core.js";\n',
        )
        text = text.replace(
            "  ...EQUIVALENCE_ALGOS,\n};",
            "  ...EQUIVALENCE_ALGOS,\n  ...COMPACTION_ALGOS,\n};",
        )
        if 'pack.kind === "compaction"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "equivalence") {',
                '''  } else if (pack.kind === "compaction") {
    drawCompaction(canvas, {
      objects: s.objects,
      chip: s.chip,
      selected: s.selected || null,
      highlight: s.highlight || [],
      graph: s.graph || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "equivalence") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"leaf-cells"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"sequential-cec": ("sequential-cec", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
        else:
            cap = cap.replace("\n}", ",\n    " + block + ",\n}", 1)
        CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
        print("Patched LAB_TO_ALGO")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="compaction"' not in it:
        section = """
    <section class="tool-section" id="compaction">
      <h2>Layout compaction</h2>
      <ul class="tool-list">
        <li><a href="leaf-cells/">Leaf cells</a></li>
        <li><a href="spacing-rules/">Spacing / gap rules</a></li>
        <li><a href="constraint-graph/">Constraint graph</a></li>
        <li><a href="longest-path/">Longest-path compaction</a></li>
        <li><a href="compact-1d/">1-D compaction</a></li>
        <li><a href="compact-2d/">2-D compaction</a></li>
        <li><a href="wire-jogs/">Wire jogs / stretch</a></li>
        <li><a href="shear-lite/">Shear / channel lite</a></li>
        <li><a href="sequential-compact/">Sequential compact</a></li>
      </ul>
    </section>

"""
        it = it.replace(
            '    <section class="tool-section" id="retiming">',
            section + '    <section class="tool-section" id="retiming">',
        )
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools/index.html")
    print("OK")


if __name__ == "__main__":
    main()
