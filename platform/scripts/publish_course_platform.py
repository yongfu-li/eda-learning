#!/usr/bin/env python3
"""Publish a course into platform/ at digital_learning quality (catalog + shells + media link).

Uses the same page shells as digital_learning: data-render + site-config + pages.js + quiz.js.

  python3 platform/scripts/publish_course_platform.py learn_clustering
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PLATFORM = ROOT / "platform"
CATALOG = PLATFORM / "assets" / "catalog.json"
# Bump when site-config.js / pages.js media URL logic changes (bust browser cache on Pages).
ASSET_V = "20260723b"

ROW = re.compile(
    r"^\|\s*`?(module\d{2}-\d{2}-[a-z0-9-]+)`?\s*\|\s*`([^`]+)`\s*\|\s*\[([^\]]+)\]"
    r"\([^)]+\)\s*\|\s*(?:`([a-z0-9-]+)`|—|offline[^|]*)\s*\|\s*([^|]*?)\s*\|",
    re.MULTILINE | re.IGNORECASE,
)

COURSE_META = {
    "learn_clustering": {
        "title": "Clustering for EDA",
        "focus": "Affinity → merge → LP/spectral → KL/FM → multilevel → EDA objectives",
        "prereq": None,
        "status": "ready",
        "repo": "learn_clustering",
        "modules_md": ROOT / "courses" / "learn_clustering" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_clustering",
        "lead": (
            "Clustering and refinement for physical design — tiny graphs, full algorithms, "
            "metrics you can trust. Clips and decks load from "
            "<code>courses/learn_clustering</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#clustering",
        "tools_label": "Clustering tools",
        "first_lab": "affinity-metrics",
        "first_n": "02",
    },
    "learn_partitioning": {
        "title": "Partitioning for EDA",
        "focus": "Cutsize/balance → initial cut → KL/FM/spectral → multiway → terminals → multilevel",
        "prereq": None,
        "status": "ready",
        "repo": "learn_partitioning",
        "modules_md": ROOT / "courses" / "learn_partitioning" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_partitioning",
        "lead": (
            "Bipartition and multiway partitioning for physical design — tiny graphs, full algorithms, "
            "cut and balance you can trust. Clips and decks load from "
            "<code>courses/learn_partitioning</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#partitioning",
        "tools_label": "Partitioning tools",
        "first_lab": "cutsize-balance",
        "first_n": "02",
    },
    "learn_placement": {
        "title": "Placement for EDA",
        "focus": "HPWL/net models → force/quadratic/analytical/SA → density → timing-driven",
        "prereq": None,
        "status": "ready",
        "repo": "learn_placement",
        "modules_md": ROOT / "courses" / "learn_placement" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_placement",
        "lead": (
            "Global placement for physical design — tiny instances, full algorithms, "
            "HPWL and density you can trust. Clips and decks load from "
            "<code>courses/learn_placement</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#placement",
        "tools_label": "Placement tools",
        "first_lab": "hpwl-metrics",
        "first_n": "02",
    },
    "learn_floorplanning": {
        "title": "Floorplanning",
        "focus": "Fixed-outline → slicing/B*/SP → SA → soft modules → macros → hierarchy → pins",
        "prereq": None,
        "status": "ready",
        "repo": "learn_floorplanning",
        "modules_md": ROOT / "courses" / "learn_floorplanning" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_floorplanning",
        "lead": (
            "Fixed-outline floorplanning for physical design — tiny modules, full representations, "
            "legality and deadspace you can trust. Clips and decks load from "
            "<code>courses/learn_floorplanning</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#floorplanning",
        "tools_label": "Floorplanning tools",
        "first_lab": "fixed-outline",
        "first_n": "02",
    },
    "learn_sta": {
        "title": "Static timing analysis",
        "focus": "Timing graph → arrival/required → slack → critical path → incremental update",
        "prereq": None,
        "status": "ready",
        "repo": "learn_sta",
        "modules_md": ROOT / "courses" / "learn_sta" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_sta",
        "lead": (
            "Static timing analysis for digital design — tiny timing graphs, full algorithms, "
            "arrivals and slack you can trust. Clips and decks load from "
            "<code>courses/learn_sta</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#sta",
        "tools_label": "STA tools",
        "first_lab": "timing-graph",
        "first_n": "02",
    },
    "learn_legalization": {
        "title": "Legalization for EDA",
        "focus": "Site/row model → legality → snap → overlap/Abacus/Tetris → macros → cost → global vs detailed",
        "prereq": None,
        "status": "ready",
        "repo": "learn_legalization",
        "modules_md": ROOT / "courses" / "learn_legalization" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_legalization",
        "lead": (
            "Legalization for physical design — tiny site/row grids, full algorithms, "
            "legality and displacement you can trust. Clips and decks load from "
            "<code>courses/learn_legalization</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#legalization",
        "tools_label": "Legalization tools",
        "first_lab": "site-row-model",
        "first_n": "02",
    },
    "learn_congestion": {
        "title": "Congestion for EDA",
        "focus": "GCell grid → capacity/demand → RUDY/probabilistic → heat map → overflow → inflators → place feedback",
        "prereq": None,
        "status": "ready",
        "repo": "learn_congestion",
        "modules_md": ROOT / "courses" / "learn_congestion" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_congestion",
        "lead": (
            "Routing congestion estimation and placement feedback — tiny GCell grids, full algorithms, "
            "overflow metrics you can trust. Clips and decks load from "
            "<code>courses/learn_congestion</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#congestion",
        "tools_label": "Congestion tools",
        "first_lab": "gcell-grid",
        "first_n": "02",
    },
    "learn_global_routing": {
        "title": "Global routing for EDA",
        "focus": "GCell graph → terminal mapping → L/Z patterns → maze → multi-pin tree → edge overflow → rip-up → sequential global",
        "prereq": None,
        "status": "ready",
        "repo": "learn_global_routing",
        "modules_md": ROOT / "courses" / "learn_global_routing" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_global_routing",
        "lead": (
            "Global routing on a tiny GCell graph — pattern routes, maze detours, edge overflow you can trust. "
            "Clips and decks load from "
            "<code>courses/learn_global_routing</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#global-routing",
        "tools_label": "Global routing tools",
        "first_lab": "routing-graph",
        "first_n": "02",
    },
    "learn_routing": {
        "title": "Detailed routing for EDA",
        "focus": "Grid graph → pin access → Lee maze → A* → track usage → vias → DRC lite → rip-up → sequential detailed",
        "prereq": None,
        "status": "ready",
        "repo": "learn_routing",
        "modules_md": ROOT / "courses" / "learn_routing" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_routing",
        "lead": (
            "Detailed routing on a tiny 12×8 grid — layered M1/M2 tracks, maze/A* detours, overflow you can trust. "
            "Clips and decks load from "
            "<code>courses/learn_routing</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#detailed-routing",
        "tools_label": "Detailed routing tools",
        "first_lab": "routing-grid",
        "first_n": "02",
    },
    "learn_clock_tree": {
        "title": "Clock tree synthesis for EDA",
        "focus": "Sinks → latency/skew → H-tree → MMM → zero-skew merge → taps → buffering → skew bound → sequential CTS",
        "prereq": None,
        "status": "ready",
        "repo": "learn_clock_tree",
        "modules_md": ROOT / "courses" / "learn_clock_tree" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_clock_tree",
        "lead": (
            "Clock tree synthesis on a tiny 12×8 chip — H-tree / MMM, skew you can trust, buffers on long wires. "
            "Clips and decks load from "
            "<code>courses/learn_clock_tree</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#clock-tree",
        "tools_label": "Clock tree tools",
        "first_lab": "clock-sinks",
        "first_n": "02",
    },
    "learn_buffering": {
        "title": "Buffer insertion for EDA",
        "focus": "Wire RC → slew budget → candidates → library → Van Ginneken → slew-driven → polarity → fanout → sequential",
        "prereq": None,
        "status": "ready",
        "repo": "learn_buffering",
        "modules_md": ROOT / "courses" / "learn_buffering" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_buffering",
        "lead": (
            "Van Ginneken-style and slew-driven buffer insertion on a tiny net — options, prune, restore slew. "
            "Clips and decks load from "
            "<code>courses/learn_buffering</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#buffering",
        "tools_label": "Buffering tools",
        "first_lab": "wire-rc",
        "first_n": "02",
    },
    "learn_synthesis": {
        "title": "Logic synthesis for EDA",
        "focus": "Boolean network → AIG → strash → rewrite → cuts → library → techmap → area/delay → sequential",
        "prereq": None,
        "status": "ready",
        "repo": "learn_synthesis",
        "modules_md": ROOT / "courses" / "learn_synthesis" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_synthesis",
        "lead": (
            "AIG-based logic synthesis on a tiny netlist — strash, rewrite, k-cuts, techmap, area/delay. "
            "Clips and decks load from "
            "<code>courses/learn_synthesis</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#synthesis",
        "tools_label": "Synthesis tools",
        "first_lab": "boolean-network",
        "first_n": "02",
    },
    "learn_retiming": {
        "title": "Retiming for EDA",
        "focus": "Sequential graph → registers → path delay → forward/backward → legal → period → min-period → area",
        "prereq": None,
        "status": "ready",
        "repo": "learn_retiming",
        "modules_md": ROOT / "courses" / "learn_retiming" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_retiming",
        "lead": (
            "Leiserson–Saxe retiming literacy on a tiny sequential graph — legal lag vectors, period, register tradeoffs. "
            "Clips and decks load from "
            "<code>courses/learn_retiming</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#retiming",
        "tools_label": "Retiming tools",
        "first_lab": "sequential-graph",
        "first_n": "02",
    },
    "learn_equivalence": {
        "title": "Equivalence checking for EDA",
        "focus": "Spec/impl → miter → truth-table CEC → FRAIG → SAT/CNF → cex → don't-care → sequential unroll/SEC",
        "prereq": None,
        "status": "ready",
        "repo": "learn_equivalence",
        "modules_md": ROOT / "courses" / "learn_equivalence" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_equivalence",
        "lead": (
            "Combinational and bounded sequential equivalence literacy — miters, exhaustive CEC, SAT/CNF, counterexamples. "
            "Clips and decks load from "
            "<code>courses/learn_equivalence</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#equivalence",
        "tools_label": "Equivalence tools",
        "first_lab": "spec-impl",
        "first_n": "02",
    },
}

COURSE_INDEX = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} — Labs</title>
  <link rel="stylesheet" href="../../assets/site.css">
</head>
<body data-asset-base="../../assets/">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="site-header-inner">
      <p class="brand"><a href="../../index.html">EDA Algorithms Platform</a></p>
      <div class="site-header-tools">
        <nav class="site-nav" aria-label="Site">
          <a href="../../index.html">Home</a>
          <a href="../index.html" class="is-active" aria-current="page">Courses</a>
          <a href="../../tools/index.html">Tools</a>
        </nav>
        <div class="site-search" data-site-search></div>
      </div>
    </div>
    <div class="site-header-crumb">
      <nav aria-label="Breadcrumb">
        <a href="../../index.html">Home</a>
        <a href="../index.html">Courses</a>
        <span class="here">{course_id}</span>
      </nav>
    </div>
  </header>
  <main id="main">
    <div class="eyebrow">Course</div>
    <section class="hero">
      <h1>{title}</h1>
      <p class="lead">{lead}</p>
      <div data-course-progress></div>
      <div class="cta-row">
        <a class="btn btn-primary" href="labs/{first_lab}/index.html">Start Lab {first_n}</a>
        <a class="btn btn-secondary" href="{tools_href}">{tools_label}</a>
        <a class="btn btn-ghost" href="../index.html">Courses map</a>
      </div>
    </section>
    <h2>Labs</h2>
    <div data-render="course-labs" data-course="{course_id}"></div>
  </main>
  <footer class="site-footer">
    Repo: <code>courses/{course_id}/</code> · progress saved in this browser only.
  </footer>
  <script src="../../assets/site-config.js?v={asset_v}"></script>
  <script src="../../assets/site.js?v={asset_v}"></script>
  <script src="../../assets/pages.js?v={asset_v}"></script>
</body>
</html>
"""

