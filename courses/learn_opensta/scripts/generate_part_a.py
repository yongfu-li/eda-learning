#!/usr/bin/env python3
"""Generate learn_opensta Part A modules, tools, and walkthrough algos."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"

PART_A = [
    (
        "module01-01-timing-graph-map",
        "timing-graph-map",
        "Timing graph map",
        "timing_graph",
        "showGraph",
        "Map netlist cells to the OpenSTA timing graph.",
        "3 cells u1/u2/u3; graph nodes = cells + pins.",
    ),
    (
        "module01-03-sdc-clocks",
        "sdc-clocks",
        "SDC clocks",
        "sdc_clocks",
        "showClocks",
        "Declare create_clock period and name on clk.",
        "create_clock -period 10 → clk period=10.",
    ),
    (
        "module02-01-arrival-required",
        "arrival-required",
        "Arrival & required",
        "arrival",
        "showArrival",
        "Propagate arrivals and set required at the endpoint.",
        "A(y)=2.0; R(y)=10.0.",
    ),
    (
        "module02-03-slack-critical",
        "slack-critical",
        "Slack & critical path",
        "slack",
        "showSlack",
        "Compute slack = required − arrival on the critical path.",
        "slack = 10 − 2 = 8.",
    ),
    (
        "module03-01-report-checks",
        "report-checks",
        "report_checks map",
        "report_checks",
        "showReport",
        "Read a report_checks-shaped endpoint summary.",
        "endpoint y; path delay 2; slack 8.",
    ),
    (
        "module03-03-opensta-engine",
        "opensta-engine",
        "OpenSTA engine (map)",
        "engine",
        "showEngine",
        "Run the full Part A engine; ok when every golden matches.",
        "opensta_engine ok=True.",
    ),
]

NAV = {
    "module01-01-timing-graph-map": (
        "../module00-00-intro/README.md",
        "Intro",
        "../module01-03-sdc-clocks/README.md",
        "SDC clocks",
    ),
    "module01-03-sdc-clocks": (
        "../module01-01-timing-graph-map/README.md",
        "Timing graph",
        "../module02-01-arrival-required/README.md",
        "Arrival",
    ),
    "module02-01-arrival-required": (
        "../module01-03-sdc-clocks/README.md",
        "SDC clocks",
        "../module02-03-slack-critical/README.md",
        "Slack",
    ),
    "module02-03-slack-critical": (
        "../module02-01-arrival-required/README.md",
        "Arrival",
        "../module03-01-report-checks/README.md",
        "report_checks",
    ),
    "module03-01-report-checks": (
        "../module02-03-slack-critical/README.md",
        "Slack",
        "../module03-03-opensta-engine/README.md",
        "Engine",
    ),
    "module03-03-opensta-engine": (
        "../module03-01-report-checks/README.md",
        "report_checks",
        "../module99-00-wrap/README.md",
        "Wrap",
    ),
}

STEPS = {
    "timing-graph-map": [
        ("cells", "Three cells", "Tiny netlist has AND2, BUF, and INV.", ["u1", "u2", "u3"], ["3"]),
        ("pins", "Pins", "Primary pins a, b, y plus internal nets.", ["a", "b", "y"], ["pins"]),
        ("arcs", "Delay arcs", "Each cell carries a delay that becomes a timing arc.", ["delay"], ["arcs"]),
        ("graph", "Timing graph", "OpenSTA builds a graph from cells and pins.", ["graph"], ["map"]),
        ("golden", "Golden", "GOLDEN: cell_count=3.", ["GOLDEN"], ["3"]),
    ],
    "sdc-clocks": [
        ("port", "Clock port", "Port clk is the clock source.", ["clk"], ["port"]),
        ("create", "create_clock", "SDC create_clock names the clock and sets period.", ["create_clock"], ["SDC"]),
        ("period", "Period 10", "Period is 10 time units on this tiny design.", ["period"], ["10"]),
        ("ideal", "Ideal network", "Part A uses an ideal clock — no network latency yet.", ["ideal"], ["0"]),
        ("golden", "Golden", "GOLDEN: clock clk period=10.", ["GOLDEN"], ["10"]),
    ],
    "arrival-required": [
        ("inputs", "Input arrivals", "Primary inputs a and b arrive at time 0.", ["a", "b"], ["0"]),
        ("forward", "Forward propagate", "Arrival grows by cell delay along the cone.", ["n1", "n2"], ["fwd"]),
        ("ay", "Arrival at y", "Arrival at endpoint y is 2.0.", ["y"], ["2.0"]),
        ("ry", "Required at y", "Required at y equals the clock period 10.", ["y"], ["10"]),
        ("golden", "Golden", "GOLDEN: A(y)=2 and R(y)=10.", ["GOLDEN"], ["2/10"]),
    ],
    "slack-critical": [
        ("path", "Critical path", "The only data path is a/b → u1 → u2 → u3 → y.", ["u1", "u2", "u3"], ["path"]),
        ("delay", "Path delay", "Sum of cell delays is 2.0.", ["delay"], ["2.0"]),
        ("formula", "Slack formula", "Slack equals required minus arrival.", ["slack"], ["R-A"]),
        ("value", "Slack value", "With period 10 and arrival 2, slack is 8.", ["y"], ["8"]),
        ("golden", "Golden", "GOLDEN: slack=8 at period 10.", ["GOLDEN"], ["8"]),
    ],
    "report-checks": [
        ("cmd", "report_checks", "OpenSTA report_checks prints worst paths.", ["report_checks"], ["cmd"]),
        ("endpoint", "Endpoint", "The endpoint of interest is output y.", ["y"], ["end"]),
        ("path", "Path cells", "The report path lists u1, u2, u3.", ["u1", "u2", "u3"], ["path"]),
        ("slack", "Reported slack", "The reported slack matches 8.", ["slack"], ["8"]),
        ("golden", "Golden", "GOLDEN: endpoint y; slack 8.", ["GOLDEN"], ["y/8"]),
    ],
    "opensta-engine": [
        ("graph", "Graph ok", "Timing graph stage passes.", ["graph"], ["ok"]),
        ("sdc", "SDC ok", "Clock stage passes.", ["clk"], ["ok"]),
        ("arr", "Arrival ok", "Arrival and required stages pass.", ["A", "R"], ["ok"]),
        ("slack", "Slack ok", "Slack and report stages pass.", ["S"], ["ok"]),
        ("golden", "Engine golden", "GOLDEN: opensta_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module01-01-timing-graph-map": [
        ("How many cells in tiny_opensta?", ["3", "1", "10", "0"], 0),
        ("Timing graph nodes come from?", ["cells and pins", "GDS only", "Liberty only", "OpenROAD only"], 0),
        ("u1 cell type?", ["AND2", "NAND4", "DFF", "MUX"], 0),
    ],
    "module01-03-sdc-clocks": [
        ("SDC command to declare a clock?", ["create_clock", "report_checks", "read_verilog", "link_design"], 0),
        ("Tiny design clock period?", ["10", "2", "8", "1"], 0),
        ("Clock port name?", ["clk", "y", "a", "reset"], 0),
    ],
    "module02-01-arrival-required": [
        ("Arrival at y?", ["2.0", "10", "8", "0"], 0),
        ("Required at y (ideal)?", ["10", "2", "8", "0"], 0),
        ("Arrivals propagate which way?", ["forward (inputs→outputs)", "only backward", "random", "GDS only"], 0),
    ],
    "module02-03-slack-critical": [
        ("Slack formula?", ["required − arrival", "arrival − required", "period only", "delay × 2"], 0),
        ("Slack on tiny design?", ["8", "2", "10", "0"], 0),
        ("Path delay sum?", ["2.0", "8", "10", "0.5"], 0),
    ],
    "module03-01-report-checks": [
        ("OpenSTA path report command?", ["report_checks", "create_clock", "opt_clean", "write_verilog"], 0),
        ("Report endpoint?", ["y", "clk", "a", "n1"], 0),
        ("Reported slack golden?", ["8", "2", "10", "0"], 0),
    ],
    "module03-03-opensta-engine": [
        ("Engine ok means?", ["every Part A golden matches", "OpenROAD placed", "Magic DRC clean", "LVS passed"], 0),
        ("cell_count golden?", ["3", "6", "1", "0"], 0),
        ("engine_ok flag?", ["True", "False", "None", "N/A"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str, api_fn: str) -> str:
    return f"""import {{ GOLDENS, openstaEngine }} from "../../assets/opensta-core.js";
