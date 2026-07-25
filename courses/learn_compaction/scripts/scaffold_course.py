#!/usr/bin/env python3
"""Scaffold learn_compaction with module-slides stubs. Lab status **ref** (not **P**)."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_compaction"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz[{q,choices,answer}]
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to layout compaction", "Welcome", None,
     "Explain constraint-graph compaction after detailed routing.", None,
     "After detailed routing you have whitespace. Compaction shrinks the layout under spacing rules.",
     "This course uses tiny_compact: cells A,B,C plus wire W; min_gap=1; initial width 20 → compacted 14."),
    ("module01-01-leaf-cells", "lab", "Leaf cells and bounding boxes", "Leaf cells", "leaf-cells",
     "Read leaf-cell rectangles and the layout bounding box / whitespace.",
     "layout bbox and leaf-cell geometry",
     "Compaction starts from leaf geometries — cells and wires with axis-aligned boxes.",
     "A,B,C are cells; W is a horizontal wire. GOLDEN: 4 objects, bbox width 20, height 6.",
     [("Objects", "01-obj", "Four objects: cells A,B,C and wire W."),
      ("Cell A", "02-a", "A sits at x0=0..4, y0=2..5."),
      ("B and C", "03-bc", "B and C sit further right with gaps."),
      ("BBox", "04-bbox", "Union bbox width=20 height=6."),
      ("Count", "05-count", "GOLDENS: object_count=4.")],
     "Open **leaf-cells**. Click cells; read bbox metrics.",
     "Call layout_stats; assert object_count==4 and width==20.",
     "Treating wire as a cell. Confusing chip size with bbox.",
     "Next: spacing / gap rules.",
     "stats ← bbox(objects); whitespace ← chip_area − object_area",
     [{"q": "How many objects in tiny_compact?", "choices": ["4", "3", "6", "1"], "answer": 0},
      {"q": "Initial bbox width?", "choices": ["20", "24", "14", "10"], "answer": 0},
      {"q": "Which object is a wire?", "choices": ["W", "A", "B", "C"], "answer": 0}]),
    ("module01-03-spacing-rules", "lab", "Spacing / gap rules", "Spacing", "spacing-rules",
     "Apply min_gap between overlapping projections; check legality.",
     "min spacing / gap legality",
     "Design rules demand a minimum gap between adjacent shapes that project on an axis.",
     "min_gap=1 on the toy. Initial layout is legal; illegal if two cells overlap or gap < 1.",
     [("Gap one", "01-gap", "GOLDEN min_gap = 1."),
      ("Legal init", "02-legal", "Starter layout is_legal → True."),
      ("Overlap fail", "03-overlap", "Overlapping rects fail legality."),
      ("Project", "04-proj", "Spacing applies when orthogonal projections overlap."),
      ("Why", "05-why", "Constraints encode these gaps in the graph next.")],
     "Open **spacing-rules**. Confirm min_gap=1 and legal starter.",
     "Call is_legal(DATA); assert True. Print min_gap.",
     "Applying gap without projection overlap. Ignoring wires wrongly as cells.",
     "Next: the constraint graph.",
     "legal ← no overlap and gaps ≥ min_gap on shared projections",
     [{"q": "min_gap on tiny_compact?", "choices": ["1", "2", "0", "4"], "answer": 0},
      {"q": "Starter layout legal?", "choices": ["yes", "no", "only X", "only Y"], "answer": 0},
      {"q": "Gap applies when?", "choices": ["projections overlap", "always", "never", "only wires"], "answer": 0}]),
    ("module02-01-constraint-graph", "lab", "Constraint graph", "Constraints", "constraint-graph",
     "Build X-axis constraint graph: L/R nodes and dst ≥ src + w edges.",
     "constraint graph construction",
     "Compaction models geometry as a directed constraint graph.",
     "Nodes L_A,R_A,…; size edges R≥L+width; spacing edges L_right ≥ R_left + gap. GOLDEN ~10 X edges.",
     [("Nodes", "01-nodes", "Left/right edge nodes per object."),
      ("Size", "02-size", "R_id ≥ L_id + width(id)."),
      ("Spacing", "03-space", "Next cell’s left ≥ previous right + gap."),
      ("Source", "04-src", "SRC_X anchors the left of the chip."),
      ("Count", "05-count", "GOLDEN: about 10 constraint edges on X.")],
     "Open **constraint-graph**. Inspect X graph node/edge counts.",
     "Call build_constraint_graph(DATA,'x'); print len(edges).",
     "Forgetting size edges. Mixing X and Y nodes.",
     "Next: longest-path placement.",
     "edges ← size(R,L,w) ∪ spacing(L_r, R_l, gap) ∪ anchor(L, SRC, 0)",
     [{"q": "Constraint meaning?", "choices": ["dst ≥ src + w", "dst ≤ src", "undirected only", "max-flow"], "answer": 0},
      {"q": "X size edge connects?", "choices": ["R to L with width", "L to SRC", "wires only", "Y only"], "answer": 0},
      {"q": "Anchor node id prefix?", "choices": ["SRC_", "OUT_", "PI_", "PO_"], "answer": 0}]),
    ("module02-03-longest-path", "lab", "Longest-path compaction", "Longest path", "longest-path",
     "Place each constraint node at longest-path distance from the source.",
     "longest-path compaction",
     "Classic 1-D compaction sets each variable to the longest path from the source.",
     "Relax edges until positions stabilize; left edges pull rightward to minimum legal places.",
     [("Source", "01-src", "SRC_X at position 0."),
      ("Relax", "02-relax", "Update dst ← max(dst, src + w)."),
      ("Stable", "03-stable", "Stop when no position increases."),
      ("Left pack", "04-pack", "Cells pack left under spacing."),
      ("Ready", "05-ready", "Positions feed compact_1d next.")],
     "Open **longest-path**. Run longest-path on the X graph.",
     "Call longest_path_compact(build_constraint_graph(...)).",
     "Using shortest-path instead. Not iterating to fixpoint.",
     "Next: apply 1-D compaction.",
     "pos[v] ← max over paths SRC→v of path weight",
     [{"q": "Longest-path sets positions from?", "choices": ["source", "sink only", "random", "LP solver always"], "answer": 0},
      {"q": "Update rule?", "choices": ["dst = max(dst, src+w)", "dst = min", "dst = avg", "delete edge"], "answer": 0},
      {"q": "SRC_X position?", "choices": ["0", "20", "14", "−1"], "answer": 0}]),
    ("module02-05-compact-1d", "lab", "1-D compaction (X or Y)", "1-D compact", "compact-1d",
     "Compact along X: width 20 → 14 while keeping min_gap.",
     "1-D axis compaction",
     "One axis at a time: build graph, longest-path, rewrite coordinates.",
     "GOLDEN: X compaction before_span=20, after_span=14, improved=True.",
     [("Before", "01-before", "Initial X span = 20."),
      ("Run", "02-run", "compact_1d(layout, 'x')."),
      ("After", "03-after", "After X span = 14."),
      ("Gaps", "04-gaps", "Whitespace between A–B–C shrinks to min_gap."),
      ("Y untouched", "05-y", "Y coordinates unchanged in a pure X pass.")],
     "Open **compact-1d**. Click Compact X; confirm 20→14.",
     "Call compact_1d(DATA,'x'); assert after_span==14.",
     "Expecting Y to change. Ignoring improved flag.",
     "Next: 2-D compaction.",
     "layout' ← apply longest_path positions on chosen axis",
     [{"q": "X span after compact_1d?", "choices": ["14", "20", "24", "10"], "answer": 0},
      {"q": "X span before?", "choices": ["20", "14", "6", "1"], "answer": 0},
      {"q": "improved means?", "choices": ["after < before", "illegal", "taller", "more wires"], "answer": 0}]),
    ("module02-07-compact-2d", "lab", "2-D compaction", "2-D compact", "compact-2d",
     "Run X then Y compaction and report final width/height.",
     "2-D sequential axis compaction",
     "2-D compaction usually alternates axes (X then Y on the toy).",
     "GOLDEN: initial 20×6 → final width 14 (height may shift slightly with projections).",
     [("Order", "01-order", "Default order is X then Y."),
      ("X step", "02-x", "First step shrinks width."),
      ("Y step", "03-y", "Second step rebuilds Y constraints."),
      ("Final", "04-final", "final_width=14 on the toy."),
      ("Trade", "05-trade", "Axis order can change results in richer layouts.")],
     "Open **compact-2d**. Run 2-D; read final width 14.",
     "Call compact_2d(DATA); assert final_width==14.",
     "Assuming one axis is enough. Ignoring order sensitivity.",
     "Next: wire jogs.",
     "for axis in (x,y): compact_1d(layout, axis)",
     [{"q": "Default 2-D order?", "choices": ["x then y", "y only", "diagonal", "random"], "answer": 0},
      {"q": "Final width golden?", "choices": ["14", "20", "24", "6"], "answer": 0},
      {"q": "Initial height?", "choices": ["6", "14", "20", "10"], "answer": 0}]),
    ("module03-01-wire-jogs", "lab", "Wire jogs / stretch", "Wire jogs", "wire-jogs",
     "Add a jog and stretch wire W to the compacted cell bbox.",
     "wire jog and stretch literacy",
     "Wires must bend or stretch when cells move during compaction.",
     "add_jog inserts a bend; stretch_wire_to_bbox retargets a horizontal wire to the cell union.",
     [("Wire W", "01-w", "W is horizontal at y=7 spanning x=4..16."),
      ("Jog", "02-jog", "add_jog records a bend point."),
      ("Stretch", "03-stretch", "After compact, stretch W to cell bbox."),
      ("Points", "04-pts", "points list holds polyline vertices."),
      ("Why", "05-why", "Without jogs, wires disconnect from moving pins.")],
     "Open **wire-jogs**. Add a jog; stretch W after compact.",
     "Call add_jog on W; stretch_wire_to_bbox after compact_1d.",
     "Deleting the wire. Stretching without updating y.",
     "Next: shear lite.",
     "wire.points ← [start, jog, end]; stretch x0/x1 to bbox",
     [{"q": "Wire id?", "choices": ["W", "A", "SRC", "M1"], "answer": 0},
      {"q": "add_jog adds?", "choices": ["a bend point", "a cell", "a via only", "DRC"], "answer": 0},
      {"q": "stretch updates?", "choices": ["wire x extent", "chip size", "min_gap", "Y only"], "answer": 0}]),
    ("module03-03-shear-lite", "lab", "Shear / channel lite", "Shear", "shear-lite",
     "Shear a channel band by shifting objects vertically in an X window.",
     "channel shear lite",
     "Shear slides a channel to open or close space without full recompaction.",
     "shear_channel_lite(x_lo,x_hi,delta_y) moves objects intersecting the band.",
     [("Channel", "01-ch", "Pick an X band covering B."),
      ("Delta", "02-dy", "Apply delta_y to intersecting objects."),
      ("Moved", "03-moved", "Report which ids moved."),
      ("Legal check", "04-legal", "Re-check spacing after shear."),
      ("Use", "05-use", "Shear is a local cleanup before another compact pass.")],
     "Open **shear-lite**. Shear a band; inspect moved ids.",
     "Call shear_channel_lite(DATA, 7, 13, 1); print moved.",
     "Shearing the whole chip blindly. Skipping legality after shear.",
     "Next: sequential compact pipeline.",
     "for obj intersecting [x_lo,x_hi]: y += delta_y",
     [{"q": "Shear changes?", "choices": ["Y in an X band", "only wires", "min_gap", "chip x1"], "answer": 0},
      {"q": "Return field for ids?", "choices": ["moved", "jog", "SRC", "cuts"], "answer": 0},
      {"q": "After shear you should?", "choices": ["re-check legal", "delete cells", "ignore gaps", "reset chip"], "answer": 0}]),
    ("module03-05-sequential-compact", "lab", "Sequential compact pass", "Sequential", "sequential-compact",
     "Run X→Y compact, stretch wires, report legal improved layout.",
     "sequential compaction pipeline",
     "A full pass chains axis compaction and wire repair like a tiny cleaner.",
     "GOLDEN: width 20→14, legal=True, improved=True.",
     [("Pipeline", "01-pipe", "X compact then Y compact then wire stretch."),
      ("Width", "02-w", "final_width=14."),
      ("Legal", "03-legal", "legal flag True on the toy."),
      ("Improved", "04-imp", "improved True vs initial span."),
      ("Done", "05-done", "Next: offline compare, then wrap.")],
     "Open **sequential-compact**. Click Sequential compact; confirm 20→14.",
     "Call sequential_compact(DATA); assert final_width==14 and legal.",
     "Skipping wire stretch. Claiming illegal layouts are OK.",
     "Next: offline benchmark, then wrap.",
     "return sequential_compact → {final_width, legal, improved}",
     [{"q": "Sequential final width?", "choices": ["14", "20", "24", "6"], "answer": 0},
      {"q": "Sequential legal?", "choices": ["True", "False", "unknown", "only Y"], "answer": 0},
      {"q": "Pipeline starts with?", "choices": ["X compact", "shear", "DRC", "CTS"], "answer": 0}]),
    ("module05-01-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline", None,
     "Compare initial vs sequential compact metrics offline.", None,
     "Track A prints compaction_compare without the browser.",
     "Load JSON; print width_delta and legal flag."),
    ("module99-00-wrap", "wrap", "Compaction path complete", "Wrap", None,
     "Recap constraint graphs, longest-path, 1-D/2-D, jogs; continue to pattern matching or signoff.", None,
     "You compacted tiny_compact from width 20 to 14 under min_gap=1.",
     "Natural next: learn_pattern_matching or learn_signoff."),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_compact.json`.
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

**learn_compaction** teaches constraint-graph layout compaction after detailed routing.

**Prerequisite:** [learn_routing](../learn_routing/README.md). **Next:** [learn_pattern_matching](../learn_pattern_matching/README.md).

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

→ **learn_pattern_matching** or **learn_signoff** ([`eda.md`](../../../eda.md))

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
                  f"## Slide 8 — Browser lab track", "",
                  "![Browser lab starter](assets/lab-starter.png)", "",
                  m["browser"], "",
                  "## Slide 9 — Implement track", "", m["impl"], "",
                  "## Slide 10 — Pitfalls", "", m["pitfalls"], "",
                  "## Slide 11 — Your turn", "", m["next"], ""]
    elif m["kind"] == "intro":
        lines += ["## Slide 3 — Two tracks", "",
                  "Implement track uses common/ solvers; browser lab track uses platform tools.", "",
                  "## Slide 4 — Toy layout", "",
                  "Cells A, B, C and wire W; min_gap one; width twenty packs to fourteen.", "",
                  "## Slide 5 — Path", "",
                  "Constraint graph, longest path, one-D and two-D, jogs, sequential pass.", "",
                  "## Slide 6 — Begin", "", "Next: leaf cells and bounding boxes.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "Width twenty to fourteen under min_gap one; sequential pass stays legal.", "",
                  "## Slide 5 — Next", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can explain the constraint graph.", ""]
    else:
        lines += ["## Slide 3 — Offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  "python3 -c \"from solvers import *; ...\" in common/", "",
                  "## Slide 5 — Compare", "", m["idea"], "",
                  "## Slide 6 — Next", "", "Continue to the wrap module.", ""]
    return "\n".join(lines)


def quiz(m):
    items = []
    if m["kind"] == "lab":
        for i, q in enumerate(m["quiz_extra"]):
            items.append({"id": f"q{i+1}", "question": q["q"], "choices": q["choices"],
                          "answer": q["answer"]})
    else:
        items = [
            {"id": "q1", "question": f"Focus of {m['short']}?", "choices": [m["outcomes"][:60], "Place only", "CTS only", "SPICE"], "answer": 0},
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_routing", "learn_drc", "learn_sta"], "answer": 0},
            {"id": "q3", "question": "Toy initial width?", "choices": ["20", "14", "1", "100"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    # LICENSE
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")
    write(ROOT / "common" / "README.md",
          "# common/ — Track A compaction solvers\n\n"
          "Load `tiny_compact.json`. See `solvers.py` for constraint-graph APIs.\n\n"
          "```bash\npython3 test_solvers.py -v\n```\n")

    rows = ["# learn_compaction — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))
    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nConstraint-graph layout compaction literacy after detailed routing.\n"
          "In: 1-D/2-D longest-path compaction, jogs, shear lite.\nOut: full commercial compactors, OPC.\n")
    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers\n- **B:** platform `#compaction` tools\n")
    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_compaction

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-compaction-orange)](docs/MODULES.md)

Layout compaction literacy — constraint graphs, longest-path 1-D/2-D compact, wire jogs, shear lite.

## Contents

{toc}

## Two tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#compaction` |

## Browse / clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Author / module-slides

```bash
bash .cursor/skills/module-slides/scripts/narrate_clips.sh --course-dir courses/learn_compaction
```

## Module landings

See [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#compaction

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
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_compact.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_compact.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_compact.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_compaction
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(f'echo "=== {m} ==="\npython3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_compaction/{m}" --inject-transcript'
                      for m in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_compaction/module*/; do
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