LAB_TPL = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} — {course_title}</title>
  <link rel="stylesheet" href="../../../../assets/site.css">
</head>
<body data-asset-base="../../../../assets/">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="site-header-inner">
      <p class="brand"><a href="../../../../index.html">EDA Algorithms Platform</a></p>
      <div class="site-header-tools">
        <nav class="site-nav" aria-label="Site">
          <a href="../../../../index.html">Home</a>
          <a href="../../../index.html" class="is-active" aria-current="page">Courses</a>
          <a href="../../../../tools/index.html">Tools</a>
        </nav>
        <div class="site-search" data-site-search></div>
      </div>
    </div>
    <div class="site-header-crumb">
      <nav aria-label="Breadcrumb">
        <a href="../../../../index.html">Home</a>
        <a href="../../../index.html">Courses</a>
        <a href="../../index.html">{course_id}</a>
        <span class="here" data-lab-crumb>Lab {n}</span>
      </nav>
    </div>
  </header>
  <main id="main">
    <div data-render="lab" data-course="{course_id}" data-lab="{slug}" data-lab-root data-lab-title></div>
  </main>
  <footer class="site-footer">
    <a href="../../index.html">Course map</a> · progress saved in this browser only.
  </footer>
  <script src="../../../../assets/site-config.js?v={asset_v}"></script>
  <script src="../../../../assets/site.js?v={asset_v}"></script>
  <script src="../../../../assets/pages.js?v={asset_v}"></script>
