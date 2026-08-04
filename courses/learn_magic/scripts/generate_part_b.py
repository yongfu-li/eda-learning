#!/usr/bin/env python3
"""Generate learn_magic Part B modules, tools, walkthroughs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"
WALK = PLATFORM / "tools" / "algorithm-walkthrough"
CAPTURE = ROOT.parents[1] / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"

PART_B = [
    (
        "module06-01-magic-cli",
        "magic-cli",
        "Magic CLI & scripts",
        "empty",
        "Invoke magic -dnull -noconsole script.tcl; recipe starts tech_load→load_cell.",
        "First two cmds: tech_load, load_cell.",
    ),
    (
        "module06-03-magic-tech-vocab",
        "magic-tech-vocab",
        "Magic tech vocabulary",
        "tech_vocab",
        "Name the six teaching layers in scmos.tech.",
        "Layers ndiff,pdiff,poly,metal1,nwell,contact; count=6.",
    ),
    (
        "module07-01-real-paint-save",
        "real-paint-save",
        "Real paint / save",
        "paint_save",
        "Load tiny_inv, verify paint counts, save .mag.",
        "rect_count=6; contact_count=1; cell=tiny_inv.",
    ),
    (
        "module07-03-real-drc",
        "real-drc",
        "Real DRC",
        "drc",
        "Run drc check; find width violation on thin metal1.",
        "drc_error_count=1; thin on metal1.",
    ),
    (
        "module08-01-real-gds",
        "real-gds",
        "Real GDS streamout",
        "gds",
        "gds write and read layer map from log.",
        "gds_layer_count=6; metal1→49.",
    ),
    (
        "module08-03-magic-evidence",
        "magic-evidence",
        "Real Magic evidence",
        "gds",
        "Run the full real Magic engine against goldens.",
        "real_magic_engine ok=True.",
    ),
]

PART_B_LABS = [lab for _mid, lab, *_ in PART_B]

NAV = {
    "module06-01-magic-cli": (
        "../module03-03-magic-engine/README.md",
        "Map engine",
        "../module06-03-magic-tech-vocab/README.md",
        "Tech vocab",
    ),
    "module06-03-magic-tech-vocab": (
        "../module06-01-magic-cli/README.md",
        "CLI",
        "../module07-01-real-paint-save/README.md",
        "Paint/save",
    ),
    "module07-01-real-paint-save": (
        "../module06-03-magic-tech-vocab/README.md",
        "Tech vocab",
        "../module07-03-real-drc/README.md",
        "DRC",
    ),
    "module07-03-real-drc": (
        "../module07-01-real-paint-save/README.md",
        "Paint/save",
        "../module08-01-real-gds/README.md",
        "GDS",
    ),
    "module08-01-real-gds": (
        "../module07-03-real-drc/README.md",
        "DRC",
        "../module08-03-magic-evidence/README.md",
        "Evidence",
    ),
    "module08-03-magic-evidence": (
        "../module08-01-real-gds/README.md",
        "GDS",
        "../module99-00-wrap/README.md",
        "Wrap",
    ),
}

STEPS = {
    "magic-cli": [
        ("invoke", "magic -dnull", "Magic runs Tcl with magic -dnull -noconsole script.tcl.", ["magic"], ["CLI"]),
        ("tech", "tech load", "First load the technology file.", ["tech_load"], ["tech"]),
        ("cell", "load cell", "Then load the tiny_inv layout.", ["load_cell"], ["mag"]),
        ("verify", "paint verify", "Verify rect and contact counts.", ["paint_verify"], ["6/1"]),
        ("golden", "Golden", "GOLDEN: recipe prefix tech_load→load_cell.", ["GOLDEN"], ["2"]),
    ],
    "magic-tech-vocab": [
        ("tech", "Tech file", "scmos.tech defines layer planes and DRC rules.", ["tech"], ["file"]),
        ("nd", "ndiff", "ndiff is active diffusion (n-type).", ["ndiff"], ["layer"]),
        ("poly", "poly", "poly is the gate layer.", ["poly"], ["layer"]),
        ("m1", "metal1", "metal1 routes signals; min_width=2 in lab.", ["metal1"], ["49"]),
        ("golden", "Golden", "GOLDEN: six teaching layers.", ["GOLDEN"], ["6"]),
    ],
    "real-paint-save": [
        ("cell", "tiny_inv", "Load cell tiny_inv from layouts/.", ["tiny_inv"], ["cell"]),
        ("rects", "Six rects", "Paint verify counts six rectangles.", ["rects"], ["6"]),
        ("contact", "One contact", "Contact ca bridges poly and metal1.", ["ca"], ["1"]),
        ("save", "save", "save writes the .mag file.", ["save"], ["mag"]),
        ("golden", "Golden", "GOLDEN: rect_count=6 contact_count=1.", ["GOLDEN"], ["6/1"]),
    ],
    "real-drc": [
        ("cmd", "drc check", "drc check scans planes against tech rules.", ["drc_check"], ["cmd"]),
        ("thin", "thin metal1", "Shape thin has width=1 < min_width=2.", ["thin"], ["1"]),
        ("layer", "metal1", "Violation is on metal1.", ["metal1"], ["layer"]),
        ("count", "One error", "Teaching log reports DRC_ERRORS=1.", ["DRC"], ["1"]),
        ("golden", "Golden", "GOLDEN: drc_error_count=1 on thin.", ["GOLDEN"], ["1"]),
    ],
    "real-gds": [
        ("cmd", "gds write", "gds write streams layout to GDSII.", ["gds_write"], ["cmd"]),
        ("layers", "Six layers", "GDS map covers six layer types.", ["layers"], ["6"]),
        ("m1", "metal1→49", "metal1 maps to GDS layer 49.", ["49"], ["m1"]),
        ("contact", "contact→25", "Contact cuts map to layer 25.", ["25"], ["ca"]),
        ("golden", "Golden", "GOLDEN: gds_layer_count=6.", ["GOLDEN"], ["6"]),
    ],
    "magic-evidence": [
        ("recipe", "Full recipe", "Golden recipe has six Tcl stages.", ["recipe"], ["6"]),
        ("paint", "Paint golden", "Still six rects and one contact.", ["paint"], ["6/1"]),
        ("drc", "DRC golden", "DRC error count remains 1.", ["drc"], ["1"]),
        ("gds", "GDS golden", "GDS layer count remains 6.", ["gds"], ["6"]),
        ("golden", "Engine", "GOLDEN: real_magic_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module06-01-magic-cli": [
        ("Typical Magic batch invocation?", ["magic -dnull -noconsole script.tcl", "sta -exit", "yosys -s", "netgen"], 0),
        ("First recipe command?", ["tech_load", "gds_write", "drc check", "abc"], 0),
        ("Second recipe command?", ["load_cell", "report_checks", "flatten", "opt"], 0),
    ],
    "module06-03-magic-tech-vocab": [
        ("Teaching layer count?", ["6", "3", "1", "10"], 0),
        ("Gate layer name?", ["poly", "metal1", "ndiff", "contact"], 0),
        ("metal1 GDS number in lab?", ["49", "6", "25", "1"], 0),
    ],
    "module07-01-real-paint-save": [
        ("Cell name?", ["tiny_inv", "top", "clk", "thin"], 0),
        ("Rect count golden?", ["6", "1", "3", "0"], 0),
        ("Contact count golden?", ["1", "6", "0", "3"], 0),
    ],
    "module07-03-real-drc": [
        ("DRC error count golden?", ["1", "0", "6", "3"], 0),
        ("Violation shape?", ["thin", "m1y", "ca", "g"], 0),
        ("Violation layer?", ["metal1", "poly", "ndiff", "nwell"], 0),
    ],
    "module08-01-real-gds": [
        ("GDS layer count golden?", ["6", "1", "49", "0"], 0),
        ("metal1 GDS layer?", ["49", "6", "25", "46"], 0),
        ("Streamout command?", ["gds write", "read_liberty", "create_clock", "place"], 0),
    ],
    "module08-03-magic-evidence": [
        ("Engine ok means?", ["all Part B goldens match", "STA slack=8", "LVS only", "Place only"], 0),
        ("Recipe length?", ["6", "3", "1", "20"], 0),
        ("Lab id (unique)?", ["magic-evidence", "real-evidence", "magic-engine", "opensta-evidence"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, stage: str) -> str:
    return f"""import {{ REAL_GOLDENS, realMagicEngine, recipePrefixOk, GOLDEN_RECIPE_IDS }} from "../../assets/real-magic-core.js";
