#!/usr/bin/env python3
"""Scaffold learn_opensta course skeleton (Yosys-shaped: map → CLI → algorithms → internals)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


MODULES = [
    ("module00-00-intro", "intro", "Welcome to OpenSTA", "—"),
    ("module01-01-timing-graph-map", "lab", "Timing graph map", "timing-graph-map"),
    ("module01-03-sdc-clocks", "lab", "SDC clocks", "sdc-clocks"),
    ("module02-01-arrival-required", "lab", "Arrival & required", "arrival-required"),
    ("module02-03-slack-critical", "lab", "Slack & critical path", "slack-critical"),
    ("module03-01-report-checks", "lab", "report_checks map", "report-checks"),
    ("module03-03-opensta-engine", "lab", "OpenSTA engine (map)", "opensta-engine"),
    ("module06-01-opensta-cli", "lab", "OpenSTA CLI & scripts", "opensta-cli"),
    ("module06-03-liberty-vocab", "lab", "Liberty vocabulary", "liberty-vocab"),
    ("module07-01-real-read-netlist", "lab", "Real read_verilog / link", "real-read-netlist"),
    ("module07-03-real-sdc", "lab", "Real SDC + create_clock", "real-sdc"),
    ("module08-01-real-report-checks", "lab", "Real report_checks", "real-report-checks"),
    ("module08-03-real-evidence", "lab", "Real OpenSTA evidence", "real-evidence"),
    ("module09-01-graph-build", "lab", "Graph build algorithm", "graph-build"),
    ("module09-03-levelize-propagate", "lab", "Levelize & propagate", "levelize-propagate"),
    ("module10-01-slack-algo", "lab", "Slack algorithm", "slack-algo"),
    ("module10-03-opensta-algo-engine", "lab", "OpenSTA algo engine", "opensta-algo-engine"),
    ("module14-01-sta-cpp-model", "lab", "STA C++ model", "sta-cpp-model"),
    ("module14-03-read-find-path", "lab", "Read find_path / report", "read-find-path"),
    ("module15-03-contribute-opensta", "lab", "Contribute to OpenSTA", "contribute-opensta"),
    ("module99-00-wrap", "wrap", "OpenSTA path complete", "—"),
]


def main() -> None:
    write(
        ROOT / "docs" / "SCOPE.md",
        """# Scope

**Part A (report / graph map):** interactive timing map on a tiny netlist — clocks, arrivals, required, slack, `report_checks` shape. Same *names* and order as OpenSTA; browser IR for learning before/alongside the binary.

**Part B (real OpenSTA evidence):** CLI + `.tcl` scripts on a tiny Verilog + liberty-lite — `read_liberty`, `read_verilog`, `link_design`, `create_clock`, `report_checks`, checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**Part C (algorithms + bind):** teaching algorithms on a timing-graph JSON via `common/algo_solvers.py` — graph build, levelize, propagate, slack, critical path — bound to real OpenSTA report stats via `partc_bind.py` when the binary is available.

**Part D (internals / contribute):** orientation to the OpenSTA C++ tree — Network / Graph / Sdc / Search — plus a contribute checklist. Not a reimplementation of OpenSTA.

**Prereq:** `learn_sta` (algorithms) and ideally `learn_yosys` (netlist literacy).

**In:** OpenSTA tool literacy for OpenLane/OpenROAD users — map → CLI evidence → algorithms bound to reports → internals orientation.

**Out:** Full Liberty characterization, multi-corner OCV deep dives, SI/crosstalk engines (`learn_si`), OpenROAD PnR (`learn_openroad`), OpenLane orchestration (`learn_openlane`).
""",
    )

    write(
        ROOT / "docs" / "TWO_TRACKS.md",
        """# Two tracks

- **A:** `common/` Python solvers
  - Part A map: `solvers.py` on `tiny_opensta.json`
  - Part B evidence: `real_solvers.py` (+ checked-in logs/goldens)
  - Part C algorithms + bind: `algo_solvers.py` / `partc_bind.py`
  - Part D internals: `internals_solvers.py` + `internals/` excerpts
- **B:** platform `#opensta` browser tools
""",
    )

    rows = [
        "# learn_opensta — module index",
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
        """# learn_opensta

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-OpenSTA-orange)](docs/MODULES.md)

**learn_opensta** is the open learning path for *OpenSTA* — Part A **timing/report map**, Part B **real OpenSTA CLI evidence**, Part C **algorithms bound to OpenSTA reports**, then Part D **internals / contribute**. Companion to [learn_sta](../learn_sta/README.md) (algorithms) and a prerequisite for OpenROAD/OpenLane timing literacy.

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