</body>
</html>
"""

COURSES_INDEX = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Courses — EDA Algorithms Platform</title>
  <link rel="stylesheet" href="../assets/site.css">
</head>
<body data-asset-base="../assets/">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="site-header-inner">
      <p class="brand"><a href="../index.html">EDA Algorithms Platform</a></p>
      <div class="site-header-tools">
        <nav class="site-nav" aria-label="Site">
          <a href="../index.html">Home</a>
          <a href="index.html" class="is-active" aria-current="page">Courses</a>
          <a href="../tools/index.html">Tools</a>
        </nav>
        <div class="site-search" data-site-search></div>
      </div>
    </div>
    <div class="site-header-crumb">
      <nav aria-label="Breadcrumb"><a href="../index.html">Home</a><span class="here">Courses</span></nav>
    </div>
  </header>
  <main id="main">
    <div class="eyebrow">Courses</div>
    <section class="hero">
      <h1>Courses</h1>
      <p class="lead">
        Each course is a sequence of <strong>labs</strong>. Progress is saved in this browser.
        Nodes on the map tint when you mark labs done.
      </p>
    </section>
    <h2 id="courses-map">Courses map</h2>
    <div data-render="path-map"></div>
  </main>
  <footer class="site-footer">
    Planning source: <a href="../../eda.md">eda.md</a> · syllabus wiring grows with each published course.
  </footer>
  <script src="../assets/site-config.js?v={asset_v}"></script>
  <script src="../assets/site.js?v={asset_v}"></script>
  <script src="../assets/pages.js?v={asset_v}"></script>
</body>
</html>
"""

