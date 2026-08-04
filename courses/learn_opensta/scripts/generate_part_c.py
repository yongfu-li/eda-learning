#!/usr/bin/env python3
"""Generate learn_opensta Part C modules, tools, walkthroughs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"

PART_C = [
    ("module09-01-graph-build", "graph-build", "Graph build algorithm", "graph", "showGraph",
     "Build the timing graph from pins and delay arcs.", "5 pins, 4 arcs; cells u1/u2/u3."),
    ("module09-03-levelize-propagate", "levelize-propagate", "Levelize & propagate", "propagate", "showPropagate",
     "Levelize the graph and propagate arrivals/required.", "levels a/b=0…y=3; A(y)=2 R(y)=10."),
    ("module10-01-slack-algo", "slack-algo", "Slack algorithm", "slack", "showSlack",
     "Compute slack and the critical path.", "slack=8; path b→n1→n2→y."),
    ("module10-03-opensta-algo-engine", "opensta-algo-engine", "OpenSTA algo engine", "engine", "showEngine",
     "Run the full Part C engine and bind to real report goldens.", "engine ok; bind slack 8↔8."),
]

NAV = {
    "module09-01-graph-build": ("../module08-03-real-evidence/README.md", "Evidence", "../module09-03-levelize-propagate/README.md", "Levelize"),
    "module09-03-levelize-propagate": ("../module09-01-graph-build/README.md", "Graph", "../module10-01-slack-algo/README.md", "Slack"),
    "module10-01-slack-algo": ("../module09-03-levelize-propagate/README.md", "Levelize", "../module10-03-opensta-algo-engine/README.md", "Engine"),
    "module10-03-opensta-algo-engine": ("../module10-01-slack-algo/README.md", "Slack", "../module99-00-wrap/README.md", "Wrap"),
}

STEPS = {
    "graph-build": [
        ("pins", "Pins", "Five pins: inputs a/b, nets n1/n2, output y.", ["a", "b", "y"], ["5"]),
        ("arcs", "Arcs", "Four delay arcs from liberty-mapped cells.", ["arcs"], ["4"]),
        ("cells", "Cells", "Arcs belong to u1, u2, u3.", ["u1", "u2", "u3"], ["3"]),
        ("graph", "Graph", "The timing graph is pins plus arcs.", ["graph"], ["ok"]),
        ("golden", "Golden", "GOLDEN: pin_count=5 arc_count=4.", ["GOLDEN"], ["5/4"]),
    ],
    "levelize-propagate": [
        ("level", "Levelize", "Inputs at level 0; each arc raises sink level by 1.", ["a", "b"], ["0"]),
        ("n1", "Level n1", "n1 is level 1.", ["n1"], ["1"]),
        ("ay", "Arrival y", "Forward max arrival reaches y at 2.0.", ["y"], ["2"]),
        ("ry", "Required y", "Required at y equals period 10.", ["y"], ["10"]),
        ("golden", "Golden", "GOLDEN: A(y)=2 R(y)=10.", ["GOLDEN"], ["2/10"]),
    ],
    "slack-algo": [
        ("formula", "Slack", "Slack equals required minus arrival.", ["slack"], ["R-A"]),
        ("value", "Value 8", "With period 10 and arrival 2, slack is 8.", ["y"], ["8"]),
        ("path", "Critical path", "Backtrace picks b→n1→n2→y.", ["b", "n1", "n2", "y"], ["path"]),
        ("tie", "Tie-break", "Equal arrivals from a and b; name tie-break chooses b.", ["b"], ["tie"]),
        ("golden", "Golden", "GOLDEN: slack=8 path b→n1→n2→y.", ["GOLDEN"], ["8"]),
    ],
    "opensta-algo-engine": [
        ("graph", "Graph ok", "Graph build matches goldens.", ["graph"], ["ok"]),
        ("prop", "Propagate ok", "Arrival and required match.", ["A", "R"], ["ok"]),
        ("slack", "Slack ok", "Slack and path match.", ["S"], ["ok"]),
        ("bind", "Bind real", "Teaching slack equals Part B report slack.", ["bind"], ["8=8"]),
        ("golden", "Engine", "GOLDEN: opensta_algo_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module09-01-graph-build": [
        ("Pin count golden?", ["5", "3", "1", "10"], 0),
        ("Arc count golden?", ["4", "2", "8", "0"], 0),
        ("Graph nodes are?", ["pins + arcs", "GDS only", "Liberty only", "SDC only"], 0),
    ],
    "module09-03-levelize-propagate": [
        ("Arrival at y?", ["2.0", "10", "8", "0"], 0),
        ("Required at y?", ["10", "2", "8", "0"], 0),
        ("Input levels?", ["0", "1", "3", "10"], 0),
    ],
    "module10-01-slack-algo": [
        ("Slack golden?", ["8", "2", "10", "0"], 0),
        ("Critical path starts at?", ["b", "a", "y", "clk"], 0),
        ("Slack formula?", ["required − arrival", "arrival − required", "period only", "delay×2"], 0),
    ],
    "module10-03-opensta-algo-engine": [
        ("Engine ok means?", ["all Part C goldens + bind", "Magic only", "LVS only", "Place only"], 0),
        ("Bind compares to?", ["Part B report_checks goldens", "GDS", "ABC", "Verilator"], 0),
        ("engine_ok?", ["True", "False", "None", "N/A"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str, api_fn: str) -> str:
    return f"""import {{ ALGO_GOLDENS, PARTC_REAL, openstaAlgoEngine, partcBind }} from "../../assets/algo-opensta-core.js";
