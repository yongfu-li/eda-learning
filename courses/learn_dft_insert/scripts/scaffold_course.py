#!/usr/bin/env python3
"""Scaffold learn_dft_insert with module-slides stubs. Lab status **ref**."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_dft_insert"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to DFT insert", "Welcome", None,
     "Explain scan flop replacement, chain stitch, lockup latches, and DFT markers on tiny_dft after power literacy.",
     None,
     "After power you need DFT — scan cells, SE/SI/SO, stitch order, lockups, markers.",
     "Toy tiny_dft: 4 SDFF cells, stitch_count=3, lockup f3→f4, 6 transform edges, 1 marker."),
    ("module01-01-scan-flops", "lab", "Scan flops", "Why scan flops", "scan-flops",
     "Identify SDFF scan cells; count scan_cell_count=4.",
     "scan flop identification",
     "Every flop becomes a scan SDFF in this full-scan toy.",
     "GOLDEN: scan_cell_count=4.",
     [("SDFF cells", "01-sdff", "Each flop becomes a scan SDFF cell."),
      ("f1", "02-f1", "f1: domain d0, clk=clk."),
      ("f2", "03-f2", "f2: Q→n2 feeds f3."),
      ("f3", "04-f3", "f3: last flop in d0."),
      ("Golden", "05-golden", "GOLDEN: scan_cell_count=4.")],
     "Open **scan-flops**. Inspect tiny_dft; confirm 4 SDFF cells.",
     "Call identify_scan_flops(); assert count==4.",
     "Counting only functional flops. Missing SE hook.",
     "Next: scan enable ports.",
     "cells ← flops as SDFF; count ← len(cells)",
     [{"q": "scan cell count?", "choices": ["4", "3", "6", "1"], "answer": 0},
      {"q": "cell type?", "choices": ["SDFF", "DFF", "latch", "mux"], "answer": 0},
      {"q": "flop count?", "choices": ["4", "3", "2", "6"], "answer": 0}]),
    ("module01-03-scan-enable", "lab", "Scan enable", "Why scan enable", "scan-enable",
     "Read SE/SI/SO ports: si=scan_in, so=scan_out, se=scan_enable.",
     "scan enable port extraction",
     "Scan enable muxes functional vs scan data; SI/SO bookend the chain.",
     "GOLDEN: se=scan_enable, si=scan_in, so=scan_out.",
     [("SE port", "01-se", "scan_enable drives mux select on all SDFFs."),
      ("SI port", "02-si", "scan_in hooks first cell in chain."),
      ("SO port", "03-so", "scan_out hooks last cell Q."),
      ("Port names", "04-ports", "si=scan_in, so=scan_out, se=scan_enable."),
      ("Golden", "05-golden", "GOLDEN: se=scan_enable, si=scan_in, so=scan_out.")],
     "Open **scan-enable**. Confirm the three port names.",
     "Call scan_enable_port(); assert se/si/so match goldens.",
     "Confusing SI with functional D. Wrong port order.",
     "Next: chain stitch.",
     "ports ← {se, si, so} from design",
     [{"q": "se port?", "choices": ["scan_enable", "scan_in", "scan_out", "clk"], "answer": 0},
      {"q": "si port?", "choices": ["scan_in", "scan_out", "scan_enable", "n_a"], "answer": 0},
      {"q": "so port?", "choices": ["scan_out", "scan_in", "n4", "scan_enable"], "answer": 0}]),
    ("module02-01-chain-stitch", "lab", "Chain stitch", "Why stitch", "chain-stitch",
     "Stitch Q→SI between consecutive flops; stitch_count=3.",
     "scan chain stitch",
     "Chain stitch wires Q of previous flop to SI of next in scan_order.",
     "GOLDEN: stitch_count=3.",
     [("Stitch rule", "01-rule", "Q of previous flop → SI of next in scan_order."),
      ("f1→f2", "02-s12", "Stitch f1 Q to f2 SI."),
      ("f2→f3", "03-s23", "Stitch f2 Q to f3 SI."),
      ("f3→f4", "04-s34", "Stitch f3 Q to f4 SI (crosses domain)."),
      ("Golden", "05-golden", "GOLDEN: stitch_count=3.")],
     "Open **chain-stitch**. Confirm 3 stitches f1→f2→f3→f4.",
     "Call stitch_chain(); assert stitch_count==3.",
     "Counting SI/SO hooks as stitches. Wrong order.",
     "Next: scan order check.",
     "stitches ← zip(scan_order); count ← len(stitches)",
     [{"q": "stitch count?", "choices": ["3", "4", "6", "1"], "answer": 0},
      {"q": "first stitch?", "choices": ["f1→f2", "f2→f3", "SI→f1", "f3→f4"], "answer": 0},
      {"q": "last stitch?", "choices": ["f3→f4", "f1→f2", "f4→SO", "f2→f3"], "answer": 0}]),
    ("module02-03-scan-order", "lab", "Scan order", "Why order", "scan-order",
     "Verify scan_order covers all flops; chain_length=4.",
     "scan order validation",
     "Scan order must include every flop exactly once.",
     "GOLDEN: order f1→f2→f3→f4; covers_all=true.",
     [("Order list", "01-list", "scan_order defines chain sequence left→right."),
      ("First f1", "02-f1", "Chain starts at f1."),
      ("Middle f2 f3", "03-mid", "f2 and f3 in domain d0."),
      ("Tail f4", "04-tail", "Chain ends at f4 in d1."),
      ("Golden", "05-golden", "GOLDEN: chain_length=4, covers_all=true.")],
     "Open **scan-order**. Confirm length=4 and covers all flops.",
     "Call scan_order_check(); assert length==4 and covers_all.",
     "Duplicate flop in order. Missing f4.",
     "Next: lockup latch.",
     "order ← scan_order; covers_all ← set(order)==flop_ids",
     [{"q": "chain length?", "choices": ["4", "3", "6", "2"], "answer": 0},
      {"q": "covers all?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "scan order head?", "choices": ["f1", "f2", "f4", "si"], "answer": 0}]),
    ("module03-01-lockup-latch", "lab", "Lockup latch", "Why lockup", "lockup-latch",
     "Insert lockup on d0→d1 crossing; lockup_count=1 between f3→f4.",
     "lockup latch detection",
     "Lockup latches bridge clock domains on scan path.",
     "GOLDEN: lockup_count=1 on f3→f4 (d0→d1).",
     [("Domain crossing", "01-cross", "lockup_between d0 and d1 requires lockup."),
      ("f3→f4 pair", "02-pair", "Consecutive flops f3 (d0) and f4 (d1)."),
      ("Lockup cell", "03-cell", "Insert lockup_f3_f4 between domains."),
      ("Clock domains", "04-clk", "f4 uses clk2; f1–f3 use clk."),
      ("Golden", "05-golden", "GOLDEN: lockup_count=1 on f3→f4.")],
     "Open **lockup-latch**. Confirm one lockup between f3 and f4.",
     "Call find_lockups(); assert count==1 and from f3 to f4.",
     "Lockup on same domain. Missing clk2 crossing.",
     "Next: netlist transform.",
     "lockup ← domain_crossing in scan_order pairs",
     [{"q": "lockup count?", "choices": ["1", "3", "0", "4"], "answer": 0},
      {"q": "lockup pair?", "choices": ["f3→f4", "f1→f2", "f2→f3", "SI→f1"], "answer": 0},
      {"q": "domains crossed?", "choices": ["d0→d1", "d1→d0", "d0→d0", "d1→d1"], "answer": 0}]),
    ("module03-03-netlist-transform", "lab", "Netlist transform", "Why transform", "netlist-transform",
     "Apply DFT insert: cells + stitch + SI/SO + lockup; edge_count=6.",
     "netlist transform edges",
     "DFT insert adds scan wiring edges to the netlist.",
     "GOLDEN: transform_edge_count=6 (SI + 3 stitches + SO + 1 lockup).",
     [("SI edge", "01-si", "SI→f1 hook edge."),
      ("Stitch edges", "02-st", "Three flop-to-flop stitch edges."),
      ("SO edge", "03-so", "f4→SO hook edge."),
      ("Lockup edge", "04-lk", "One lockup edge on d0→d1 crossing."),
      ("Golden", "05-golden", "GOLDEN: transform_edge_count=6.")],
     "Open **netlist-transform**. Confirm 6 transform edges.",
     "Call netlist_transform(); assert edge_count==6.",
     "Double-counting stitches. Forgetting lockup edge.",
     "Next: DFT markers.",
     "edges ← SI + stitches + SO + lockups",
     [{"q": "edge count?", "choices": ["6", "3", "4", "1"], "answer": 0},
      {"q": "stitch edges?", "choices": ["3", "6", "1", "4"], "answer": 0},
      {"q": "includes lockup?", "choices": ["yes", "no", "only SI", "only SO"], "answer": 0}]),
    ("module04-01-dft-markers", "lab", "DFT markers", "Why markers", "dft-markers",
     "Collect lockup markers; marker_count=1.",
     "DFT marker collection",
     "Signoff DFT emits markers for required lockups on domain crossings.",
     "GOLDEN: marker_count=1.",
     [("Lockup marker", "01-kind", "kind=lockup on domain crossings."),
      ("d0→d1 hit", "02-cross", "Marker on f3→f4 crossing."),
      ("Collect", "03-collect", "Union lockup hits for signoff."),
      ("Report", "04-report", "One marker required for this toy."),
      ("Golden", "05-golden", "GOLDEN: marker_count=1.")],
     "Open **dft-markers**. Run collect; confirm 1 marker.",
     "Call collect_markers(); assert count==1.",
     "Counting stitches as markers. Missing domain cross.",
     "Next: scan chain view.",
     "markers ← lockup hits on domain crossings",
     [{"q": "marker count?", "choices": ["1", "3", "4", "0"], "answer": 0},
      {"q": "marker kind?", "choices": ["lockup", "stitch", "ir_drop", "em"], "answer": 0},
      {"q": "marker on?", "choices": ["f3→f4", "f1→f2", "SI→f1", "f2→f3"], "answer": 0}]),
    ("module04-03-scan-chain-view", "lab", "Scan chain view", "Chain view", "scan-chain-view",
     "Visualize full scan chain SI→f1→f2→f3→f4→SO with lockup highlight.",
     "scan chain visualization",
     "Browser view stitches chain, ports, and lockup for sanity check.",
     "GOLDEN: f1→f2→f3→f4; lockup between f3→f4.",
     [("Draw chain", "01-draw", "Visualize full scan path SI→f1→…→f4→SO."),
      ("Stitch lines", "02-stitches", "Three stitch edges between flops."),
      ("Lockup highlight", "03-lockup", "Lockup dashed between f3 and f4."),
      ("SE label", "04-se", "scan_enable shown above chain."),
      ("Golden", "05-golden", "GOLDEN: f1→f2→f3→f4 with lockup f3→f4.")],
     "Open **scan-chain-view**. Confirm full chain + lockup drawing.",
     "Reuse stitch + lockup + transform; drawDft shows chain.",
     "Drawing functional D paths instead of scan. Hiding lockup.",
     "Next: DFT engine.",
     "draw: flops in scan_order; highlight lockup f3→f4",
     [{"q": "chain order?", "choices": ["f1→f2→f3→f4", "f4→f3→f2→f1", "f1→f3→f2→f4", "f2→f1→f4→f3"], "answer": 0},
      {"q": "lockup between?", "choices": ["f3→f4", "f1→f2", "f2→f3", "SI→f1"], "answer": 0},
      {"q": "SI port name?", "choices": ["scan_in", "scan_out", "scan_enable", "n_a"], "answer": 0}]),
    ("module05-01-dft-engine", "lab", "DFT engine integration", "Engine", "dft-engine",
     "Run dft_engine; confirm all goldens and ok=True.",
     "DFT engine integration",
     "A tiny engine chains scan cells, stitch, lockup, transform, and markers.",
     "GOLDEN: scan cells=4, stitches=3, lockups=1, edges=6, markers=1, ok=True.",
     [("Stats snapshot", "01-stats", "4 flops, 2 domains, 3 ports."),
      ("Scan cells", "02-cells", "4 SDFF cells identified."),
      ("Chain check", "03-chain", "stitch_count=3, chain_length=4."),
      ("Lockup check", "04-lockup", "lockup_count=1, edges=6."),
      ("OK", "05-ok", "GOLDEN: engine ok=True.")],
     "Open **dft-engine**. Run engine; confirm ok.",
     "Call dft_engine(); assert ok and markers.count==1.",
     "Reporting partial checks. Changing toy without updating goldens.",
     "Next: offline compare, then wrap.",
     "engine: cells + stitch + lockup + transform → markers; ok ← counts match GOLDENS",
     [{"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "marker_count?", "choices": ["1", "3", "4", "0"], "answer": 0},
      {"q": "stitch_count?", "choices": ["3", "4", "6", "1"], "answer": 0}]),
    ("module05-03-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline compare", None,
     "Print dft_compare metrics offline without the browser.", None,
     "Track A prints dft_compare without the browser.",
     "Load tiny_dft.json; print scan_cell_count, stitch_count, lockup_count, marker_count, ok."),
    ("module99-00-wrap", "wrap", "DFT insert path complete", "Wrap", None,
     "Recap scan flops, SE/SI/SO, stitch, order, lockup, transform, markers, engine.", None,
     "You checked tiny_dft: 4 SDFF cells; stitch=3; lockup f3→f4; 6 edges; 1 marker; engine ok.",
     "Natural next: learn_signoff."),
]


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def parse_modules():
    out = []
    for row in MODULES_META:
        m = {
            "id": row[0], "kind": row[1], "title": row[2], "short": row[3], "lab": row[4],
            "outcomes": row[5], "algorithm": row[6], "hook": row[7], "idea": row[8],
            "status": "**ref**" if row[1] == "lab" else "—",
        }
        if row[1] == "lab":
            m.update(walk=row[9], browser=row[10], impl=row[11], pitfalls=row[12],
                     next=row[13], pseudo=f"## Pseudocode\n\n```text\n{row[14]}\n```\n",
                     quiz_extra=row[15])
        out.append(m)
    return out


def nav(m, modules):
    idx = next(i for i, x in enumerate(modules) if x["id"] == m["id"])
    prev = modules[idx - 1] if idx else None
    nxt = modules[idx + 1] if idx + 1 < len(modules) else None
    return (f"{('[← '+prev['short']+'](../'+prev['id']+'/README.md)') if prev else '← Start'}"
            f" · [Course README](../README.md) · "
            f"{('['+nxt['short']+' →](../'+nxt['id']+'/README.md)') if nxt else 'End →'}")


MEDIA = ("| Artifact | Path |\n|----------|------|\n| Transcript | [transcript.md](transcript.md) |\n"
         "| Outline | [outline.yaml](outline.yaml) |\n| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |\n"
         "| Video | [video.mp4](video.mp4) |\n| Quiz | [quiz.json](quiz.json) |\n")


def lab_readme(m, modules):
    key = m["id"].replace("module", "")
    if m["kind"] == "lab":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `lab` · Primary lab: `{m['lab']}` · **ref**

{nav(m, modules)}

## Outcomes

After this module you can: **{m['outcomes']}**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_dft.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).

### Track B — Browser lab (online)

1. Local: http://127.0.0.1:8080/tools/{m['lab']}/
2. Live: {LIVE}/{m['lab']}/

## Media

{MEDIA}
"""
    if m["kind"] == "intro":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `intro`

