#!/usr/bin/env python3
"""Scaffold Part D — Netgen internals / contribute track for learn_netgen."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"
WALK = PLATFORM / "tools" / "algorithm-walkthrough"
CAPTURE = ROOT.parents[1] / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"

MODULES = [
    ("module14-01-netcomp-model", "netcomp-model", "Obj / Netlist / Element model", "netcomp",
     "Map Obj / Netlist / Element to the Netgen C tree.", "Name the three pillars and how Netlist holds devices."),
    ("module14-03-read-compare-c", "read-compare-c", "Read compare C", "read_compare_c",
     "Read the compare flow bound to Part B goldens.", "read_sch→read_lay→hash→match→emit (matched=2/4)."),
    ("module15-03-contribute-netgen", "contribute-netgen", "Contribute to Netgen", "contribute",
     "Know where a new Tcl command lives and the minimal stub to build.", "tclcmd/cmd_lvs.c + register + Makefile + netgen help lvs."),
]

PART_D_LABS = [lab for _mid, lab, *_ in MODULES]

NAV = {
    "module14-01-netcomp-model": ("../module10-03-netgen-algo-engine/README.md", "Algo engine", "../module14-03-read-compare-c/README.md", "Compare C"),
    "module14-03-read-compare-c": ("../module14-01-netcomp-model/README.md", "Netcomp", "../module15-03-contribute-netgen/README.md", "Contribute"),
    "module15-03-contribute-netgen": ("../module14-03-read-compare-c/README.md", "Compare C", "../module99-00-wrap/README.md", "Wrap"),
}

STEPS = {
    "netcomp-model": [
        ("obj", "Obj", "Obj holds Tcl strings, hashes, lists.", ["Obj"], ["tcl"]),
        ("netlist", "Netlist", "Netlist holds ports, devices, nets.", ["Netlist"], ["graph"]),
        ("element", "Element", "Element holds pins and device properties.", ["Element"], ["dev"]),
        ("nest", "Nesting", "Obj values feed Netlist; Element wraps devices.", ["nest"], ["3"]),
        ("golden", "Golden", "GOLDEN: Obj, Netlist, Element — three pillars.", ["GOLDEN"], ["3"]),
    ],
    "read-compare-c": [
        ("sch", "read_sch", "Parse schematic SPICE into Netlist.", ["read_sch"], ["sch"]),
        ("lay", "read_lay", "Parse layout SPICE into Netlist.", ["read_lay"], ["lay"]),
        ("hash", "hash_devices", "Group devices by class.", ["hash_devices"], ["hash"]),
        ("match", "match_nets", "Compare net connectivity.", ["match_nets"], ["4"]),
        ("golden", "Golden", "GOLDEN: matched=2/4 mismatch=0.", ["GOLDEN"], ["ok"]),
    ],
    "contribute-netgen": [
        ("tree", "Tree layout", "netcomp/ and tclcmd/ hold compare and Tcl.", ["tclcmd"], ["tree"]),
        ("stub", "Stub file", "Minimal .c: Tcl command lvs registration.", ["stub"], [".c"]),
        ("build", "Makefile hook", "Add object to Makefile and rebuild Netgen.", ["makefile"], ["build"]),
        ("smoke", "Smoke", "netgen help lvs proves the command exists.", ["netgen help"], ["smoke"]),
        ("golden", "Golden", "GOLDEN: path + tcl + makefile + rebuild + help.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module14-01-netcomp-model": [("Which pillar holds SPICE graph?", ["Netlist", "Obj only", "Liberty", "GDS"], 0), ("Element holds?", ["device pins/properties", "STA slack", "Magic tiles", "LEF"], 0), ("Pillar count?", ["3", "2", "6", "1"], 0)],
    "module14-03-read-compare-c": [("Part B matched devices?", ["2", "0", "4", "6"], 0), ("First compare stage?", ["read_sch", "delete GDS", "abc", "place"], 0), ("Matched nets golden?", ["4", "2", "0", "6"], 0)],
    "module15-03-contribute-netgen": [("New command source often under?", ["tclcmd/*.c", "platform/tools only", "docs only", "Liberty only"], 0), ("Smoke after rebuild?", ["netgen help lvs", "browser restart", "edit goldens", "sta"], 0), ("Contribute path in lab?", ["tclcmd/cmd_lvs.c", "magic-core.js", "yosys.cc", "LEF"], 0)],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str) -> str:
    return f"""import {{ INTERNALS_GOLDENS, partDEngine }} from "../../assets/netgen-internals-core.js";
