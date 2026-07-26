#!/usr/bin/env python3
"""Generate learn_opensta Part B modules, tools, walkthroughs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"

PART_B = [
    (
        "module06-01-opensta-cli",
        "opensta-cli",
        "OpenSTA CLI & scripts",
        "empty",
        "Invoke sta -exit script.tcl; recipe starts read_liberty→read_verilog→link_design.",
        "First three cmds: read_liberty, read_verilog, link_design.",
    ),
    (
        "module06-03-liberty-vocab",
        "liberty-vocab",
        "Liberty vocabulary",
        "read_link",
        "Name liberty cells AND2/BUF/INV used by tiny_combo.",
        "Liberty cells AND2, BUF, INV; linked cells=3.",
    ),
    (
        "module07-01-real-read-netlist",
        "real-read-netlist",
        "Real read / link",
        "read_link",
        "Link tiny_combo and see instances u1/u2/u3.",
        "top=tiny_combo; cells u1,u2,u3.",
    ),
    (
        "module07-03-real-sdc",
        "real-sdc",
        "Real SDC + create_clock",
        "sdc",
        "Apply create_clock period 10 and I/O delays.",
        "clock clk period=10.",
    ),
    (
        "module08-01-real-report-checks",
        "real-report-checks",
        "Real report_checks",
        "report_checks",
        "Read real report_checks path delay and slack.",
        "endpoint y; delay 2.0; slack 8.0 MET.",
    ),
    (
        "module08-03-real-evidence",
        "opensta-evidence",
        "Real OpenSTA evidence",
        "report_checks",
        "Run the full real OpenSTA engine against goldens.",
        "real_opensta_engine ok=True.",
    ),
]

NAV = {
    "module06-01-opensta-cli": (
        "../module03-03-opensta-engine/README.md",
        "Map engine",
        "../module06-03-liberty-vocab/README.md",
        "Liberty",
    ),
    "module06-03-liberty-vocab": (
        "../module06-01-opensta-cli/README.md",
        "CLI",
        "../module07-01-real-read-netlist/README.md",
        "Read/link",
    ),
    "module07-01-real-read-netlist": (
        "../module06-03-liberty-vocab/README.md",
        "Liberty",
        "../module07-03-real-sdc/README.md",
        "SDC",
    ),
    "module07-03-real-sdc": (
        "../module07-01-real-read-netlist/README.md",
        "Read/link",
        "../module08-01-real-report-checks/README.md",
        "report_checks",
    ),
    "module08-01-real-report-checks": (
        "../module07-03-real-sdc/README.md",
        "SDC",
        "../module08-03-real-evidence/README.md",
        "Evidence",
    ),
    "module08-03-real-evidence": (
        "../module08-01-real-report-checks/README.md",
        "report_checks",
        "../module99-00-wrap/README.md",
        "Wrap",
    ),
}

STEPS = {
    "opensta-cli": [
        ("invoke", "sta -exit", "OpenSTA runs Tcl with sta -no_splash -exit script.tcl.", ["sta"], ["CLI"]),
        ("lib", "read_liberty", "First load the liberty timing models.", ["read_liberty"], ["lib"]),
        ("v", "read_verilog", "Then read the gate-level netlist.", ["read_verilog"], ["rtl"]),
        ("link", "link_design", "link_design binds cell instances to liberty.", ["link_design"], ["link"]),
        ("golden", "Golden", "GOLDEN: recipe prefix liberty→verilog→link.", ["GOLDEN"], ["3"]),
    ],
    "liberty-vocab": [
        ("lib", "Liberty file", "tiny_opensta_lib.lib holds AND2, BUF, INV.", ["lib"], ["file"]),
        ("and2", "AND2", "AND2 has ~1.0 ns delay in this teaching library.", ["AND2"], ["1.0"]),
        ("buf", "BUF", "BUF has ~0.5 ns delay.", ["BUF"], ["0.5"]),
        ("inv", "INV", "INV has ~0.5 ns delay.", ["INV"], ["0.5"]),
        ("golden", "Golden", "GOLDEN: liberty cells AND2,BUF,INV.", ["GOLDEN"], ["3"]),
    ],
    "real-read-netlist": [
        ("top", "Top design", "link_design tiny_combo sets the top.", ["tiny_combo"], ["top"]),
        ("u1", "Instance u1", "u1 is AND2.", ["u1"], ["AND2"]),
        ("u2", "Instance u2", "u2 is BUF.", ["u2"], ["BUF"]),
        ("u3", "Instance u3", "u3 is INV.", ["u3"], ["INV"]),
        ("golden", "Golden", "GOLDEN: cell_count=3 after link.", ["GOLDEN"], ["3"]),
    ],
    "real-sdc": [
        ("clk", "create_clock", "create_clock -name clk -period 10.", ["clk"], ["10"]),
        ("in", "Input delay", "set_input_delay 0 on all inputs.", ["in"], ["0"]),
        ("out", "Output delay", "set_output_delay 0 on all outputs.", ["out"], ["0"]),
        ("ideal", "Ideal network", "Clock network delay is ideal in this lab.", ["ideal"], ["0"]),
        ("golden", "Golden", "GOLDEN: clock clk period=10.", ["GOLDEN"], ["10"]),
    ],
    "real-report-checks": [
        ("cmd", "report_checks", "report_checks -path_delay max prints the worst path.", ["report_checks"], ["cmd"]),
        ("start", "Startpoint", "Startpoint is input b.", ["b"], ["start"]),
        ("end", "Endpoint", "Endpoint is output y.", ["y"], ["end"]),
        ("slack", "Slack MET", "Arrival 2.0 required 10.0 → slack 8.0 MET.", ["slack"], ["8"]),
        ("golden", "Golden", "GOLDEN: path_delay=2 slack=8.", ["GOLDEN"], ["2/8"]),
    ],
    "opensta-evidence": [
        ("recipe", "Full recipe", "Golden recipe has seven Tcl commands.", ["recipe"], ["7"]),
        ("cells", "Cells golden", "Linked design still has three cells.", ["cells"], ["3"]),
        ("path", "Path golden", "Path delay remains 2.0.", ["path"], ["2"]),
        ("slack", "Slack golden", "Slack remains 8.0.", ["slack"], ["8"]),
        ("golden", "Engine", "GOLDEN: real_opensta_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module06-01-opensta-cli": [
        ("Typical OpenSTA invocation?", ["sta -no_splash -exit script.tcl", "yosys -s", "magic", "netgen"], 0),
        ("First recipe command?", ["read_liberty", "report_checks", "flatten", "synth"], 0),
        ("Third recipe command?", ["link_design", "opt", "abc", "write_verilog"], 0),
    ],
    "module06-03-liberty-vocab": [
        ("Teaching liberty cells?", ["AND2, BUF, INV", "$and only", "NAND4 only", "DFF only"], 0),
        ("AND2 delay in tiny lib ~?", ["1.0", "10", "8", "0"], 0),
        ("Liberty file role?", ["timing models for cells", "GDS only", "LVS only", "SDC only"], 0),
    ],
    "module07-01-real-read-netlist": [
        ("Top module name?", ["tiny_combo", "top", "clk", "y"], 0),
        ("How many instances after link?", ["3", "1", "10", "0"], 0),
        ("Instance names?", ["u1,u2,u3", "c1,c2", "and1", "dff0"], 0),
    ],
    "module07-03-real-sdc": [
        ("create_clock period?", ["10", "2", "8", "1"], 0),
        ("Clock name?", ["clk", "y", "a", "reset"], 0),
        ("I/O external delay in lab?", ["0", "2", "8", "10"], 0),
    ],
    "module08-01-real-report-checks": [
        ("Path delay golden?", ["2.0", "8", "10", "0"], 0),
        ("Slack golden?", ["8.0", "2", "10", "0"], 0),
        ("Endpoint?", ["y", "clk", "a", "u1"], 0),
    ],
    "module08-03-real-evidence": [
        ("Engine ok means?", ["all Part B goldens match", "Magic DRC clean", "LVS only", "Place only"], 0),
        ("Recipe length?", ["7", "3", "1", "20"], 0),
        ("engine_ok?", ["True", "False", "None", "N/A"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, stage: str) -> str:
    return f"""import {{ REAL_GOLDENS, realEngine, recipePrefixOk, GOLDEN_RECIPE_IDS }} from "../../assets/real-opensta-core.js";
