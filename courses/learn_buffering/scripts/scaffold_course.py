#!/usr/bin/env python3
"""Scaffold learn_buffering (hierarchical SS-AA ids) with module-slides stubs."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE_TOOLS = "https://universal-verification-methodology.github.io/learning/tools"

MODULES = [
    {
        "id": "module00-00-intro",
        "kind": "intro",
        "title": "Welcome to buffer insertion for EDA",
        "short": "Welcome",
        "lab": None,
        "status": "—",
        "section": "00",
        "outcomes": "Explain why buffering restores slew and cuts delay on long nets after CTS or routing.",
        "algorithm": None,
        "hook": "Clock trees and signal nets grow long wires. Buffers break RC, restore slew, and trade area for timing.",
        "idea": "This course teaches wire R/C, slew budgets, candidate sites, Van Ginneken-style options, slew-driven insert, polarity, and fanout trees on a tiny D→S0→{S1,S2} net.",
    },
    {
        "id": "module01-01-wire-rc",
        "kind": "lab",
        "title": "Wire R/C model",
        "short": "Wire RC",
        "lab": "wire-rc",
        "status": "**ref**",
        "section": "01",
        "outcomes": "Compute lumped R and C from Manhattan length on each net edge.",
        "algorithm": "wire R/C from length (r_per_unit, c_per_unit)",
        "hook": "Every buffering decision starts from how much resistance and capacitance a wire segment carries.",
        "idea": "wire_rc of length L returns R equals L times r_per and C equals L times c_per. Elmore delay uses R times C_self over two plus C_load.",
        "walk": [
            ("Net topology", "01-net", "Driver D feeds S0; S0 fans to S1 and S2 on the 12×8 chip."),
            ("Edge e0 length", "02-e0", "D→S0 is four units Manhattan on the starter."),
            ("R and C", "03-rc", "With unit parasitics, length four yields R=4 and C=4."),
            ("Elmore", "04-elmore", "Delay ≈ R·(C/2 + Cload) on a lumped segment."),
            ("Why it matters", "05-why", "Longer edges dominate slew and delay — candidates appear next."),
        ],
        "browser": "Open **wire-rc**. Inspect edges e0–e2. Confirm length-four e0 maps to R=4, C=4 with unit parasitics.",
        "impl": "Call `wire_rc(length)` and `elmore_delay` in `common/`. Match GOLDENS.wireRcLen4R.",
        "pitfalls": "Using Euclidean length. Forgetting C_load in Elmore. Mixing per-unit R with total R.",
        "next": "Next: slew budgets on those RC segments.",
        "pseudo": """## Pseudocode

```text
Input: length L, r_per, c_per
R ← L × r_per;  C ← L × c_per
delay ← R × (C/2 + C_load)   # Elmore lumped
Output: {R, C, length}
Golden: L=4 → R=4, C=4 with unit parasitics
```
""",
    },
    {
        "id": "module01-03-slew-budget",
        "kind": "lab",
        "title": "Slew / transition budget",
        "short": "Slew budget",
        "lab": "slew-budget",
        "status": "**ref**",
        "section": "01",
        "outcomes": "Estimate transition time and check it against a slew limit.",
        "algorithm": "slew estimate k·R·C vs slew_limit",
        "hook": "Slew (transition) is what library cells require; long RC violates the budget.",
        "idea": "estimate_slew equals k times R times C_total with k about 2.2. slew_ok is true when slew is at most the limit—eight on the toy.",
        "walk": [
            ("Slew definition", "01-def", "Toy transition ≈ 2.2 · R · C_total on the segment."),
            ("Limit eight", "02-limit", "GOLDENS.slewLimit = 8 on tiny_buf."),
            ("Hot edge", "03-hot", "Long e0 with branch load can approach or exceed the limit."),
            ("Pass/fail", "04-ok", "slew_ok gates whether slew-driven insertion fires."),
            ("Toward insert", "05-next", "Failing edges get buffer candidates in later labs."),
        ],
        "browser": "Open **slew-budget**. Read edge slews vs limit eight. Stretch a sink to worsen e1 slew.",
        "impl": "Call `estimate_slew` and `slew_ok` in solvers. Assert limit from tiny_buf.json.",
        "pitfalls": "Using delay as slew. Ignoring C_load. Hard-coding pass without measuring.",
        "next": "Next: place candidate buffer sites along edges.",
        "pseudo": """## Pseudocode

