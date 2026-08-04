#!/usr/bin/env python3
"""Scaffold learn_netgen course skeleton (Yosys/Magic/OpenSTA-shaped: map → CLI → algorithms → internals)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIP_COMMON = {"tiny_netgen.json", "solvers.py", "README.md"}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


MODULES = [
    ("module00-00-intro", "intro", "Welcome to Netgen", "—"),
    ("module01-01-read-netlists-map", "lab", "Read netlists map", "read-netlists-map"),
    ("module01-03-device-classes-map", "lab", "Device classes map", "device-classes-map"),
    ("module02-01-flatten-permute-map", "lab", "Flatten permute map", "flatten-permute-map"),
    ("module02-03-compare-nets-map", "lab", "Compare nets map", "compare-nets-map"),
    ("module03-01-lvs-report-map", "lab", "LVS report map", "lvs-report-map"),
    ("module03-03-netgen-engine", "lab", "Netgen engine (map)", "netgen-engine"),
    ("module06-01-netgen-cli", "lab", "Netgen CLI & scripts", "netgen-cli"),
    ("module06-03-spice-vocab", "lab", "SPICE vocabulary", "spice-vocab"),
    ("module07-01-real-read-spice", "lab", "Real read SPICE", "real-read-spice"),
    ("module07-03-real-lvs-compare", "lab", "Real LVS compare", "real-lvs-compare"),
    ("module08-01-real-lvs-report", "lab", "Real LVS report", "real-lvs-report"),
    ("module08-03-netgen-evidence", "lab", "Real Netgen evidence", "netgen-evidence"),
    ("module09-01-hash-devices-algo", "lab", "Hash devices algorithm", "hash-devices-algo"),
    ("module09-03-match-nets-algo", "lab", "Match nets algorithm", "match-nets-algo"),
    ("module10-01-permute-pins-algo", "lab", "Permute pins algorithm", "permute-pins-algo"),
    ("module10-03-netgen-algo-engine", "lab", "Netgen algo engine", "netgen-algo-engine"),
    ("module14-01-netcomp-model", "lab", "Obj / Netlist / Element model", "netcomp-model"),
    ("module14-03-read-compare-c", "lab", "Read compare C", "read-compare-c"),
    ("module15-03-contribute-netgen", "lab", "Contribute to Netgen", "contribute-netgen"),
    ("module99-00-wrap", "wrap", "Netgen path complete", "—"),
]


def main() -> None:
    write(
        ROOT / "docs" / "SCOPE.md",
        """# Scope

**Part A (LVS compare map):** interactive Netgen map on `tiny_netgen.json` — read netlists, device classes, flatten/permute, compare nets, LVS report. Same *names* and order as Netgen; browser IR for learning before/alongside the binary.

**Part B (real Netgen evidence):** CLI + Tcl on tiny_inv SPICE netlists — read sch/lay, compare, report, checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**Part C (algorithms + bind):** teaching algorithms on netlist JSON via `common/algo_solvers.py` — hash devices, match nets, permute pins, engine — bound to real Netgen report stats via `partc_bind.py`.

**Part D (internals / contribute):** orientation to the Netgen C tree — Obj / Netlist / Element — plus a contribute checklist. Not a reimplementation of Netgen.

**Prereq:** `learn_lvs` or `learn_magic` (layout + LVS literacy).

**In:** Netgen tool literacy for OpenLane users — map → CLI evidence → algorithms bound to LVS → internals orientation.

**Out:** Full PDK LVS decks, advanced extraction (`learn_pex`), KLayout scripting (`learn_klayout`), OpenROAD PnR (`learn_openroad`).
""",
    )

    write(
        ROOT / "docs" / "TWO_TRACKS.md",
        """# Two tracks

- **A:** `common/` Python solvers
  - Part A map: `solvers.py` on `tiny_netgen.json`
  - Part B evidence: `real_solvers.py` (+ checked-in logs/goldens)
  - Part C algorithms + bind: `algo_solvers.py` / `partc_bind.py`
  - Part D internals: `internals_solvers.py` + `internals/` excerpts