- [Welcome to OpenSTA](module00-00-intro/README.md)
- [Timing graph map](module01-01-timing-graph-map/README.md)
- [SDC clocks](module01-03-sdc-clocks/README.md)
- [Arrival & required](module02-01-arrival-required/README.md)
- [Slack & critical path](module02-03-slack-critical/README.md)
- [report_checks map](module03-01-report-checks/README.md)
- [OpenSTA engine (map)](module03-03-opensta-engine/README.md)
- [OpenSTA CLI & scripts](module06-01-opensta-cli/README.md)
- [Liberty vocabulary](module06-03-liberty-vocab/README.md)
- [Real read / link](module07-01-real-read-netlist/README.md)
- [Real SDC](module07-03-real-sdc/README.md)
- [Real report_checks](module08-01-real-report-checks/README.md)
- [Real OpenSTA evidence](module08-03-real-evidence/README.md)
- [Graph build algorithm](module09-01-graph-build/README.md)
- [Levelize & propagate](module09-03-levelize-propagate/README.md)
- [Slack algorithm](module10-01-slack-algo/README.md)
- [OpenSTA algo engine](module10-03-opensta-algo-engine/README.md)
- [STA C++ model](module14-01-sta-cpp-model/README.md)
- [Read find_path / report](module14-03-read-find-path/README.md)
- [Contribute to OpenSTA](module15-03-contribute-opensta/README.md)
- [OpenSTA path complete](module99-00-wrap/README.md)

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_opensta/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_opensta/scripts/scaffold_course.py
bash courses/learn_opensta/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_opensta --modules
python3 platform/scripts/publish_course_platform.py learn_opensta
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#opensta` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#opensta

## License

CC BY 4.0 — see [LICENSE](LICENSE).
""",
    )

    write(
        ROOT / "common" / "README.md",
        """# Track A — OpenSTA common

## Part A — timing / report map

IR: `tiny_opensta.json` — small combinational cone + one clocked path for arrivals/slack.

```bash
cd courses/learn_opensta/common
python3 solvers.py
```

## Part B — real OpenSTA evidence

RTL + liberty-lite under `rtl/` / `lib/` · scripts: `scripts/*.tcl` · logs: `logs/` · goldens: `evidence/goldens.json`.

Requires `sta` / OpenSTA on PATH when regenerating evidence (goldens are checked in).

## Part C / D

Filled as algorithms + internals modules ship (`algo_solvers.py`, `internals_solvers.py`).
""",
    )

    write(
        ROOT / "common" / "tiny_opensta.json",
        """{
  "note": "Teaching IR for OpenSTA Part A map (not the OpenSTA binary).",
  "clock": {"name": "clk", "period": 10.0},
  "ports": {
    "in": ["a", "b"],
    "out": ["y"],
    "clk": ["clk"]
  },
  "cells": [
    {"id": "u1", "type": "AND2", "a": "a", "b": "b", "y": "n1", "delay": 1.0},
    {"id": "u2", "type": "BUF", "a": "n1", "y": "n2", "delay": 0.5},
    {"id": "u3", "type": "INV", "a": "n2", "y": "y", "delay": 0.5}
  ],
  "goldens": {
    "cell_count": 3,
    "path_delay": 2.0,
    "slack_at_period_10": 8.0
  }
}
""",
    )

    write(
        ROOT / "common" / "solvers.py",
        '''"""Part A — OpenSTA timing/report map on tiny_opensta.json."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
TINY = json.loads((ROOT / "tiny_opensta.json").read_text(encoding="utf-8"))
GOLDENS = dict(TINY["goldens"])


def load_design() -> dict[str, Any]:
    return json.loads(json.dumps(TINY))


def path_delay(design: dict[str, Any] | None = None) -> float:
    d = design or load_design()
    return float(sum(c["delay"] for c in d["cells"]))


def slack(period: float | None = None, design: dict[str, Any] | None = None) -> float:
    d = design or load_design()
    p = float(period if period is not None else d["clock"]["period"])
    return p - path_delay(d)


def opensta_map_compare() -> dict[str, Any]:
    d = load_design()
    delay = path_delay(d)
    s = slack(design=d)
    ok = (
        len(d["cells"]) == GOLDENS["cell_count"]
        and abs(delay - GOLDENS["path_delay"]) < 1e-9
        and abs(s - GOLDENS["slack_at_period_10"]) < 1e-9
    )
    return {
        "ok": ok,
        "cells": len(d["cells"]),
        "path_delay": delay,
        "slack": s,
        "goldens": GOLDENS,
    }


def _selftest() -> None:
    r = opensta_map_compare()
    assert r["ok"], r
    print("OPENSTA_MAP_OK", r)


if __name__ == "__main__":
    _selftest()