```text
slew ← k × R × (C_wire + C_load)
return slew ≤ slew_limit
Golden: slew_limit=8 on tiny_buf
```
""",
    },
    {
        "id": "module02-01-candidate-sites",
        "kind": "lab",
        "title": "Buffer candidate sites",
        "short": "Candidates",
        "lab": "candidate-sites",
        "status": "**ref**",
        "section": "02",
        "outcomes": "Enumerate candidate buffer locations every step units along each edge.",
        "algorithm": "candidate site enumeration on net edges",
        "hook": "Van Ginneken and slew-driven flows only insert where candidates exist.",
        "idea": "Walk each edge; every candidate_step units place a site excluding endpoints. Gray dots mark legal insert points.",
        "walk": [
            ("Step size", "01-step", "candidate_step = 2 on the toy."),
            ("Show sites", "02-show", "Show candidates paints gray dots on e0–e2."),
            ("Count", "03-count", "Longer edges yield more sites."),
            ("Exclude ends", "04-ends", "Driver and sink pins are not candidates."),
            ("Ready for DP", "05-dp", "Sites feed Van Ginneken options next."),
        ],
        "browser": "Open **candidate-sites**. Click Show candidates. Count gray dots on e0.",
        "impl": "Call `candidate_sites(data)`. Assert length > 0 for tiny_buf.",
        "pitfalls": "Placing sites past the far endpoint. Using step zero. Forgetting diagonal HV walk.",
        "next": "Next: the buffer library cells you can instantiate.",
        "pseudo": """## Pseudocode

```text
for each edge (a→b):
  for dist = step, 2·step, … < length(a,b):
    place site at fraction dist/length along edge
Output: sites[{id,edge,x,y}]
Golden: step=2 yields ≥1 site on tiny_buf
```
""",
    },
    {
        "id": "module02-03-buffer-library",
        "kind": "lab",
        "title": "Buffer library options",
        "short": "Library",
        "lab": "buffer-library",
        "status": "**ref**",
        "section": "02",
        "outcomes": "Read cin, rout, intrinsic delay, and invert flag for BUF/INV cells.",
        "algorithm": "buffer library characterization lite",
        "hook": "Stronger buffers cost input cap but drive with lower resistance.",
        "idea": "BUF_X1, BUF_X2, INV_X1 each publish cin, rout, delay, invert. Van Ginneken tries each non-inverting cell unless polarity mode allows INV.",
        "walk": [
            ("Three cells", "01-three", "Library has BUF_X1, BUF_X2, INV_X1."),
            ("BUF_X2 stronger", "02-x2", "BUF_X2: higher cin, lower rout, slightly less intrinsic delay."),
            ("Inverter", "03-inv", "INV_X1 flips polarity — used in polarity labs."),
            ("Pick for DP", "04-pick", "VG options reference library ids on buffered solutions."),
            ("Area trade", "05-area", "Real flows also score area; this toy scores delay/slew only."),
        ],
        "browser": "Open **buffer-library**. Confirm three cells. Run Van Ginneken and see which buf ids appear.",
        "impl": "Print `data['buffer_library']`. Assert GOLDENS.libCount == 3.",
        "pitfalls": "Ignoring invert flag. Treating rout as delay. Using cells not in the library.",
        "next": "Next: Van Ginneken dynamic programming lite.",
        "pseudo": """## Pseudocode