# Visual ladder (top → bottom). Keep in sync with pages.js PATH_LADDER_ROWS and eda.md.
PATH_LADDER_ROWS: list[list[str]] = [
    ["learn_eda"],
    ["learn_ir", "learn_geometry", "learn_techlib"],
    ["learn_synthesis", "learn_retiming", "learn_equivalence"],
    ["learn_sta", "learn_sdc", "learn_si"],
    ["learn_partitioning", "learn_clustering"],
    ["learn_floorplanning", "learn_placement", "learn_legalization", "learn_congestion"],
    ["learn_clock_tree", "learn_buffering"],
    ["learn_global_routing", "learn_routing", "learn_compaction"],
    ["learn_pattern_matching", "learn_drc", "learn_lvs", "learn_pex"],
    ["learn_spice", "learn_erc", "learn_antenna"],
    ["learn_power", "learn_dft_insert", "learn_signoff"],
    ["learn_yosys", "learn_openroad", "learn_openlane", "learn_fpga_cad"],
    ["learn_analog_layout", "learn_ml_eda", "learn_pdks"],
]

# Placeholder catalog entries for map nodes not yet published (status planned).
LADDER_STUBS: dict[str, dict[str, str]] = {
    "learn_eda": {"title": "EDA stack map", "focus": "IR → synth → timing → P&R → DRC/LVS/PEX → which learn_* next"},
    "learn_ir": {"title": "Design IR", "focus": "Netlist / hierarchy IR for CAD algorithms"},
    "learn_geometry": {"title": "Geometry engines", "focus": "Edges, polygons, half-edges, scanline queries"},
    "learn_techlib": {"title": "Techlib / Liberty-lite", "focus": "Cells, pins, timing arcs as data"},
    "learn_synthesis": {"title": "Logic synthesis", "focus": "AIG, techmapping, rewrite, area/delay"},
    "learn_retiming": {"title": "Retiming", "focus": "Register move literacy"},
    "learn_equivalence": {"title": "Equivalence checking", "focus": "Combinational / sequential equiv algorithms"},
    "learn_sta": {"title": "Static timing analysis", "focus": "Timing graph, slack, incremental update"},
    "learn_sdc": {"title": "SDC constraints", "focus": "Clocks, I/O, false/multicycle as engine data"},
    "learn_si": {"title": "Signal integrity", "focus": "Crosstalk / noise-on-timing literacy"},
    "learn_partitioning": {"title": "Partitioning", "focus": "KL / FM, multiway, cutsize"},
    "learn_clustering": {"title": "Clustering for EDA", "focus": "Affinity → merge → LP/spectral → KL/FM → multilevel"},
    "learn_floorplanning": {"title": "Floorplanning", "focus": "Fixed-outline, slicing/NSG, macros"},
    "learn_placement": {"title": "Placement", "focus": "Global place, HPWL, density"},
    "learn_legalization": {"title": "Legalization", "focus": "Snap to sites/rows, overlap removal"},
    "learn_congestion": {"title": "Congestion", "focus": "Congestion estimation and inflators"},
    "learn_clock_tree": {"title": "Clock tree synthesis", "focus": "H-tree / MMM, skew, clock buffering"},
    "learn_buffering": {"title": "Buffering", "focus": "Van Ginneken-style / slew-driven insert"},
    "learn_global_routing": {"title": "Global routing", "focus": "GCells, capacity, overflow"},
    "learn_routing": {"title": "Detailed routing", "focus": "Maze/A*, rip-up & reroute"},
    "learn_compaction": {"title": "Compaction", "focus": "Layout compaction literacy"},
    "learn_pattern_matching": {"title": "Pattern matching", "focus": "DRC-style edge/region patterns"},
    "learn_drc": {"title": "DRC", "focus": "Rule deck → width/spacing/enclosure checkers"},
    "learn_lvs": {"title": "LVS", "focus": "Device recognition, net extract, graph compare"},
    "learn_pex": {"title": "PEX", "focus": "R/C from geometry, network reduction"},
    "learn_spice": {"title": "SPICE / circuit sim", "focus": "MNA, Newton, sparse LU, transient"},
    "learn_erc": {"title": "ERC", "focus": "Electrical rule categories"},
    "learn_antenna": {"title": "Antenna checks", "focus": "Antenna ratio / charge accumulation"},
    "learn_power": {"title": "Power analysis", "focus": "Switching/leakage, IR drop lite"},
    "learn_dft_insert": {"title": "DFT insert", "focus": "Scan / DFT as netlist transforms"},
    "learn_signoff": {"title": "Signoff literacy", "focus": "Corners, ECO loop, tapeout hooks"},
    "learn_yosys": {"title": "Yosys evidence", "focus": "Synth CLI / reports vs toy engines"},
    "learn_openroad": {"title": "OpenROAD evidence", "focus": "Place/CTS/route vs PD algorithm courses"},
    "learn_openlane": {"title": "OpenLane flow", "focus": "RTL→GDS flow literacy"},
    "learn_fpga_cad": {"title": "FPGA CAD", "focus": "Packing/place/route differences"},
    "learn_analog_layout": {"title": "Analog layout", "focus": "Device-level layout algorithms"},
    "learn_ml_eda": {"title": "ML for EDA", "focus": "ML-for-CAD literacy (not the spine)"},
    "learn_pdks": {"title": "PDK packaging", "focus": "LEF/Liberty/tech as data engineering"},
}


