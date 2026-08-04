#!/usr/bin/env python3
"""Generate learn_netgen Part A modules, tools, and walkthrough algos."""
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
    ("module01-01-read-netlists-map", "read-netlists-map", "Read netlists map", "read", "showRead",
     "Read schematic and layout SPICE-like netlists.", "sch/lay devices=2."),
    ("module01-03-device-classes-map", "device-classes-map", "Device classes map", "classes", "showClasses",
     "Map nmos/pmos device classes for compare groups.", "classes=2 (nmos, pmos)."),
    ("module02-01-flatten-permute-map", "flatten-permute-map", "Flatten permute map", "permute", "showPermute",
     "Source/drain pins may permute within a MOSFET class.", "permute D/S on nmos/pmos."),
    ("module02-03-compare-nets-map", "compare-nets-map", "Compare nets map", "compare", "showCompare",
     "Match net names between schematic and layout.", "matched_nets=4."),
    ("module03-01-lvs-report-map", "lvs-report-map", "LVS report map", "report", "showReport",
     "LVS report: matched devices and mismatches.", "matched_devices=2; mismatch=0."),
    ("module03-03-netgen-engine", "netgen-engine", "Netgen engine (map)", "engine", "engine",
     "Run the full Part A engine; ok when every golden matches.", "netgen_engine ok=True."),
]

PART_A_LABS = [lab for _mid, lab, *_ in PART_A]

NAV = {
    "module01-01-read-netlists-map": ("../module00-00-intro/README.md", "Intro", "../module01-03-device-classes-map/README.md", "Classes"),
    "module01-03-device-classes-map": ("../module01-01-read-netlists-map/README.md", "Read", "../module02-01-flatten-permute-map/README.md", "Permute"),
    "module02-01-flatten-permute-map": ("../module01-03-device-classes-map/README.md", "Classes", "../module02-03-compare-nets-map/README.md", "Compare"),
    "module02-03-compare-nets-map": ("../module02-01-flatten-permute-map/README.md", "Permute", "../module03-01-lvs-report-map/README.md", "Report"),
    "module03-01-lvs-report-map": ("../module02-03-compare-nets-map/README.md", "Compare", "../module03-03-netgen-engine/README.md", "Engine"),
    "module03-03-netgen-engine": ("../module03-01-lvs-report-map/README.md", "Report", "../module06-01-netgen-cli/README.md", "CLI"),
}

