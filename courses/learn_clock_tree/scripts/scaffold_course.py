#!/usr/bin/env python3
"""Scaffold learn_clock_tree (hierarchical SS-AA ids) with module-slides stubs."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COURSE_ID = "learn_clock_tree"
LIVE_TOOLS = "https://universal-verification-methodology.github.io/learning/tools"

MODULES = [
    {
        "id": "module00-00-intro",
        "kind": "intro",
        "title": "Welcome to clock tree synthesis",
        "short": "Welcome",
        "lab": None,
        "status": "—",
        "section": "00",
        "outcomes": "Explain why CTS follows placement and delivers a low-skew clock network.",
        "algorithm": None,
        "hook": "Placement gave you cell centers. Clock tree synthesis connects a single source to every sink with controlled latency and skew.",
        "idea": "CTS builds a tree from CLK to sinks A–F on our twelve-by-eight toy. You will measure skew, grow H-trees and MMM merges, balance with a zero-skew meeting point, then insert buffers.",
    },
    {
        "id": "module01-01-clock-sinks",
        "kind": "lab",
        "title": "Clock sinks from placement",
        "short": "Clock sinks",
        "lab": "clock-sinks",
        "status": "**ref**",
        "section": "01",
        "outcomes": "Map placement centers to clock sinks and locate the chip-center source.",
        "algorithm": "clock sink enumeration from placement",
        "hook": "Every CTS algorithm starts from sinks—cell centers that must receive the clock—and one source.",
        "idea": "sink_points reads placement for A through F. Source sits at six comma four. Moving a sink moves its access point for the next tree build.",
        "walk": [
            ("12×8 chip", "01-chip", "Six sinks A–F sit on the same spread placement as routing labs."),
            ("Clock source", "02-src", "CLK star at chip center (6,4) — the root of every tree."),
            ("Sink A", "03-a", "A at (1,1) southwest corner."),
            ("Sink D", "04-d", "D at (8,5) northeast."),
            ("All six", "05-all", "E/F sit near the center corridor beside the source."),
        ],
        "browser": "Open **clock-sinks**. Confirm six sinks and the yellow CLK star at six comma four. Move B and watch its label follow.",
        "impl": "Call `sink_points(placement, sinks)` in `common/ctsutil.py`. Print A through F on tiny_cts. Assert source at (6,4).",
        "pitfalls": "Using GCell indices instead of cell centers. Forgetting the source is fixed. Treating nets as sinks.",
        "next": "Next: measure latency and skew on a built tree.",
        "pseudo": """## Pseudocode

```text
Input: placement map, sink ids [A..F], source (sx,sy)
for each id in sinks:
  sinks.append({id, x: placement[id].x, y: placement[id].y})
Output: sink list + fixed clock source
Golden: six sinks; source (6,4) on 12×8 chip
```
""",
    },
    {
        "id": "module01-03-latency-skew",
        "kind": "lab",
        "title": "Latency and skew",
        "short": "Latency skew",
        "lab": "latency-skew",
        "status": "**ref**",
        "section": "01",
        "outcomes": "Compute per-sink tree latency and skew as max minus min.",
        "algorithm": "clock latency and skew metrics",
        "hook": "Skew is the CTS scoreboard: how different are arrival times at sinks.",
        "idea": "Walk the tree from source to each sink summing Manhattan edge lengths. Skew equals max latency minus min latency. Wire delay per unit is one on the toy.",
        "walk": [
            ("Skew = max − min", "01-def", "Per-sink latency is Manhattan length along the tree; skew is max minus min."),
            ("H-tree skew", "02-h", "Build H-tree on spread and read skew overlay."),
            ("MMM skew", "03-mmm", "MMM merge may differ from H-tree on the same sinks."),
            ("Path to A", "04-path", "Highlight sink A — yellow edges show source→A path."),
            ("Drive skew down", "05-goal", "Move sinks or switch topology to clear challenge bounds."),
        ],
        "browser": "Open **latency-skew**. Build H-tree, read skew, then Build MMM and compare. Select A to highlight its path.",
        "impl": "Implement or call `latency(path)` and `skew(latencies)` in `common/solvers.py`. Print skew for MMM on tiny_cts.",
        "pitfalls": "Using Euclidean distance. Comparing sinks without a tree. Treating buffer delay as wire length without counting buffers.",
        "next": "Next: grow a classic H-tree topology.",
        "pseudo": """## Pseudocode

