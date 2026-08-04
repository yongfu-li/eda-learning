#!/usr/bin/env python3
"""Scaffold Part D — OpenSTA internals / contribute track for learn_opensta."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"

MODULES = [
    (
        "module14-01-sta-cpp-model",
        "sta-cpp-model",
        "STA C++ model",
        "sta",
        "Map Network / Graph / Sdc / Search to the OpenSTA C++ tree.",
        "Name the four pillars and how Search drives reports.",
    ),
    (
        "module14-03-read-find-path",
        "read-find-path",
        "Read find_path / report",
        "find_path",
        "Read the FindPath → report_checks shape bound to Part B goldens.",
        "tag_endpoints → walk_back → emit_path → report_checks (slack 8).",
    ),
    (
        "module15-03-contribute-opensta",
        "contribute-opensta",
        "Contribute to OpenSTA",
        "contribute",
        "Know where a new Tcl command lives and the minimal stub to build.",
        "app/HelloCmd.cc + Tcl register + CMake + sta -help.",
    ),
]

NAV = {
    "module14-01-sta-cpp-model": (
        "../module10-03-opensta-algo-engine/README.md",
        "Algo engine",
        "../module14-03-read-find-path/README.md",
        "Read find_path",
    ),
    "module14-03-read-find-path": (
        "../module14-01-sta-cpp-model/README.md",
        "STA C++",
        "../module15-03-contribute-opensta/README.md",
        "Contribute",
    ),
    "module15-03-contribute-opensta": (
        "../module14-03-read-find-path/README.md",
        "Read find_path",
        "../module99-00-wrap/README.md",
        "Wrap",
    ),
}

QUIZZES = {
    "module14-01-sta-cpp-model": [
        ("Which layer holds clocks and constraints?", ["Sdc", "Graph only", "Liberty only", "GDS"], 0),
        ("Timing vertices and edges live in?", ["Graph", "Sdc", "app/", "Quiz only"], 0),
        ("Which layer drives arrivals and path reports?", ["Search", "Network only", "Magic", "Netgen"], 0),
    ],
    "module14-03-read-find-path": [
        ("Part B slack golden on tiny_combo?", ["8.0", "2.0", "10", "0"], 0),
        ("First FindPath teaching stage?", ["tag_endpoints", "delete GDS", "run abc", "place"], 0),
        ("report_checks formats?", ["start/end/delay/slack path", "LEF only", "DEF only", "PDF only"], 0),
    ],
    "module15-03-contribute-opensta": [
        ("New command source often lives under?", ["app/*.cc", "platform/tools only", "common/rtl only", "docs/SCOPE.md only"], 0),
        ("Minimal stub needs?", ["Tcl cmd + register + CMake + rebuild", "only README", "only quiz", "only Liberty"], 0),
        ("Smoke after rebuild?", ["sta -help hello_cmd", "only browser restart", "edit goldens.json", "run Magic"], 0),
    ],
}

STEPS = {
    "sta-cpp-model": [
        ("network", "Network", "Network holds pins, nets, and instances.", ["Network"], ["netlist"]),
        ("graph", "Graph", "Graph is the timing vertex/edge view of the netlist.", ["Graph"], ["timing"]),
        ("sdc", "Sdc", "Sdc stores clocks and timing constraints.", ["Sdc"], ["clocks"]),
        ("search", "Search", "Search propagates arrivals and finds paths for reports.", ["Search"], ["paths"]),
        ("golden", "Golden", "GOLDEN: four pillars — Network, Graph, Sdc, Search.", ["GOLDEN"], ["4"]),
    ],
    "read-find-path": [
        ("tag", "Tag endpoints", "Search tags which pins are report endpoints.", ["tag_endpoints"], ["ends"]),
        ("walk", "Walk back", "From the worst slack endpoint, walk previous arcs.", ["walk_back"], ["back"]),
        ("emit", "Emit path", "Emit the ordered pin list for the critical path.", ["emit_path"], ["b→y"]),
        ("report", "report_checks", "report_checks formats delay 2 and slack 8 MET.", ["report_checks"], ["8"]),
        ("golden", "Golden", "GOLDEN: tag → walk → emit → report; slack 8 path b→y.", ["GOLDEN"], ["ok"]),
    ],
    "contribute-opensta": [
        ("tree", "Tree layout", "network/graph/sdc/search hold the engine; app/ holds Tcl cmds.", ["network", "app"], ["tree"]),
        ("stub", "Stub file", "Minimal .cc: Cmd subclass and command name hello_cmd.", ["stub"], [".cc"]),
        ("build", "CMake hook", "Add the object to CMakeLists and rebuild OpenSTA.", ["cmake"], ["build"]),
        ("smoke", "Smoke", "sta -help hello_cmd proves the command exists.", ["sta -help"], ["smoke"]),
        ("golden", "Golden", "GOLDEN: path + tcl_cmd + cmake + rebuild + help smoke.", ["GOLDEN"], ["ok"]),
    ],
}

TRANSCRIPT_BODY = {
    "module14-01-sta-cpp-model": """## Slide 1 — Why STA C++

