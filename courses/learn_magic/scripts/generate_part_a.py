#!/usr/bin/env python3
"""Generate learn_magic Part A modules, tools, and walkthrough algos."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"
WALK = PLATFORM / "tools" / "algorithm-walkthrough"
CAPTURE = ROOT.parents[1] / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"
TOOLS = PLATFORM / "tools"
PUBLISH = PLATFORM / "scripts" / "publish_course_platform.py"

PART_A = [
    (
        "module01-01-paint-layers",
        "paint-layers",
        "Paint layers",
        "paint",
        "showPaint",
        "Place rectangles on named Magic layers (paint).",
        "6 rects; metal1 paint=2.",
    ),
    (
        "module01-03-select-box",
        "select-box",
        "Select box",
        "select",
        "showSelect",
        "Box + select picks geometry for edit / DRC focus.",
        "select thin metal1; width=1.",
    ),
    (
        "module02-01-contact-paint",
        "contact-paint",
        "Contact paint",
        "contact",
        "showContact",
        "Paint a contact cut between poly and metal1.",
        "contact_count=1 (ca).",
    ),
    (
        "module02-03-magic-drc-map",
        "magic-drc-map",
        "Magic DRC map",
        "drc",
        "runDrc",
        "Run DRC width check; find violation on thin metal1.",
        "drc_error_count=1 on thin.",
    ),
    (
        "module03-01-gds-write-map",
        "gds-write-map",
        "GDS write map",
        "gds",
        "showGds",
        "Map Magic layers to GDS layer numbers.",
        "gds_layer_count=6; metal1→49.",
    ),
    (
        "module03-03-magic-engine",
        "magic-engine",
        "Magic engine (map)",
        "engine",
        "engine",
        "Run the full Part A engine; ok when every golden matches.",
        "magic_engine ok=True.",
    ),
]

PART_A_LABS = [lab for _mid, lab, *_ in PART_A]

NAV = {
    "module01-01-paint-layers": (
        "../module00-00-intro/README.md",
        "Intro",
        "../module01-03-select-box/README.md",
        "Select box",
    ),
    "module01-03-select-box": (
        "../module01-01-paint-layers/README.md",
        "Paint layers",
        "../module02-01-contact-paint/README.md",
        "Contact paint",
    ),
    "module02-01-contact-paint": (
        "../module01-03-select-box/README.md",
        "Select box",
        "../module02-03-magic-drc-map/README.md",
        "DRC map",
    ),
    "module02-03-magic-drc-map": (
        "../module02-01-contact-paint/README.md",
        "Contact paint",
        "../module03-01-gds-write-map/README.md",
        "GDS write",
    ),
    "module03-01-gds-write-map": (
        "../module02-03-magic-drc-map/README.md",
        "DRC map",
        "../module03-03-magic-engine/README.md",
        "Engine",
    ),
    "module03-03-magic-engine": (
        "../module03-01-gds-write-map/README.md",
        "GDS write",
        "../module99-00-wrap/README.md",
        "Wrap",
    ),
}

STEPS = {
    "paint-layers": [
        ("rects", "Six rectangles", "tiny_inv has six painted rectangles.", ["nw", "nd", "pd", "g", "m1y", "thin"], ["6"]),
        ("layers", "Layer names", "Layers: ndiff, pdiff, poly, metal1, nwell, pwell.", ["ndiff", "poly"], ["6"]),
        ("metal1", "metal1 paint", "Two metal1 rectangles: m1y and thin.", ["m1y", "thin"], ["2"]),
        ("paint", "Paint command", "Magic paint places rects on the active layer.", ["paint"], ["map"]),
        ("golden", "Golden", "GOLDEN: rect_count=6; paint_metal1=2.", ["GOLDEN"], ["6/2"]),
    ],
    "select-box": [
        ("box", "Box select", "Magic box + select picks one shape.", ["box"], ["select"]),
        ("thin", "thin shape", "The thin metal1 rect has width 1.", ["thin"], ["1"]),
        ("focus", "Edit focus", "Selected geometry drives edit and DRC focus.", ["selected"], ["thin"]),
        ("width", "Width check", "min(width,height) of thin is 1 lambda.", ["width"], ["1"]),
        ("golden", "Golden", "GOLDEN: selected=thin.", ["GOLDEN"], ["thin"]),
    ],
    "contact-paint": [
        ("ca", "Contact ca", "One contact between poly and metal1.", ["ca"], ["1"]),
        ("between", "Between layers", "Contact bridges poly (g) and metal1 (m1y).", ["g", "m1y"], ["bridge"]),
        ("paint", "Contact paint", "Magic contact command paints the cut.", ["contact"], ["paint"]),
        ("highlight", "Highlight", "Contact + gate + m1y highlighted.", ["ca", "g"], ["3"]),
        ("golden", "Golden", "GOLDEN: contact_count=1.", ["GOLDEN"], ["1"]),
    ],
    "magic-drc-map": [
        ("drc", "drc check", "Magic drc check scans width rules.", ["drc"], ["check"]),
        ("rule", "min_width", "metal1 min_width=2 on this tech.", ["metal1"], ["2"]),
        ("thin", "Violation", "thin metal1 has width 1 < 2.", ["thin"], ["1"]),
        ("error", "Error count", "Exactly one width error.", ["errors"], ["1"]),
        ("golden", "Golden", "GOLDEN: drc_error_count=1 on thin.", ["GOLDEN"], ["1/thin"]),
    ],
    "gds-write-map": [
        ("map", "GDS map", "Magic gds write maps layer names to GDS numbers.", ["gds_map"], ["map"]),
        ("metal1", "metal1→49", "metal1 streams as GDS layer 49.", ["metal1"], ["49"]),
        ("count", "Six entries", "Six layer/contact mappings in gds_map.", ["ndiff", "contact"], ["6"]),
        ("stream", "Streamout", "Part A uses a fixed map — real Magic writes .gds.", ["write"], ["gds"]),
        ("golden", "Golden", "GOLDEN: gds_layer_count=6.", ["GOLDEN"], ["6"]),
    ],
    "magic-engine": [
        ("paint", "Paint ok", "Paint layers stage passes.", ["paint"], ["ok"]),
        ("select", "Select ok", "Select box stage passes.", ["select"], ["ok"]),
        ("contact", "Contact ok", "Contact stage passes.", ["contact"], ["ok"]),
        ("drc", "DRC ok", "DRC stage passes.", ["drc"], ["ok"]),
        ("golden", "Engine golden", "GOLDEN: magic_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module01-01-paint-layers": [
        ("How many rects in tiny_inv?", ["6", "1", "10", "0"], 0),
        ("metal1 paint count?", ["2", "6", "1", "0"], 0),
        ("Which layer is the gate?", ["poly", "metal1", "nwell", "contact"], 0),
    ],
    "module01-03-select-box": [
        ("Selected thin shape id?", ["thin", "m1y", "ca", "nw"], 0),
        ("thin metal1 width?", ["1", "2", "6", "10"], 0),
        ("Select is used for?", ["edit / DRC focus", "GDS only", "STA only", "LVS only"], 0),
    ],
    "module02-01-contact-paint": [
        ("Contact count golden?", ["1", "6", "0", "2"], 0),
        ("Contact id?", ["ca", "thin", "g", "m1y"], 0),
        ("Contact bridges?", ["poly and metal1", "nwell only", "STA clk", "GDS only"], 0),
    ],
    "module02-03-magic-drc-map": [
        ("DRC error count?", ["1", "6", "0", "2"], 0),
        ("Violation shape?", ["thin", "m1y", "ca", "nw"], 0),
        ("metal1 min_width?", ["2", "1", "6", "10"], 0),
    ],
    "module03-01-gds-write-map": [
        ("GDS layer count?", ["6", "1", "49", "0"], 0),
        ("metal1 GDS number?", ["49", "6", "25", "1"], 0),
        ("gds write maps?", ["Magic layers → GDS numbers", "STA slack", "Verilog ports", "Liberty arcs"], 0),
    ],
    "module03-03-magic-engine": [
        ("Engine ok means?", ["every Part A golden matches", "OpenROAD placed", "LVS passed", "STA slack=8"], 0),
        ("rect_count golden?", ["6", "3", "1", "0"], 0),
        ("engine_ok flag?", ["True", "False", "None", "N/A"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str, api_fn: str) -> str:
    return f"""import {{ GOLDENS, magicEngine }} from "../../assets/magic-core.js";