- **B:** platform `#netgen` browser tools
""",
    )

    rows = [
        "# learn_netgen — module index",
        "",
        "| Id | Kind | Title | Lab | Status |",
        "|----|------|-------|-----|--------|",
    ]
    for mid, kind, title, lab in MODULES:
        lab_cell = "—" if lab == "—" else f"`{lab}`"
        status = "—" if kind in ("intro", "wrap") else "planned"
        rows.append(
            f"| `{mid}` | `{kind}` | [{title}](../{mid}/README.md) | {lab_cell} | {status} |"
        )
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))

    write(
        ROOT / "docs" / "WALKTHROUGHS.md",
        """# Walkthroughs

| Lab | Module | Steps |
|-----|--------|-------|
| *(filled as labs ship)* | | |
""",
    )

    toc_lines = "\n".join(
        f"- [{title}]({mid}/README.md)"
        for mid, kind, title, lab in MODULES
        if kind != "intro"
    )
    write(
        ROOT / "README.md",
        f"""# learn_netgen

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-Netgen-orange)](docs/MODULES.md)

**learn_netgen** is the open learning path for *Netgen* — Part A **LVS compare map**, Part B **real Netgen CLI evidence**, Part C **algorithms bound to LVS reports**, then Part D **internals / contribute**. Companion to [learn_lvs](../learn_lvs/README.md) and [learn_magic](../learn_magic/README.md).

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

- [Welcome to Netgen](module00-00-intro/README.md)
{toc_lines}

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_netgen/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_netgen/scripts/scaffold_course.py
python3 courses/learn_netgen/scripts/generate_part_a.py
python3 courses/learn_netgen/scripts/generate_part_b.py
python3 courses/learn_netgen/scripts/generate_part_c.py
python3 courses/learn_netgen/scripts/scaffold_part_d.py
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_netgen --modules
python3 platform/scripts/publish_course_platform.py learn_netgen
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#netgen` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#netgen

## License

CC BY 4.0 — see [LICENSE](LICENSE).
""",
    )

    write(
        ROOT / "module00-00-intro" / "README.md",
        """# Module 00-00-intro: Welcome to Netgen

**Module id:** `module00-00-intro`  
**Kind:** `intro`

← Start · [Course README](../README.md) · [Read netlists map →](../module01-01-read-netlists-map/README.md)

## What this course is

**learn_netgen** has four parts: **Part A** LVS compare map on `tiny_netgen.json`, **Part B** real Netgen CLI evidence, **Part C** algorithms bound to LVS goldens, then **Part D** internals / contribute. Prereq: [learn_lvs](../learn_lvs/README.md) or [learn_magic](../learn_magic/README.md).

## Media

| Artifact | Path |
|----------|------|
| Transcript | [transcript.md](transcript.md) |
| Outline | [outline.yaml](outline.yaml) |
| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |
| Video | [video.mp4](video.mp4) |
| Quiz | [quiz.json](quiz.json) |
""",
    )
    write(
        ROOT / "module00-00-intro" / "transcript.md",
        """# Welcome to Netgen

**Module id:** module00-00-intro
**Lab:** intro
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Netgen

OpenLane uses Netgen for LVS — comparing schematic and layout netlists. This course teaches the tool the same way learn_yosys teaches Yosys: map, then real CLI, then algorithms, then internals.

## Slide 2 — Four parts

Part A is the interactive LVS map. Part B drives real Netgen with Tcl. Part C binds algorithms to LVS goldens. Part D orients you to the netcomp C tree.

## Slide 3 — Prereq

You should know LVS basics from learn_lvs or layout from learn_magic — devices, nets, compare reports.

## Slide 4 — Next