```text
Library cell: {id, cin, rout, delay, invert}
VG tries each non-invert cell at mid-edge (toy)
Golden: 3 cells on tiny_buf
```
""",
    },
    {
        "id": "module02-05-van-ginneken",
        "kind": "lab",
        "title": "Van Ginneken DP lite",
        "short": "Van Ginneken",
        "lab": "van-ginneken",
        "status": "**ref**",
        "section": "02",
        "outcomes": "Generate (cap, delay) options, prune dominated, pick best buffer/wire choice.",
        "algorithm": "Van Ginneken-style option generation and dominance prune",
        "hook": "Van Ginneken is the classic DP for buffer insertion on trees.",
        "idea": "For each edge build wire-only and mid-buffer options as (c,d) pairs. dominate_prune keeps non-dominated fronts. Pick minimum delay. Sum along the toy tree.",
        "walk": [
            ("Options", "01-opts", "Wire-only plus one option per library buffer at mid."),
            ("Prune", "02-prune", "Drop pairs with worse cap and worse delay."),
            ("Best edge", "03-best", "Each edge keeps its min-delay survivor."),
            ("Net delay", "04-net", "Toy total ≈ e0 best + max(e1,e2) best."),
            ("Improved", "05-win", "Buffered solution should beat or match wire-only delay."),
        ],
        "browser": "Open **van-ginneken**. Click Van Ginneken. Confirm improved delay vs wire and orange buffers where chosen.",
        "impl": "Call `van_ginneken_net(data)`. Assert best_delay ≤ wire_delay.",
        "pitfalls": "Keeping dominated options. Double-counting branch loads. Forgetting wire-only option.",
        "next": "Next: slew-driven greedy insertion.",
        "pseudo": """## Pseudocode

```text
options ← [wire_only(c,d)]
for buf in library:
  options += mid_buffer_option(buf)
pruned ← dominate_prune(options)  # rising c, keep falling d
best ← argmin delay in pruned
Golden: best_delay ≤ wire_delay on tiny_buf
```
""",
    },
    {
        "id": "module02-07-slew-driven",
        "kind": "lab",
        "title": "Slew-driven insertion",
        "short": "Slew-driven",
        "lab": "slew-driven",
        "status": "**ref**",
        "section": "02",
        "outcomes": "Greedily insert buffers on edges whose estimated slew exceeds the limit.",
        "algorithm": "slew-driven greedy buffer insertion",
        "hook": "When DP is heavy, a slew check plus mid-edge buffer is a fast practical heuristic.",
        "idea": "For each edge compute slew; if above limit, insert BUF_X1 at the midpoint. Lowering the limit forces more insertions.",
        "walk": [
            ("Check slew", "01-check", "Compare estimate_slew to slew_limit."),
            ("Tight limit", "02-tight", "Limit 1 forces inserts on the toy."),
            ("Mid buffer", "03-mid", "Insertion sits at edge midpoint."),
            ("Count", "04-count", "Challenges score insertion count."),
            ("vs VG", "05-vs", "Slew-driven is local; VG optimizes delay options."),
        ],
        "browser": "Open **slew-driven**. Click Slew-driven. With default limit, note count; mentally compare to Van Ginneken.",
        "impl": "Call `slew_driven_insert` with slew_limit=1; assert count ≥ 1.",
        "pitfalls": "Inserting without measuring slew. Stacking infinite buffers. Ignoring branch load.",
        "next": "Next: polarity and inverters.",
        "pseudo": """## Pseudocode

