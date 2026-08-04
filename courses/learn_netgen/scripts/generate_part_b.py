#!/usr/bin/env python3
"""Generate learn_netgen Part B modules, tools, walkthroughs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"
WALK = PLATFORM / "tools" / "algorithm-walkthrough"
CAPTURE = ROOT.parents[1] / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"

PART_B = [
    ("module06-01-netgen-cli", "netgen-cli", "Netgen CLI & scripts", "empty",
     "Invoke netgen -batch script.tcl; recipe starts read_sch→read_lay.", "First two cmds: read_sch, read_lay."),
    ("module06-03-spice-vocab", "spice-vocab", "SPICE vocabulary", "spice_vocab",
     "Name device prefixes and port/pin vocabulary.", "Devices=2; nets=4; classes nmos/pmos."),
    ("module07-01-real-read-spice", "real-read-spice", "Real read SPICE", "read_spice",
     "Read tiny_inv schematic and layout SPICE.", "sch_devices=2; lay_devices=2; nets=4."),
    ("module07-03-real-lvs-compare", "real-lvs-compare", "Real LVS compare", "lvs_compare",
     "Compare nets and devices between sch and lay.", "matched_nets=4; matched_devices=2; mismatch=0."),
    ("module08-01-real-lvs-report", "real-lvs-report", "Real LVS report", "lvs_report",
     "LVS report with class count.", "matched=2/4; mismatch=0; classes=2."),
    ("module08-03-netgen-evidence", "netgen-evidence", "Real Netgen evidence", "lvs_report",
     "Run the full real Netgen engine against goldens.", "real_netgen_engine ok=True."),
]

PART_B_LABS = [lab for _mid, lab, *_ in PART_B]

NAV = {
    "module06-01-netgen-cli": ("../module03-03-netgen-engine/README.md", "Map engine", "../module06-03-spice-vocab/README.md", "SPICE vocab"),
    "module06-03-spice-vocab": ("../module06-01-netgen-cli/README.md", "CLI", "../module07-01-real-read-spice/README.md", "Read SPICE"),
    "module07-01-real-read-spice": ("../module06-03-spice-vocab/README.md", "Vocab", "../module07-03-real-lvs-compare/README.md", "Compare"),
    "module07-03-real-lvs-compare": ("../module07-01-real-read-spice/README.md", "Read", "../module08-01-real-lvs-report/README.md", "Report"),
    "module08-01-real-lvs-report": ("../module07-03-real-lvs-compare/README.md", "Compare", "../module08-03-netgen-evidence/README.md", "Evidence"),
    "module08-03-netgen-evidence": ("../module08-01-real-lvs-report/README.md", "Report", "../module09-01-hash-devices-algo/README.md", "Hash algo"),
}

STEPS = {
    "netgen-cli": [
        ("invoke", "netgen -batch", "Netgen runs Tcl with netgen -batch -noc script.tcl.", ["netgen"], ["CLI"]),
        ("sch", "read sch", "First read schematic SPICE.", ["read_sch"], ["sch"]),
        ("lay", "read lay", "Then read layout/extract SPICE.", ["read_lay"], ["lay"]),
        ("compare", "compare", "Compare nets and devices.", ["compare"], ["LVS"]),
        ("golden", "Golden", "GOLDEN: recipe prefix read_sch→read_lay.", ["GOLDEN"], ["2"]),
    ],
    "spice-vocab": [
        ("prefix", "M/X prefixes", "SPICE devices use M or X prefixes.", ["M", "X"], ["dev"]),
        ("ports", "Four ports", "Ports A, Y, VDD, VSS.", ["A", "Y"], ["4"]),
        ("pins", "G,D,S pins", "MOSFET pins gate, drain, source.", ["G", "D", "S"], ["pins"]),
        ("class", "Classes", "nmos and pmos device classes.", ["nmos", "pmos"], ["2"]),
        ("golden", "Golden", "GOLDEN: device_count=2 net_count=4.", ["GOLDEN"], ["2/4"]),
    ],
    "real-read-spice": [
        ("sch", "Schematic", "Read tiny_inv.sch.spice — 2 devices.", ["sch"], ["2"]),
        ("lay", "Layout", "Read tiny_inv.lay.spice — 2 devices.", ["lay"], ["2"]),
        ("nets", "Four nets", "Four nets on each side.", ["nets"], ["4"]),
        ("cell", "tiny_inv", "Cell name tiny_inv.", ["tiny_inv"], ["cell"]),
        ("golden", "Golden", "GOLDEN: sch/lay devices=2 nets=4.", ["GOLDEN"], ["2/4"]),
    ],
    "real-lvs-compare": [
        ("cmd", "compare", "Netgen compare matches nets/devices.", ["compare"], ["cmd"]),
        ("nets", "Four nets", "Four nets matched.", ["nets"], ["4"]),
        ("dev", "Two devices", "Two devices matched.", ["dev"], ["2"]),
        ("mism", "Zero mismatch", "MISMATCH=0 in log.", ["mismatch"], ["0"]),
        ("golden", "Golden", "GOLDEN: matched_nets=4 matched_devices=2.", ["GOLDEN"], ["4/2"]),
    ],
    "real-lvs-report": [
        ("report", "report cmd", "Netgen report summarizes LVS.", ["report"], ["cmd"]),
        ("dev", "Devices", "MATCHED_DEVICES=2.", ["devices"], ["2"]),
        ("nets", "Nets", "MATCHED_NETS=4.", ["nets"], ["4"]),
        ("class", "Classes", "CLASSES=2.", ["classes"], ["2"]),
        ("golden", "Golden", "GOLDEN: mismatch=0.", ["GOLDEN"], ["0"]),
    ],
    "netgen-evidence": [
        ("recipe", "Full recipe", "Golden recipe has six Tcl stages.", ["recipe"], ["6"]),
        ("read", "Read golden", "Still 2 sch + 2 lay devices.", ["read"], ["2/2"]),
        ("cmp", "Compare golden", "Still 4 matched nets.", ["compare"], ["4"]),
        ("rep", "Report golden", "Still mismatch=0.", ["report"], ["0"]),
        ("golden", "Engine", "GOLDEN: real_netgen_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module06-01-netgen-cli": [
        ("Typical Netgen batch invocation?", ["netgen -batch -noc script.tcl", "sta -exit", "magic -dnull", "yosys -s"], 0),
        ("First recipe command?", ["read_sch", "gds_write", "drc check", "abc"], 0),
        ("Second recipe command?", ["read_lay", "report_checks", "flatten", "opt"], 0),
    ],
    "module06-03-spice-vocab": [
        ("Teaching device count?", ["2", "4", "1", "6"], 0),
        ("Port names?", ["A,Y,VDD,VSS", "clk,rst", "G,D,S only", "LEF only"], 0),
        ("Device classes?", ["nmos, pmos", "metal1 only", "STA only", "GDS only"], 0),
    ],
    "module07-01-real-read-spice": [
        ("Schematic device count?", ["2", "4", "0", "6"], 0),
        ("Layout device count?", ["2", "1", "3", "0"], 0),
        ("Net count each side?", ["4", "2", "6", "0"], 0),
    ],
    "module07-03-real-lvs-compare": [
        ("Matched nets golden?", ["4", "2", "0", "6"], 0),
        ("Matched devices golden?", ["2", "4", "0", "1"], 0),
        ("Mismatch count?", ["0", "2", "4", "1"], 0),
    ],
    "module08-01-real-lvs-report": [
        ("Class count golden?", ["2", "4", "0", "6"], 0),
        ("Report command?", ["report", "read_liberty", "create_clock", "place"], 0),
        ("Mismatch golden?", ["0", "2", "4", "1"], 0),
    ],
    "module08-03-netgen-evidence": [
        ("Engine ok means?", ["all Part B goldens match", "STA slack=8", "DRC only", "Place only"], 0),
        ("Recipe length?", ["6", "3", "1", "20"], 0),
        ("Lab id (unique)?", ["netgen-evidence", "real-evidence", "netgen-engine", "magic-evidence"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, stage: str) -> str:
    return f"""import {{ REAL_GOLDENS, realNetgenEngine, recipePrefixOk, GOLDEN_RECIPE_IDS }} from "../../assets/real-netgen-core.js";