{nav(m, modules)}

## What this course is

**learn_dft_insert** teaches DFT insert literacy — scan SDFF cells, SE/SI/SO ports, chain stitch, lockup latches, netlist transform, markers, and a tiny DFT engine.

**Prerequisite:** [learn_power](../learn_power/README.md) or power/signoff literacy. **Next:** [learn_signoff](../learn_signoff/README.md).

## Media

{MEDIA}
"""
    if m["kind"] == "wrap":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `wrap`

{nav(m, modules)}

## You can now

**{m['outcomes']}**

## Next course

→ **learn_signoff** ([`eda.md`](../../../eda.md))

## Media

{MEDIA}
"""
    return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `offline`

{nav(m, modules)}

## Outcomes

**{m['outcomes']}**

## Media

{MEDIA}
"""


def transcript(m):
    lines = [f"# {m['title']}", "", f"**Module id:** {m['id']}"]
    if m["lab"]:
        lines += [f"**Lab:** {m['lab']}", "**Tracks:** A (implement) · B (browser lab)"]
    lines += ["", f"## Slide 1 — {m['short']}", "", m["hook"], "",
              "## Slide 2 — The idea", "", m["idea"], ""]
    if m["kind"] == "lab":
        lines += ["<!-- algorithm-walkthrough -->", ""]
        for i, (title, _fn, cap) in enumerate(m["walk"], start=3):
            lines += [f"## Slide {i} — {title}", "", f"![{title}](assets/steps/{_fn}.png)", "", cap, ""]
        lines += ["<!-- /algorithm-walkthrough -->", "",
                  "## Slide 8 — Browser lab track", "",
                  "![Browser lab starter](assets/lab-starter.png)", "",
                  m["browser"], "",
                  "## Slide 9 — Implement track", "", m["impl"], "",
                  "## Slide 10 — Pitfalls", "", m["pitfalls"], "",
                  "## Slide 11 — Your turn", "", m["next"], ""]
    elif m["kind"] == "intro":
        lines += ["## Slide 3 — Two tracks", "",
                  "Implement track uses common/ solvers; browser lab track uses platform tools.", "",
                  "## Slide 4 — Toy design", "",
                  "tiny_dft: 4 SDFF cells, stitch=3, lockup f3→f4, 6 edges, 1 marker.", "",
                  "## Slide 5 — Path", "",
                  "Scan flops → SE/SI/SO → stitch → order → lockup → transform → markers → chain view → engine.", "",
                  "## Slide 6 — Begin", "", "Next: identify scan SDFF cells.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "4 SDFF cells; stitch=3; lockup f3→f4; edges=6; markers=1; engine ok.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can explain lockup markers.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  "python3 -c \"from solvers import dft_compare; print(dft_compare())\" in common/", "",
                  "## Slide 5 — What to compare", "", m["idea"], "",
                  "## Slide 6 — Next", "", "Continue to the wrap module.", ""]
    return "\n".join(lines)


def quiz(m):
    if m["kind"] == "lab":
        items = [{"id": f"q{i+1}", "question": q["q"], "choices": q["choices"], "answer": q["answer"]}
                 for i, q in enumerate(m["quiz_extra"])]
    else:
        items = [
            {"id": "q1", "question": f"Focus of {m['short']}?", "choices": [m["outcomes"][:60], "Place only", "CTS only", "DRC width"], "answer": 0},
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_power", "learn_antenna", "learn_signoff"], "answer": 0},
            {"id": "q3", "question": "marker_count golden?", "choices": ["1", "3", "4", "0"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_dft_insert — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))

    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nDFT insert literacy: scan SDFF cells, SE/SI/SO ports, chain stitch, "
          "scan order, lockup latches, netlist transform, marker collection, tiny dft_engine.\n"
          "In: scan cells → stitch → lockup → transform → markers → engine goldens on tiny_dft.\n"
          "Out: full ATPG, compression, boundary scan (see learn_signoff).\n")

    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_dft.json`\n"
          "- **B:** platform `#dft` browser tools\n")

    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_dft_insert

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-DFT%20insert-orange)](docs/MODULES.md)

**learn_dft_insert** is the open learning path for *DFT insert* — scan SDFF cells, SE/SI/SO, chain stitch, lockup latches, netlist transform, markers, and a tiny DFT engine on `tiny_dft.json`.

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

{toc}

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_dft_insert/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_dft_insert/scripts/scaffold_course.py
bash courses/learn_dft_insert/scripts/capture_all_walkthroughs.sh
bash courses/learn_dft_insert/scripts/capture_lab_snaps.sh
bash courses/learn_dft_insert/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_dft_insert --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#dft` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#dft

## License

CC BY 4.0 — see [LICENSE](LICENSE).
""")

    for m in modules:
        d = ROOT / m["id"]
        write(d / "README.md", lab_readme(m, modules))
        write(d / "transcript.md", transcript(m))
        write(d / "outline.yaml", f"title: {m['title']}\nfooter: {COURSE}\nslides: []\n")
        write(d / "slides.md", f"# {m['title']}\n\n(see transcript.md)\n")
        write(d / "quiz.json", json.dumps(quiz(m), indent=2))
        write(d / "CHECKLIST.md", f"# Checklist\n\n- [ ] {m['outcomes']}\n")
        if m["kind"] == "lab":
            write(d / "EXAMPLES.md",
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_dft.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_dft.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_dft.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_dft_insert
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {mid} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_dft_insert/{mid}" --inject-transcript'
              for mid in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_dft_insert/module*/; do
  base=$(basename "$m")
  case "$base" in module00-*|module05-03-*|module99-*) continue ;; esac
  python3 .cursor/skills/module-slides/scripts/capture_lab_snapshot.py "$m" || true
done
echo LAB_SNAPS_OK
""")
    write(scripts / "module.sh", """#!/usr/bin/env bash
set -euo pipefail
echo "Use narrate_clips.sh for media builds."
""")
    write(scripts / "smoke_walkthrough.py",
          "print('labs', " + repr([m["lab"] for m in modules if m["lab"]]) + ")\n")
    print(f"Scaffolded {len(modules)} modules → {ROOT}")


if __name__ == "__main__":
    main()