STEPS = {
    "read-netlists-map": [
        ("sch", "Schematic", "tiny_inv schematic has mn1 (nmos) and mp1 (pmos).", ["mn1", "mp1"], ["2"]),
        ("lay", "Layout", "Layout side has X0 (nmos) and X1 (pmos).", ["X0", "X1"], ["2"]),
        ("ports", "Four ports", "Ports A, Y, VDD, VSS on both sides.", ["A", "Y"], ["4"]),
        ("read", "read command", "Netgen read loads SPICE-like netlists.", ["read"], ["map"]),
        ("golden", "Golden", "GOLDEN: sch_devices=2 lay_devices=2.", ["GOLDEN"], ["2/2"]),
    ],
    "device-classes-map": [
        ("nmos", "nmos class", "nmos devices grouped for compare.", ["nmos"], ["class"]),
        ("pmos", "pmos class", "pmos devices grouped separately.", ["pmos"], ["class"]),
        ("map", "Class map", "classes nmos→nmos, pmos→pmos.", ["classes"], ["map"]),
        ("dev", "Two classes", "Teaching golden class_count=2.", ["mn1", "mp1"], ["2"]),
        ("golden", "Golden", "GOLDEN: class_count=2.", ["GOLDEN"], ["2"]),
    ],
    "flatten-permute-map": [
        ("permute", "Permute rule", "Source/drain may swap within MOSFET.", ["permute"], ["D/S"]),
        ("nmos", "nmos D/S", "nmos permute list includes D and S.", ["D", "S"], ["nmos"]),
        ("pmos", "pmos D/S", "pmos permute list includes D and S.", ["pmos"], ["D/S"]),
        ("gate", "Gate fixed", "Gate pin G does not permute.", ["G"], ["fixed"]),
        ("golden", "Golden", "GOLDEN: permute_ok=True.", ["GOLDEN"], ["ok"]),
    ],
    "compare-nets-map": [
        ("nets", "Four nets", "A, Y, VDD, VSS appear on both sides.", ["A", "Y", "VDD", "VSS"], ["4"]),
        ("match", "All match", "Set intersection gives four matched nets.", ["match"], ["4"]),
        ("sch", "Schematic nets", "Schematic net names from devices + ports.", ["sch"], ["4"]),
        ("lay", "Layout nets", "Layout net names from extract SPICE.", ["lay"], ["4"]),
        ("golden", "Golden", "GOLDEN: matched_nets=4.", ["GOLDEN"], ["4"]),
    ],
    "lvs-report-map": [
        ("dev", "Device match", "Two devices matched by type count.", ["mn1", "X0"], ["2"]),
        ("type", "nmos/pmos", "One nmos + one pmos each side.", ["nmos", "pmos"], ["2"]),
        ("mism", "Zero mismatch", "mismatch_count=0 on tiny_inv.", ["mismatch"], ["0"]),
        ("report", "LVS report", "Netgen report summarizes compare.", ["report"], ["LVS"]),
        ("golden", "Golden", "GOLDEN: matched_devices=2 mismatch=0.", ["GOLDEN"], ["2/0"]),
    ],
    "netgen-engine": [
        ("read", "Read ok", "Read netlists stage passes.", ["read"], ["ok"]),
        ("class", "Classes ok", "Device classes stage passes.", ["classes"], ["ok"]),
        ("perm", "Permute ok", "Flatten permute stage passes.", ["permute"], ["ok"]),
        ("cmp", "Compare ok", "Compare nets stage passes.", ["compare"], ["ok"]),
        ("golden", "Engine golden", "GOLDEN: netgen_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module01-01-read-netlists-map": [
        ("Schematic device count?", ["2", "4", "1", "0"], 0),
        ("Layout device ids?", ["X0,X1", "mn1,mp1", "A,Y", "VDD,VSS"], 0),
        ("Cell name?", ["tiny_inv", "top", "clk", "thin"], 0),
    ],
    "module01-03-device-classes-map": [
        ("Class count golden?", ["2", "4", "1", "0"], 0),
        ("nmos class maps to?", ["nmos", "pmos", "poly", "metal1"], 0),
        ("Classes used for?", ["device compare groups", "STA slack", "GDS only", "Place only"], 0),
    ],
    "module02-01-flatten-permute-map": [
        ("Pins that permute?", ["D and S", "G only", "A and Y", "VDD only"], 0),
        ("permute_ok golden?", ["True", "False", "None", "N/A"], 0),
        ("Permute applies to?", ["MOSFET source/drain", "All pins", "Ports only", "GDS layers"], 0),
    ],
    "module02-03-compare-nets-map": [
        ("Matched net count?", ["4", "2", "6", "0"], 0),
        ("Net names include?", ["A,Y,VDD,VSS", "mn1 only", "GDS only", "LEF only"], 0),
        ("Compare matches?", ["schematic vs layout net names", "STA slack", "Verilog ports", "Liberty arcs"], 0),
    ],
    "module03-01-lvs-report-map": [
        ("Matched devices golden?", ["2", "4", "0", "1"], 0),
        ("Mismatch count?", ["0", "2", "4", "1"], 0),
        ("Report summarizes?", ["LVS compare results", "Place only", "STA only", "GDS stream"], 0),
    ],
    "module03-03-netgen-engine": [
        ("Engine ok means?", ["every Part A golden matches", "OpenROAD placed", "DRC passed", "STA slack=8"], 0),
        ("matched_nets golden?", ["4", "2", "0", "6"], 0),
        ("engine_ok flag?", ["True", "False", "None", "N/A"], 0),
    ],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str, api_fn: str) -> str:
    return f"""import {{ GOLDENS, netgenEngine }} from "../../assets/netgen-core.js";
import {{ createInteractiveNetgenLab }} from "../../assets/interactive-netgen-lab.js";
const root = document.getElementById("lab-root");

createInteractiveNetgenLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Use stage buttons, then Check.</p>`,
  defaultMode: "{mode}",
  challenges: [
    {{ id: "run", title: "Run stage", level: "Intro", prompt: "Open the {mode} stage.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "dev", title: "Devices golden", level: "Practice", prompt: "matchedDevices=2.",
      check: () => GOLDENS.matchedDevices === 2 }},
    {{ id: "nets", title: "Nets golden", level: "Practice", prompt: "matchedNets=4.",
      check: () => GOLDENS.matchedNets === 4 }},
    {{ id: "select", title: "Select device", level: "Practice", prompt: "Select a highlighted device.",
      setup: (_c, api) => {{ api.{api_fn}(); const h = api.getHighlight(); if (h[0]) api.select(h[0]); }},
      check: (_c, api) => api.getSelected().length >= 1 }},
    {{ id: "mism", title: "Mismatch golden", level: "Challenge", prompt: "mismatchCount=0.",
      check: () => GOLDENS.mismatchCount === 0 }},
    {{ id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is {mode}.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast()?.ok === true || netgenEngine().ok }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "NETGEN_ALGOS" not in text:
        if 'import { drawMagicInternals } from "../../assets/magic-internals-core.js";' in text:
            text = text.replace(
                'import { drawMagicInternals } from "../../assets/magic-internals-core.js";\n',
                'import { drawMagicInternals } from "../../assets/magic-internals-core.js";\n'
                'import { NETGEN_ALGOS } from "./netgen-algos.js";\n'
                'import { drawNetgen, STARTER as NETGEN_STARTER } from "../../assets/netgen-core.js";\n',
            )
        elif 'import { drawOpenstaInternals } from "../../assets/opensta-internals-core.js";' in text:
            text = text.replace(
                'import { drawOpenstaInternals } from "../../assets/opensta-internals-core.js";\n',
                'import { drawOpenstaInternals } from "../../assets/opensta-internals-core.js";\n'
                'import { NETGEN_ALGOS } from "./netgen-algos.js";\n'
                'import { drawNetgen, STARTER as NETGEN_STARTER } from "../../assets/netgen-core.js";\n',
            )
        else:
            text = text.replace(
                'const ALGOS = {',
                'import { NETGEN_ALGOS } from "./netgen-algos.js";\n'
                'import { drawNetgen, STARTER as NETGEN_STARTER } from "../../assets/netgen-core.js";\n\n'
                'const ALGOS = {',
            )
        text = text.replace(
            "  ...MAGIC_INTERNALS_ALGOS,\n};",
            "  ...MAGIC_INTERNALS_ALGOS,\n  ...NETGEN_ALGOS,\n};",
        )
        if "NETGEN_ALGOS" in text and "...NETGEN_ALGOS" not in text:
            for needle in ("  ...MAGIC_ALGOS,\n};", "  ...OPENSTA_INTERNALS_ALGOS,\n};", "  ...ALGO_MAGIC_ALGOS,\n};"):
                if needle in text:
                    text = text.replace(needle, needle.replace("};", "  ...NETGEN_ALGOS,\n};"))
                    break
    if 'pack.kind === "netgen"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "magic_internals") {',
            '''  } else if (pack.kind === "netgen") {
    drawNetgen(canvas, {
      highlight: s.highlight || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "magic_internals") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")
    print("Patched walkthrough.js (netgen)")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_A_LABS if f'"{lab}"' not in cap]
    if not missing:
        print("LAB_TO_ALGO already has Part A labs")
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    for needle in ('"contribute-magic": ("contribute-magic", 5),', '"netgen-engine": ("netgen-engine", 5),'):
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO Part A", missing)
            return
    print("WARN: could not patch LAB_TO_ALGO")


def patch_tools_index() -> None:
    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="netgen"' in it:
        print("tools/index.html already has #netgen")
        return
    section = """
    <section class="tool-section" id="netgen">
      <h2>Netgen</h2>
      <ul class="tool-list">
        <li><a href="read-netlists-map/">Read netlists map</a></li>
        <li><a href="device-classes-map/">Device classes map</a></li>
        <li><a href="flatten-permute-map/">Flatten permute map</a></li>
        <li><a href="compare-nets-map/">Compare nets map</a></li>
        <li><a href="lvs-report-map/">LVS report map</a></li>
        <li><a href="netgen-engine/">Netgen engine</a></li>
        <li><a href="netgen-cli/">Netgen CLI</a></li>
        <li><a href="spice-vocab/">SPICE vocabulary</a></li>
        <li><a href="real-read-spice/">Real read SPICE</a></li>
        <li><a href="real-lvs-compare/">Real LVS compare</a></li>
        <li><a href="real-lvs-report/">Real LVS report</a></li>
        <li><a href="netgen-evidence/">Real Netgen evidence</a></li>
        <li><a href="hash-devices-algo/">Hash devices algorithm</a></li>
        <li><a href="match-nets-algo/">Match nets algorithm</a></li>
        <li><a href="permute-pins-algo/">Permute pins algorithm</a></li>
        <li><a href="netgen-algo-engine/">Netgen algo engine</a></li>
        <li><a href="netcomp-model/">Obj / Netlist / Element model</a></li>
        <li><a href="read-compare-c/">Read compare C</a></li>
        <li><a href="contribute-netgen/">Contribute to Netgen</a></li>
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
    print("Patched tools/index.html #netgen")


def patch_course_meta() -> None:
    pub = PUBLISH.read_text(encoding="utf-8")
    if '"learn_netgen"' in pub.split("COURSE_META = {", 1)[1].split("}\n\nCOURSE_INDEX", 1)[0]:
        print("COURSE_META learn_netgen already present")
        return
    block = '''    "learn_netgen": {
        "title": "Netgen (LVS compare)",
        "focus": "LVS map → real Netgen evidence → algorithms → internals",
        "prereq": "learn_lvs or learn_magic",
        "status": "ready",
        "repo": "learn_netgen",
        "modules_md": ROOT / "courses" / "learn_netgen" / "docs" / "MODULES.md",
        "course_root": ROOT / "courses" / "learn_netgen",
        "lead": (
            "Part A LVS compare map on tiny_inv "
            "(sch/lay devices=2; matched_nets=4; matched_devices=2; mismatch=0; classes=2) "
            "+ Part B real Netgen CLI evidence "
            "+ Part C algorithms bound to LVS goldens "
            "+ Part D internals "
            "(Obj/Netlist/Element model, read compare C, contribute checklist). "
            "Parts A–D ready. Clips and decks load from "
            "<code>courses/learn_netgen</code> "
            "(<code>moduleSS-AA-slug/video.mp4</code>). Open the matching browser tool, then mark the lab done."
        ),
        "tools_href": "../../tools/index.html#netgen",
        "tools_label": "Netgen tools",
        "first_lab": "read-netlists-map",
        "first_n": "02",
    },
'''
    needle = (
        '        "first_lab": "paint-layers",\n'
        '        "first_n": "02",\n'
        "    },\n"
        "}\n\n"
        "COURSE_INDEX"
    )
    if needle not in pub:
        print("WARN: could not patch COURSE_META — learn_magic end needle missing")
        return
    pub = pub.replace(
        needle,
        '        "first_lab": "paint-layers",\n'
        '        "first_n": "02",\n'
        "    },\n"
        + block
        + "}\n\n"
        "COURSE_INDEX",
    )
    PUBLISH.write_text(pub, encoding="utf-8", newline="\n")
    print("Patched COURSE_META learn_netgen")


def main() -> None:
    for mid, lab, title, mode, api_fn, outcome, idea in PART_A:
        prev_h, prev_l, next_h, next_l = NAV[mid]
        write(ROOT / mid / "README.md", f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · **ref**

[← {prev_l}]({prev_h}) · [Course README](../README.md) · [{next_l} →]({next_h})

## Outcomes

After this module you can: **{outcome}**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); study `common/solvers.py` + `common/tiny_netgen.json`.
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
cd courses/learn_netgen/common
python3 solvers.py
```

## Pseudocode

```text
{idea}
ok if goldens match GOLDENS / tiny_netgen.json
```
""")
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

From common/, run solvers.py and confirm NETGEN_PARTA_OK.

## Slide {n + 5} — Pitfalls

Confusing schematic SPICE with layout extract. Forgetting permute on source/drain.

## Slide {n + 6} — Try these

From the common folder, run the Netgen map self-test.

```bash
cd courses/learn_netgen/common
python3 solvers.py
```

## Slide {n + 7} — Pseudocode

Here is the check in plain steps.

```text
{idea}
ok if goldens match
```

## Slide {n + 8} — Next

Continue the Netgen Part A map, then the real CLI track.
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
<p class="lead">Part A — Netgen LVS compare map.</p></section><div id="lab-root"></div></main>
<script type="module" src="{lab}.js"></script></body></html>
""")
        print("ok", mid)

    lines = ['/** Part A — Netgen map walkthroughs */', 'import { drawNetgen } from "../../assets/netgen-core.js";', "", "export { drawNetgen };", "", "export const NETGEN_ALGOS = {"]
    for mid, lab, title, mode, _api, _o, _idea in PART_A:
        lines.append(f'  "{lab}": {{')
        lines.append('    kind: "netgen",')
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
    write(WALK / "netgen-algos.js", "\n".join(lines))

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
