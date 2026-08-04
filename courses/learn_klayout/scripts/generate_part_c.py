#!/usr/bin/env python3
"""Generate learn_klayout Part C modules, tools, walkthroughs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"
WALK = PLATFORM / "tools" / "algorithm-walkthrough"
CAPTURE = ROOT.parents[1] / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"

PART_C = [
    ("module09-01-layer-query-algo", "layer-query-algo", "Layer query algorithm", "layer_query", "showLayerQuery",
     "Query shapes grouped by layer name.", "layer_query_count=2."),
    ("module09-03-width-spacing-algo", "width-spacing-algo", "Width spacing algorithm", "width_spacing", "showWidthSpacing",
     "Check min_width rules; find m0 violation.", "width_violations=1 on m0."),
    ("module10-01-marker-emit-algo", "marker-emit-algo", "Marker emit algorithm", "marker_emit", "showMarkerEmit",
     "Emit DRC markers from violations.", "marker_count=1."),
    ("module10-03-klayout-algo-engine", "klayout-algo-engine", "KLayout algo engine", "engine", "showEngine",
     "Run Part C engine and bind to Part B goldens.", "engine ok; bind width=1 markers=1."),
]

PART_C_LABS = [lab for _mid, lab, *_ in PART_C]

SEE_ALSO = {
    "width-spacing-algo": (
        "See also: [learn_drc rule deck](../../learn_drc/module01-01-rule-deck/README.md), "
        "[width checker](../../learn_drc/module01-03-width-checker/README.md), "
        "[spacing checker](../../learn_drc/module01-05-spacing-checker/README.md), "
        "[violation markers](../../learn_drc/module02-03-violation-markers/README.md)."
    ),
}

NAV = {
    "module09-01-layer-query-algo": ("../module08-03-klayout-evidence/README.md", "Evidence", "../module09-03-width-spacing-algo/README.md", "Width/spacing"),
    "module09-03-width-spacing-algo": ("../module09-01-layer-query-algo/README.md", "Layer query", "../module10-01-marker-emit-algo/README.md", "Markers"),
    "module10-01-marker-emit-algo": ("../module09-03-width-spacing-algo/README.md", "Width", "../module10-03-klayout-algo-engine/README.md", "Engine"),
    "module10-03-klayout-algo-engine": ("../module10-01-marker-emit-algo/README.md", "Markers", "../module14-01-layout-cell-model/README.md", "Layout model"),
}

STEPS = {
    "layer-query-algo": [
        ("poly", "poly group", "Query returns p0 on poly layer.", ["poly", "p0"], ["poly"]),
        ("m1", "metal1 group", "Query returns m0 on metal1.", ["metal1", "m0"], ["metal1"]),
        ("count", "Two layers", "layer_query_count=2.", ["count"], ["2"]),
        ("algo", "Layer query", "Group shape ids by layer name.", ["algo"], ["query"]),
        ("golden", "Golden", "GOLDEN: layer_query_count=2.", ["GOLDEN"], ["2"]),
    ],
    "width-spacing-algo": [
        ("rule", "min_width", "metal1 min_width=40.", ["min_width"], ["40"]),
        ("m0", "m0 violation", "m0 width 20 fails rule.", ["m0"], ["20"]),
        ("poly", "poly ok", "p0 width 50 passes.", ["p0"], ["ok"]),
        ("algo", "Width check", "Compare shape width to rule limit.", ["algo"], ["width"]),
        ("golden", "Golden", "GOLDEN: width_violations=1 on m0.", ["GOLDEN"], ["1/m0"]),
    ],
    "marker-emit-algo": [
        ("vio", "Violation", "Width violation on m0.", ["m0"], ["vio"]),
        ("emit", "Emit marker", "Create marker record per violation.", ["emit"], ["marker"]),
        ("type", "width type", "Marker type is width.", ["type"], ["width"]),
        ("count", "One marker", "marker_count=1.", ["count"], ["1"]),
        ("golden", "Golden", "GOLDEN: marker_count=1.", ["GOLDEN"], ["1"]),
    ],
    "klayout-algo-engine": [
        ("lq", "Layer query ok", "Layer query stage passes.", ["layer_query"], ["ok"]),
        ("ws", "Width ok", "Width/spacing stage passes.", ["width"], ["ok"]),
        ("me", "Markers ok", "Marker emit stage passes.", ["markers"], ["ok"]),
        ("bind", "Bind Part B", "Teaching width=1 markers=1 ↔ Part B logs.", ["bind"], ["1/1"]),
        ("golden", "Engine", "GOLDEN: klayout_algo_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module09-01-layer-query-algo": [
        ("Layer query count?", ["2", "4", "0", "6"], 0),
        ("Layers queried?", ["poly, metal1", "metal1 only", "STA", "GDS only"], 0),
        ("Query groups?", ["shapes by layer", "STA slack", "LEF", "ABC"], 0),
    ],
    "module09-03-width-spacing-algo": [
        ("Width violations?", ["1", "0", "2", "4"], 0),
        ("Violating shape?", ["m0", "p0", "A", "VDD"], 0),
        ("Check compares?", ["width vs min_width", "STA slack", "Verilog ports", "Liberty arcs"], 0),
    ],
    "module10-01-marker-emit-algo": [
        ("Marker count?", ["1", "0", "2", "4"], 0),
        ("Marker shape?", ["m0", "p0", "poly", "GDS"], 0),
        ("Emit from?", ["width violations", "LVS compare", "Place", "STA"], 0),
    ],
    "module10-03-klayout-algo-engine": [
        ("Engine ok means?", ["all Part C + bind", "binary only", "LVS", "Place"], 0),
        ("Bind compares to?", ["Part B evidence", "Liberty", "ABC", "Verilator"], 0),
        ("Width violation golden?", ["1", "0", "2", "4"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def see_also_block(lab: str) -> str:
    return SEE_ALSO.get(lab, "")


def tool_js(lab: str, title: str, mode: str, api_fn: str) -> str:
    return f"""import {{ ALGO_GOLDENS, PARTC_REAL, klayoutAlgoEngine, partcBind }} from "../../assets/algo-klayout-core.js";
