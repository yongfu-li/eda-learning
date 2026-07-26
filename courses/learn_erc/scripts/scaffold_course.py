#!/usr/bin/env python3
"""Scaffold learn_erc with module-slides stubs. Lab status **ref**."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_erc"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to ERC", "Welcome", None,
     "Explain electrical rule checks on a tiny netlist graph after SPICE literacy.",
     None,
     "After SPICE you still need electrical rules — floating gates, multi-drive, supply shorts, wells.",
     "Toy tiny_erc: INV/BUF/SHORT + bad nwell → 5 ERC markers."),
    ("module01-01-netlist-graph", "lab", "Netlist connectivity graph", "Why graph", "netlist-graph",
     "Build instance–net pin edges; count nets, instances, edges.",
     "connectivity graph construction",
     "ERC starts from a connectivity graph — instances, nets, and pin edges.",
     "GOLDEN: 8 nets, 4 instances, 14 pin edges.",
     [("Nets", "01-nets", "Eight nets: supplies, ports, float_n, z, well_n."),
      ("Instances", "02-inst", "Four instances: u1, u2, u3, short1."),
      ("Edges", "03-edges", "Each pin attachment is an inst–net edge."),
      ("Walk", "04-walk", "Walk pins on u1 INV: A,Y,VDD,VSS."),
      ("Count", "05-count", "GOLDEN: edge_count=14.")],
     "Open **netlist-graph**. Inspect tiny_erc; confirm 8 nets and 14 edges.",
     "Call design_stats() and build_connectivity(); assert net_count==8, edge_count==14.",
     "Counting wells as instances. Double-counting supply pins.",
     "Next: classify drivers vs loads.",
     "edges ← {(inst,pin,net,dir)}; edge_count ← |edges|",
     [{"q": "net_count golden?", "choices": ["8", "4", "14", "5"], "answer": 0},
      {"q": "edge_count golden?", "choices": ["14", "16", "8", "4"], "answer": 0},
      {"q": "instance_count?", "choices": ["4", "8", "3", "5"], "answer": 0}]),
    ("module01-03-drivers-loads", "lab", "Drivers and loads", "Why drivers", "drivers-loads",
     "Classify out/in/power/ground pins per net.",
     "driver and load classification",
     "ERC needs drivers and loads — output pins drive; input pins load.",
     "GOLDEN: z has 2 drivers; float_n has 0 drivers and 1 load.",
     [("Out pins", "01-out", "Y pins are drivers (dir=out)."),
      ("In pins", "02-in", "A pins are loads (dir=in)."),
      ("z drivers", "03-z", "Net z: u2.Y and u3.Y — two drivers."),
      ("float", "04-float", "float_n: zero drivers, one load (u2.A)."),
      ("Count", "05-count", "GOLDEN: float_n drivers=0, z drivers=2.")],
     "Open **drivers-loads**. Confirm z has 2 drivers and float_n has 0.",
     "Call drivers_and_loads(); assert len(by_net['z']['drivers'])==2.",
     "Treating power pins as drivers. Ignoring SHORT io pins.",
     "Next: floating nets.",
     "for each pin: bucket by dir into drivers|loads|power|ground|io",
     [{"q": "z driver count?", "choices": ["2", "1", "0", "3"], "answer": 0},
      {"q": "float_n drivers?", "choices": ["0", "1", "2", "3"], "answer": 0},
      {"q": "Y pin direction?", "choices": ["out", "in", "power", "ground"], "answer": 0}]),
    ("module02-01-floating-nets", "lab", "Floating nets", "Why floating", "floating-nets",
     "Find nets with no driver that are not ports or supplies.",
     "floating net detection",
     "A floating net has loads but no driver — classic ERC fail.",
     "GOLDEN: floating_nets=['float_n'], count=1.",
     [("No driver", "01-nodrv", "float_n has zero output pins."),
      ("Has load", "02-load", "u2.A loads float_n."),
      ("Not port", "03-port", "float_n is not a primary port."),
      ("Not supply", "04-sup", "float_n is not vdd/vss."),
      ("Golden", "05-golden", "GOLDEN: floating_count=1.")],
     "Open **floating-nets**. Select float_n; run floating check.",
     "Call find_floating_nets(); assert nets==['float_n'].",
     "Flagging primary inputs as floating. Ignoring unused well nets.",
     "Next: undriven inputs.",
     "floating ← {n | no drivers ∧ n∉ports ∧ n∉supplies ∧ has loads}",
     [{"q": "floating_count?", "choices": ["1", "0", "2", "5"], "answer": 0},
      {"q": "Floating net id?", "choices": ["float_n", "z", "a", "vdd"], "answer": 0},
      {"q": "Ports counted floating?", "choices": ["no", "yes", "only outputs", "only vdd"], "answer": 0}]),
    ("module02-03-undriven-inputs", "lab", "Undriven inputs", "Why undriven", "undriven-inputs",
     "Find input pins on nets with no driver (excluding primary inputs).",
     "undriven input pin check",
     "Undriven inputs are the pin-level view of floating connectivity.",
     "GOLDEN: one hit — u2.A on float_n.",
     [("Scan loads", "01-scan", "Walk every input pin attachment."),
      ("Driver?", "02-drv", "Skip if the net already has a driver."),
      ("Primary in", "03-pi", "Primary input ports are allowed undriven."),
      ("Hit", "04-hit", "u2.A on float_n is the golden hit."),
      ("Count", "05-count", "GOLDEN: undriven_count=1.")],
     "Open **undriven-inputs**. Confirm u2.A undriven.",
     "Call find_undriven_inputs(); assert count==1 and hits[0].net=='float_n'.",
     "Flagging port a as undriven. Missing the float_n load.",
     "Next: multi-driven nets.",
     "undriven ← loads where net has 0 drivers and net is not input port",
     [{"q": "undriven_count?", "choices": ["1", "0", "2", "4"], "answer": 0},
      {"q": "Hit instance?", "choices": ["u2", "u1", "u3", "short1"], "answer": 0},
      {"q": "Port a undriven?", "choices": ["no (primary in)", "yes", "only if BUF", "always"], "answer": 0}]),
    ("module03-01-multi-driven", "lab", "Multi-driven nets", "Why multi", "multi-driven",
     "Find nets with two or more drivers.",
     "multi-driven net detection",
     "Two outputs on one net is a fight — multi-driven ERC.",
     "GOLDEN: multi_driven_nets=['z'] from u2.Y and u3.Y.",
     [("Count drivers", "01-count", "Per net, count dir=out pins."),
      ("Threshold", "02-thr", "Flag when drivers ≥ 2."),
      ("z fight", "03-z", "u2.Y and u3.Y both drive z."),
      ("y ok", "04-y", "y has a single driver — legal."),
      ("Golden", "05-golden", "GOLDEN: multi_driven_count=1.")],
     "Open **multi-driven**. Select z; confirm multi-driven.",
     "Call find_multi_driven(); assert nets==['z'].",
     "Counting power pins as drivers. Flagging single-driver nets.",
     "Next: supply shorts.",
     "multi ← {n | |drivers(n)| ≥ 2}",
     [{"q": "multi_driven_count?", "choices": ["1", "0", "2", "3"], "answer": 0},
      {"q": "Multi net?", "choices": ["z", "y", "a", "float_n"], "answer": 0},
      {"q": "Drivers on z?", "choices": ["u2.Y+u3.Y", "u1 only", "none", "short1"], "answer": 0}]),
    ("module03-03-supply-shorts", "lab", "Supply shorts", "Why shorts", "supply-shorts",
     "Detect SHORT cells bridging power to ground.",
     "power-ground short detection",
     "A hard short between vdd and vss is catastrophic ERC.",
     "GOLDEN: supply_short_count=1 via short1.",
     [("SHORT cell", "01-short", "short1 is a SHORT instance."),
      ("Pins", "02-pins", "P1→vdd, P2→vss."),
      ("Kinds", "03-kinds", "power and ground both present."),
      ("Flag", "04-flag", "Record the short hit."),
      ("Golden", "05-golden", "GOLDEN: supply_short_count=1.")],
     "Open **supply-shorts**. Confirm short1 bridges vdd↔vss.",
     "Call find_supply_shorts(); assert count==1.",
     "Treating normal INV VDD/VSS as a short. Missing SHORT cell type.",
     "Next: well/substrate ties.",
     "short ← SHORT inst whose pins touch both power and ground supplies",
     [{"q": "supply_short_count?", "choices": ["1", "0", "2", "4"], "answer": 0},
      {"q": "Short instance?", "choices": ["short1", "u1", "u2", "nw1"], "answer": 0},
      {"q": "Bridges?", "choices": ["vdd↔vss", "a↔b", "y↔z", "wells only"], "answer": 0}]),
    ("module04-01-well-substrate", "lab", "Well and substrate ties", "Why wells", "well-substrate",
     "Check nwell ties to power and pwell to ground.",
     "well/substrate tie checking",
     "Wells must tie to the right rail — nwell→power, pwell→ground.",
     "GOLDEN: well_error_count=1 — nw1 nwell tied to vss.",
     [("nwell rule", "01-nwell", "nwell must tie to a power supply."),
      ("Bad tie", "02-bad", "nw1.tied_to = vss (ground) — wrong."),
      ("Expected", "03-exp", "Expected power (vdd)."),
      ("pwell note", "04-pwell", "pwell would require ground."),
      ("Golden", "05-golden", "GOLDEN: well_error_count=1.")],
     "Open **well-substrate**. Confirm nw1 error.",
     "Call find_well_errors(); assert count==1.",
     "Accepting nwell→vss. Ignoring well records.",
     "Next: collect ERC markers.",
     "error ← nwell tied≠power ∨ pwell tied≠ground",
     [{"q": "well_error_count?", "choices": ["1", "0", "2", "8"], "answer": 0},
      {"q": "Bad well id?", "choices": ["nw1", "u1", "short1", "z"], "answer": 0},
      {"q": "nwell should tie?", "choices": ["power", "ground", "float", "output"], "answer": 0}]),
    ("module04-03-erc-markers", "lab", "ERC markers", "Why markers", "erc-markers",
     "Collect floating, undriven, multi, short, and well markers.",
     "ERC marker collection",
     "Signoff ERC emits markers — one record per violation class hit.",
     "GOLDEN: marker_count=5 on tiny_erc.",
     [("Floating m", "01-float", "One floating marker on float_n."),
      ("Undriven m", "02-undrv", "One undriven marker on u2.A."),
      ("Multi m", "03-multi", "One multi-driven marker on z."),
      ("Short+well", "04-sw", "Supply short + well error markers."),
      ("Count 5", "05-count", "GOLDEN: marker_count=5.")],
     "Open **erc-markers**. Run collect; confirm 5 markers.",
     "Call collect_markers(); assert count==5.",
     "Double-counting float as two markers incorrectly in the golden. Missing well.",
     "Next: erc_engine integration.",
     "markers ← floating ∪ undriven ∪ multi ∪ shorts ∪ wells",
     [{"q": "marker_count?", "choices": ["5", "1", "3", "8"], "answer": 0},
      {"q": "Includes well?", "choices": ["yes", "no", "only floats", "only shorts"], "answer": 0},
      {"q": "Multi marker net?", "choices": ["z", "y", "a", "vdd"], "answer": 0}]),
    ("module05-01-erc-engine", "lab", "ERC engine integration", "Why engine", "erc-engine",
     "Run erc_engine; confirm all goldens and ok=True.",
     "ERC engine integration",
     "A tiny engine chains every ERC check and reports ok when goldens match.",
     "GOLDEN: floating=1, undriven=1, multi=1, short=1, well=1, markers=5, ok=True.",
     [("Stats", "01-stats", "8 nets / 4 instances."),
      ("Float+undrv", "02-fu", "float_n + u2.A."),
      ("Multi+short", "03-ms", "z fight + vdd↔vss short."),
      ("Well", "04-well", "nw1 nwell error."),
      ("OK", "05-ok", "GOLDEN: engine ok=True.")],
     "Open **erc-engine**. Run engine; confirm ok.",
     "Call erc_engine(); assert ok and markers.count==5.",
     "Reporting partial checks. Changing the toy without updating goldens.",
     "Next: offline compare, then wrap.",
     "engine: all checks → markers; ok ← counts match GOLDENS",
     [{"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "marker_count?", "choices": ["5", "4", "6", "0"], "answer": 0},
      {"q": "Engine includes shorts?", "choices": ["yes", "no", "wells only", "SPICE only"], "answer": 0}]),
    ("module05-03-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline compare", None,
     "Print erc_compare metrics offline without the browser.", None,
     "Track A prints erc_compare without the browser.",
     "Load tiny_erc.json; print net_count, floating_count, marker_count, ok."),
    ("module99-00-wrap", "wrap", "ERC path complete", "Wrap", None,
     "Recap graph, floating, undriven, multi-drive, shorts, wells, markers, engine.", None,
     "You checked tiny_erc: 5 markers; float_n; z multi-drive; vdd↔vss short; bad nwell.",
     "Natural next: learn_antenna or learn_power."),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_erc.json`.
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

**learn_erc** teaches electrical rule check literacy — connectivity graph, drivers/loads, floating nets, undriven inputs, multi-driven nets, supply shorts, well ties, markers, and a tiny ERC engine.

**Prerequisite:** [learn_spice](../learn_spice/README.md) or circuit/netlist literacy. **Next:** [learn_antenna](../learn_antenna/README.md) or [learn_power](../learn_power/README.md).

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

→ **learn_antenna** or **learn_power** ([`eda.md`](../../../eda.md))

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
                  "## Slide 4 — Toy netlist", "",
                  "tiny_erc: u1 INV, u2 INV on float_n, u3 BUF fighting z, short1 vdd↔vss, bad nwell.", "",
                  "## Slide 5 — Path", "",
                  "Graph → drivers → floating → undriven → multi → shorts → wells → markers → engine.", "",
                  "## Slide 6 — Begin", "", "Next: netlist connectivity graph.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "8 nets; 14 edges; floating float_n; multi z; short1; nw1; markers=5; engine ok.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can list the five ERC marker kinds.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  "python3 -c \"from solvers import erc_compare; print(erc_compare())\" in common/", "",
                  "## Slide 5 — What to compare", "", m["idea"], "",
                  "## Slide 6 — Next", "", "Continue to the wrap module.", ""]
    return "\n".join(lines)


def quiz(m):
    if m["kind"] == "lab":
        items = [{"id": f"q{i+1}", "question": q["q"], "choices": q["choices"], "answer": q["answer"]}
                 for i, q in enumerate(m["quiz_extra"])]
    else:
        items = [
            {"id": "q1", "question": f"Focus of {m['short']}?", "choices": [m["outcomes"][:60], "Place only", "CTS only", "DRC width"], "answer": 0},
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_spice", "learn_power", "learn_drc"], "answer": 0},
            {"id": "q3", "question": "marker_count golden?", "choices": ["5", "1", "8", "0"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_erc — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))
    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nElectrical rule check literacy: connectivity graph, drivers/loads, "
          "floating nets, undriven inputs, multi-driven nets, supply shorts, well/substrate ties, "
          "marker collection, tiny erc_engine.\n"
          "In: netlist graph → ERC categories → markers → engine goldens on tiny_erc.\n"
          "Out: full foundry ERC decks, ESD structures, full antenna (see learn_antenna), layout DRC.\n")
    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_erc.json`\n"
          "- **B:** platform `#erc` browser tools\n")
    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_erc

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-ERC-orange)](docs/MODULES.md)

**learn_erc** is the open learning path for *electrical rule checks* — connectivity graph, drivers/loads, floating nets, undriven inputs, multi-driven nets, supply shorts, well ties, markers, and a tiny ERC engine on `tiny_erc.json`.

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

Open [platform courses](../../platform/courses/learn_erc/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_erc/scripts/scaffold_course.py
bash courses/learn_erc/scripts/capture_all_walkthroughs.sh
bash courses/learn_erc/scripts/capture_lab_snaps.sh
bash courses/learn_erc/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_erc --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#erc` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#erc

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
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_erc.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_erc.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_erc.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_erc
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {mid} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_erc/{mid}" --inject-transcript'
              for mid in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_erc/module*/; do
  base=$(basename "$m")
  case "$base" in module00-*|module05-03-*|module99-*) continue ;; esac
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
    print(f"Scaffolded {len(modules)} modules → {ROOT}")


if __name__ == "__main__":
    main()