def parse_modules(modules_md: Path, course_root: Path) -> list[dict]:
    text = modules_md.read_text(encoding="utf-8")
    labs: list[dict] = []
    for i, m in enumerate(ROW.finditer(text), start=1):
        module_id, kind, title, tool_id, status_raw = (
            m.group(1),
            m.group(2).strip(),
            m.group(3).strip(),
            m.group(4),
            (m.group(5) or "").strip().lower(),
        )
        slug = module_id.split("-", 2)[-1]
        folder = course_root / module_id
        tool = tool_id.strip() if tool_id else None
        if kind == "offline":
            tool = None

        has_video = (folder / "video.mp4").is_file() if folder.is_dir() else False
        has_pdf = (folder / "slides.pdf").is_file() if folder.is_dir() else False
        has_pptx = (folder / "slides.pptx").is_file() if folder.is_dir() else False
        has_quiz = (folder / "quiz.json").is_file() if folder.is_dir() else False

        if "**ref**" in status_raw or status_raw in ("ref", "shipped", "s"):
            lab_status = "shipped"
        elif kind in ("intro", "wrap") and folder.is_dir():
            # Intro/wrap shells are navigable once the module folder exists.
            lab_status = "shipped"
        elif status_raw in ("—", "-", ""):
            lab_status = "shipped" if has_pptx else "planned"
        else:
            lab_status = "planned"

        labs.append(
            {
                "n": f"{i:02d}",
                "slug": slug,
                "moduleId": module_id,
                "kind": kind,
                "title": title,
                "toolId": tool,
                "status": lab_status,
                "media": {
                    "video": has_video,
                    "pdf": has_pdf,
                    "pptx": has_pptx,
                    "quiz": has_quiz,
                },
            }
        )
    return labs


