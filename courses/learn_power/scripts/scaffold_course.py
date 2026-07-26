#!/usr/bin/env python3
"""Scaffold learn_power with module-slides stubs. Lab status **ref**."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_power"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to power analysis", "Welcome", None,
     "Explain switching/leakage power, IR drop, and EM checks on tiny_power after antenna literacy.",
     None,
     "After antenna you need power — Psw/Pleak, grid IR, EM limits, markers.",
     "Toy tiny_power: Psw n1=1.0, chip Ptot=5.55, ir_drop_sink=0.4, 4 markers."),
    ("module01-01-switching-power", "lab", "Switching power", "Why switching", "switching-power",
     "Compute Psw = α·C·V²·f per net; read activity and capacitance.",
     "switching power per net",
     "Dynamic power scales with activity, cap, voltage squared, and frequency.",
     "GOLDEN: psw_n1=1.0.",
     [("Psw formula", "01-formula", "Psw = α · C · V² · f per net."),
      ("n1", "02-n1", "n1: α=0.5, C=2 → Psw=1.0."),
      ("n2", "03-n2", "n2: α=0.2, C=1 → Psw=0.2."),
      ("n3", "04-n3", "n3: α=1.0, C=4 → Psw=4.0."),
      ("Golden", "05-golden", "GOLDEN: psw_n1=1.0; chip_psw=5.2.")],
     "Open **switching-power**. Inspect tiny_power; confirm n1 Psw=1.0.",
     "Call switching_power(); assert by_net['n1']==1.0.",
     "Forgetting V². Using leakage instead of switching.",
     "Next: leakage power.",
     "Psw[n] ← α[n] · C[n] · V² · f",
     [{"q": "psw n1 golden?", "choices": ["1.0", "0.1", "5.55", "0.5"], "answer": 0},
      {"q": "chip_psw?", "choices": ["5.2", "1.0", "0.35", "4.0"], "answer": 0},
      {"q": "Psw formula uses?", "choices": ["α·C·V²·f", "Ileak·V", "I·R", "metal/gate"], "answer": 0}]),
    ("module01-03-leakage-power", "lab", "Leakage power", "Why leakage", "leakage-power",
     "Compute Pleak = Ileak·V per net.",
     "leakage power per net",
     "Static leakage current times supply voltage gives Pleak.",
     "GOLDEN: plk_n1=0.1.",
     [("Pleak formula", "01-formula", "Pleak = Ileak · V per net."),
      ("n1", "02-n1", "n1: Ileak=0.1, V=1 → Pleak=0.1."),
      ("n2", "03-n2", "n2: Ileak=0.05 → Pleak=0.05."),
      ("n3", "04-n3", "n3: Ileak=0.2 → Pleak=0.2."),
      ("Golden", "05-golden", "GOLDEN: plk_n1=0.1; chip_plk=0.35.")],
     "Open **leakage-power**. Confirm n1 Pleak=0.1.",
     "Call leakage_power(); assert by_net['n1']==0.1.",
     "Mixing Ileak with switching alpha. Wrong voltage.",
     "Next: total power.",
     "Pleak[n] ← Ileak[n] · V",
     [{"q": "plk n1?", "choices": ["0.1", "1.0", "0.35", "5.2"], "answer": 0},
      {"q": "chip_plk?", "choices": ["0.35", "0.1", "5.55", "1.1"], "answer": 0},
      {"q": "Pleak uses?", "choices": ["Ileak·V", "α·C·V²·f", "I·R drop", "ratio"], "answer": 0}]),
    ("module02-01-total-power", "lab", "Total power", "Why total", "total-power",
     "Sum Psw + Pleak per net and for the chip.",
     "total power aggregation",
     "Signoff reports chip Ptot = sum of switching and leakage.",
     "GOLDEN: chip_ptot=5.55.",
     [("Chip Ptot", "01-sum", "Ptot = Psw + Pleak per net; sum for chip."),
      ("n1", "02-n1", "n1: 1.0 + 0.1 = 1.1."),
      ("chip_sw", "03-sw", "Chip switching 5.2."),
      ("chip_lk", "04-lk", "Chip leakage 0.35."),
      ("Golden", "05-golden", "GOLDEN: chip_ptot=5.55.")],
     "Open **total-power**. Confirm chip Ptot=5.55.",
     "Call total_power(); assert total==5.55.",
     "Summing only one component. Double-counting nets.",
     "Next: activity factors.",
     "Ptot ← Σ(Psw + Pleak); chip ← Σ nets",
     [{"q": "chip_ptot?", "choices": ["5.55", "5.2", "1.1", "0.35"], "answer": 0},
      {"q": "ptot n1?", "choices": ["1.1", "1.0", "0.1", "5.55"], "answer": 0},
      {"q": "Ptot equals?", "choices": ["Psw+Pleak", "Psw only", "IR drop", "EM count"], "answer": 0}]),
    ("module02-03-activity-factors", "lab", "Activity factors", "Why activity", "activity-factors",
     "Read per-net activity α that scales switching.",
     "activity factor extraction",
     "Lower α on quiet nets reduces reported switching power.",
     "GOLDEN: alphas n1=0.5, n2=0.2, n3=1.0.",
     [("Alpha per net", "01-alpha", "Activity α scales switching — read per net."),
      ("n1", "02-n1", "n1 α=0.5."),
      ("n2", "03-n2", "n2 α=0.2."),
      ("n3", "04-n3", "n3 α=1.0 (fully active)."),
      ("Golden", "05-golden", "GOLDEN: alphas n1=0.5, n2=0.2, n3=1.0.")],
     "Open **activity-factors**. Confirm the three alphas.",
     "Call activity_factors(); assert alphas match goldens.",
     "Confusing α with Ileak. Using mean instead of per-net.",
     "Next: power grid.",
     "α[n] ← net activity; Psw scales by α[n]",
     [{"q": "alpha n1?", "choices": ["0.5", "0.2", "1.0", "0.1"], "answer": 0},
      {"q": "alpha n3?", "choices": ["1.0", "0.5", "0.2", "4.0"], "answer": 0},
      {"q": "α affects?", "choices": ["switching", "leakage only", "IR drop", "EM limit"], "answer": 0}]),
    ("module03-01-power-grid", "lab", "Power grid", "Why grid", "power-grid",
     "Build series grid src→a→b→sink with resistive edges.",
     "power grid topology",
     "IR analysis starts from a resistive grid and sink current.",
     "GOLDEN: 4 nodes, 3 series edges.",
     [("Series path", "01-path", "Grid src→a→b→sink with 3 series edges."),
      ("e1", "02-e1", "e1: src→a, R=1."),
      ("e2", "03-e2", "e2: a→b, R=2."),
      ("e3", "04-e3", "e3: b→sink, R=1."),
      ("Golden", "05-golden", "GOLDEN: 4 nodes, 3 edges series.")],
     "Open **power-grid**. Confirm 4 nodes and 3 edges.",
     "Call build_power_grid(); assert edge_count==3.",
     "Treating grid as parallel. Wrong node order.",
     "Next: IR drop.",
     "grid: nodes src→…→sink; edges in series path",
     [{"q": "node count?", "choices": ["4", "3", "5", "2"], "answer": 0},
      {"q": "edge count?", "choices": ["3", "4", "1", "0"], "answer": 0},
      {"q": "Path type?", "choices": ["series", "parallel", "tree only", "mesh only"], "answer": 0}]),
    ("module03-03-ir-drop", "lab", "IR drop", "Why IR drop", "ir-drop",
     "Solve IR on series path; read v_sink and ir_drop_sink.",
     "IR drop series solve",
     "Same sink current on every edge; accumulate I·R drops.",
     "GOLDEN: ir_drop_sink=0.4, v_sink=0.6.",
     [("IR solve", "01-solve", "Same I on series path; accumulate IR drops."),
      ("i", "02-i", "i_sink=0.1 A on every edge."),
      ("drops", "03-drops", "Drops 0.1 + 0.2 + 0.1 = 0.4 V."),
      ("vsink", "04-vsink", "v_sink = 1.0 − 0.4 = 0.6 V."),
      ("Golden", "05-golden", "GOLDEN: ir_drop_sink=0.4, v_sink=0.6.")],
     "Open **ir-drop**. Confirm v_sink=0.6 and ir_drop=0.4.",
     "Call ir_drop_solve(); assert v_sink==0.6 and ir_drop_sink==0.4.",
     "Using parallel formula. Wrong edge order.",
     "Next: EM literacy.",
     "IR: V[node] ← Vsrc − Σ I·R along path; ir_drop_sink ← Vsrc − Vsink",
     [{"q": "v_sink?", "choices": ["0.6", "0.4", "1.0", "0.1"], "answer": 0},
      {"q": "ir_drop_sink?", "choices": ["0.4", "0.6", "0.3", "0.08"], "answer": 0},
      {"q": "i_sink?", "choices": ["0.1", "0.08", "1.0", "0.4"], "answer": 0}]),
    ("module04-01-em-literacy", "lab", "EM literacy", "Why EM", "em-literacy",
     "Flag edges where grid current exceeds em_limit.",
     "EM current violation detection",
     "Electromigration limits peak current per grid edge.",
     "GOLDEN: em_violation_count=3.",
     [("Current limit", "01-limit", "em_limit=0.08 A per edge."),
      ("i", "02-i", "i_sink=0.1 exceeds limit on all edges."),
      ("e1", "03-e1", "e1: 0.1 > 0.08 — EM violation."),
      ("e23", "04-e23", "e2 and e3 also violate."),
      ("Golden", "05-golden", "GOLDEN: em_violation_count=3.")],
     "Open **em-literacy**. Confirm 3 EM violations.",
     "Call find_em_violations(); assert count==3.",
     "Checking IR instead of per-edge I. Wrong limit units.",
     "Next: power markers.",
     "EM viol ← {e | I_edge > em_limit}",
     [{"q": "em violation count?", "choices": ["3", "1", "4", "0"], "answer": 0},
      {"q": "em_limit?", "choices": ["0.08", "0.3", "0.1", "1.0"], "answer": 0},
      {"q": "All edges violate?", "choices": ["yes", "no", "only e1", "only sink"], "answer": 0}]),
    ("module04-03-power-markers", "lab", "Power markers", "Why markers", "power-markers",
     "Collect IR and EM hits as signoff markers.",
     "power marker collection",
     "Signoff power/IR emits markers for IR drop and EM hits.",
     "GOLDEN: marker_count=4.",
     [("IR marker", "01-ir", "One IR drop hit at sink."),
      ("EM hits", "02-em", "Three EM hits on e1,e2,e3."),
      ("Kind", "03-kind", "kind=ir_drop or em on each hit."),
      ("Collect", "04-collect", "Union IR + EM markers for signoff."),
      ("Golden", "05-golden", "GOLDEN: marker_count=4.")],
     "Open **power-markers**. Run collect; confirm 4 markers.",
     "Call collect_markers(); assert count==4.",
     "Counting only IR. Missing EM edges.",
     "Next: power engine.",
     "markers ← IR hits ∪ EM hits",
     [{"q": "marker_count?", "choices": ["4", "3", "1", "0"], "answer": 0},
      {"q": "IR markers?", "choices": ["1", "3", "4", "0"], "answer": 0},
      {"q": "EM markers?", "choices": ["3", "1", "4", "0"], "answer": 0}]),
    ("module05-01-power-engine", "lab", "Power engine integration", "Engine", "power-engine",
     "Run power_engine; confirm all goldens and ok=True.",
     "power engine integration",
     "A tiny engine chains power, IR, EM, and markers.",
     "GOLDEN: chip Ptot=5.55, ir_drop=0.4, markers=4, ok=True.",
     [("Stats snapshot", "01-stats", "3 nets, 3 grid edges, Vdd=1."),
      ("Power", "02-power", "Psw n1=1.0; chip Ptot=5.55."),
      ("IR", "03-ir", "ir_drop_sink=0.4; 1 IR violation."),
      ("EM", "04-em", "3 EM violations on grid edges."),
      ("OK", "05-ok", "GOLDEN: engine ok=True.")],
     "Open **power-engine**. Run engine; confirm ok.",
     "Call power_engine(); assert ok and markers.count==4.",
     "Reporting partial checks. Changing toy without updating goldens.",
     "Next: offline compare, then wrap.",
     "engine: power + IR + EM → markers; ok ← counts match GOLDENS",
     [{"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "marker_count?", "choices": ["4", "3", "1", "0"], "answer": 0},
      {"q": "chip_ptot?", "choices": ["5.55", "5.2", "1.1", "0.4"], "answer": 0}]),
    ("module05-03-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline compare", None,
     "Print power_compare metrics offline without the browser.", None,
     "Track A prints power_compare without the browser.",
     "Load tiny_power.json; print chip_ptot, ir_drop_sink, marker_count, ok."),
    ("module99-00-wrap", "wrap", "Power path complete", "Wrap", None,
     "Recap switching/leakage, activity, grid, IR, EM, markers, engine.", None,
     "You checked tiny_power: Psw n1=1.0; chip Ptot=5.55; ir_drop 0.4; 4 markers; engine ok.",
     "Natural next: learn_dft_insert / learn_signoff."),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_power.json`.
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

**learn_power** teaches power analysis literacy — switching/leakage, activity, grid IR drop, EM limits, markers, and a tiny power engine.

**Prerequisite:** [learn_antenna](../learn_antenna/README.md) or layout/signoff literacy. **Next:** [learn_dft_insert](../learn_dft_insert/README.md) · [learn_signoff](../learn_signoff/README.md).

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

→ **learn_dft_insert** / **learn_signoff** ([`eda.md`](../../../eda.md))

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
                  "tiny_power: Psw n1=1.0, chip Ptot=5.55, ir_drop_sink=0.4, 4 markers.", "",
                  "## Slide 5 — Path", "",
                  "Switching → leakage → total → activity → grid → IR → EM → markers → engine.", "",
                  "## Slide 6 — Begin", "", "Next: switching power per net.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "Psw n1=1.0; chip Ptot=5.55; ir_drop=0.4; EM=3; markers=4; engine ok.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can explain IR and EM markers.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  "python3 -c \"from solvers import power_compare; print(power_compare())\" in common/", "",
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
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_antenna", "learn_erc", "learn_drc"], "answer": 0},
            {"id": "q3", "question": "marker_count golden?", "choices": ["4", "3", "1", "0"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_power — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))

    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nPower analysis literacy: switching/leakage, activity factors, "
          "power grid, IR drop series solve, EM limits, marker collection, tiny power_engine.\n"
          "In: Psw/Pleak → grid IR → EM → markers → engine goldens on tiny_power.\n"
          "Out: full vectorless/vector power, complex grid solvers, signoff decks (see learn_signoff).\n")

    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_power.json`\n"
          "- **B:** platform `#power` browser tools\n")

    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_power

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-Power-orange)](docs/MODULES.md)

**learn_power** is the open learning path for *power analysis* — switching/leakage, activity, grid IR drop, EM limits, markers, and a tiny power engine on `tiny_power.json`.

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

Open [platform courses](../../platform/courses/learn_power/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_power/scripts/scaffold_course.py
bash courses/learn_power/scripts/capture_all_walkthroughs.sh
bash courses/learn_power/scripts/capture_lab_snaps.sh
bash courses/learn_power/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_power --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#power` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#power

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
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_power.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_power.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_power.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_power
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {mid} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_power/{mid}" --inject-transcript'
              for mid in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_power/module*/; do
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
