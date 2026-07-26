#!/usr/bin/env python3
"""Scaffold Part D — Yosys internals / contribute track for learn_yosys."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"

MODULES = [
    (
        "module14-01-rtlil-cpp-model",
        "rtlil-cpp-model",
        "RTLIL C++ model",
        "rtlil",
        "Map Design/Module/Wire/Cell/SigSpec to the Yosys C++ IR.",
        "Name the five RTLIL pillars and how they nest.",
    ),
    (
        "module14-03-pass-registration",
        "pass-registration",
        "Pass registration",
        "pass",
        "Register a Pass, implement execute(), walk selected modules.",
        "Order: subclass Pass → REGISTER_PASS → execute(args, design).",
    ),
    (
        "module15-01-read-opt-clean",
        "read-opt-clean",
        "Read opt_clean",
        "opt_clean",
        "Read the real opt_clean shape: mark used → delete unused cells/wires.",
        "Trace mark_used then rm cells then rm wires.",
    ),
    (
        "module15-03-contribute-pass",
        "contribute-pass",
        "Contribute a pass",
        "contribute",
        "Know where a new pass lives and the minimal stub to compile.",
        "passes/<area>/<name>.cc + Makefile + REGISTER_PASS.",
    ),
]

NAV = {
    "module14-01-rtlil-cpp-model": (
        "../module13-03-yosys-algo-engine/README.md",
        "Algo engine",
        "../module14-03-pass-registration/README.md",
        "Pass registration",
    ),
    "module14-03-pass-registration": (
        "../module14-01-rtlil-cpp-model/README.md",
        "RTLIL C++",
        "../module15-01-read-opt-clean/README.md",
        "Read opt_clean",
    ),
    "module15-01-read-opt-clean": (
        "../module14-03-pass-registration/README.md",
        "Pass registration",
        "../module15-03-contribute-pass/README.md",
        "Contribute",
    ),
    "module15-03-contribute-pass": (
        "../module15-01-read-opt-clean/README.md",
        "Read opt_clean",
        "../module99-00-wrap/README.md",
        "Wrap",
    ),
}

QUIZZES = {
    "module14-01-rtlil-cpp-model": [
        ("Which object owns modules in Yosys?", ["RTLIL::Design", "SigSpec", "Pass", "IdString"], 0),
        ("A Cell connects to nets through which type?", ["SigSpec ports", "Python dict only", "ABC AIG only", "Liberty pin"], 0),
        ("Wire bits are addressed with?", ["SigBit / SigSpec", "float coordinates", "GCell ids", "LEF sites"], 0),
    ],
    "module14-03-pass-registration": [
        ("How does Yosys discover a new pass?", ["REGISTER_PASS macro", "edit catalog.json", "browser only", "Liberty file"], 0),
        ("Pass work happens in which method?", ["execute(args, design)", "main()", "synth()", "stat()"], 0),
        ("Selection usually comes from?", ["extra_args / design selection stack", "random", "ABC only", "OpenROAD"], 0),
    ],
    "module15-01-read-opt-clean": [
        ("opt_clean primarily removes?", ["unused cells and wires", "Liberty cells", "GDS layers", "scan chains"], 0),
        ("Typical first mark step?", ["mark used from outputs/drivers", "delete everything", "run abc", "write_verilog"], 0),
        ("Processes present means?", ["prefer proc first — opt_clean wants empty processes", "always OK", "need flatten only", "need OpenROAD"], 0),
    ],
    "module15-03-contribute-pass": [
        ("New pass source usually lives under?", ["passes/<area>/<name>.cc", "platform/tools/", "common/rtl/", "docs/SCOPE.md"], 0),
        ("Minimal stub needs?", ["Pass subclass + REGISTER_PASS + execute", "only README", "only quiz.json", "only Liberty"], 0),
        ("After adding a .cc you must?", ["add to Makefile / build and rebuild", "only restart browser", "edit goldens.json", "run OpenLane"], 0),
    ],
}

STEPS = {
    "rtlil-cpp-model": [
        ("design", "Design", "Design is the root container for modules.", ["Design"], ["root"]),
        ("module", "Module", "Module holds wires, cells, and processes.", ["Module"], ["own"]),
        ("wire-cell", "Wire and Cell", "Wires are nets; cells are instances with typed ports.", ["Wire", "Cell"], ["ports"]),
        ("sigspec", "SigSpec", "SigSpec is the bit-accurate connection fabric.", ["SigSpec"], ["bits"]),
        ("golden", "Golden", "GOLDEN: five pillars — Design, Module, Wire, Cell, SigSpec.", ["GOLDEN"], ["5"]),
    ],
    "pass-registration": [
        ("pass", "Pass class", "Pass stores the command name and short help.", ["Pass"], ["name"]),
        ("register", "REGISTER_PASS", "The macro installs the pass into the global command table.", ["REGISTER_PASS"], ["table"]),
        ("execute", "execute", "execute receives args and the live Design pointer.", ["execute"], ["Design*"]),
        ("selection", "Selection", "extra_args applies the selection stack.", ["selection"], ["mods"]),
        ("golden", "Golden", "GOLDEN: name → register → execute → selected modules.", ["GOLDEN"], ["ok"]),
    ],
    "read-opt-clean": [
        ("home", "File home", "Real file: passes/opt/opt_clean.cc — OptCleanPass.", ["opt_clean.cc"], ["path"]),
        ("mark", "Mark used", "Walk drivers and keep signals that fan out.", ["mark_used"], ["live"]),
        ("rm-cells", "Remove cells", "rmunused_module_cells drops unused cells.", ["rm_cells"], ["drop"]),
        ("rm-wires", "Remove wires", "rmunused_module_signals cleans leftover nets.", ["rm_wires"], ["nets"]),
        ("golden", "Golden", "GOLDEN: mark → rm cells → rm wires; processes empty.", ["GOLDEN"], ["ok"]),
    ],
    "contribute-pass": [
        ("tree", "Tree layout", "kernel/ holds RTLIL and Pass; passes/ holds commands.", ["kernel", "passes"], ["tree"]),
        ("stub", "Stub file", "Minimal .cc: headers, struct MyPass, REGISTER_PASS.", ["stub"], [".cc"]),
        ("build", "Build hook", "Add the object to the Makefile and rebuild.", ["Makefile"], ["build"]),
        ("smoke", "Smoke", "yosys -h my_pass proves the command exists.", ["yosys -h"], ["smoke"]),
        ("golden", "Golden", "GOLDEN: path + REGISTER_PASS + build + help smoke.", ["GOLDEN"], ["ok"]),
    ],
}

TRANSCRIPT_BODY = {
    "module14-01-rtlil-cpp-model": """## Slide 1 — Why RTLIL C++