import {{ createInteractiveRealOpenstaLab }} from "../../assets/interactive-real-opensta-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRealOpenstaLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Build the recipe or open stages, then Check.</p>`,
  defaultStage: "{stage}",
  challenges: [
    {{ id: "stage", title: "Open stage", level: "Intro", prompt: "Show the {stage} stage.",
      setup: (_c, api) => api.showStage("{stage}"), check: (_c, api) => api.getStage()?.id === "{stage}" || api.getMode() === "{stage}" }},
    {{ id: "cells", title: "Cells 3", level: "Intro", prompt: "afterReadCells=3.",
      check: () => REAL_GOLDENS.afterReadCells === 3 }},
    {{ id: "prefix", title: "Recipe prefix", level: "Practice", prompt: "Load golden recipe; prefix ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix(3) }},
    {{ id: "slack", title: "Slack golden", level: "Practice", prompt: "slack=8.",
      check: () => REAL_GOLDENS.slack === 8 }},
    {{ id: "delay", title: "Delay golden", level: "Practice", prompt: "pathDelay=2.",
      check: () => REAL_GOLDENS.pathDelay === 2 }},
    {{ id: "select", title: "Select cell", level: "Challenge", prompt: "Select a cell.",
      setup: (_c, api) => {{ api.showStage("read_link"); api.select("u1"); }},
      check: (_c, api) => api.getSelected().includes("u1") }},
    {{ id: "endpoint", title: "Endpoint", level: "Challenge", prompt: "endpoint y.",
      check: () => REAL_GOLDENS.endpoint === "y" }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.engine().ok === true || realEngine(GOLDEN_RECIPE_IDS).ok }},
  ],
}});
"""


def main() -> None:
    for mid, lab, title, stage, outcome, idea in PART_B:
        prev_h, prev_l, next_h, next_l = NAV[mid]
        write(
            ROOT / mid / "README.md",
            f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · **ref**

[← {prev_l}]({prev_h}) · [Course README](../README.md) · [{next_l} →]({next_h})

## Outcomes

After this module you can: **{outcome}**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); study `common/real_solvers.py` + `common/evidence/goldens.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `python3 real_solvers.py` in `common/`.

### Track B — Browser lab

1. Local: http://127.0.0.1:8080/tools/{lab}/
2. Live: https://universal-verification-methodology.github.io/learning/tools/{lab}/

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
            ROOT / mid / "EXAMPLES.md",
            f"""# Examples — {title}