import {{ createInteractiveRealMagicLab }} from "../../assets/interactive-real-magic-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRealMagicLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Build the recipe or open stages, then Check.</p>`,
  defaultStage: "{stage}",
  challenges: [
    {{ id: "stage", title: "Open stage", level: "Intro", prompt: "Show the {stage} stage.",
      setup: (_c, api) => api.showStage("{stage}"), check: (_c, api) => api.getStage()?.id === "{stage}" || api.getMode() === "{stage}" }},
    {{ id: "rects", title: "Rects 6", level: "Intro", prompt: "rectCount=6.",
      check: () => REAL_GOLDENS.rectCount === 6 }},
    {{ id: "prefix", title: "Recipe prefix", level: "Practice", prompt: "Load golden recipe; prefix ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix(2) }},
    {{ id: "contact", title: "Contact golden", level: "Practice", prompt: "contactCount=1.",
      check: () => REAL_GOLDENS.contactCount === 1 }},
    {{ id: "drc", title: "DRC golden", level: "Practice", prompt: "drcErrorCount=1.",
      check: () => REAL_GOLDENS.drcErrorCount === 1 }},
    {{ id: "gds", title: "GDS golden", level: "Practice", prompt: "gdsLayerCount=6.",
      check: () => REAL_GOLDENS.gdsLayerCount === 6 }},
    {{ id: "select", title: "Select shape", level: "Challenge", prompt: "Select thin.",
      setup: (_c, api) => {{ api.showStage("drc"); api.select("thin"); }},
      check: (_c, api) => api.getSelected().includes("thin") }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.engine().ok === true || realMagicEngine(GOLDEN_RECIPE_IDS).ok }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "REAL_MAGIC_ALGOS" not in text:
        text = text.replace(
            'import { MAGIC_ALGOS } from "./magic-algos.js";\n'
            'import { drawMagic, STARTER as MAGIC_STARTER } from "../../assets/magic-core.js";\n',
            'import { MAGIC_ALGOS } from "./magic-algos.js";\n'
            'import { drawMagic, STARTER as MAGIC_STARTER } from "../../assets/magic-core.js";\n'
            'import { REAL_MAGIC_ALGOS } from "./real-magic-algos.js";\n'
            'import { drawRealMagic, STAGES as REAL_MAGIC_STAGES } from "../../assets/real-magic-core.js";\n',
        )
        text = text.replace(
            "  ...MAGIC_ALGOS,\n};",
            "  ...MAGIC_ALGOS,\n  ...REAL_MAGIC_ALGOS,\n};",
        )
    if 'pack.kind === "real_magic"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "magic") {',
            '''  } else if (pack.kind === "real_magic") {
    drawRealMagic(canvas, {
      stage: s.stage || REAL_MAGIC_STAGES.empty,
      highlight: s.highlight || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "magic") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")
    print("Patched walkthrough.js (real_magic)")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_B_LABS if f'"{lab}"' not in cap]
    if not missing:
        print("LAB_TO_ALGO already has Part B labs")
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    needle = '"magic-engine": ("magic-engine", 5),'
    if needle in cap:
        cap = cap.replace(needle, needle + "\n    " + block + ",")
        CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
        print("Patched LAB_TO_ALGO Part B", missing)


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
cd courses/learn_magic/common
python3 real_solvers.py
# optional regenerate when Magic installed:
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

## Slide 1 — Why real Magic

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk)}

## Slide {len(steps) + 3} — Browser lab track

Open **{lab}**. Build the Magic recipe or open evidence stages, then Check.

## Slide {len(steps) + 4} — Implement track

From common/, run real_solvers.py and confirm REAL_MAGIC_OK.

## Slide {len(steps) + 5} — Pitfalls

Editing goldens by hand without re-running scripts. Confusing Part A map JSON with checked-in logs.

## Slide {len(steps) + 6} — Try these

From the common folder, run the real Magic self-test.

```bash
cd courses/learn_magic/common
python3 real_solvers.py
```

## Slide {len(steps) + 7} — Pseudocode

Here is the check in plain steps.

```text
{idea}
ok if goldens match
```

## Slide {len(steps) + 8} — Next

Continue the Part B evidence track, then algorithms and internals.
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
    <section class="hero"><h1>{title}</h1><p class="lead">Part B — real Magic CLI evidence.</p></section>
    <div id="lab-root"></div>
  </main>
  <script type="module" src="{lab}.js"></script>
</body>
</html>
""",
        )
        print("ok", mid)

    stage_map = {
        "magic-cli": "empty",
        "magic-tech-vocab": "tech_vocab",
        "real-paint-save": "paint_save",
        "real-drc": "drc",
        "real-gds": "gds",
        "magic-evidence": "gds",
    }
    lines = [
        "/** Part B — real Magic walkthroughs */",
        'import { drawRealMagic, STAGES } from "../../assets/real-magic-core.js";',
        "",
        "export { drawRealMagic, STAGES };",
        "",
        "export const REAL_MAGIC_ALGOS = {",
    ]
    for mid, lab, title, stage, _o, _i in PART_B:
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "real_magic",')
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
    write(WALK / "real-magic-algos.js", "\n".join(lines))

    mod = ROOT / "docs" / "MODULES.md"
    text = mod.read_text(encoding="utf-8")
    for mid, lab, title, *_ in PART_B:
        text = re.sub(
            rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
            f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |",
            text,
        )
    write(mod, text)

    wlines = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for mid, lab in [
        ("module01-01-paint-layers", "paint-layers"),
        ("module01-03-select-box", "select-box"),
        ("module02-01-contact-paint", "contact-paint"),
        ("module02-03-magic-drc-map", "magic-drc-map"),
        ("module03-01-gds-write-map", "gds-write-map"),
        ("module03-03-magic-engine", "magic-engine"),
    ]:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    for mid, lab, *_ in PART_B:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(wlines))

    eng = ROOT / "module03-03-magic-engine" / "README.md"
    if eng.is_file():
        t = eng.read_text(encoding="utf-8")
        t = t.replace(
            "[Wrap →](../module99-00-wrap/README.md)",
            "[Magic CLI →](../module06-01-magic-cli/README.md)",
        )
        write(eng, t)

    write(
        ROOT / "module99-00-wrap" / "README.md",
        """# Module 99-00-wrap: Magic path complete

**Module id:** `module99-00-wrap`  
**Kind:** `wrap`

[← Real evidence](../module08-03-magic-evidence/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Part A map and Part B real Magic evidence (CLI → tech → paint/save → DRC → GDS → engine). Parts C–D ship next.**

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
    patch_walkthrough()
    patch_lab_to_algo()
    print("PART_B_OK", len(PART_B))


if __name__ == "__main__":
    main()