import {{ createInteractiveAlgoOpenstaLab }} from "../../assets/interactive-algo-opensta-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoOpenstaLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Run stages / bind, then Check.</p>`,
  defaultMode: "{mode}",
  challenges: [
    {{ id: "run", title: "Run stage", level: "Intro", prompt: "Open {mode}.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "slack", title: "Slack golden", level: "Practice", prompt: "slackY=8.",
      check: () => ALGO_GOLDENS.slackY === 8 }},
    {{ id: "bind", title: "Bind slack", level: "Practice", prompt: "Bind slack ok.",
      setup: (_c, api) => api.showBind("slack"), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "real", title: "Real slack", level: "Practice", prompt: "PARTC_REAL.slack=8.",
      check: () => PARTC_REAL.slack === 8 }},
    {{ id: "select", title: "Select pin", level: "Challenge", prompt: "Select a pin.",
      setup: (_c, api) => {{ api.{api_fn}(); const h = api.getHighlight(); if (h[0]) api.select(h[0]); }},
      check: (_c, api) => api.getSelected().length >= 1 }},
    {{ id: "path", title: "Critical path", level: "Challenge", prompt: "path starts with b.",
      check: () => ALGO_GOLDENS.criticalPath[0] === "b" }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true || openstaAlgoEngine().ok }},
  ],
}});
"""


def main() -> None:
    for mid, lab, title, mode, api_fn, outcome, idea in PART_C:
        prev_h, prev_l, next_h, next_l = NAV[mid]
        write(ROOT / mid / "README.md", f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · **ref**

[← {prev_l}]({prev_h}) · [Course README](../README.md) · [{next_l} →]({next_h})

## Outcomes

After this module you can: **{outcome}**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); study `common/algo_solvers.py` + `partc_bind.py`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `python3 algo_solvers.py && python3 partc_bind.py`

### Track B — Browser lab

1. Local: http://127.0.0.1:8080/tools/{lab}/

## Media

| Artifact | Path |
|----------|------|
| Transcript | [transcript.md](transcript.md) |
| Outline | [outline.yaml](outline.yaml) |
| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |
| Video | [video.mp4](video.mp4) |
| Quiz | [quiz.json](quiz.json) |
""")
        write(ROOT / mid / "EXAMPLES.md", f"""# Examples — {title}

## Track A

```bash
cd courses/learn_opensta/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Pseudocode

```text
{idea}
ok if algo goldens match and bind to Part B report
```
""")
        write(ROOT / mid / "CHECKLIST.md", f"""# Checklist — {title}

- [ ] EXAMPLES.md
- [ ] Track A solvers/bind ok
- [ ] Track B challenges
- [ ] Quiz 3/3
""")
        steps = STEPS[lab]
        walk = ["<!-- algorithm-walkthrough -->", ""]
        for i, (sid, st, cap, _b, _m) in enumerate(steps, 1):
            walk += [f"## Slide {i+2} — {st}", "", f"![{st}](assets/steps/{i:02d}-{sid}.png)", "", cap, ""]
        walk.append("<!-- /algorithm-walkthrough -->")
        write(ROOT / mid / "transcript.md", f"""# {title}

**Module id:** {mid}
**Lab:** {lab}
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why algorithms

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk)}

## Slide {len(steps)+3} — Browser lab track

Open **{lab}**. Run Graph / Levelize / Propagate / Slack / Bind, then Check.

## Slide {len(steps)+4} — Implement track

From common/, run algo_solvers.py and partc_bind.py.

## Slide {len(steps)+5} — Pitfalls

Changing tiny_algo_sta without updating Part B liberty delays. Ignoring the bind side.

## Slide {len(steps)+6} — Try these

From the common folder, run the Part C self-tests.

```bash
cd courses/learn_opensta/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Slide {len(steps)+7} — Pseudocode

Here is the check in plain steps.

```text
{idea}
ok if goldens match and bind
```

## Slide {len(steps)+8} — Next

Continue Part C, then wrap — internals literacy is next.
""")
        items = [{"q": q, "choices": c, "answer": a, "id": f"q{i}"} for i, (q, c, a) in enumerate(QUIZZES[mid])]
        write(ROOT / mid / "quiz.json", json.dumps({"moduleId": mid, "items": items}, indent=2) + "\n")
        step_lines = [f"# {title}", "", f"**Lab:** `{lab}`", ""]
        for i, (sid, st, cap, bullets, metrics) in enumerate(steps, 1):
            step_lines += [f"## Step {i} — {st}", "", f"![Step {i}](steps/{i:02d}-{sid}.png)", "",
                           f"**Caption (transcript):** {cap}", "", "**Slide bullets:**", ""]
            step_lines += [f"- {b}" for b in bullets]
            step_lines += ["", "**On-screen metrics:**", "", "```", metrics[0], "```", ""]
        write(ROOT / mid / "assets" / "STEPS.md", "\n".join(step_lines))
        tdir = PLATFORM / "tools" / lab
        write(tdir / f"{lab}.js", tool_js(lab, title, mode, api_fn))
        write(tdir / "index.html", f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title><link rel="stylesheet" href="../../assets/site.css"><link rel="stylesheet" href="../../assets/clustering-lab.css"></head>
<body data-asset-base="../../assets/"><main class="tool-page"><section class="hero"><h1>{title}</h1>
<p class="lead">Part C — OpenSTA algorithms + bind.</p></section><div id="lab-root"></div></main>
<script type="module" src="{lab}.js"></script></body></html>
""")
        print("ok", mid)

    lines = ['/** Part C OpenSTA algo walkthroughs */',
             'import { drawAlgoOpensta } from "../../assets/algo-opensta-core.js";',
             "", "export { drawAlgoOpensta };", "", "export const ALGO_OPENSTA_ALGOS = {"]
    for mid, lab, title, mode, *_ in PART_C:
        lines += [f'  "{lab}": {{', '    kind: "algo_opensta",', f'    title: "{title}",', f'    module: "{mid}",', "    steps: ["]
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            lines += ["      {", f"        id: {json.dumps(sid)},", f"        title: {json.dumps(st)},",
                      f"        caption: {json.dumps(cap)},", f"        bullets: {json.dumps(bullets)},",
                      f"        metrics: {json.dumps(metrics)},", f"        stageLabel: {json.dumps(st)},",
                      f"        metricText: {json.dumps(metrics[0])},", f"        highlight: {json.dumps(bullets)},", "      },"]
        lines += ["    ],", "  },"]
    lines.append("};")
    write(PLATFORM / "tools" / "algorithm-walkthrough" / "algo-opensta-algos.js", "\n".join(lines))

    mod = ROOT / "docs" / "MODULES.md"
    text = mod.read_text(encoding="utf-8")
    for mid, lab, title, *_ in PART_C:
        text = re.sub(
            rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
            f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |",
            text,
        )
    write(mod, text)

    wlines = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for mid, lab in [
        ("module01-01-timing-graph-map", "timing-graph-map"),
        ("module01-03-sdc-clocks", "sdc-clocks"),
        ("module02-01-arrival-required", "arrival-required"),
        ("module02-03-slack-critical", "slack-critical"),
        ("module03-01-report-checks", "report-checks"),
        ("module03-03-opensta-engine", "opensta-engine"),
        ("module06-01-opensta-cli", "opensta-cli"),
        ("module06-03-liberty-vocab", "liberty-vocab"),
        ("module07-01-real-read-netlist", "real-read-netlist"),
        ("module07-03-real-sdc", "real-sdc"),
        ("module08-01-real-report-checks", "real-report-checks"),
        ("module08-03-real-evidence", "opensta-evidence"),
    ]:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    for mid, lab, *_ in PART_C:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(wlines))

    # nav: evidence → Part C; wrap from algo engine
    ev = ROOT / "module08-03-real-evidence" / "README.md"
    if ev.is_file():
        t = ev.read_text(encoding="utf-8")
        t = t.replace("[Wrap →](../module99-00-wrap/README.md)", "[Graph build →](../module09-01-graph-build/README.md)")
        write(ev, t)
    write(ROOT / "module99-00-wrap" / "README.md", """# Module 99-00-wrap: OpenSTA path complete

**Module id:** `module99-00-wrap`  
**Kind:** `wrap`

[← Algo engine](../module10-03-opensta-algo-engine/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Part A map, Part B real OpenSTA evidence, and Part C algorithms bound to report goldens. Part D internals planned next.**

## Media

| Artifact | Path |
|----------|------|
| Transcript | [transcript.md](transcript.md) |
| Outline | [outline.yaml](outline.yaml) |
| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |
| Video | [video.mp4](video.mp4) |
| Quiz | [quiz.json](quiz.json) |
""")
    write(ROOT / "module99-00-wrap" / "transcript.md", """# OpenSTA path complete

**Module id:** module99-00-wrap
**Lab:** wrap

## Slide 1 — Parts A–C complete

You finished the OpenSTA map, real CLI evidence, and algorithms bound to report_checks goldens.

## Slide 2 — What you can do

You can build a timing graph, propagate arrivals, compute slack 8 on path b→y, and match the real OpenSTA report.

## Slide 3 — Next

Part D internals literacy is next, then Magic / Netgen / KLayout and OpenROAD / OpenLane.
""")
    print("PART_C_OK", len(PART_C))


if __name__ == "__main__":
    main()
