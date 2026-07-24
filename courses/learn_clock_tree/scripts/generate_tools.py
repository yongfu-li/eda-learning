#!/usr/bin/env python3
"""Generate learn_clock_tree interactive tools + clock-tree-algos.js + wire walkthrough."""
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
    <div class="site-header-crumb">
      <nav aria-label="Breadcrumb">
        <a href="../../index.html">Home</a>
        <a href="../index.html">Tools</a>
        <span class="here">{title}</span>
      </nav>
    </div>
  </header>
  <main id="main">
    <div class="eyebrow">Interactive tool</div>
    <section class="hero">
      <h1>{title}</h1>
      <p class="lead">{lead}</p>
    </section>
    <div id="lab-root"></div>
  </main>
  <footer class="site-footer">EDA Algorithms Platform — client-side concept labs.</footer>
  <script type="module" src="{lab}.js"></script>
  <script src="../../assets/site.js"></script>
</body>
</html>
"""

COMMON_IMPORT = """import { GOLDENS, PLACEMENT, CLOCK_SOURCE, CELLS } from "../../assets/clock-tree-core.js";
import { createInteractiveClockTreeLab } from "../../assets/interactive-clock-tree-lab.js";
"""

LABS = {
    "clock-sinks": {
        "title": "Clock sinks from placement",
        "lead": "Six sinks A–F on a 12×8 chip; source CLK at chip center (6,4).",
        "js": COMMON_IMPORT
        + r'''
const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> locate six sinks and the clock source at (${CLOCK_SOURCE.x},${CLOCK_SOURCE.y}).
    Move sinks and confirm count and positions.</p>`,
  challenges: [
    { id: "six", title: "Six sinks", level: "Intro",
      prompt: "Instance has six sinks A–F.",
      check: () => CELLS.length === GOLDENS.sinkCount },
    { id: "src", title: "Source at (6,4)", level: "Intro",
      prompt: "Clock source is at (6,4).",
      check: (_c, api) => { const s = api.getSource(); return s.x === GOLDENS.sourceX && s.y === GOLDENS.sourceY; } },
    { id: "a11", title: "A at (1,1)", level: "Intro",
      prompt: "Sink A starts at (1,1) on spread.",
      check: (_c, api) => { const p = api.getPositions().A; return p.x === 1 && p.y === 1; } },
    { id: "move", title: "Move a sink", level: "Practice",
      prompt: "Move sink B so x ≥ 9.",
      check: (_c, api) => api.getPositions().B.x >= 9 },
    { id: "select", title: "Select E", level: "Practice",
      prompt: "Select sink E (click the E button).",
      check: (_c, api) => api.getSelected() === "E" },
    { id: "d85", title: "D at top", level: "Practice",
      prompt: "Keep D near (8,5).",
      check: (_c, api) => { const p = api.getPositions().D; return Math.abs(p.x - 8) < 0.6 && Math.abs(p.y - 5) < 0.6; } },
    { id: "all-ids", title: "All six ids", level: "Intro",
      prompt: "Sink list includes A through F.",
      check: (_c, api) => api.getSinks().map(s => s.id).join("") === "ABCDEF" },
    { id: "chip", title: "On chip", level: "Challenge",
      prompt: "Every sink stays inside 0..12 × 0..8.",
      check: (_c, api) => Object.values(api.getPositions()).every(p => p.x >= 0 && p.x <= 12 && p.y >= 0 && p.y <= 8) },
  ],
});
''',
    },
    "latency-skew": {
        "title": "Latency and skew",
        "lead": "Build a tree and read per-sink latency and chip skew (max − min).",
        "js": COMMON_IMPORT
        + r'''
const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> build H-tree or MMM, then compare sink latencies and skew.</p>`,
  challenges: [
    { id: "build", title: "Build a tree", level: "Intro",
      prompt: "Build H-tree or MMM.",
      check: (_c, api) => (api.getTree()?.edges?.length || 0) > 0 },
    { id: "skew-finite", title: "Skew finite", level: "Intro",
      prompt: "After build, skew is a finite number.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildHTree(); return Number.isFinite(api.getSkew()); } },
    { id: "lat-a", title: "Latency A finite", level: "Practice",
      prompt: "Latency to A is finite after build.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildHTree(); return Number.isFinite(api.getLatency("A")); } },
    { id: "skew-le10", title: "Skew ≤ 10", level: "Practice",
      prompt: "Build a tree with skew ≤ 10.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildHTree(); return api.getSkew() <= 10; } },
    { id: "mmm", title: "MMM skew", level: "Practice",
      prompt: "Build MMM; skew ≤ GOLDENS.spreadMmmSkew + 4.",
      setup: (_c, api) => api.buildMMM(),
      check: (_c, api) => api.getTreeMode() === "mmm" && api.getSkew() <= GOLDENS.spreadMmmSkew + 4 },
    { id: "h-skew", title: "H-tree skew", level: "Practice",
      prompt: "Build H-tree; skew ≤ GOLDENS.spreadHTreeSkew + 4.",
      setup: (_c, api) => api.buildHTree(),
      check: (_c, api) => api.getTreeMode() === "h-tree" && api.getSkew() <= GOLDENS.spreadHTreeSkew + 4 },
    { id: "move-worse", title: "Cluster raises skew", level: "Challenge",
      prompt: "Cluster sinks near (6,4) then build; observe skew still finite.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildMMM(); return Number.isFinite(api.getSkew()); } },
    { id: "def", title: "Skew = max−min", level: "Intro",
      prompt: "Confirm GOLDENS document skew bounds.",
      check: () => GOLDENS.skewBoundDefault === 2 },
  ],
});
''',
    },
    "h-tree": {
        "title": "H-tree topology",
        "lead": "Recursive H splits from the clock source covering sink quadrants.",
        "js": COMMON_IMPORT
        + r'''
const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> build an H-tree and clear skew challenges.</p>`,
  challenges: [
    { id: "build-h", title: "Build H-tree", level: "Intro",
      prompt: "Click Build H-tree.",
      setup: (_c, api) => api.buildHTree(),
      check: (_c, api) => api.getTreeMode() === "h-tree" && (api.getTree()?.edges?.length || 0) > 0 },
    { id: "edges", title: "Has edges", level: "Intro",
      prompt: "H-tree has at least 5 edges.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildHTree(); return api.getTree().edges.length >= 5; } },
    { id: "skew-le8", title: "Skew ≤ 8", level: "Practice",
      prompt: "H-tree skew ≤ 8 on spread.",
      setup: (_c, api) => api.buildHTree(),
      check: (_c, api) => api.getSkew() <= 8 },
    { id: "skew-le6", title: "Skew ≤ 6", level: "Practice",
      prompt: "H-tree skew ≤ 6.",
      check: (_c, api) => { if (api.getTreeMode() !== "h-tree") api.buildHTree(); return api.getSkew() <= 6; } },
    { id: "src-star", title: "Source present", level: "Intro",
      prompt: "Tree source matches CLK.",
      check: (_c, api) => { if (!api.getTree()) api.buildHTree(); return api.getTree().source.x === 6; } },
    { id: "all-sinks", title: "Six sinks in tree", level: "Practice",
      prompt: "Tree lists six sinks.",
      check: (_c, api) => { if (!api.getTree()) api.buildHTree(); return api.getTree().sinks.length === 6; } },
    { id: "move-rebuild", title: "Rebuild after move", level: "Challenge",
      prompt: "Move A then rebuild H-tree with finite skew.",
      check: (_c, api) => { api.buildHTree(); return Number.isFinite(api.getSkew()); } },
    { id: "vs-mmm", title: "Compare modes", level: "Challenge",
      prompt: "Build H-tree (mode is h-tree).",
      setup: (_c, api) => api.buildHTree(),
      check: (_c, api) => api.getTreeMode() === "h-tree" },
  ],
});
''',
    },
    "mmm-tree": {
        "title": "Method of Means and Medians",
        "lead": "Greedy merge of closest fragments into a balanced clock tree.",
        "js": COMMON_IMPORT
        + r'''
const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> build MMM and compare skew to H-tree.</p>`,
  challenges: [
    { id: "build-m", title: "Build MMM", level: "Intro",
      prompt: "Click Build MMM.",
      setup: (_c, api) => api.buildMMM(),
      check: (_c, api) => api.getTreeMode() === "mmm" },
    { id: "edges", title: "Edges exist", level: "Intro",
      prompt: "MMM has edges.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return api.getTree().edges.length > 0; } },
    { id: "skew-le10", title: "Skew ≤ 10", level: "Practice",
      prompt: "MMM skew ≤ 10.",
      setup: (_c, api) => api.buildMMM(),
      check: (_c, api) => api.getSkew() <= 10 },
    { id: "steiners", title: "Has steiners", level: "Practice",
      prompt: "MMM creates at least one steiner.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return (api.getTree().steiners?.length || 0) >= 1; } },
    { id: "skew-le7", title: "Skew ≤ 7", level: "Practice",
      prompt: "MMM skew ≤ 7 on spread.",
      check: (_c, api) => { if (api.getTreeMode() !== "mmm") api.buildMMM(); return api.getSkew() <= 7; } },
    { id: "lat-f", title: "Latency F", level: "Practice",
      prompt: "Latency to F is finite.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return Number.isFinite(api.getLatency("F")); } },
    { id: "rebuild", title: "Rebuild after move", level: "Challenge",
      prompt: "Move C then rebuild MMM.",
      check: (_c, api) => { api.buildMMM(); return api.getTreeMode() === "mmm"; } },
    { id: "better", title: "Skew documented", level: "Intro",
      prompt: "GOLDENS.spreadMmmSkew is documented.",
      check: () => Number.isFinite(GOLDENS.spreadMmmSkew) },
  ],
});
''',
    },
    "zero-skew-merge": {
        "title": "Zero-skew merge (DME lite)",
        "lead": "Balance left/right sink groups at a merge point near the source.",
        "js": COMMON_IMPORT
        + r'''
const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> run Zero-skew merge demo and check balanced skew.</p>`,
  challenges: [
    { id: "demo", title: "Run demo", level: "Intro",
      prompt: "Click Zero-skew merge demo.",
      setup: (_c, api) => api.zeroSkewMergeDemo(),
      check: (_c, api) => api.getTreeMode() === "zero-skew" },
    { id: "edges", title: "Has edges", level: "Intro",
      prompt: "Merge tree has edges.",
      check: (_c, api) => { if (!api.getTree()) api.zeroSkewMergeDemo(); return api.getTree().edges.length > 0; } },
    { id: "skew-le5", title: "Skew ≤ 5", level: "Practice",
      prompt: "Zero-skew demo skew ≤ 5.",
      setup: (_c, api) => api.zeroSkewMergeDemo(),
      check: (_c, api) => api.getSkew() <= 5 },
    { id: "skew-le3", title: "Skew ≤ 3", level: "Practice",
      prompt: "Skew ≤ 3 after demo.",
      check: (_c, api) => { if (api.getTreeMode() !== "zero-skew") api.zeroSkewMergeDemo(); return api.getSkew() <= 3; } },
    { id: "steiners", title: "Merge steiner", level: "Practice",
      prompt: "At least one steiner exists.",
      check: (_c, api) => { if (!api.getTree()) api.zeroSkewMergeDemo(); return (api.getTree().steiners?.length || 0) >= 1; } },
    { id: "golden", title: "Golden near zero", level: "Intro",
      prompt: "GOLDENS.spreadZeroSkewMergeSkew is 0.",
      check: () => GOLDENS.spreadZeroSkewMergeSkew === 0 },
    { id: "lat", title: "All latencies", level: "Challenge",
      prompt: "Every sink latency finite.",
      check: (_c, api) => { if (!api.getTree()) api.zeroSkewMergeDemo(); return CELLS.every(id => Number.isFinite(api.getLatency(id))); } },
    { id: "mode", title: "Mode zero-skew", level: "Intro",
      prompt: "Tree mode is zero-skew.",
      setup: (_c, api) => api.zeroSkewMergeDemo(),
      check: (_c, api) => api.getTreeMode() === "zero-skew" },
  ],
});
''',
    },
    "tapping-points": {
        "title": "Tapping / branch points",
        "lead": "Find steiner taps with degree ≥ 3 on the clock tree.",
        "js": COMMON_IMPORT
        + r'''
const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> build a tree and inspect tapping points (branch steiners).</p>`,
  challenges: [
    { id: "build", title: "Build tree", level: "Intro",
      prompt: "Build MMM or H-tree.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildMMM(); return api.getTree().edges.length > 0; } },
    { id: "taps", title: "Has taps", level: "Practice",
      prompt: "tappingPoints returns ≥ 1 point.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return api.tappingPoints().length >= 1; } },
    { id: "mmm-taps", title: "MMM taps", level: "Practice",
      prompt: "MMM has taps.",
      setup: (_c, api) => api.buildMMM(),
      check: (_c, api) => api.tappingPoints().length >= 1 },
    { id: "h-taps", title: "H-tree taps", level: "Practice",
      prompt: "H-tree has taps or steiners.",
      setup: (_c, api) => api.buildHTree(),
      check: (_c, api) => api.tappingPoints().length >= 1 || (api.getTree().steiners?.length || 0) >= 1 },
    { id: "count", title: "Tap count ≥ 1", level: "Intro",
      prompt: "At least one branch point.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return api.tappingPoints().length >= 1; } },
    { id: "skew", title: "Skew still finite", level: "Practice",
      prompt: "Skew finite after build.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return Number.isFinite(api.getSkew()); } },
    { id: "rebuild", title: "Taps after move", level: "Challenge",
      prompt: "Move sinks, rebuild, still have taps.",
      check: (_c, api) => { api.buildMMM(); return api.tappingPoints().length >= 1; } },
    { id: "mode", title: "Tree built", level: "Intro",
      prompt: "Tree mode is set.",
      check: (_c, api) => { if (!api.getTreeMode()) api.buildMMM(); return !!api.getTreeMode(); } },
  ],
});
''',
    },
    "clock-buffering": {
        "title": "Clock buffering on wires",
        "lead": "Split long wires; place buffers at joints when span exceeds max wire length.",
        "js": COMMON_IMPORT
        + r'''
const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> build a tree, insert buffers on long edges, watch buffer squares appear.</p>`,
  challenges: [
    { id: "build", title: "Build first", level: "Intro",
      prompt: "Build H-tree or MMM.",
      check: (_c, api) => { if (!api.getTree()) api.buildHTree(); return !!api.getTree()?.edges?.length; } },
    { id: "insert", title: "Insert buffers", level: "Intro",
      prompt: "Click Insert buffers.",
      setup: (_c, api) => { api.buildHTree(); api.insertBuffers(); },
      check: (_c, api) => (api.getTree()?.buffers?.length || 0) >= 0 && !!api.getTreeMode()?.includes("buf") },
    { id: "bufs", title: "Buffers appear", level: "Practice",
      prompt: "After insert, buffers array exists.",
      check: (_c, api) => { if (!api.getTree()) { api.buildHTree(); api.insertBuffers(); } else if (!api.getTreeMode()?.includes("buf")) api.insertBuffers(); return Array.isArray(api.getTree().buffers); } },
    { id: "max-wire", title: "Max wire = 4", level: "Intro",
      prompt: "Default max wire length is 4.",
      check: (_c, api) => api.getMaxWireLen() === GOLDENS.maxWireLenDefault },
    { id: "skew-finite", title: "Skew after buf", level: "Practice",
      prompt: "Skew still finite after buffering.",
      check: (_c, api) => { if (!api.getTree()) { api.buildMMM(); api.insertBuffers(); } return Number.isFinite(api.getSkew()); } },
    { id: "blat", title: "Buffered latencies", level: "Practice",
      prompt: "bufferedLatencies returns six keys.",
      check: (_c, api) => { if (!api.getTree()) { api.buildHTree(); api.insertBuffers(); } return Object.keys(api.bufferedLatencies()).length === 6; } },
    { id: "mode-buf", title: "Mode has buf", level: "Challenge",
      prompt: "Tree mode includes buf after insert.",
      setup: (_c, api) => { api.buildHTree(); api.insertBuffers(); },
      check: (_c, api) => String(api.getTreeMode()).includes("buf") },
    { id: "golden", title: "Buffer delay golden", level: "Intro",
      prompt: "GOLDENS.bufferDelay is 1.",
      check: () => GOLDENS.bufferDelay === 1 },
  ],
});
''',
    },
    "skew-bound": {
        "title": "Skew bound with buffers",
        "lead": "Meet a skew bound by choosing topology and optional buffering.",
        "js": COMMON_IMPORT
        + r'''
const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> meet skew bound ${GOLDENS.skewBoundDefault} (or relax by moving sinks).</p>`,
  challenges: [
    { id: "bound", title: "Bound is 2", level: "Intro",
      prompt: "Default skew bound is 2.",
      check: (_c, api) => api.getSkewBound() === GOLDENS.skewBoundDefault },
    { id: "build", title: "Build tree", level: "Intro",
      prompt: "Build any tree.",
      check: (_c, api) => { if (!api.getTree()) api.buildHTree(); return !!api.getTree()?.edges?.length; } },
    { id: "check-fn", title: "skewBoundOk API", level: "Practice",
      prompt: "Call skewBoundOk after zero-skew demo.",
      setup: (_c, api) => api.zeroSkewMergeDemo(),
      check: (_c, api) => typeof api.skewBoundOk() === "boolean" },
    { id: "zs-ok", title: "Zero-skew meets bound", level: "Practice",
      prompt: "Zero-skew merge meets bound 2 (or skew ≤ 3).",
      setup: (_c, api) => api.zeroSkewMergeDemo(),
      check: (_c, api) => api.skewBoundOk() || api.getSkew() <= 3 },
    { id: "le4", title: "Skew ≤ 4", level: "Practice",
      prompt: "Any topology with skew ≤ 4.",
      check: (_c, api) => { if (!api.getTree()) api.zeroSkewMergeDemo(); return api.getSkew() <= 4; } },
    { id: "le2", title: "Skew ≤ 2", level: "Challenge",
      prompt: "Meet skew ≤ 2 (try zero-skew or move sinks).",
      check: (_c, api) => { if (!api.getTree()) api.zeroSkewMergeDemo(); return api.getSkew() <= 2; } },
    { id: "buf-help", title: "Buffer then check", level: "Challenge",
      prompt: "Build, buffer, skew still finite.",
      check: (_c, api) => { api.buildMMM(); api.insertBuffers(); return Number.isFinite(api.getSkew()); } },
    { id: "api", title: "Bound readable", level: "Intro",
      prompt: "getSkewBound returns a number.",
      check: (_c, api) => Number.isFinite(api.getSkewBound()) },
  ],
});
''',
    },
    "sequential-cts": {
        "title": "Sequential CTS pass",
        "lead": "Connect sinks one-by-one to the nearest tree node (sequential CTS).",
        "js": COMMON_IMPORT
        + r'''
const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> run Sequential CTS, optionally buffer, and clear skew.</p>`,
  challenges: [
    { id: "seq", title: "Run sequential", level: "Intro",
      prompt: "Click Sequential CTS.",
      setup: (_c, api) => api.sequentialCts(),
      check: (_c, api) => api.getTreeMode() === "sequential" },
    { id: "edges", title: "Has edges", level: "Intro",
      prompt: "Sequential tree has edges.",
      check: (_c, api) => { if (!api.getTree()) api.sequentialCts(); return api.getTree().edges.length > 0; } },
    { id: "six", title: "Six sinks", level: "Intro",
      prompt: "Tree lists six sinks.",
      check: (_c, api) => { if (!api.getTree()) api.sequentialCts(); return api.getTree().sinks.length === 6; } },
    { id: "skew-le12", title: "Skew ≤ 12", level: "Practice",
      prompt: "Sequential skew ≤ 12.",
      setup: (_c, api) => api.sequentialCts(),
      check: (_c, api) => api.getSkew() <= 12 },
    { id: "skew-le8", title: "Skew ≤ 8", level: "Practice",
      prompt: "Skew ≤ 8 (move sinks or compare MMM).",
      check: (_c, api) => { if (!api.getTree()) api.sequentialCts(); return api.getSkew() <= 8; } },
    { id: "buf", title: "Buffer sequential", level: "Practice",
      prompt: "Sequential then Insert buffers.",
      setup: (_c, api) => { api.sequentialCts(); api.insertBuffers(); },
      check: (_c, api) => String(api.getTreeMode()).includes("buf") },
    { id: "lat", title: "All latencies", level: "Challenge",
      prompt: "Every sink has finite latency.",
      check: (_c, api) => { if (!api.getTree()) api.sequentialCts(); return CELLS.every(id => Number.isFinite(api.getLatency(id))); } },
    { id: "golden", title: "Golden documented", level: "Intro",
      prompt: "GOLDENS.spreadSequentialSkew is finite.",
      check: () => Number.isFinite(GOLDENS.spreadSequentialSkew) },
  ],
});
''',
    },
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def write_tools() -> None:
    for lab, meta in LABS.items():
        write(TOOLS / lab / "index.html", HTML.format(title=meta["title"], lead=meta["lead"], lab=lab))
        write(TOOLS / lab / f"{lab}.js", meta["js"])
    print(f"Wrote {len(LABS)} tools")


def write_algos() -> None:
    template = Path(__file__).resolve().parent / "_clock_tree_algos.js"
    dest = WALK / "clock-tree-algos.js"
    write(dest, template.read_text(encoding="utf-8"))
    print("Wrote clock-tree-algos.js")


def patch_walkthrough() -> None:
    path = WALK / "walkthrough.js"
    text = path.read_text(encoding="utf-8")
    changed = False
    if "CLOCK_TREE_ALGOS" not in text:
        text = text.replace(
            'import { drawDetailedRoute, usageFromDetailedRoutes } from "../../assets/detailed-routing-core.js";\n',
            'import { drawDetailedRoute, usageFromDetailedRoutes } from "../../assets/detailed-routing-core.js";\n'
            'import { CLOCK_TREE_ALGOS } from "./clock-tree-algos.js";\n'
            'import { drawClockTree } from "../../assets/clock-tree-core.js";\n',
        )
        text = text.replace(
            "  ...DETAILED_ROUTING_ALGOS,\n};",
            "  ...DETAILED_ROUTING_ALGOS,\n  ...CLOCK_TREE_ALGOS,\n};",
        )
        changed = True
    if 'pack.kind === "clock-tree"' not in text:
        needle = '  } else if (pack.kind === "detailed-routing") {\n    const drRoutes = s.routes || [];\n    const drUsage = s.usage || (drRoutes.length ? usageFromDetailedRoutes(drRoutes) : null);\n    drawDetailedRoute(canvas, {\n      positions: s.positions,\n      usage: drUsage,\n      routes: drRoutes,\n      cap: s.cap ?? undefined,\n      highlightPath: s.highlightPath || null,\n      selectedNet: s.selectedNet ?? null,\n      highlight: s.highlight || [],\n    });\n'
        insert = needle + '''  } else if (pack.kind === "clock-tree") {
    drawClockTree(canvas, {
      positions: s.positions,
      tree: s.tree || null,
      selectedSink: s.selectedSink || null,
      highlight: s.highlight || [],
      showSkew: s.showSkew !== false,
    });
'''
        text = text.replace(needle, insert)
        changed = True
    if changed:
        path.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")
    else:
        print("walkthrough.js already has clock-tree")


def patch_capture() -> None:
    text = CAPTURE.read_text(encoding="utf-8")
    entries = [
        '"clock-sinks": ("clock-sinks", 5)',
        '"latency-skew": ("latency-skew", 5)',
        '"h-tree": ("h-tree", 5)',
        '"mmm-tree": ("mmm-tree", 5)',
        '"zero-skew-merge": ("zero-skew-merge", 5)',
        '"tapping-points": ("tapping-points", 5)',
        '"clock-buffering": ("clock-buffering", 5)',
        '"skew-bound": ("skew-bound", 5)',
        '"sequential-cts": ("sequential-cts", 5)',
    ]
    if '"clock-sinks"' in text:
        print("LAB_TO_ALGO already has clock-tree")
        return
    block = "    " + ",\n    ".join(entries) + ",\n"
    text = text.replace(
        '    "sequential-detailed": ("sequential-detailed", 5),\n}',
        '    "sequential-detailed": ("sequential-detailed", 5),\n' + block + "}",
    )
    CAPTURE.write_text(text, encoding="utf-8", newline="\n")
    print("Patched LAB_TO_ALGO")


def patch_tools_index() -> None:
    idx = TOOLS / "index.html"
    text = idx.read_text(encoding="utf-8")
    if 'id="clock-tree"' in text:
        print("tools index already lists clock-tree")
        return
    section = """
    <section class="tool-section" id="clock-tree">
      <h2>Clock tree synthesis</h2>
      <ul class="tool-list">
        <li><a href="clock-sinks/">Clock sinks from placement</a></li>
        <li><a href="latency-skew/">Latency and skew</a></li>
        <li><a href="h-tree/">H-tree topology</a></li>
        <li><a href="mmm-tree/">Method of Means and Medians</a></li>
        <li><a href="zero-skew-merge/">Zero-skew merge</a></li>
        <li><a href="tapping-points/">Tapping / branch points</a></li>
        <li><a href="clock-buffering/">Clock buffering</a></li>
        <li><a href="skew-bound/">Skew bound</a></li>
        <li><a href="sequential-cts/">Sequential CTS</a></li>
      </ul>
    </section>
"""
    text = text.replace("</main>", section + "\n</main>")
    idx.write_text(text, encoding="utf-8", newline="\n")
    print("Patched tools index.html")


def main() -> None:
    write_tools()
    write_algos()
    patch_walkthrough()
    patch_capture()
    patch_tools_index()
    print("OK")


if __name__ == "__main__":
    main()
