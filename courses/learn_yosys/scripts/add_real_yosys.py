#!/usr/bin/env python3
"""Add Part B real-Yosys CLI/RTLIL modules + platform tools to learn_yosys."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
TOOLS = REPO / "platform" / "tools"
WALK = TOOLS / "algorithm-walkthrough"
CAPTURE = REPO / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"
PUBLISH = REPO / "platform" / "scripts" / "publish_course_platform.py"

MEDIA = (
    "| Artifact | Path |\n|----------|------|\n| Transcript | [transcript.md](transcript.md) |\n"
    "| Outline | [outline.yaml](outline.yaml) |\n| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |\n"
    "| Video | [video.mp4](video.mp4) |\n| Quiz | [quiz.json](quiz.json) |\n"
)

# id, kind, title, short, lab, outcomes, algorithm, hook, idea, walk, browser, impl, pitfalls, next, pseudo, quiz
REAL = [
    (
        "module06-01-yosys-cli",
        "lab",
        "Yosys CLI & scripts",
        "Why CLI",
        "yosys-cli",
        "Invoke Yosys with -s; order read_verilog → hierarchy → proc as the first three commands.",
        "Yosys CLI recipe order",
        "Real Yosys is a pass engine you drive with a .ys script or an interactive shell — not a toy button.",
        "GOLDEN: first three cmds = read_verilog, hierarchy, proc; invoke with yosys -s script.ys.",
        [
            ("Empty design", "01-empty", "No RTL loaded — recipe starts empty."),
            ("read_verilog", "02-read", "Load rtl/tiny_and_or.v into Yosys."),
            ("hierarchy -top", "03-hier", "hierarchy -check -top top sets the design root."),
            ("proc next", "04-proc", "Third command is proc — processes become cells."),
            ("Golden order", "05-golden", "GOLDEN: read → hierarchy → proc."),
        ],
        "Open **yosys-cli**. Append read_verilog, hierarchy, proc in order.",
        "Call pass_cli_check(['read_verilog','hierarchy','proc']); assert ok.",
        "Starting with proc. Skipping hierarchy -top.",
        "Next: RTLIL vocabulary.",
        "recipe ← []; append read_verilog; hierarchy; proc; ok ← prefix matches golden",
        [
            {"q": "First command?", "choices": ["read_verilog", "synth", "techmap", "abc"], "answer": 0},
            {"q": "How to run a script?", "choices": ["yosys -s file.ys", "gcc file.ys", "python file.ys", "make only"], "answer": 0},
            {"q": "Third command?", "choices": ["proc", "flatten", "opt", "write"], "answer": 0},
        ],
    ),
    (
        "module06-03-rtlil-vocab",
        "lab",
        "RTLIL vocabulary",
        "Why RTLIL",
        "rtlil-vocab",
        "Read after-hierarchy evidence: 2 modules, 1 process, $and×2; name $and/$or/$not/$dff.",
        "RTLIL cell vocabulary",
        "Yosys stores designs in RTLIL — modules, wires, processes, and $-typed cells you see in dump/stat.",
        "GOLDEN: after_read modules=2 processes=1 and_count=2; vocab includes $and $or $not $dff.",
        [
            ("Two modules", "01-mods", "top + child after hierarchy -check."),
            ("Process in child", "02-proc", "Child still has 1 process before proc."),
            ("$and×2", "03-and", "Two $and cells — duplicate assign n3=a&b."),
            ("$or and $not", "04-ornot", "OR/NOT appear as $or / $not cells."),
            ("Golden", "05-golden", "GOLDEN: modules=2 processes=1 and=2."),
        ],
        "Open **rtlil-vocab**. Show read_hierarchy stage; select $and.",
        "Call pass_rtlil_vocab(); assert ok and and_count==2.",
        "Calling RTLIL 'gates' without $ prefix. Ignoring processes.",
        "Next: real proc.",
        "load evidence; assert modules=2; processes=1; cells[$and]=2",
        [
            {"q": "Modules after read?", "choices": ["2", "1", "4", "0"], "answer": 0},
            {"q": "Processes before proc?", "choices": ["1", "0", "2", "4"], "answer": 0},
            {"q": "$and count?", "choices": ["2", "1", "4", "0"], "answer": 0},
        ],
    ),
    (
        "module07-01-real-proc",
        "lab",
        "Real proc pass",
        "Why real proc",
        "real-proc",
        "Run real proc evidence: processes→0 and $dff appears from always @(posedge clk).",
        "real proc (process → $dff)",
        "Real proc lowers Verilog processes into RTLIL cells — the child always block becomes $dff.",
        "GOLDEN: after_proc processes=0 has_dff=True; types include $dff.",
        [
            ("Before: process", "01-before", "Child still has a process; no $dff yet."),
            ("proc runs", "02-run", "proc creates $dff from always @(posedge clk)."),
            ("Processes cleared", "03-clear", "processes → 0 after proc."),
            ("$dff present", "04-dff", "$dff cell appears in the design."),
            ("Golden", "05-golden", "GOLDEN: processes=0 has_dff=True."),
        ],
        "Open **real-proc**. Show proc stage; confirm $dff and processes=0.",
        "Call pass_real_proc(); assert ok.",
        "Confusing toy pass_proc with real proc. Expecting $dff before proc.",
        "Next: flatten + opt.",
        "before ← processes>0; proc; after ← processes=0 and $dff in types",
        [
            {"q": "Processes after proc?", "choices": ["0", "1", "2", "4"], "answer": 0},
            {"q": "Cell from always?", "choices": ["$dff", "$and", "$_AOI3_", "BUF"], "answer": 0},
            {"q": "has_dff?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
        ],
    ),
    (
        "module07-03-real-flatten-opt",
        "lab",
        "Real flatten & opt",
        "Why flatten/opt",
        "real-flatten-opt",
        "Flatten → 1 module / 4 cells; opt keeps 4 cells with $and count=1.",
        "real flatten + opt",
        "flatten inlines child into top; opt merges identical cells and cleans dead logic.",
        "GOLDEN: flatten modules=1 cells=4; opt cells=4 and_count=1.",
        [
            ("Before flatten", "01-hier", "Still two modules with a child instance."),
            ("flatten", "02-flat", "Child $dff inlined — module_count=1."),
            ("Four cells", "03-four", "$and $or $not $dff remain."),
            ("opt merge", "04-opt", "opt leaves and_count=1."),
            ("Golden", "05-golden", "GOLDEN: flat cells=4; opt and=1."),
        ],
        "Open **real-flatten-opt**. Show flatten then opt stages.",
        "Call pass_real_flatten_opt(); assert ok.",
        "Expecting module_count=2 after flatten. Counting instance cells after flatten.",
        "Next: aigmap + synth.",
        "flatten → modules=1 cells=4; opt → cells=4 and_count=1",
        [
            {"q": "Modules after flatten?", "choices": ["1", "2", "4", "0"], "answer": 0},
            {"q": "Cells after flatten?", "choices": ["4", "2", "7", "5"], "answer": 0},
            {"q": "$and after opt?", "choices": ["1", "2", "0", "4"], "answer": 0},
        ],
    ),
    (
        "module08-01-aigmap-synth",
        "lab",
        "aigmap & synth",
        "Why aigmap/synth",
        "aigmap-synth",
        "aigmap → 7 cells ($_AND_/$_NOT_); synth → 2 cells ($_AOI3_ + $_DFF_P_).",
        "aigmap + generic synth",
        "aigmap pushes toward AND/NOT form; synth -top runs Yosys's generic recipe to gate-level cells.",
        "GOLDEN: aigmap cells=7; synth cells=2 types=$_AOI3_,$_DFF_P_.",
        [
            ("Before aigmap", "01-opt", "opt netlist with $and/$or/$not/$dff."),
            ("aigmap", "02-aig", "Maps to $_AND_/$_NOT_ — cells=7."),
            ("synth recipe", "03-synth", "synth -top top runs the built-in flow."),
            ("AOI3 + DFF", "04-out", "Result: $_AOI3_ and $_DFF_P_."),
            ("Golden", "05-golden", "GOLDEN: synth cells=2."),
        ],
        "Open **aigmap-synth**. Show aigmap then synth; select $_AOI3_.",
        "Call pass_aigmap_synth(); assert ok.",
        "Expecting NAND2 from the toy techmap. Skipping synth -top.",
        "Next: real evidence engine.",
        "aigmap → cells=7; synth → cells=2 {$_AOI3_, $_DFF_P_}",
        [
            {"q": "aigmap cells?", "choices": ["7", "4", "2", "1"], "answer": 0},
            {"q": "synth cells?", "choices": ["2", "7", "4", "6"], "answer": 0},
            {"q": "Synth gate type?", "choices": ["$_AOI3_", "$and", "NAND2", "$or"], "answer": 0},
        ],
    ),
    (
        "module08-03-real-evidence",
        "lab",
        "Real Yosys evidence engine",
        "Why evidence",
        "real-evidence",
        "Run real_yosys_engine on the golden recipe; ok=True with synth 2 cells.",
        "real Yosys evidence engine",
        "The evidence engine checks CLI order, RTLIL goldens, proc/flatten/opt, and synth outputs together.",
        "GOLDEN: engine ok=True; after_synth_cells=2.",
        [
            ("Full recipe", "01-recipe", "read→hierarchy→proc→flatten→opt→synth→stat→write."),
            ("RTLIL checks", "02-rtlil", "modules/processes/$and goldens hold."),
            ("proc+flatten", "03-mid", "dff created; flatten cells=4."),
            ("synth out", "04-synth", "$_AOI3_ + $_DFF_P_."),
            ("OK", "05-ok", "GOLDEN: engine_ok=True."),
        ],
        "Open **real-evidence**. Build golden recipe; run Engine; confirm ok.",
        "Call real_yosys_engine(); assert ok.",
        "Stopping at toy yosys_engine. Wrong recipe order.",
        "Next: offline compare, then wrap.",
        "engine ← all real checks; ok ← recipe and stage goldens match",
        [
            {"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
            {"q": "synth cells?", "choices": ["2", "7", "4", "6"], "answer": 0},
            {"q": "Last write step?", "choices": ["write_json/verilog", "proc", "abc only", "place"], "answer": 0},
        ],
    ),
]


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def nav_line(prev, nxt):
    left = f"[← {prev[1]}](../{prev[0]}/README.md)" if prev else "← Start"
    right = f"[{nxt[1]} →](../{nxt[0]}/README.md)" if nxt else "End →"
    return f"{left} · [Course README](../README.md) · {right}"


def scaffold_module(row, prev, nxt):
    mid, kind, title, short, lab, outcomes, algorithm, hook, idea, walk, browser, impl, pitfalls, nxt_txt, pseudo, quiz = row
    key = mid.replace("module", "")
    mdir = ROOT / mid

    write(
        mdir / "README.md",
        f"""# Module {key}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · **ref**