def link_course_media(repo: str) -> None:
    media = PLATFORM / "course-media"
    media.mkdir(parents=True, exist_ok=True)
    src = ROOT / "courses" / repo
    dst = media / repo
    rel = os.path.join("..", "..", "courses", repo)
    if not src.is_dir():
        raise SystemExit(f"missing course tree: {src}")

    def _dst_ok() -> bool:
        try:
            return dst.is_symlink() or dst.exists()
        except OSError:
            # Windows: broken/inaccessible reparse point
            return True

    if _dst_ok():
        try:
            if dst.is_symlink() and os.readlink(dst).replace("\\", "/") == rel.replace("\\", "/"):
                print(f"OK   course-media/{repo}: already linked")
                return
        except OSError:
            pass
        try:
            if dst.is_symlink():
                dst.unlink()
            elif dst.is_dir() and not any(dst.iterdir()):
                dst.rmdir()
            elif dst.exists():
                print(f"OK   course-media/{repo}: keep existing")
                return
        except OSError as exc:
            print(f"WARN course-media/{repo}: leave as-is ({exc})", file=sys.stderr)
            return
    try:
        os.symlink(rel, dst, target_is_directory=True)
        print(f"OK   course-media/{repo} -> {rel}")
    except OSError as exc:
        print(f"WARN symlink failed ({exc})", file=sys.stderr)


PARTITION_TOOL_IDS = {
    "cutsize-balance",
    "initial-bipartition",
    "kl-partition",
    "fm-partition",
    "spectral-partition",
    "recursive-bisection",
    "multiway-partition",
    "terminal-propagation",
    "hypergraph-partition",
    "multilevel-partition",
}

