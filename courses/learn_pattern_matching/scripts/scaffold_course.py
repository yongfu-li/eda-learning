#!/usr/bin/env python3
"""Scaffold learn_pattern_matching with module-slides stubs. Lab status **ref**."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_pattern_matching"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to pattern matching", "Welcome", None,
     "Explain DRC-style edge/region pattern matching on single and multi layers.", None,
     "Physical verification starts by matching geometry patterns — edge pairs, regions, markers — before full DRC decks.",
     "This course uses tiny_patterns: M1 shapes A,B,D, M2 shape C, via V. Goldens: width on D, space A–B, enclosure fail V vs M2 → 3 markers."),
    ("module01-01-edges-polygons", "lab", "Edges and polygons", "Edges", "edges-polygons",
     "Extract axis-aligned edges from rectangles and report geometry stats.",
     "edge extraction / geometry stats",
     "Pattern engines begin with polygons and their edges on named layers.",
     "GOLDEN: 5 shapes, 3 layers, 20 edges (4 per shape), 3 shapes on M1.",
     [("Shapes", "01-shapes", "Five rectangles: A,B,D on M1; C on M2; V on VIA."),
      ("Layers", "02-layers", "Layers M1, M2, VIA — GOLDEN layer_count=3."),
      ("Edges", "03-edges", "Each rect yields 4 edges → 20 total."),
      ("Select A", "04-a", "A is 8×4 on M1 at left."),
      ("Stats", "05-stats", "geometry_stats reports counts and widths.")],
     "Open **edges-polygons**. Select shapes; confirm shape_count=5 and edge_count=20.",
     "Call geometry_stats(); assert shape_count==5 and edge_count==20.",
     "Counting only cells. Mixing chip size with shape count.",
     "Next: single-layer edge-pair spacing.",
     "edges ← ∪_shape {top,bottom,left,right}; stats ← counts by layer",
     [{"q": "How many shapes?", "choices": ["5", "3", "4", "20"], "answer": 0},
      {"q": "Edge count golden?", "choices": ["20", "5", "12", "3"], "answer": 0},
      {"q": "Thin M1 shape id?", "choices": ["D", "A", "C", "V"], "answer": 0}]),
    ("module01-03-single-layer-edge-pair", "lab", "Single-layer edge-pair (space)", "Edge pair", "single-layer-edge-pair",
     "Match horizontal neighbor edge pairs and flag min-space violations.",
     "single-layer edge-pair spacing match",
     "Spacing patterns compare facing edges of same-layer shapes with overlapping projections.",
     "On M1, A–B gap is 1 but min_space=2 → one space marker. GOLDEN space_markers=1.",
     [("Neighbors", "01-nb", "A left of B on M1 with y-projection overlap."),
      ("Gap", "02-gap", "Gap A→B equals 1 (x 10→11)."),
      ("Limit", "03-limit", "min_space[M1]=2."),
      ("Marker", "04-mark", "Emit space marker on shapes A,B."),
      ("Count", "05-count", "GOLDEN: one M1 space marker.")],
     "Open **single-layer-edge-pair**. Run Match space; confirm one A–B marker.",
     "Call match_space(layer='M1'); assert len==1 and shapes {A,B}.",
     "Matching without projection overlap. Checking different layers as one pair.",
     "Next: single-layer region / enclosure.",
     "for each same-layer pair with proj overlap: if gap < min_space → marker",
     [{"q": "A–B gap?", "choices": ["1", "2", "0", "8"], "answer": 0},
      {"q": "min_space M1?", "choices": ["2", "1", "3", "0"], "answer": 0},
      {"q": "Space markers?", "choices": ["1", "0", "3", "5"], "answer": 0}]),
    ("module01-05-single-layer-region", "lab", "Single-layer region (width)", "Region width", "single-layer-region",
     "Match thin rectangles where min(width,height) violates min_width.",
     "single-layer width / region thinness",
     "Width patterns treat a polygon as a region and measure its smallest extent.",
     "D is 1×6 on M1; min_width[M1]=3 → width marker. GOLDEN width_markers=1.",
     [("Thin D", "01-d", "D width=1 height=6."),
      ("Min width", "02-mw", "min_width[M1]=3."),
      ("Measure", "03-min", "thin = min(w,h) = 1."),
      ("Marker", "04-mark", "Emit width marker on D."),
      ("Others", "05-ok", "A,B,C,V pass their layer min_width.")],
     "Open **single-layer-region**. Run Match width; confirm marker on D.",
     "Call match_width(); assert one marker on D.",
     "Using area instead of min(w,h). Applying M2 limits to M1.",
     "Next: scanline sweep.",
     "for each shape: if min(w,h) < min_width[layer] → width marker",
     [{"q": "Width markers?", "choices": ["1", "0", "2", "5"], "answer": 0},
      {"q": "Which shape is thin?", "choices": ["D", "A", "V", "C"], "answer": 0},
      {"q": "min_width M1?", "choices": ["3", "1", "2", "8"], "answer": 0}]),
    ("module02-01-scanline-sweep", "lab", "Scanline edge sweep", "Scanline", "scanline-sweep",
     "Build enter/leave scanline events for shapes on a layer.",
     "scanline edge sweep events",
     "Production matchers often sweep a scanline across edges instead of O(n²) pairs only.",
     "M1 has 3 shapes → 6 events (enter/leave each). Events sort by x then enter-before-leave.",
     [("Enter", "01-enter", "Enter event at shape x0."),
      ("Leave", "02-leave", "Leave event at shape x1."),
      ("Sort", "03-sort", "Sort by x; enters before leaves at same x."),
      ("M1 count", "04-n", "GOLDEN: 6 events on M1."),
      ("Use", "05-use", "Active set between events drives pair checks.")],
     "Open **scanline-sweep**. Run Scanline M1; confirm 6 events.",
     "Call scanline_events('M1'); assert len==6.",
     "Forgetting leave events. Sorting leaves before enters at same x.",
     "Next: marker emission.",
     "events ← enter(x0) ∪ leave(x1); sort; sweep active set",
     [{"q": "M1 scan events?", "choices": ["6", "3", "12", "20"], "answer": 0},
      {"q": "Enter uses?", "choices": ["x0", "x1", "y1", "area"], "answer": 0},
      {"q": "Leave uses?", "choices": ["x1", "x0", "layer", "via"], "answer": 0}]),
    ("module02-03-marker-emit", "lab", "Marker emit", "Markers", "marker-emit",
     "Emit and count width+space markers from single-layer matches.",
     "marker list emission",
     "A marker is a typed hit (width/space/…) pointing at shapes — DRC later maps markers to violations.",
     "emit_markers combines width and space → at least 2 markers (D + A–B).",
     [("Types", "01-types", "Markers carry type, layer, shapes, value, limit."),
      ("Width hit", "02-w", "Width marker on D."),
      ("Space hit", "03-s", "Space marker on A,B."),
      ("List", "04-list", "emit_markers returns the combined list."),
      ("Count", "05-n", "At least 2 single-layer markers.")],
     "Open **marker-emit**. Run Emit markers; confirm ≥2 markers.",
     "Call emit_markers(); assert len >= 2.",
     "Dropping value/limit fields. Mixing multi-layer into emit early.",
     "Next: multi-layer via enclosure.",
     "markers ← match_width ∪ match_space",
     [{"q": "Marker fields include?", "choices": ["type+shapes", "only color", "SDF only", "clock"], "answer": 0},
      {"q": "emit_markers includes?", "choices": ["width+space", "LVS only", "CTS", "IR drop"], "answer": 0},
      {"q": "Thin shape marker?", "choices": ["D", "C", "chip", "M2"], "answer": 0}]),
    ("module03-01-multi-layer-via", "lab", "Multi-layer via enclosure", "Via enclose", "multi-layer-via",
     "Check via enclosure by M1 (pass) and M2 (fail) with min margin.",
     "multi-layer via enclosure match",
     "Enclosure is a region pattern across layers: inner VIA must sit inside outer metal with margin.",
     "V inside A on M1 with margins ≥1 → OK. V not inside C on M2 → enclosure marker. GOLDEN enclosure_markers=1.",
     [("Via V", "01-v", "V is 2×2 on VIA inside A."),
      ("M1 OK", "02-m1", "Enclosed by A with margin ≥1."),
      ("M2 fail", "03-m2", "C does not contain V."),
      ("Marker", "04-mark", "One enclosure marker (VIA vs M2)."),
      ("API", "05-api", "multi_layer_via_check reports m1_ok / m2_ok.")],
     "Open **multi-layer-via**. Run Via check; confirm m1_ok and one M2 marker.",
     "Call multi_layer_via_check(); assert m1_ok and enclosure_markers==1.",
     "Requiring same-layer enclosure. Ignoring margin limit.",
     "Next: multi-layer interactions.",
     "for via: if no outer with margins≥limit → enclosure marker",
     [{"q": "m1_ok?", "choices": ["True", "False", "unknown", "only Y"], "answer": 0},
      {"q": "enclosure markers?", "choices": ["1", "0", "3", "5"], "answer": 0},
      {"q": "Outer fail layer?", "choices": ["M2", "M1", "VIA", "poly"], "answer": 0}]),
    ("module03-03-multi-layer-interaction", "lab", "Multi-layer interactions", "Interactions", "multi-layer-interaction",
     "List cross-layer overlapping shape pairs as interaction candidates.",
     "multi-layer interaction / overlap pairs",
     "Interaction patterns find shapes on different layers whose regions overlap — candidates for via/contact checks.",
     "V overlaps A (VIA∩M1). GOLDEN: at least the (A,V) pair.",
     [("Cross", "01-cross", "Only different-layer pairs qualify."),
      ("Overlap", "02-ov", "Axis-aligned rectangle overlap test."),
      ("AV", "03-av", "Pair A–V is present."),
      ("List", "04-list", "multi_layer_interactions returns pairs."),
      ("Use", "05-use", "Interactions feed enclosure and boolean patterns.")],
     "Open **multi-layer-interaction**. Run Interactions; confirm A–V pair.",
     "Call multi_layer_interactions(); assert ('A','V') in pairs.",
     "Including same-layer overlaps. Using center distance only.",
     "Next: layered boolean.",
     "pairs ← { (a,b) | layer(a)≠layer(b) ∧ overlap(a,b) }",
     [{"q": "A–V interaction?", "choices": ["yes", "no", "same layer", "only M2"], "answer": 0},
      {"q": "Same-layer pairs?", "choices": ["excluded", "required", "only vias", "always"], "answer": 0},
      {"q": "Test used?", "choices": ["rect overlap", "HPWL", "STA slack", "BFS"], "answer": 0}]),
    ("module03-05-layered-boolean", "lab", "Layered boolean (AND/OR)", "Boolean", "layered-boolean",
     "Evaluate VIA covered by M1 AND NOT M2 (and_not) boolean pattern.",
     "layered boolean region pattern",
     "Boolean patterns combine coverage predicates across layers (AND / OR / AND-NOT).",
     "V covered by M1 and not by M2 → and_not hit. GOLDEN boolean_and_hits=1.",
     [("Cover M1", "01-m1", "V is covered (contained) by M1 A."),
      ("Cover M2", "02-m2", "V is not covered by M2 C."),
      ("And-not", "03-andnot", "and_not = M1 ∧ ¬M2 matches V."),
      ("And", "04-and", "and = M1 ∧ M2 matches none on the toy."),
      ("Hit", "05-hit", "GOLDEN: one and_not hit on V.")],
     "Open **layered-boolean**. Run Boolean and_not; confirm hit on V.",
     "Call layered_boolean('and_not'); assert one hit on V.",
     "Confusing overlap with containment. Swapping AND and AND-NOT.",
     "Next: full match engine pass.",
     "hit ← covered(V,M1) ∧ ¬covered(V,M2)",
     [{"q": "and_not hits?", "choices": ["1", "0", "3", "5"], "answer": 0},
      {"q": "Hit shape?", "choices": ["V", "D", "B", "C"], "answer": 0},
      {"q": "and_not means?", "choices": ["M1 and not M2", "M1 or M2", "space only", "width only"], "answer": 0}]),
    ("module04-01-match-engine", "lab", "Match engine pass", "Engine", "match-engine",
     "Run the full match engine: width + space + enclosure → 3 markers.",
     "combined single+multi match engine",
     "A tiny match engine chains single-layer and multi-layer patterns into one marker list.",
     "GOLDEN match_engine_markers=3 (width 1 + space 1 + enclosure 1).",
     [("Pipeline", "01-pipe", "Width → space → via enclosure."),
      ("Width", "02-w", "One width marker."),
      ("Space", "03-s", "One space marker."),
      ("Encl", "04-e", "One enclosure marker."),
      ("Total", "05-n", "count=3 on tiny_patterns.")],
     "Open **match-engine**. Run Match engine; confirm count=3.",
     "Call match_engine(); assert count==3.",
     "Stopping after width only. Double-counting boolean as DRC markers.",
     "Next: offline compare, then wrap.",
     "return markers ← width ∪ space ∪ enclosure; count ← |markers|",
     [{"q": "Engine marker count?", "choices": ["3", "1", "5", "20"], "answer": 0},
      {"q": "Includes enclosure?", "choices": ["yes", "no", "only width", "only boolean"], "answer": 0},
      {"q": "Toy shape count?", "choices": ["5", "3", "2", "10"], "answer": 0}]),
    ("module05-01-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline", None,
     "Print pattern_compare metrics offline without the browser.", None,
     "Track A prints pattern_compare without the browser.",
     "Load JSON; print marker_count and width/space/enclosure splits."),
    ("module99-00-wrap", "wrap", "Pattern matching path complete", "Wrap", None,
     "Recap single/multi-layer patterns; continue to learn_drc or learn_multi_patterning.", None,
     "You matched tiny_patterns: 3 engine markers (width, space, enclosure).",
     "Natural next: learn_drc or learn_multi_patterning / learn_rule_dsl."),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_patterns.json`.
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

**learn_pattern_matching** teaches DRC-style edge/region pattern matching (single- and multi-layer).

**Prerequisite:** [learn_geometry](../learn_geometry/README.md) / routing spine. **Next:** [learn_drc](../learn_drc/README.md).

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

→ **learn_drc** or **learn_multi_patterning** ([`eda.md`](../../../eda.md))

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
                  "## Slide 4 — Toy layout", "",
                  "Five shapes on M1, M2, and VIA; three engine markers on the golden.", "",
                  "## Slide 5 — Path", "",
                  "Edges, edge-pair space, width region, scanline, markers, via, interactions, boolean, engine.", "",
                  "## Slide 6 — Begin", "", "Next: edges and polygons.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "Three match-engine markers: width on D, space A B, enclosure via versus M2.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can explain single versus multi-layer matching.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  "python3 -c \"from solvers import *; ...\" in common/", "",
                  "## Slide 5 — What to compare", "", m["idea"], "",
                  "## Slide 6 — Next", "", "Continue to the wrap module.", ""]
    return "\n".join(lines)


def quiz(m):
    if m["kind"] == "lab":
        items = [{"id": f"q{i+1}", "question": q["q"], "choices": q["choices"], "answer": q["answer"]}
                 for i, q in enumerate(m["quiz_extra"])]
    else:
        items = [
            {"id": "q1", "question": f"Focus of {m['short']}?", "choices": [m["outcomes"][:60], "Place only", "CTS only", "SPICE"], "answer": 0},
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_drc", "learn_compaction", "learn_sta"], "answer": 0},
            {"id": "q3", "question": "Engine marker count golden?", "choices": ["3", "1", "20", "0"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_pattern_matching — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))
    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nDRC-style pattern matching: single-layer edge/region, scanline, markers; "
          "multi-layer via enclosure, interactions, boolean.\n"
          "In: match engine → markers.\nOut: full SVRF compilers, OPC, commercial DRC.\n")
    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers\n- **B:** platform `#pattern-matching` tools\n")
    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_pattern_matching

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-pattern--matching-orange)](docs/MODULES.md)

**learn_pattern_matching** is the open learning path for *DRC-style edge/region pattern matching* — single-layer space/width, scanline, markers, and multi-layer via/boolean patterns.

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

Open [platform courses](../../platform/courses/learn_pattern_matching/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_pattern_matching/scripts/scaffold_course.py
python3 courses/learn_pattern_matching/scripts/generate_tools.py
bash courses/learn_pattern_matching/scripts/capture_all_walkthroughs.sh
bash courses/learn_pattern_matching/scripts/capture_lab_snaps.sh
bash courses/learn_pattern_matching/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_pattern_matching --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#pattern-matching` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#pattern-matching

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
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_patterns.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_patterns.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_patterns.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_pattern_matching
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {m} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_pattern_matching/{m}" --inject-transcript'
              for m in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_pattern_matching/module*/; do
  base=$(basename "$m")
  case "$base" in module00-*|module05-*|module99-*) continue ;; esac
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