```text
Input: tree edges, source, sinks, wire_delay
for each sink s:
  path ← shortest path on tree from source to s
  L[s] ← sum Manhattan(edge) × wire_delay along path
skew ← max(L) − min(L)
Output: latencies L, skew
Golden: H-tree and MMM report finite skew on spread (see GOLDENS)
```
""",
    },
    {
        "id": "module02-01-h-tree",
        "kind": "lab",
        "title": "H-tree topology",
        "short": "H-tree",
        "lab": "h-tree",
        "status": "**ref**",
        "section": "02",
        "outcomes": "Build a recursive H-tree from the source covering sink clusters.",
        "algorithm": "H-tree clock topology",
        "hook": "H-trees are the classic picture of a balanced clock network on a regular array.",
        "idea": "From the source, alternate horizontal and vertical splits toward sink groups. Each split creates steiner points and L-shaped legs to children.",
        "walk": [
            ("Recursive H", "01-idea", "Alternate horizontal and vertical splits from the source toward sink clusters."),
            ("Built tree", "02-build", "H-tree edges fan from CLK to all six sinks."),
            ("Path highlight", "03-path", "Select D to see the source→D corridor."),
            ("Balance goal", "04-balance", "Symmetric splits keep opposite corners similar — not perfect on this toy."),
            ("When H-tree", "05-use", "Use H-trees when sinks fill a rectangle evenly; otherwise MMM or DME."),
        ],
        "browser": "Open **h-tree**. Click Build H-tree. Select D and watch the yellow path. Compare skew to the MMM lab next.",
        "impl": "Call `h_tree(source, chip)` / browser `hTree(positions)`. Attach sinks and print edge count and skew.",
        "pitfalls": "Stopping after one H without recursion. Connecting sinks with Euclidean edges. Ignoring steiner points when measuring latency.",
        "next": "Next: Method of Means and Medians for irregular sinks.",
        "pseudo": """## Pseudocode

```text
Input: source, sink points
build(pts, root, horizontal):
  if |pts|=1: connect root→pts[0]; return
  split pts by median x (or y if vertical)
  place steiners toward each half; recurse alternating axis
Output: edges + steiners
Golden: connects all six sinks on spread; finite skew
```
""",
    },
    {
        "id": "module02-03-mmm-tree",
        "kind": "lab",
        "title": "Method of Means and Medians",
        "short": "MMM tree",
        "lab": "mmm-tree",
        "status": "**ref**",
        "section": "02",
        "outcomes": "Build an MMM-style tree by merging closest fragments at midpoints.",
        "algorithm": "Method of Means and Medians (MMM) clock tree",
        "hook": "When sinks are irregular, greedy merge adapts better than a pure geometric H.",
        "idea": "Treat each sink as a fragment. Repeatedly merge the closest pair of fragment roots at their midpoint, then trunk the final root to the clock source.",
        "walk": [
            ("Means & medians", "01-idea", "Repeatedly merge the closest fragment roots at their midpoint."),
            ("Merged tree", "02-build", "MMM connects all sinks then trunks to the source."),
            ("Merge points", "03-steiners", "Steiners mark where two subtrees join."),
            ("vs H-tree", "04-vs-h", "MMM adapts to irregular sink sets better than pure H geometry."),
            ("Toward DME", "05-next", "Zero-skew merge balances subtree delays explicitly."),
        ],
        "browser": "Open **mmm-tree**. Build MMM, read skew, then rebuild after moving C. Compare to H-tree skew.",
        "impl": "Call `mmm_tree(source, sinks)` in solvers. Assert every sink endpoint appears in the edge set.",
        "pitfalls": "Merging by Euclidean when latency is Manhattan. Forgetting to connect the final fragment to the source. Dropping steiner coordinates when buffering.",
        "next": "Next: zero-skew merge (DME lite).",
        "pseudo": """## Pseudocode

```text
fragments ← each sink as root
while |fragments| > 1:
  pick closest pair (f1,f2) by Manhattan(root)
  merge ← midpoint(f1.root, f2.root)
  edges += merge→f1.root, merge→f2.root
  replace pair with merged fragment
connect source → final.root
Output: edges + steiners
Golden: all sinks reachable; skew documented in GOLDENS
```
""",
    },
    {
        "id": "module02-05-zero-skew-merge",
        "kind": "lab",
        "title": "Zero-skew merge (DME lite)",
        "short": "Zero-skew",
        "lab": "zero-skew-merge",
        "status": "**ref**",
        "section": "02",
        "outcomes": "Place a merge point that balances left/right subtree delays.",
        "algorithm": "zero-skew merge / DME lite",
        "hook": "Deferred-merge embedding equalizes delay so opposite arms arrive together.",
        "idea": "Partition sinks left and right of the source. Choose a meeting steiner so left radius plus wire matches right radius plus wire. That is the zero-skew intuition.",
        "walk": [
            ("DME lite", "01-idea", "Split sinks left/right of source; meet at a point that balances subtree radii."),
            ("Balanced meet", "02-demo", "Zero-skew demo places a merge steiner near CLK."),
            ("Symmetric paths", "03-path", "Opposite sinks should see similar source latency."),
            ("Read skew", "04-skew", "Overlay reports near-zero skew on the toy spread."),
            ("Toy only", "05-limit", "Full DME embeds delay recursively on every merge — this lab is the intuition."),
        ],
        "browser": "Open **zero-skew-merge**. Run Zero-skew merge demo. Confirm skew near zero to three. Select A and B and compare latencies.",
        "impl": "Call `zero_skew_merge(a,b,da,db)` for a 1D pair; run the browser demo for the full chip. Assert |la−lb| ≈ 0 for equal da,db.",
        "pitfalls": "Balancing Euclidean radii. Ignoring existing subtree delay da/db. Expecting full industrial DME from this toy.",
        "next": "Next: tapping points where the tree forks.",
        "pseudo": """## Pseudocode

