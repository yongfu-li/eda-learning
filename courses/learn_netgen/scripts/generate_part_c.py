#!/usr/bin/env python3
"""Generate learn_netgen Part C modules, tools, walkthroughs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLATFORM = ROOT.parents[1] / "platform"
WALK = PLATFORM / "tools" / "algorithm-walkthrough"
CAPTURE = ROOT.parents[1] / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"

PART_C = [
    ("module09-01-hash-devices-algo", "hash-devices-algo", "Hash devices algorithm", "hash_devices", "showHashDevices",
     "Hash devices by nmos/pmos class for compare.", "hash_device_count=2."),
    ("module09-03-match-nets-algo", "match-nets-algo", "Match nets algorithm", "match_nets", "showMatchNets",
     "Match net names between schematic and layout.", "matched_nets=4."),
    ("module10-01-permute-pins-algo", "permute-pins-algo", "Permute pins algorithm", "permute_pins", "showPermutePins",
     "Permute source/drain within MOSFET class.", "permute_ok=True."),
    ("module10-03-netgen-algo-engine", "netgen-algo-engine", "Netgen algo engine", "engine", "showEngine",
     "Run Part C engine and bind to Part B goldens.", "engine ok; bind matched 2/4 mismatch 0."),
]

PART_C_LABS = [lab for _mid, lab, *_ in PART_C]

NAV = {
    "module09-01-hash-devices-algo": ("../module08-03-netgen-evidence/README.md", "Evidence", "../module09-03-match-nets-algo/README.md", "Match nets"),
    "module09-03-match-nets-algo": ("../module09-01-hash-devices-algo/README.md", "Hash", "../module10-01-permute-pins-algo/README.md", "Permute"),
    "module10-01-permute-pins-algo": ("../module09-03-match-nets-algo/README.md", "Match", "../module10-03-netgen-algo-engine/README.md", "Engine"),
    "module10-03-netgen-algo-engine": ("../module10-01-permute-pins-algo/README.md", "Permute", "../module14-01-netcomp-model/README.md", "Netcomp"),
}

STEPS = {
    "hash-devices-algo": [
        ("class", "Device classes", "Group mn1/mp1 and X0/X1 by type.", ["nmos", "pmos"], ["2"]),
        ("hash", "Hash buckets", "Two class buckets for compare.", ["hash"], ["2"]),
        ("sch", "Schematic side", "mn1 nmos, mp1 pmos.", ["mn1", "mp1"], ["sch"]),
        ("lay", "Layout side", "X0 nmos, X1 pmos.", ["X0", "X1"], ["lay"]),
        ("golden", "Golden", "GOLDEN: hash_device_count=2.", ["GOLDEN"], ["2"]),
    ],
    "match-nets-algo": [
        ("sch", "Schematic nets", "Four nets from schematic.", ["A", "Y"], ["4"]),
        ("lay", "Layout nets", "Four nets from layout.", ["VDD", "VSS"], ["4"]),
        ("inter", "Intersection", "All four names match.", ["match"], ["4"]),
        ("algo", "Match algo", "Set intersection on net names.", ["algo"], ["match"]),
        ("golden", "Golden", "GOLDEN: matched_nets=4.", ["GOLDEN"], ["4"]),
    ],
    "permute-pins-algo": [
        ("ds", "D/S permute", "Drain and source may swap.", ["D", "S"], ["permute"]),
        ("gate", "G fixed", "Gate does not permute.", ["G"], ["fixed"]),
        ("nmos", "nmos rule", "nmos permute includes D,S.", ["nmos"], ["rule"]),
        ("pmos", "pmos rule", "pmos permute includes D,S.", ["pmos"], ["rule"]),
        ("golden", "Golden", "GOLDEN: permute_ok=True.", ["GOLDEN"], ["ok"]),
    ],
    "netgen-algo-engine": [
        ("hash", "Hash ok", "Hash devices matches golden.", ["hash"], ["ok"]),
        ("match", "Match ok", "Match nets matches 4.", ["match"], ["ok"]),
        ("perm", "Permute ok", "Permute pins passes.", ["permute"], ["ok"]),
        ("bind", "Bind Part B", "Teaching matched 2/4 ↔ Part B logs.", ["bind"], ["2/4"]),
        ("golden", "Engine", "GOLDEN: netgen_algo_engine ok=True.", ["GOLDEN"], ["ok"]),
    ],
}

QUIZZES = {
    "module09-01-hash-devices-algo": [("Hash device count?", ["2", "4", "0", "6"], 0), ("Classes?", ["nmos, pmos", "metal1", "STA", "GDS"], 0), ("Hash used for?", ["device compare groups", "Place", "STA", "GDS"], 0)],
    "module09-03-match-nets-algo": [("Matched nets?", ["4", "2", "0", "6"], 0), ("Match method?", ["set intersection", "STA", "LEF", "ABC"], 0), ("Net names?", ["A,Y,VDD,VSS", "mn1 only", "GDS", "Liberty"], 0)],
    "module10-01-permute-pins-algo": [("Pins that permute?", ["D and S", "G", "A", "VDD"], 0), ("permute_ok?", ["True", "False", "None", "N/A"], 0), ("Applies to?", ["MOSFET S/D", "All pins", "Ports", "GDS"], 0)],
    "module10-03-netgen-algo-engine": [("Engine ok means?", ["all Part C + bind", "binary only", "DRC", "Place"], 0), ("Bind compares to?", ["Part B evidence", "Liberty", "ABC", "Verilator"], 0), ("Mismatch golden?", ["0", "2", "4", "1"], 0)],
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def tool_js(lab: str, title: str, mode: str, api_fn: str) -> str:
    return f"""import {{ ALGO_GOLDENS, PARTC_REAL, netgenAlgoEngine, partcBind }} from "../../assets/algo-netgen-core.js";
