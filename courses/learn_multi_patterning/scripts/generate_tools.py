#!/usr/bin/env python3
"""Generate learn_multi_patterning tools + wire walkthrough."""
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

IMP = """import { GOLDENS } from "../../assets/multi-patterning-core.js";
import { createInteractiveMpLab } from "../../assets/interactive-multi-patterning-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveMpLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "conflict-graph": ch(
        "Conflict graph",
        "Build the conflict graph; confirm 5 edges.",
        """    { id: "n6", title: "Six features", level: "Intro", prompt: "featureCount is 6.", check: (_c, api) => api.getStats().featureCount === GOLDENS.featureCount },
    { id: "run", title: "Show graph", level: "Intro", prompt: "Click Conflict graph.",
      setup: (_c, api) => api.showGraph(), check: (_c, api) => api.getMode() === "graph" },
    { id: "e5", title: "Five edges", level: "Practice", prompt: "edgeCount is 5.",
      setup: (_c, api) => api.showGraph(), check: (_c, api) => api.getGraph().edgeCount === GOLDENS.conflictEdges },
    { id: "sel", title: "Select A", level: "Practice", prompt: "Select A.", check: (_c, api) => { api.setSelected("A"); return api.getSelected()==="A"; } },
    { id: "has-c", title: "Has C", level: "Practice", prompt: "C present.", check: (_c, api) => api.getFeatures().some(f=>f.id==="C") },
    { id: "ids", title: "Has F", level: "Practice", prompt: "F present.", check: (_c, api) => api.getFeatures().some(f=>f.id==="F") },
    { id: "reset", title: "Reset", level: "Practice", prompt: "Reset clears graph mode.",
      setup: (_c, api) => { api.showGraph(); api.reset(); }, check: (_c, api) => api.getMode() == null },
    { id: "golden", title: "conflictEdges", level: "Challenge", prompt: "conflictEdges=5.", check: () => GOLDENS.conflictEdges === 5 },""",
    ),
    "double-lele": ch(
        "Double LELE",
        "Run LELE DP; confirm it fails on the toy.",
        """    { id: "run", title: "Run LELE", level: "Intro", prompt: "Click LELE DP.",
      setup: (_c, api) => api.lele(), check: (_c, api) => api.getMode() === "lele" },
    { id: "fail", title: "DP fails", level: "Intro", prompt: "ok is false.",
      setup: (_c, api) => api.lele(), check: (_c, api) => api.getLast().ok === GOLDENS.dpColorable },
    { id: "conflict", title: "Has conflict", level: "Practice", prompt: "conflict pair set.",
      setup: (_c, api) => api.lele(), check: (_c, api) => api.getLast().conflict != null },
    { id: "edges", title: "Edges 5", level: "Practice", prompt: "edgeCount 5.",
      setup: (_c, api) => api.lele(), check: (_c, api) => api.getLast().edgeCount === 5 },
    { id: "masks", title: "Masks null", level: "Practice", prompt: "masks is null.",
      setup: (_c, api) => api.lele(), check: (_c, api) => api.getLast().masks == null },
    { id: "sel", title: "Select C", level: "Practice", prompt: "Select C.", check: (_c, api) => { api.setSelected("C"); return api.getSelected()==="C"; } },
    { id: "n6", title: "Six feats", level: "Practice", prompt: "featureCount 6.", check: (_c, api) => api.getStats().featureCount === 6 },
    { id: "golden", title: "dpColorable", level: "Challenge", prompt: "dpColorable false.", check: () => GOLDENS.dpColorable === false },""",
    ),
    "bipartite-check": ch(
        "Bipartite check",
        "Path DEF is 2-colorable.",
        """    { id: "run", title: "Path DEF", level: "Intro", prompt: "Click Path DEF.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getMode() === "path-lele" },
    { id: "ok", title: "Path OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getLast().ok === GOLDENS.pathDpColorable },
    { id: "d", title: "Colors D", level: "Practice", prompt: "D colored.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getLast().colors.D != null },
    { id: "e", title: "Colors E", level: "Practice", prompt: "E colored.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getLast().colors.E != null },
    { id: "alt", title: "D≠E", level: "Practice", prompt: "D and E differ.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getLast().colors.D !== api.getLast().colors.E },
    { id: "f", title: "D=F", level: "Practice", prompt: "D and F same.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getLast().colors.D === api.getLast().colors.F },
    { id: "sel", title: "Select E", level: "Practice", prompt: "Select E.", check: (_c, api) => { api.setSelected("E"); return api.getSelected()==="E"; } },
    { id: "golden", title: "pathDpColorable", level: "Challenge", prompt: "pathDpColorable true.", check: () => GOLDENS.pathDpColorable === true },""",
    ),
    "double-sadp": ch(
        "Double SADP",
        "SADP mandrels; confirm count 3.",
        """    { id: "run", title: "Run SADP", level: "Intro", prompt: "Click SADP.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getMode() === "sadp" },
    { id: "n3", title: "Mandrels 3", level: "Intro", prompt: "mandrelCount 3.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getLast().mandrelCount === GOLDENS.sadpMandrelCount },
    { id: "has-a", title: "Has A", level: "Practice", prompt: "A is mandrel.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getLast().mandrels.includes("A") },
    { id: "has-d", title: "Has D", level: "Practice", prompt: "D is mandrel.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getLast().mandrels.includes("D") },
    { id: "sp", title: "Has spacers", level: "Practice", prompt: "spacers nonempty.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getLast().spacers.length > 0 },
    { id: "ok", title: "ok", level: "Practice", prompt: "ok true.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getLast().ok === true },
    { id: "sel", title: "Select A", level: "Practice", prompt: "Select A.", check: (_c, api) => { api.setSelected("A"); return api.getSelected()==="A"; } },
    { id: "golden", title: "sadpMandrelCount", level: "Challenge", prompt: "sadpMandrelCount=3.", check: () => GOLDENS.sadpMandrelCount === 3 },""",
    ),
    "stitch-lite": ch(
        "Stitch lite",
        "Stitch C; confirm DP becomes ok.",
        """    { id: "run", title: "Stitch", level: "Intro", prompt: "Click Stitch C.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getMode() === "stitch" },
    { id: "ok", title: "DP OK", level: "Intro", prompt: "dpOk true.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getLast().dpOk === GOLDENS.stitchMakesDp },
    { id: "c1", title: "Has C1", level: "Practice", prompt: "C1 present.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getFeatures().some(f=>f.id==="C1") },
    { id: "c2", title: "Has C2", level: "Practice", prompt: "C2 present.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getFeatures().some(f=>f.id==="C2") },
    { id: "no-c", title: "No C", level: "Practice", prompt: "C removed.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => !api.getFeatures().some(f=>f.id==="C") },
    { id: "added", title: "Added", level: "Practice", prompt: "added C1,C2.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getLast().added.join(",")==="C1,C2" },
    { id: "n7", title: "Seven feats", level: "Practice", prompt: "featureCount 7.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getStats().featureCount === 7 },
    { id: "golden", title: "stitchMakesDp", level: "Challenge", prompt: "stitchMakesDp true.", check: () => GOLDENS.stitchMakesDp === true },""",
    ),
    "triple-color": ch(
        "Triple color",
        "Triple backtrack; confirm colors_used=3.",
        """    { id: "run", title: "Triple BT", level: "Intro", prompt: "Click Triple BT.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getMode() === "triple" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().ok === true },
    { id: "used", title: "Used 3", level: "Practice", prompt: "colorsUsed 3.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().colorsUsed === GOLDENS.tpColorsUsed },
    { id: "masks", title: "Masks 3", level: "Practice", prompt: "masks 3.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().masks === 3 },
    { id: "method", title: "Method BT", level: "Practice", prompt: "method backtrack.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().method === "backtrack" },
    { id: "ca", title: "A colored", level: "Practice", prompt: "A has color.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().colors.A != null },
    { id: "sel", title: "Select B", level: "Practice", prompt: "Select B.", check: (_c, api) => { api.setSelected("B"); return api.getSelected()==="B"; } },
    { id: "golden", title: "tpColorsUsed", level: "Challenge", prompt: "tpColorsUsed=3.", check: () => GOLDENS.tpColorsUsed === 3 },""",
    ),
    "triple-decomp": ch(
        "Triple decomp",
        "Compare greedy vs backtrack 3-color.",
        """    { id: "g", title: "Greedy", level: "Intro", prompt: "Click Triple greedy.",
      setup: (_c, api) => api.tripleGreedy(), check: (_c, api) => api.getMode() === "triple-greedy" },
    { id: "gok", title: "Greedy ok", level: "Intro", prompt: "greedy ok.",
      setup: (_c, api) => api.tripleGreedy(), check: (_c, api) => api.getLast().ok === true },
    { id: "bt", title: "Backtrack", level: "Practice", prompt: "Triple BT ok.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().ok === true },
    { id: "used", title: "Used 3", level: "Practice", prompt: "greedy used 3.",
      setup: (_c, api) => api.tripleGreedy(), check: (_c, api) => api.getLast().colorsUsed === 3 },
    { id: "meth", title: "Method greedy", level: "Practice", prompt: "method greedy.",
      setup: (_c, api) => api.tripleGreedy(), check: (_c, api) => api.getLast().method === "greedy" },
    { id: "btm", title: "Method BT", level: "Practice", prompt: "BT method.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().method === "backtrack" },
    { id: "sel", title: "Select A", level: "Practice", prompt: "Select A.", check: (_c, api) => { api.setSelected("A"); return api.getSelected()==="A"; } },
    { id: "golden", title: "tpColorsUsed", level: "Challenge", prompt: "tpColorsUsed=3.", check: () => GOLDENS.tpColorsUsed === 3 },""",
    ),
    "quad-color": ch(
        "Quad color",
        "Quad greedy; confirm colors_used=3.",
        """    { id: "run", title: "Quad", level: "Intro", prompt: "Click Quad.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getMode() === "quad" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getLast().ok === true },
    { id: "used", title: "Used 3", level: "Practice", prompt: "colorsUsed 3.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getLast().colorsUsed === GOLDENS.qpColorsUsed },
    { id: "k", title: "k 4", level: "Practice", prompt: "k is 4.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getLast().k === 4 },
    { id: "masks", title: "Masks 4", level: "Practice", prompt: "masks 4.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getLast().masks === 4 },
    { id: "method", title: "Greedy", level: "Practice", prompt: "method greedy.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getLast().method === "greedy" },
    { id: "sel", title: "Select F", level: "Practice", prompt: "Select F.", check: (_c, api) => { api.setSelected("F"); return api.getSelected()==="F"; } },
    { id: "golden", title: "qpColorsUsed", level: "Challenge", prompt: "qpColorsUsed=3.", check: () => GOLDENS.qpColorsUsed === 3 },""",
    ),
    "mp-engine": ch(
        "MP engine",
        "Run engine; confirm best_masks=3.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click MP engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "best", title: "Best 3", level: "Intro", prompt: "bestMasks 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().bestMasks === GOLDENS.engineBestMasks },
    { id: "dp", title: "DP fail", level: "Practice", prompt: "dpOk false.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().dpOk === false },
    { id: "tp", title: "TP ok", level: "Practice", prompt: "tpOk true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().tpOk === true },
    { id: "qp", title: "QP ok", level: "Practice", prompt: "qpOk true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().qpOk === true },
    { id: "tpu", title: "TP used 3", level: "Practice", prompt: "tpColorsUsed 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().tpColorsUsed === 3 },
    { id: "sadp", title: "SADP 3", level: "Practice", prompt: "sadp mandrels 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().sadp.mandrelCount === 3 },
    { id: "golden", title: "engineBestMasks", level: "Challenge", prompt: "engineBestMasks=3.", check: () => GOLDENS.engineBestMasks === 3 },""",
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
    write(WALK / "multi-patterning-algos.js", (Path(__file__).parent / "_mp_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "MULTI_PATTERN_ALGOS" not in text:
        text = text.replace(
            'import { PATTERN_ALGOS } from "./pattern-algos.js";\n'
            'import { drawPatternMatching, STARTER as PATTERN_STARTER, CHIP as PATTERN_CHIP } from "../../assets/pattern-matching-core.js";\n',
            'import { PATTERN_ALGOS } from "./pattern-algos.js";\n'
            'import { drawPatternMatching, STARTER as PATTERN_STARTER, CHIP as PATTERN_CHIP } from "../../assets/pattern-matching-core.js";\n'
            'import { MULTI_PATTERN_ALGOS } from "./multi-patterning-algos.js";\n'
            'import { drawMultiPatterning, STARTER as MP_STARTER, CHIP as MP_CHIP } from "../../assets/multi-patterning-core.js";\n',
        )
        text = text.replace(
            "  ...PATTERN_ALGOS,\n};",
            "  ...PATTERN_ALGOS,\n  ...MULTI_PATTERN_ALGOS,\n};",
        )
        if 'pack.kind === "multipattern"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "pattern") {',
                '''  } else if (pack.kind === "multipattern") {
    drawMultiPatterning(canvas, {
      features: s.features || MP_STARTER,
      chip: s.chip || MP_CHIP,
      selected: s.selected || null,
      highlight: s.highlight || [],
      colors: s.colors || null,
      graph: s.graph || null,
      mandrels: s.mandrels || [],
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "pattern") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"conflict-graph"' not in cap or '"double-lele"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"match-engine": ("match-engine", 5),'
        if needle in cap and '"double-lele"' not in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="multi-patterning"' not in it:
        section = """
    <section class="tool-section" id="multi-patterning">
      <h2>Multi-patterning</h2>
      <ul class="tool-list">
        <li><a href="conflict-graph/">Conflict graph</a></li>
        <li><a href="double-lele/">Double LELE</a></li>
        <li><a href="bipartite-check/">Bipartite check</a></li>
        <li><a href="double-sadp/">Double SADP</a></li>
        <li><a href="stitch-lite/">Stitch lite</a></li>
        <li><a href="triple-color/">Triple color</a></li>
        <li><a href="triple-decomp/">Triple decomp</a></li>
        <li><a href="quad-color/">Quad color</a></li>
        <li><a href="mp-engine/">MP engine</a></li>
      </ul>
    </section>

"""
        it = it.replace(
            '    <section class="tool-section" id="pattern-matching">',
            section + '    <section class="tool-section" id="pattern-matching">',
        )
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools/index.html")
    print("OK")


if __name__ == "__main__":
    main()
