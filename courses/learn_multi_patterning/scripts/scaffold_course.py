#!/usr/bin/env python3
"""Scaffold learn_multi_patterning with module-slides stubs. Lab status **ref**."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_multi_patterning"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to multi-patterning", "Welcome", None,
     "Explain why same-mask spacing forces DP/TP/QP decomposition on a toy layout.",
     None,
     "Same-mask spacing forces features onto multiple masks — double (DP), triple (TP), or quad (QP) patterning.",
     "Toy tiny_mp: features A–F; triangle A-B-C blocks DP; path D-E-F is 2-colorable; TP needs 3 masks."),
    ("module01-01-conflict-graph", "lab", "Conflict graph construction", "Why conflicts", "conflict-graph",
     "Build a conflict graph when bbox gap < min_same_mask.",
     "conflict graph construction",
     "Multi-patterning starts by finding which features cannot share the same mask.",
     "GOLDEN: 6 nodes, 5 edges (A-B, A-C, B-C, D-E, E-F), min_same_mask=2.",
     [("Features", "01-features", "Six rectangles A–F on the toy layer."),
      ("Min space", "02-min", "min_same_mask=2 — closer pairs conflict."),
      ("Edges", "03-edges", "Edge when bbox gap < 2 → five conflicts."),
      ("Triangle", "04-tri", "A-B-C forms an odd cycle (triangle)."),
      ("Path", "05-path", "D-E-F is a simple path — 2-colorable later.")],
     "Open **conflict-graph**. Build graph; confirm 6 nodes and 5 edges.",
     "Call build_conflict_graph(); assert feature_count==6 and edge_count==5.",
     "Using center distance instead of bbox gap. Forgetting min_same_mask from JSON.",
     "Next: LELE double patterning as 2-coloring.",
     "edges ← {(u,v) | gap(u,v) < min_same_mask}",
     [{"q": "Feature count?", "choices": ["6", "5", "3", "2"], "answer": 0},
      {"q": "Conflict edge count?", "choices": ["5", "6", "3", "15"], "answer": 0},
      {"q": "min_same_mask golden?", "choices": ["2", "1", "3", "0"], "answer": 0}]),
    ("module01-03-double-lele", "lab", "LELE double patterning", "LELE overview", "double-lele",
     "Treat LELE double patterning as 2-coloring the conflict graph.",
     "LELE 2-coloring / odd-cycle detection",
     "LELE double patterning assigns two lithography masks by 2-coloring conflicts.",
     "GOLDEN: lele_double ok=False on the full graph (triangle A-B-C).",
     [("LELE idea", "01-lele", "Same-mask spacing → two masks, alternating colors."),
      ("Two masks", "02-masks", "Mask 0 and mask 1 for non-conflicting neighbors."),
      ("Color attempt", "03-bfs", "BFS 2-color from each unvisited node."),
      ("Odd cycle", "04-odd", "Triangle A-B-C forces same color on an edge."),
      ("Fail", "05-fail", "GOLDEN: ok=False — full graph not DP-feasible.")],
     "Open **double-lele**. Run LELE; confirm ok=False on tiny_mp.",
     "Call lele_double(); assert ok is False.",
     "Assuming DP always works. Ignoring odd cycles in the full layout.",
     "Next: bipartite check on a subgraph.",
     "try 2-color BFS; fail on odd cycle",
     [{"q": "lele_double ok on full graph?", "choices": ["False", "True", "unknown", "N/A"], "answer": 0},
      {"q": "Why DP fails?", "choices": ["triangle A-B-C", "path D-E-F", "no edges", "min_same_mask=0"], "answer": 0},
      {"q": "LELE mask count if ok?", "choices": ["2", "3", "4", "1"], "answer": 0}]),
    ("module01-05-bipartite-check", "lab", "Bipartite check (DP feasibility)", "DP feasibility", "bipartite-check",
     "Verify DP feasibility with bipartite check; path D-E-F succeeds.",
     "bipartite check / subgraph 2-color",
     "A subgraph that is bipartite can still be double-patterned even when the full chip is not.",
     "GOLDEN: path_lele ok=True on nodes D, E, F.",
     [("Subgraph", "01-sub", "Restrict to path D–E–F only."),
      ("BFS color", "02-bfs", "2-color with BFS on the induced subgraph."),
      ("Path DEF", "03-def", "Two edges D-E and E-F — no odd cycle."),
      ("Colors 0/1", "04-col", "Alternating colors along the path."),
      ("OK", "05-ok", "GOLDEN: ok=True — path is DP-feasible.")],
     "Open **bipartite-check**. Run path check; confirm ok=True for D-E-F.",
     "Call path_lele(); assert ok is True.",
     "Testing full graph when the lesson is subgraph feasibility. Confusing LELE with SADP.",
     "Next: SADP mandrel assignment.",
     "is_bipartite(G, subset=['D','E','F']) → ok",
     [{"q": "path_lele ok?", "choices": ["True", "False", "3 masks", "unknown"], "answer": 0},
      {"q": "Path nodes checked?", "choices": ["D-E-F", "A-B-C", "A-F only", "none"], "answer": 0},
      {"q": "Bipartite means?", "choices": ["2-colorable", "3-colorable", "no edges", "SADP only"], "answer": 0}]),
    ("module02-01-double-sadp", "lab", "SADP lite (mandrels + spacers)", "SADP lite", "double-sadp",
     "Assign mandrels via independent set; neighbors become spacer-defined (not LELE).",
     "SADP mandrel independent set",
     "SADP is not LELE coloring — mandrels print first; spacers form between mandrels.",
     "GOLDEN: mandrel_count=3 (A, D, F on the toy greedy pick).",
     [("Mandrel", "01-mand", "Mandrel shapes print on the first exposure."),
      ("Spacer", "02-sp", "Spacer shapes form in gaps between mandrels."),
      ("Independent set", "03-is", "Greedy maximal independent set picks mandrels."),
      ("Assign", "04-asg", "Non-mandrel features become spacers."),
      ("Count 3", "05-n", "GOLDEN: mandrel_count=3 (A, D, F).")],
     "Open **double-sadp**. Run SADP assign; confirm mandrel_count=3.",
     "Call sadp_assign(); assert mandrel_count==3.",
     "Treating SADP as 2-coloring. Expecting same result as LELE.",
     "Next: stitch to break odd cycles.",
     "mandrels ← greedy_max_independent_set(G); spacers ← V \\ mandrels",
     [{"q": "mandrel_count golden?", "choices": ["3", "2", "6", "5"], "answer": 0},
      {"q": "SADP is LELE?", "choices": ["no", "yes", "same as TP", "quad only"], "answer": 0},
      {"q": "Spacers are?", "choices": ["non-mandrel features", "mask 0 only", "DRC markers", "vias"], "answer": 0}]),
    ("module02-03-stitch-lite", "lab", "Stitch lite (break odd cycle)", "Stitch overview", "stitch-lite",
     "Split feature C into C1, C2 to break the odd cycle; DP becomes feasible.",
     "stitch / feature split",
     "Stitching splits a feature so conflicts drop — restoring DP feasibility without extra masks.",
     "GOLDEN: stitch_makes_dp True after splitting C → C1, C2.",
     [("Odd cycle", "01-odd", "Triangle A-B-C blocked LELE on full graph."),
      ("Split C", "02-split", "Remove C; add C1 and C2 far apart."),
      ("New edges", "03-edges", "Fewer conflicts — triangle broken."),
      ("Re-color", "04-recolor", "BFS 2-color on the stitched layout."),
      ("DP OK", "05-ok", "GOLDEN: dp_ok=True after stitch.")],
     "Open **stitch-lite**. Run stitch; confirm dp_ok=True.",
     "Call stitch_feature('C'); assert dp_ok is True.",
     "Splitting without reducing conflicts. Assuming stitch always needs TP.",
     "Next: triple patterning with 3 colors.",
     "split C → C1,C2; rebuild graph; is_bipartite → dp_ok",
     [{"q": "stitch_makes_dp?", "choices": ["True", "False", "3 masks", "N/A"], "answer": 0},
      {"q": "Feature split?", "choices": ["C → C1,C2", "A → A1,A2", "D removed", "F only"], "answer": 0},
      {"q": "Stitch goal?", "choices": ["restore DP", "add TP always", "SADP mandrels", "DRC width"], "answer": 0}]),
    ("module03-01-triple-color", "lab", "Triple patterning (3-color)", "Triple patterning", "triple-color",
     "3-color the conflict graph via backtracking when DP fails.",
     "triple patterning backtracking 3-color",
     "When two masks fail, triple patterning assigns three masks with a 3-coloring.",
     "GOLDEN: colors_used=3, ok=True on tiny_mp.",
     [("Need 3", "01-need", "Full graph fails 2-color — need third mask."),
      ("Backtrack", "02-bt", "Backtracking search over mask assignments."),
      ("Assign", "03-asg", "Assign colors 1..3 respecting adjacency."),
      ("Used 3", "04-used", "All three masks used on the toy."),
      ("Success", "05-ok", "GOLDEN: ok=True, colors_used=3.")],
     "Open **triple-color**. Run triple backtrack; confirm colors_used=3.",
     "Call triple_pattern(method='backtrack'); assert ok and colors_used==3.",
     "Greedy-only when backtrack is required. Stopping at 2 colors after stitch lesson.",
     "Next: compare greedy vs backtrack decompositions.",
     "color_backtrack(G, k=3) → colors_used, ok",
     [{"q": "colors_used golden?", "choices": ["3", "2", "4", "1"], "answer": 0},
      {"q": "Triple ok on toy?", "choices": ["True", "False", "unknown", "only path"], "answer": 0},
      {"q": "Method taught?", "choices": ["backtrack", "SADP", "scanline", "boolean"], "answer": 0}]),
    ("module03-03-triple-decomp", "lab", "Triple decomp literacy", "Decomp literacy", "triple-decomp",
     "Compare greedy vs backtracking 3-coloring on the same conflict graph.",
     "greedy vs backtrack 3-color compare",
     "Production flows may use greedy heuristics or exact backtrack — know when they differ.",
     "On tiny_mp both methods succeed; colors_used=3 for greedy and backtrack.",
     [("Greedy", "01-greedy", "color_greedy(G, 3) in node-id order."),
      ("Backtrack", "02-bt", "color_backtrack(G, 3) complete search."),
      ("Same used", "03-same", "Both use 3 masks on the golden toy."),
      ("Methods", "04-cmp", "Compare ok, colors_used, and assignment order."),
      ("Choose", "05-pick", "Pick method by graph size and runtime budget.")],
     "Open **triple-decomp**. Run both methods; compare colors_used.",
     "Compare color_greedy(G,3) vs color_backtrack(G,3); assert both ok.",
     "Assuming greedy always equals backtrack. Ignoring failure cases on larger graphs.",
     "Next: quad patterning with headroom.",
     "color_greedy(G,3) vs color_backtrack(G,3)",
     [{"q": "Greedy k on this lab?", "choices": ["3", "2", "4", "1"], "answer": 0},
      {"q": "Backtrack searches?", "choices": ["complete assignments", "mandrels only", "DRC width", "via enclosure"], "answer": 0},
      {"q": "Toy colors_used?", "choices": ["3", "2", "4", "5"], "answer": 0}]),
    ("module03-05-quad-color", "lab", "Quad patterning (4-color greedy)", "Quad patterning", "quad-color",
     "Greedy 4-color the conflict graph; toy needs only 3 of 4 masks.",
     "quad patterning greedy 4-color",
     "Quad patterning reserves four masks; greedy coloring shows headroom when fewer suffice.",
     "GOLDEN: colors_used=3, k=4, ok=True on tiny_mp.",
     [("Four masks", "01-four", "k=4 mask slots available."),
      ("Greedy", "02-greedy", "color_greedy(G, 4) assigns lowest free mask."),
      ("Used 3", "03-used", "Only three masks needed on the toy."),
      ("Headroom", "04-head", "Fourth mask unused — runtime margin."),
      ("OK", "05-ok", "GOLDEN: ok=True, colors_used=3 ≤ k=4.")],
     "Open **quad-color**. Run quad greedy; confirm colors_used=3.",
     "Call quad_pattern(method='greedy'); assert ok and colors_used==3.",
     "Requiring all four masks used. Confusing QP with TP.",
     "Next: multi-patterning engine pass.",
     "color_greedy(G, k=4) → colors_used ≤ 4",
     [{"q": "colors_used golden?", "choices": ["3", "4", "2", "6"], "answer": 0},
      {"q": "k for quad?", "choices": ["4", "3", "2", "1"], "answer": 0},
      {"q": "Quad ok on toy?", "choices": ["True", "False", "DP only", "unknown"], "answer": 0}]),
    ("module04-01-mp-engine", "lab", "Multi-patterning engine", "MP engine", "mp-engine",
     "Try DP → TP → QP; report best_masks and per-mode feasibility.",
     "multi-patterning engine DP/TP/QP cascade",
     "A tiny MP engine picks the minimum mask count that succeeds on the layout.",
     "GOLDEN: best_masks=3, dp_ok=False, tp_ok=True.",
     [("Try DP", "01-dp", "Run LELE 2-color first."),
      ("Fail", "02-fail", "dp_ok=False — triangle blocks two masks."),
      ("Try TP", "03-tp", "Backtracking 3-color on conflict graph."),
      ("Best 3", "04-best", "GOLDEN: best_masks=3 when TP succeeds."),
      ("Report", "05-rpt", "Emit dp_ok, tp_ok, qp_ok, best_masks.")],
     "Open **mp-engine**. Run engine; confirm best_masks=3.",
     "Call mp_engine(); assert best_masks==3 and dp_ok is False and tp_ok is True.",
     "Stopping after DP failure. Reporting QP when TP already succeeds.",
     "Next: offline benchmark compare, then wrap.",
     "try DP; else TP; else QP; best_masks ← min success k",
     [{"q": "best_masks golden?", "choices": ["3", "2", "4", "6"], "answer": 0},
      {"q": "dp_ok on toy?", "choices": ["False", "True", "N/A", "unknown"], "answer": 0},
      {"q": "tp_ok on toy?", "choices": ["True", "False", "only path", "no"], "answer": 0}]),
    ("module05-01-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline compare", None,
     "Print mp_compare metrics offline without the browser.", None,
     "Track A prints mp_compare without the browser.",
     "Load tiny_mp.json; print feature_count, conflict_edges, dp_ok, best_masks, stitch_dp_ok, sadp_mandrels."),
    ("module99-00-wrap", "wrap", "Multi-patterning path complete", "Wrap", None,
     "Recap conflict graphs, DP/TP/QP, SADP, stitch, and engine goldens.", None,
     "You decomposed tiny_mp: 5 conflicts, DP fails, TP uses 3 masks, stitch restores DP, engine best_masks=3.",
     "Natural next: learn_drc or learn_rule_dsl."),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_mp.json`.
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

**learn_multi_patterning** teaches conflict-graph decomposition for DP/TP/QP (plus SADP and stitch literacy).

**Prerequisite:** [learn_pattern_matching](../learn_pattern_matching/README.md) / geometry spine. **Next:** [learn_drc](../learn_drc/README.md) or [learn_rule_dsl](../learn_rule_dsl/README.md).

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

→ **learn_drc** or **learn_rule_dsl** ([`eda.md`](../../../eda.md))

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
                  "Six features A–F; triangle A-B-C blocks DP; path D-E-F is 2-colorable; TP needs 3 masks.", "",
                  "## Slide 5 — Path", "",
                  "Conflict graph, LELE, bipartite check, SADP, stitch, triple/quad color, engine.", "",
                  "## Slide 6 — Begin", "", "Next: conflict graph construction.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "Five conflicts; DP fails; TP uses 3 masks; stitch restores DP; engine best_masks=3.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can explain DP vs TP vs QP on tiny_mp.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  "python3 -c \"from solvers import mp_compare; print(mp_compare())\" in common/", "",
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
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_drc", "learn_pattern_matching", "learn_compaction"], "answer": 0},
            {"id": "q3", "question": "Engine best_masks golden?", "choices": ["3", "2", "6", "0"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_multi_patterning — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))
    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nMulti-patterning decomposition: conflict graphs, LELE DP (2-color), "
          "SADP mandrels, stitch, triple/quad coloring, MP engine cascade.\n"
          "In: conflict graph → mask assignment → engine best_masks.\n"
          "Out: full OPC/SMO, production decomposition ECO, commercial MP signoff.\n")
    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_mp.json`\n"
          "- **B:** platform `#multi-patterning` browser tools\n")
    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_multi_patterning

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-multi--patterning-orange)](docs/MODULES.md)

**learn_multi_patterning** is the open learning path for *multi-patterning decomposition* — conflict graphs, LELE double patterning, SADP/stitch literacy, triple/quad coloring, and a tiny MP engine.

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

Open [platform courses](../../platform/courses/learn_multi_patterning/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_multi_patterning/scripts/scaffold_course.py
bash courses/learn_multi_patterning/scripts/capture_all_walkthroughs.sh
bash courses/learn_multi_patterning/scripts/capture_lab_snaps.sh
bash courses/learn_multi_patterning/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_multi_patterning --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#multi-patterning` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#multi-patterning

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
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_mp.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_mp.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_mp.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_multi_patterning
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {mid} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_multi_patterning/{mid}" --inject-transcript'
              for mid in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_multi_patterning/module*/; do
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