import {{ createInteractiveAlgoNetgenLab }} from "../../assets/interactive-algo-netgen-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoNetgenLab(root, {{
  starterHtml: `<p><strong>Your job:</strong> {title}. Run stages / bind, then Check.</p>`,
  defaultMode: "{mode}",
  challenges: [
    {{ id: "run", title: "Run stage", level: "Intro", prompt: "Open {mode}.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getMode() === "{mode}" }},
    {{ id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.{api_fn}(), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "nets", title: "Nets golden", level: "Practice", prompt: "matchedNets=4.",
      check: () => ALGO_GOLDENS.matchedNets === 4 }},
    {{ id: "bind", title: "Bind mismatch", level: "Practice", prompt: "Bind mismatch ok.",
      setup: (_c, api) => api.showBind("mismatch"), check: (_c, api) => api.getLast()?.ok === true }},
    {{ id: "real", title: "Real matched", level: "Practice", prompt: "PARTC_REAL.matchedDevices=2.",
      check: () => PARTC_REAL.matchedDevices === 2 }},
    {{ id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true || netgenAlgoEngine().ok }},
  ],
}});
"""


def patch_walkthrough() -> None:
    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "ALGO_NETGEN_ALGOS" not in text:
        ins = 'import { drawRealNetgen, STAGES as REAL_NETGEN_STAGES } from "../../assets/real-netgen-core.js";\n'
        if ins in text:
            text = text.replace(ins, ins + 'import { ALGO_NETGEN_ALGOS } from "./algo-netgen-algos.js";\nimport { drawAlgoNetgen } from "../../assets/algo-netgen-core.js";\n')
        text = text.replace("  ...REAL_NETGEN_ALGOS,\n};", "  ...REAL_NETGEN_ALGOS,\n  ...ALGO_NETGEN_ALGOS,\n};")
    if 'pack.kind === "algo_netgen"' not in text:
        text = text.replace(
            '  } else if (pack.kind === "real_netgen") {',
            '''  } else if (pack.kind === "algo_netgen") {
    drawAlgoNetgen(canvas, {
      highlight: s.highlight || [],
      selected: s.selected || [],
      stageLabel: s.stageLabel || null,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "real_netgen") {''',
        )
    wt.write_text(text, encoding="utf-8", newline="\n")


def patch_lab_to_algo() -> None:
    cap = CAPTURE.read_text(encoding="utf-8")
    missing = [lab for lab in PART_C_LABS if f'"{lab}"' not in cap]
    if not missing:
        return
    block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in missing)
    for needle in ('"netgen-evidence": ("netgen-evidence", 5),', '"real-lvs-report": ("real-lvs-report", 5),'):
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO Part C", missing)
            return


def main() -> None:
    for mid, lab, title, mode, api_fn, outcome, idea in PART_C:
        prev_h, prev_l, next_h, next_l = NAV[mid]
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

Changing tiny_algo_netgen without updating Part B goldens.

## Slide {n+6} — Try these

From the common folder, run the Part C self-tests.

```bash
cd courses/learn_netgen/common
python3 algo_solvers.py
python3 partc_bind.py
```

## Slide {n+7} — Pseudocode

Here is the check in plain steps.

```text
{idea}
ok if goldens match and bind
```

## Slide {n+8} — Next

Continue Part C, then internals.
""")
        write(ROOT / mid / "README.md", f"""# Module {mid[7:]}: {title}

**Module id:** `{mid}`  
**Kind:** `lab` · Primary lab: `{lab}` · **ref**

[← {prev_l}]({prev_h}) · [Course README](../README.md) · [{next_l} →]({next_h})

## Outcomes

After this module you can: **{outcome}**

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
        write(ROOT / mid / "EXAMPLES.md", f"```bash\ncd courses/learn_netgen/common\npython3 algo_solvers.py\npython3 partc_bind.py\n```\n")
        write(ROOT / mid / "CHECKLIST.md", f"- [ ] algo_solvers ok\n- [ ] partc_bind ok\n")
        items = [{"q": q, "choices": c, "answer": a, "id": f"q{i}"} for i, (q, c, a) in enumerate(QUIZZES[mid])]
        write(ROOT / mid / "quiz.json", json.dumps({"moduleId": mid, "items": items}, indent=2) + "\n")
        write(ROOT / mid / "assets" / "STEPS.md", f"# {title}\n")
        tdir = PLATFORM / "tools" / lab
        write(tdir / f"{lab}.js", tool_js(lab, title, mode, api_fn))
        write(tdir / "index.html", f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>{title}</title><link rel="stylesheet" href="../../assets/site.css"><link rel="stylesheet" href="../../assets/clustering-lab.css"></head><body data-asset-base="../../assets/"><main class="tool-page"><section class="hero"><h1>{title}</h1><p class="lead">Part C — Netgen algorithms + bind.</p></section><div id="lab-root"></div></main><script type="module" src="{lab}.js"></script></body></html>')
        print("ok", mid)

    hl_map = {"hash-devices-algo": ["mn1", "mp1"], "match-nets-algo": ["A", "Y", "VDD", "VSS"], "permute-pins-algo": ["D", "S"], "netgen-algo-engine": ["bind"]}
    lines = ['/** Part C Netgen algo walkthroughs */', 'import { drawAlgoNetgen } from "../../assets/algo-netgen-core.js";', "", "export const ALGO_NETGEN_ALGOS = {"]
    for mid, lab, title, mode, *_ in PART_C:
        lines += [f'  "{lab}": {{', '    kind: "algo_netgen",', f'    title: "{title}",', f'    module: "{mid}",', "    steps: ["]
        for sid, st, cap, bullets, metrics in STEPS[lab]:
            lines += ["      {", f'        id: {json.dumps(sid)},', f'        title: {json.dumps(st)},', f'        caption: {json.dumps(cap)},',
                      f'        bullets: {json.dumps(bullets)},', f'        metrics: {json.dumps(metrics)},',
                      f'        highlight: {json.dumps(hl_map.get(lab, bullets))},', "      },"]
        lines += ["    ],", "  },"]
    lines.append("};")
    write(WALK / "algo-netgen-algos.js", "\n".join(lines))

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
