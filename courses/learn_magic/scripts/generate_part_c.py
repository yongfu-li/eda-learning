#!/usr/bin/env python3
"""Generate learn_magic Part C modules, tools, walkthroughs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"
WALK = PLATFORM / "tools" / "algorithm-walkthrough"
CAPTURE = ROOT.parents[1] / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"

PART_C = [
    (
        "module09-01-paint-connectivity",
        "paint-connectivity",
        "Paint connectivity algorithm",
        "connectivity",
        "showConnectivity",
        "Flood-fill metal1 nets; contact bridges poly and metal1.",
        "metal1_net_shapes=2; contact_count=1.",
    ),
    (
        "module09-03-drc-region-algo",
        "drc-region-algo",
        "DRC region algorithm",
        "drc_region",
        "showDrcRegion",
        "Region scan for width violations on painted rects.",
        "drc_error_count=1 on thin metal1.",
    ),
    (
        "module10-01-extract-algo",
        "extract-algo",
        "Extract algorithm",
        "extract",
        "showExtract",
        "Extract device/active nodes from poly/ndiff/pdiff.",
        "extract_nodes=3.",
    ),
    (
        "module10-03-magic-algo-engine",
        "magic-algo-engine",
        "Magic algo engine",
        "engine",
        "showEngine",
        "Run the full Part C engine and bind to real Magic goldens.",
        "engine ok; bind drc 1↔1, gds 6↔6.",
    ),
]

PART_C_LABS = [lab for _mid, lab, *_ in PART_C]

NAV = {
    "module09-01-paint-connectivity": (
        "../module08-03-magic-evidence/README.md",
        "Evidence",
        "../module09-03-drc-region-algo/README.md",
        "DRC region",
    ),
    "module09-03-drc-region-algo": (
        "../module09-01-paint-connectivity/README.md",
        "Connectivity",
        "../module10-01-extract-algo/README.md",
        "Extract",
    ),
    "module10-01-extract-algo": (
        "../module09-03-drc-region-algo/README.md",
        "DRC region",
        "../module10-03-magic-algo-engine/README.md",
        "Engine",
    ),
    "module10-03-magic-algo-engine": (
        "../module10-01-extract-algo/README.md",
        "Extract",
        "../module99-00-wrap/README.md",
        "Wrap",
    ),
}

STEPS = {
    "paint-connectivity": [
        ("m1", "metal1 shapes", "Two metal1 rectangles: m1y and thin (touching).", ["m1y", "thin"], ["2"]),
        ("net", "One metal1 net", "Flood-fill connects m1y and thin.", ["net"], ["1"]),
        ("ca", "Contact ca", "Contact bridges poly gate g and metal1.", ["ca"], ["1"]),
        ("poly", "poly link", "poly layer participates via contact.", ["g"], ["poly"]),
        ("golden", "Golden", "GOLDEN: metal1_net_shapes=2 contact=1.", ["GOLDEN"], ["2/1"]),
    ],
    "drc-region-algo": [
        ("scan", "Region scan", "Walk each painted rect; check min_width.", ["scan"], ["region"]),
        ("thin", "thin violation", "thin has width=1 < metal1 limit 2.", ["thin"], ["1"]),
        ("ok", "Other shapes", "Other rects meet width rules.", ["m1y"], ["ok"]),
        ("count", "One error", "Teaching golden drc_error_count=1.", ["DRC"], ["1"]),
        ("golden", "Golden", "GOLDEN: error on thin metal1.", ["GOLDEN"], ["1"]),
    ],
    "extract-algo": [
        ("poly", "Gate poly", "Extract poly shape g as gate node.", ["g"], ["poly"]),
        ("nd", "ndiff", "Extract nd as source/drain region.", ["nd"], ["ndiff"]),
        ("pd", "pdiff", "Extract pd as source/drain region.", ["pd"], ["pdiff"]),
        ("nodes", "Three nodes", "Teaching extract_nodes=3.", ["nodes"], ["3"]),
        ("golden", "Golden", "GOLDEN: extract_nodes=3.", ["GOLDEN"], ["3"]),
    ],
    "magic-algo-engine": [
        ("conn", "Connectivity ok", "Paint connectivity matches goldens.", ["conn"], ["ok"]),
        ("drc", "DRC ok", "Region scan matches drc_error_count=1.", ["drc"], ["ok"]),
        ("ext", "Extract ok", "Extract node count matches.", ["ext"], ["ok"]),
        ("bind", "Bind real", "Teaching DRC/GDS/contact ↔ Part B logs.", ["bind"], ["1/6"]),
        ("golden", "Engine", "GOLDEN: magic_algo_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module09-01-paint-connectivity": [
        ("metal1 net shape count?", ["2", "1", "6", "0"], 0),
        ("Contact count golden?", ["1", "6", "3", "0"], 0),
        ("Contact id in tiny_inv?", ["ca", "thin", "m1y", "g"], 0),
    ],
    "module09-03-drc-region-algo": [
        ("DRC error count golden?", ["1", "0", "6", "3"], 0),
        ("Violation shape?", ["thin", "nw", "ca", "nd"], 0),
        ("Rule type in lab?", ["min_width", "max_cap", "timing", "slack"], 0),
    ],
    "module10-01-extract-algo": [
        ("Extract node count?", ["3", "6", "1", "0"], 0),
        ("Layers extracted?", ["poly, ndiff, pdiff", "metal1 only", "nwell only", "GDS only"], 0),
        ("Extract purpose?", ["device/active regions", "STA slack", "LEF only", "Verilog sim"], 0),
    ],
    "module10-03-magic-algo-engine": [
        ("Engine ok means?", ["all Part C goldens + bind", "Magic binary only", "LVS only", "Place only"], 0),
        ("Bind compares to?", ["Part B evidence goldens", "Liberty", "ABC", "Verilator"], 0),
        ("GDS layer golden?", ["6", "1", "49", "0"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str, api_fn: str) -> str:
    return f"""import {{ ALGO_GOLDENS, PARTC_REAL, magicAlgoEngine, partcBind }} from "../../assets/algo-magic-core.js";
