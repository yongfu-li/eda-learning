#!/usr/bin/env python3
"""Scaffold learn_klayout course skeleton (Magic/DRC-shaped: map → CLI → algorithms → internals)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIP_COMMON = {"tiny_klayout.json", "solvers.py", "README.md"}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


MODULES = [
    ("module00-00-intro", "intro", "Welcome to KLayout", "—"),
    ("module01-01-layers-view-map", "lab", "Layers view map", "layers-view-map"),
    ("module01-03-cell-hierarchy-map", "lab", "Cell hierarchy map", "cell-hierarchy-map"),
    ("module02-01-stream-gds-map", "lab", "Stream GDS map", "stream-gds-map"),
    ("module02-03-drc-script-map", "lab", "DRC script map", "drc-script-map"),
    ("module03-01-markers-report-map", "lab", "Markers report map", "markers-report-map"),
    ("module03-03-klayout-engine", "lab", "KLayout engine (map)", "klayout-engine"),
    ("module06-01-klayout-cli", "lab", "KLayout CLI & scripts", "klayout-cli"),
    ("module06-03-gds-vocab", "lab", "GDS vocabulary", "gds-vocab"),
    ("module07-01-real-stream-gds", "lab", "Real stream GDS", "real-stream-gds"),
    ("module07-03-real-drc-script", "lab", "Real DRC script", "real-drc-script"),
    ("module08-01-real-markers", "lab", "Real DRC markers", "real-markers"),
    ("module08-03-klayout-evidence", "lab", "Real KLayout evidence", "klayout-evidence"),
    ("module09-01-layer-query-algo", "lab", "Layer query algorithm", "layer-query-algo"),
    ("module09-03-width-spacing-algo", "lab", "Width spacing algorithm", "width-spacing-algo"),
    ("module10-01-marker-emit-algo", "lab", "Marker emit algorithm", "marker-emit-algo"),
    ("module10-03-klayout-algo-engine", "lab", "KLayout algo engine", "klayout-algo-engine"),
    ("module14-01-layout-cell-model", "lab", "Layout / Cell / Instance model", "layout-cell-model"),
    ("module14-03-read-drc-runner", "lab", "Read DRC runner", "read-drc-runner"),
    ("module15-03-contribute-klayout", "lab", "Contribute to KLayout", "contribute-klayout"),
    ("module99-00-wrap", "wrap", "KLayout path complete", "—"),
]


def main() -> None:
    write(
        ROOT / "docs" / "SCOPE.md",
        """# Scope

**Part A (viewer/stream/DRC map):** interactive KLayout map on `tiny_klayout.json` — layers view, cell hierarchy, stream GDS, DRC script, markers report. Same *names* and order as KLayout; browser IR for learning before/alongside the binary.

**Part B (real KLayout evidence):** CLI + Ruby DRC on `tiny_rect.gds` — stream, run DRC, markers — checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**Part C (algorithms + bind):** teaching algorithms on layout JSON via `common/algo_solvers.py` — layer query, width/spacing, marker emit, engine — bound to real KLayout report stats via `partc_bind.py`.

**Part D (internals / contribute):** orientation to the KLayout C++/Ruby tree — Layout / Cell / Instance — plus a contribute checklist. Not a reimplementation of KLayout.

**Prereq:** `learn_magic` or `learn_drc` (layout + DRC literacy).

**In:** KLayout tool literacy for OpenLane users — map → CLI evidence → algorithms bound to DRC → internals orientation.

**Out:** Full PDK DRC decks (`learn_drc` depth), Magic layout editing (`learn_magic`), OpenROAD PnR (`learn_openroad`), Netgen LVS (`learn_netgen`).
""",
    )

    write(
        ROOT / "docs" / "TWO_TRACKS.md",
        """# Two tracks

- **A:** `common/` Python solvers
  - Part A map: `solvers.py` on `tiny_klayout.json`
  - Part B evidence: `real_solvers.py` (+ checked-in logs/goldens)
  - Part C algorithms + bind: `algo_solvers.py` / `partc_bind.py`
  - Part D internals: `internals_solvers.py` + `internals/` excerpts
- **B:** platform `#klayout` browser tools
""",
    )

    rows = [
        "# learn_klayout — module index",
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
        f"""# learn_klayout

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-KLayout-orange)](docs/MODULES.md)

**learn_klayout** is the open learning path for *KLayout* — Part A **viewer/stream/DRC map**, Part B **real KLayout CLI evidence**, Part C **algorithms bound to DRC goldens**, then Part D **internals / contribute**. Companion to [learn_magic](../learn_magic/README.md) and [learn_drc](../learn_drc/README.md).

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