Start with the read netlists map lab, then device classes, then the real CLI modules.
""",
    )
    write(
        ROOT / "module00-00-intro" / "quiz.json",
        """{
  "module": "module00-00-intro",
  "questions": [
    {
      "id": "q1",
      "question": "learn_netgen is primarily about?",
      "choices": [
        "Netgen LVS tool literacy (map → CLI → algorithms → internals)",
        "OpenROAD placement only",
        "SPICE transient only",
        "UVM sequences only"
      ],
      "answer": 0
    },
    {
      "id": "q2",
      "question": "LVS prereq course?",
      "choices": ["learn_lvs or learn_magic", "learn_routing", "learn_spice", "learn_dft_insert"],
      "answer": 0
    },
    {
      "id": "q3",
      "question": "Netgen is used heavily by?",
      "choices": ["OpenLane LVS flow", "Verilator only", "Yosys synthesis only", "Magic paint only"],
      "answer": 0
    }
  ]
}
""",
    )

    for mid, kind, title, lab in MODULES:
        if mid == "module00-00-intro":
            continue
        mdir = ROOT / mid
        if kind == "wrap":
            write(
                mdir / "README.md",
                f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `wrap`

[← Contribute](../module15-03-contribute-netgen/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Part A map, Part B real Netgen evidence, Part C algorithms, and Part D internals.**

## Media

| Artifact | Path |
|----------|------|
| Transcript | [transcript.md](transcript.md) |
| Outline | [outline.yaml](outline.yaml) |
| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |
| Video | [video.mp4](video.mp4) |
| Quiz | [quiz.json](quiz.json) |
""",
            )
            write(
                mdir / "transcript.md",
                f"""# {title}

**Module id:** {mid}
**Lab:** wrap

## Slide 1 — Path complete

You finished the Netgen path: map, real CLI evidence, algorithms bound to LVS reports, and internals literacy.

## Slide 2 — Next

Continue to KLayout / OpenROAD / OpenLane flow courses.
""",
            )
            write(
                mdir / "quiz.json",
                """{
  "module": "module99-00-wrap",
  "questions": [
    {"id": "q1", "question": "Course id?", "choices": ["learn_netgen", "learn_sta", "learn_yosys", "learn_openlane"], "answer": 0},
    {"id": "q2", "question": "Part B proves?", "choices": ["Real Netgen CLI/reports", "OpenSTA timing only", "Place only", "DRC only"], "answer": 0},
    {"id": "q3", "question": "Golden mismatch count?", "choices": ["0", "2", "4", "6"], "answer": 0}
  ]
}
""",
            )
            continue

        write(
            mdir / "README.md",
            f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · planned

[Course README](../README.md)

## Outcomes

After this module you can work the **{title}** Netgen topic (scaffold — content ships next).

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md).
2. Complete [CHECKLIST.md](CHECKLIST.md).

### Track B — Browser lab

1. Local: http://127.0.0.1:8080/tools/{lab}/ *(when tool ships)*

## Media

| Artifact | Path |
|----------|------|
| Transcript | [transcript.md](transcript.md) |
| Outline | [outline.yaml](outline.yaml) |
| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |
| Video | [video.mp4](video.mp4) |
| Quiz | [quiz.json](quiz.json) |
""",
        )
        write(
            mdir / "EXAMPLES.md",
            f"""# Examples — {title}

## Track A

```bash
cd courses/learn_netgen/common
python3 solvers.py
```

## Pseudocode

```text
load tiny_netgen.json
run Netgen stages for {lab}
ok if goldens match
```
""",
        )
        write(
            mdir / "CHECKLIST.md",
            f"""# Checklist — {title}

- [ ] Read EXAMPLES.md
- [ ] Track A goldens (when solvers for this lab ship)
- [ ] Track B challenges (when tool ships)
""",
        )
        write(
            mdir / "transcript.md",
            f"""# {title}

**Module id:** {mid}
**Lab:** {lab}
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why {title.split()[0]}

Scaffold slide — full Netgen-specific narration ships with the lab.

## Slide 2 — The idea

GOLDEN: align with Netgen naming for {lab}.

## Slide 3 — Next

Continue the Netgen path.
""",
        )
        write(
            mdir / "quiz.json",
            f"""{{
  "moduleId": "{mid}",
  "items": [
    {{"id": "q0", "q": "This lab id?", "choices": ["{lab}", "read-netlists-map", "netgen-engine", "netgen-evidence"], "answer": 0}},
    {{"id": "q1", "q": "Course?", "choices": ["learn_netgen", "learn_yosys", "learn_opensta", "learn_magic"], "answer": 0}},
    {{"id": "q2", "q": "Prereq?", "choices": ["learn_lvs or learn_magic", "learn_routing", "learn_spice", "learn_erc"], "answer": 0}}
  ]
}}""",
        )

    print("LEARN_NETGEN_SCAFFOLD_OK", len(MODULES))


if __name__ == "__main__":
    main()