Browser IR and JSON are maps. Real OpenSTA stores the same ideas as C++ objects.

## Slide 2 — The idea

GOLDEN: Network, Graph, Sdc, Search — Search drives arrivals and path reports.

<!-- algorithm-walkthrough -->

## Slide 3 — Network

![Network](assets/steps/01-network.png)

Network holds pins, nets, and instances.

## Slide 4 — Graph

![Graph](assets/steps/02-graph.png)

Graph is the timing vertex and edge view of the netlist.

## Slide 5 — Sdc

![Sdc](assets/steps/03-sdc.png)

Sdc stores clocks and timing constraints from create_clock and friends.

## Slide 6 — Search

![Search](assets/steps/04-search.png)

Search propagates arrivals and finds paths for report_checks.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: four pillars — Network, Graph, Sdc, Search.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab track

Open **sta-cpp-model**. Click through the four pillars and check the goldens.

## Slide 9 — Implement track

Call sta_cpp_model() in internals_solvers; assert pillar count and nesting.

## Slide 10 — Pitfalls

Treating JSON keys as the C++ API. Confusing Graph with physical Magick layout.

## Slide 11 — Try these

From the common folder, run the internals solvers self-test.

```bash
cd courses/learn_opensta/common
python3 internals_solvers.py
```

## Slide 12 — Pseudocode

Here is the OpenSTA nesting in plain steps.

```text
Network → pins/nets/instances
Graph → vertices/edges from Network
Sdc → clocks/constraints
Search → arrivals + FindPath for reports
```

## Slide 13 — Next

Next: read the FindPath to report_checks shape in the OpenSTA tree.
""",
    "module14-03-read-find-path": """## Slide 1 — Why read FindPath

Part C algorithms match moves. Now map those moves onto the real C++ and Tcl report shape.

## Slide 2 — The idea

GOLDEN: tag endpoints, walk back the worst path, emit pins, format report_checks — slack 8 like Part B.

<!-- algorithm-walkthrough -->

## Slide 3 — Tag endpoints

![Tag endpoints](assets/steps/01-tag.png)

Search tags which pins are report endpoints.

## Slide 4 — Walk back

![Walk back](assets/steps/02-walk.png)

From the worst slack endpoint, walk previous arcs.

## Slide 5 — Emit path

![Emit path](assets/steps/03-emit.png)

Emit the ordered pin list — teaching path b, n1, n2, y.

## Slide 6 — report_checks

![report_checks](assets/steps/04-report.png)

report_checks formats delay 2.0 and slack 8.0 MET.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: tag → walk → emit → report; slack 8 path b to y.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab track

Open **read-find-path**. Step the FindPath pipeline and check.

## Slide 9 — Implement track

Call read_find_path(); assert stage order and Part B slack bind.

## Slide 10 — Pitfalls

Expecting FindPath to replace Liberty. Ignoring the Part B delay and slack goldens.

## Slide 11 — Try these

From the common folder, call read_find_path and print the stages.

```bash
cd courses/learn_opensta/common
python3 -c "from internals_solvers import read_find_path; print(read_find_path())"
```

## Slide 12 — Pseudocode

Here is the FindPath teaching flow in plain steps.

```text
tag_endpoints
walk_back from worst slack
emit_path → [b, n1, n2, y]
report_checks → delay 2, slack 8 MET
```

## Slide 13 — Next

Next: contribute a minimal Tcl command of your own.
""",
    "module15-03-contribute-opensta": """## Slide 1 — Why contribute

Reading is not enough. A contributor knows where a command lives and how it enters the build.

## Slide 2 — The idea

GOLDEN: add app/HelloCmd.cc, register the Tcl command, hook CMake, rebuild, sta -help hello_cmd.

<!-- algorithm-walkthrough -->

## Slide 3 — Tree layout

![Tree layout](assets/steps/01-tree.png)