Browser IR and JSON are maps. Real Yosys stores the same ideas as C++ objects in RTLIL.

## Slide 2 — The idea

GOLDEN: Design owns Modules; Module owns Wires, Cells, Processes; ports use SigSpec.

<!-- algorithm-walkthrough -->

## Slide 3 — Design

![Design](assets/steps/01-design.png)

Design is the root container for modules.

## Slide 4 — Module

![Module](assets/steps/02-module.png)

Module holds wires, cells, and processes.

## Slide 5 — Wire and Cell

![Wire and Cell](assets/steps/03-wire-cell.png)

Wires are nets; cells are instances with typed ports.

## Slide 6 — SigSpec

![SigSpec](assets/steps/04-sigspec.png)

SigSpec is the bit-accurate connection fabric.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: five pillars — Design, Module, Wire, Cell, SigSpec.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab track

Open **rtlil-cpp-model**. Click through the object graph and check the goldens.

## Slide 9 — Implement track

Call rtlil_cpp_model() in internals_solvers; assert pillar count and nesting.

## Slide 10 — Pitfalls

Treating JSON keys as the C++ API. Forgetting SigSpec between cells and wires.

## Slide 11 — Try these

From the common folder, run the internals solvers self-test.

```bash
cd courses/learn_yosys/common
python3 internals_solvers.py
```

## Slide 12 — Pseudocode

Here is the RTLIL nesting in plain steps.

```text
design.modules[name] → module
module.wires / module.cells / module.processes
cell.connections[port] → SigSpec
```

## Slide 13 — Next

Next: how passes register and run on a Design.
""",
    "module14-03-pass-registration": """## Slide 1 — Why registration

Yosys is a pass engine. Your code becomes a command when it registers a Pass.

## Slide 2 — The idea

GOLDEN: subclass Pass, REGISTER_PASS, implement execute(args, design).

<!-- algorithm-walkthrough -->

## Slide 3 — Pass class

![Pass class](assets/steps/01-pass.png)

Pass stores the command name and short help.

## Slide 4 — REGISTER_PASS

![REGISTER_PASS](assets/steps/02-register.png)

The macro installs the pass into the global command table.

## Slide 5 — execute

![execute](assets/steps/03-execute.png)

execute receives argv-like args and the live Design pointer.

## Slide 6 — Selection

![Selection](assets/steps/04-selection.png)

extra_args applies the selection stack so you touch the right modules.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: name → register → execute → selected modules.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab track

Open **pass-registration**. Order the registration steps and check.

## Slide 9 — Implement track

Call pass_registration(); assert recipe ids match the golden sequence.

## Slide 10 — Pitfalls

Forgetting REGISTER_PASS. Mutating modules that are not selected.

## Slide 11 — Try these

From the common folder, call pass_registration and print the recipe.

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import pass_registration; print(pass_registration())"
```

## Slide 12 — Pseudocode

Here is the Pass registration shape in plain steps.

```text
struct MyPass : Pass { MyPass(): Pass("my_pass", "help") {}
  void execute(args, design) override { ... } };