## Track A

```bash
cd courses/learn_opensta/common
python3 real_solvers.py
# optional regenerate:
# bash scripts/run_evidence.sh
```

## Pseudocode

```text
{idea}
ok if goldens match evidence/goldens.json
```
""",
        )
        write(
            ROOT / mid / "CHECKLIST.md",
            f"""# Checklist — {title}

- [ ] Read EXAMPLES.md
- [ ] Track A: real_solvers matches golden
- [ ] Track B: clear challenges on /tools/{lab}/
- [ ] Quiz: 3/3
""",
        )
        steps = STEPS[lab]
        walk = ["<!-- algorithm-walkthrough -->", ""]
        for i, (sid, st, cap, _b, _m) in enumerate(steps, 1):
            walk += [
                f"## Slide {i + 2} — {st}",
                "",
                f"![{st}](assets/steps/{i:02d}-{sid}.png)",
                "",
                cap,
                "",
            ]
        walk.append("<!-- /algorithm-walkthrough -->")
        write(
            ROOT / mid / "transcript.md",
            f"""# {title}

**Module id:** {mid}
**Lab:** {lab}
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real OpenSTA

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk)}

## Slide {len(steps) + 3} — Browser lab track

Open **{lab}**. Build the Tcl recipe or open evidence stages, then Check.

## Slide {len(steps) + 4} — Implement track

From common/, run real_solvers.py and confirm REAL_OPENSTA_OK.

## Slide {len(steps) + 5} — Pitfalls

Editing goldens by hand without re-running sta. Confusing Part A map JSON with real liberty delays.

## Slide {len(steps) + 6} — Try these

From the common folder, run the real OpenSTA self-test.

```bash
cd courses/learn_opensta/common
python3 real_solvers.py
```

## Slide {len(steps) + 7} — Pseudocode

Here is the check in plain steps.

```text
{idea}
ok if goldens match
```

## Slide {len(steps) + 8} — Next