import {{ createInteractiveOpenstaLab }} from "../../assets/interactive-opensta-lab.js";
const root = document.getElementById("lab-root");

createInteractiveOpenstaLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Use stage buttons, then Check.</p>`,
  defaultMode: "{mode}",
  challenges: [
    {{ id: "run", title: "Run stage", level: "Intro", prompt: "Open the {mode} stage.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "cells", title: "Cells golden", level: "Practice", prompt: "cellCount=3.",
      check: () => GOLDENS.cellCount === 3 }},
    {{ id: "select", title: "Select node", level: "Practice", prompt: "Select a highlighted node.",
      setup: (_c, api) => {{ api.{api_fn}(); const h = api.getHighlight(); if (h[0]) api.select(h[0]); }},
      check: (_c, api) => api.getSelected().length >= 1 }},
    {{ id: "delay", title: "Path delay", level: "Practice", prompt: "pathDelay=2.",
      check: () => GOLDENS.pathDelay === 2 }},
    {{ id: "slack", title: "Slack golden", level: "Challenge", prompt: "slack=8.",
      check: () => GOLDENS.slackAtPeriod10 === 8 }},
    {{ id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is {mode}.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true || openstaEngine().ok }},
  ],
}});
"""


def main() -> None:
    for mid, lab, title, mode, api_fn, outcome, idea in PART_A:
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

1. Open [EXAMPLES.md](EXAMPLES.md); study `common/solvers.py` + `common/tiny_opensta.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `python3 solvers.py` in `common/`.

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
python3 solvers.py
```

## Pseudocode

```text
{idea}
ok if goldens match GOLDENS / tiny_opensta.json
```
""",
        )
        write(
            ROOT / mid / "CHECKLIST.md",
            f"""# Checklist — {title}

- [ ] Read EXAMPLES.md pseudocode
- [ ] Track A: solvers match golden
- [ ] Track B: clear challenges on /tools/{lab}/
- [ ] Quiz: 3/3
""",
        )

        steps = STEPS[lab]
        walk_lines = ["<!-- algorithm-walkthrough -->", ""]
        for i, (sid, st, cap, _b, _m) in enumerate(steps, 1):
            walk_lines += [
                f"## Slide {i + 2} — {st}",
                "",
                f"![{st}](assets/steps/{i:02d}-{sid}.png)",
                "",
                cap,
                "",
            ]
        walk_lines.append("<!-- /algorithm-walkthrough -->")
        write(
            ROOT / mid / "transcript.md",
            f"""# {title}

**Module id:** {mid}
**Lab:** {lab}
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why {title.split()[0]}

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk_lines)}

## Slide {len(steps) + 3} — Browser lab track

Open **{lab}**. Run the stage buttons and Check the goldens.

## Slide {len(steps) + 4} — Implement track

From common/, run solvers.py and confirm OPENSTA_MAP_OK.

## Slide {len(steps) + 5} — Pitfalls

Mixing algorithm STA from learn_sta with OpenSTA command names. Forgetting the clock period when reading slack.

## Slide {len(steps) + 6} — Try these

From the common folder, run the OpenSTA map self-test.

```bash
cd courses/learn_opensta/common
python3 solvers.py
```

## Slide {len(steps) + 7} — Pseudocode

Here is the check in plain steps.

```text
{idea}
ok if goldens match
```

## Slide {len(steps) + 8} — Next

Continue the OpenSTA Part A map, then the real CLI track.
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
        write(tdir / f"{lab}.js", tool_js(lab, title, mode, api_fn))
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
    <section class="hero"><h1>{title}</h1><p class="lead">Part A — OpenSTA timing/report map.</p></section>
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
        "/** Part A — OpenSTA map walkthroughs */",
        'import { drawOpensta, STARTER } from "../../assets/opensta-core.js";',
        "",
        "export { drawOpensta, STARTER };",
        "",
        "export const OPENSTA_ALGOS = {",
    ]
    for mid, lab, title, mode, _api, _o, _idea in PART_A:
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "opensta",')
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
            lines.append(f"        highlight: {json.dumps(bullets)},")
            lines.append("      },")
        lines.append("    ],")
        lines.append("  },")
    lines.append("};")
    write(PLATFORM / "tools" / "algorithm-walkthrough" / "opensta-algos.js", "\n".join(lines))

    # Update MODULES status for Part A
    mod_path = ROOT / "docs" / "MODULES.md"
    text = mod_path.read_text(encoding="utf-8")
    for mid, lab, title, *_ in PART_A:
        old = f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | planned |"
        new = f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |"
        text = text.replace(old, new)
    # also handle if already different
    for mid, lab, title, *_ in PART_A:
        import re

        text = re.sub(
            rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
            f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |",
            text,
        )
    write(mod_path, text)

    walk = ROOT / "docs" / "WALKTHROUGHS.md"
    wlines = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for mid, lab, *_ in PART_A:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    write(walk, "\n".join(wlines))

    print("PART_A_OK", len(PART_A))


if __name__ == "__main__":
    main()