''',
    )

    # Intro + wrap + first lab stubs
    write(
        ROOT / "module00-00-intro" / "README.md",
        """# Module 00-00-intro: Welcome to OpenSTA

**Module id:** `module00-00-intro`  
**Kind:** `intro`

← Start · [Course README](../README.md) · [Timing graph map →](../module01-01-timing-graph-map/README.md)

## What this course is

**learn_opensta** has four parts: **Part A** timing/report map on `tiny_opensta.json`, **Part B** real OpenSTA CLI evidence, **Part C** algorithms bound to OpenSTA reports, then **Part D** internals / contribute. Companion to [learn_sta](../learn_sta/README.md). Next flow courses: [learn_openroad](../learn_openroad/README.md) / [learn_openlane](../learn_openlane/README.md).

**Prerequisite:** [learn_sta](../learn_sta/README.md). **Related:** [learn_yosys](../learn_yosys/README.md).

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
        """# Welcome to OpenSTA

**Module id:** module00-00-intro
**Lab:** intro
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why OpenSTA

OpenLane and OpenROAD lean on OpenSTA for static timing. This course teaches the tool the same way learn_yosys teaches Yosys: map, then real CLI, then algorithms, then internals.

## Slide 2 — Four parts

Part A is the interactive timing map. Part B drives real OpenSTA with Tcl. Part C binds algorithms to report goldens. Part D orients you to the C++ tree.

## Slide 3 — Prereq

You should already know STA ideas from learn_sta — arrival, required, slack. Here those ideas become OpenSTA commands and reports.

## Slide 4 — Next

Start with the timing graph map lab, then SDC clocks, then the real CLI modules when evidence is ready.
""",
    )
    write(
        ROOT / "module00-00-intro" / "quiz.json",
        """{
  "module": "module00-00-intro",
  "questions": [
    {
      "id": "q1",
      "question": "learn_opensta is primarily about?",
      "choices": [
        "OpenSTA tool literacy (map → CLI → algorithms → internals)",
        "OpenROAD placement only",
        "Magic DRC only",
        "SPICE transient only"
      ],
      "answer": 0
    },
    {
      "id": "q2",
      "question": "Algorithm prereq course?",
      "choices": ["learn_sta", "learn_routing", "learn_spice", "learn_dft_insert"],
      "answer": 0
    },
    {
      "id": "q3",
      "question": "OpenSTA is used heavily by?",
      "choices": ["OpenLane / OpenROAD timing", "KLayout only", "Netgen only", "Verilator only"],
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

[← Contribute](../module15-03-contribute-opensta/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Part A map, Part B real OpenSTA evidence, Part C algorithms, and Part D internals.**

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

You finished the OpenSTA path: map, real CLI evidence, algorithms bound to reports, and internals literacy.

## Slide 2 — Next

Continue to Magic / Netgen / KLayout tool courses, then OpenROAD and OpenLane.
""",
            )
            write(
                mdir / "quiz.json",
                """{
  "module": "module99-00-wrap",
  "questions": [
    {"id": "q1", "question": "Course id?", "choices": ["learn_opensta", "learn_sta", "learn_yosys", "learn_openlane"], "answer": 0},
    {"id": "q2", "question": "Part B proves?", "choices": ["Real OpenSTA CLI/reports", "Magic DRC only", "Place only", "LVS only"], "answer": 0},
    {"id": "q3", "question": "Next after OpenSTA tools?", "choices": ["OpenROAD / OpenLane", "Unix only", "SPICE only", "FPGA bitstream only"], "answer": 0}
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

After this module you can work the **{title}** OpenSTA topic (scaffold — content ships next).

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
cd courses/learn_opensta/common
python3 solvers.py
```

## Pseudocode

```text
load tiny_opensta.json
compute path_delay and slack
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

Scaffold slide — full OpenSTA-specific narration ships with the lab.

## Slide 2 — The idea

GOLDEN: align with OpenSTA naming for {lab}.

## Slide 3 — Next

Continue the OpenSTA path.
""",
        )
        write(
            mdir / "quiz.json",
            f"""{{
  "moduleId": "{mid}",
  "items": [
    {{"id": "q0", "q": "This lab id?", "choices": ["{lab}", "yosys-cli", "opt-dce", "proc-mux"], "answer": 0}},
    {{"id": "q1", "q": "Course?", "choices": ["learn_opensta", "learn_yosys", "learn_magic", "learn_netgen"], "answer": 0}},
    {{"id": "q2", "q": "Prereq algorithms course?", "choices": ["learn_sta", "learn_routing", "learn_spice", "learn_erc"], "answer": 0}}
  ]
}}
""",
        )

    print("LEARN_OPENSTA_SCAFFOLD_OK", len(MODULES))


if __name__ == "__main__":
    main()