PLACEMENT_TOOL_IDS = {
    "hpwl-metrics",
    "net-models",
    "force-directed-place",
    "quadratic-place",
    "analytical-place",
    "sa-placement",
    "density-bins",
    "spread-legalize-lite",
    "timing-driven-place",
}

FLOORPLAN_TOOL_IDS = {
    "fixed-outline",
    "area-deadspace",
    "slicing-floorplan",
    "bstar-tree",
    "sequence-pair",
    "simulated-annealing-fp",
    "soft-module-sizing",
    "macro-placement",
    "hierarchical-floorplan",
    "pin-assignment",
}

STA_TOOL_IDS = {
    "timing-graph",
    "arrival-required",
    "slack-setup-hold",
    "critical-path",
    "incremental-update",
    "false-multicycle-lite",
}

LEGALIZATION_TOOL_IDS = {
    "site-row-model",
    "legality-metrics",
    "greedy-snap",
    "overlap-removal",
    "abacus-row-pack",
    "tetris-row-pack",
    "fixed-macros",
    "displacement-hpwl",
    "detailed-vs-global",
}


def sync_tools_from_dirs(cat: dict) -> None:
    tools_root = PLATFORM / "tools"
    labs = []
    for child in sorted(tools_root.iterdir()):
        if not child.is_dir() or child.name.startswith("_") or child.name == "algorithm-walkthrough":
            continue
        if not (child / "index.html").is_file():
            continue
        title = child.name.replace("-", " ").title()
        for old in cat.get("labs", []):
            if old.get("id") == child.name:
                title = old.get("title", title)
                break
        if child.name in PARTITION_TOOL_IDS:
            section = "Partitioning"
        elif child.name in PLACEMENT_TOOL_IDS:
            section = "Placement"
        elif child.name in FLOORPLAN_TOOL_IDS:
            section = "Floorplanning"
        elif child.name in STA_TOOL_IDS:
            section = "Static timing analysis"
        elif child.name in LEGALIZATION_TOOL_IDS:
            section = "Legalization"
        else:
            section = "Clustering & refinement"
        labs.append({"id": child.name, "title": title, "section": section})
    cat["labs"] = labs


def write_pages(course_id: str, course: dict, meta: dict) -> int:
    out_root = PLATFORM / "courses" / course_id
    out_root.mkdir(parents=True, exist_ok=True)
    first = next((l for l in course["labs"] if l.get("kind") == "lab"), course["labs"][0])
    (out_root / "index.html").write_text(
        COURSE_INDEX.format(
            title=course["title"],
            course_id=course_id,
            lead=meta["lead"],
            first_lab=meta.get("first_lab", first["slug"]),
            first_n=meta.get("first_n", first["n"]),
            tools_href=meta.get("tools_href", "../../tools/index.html"),
            tools_label=meta.get("tools_label", "Tools"),
            asset_v=ASSET_V,
        ),
        encoding="utf-8",
    )
    n = 0
    for lab in course["labs"]:
        dest = out_root / "labs" / lab["slug"]
        dest.mkdir(parents=True, exist_ok=True)
        (dest / "index.html").write_text(
            LAB_TPL.format(
                title=lab["title"],
                course_title=course["title"],
                course_id=course_id,
                n=lab["n"],
                slug=lab["slug"],
                asset_v=ASSET_V,
            ),
            encoding="utf-8",
        )
        n += 1
    print(f"wrote {course_id}: index + {n} lab shells (pages.js)")
    return n


def ensure_ladder_courses(cat: dict) -> None:
    """Ensure every path-map node exists in catalog (planned stubs when unpublished)."""
    by_id = {c.get("id"): c for c in cat.get("courses", []) if c.get("id")}
    order: list[dict] = []
    seen: set[str] = set()
    for row in PATH_LADDER_ROWS:
        for cid in row:
            seen.add(cid)
            if cid in by_id:
                order.append(by_id[cid])
            else:
                stub = LADDER_STUBS.get(cid, {"title": cid, "focus": ""})
                order.append(
                    {
                        "id": cid,
                        "title": stub["title"],
                        "focus": stub["focus"],
                        "status": "planned",
                        "repo": cid,
                        "prereq": None,
                        "labs": [],
                    }
                )
    # Keep any published courses not on the ladder (append at end)
    for cid, c in by_id.items():
        if cid not in seen:
            order.append(c)
    cat["courses"] = order


