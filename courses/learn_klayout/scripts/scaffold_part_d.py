#!/usr/bin/env python3
"""Scaffold Part D — KLayout internals / contribute track for learn_klayout."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"
WALK = PLATFORM / "tools" / "algorithm-walkthrough"
CAPTURE = ROOT.parents[1] / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"

MODULES = [
    ("module14-01-layout-cell-model", "layout-cell-model", "Layout / Cell / Instance model", "layout_cell_model",
     "Map Layout / Cell / Instance to the KLayout C++ tree.", "Name the three pillars and how Cell holds shapes."),
    ("module14-03-read-drc-runner", "read-drc-runner", "Read DRC runner", "read_drc_runner",
     "Read the DRC runner flow bound to Part B goldens.", "load_layout→load_drc→run_drc→emit_markers→report (viol=1)."),
    ("module15-03-contribute-klayout", "contribute-klayout", "Contribute to KLayout", "contribute_klayout",
     "Know where a new Ruby command lives and the minimal stub to build.", "layMain.cc + register + build + klayout -h smoke."),
]

PART_D_LABS = [lab for _mid, lab, *_ in MODULES]

NAV = {
    "module14-01-layout-cell-model": ("../module10-03-klayout-algo-engine/README.md", "Algo engine", "../module14-03-read-drc-runner/README.md", "DRC runner"),
    "module14-03-read-drc-runner": ("../module14-01-layout-cell-model/README.md", "Layout model", "../module15-03-contribute-klayout/README.md", "Contribute"),
    "module15-03-contribute-klayout": ("../module14-03-read-drc-runner/README.md", "DRC runner", "../module99-00-wrap/README.md", "Wrap"),
}

STEPS = {
    "layout-cell-model": [
        ("layout", "Layout", "Layout holds database, layer properties, cell index.", ["Layout"], ["db"]),
        ("cell", "Cell", "Cell holds shapes and child instances.", ["Cell"], ["shapes"]),
        ("inst", "Instance", "Instance places child cells with transform.", ["Instance"], ["xform"]),
        ("nest", "Nesting", "Layout→Cell→Instance hierarchy.", ["nest"], ["3"]),
        ("golden", "Golden", "GOLDEN: Layout, Cell, Instance — three pillars.", ["GOLDEN"], ["3"]),
    ],
    "read-drc-runner": [
        ("load", "load_layout", "Load GDS into Layout database.", ["load_layout"], ["gds"]),
        ("drc", "load_drc", "Load Ruby DRC script.", ["load_drc"], ["drc"]),
        ("run", "run_drc", "Execute width/spacing checks.", ["run_drc"], ["check"]),
        ("emit", "emit_markers", "Emit violation markers.", ["emit_markers"], ["1"]),
        ("golden", "Golden", "GOLDEN: width_violations=1 marker_count=1.", ["GOLDEN"], ["1/1"]),
    ],
    "contribute-klayout": [
        ("tree", "Tree layout", "src/lay/ holds viewer and DRC integration.", ["src/lay"], ["tree"]),
        ("stub", "Entry point", "layMain.cc is the application entry.", ["layMain.cc"], [".cc"]),
        ("build", "Build hook", "qmake/cmake build and install KLayout.", ["build"], ["build"]),
        ("smoke", "Smoke", "klayout -h proves the binary runs.", ["klayout -h"], ["smoke"]),
        ("golden", "Golden", "GOLDEN: path + build + smoke help.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module14-01-layout-cell-model": [
        ("Which pillar holds shapes?", ["Cell", "Layout only", "Liberty", "GDS stream only"], 0),
        ("Instance holds?", ["cell placement + transform", "STA slack", "Magic tiles", "LEF"], 0),
        ("Pillar count?", ["3", "2", "6", "1"], 0),
    ],
    "module14-03-read-drc-runner": [
        ("Part B width violations?", ["1", "0", "2", "4"], 0),
        ("First DRC stage?", ["load_layout", "delete GDS", "abc", "place"], 0),
        ("Marker count golden?", ["1", "0", "2", "4"], 0),
    ],
    "module15-03-contribute-klayout": [
        ("Entry point often under?", ["src/lay/layMain/layMain.cc", "platform/tools only", "docs only", "Liberty only"], 0),
        ("Smoke after build?", ["klayout -h", "browser restart", "edit goldens", "sta"], 0),
        ("Contribute path in lab?", ["layMain.cc", "magic-core.js", "yosys.cc", "LEF"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str) -> str:
    return f"""import {{ INTERNALS_GOLDENS, partDEngine }} from "../../assets/klayout-internals-core.js";
