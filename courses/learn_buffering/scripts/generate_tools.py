#!/usr/bin/env python3
"""Generate learn_buffering tools + buffering-algos.js + wire walkthrough."""
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
  <header class="site-header">
    <div class="site-header-inner">
      <p class="brand"><a href="../../index.html">EDA Algorithms Platform</a></p>
      <nav class="site-nav" aria-label="Site">
        <a href="../../index.html">Home</a>
        <a href="../index.html" class="is-active" aria-current="page">Tools</a>
      </nav>
    </div>
  </header>
  <main id="main">
    <div class="eyebrow">Interactive tool</div>
    <section class="hero"><h1>{title}</h1><p class="lead">{lead}</p></section>
    <div id="lab-root"></div>
  </main>
  <footer class="site-footer">EDA Algorithms Platform</footer>
  <script type="module" src="{lab}.js"></script>
  <script src="../../assets/site.js"></script>
</body>
</html>
"""

IMP = """import { GOLDENS, EDGES, BUFFER_LIBRARY, SINKS } from "../../assets/buffering-core.js";
import { createInteractiveBufferingLab } from "../../assets/interactive-buffering-lab.js";
"""

LABS = {
    "wire-rc": {
        "title": "Wire R/C model",
        "lead": "Lumped R and C from Manhattan length on D→S0→{S1,S2}.",
        "js": IMP
        + r'''
createInteractiveBufferingLab(document.getElementById("lab-root"), {
  starterHtml: `<p><strong>Your job:</strong> confirm edge lengths and R/C with unit parasitics.</p>`,
  challenges: [
    { id: "edges", title: "Three edges", level: "Intro", prompt: "Net has three edges.", check: () => EDGES.length === GOLDENS.edgeCount },
    { id: "sinks", title: "Three sinks", level: "Intro", prompt: "Three sinks.", check: () => SINKS.length === GOLDENS.sinkCount },
    { id: "e0-rc", title: "e0 R=4", level: "Practice", prompt: "e0 length maps to R≈4.",
      check: (_c, api) => Math.abs(api.wireRcForEdge("e0").R - GOLDENS.wireRcLen4R) < 0.2 },
    { id: "e0-c", title: "e0 C=4", level: "Practice", prompt: "e0 C≈4.",
      check: (_c, api) => Math.abs(api.wireRcForEdge("e0").C - 4) < 0.2 },
    { id: "finite", title: "All RC finite", level: "Practice",
      prompt: "Every edge has finite R.",
      check: (_c, api) => EDGES.every(e => Number.isFinite(api.wireRcForEdge(e.id).R)) },
    { id: "driver", title: "Driver D", level: "Intro", prompt: "Driver id is D.",
      check: (_c, api) => api.getDriver().id === "D" },
    { id: "move", title: "Move S1", level: "Challenge", prompt: "Move S1 so x≥10.",
      check: (_c, api) => api.getSinks().find(s => s.id === "S1").x >= 10 },
    { id: "golden", title: "Golden R", level: "Intro", prompt: "GOLDENS.wireRcLen4R is 4.",
      check: () => GOLDENS.wireRcLen4R === 4 },
  ],
});
''',
    },
    "slew-budget": {
        "title": "Slew / transition budget",
        "lead": "Estimate slew vs limit eight on each edge.",
        "js": IMP
        + r'''
createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "limit", title: "Limit 8", level: "Intro", prompt: "Slew limit is 8.",
      check: (_c, api) => api.getSlewLimit() === GOLDENS.slewLimit },
    { id: "e0-slew", title: "e0 slew finite", level: "Intro", prompt: "e0 slew is finite.",
      check: (_c, api) => Number.isFinite(api.edgeSlew("e0")) },
    { id: "ok-api", title: "slewOk API", level: "Practice", prompt: "slewOk(5) is true at limit 8.",
      check: (_c, api) => api.slewOk(5) === true },
    { id: "fail", title: "slewOk(20) false", level: "Practice", prompt: "slewOk(20) is false.",
      check: (_c, api) => api.slewOk(20) === false },
    { id: "all", title: "All edges slew", level: "Practice",
      prompt: "Every edge slew finite.",
      check: (_c, api) => EDGES.every(e => Number.isFinite(api.edgeSlew(e.id))) },
    { id: "select", title: "Select S2", level: "Practice", prompt: "Select sink S2.",
      check: (_c, api) => api.getSelected() === "S2" },
    { id: "stretch", title: "Stretch S1", level: "Challenge", prompt: "Move S1 to x≥10.",
      check: (_c, api) => api.getSinks().find(s => s.id === "S1").x >= 10 },
    { id: "golden", title: "Golden limit", level: "Intro", prompt: "GOLDENS.slewLimit is 8.",
      check: () => GOLDENS.slewLimit === 8 },
  ],
});
''',
    },
    "candidate-sites": {
        "title": "Buffer candidate sites",
        "lead": "Place gray candidate dots every two units along edges.",
        "js": IMP
        + r'''
createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "show", title: "Show candidates", level: "Intro", prompt: "Click Show candidates.",
      setup: (_c, api) => api.showCandidates(),
      check: (_c, api) => api.getMode() === "candidates" && api.getSites().length > 0 },
    { id: "count", title: "Sites ≥ 1", level: "Intro", prompt: "At least one site.",
      check: (_c, api) => { if (!api.getSites().length) api.showCandidates(); return api.getSites().length >= 1; } },
    { id: "ge3", title: "Sites ≥ 3", level: "Practice", prompt: "At least three sites on the toy.",
      check: (_c, api) => { if (!api.getSites().length) api.showCandidates(); return api.getSites().length >= 3; } },
    { id: "mode", title: "Mode candidates", level: "Practice", prompt: "Mode is candidates.",
      setup: (_c, api) => api.showCandidates(),
      check: (_c, api) => api.getMode() === "candidates" },
    { id: "edge-field", title: "Sites have edge", level: "Practice",
      prompt: "Each site references an edge id.",
      check: (_c, api) => { if (!api.getSites().length) api.showCandidates(); return api.getSites().every(s => s.edge); } },
    { id: "step", title: "Step golden", level: "Intro", prompt: "candidateStep golden is 2.",
      check: () => GOLDENS.candidateStep === 2 },
    { id: "clear", title: "Can clear", level: "Practice", prompt: "Clear then show again.",
      check: (_c, api) => { api.clearBuffers(); api.showCandidates(); return api.getSites().length > 0; } },
    { id: "coords", title: "On chip", level: "Challenge",
      prompt: "All sites inside chip bounds.",
      check: (_c, api) => { if (!api.getSites().length) api.showCandidates(); return api.getSites().every(s => s.x >= 0 && s.x <= 12 && s.y >= 0 && s.y <= 8); } },
  ],
});
''',
    },
    "buffer-library": {
        "title": "Buffer library options",
        "lead": "BUF_X1, BUF_X2, INV_X1 with cin/rout/delay/invert.",
        "js": IMP
        + r'''
createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "three", title: "Three cells", level: "Intro", prompt: "Library has three cells.",
      check: () => BUFFER_LIBRARY.length === GOLDENS.libCount },
    { id: "x1", title: "Has BUF_X1", level: "Intro", prompt: "BUF_X1 exists.",
      check: () => BUFFER_LIBRARY.some(b => b.id === "BUF_X1") },
    { id: "inv", title: "Has INV", level: "Intro", prompt: "INV_X1 inverts.",
      check: () => BUFFER_LIBRARY.find(b => b.id === "INV_X1")?.invert === true },
    { id: "x2", title: "X2 stronger rout", level: "Practice", prompt: "BUF_X2 rout < BUF_X1 rout.",
      check: () => BUFFER_LIBRARY.find(b => b.id === "BUF_X2").rout < BUFFER_LIBRARY.find(b => b.id === "BUF_X1").rout },
    { id: "vg", title: "VG uses library", level: "Practice", prompt: "Run Van Ginneken.",
      setup: (_c, api) => api.runVanGinneken(),
      check: (_c, api) => api.getMode() === "van-ginneken" },
    { id: "api", title: "getLibrary", level: "Practice", prompt: "API returns three cells.",
      check: (_c, api) => api.getLibrary().length === 3 },
    { id: "cin", title: "All have cin", level: "Practice", prompt: "Every cell has cin > 0.",
      check: () => BUFFER_LIBRARY.every(b => b.cin > 0) },
    { id: "golden", title: "libCount", level: "Intro", prompt: "GOLDENS.libCount is 3.",
      check: () => GOLDENS.libCount === 3 },
  ],
});
''',
    },
    "van-ginneken": {
        "title": "Van Ginneken DP lite",
        "lead": "Generate options, prune, pick best delay vs wire-only.",
        "js": IMP
        + r'''
createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "run", title: "Run VG", level: "Intro", prompt: "Click Van Ginneken.",
      setup: (_c, api) => api.runVanGinneken(),
      check: (_c, api) => api.getMode() === "van-ginneken" },
    { id: "result", title: "Has result", level: "Intro", prompt: "VG result exists.",
      check: (_c, api) => { if (!api.getVg()) api.runVanGinneken(); return !!api.getVg(); } },
    { id: "improved", title: "Improved or equal", level: "Practice",
      prompt: "bestDelay ≤ wireDelay.",
      check: (_c, api) => { if (!api.getVg()) api.runVanGinneken(); const v = api.getVg(); return v.bestDelay <= v.wireDelay + 1e-6; } },
    { id: "finite", title: "Finite delay", level: "Practice",
      prompt: "bestDelay is finite.",
      check: (_c, api) => { if (!api.getVg()) api.runVanGinneken(); return Number.isFinite(api.getVg().bestDelay); } },
    { id: "sites", title: "Sites shown", level: "Practice",
      prompt: "Sites populated after VG.",
      check: (_c, api) => { if (!api.getVg()) api.runVanGinneken(); return api.getSites().length > 0; } },
    { id: "per-edge", title: "Three edge results", level: "Practice",
      prompt: "perEdge has e0,e1,e2.",
      check: (_c, api) => { if (!api.getVg()) api.runVanGinneken(); const p = api.getVg().perEdge; return p.e0 && p.e1 && p.e2; } },
    { id: "golden", title: "vgImproves golden", level: "Intro", prompt: "GOLDENS.vgImproves is true.",
      check: () => GOLDENS.vgImproves === true },
    { id: "rebuild", title: "Rebuild after move", level: "Challenge",
      prompt: "Move S2 then rerun VG with finite delay.",
      check: (_c, api) => { api.runVanGinneken(); return Number.isFinite(api.getVg().bestDelay); } },
  ],
});
''',
    },
    "slew-driven": {
        "title": "Slew-driven insertion",
        "lead": "Greedy mid-edge buffers when slew exceeds the limit.",
        "js": IMP
        + r'''
createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "run", title: "Run slew-driven", level: "Intro", prompt: "Click Slew-driven.",
      setup: (_c, api) => api.runSlewDriven(),
      check: (_c, api) => api.getMode() === "slew-driven" },
    { id: "result", title: "Has result", level: "Intro",
      prompt: "Slew result object exists.",
      check: (_c, api) => { if (!api.getSlewResult()) api.runSlewDriven(); return !!api.getSlewResult(); } },
    { id: "count", title: "Count ≥ 0", level: "Practice",
      prompt: "Insertion count is a number ≥ 0.",
      check: (_c, api) => { if (!api.getSlewResult()) api.runSlewDriven(); return api.getSlewResult().count >= 0; } },
    { id: "bufs", title: "Buffers array", level: "Practice",
      prompt: "Buffers array matches insertions.",
      check: (_c, api) => { if (!api.getSlewResult()) api.runSlewDriven(); return api.getBuffers().length === api.getSlewResult().count; } },
    { id: "limit", title: "Limit readable", level: "Intro", prompt: "Slew limit readable.",
      check: (_c, api) => api.getSlewLimit() === GOLDENS.slewLimit },
    { id: "mode", title: "Mode set", level: "Practice",
      prompt: "Mode is slew-driven.",
      setup: (_c, api) => api.runSlewDriven(),
      check: (_c, api) => api.getMode() === "slew-driven" },
    { id: "clear", title: "Clear works", level: "Practice",
      prompt: "Clear empties buffers.",
      check: (_c, api) => { api.runSlewDriven(); api.clearBuffers(); return api.getBuffers().length === 0; } },
    { id: "rerun", title: "Rerun", level: "Challenge",
      prompt: "Rerun after clear.",
      check: (_c, api) => { api.clearBuffers(); api.runSlewDriven(); return api.getMode() === "slew-driven"; } },
  ],
});
''',
    },
    "polarity-invert": {
        "title": "Polarity / inverter pairs",
        "lead": "Track invert parity along a buffered path.",
        "js": IMP
        + r'''
createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "inv", title: "INV exists", level: "Intro", prompt: "Library has INV_X1.",
      check: () => BUFFER_LIBRARY.some(b => b.id === "INV_X1" && b.invert) },
    { id: "one", title: "One flip", level: "Practice", prompt: "One INV → flips=1.",
      check: (_c, api) => api.polarityFix([{ buf: "INV_X1" }]).flips === 1 },
    { id: "neg", title: "Negative", level: "Practice", prompt: "One INV → not positive.",
      check: (_c, api) => api.polarityFix([{ buf: "INV_X1" }]).positive === false },
    { id: "two", title: "Two flips", level: "Practice", prompt: "Two INV → positive.",
      check: (_c, api) => api.polarityFix([{ buf: "INV_X1" }, { buf: "INV_X1" }]).positive === true },
    { id: "buf", title: "BUF no flip", level: "Practice", prompt: "BUF_X1 alone stays positive.",
      check: (_c, api) => api.polarityFix([{ buf: "BUF_X1" }]).positive === true },
    { id: "mix", title: "Mix", level: "Practice",
      prompt: "INV+BUF → flips=1.",
      check: (_c, api) => api.polarityFix([{ buf: "INV_X1" }, { buf: "BUF_X1" }]).flips === 1 },
    { id: "lib", title: "Three cells", level: "Intro", prompt: "Three library cells.",
      check: (_c, api) => api.getLibrary().length === 3 },
    { id: "zero", title: "Empty path", level: "Challenge", prompt: "Empty path positive.",
      check: (_c, api) => api.polarityFix([]).positive === true },
  ],
});
''',
    },
    "fanout-tree": {
        "title": "Fanout buffer tree",
        "lead": "Insert BUF_X2 at S0 when fanout exceeds two.",
        "js": IMP
        + r'''
createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "run", title: "Run fanout", level: "Intro", prompt: "Click Fanout buffer.",
      setup: (_c, api) => api.runFanout(),
      check: (_c, api) => api.getMode() === "fanout" },
    { id: "inserted", title: "Inserted", level: "Practice", prompt: "Buffer appears (3>2).",
      setup: (_c, api) => api.runFanout(),
      check: (_c, api) => api.getBuffers().length >= 1 },
    { id: "at-s0", title: "Near S0", level: "Practice",
      prompt: "Buffer near S0 coordinates.",
      check: (_c, api) => { api.runFanout(); const b = api.getBuffers()[0]; const s0 = api.getSinks().find(s => s.id === "S0"); return Math.abs(b.x - s0.x) < 0.1 && Math.abs(b.y - s0.y) < 0.1; } },
    { id: "x2", title: "BUF_X2", level: "Practice", prompt: "Uses BUF_X2.",
      check: (_c, api) => { api.runFanout(); return api.getBuffers()[0].buf === "BUF_X2"; } },
    { id: "sinks3", title: "Three sinks", level: "Intro", prompt: "Fanout three.",
      check: (_c, api) => api.getSinks().length === 3 },
    { id: "golden", title: "Golden inserted", level: "Intro", prompt: "GOLDENS.fanoutInserted.",
      check: () => GOLDENS.fanoutInserted === true },
    { id: "mode", title: "Mode fanout", level: "Practice",
      prompt: "Mode is fanout.",
      setup: (_c, api) => api.runFanout(),
      check: (_c, api) => api.getMode() === "fanout" },
    { id: "clear", title: "Clear", level: "Challenge",
      prompt: "Clear removes fanout buffer.",
      check: (_c, api) => { api.runFanout(); api.clearBuffers(); return api.getBuffers().length === 0; } },
  ],
});
''',
    },
    "sequential-buffer": {
        "title": "Sequential buffering pass",
        "lead": "Full pipeline: candidates + Van Ginneken + fanout.",
        "js": IMP
        + r'''
createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "run", title: "Sequential pass", level: "Intro", prompt: "Click Sequential pass.",
      setup: (_c, api) => api.runSequential(),
      check: (_c, api) => api.getMode() === "sequential" },
    { id: "vg", title: "VG computed", level: "Intro",
      prompt: "VG result present.",
      check: (_c, api) => { if (!api.getVg()) api.runSequential(); return !!api.getVg(); } },
    { id: "sites", title: "Sites", level: "Practice",
      prompt: "Sites after pass.",
      check: (_c, api) => { if (!api.getSites().length) api.runSequential(); return api.getSites().length > 0; } },
    { id: "improved", title: "Delay OK", level: "Practice",
      prompt: "bestDelay ≤ wireDelay.",
      check: (_c, api) => { if (!api.getVg()) api.runSequential(); const v = api.getVg(); return v.bestDelay <= v.wireDelay + 1e-6; } },
    { id: "bufs", title: "Some buffers", level: "Practice",
      prompt: "At least one buffer after pass (VG or fanout).",
      check: (_c, api) => { api.runSequential(); return api.getBuffers().length >= 1; } },
    { id: "mode", title: "Mode sequential", level: "Practice",
      prompt: "Mode is sequential.",
      setup: (_c, api) => api.runSequential(),
      check: (_c, api) => api.getMode() === "sequential" },
    { id: "sinks", title: "Three sinks", level: "Intro", prompt: "Still three sinks.",
      check: (_c, api) => api.getSinks().length === 3 },
    { id: "rerun", title: "Idempotent mode", level: "Challenge",
      prompt: "Rerun keeps sequential mode.",
      check: (_c, api) => { api.runSequential(); api.runSequential(); return api.getMode() === "sequential"; } },
  ],
});
''',
    },
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def main() -> None:
    for lab, meta in LABS.items():
        write(TOOLS / lab / "index.html", HTML.format(title=meta["title"], lead=meta["lead"], lab=lab))
        write(TOOLS / lab / f"{lab}.js", meta["js"])
    print(f"Wrote {len(LABS)} tools")

    write(WALK / "buffering-algos.js", (Path(__file__).parent / "_buffering_algos.js").read_text(encoding="utf-8"))
    print("Wrote buffering-algos.js")

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "BUFFERING_ALGOS" not in text:
        text = text.replace(
            'import { drawClockTree } from "../../assets/clock-tree-core.js";\n',
            'import { drawClockTree } from "../../assets/clock-tree-core.js";\n'
            'import { BUFFERING_ALGOS } from "./buffering-algos.js";\n'
            'import { drawBuffering } from "../../assets/buffering-core.js";\n',
        )
        if "BUFFERING_ALGOS" not in text:
            # clock-tree import may use different formatting
            text = text.replace(
                'import { CLOCK_TREE_ALGOS } from "./clock-tree-algos.js";\n',
                'import { CLOCK_TREE_ALGOS } from "./clock-tree-algos.js";\n'
                'import { BUFFERING_ALGOS } from "./buffering-algos.js";\n'
                'import { drawBuffering } from "../../assets/buffering-core.js";\n',
            )
        text = text.replace(
            "  ...CLOCK_TREE_ALGOS,\n};",
            "  ...CLOCK_TREE_ALGOS,\n  ...BUFFERING_ALGOS,\n};",
        )
        if 'pack.kind === "buffering"' not in text:
            needle = '  } else if (pack.kind === "clock-tree") {\n    drawClockTree(canvas, {\n      positions: s.positions,\n      tree: s.tree || undefined,\n      selectedSink: s.selectedSink || null,\n      highlight: s.highlight || [],\n      showSkew: s.showSkew !== false,\n    });\n'
            insert = needle + '''  } else if (pack.kind === "buffering") {
    drawBuffering(canvas, {
      sinks: s.sinks,
      sites: s.sites || [],
      buffers: s.buffers || [],
      selectedEdge: s.selectedEdge || null,
      highlight: s.highlight || [],
      metricText: s.metricText || null,
    });
'''
            if needle in text:
                text = text.replace(needle, insert)
            else:
                # fallback: insert before placement branch
                text = text.replace(
                    '  } else if (\n    pack.kind === "placement"',
                    '''  } else if (pack.kind === "buffering") {
    drawBuffering(canvas, {
      sinks: s.sinks,
      sites: s.sites || [],
      buffers: s.buffers || [],
      selectedEdge: s.selectedEdge || null,
      highlight: s.highlight || [],
      metricText: s.metricText || null,
    });
  } else if (
    pack.kind === "placement"''',
                )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")
    else:
        print("walkthrough.js already has buffering")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"wire-rc"' not in cap:
        entries = ",\n    ".join(
            f'"{lab}": ("{lab}", 5)' for lab in LABS
        )
        cap = cap.replace(
            '    "sequential-cts": ("sequential-cts", 5),\n}',
            '    "sequential-cts": ("sequential-cts", 5),\n    ' + entries + ",\n}",
        )
        CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
        print("Patched LAB_TO_ALGO")
    else:
        print("LAB_TO_ALGO already has buffering")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="buffering"' not in it:
        section = """
    <section class="tool-section" id="buffering">
      <h2>Buffering</h2>
      <ul class="tool-list">
        <li><a href="wire-rc/">Wire R/C model</a></li>
        <li><a href="slew-budget/">Slew / transition budget</a></li>
        <li><a href="candidate-sites/">Buffer candidate sites</a></li>
        <li><a href="buffer-library/">Buffer library options</a></li>
        <li><a href="van-ginneken/">Van Ginneken DP lite</a></li>
        <li><a href="slew-driven/">Slew-driven insertion</a></li>
        <li><a href="polarity-invert/">Polarity / inverters</a></li>
        <li><a href="fanout-tree/">Fanout buffer tree</a></li>
        <li><a href="sequential-buffer/">Sequential buffering pass</a></li>
      </ul>
    </section>
"""
        it = it.replace("</main>", section + "\n</main>")
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools index.html")
    print("OK")


if __name__ == "__main__":
    main()