import {{ createInteractiveAlgoKlayoutLab }} from "../../assets/interactive-algo-klayout-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoKlayoutLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Run stages / bind, then Check.</p>`,
  defaultMode: "{mode}",
  challenges: [
    {{ id: "run", title: "Run stage", level: "Intro", prompt: "Open {mode}.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "layers", title: "Layer query", level: "Practice", prompt: "layerQueryCount=2.",
      check: () => ALGO_GOLDENS.layerQueryCount === 2 }},
    {{ id: "viol", title: "Width violation", level: "Practice", prompt: "widthViolations=1 on m0.",
      check: () => ALGO_GOLDENS.widthViolations === 1 }},
    {{ id: "bind", title: "Bind markers", level: "Practice", prompt: "Bind markers ok.",
      setup: (_c, api) => api.showBind("markers"), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "real", title: "Real markers", level: "Practice", prompt: "PARTC_REAL.markerCount=1.",
      check: () => PARTC_REAL.markerCount === 1 }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true || klayoutAlgoEngine().ok }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "ALGO_KLAYOUT_ALGOS" not in text:
        ins = 'import { drawRealKlayout, STAGES as REAL_KLAYOUT_STAGES } from "../../assets/real-klayout-core.js";\n'
        if ins in text:
            text = text.replace(
                ins,
                ins + 'import { ALGO_KLAYOUT_ALGOS } from "./algo-klayout-algos.js";\nimport { drawAlgoKlayout } from "../../assets/algo-klayout-core.js";\n',
            )
        text = text.replace("  ...REAL_KLAYOUT_ALGOS,\n};", "  ...REAL_KLAYOUT_ALGOS,\n  ...ALGO_KLAYOUT_ALGOS,\n};")
    if 'pack.kind === "algo_klayout"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "real_klayout") {',
            '''  } else if (pack.kind === "algo_klayout") {
    drawAlgoKlayout(canvas, {
      highlight: s.highlight || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "real_klayout") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_C_LABS if f'"{lab}"' not in cap]
    if not missing:
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    for needle in ('"klayout-evidence": ("klayout-evidence", 5),', '"real-markers": ("real-markers", 5),'):
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO Part C", missing)
            return


def main() -> None:
    for mid, lab, title, mode, api_fn, outcome, idea in PART_C:
        prev_h, prev_l, next_h, next_l = NAV[mid]
        also = see_also_block(lab)
        also_readme = f"\n\n## See also\n\n{also}\n" if also else ""
        also_examples = f"\n\n## See also\n\n{also}\n" if also else ""
        also_transcript = f"\n\n## See also\n\n{also}\n" if also else ""
        steps = STEPS[lab]
        n = len(steps)
        walk = ["<!-- algorithm-walkthrough -->", ""]
        for i, (sid, st, cap, _b, _m) in enumerate(steps, 1):
            walk += [f"## Slide {i+2} — {st}", "", f"![{st}](assets/steps/{i:02d}-{sid}.png)", "", cap, ""]
        walk.append("<!-- /algorithm-walkthrough -->")
        write(ROOT / mid / "transcript.md", f"""# {title}

**Module id:** {mid}
**Lab:** {lab}

## Slide 1 — Why algorithms

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk)}

## Slide {n+3} — Browser lab

Open **{lab}**.

## Slide {n+4} — Implement track

Run algo_solvers.py and partc_bind.py.

## Slide {n+5} — Pitfalls

Changing tiny_algo_klayout without updating Part B goldens.

## Slide {n+6} — Try these

From the common folder, run the Part C self-tests.

```bash
cd courses/learn_klayout/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Slide {n+7} — Pseudocode

Here is the check in plain steps.

```text
{idea}
ok if goldens match and bind
```
{also_transcript}
## Slide {n+8} — Next

Continue Part C, then internals.
""")
        write(ROOT / mid / "README.md", f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · **ref**

[← {prev_l}]({prev_h}) · [Course README](../README.md) · [{next_l} →]({next_h})

## Outcomes

After this module you can: **{outcome}**
{also_readme}
## Two tracks

### Track A — `common/algo_solvers.py` + `partc_bind.py`
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
        write(ROOT / mid / "EXAMPLES.md", f"```bash\ncd courses/learn_klayout/common\npython3 algo_solvers.py\npython3 partc_bind.py\n```{also_examples}")
        write(ROOT / mid / "CHECKLIST.md", f"- [ ] algo_solvers ok\n- [ ] partc_bind ok\n")
        items = [{"q": q, "choices": c, "answer": a, "id": f"q{i}"} for i, (q, c, a) in enumerate(QUIZZES[mid])]
        write(ROOT / mid / "quiz.json", json.dumps({"moduleId": mid, "items": items}, indent=2) + "\n")
        write(ROOT / mid / "assets" / "STEPS.md", f"# {title}\n")
        tdir = PLATFORM / "tools" / lab
        write(tdir / f"{lab}.js", tool_js(lab, title, mode, api_fn))
        write(tdir / "index.html", f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>{title}</title><link rel="stylesheet" href="../../assets/site.css"><link rel="stylesheet" href="../../assets/clustering-lab.css"></head><body data-asset-base="../../assets/"><main class="tool-page"><section class="hero"><h1>{title}</h1><p class="lead">Part C — KLayout algorithms + bind.</p></section><div id="lab-root"></div></main><script type="module" src="{lab}.js"></script></body></html>')
        print("ok", mid)

    hl_map = {
        "layer-query-algo": ["poly", "metal1"],
        "width-spacing-algo": ["m0"],
        "marker-emit-algo": ["m0"],
        "klayout-algo-engine": ["bind"],
    }
    lines = ['/** Part C KLayout algo walkthroughs */', 'import { drawAlgoKlayout } from "../../assets/algo-klayout-core.js";', "", "export const ALGO_KLAYOUT_ALGOS = {"]
    for mid, lab, title, mode, *_ in PART_C:
        lines += [f'  "{lab}": {{', '    kind: "algo_klayout",', f'    title: "{title}",', f'    module: "{mid}",', "    steps: ["]
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            lines += ["      {", f'        id: {json.dumps(sid)},', f'        title: {json.dumps(st)},', f'        caption: {json.dumps(cap)},',
                      f'        bullets: {json.dumps(bullets)},', f'        metrics: {json.dumps(metrics)},',
                      f'        highlight: {json.dumps(hl_map.get(lab, bullets))},', "      },"]
        lines += ["    ],", "  },"]
    lines.append("};")
    write(WALK / "algo-klayout-algos.js", "\n".join(lines))

    mod = ROOT / "docs" / "MODULES.md"
    text = mod.read_text(encoding="utf-8")
    for mid, lab, title, *_ in PART_C:
        text = re.sub(rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
                      f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |", text)
    write(mod, text)
    patch_walkthrough()
    patch_lab_to_algo()
    print("PART_C_OK", len(PART_C))


if __name__ == "__main__":
    main()