network, graph, sdc, and search hold the engine; app holds Tcl commands.

## Slide 4 — Stub file

![Stub file](assets/steps/02-stub.png)

Minimal .cc: Cmd subclass and command name hello_cmd.

## Slide 5 — CMake hook

![CMake hook](assets/steps/03-build.png)

Add the object to CMakeLists and rebuild OpenSTA.

## Slide 6 — Smoke

![Smoke](assets/steps/04-smoke.png)

sta -help hello_cmd proves the command exists.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: path plus Tcl register plus CMake plus rebuild plus help smoke.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab track

Open **contribute-opensta**. Assemble the contribute checklist and check.

## Slide 9 — Implement track

Call contribute_opensta(); assert checklist length and smoke cmd.

## Slide 10 — Pitfalls

Editing only docs. Forgetting the CMake entry. Skipping help smoke.

## Slide 11 — Try these

From the common folder, call contribute_opensta and print the checklist.

```bash
cd courses/learn_opensta/common
python3 -c "from internals_solvers import contribute_opensta; print(contribute_opensta())"
```

## Slide 12 — Pseudocode

Here is the contribute checklist in plain steps.

```text
path ← app/HelloCmd.cc
register Tcl cmd hello_cmd
add to CMake; rebuild
smoke ← sta -help hello_cmd
```

## Slide 13 — Next

Wrap the OpenSTA path — you can use OpenSTA and open the C++ tree with intent.
""",
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str) -> str:
    return f"""import {{ INTERNALS_GOLDENS, partDEngine }} from "../../assets/opensta-internals-core.js";
import {{ createInteractiveOpenstaInternalsLab }} from "../../assets/interactive-opensta-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveOpenstaInternalsLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Use the stage buttons, then Check.</p>`,
  defaultMode: "{mode}",
  challenges: [
    {{ id: "run", title: "Run stage", level: "Intro", prompt: "Open the {mode} stage.",
      setup: (_c, api) => api.showMode("{mode}"), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.showMode("{mode}"), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "engine", title: "Engine", level: "Practice", prompt: "Part D engine ok.",
      setup: (_c, api) => api.runEngine(), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "select", title: "Select step", level: "Practice", prompt: "Select a highlighted step.",
      setup: (_c, api) => {{ api.showMode("{mode}"); const h = api.getHighlight(); if (h[0]) api.select(h[0]); }},
      check: (_c, api) => api.getSelected().length >= 1 }},
    {{ id: "pillars", title: "Goldens exist", level: "Practice", prompt: "INTERNALS_GOLDENS present.",
      check: () => INTERNALS_GOLDENS.pillars === 4 }},
    {{ id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is {mode}.",
      setup: (_c, api) => api.showMode("{mode}"), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "note", title: "Has note", level: "Challenge", prompt: "last has note string.",
      setup: (_c, api) => api.showMode("{mode}"), check: (_c, api) => typeof api.getLast()?.note === "string" }},
    {{ id: "golden", title: "Engine golden", level: "Challenge", prompt: "partDEngine ok.",
      check: () => partDEngine().ok === true }},
  ],
}});
"""


def tool_html(lab: str, title: str) -> str:
    return f"""<!DOCTYPE html>
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
    <section class="hero"><h1>{title}</h1><p class="lead">Part D — OpenSTA internals / contribute.</p></section>
    <div id="lab-root"></div>
  </main>
  <script type="module" src="{lab}.js"></script>
</body>
</html>
"""


def write_walkthrough_algos() -> None:
    lines = [
        "/** Part D — OpenSTA internals walkthroughs (mirrors STEPS.md). */",
        'import { drawOpenstaInternals } from "../../assets/opensta-internals-core.js";',
        "",
        "export { drawOpenstaInternals };",
        "",
        "export const OPENSTA_INTERNALS_ALGOS = {",
    ]
    for mid, lab, title, _mode, _outcome, _idea in MODULES:
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "opensta_internals",')
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
    write(
        PLATFORM / "tools" / "algorithm-walkthrough" / "opensta-internals-algos.js",
        "\n".join(lines),
    )


def main() -> None:
    for mid, lab, title, mode, outcome, idea in MODULES:
        prev_h, prev_l, next_h, next_l = NAV[mid]
        mdir = ROOT / mid
        fn = lab.replace("-", "_")

        write(
            mdir / "README.md",
            f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · **ref**

[← {prev_l}]({prev_h}) · [Course README](../README.md) · [{next_l} →]({next_h})

## Outcomes

After this module you can: **{outcome}**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); study `common/internals_solvers.py` + `common/internals/`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `python3 internals_solvers.py` in `common/`.

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
            mdir / "EXAMPLES.md",
            f"""# Examples — {title}

