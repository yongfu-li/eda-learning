#!/usr/bin/env python3
"""Scaffold Part D — Magic internals / contribute track for learn_magic."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"
WALK = PLATFORM / "tools" / "algorithm-walkthrough"
CAPTURE = ROOT.parents[1] / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"
PUBLISH = PLATFORM / "scripts" / "publish_course_platform.py"

MODULES = [
    (
        "module14-01-tile-plane-model",
        "tile-plane-model",
        "Tile / Plane model",
        "tile",
        "Map Tile / Plane / CellDef to the Magic C tree.",
        "Name the three pillars and how Plane holds DRC rules.",
    ),
    (
        "module14-03-read-drc-cifwrite",
        "read-drc-cifwrite",
        "Read DRC / cifwrite",
        "drc_cif",
        "Read the DRC scan → marker shape bound to Part B goldens.",
        "load_rules → scan_region → emit_marker (drc=1); cifwrite stages.",
    ),
    (
        "module15-03-contribute-magic",
        "contribute-magic",
        "Contribute to Magic",
        "contribute",
        "Know where a new Tcl command lives and the minimal stub to build.",
        "commands/cmd_drc.c + Tcl register + Makefile + magic -help drc.",
    ),
]

PART_D_LABS = [lab for _mid, lab, *_ in MODULES]

NAV = {
    "module14-01-tile-plane-model": (
        "../module10-03-magic-algo-engine/README.md",
        "Algo engine",
        "../module14-03-read-drc-cifwrite/README.md",
        "Read DRC",
    ),
    "module14-03-read-drc-cifwrite": (
        "../module14-01-tile-plane-model/README.md",
        "Tile/Plane",
        "../module15-03-contribute-magic/README.md",
        "Contribute",
    ),
    "module15-03-contribute-magic": (
        "../module14-03-read-drc-cifwrite/README.md",
        "Read DRC",
        "../module99-00-wrap/README.md",
        "Wrap",
    ),
}

QUIZZES = {
    "module14-01-tile-plane-model": [
        ("Which pillar holds painted geometry?", ["Tile", "Plane only", "Liberty only", "GDS"], 0),
        ("DRC rules live in which pillar?", ["Plane", "Tile only", "Magic binary only", "Quiz only"], 0),
        ("Cell ports/metadata live in?", ["CellDef", "Tile only", "Netgen", "OpenSTA"], 0),
    ],
    "module14-03-read-drc-cifwrite": [
        ("Part B DRC error golden on tiny_inv?", ["1", "0", "6", "3"], 0),
        ("First DRC teaching stage?", ["load_rules", "delete GDS", "run abc", "place"], 0),
        ("cifwrite verifies?", ["layer mapping after flatten", "STA slack only", "LEF only", "PDF only"], 0),
    ],
    "module15-03-contribute-magic": [
        ("New command source often lives under?", ["commands/*.c", "platform/tools only", "common/rtl only", "docs/SCOPE.md only"], 0),
        ("Minimal stub needs?", ["Tcl cmd + register + Makefile + rebuild", "only README", "only quiz", "only Liberty"], 0),
        ("Smoke after rebuild?", ["magic -help drc", "only browser restart", "edit goldens.json", "run sta"], 0),
    ],
}

STEPS = {
    "tile-plane-model": [
        ("tile", "Tile", "Tile holds painted rectangles and labels.", ["Tile"], ["geom"]),
        ("plane", "Plane", "Plane holds layer definitions and DRC rules.", ["Plane"], ["rules"]),
        ("celldef", "CellDef", "CellDef holds ports and hierarchy metadata.", ["CellDef"], ["cell"]),
        ("nest", "Nesting", "Tiles live on Planes; CellDef wraps the cell view.", ["nest"], ["3"]),
        ("golden", "Golden", "GOLDEN: Tile, Plane, CellDef — three pillars.", ["GOLDEN"], ["3"]),
    ],
    "read-drc-cifwrite": [
        ("rules", "load_rules", "Load tech min_width for metal1 from Plane.", ["load_rules"], ["tech"]),
        ("scan", "scan_region", "Walk tiles on the active plane.", ["scan_region"], ["walk"]),
        ("emit", "emit_marker", "Flag thin rect (width=1 < limit=2).", ["emit_marker"], ["thin"]),
        ("cif", "cifwrite", "flatten → write_cif → verify_layers (6 GDS layers).", ["cifwrite"], ["6"]),
        ("golden", "Golden", "GOLDEN: DRC→Part B drc=1; GDS layers=6.", ["GOLDEN"], ["ok"]),
    ],
    "contribute-magic": [
        ("tree", "Tree layout", "tiles/planes/cells hold layout; commands/ holds Tcl.", ["commands"], ["tree"]),
        ("stub", "Stub file", "Minimal .c: Tcl command drc registration.", ["stub"], [".c"]),
        ("build", "Makefile hook", "Add object to Makefile and rebuild Magic.", ["makefile"], ["build"]),
        ("smoke", "Smoke", "magic -help drc proves the command exists.", ["magic -help"], ["smoke"]),
        ("golden", "Golden", "GOLDEN: path + tcl + makefile + rebuild + help.", ["GOLDEN"], ["ok"]),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str) -> str:
    return f"""import {{ INTERNALS_GOLDENS, partDEngine }} from "../../assets/magic-internals-core.js";