import {{ createInteractiveMagicLab }} from "../../assets/interactive-magic-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMagicLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Use stage buttons, then Check.</p>`,
  defaultMode: "{mode}",
  challenges: [
    {{ id: "run", title: "Run stage", level: "Intro", prompt: "Open the {mode} stage.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "rects", title: "Rects golden", level: "Practice", prompt: "rectCount=6.",
      check: () => GOLDENS.rectCount === 6 }},
    {{ id: "select", title: "Select shape", level: "Practice", prompt: "Select a highlighted shape.",
      setup: (_c, api) => {{ api.{api_fn}(); const h = api.getHighlight(); if (h[0]) api.select(h[0]); }},
      check: (_c, api) => api.getSelected().length >= 1 }},
    {{ id: "metal1", title: "metal1 paint", level: "Practice", prompt: "paintMetal1=2.",
      check: () => GOLDENS.paintMetal1 === 2 }},
    {{ id: "drc", title: "DRC golden", level: "Challenge", prompt: "drcErrorCount=1 on thin.",
      check: () => GOLDENS.drcErrorCount === 1 && GOLDENS.thinShape === "thin" }},
    {{ id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is {mode}.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast()?.ok === true || magicEngine().ok }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "MAGIC_ALGOS" not in text:
        text = text.replace(
            'import { OPENSTA_INTERNALS_ALGOS } from "./opensta-internals-algos.js";\n'
            'import { drawOpenstaInternals } from "../../assets/opensta-internals-core.js";\n',
            'import { OPENSTA_INTERNALS_ALGOS } from "./opensta-internals-algos.js";\n'
            'import { drawOpenstaInternals } from "../../assets/opensta-internals-core.js";\n'
            'import { MAGIC_ALGOS } from "./magic-algos.js";\n'
            'import { drawMagic, STARTER as MAGIC_STARTER } from "../../assets/magic-core.js";\n',
        )
        text = text.replace(
            "  ...OPENSTA_INTERNALS_ALGOS,\n};",
            "  ...OPENSTA_INTERNALS_ALGOS,\n  ...MAGIC_ALGOS,\n};",
        )
    if 'pack.kind === "magic"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "opensta_internals") {',
            '''  } else if (pack.kind === "magic") {
    drawMagic(canvas, {
      cell: s.cell || MAGIC_STARTER,
      highlight: s.highlight || [],
      selected: s.selected || null,
      markers: s.markers || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "opensta_internals") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")
    print("Patched walkthrough.js")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_A_LABS if f'"{lab}"' not in cap]
    if not missing:
        print("LAB_TO_ALGO already has Part A labs")
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in PART_A_LABS)
    needle = '"contribute-opensta": ("contribute-opensta", 5),'
    if needle in cap:
        cap = cap.replace(needle, needle + "\n    " + block + ",")
        CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
        print("Patched LAB_TO_ALGO")
    else:
        print("WARN: could not patch LAB_TO_ALGO — contribute-opensta needle missing")


def patch_tools_index() -> None:
    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="magic"' in it:
        print("tools/index.html already has #magic")
        return
    section = """
    <section class="tool-section" id="magic">
      <h2>Magic</h2>
      <ul class="tool-list">
        <li><a href="paint-layers/">Paint layers</a></li>
        <li><a href="select-box/">Select box</a></li>
        <li><a href="contact-paint/">Contact paint</a></li>
        <li><a href="magic-drc-map/">Magic DRC map</a></li>
        <li><a href="gds-write-map/">GDS write map</a></li>
        <li><a href="magic-engine/">Magic engine</a></li>
        <li><a href="magic-cli/">Magic CLI</a></li>
        <li><a href="magic-tech-vocab/">Magic tech vocabulary</a></li>
        <li><a href="real-paint-save/">Real paint / save</a></li>
        <li><a href="real-drc/">Real DRC</a></li>
        <li><a href="real-gds/">Real GDS streamout</a></li>
        <li><a href="magic-evidence/">Real Magic evidence</a></li>
        <li><a href="paint-connectivity/">Paint connectivity</a></li>
        <li><a href="drc-region-algo/">DRC region algorithm</a></li>
        <li><a href="extract-algo/">Extract algorithm</a></li>
        <li><a href="magic-algo-engine/">Magic algo engine</a></li>
        <li><a href="tile-plane-model/">Tile / Plane model</a></li>
        <li><a href="read-drc-cifwrite/">Read DRC / cifwrite</a></li>
        <li><a href="contribute-magic/">Contribute to Magic</a></li>
      </ul>
    </section>

"""
    opensta_end = '    </section>\n\n    <section class="tool-section" id="spice">'
    if opensta_end in it:
        it = it.replace(opensta_end, '    </section>\n' + section + '\n    <section class="tool-section" id="spice">')
    elif 'id="spice"' in it:
        it = it.replace(
            '    <section class="tool-section" id="spice">',
            section + '    <section class="tool-section" id="spice">',
        )
    idx.write_text(it, encoding="utf-8", newline="\n")
    print("Patched tools/index.html")


def patch_course_meta() -> None:
    pub = PUBLISH.read_text(encoding="utf-8")
    meta_slice = pub.split("COURSE_META = {", 1)[1].split("}\n\nCOURSE_INDEX", 1)[0]
    if '"learn_magic"' in meta_slice:
        print("COURSE_META learn_magic already present")
        return
    block = '''    "learn_magic": {
        "title": "Magic (layout / DRC)",
        "focus": "layout map → real Magic evidence → algorithms → internals",
        "prereq": "learn_digital",
        "status": "ready",
        "repo": "learn_magic",
        "modules_md": ROOT / "courses" / "learn_magic" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_magic",
        "lead": (
            "Part A layout/DRC/GDS map on tiny_inv "
            "(6 rects; metal1=2; contact=1; DRC on thin; GDS layers=6) "
            "+ Part B real Magic CLI evidence "
            "+ Part C algorithms bound to DRC/GDS goldens "
            "+ Part D internals "
            "(Tile/Plane model, read DRC/cifwrite, contribute checklist). "
            "Part A ready; Parts B–D planned. Clips and decks load from "
            "<code>courses/learn_magic</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#magic",
        "tools_label": "Magic tools",
        "first_lab": "paint-layers",
        "first_n": "02",
    },
'''
    needle = (
        '        "first_lab": "timing-graph-map",\n'
        '        "first_n": "02",\n'
        "    },\n"
        "}\n\n"
        "COURSE_INDEX"
    )
    if needle not in pub:
        print("WARN: could not patch COURSE_META — learn_opensta end needle missing")
        return
    pub = pub.replace(
        needle,
        '        "first_lab": "timing-graph-map",\n'
        '        "first_n": "02",\n'
        "    },\n"
        + block
        + "}\n\n"
        "COURSE_INDEX",
    )
    PUBLISH.write_text(pub, encoding="utf-8", newline="\n")
    print("Patched COURSE_META learn_magic")


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

1. Open [EXAMPLES.md](EXAMPLES.md); study `common/solvers.py` + `common/tiny_magic.json`.
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
cd courses/learn_magic/common
python3 solvers.py
```

## Pseudocode

```text
{idea}
ok if goldens match GOLDENS / tiny_magic.json
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

From common/, run solvers.py and confirm MAGIC_PARTA_OK.

## Slide {len(steps) + 5} — Pitfalls

Mixing KLayout viewer shortcuts with Magic paint commands. Forgetting min_width when reading DRC errors.

## Slide {len(steps) + 6} — Try these

From the common folder, run the Magic map self-test.

```bash
cd courses/learn_magic/common
python3 solvers.py
```

## Slide {len(steps) + 7} — Pseudocode

Here is the check in plain steps.

```text
{idea}
ok if goldens match
```

## Slide {len(steps) + 8} — Next

Continue the Magic Part A map, then the real CLI track.
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
    <section class="hero"><h1>{title}</h1><p class="lead">Part A — Magic layout/DRC/GDS map.</p></section>
    <div id="lab-root"></div>
  </main>
  <script type="module" src="{lab}.js"></script>
</body>
</html>
""",
        )
        print("ok", mid)

    lines = [
        "/** Part A — Magic map walkthroughs */",
        'import { drawMagic, STARTER } from "../../assets/magic-core.js";',
        "",
        "export { drawMagic, STARTER };",
        "",
        "export const MAGIC_ALGOS = {",
    ]
    for mid, lab, title, mode, _api, _o, _idea in PART_A:
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "magic",')
        lines.append(f'    title: "{title}",')
        lines.append(f'    module: "{mid}",')
        lines.append("    steps: [")
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            hl = bullets
            if lab == "magic-drc-map" and sid == "thin":
                hl = ["thin"]
            lines.append("      {")
            lines.append(f"        id: {json.dumps(sid)},")
            lines.append(f"        title: {json.dumps(st)},")
            lines.append(f"        caption: {json.dumps(cap)},")
            lines.append(f"        bullets: {json.dumps(bullets)},")
            lines.append(f"        metrics: {json.dumps(metrics)},")
            lines.append(f"        stageLabel: {json.dumps(st)},")
            lines.append(f"        metricText: {json.dumps(metrics[0])},")
            lines.append(f"        highlight: {json.dumps(hl)},")
            if lab == "magic-drc-map" and sid == "thin":
                lines.append('        markers: [{ type: "width", layer: "metal1", shape: "thin", value: 1, limit: 2 }],')
            lines.append("      },")
        lines.append("    ],")
        lines.append("  },")
    lines.append("};")
    write(WALK / "magic-algos.js", "\n".join(lines))

    mod_path = ROOT / "docs" / "MODULES.md"
    text = mod_path.read_text(encoding="utf-8")
    for mid, lab, title, *_ in PART_A:
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

    patch_walkthrough()
    patch_lab_to_algo()
    patch_tools_index()
    patch_course_meta()

    print("PART_A_OK", len(PART_A))


if __name__ == "__main__":
    main()