import {{ createInteractiveRealNetgenLab }} from "../../assets/interactive-real-netgen-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRealNetgenLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Build the recipe or open stages, then Check.</p>`,
  defaultStage: "{stage}",
  challenges: [
    {{ id: "stage", title: "Open stage", level: "Intro", prompt: "Show the {stage} stage.",
      setup: (_c, api) => api.showStage("{stage}"), check: (_c, api) => api.getStage()?.id === "{stage}" || api.getMode() === "{stage}" }},
    {{ id: "dev", title: "Devices 2", level: "Intro", prompt: "matchedDevices=2.",
      check: () => REAL_GOLDENS.matchedDevices === 2 }},
    {{ id: "prefix", title: "Recipe prefix", level: "Practice", prompt: "Load golden recipe; prefix ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix(2) }},
    {{ id: "nets", title: "Nets golden", level: "Practice", prompt: "matchedNets=4.",
      check: () => REAL_GOLDENS.matchedNets === 4 }},
    {{ id: "mism", title: "Mismatch golden", level: "Practice", prompt: "mismatchCount=0.",
      check: () => REAL_GOLDENS.mismatchCount === 0 }},
    {{ id: "select", title: "Select device", level: "Challenge", prompt: "Select mn1.",
      setup: (_c, api) => {{ api.showStage("lvs_compare"); api.select("mn1"); }},
      check: (_c, api) => api.getSelected().includes("mn1") }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.engine().ok === true || realNetgenEngine(GOLDEN_RECIPE_IDS).ok }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "REAL_NETGEN_ALGOS" not in text:
        ins = 'import { drawNetgen, STARTER as NETGEN_STARTER } from "../../assets/netgen-core.js";\n'
        if ins in text:
            text = text.replace(
                ins,
                ins
                + 'import { REAL_NETGEN_ALGOS } from "./real-netgen-algos.js";\n'
                + 'import { drawRealNetgen, STAGES as REAL_NETGEN_STAGES } from "../../assets/real-netgen-core.js";\n',
            )
        text = text.replace("  ...NETGEN_ALGOS,\n};", "  ...NETGEN_ALGOS,\n  ...REAL_NETGEN_ALGOS,\n};")
    if 'pack.kind === "real_netgen"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "netgen") {',
            '''  } else if (pack.kind === "real_netgen") {
    drawRealNetgen(canvas, {
      stage: s.stage || REAL_NETGEN_STAGES.empty,
      highlight: s.highlight || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "netgen") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")
    print("Patched walkthrough.js (real_netgen)")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_B_LABS if f'"{lab}"' not in cap]
    if not missing:
        print("LAB_TO_ALGO already has Part B labs")
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    for needle in ('"netgen-engine": ("netgen-engine", 5),', '"lvs-report-map": ("lvs-report-map", 5),'):
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO Part B", missing)
            return


def main() -> None:
    stage_map = {"netgen-cli": "empty", "spice-vocab": "spice_vocab", "real-read-spice": "read_spice",
                 "real-lvs-compare": "lvs_compare", "real-lvs-report": "lvs_report", "netgen-evidence": "lvs_report"}
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
cd courses/learn_netgen/common
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

## Slide 1 — Why real Netgen

{outcome}

## Slide 2 — The idea

GOLDEN: {idea}

{chr(10).join(walk)}

## Slide {n + 3} — Browser lab

Open **{lab}**.

## Slide {n + 4} — Implement track

Run real_solvers.py — REAL_NETGEN_OK.

## Slide {n + 5} — Pitfalls

Editing goldens without re-running scripts.

## Slide {n + 6} — Try these

From the common folder, run the real Netgen self-test.

```bash
cd courses/learn_netgen/common
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
<p class="lead">Part B — real Netgen CLI evidence.</p></section><div id="lab-root"></div></main>
<script type="module" src="{lab}.js"></script></body></html>""")
        print("ok", mid)

    lines = ['/** Part B — real Netgen walkthroughs */', 'import { STAGES } from "../../assets/real-netgen-core.js";', "", "export const REAL_NETGEN_ALGOS = {"]
    for mid, lab, title, stage, _o, _i in PART_B:
        lines += [f'  "{lab}": {{', '    kind: "real_netgen",', f'    title: "{title}",', f'    module: "{mid}",', "    steps: ["]
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            lines += ["      {", f'        id: {json.dumps(sid)},', f'        title: {json.dumps(st)},', f'        caption: {json.dumps(cap)},',
                      f'        bullets: {json.dumps(bullets)},', f'        metrics: {json.dumps(metrics)},',
                      f'        stage: STAGES[{json.dumps(stage_map[lab])}],', f'        highlight: {json.dumps(bullets)},', "      },"]
        lines += ["    ],", "  },"]
    lines.append("};")
    write(WALK / "real-netgen-algos.js", "\n".join(lines))

    mod = ROOT / "docs" / "MODULES.md"
    text = mod.read_text(encoding="utf-8")
    for mid, lab, title, *_ in PART_B:
        text = re.sub(rf"\| `{mid}` \| `lab` \| \[{re.escape(title)}\]\(\.\./{mid}/README\.md\) \| `{lab}` \| [^|]+ \|",
                      f"| `{mid}` | `lab` | [{title}](../{mid}/README.md) | `{lab}` | **ref** |", text)
    write(mod, text)

    wlines = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for mid, lab, *_ in [("module01-01-read-netlists-map", "read-netlists-map"), ("module03-03-netgen-engine", "netgen-engine")] + [(m, l) for m, l, *_ in PART_B]:
        wlines.append(f"| `{lab}` | `{mid}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(wlines))
    patch_walkthrough()
    patch_lab_to_algo()
    print("PART_B_OK", len(PART_B))


if __name__ == "__main__":
    main()
