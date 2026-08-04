#!/usr/bin/env python3
"""Scaffold learn_pex with module-slides stubs. Lab status **ref**."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_pex"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to PEX", "Welcome", None,
     "Explain parasitic R/C extraction from layout geometry after LVS literacy.",
     None,
     "After LVS you still need PEX — geometry load, R/C extract, RC network, reduce, back-annotate, SPEF-lite.",
     "Toy tiny_pex: four segments on net n1 → R_total=3.06, C_total=1.376, SPEF-lite emit."),
    ("module01-01-geometry-load", "lab", "Geometry load", "Geometry load", "geometry-load",
     "Load layout geometry; count segments, layers, and nets.",
     "load_geometry",
     "PEX starts from annotated layout segments — layers, nets, and segment ids.",
     "GOLDEN: 4 segments, 3 layers.",
     [("Segments", "01-segments", "Four wire/via segments on net n1: s1, s2, v1, s3."),
      ("Layers", "02-layers", "Three layers: M1, VIA, M2."),
      ("Nets", "03-nets", "Single net n1 with ports in and out."),
      ("Ids", "04-ids", "Segment ids s1/s2/v1/s3 in path order."),
      ("Golden", "05-golden", "GOLDEN: segment_count=4, layer_count=3.")],
     "Open **geometry-load**. Inspect tiny_pex; confirm 4 segments, 3 layers.",
     "Call load_geometry(); assert segment_count==4 and layer_count==3.",
     "Counting ports as segments. Ignoring VIA layer in layer_count.",
     "Next: resistance extract.",
     "geo ← load_geometry(tiny_pex); segment_count ← |geo.segments|",
     [{"q": "segment_count golden?", "choices": ["4", "3", "5", "8"], "answer": 0},
      {"q": "layer_count golden?", "choices": ["3", "4", "2", "1"], "answer": 0},
      {"q": "first segment id?", "choices": ["s1", "s2", "v1", "n1"], "answer": 0}]),
    ("module01-03-resistance-extract", "lab", "Resistance extract", "Resistance", "resistance-extract",
     "Extract segment resistors using rho*L/W; sum R_total.",
     "extract_resistance",
     "Resistance extract computes R = rho*L/W for metals; VIA uses lump rho.",
     "GOLDEN: R_total=3.06; s1=0.5.",
     [("Formula", "01-formula", "Metal R = rho*L/W; VIA uses lump rho."),
      ("s1", "02-s1", "s1 M1 segment: R=0.5 ohm."),
      ("s2", "03-s2", "s2 M1 segment: R=0.4 ohm."),
      ("v1", "04-v1", "v1 VIA lump: R=2.0 ohm."),
      ("Golden", "05-golden", "GOLDEN: R_total=3.06; s1=0.5.")],
     "Open **resistance-extract**. Select s1; confirm R_total=3.06.",
     "Call extract_resistance(); assert r_total==3.06 and resistors['s1']==0.5.",
     "Using max edge as width. Forgetting VIA lump resistance.",
     "Next: capacitance extract.",
     "for each segment: R ← rho*L/W or via_lump; r_total ← sum(R)",
     [{"q": "R_total golden?", "choices": ["3.06", "0.5", "1.376", "2.0"], "answer": 0},
      {"q": "R_s1 golden?", "choices": ["0.5", "0.4", "2.0", "0.16"], "answer": 0},
      {"q": "resistor count?", "choices": ["4", "3", "2", "1"], "answer": 0}]),
    ("module01-05-capacitance-extract", "lab", "Capacitance extract", "Capacitance", "capacitance-extract",
     "Extract ground capacitors from metal area and perimeter; sum C_total.",
     "extract_capacitance",
     "Capacitance extract uses c_area*area + c_perim*perimeter on metals; skip VIA.",
     "GOLDEN: C_total=1.376; 3 caps.",
     [("Formula", "01-formula", "C = c_area*area + c_perim*perimeter on M1/M2."),
      ("s1", "02-s1", "Ground C on s1 M1 segment."),
      ("s2", "03-s2", "Ground C on s2 M1 segment."),
      ("s3", "04-s3", "Ground C on s3 M2 segment."),
      ("Golden", "05-golden", "GOLDEN: C_total=1.376; 3 caps.")],
     "Open **capacitance-extract**. Select s1; confirm C_total=1.376 and 3 caps.",
     "Call extract_capacitance(); assert c_total==1.376 and count==3.",
     "Adding VIA capacitance. Using length instead of area for C.",
     "Next: RC network build.",
     "for each metal segment: C ← c_area*A + c_perim*P; c_total ← sum(C)",
     [{"q": "C_total golden?", "choices": ["1.376", "3.06", "0.5", "2.0"], "answer": 0},
      {"q": "capacitor count?", "choices": ["3", "4", "2", "1"], "answer": 0},
      {"q": "VIA has ground C?", "choices": ["no", "yes", "always", "optional"], "answer": 0}]),
    ("module02-01-rc-network", "lab", "RC network build", "RC network", "rc-network",
     "Build series RC network chain with R edges and C-to-gnd branches.",
     "build_rc_network",
     "RC network chains segment resistors in series; attach ground C at metal nodes.",
     "GOLDEN: series chain; nodes include in/out.",
     [("Order", "01-order", "Series path: s1 → s2 → v1 → s3."),
      ("Resistors", "02-resistors", "Four R edges in series from in to out."),
      ("Nodes", "03-nodes", "Nodes include in and out ports."),
      ("Caps", "04-caps", "Three C branches to gnd on metal nodes."),
      ("Golden", "05-golden", "GOLDEN: series chain; nodes include in/out.")],
     "Open **rc-network**. Select in and out; confirm series chain.",
     "Call build_rc_network(); assert nodes include 'in' and 'out' and r_count==4.",
     "Parallel instead of series R. Attaching C on VIA node.",
     "Next: network reduction.",
     "chain R along s1,s2,v1,s3; attach C at metal nodes; nodes ← in…out",
     [{"q": "nodes include in?", "choices": ["yes", "no", "gnd only", "n1 only"], "answer": 0},
      {"q": "R edge count?", "choices": ["4", "3", "2", "1"], "answer": 0},
      {"q": "network shape?", "choices": ["series chain", "parallel", "star", "mesh"], "answer": 0}]),
    ("module02-03-network-reduce", "lab", "Network reduction", "Reduce", "network-reduce",
     "Reduce series R and sum ground C to port-equivalent R_eq and C_eq.",
     "reduce_network",
     "Network reduction collapses the chain to in–out R_eq and lumped C_eq.",
     "GOLDEN: after_nodes=2; R_eq=3.06 C_eq=1.376.",
     [("Before", "01-before", "Full chain has 5 nodes before reduce."),
      ("Series R", "02-series", "Sum series R → R_eq=3.06."),
      ("Sum C", "03-sum-c", "Sum ground C → C_eq=1.376."),
      ("After", "04-after", "Reduced to 2 signal ports (in/out)."),
      ("Golden", "05-golden", "GOLDEN: after_nodes=2; R_eq=3.06 C_eq=1.376.")],
     "Open **network-reduce**. Select R_eq; confirm after_nodes=2.",
     "Call reduce_network(); assert after_nodes==2 and r_eq==3.06 and c_eq==1.376.",
     "Reducing C before R. Keeping internal nodes after reduce.",
     "Next: back-annotate nets.",
     "R_eq ← sum(series R); C_eq ← sum(gnd C); after_nodes ← 2",
     [{"q": "after_nodes golden?", "choices": ["2", "5", "4", "3"], "answer": 0},
      {"q": "R_eq golden?", "choices": ["3.06", "0.5", "1.376", "2.0"], "answer": 0},
      {"q": "C_eq golden?", "choices": ["1.376", "3.06", "0.5", "2.0"], "answer": 0}]),
    ("module03-01-back-annotate", "lab", "Back-annotate nets", "Annotate", "back-annotate",
     "Attach reduced R/C totals to net n1 for timing hooks.",
     "back_annotate",
     "Back-annotate writes r_total and c_total onto net n1 with port list.",
     "GOLDEN: net n1 annotated.",
     [("Net", "01-net", "Target net n1 from tiny_pex."),
      ("R total", "02-r", "r_total=3.06 from reduced network."),
      ("C total", "03-c", "c_total=1.376 from reduced network."),
      ("Ports", "04-ports", "Ports in and out on n1."),
      ("Golden", "05-golden", "GOLDEN: net n1 annotated.")],
     "Open **back-annotate**. Select n1; confirm annotation count=1.",
     "Call back_annotate(); assert net=='n1' and count==1.",
     "Annotating wrong net. Missing port list on annotation.",
     "Next: SPEF-lite emit.",
     "ann ← {net: n1, r_total, c_total, ports}; annotations ← [ann]",
     [{"q": "annotated net?", "choices": ["n1", "in", "out", "gnd"], "answer": 0},
      {"q": "annotation count?", "choices": ["1", "4", "3", "0"], "answer": 0},
      {"q": "ports on n1?", "choices": ["in,out", "s1,s2", "none", "gnd"], "answer": 0}]),
    ("module03-03-spef-lite", "lab", "SPEF-lite emit", "SPEF-lite", "spef-lite",
     "Emit minimal SPEF-lite lines from reduced R_eq and C_eq.",
     "emit_spef_lite",
     "SPEF-lite records one *RES and one *CAP from the reduced network.",
     "GOLDEN: 1 RES + 1 CAP.",
     [("Header", "01-header", "*SPEF_LITE header and *NET n1 line."),
      ("RES", "02-res", "One *RES in out 3.06 line."),
      ("CAP", "03-cap", "One *CAP out 1.376 line."),
      ("Counts", "04-counts", "res_count=1, cap_count=1."),
      ("Golden", "05-golden", "GOLDEN: 1 RES + 1 CAP.")],
     "Open **spef-lite**. Run SPEF; confirm 1 RES + 1 CAP.",
     "Call emit_spef_lite(); assert res_count==1 and cap_count==1.",
     "Emitting per-segment instead of reduced. Missing *NET line.",
     "Next: PEX engine integration.",
     "lines ← *SPEF_LITE; *NET; *RES in out Req; *CAP out Ceq",
     [{"q": "res_count golden?", "choices": ["1", "4", "3", "0"], "answer": 0},
      {"q": "cap_count golden?", "choices": ["1", "4", "3", "0"], "answer": 0},
      {"q": "format name?", "choices": ["SPEF-lite", "SPICE", "GDS", "LEF"], "answer": 0}]),
    ("module04-01-pex-engine", "lab", "PEX engine pass", "Engine", "pex-engine",
     "Run pex_engine; confirm all goldens and ok=True.",
     "pex_engine",
     "A tiny engine chains every PEX stage and reports ok when goldens match.",
     "GOLDEN: ok=True.",
     [("Geo", "01-geo", "Geometry segment_count=4, layer_count=3."),
      ("R/C", "02-rc", "Resistance r_total=3.06; capacitance c_total=1.376."),
      ("Reduce", "03-reduce", "Reduce after_nodes=2; R_eq/C_eq match."),
      ("SPEF", "04-spef", "SPEF res_count=1, cap_count=1."),
      ("OK", "05-ok", "GOLDEN: ok=True.")],
     "Open **pex-engine**. Run engine; confirm ok.",
     "Call pex_engine(); assert ok is True.",
     "Reporting partial stages. Changing toy without updating goldens.",
     "Next: offline compare, then wrap.",
     "engine: geo + R/C + network + reduce + annotate + spef → ok",
     [{"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "r_total golden?", "choices": ["3.06", "1.376", "0.5", "2.0"], "answer": 0},
      {"q": "segment_count?", "choices": ["4", "3", "2", "8"], "answer": 0}]),
    ("module05-01-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline compare", None,
     "Print pex_compare metrics offline without the browser.", None,
     "Track A prints pex_compare without the browser.",
     "Load tiny_pex.json; print segments, r_total, c_total, r_eq, c_eq, ok."),
    ("module99-00-wrap", "wrap", "PEX path complete", "Wrap", None,
     "Recap geometry load, R/C extract, RC network, reduce, back-annotate, SPEF-lite, engine.", None,
     "You checked tiny_pex: 4 segments; R_total=3.06; C_total=1.376; SPEF 1 RES + 1 CAP; engine ok.",
     "Natural next: learn_spice (SPEF → spice)."),
]


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def parse_modules():
    out = []
    for row in MODULES_META:
        m = {
            "id": row[0], "kind": row[1], "title": row[2], "short": row[3], "lab": row[4],
            "outcomes": row[5], "algorithm": row[6], "hook": row[7], "idea": row[8],
            "status": "**ref**" if row[1] == "lab" else "—",
        }
        if row[1] == "lab":
            m.update(walk=row[9], browser=row[10], impl=row[11], pitfalls=row[12],
                     next=row[13], pseudo=f"## Pseudocode\n\n```text\n{row[14]}\n```\n",
                     quiz_extra=row[15])
        out.append(m)
    return out


def nav(m, modules):
    idx = next(i for i, x in enumerate(modules) if x["id"] == m["id"])
    prev = modules[idx - 1] if idx else None
    nxt = modules[idx + 1] if idx + 1 < len(modules) else None
    return (f"{('[← '+prev['short']+'](../'+prev['id']+'/README.md)') if prev else '← Start'}"
            f" · [Course README](../README.md) · "
            f"{('['+nxt['short']+' →](../'+nxt['id']+'/README.md)') if nxt else 'End →'}")


MEDIA = ("| Artifact | Path |\n|----------|------|\n| Transcript | [transcript.md](transcript.md) |\n"
         "| Outline | [outline.yaml](outline.yaml) |\n| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |\n"
         "| Video | [video.mp4](video.mp4) |\n| Quiz | [quiz.json](quiz.json) |\n")


def lab_readme(m, modules):
    key = m["id"].replace("module", "")
    if m["kind"] == "lab":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `lab` · Primary lab: `{m['lab']}` · **ref**

{nav(m, modules)}

## Outcomes

After this module you can: **{m['outcomes']}**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_pex.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).

### Track B — Browser lab (online)

1. Local: http://127.0.0.1:8080/tools/{m['lab']}/
2. Live: {LIVE}/{m['lab']}/

## Media

{MEDIA}
"""
    if m["kind"] == "intro":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `intro`