## Track A

```bash
cd courses/learn_opensta/common
python3 -c "from internals_solvers import {fn}; print({fn}())"
```

Sources: `internals_solvers.py` · annotated excerpts under `internals/`.

## Pseudocode

```text
{idea}
ok if goldens match INTERNALS_GOLDENS
```

## Notes

Part D teaches how to read and extend OpenSTA C++ — not a full reimplementation.
Upstream: https://github.com/The-OpenROAD-Project/OpenSTA
""",
        )

        write(
            mdir / "CHECKLIST.md",
            f"""# Checklist — {title}

- [ ] Read EXAMPLES.md pseudocode
- [ ] Track A: internals_solvers helper matches golden
- [ ] Track B: clear challenges on /tools/{lab}/
- [ ] Quiz: 3/3
""",
        )

        write(
            mdir / "transcript.md",
            f"""# {title}

**Module id:** {mid}
**Lab:** {lab}
**Tracks:** A (implement) · B (browser lab)

{TRANSCRIPT_BODY[mid]}
""",
        )

        items = [
            {"q": q, "choices": c, "answer": a, "id": f"q{i}"}
            for i, (q, c, a) in enumerate(QUIZZES[mid])
        ]
        write(mdir / "quiz.json", json.dumps({"moduleId": mid, "items": items}, indent=2) + "\n")

        step_lines = [
            f"# {title} — step-by-step (for slides / transcript)",
            "",
            f"**Module:** `{mid}`",
            f"**Lab / algo:** `{lab}`",
            f"**Viewer:** `/tools/algorithm-walkthrough/?algo={lab}&step=1`",
            "",
            "Use each **Caption** as spoken prose (or a shortened slide note).",
            "Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.",
            "",
        ]
        for i, (sid, st, cap, bullets, metrics) in enumerate(STEPS[lab], 1):
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
        write(mdir / "assets" / "STEPS.md", "\n".join(step_lines))

        tdir = PLATFORM / "tools" / lab
        write(tdir / f"{lab}.js", tool_js(lab, title, mode))
        write(tdir / "index.html", tool_html(lab, title))
        print("ok", mid)

    write_walkthrough_algos()

    # MODULES.md → **ref**
    mod = ROOT / "docs" / "MODULES.md"
    text = mod.read_text(encoding="utf-8")
    for mid, lab, title, *_ in MODULES:
        text = re.sub(
            rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
            f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |",
            text,
        )
    write(mod, text)

    # WALKTHROUGHS — append Part D (keep A–C rows if present)
    walk = ROOT / "docs" / "WALKTHROUGHS.md"
    if walk.is_file():
        wtext = walk.read_text(encoding="utf-8")
        for mid, lab, *_ in MODULES:
            row = f"| `{lab}` | `{mid}` | 5 |"
            if lab not in wtext:
                wtext = wtext.rstrip() + "\n" + row + "\n"
        write(walk, wtext)

    # Nav: algo engine → Part D; wrap from contribute
    eng = ROOT / "module10-03-opensta-algo-engine" / "README.md"
    if eng.is_file():
        t = eng.read_text(encoding="utf-8")
        t = t.replace(
            "[Wrap →](../module99-00-wrap/README.md)",
            "[STA C++ →](../module14-01-sta-cpp-model/README.md)",
        )
        write(eng, t)

    write(
        ROOT / "module99-00-wrap" / "README.md",
        """# Module 99-00-wrap: OpenSTA path complete

**Module id:** `module99-00-wrap`  
**Kind:** `wrap`

[← Contribute](../module15-03-contribute-opensta/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Parts A–D: timing map, real OpenSTA evidence, algorithms bound to reports, and internals / contribute literacy.**

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

## Slide 1 — Parts A–D complete

You finished the OpenSTA map, real CLI evidence, algorithms bound to report_checks, and C++ tree literacy.

## Slide 2 — What you can do

You can match report slack 8 on path b to y, and open Network, Graph, Sdc, Search with intent to contribute.

## Slide 3 — Next

Next tools on the OpenLane path: Magic, Netgen, KLayout, then OpenROAD and OpenLane.
""",
    )

    print("PART_D_MODULES_OK", len(MODULES))


if __name__ == "__main__":
    main()
