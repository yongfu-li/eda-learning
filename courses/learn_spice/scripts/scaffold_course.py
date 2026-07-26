#!/usr/bin/env python3
"""Scaffold learn_spice with module-slides stubs. Lab status **ref**."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_spice"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to SPICE", "Welcome", None,
     "Explain why post-PEX signoff needs a circuit engine: MNA, Newton, LU, transient.",
     None,
     "After PEX you need a circuit engine — MNA, Newton, LU, transient.",
     "Toy tiny_spice: voltage divider V2=3; RC transient; diode 1-D Newton."),
    ("module01-01-netlist-nodes", "lab", "Netlist nodes and ground", "Why netlists", "netlist-nodes",
     "Read netlist nodes/elements; ground reference.",
     "netlist node and element parsing",
     "Every SPICE solve starts from a netlist — nodes, elements, and a ground reference.",
     "GOLDEN: 5 elements, 2 unknown nodes (1, 2), ground 0.",
     [("Netlist", "01-netlist", "Five elements: Vin, R1, R2, Cload, Dprot on nodes 0–2."),
      ("Ground", "02-ground", "Node 0 is ground — reference for all voltages."),
      ("Unknowns", "03-unknowns", "Nodes 1 and 2 are unknown (not ground)."),
      ("Elements", "04-elements", "V, R, R, C, D — count each type in the toy."),
      ("Count", "05-count", "GOLDEN: element_count=5, unknown_nodes=2.")],
     "Open **netlist-nodes**. Inspect tiny_spice; confirm 5 elements and 2 unknown nodes.",
     "Call netlist_stats(); assert element_count==5, unknown_nodes==2, ground=='0'.",
     "Counting ground as unknown. Ignoring element ids vs node names.",
     "Next: stamp R and V into MNA.",
     "unknown ← nodes \\ {ground}; element_count ← len(elements)",
     [{"q": "element_count golden?", "choices": ["5", "3", "2", "6"], "answer": 0},
      {"q": "unknown_nodes golden?", "choices": ["2", "3", "5", "0"], "answer": 0},
      {"q": "ground node?", "choices": ["0", "1", "2", "Vin"], "answer": 0}]),
    ("module01-03-mna-stamps", "lab", "MNA stamping (R and V)", "Why MNA", "mna-stamps",
     "Stamp R and V into MNA; size 3 (v1, v2, i_Vin).",
     "MNA stamp R and V",
     "Modified nodal analysis builds G and b by stamping each element into a shared matrix.",
     "GOLDEN: mna size 3 — unknowns v1, v2, branch current i_Vin.",
     [("Stamp R", "01-stamp-r", "Conductance g=1/R adds to G at node pairs."),
      ("Stamp V", "02-stamp-v", "Voltage source adds branch column/row for i_Vin."),
      ("Matrix G", "03-matrix-g", "3×3 conductance + voltage-source stamps."),
      ("RHS b", "04-rhs-b", "Vin dc value enters the branch row of b."),
      ("Size 3", "05-size", "GOLDEN: size=3 for v1, v2, i_Vin.")],
     "Open **mna-stamps**. Build MNA; confirm matrix size 3.",
     "Call build_mna_linear_dc(); assert size==3.",
     "Forgetting voltage-source branch currents. Stamping C or D in linear DC MNA.",
     "Next: solve linear DC for V2=3.",
     "stamp R → G; stamp V → extra row/col; size ← |unknown| + |V|",
     [{"q": "MNA size golden?", "choices": ["3", "2", "5", "6"], "answer": 0},
      {"q": "Unknown node count?", "choices": ["2", "3", "1", "5"], "answer": 0},
      {"q": "Vin branch in MNA?", "choices": ["yes", "no", "only in TRAN", "ground only"], "answer": 0}]),
    ("module02-01-dc-linear", "lab", "Linear DC solve", "Why DC", "dc-linear",
     "Solve linear DC; V2=3.0 exactly (5*3/5).",
     "linear DC MNA solve",
     "Linear DC finds the operating point before Newton or transient analysis.",
     "GOLDEN: V1=5.0, V2=3.0 from the divider 5×3/(2+3).",
     [("Build", "01-build", "Assemble G and b from R and V stamps."),
      ("Solve", "02-solve", "Gaussian elimination on the 3×3 system."),
      ("V1=5", "03-v1", "Node 1 sits at the source — V1=5 V."),
      ("V2=3", "04-v2", "Divider: V2 = Vin × R2/(R1+R2) = 3 V."),
      ("Golden", "05-golden", "GOLDEN: V2=3.0 exactly on tiny_spice.")],
     "Open **dc-linear**. Solve DC; confirm V2=3.0.",
     "Call dc_linear_solve(); assert abs(volts['2']-3.0)<1e-9 and volts['1']==5.0.",
     "Including diode in linear DC. Wrong divider formula.",
     "Next: sparse LU literacy on G.",
     "x ← solve(G, b); V2 ← x[node_index('2')]",
     [{"q": "V2 golden (V)?", "choices": ["3.0", "5.0", "2.0", "2.255"], "answer": 0},
      {"q": "V1 golden (V)?", "choices": ["5.0", "3.0", "0.0", "2.5"], "answer": 0},
      {"q": "Divider formula?", "choices": ["Vin*R2/(R1+R2)", "Vin*R1/R2", "Vin/2", "I*R only"], "answer": 0}]),
    ("module02-03-sparse-lu", "lab", "Sparse LU lite", "Why sparse", "sparse-lu",
     "sparse_lu_lite on G; nnz=6.",
     "sparse LU factorization literacy",
     "Production SPICE uses sparse LU — count nonzeros and inspect L/U structure.",
     "GOLDEN: nnz=6 on the toy MNA conductance matrix.",
     [("NNZ", "01-nnz", "Count nonzeros in G before factorization."),
      ("Factor L", "02-factor-l", "Lower triangular L with unit diagonal."),
      ("Factor U", "03-factor-u", "Upper triangular U from elimination."),
      ("Fwd/back idea", "04-fwd-back", "Solve Ly=b then Ux=y — forward/back substitution."),
      ("NNZ 6", "05-nnz6", "GOLDEN: nnz=6 on tiny_spice G.")],
     "Open **sparse-lu**. Factor G; confirm nnz=6.",
     "Call sparse_lu_lite(G from dc_linear_solve); assert nnz==6.",
     "Confusing nnz with matrix dimension. Expecting fill-in on this tiny dense G.",
     "Next: Newton-Raphson on the same stamps.",
     "L,U ← lu(G); nnz ← count_nonzero(G)",
     [{"q": "nnz golden?", "choices": ["6", "3", "9", "12"], "answer": 0},
      {"q": "LU solves?", "choices": ["Ax=b", "only transient", "netlist parse", "DRC"], "answer": 0},
      {"q": "Sparse literacy goal?", "choices": ["nnz + factors", "layout DRC", "CTS", "PEX only"], "answer": 0}]),
    ("module03-01-newton-raphson", "lab", "Newton-Raphson DC", "Why Newton", "newton-raphson",
     "NR with linear stamps converges in 1 iter; v2=3.",
     "Newton-Raphson DC iteration",
     "Newton-Raphson linearizes nonlinear devices and iterates until the residual drops.",
     "GOLDEN: 1 iteration with linear-only stamps; v2=3.0.",
     [("Guess", "01-guess", "Start from linear DC solution as initial guess."),
      ("Jacobian", "02-jacobian", "Rebuild G each iteration (linear stamps unchanged)."),
      ("Update", "03-update", "x ← x + dx from solve(G, rhs)."),
      ("Residual", "04-residual", "max|dx| measures convergence each step."),
      ("Converged", "05-converged", "GOLDEN: 1 iter, v2=3, converged=True.")],
     "Open **newton-raphson**. Run NR without diode; confirm 1 iter and v2=3.",
     "Call newton_raphson_dc(include_diode=False); assert iters==1 and v2≈3.0.",
     "Enabling diode when the lesson is linear convergence. Wrong tolerance units.",
     "Next: device callbacks for diodes.",
     "repeat: build J, solve J·dx = −F, x += dx until |dx|<tol",
     [{"q": "NR iters golden (linear)?", "choices": ["1", "5", "20", "0"], "answer": 0},
      {"q": "v2 after NR?", "choices": ["3.0", "5.0", "2.255", "0.0"], "answer": 0},
      {"q": "NR used for?", "choices": ["nonlinear DC", "layout only", "CTS", "DRC width"], "answer": 0}]),
    ("module03-03-device-callbacks", "lab", "Device callbacks (diode)", "Why callbacks", "device-callbacks",
     "device_callback_diode + diode_loop_newton converges.",
     "diode device callback and 1-D Newton",
     "Nonlinear devices expose i(v) and g=di/dv to the MNA Newton loop.",
     "GOLDEN: diode_loop_newton converges; callback returns i and g at vd.",
     [("i(v)", "01-iv", "Shockley diode current from junction voltage."),
      ("g=di/dv", "02-g", "Small-signal conductance stamps into Jacobian."),
      ("1-D loop", "03-1d", "Series R + diode: scalar Newton on vd."),
      ("Converge", "04-converge", "GOLDEN: diode_loop_newton converged=True."),
      ("Hook", "05-hook", "Same callback pattern plugs into multi-device NR.")],
     "Open **device-callbacks**. Run callback + 1-D loop; confirm convergence.",
     "Call device_callback_diode(0.0) and diode_loop_newton(); assert converged.",
     "Using linear diode model. Forgetting companion conductance in transient.",
     "Next: backward-Euler transient on RC.",
     "cb ← {i(v), g(v)}; vd += −f(vd)/f′(vd) until converged",
     [{"q": "Callback returns?", "choices": ["i and g", "only v", "layout bbox", "nnz"], "answer": 0},
      {"q": "diode_loop_newton converged?", "choices": ["True", "False", "N/A", "unknown"], "answer": 0},
      {"q": "g is?", "choices": ["di/dv", "d2i/dv2", "1/R only", "C/dt"], "answer": 0}]),
    ("module04-01-transient-be", "lab", "Backward Euler transient", "Why transient", "transient-be",
     "Backward Euler RC; dt=0.5, 4 steps; final_v2≈2.255181.",
     "backward Euler RC transient",
     "Transient analysis steps time: capacitors use companion models at each dt.",
     "GOLDEN: dt=0.5, 4 steps, final_v2≈2.255181 (BE RC from v2_init=0).",
     [("Companion", "01-companion", "C → Gc=C/dt plus history current Ieq."),
      ("dt", "02-dt", "dt=0.5 s — timestep for each BE solve."),
      ("Step 1", "03-step1", "First step charges Cload from initial v2=0."),
      ("Waveform", "04-waveform", "v2 rises toward DC over four steps."),
      ("Final", "05-final", "GOLDEN: final_v2≈2.255181 after step 4.")],
     "Open **transient-be**. Run BE; confirm final_v2≈2.255181.",
     "Call transient_be(dt=0.5, steps=4); assert abs(final_v2-2.255181)<1e-5.",
     "Using forward Euler by mistake. Wrong initial capacitor voltage.",
     "Next: OP then TRAN pipeline.",
     "each step: stamp C companion, solve MNA, update v_cap",
     [{"q": "tran steps golden?", "choices": ["4", "3", "5", "1"], "answer": 0},
      {"q": "final_v2 ≈?", "choices": ["2.255181", "3.0", "5.0", "0.0"], "answer": 0},
      {"q": "BE companion Gc?", "choices": ["C/dt", "C*dt", "1/R", "Is*exp"], "answer": 0}]),
    ("module04-03-op-tran-pipeline", "lab", "OP then TRAN pipeline", "Why pipeline", "op-tran-pipeline",
     "DC OP then TRAN from v2_init=0.",
     "DC operating point then transient pipeline",
     "Production SPICE runs OP first, initializes storage elements, then steps TRAN.",
     "GOLDEN: OP V2=3.0; TRAN from v2_init=0 → final_v2≈2.255181.",
     [("OP", "01-op", "Linear DC solve sets resistor node voltages."),
      ("Init C", "02-init-c", "Initialize Cload voltage to 0 for TRAN start."),
      ("Step loop", "03-step-loop", "BE loop: companion stamp, solve, update cap."),
      ("Pipeline", "04-pipeline", "OP → init storage → transient_be steps."),
      ("Report", "05-report", "Report OP v2 and TRAN final_v2 goldens.")],
     "Open **op-tran-pipeline**. Run OP then TRAN; compare v2 at OP vs final.",
     "Call dc_linear_solve() then transient_be(v2_init=0.0); report both v2 values.",
     "Starting TRAN from OP cap voltage when lab sets v2_init=0. Skipping OP check.",
     "Next: full spice_engine integration.",
     "op ← dc_linear_solve(); tran ← transient_be(v2_init=0)",
     [{"q": "OP V2 golden?", "choices": ["3.0", "2.255", "0.0", "5.0"], "answer": 0},
      {"q": "TRAN starts v2_init?", "choices": ["0", "3.0", "5.0", "OP value"], "answer": 0},
      {"q": "Pipeline order?", "choices": ["OP then TRAN", "TRAN then OP", "NR only", "LU only"], "answer": 0}]),
    ("module05-01-spice-engine", "lab", "SPICE engine integration", "Why engine", "spice-engine",
     "spice_engine: dc_v2=3, nr converged, tran final, diode ok.",
     "SPICE engine DC NR TRAN diode",
     "A tiny engine chains DC, NR, transient, and diode checks on one netlist.",
     "GOLDEN: dc_v2=3, nr converged, tran final_v2≈2.255181, diode NR ok.",
     [("DC", "01-dc", "Linear OP: dc_v2=3.0."),
      ("NR", "02-nr", "Newton pass converges in 1 iter on linear stamps."),
      ("TRAN", "03-tran", "Four BE steps; report tran_final_v2."),
      ("Diode NR", "04-diode-nr", "1-D diode loop converges via callback."),
      ("OK", "05-ok", "GOLDEN: engine ok=True on tiny_spice.")],
     "Open **spice-engine**. Run engine; confirm all goldens.",
     "Call spice_engine(); assert ok, dc_v2≈3.0, nr_converged, diode converged.",
     "Reporting partial results. Mixing linear and nonlinear paths inconsistently.",
     "Next: offline benchmark compare, then wrap.",
     "engine: dc → nr → tran → diode_loop; ok ← goldens match",
     [{"q": "dc_v2 golden?", "choices": ["3.0", "2.255", "5.0", "0.0"], "answer": 0},
      {"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "Engine includes?", "choices": ["DC+NR+TRAN+diode", "netlist only", "PEX only", "CTS"], "answer": 0}]),
    ("module05-03-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline compare", None,
     "Print spice_compare metrics offline without the browser.", None,
     "Track A prints spice_compare without the browser.",
     "Load tiny_spice.json; print element_count, mna_size, dc_v2, nr_iters, tran_final_v2, ok."),
    ("module99-00-wrap", "wrap", "SPICE path complete", "Wrap", None,
     "Recap netlist, MNA, LU, Newton, callbacks, transient, engine goldens.", None,
     "You solved tiny_spice: 5 elements, MNA size 3, V2=3 DC, BE final≈2.255, engine ok.",
     "Natural next: learn_power or learn_pex / learn_erc."),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_spice.json`.
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

**learn_spice** teaches SPICE literacy — netlist parsing, MNA stamping, sparse LU, Newton-Raphson, device callbacks, backward-Euler transient, and a tiny engine.

**Prerequisite:** [learn_pex](../learn_pex/README.md) or parasitic extraction literacy. **Next:** [learn_power](../learn_power/README.md) or [learn_erc](../learn_erc/README.md).

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

→ **learn_power** or **learn_pex** / **learn_erc** ([`eda.md`](../../../eda.md))

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
                  "## Slide 4 — Toy netlist", "",
                  "Vin=5 V divider; R1=2, R2=3, Cload=1, Dprot — V2=3 DC; RC transient; diode Newton.", "",
                  "## Slide 5 — Path", "",
                  "Netlist → MNA → DC → sparse LU → Newton → callbacks → BE transient → engine.", "",
                  "## Slide 6 — Begin", "", "Next: netlist nodes and ground.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "5 elements; MNA size 3; V2=3 DC; nnz=6; NR 1 iter; final_v2≈2.255181; engine ok.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can explain OP vs TRAN on tiny_spice.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  "python3 -c \"from solvers import spice_compare; print(spice_compare())\" in common/", "",
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
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_pex", "learn_power", "learn_drc"], "answer": 0},
            {"id": "q3", "question": "Engine dc_v2 golden?", "choices": ["3.0", "2.255", "5.0", "0.0"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_spice — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))
    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nSPICE / circuit simulation literacy: netlist nodes, MNA stamping, "
          "linear DC, sparse LU, Newton-Raphson, diode callbacks, backward-Euler transient, "
          "OP→TRAN pipeline, tiny spice_engine.\n"
          "In: netlist → MNA → solve → transient → engine goldens on tiny_spice.\n"
          "Out: full device models, adaptive timestep, commercial SPICE signoff, RF/HSPICE decks.\n")
    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_spice.json`\n"
          "- **B:** platform `#spice` browser tools\n")
    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_spice

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-SPICE-orange)](docs/MODULES.md)

**learn_spice** is the open learning path for *SPICE / circuit simulation* — netlist parsing, MNA stamping, sparse LU, Newton-Raphson, device callbacks, backward-Euler transient, and a tiny spice engine on `tiny_spice.json`.

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

Open [platform courses](../../platform/courses/learn_spice/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_spice/scripts/scaffold_course.py
bash courses/learn_spice/scripts/capture_all_walkthroughs.sh
bash courses/learn_spice/scripts/capture_lab_snaps.sh
bash courses/learn_spice/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_spice --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#spice` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#spice

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
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_spice.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_spice.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_spice.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_spice
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {mid} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_spice/{mid}" --inject-transcript'
              for mid in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_spice/module*/; do
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