import {{ createInteractiveNetgenInternalsLab }} from "../../assets/interactive-netgen-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveNetgenInternalsLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Use stage buttons, then Check.</p>`,
  defaultMode: "{mode}",
  challenges: [
    {{ id: "run", title: "Run stage", level: "Intro", prompt: "Open {mode}.",
      setup: (_c, api) => api.showMode("{mode}"), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.showMode("{mode}"), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "engine", title: "Engine", level: "Practice", prompt: "Part D engine ok.",
      setup: (_c, api) => api.runEngine(), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "pillars", title: "Pillars", level: "Practice", prompt: "INTERNALS_GOLDENS.pillars=3.",
      check: () => INTERNALS_GOLDENS.pillars === 3 }},
    {{ id: "bind", title: "Part B bind", level: "Challenge", prompt: "matchedDevices=2.",
      check: () => INTERNALS_GOLDENS.matchedDevices === 2 }},
    {{ id: "golden", title: "Engine golden", level: "Challenge", prompt: "partDEngine ok.",
      check: () => partDEngine().ok === true }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "NETGEN_INTERNALS_ALGOS" not in text:
        ins = 'import { drawAlgoNetgen } from "../../assets/algo-netgen-core.js";\n'
        if ins in text:
            text = text.replace(ins, ins + 'import { NETGEN_INTERNALS_ALGOS } from "./netgen-internals-algos.js";\nimport { drawNetgenInternals } from "../../assets/netgen-internals-core.js";\n')
        text = text.replace("  ...ALGO_NETGEN_ALGOS,\n};", "  ...ALGO_NETGEN_ALGOS,\n  ...NETGEN_INTERNALS_ALGOS,\n};")
    if 'pack.kind === "netgen_internals"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "algo_netgen") {',
            '''  } else if (pack.kind === "netgen_internals") {
    drawNetgenInternals(canvas, {
      highlight: s.highlight || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "algo_netgen") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_D_LABS if f'"{lab}"' not in cap]
    if not missing:
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    for needle in ('"netgen-algo-engine": ("netgen-algo-engine", 5),', '"permute-pins-algo": ("permute-pins-algo", 5),'):
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO Part D", missing)
            return


def main() -> None:
    fn_map = {"netcomp-model": "netcomp_model", "read-compare-c": "read_compare_c", "contribute-netgen": "contribute_netgen"}
    for mid, lab, title, mode, outcome, idea in MODULES:
        prev_h, prev_l, next_h, next_l = NAV[mid]
        fn = fn_map[lab]
        steps = STEPS[lab]
        n = len(steps)
        walk = ["<!-- algorithm-walkthrough -->", ""]
        for i, (sid, st, cap, _b, _m) in enumerate(steps, 1):
            walk += [f"## Slide {i+2} — {st}", "", f"![{st}](assets/steps/{i:02d}-{sid}.png)", "", cap, ""]
        walk.append("<!-- /algorithm-walkthrough -->")
        write(ROOT / mid / "transcript.md", f"""# {title}

**Module id:** {mid}
**Lab:** {lab}

## Slide 1 — Why Netgen internals

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk)}

## Slide {n+3} — Browser lab

Open **{lab}**.

## Slide {n+4} — Implement track

Call {fn}() in internals_solvers.

## Slide {n+5} — Pitfalls

Treating browser JSON as the C API.

## Slide {n+6} — Try these

From the common folder, run the internals self-test.

```bash
cd courses/learn_netgen/common
python3 internals_solvers.py
```

## Slide {n+7} — Pseudocode

Here is the checklist in plain steps.

```text
{idea}
ok if goldens match INTERNALS_GOLDENS
```

## Slide {n+8} — Next

Wrap the Netgen path.
""")
        write(ROOT / mid / "README.md", f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · **ref**

[← {prev_l}]({prev_h}) · [Course README](../README.md) · [{next_l} →]({next_h})

## Outcomes

After this module you can: **{outcome}**

## Two tracks

### Track A — `common/internals_solvers.py` + `internals/`
### Track B — http://127.0.0.1:8080/tools/{lab}/

## Media

| Artifact | Path |
|----------|------|
| Transcript | [transcript.md](transcript.md) |
| Outline | [outline.yaml](outline.yaml) |
| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |
| Video | [video.mp4](video.mp4) |
| Quiz | [quiz.json](quiz.json) |
""")
        write(ROOT / mid / "EXAMPLES.md", f"```bash\ncd courses/learn_netgen/common\npython3 -c \"from internals_solvers import {fn}; print({fn}())\"\n```\n")
        write(ROOT / mid / "CHECKLIST.md", f"- [ ] internals_solvers {fn} ok\n")
        items = [{"q": q, "choices": c, "answer": a, "id": f"q{i}"} for i, (q, c, a) in enumerate(QUIZZES[mid])]
        write(ROOT / mid / "quiz.json", json.dumps({"moduleId": mid, "items": items}, indent=2) + "\n")
        write(ROOT / mid / "assets" / "STEPS.md", f"# {title}\n")
        tdir = PLATFORM / "tools" / lab
        write(tdir / f"{lab}.js", tool_js(lab, title, mode))
        write(tdir / "index.html", f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>{title}</title><link rel="stylesheet" href="../../assets/site.css"><link rel="stylesheet" href="../../assets/clustering-lab.css"></head><body data-asset-base="../../assets/"><main class="tool-page"><section class="hero"><h1>{title}</h1><p class="lead">Part D — Netgen internals.</p></section><div id="lab-root"></div></main><script type="module" src="{lab}.js"></script></body></html>')
        print("ok", mid)

    lines = ['/** Part D — Netgen internals walkthroughs */', 'import { drawNetgenInternals } from "../../assets/netgen-internals-core.js";', "", "export const NETGEN_INTERNALS_ALGOS = {"]
    for mid, lab, title, _mode, _o, _i in MODULES:
        lines += [f'  "{lab}": {{', '    kind: "netgen_internals",', f'    title: "{title}",', f'    module: "{mid}",', "    steps: ["]
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            lines += ["      {", f'        id: {json.dumps(sid)},', f'        title: {json.dumps(st)},', f'        caption: {json.dumps(cap)},',
                      f'        bullets: {json.dumps(bullets)},', f'        metrics: {json.dumps(metrics)},', f'        highlight: {json.dumps(bullets)},', "      },"]
        lines += ["    ],", "  },"]
    lines.append("};")
    write(WALK / "netgen-internals-algos.js", "\n".join(lines))

    mod = ROOT / "docs" / "MODULES.md"
    text = mod.read_text(encoding="utf-8")
    for mid, lab, title, *_ in MODULES:
        text = re.sub(rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
                      f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |", text)
    write(mod, text)

    write(ROOT / "module99-00-wrap" / "transcript.md", """# Netgen path complete

**Module id:** module99-00-wrap
**Lab:** wrap

## Slide 1 — Parts A–D complete

You finished the Netgen map, real CLI evidence, algorithms bound to LVS goldens, and netcomp C tree literacy.

## Slide 2 — What you can do

You can match LVS golden matched=2/4 mismatch=0 and open Obj/Netlist/Element with intent to contribute.

## Slide 3 — Next

Next on the OpenLane path: KLayout, OpenROAD, OpenLane.
""")
    write(ROOT / "module99-00-wrap" / "README.md", """# Module 99-00-wrap: Netgen path complete

**Module id:** `module99-00-wrap`  
**Kind:** `wrap`

[← Contribute](../module15-03-contribute-netgen/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Parts A–D: LVS map, real Netgen evidence, algorithms, internals / contribute.**

## Media

| Artifact | Path |
|----------|------|
| Transcript | [transcript.md](transcript.md) |
| Outline | [outline.yaml](outline.yaml) |
| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |
| Video | [video.mp4](video.mp4) |
| Quiz | [quiz.json](quiz.json) |
""")

    patch_walkthrough()
    patch_lab_to_algo()
    print("PART_D_MODULES_OK", len(MODULES))


if __name__ == "__main__":
    main()