{nav_line(prev, nxt)}

## Outcomes

After this module you can: **{outcomes}**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{algorithm}** using `common/real_solvers.py` + `common/rtl/tiny_and_or.v`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: re-run `bash common/scripts/run_evidence.sh` if Yosys is installed.

### Track B — Browser lab

1. Local: http://127.0.0.1:8080/tools/{lab}/
2. Live: {LIVE}/{lab}/

## Media

{MEDIA}

## Files

```
{mid}/
  README.md
  EXAMPLES.md
  CHECKLIST.md
  transcript.md
  quiz.json
  assets/
```
""",
    )

    write(
        mdir / "EXAMPLES.md",
        f"""# Examples — {title}

## Track A

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import *; print({_call_for(lab)}())"
```

RTL: `rtl/tiny_and_or.v` · scripts: `scripts/*.ys` · goldens: `evidence/goldens.json`.

## Pseudocode

```text
{pseudo}
```

## Notes

{idea}
""",
    )

    write(
        mdir / "CHECKLIST.md",
        f"""# Checklist — {title}

- [ ] Read EXAMPLES.md pseudocode
- [ ] Track A: {_call_for(lab)}() matches golden
- [ ] Track B: clear challenges on /tools/{lab}/
- [ ] Quiz: 3/3 on this module's goldens
""",
    )

    slides = [
        ("Hook", hook),
        ("The idea", idea),
        ("Pseudocode", f"```text\n{pseudo}\n```"),
        ("Walkthrough", "Five evidence frames from real Yosys on tiny_and_or.v."),
    ]
    for title_s, slug, cap in walk:
        slides.append((title_s, cap))
    slides += [
        ("Browser lab", browser),
        ("Implement track", impl),
        ("Pitfalls", pitfalls),
        ("Try these", f"```bash\ncd courses/learn_yosys/common\npython3 -c \"from real_solvers import {_call_for(lab)}; print({_call_for(lab)}())\"\n```"),
        ("Next", nxt_txt),
    ]

    parts = [f"# {title}\n\n**Module id:** {mid}\n"]
    for i, (t, body) in enumerate(slides, 1):
        parts.append(f"## Slide {i} — {t}\n\n{body}\n")
    # inject walkthrough marker before walk slides (slide 4 is Walkthrough intro; frames follow)
    text = "\n".join(parts)
    text = text.replace(
        "## Slide 4 — Walkthrough\n\nFive evidence frames from real Yosys on tiny_and_or.v.\n",
        "## Slide 4 — Walkthrough\n\nFive evidence frames from real Yosys on tiny_and_or.v.\n\n"
        "<!-- algorithm-walkthrough -->\n",
    )
    write(mdir / "transcript.md", text)

    write(
        mdir / "quiz.json",
        __import__("json").dumps(
            {"moduleId": mid, "items": [{**q, "id": f"q{i}"} for i, q in enumerate(quiz)]},
            indent=2,
        )
        + "\n",
    )

    write(
        mdir / "assets" / "STEPS.md",
        "# Walkthrough steps\n\n"
        + "\n".join(f"{i}. **{t}** (`{s}.png`) — {c}" for i, (t, s, c) in enumerate(walk, 1))
        + "\n",
    )


def _call_for(lab: str) -> str:
    return {
        "yosys-cli": "pass_cli_check",
        "rtlil-vocab": "pass_rtlil_vocab",
        "real-proc": "pass_real_proc",
        "real-flatten-opt": "pass_real_flatten_opt",
        "aigmap-synth": "pass_aigmap_synth",
        "real-evidence": "real_yosys_engine",
    }[lab]


def update_docs():
    write(
        ROOT / "docs" / "SCOPE.md",
        """# Scope

**Part A (literacy toys):** named pass ideas on `tiny_yosys.json` — proc/flatten/opt/strash/rewrite/techmap toys that mirror `learn_synthesis` concepts. These are **not** the Yosys binary.

**Part B (real Yosys evidence):** CLI + `.ys` scripts on `rtl/tiny_and_or.v` — `read_verilog`, `hierarchy`, `proc`, `flatten`, `opt`, `aigmap`, `synth`, `stat`, `write_*`, RTLIL vocabulary (`$and`/`$dff`/`$_AOI3_`…), checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**In:** Yosys pass order literacy (toy) + real CLI/RTLIL/synth evidence on the tiny design.

**Out:** Industrial Liberty techmap, FPGA `synth_ice40`/`synth_xilinx` deep dives, ABC internals, memory/FSM advanced passes (future modules), OpenROAD P&R (see `learn_openroad`).
""",
    )

    # MODULES.md — insert real labs before offline
    mods = ROOT / "docs" / "MODULES.md"
    rows = [
        "| `module00-00-intro` | `intro` | [Welcome to Yosys (toy + real)](../module00-00-intro/README.md) | — | — |",
        "| `module01-01-proc-elaborate` | `lab` | [Proc elaborate (toy)](../module01-01-proc-elaborate/README.md) | `proc-elaborate` | **ref** |",
        "| `module01-03-hierarchy-flatten` | `lab` | [Hierarchy flatten (toy)](../module01-03-hierarchy-flatten/README.md) | `hierarchy-flatten` | **ref** |",
        "| `module02-01-opt-dce` | `lab` | [Opt / DCE (toy)](../module02-01-opt-dce/README.md) | `opt-dce` | **ref** |",
        "| `module02-03-aig-strash` | `lab` | [AIG strash (toy)](../module02-03-aig-strash/README.md) | `aig-strash` | **ref** |",
        "| `module03-01-rewrite-balance` | `lab` | [Rewrite balance (toy)](../module03-01-rewrite-balance/README.md) | `rewrite-balance` | **ref** |",
        "| `module03-03-techmap-area` | `lab` | [Techmap area (toy)](../module03-03-techmap-area/README.md) | `techmap-area` | **ref** |",
        "| `module04-01-techmap-delay` | `lab` | [Techmap delay (toy)](../module04-01-techmap-delay/README.md) | `techmap-delay` | **ref** |",
        "| `module04-03-synth-script` | `lab` | [Synth script (toy)](../module04-03-synth-script/README.md) | `synth-script` | **ref** |",
        "| `module05-01-yosys-engine` | `lab` | [Yosys engine (toy)](../module05-01-yosys-engine/README.md) | `yosys-engine` | **ref** |",
        "| `module06-01-yosys-cli` | `lab` | [Yosys CLI & scripts](../module06-01-yosys-cli/README.md) | `yosys-cli` | **ref** |",
        "| `module06-03-rtlil-vocab` | `lab` | [RTLIL vocabulary](../module06-03-rtlil-vocab/README.md) | `rtlil-vocab` | **ref** |",
        "| `module07-01-real-proc` | `lab` | [Real proc pass](../module07-01-real-proc/README.md) | `real-proc` | **ref** |",
        "| `module07-03-real-flatten-opt` | `lab` | [Real flatten & opt](../module07-03-real-flatten-opt/README.md) | `real-flatten-opt` | **ref** |",
        "| `module08-01-aigmap-synth` | `lab` | [aigmap & synth](../module08-01-aigmap-synth/README.md) | `aigmap-synth` | **ref** |",
        "| `module08-03-real-evidence` | `lab` | [Real Yosys evidence engine](../module08-03-real-evidence/README.md) | `real-evidence` | **ref** |",
        "| `module05-03-offline-benchmark-compare` | `offline` | [Offline benchmark compare](../module05-03-offline-benchmark-compare/README.md) | offline | — |",
        "| `module99-00-wrap` | `wrap` | [Yosys path complete](../module99-00-wrap/README.md) | — | — |",
    ]
    write(
        mods,
        "# learn_yosys — module index\n\n"
        "| Id | Kind | Title | Lab | Status |\n"
        "|----|------|-------|-----|--------|\n"
        + "\n".join(rows)
        + "\n",
    )

    write(
        ROOT / "module00-00-intro" / "transcript.md",
        """# Welcome to Yosys (toy + real)

**Module id:** module00-00-intro

## Slide 1 — Welcome

learn_yosys has two parts: Part A teaches pass *ideas* on a toy netlist; Part B drives **real Yosys** with `.ys` scripts on `tiny_and_or.v`.

## Slide 2 — Part A literacy

Toy tiny_yosys: 6 cells; flatten→1; opt→5; strash→4; rewrite→3; nand 6/7 — names match Yosys passes, but it is not the Yosys binary.

## Slide 3 — Part B real Yosys

Real path: `read_verilog` → `hierarchy` → `proc` → `flatten` → `opt` → `aigmap`/`synth` → `stat`/`write`. Goldens come from Yosys logs.

## Slide 4 — Two tracks

Implement track: `common/solvers.py` (toy) and `common/real_solvers.py` (evidence). Browser labs mirror both.

## Slide 5 — RTLIL

Yosys IR is RTLIL — `$and`, `$dff`, later `$_AOI3_` / `$_DFF_P_` after synth. You will read `stat` and `dump`.

## Slide 6 — Begin

Start with the toy proc lab for pass names, then continue into the real CLI modules.
""",
    )

    write(
        ROOT / "module99-00-wrap" / "transcript.md",
        """# Yosys path complete

**Module id:** module99-00-wrap

## Slide 1 — Recap

You finished Part A toys and Part B real Yosys evidence on `tiny_and_or.v`.

## Slide 2 — Real goldens

After read: 2 modules, 1 process, $and×2. After proc: $dff. After flatten: 4 cells. After synth: $_AOI3_ + $_DFF_P_.

## Slide 3 — Commands you can run

```bash
cd courses/learn_yosys/common
yosys -s scripts/05_synth.ys
python3 -c "from real_solvers import real_yosys_compare; print(real_yosys_compare())"
```

## Slide 4 — Honesty

Toy labs teach pass *ideas*. Real modules teach the CLI, RTLIL, and checked-in Yosys evidence.

## Slide 5 — Next

Natural next: learn_openroad (place/route evidence).

## Slide 6 — Done

You can now open Yosys, write a short `.ys` script, and read `stat`/`dump` on a tiny design.
""",
    )

    # offline transcript nudge
    write(
        ROOT / "module05-03-offline-benchmark-compare" / "transcript.md",
        """# Offline benchmark compare

**Module id:** module05-03-offline-benchmark-compare

## Slide 1 — Offline

Print toy and real Yosys compare metrics without the browser.

## Slide 2 — Toy compare

```bash
cd courses/learn_yosys/common
python3 -c "from solvers import yosys_compare; print(yosys_compare())"
```

## Slide 3 — Real evidence

```bash
python3 -c "from real_solvers import real_yosys_compare; print(real_yosys_compare())"
```

## Slide 4 — Optional live Yosys

```bash
bash scripts/run_evidence.sh
python3 scripts/build_evidence_goldens.py
```

## Slide 5 — Expect

Real compare: ok=True, flatten_cells=4, synth_cells=2, types $_AOI3_/$_DFF_P_.

## Slide 6 — Next

Wrap — you finished the Yosys path.
""",
    )


def write_algos():
    steps = {
        "yosys-cli": [
            ("empty", "Empty design", "No RTL loaded — recipe starts empty.", [], [], {"stage": "empty"}),
            ("read", "read_verilog", "Load rtl/tiny_and_or.v into Yosys.", ["read_verilog"], [], {"stage": "read_hierarchy"}),
            ("hier", "hierarchy -top", "hierarchy -check -top top sets the design root.", ["read_verilog", "hierarchy"], [], {"stage": "read_hierarchy"}),
            ("proc", "proc next", "Third command is proc.", ["read_verilog", "hierarchy", "proc"], [], {"stage": "proc"}),
            ("golden", "Golden order", "GOLDEN: read → hierarchy → proc.", ["read_verilog", "hierarchy", "proc"], ["read_verilog", "hierarchy", "proc"], {"stage": "proc", "metricText": "prefix ok"}),
        ],
        "rtlil-vocab": [
            ("mods", "Two modules", "top + child after hierarchy.", [], ["$and"], {"stage": "read_hierarchy"}),
            ("proc", "Process in child", "Child still has 1 process.", [], [], {"stage": "read_hierarchy", "metricText": "processes=1"}),
            ("and", "$and×2", "Two $and cells.", [], ["$and"], {"stage": "read_hierarchy"}),
            ("ornot", "$or and $not", "OR/NOT as $or/$not.", [], ["$or", "$not"], {"stage": "read_hierarchy"}),
            ("golden", "Golden", "modules=2 processes=1 and=2.", [], ["$and"], {"stage": "read_hierarchy", "metricText": "GOLDEN"}),
        ],
        "real-proc": [
            ("before", "Before: process", "No $dff yet.", [], [], {"stage": "read_hierarchy"}),
            ("run", "proc runs", "proc creates $dff.", [], ["$dff"], {"stage": "proc"}),
            ("clear", "Processes cleared", "processes → 0.", [], [], {"stage": "proc", "metricText": "processes=0"}),
            ("dff", "$dff present", "$dff in design.", [], ["$dff"], {"stage": "proc"}),
            ("golden", "Golden", "processes=0 has_dff=True.", [], ["$dff"], {"stage": "proc", "metricText": "GOLDEN"}),
        ],
        "real-flatten-opt": [
            ("hier", "Before flatten", "Two modules.", [], [], {"stage": "proc"}),
            ("flat", "flatten", "module_count=1.", [], [], {"stage": "flatten"}),
            ("four", "Four cells", "$and $or $not $dff.", [], ["$and", "$dff"], {"stage": "flatten"}),
            ("opt", "opt merge", "and_count=1.", [], ["$and"], {"stage": "opt"}),
            ("golden", "Golden", "flat cells=4; opt and=1.", [], [], {"stage": "opt", "metricText": "GOLDEN"}),
        ],
        "aigmap-synth": [
            ("opt", "Before aigmap", "opt netlist.", [], [], {"stage": "opt"}),
            ("aig", "aigmap", "cells=7 $_AND_/$_NOT_.", [], ["$_AND_", "$_NOT_"], {"stage": "aigmap"}),
            ("synth", "synth recipe", "synth -top top.", [], [], {"stage": "synth"}),
            ("out", "AOI3 + DFF", "$_AOI3_ and $_DFF_P_.", [], ["$_AOI3_", "$_DFF_P_"], {"stage": "synth"}),
            ("golden", "Golden", "synth cells=2.", [], ["$_AOI3_"], {"stage": "synth", "metricText": "GOLDEN"}),
        ],
        "real-evidence": [
            ("recipe", "Full recipe", "read→…→write.", [], [], {"stage": "synth", "metricText": "recipe"}),
            ("rtlil", "RTLIL checks", "modules/processes/$and.", [], ["$and"], {"stage": "read_hierarchy"}),
            ("mid", "proc+flatten", "dff; flat cells=4.", [], ["$dff"], {"stage": "flatten"}),
            ("synth", "synth out", "$_AOI3_ + $_DFF_P_.", [], ["$_AOI3_", "$_DFF_P_"], {"stage": "synth"}),
            ("ok", "OK", "engine_ok=True.", [], [], {"stage": "synth", "metricText": "ok=True"}),
        ],
    }

    def step_js(sid, title, caption, recipe, highlight, state):
        st = state.get("stage", "empty")
        mt = state.get("metricText")
        mt_js = f', metricText: "{mt}"' if mt else ""
        return (
            f'      step("{sid}", "{title}", "{caption}", {recipe}, {highlight}, '
            f'{{ stage: STAGES.{st}{mt_js} }})'
        )

    lines = [
        '/** Walkthrough packs for real Yosys labs (kind: real_yosys). */',
        'import { STAGES } from "../../assets/real-yosys-core.js";',
        "",
        "function step(id, title, caption, recipe, highlightTypes, state) {",
        "  return { id, title, caption, recipe, highlightTypes, ...state };",
        "}",
        "",
        "export const REAL_YOSYS_ALGOS = {",
    ]
    mod_map = {
        "yosys-cli": "module06-01-yosys-cli",
        "rtlil-vocab": "module06-03-rtlil-vocab",
        "real-proc": "module07-01-real-proc",
        "real-flatten-opt": "module07-03-real-flatten-opt",
        "aigmap-synth": "module08-01-aigmap-synth",
        "real-evidence": "module08-03-real-evidence",
    }
    for lab, walk in steps.items():
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "real_yosys",')
        lines.append(f'    module: "{mod_map[lab]}",')
        lines.append("    steps: [")
        for sid, title, cap, recipe, hi, state in walk:
            lines.append(step_js(sid, title, cap, recipe, hi, state) + ",")
        lines.append("    ],")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    write(ROOT / "scripts" / "_real_yosys_algos.js", "\n".join(lines))
    write(WALK / "real-yosys-algos.js", "\n".join(lines))


HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} — EDA Algorithms Platform</title>
  <link rel="stylesheet" href="../../assets/site.css">
  <link rel="stylesheet" href="../../assets/tools-shared.css">
  <link rel="stylesheet" href="../../assets/clustering-lab.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="site-header-inner">
    <p class="brand"><a href="../../index.html">EDA Algorithms Platform</a></p>
    <nav class="site-nav"><a href="../index.html" class="is-active">Tools</a></nav>
  </div></header>
  <main id="main">
    <div class="eyebrow">Interactive tool</div>
    <section class="hero"><h1>{title}</h1><p class="lead">{lead}</p></section>
    <div id="lab-root"></div>
  </main>
  <script type="module" src="{lab}.js"></script>
  <script src="../../assets/site.js"></script>
</body>
</html>
"""

LAB_CHALLENGES = {
    "yosys-cli": """    { id: "read", title: "Add read_verilog", level: "Intro", prompt: "Click read_verilog.",
      check: (_c, api) => api.getRecipe()[0] === "read_verilog" },
    { id: "hier", title: "Add hierarchy", level: "Intro", prompt: "Second cmd hierarchy.",
      check: (_c, api) => api.getRecipe()[1] === "hierarchy" },
    { id: "proc", title: "Add proc", level: "Practice", prompt: "Third cmd proc.",
      check: (_c, api) => api.getRecipe()[2] === "proc" },
    { id: "prefix", title: "Prefix ok", level: "Practice", prompt: "First three match golden.",
      check: (_c, api) => api.checkPrefix(3) },
    { id: "len", title: "Length 3+", level: "Practice", prompt: "At least 3 commands.",
      check: (_c, api) => api.getRecipe().length >= 3 },
    { id: "stage", title: "Stage proc", level: "Practice", prompt: "Stage shows proc.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getStage().id === "proc" },
    { id: "not-synth-first", title: "Not synth first", level: "Challenge", prompt: "Do not start with synth.",
      check: (_c, api) => api.getRecipe().length > 0 && api.getRecipe()[0] !== "synth" },
    { id: "golden", title: "CLI golden", level: "Challenge", prompt: "prefix of 3 is golden.",
      check: (_c, api) => api.checkPrefix(3) },""",
    "rtlil-vocab": """    { id: "stage", title: "Show read stage", level: "Intro", prompt: "Load read_hierarchy.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().id === "read_hierarchy" },
    { id: "mods", title: "Modules 2", level: "Intro", prompt: "modules=2.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().moduleCount === 2 },
    { id: "proc", title: "Processes 1", level: "Practice", prompt: "processes=1.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().processes === 1 },
    { id: "and", title: "$and count", level: "Practice", prompt: "$and===2.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().cells.$and === 2 },
    { id: "sel", title: "Select $and", level: "Practice", prompt: "Click $and.",
      setup: (_c, api) => { api.showStage("read_hierarchy"); api.selectType("$and"); },
      check: (_c, api) => api.getSelected().includes("$and") },
    { id: "types", title: "Has $or", level: "Practice", prompt: "$or in types.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().types.includes("$or") },
    { id: "not", title: "Has $not", level: "Challenge", prompt: "$not present.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().types.includes("$not") },
    { id: "golden", title: "Vocab golden", level: "Challenge", prompt: "and=2 mods=2.",
      setup: (_c, api) => api.showStage("read_hierarchy"),
      check: (_c, api) => api.getStage().cells.$and === 2 && api.getStage().moduleCount === 2 },""",
    "real-proc": """    { id: "before", title: "Before proc", level: "Intro", prompt: "Show read stage (no $dff).",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => !api.getStage().types.includes("$dff") },
    { id: "after", title: "Show proc", level: "Intro", prompt: "Show proc stage.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getStage().id === "proc" },
    { id: "proc0", title: "Processes 0", level: "Practice", prompt: "processes=0.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getStage().processes === 0 },
    { id: "dff", title: "Has $dff", level: "Practice", prompt: "$dff present.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getStage().types.includes("$dff") },
    { id: "sel", title: "Select $dff", level: "Practice", prompt: "Click $dff.",
      setup: (_c, api) => { api.showStage("proc"); api.selectType("$dff"); },
      check: (_c, api) => api.getSelected().includes("$dff") },
    { id: "and", title: "Still $and", level: "Practice", prompt: "$and remains.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getStage().types.includes("$and") },
    { id: "recipe", title: "Recipe ends proc", level: "Challenge", prompt: "Build through proc.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getRecipe().includes("proc") },
    { id: "golden", title: "proc golden", level: "Challenge", prompt: "processes=0 + $dff.",
      setup: (_c, api) => api.showStage("proc"),
      check: (_c, api) => api.getStage().processes === 0 && api.getStage().types.includes("$dff") },""",
    "real-flatten-opt": """    { id: "flat", title: "Show flatten", level: "Intro", prompt: "flatten stage.",
      setup: (_c, api) => api.showStage("flatten"), check: (_c, api) => api.getStage().id === "flatten" },
    { id: "mods", title: "Modules 1", level: "Intro", prompt: "modules=1.",
      setup: (_c, api) => api.showStage("flatten"), check: (_c, api) => api.getStage().moduleCount === 1 },
    { id: "cells", title: "Cells 4", level: "Practice", prompt: "cells=4.",
      setup: (_c, api) => api.showStage("flatten"), check: (_c, api) => api.getStage().cellCount === 4 },
    { id: "opt", title: "Show opt", level: "Practice", prompt: "opt stage.",
      setup: (_c, api) => api.showStage("opt"), check: (_c, api) => api.getStage().id === "opt" },
    { id: "and1", title: "$and=1", level: "Practice", prompt: "$and count 1.",
      setup: (_c, api) => api.showStage("opt"), check: (_c, api) => api.getStage().cells.$and === 1 },
    { id: "dff", title: "DFF kept", level: "Practice", prompt: "$dff present.",
      setup: (_c, api) => api.showStage("opt"), check: (_c, api) => api.getStage().types.includes("$dff") },
    { id: "sel", title: "Select $and", level: "Challenge", prompt: "Select $and.",
      setup: (_c, api) => { api.showStage("opt"); api.selectType("$and"); },
      check: (_c, api) => api.getSelected().includes("$and") },
    { id: "golden", title: "flatten/opt golden", level: "Challenge", prompt: "flat cells=4 and=1.",
      setup: (_c, api) => api.showStage("opt"),
      check: (_c, api) => api.getStage().cellCount === 4 && api.getStage().cells.$and === 1 },""",
    "aigmap-synth": """    { id: "aig", title: "Show aigmap", level: "Intro", prompt: "aigmap stage.",
      setup: (_c, api) => api.showStage("aigmap"), check: (_c, api) => api.getStage().id === "aigmap" },
    { id: "c7", title: "Cells 7", level: "Intro", prompt: "cells=7.",
      setup: (_c, api) => api.showStage("aigmap"), check: (_c, api) => api.getStage().cellCount === 7 },
    { id: "synth", title: "Show synth", level: "Practice", prompt: "synth stage.",
      setup: (_c, api) => api.showStage("synth"), check: (_c, api) => api.getStage().id === "synth" },
    { id: "c2", title: "Cells 2", level: "Practice", prompt: "cells=2.",
      setup: (_c, api) => api.showStage("synth"), check: (_c, api) => api.getStage().cellCount === 2 },
    { id: "aoi", title: "Has $_AOI3_", level: "Practice", prompt: "$_AOI3_ present.",
      setup: (_c, api) => api.showStage("synth"), check: (_c, api) => api.getStage().types.includes("$_AOI3_") },
    { id: "dff", title: "Has $_DFF_P_", level: "Practice", prompt: "$_DFF_P_ present.",
      setup: (_c, api) => api.showStage("synth"), check: (_c, api) => api.getStage().types.includes("$_DFF_P_") },
    { id: "sel", title: "Select AOI3", level: "Challenge", prompt: "Select $_AOI3_.",
      setup: (_c, api) => { api.showStage("synth"); api.selectType("$_AOI3_"); },
      check: (_c, api) => api.getSelected().includes("$_AOI3_") },
    { id: "golden", title: "synth golden", level: "Challenge", prompt: "cells=2 AOI+DFF.",
      setup: (_c, api) => api.showStage("synth"),
      check: (_c, api) => api.getStage().cellCount === 2 && api.getStage().types.includes("$_AOI3_") },""",
    "real-evidence": """    { id: "recipe", title: "Build golden recipe", level: "Intro", prompt: "Load golden recipe.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix() },
    { id: "engine", title: "Run Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => { api.loadGoldenRecipe(); api.engine(); }, check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "ok true", level: "Practice", prompt: "engine ok.",
      setup: (_c, api) => { api.loadGoldenRecipe(); api.engine(); }, check: (_c, api) => api.getLast().ok === true },
    { id: "synth2", title: "synth cells 2", level: "Practice", prompt: "stage cells=2.",
      setup: (_c, api) => { api.loadGoldenRecipe(); api.engine(); }, check: (_c, api) => api.getStage().cellCount === 2 },
    { id: "types", title: "AOI+DFF", level: "Practice", prompt: "both types.",
      setup: (_c, api) => api.showStage("synth"),
      check: (_c, api) => api.getStage().types.includes("$_AOI3_") && api.getStage().types.includes("$_DFF_P_") },
    { id: "prefix", title: "Full prefix", level: "Practice", prompt: "full recipe order.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix() },
    { id: "sel", title: "Select DFF_P", level: "Challenge", prompt: "Select $_DFF_P_.",
      setup: (_c, api) => { api.showStage("synth"); api.selectType("$_DFF_P_"); },
      check: (_c, api) => api.getSelected().includes("$_DFF_P_") },
    { id: "golden", title: "evidence ok", level: "Challenge", prompt: "engineOk golden.",
      setup: (_c, api) => { api.loadGoldenRecipe(); api.engine(); }, check: (_c, api) => api.getLast().ok === true },""",
}

LEADS = {
    "yosys-cli": "Build read_verilog → hierarchy → proc as the first three Yosys commands.",
    "rtlil-vocab": "Inspect RTLIL after hierarchy: modules=2, processes=1, $and×2.",
    "real-proc": "Show real proc: processes→0 and $dff appears.",
    "real-flatten-opt": "Flatten to 1 module / 4 cells; opt keeps $and=1.",
    "aigmap-synth": "aigmap cells=7; synth → $_AOI3_ + $_DFF_P_ (2 cells).",
    "real-evidence": "Run the real evidence engine; ok=True on the golden recipe.",
}


def write_tools():
    for lab, challenges in LAB_CHALLENGES.items():
        title = lab.replace("-", " ").title()
        lead = LEADS[lab]
        js = f'''import {{ REAL_GOLDENS }} from "../../assets/real-yosys-core.js";
import {{ createInteractiveRealYosysLab }} from "../../assets/interactive-real-yosys-lab.js";
const root = document.getElementById("lab-root");
createInteractiveRealYosysLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,
  challenges: [
{challenges}
  ],
}});
'''
        write(TOOLS / lab / "index.html", HTML.format(title=title, lead=lead, lab=lab))
        write(TOOLS / lab / f"{lab}.js", js)

    # patch tools index
    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if "yosys-cli" not in it:
        block = """
        <li><a href="yosys-cli/">Yosys CLI &amp; scripts</a></li>
        <li><a href="rtlil-vocab/">RTLIL vocabulary</a></li>
        <li><a href="real-proc/">Real proc</a></li>
        <li><a href="real-flatten-opt/">Real flatten &amp; opt</a></li>
        <li><a href="aigmap-synth/">aigmap &amp; synth</a></li>
        <li><a href="real-evidence/">Real Yosys evidence</a></li>
"""
        it = it.replace(
            '        <li><a href="yosys-engine/">Yosys engine</a></li>\n      </ul>',
            '        <li><a href="yosys-engine/">Yosys engine (toy)</a></li>\n' + block + "      </ul>",
        )
        idx.write_text(it, encoding="utf-8", newline="\n")

    # walkthrough.js patch
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "REAL_YOSYS_ALGOS" not in text:
        text = text.replace(
            'import { YOSYS_ALGOS } from "./yosys-algos.js";\n'
            'import { drawYosys, STARTER as YOSYS_STARTER } from "../../assets/yosys-core.js";\n',
            'import { YOSYS_ALGOS } from "./yosys-algos.js";\n'
            'import { drawYosys, STARTER as YOSYS_STARTER } from "../../assets/yosys-core.js";\n'
            'import { REAL_YOSYS_ALGOS } from "./real-yosys-algos.js";\n'
            'import { drawRealYosys, STAGES as REAL_YOSYS_STAGES } from "../../assets/real-yosys-core.js";\n',
        )
        text = text.replace(
            "  ...YOSYS_ALGOS,\n};",
            "  ...YOSYS_ALGOS,\n  ...REAL_YOSYS_ALGOS,\n};",
        )
        if 'pack.kind === "real_yosys"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "yosys") {',
                '''  } else if (pack.kind === "real_yosys") {
    drawRealYosys(canvas, {
      stage: s.stage || REAL_YOSYS_STAGES.empty,
      highlightTypes: s.highlightTypes || [],
      selected: s.selected || [],
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "yosys") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"yosys-cli"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LAB_CHALLENGES)
        needle = '"yosys-engine": ("yosys-engine", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")


def patch_publish_meta():
    text = PUBLISH.read_text(encoding="utf-8")
    text2 = text.replace(
        '"title": "Yosys pass pipeline",\n'
        '        "focus": "proc → flatten → opt → strash → rewrite → techmap → report",',
        '"title": "Yosys (toy + real CLI)",\n'
        '        "focus": "toy passes → real read/proc/flatten/opt/synth evidence",',
    )
    text2 = text2.replace(
        '"Yosys pass pipeline literacy on tiny_yosys — proc, flatten, opt/DCE, strash, '
        '"\n            "rewrite, techmap area/delay, synth script, report. Clips and decks load from "',
        '"Part A toy pass literacy + Part B real Yosys CLI/RTLIL evidence on tiny_and_or.v '
        '"\n            "(read → proc → flatten → opt → synth). Clips and decks load from "',
    )
    # COURSE_INDEX titles map
    text2 = text2.replace(
        '"learn_yosys": {"title": "Yosys pass pipeline", "focus": "proc → opt → strash → rewrite → techmap → report"}',
        '"learn_yosys": {"title": "Yosys (toy + real CLI)", "focus": "toy passes → real synth evidence"}',
    )
    if text2 != text:
        PUBLISH.write_text(text2, encoding="utf-8", newline="\n")


def patch_readme():
    readme = ROOT / "README.md"
    t = readme.read_text(encoding="utf-8")
    t = t.replace(
        "**learn_yosys** is the open learning path for *Yosys pass pipeline* — proc → opt → strash → rewrite → techmap → report on `tiny_yosys.json`, linking to learn_synthesis concepts.",
        "**learn_yosys** is the open learning path for *Yosys* — Part A toy pass literacy on `tiny_yosys.json`, then Part B **real Yosys CLI/RTLIL evidence** on `rtl/tiny_and_or.v` (`read_verilog` → `proc` → `flatten` → `opt` → `synth`).",
    )
    # insert module landings if missing
    if "module06-01-yosys-cli" not in t:
        t = t.replace(
            "| `module05-01-yosys-engine` | [Yosys engine integration](module05-01-yosys-engine/README.md) |\n",
            "| `module05-01-yosys-engine` | [Yosys engine (toy)](module05-01-yosys-engine/README.md) |\n"
            "| `module06-01-yosys-cli` | [Yosys CLI & scripts](module06-01-yosys-cli/README.md) |\n"
            "| `module06-03-rtlil-vocab` | [RTLIL vocabulary](module06-03-rtlil-vocab/README.md) |\n"
            "| `module07-01-real-proc` | [Real proc pass](module07-01-real-proc/README.md) |\n"
            "| `module07-03-real-flatten-opt` | [Real flatten & opt](module07-03-real-flatten-opt/README.md) |\n"
            "| `module08-01-aigmap-synth` | [aigmap & synth](module08-01-aigmap-synth/README.md) |\n"
            "| `module08-03-real-evidence` | [Real Yosys evidence engine](module08-03-real-evidence/README.md) |\n",
        )
    write(readme, t)

    common = ROOT / "common" / "README.md"
    write(
        common,
        """# Track A — Yosys common

## Part A — toy literacy

Toy: `tiny_yosys.json` — AND/OR/dup-AND/dead-BUF/NOT/DFF across top+child.

```bash
cd courses/learn_yosys/common
python3 -c "from solvers import yosys_compare; print(yosys_compare())"
```

## Part B — real Yosys evidence

RTL: `rtl/tiny_and_or.v` · scripts: `scripts/*.ys` · logs: `logs/` · goldens: `evidence/goldens.json`.

```bash
# Requires yosys on PATH (optional — goldens are checked in)
bash scripts/run_evidence.sh
python3 scripts/build_evidence_goldens.py
python3 -c "from real_solvers import real_yosys_compare; print(real_yosys_compare())"
```

Goldens (Yosys 0.9 on tiny_and_or): after_read modules=2 processes=1 and=2; after_proc has $dff; flatten cells=4; aigmap cells=7; synth cells=2 (`$_AOI3_`, `$_DFF_P_`).
""",
    )


def main():
    chain = [
        ("module05-01-yosys-engine", "Engine"),
        *[ (r[0], r[3]) for r in REAL ],
        ("module05-03-offline-benchmark-compare", "Offline"),
        ("module99-00-wrap", "Wrap"),
    ]
    for i, row in enumerate(REAL):
        prev = chain[i]
        nxt = chain[i + 2]
        scaffold_module(row, prev, nxt)
        print("scaffolded", row[0])

    # fix offline/wrap nav briefly via their README if needed — skip heavy rewrite
    update_docs()
    write_algos()
    write_tools()
    patch_publish_meta()
    patch_readme()

    # capture / media script lists
    for name in ("capture_all_walkthroughs.sh", "capture_lab_snaps.sh", "build_all_media.sh"):
        p = ROOT / "scripts" / name
        if not p.exists():
            continue
        t = p.read_text(encoding="utf-8")
        for lab, mid in [
            ("yosys-cli", "module06-01-yosys-cli"),
            ("rtlil-vocab", "module06-03-rtlil-vocab"),
            ("real-proc", "module07-01-real-proc"),
            ("real-flatten-opt", "module07-03-real-flatten-opt"),
            ("aigmap-synth", "module08-01-aigmap-synth"),
            ("real-evidence", "module08-03-real-evidence"),
        ]:
            if lab not in t and "yosys-engine" in t:
                # append lab to arrays if present as bash arrays — best-effort
                pass
        # Prefer rewriting capture list from known pattern
    write_capture_scripts()
    print("OK")


def write_capture_scripts():
    labs = [
        "proc-elaborate",
        "hierarchy-flatten",
        "opt-dce",
        "aig-strash",
        "rewrite-balance",
        "techmap-area",
        "techmap-delay",
        "synth-script",
        "yosys-engine",
        "yosys-cli",
        "rtlil-vocab",
        "real-proc",
        "real-flatten-opt",
        "aigmap-synth",
        "real-evidence",
    ]
    lab_mods = [
        "module01-01-proc-elaborate",
        "module01-03-hierarchy-flatten",
        "module02-01-opt-dce",
        "module02-03-aig-strash",
        "module03-01-rewrite-balance",
        "module03-03-techmap-area",
        "module04-01-techmap-delay",
        "module04-03-synth-script",
        "module05-01-yosys-engine",
        "module06-01-yosys-cli",
        "module06-03-rtlil-vocab",
        "module07-01-real-proc",
        "module07-03-real-flatten-opt",
        "module08-01-aigmap-synth",
        "module08-03-real-evidence",
    ]
    mods = [
        "module00-00-intro",
        *lab_mods,
        "module05-03-offline-benchmark-compare",
        "module99-00-wrap",
    ]
    cap_lines = [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        'ROOT=$(cd "$(dirname "$0")/../../.." && pwd)',
        'CAP="$ROOT/.cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"',
        'cd "$ROOT"',
    ]
    for lab, m in zip(labs, lab_mods):
        cap_lines.append(
            f'python3 "$CAP" --lab {lab} --module-dir courses/learn_yosys/{m} --inject'
        )
    cap_lines.append("echo CAPTURE_OK")
    write(ROOT / "scripts" / "capture_all_walkthroughs.sh", "\n".join(cap_lines) + "\n")

    snap_lines = [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        'ROOT=$(cd "$(dirname "$0")/../../.." && pwd)',
        'SNAP="$ROOT/.cursor/skills/module-slides/scripts/capture_lab_snapshot.py"',
        'cd "$ROOT"',
    ]
    for lab, m in zip(labs, lab_mods):
        snap_lines.append(
            f'python3 "$SNAP" --tool {lab} --out courses/learn_yosys/{m}/assets/lab-starter.png'
        )
    snap_lines.append("echo SNAPS_OK")
    write(ROOT / "scripts" / "capture_lab_snaps.sh", "\n".join(snap_lines) + "\n")

    media_lines = [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        'ROOT=$(cd "$(dirname "$0")/../../.." && pwd)',
        'NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"',
        'cd "$ROOT"',
    ]
    for m in mods:
        media_lines.append(f'bash "$NAR" "courses/learn_yosys/{m}"')
    media_lines.append("echo MEDIA_OK")
    write(ROOT / "scripts" / "build_all_media.sh", "\n".join(media_lines) + "\n")



if __name__ == "__main__":
    main()