```text
Input: points a,b with subtree delays da,db
On a shared horizontal (or vertical) line:
  place merge p so da + |a−p| = db + |b−p|
Else try HV / VH elbows; pick smaller imbalance
Output: merge point p
Golden: equal da=db=0 → midpoint; demo skew≈0 on spread
```
""",
    },
    {
        "id": "module02-07-tapping-points",
        "kind": "lab",
        "title": "Tapping / branch points",
        "short": "Tapping",
        "lab": "tapping-points",
        "status": "**ref**",
        "section": "02",
        "outcomes": "Identify high-degree steiner taps where the clock network branches.",
        "algorithm": "clock tapping / branch-point extraction",
        "hook": "Buffers and clock gates often sit where the tree forks.",
        "idea": "Collect steiner and edge endpoints. Keep points with degree at least three—those are tapping points.",
        "walk": [
            ("Branch taps", "01-def", "Tapping points are steiners with degree ≥ 3 — where the clock forks."),
            ("On MMM", "02-mmm", "MMM merge points are natural taps."),
            ("On H-tree", "03-h", "H splits also create high-degree junctions."),
            ("Why care", "04-why", "Buffers and gating often sit at taps; routing capacity concentrates there."),
            ("API", "05-api", "Call tappingPoints(tree) after Build — challenges score tap count."),
        ],
        "browser": "Open **tapping-points**. Build MMM and confirm taps ≥ 1. Rebuild H-tree and compare tap count.",
        "impl": "Call `tapping_points(tree)` after `mmm_tree`. Assert length ≥ 1 on tiny_cts.",
        "pitfalls": "Counting leaf sinks as taps. Using degree on undirected edges inconsistently. Dropping steiners before the degree pass.",
        "next": "Next: insert buffers on long wires.",
        "pseudo": """## Pseudocode

```text
Input: tree edges + steiners
degree[p] ← count incident edges for each endpoint p
taps ← { p | degree[p] ≥ 3 }  (optionally exclude pure source)
Output: tapping / branch points
Golden: MMM on spread yields ≥ 1 tap
```
""",
    },
    {
        "id": "module03-01-clock-buffering",
        "kind": "lab",
        "title": "Clock buffering on wires",
        "short": "Buffering",
        "lab": "clock-buffering",
        "status": "**ref**",
        "section": "03",
        "outcomes": "Split long clock edges and place buffers at joints.",
        "algorithm": "clock buffer insertion on long wires",
        "hook": "Long wires lose slew; CTS inserts buffers along the tree.",
        "idea": "If an edge longer than maxWireLen, split it into equal pieces and place a buffer at each joint. Buffered latency adds bufferDelay per buffer on the path.",
        "walk": [
            ("Long wires", "01-idea", "Split edges longer than maxWireLen; place buffer squares at joints."),
            ("Before buffers", "02-before", "H-tree may have long Manhattan legs."),
            ("After insert", "03-after", "Insert buffers — joints appear on long segments."),
            ("Buffered latency", "04-latency", "bufferedLatencies adds bufferDelay per buffer on the path."),
            ("Trade-off", "05-trade", "Buffers restore slew but add delay — skew may rise or fall."),
        ],
        "browser": "Open **clock-buffering**. Build H-tree, click Insert buffers, count orange squares. Read buffered latencies for A.",
        "impl": "Call `insert_buffers(edge, max_span, buffer_delay)`. Assert max segment length ≤ max_span.",
        "pitfalls": "Buffering without splitting edges. Counting buffer delay twice. Using max span zero.",
        "next": "Next: meet a skew bound with buffers and topology choice.",
        "pseudo": """## Pseudocode