def write_courses_index(_courses: list[dict] | None = None) -> None:
    """Write digital_learning-style courses map (data-render=path-map)."""
    out = PLATFORM / "courses" / "index.html"
    out.write_text(COURSES_INDEX.format(asset_v=ASSET_V), encoding="utf-8")
    print(f"wrote {out.relative_to(ROOT)} (path-map)")


def update_home() -> None:
    home = PLATFORM / "index.html"
    text = home.read_text(encoding="utf-8")
    if "site-config.js" not in text:
        text = text.replace(
            '<script src="assets/site.js"></script>',
            '<script src="assets/site-config.js"></script>\n  <script src="assets/site.js"></script>',
        )
    if 'href="courses/index.html"' not in text:
        text = text.replace(
            '<a href="tools/index.html">Tools</a>',
            '<a href="courses/index.html">Courses</a>\n        <a href="tools/index.html">Tools</a>',
        )
    if "Guided path with video" not in text and 'pillar-card" href="courses/' not in text:
        text = text.replace(
            """        <li>
          <a class="pillar-card" href="tools/index.html">
            <h2>Tools</h2>
            <p>Concept labs on one shelf — affinity, merge, LP, KL, FM, and more.</p>
          </a>
        </li>""",
            """        <li>
          <a class="pillar-card" href="courses/index.html">
            <h2>Courses</h2>
            <p>Guided path with video clips, quizzes, and progress — start with clustering.</p>
          </a>
        </li>
        <li>
          <a class="pillar-card" href="tools/index.html">
            <h2>Tools</h2>
            <p>Concept labs on one shelf — affinity, merge, LP, KL, FM, and more.</p>
          </a>
        </li>""",
        )
    # CTA to courses
    if "courses/learn_clustering" not in text:
        text = text.replace(
            '<a class="btn btn-primary" href="tools/index.html">Browse tools</a>',
            '<a class="btn btn-primary" href="courses/learn_clustering/index.html">Start clustering course</a>\n'
            '        <a class="btn btn-secondary" href="tools/index.html">Browse tools</a>',
        )
    home.write_text(text, encoding="utf-8")
    print("updated platform/index.html")


def publish(course_id: str) -> None:
    meta = COURSE_META.get(course_id)
    if not meta:
        raise SystemExit(f"unknown course: {course_id}")
    labs = parse_modules(meta["modules_md"], meta["course_root"])
    if not labs:
        raise SystemExit(f"no modules parsed from {meta['modules_md']}")

    cat = json.loads(CATALOG.read_text(encoding="utf-8")) if CATALOG.is_file() else {"site": {"title": "EDA Algorithms Platform"}}
    sync_tools_from_dirs(cat)
    course_entry = {
        "id": course_id,
        "title": meta["title"],
        "focus": meta["focus"],
        "status": meta["status"],
        "repo": meta["repo"],
        "prereq": meta.get("prereq"),
        "labs": labs,
    }
    courses = [c for c in cat.get("courses", []) if c.get("id") != course_id]
    courses.append(course_entry)
    cat["courses"] = courses
    ensure_ladder_courses(cat)
    CATALOG.write_text(json.dumps(cat, indent=2) + "\n", encoding="utf-8")
    print(f"updated catalog ({len(labs)} modules, {len(cat.get('labs', []))} tools, {len(cat['courses'])} courses)")

    link_course_media(meta["repo"])
    write_pages(course_id, course_entry, meta)
    write_courses_index(cat["courses"])
    update_home()
    ready = sum(1 for l in labs if l["media"].get("video") and l["media"].get("pdf"))
    quiz_n = sum(1 for l in labs if l["media"].get("quiz"))
    print(f"media ready: {ready}/{len(labs)} video+pdf · quizzes: {quiz_n}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("course_id", nargs="?", default="learn_clustering")
    args = ap.parse_args()
    publish(args.course_id)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