import {{ createInteractiveKlayoutInternalsLab }} from "../../assets/interactive-klayout-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveKlayoutInternalsLab(root, {{
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
    {{ id: "viol", title: "Part B bind", level: "Challenge", prompt: "widthViolations=1.",
      check: () => INTERNALS_GOLDENS.widthViolations === 1 }},
    {{ id: "golden", title: "Engine golden", level: "Challenge", prompt: "partDEngine ok.",
      check: () => partDEngine().ok === true }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "KLAYOUT_INTERNALS_ALGOS" not in text:
        ins = 'import { drawAlgoKlayout } from "../../assets/algo-klayout-core.js";\n'
        if ins in text:
            text = text.replace(
                ins,
                ins + 'import { KLAYOUT_INTERNALS_ALGOS } from "./klayout-internals-algos.js";\nimport { drawKlayoutInternals } from "../../assets/klayout-internals-core.js";\n',
            )
        text = text.replace("  ...ALGO_KLAYOUT_ALGOS,\n};", "  ...ALGO_KLAYOUT_ALGOS,\n  ...KLAYOUT_INTERNALS_ALGOS,\n};")
    if 'pack.kind === "klayout_internals"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "algo_klayout") {',
            '''  } else if (pack.kind === "klayout_internals") {
    drawKlayoutInternals(canvas, {
      highlight: s.highlight || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "algo_klayout") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_D_LABS if f'"{lab}"' not in cap]
    if not missing:
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    for needle in ('"klayout-algo-engine": ("klayout-algo-engine", 5),', '"marker-emit-algo": ("marker-emit-algo", 5),'):
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO Part D", missing)
            return


def main() -> None:
    fn_map = {
        "layout-cell-model": "layout_cell_model",
        "read-drc-runner": "read_drc_runner",
        "contribute-klayout": "contribute_klayout",
    }
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

## Slide 1 — Why KLayout internals

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk)}

## Slide {n+3} — Browser lab

Open **{lab}**.

## Slide {n+4} — Implement track

Call {fn}() in internals_solvers.

## Slide {n+5} — Pitfalls

Treating browser JSON as the C++ API.

## Slide {n+6} — Try these

From the common folder, run the internals self-test.

```bash
cd courses/learn_klayout/common
python3 internals_solvers.py
```

## Slide {n+7} — Pseudocode

Here is the checklist in plain steps.

```text
{idea}
ok if goldens match INTERNALS_GOLDENS
```

## Slide {n+8} — Next

Wrap the KLayout path.
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
        write(ROOT / mid / "EXAMPLES.md", f"```bash\ncd courses/learn_klayout/common\npython3 -c \"from internals_solvers import {fn}; print({fn}())\"\n```\n")
        write(ROOT / mid / "CHECKLIST.md", f"- [ ] internals_solvers {fn} ok\n")
        items = [{"q": q, "choices": c, "answer": a, "id": f"q{i}"} for i, (q, c, a) in enumerate(QUIZZES[mid])]
        write(ROOT / mid / "quiz.json", json.dumps({"moduleId": mid, "items": items}, indent=2) + "\n")
        write(ROOT / mid / "assets" / "STEPS.md", f"# {title}\n")
        tdir = PLATFORM / "tools" / lab
        write(tdir / f"{lab}.js", tool_js(lab, title, mode))
        write(tdir / "index.html", f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>{title}</title><link rel="stylesheet" href="../../assets/site.css"><link rel="stylesheet" href="../../assets/clustering-lab.css"></head><body data-asset-base="../../assets/"><main class="tool-page"><section class="hero"><h1>{title}</h1><p class="lead">Part D — KLayout internals.</p></section><div id="lab-root"></div></main><script type="module" src="{lab}.js"></script></body></html>')
        print("ok", mid)

    lines = ['/** Part D — KLayout internals walkthroughs */', 'import { drawKlayoutInternals } from "../../assets/klayout-internals-core.js";', "", "export const KLAYOUT_INTERNALS_ALGOS = {"]
    for mid, lab, title, _mode, _o, _i in MODULES:
        lines += [f'  "{lab}": {{', '    kind: "klayout_internals",', f'    title: "{title}",', f'    module: "{mid}",', "    steps: ["]
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            lines += ["      {", f'        id: {json.dumps(sid)},', f'        title: {json.dumps(st)},', f'        caption: {json.dumps(cap)},',
                      f'        bullets: {json.dumps(bullets)},', f'        metrics: {json.dumps(metrics)},', f'        highlight: {json.dumps(bullets)},', "      },"]
        lines += ["    ],", "  },"]
    lines.append("};")
    write(WALK / "klayout-internals-algos.js", "\n".join(lines))

    mod = ROOT / "docs" / "MODULES.md"
    text = mod.read_text(encoding="utf-8")
    for mid, lab, title, *_ in MODULES:
        text = re.sub(rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
                      f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |", text)
    write(mod, text)

    write(ROOT / "module99-00-wrap" / "transcript.md", """# KLayout path complete

**Module id:** module99-00-wrap
**Lab:** wrap

## Slide 1 — Parts A–D complete

You finished the KLayout map, real CLI evidence, algorithms bound to DRC goldens, and Layout/Cell/Instance literacy.

## Slide 2 — What you can do

You can match DRC golden width_violations=1 marker_count=1 on tiny_rect and open Layout/Cell/Instance with intent to contribute.

## Slide 3 — Next

Next on the OpenLane path: OpenROAD, OpenLane.
""")
    write(ROOT / "module99-00-wrap" / "README.md", """# Module 99-00-wrap: KLayout path complete

**Module id:** `module99-00-wrap`  
**Kind:** `wrap`

[← Contribute](../module15-03-contribute-klayout/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Parts A–D: viewer/DRC map, real KLayout evidence, algorithms, internals / contribute.**

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