```text
for each edge e:
  if estimate_slew(e) > limit:
    insert BUF_X1 at midpoint(e)
Output: insertions[]
Golden: limit=1 → count ≥ 1 on tiny_buf
```
""",
    },
    {
        "id": "module03-01-polarity-invert",
        "kind": "lab",
        "title": "Polarity / inverter pairs",
        "short": "Polarity",
        "lab": "polarity-invert",
        "status": "**ref**",
        "section": "03",
        "outcomes": "Track polarity flips from INV cells and restore positive sense when required.",
        "algorithm": "polarity tracking with inverters",
        "hook": "Inverters are useful buffers but flip the signal; odd counts need a fix.",
        "idea": "Each INV_X1 flips polarity. polarity_fix reports flips and whether the path is still positive.",
        "walk": [
            ("Invert flag", "01-flag", "INV_X1 has invert=true in the library."),
            ("One flip", "02-one", "A single INV yields negative polarity."),
            ("Two flips", "03-two", "Two INVs restore positive sense."),
            ("Mix with BUF", "04-mix", "BUF cells do not flip."),
            ("Design rule", "05-rule", "Useful-skew flows may allow phase; this toy tracks parity."),
        ],
        "browser": "Open **polarity-invert**. Place an INV on a path mentally; Check polarity challenges.",
        "impl": "Call `polarity_fix([INV],[BUF])`. Assert flips and positive flags.",
        "pitfalls": "Counting BUF as invert. Forgetting parity. Using INV in VG when allow_invert is false.",
        "next": "Next: fanout buffering at the junction.",
        "pseudo": """## Pseudocode

```text
flips ← count of cells with invert=true on path
positive ← (flips mod 2 == 0)
Golden: [INV_X1] → flips=1, positive=false
```
""",
    },
    {
        "id": "module03-03-fanout-tree",
        "kind": "lab",
        "title": "Fanout buffer tree",
        "short": "Fanout",
        "lab": "fanout-tree",
        "status": "**ref**",
        "section": "03",
        "outcomes": "Insert a junction buffer when sink fanout exceeds a max_fanout limit.",
        "algorithm": "fanout buffering at Steiner/junction",
        "hook": "One driver cannot feed too many sinks without a buffer tree stage.",
        "idea": "If sink count exceeds max_fanout (two on the toy), insert BUF_X2 at S0. Three sinks therefore force an insert.",
        "walk": [
            ("Fanout three", "01-fo", "Tiny net has three sinks."),
            ("Max two", "02-max", "max_fanout=2 → must insert."),
            ("At S0", "03-s0", "Junction buffer sits on S0."),
            ("BUF_X2", "04-x2", "Stronger cell for the fork."),
            ("Compose", "05-compose", "Sequential pass can combine VG + fanout."),
        ],
        "browser": "Open **fanout-tree**. Click Fanout buffer. Confirm a buffer appears at S0.",
        "impl": "Call `fanout_buffer_tree(data, max_fanout=2)`. Assert inserted is true.",
        "pitfalls": "Buffering at the driver only. Using max_fanout ≥ sink count. Forgetting S0 coordinates.",
        "next": "Next: full sequential buffering pass.",
        "pseudo": """## Pseudocode

```text
if |sinks| > max_fanout:
  insert BUF_X2 at junction (S0)
Output: buffers, inserted flag
Golden: 3 sinks, max_fanout=2 → inserted
```
""",
    },
    {
        "id": "module04-01-sequential-buffer",
        "kind": "lab",
        "title": "Sequential buffering pass",
        "short": "Sequential",
        "lab": "sequential-buffer",
        "status": "**ref**",
        "section": "04",
        "outcomes": "Run a full pass: candidates + Van Ginneken (or slew) + optional fanout fix.",
        "algorithm": "sequential buffering pipeline",
        "hook": "Production flows chain heuristics; this lab is the toy pipeline.",
        "idea": "sequential_buffer builds sites, runs Van Ginneken, optionally adds fanout buffers, and reports primary metrics.",
        "walk": [
            ("Pipeline", "01-pipe", "Sites → VG/slew → fanout compose."),
            ("Run pass", "02-run", "Sequential pass paints buffers and sites."),
            ("Metrics", "03-met", "Read VG delay vs wire delay."),
            ("Mode slew", "04-slew", "Alternate primary mode is slew-driven."),
            ("Handoff", "05-done", "Next deepen timing/signoff courses."),
        ],
        "browser": "Open **sequential-buffer**. Click Sequential pass. Confirm buffers and improved VG delay.",
        "impl": "Call `sequential_buffer(data)`. Assert sites and van_ginneken keys exist.",
        "pitfalls": "Skipping prune. Mixing modes without clearing buffers. Ignoring fanout stage.",
        "next": "Next: offline compare, then wrap.",
        "pseudo": """## Pseudocode