import {{ createInteractiveMagicInternalsLab }} from "../../assets/interactive-magic-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMagicInternalsLab(root, {{
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
      check: () => INTERNALS_GOLDENS.pillars === 3 }},
    {{ id: "drc", title: "DRC bind", level: "Challenge", prompt: "drcErrorCount=1.",
      check: () => INTERNALS_GOLDENS.drcErrorCount === 1 }},
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
    <section class="hero"><h1>{title}</h1><p class="lead">Part D — Magic internals / contribute.</p></section>
    <div id="lab-root"></div>
  </main>
  <script type="module" src="{lab}.js"></script>
</body>
</html>
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "MAGIC_INTERNALS_ALGOS" not in text:
        insert_after = 'import { drawAlgoMagic } from "../../assets/algo-magic-core.js";\n'
        if insert_after not in text:
            insert_after = 'import { drawMagic, STARTER as MAGIC_STARTER } from "../../assets/magic-core.js";\n'
        text = text.replace(
            insert_after,
            insert_after
            + 'import { MAGIC_INTERNALS_ALGOS } from "./magic-internals-algos.js";\n'
            + 'import { drawMagicInternals } from "../../assets/magic-internals-core.js";\n',
        )
        if "ALGO_MAGIC_ALGOS" in text:
            text = text.replace(
                "  ...ALGO_MAGIC_ALGOS,\n};",
                "  ...ALGO_MAGIC_ALGOS,\n  ...MAGIC_INTERNALS_ALGOS,\n};",
            )
        elif "REAL_MAGIC_ALGOS" in text:
            text = text.replace(
                "  ...REAL_MAGIC_ALGOS,\n};",
                "  ...REAL_MAGIC_ALGOS,\n  ...MAGIC_INTERNALS_ALGOS,\n};",
            )
        else:
            text = text.replace(
                "  ...MAGIC_ALGOS,\n};",
                "  ...MAGIC_ALGOS,\n  ...MAGIC_INTERNALS_ALGOS,\n};",
            )
    if 'pack.kind === "magic_internals"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "algo_magic") {',
            '''  } else if (pack.kind === "magic_internals") {
    drawMagicInternals(canvas, {
      highlight: s.highlight || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "algo_magic") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")
    print("Patched walkthrough.js (magic_internals)")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_D_LABS if f'"{lab}"' not in cap]
    if not missing:
        print("LAB_TO_ALGO already has Part D labs")
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    needle = '"magic-algo-engine": ("magic-algo-engine", 5),'
    if needle in cap:
        cap = cap.replace(needle, needle + "\n    " + block + ",")
        CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
        print("Patched LAB_TO_ALGO Part D", missing)


def patch_course_meta() -> None:
    pub = PUBLISH.read_text(encoding="utf-8")
    old = "Part A ready; Parts B–D planned. Clips and decks load from"
    new = "Parts A–D ready. Clips and decks load from"
    if old in pub:
        pub = pub.replace(old, new)
        PUBLISH.write_text(pub, encoding="utf-8", newline="\n")
        print("Patched COURSE_META learn_magic lead (Parts A–D ready)")
    else:
        print("WARN: COURSE_META lead needle not found (may already be updated)")


def write_walkthrough_algos() -> None:
    lines = [
        "/** Part D — Magic internals walkthroughs */",
        'import { drawMagicInternals } from "../../assets/magic-internals-core.js";',
        "",
        "export { drawMagicInternals };",
        "",
        "export const MAGIC_INTERNALS_ALGOS = {",
    ]
    for mid, lab, title, _mode, _outcome, _idea in MODULES:
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "magic_internals",')
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
    write(WALK / "magic-internals-algos.js", "\n".join(lines))


def main() -> None:
    for mid, lab, title, mode, outcome, idea in MODULES:
        prev_h, prev_l, next_h, next_l = NAV[mid]
        mdir = ROOT / mid
        fn = {"tile-plane-model": "tile_plane_model", "read-drc-cifwrite": "read_drc_cifwrite", "contribute-magic": "contribute_magic"}[lab]

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
cd courses/learn_magic/common
python3 -c "from internals_solvers import {fn}; print({fn}())"
```

Sources: `internals_solvers.py` · annotated excerpts under `internals/`.

## Pseudocode

```text
{idea}
ok if goldens match INTERNALS_GOLDENS
```
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
        steps = STEPS[lab]
        walk = ["<!-- algorithm-walkthrough -->", ""]
        for i, (sid, st, cap, _b, _m) in enumerate(steps, 1):
            walk += [f"## Slide {i+2} — {st}", "", f"![{st}](assets/steps/{i:02d}-{sid}.png)", "", cap, ""]
        walk.append("<!-- /algorithm-walkthrough -->")
        write(
            mdir / "transcript.md",
            f"""# {title}

**Module id:** {mid}
**Lab:** {lab}
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Magic internals

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk)}

## Slide {len(steps)+3} — Browser lab track

Open **{lab}**. Click through stages and check goldens.

## Slide {len(steps)+4} — Implement track

Call {fn}() in internals_solvers; assert golden match.

## Slide {len(steps)+5} — Pitfalls

Treating browser JSON as the C API. Confusing Tile with OpenSTA Graph.

## Slide {len(steps)+6} — Try these

```bash
cd courses/learn_magic/common
python3 internals_solvers.py
```

## Slide {len(steps)+7} — Pseudocode

```text
{idea}
```

## Slide {len(steps)+8} — Next

Wrap the Magic path — map, CLI evidence, algorithms, and C tree literacy.
""",
        )
        items = [{"q": q, "choices": c, "answer": a, "id": f"q{i}"} for i, (q, c, a) in enumerate(QUIZZES[mid])]
        write(mdir / "quiz.json", json.dumps({"moduleId": mid, "items": items}, indent=2) + "\n")
        step_lines = [f"# {title} — step-by-step", "", f"**Module:** `{mid}`", f"**Lab:** `{lab}`", ""]
        for i, (sid, st, cap, bullets, metrics) in enumerate(steps, 1):
            step_lines += [f"## Step {i} — {st}", "", f"![Step {i}](steps/{i:02d}-{sid}.png)", "",
                           f"**Caption:** {cap}", "", "**Bullets:**", ""]
            step_lines += [f"- {b}" for b in bullets]
            step_lines += ["", "```", metrics[0], "```", ""]
        write(mdir / "assets" / "STEPS.md", "\n".join(step_lines))
        tdir = PLATFORM / "tools" / lab
        write(tdir / f"{lab}.js", tool_js(lab, title, mode))
        write(tdir / "index.html", tool_html(lab, title))
        print("ok", mid)

    write_walkthrough_algos()
    mod = ROOT / "docs" / "MODULES.md"
    text = mod.read_text(encoding="utf-8")
    for mid, lab, title, *_ in MODULES:
        text = re.sub(
            rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
            f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |",
            text,
        )
    write(mod, text)

    walk = ROOT / "docs" / "WALKTHROUGHS.md"
    wtext = walk.read_text(encoding="utf-8")
    for mid, lab, *_ in MODULES:
        row = f"| `{lab}` | `{mid}` | 5 |"
        if lab not in wtext:
            wtext = wtext.rstrip() + "\n" + row + "\n"
    write(walk, wtext)

    eng = ROOT / "module10-03-magic-algo-engine" / "README.md"
    if eng.is_file():
        t = eng.read_text(encoding="utf-8")
        t = t.replace(
            "[Wrap →](../module99-00-wrap/README.md)",
            "[Tile / Plane →](../module14-01-tile-plane-model/README.md)",
        )
        write(eng, t)

    write(
        ROOT / "module99-00-wrap" / "README.md",
        """# Module 99-00-wrap: Magic path complete

**Module id:** `module99-00-wrap`  
**Kind:** `wrap`

[← Contribute](../module15-03-contribute-magic/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Parts A–D: layout map, real Magic evidence, algorithms bound to DRC/GDS goldens, and internals / contribute literacy.**

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
        """# Magic path complete

**Module id:** module99-00-wrap
**Lab:** wrap

## Slide 1 — Parts A–D complete

You finished the Magic map, real CLI evidence, algorithms bound to DRC/GDS goldens, and C tree literacy.

## Slide 2 — What you can do

You can match DRC=1 on thin metal1, GDS layers=6, contact=1, and open Tile/Plane/CellDef with intent to contribute.

## Slide 3 — Next

Next tools on the OpenLane path: Netgen, KLayout, then OpenROAD and OpenLane.
""",
    )
    patch_walkthrough()
    patch_lab_to_algo()
    patch_course_meta()
    print("PART_D_MODULES_OK", len(MODULES))


if __name__ == "__main__":
    main()