```text
Input: edge (a,b), max_span, buffer_delay
if Manhattan(a,b) ≤ max_span: return [edge], []
steps ← ceil(len / max_span)
place buffers at joints along the split
Output: sub-edges, buffers[{x,y,delay}]
Golden: (0,0)→(10,0) with max_span=4 yields >1 buffer
```
""",
    },
    {
        "id": "module03-03-skew-bound",
        "kind": "lab",
        "title": "Skew bound with buffers",
        "short": "Skew bound",
        "lab": "skew-bound",
        "status": "**ref**",
        "section": "03",
        "outcomes": "Check whether tree skew meets a numeric bound after topology/buffer choices.",
        "algorithm": "skew bound checking",
        "hook": "Signoff asks: is skew under budget? This lab makes that a Check button.",
        "idea": "skew_bound_ok is true when skew ≤ bound. Zero-skew merge often meets bound two on the toy; H-tree may need moves or a different mode.",
        "walk": [
            ("Target bound", "01-bound", "Challenges ask skew ≤ GOLDENS.skewBoundDefault (2) on the toy."),
            ("Zero-skew helps", "02-zs", "Zero-skew merge often meets the bound without moving sinks."),
            ("H may miss", "03-fail", "H-tree skew can exceed the tight bound on this spread."),
            ("Buffers + bound", "04-buf", "Buffering changes latencies — re-check the bound after insert."),
            ("Toward signoff", "05-signoff", "Real CTS targets skew under corners; this lab is the scalar habit."),
        ],
        "browser": "Open **skew-bound**. Run Zero-skew merge demo and Check. Try H-tree and see if you need to move sinks to meet bound two.",
        "impl": "Call `skew_bound_ok(latencies, bound)`. Document GOLDENS.skewBoundDefault = 2.",
        "pitfalls": "Hard-coding pass without measuring. Forgetting to rebuild after moving sinks. Mixing buffered and unbuffered latencies.",
        "next": "Next: sequential CTS connecting sinks in order.",
        "pseudo": """## Pseudocode

```text
Input: latencies L, bound B
return (max(L) − min(L)) ≤ B
Golden: zero-skew demo often passes B=2 on spread
```
""",
    },
    {
        "id": "module04-01-sequential-cts",
        "kind": "lab",
        "title": "Sequential CTS pass",
        "short": "Sequential CTS",
        "lab": "sequential-cts",
        "status": "**ref**",
        "section": "04",
        "outcomes": "Grow a tree by attaching sinks one-by-one to the nearest existing node.",
        "algorithm": "sequential / order-based CTS",
        "hook": "Some flows grow the clock net in sink order—order changes skew.",
        "idea": "Start from the source. For each sink in order A…F, attach an L-route to the nearest existing tree node. Optional buffering splits long legs afterward.",
        "walk": [
            ("Net order", "01-order", "Connect sinks A…F one-by-one to the nearest existing tree node."),
            ("Built pass", "02-build", "Sequential tree grows from CLK outward."),
            ("Late sink", "03-path", "Later sinks may attach far from source — skew can be higher than MMM."),
            ("Optional buffers", "04-buf", "Insert buffers after sequential to split long legs."),
            ("Handoff", "05-done", "You can build H, MMM, DME-lite, sequential — next deepen buffering."),
        ],
        "browser": "Open **sequential-cts**. Run Sequential CTS, read skew, optionally Insert buffers. Compare to MMM on the same placement.",
        "impl": "Call `sequential_cts(data, mode='mmm')` for a full pass, or use the browser sequential builder. Print skew.",
        "pitfalls": "Assuming order does not matter. Attaching to sinks only, not steiners. Skipping the source as the first node.",
        "next": "Next: offline benchmark compare, then wrap.",
        "pseudo": """## Pseudocode

