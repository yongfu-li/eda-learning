#!/usr/bin/env python3
"""Scaffold learn_magic course skeleton (Yosys/OpenSTA-shaped: map → CLI → algorithms → internals)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Do not overwrite Track A common/ (tiny_magic.json, solvers.py, README.md) — shipped separately.
SKIP_COMMON = {"tiny_magic.json", "solvers.py", "README.md"}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


MODULES = [
    ("module00-00-intro", "intro", "Welcome to Magic", "—"),
    ("module01-01-paint-layers", "lab", "Paint layers", "paint-layers"),
    ("module01-03-select-box", "lab", "Select box", "select-box"),
    ("module02-01-contact-paint", "lab", "Contact paint", "contact-paint"),
    ("module02-03-magic-drc-map", "lab", "Magic DRC map", "magic-drc-map"),
    ("module03-01-gds-write-map", "lab", "GDS write map", "gds-write-map"),
    ("module03-03-magic-engine", "lab", "Magic engine (map)", "magic-engine"),
    ("module06-01-magic-cli", "lab", "Magic CLI & scripts", "magic-cli"),
    ("module06-03-magic-tech-vocab", "lab", "Magic tech vocabulary", "magic-tech-vocab"),
    ("module07-01-real-paint-save", "lab", "Real paint / save", "real-paint-save"),
    ("module07-03-real-drc", "lab", "Real DRC", "real-drc"),
    ("module08-01-real-gds", "lab", "Real GDS streamout", "real-gds"),
    ("module08-03-magic-evidence", "lab", "Real Magic evidence", "magic-evidence"),
    ("module09-01-paint-connectivity", "lab", "Paint connectivity algorithm", "paint-connectivity"),
    ("module09-03-drc-region-algo", "lab", "DRC region algorithm", "drc-region-algo"),
    ("module10-01-extract-algo", "lab", "Extract algorithm", "extract-algo"),
    ("module10-03-magic-algo-engine", "lab", "Magic algo engine", "magic-algo-engine"),
    ("module14-01-tile-plane-model", "lab", "Tile / Plane model", "tile-plane-model"),
    ("module14-03-read-drc-cifwrite", "lab", "Read DRC / cifwrite", "read-drc-cifwrite"),
    ("module15-03-contribute-magic", "lab", "Contribute to Magic", "contribute-magic"),
    ("module99-00-wrap", "wrap", "Magic path complete", "—"),
]


def main() -> None:
    write(
        ROOT / "docs" / "SCOPE.md",
        """# Scope

**Part A (layout / DRC / GDS map):** interactive Magic map on `tiny_magic.json` — paint layers, box select, contact, DRC width check, GDS layer map. Same *names* and order as Magic; browser IR for learning before/alongside the binary.

**Part B (real Magic evidence):** CLI + `.magicrc` / Tcl on a tiny layout — paint, save, `drc check`, `gds write`, checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**Part C (algorithms + bind):** teaching algorithms on layout JSON via `common/algo_solvers.py` — paint connectivity, DRC region scan, extract, engine — bound to real Magic report stats via `partc_bind.py` when the binary is available.

**Part D (internals / contribute):** orientation to the Magic C tree — Tile / Plane / DRC / cifwrite — plus a contribute checklist. Not a reimplementation of Magic.

**Prereq:** `learn_digital` (layout literacy) and ideally `learn_yosys` (netlist → layout flow).

**In:** Magic tool literacy for OpenLane/OpenROAD users — map → CLI evidence → algorithms bound to DRC/GDS → internals orientation.

**Out:** Full PDK DRC rule decks, advanced extraction (`learn_pex`), KLayout scripting (`learn_klayout`), OpenROAD PnR (`learn_openroad`), OpenLane orchestration (`learn_openlane`).
""",
    )

    write(
        ROOT / "docs" / "TWO_TRACKS.md",
        """# Two tracks

- **A:** `common/` Python solvers
  - Part A map: `solvers.py` on `tiny_magic.json`
  - Part B evidence: `real_solvers.py` (+ checked-in logs/goldens)
  - Part C algorithms + bind: `algo_solvers.py` / `partc_bind.py`
  - Part D internals: `internals_solvers.py` + `internals/` excerpts
- **B:** platform `#magic` browser tools
""",
    )

    rows = [
        "# learn_magic — module index",
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

    write(
        ROOT / "README.md",
        """# learn_magic

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-Magic-orange)](docs/MODULES.md)

**learn_magic** is the open learning path for *Magic* — Part A **layout/DRC/GDS map**, Part B **real Magic CLI evidence**, Part C **algorithms bound to Magic reports**, then Part D **internals / contribute**. Companion to [learn_digital](../learn_digital/README.md) and a prerequisite for OpenLane layout/DRC literacy.

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