import {{ createInteractiveAlgoMagicLab }} from "../../assets/interactive-algo-magic-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoMagicLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Run stages / bind, then Check.</p>`,
  defaultMode: "{mode}",
  challenges: [
    {{ id: "run", title: "Run stage", level: "Intro", prompt: "Open {mode}.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "contact", title: "Contact golden", level: "Practice", prompt: "contactCount=1.",
      check: () => ALGO_GOLDENS.contactCount === 1 }},
    {{ id: "bind", title: "Bind DRC", level: "Practice", prompt: "Bind drc ok.",
      setup: (_c, api) => api.showBind("drc"), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "real", title: "Real DRC", level: "Practice", prompt: "PARTC_REAL.drcErrorCount=1.",
      check: () => PARTC_REAL.drcErrorCount === 1 }},
    {{ id: "select", title: "Select shape", level: "Challenge", prompt: "Select a shape.",
      setup: (_c, api) => {{ api.{api_fn}(); const h = api.getHighlight(); if (h[0]) api.select(h[0]); }},
      check: (_c, api) => api.getSelected().length >= 1 }},
    {{ id: "gds", title: "GDS golden", level: "Challenge", prompt: "gdsLayerCount=6.",
      check: () => ALGO_GOLDENS.gdsLayerCount === 6 }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true || magicAlgoEngine().ok }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "ALGO_MAGIC_ALGOS" not in text:
        text = text.replace(
            'import { REAL_MAGIC_ALGOS } from "./real-magic-algos.js";\n'
            'import { drawRealMagic, STAGES as REAL_MAGIC_STAGES } from "../../assets/real-magic-core.js";\n',
            'import { REAL_MAGIC_ALGOS } from "./real-magic-algos.js";\n'
            'import { drawRealMagic, STAGES as REAL_MAGIC_STAGES } from "../../assets/real-magic-core.js";\n'
            'import { ALGO_MAGIC_ALGOS } from "./algo-magic-algos.js";\n'
            'import { drawAlgoMagic } from "../../assets/algo-magic-core.js";\n',
        )
        if "REAL_MAGIC_ALGOS" not in text:
            text = text.replace(
                'import { MAGIC_ALGOS } from "./magic-algos.js";\n',
                'import { MAGIC_ALGOS } from "./magic-algos.js";\n'
                'import { ALGO_MAGIC_ALGOS } from "./algo-magic-algos.js";\n'
                'import { drawAlgoMagic } from "../../assets/algo-magic-core.js";\n',
            )
        text = text.replace(
            "  ...REAL_MAGIC_ALGOS,\n};",
            "  ...REAL_MAGIC_ALGOS,\n  ...ALGO_MAGIC_ALGOS,\n};",
        )
        if "REAL_MAGIC_ALGOS" not in text:
            text = text.replace(
                "  ...MAGIC_ALGOS,\n};",
                "  ...MAGIC_ALGOS,\n  ...ALGO_MAGIC_ALGOS,\n};",
            )
    if 'pack.kind === "algo_magic"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "real_magic") {',
            '''  } else if (pack.kind === "algo_magic") {
    drawAlgoMagic(canvas, {
      highlight: s.highlight || [],
      selected: s.selected || [],
      markers: s.markers || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "real_magic") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")
    print("Patched walkthrough.js (algo_magic)")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_C_LABS if f'"{lab}"' not in cap]
    if not missing:
        print("LAB_TO_ALGO already has Part C labs")
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    needle = '"magic-evidence": ("magic-evidence", 5),'
    if needle not in cap:
        needle = '"magic-engine": ("magic-engine", 5),'
    if needle in cap:
        cap = cap.replace(needle, needle + "\n    " + block + ",")
        CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
        print("Patched LAB_TO_ALGO Part C", missing)


def main() -> None:
    for mid, lab, title, mode, api_fn, outcome, idea in PART_C:
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
""",
        )
        write(
            ROOT / mid / "EXAMPLES.md",
            f"""# Examples — {title}

## Track A

```bash
cd courses/learn_magic/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Pseudocode

```text
{idea}
ok if algo goldens match and bind to Part B evidence
```
""",
        )
        write(
            ROOT / mid / "CHECKLIST.md",
            f"""# Checklist — {title}

- [ ] EXAMPLES.md
- [ ] Track A solvers/bind ok
- [ ] Track B challenges
- [ ] Quiz 3/3
""",
        )
        steps = STEPS[lab]
        walk = ["<!-- algorithm-walkthrough -->", ""]
        for i, (sid, st, cap, _b, _m) in enumerate(steps, 1):
            walk += [f"## Slide {i+2} — {st}", "", f"![{st}](assets/steps/{i:02d}-{sid}.png)", "", cap, ""]
        walk.append("<!-- /algorithm-walkthrough -->")
        write(
            ROOT / mid / "transcript.md",
            f"""# {title}

**Module id:** {mid}
**Lab:** {lab}
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why algorithms

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk)}

## Slide {len(steps)+3} — Browser lab track

Open **{lab}**. Run connectivity / DRC / extract / bind, then Check.

## Slide {len(steps)+4} — Implement track

From common/, run algo_solvers.py and partc_bind.py.

## Slide {len(steps)+5} — Pitfalls

Changing tiny_algo_magic without updating Part B goldens. Ignoring the bind side.

## Slide {len(steps)+6} — Try these

```bash
cd courses/learn_magic/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Slide {len(steps)+7} — Pseudocode

```text
{idea}
ok if goldens match and bind
```

## Slide {len(steps)+8} — Next

Continue Part C, then internals literacy.
""",
        )
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
        write(
            tdir / "index.html",
            f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title><link rel="stylesheet" href="../../assets/site.css"><link rel="stylesheet" href="../../assets/clustering-lab.css"></head>
<body data-asset-base="../../assets/"><main class="tool-page"><section class="hero"><h1>{title}</h1>
<p class="lead">Part C — Magic algorithms + bind.</p></section><div id="lab-root"></div></main>
<script type="module" src="{lab}.js"></script></body></html>
""",
        )
        print("ok", mid)

    lines = [
        "/** Part C Magic algo walkthroughs */",
        'import { drawAlgoMagic } from "../../assets/algo-magic-core.js";',
        "",
        "export { drawAlgoMagic };",
        "",
        "export const ALGO_MAGIC_ALGOS = {",
    ]
    for mid, lab, title, mode, *_ in PART_C:
        lines += [f'  "{lab}": {{', '    kind: "algo_magic",', f'    title: "{title}",', f'    module: "{mid}",', "    steps: ["]
        hl_map = {
            "paint-connectivity": ["m1y", "thin", "ca"],
            "drc-region-algo": ["thin"],
            "extract-algo": ["g", "nd", "pd"],
            "magic-algo-engine": ["bind"],
        }
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            hl = hl_map.get(lab, bullets)
            markers = [{"type": "width", "shape": "thin"}] if lab == "drc-region-algo" and sid == "thin" else []
            lines += [
                "      {",
                f"        id: {json.dumps(sid)},",
                f"        title: {json.dumps(st)},",
                f"        caption: {json.dumps(cap)},",
                f"        bullets: {json.dumps(bullets)},",
                f"        metrics: {json.dumps(metrics)},",
                f"        stageLabel: {json.dumps(st)},",
                f"        metricText: {json.dumps(metrics[0])},",
                f"        highlight: {json.dumps(hl)},",
            ]
            if markers:
                lines.append(f"        markers: {json.dumps(markers)},")
            lines += ["      },"]
        lines += ["    ],", "  },"]
    lines.append("};")
    write(WALK / "algo-magic-algos.js", "\n".join(lines))

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
    rows = [
        ("module01-01-paint-layers", "paint-layers"),
        ("module01-03-select-box", "select-box"),
        ("module02-01-contact-paint", "contact-paint"),
        ("module02-03-magic-drc-map", "magic-drc-map"),
        ("module03-01-gds-write-map", "gds-write-map"),
        ("module03-03-magic-engine", "magic-engine"),
        ("module06-01-magic-cli", "magic-cli"),
        ("module06-03-magic-tech-vocab", "magic-tech-vocab"),
        ("module07-01-real-paint-save", "real-paint-save"),
        ("module07-03-real-drc", "real-drc"),
        ("module08-01-real-gds", "real-gds"),
        ("module08-03-magic-evidence", "magic-evidence"),
    ]
    for mid, lab in rows:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    for mid, lab, *_ in PART_C:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(wlines))

    ev = ROOT / "module08-03-magic-evidence" / "README.md"
    if ev.is_file():
        t = ev.read_text(encoding="utf-8")
        t = t.replace("[Wrap →](../module99-00-wrap/README.md)", "[Paint connectivity →](../module09-01-paint-connectivity/README.md)")
        write(ev, t)

    write(
        ROOT / "module99-00-wrap" / "README.md",
        """# Module 99-00-wrap: Magic path complete

**Module id:** `module99-00-wrap`  
**Kind:** `wrap`

[← Algo engine](../module10-03-magic-algo-engine/README.md) · [Course README](../README.md) · End →

## Outcomes

**Recap Part A map, Part B real Magic evidence, and Part C algorithms bound to DRC/GDS goldens. Part D internals planned next.**

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
    print("PART_C_OK", len(PART_C))


if __name__ == "__main__":
    main()
