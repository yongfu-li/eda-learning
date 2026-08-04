#!/usr/bin/env python3
"""Generate learn_klayout Part B modules, tools, walkthroughs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"
WALK = PLATFORM / "tools" / "algorithm-walkthrough"
CAPTURE = ROOT.parents[1] / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"

PART_B = [
    ("module06-01-klayout-cli", "klayout-cli", "KLayout CLI & scripts", "empty",
     "Invoke klayout -b -r script.drc; recipe starts stream_gds→load_drc.", "First two cmds: stream_gds, load_drc."),
    ("module06-03-gds-vocab", "gds-vocab", "GDS vocabulary", "gds_vocab",
     "Name layer numbers and shape vocabulary.", "layer_count=2; shape_count=2; dbu=0.001."),
    ("module07-01-real-stream-gds", "real-stream-gds", "Real stream GDS", "stream_gds",
     "Stream tiny_rect.gds with two shapes.", "shape_count=2; stream_ok=True; cell=tiny_rect."),
    ("module07-03-real-drc-script", "real-drc-script", "Real DRC script", "drc_script",
     "Run width rules on streamed layout.", "width_violations=1 on m0."),
    ("module08-01-real-markers", "real-markers", "Real DRC markers", "markers",
     "Emit DRC markers for violations.", "marker_count=1 on m0."),
    ("module08-03-klayout-evidence", "klayout-evidence", "Real KLayout evidence", "markers",
     "Run the full real KLayout engine against goldens.", "real_klayout_engine ok=True."),
]

PART_B_LABS = [lab for _mid, lab, *_ in PART_B]

NAV = {
    "module06-01-klayout-cli": ("../module03-03-klayout-engine/README.md", "Map engine", "../module06-03-gds-vocab/README.md", "GDS vocab"),
    "module06-03-gds-vocab": ("../module06-01-klayout-cli/README.md", "CLI", "../module07-01-real-stream-gds/README.md", "Stream GDS"),
    "module07-01-real-stream-gds": ("../module06-03-gds-vocab/README.md", "Vocab", "../module07-03-real-drc-script/README.md", "DRC script"),
    "module07-03-real-drc-script": ("../module07-01-real-stream-gds/README.md", "Stream", "../module08-01-real-markers/README.md", "Markers"),
    "module08-01-real-markers": ("../module07-03-real-drc-script/README.md", "DRC", "../module08-03-klayout-evidence/README.md", "Evidence"),
    "module08-03-klayout-evidence": ("../module08-01-real-markers/README.md", "Markers", "../module09-01-layer-query-algo/README.md", "Layer algo"),
}

STEPS = {
    "klayout-cli": [
        ("invoke", "klayout -b", "KLayout runs batch mode with -r script.drc.", ["klayout"], ["CLI"]),
        ("stream", "stream gds", "First stream tiny_rect.gds.", ["stream_gds"], ["gds"]),
        ("load", "load drc", "Then load DRC Ruby script.", ["load_drc"], ["drc"]),
        ("run", "run drc", "Run width/spacing checks.", ["run_drc"], ["check"]),
        ("golden", "Golden", "GOLDEN: recipe prefix stream_gds→load_drc.", ["GOLDEN"], ["2"]),
    ],
    "gds-vocab": [
        ("poly", "poly=66", "poly layer number 66.", ["poly", "66"], ["66"]),
        ("m1", "metal1=68", "metal1 layer number 68.", ["metal1", "68"], ["68"]),
        ("dbu", "DBU", "Database unit 0.001 µm.", ["dbu"], ["0.001"]),
        ("shapes", "Two shapes", "p0 and m0 rectangles.", ["p0", "m0"], ["2"]),
        ("golden", "Golden", "GOLDEN: layer_count=2 shape_count=2.", ["GOLDEN"], ["2/2"]),
    ],
    "real-stream-gds": [
        ("gds", "tiny_rect.gds", "Stream tiny_rect.gds — 2 shapes.", ["gds"], ["2"]),
        ("cell", "Cell name", "Cell name tiny_rect.", ["tiny_rect"], ["cell"]),
        ("layers", "Layer map", "poly and metal1 from layer map.", ["layers"], ["2"]),
        ("ok", "stream ok", "Stream completes without error.", ["stream_ok"], ["True"]),
        ("golden", "Golden", "GOLDEN: shape_count=2 stream_ok=True.", ["GOLDEN"], ["2/ok"]),
    ],
    "real-drc-script": [
        ("cmd", "run drc", "DRC script finds width violations.", ["run_drc"], ["cmd"]),
        ("m0", "m0 violation", "m0 width 20 < min_width 40.", ["m0"], ["1"]),
        ("poly", "poly ok", "p0 passes width check.", ["p0"], ["ok"]),
        ("log", "Log line", "WIDTH_VIOLATIONS=1 in log.", ["log"], ["1"]),
        ("golden", "Golden", "GOLDEN: width_violations=1 on m0.", ["GOLDEN"], ["1/m0"]),
    ],
    "real-markers": [
        ("emit", "markers cmd", "Emit violation markers.", ["markers"], ["cmd"]),
        ("m0", "m0 marker", "One marker on m0.", ["m0"], ["1"]),
        ("report", "Report", "DRC report lists width error.", ["report"], ["width"]),
        ("count", "Count", "MARKER_COUNT=1.", ["count"], ["1"]),
        ("golden", "Golden", "GOLDEN: marker_count=1.", ["GOLDEN"], ["1"]),
    ],
    "klayout-evidence": [
        ("recipe", "Full recipe", "Golden recipe has five stages.", ["recipe"], ["5"]),
        ("stream", "Stream golden", "Still 2 shapes streamed.", ["stream"], ["2"]),
        ("drc", "DRC golden", "Still 1 width violation.", ["drc"], ["1"]),
        ("mark", "Markers golden", "Still 1 marker.", ["markers"], ["1"]),
        ("golden", "Engine", "GOLDEN: real_klayout_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module06-01-klayout-cli": [
        ("Typical KLayout batch invocation?", ["klayout -b -r script.drc", "sta -exit", "magic -dnull", "yosys -s"], 0),
        ("First recipe command?", ["stream_gds", "gds_write", "compare", "abc"], 0),
        ("Second recipe command?", ["load_drc", "report_checks", "flatten", "opt"], 0),
    ],
    "module06-03-gds-vocab": [
        ("Teaching layer count?", ["2", "4", "1", "6"], 0),
        ("poly layer number?", ["66", "68", "1", "0"], 0),
        ("DBU golden?", ["0.001", "1.0", "0.01", "10"], 0),
    ],
    "module07-01-real-stream-gds": [
        ("Shape count golden?", ["2", "4", "0", "6"], 0),
        ("Cell name?", ["tiny_rect", "top", "inv", "clk"], 0),
        ("stream_ok?", ["True", "False", "None", "N/A"], 0),
    ],
    "module07-03-real-drc-script": [
        ("Width violations golden?", ["1", "0", "2", "4"], 0),
        ("Violating shape?", ["m0", "p0", "poly", "metal1"], 0),
        ("Violation type?", ["width", "LVS", "STA", "LEF"], 0),
    ],
    "module08-01-real-markers": [
        ("Marker count golden?", ["1", "0", "2", "4"], 0),
        ("Marker shape?", ["m0", "p0", "A", "VDD"], 0),
        ("Markers command?", ["markers", "read_liberty", "create_clock", "place"], 0),
    ],
    "module08-03-klayout-evidence": [
        ("Engine ok means?", ["all Part B goldens match", "STA slack=8", "LVS only", "Place only"], 0),
        ("Recipe length?", ["5", "3", "1", "20"], 0),
        ("Lab id (unique)?", ["klayout-evidence", "real-evidence", "klayout-engine", "magic-evidence"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, stage: str) -> str:
    return f"""import {{ REAL_GOLDENS, realKlayoutEngine, recipePrefixOk, GOLDEN_RECIPE_IDS }} from "../../assets/real-klayout-core.js";