- [Welcome to Magic](module00-00-intro/README.md)
- [Paint layers](module01-01-paint-layers/README.md)
- [Select box](module01-03-select-box/README.md)
- [Contact paint](module02-01-contact-paint/README.md)
- [Magic DRC map](module02-03-magic-drc-map/README.md)
- [GDS write map](module03-01-gds-write-map/README.md)
- [Magic engine (map)](module03-03-magic-engine/README.md)
- [Magic CLI & scripts](module06-01-magic-cli/README.md)
- [Magic tech vocabulary](module06-03-magic-tech-vocab/README.md)
- [Real paint / save](module07-01-real-paint-save/README.md)
- [Real DRC](module07-03-real-drc/README.md)
- [Real GDS streamout](module08-01-real-gds/README.md)
- [Real Magic evidence](module08-03-magic-evidence/README.md)
- [Paint connectivity algorithm](module09-01-paint-connectivity/README.md)
- [DRC region algorithm](module09-03-drc-region-algo/README.md)
- [Extract algorithm](module10-01-extract-algo/README.md)
- [Magic algo engine](module10-03-magic-algo-engine/README.md)
- [Tile / Plane model](module14-01-tile-plane-model/README.md)
- [Read DRC / cifwrite](module14-03-read-drc-cifwrite/README.md)
- [Contribute to Magic](module15-03-contribute-magic/README.md)
- [Magic path complete](module99-00-wrap/README.md)

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_magic/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_magic/scripts/scaffold_course.py
python3 courses/learn_magic/scripts/generate_part_a.py
bash courses/learn_magic/scripts/build_part_a_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_magic --modules
python3 platform/scripts/publish_course_platform.py learn_magic
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#magic` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#magic

## License

CC BY 4.0 — see [LICENSE](LICENSE).
""",
    )

    write(
        ROOT / "module00-00-intro" / "README.md",
        """# Module 00-00-intro: Welcome to Magic

**Module id:** `module00-00-intro`  
**Kind:** `intro`

← Start · [Course README](../README.md) · [Paint layers →](../module01-01-paint-layers/README.md)

## What this course is

**learn_magic** has four parts: **Part A** layout/DRC/GDS map on `tiny_magic.json`, **Part B** real Magic CLI evidence, **Part C** algorithms bound to Magic reports, then **Part D** internals / contribute. Companion to [learn_digital](../learn_digital/README.md). Next flow courses: [learn_netgen](../learn_netgen/README.md) / [learn_klayout](../learn_klayout/README.md) / [learn_openlane](../learn_openlane/README.md).

**Prerequisite:** [learn_digital](../learn_digital/README.md). **Related:** [learn_yosys](../learn_yosys/README.md).

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
        """# Welcome to Magic

**Module id:** module00-00-intro
**Lab:** intro
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Magic

OpenLane and OpenROAD lean on Magic for layout, DRC, and GDS. This course teaches the tool the same way learn_yosys teaches Yosys: map, then real CLI, then algorithms, then internals.

## Slide 2 — Four parts

Part A is the interactive layout map. Part B drives real Magic with Tcl. Part C binds algorithms to DRC/GDS goldens. Part D orients you to the Tile/Plane C tree.

## Slide 3 — Prereq

You should already know layout basics from learn_digital — layers, contacts, DRC width rules. Here those ideas become Magic commands and reports.

## Slide 4 — Next

Start with the paint layers lab, then select box, then the real CLI modules when evidence is ready.
""",
    )
    write(
        ROOT / "module00-00-intro" / "quiz.json",
        """{
  "module": "module00-00-intro",
  "questions": [
    {
      "id": "q1",
      "question": "learn_magic is primarily about?",
      "choices": [
        "Magic tool literacy (map → CLI → algorithms → internals)",
        "OpenROAD placement only",
        "SPICE transient only",
        "UVM sequences only"
      ],
      "answer": 0
    },
    {
      "id": "q2",
      "question": "Layout prereq course?",
      "choices": ["learn_digital", "learn_routing", "learn_spice", "learn_dft_insert"],
      "answer": 0
    },
    {
      "id": "q3",
      "question": "Magic is used heavily by?",
      "choices": ["OpenLane / OpenROAD layout", "Verilator only", "Yosys synthesis only", "Netgen only"],
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

[← Contribute](../module15-03-contribute-magic/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Part A map, Part B real Magic evidence, Part C algorithms, and Part D internals.**

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

You finished the Magic path: map, real CLI evidence, algorithms bound to reports, and internals literacy.

## Slide 2 — Next

Continue to Netgen / KLayout tool courses, then OpenROAD and OpenLane.
""",
            )
            write(
                mdir / "quiz.json",
                """{
  "module": "module99-00-wrap",
  "questions": [
    {"id": "q1", "question": "Course id?", "choices": ["learn_magic", "learn_sta", "learn_yosys", "learn_openlane"], "answer": 0},
    {"id": "q2", "question": "Part B proves?", "choices": ["Real Magic CLI/reports", "OpenSTA timing only", "Place only", "LVS only"], "answer": 0},
    {"id": "q3", "question": "Next after Magic tools?", "choices": ["Netgen / KLayout / OpenLane", "Unix only", "SPICE only", "FPGA bitstream only"], "answer": 0}
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

After this module you can work the **{title}** Magic topic (scaffold — content ships next).

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
cd courses/learn_magic/common
python3 solvers.py
```

## Pseudocode

```text
load tiny_magic.json
run Magic stages for {lab}
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

Scaffold slide — full Magic-specific narration ships with the lab.

## Slide 2 — The idea

GOLDEN: align with Magic naming for {lab}.

## Slide 3 — Next

Continue the Magic path.
""",
        )
        write(
            mdir / "quiz.json",
            f"""{{
  "moduleId": "{mid}",
  "items": [
    {{"id": "q0", "q": "This lab id?", "choices": ["{lab}", "paint-layers", "magic-drc-map", "gds-write-map"], "answer": 0}},
    {{"id": "q1", "q": "Course?", "choices": ["learn_magic", "learn_yosys", "learn_opensta", "learn_netgen"], "answer": 0}},
    {{"id": "q2", "q": "Prereq layout course?", "choices": ["learn_digital", "learn_routing", "learn_spice", "learn_erc"], "answer": 0}}
  ]
}}
""",
        )

    print("LEARN_MAGIC_SCAFFOLD_OK", len(MODULES))


if __name__ == "__main__":
    main()
