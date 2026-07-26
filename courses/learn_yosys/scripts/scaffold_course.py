#!/usr/bin/env python3
"""Scaffold learn_yosys with module-slides stubs. Lab status **ref**."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_yosys"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to Yosys passes", "Welcome", None,
     "Explain Yosys pass names — proc, flatten, opt/DCE, strash, rewrite, techmap, synth script, report — on tiny_yosys after synthesis literacy.",
     None,
     "After learn_synthesis you need Yosys pass literacy — proc through techmap with named passes and goldens.",
     "Toy tiny_yosys: 6 RTL cells, 2 modules; flatten→1; opt→5; strash→4; rewrite→3; nand area=6 delay=7; report 7/11."),
    ("module01-01-proc-elaborate", "lab", "Proc elaborate", "Why proc", "proc-elaborate",
     "Run proc; report rtl_cell_count=6 after elaboration.",
     "proc / RTL elaboration",
     "The proc pass lowers RTL to a gate-level netlist Yosys can optimize.",
     "GOLDEN: rtl_cell_count=6, module_count=2.",
     [("RTL gate view", "01-gates", "Six gate-level cells after proc on tiny_and_or."),
      ("AND c1", "02-and1", "c1: AND(a,b)→n1 in top."),
      ("OR c2", "03-or", "c2: OR(n1,c)→n2 feeds NOT."),
      ("Duplicate AND", "04-dup", "c3 duplicates c1 — strash target later."),
      ("Golden", "05-golden", "GOLDEN: rtl_cell_count=6.")],
     "Open **proc-elaborate**. Inspect tiny_yosys; confirm 6 cells.",
     "Call pass_proc(); assert cell_count==6.",
     "Confusing proc with synth. Expecting fewer cells before opt.",
     "Next: hierarchy flatten.",
     "proc ← elaborate RTL; report cell_count",
     [{"q": "rtl cell count?", "choices": ["6", "5", "4", "3"], "answer": 0},
      {"q": "module count?", "choices": ["2", "1", "6", "3"], "answer": 0},
      {"q": "first pass name?", "choices": ["proc", "techmap", "strash", "flatten"], "answer": 0}]),
    ("module01-03-hierarchy-flatten", "lab", "Hierarchy flatten", "Why flatten", "hierarchy-flatten",
     "Run flatten; module_count→1 (all cells in top).",
     "hierarchy flatten",
     "Flatten merges child hierarchy so later passes see one module.",
     "GOLDEN: after_flatten_modules=1.",
     [("Two modules", "01-two", "top holds comb; child holds DFF c6."),
      ("child DFF", "02-child", "c6 DFF lives in child before flatten."),
      ("Flatten pass", "03-flat", "flatten moves all cells into top."),
      ("All in top", "04-top", "Every cell module field becomes top."),
      ("Golden", "05-golden", "GOLDEN: after_flatten_modules=1.")],
     "Open **hierarchy-flatten**. Confirm module_count=1.",
     "Call pass_hierarchy_flatten(); assert module_count==1.",
     "Flattening before proc. Forgetting DFF in child.",
     "Next: opt/DCE.",
     "for c in cells: c.module ← top; modules ← [top]",
     [{"q": "modules after flatten?", "choices": ["1", "2", "6", "0"], "answer": 0},
      {"q": "c6 module after?", "choices": ["top", "child", "dead", "nand"], "answer": 0},
      {"q": "pass name?", "choices": ["flatten", "proc", "strash", "rewrite"], "answer": 0}]),
    ("module02-01-opt-dce", "lab", "Opt / DCE", "Why opt", "opt-dce",
     "Run opt; remove dead BUF c4; cells=5.",
     "opt / dead-code elimination",
     "opt removes unreachable logic such as BUF tied to const0.",
     "GOLDEN: after_opt_cells=5, removed c4.",
     [("Dead BUF scan", "01-scan", "opt finds BUF tied to const0."),
      ("BUF c4", "02-buf", "c4: BUF(const0)→dead never reaches PO."),
      ("Remove c4", "03-drop", "DCE drops unreachable dead cell."),
      ("Five cells", "04-five", "Remaining comb+seq after opt."),
      ("Golden", "05-golden", "GOLDEN: after_opt_cells=5.")],
     "Open **opt-dce**. Run opt; confirm cells=5 and c4 removed.",
     "Call pass_opt_dce(); assert cell_count==5 and c4 in removed.",
     "Removing live cells. Skipping opt before strash.",
     "Next: AIG strash.",
     "removed ← {BUF tied const0}; cells ← cells \\ removed",
     [{"q": "cells after opt?", "choices": ["5", "6", "4", "3"], "answer": 0},
      {"q": "removed cell?", "choices": ["c4", "c3", "c1", "c6"], "answer": 0},
      {"q": "c4 type?", "choices": ["BUF", "AND", "NOT", "DFF"], "answer": 0}]),
    ("module02-03-aig-strash", "lab", "AIG strash", "Why strash", "aig-strash",
     "Run strash; merge duplicate AND c1/c3; cells=4.",
     "structural hashing (strash)",
     "strash merges structurally identical AND(a,b) and retargets fans.",
     "GOLDEN: after_strash_cells=4, merge n3→n1.",
     [("Hash key table", "01-hash", "Identical AND(a,b) keys merge."),
      ("c1 and c3", "02-c1c3", "Both AND(a,b) — c3 is duplicate."),
      ("Merge n3→n1", "03-merge", "Retarget fans; drop c3."),
      ("Four cells", "04-four", "One AND remains after strash."),
      ("Golden", "05-golden", "GOLDEN: after_strash_cells=4.")],
     "Open **aig-strash**. Confirm cells=4 and n3 merged.",
     "Call pass_aig_strash(); assert cell_count==4.",
     "Merging unlike cells. Forgetting fan retarget.",
     "Next: rewrite.",
     "hash[AND,a,b] ← y; remap fans; drop duplicate",
     [{"q": "cells after strash?", "choices": ["4", "5", "3", "6"], "answer": 0},
      {"q": "merged net?", "choices": ["n3", "n1", "n2", "out"], "answer": 0},
      {"q": "duplicate AND?", "choices": ["c3", "c4", "c5", "c6"], "answer": 0}]),
    ("module03-01-rewrite-balance", "lab", "Rewrite balance", "Why rewrite", "rewrite-balance",
     "Run rewrite; absorb OR+NOT→NOR; cells=3 (comb=2, seq=1).",
     "rewrite / balance",
     "rewrite absorbs OR followed by NOT into a single NOR cell.",
     "GOLDEN: after_rewrite_cells=3, comb=2, seq=1.",
     [("OR+NOT pair", "01-pair", "c2 OR feeds c5 NOT on out."),
      ("Absorb to NOR", "02-absorb", "Replace OR+NOT with single NOR rw_c2."),
      ("Comb count", "03-comb", "Two combinational cells after rewrite."),
      ("Seq hold", "04-seq", "DFF c6 unchanged — seq=1."),
      ("Golden", "05-golden", "GOLDEN: after_rewrite_cells=3.")],
     "Open **rewrite-balance**. Confirm cells=3 and NOR present.",
     "Call pass_rewrite(); assert cell_count==3 and comb_count==2.",
     "Rewriting DFF. Missing OR+NOT pattern.",
     "Next: techmap area.",
     "OR+NOT → NOR; drop OR and NOT cells",
     [{"q": "cells after rewrite?", "choices": ["3", "4", "5", "2"], "answer": 0},
      {"q": "comb count?", "choices": ["2", "3", "1", "4"], "answer": 0},
      {"q": "new cell type?", "choices": ["NOR", "AND", "BUF", "OR"], "answer": 0}]),
    ("module03-03-techmap-area", "lab", "Techmap area", "Why area map", "techmap-area",
     "Run techmap area; nand_count=6.",
     "techmap area mode",
     "techmap maps AND/NOR to a NAND2 library minimizing cell count.",
     "GOLDEN: techmap_nand_count_area=6.",
     [("NAND2 library", "01-lib", "Map AND/NOR to NAND2 cells."),
      ("AND → 2 NAND", "02-and", "Each AND uses two NAND (inverter trick)."),
      ("NOR → 4 NAND", "03-nor", "NOR mapped with four NAND in area mode."),
      ("NAND count", "04-count", "Count pure NAND2 instances."),
      ("Golden", "05-golden", "GOLDEN: techmap_nand_count_area=6.")],
     "Open **techmap-area**. Confirm nand_count=6.",
     "Call pass_techmap(mode='area'); assert nand_count==6.",
     "Counting DFF as NAND. Using delay mapping.",
     "Next: techmap delay.",
     "cells ← map_to_nand2(design); nand_count ← count(NAND2)",
     [{"q": "nand area count?", "choices": ["6", "7", "4", "3"], "answer": 0},
      {"q": "mapped cell type?", "choices": ["NAND2", "AND", "OR", "NOR"], "answer": 0},
      {"q": "techmap mode?", "choices": ["area", "delay", "power", "drc"], "answer": 0}]),
    ("module04-01-techmap-delay", "lab", "Techmap delay", "Why delay map", "techmap-delay",
     "Run techmap delay; nand_count=7 (extra buffer NAND).",
     "techmap delay mode",
     "Delay-oriented techmap adds buffer NAND for timing literacy.",
     "GOLDEN: techmap_nand_count_delay=7.",
     [("Extra buffer NAND", "01-extra", "Delay mode adds buffer NAND on NOR path."),
      ("NOR five NAND", "02-nor5", "NOR path uses five NAND vs four in area."),
      ("Total NAND", "03-total", "Seven NAND2 cells in delay mapping."),
      ("Area vs delay", "04-trade", "Compare nand=6 area vs nand=7 delay."),
      ("Golden", "05-golden", "GOLDEN: techmap_nand_count_delay=7.")],
     "Open **techmap-delay**. Confirm nand_count=7.",
     "Call pass_techmap(mode='delay'); assert nand_count==7.",
     "Expecting same count as area. Ignoring DFF passthrough.",
     "Next: synth script.",
     "delay_map ← area_map + extra_nand_buffer on NOR",
     [{"q": "nand delay count?", "choices": ["7", "6", "4", "11"], "answer": 0},
      {"q": "area nand count?", "choices": ["6", "7", "5", "3"], "answer": 0},
      {"q": "delay adds?", "choices": ["buffer NAND", "extra DFF", "more AND", "BUF"], "answer": 0}]),
    ("module04-03-synth-script", "lab", "Synth script", "Why synth", "synth-script",
     "Run synth recipe: proc→flatten→opt→strash→rewrite→techmap.",
     "synth script recipe",
     "A Yosys synth script chains named passes into one recipe.",
     "GOLDEN: full chain completes with nand area mapping.",
     [("Pass recipe chain", "01-chain", "proc → flatten → opt → strash → rewrite → techmap."),
      ("proc step", "02-proc", "Start from RTL gate netlist."),
      ("Mid passes", "03-mid", "opt/strash/rewrite shrink to mapped base."),
      ("techmap area", "04-map", "Final techmap emits NAND library."),
      ("Golden", "05-golden", "GOLDEN: synth recipe completes.")],
     "Open **synth-script**. Run synth; confirm mapped netlist.",
     "Call pass_synth_script(); assert nand_count==6.",
     "Skipping flatten. Wrong pass order.",
     "Next: yosys engine.",
     "synth ← proc; flatten; opt; strash; rewrite; techmap area",
     [{"q": "first pass in recipe?", "choices": ["proc", "techmap", "strash", "report"], "answer": 0},
      {"q": "cells after rewrite?", "choices": ["3", "6", "5", "7"], "answer": 0},
      {"q": "final techmap mode?", "choices": ["area", "delay", "none", "drc"], "answer": 0}]),
    ("module05-01-yosys-engine", "lab", "Yosys engine integration", "Engine", "yosys-engine",
     "Run yosys_engine; confirm all goldens and ok=True; report 7/11.",
     "yosys engine integration",
     "A tiny engine chains all passes and compares report stats to goldens.",
     "GOLDEN: engine_ok=True, report_cells=7, report_wires=11.",
     [("Pipeline snapshot", "01-snap", "Engine runs all passes and compares goldens."),
      ("Opt golden", "02-opt", "after_opt_cells=5."),
      ("Strash golden", "03-strash", "after_strash_cells=4."),
      ("Report stats", "04-report", "report cells=7 wires=11 after synth."),
      ("OK", "05-ok", "GOLDEN: engine_ok=True.")],
     "Open **yosys-engine**. Run engine; confirm ok and report 7/11.",
     "Call yosys_engine(); assert ok and report cell/wire counts.",
     "Reporting partial passes. Changing IR without updating goldens.",
     "Next: Yosys CLI modules (Part B), then wrap.",
     "engine: all passes → report; ok ← counts match GOLDENS",
     [{"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "report cells?", "choices": ["7", "6", "11", "5"], "answer": 0},
      {"q": "report wires?", "choices": ["11", "7", "6", "4"], "answer": 0}]),
    ("module99-00-wrap", "wrap", "Yosys path complete", "Wrap", None,
     "Recap proc, flatten, opt, strash, rewrite, techmap, synth, engine.", None,
     "You checked tiny_yosys: 6 RTL cells; flatten→1; opt→5; strash→4; rewrite→3; nand 6/7; report 7/11; engine ok.",
     "Natural next: learn_openroad (place/route evidence)."),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_yosys.json`.
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

**learn_yosys** teaches Yosys pass pipeline literacy — proc, flatten, opt/DCE, strash, rewrite, techmap, synth script, report, and a tiny yosys engine on `tiny_yosys.json`. Links to [learn_synthesis](../learn_synthesis/README.md) concepts (AIG, rewrite, techmap).

**Prerequisite:** [learn_synthesis](../learn_synthesis/README.md) or synthesis literacy. **Next:** [learn_openroad](../learn_openroad/README.md).

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

→ **learn_openroad** ([`eda.md`](../../../eda.md))

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
                  "tiny_yosys: 6 cells, 2 modules; opt→5; strash→4; rewrite→3; nand 6/7; report 7/11.", "",
                  "## Slide 5 — Path", "",
                  "proc → flatten → opt → strash → rewrite → techmap → synth → report → engine.", "",
                  "## Slide 6 — Begin", "", "Next: proc elaborate pass.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "6 RTL cells; flatten→1; opt→5; strash→4; rewrite→3; nand 6/7; report 7/11; engine ok.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can name every pass in order.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  "python3 -c \"from solvers import yosys_compare; print(yosys_compare())\" in common/", "",
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
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_synthesis", "learn_signoff", "learn_openroad"], "answer": 0},
            {"id": "q3", "question": "engine_ok golden?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_yosys — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))

    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nYosys pass pipeline literacy: proc, hierarchy flatten, opt/DCE, "
          "AIG strash, rewrite, techmap area/delay, synth script, report, tiny yosys_engine.\n"
          "In: proc → flatten → opt → strash → rewrite → techmap → report goldens on tiny_yosys.\n"
          "Out: full Yosys CLI, ABC integration, industrial libs (see learn_openroad evidence).\n")

    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_yosys.json`\n"
          "- **B:** platform `#yosys` browser tools\n")

    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_yosys

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-Yosys-orange)](docs/MODULES.md)

**learn_yosys** is the open learning path for *Yosys pass pipeline* — proc → opt → strash → rewrite → techmap → report on `tiny_yosys.json`, linking to learn_synthesis concepts.

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

Open [platform courses](../../platform/courses/learn_yosys/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_yosys/scripts/scaffold_course.py
bash courses/learn_yosys/scripts/capture_all_walkthroughs.sh
bash courses/learn_yosys/scripts/capture_lab_snaps.sh
bash courses/learn_yosys/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_yosys --modules
python3 platform/scripts/publish_course_platform.py learn_yosys
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#yosys` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#yosys

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
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_yosys.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_yosys.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_yosys.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_yosys
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {mid} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_yosys/{mid}" --inject-transcript'
              for mid in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_yosys/module*/; do
  base=$(basename "$m")
  case "$base" in module00-*|module99-*) continue ;; esac
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
