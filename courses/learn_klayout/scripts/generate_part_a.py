#!/usr/bin/env python3
"""Generate learn_klayout Part A modules, tools, and walkthrough algos."""
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
    ("module01-01-layers-view-map", "layers-view-map", "Layers view map", "layers", "showLayers",
     "View layer palette and GDS layer numbers for tiny_rect.", "layer_count=2 (poly, metal1)."),
    ("module01-03-cell-hierarchy-map", "cell-hierarchy-map", "Cell hierarchy map", "hierarchy", "showHierarchy",
     "Navigate top cell and instance hierarchy.", "top=tiny_rect; instances=0."),
    ("module02-01-stream-gds-map", "stream-gds-map", "Stream GDS map", "stream", "showStream",
     "Stream shapes to GDS with layer map.", "shape_count=2; stream_ok=True."),
    ("module02-03-drc-script-map", "drc-script-map", "DRC script map", "drc", "showDrc",
     "Run width rules; find violations.", "width_violations=1 on m0."),
    ("module03-01-markers-report-map", "markers-report-map", "Markers report map", "markers", "showMarkers",
     "DRC markers and violation report.", "marker_count=1 on m0."),
    ("module03-03-klayout-engine", "klayout-engine", "KLayout engine (map)", "engine", "engine",
     "Run the full Part A engine; ok when every golden matches.", "klayout_engine ok=True."),
]

PART_A_LABS = [lab for _mid, lab, *_ in PART_A]

SEE_ALSO = {
    "layers-view-map": (
        "See also: [learn_magic paint layers](../../learn_magic/module01-01-paint-layers/README.md) "
        "for layer/paint meaning."
    ),
    "stream-gds-map": (
        "See also: [learn_magic GDS write map](../../learn_magic/module03-01-gds-write-map/README.md) "
        "for GDS write side."
    ),
    "drc-script-map": (
        "See also: [learn_magic DRC map](../../learn_magic/module02-03-magic-drc-map/README.md) "
        "for Magic DRC contrast."
    ),
    "markers-report-map": (
        "See also: [learn_drc rule deck](../../learn_drc/module01-01-rule-deck/README.md), "
        "[width checker](../../learn_drc/module01-03-width-checker/README.md), "
        "[spacing checker](../../learn_drc/module01-05-spacing-checker/README.md), "
        "[violation markers](../../learn_drc/module02-03-violation-markers/README.md)."
    ),
}

NAV = {
    "module01-01-layers-view-map": ("../module00-00-intro/README.md", "Intro", "../module01-03-cell-hierarchy-map/README.md", "Hierarchy"),
    "module01-03-cell-hierarchy-map": ("../module01-01-layers-view-map/README.md", "Layers", "../module02-01-stream-gds-map/README.md", "Stream"),
    "module02-01-stream-gds-map": ("../module01-03-cell-hierarchy-map/README.md", "Hierarchy", "../module02-03-drc-script-map/README.md", "DRC"),
    "module02-03-drc-script-map": ("../module02-01-stream-gds-map/README.md", "Stream", "../module03-01-markers-report-map/README.md", "Markers"),
    "module03-01-markers-report-map": ("../module02-03-drc-script-map/README.md", "DRC", "../module03-03-klayout-engine/README.md", "Engine"),
    "module03-03-klayout-engine": ("../module03-01-markers-report-map/README.md", "Markers", "../module06-01-klayout-cli/README.md", "CLI"),
}