```text
sites ← candidate_sites(data)
vg ← van_ginneken_net(data)
fan ← fanout_buffer_tree(data)
return {sites, vg, fan, primary}
Golden: improved VG delay on tiny_buf
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
        "outcomes": "Compare wire-only, Van Ginneken, and slew-driven delays offline on tiny_buf.",
        "algorithm": None,
        "hook": "Without the browser, Track A still prints VG vs wire vs slew insert counts.",
        "idea": "Load tiny_buf.json, run sequential_buffer for van_ginneken and slew modes, print delays and insertion counts.",
    },
    {
        "id": "module99-00-wrap",
        "kind": "wrap",
        "title": "Buffering path complete",
        "short": "Wrap",
        "lab": None,
        "status": "—",
        "section": "99",
        "outcomes": "Recap RC, slew, candidates, VG, slew-driven, polarity, fanout; choose next PD/signoff course.",
        "algorithm": None,
        "hook": "You inserted buffers with both DP options and slew heuristics on the same toy net.",
        "idea": "Wire RC, slew budgets, candidates, library, Van Ginneken, slew-driven, polarity, fanout, sequential pass. Natural next: learn_signoff literacy or deepen STA.",
    },
]


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def course_readme() -> str:
    rows = "\n".join(
        f"| `{m['id'].replace('module', '')}` | [{m['title']}]({m['id']}/README.md) | `{m['kind']}` |"
        for m in MODULES
    )
    labs = "\n".join(f"- [{m['lab']}]({LIVE_TOOLS}/{m['lab']}/)" for m in MODULES if m.get("lab"))
    return f"""# learn_buffering

[![GitHub](https://img.shields.io/badge/github-learning-monorepo-blank)](https://github.com/universal-verification-methodology)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Parent](https://img.shields.io/badge/parent-eda__learning-informational)](../../README.md)
[![Labs](https://img.shields.io/badge/labs-platform%20tools-success)]({LIVE_TOOLS}/)
[![Domain](https://img.shields.io/badge/domain-buffering-orange)](docs/MODULES.md)

**learn_buffering** is the open learning path for *Van Ginneken-style and slew-driven buffer insertion* on a tiny routed net.

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
learn_buffering/
├── README.md · LICENSE
├── common/         # tiny_buf.json, solvers, tests
├── docs/           # MODULES, SCOPE, TWO_TRACKS, WALKTHROUGHS
├── scripts/
└── moduleSS-AA-slug/
```

## Browse or clone

```bash
cd courses/learn_buffering
```

## Consume from the parent

Prereq: [learn_clock_tree](../learn_clock_tree/README.md).  
Next: [learn_signoff](../learn_signoff/README.md) or deepen [learn_sta](../learn_sta/README.md).  
Lane map: [`eda.md`](../../eda.md).

## Author: publish or update

```bash
python3 courses/learn_buffering/scripts/scaffold_course.py
bash courses/learn_buffering/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_buffering
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py \\
  courses/learn_buffering --modules
```

## Two learning tracks