Continue the Part B evidence track, then wrap — algorithms and internals come later.
""",
        )
        items = [
            {"q": q, "choices": c, "answer": a, "id": f"q{i}"}
            for i, (q, c, a) in enumerate(QUIZZES[mid])
        ]
        write(ROOT / mid / "quiz.json", json.dumps({"moduleId": mid, "items": items}, indent=2) + "\n")

        step_lines = [
            f"# {title} — step-by-step",
            "",
            f"**Module:** `{mid}`",
            f"**Lab / algo:** `{lab}`",
            f"**Viewer:** `/tools/algorithm-walkthrough/?algo={lab}&step=1`",
            "",
        ]
        for i, (sid, st, cap, bullets, metrics) in enumerate(steps, 1):
            step_lines += [
                f"## Step {i} — {st}",
                "",
                f"![Step {i}](steps/{i:02d}-{sid}.png)",
                "",
                f"**Caption (transcript):** {cap}",
                "",
                "**Slide bullets:**",
                "",
            ]
            for b in bullets:
                step_lines.append(f"- {b}")
            step_lines += ["", "**On-screen metrics:**", "", "```", metrics[0], "```", ""]
        write(ROOT / mid / "assets" / "STEPS.md", "\n".join(step_lines))

        tdir = PLATFORM / "tools" / lab
        write(tdir / f"{lab}.js", tool_js(lab, title, stage))
        write(
            tdir / "index.html",
            f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <link rel="stylesheet" href="../../assets/site.css">
  <link rel="stylesheet" href="../../assets/clustering-lab.css">
</head>
<body data-asset-base="../../assets/">
  <main class="tool-page">
    <section class="hero"><h1>{title}</h1><p class="lead">Part B — real OpenSTA CLI evidence.</p></section>
    <div id="lab-root"></div>
  </main>
  <script type="module" src="{lab}.js"></script>
</body>
</html>
""",
        )
        print("ok", mid)

    # walkthrough algos
    lines = [
        "/** Part B — real OpenSTA walkthroughs */",
        'import { drawRealOpensta, STAGES } from "../../assets/real-opensta-core.js";',
        "",
        "export { drawRealOpensta, STAGES };",
        "",
        "export const REAL_OPENSTA_ALGOS = {",
    ]
    stage_map = {
        "opensta-cli": "empty",
        "liberty-vocab": "read_link",
        "real-read-netlist": "read_link",
        "real-sdc": "sdc",
        "real-report-checks": "report_checks",
        "opensta-evidence": "report_checks",
    }
    for mid, lab, title, stage, _o, _i in PART_B:
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "real_opensta",')
        lines.append(f'    title: "{title}",')
        lines.append(f'    module: "{mid}",')
        lines.append("    steps: [")
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            lines.append("      {")
            lines.append(f"        id: {json.dumps(sid)},")
            lines.append(f"        title: {json.dumps(st)},")
            lines.append(f"        caption: {json.dumps(cap)},")
            lines.append(f"        bullets: {json.dumps(bullets)},")
            lines.append(f"        metrics: {json.dumps(metrics)},")
            lines.append(f"        stageLabel: {json.dumps(st)},")
            lines.append(f"        metricText: {json.dumps(metrics[0])},")
            lines.append(f'        stage: STAGES[{json.dumps(stage_map[lab])}],')
            lines.append(f"        highlight: {json.dumps(bullets)},")
            lines.append("      },")
        lines.append("    ],")
        lines.append("  },")
    lines.append("};")
    write(PLATFORM / "tools" / "algorithm-walkthrough" / "real-opensta-algos.js", "\n".join(lines))

    # MODULES status
    mod = ROOT / "docs" / "MODULES.md"
    text = mod.read_text(encoding="utf-8")
    for mid, lab, title, *_ in PART_B:
        text = re.sub(
            rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
            f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |",
            text,
        )
    write(mod, text)

    walk = ROOT / "docs" / "WALKTHROUGHS.md"
    existing = walk.read_text(encoding="utf-8").strip().splitlines()
    # keep Part A rows; append Part B
    base = [ln for ln in existing if "opensta-cli" not in ln and "real-evidence" not in ln or "Part A" in ln]
    if not any(ln.startswith("| Lab") for ln in base):
        base = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    # rebuild cleanly
    wlines = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for mid, lab, *_ in [
        ("module01-01-timing-graph-map", "timing-graph-map"),
        ("module01-03-sdc-clocks", "sdc-clocks"),
        ("module02-01-arrival-required", "arrival-required"),
        ("module02-03-slack-critical", "slack-critical"),
        ("module03-01-report-checks", "report-checks"),
        ("module03-03-opensta-engine", "opensta-engine"),
    ]:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    for mid, lab, *_ in PART_B:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    write(walk, "\n".join(wlines))

    # Fix Part A engine → Part B CLI nav
    eng = ROOT / "module03-03-opensta-engine" / "README.md"
    if eng.is_file():
        t = eng.read_text(encoding="utf-8")
        t = t.replace(
            "[Wrap →](../module99-00-wrap/README.md)",
            "[OpenSTA CLI →](../module06-01-opensta-cli/README.md)",
        )
        write(eng, t)

    wrap = ROOT / "module99-00-wrap" / "README.md"
    if wrap.is_file():
        write(
            wrap,
            """# Module 99-00-wrap: OpenSTA path complete

**Module id:** `module99-00-wrap`  
**Kind:** `wrap`

[← Real evidence](../module08-03-real-evidence/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Part A map and Part B real OpenSTA evidence (CLI → liberty → link → SDC → report_checks → engine). Parts C–D ship next.**

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
            ROOT / "module99-00-wrap" / "transcript.md",
            """# OpenSTA path complete

**Module id:** module99-00-wrap
**Lab:** wrap

## Slide 1 — Parts A and B complete

You finished the OpenSTA map and the real CLI evidence path on tiny_combo with liberty-lite.

## Slide 2 — What you can do

You can run sta scripts, link AND2/BUF/INV, declare a 10-unit clock, and read report_checks with delay 2 and slack 8.

## Slide 3 — Next

Algorithms bound to OpenSTA reports and internals literacy come next, then Magic/Netgen/KLayout and OpenROAD/OpenLane.
""",
        )

    print("PART_B_OK", len(PART_B))


if __name__ == "__main__":
    main()