- [Welcome to KLayout](module00-00-intro/README.md)
{toc_lines}

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_klayout/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_klayout/scripts/scaffold_course.py
python3 courses/learn_klayout/scripts/generate_part_a.py
python3 courses/learn_klayout/scripts/generate_part_b.py
python3 courses/learn_klayout/scripts/generate_part_c.py
python3 courses/learn_klayout/scripts/scaffold_part_d.py
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_klayout --modules
python3 platform/scripts/publish_course_platform.py learn_klayout
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#klayout` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#klayout

## License

CC BY 4.0 — see [LICENSE](LICENSE).
""",
    )

    write(
        ROOT / "module00-00-intro" / "README.md",
        """# Module 00-00-intro: Welcome to KLayout

**Module id:** `module00-00-intro`  
**Kind:** `intro`

← Start · [Course README](../README.md) · [Layers view map →](../module01-01-layers-view-map/README.md)

## What this course is

**learn_klayout** has four parts: **Part A** viewer/stream/DRC map on `tiny_klayout.json`, **Part B** real KLayout CLI evidence, **Part C** algorithms bound to DRC goldens, then **Part D** internals / contribute. Prereq: [learn_magic](../learn_magic/README.md) or [learn_drc](../learn_drc/README.md).

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
        """# Welcome to KLayout

**Module id:** module00-00-intro
**Lab:** intro
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why KLayout

OpenLane uses KLayout for GDS viewing, streamout, and DRC. This course teaches the tool the same way learn_magic teaches Magic: map, then real CLI, then algorithms, then internals.

## Slide 2 — Four parts

Part A is the interactive viewer/DRC map. Part B drives real KLayout with Ruby DRC scripts. Part C binds algorithms to DRC goldens. Part D orients you to the KLayout source tree.

## Slide 3 — Prereq

You should know layout layers from learn_magic or DRC rules from learn_drc — width, spacing, violation markers.

## Slide 4 — Next

Start with the layers view map lab, then cell hierarchy, then the real CLI modules.
""",
    )
    write(
        ROOT / "module00-00-intro" / "quiz.json",
        """{
  "module": "module00-00-intro",
  "questions": [
    {
      "id": "q1",
      "question": "learn_klayout is primarily about?",
      "choices": [
        "KLayout GDS/DRC tool literacy (map → CLI → algorithms → internals)",
        "OpenROAD placement only",
        "SPICE transient only",
        "UVM sequences only"
      ],
      "answer": 0
    },
    {
      "id": "q2",
      "question": "Layout/DRC prereq course?",
      "choices": ["learn_magic or learn_drc", "learn_routing", "learn_spice", "learn_dft_insert"],
      "answer": 0
    },
    {
      "id": "q3",
      "question": "KLayout is used heavily by?",
      "choices": ["OpenLane GDS/DRC flow", "Verilator only", "Yosys synthesis only", "Magic paint only"],
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

[← Contribute](../module15-03-contribute-klayout/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Part A map, Part B real KLayout evidence, Part C algorithms, and Part D internals.**

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

You finished the KLayout path: map, real CLI evidence, algorithms bound to DRC reports, and internals literacy.

## Slide 2 — Next

Continue to OpenROAD / OpenLane flow courses.
""",
            )
            write(
                mdir / "quiz.json",
                """{
  "module": "module99-00-wrap",
  "questions": [
    {"id": "q1", "question": "Course id?", "choices": ["learn_klayout", "learn_sta", "learn_yosys", "learn_openlane"], "answer": 0},
    {"id": "q2", "question": "Part B proves?", "choices": ["Real KLayout CLI/reports", "OpenSTA timing only", "Place only", "LVS only"], "answer": 0},
    {"id": "q3", "question": "Golden width violations on tiny_rect?", "choices": ["1", "0", "2", "4"], "answer": 0}
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

After this module you can work the **{title}** KLayout topic (scaffold — content ships next).

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
cd courses/learn_klayout/common
python3 solvers.py
```

## Pseudocode

```text
load tiny_klayout.json
run KLayout stages for {lab}
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

Scaffold slide — full KLayout-specific narration ships with the lab.

## Slide 2 — The idea

GOLDEN: align with KLayout naming for {lab}.

## Slide 3 — Next

Continue the KLayout path.
""",
        )
        write(
            mdir / "quiz.json",
            f"""{{
  "moduleId": "{mid}",
  "items": [
    {{"id": "q0", "q": "This lab id?", "choices": ["{lab}", "layers-view-map", "klayout-engine", "klayout-evidence"], "answer": 0}},
    {{"id": "q1", "q": "Course?", "choices": ["learn_klayout", "learn_yosys", "learn_opensta", "learn_magic"], "answer": 0}},
    {{"id": "q2", "q": "Prereq?", "choices": ["learn_magic or learn_drc", "learn_routing", "learn_spice", "learn_erc"], "answer": 0}}
  ]
}}""",
        )

    print("LEARN_KLAYOUT_SCAFFOLD_OK", len(MODULES))


if __name__ == "__main__":
    main()