{nav(m, modules)}

## What this course is

**learn_pex** teaches parasitic extraction literacy — geometry load, resistance/capacitance extract, RC network build, network reduction, back-annotate, SPEF-lite emit, and a tiny PEX engine.

**Prerequisite:** [learn_lvs](../learn_lvs/README.md). **Next:** [learn_spice](../learn_spice/README.md).

## Media

{MEDIA}
"""
    if m["kind"] == "wrap":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `wrap`

{nav(m, modules)}

## You can now

**{m['outcomes']}**

## Next course

→ **learn_spice** ([`eda.md`](../../../eda.md)) — SPEF → spice simulation path.

## Media

{MEDIA}
"""
    return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `offline`

{nav(m, modules)}

## Outcomes

**{m['outcomes']}**

## Media

{MEDIA}
"""


def transcript(m):
    lines = [f"# {m['title']}", "", f"**Module id:** {m['id']}"]
    if m["lab"]:
        lines += [f"**Lab:** {m['lab']}", "**Tracks:** A (implement) · B (browser lab)"]
    lines += ["", f"## Slide 1 — {m['short']}", "", m["hook"], "",
              "## Slide 2 — The idea", "", m["idea"], ""]
    if m["kind"] == "lab":
        lines += ["<!-- algorithm-walkthrough -->", ""]
        for i, (title, _fn, cap) in enumerate(m["walk"], start=3):
            lines += [f"## Slide {i} — {title}", "", f"![{title}](assets/steps/{_fn}.png)", "", cap, ""]
        lines += ["<!-- /algorithm-walkthrough -->", "",
                  "## Slide 8 — Browser lab track", "",
                  "![Browser lab starter](assets/lab-starter.png)", "",
                  m["browser"], "",
                  "## Slide 9 — Implement track", "", m["impl"], "",
                  "## Slide 10 — Pitfalls", "", m["pitfalls"], "",
                  "## Slide 11 — Your turn", "", m["next"], ""]
    elif m["kind"] == "intro":
        lines += ["## Slide 3 — Two tracks", "",
                  "Implement track uses common/ solvers; browser lab track uses platform tools.", "",
                  "## Slide 4 — Toy design", "",
                  "tiny_pex: four segments on net n1; R_total=3.06; C_total=1.376.", "",
                  "## Slide 5 — Path", "",
                  "Geometry → R extract → C extract → RC network → reduce → annotate → SPEF → engine.", "",
                  "## Slide 6 — Begin", "", "Next: geometry load.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "4 segments; R_total=3.06; C_total=1.376; SPEF 1 RES + 1 CAP; engine ok.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can list the PEX pipeline stages.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  'python3 -c "from solvers import pex_compare; print(pex_compare())" in common/', "",
                  "## Slide 5 — What to compare", "", m["idea"], "",
                  "## Slide 6 — Next", "", "Continue to the wrap module.", ""]
    return "\n".join(lines)


def quiz(m):
    if m["kind"] == "lab":
        items = [{"id": f"q{i+1}", "question": q["q"], "choices": q["choices"], "answer": q["answer"]}
                 for i, q in enumerate(m["quiz_extra"])]
    else:
        items = [
            {"id": "q1", "question": f"Focus of {m['short']}?", "choices": [m["outcomes"][:60], "Place only", "CTS only", "LVS compare"], "answer": 0},
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_lvs", "learn_drc", "learn_spice"], "answer": 0},
            {"id": "q3", "question": "R_total golden?", "choices": ["3.06", "1.376", "0.5", "2.0"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_pex — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))
    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nParasitic extraction literacy: geometry load, resistance/capacitance extract, "
          "RC network build, network reduction, back-annotate, SPEF-lite emit, tiny pex_engine.\n"
          "In: geometry → R/C → network → reduce → annotate → SPEF goldens on tiny_pex.\n"
          "Out: full field-solver PEX, coupling matrices (see advanced PEX).\n")
    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_pex.json`\n"
          "- **B:** platform `#pex` browser tools\n")
    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_pex

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-PEX-orange)](docs/MODULES.md)

**learn_pex** is the open learning path for *parasitic extraction* — geometry load, resistance/capacitance extract, RC network build, network reduction, back-annotate, SPEF-lite emit, and a tiny PEX engine on `tiny_pex.json`.

**Prerequisite:** [learn_lvs](../learn_lvs/README.md). **Next:** [learn_spice](../learn_spice/README.md).

## Table of contents

- [Contents](#contents)
- [Browse or clone](#browse-or-clone)
- [Consume from the parent](#consume-from-the-parent)
- [Author: publish or update](#author-publish-or-update)
- [Two learning tracks](#two-learning-tracks)
- [Module landings](#module-landings)
- [Browser labs](#browser-labs)
- [License](#license)

## Contents

{toc}

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_pex/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_pex/scripts/scaffold_course.py
bash courses/learn_pex/scripts/capture_all_walkthroughs.sh
bash courses/learn_pex/scripts/capture_lab_snaps.sh
bash courses/learn_pex/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_pex --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#pex` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#pex

## License

CC BY 4.0 — see [LICENSE](LICENSE).
""")

    for m in modules:
        d = ROOT / m["id"]
        write(d / "README.md", lab_readme(m, modules))
        write(d / "transcript.md", transcript(m))
        write(d / "outline.yaml", f"title: {m['title']}\nfooter: {COURSE}\nslides: []\n")
        write(d / "slides.md", f"# {m['title']}\n\n(see transcript.md)\n")
        write(d / "quiz.json", json.dumps(quiz(m), indent=2))
        write(d / "CHECKLIST.md", f"# Checklist\n\n- [ ] {m['outcomes']}\n")
        if m["kind"] == "lab":
            write(d / "EXAMPLES.md",
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_pex.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_pex.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_pex.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_pex
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {mid} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_pex/{mid}" --inject-transcript'
              for mid in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_pex/module*/; do
  base=$(basename "$m")
  case "$base" in module00-*|module05-01-*|module99-*) continue ;; esac
  python3 .cursor/skills/module-slides/scripts/capture_lab_snapshot.py "$m" || true
done
echo LAB_SNAPS_OK
""")
    write(scripts / "module.sh", """#!/usr/bin/env bash
set -euo pipefail
echo "Use narrate_clips.sh for media builds."
""")
    write(scripts / "smoke_walkthrough.py",
          "print('labs', " + repr([m["lab"] for m in modules if m["lab"]]) + ")\n")
    write(scripts / "_fix_sh_lf.py", """#!/usr/bin/env python3
from pathlib import Path
root = Path(__file__).resolve().parent
for p in root.glob("*.sh"):
    b = p.read_bytes().replace(b"\\r\\n", b"\\n").replace(b"\\r", b"\\n")
    p.write_bytes(b)
    print("lf", p.name)
""")
    print(f"Scaffolded {len(modules)} modules → {ROOT}")


if __name__ == "__main__":
    main()