```text
nodes ← [source]; edges ← []
for sink in order:
  attach L-route from nearest(nodes) to sink
  nodes += sink + new steiners
optional: insert_buffers on long edges
Output: tree, skew
Golden: six sinks connected; skew documented in GOLDENS
```
""",
    },
    {
        "id": "module05-01-offline-benchmark-compare",
        "kind": "offline",
        "title": "Offline benchmark compare",
        "short": "Offline",
        "lab": None,
        "status": "P",
        "section": "05",
        "outcomes": "Compare H-tree, MMM, and sequential skew on tiny_cts offline.",
        "algorithm": None,
        "hook": "Without the browser, Track A still compares topologies on the same JSON.",
        "idea": "Load tiny_cts.json, run sequential_cts for mmm and h_tree modes, print skew and buffer counts side by side.",
    },
    {
        "id": "module99-00-wrap",
        "kind": "wrap",
        "title": "Clock tree path complete",
        "short": "Wrap",
        "lab": None,
        "status": "—",
        "section": "99",
        "outcomes": "Recap sinks, skew, H/MMM/DME, buffers; choose learn_buffering next.",
        "algorithm": None,
        "hook": "You built clock trees on the same chip spine as placement and routing.",
        "idea": "Sinks, skew, H-tree, MMM, zero-skew merge, taps, buffering, bounds, sequential pass. Natural next step is learn_buffering for Van Ginneken-style insertion.",
    },
]


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def course_readme() -> str:
    rows = []
    for m in MODULES:
        key = m["id"].replace("module", "")
        rows.append(f"| `{key}` | [{m['title']}]({m['id']}/README.md) | `{m['kind']}` |")
    labs = "\n".join(
        f"- [{m['lab']}]({LIVE_TOOLS}/{m['lab']}/)" for m in MODULES if m.get("lab")
    )
    return f"""# learn_clock_tree