| Track | Where | Doc |
|-------|-------|-----|
| **A — Implement** | `common/` | [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
| **B — Browser lab** | platform tools | [TWO_TRACKS.md](docs/TWO_TRACKS.md) |

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

| Key | Module | Kind |
|-----|--------|------|
{rows}

## Browser labs

{labs}

## License

[CC BY 4.0](LICENSE) unless noted.
"""


def modules_md() -> str:
    lines = [
        "# learn_buffering — module index",
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
    rows = "\n".join(f"| `{m['lab']}` | `{m['id']}` | 5 |" for m in labs)
    return f"""# Walkthroughs

| Lab id | Module | Steps |
|--------|--------|-------|
{rows}

```bash
bash courses/learn_buffering/scripts/capture_all_walkthroughs.sh
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
├── README.md · CHECKLIST.md · EXAMPLES.md
├── outline.yaml · transcript.md · quiz.json
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

1. Open [EXAMPLES.md](EXAMPLES.md) and implement **{algo}** on `examples/tiny_buf.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `./scripts/module.sh {key} --check`

### Track B — Browser lab (online)

1. Local: [http://127.0.0.1:8080/tools/{m['lab']}/](http://127.0.0.1:8080/tools/{m['lab']}/)
2. Live: [{LIVE_TOOLS}/{m['lab']}/]({LIVE_TOOLS}/{m['lab']}/)
3. Load the starter buffering net, run the tool, Check challenges.

> Concept labs teach buffering literacy — not production timing closure.

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

**learn_buffering** teaches *Van Ginneken-style and slew-driven buffer insertion* with two tracks:

| Track | Where | Best for |
|-------|-------|----------|
| **A — Implement** | `common/` + EXAMPLES | Fidelity |
| **B — Browser lab** | platform tools | Visual intuition |

**Prerequisite:** [learn_clock_tree](../learn_clock_tree/README.md).

## Setup (Track A)

1. Open `courses/learn_buffering/`.
2. Follow [docs/TWO_TRACKS.md](../docs/TWO_TRACKS.md).

## Setup (Track B)

1. `python3 -m http.server 8080 --directory platform`
2. Open http://127.0.0.1:8080/tools/#buffering

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

→ **learn_signoff** or deepen **learn_sta** (see [`eda.md`](../../../eda.md))

## Media

{media}

## Files

{files}
"""
    return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `offline`

{nav}

## Outcomes

After this module you can: **{m['outcomes']}**

## Track A

1. Load `../common/tiny_buf.json`.
2. Compare `van_ginneken_net` vs `slew_driven_insert`.
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
            ("Next", "Continue the course."),
        ]
        parts = [f"# {m['title']}", "", f"**Module id:** {m['id']}", "**Tracks:** A (implement)", ""]
        for i, (t, body) in enumerate(slides, 1):
            parts += [f"## Slide {i} — {t}", "", body, ""]
        return "\n".join(parts)

    parts = [
        f"# {m['title']}",
        "",
        f"**Module id:** {m['id']}",
        f"**Lab:** {m['lab']}",
        "**Tracks:** A (implement) · B (browser lab)",
        "",
        f"## Slide 1 — {m['short']}",
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
        parts += [f"## Slide {n} — {title}", "", f"![{title}](assets/steps/{img}.png)", "", caption, ""]
        n += 1
    parts += [
        "<!-- /algorithm-walkthrough -->",
        "",
        f"## Slide {n} — Browser lab track",
        "",
        "![Browser lab starter](assets/lab-starter.png)",
        "",
        m["browser"],
        "",
    ]
    n += 1
    parts += [f"## Slide {n} — Implement track", "", m["impl"], ""]
    n += 1
    parts += [f"## Slide {n} — Pitfalls", "", m["pitfalls"], ""]
    n += 1
    parts += [f"## Slide {n} — Your turn", "", m["next"], ""]
    return "\n".join(parts)


def quiz(m: dict) -> str:
    lab = m.get("lab") or m["short"]
    items = [
        {
            "q": f"Main goal of {m['title']}?",
            "choices": [m["outcomes"][:90], "Ignore RC", "Delete sinks", "Only CTS H-trees"],
            "answer": 0,
        },
        {
            "q": "Toy net topology?",
            "choices": ["D → S0 → {S1,S2}", "Only two pins", "Mesh clock", "No driver"],
            "answer": 0,
        },
        {
            "q": "Van Ginneken options are pairs of…",
            "choices": ["(cap, delay)", "(x, y)", "(R only)", "(fanout, area only)"],
            "answer": 0,
        },
    ]
    if lab and m.get("lab"):
        items.append(
            {
                "q": "Primary browser lab id?",
                "choices": [lab, "h-tree", "lee-maze", "routing-grid"],
                "answer": 0,
            }
        )
    items.append(
        {
            "q": "Prereq course on this spine?",
            "choices": ["learn_clock_tree", "learn_unix", "learn_git", "learn_clustering"],
            "answer": 0,
        }
    )
    return json.dumps({"module": m["id"], "items": items}, indent=2) + "\n"


def examples(m: dict) -> str:
    body = f"""# Examples — {m['title']}

## Try these

1. Load `../common/tiny_buf.json`.
2. {m['outcomes']}
3. Compare browser lab `{m.get('lab') or '—'}` with Track A.

"""
    if m.get("pseudo"):
        body += m["pseudo"] + "\n"
    elif m["kind"] == "lab":
        body += "## Pseudocode\n\n```text\nSee common/solvers.py\n```\n"
    return body


def checklist(m: dict) -> str:
    lines = [f"# Checklist — {m['title']}", "", f"- [ ] I can explain: {m['outcomes']}"]
    if m.get("lab"):
        lines += [f"- [ ] I cleared challenges in `{m['lab']}`", "- [ ] Track A solvers match the browser"]
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
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_buffering
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
    "courses/learn_buffering/$m" --inject-transcript
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
for m in courses/learn_buffering/module*/; do
  base=$(basename "$m")
  case "$base" in
    module00-*|module05-*|module99-*) continue ;;
  esac
  echo "=== lab snap $base ==="
  python3 "$SKILL/capture_lab_snapshot.py" "$m" || true
done
echo LAB_SNAPS_OK
""",
    )
    write(
        scripts / "smoke_walkthrough.py",
        """#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

ALGOS = [
    "wire-rc", "slew-budget", "candidate-sites", "buffer-library", "van-ginneken",
    "slew-driven", "polarity-invert", "fanout-tree", "sequential-buffer",
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
    write(
        scripts / "module.sh",
        """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
KEY="${1:-}"
shift || true
[[ -z "$KEY" || "$KEY" == "--help" ]] && { echo "Usage: $0 SS-AA [--check]"; exit 0; }
MOD_DIR="$(find "$ROOT" -maxdepth 1 -type d -name "module${KEY}-*" | head -1)"
[[ -z "$MOD_DIR" ]] && { echo "No module"; exit 1; }
echo "Module $KEY self-check"
python3 -c "import sys; sys.path.insert(0,'$ROOT/common'); from solvers import sequential_buffer; from bufutil import load; print(sequential_buffer(load('$ROOT/common/tiny_buf.json'))['van_ginneken']['best_delay'])"
""",
    )


def main() -> None:
    write(ROOT / "README.md", course_readme())
    write(ROOT / "LICENSE", "CC BY 4.0\n")
    write(ROOT / "docs" / "MODULES.md", modules_md())
    write(
        ROOT / "docs" / "SCOPE.md",
        """# Scope

**In:** Wire RC, slew budgets, candidate sites, buffer library, Van Ginneken lite, slew-driven insert, polarity, fanout trees, sequential pass.

**Out:** Full industrial VG on huge trees, useful-skew optimization, multi-corner OCV, layer assignment.
""",
    )
    write(
        ROOT / "docs" / "TWO_TRACKS.md",
        """# Two tracks

| Track | Path |
|-------|------|
| A | `common/tiny_buf.json`, `bufutil.py`, `solvers.py` |
| B | `platform/tools/<lab-id>/` + algorithm walkthrough |
""",
    )
    write(ROOT / "docs" / "WALKTHROUGHS.md", walkthroughs_md())
    tiny = (ROOT / "common" / "tiny_buf.json").read_text(encoding="utf-8")
    for m in MODULES:
        d = ROOT / m["id"]
        write(d / "README.md", lab_readme(m))
        write(d / "CHECKLIST.md", checklist(m))
        write(d / "EXAMPLES.md", examples(m))
        write(d / "transcript.md", lab_transcript(m))
        write(d / "outline.yaml", f"title: {m['short']}\nfooter: learn_buffering\nslides: []\n")
        write(d / "quiz.json", quiz(m))
        if m.get("lab"):
            write(d / "examples" / "tiny_buf.json", tiny)
    write_scripts()
    print(f"Scaffolded {len(MODULES)} modules under {ROOT}")


if __name__ == "__main__":
    main()