STEPS = {
    "layers-view-map": [
        ("poly", "poly layer", "poly maps to GDS layer 66.", ["poly", "66"], ["66"]),
        ("m1", "metal1 layer", "metal1 maps to GDS layer 68.", ["metal1", "68"], ["68"]),
        ("map", "Layer map", "Two named layers in tiny_rect.", ["layers"], ["2"]),
        ("view", "Layer view", "Toggle visibility per layer in KLayout.", ["view"], ["map"]),
        ("golden", "Golden", "GOLDEN: layer_count=2.", ["GOLDEN"], ["2"]),
    ],
    "cell-hierarchy-map": [
        ("top", "Top cell", "Top cell name is tiny_rect.", ["tiny_rect"], ["top"]),
        ("inst", "Zero instances", "No child cell instances on teaching layout.", ["instances"], ["0"]),
        ("tree", "Hierarchy tree", "Cell browser shows flat hierarchy.", ["tree"], ["flat"]),
        ("shapes", "Two shapes", "p0 on poly, m0 on metal1.", ["p0", "m0"], ["2"]),
        ("golden", "Golden", "GOLDEN: top=tiny_rect instances=0.", ["GOLDEN"], ["ok"]),
    ],
    "stream-gds-map": [
        ("shapes", "Two shapes", "p0 and m0 rectangles stream to GDS.", ["p0", "m0"], ["2"]),
        ("dbu", "DBU", "Database unit 0.001 µm.", ["dbu"], ["0.001"]),
        ("layer", "Layer/datatype", "Layer numbers from the layer map.", ["layer"], ["map"]),
        ("stream", "stream ok", "GDS stream completes without error.", ["stream"], ["ok"]),
        ("golden", "Golden", "GOLDEN: shape_count=2 stream_ok=True.", ["GOLDEN"], ["2/ok"]),
    ],
    "drc-script-map": [
        ("rule", "Width rule", "metal1 min_width=40 dbu units.", ["min_width"], ["40"]),
        ("m0", "m0 violation", "m0 width is 20 — below limit.", ["m0"], ["20"]),
        ("drc", "DRC script", "Ruby DRC finds one width violation.", ["drc"], ["1"]),
        ("poly", "poly ok", "p0 width 50 passes poly rule.", ["p0"], ["ok"]),
        ("golden", "Golden", "GOLDEN: width_violations=1 on m0.", ["GOLDEN"], ["1/m0"]),
    ],
    "markers-report-map": [
        ("emit", "Emit marker", "DRC emits marker on violating shape.", ["marker"], ["1"]),
        ("m0", "m0 marker", "Marker anchored on m0 metal1.", ["m0"], ["shape"]),
        ("report", "Report", "Violation report lists width error.", ["report"], ["width"]),
        ("count", "One marker", "Teaching golden marker_count=1.", ["count"], ["1"]),
        ("golden", "Golden", "GOLDEN: marker_count=1.", ["GOLDEN"], ["1"]),
    ],
    "klayout-engine": [
        ("layers", "Layers ok", "Layer view stage passes.", ["layers"], ["ok"]),
        ("hier", "Hierarchy ok", "Cell hierarchy stage passes.", ["hierarchy"], ["ok"]),
        ("stream", "Stream ok", "Stream GDS stage passes.", ["stream"], ["ok"]),
        ("drc", "DRC ok", "DRC script stage passes.", ["drc"], ["ok"]),
        ("golden", "Engine golden", "GOLDEN: klayout_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module01-01-layers-view-map": [
        ("Layer count golden?", ["2", "4", "1", "0"], 0),
        ("poly GDS layer?", ["66", "68", "1", "0"], 0),
        ("Layers used for?", ["GDS layer visibility", "STA slack", "SPICE only", "Place only"], 0),
    ],
    "module01-03-cell-hierarchy-map": [
        ("Top cell name?", ["tiny_rect", "top", "clk", "inv"], 0),
        ("Instance count?", ["0", "2", "4", "1"], 0),
        ("Hierarchy shows?", ["cells and instances", "Liberty arcs", "Verilog ports", "LEF sites"], 0),
    ],
    "module02-01-stream-gds-map": [
        ("Shape count golden?", ["2", "4", "1", "0"], 0),
        ("stream_ok?", ["True", "False", "None", "N/A"], 0),
        ("Stream writes?", ["GDS with layer map", "SPICE netlist", "SDC only", "LEF abstract"], 0),
    ],
    "module02-03-drc-script-map": [
        ("Width violations golden?", ["1", "0", "2", "4"], 0),
        ("Violating shape?", ["m0", "p0", "A", "VDD"], 0),
        ("m0 width?", ["20", "50", "40", "100"], 0),
    ],
    "module03-01-markers-report-map": [
        ("Marker count golden?", ["1", "0", "2", "4"], 0),
        ("Marker shape?", ["m0", "p0", "poly", "metal1"], 0),
        ("Report summarizes?", ["DRC violations", "LVS compare", "STA slack", "Place HPWL"], 0),
    ],
    "module03-03-klayout-engine": [
        ("Engine ok means?", ["every Part A golden matches", "OpenROAD placed", "LVS passed", "STA slack=8"], 0),
        ("width_violations golden?", ["1", "0", "2", "4"], 0),
        ("engine_ok flag?", ["True", "False", "None", "N/A"], 0),
    ],
}

ALL_KLAYOUT_LABS = [
    "layers-view-map", "cell-hierarchy-map", "stream-gds-map", "drc-script-map", "markers-report-map", "klayout-engine",
    "klayout-cli", "gds-vocab", "real-stream-gds", "real-drc-script", "real-markers", "klayout-evidence",
    "layer-query-algo", "width-spacing-algo", "marker-emit-algo", "klayout-algo-engine",
    "layout-cell-model", "read-drc-runner", "contribute-klayout",
]

LAB_TITLES = {
    "layers-view-map": "Layers view map",
    "cell-hierarchy-map": "Cell hierarchy map",
    "stream-gds-map": "Stream GDS map",
    "drc-script-map": "DRC script map",
    "markers-report-map": "Markers report map",
    "klayout-engine": "KLayout engine",
    "klayout-cli": "KLayout CLI",
    "gds-vocab": "GDS vocabulary",
    "real-stream-gds": "Real stream GDS",
    "real-drc-script": "Real DRC script",
    "real-markers": "Real DRC markers",
    "klayout-evidence": "Real KLayout evidence",
    "layer-query-algo": "Layer query algorithm",
    "width-spacing-algo": "Width spacing algorithm",
    "marker-emit-algo": "Marker emit algorithm",
    "klayout-algo-engine": "KLayout algo engine",
    "layout-cell-model": "Layout / Cell / Instance model",
    "read-drc-runner": "Read DRC runner",
    "contribute-klayout": "Contribute to KLayout",
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def see_also_block(lab: str) -> str:
    return SEE_ALSO.get(lab, "")


def tool_js(lab: str, title: str, mode: str, api_fn: str) -> str:
    return f"""import {{ GOLDENS, klayoutEngine }} from "../../assets/klayout-core.js";
import {{ createInteractiveKlayoutLab }} from "../../assets/interactive-klayout-lab.js";
const root = document.getElementById("lab-root");

createInteractiveKlayoutLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Use stage buttons, then Check.</p>`,
  defaultMode: "{mode}",
  challenges: [
    {{ id: "run", title: "Run stage", level: "Intro", prompt: "Open the {mode} stage.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "layers", title: "Layers golden", level: "Practice", prompt: "layerCount=2.",
      check: () => GOLDENS.layerCount === 2 }},
    {{ id: "viol", title: "Width violation", level: "Practice", prompt: "widthViolations=1 on m0.",
      check: () => GOLDENS.widthViolations === 1 }},
    {{ id: "select", title: "Select shape", level: "Practice", prompt: "Select m0.",
      setup: (_c, api) => {{ api.{api_fn}(); api.select("m0"); }},
      check: (_c, api) => api.getSelected().includes("m0") }},
    {{ id: "markers", title: "Marker golden", level: "Challenge", prompt: "markerCount=1.",
      check: () => GOLDENS.markerCount === 1 }},
    {{ id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is {mode}.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast()?.ok === true || klayoutEngine().ok }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "KLAYOUT_ALGOS" not in text:
        ins = 'import { NETGEN_INTERNALS_ALGOS } from "./netgen-internals-algos.js";\n'
        if ins in text:
            text = text.replace(
                ins,
                ins
                + 'import { KLAYOUT_ALGOS } from "./klayout-algos.js";\n'
                + 'import { drawKlayout, STARTER as KLAYOUT_STARTER } from "../../assets/klayout-core.js";\n',
            )
        elif 'import { NETGEN_ALGOS } from "./netgen-algos.js";\n' in text:
            text = text.replace(
                'import { NETGEN_ALGOS } from "./netgen-algos.js";\n',
                'import { NETGEN_ALGOS } from "./netgen-algos.js";\n'
                'import { KLAYOUT_ALGOS } from "./klayout-algos.js";\n'
                'import { drawKlayout, STARTER as KLAYOUT_STARTER } from "../../assets/klayout-core.js";\n',
            )
        text = text.replace(
            "  ...NETGEN_INTERNALS_ALGOS,\n};",
            "  ...NETGEN_INTERNALS_ALGOS,\n  ...KLAYOUT_ALGOS,\n};",
        )
        if "KLAYOUT_ALGOS" in text and "...KLAYOUT_ALGOS" not in text:
            for needle in ("  ...ALGO_NETGEN_ALGOS,\n};", "  ...NETGEN_ALGOS,\n};", "  ...MAGIC_ALGOS,\n};"):
                if needle in text:
                    text = text.replace(needle, needle.replace("};", "  ...KLAYOUT_ALGOS,\n};"))
                    break
    if 'pack.kind === "klayout"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "netgen_internals") {',
            '''  } else if (pack.kind === "klayout") {
    drawKlayout(canvas, {
      highlight: s.highlight || [],
      selected: s.selected || [],
      markers: s.markers || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "netgen_internals") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")
    print("Patched walkthrough.js (klayout)")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_A_LABS if f'"{lab}"' not in cap]
    if not missing:
        print("LAB_TO_ALGO already has Part A labs")
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    for needle in ('"contribute-netgen": ("contribute-netgen", 5),', '"klayout-engine": ("klayout-engine", 5),'):
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO Part A", missing)
            return
    print("WARN: could not patch LAB_TO_ALGO")


def patch_tools_index() -> None:
    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="klayout"' in it:
        print("tools/index.html already has #klayout")
        return
    items = "\n".join(
        f'        <li><a href="{lab}/">{LAB_TITLES[lab]}</a></li>' for lab in ALL_KLAYOUT_LABS
    )
    section = f"""
    <section class="tool-section" id="klayout">
      <h2>KLayout</h2>
      <ul class="tool-list">
{items}
      </ul>
    </section>

"""
    if '    </section>\n\n    <section class="tool-section" id="spice">' in it:
        it = it.replace(
            '    </section>\n\n    <section class="tool-section" id="spice">',
            '    </section>\n' + section + '\n    <section class="tool-section" id="spice">',
        )
    elif 'id="spice"' in it:
        it = it.replace('    <section class="tool-section" id="spice">', section + '    <section class="tool-section" id="spice">')
    idx.write_text(it, encoding="utf-8", newline="\n")
    print("Patched tools/index.html #klayout")


def patch_course_meta() -> None:
    pub = PUBLISH.read_text(encoding="utf-8")
    if '"learn_klayout"' in pub.split("COURSE_META = {", 1)[1].split("}\n\nCOURSE_INDEX", 1)[0]:
        print("COURSE_META learn_klayout already present")
        return
    block = '''    "learn_klayout": {
        "title": "KLayout (GDS / DRC)",
        "focus": "viewer map → real KLayout evidence → algorithms → internals",
        "prereq": "learn_magic or learn_drc",
        "status": "ready",
        "repo": "learn_klayout",
        "modules_md": ROOT / "courses" / "learn_klayout" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_klayout",
        "lead": (
            "Part A viewer/stream/DRC map on tiny_rect "
            "(layer_count=2; width_violations=1 on m0; marker_count=1; stream_ok=True) "
            "+ Part B real KLayout CLI evidence "
            "+ Part C algorithms bound to DRC goldens "
            "+ Part D internals "
            "(Layout/Cell/Instance model, read DRC runner, contribute checklist). "
            "Parts A–D ready. Clips and decks load from "
            "<code>courses/learn_klayout</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#klayout",
        "tools_label": "KLayout tools",
        "first_lab": "layers-view-map",
        "first_n": "02",
    },
'''
    needle = (
        '        "first_lab": "read-netlists-map",\n'
        '        "first_n": "02",\n'
        "    },\n"
        "}\n\n"
        "COURSE_INDEX"
    )
    if needle not in pub:
        print("WARN: could not patch COURSE_META — learn_netgen end needle missing")
        return
    pub = pub.replace(
        needle,
        '        "first_lab": "read-netlists-map",\n'
        '        "first_n": "02",\n'
        "    },\n"
        + block
        + "}\n\n"
        "COURSE_INDEX",
    )
    PUBLISH.write_text(pub, encoding="utf-8", newline="\n")
    print("Patched COURSE_META learn_klayout")


def main() -> None:
    for mid, lab, title, mode, api_fn, outcome, idea in PART_A:
        prev_h, prev_l, next_h, next_l = NAV[mid]
        also = see_also_block(lab)
        also_readme = f"\n\n## See also\n\n{also}\n" if also else ""
        also_examples = f"\n\n## See also\n\n{also}\n" if also else ""
        also_transcript = f"\n\n## See also\n\n{also}\n" if also else ""
        write(ROOT / mid / "README.md", f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · **ref**

[← {prev_l}]({prev_h}) · [Course README](../README.md) · [{next_l} →]({next_h})

## Outcomes

After this module you can: **{outcome}**
{also_readme}
## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); study `common/solvers.py` + `common/tiny_klayout.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `python3 solvers.py` in `common/`.

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
cd courses/learn_klayout/common
python3 solvers.py
```

## Pseudocode

```text
{idea}
ok if goldens match GOLDENS / tiny_klayout.json
```
{also_examples}""")
        write(ROOT / mid / "CHECKLIST.md", f"""# Checklist — {title}

- [ ] Read EXAMPLES.md pseudocode
- [ ] Track A: solvers match golden
- [ ] Track B: clear challenges on /tools/{lab}/
- [ ] Quiz: 3/3
""")
        steps = STEPS[lab]
        walk_lines = ["<!-- algorithm-walkthrough -->", ""]
        for i, (sid, st, cap, _b, _m) in enumerate(steps, 1):
            walk_lines += [f"## Slide {i + 2} — {st}", "", f"![{st}](assets/steps/{i:02d}-{sid}.png)", "", cap, ""]
        walk_lines.append("<!-- /algorithm-walkthrough -->")
        n = len(steps)
        write(ROOT / mid / "transcript.md", f"""# {title}

**Module id:** {mid}
**Lab:** {lab}
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why {title.split()[0]}

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk_lines)}

## Slide {n + 3} — Browser lab track

Open **{lab}**. Run the stage buttons and Check the goldens.

## Slide {n + 4} — Implement track

From common/, run solvers.py and confirm KLAYOUT_PARTA_OK.

## Slide {n + 5} — Pitfalls

Confusing layer numbers with layer names. Forgetting m0 width violation on tiny_rect.

## Slide {n + 6} — Try these

From the common folder, run the KLayout map self-test.

```bash
cd courses/learn_klayout/common
python3 solvers.py
```

## Slide {n + 7} — Pseudocode

Here is the check in plain steps.

```text
{idea}
ok if goldens match
```
{also_transcript}
## Slide {n + 8} — Next

Continue the KLayout Part A map, then the real CLI track.
""")
        items = [{"q": q, "choices": c, "answer": a, "id": f"q{i}"} for i, (q, c, a) in enumerate(QUIZZES[mid])]
        write(ROOT / mid / "quiz.json", json.dumps({"moduleId": mid, "items": items}, indent=2) + "\n")
        step_lines = [f"# {title} — step-by-step", "", f"**Module:** `{mid}`", f"**Lab / algo:** `{lab}`", ""]
        for i, (sid, st, cap, bullets, metrics) in enumerate(steps, 1):
            step_lines += [f"## Step {i} — {st}", "", f"![Step {i}](steps/{i:02d}-{sid}.png)", "", f"**Caption (transcript):** {cap}", "", "**Slide bullets:**", ""]
            step_lines += [f"- {b}" for b in bullets]
            step_lines += ["", "**On-screen metrics:**", "", "```", metrics[0], "```", ""]
        write(ROOT / mid / "assets" / "STEPS.md", "\n".join(step_lines))
        tdir = PLATFORM / "tools" / lab
        write(tdir / f"{lab}.js", tool_js(lab, title, mode, api_fn))
        write(tdir / "index.html", f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title><link rel="stylesheet" href="../../assets/site.css"><link rel="stylesheet" href="../../assets/clustering-lab.css"></head>
<body data-asset-base="../../assets/"><main class="tool-page"><section class="hero"><h1>{title}</h1>
<p class="lead">Part A — KLayout viewer/stream/DRC map.</p></section><div id="lab-root"></div></main>
<script type="module" src="{lab}.js"></script></body></html>
""")
        print("ok", mid)

    lines = ['/** Part A — KLayout map walkthroughs */', 'import { drawKlayout } from "../../assets/klayout-core.js";', "", "export { drawKlayout };", "", "export const KLAYOUT_ALGOS = {"]
    for mid, lab, title, mode, _api, _o, _idea in PART_A:
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "klayout",')
        lines.append(f'    title: "{title}",')
        lines.append(f'    module: "{mid}",')
        lines.append("    steps: [")
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            lines += [
                "      {",
                f"        id: {json.dumps(sid)},",
                f"        title: {json.dumps(st)},",
                f"        caption: {json.dumps(cap)},",
                f"        bullets: {json.dumps(bullets)},",
                f"        metrics: {json.dumps(metrics)},",
                f"        stageLabel: {json.dumps(st)},",
                f"        metricText: {json.dumps(metrics[0])},",
                f"        highlight: {json.dumps(bullets)},",
                "      },",
            ]
        lines += ["    ],", "  },"]
    lines.append("};")
    write(WALK / "klayout-algos.js", "\n".join(lines))

    mod_path = ROOT / "docs" / "MODULES.md"
    text = mod_path.read_text(encoding="utf-8")
    for mid, lab, title, *_ in PART_A:
        text = re.sub(
            rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
            f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |",
            text,
        )
    write(mod_path, text)
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"] + [f"| `{lab}` | `{mid}` | 5 |" for mid, lab, *_ in PART_A]))
    patch_walkthrough()
    patch_lab_to_algo()
    patch_tools_index()
    patch_course_meta()
    print("PART_A_OK", len(PART_A))


if __name__ == "__main__":
    main()