import {{ createInteractiveRealKlayoutLab }} from "../../assets/interactive-real-klayout-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRealKlayoutLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Build the recipe or open stages, then Check.</p>`,
  defaultStage: "{stage}",
  challenges: [
    {{ id: "stage", title: "Open stage", level: "Intro", prompt: "Show the {stage} stage.",
      setup: (_c, api) => api.showStage("{stage}"), check: (_c, api) => api.getStage()?.id === "{stage}" || api.getMode() === "{stage}" }},
    {{ id: "layers", title: "Layers 2", level: "Intro", prompt: "layerCount=2.",
      check: () => REAL_GOLDENS.layerCount === 2 }},
    {{ id: "prefix", title: "Recipe prefix", level: "Practice", prompt: "Load golden recipe; prefix ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix(2) }},
    {{ id: "viol", title: "Width violation", level: "Practice", prompt: "widthViolations=1 on m0.",
      check: () => REAL_GOLDENS.widthViolations === 1 }},
    {{ id: "markers", title: "Marker golden", level: "Practice", prompt: "markerCount=1.",
      check: () => REAL_GOLDENS.markerCount === 1 }},
    {{ id: "select", title: "Select m0", level: "Challenge", prompt: "Select m0.",
      setup: (_c, api) => {{ api.showStage("drc_script"); api.select("m0"); }},
      check: (_c, api) => api.getSelected().includes("m0") }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.engine().ok === true || realKlayoutEngine(GOLDEN_RECIPE_IDS).ok }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "REAL_KLAYOUT_ALGOS" not in text:
        ins = 'import { drawKlayout, STARTER as KLAYOUT_STARTER } from "../../assets/klayout-core.js";\n'
        if ins in text:
            text = text.replace(
                ins,
                ins
                + 'import { REAL_KLAYOUT_ALGOS } from "./real-klayout-algos.js";\n'
                + 'import { drawRealKlayout, STAGES as REAL_KLAYOUT_STAGES } from "../../assets/real-klayout-core.js";\n',
            )
        text = text.replace("  ...KLAYOUT_ALGOS,\n};", "  ...KLAYOUT_ALGOS,\n  ...REAL_KLAYOUT_ALGOS,\n};")
    if 'pack.kind === "real_klayout"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "klayout") {',
            '''  } else if (pack.kind === "real_klayout") {
    drawRealKlayout(canvas, {
      stage: s.stage || REAL_KLAYOUT_STAGES.empty,
      highlight: s.highlight || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "klayout") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")
    print("Patched walkthrough.js (real_klayout)")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_B_LABS if f'"{lab}"' not in cap]
    if not missing:
        print("LAB_TO_ALGO already has Part B labs")
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    for needle in ('"klayout-engine": ("klayout-engine", 5),', '"markers-report-map": ("markers-report-map", 5),'):
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO Part B", missing)
            return


def main() -> None:
    stage_map = {
        "klayout-cli": "empty",
        "gds-vocab": "gds_vocab",
        "real-stream-gds": "stream_gds",
        "real-drc-script": "drc_script",
        "real-markers": "markers",
        "klayout-evidence": "markers",
    }
    for mid, lab, title, stage, outcome, idea in PART_B:
        prev_h, prev_l, next_h, next_l = NAV[mid]
        steps = STEPS[lab]
        n = len(steps)
        walk = ["<!-- algorithm-walkthrough -->", ""]
        for i, (sid, st, cap, _b, _m) in enumerate(steps, 1):
            walk += [f"## Slide {i + 2} — {st}", "", f"![{st}](assets/steps/{i:02d}-{sid}.png)", "", cap, ""]
        walk.append("<!-- /algorithm-walkthrough -->")
        write(ROOT / mid / "README.md", f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · **ref**

[← {prev_l}]({prev_h}) · [Course README](../README.md) · [{next_l} →]({next_h})

## Outcomes

After this module you can: **{outcome}**

## Two tracks

### Track A — `common/real_solvers.py` + `evidence/goldens.json`
### Track B — http://127.0.0.1:8080/tools/{lab}/

## Media

| Artifact | Path |
|----------|------|
| Transcript | [transcript.md](transcript.md) |
| Quiz | [quiz.json](quiz.json) |
""")
        write(ROOT / mid / "EXAMPLES.md", f"""# Examples — {title}

```bash
cd courses/learn_klayout/common
python3 real_solvers.py
```

## Pseudocode

```text
{idea}
ok if goldens match evidence/goldens.json
```
""")
        write(ROOT / mid / "CHECKLIST.md", f"# Checklist — {title}\n\n- [ ] real_solvers ok\n- [ ] Track B challenges\n- [ ] Quiz 3/3\n")
        write(ROOT / mid / "transcript.md", f"""# {title}

**Module id:** {mid}
**Lab:** {lab}

## Slide 1 — Why real KLayout

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk)}

## Slide {n + 3} — Browser lab

Open **{lab}**.

## Slide {n + 4} — Implement track

Run real_solvers.py — REAL_KLAYOUT_OK.

## Slide {n + 5} — Pitfalls

Editing goldens without re-running scripts.

## Slide {n + 6} — Try these

From the common folder, run the real KLayout self-test.

```bash
cd courses/learn_klayout/common
python3 real_solvers.py
```

## Slide {n + 7} — Pseudocode

Here is the check in plain steps.

```text
{idea}
ok if goldens match
```

## Slide {n + 8} — Next

Continue Part B evidence track.
""")
        items = [{"q": q, "choices": c, "answer": a, "id": f"q{i}"} for i, (q, c, a) in enumerate(QUIZZES[mid])]
        write(ROOT / mid / "quiz.json", json.dumps({"moduleId": mid, "items": items}, indent=2) + "\n")
        write(ROOT / mid / "assets" / "STEPS.md", f"# {title}\n\n**Lab:** `{lab}`\n")
        tdir = PLATFORM / "tools" / lab
        write(tdir / f"{lab}.js", tool_js(lab, title, stage))
        write(tdir / "index.html", f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>
<link rel="stylesheet" href="../../assets/site.css"><link rel="stylesheet" href="../../assets/clustering-lab.css"></head>
<body data-asset-base="../../assets/"><main class="tool-page"><section class="hero"><h1>{title}</h1>
<p class="lead">Part B — real KLayout CLI evidence.</p></section><div id="lab-root"></div></main>
<script type="module" src="{lab}.js"></script></body></html>""")
        print("ok", mid)

    lines = ['/** Part B — real KLayout walkthroughs */', 'import { STAGES } from "../../assets/real-klayout-core.js";', "", "export const REAL_KLAYOUT_ALGOS = {"]
    for mid, lab, title, stage, _o, _i in PART_B:
        lines += [f'  "{lab}": {{', '    kind: "real_klayout",', f'    title: "{title}",', f'    module: "{mid}",', "    steps: ["]
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            lines += ["      {", f'        id: {json.dumps(sid)},', f'        title: {json.dumps(st)},', f'        caption: {json.dumps(cap)},',
                      f'        bullets: {json.dumps(bullets)},', f'        metrics: {json.dumps(metrics)},',
                      f'        stage: STAGES[{json.dumps(stage_map[lab])}],', f'        highlight: {json.dumps(bullets)},', "      },"]
        lines += ["    ],", "  },"]
    lines.append("};")
    write(WALK / "real-klayout-algos.js", "\n".join(lines))

    mod = ROOT / "docs" / "MODULES.md"
    text = mod.read_text(encoding="utf-8")
    for mid, lab, title, *_ in PART_B:
        text = re.sub(rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
                      f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |", text)
    write(mod, text)

    wlines = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for mid, lab, *_ in [("module01-01-layers-view-map", "layers-view-map"), ("module03-03-klayout-engine", "klayout-engine")] + [(m, l) for m, l, *_ in PART_B]:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(wlines))
    patch_walkthrough()
    patch_lab_to_algo()
    print("PART_B_OK", len(PART_B))


if __name__ == "__main__":
    main()
