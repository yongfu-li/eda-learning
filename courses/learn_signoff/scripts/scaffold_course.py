#!/usr/bin/env python3
"""Scaffold learn_signoff with module-slides stubs. Lab status **ref**."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_signoff"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to signoff", "Welcome", None,
     "Explain PVT corners, signoff derate, check suite, ECO loop, tapeout checklist, and markers on tiny_signoff after DFT insert.",
     None,
     "After DFT insert you need signoff — corners, derate, checks, ECO, tapeout gates, markers.",
     "Toy tiny_signoff: 3 corners, ss_0p9_125 derate=1.1, fail_count=2, 2 ECOs, tapeout ready after ECO."),
    ("module01-01-corners", "lab", "PVT corners", "Why corners", "corners",
     "List PVT corners; count corner_count=3.",
     "PVT corner listing",
     "Signoff starts from a small set of process/voltage/temperature corners.",
     "GOLDEN: corner_count=3.",
     [("PVT triple", "01-pvt", "Three corners: ss, tt, ff."),
      ("ss corner", "02-ss", "ss_0p9_125: Vdd=0.9, temp=125, derate=1.1."),
      ("tt corner", "03-tt", "tt_1p0_25: nominal Vdd and temp."),
      ("ff corner", "04-ff", "ff_1p1_m40: fast process, low temp."),
      ("Golden", "05-golden", "GOLDEN: corner_count=3.")],
     "Open **corners**. Inspect tiny_signoff; confirm 3 corners.",
     "Call list_corners(); assert count==3.",
     "Confusing signoff corner with full MCMM. Missing derate field.",
     "Next: pick signoff corner.",
     "corners ← design.corners; count ← len(corners)",
     [{"q": "corner count?", "choices": ["3", "2", "6", "1"], "answer": 0},
      {"q": "ss corner id?", "choices": ["ss_0p9_125", "tt_1p0_25", "ff_1p1_m40", "ss_1p0_25"], "answer": 0},
      {"q": "ss derate?", "choices": ["1.1", "1.0", "0.9", "1.25"], "answer": 0}]),
    ("module01-03-signoff-corner", "lab", "Signoff corner pick", "Why signoff corner", "signoff-corner",
     "Pick signoff_corner ss_0p9_125 with derate=1.1.",
     "signoff corner selection",
     "The slow-slow hot corner is the pessimistic signoff PVT for delay.",
     "GOLDEN: signoff_corner=ss_0p9_125, derate=1.1.",
     [("Pick corner", "01-pick", "signoff_corner selects ss_0p9_125."),
      ("Vdd 0.9", "02-vdd", "Lower Vdd at high temp."),
      ("Temp 125", "03-temp", "Hot slow corner for max delay."),
      ("Derate 1.1", "04-derate", "Corner derate scales reported delay."),
      ("Golden", "05-golden", "GOLDEN: ss_0p9_125 derate=1.1.")],
     "Open **signoff-corner**. Confirm ss_0p9_125 and derate 1.1.",
     "Call pick_signoff_corner(); assert id and derate match goldens.",
     "Using tt for signoff. Ignoring derate on ss.",
     "Next: apply derate.",
     "corner ← corners[signoff_corner]; derate ← corner.derate",
     [{"q": "signoff corner?", "choices": ["ss_0p9_125", "tt_1p0_25", "ff_1p1_m40", "ss_1p0_25"], "answer": 0},
      {"q": "signoff derate?", "choices": ["1.1", "1.0", "0.9", "1.25"], "answer": 0},
      {"q": "ss Vdd?", "choices": ["0.9", "1.0", "1.1", "0.8"], "answer": 0}]),
    ("module02-01-derate", "lab", "Derate formula", "Why derate", "derate",
     "Apply derate: derated = delay × 1.1 for delay=1.0.",
     "signoff derate application",
     "Reported path delay scales by the signoff corner derate.",
     "GOLDEN: derated=1.1 for delay=1.0.",
     [("Delay scale", "01-formula", "derated = delay × signoff derate."),
      ("Input 1.0", "02-in", "Nominal path delay before derate."),
      ("Derate 1.1", "03-rate", "Read derate from signoff corner."),
      ("Result 1.1", "04-out", "1.0 × 1.1 = 1.1 ns derated."),
      ("Golden", "05-golden", "GOLDEN: derated=1.1 for delay=1.0.")],
     "Open **derate**. Run derate on delay=1.0; confirm 1.1.",
     "Call apply_derate(1.0); assert derated==1.1.",
     "Using wrong corner derate. Forgetting multiply order.",
     "Next: check suite.",
     "derated ← delay × pick_signoff_corner().derate",
     [{"q": "derated for delay=1?", "choices": ["1.1", "1.0", "0.9", "1.25"], "answer": 0},
      {"q": "derate value?", "choices": ["1.1", "1.0", "0.9", "2.0"], "answer": 0},
      {"q": "formula?", "choices": ["delay×derate", "delay+derate", "delay/derate", "derate only"], "answer": 0}]),
    ("module02-03-check-suite", "lab", "Check suite", "Why check suite", "check-suite",
     "Run signoff checks; fail_count=2 (sta, antenna).",
     "signoff check suite",
     "STA, DRC, LVS, ERC, antenna, and IR form the toy check suite.",
     "GOLDEN: fail_count=2, pass_count=4.",
     [("Six checks", "01-suite", "STA, DRC, LVS, ERC, Antenna, IR."),
      ("STA fail", "02-sta", "STA slack −0.05 — timing fail."),
      ("Layout pass", "03-layout", "DRC, LVS, ERC all pass."),
      ("Antenna fail", "04-ant", "One antenna violation."),
      ("Golden", "05-golden", "GOLDEN: fail_count=2 (sta, antenna).")],
     "Open **check-suite**. Run checks; confirm 2 fails.",
     "Call run_checks(); assert fail_count==2 and pass_count==4.",
     "Counting IR as fail. Missing antenna in fail set.",
     "Next: ECO loop.",
     "fails ← checks where status=fail; fail_count ← len(fails)",
     [{"q": "fail count?", "choices": ["2", "3", "4", "0"], "answer": 0},
      {"q": "failing checks?", "choices": ["sta+antenna", "drc+lvs", "ir+erc", "sta only"], "answer": 0},
      {"q": "pass count?", "choices": ["4", "2", "6", "3"], "answer": 0}]),
    ("module03-01-eco-loop", "lab", "ECO plan", "Why ECO loop", "eco-loop",
     "Plan ECOs; eco_count=2 fixes sta and antenna.",
     "ECO planning",
     "Engineering change orders map fixes to failing checks.",
     "GOLDEN: eco_count=2, fixes_all=true.",
     [("ECO list", "01-plan", "Two ECOs for failing checks."),
      ("Buffer ECO", "02-eco1", "eco1 buffer on n_crit fixes STA."),
      ("Jumper ECO", "03-eco2", "eco2 jumper on n_ant fixes antenna."),
      ("Covers all", "04-cover", "Both fails covered by ECO fixes."),
      ("Golden", "05-golden", "GOLDEN: eco_count=2, fixes_all=true.")],
     "Open **eco-loop**. Confirm 2 ECOs cover sta+antenna.",
     "Call eco_plan(); assert eco_count==2 and fixes_all.",
     "ECO missing a fail. Double-counting ECOs.",
     "Next: apply ECOs.",
     "covered ← ⋃ eco.fixes; fixes_all ← fails ⊆ covered",
     [{"q": "eco count?", "choices": ["2", "1", "3", "0"], "answer": 0},
      {"q": "eco1 fixes?", "choices": ["sta", "antenna", "drc", "ir"], "answer": 0},
      {"q": "fixes_all?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0}]),
    ("module03-03-apply-ecos", "lab", "Apply fixes", "Why apply ECOs", "apply-ecos",
     "Apply ECOs; fail_count drops to 0.",
     "ECO application",
     "Applying ECOs flips fixed checks from fail to pass.",
     "GOLDEN: fail_count→0 after apply_ecos.",
     [("Apply ECO", "01-apply", "Flip sta and antenna to pass."),
      ("STA fixed", "02-sta", "STA slack becomes +0.02 after buffer."),
      ("Antenna fixed", "03-ant", "Antenna count zero after jumper."),
      ("Others hold", "04-rest", "DRC/LVS/ERC/IR remain pass."),
      ("Golden", "05-golden", "GOLDEN: fail_count→0 after ECO.")],
     "Open **apply-ecos**. Apply ECOs; confirm fail_count=0.",
     "Call apply_ecos(); assert fail_count==0.",
     "Applying ECO without updating check status. Partial apply.",
     "Next: tapeout checklist.",
     "checks ← flip fail→pass for eco-covered ids",
     [{"q": "fail count after?", "choices": ["0", "2", "1", "4"], "answer": 0},
      {"q": "sta after ECO?", "choices": ["pass", "fail", "unknown", "skip"], "answer": 0},
      {"q": "antenna after?", "choices": ["pass", "fail", "unknown", "skip"], "answer": 0}]),
    ("module04-01-tapeout-checklist", "lab", "Tapeout items", "Why tapeout", "tapeout-checklist",
     "Tapeout ready only after ECO; required_count=4.",
     "tapeout checklist",
     "Required tapeout gates block release until checks are clean.",
     "GOLDEN: ready=false before ECO, ready=true after.",
     [("Checklist", "01-items", "Four required tapeout gates plus optional docs."),
      ("Before ECO", "02-before", "Antenna fail blocks tapeout ready."),
      ("Layout gate", "03-t2", "DRC/LVS/ERC must pass for t2."),
      ("After ECO", "04-after", "All required items green after ECO."),
      ("Golden", "05-golden", "GOLDEN: ready only after ECO.")],
     "Open **tapeout-checklist**. Compare before/after ECO ready flags.",
     "Call tapeout_checklist(after_eco=False/True); assert ready flags.",
     "Ignoring optional vs required. Checking before ECO only.",
     "Next: signoff markers.",
     "ready ← all(required items ok); antenna gate blocks before ECO",
     [{"q": "ready before ECO?", "choices": ["False", "True", "unknown", "N/A"], "answer": 0},
      {"q": "ready after ECO?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "required count?", "choices": ["4", "5", "2", "3"], "answer": 0}]),
    ("module04-03-signoff-markers", "lab", "Fail markers", "Why markers", "signoff-markers",
     "Collect fail markers; marker_count=2.",
     "signoff marker collection",
     "Signoff emits markers for each failing check before ECO.",
     "GOLDEN: marker_count=2.",
     [("Check fail", "01-kind", "Markers tag each failing check."),
      ("STA marker", "02-sta", "STA fail emits check_fail marker."),
      ("Antenna marker", "03-ant", "Antenna fail emits second marker."),
      ("No pass markers", "04-pass", "Passing checks do not emit markers."),
      ("Golden", "05-golden", "GOLDEN: marker_count=2.")],
     "Open **signoff-markers**. Run collect; confirm 2 markers.",
     "Call collect_markers(); assert count==2.",
     "Counting pass checks. Markers after ECO without reset.",
     "Next: signoff engine.",
     "markers ← fail checks as check_fail kind",
     [{"q": "marker count?", "choices": ["2", "3", "4", "0"], "answer": 0},
      {"q": "marker checks?", "choices": ["sta+antenna", "drc+lvs", "ir+erc", "all six"], "answer": 0},
      {"q": "marker kind?", "choices": ["check_fail", "eco", "corner", "tapeout"], "answer": 0}]),
    ("module05-01-signoff-engine", "lab", "Signoff engine integration", "Engine", "signoff-engine",
     "Run signoff_engine; confirm all goldens and ok=True.",
     "signoff engine integration",
     "A tiny engine chains corners, checks, ECO, tapeout, and markers.",
     "GOLDEN: corners=3, fails=2, ecos=2, markers=2, ok=True.",
     [("Stats snapshot", "01-stats", "3 corners, 6 checks, 2 ECOs."),
      ("Corner pick", "02-corner", "Signoff corner ss_0p9_125 derate 1.1."),
      ("Check fails", "03-checks", "Two fails before ECO; tapeout blocked."),
      ("ECO + tapeout", "04-eco", "ECOs fix all; tapeout ready after."),
      ("OK", "05-ok", "GOLDEN: engine ok=True.")],
     "Open **signoff-engine**. Run engine; confirm ok.",
     "Call signoff_engine(); assert ok and markers.count==2.",
     "Reporting partial checks. Changing toy without updating goldens.",
     "Next: offline compare, then wrap.",
     "engine: corners + checks + ecos + tapeout → markers; ok ← counts match GOLDENS",
     [{"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "marker_count?", "choices": ["2", "3", "4", "0"], "answer": 0},
      {"q": "fail_count?", "choices": ["2", "0", "4", "1"], "answer": 0}]),
    ("module05-03-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline compare", None,
     "Print signoff_compare metrics offline without the browser.", None,
     "Track A prints signoff_compare without the browser.",
     "Load tiny_signoff.json; print corner_count, fail_count, eco_count, marker_count, ok."),
    ("module99-00-wrap", "wrap", "Signoff path complete", "Wrap", None,
     "Recap corners, derate, checks, ECO, tapeout, markers, engine.", None,
     "You checked tiny_signoff: 3 corners; ss derate=1.1; fails=2; ECOs=2; tapeout after ECO; markers=2; engine ok.",
     "Natural next: learn_yosys / learn_openroad (evidence sidecars)."),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_signoff.json`.
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

**learn_signoff** teaches signoff literacy — PVT corners, signoff derate, check suite, ECO loop, tapeout checklist, markers, and a tiny signoff engine.

**Prerequisite:** [learn_dft_insert](../learn_dft_insert/README.md) or DFT/signoff literacy. **Next:** [learn_yosys](../learn_yosys/README.md) · [learn_openroad](../learn_openroad/README.md) (evidence sidecars).

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

→ **learn_yosys** / **learn_openroad** ([`eda.md`](../../../eda.md))

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
                  "tiny_signoff: 3 corners, ss derate=1.1, fail_count=2, 2 ECOs, tapeout after ECO.", "",
                  "## Slide 5 — Path", "",
                  "Corners → signoff corner → derate → checks → ECO → apply → tapeout → markers → engine.", "",
                  "## Slide 6 — Begin", "", "Next: list PVT corners.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "3 corners; ss derate=1.1; fails=2; ECOs=2; tapeout after ECO; markers=2; engine ok.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can explain the ECO tapeout gate.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  "python3 -c \"from solvers import signoff_compare; print(signoff_compare())\" in common/", "",
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
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_dft_insert", "learn_power", "learn_antenna"], "answer": 0},
            {"id": "q3", "question": "marker_count golden?", "choices": ["2", "3", "4", "0"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_signoff — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))

    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nSignoff literacy: PVT corners, signoff derate, check suite, "
          "ECO planning/application, tapeout checklist, marker collection, tiny signoff_engine.\n"
          "In: corners → derate → checks → ECO → tapeout → markers → engine goldens on tiny_signoff.\n"
          "Out: full MCMM decks, foundry signoff (see learn_yosys / learn_openroad evidence).\n")

    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_signoff.json`\n"
          "- **B:** platform `#signoff` browser tools\n")

    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_signoff

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-Signoff-orange)](docs/MODULES.md)

**learn_signoff** is the open learning path for *signoff* — PVT corners, signoff derate, check suite, ECO loop, tapeout checklist, markers, and a tiny signoff engine on `tiny_signoff.json`.

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

Open [platform courses](../../platform/courses/learn_signoff/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_signoff/scripts/scaffold_course.py
bash courses/learn_signoff/scripts/capture_all_walkthroughs.sh
bash courses/learn_signoff/scripts/capture_lab_snaps.sh
bash courses/learn_signoff/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_signoff --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#signoff` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#signoff

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
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_signoff.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_signoff.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_signoff.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_signoff
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {mid} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_signoff/{mid}" --inject-transcript'
              for mid in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_signoff/module*/; do
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