REGISTER_PASS(MyPass)
```

## Slide 13 — Next

Next: read the real opt_clean shape in the Yosys tree.
""",
    "module15-01-read-opt-clean": """## Slide 1 — Why read a real pass

Algorithms in Part C match moves. Now map those moves onto the real C++ file shape.

## Slide 2 — The idea

GOLDEN: mark used from outputs; delete unused cells; then unused wires. Prefer proc before opt_clean.

<!-- algorithm-walkthrough -->

## Slide 3 — File home

![File home](assets/steps/01-home.png)

Real file: passes/opt/opt_clean.cc — OptCleanPass.

## Slide 4 — Mark used

![Mark used](assets/steps/02-mark.png)

Walk drivers and keep signals that fan out to outputs or live cells.

## Slide 5 — Remove cells

![Remove cells](assets/steps/03-rm-cells.png)

rmunused_module_cells drops cells that never drive anything used.

## Slide 6 — Remove wires

![Remove wires](assets/steps/04-rm-wires.png)

rmunused_module_signals cleans leftover nets.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: mark → rm cells → rm wires; processes should be empty.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab track

Open **read-opt-clean**. Step the mark/delete pipeline and check.

## Slide 9 — Implement track

Call read_opt_clean(); assert stage order and process guard.

## Slide 10 — Pitfalls

Expecting opt_clean to lower processes. Deleting wires before cells blindly.

## Slide 11 — Try these

From the common folder, call read_opt_clean and print the stages.

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import read_opt_clean; print(read_opt_clean())"
```

## Slide 12 — Pseudocode

Here is the opt_clean flow in plain steps.

```text
for module in selected:
  if processes: warn/skip
  mark_used(outputs)
  rmunused_module_cells
  rmunused_module_signals
```

## Slide 13 — Next

Next: contribute a minimal pass of your own.
""",
    "module15-03-contribute-pass": """## Slide 1 — Why contribute

Reading is not enough. A contributor knows where a pass lives and how it enters the build.

## Slide 2 — The idea

GOLDEN: add passes/area/name.cc, register the pass, list it in the Makefile, rebuild, yosys -h name.

<!-- algorithm-walkthrough -->

## Slide 3 — Tree layout

![Tree layout](assets/steps/01-tree.png)

kernel/ holds RTLIL and Pass; passes/ holds commands by area.

## Slide 4 — Stub file

![Stub file](assets/steps/02-stub.png)

Minimal .cc: include kernel headers, struct MyPass, REGISTER_PASS.

## Slide 5 — Build hook

![Build hook](assets/steps/03-build.png)

Add the object to the Yosys Makefile / CMake lists and rebuild.

## Slide 6 — Smoke

![Smoke](assets/steps/04-smoke.png)

yosys -h my_pass and a tiny .ys script prove the command exists.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: path + REGISTER_PASS + build + help smoke.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab track

Open **contribute-pass**. Assemble the contribute checklist and check.

## Slide 9 — Implement track

Call contribute_pass(); assert checklist length and smoke cmd.

## Slide 10 — Pitfalls

Editing only docs. Forgetting the build system entry. Skipping help smoke.

## Slide 11 — Try these

From the common folder, call contribute_pass and print the checklist.

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import contribute_pass; print(contribute_pass())"
```

## Slide 12 — Pseudocode

Here is the contribute checklist in plain steps.

```text
path ← passes/demo/hello_pass.cc
REGISTER_PASS(HelloPass)
add to Makefile; rebuild
smoke ← yosys -h hello_pass
```

## Slide 13 — Next

Wrap the Yosys path — you can use Yosys and open the C++ tree with intent.
""",
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str) -> str:
    return f"""import {{ INTERNALS_GOLDENS, partDEngine }} from "../../assets/yosys-internals-core.js";
import {{ createInteractiveYosysInternalsLab }} from "../../assets/interactive-yosys-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysInternalsLab(root, {{
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
      check: () => INTERNALS_GOLDENS.pillars === 5 }},
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
    <section class="hero"><h1>{title}</h1><p class="lead">Part D — Yosys internals / contribute.</p></section>
    <div id="lab-root"></div>
  </main>
  <script type="module" src="{lab}.js"></script>
</body>
</html>
"""


def write_walkthrough_algos() -> None:
    lines = [
        "/** Part D — Yosys internals walkthroughs (mirrors STEPS.md). */",
        'import { drawInternals } from "../../assets/yosys-internals-core.js";',
        "",
        "export { drawInternals };",
        "",
        "export const YOSYS_INTERNALS_ALGOS = {",
    ]
    for mid, lab, title, _mode, _outcome, _idea in MODULES:
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "yosys_internals",')
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
        PLATFORM / "tools" / "algorithm-walkthrough" / "yosys-internals-algos.js",
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
python3 -c "from internals_solvers import {fn}; print({fn}())"
```

Sources: `internals_solvers.py` · annotated excerpts under `internals/`.

## Pseudocode

```text
{idea}
ok if goldens match INTERNALS_GOLDENS
```

## Notes

Part D teaches how to read and extend Yosys C++ — not a full reimplementation.
Upstream: https://github.com/YosysHQ/yosys
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
    print("PART_D_MODULES_OK", len(MODULES))


if __name__ == "__main__":
    main()
