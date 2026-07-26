#!/usr/bin/env python3
"""Normalize real-Yosys lab transcripts to toy inject pattern (no duplicate walk slides)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# mid -> (hook, idea, pseudo, browser, impl, pitfalls, try_fn, next)
META = {
    "module06-01-yosys-cli": (
        "Real Yosys is a pass engine you drive with a .ys script or an interactive shell — not a toy button.",
        "GOLDEN: first three cmds = read_verilog, hierarchy, proc; invoke with yosys -s script.ys.",
        "recipe ← []; append read_verilog; hierarchy; proc; ok ← prefix matches golden",
        "Open **yosys-cli**. Append read_verilog, hierarchy, proc in order.",
        "Call pass_cli_check(['read_verilog','hierarchy','proc']); assert ok.",
        "Starting with proc. Skipping hierarchy -top.",
        "pass_cli_check",
        "Next: RTLIL vocabulary.",
        "Yosys CLI & scripts",
        "yosys-cli",
    ),
    "module06-03-rtlil-vocab": (
        "Yosys stores designs in RTLIL — modules, wires, processes, and $-typed cells you see in dump/stat.",
        "GOLDEN: after_read modules=2 processes=1 and_count=2; vocab includes $and $or $not $dff.",
        "load evidence; assert modules=2; processes=1; cells[$and]=2",
        "Open **rtlil-vocab**. Show read_hierarchy stage; select $and.",
        "Call pass_rtlil_vocab(); assert ok and and_count==2.",
        "Calling RTLIL 'gates' without $ prefix. Ignoring processes.",
        "pass_rtlil_vocab",
        "Next: real proc.",
        "RTLIL vocabulary",
        "rtlil-vocab",
    ),
    "module07-01-real-proc": (
        "Real proc lowers Verilog processes into RTLIL cells — the child always block becomes $dff.",
        "GOLDEN: after_proc processes=0 has_dff=True; types include $dff.",
        "before ← processes>0; proc; after ← processes=0 and $dff in types",
        "Open **real-proc**. Show proc stage; confirm $dff and processes=0.",
        "Call pass_real_proc(); assert ok.",
        "Confusing toy pass_proc with real proc. Expecting $dff before proc.",
        "pass_real_proc",
        "Next: flatten + opt.",
        "Real proc pass",
        "real-proc",
    ),
    "module07-03-real-flatten-opt": (
        "flatten inlines child into top; opt merges identical cells and cleans dead logic.",
        "GOLDEN: flatten modules=1 cells=4; opt cells=4 and_count=1.",
        "flatten → modules=1 cells=4; opt → cells=4 and_count=1",
        "Open **real-flatten-opt**. Show flatten then opt stages.",
        "Call pass_real_flatten_opt(); assert ok.",
        "Expecting module_count=2 after flatten. Counting instance cells after flatten.",
        "pass_real_flatten_opt",
        "Next: aigmap + synth.",
        "Real flatten & opt",
        "real-flatten-opt",
    ),
    "module08-01-aigmap-synth": (
        "aigmap pushes toward AND/NOT form; synth -top runs Yosys's generic recipe to gate-level cells.",
        "GOLDEN: aigmap cells=7; synth cells=2 types=$_AOI3_,$_DFF_P_.",
        "aigmap → cells=7; synth → cells=2 {$_AOI3_, $_DFF_P_}",
        "Open **aigmap-synth**. Show aigmap then synth; select $_AOI3_.",
        "Call pass_aigmap_synth(); assert ok.",
        "Expecting NAND2 from the toy techmap. Skipping synth -top.",
        "pass_aigmap_synth",
        "Next: real evidence engine.",
        "aigmap & synth",
        "aigmap-synth",
    ),
    "module08-03-real-evidence": (
        "The evidence engine checks CLI order, RTLIL goldens, proc/flatten/opt, and synth outputs together.",
        "GOLDEN: engine ok=True; after_synth_cells=2.",
        "engine ← all real checks; ok ← recipe and stage goldens match",
        "Open **real-evidence**. Build golden recipe; run Engine; confirm ok.",
        "Call real_yosys_engine(); assert ok.",
        "Stopping at toy yosys_engine. Wrong recipe order.",
        "real_yosys_engine",
        "Next: offline compare, then wrap.",
        "Real Yosys evidence engine",
        "real-evidence",
    ),
}


def write(mid: str, meta: tuple) -> None:
    hook, idea, pseudo, browser, impl, pitfalls, fn, nxt, title, lab = meta
    text = f"""# {title}

**Module id:** {mid}
**Lab:** {lab}
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why {lab.split('-')[0]}

{hook}

## Slide 2 — The idea

{idea}

<!-- algorithm-walkthrough -->
<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab track

Open **{lab}**. {browser}

## Slide 9 — Implement track

{impl}

## Slide 10 — Pitfalls

{pitfalls}

## Slide 11 — Try these

```bash
cd courses/learn_yosys/common
python3 -c "from real_solvers import {fn}; print({fn}())"
```

## Slide 12 — Pseudocode

```text
{pseudo}
```

## Slide 13 — Next

{nxt}
"""
    # Note: walkthrough inject renumbers; placeholder slides 8+ get renumbered after inject
    (ROOT / mid / "transcript.md").write_text(text, encoding="utf-8", newline="\n")
    print("fixed", mid)


def main() -> None:
    for mid, meta in META.items():
        write(mid, meta)


if __name__ == "__main__":
    main()