[![GitHub](https://img.shields.io/badge/github-learning-monorepo-blank)](https://github.com/universal-verification-methodology)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Parent](https://img.shields.io/badge/parent-eda__learning-informational)](../../README.md)
[![Labs](https://img.shields.io/badge/labs-platform%20tools-success)]({LIVE_TOOLS}/)
[![Domain](https://img.shields.io/badge/domain-clock--tree-orange)](docs/MODULES.md)

**learn_clock_tree** is the open learning path for *clock tree synthesis* — H-tree / MMM, skew and latency bounds, and clock buffering on a tiny chip.

Readers follow module READMEs. Authors rebuild clips with module-slides. This tree may be consumed from the parent monorepo or as a submodule later.

## Table of contents

- [Contents](#contents)
- [Browse or clone](#browse-or-clone)
- [Consume from the parent](#consume-from-the-parent)
- [Author: publish or update](#author-publish-or-update)
- [Two learning tracks](#two-learning-tracks)
- [Module landings](#module-landings)
- [Browser labs](#browser-labs)
- [License](#license)

## Contents

```
learn_clock_tree/
├── README.md
├── LICENSE
├── common/         # Track A: tiny_cts.json, solvers, tests
├── docs/           # MODULES, SCOPE, TWO_TRACKS, WALKTHROUGHS
├── scripts/        # scaffold_course.py, build_all_media.sh, …
└── moduleSS-AA-slug/
    ├── README.md · CHECKLIST.md · EXAMPLES.md
    ├── transcript.md · outline.yaml · quiz.json
    └── (optional) examples/ · assets/ · slides · audio · video
```

Optional per-module media (pptx/pdf/audio/video) is produced by [module-slides](../../.cursor/skills/module-slides/SKILL.md).

## Browse or clone

From the monorepo root:

```bash
cd courses/learn_clock_tree
```

## Consume from the parent

Prereq: [learn_placement](../learn_placement/README.md) / [learn_sta](../learn_sta/README.md) literacy.  
Next: [learn_buffering](../learn_buffering/README.md).  
Lane map: [`eda.md`](../../eda.md). Scope: [docs/SCOPE.md](docs/SCOPE.md).

## Author: publish or update

```bash
# WSL / Linux — from monorepo root
python3 courses/learn_clock_tree/scripts/scaffold_course.py
bash courses/learn_clock_tree/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_clock_tree
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py \\
  courses/learn_clock_tree --modules
```

## Two learning tracks

| Track | Where | Doc |
|-------|-------|-----|
| **A — Implement** | `common/` + `examples/` | [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
| **B — Browser lab** | platform tools | [TWO_TRACKS.md](docs/TWO_TRACKS.md) |

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

| Key | Module | Kind |
|-----|--------|------|
{chr(10).join(rows)}

## Browser labs

{labs}

## License

[CC BY 4.0](LICENSE) unless noted.
"""


def modules_md() -> str:
    lines = [
        "# learn_clock_tree — module index",
        "",
        "Lab-driven syllabus with **hierarchical module ids** (`moduleSS-AA-slug`).",
        "",
        "| Id | Kind | Title | Lab / harness | Status |",
        "|----|------|-------|---------------|--------|",
    ]
    for m in MODULES:
        lab = f"`{m['lab']}`" if m.get("lab") else ("offline harness" if m["kind"] == "offline" else "—")
        lines.append(
            f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |"
        )
    return "\n".join(lines) + "\n"


def walkthroughs_md() -> str:
    labs = [m for m in MODULES if m.get("lab")]
    rows = "\n".join(
        f"| `{m['lab']}` | `{m['id']}` | 5 |" for m in labs
    )
    return f"""# Walkthroughs

Algorithm walkthrough packs (`kind: clock-tree`) live in `platform/tools/algorithm-walkthrough/clock-tree-algos.js`.

| Lab id | Module | Steps |
|--------|--------|-------|
{rows}

Capture:

```bash
bash courses/learn_clock_tree/scripts/capture_all_walkthroughs.sh
```
"""


def lab_readme(m: dict) -> str:
    idx = next(i for i, x in enumerate(MODULES) if x["id"] == m["id"])
    key = m["id"].replace("module", "")
    prev = MODULES[idx - 1] if idx > 0 else None
    nxt = MODULES[idx + 1] if idx + 1 < len(MODULES) else None
    nav_l = f"[← {prev['short']}](../{prev['id']}/README.md)" if prev else "← Start"
    nav_r = f"[{nxt['short']} →](../{nxt['id']}/README.md)" if nxt else "End →"
    nav = f"{nav_l} · [Course README](../README.md) · {nav_r}"

    media = """| Artifact | Path |
|----------|------|
| Transcript | [transcript.md](transcript.md) |
| Outline | [outline.yaml](outline.yaml) |
| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |
| Video | [video.mp4](video.mp4) |
| Quiz | [quiz.json](quiz.json) |
"""
    files = f"""```
{m['id']}/
├── README.md
├── CHECKLIST.md
├── EXAMPLES.md
├── outline.yaml
├── transcript.md
├── quiz.json
└── (optional) examples/ · assets/
```
"""

    if m["kind"] == "lab":
        algo = m.get("algorithm") or m["title"]
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `lab` · Primary lab: `{m['lab']}` · **ref**

{nav}

## Outcomes

After this module you can: **{m['outcomes']}**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md) and implement **{algo}** on `examples/tiny_cts.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md) with latency and skew when relevant.
3. Optional self-check: `./scripts/module.sh {key} --check` (from course root).

### Track B — Browser lab (online)

1. Local: [http://127.0.0.1:8080/tools/{m['lab']}/](http://127.0.0.1:8080/tools/{m['lab']}/)
2. Live: [{LIVE_TOOLS}/{m['lab']}/]({LIVE_TOOLS}/{m['lab']}/)
3. Tools shelf: open `{m['lab']}` from the platform tools index
4. Load the **starter clock tree** instance, build a tree, inspect skew and buffers.
5. Check off Track B items in [CHECKLIST.md](CHECKLIST.md).

> Concept labs teach CTS literacy on a tiny chip — not production clock trees.

## Media

{media}

## Files

{files}
"""

    if m["kind"] == "intro":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `intro` · Dual-track course welcome

{nav}

## What this course is

**learn_clock_tree** teaches *clock tree synthesis* using **two learning modes** on every lab module:

| Track | Where you practice | Best for |
|-------|--------------------|----------|
| **A — Implement** | Tiny CTS instance + `EXAMPLES.md` / `examples/` | Fidelity: H-tree, MMM, skew, buffers |
| **B — Browser lab** | Interactive lab on the learning platform | Concept literacy, quick visual feedback |

You can do **A only**, **B only**, or **both** (recommended: B for intuition when shipped, then A for fidelity).

**Prerequisite:** [learn_placement](../learn_placement/README.md) / [learn_sta](../learn_sta/README.md) literacy helps; CTS sits on the PD spine beside routing.

## Setup (Track A)

1. Open this course under `courses/learn_clock_tree/`.
2. Follow [docs/TWO_TRACKS.md](../docs/TWO_TRACKS.md) and each module’s [EXAMPLES.md](EXAMPLES.md).
3. Optional self-check from course root: `./scripts/module.sh SS-AA --check`.

## Setup (Track B)

1. Serve the platform: `python3 -m http.server 8080 --directory platform` (from monorepo root).
2. Open http://127.0.0.1:8080/tools/#clock-tree
3. Or use the live site: {LIVE_TOOLS}/

## How to move through modules

1. Read the module **README** (outcomes).
2. Pick a track (or both).
3. Check off **CHECKLIST.md**.
4. Optional: skim `outline.yaml` / `transcript.md` for upcoming slides & clips.

## Media

{media}

## Files

{files}
"""

    if m["kind"] == "wrap":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `wrap`

{nav}

## Outcomes

After this module you can: **{m['outcomes']}**

## Next courses

→ **learn_buffering** (see parent [`eda.md`](../../../eda.md))

## Media

{media}

## Files

{files}
"""

    # offline
    return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `offline`

{nav}

## Outcomes

After this module you can: **{m['outcomes']}**

## Track A

1. Load `../common/tiny_cts.json`.
2. Run `sequential_cts` for `mmm` and `h_tree` modes; compare skew.
3. Complete [CHECKLIST.md](CHECKLIST.md).

## Media

{media}

## Files

{files}
"""



def lab_transcript(m: dict) -> str:
    if m["kind"] != "lab":
        slides = [
            ("Hook", m.get("hook", m["title"])),
            ("The idea", m.get("idea", m["outcomes"])),
            ("What you will do", m["outcomes"]),
            ("Pitfalls", "Skipping goldens. Mixing browser and offline without matching JSON."),
            ("Your turn", "Complete the checklist."),
            ("Next", m.get("next", "Continue the course.")),
        ]
        parts = [
            f"# {m['title']}",
            "",
            f"**Module id:** {m['id']}",
            f"**Tracks:** A (implement)" + (" · B (browser lab)" if m.get("lab") else ""),
            "",
        ]
        for i, (t, body) in enumerate(slides, 1):
            parts.append(f"## Slide {i} — {t}")
            parts.append("")
            parts.append(body)
            parts.append("")
        return "\n".join(parts)

    parts = [
        f"# {m['title']}",
        "",
        f"**Module id:** {m['id']}",
        f"**Lab:** {m['lab']}",
        "**Tracks:** A (implement) · B (browser lab)",
        "",
        "## Slide 1 — " + m["title"].split("(")[0].strip(),
        "",
        m["hook"],
        "",
        "## Slide 2 — The idea",
        "",
        m["idea"],
        "",
        "<!-- algorithm-walkthrough -->",
        "",
    ]
    n = 3
    for title, img, caption in m["walk"]:
        parts.append(f"## Slide {n} — {title}")
        parts.append("")
        parts.append(f"![{title}](assets/steps/{img}.png)")
        parts.append("")
        parts.append(caption)
        parts.append("")
        n += 1
    parts.append("<!-- /algorithm-walkthrough -->")
    parts.append("")
    parts.append(f"## Slide {n} — Browser lab track")
    parts.append("")
    parts.append("![Browser lab starter](assets/lab-starter.png)")
    parts.append("")
    parts.append(m["browser"])
    parts.append("")
    n += 1
    parts.append(f"## Slide {n} — Implement track")
    parts.append("")
    parts.append(m["impl"])
    parts.append("")
    n += 1
    parts.append(f"## Slide {n} — Pitfalls")
    parts.append("")
    parts.append(m["pitfalls"])
    parts.append("")
    n += 1
    parts.append(f"## Slide {n} — Your turn")
    parts.append("")
    parts.append(m["next"])
    parts.append("")
    return "\n".join(parts)


def quiz(m: dict) -> str:
    lab = m.get("lab") or m["short"]
    items = [
        {
            "q": f"What is the main learning goal of {m['title']}?",
            "choices": [m["outcomes"][:80], "Ignore skew", "Only GCell routing", "Delete the clock source"],
            "answer": 0,
        },
        {
            "q": "On the toy chip, where is the clock source?",
            "choices": ["(6,4)", "(0,0)", "(12,8)", "(1,1)"],
            "answer": 0,
        },
        {
            "q": "Skew is defined as…",
            "choices": ["max latency − min latency", "sum of wire lengths", "number of buffers", "HPWL"],
            "answer": 0,
        },
    ]
    if lab:
        items.append(
            {
                "q": f"Primary browser lab id for this module?",
                "choices": [lab, "routing-grid", "gcell-grid", "affinity-metrics"],
                "answer": 0,
            }
        )
    items.append(
        {
            "q": "Natural next course after CTS on this spine?",
            "choices": ["learn_buffering", "learn_unix", "learn_git", "learn_clustering"],
            "answer": 0,
        }
    )
    return json.dumps({"module": m["id"], "items": items}, indent=2) + "\n"


def examples(m: dict) -> str:
    body = f"""# Examples — {m['title']}

## Try these

1. Load `../common/tiny_cts.json` (or `examples/tiny_cts.json`).
2. {m['outcomes']}
3. Compare browser lab `{m.get('lab') or '—'}` with Track A solvers.

"""
    if m.get("pseudo"):
        body += m["pseudo"] + "\n"
    elif m["kind"] == "lab":
        body += "## Pseudocode\n\n```text\nSee common/solvers.py for this algorithm.\n```\n"
    return body


def checklist(m: dict) -> str:
    lines = [
        f"# Checklist — {m['title']}",
        "",
        f"- [ ] I can explain: {m['outcomes']}",
    ]
    if m.get("lab"):
        lines.append(f"- [ ] I cleared challenges in `{m['lab']}`")
        lines.append("- [ ] I matched Track A solvers to the browser tree")
    lines.append("- [ ] I watched the module clip / read the transcript")
    return "\n".join(lines) + "\n"


def write_scripts() -> None:
    scripts = ROOT / "scripts"
    write(
        scripts / "build_all_media.sh",
        """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
SKILL="${ROOT}/.cursor/skills/module-slides/scripts"
source "${SKILL}/_require_unix.sh"
cd "$ROOT"
bash "${SKILL}/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_clock_tree
echo Done: "$COURSE_DIR"
""",
    )
    labs = " \\\n  ".join(m["id"] for m in MODULES if m.get("lab"))
    write(
        scripts / "capture_all_walkthroughs.sh",
        f"""#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in \\
  {labs}
do
  echo "=== $m ==="
  python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py \\
    "courses/learn_clock_tree/$m" --inject-transcript
done
echo CAPTURE_OK
""",
    )
    write(
        scripts / "capture_lab_snaps.sh",
        """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
SKILL=.cursor/skills/module-slides/scripts
for m in courses/learn_clock_tree/module*/; do
  base=$(basename "$m")
  case "$base" in
    module00-*|module05-*|module99-*) continue ;;
  esac
  echo "=== lab snap $base ==="
  python3 "$SKILL/capture_lab_snapshot.py" "$m" || true
done
python3 "$SKILL/capture_lab_snapshot.py" \\
  courses/learn_clock_tree/module00-00-intro --lab index --name tools-index.png || true
echo LAB_SNAPS_OK
""",
    )
    write(
        scripts / "smoke_walkthrough.py",
        """#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

ALGOS = [
    "clock-sinks", "latency-skew", "h-tree", "mmm-tree", "zero-skew-merge",
    "tapping-points", "clock-buffering", "skew-bound", "sequential-cts",
]

def main() -> int:
    errs: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.on("pageerror", lambda e: errs.append(str(e)))
        for algo in ALGOS:
            for step in range(1, 6):
                url = f"http://127.0.0.1:8080/tools/algorithm-walkthrough/?algo={algo}&step={step}"
                page.goto(url, wait_until="networkidle")
                page.wait_for_selector("#walk-frame[data-ready='1']", timeout=15_000)
                print(f"ok {algo} step {step}")
                if errs:
                    print("ERRORS", errs)
                    browser.close()
                    return 1
        browser.close()
    print("WALK_SMOKE_OK")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
""",
    )
    # copy helpers from learn_routing if present
    for name in ("fix_transcripts_lab_images.py", "merge_browser_slides.py", "fix_walkthrough_order.py"):
        src = ROOT.parent / "learn_routing" / "scripts" / name
        if src.is_file():
            text = src.read_text(encoding="utf-8").replace("learn_routing", "learn_clock_tree")
            # ROOT parents[1] in those scripts is course root — keep as-is relative
            write(scripts / name, text)


def main() -> None:
    write(ROOT / "README.md", course_readme())
    write(ROOT / "LICENSE", "CC BY 4.0\n")
    write(ROOT / "docs" / "MODULES.md", modules_md())
    write(
        ROOT / "docs" / "SCOPE.md",
        """# Scope

**In:** H-tree / MMM, latency & skew, zero-skew merge lite, tapping points, buffer insertion, skew bounds, sequential CTS on a 12×8 toy.

**Out:** Full industrial DME, multi-corner OCV, useful-skew optimization, Mesh clocks, Van Ginneken DP (see learn_buffering).
""",
    )
    write(
        ROOT / "docs" / "TWO_TRACKS.md",
        """# Two tracks

| Track | Path |
|-------|------|
| A | `common/tiny_cts.json`, `ctsutil.py`, `solvers.py`, `test_solvers.py` |
| B | `platform/tools/<lab-id>/` interactive labs + algorithm walkthrough |
""",
    )
    write(ROOT / "docs" / "WALKTHROUGHS.md", walkthroughs_md())

    tiny = (ROOT / "common" / "tiny_cts.json").read_text(encoding="utf-8") if (ROOT / "common" / "tiny_cts.json").is_file() else "{}\n"

    for m in MODULES:
        d = ROOT / m["id"]
        write(d / "README.md", lab_readme(m))
        write(d / "CHECKLIST.md", checklist(m))
        write(d / "EXAMPLES.md", examples(m))
        write(d / "transcript.md", lab_transcript(m))
        write(d / "outline.yaml", f"title: {m['short']}\nfooter: learn_clock_tree\nslides: []\n")
        write(d / "quiz.json", quiz(m))
        if m.get("lab"):
            write(d / "examples" / "tiny_cts.json", tiny)

    write_scripts()
    print(f"Scaffolded {len(MODULES)} modules under {ROOT}")


if __name__ == "__main__":
    main()
