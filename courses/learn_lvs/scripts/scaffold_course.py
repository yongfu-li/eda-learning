#!/usr/bin/env python3
"""Scaffold learn_lvs with module-slides stubs. Lab status **ref**."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_lvs"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to LVS", "Welcome", None,
     "Explain layout vs schematic compare after DRC literacy.",
     None,
     "After DRC you still need LVS — schematic graph, device recognition, net extract, binding, compare.",
     "Toy tiny_lvs: INV schematic mn1/mp1 vs layout X0/X1 → four matched nets."),
    ("module01-01-schematic-graph", "lab", "Schematic connectivity graph", "Schematic graph", "schematic-graph",
     "Build schematic device–net graph; count devices, nets, and edges.",
     "schematic_graph",
     "LVS starts from the schematic — devices, nets, and pin edges before layout extract.",
     "GOLDEN: 2 devices, 4 nets, mn1/mp1.",
     [("Devices", "01-devices", "Two schematic devices: mn1 (nmos) and mp1 (pmos)."),
      ("Nets", "02-nets", "Four nets: a, y, vdd, vss."),
      ("Pins", "03-pins", "Each device pin attaches to a net (G/D/S)."),
      ("Edges", "04-edges", "Six pin edges across mn1 and mp1."),
      ("Golden", "05-golden", "GOLDEN: device_count=2, net_count=4.")],
     "Open **schematic-graph**. Inspect tiny_lvs; confirm mn1/mp1 and 4 nets.",
     "Call schematic_graph(); assert device_count==2 and net_count==4.",
     "Counting layout shapes as schematic devices. Missing supply nets.",
     "Next: device recognition.",
     "sch ← schematic_graph(tiny_lvs); device_count ← |sch.devices|",
     [{"q": "sch device_count?", "choices": ["2", "4", "6", "1"], "answer": 0},
      {"q": "sch net_count?", "choices": ["4", "2", "6", "8"], "answer": 0},
      {"q": "nmos id?", "choices": ["mn1", "mp1", "X0", "X1"], "answer": 0}]),
    ("module01-03-device-recog", "lab", "Device recognition", "Device recog", "device-recog",
     "Recognize layout MOS devices from annotated layout devices.",
     "recognize_devices",
     "Device recognition maps layout shapes to MOS instances — nmos vs pmos.",
     "GOLDEN: nmos=1 pmos=1 (X0/X1).",
     [("Shapes", "01-shapes", "Nine layout shapes: diff, poly, M1, implants."),
      ("X0", "02-x0", "X0 nmos from ndiff, poly, nplus."),
      ("X1", "03-x1", "X1 pmos from pdiff, poly, pplus."),
      ("Types", "04-types", "Classify each layout device by type."),
      ("Golden", "05-golden", "GOLDEN: nmos=1, pmos=1.")],
     "Open **device-recog**. Select X0 and X1; confirm nmos/pmos counts.",
     "Call recognize_devices(); assert nmos==1 and pmos==1.",
     "Counting shapes instead of devices. Swapping nmos/pmos polarity.",
     "Next: net extraction.",
     "for each layout device region: classify nmos|pmos → device id",
     [{"q": "nmos count?", "choices": ["1", "0", "2", "4"], "answer": 0},
      {"q": "pmos count?", "choices": ["1", "0", "2", "4"], "answer": 0},
      {"q": "layout nmos id?", "choices": ["X0", "X1", "mn1", "mp1"], "answer": 0}]),
    ("module01-05-net-extract", "lab", "Net extraction", "Net extract", "net-extract",
     "Extract layout nets from shape connectivity.",
     "extract_nets",
     "Net extraction groups layout shapes into electrically connected nets.",
     "GOLDEN: 4 layout nets net_a/y/vss/vdd.",
     [("Shapes", "01-shapes", "M1 and diffusion shapes carry connectivity."),
      ("net_a", "02-net-a", "net_a: poly + m1_a (gate net a)."),
      ("net_y", "03-net-y", "net_y: m1_y (output y)."),
      ("Supplies", "04-sup", "net_vss and net_vdd tie diff + M1."),
      ("Golden", "05-golden", "GOLDEN: count=4 nets.")],
     "Open **net-extract**. Select net_a and net_y; confirm 4 layout nets.",
     "Call extract_nets(); assert count==4 and ids include net_a, net_y.",
     "Splitting a net at a via. Missing port annotation on supplies.",
     "Next: layout device–net graph.",
     "nets ← connected_components(layout.shapes); count ← |nets|",
     [{"q": "layout net count?", "choices": ["4", "2", "6", "9"], "answer": 0},
      {"q": "gate net id?", "choices": ["net_a", "net_y", "a", "y"], "answer": 0},
      {"q": "output net?", "choices": ["net_y", "net_a", "net_vdd", "net_vss"], "answer": 0}]),
    ("module02-01-layout-graph", "lab", "Layout device–net graph", "Layout graph", "layout-graph",
     "Build layout device–net graph with pin edges.",
     "layout_graph",
     "Layout graph mirrors schematic — devices X0/X1 with pin-to-net edges.",
     "GOLDEN: 2 devices, 4 nets, 6 edges.",
     [("Devices", "01-devices", "Two layout devices: X0 nmos, X1 pmos."),
      ("Nets", "02-nets", "Four layout nets: net_a, net_y, net_vss, net_vdd."),
      ("Pins", "03-pins", "Each device has G/D/S pins on layout nets."),
      ("Edges", "04-edges", "Six pin edges (3 per device)."),
      ("Golden", "05-golden", "GOLDEN: edge_count=6.")],
     "Open **layout-graph**. Confirm X0/X1 and 6 pin edges.",
     "Call layout_graph(); assert device_count==2 and edge_count==6.",
     "Using schematic net names on layout graph. Missing a pin edge.",
     "Next: pin / name binding.",
     "lay ← layout_graph(tiny_lvs); edge_count ← |lay.edges|",
     [{"q": "lay device_count?", "choices": ["2", "4", "6", "1"], "answer": 0},
      {"q": "lay edge_count?", "choices": ["6", "4", "8", "2"], "answer": 0},
      {"q": "pmos layout id?", "choices": ["X1", "X0", "mp1", "mn1"], "answer": 0}]),
    ("module02-03-pin-binding", "lab", "Pin / name binding", "Pin binding", "pin-binding",
     "Bind layout device/net ids to schematic names.",
     "pin_binding",
     "Binding table maps layout X0→mn1 and layout nets to schematic ports.",
     "GOLDEN: X0→mn1, X1→mp1; 4 net binds.",
     [("Dev bind", "01-dev", "Device binding: X0→mn1, X1→mp1."),
      ("Net bind", "02-net", "Net binding: net_a→a, net_y→y."),
      ("Supplies", "03-sup", "net_vss→vss, net_vdd→vdd."),
      ("Pairs", "04-pairs", "Four net pairs and two device pairs."),
      ("Golden", "05-golden", "GOLDEN: device_count=2, net_count=4.")],
     "Open **pin-binding**. Select X0 and mn1; confirm binding table.",
     "Call pin_binding(); assert devices['X0']=='mn1' and len(nets)==4.",
     "Binding by position instead of connectivity. Missing a supply bind.",
     "Next: device matching.",
     "bind ← binding table; map layout ids → schematic names",
     [{"q": "X0 maps to?", "choices": ["mn1", "mp1", "X1", "net_a"], "answer": 0},
      {"q": "net bind count?", "choices": ["4", "2", "6", "1"], "answer": 0},
      {"q": "net_a maps to?", "choices": ["a", "y", "net_y", "vdd"], "answer": 0}]),
    ("module03-01-device-match", "lab", "Device matching", "Device match", "device-match",
     "Match layout devices to schematic by binding and type.",
     "match_devices",
     "Device match checks binding plus type agreement (nmos↔nmos).",
     "GOLDEN: matched_devices=2.",
     [("Bind", "01-bind", "Use device binding X0→mn1, X1→mp1."),
      ("Type", "02-type", "Compare layout type to schematic type."),
      ("X0", "03-x0", "X0 nmos matches mn1 nmos."),
      ("X1", "04-x1", "X1 pmos matches mp1 pmos."),
      ("Golden", "05-golden", "GOLDEN: matched_devices=2.")],
     "Open **device-match**. Run match; confirm 2 matched devices.",
     "Call match_devices(); assert count==2 and mismatch_count==0.",
     "Matching by name only without type check. Skipping unbound devices.",
     "Next: LVS graph compare.",
     "for each bind pair: ok ← lay.type == sch.type; count matches",
     [{"q": "matched_devices?", "choices": ["2", "1", "0", "4"], "answer": 0},
      {"q": "mismatch_count?", "choices": ["0", "1", "2", "4"], "answer": 0},
      {"q": "X1 schematic?", "choices": ["mp1", "mn1", "X0", "net_y"], "answer": 0}]),
    ("module03-03-lvs-compare", "lab", "LVS graph compare", "LVS compare", "lvs-compare",
     "Compare bound pin connectivity; flag net mismatches.",
     "lvs_compare",
     "LVS compare checks every pin net after rename — mismatch_count must be zero.",
     "GOLDEN: mismatch_count=0, matched_nets=4.",
     [("Rename", "01-rename", "Map layout nets to schematic via binding."),
      ("Pins", "02-pins", "Walk each device pin on both sides."),
      ("Check", "03-check", "Mapped layout net must equal schematic net."),
      ("Nets", "04-nets", "All four bound nets match."),
      ("Golden", "05-golden", "GOLDEN: mismatch_count=0, matched_nets=4.")],
     "Open **lvs-compare**. Run compare; confirm ok and 4 matched nets.",
     "Call lvs_compare(); assert ok and matched_net_count==4.",
     "Comparing unbound nets. Ignoring pin direction mismatches as net errors.",
     "Next: LVS engine integration.",
     "for each pin: bind_net(lay_net) == sch_net else mismatch",
     [{"q": "mismatch_count?", "choices": ["0", "1", "2", "4"], "answer": 0},
      {"q": "matched_nets?", "choices": ["4", "2", "6", "0"], "answer": 0},
      {"q": "compare ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0}]),
    ("module04-01-lvs-engine", "lab", "LVS engine pass", "Engine", "lvs-engine",
     "Run lvs_engine; confirm all goldens and ok=True.",
     "lvs_engine",
     "A tiny engine chains every LVS stage and reports ok when goldens match.",
     "GOLDEN: ok=True.",
     [("Sch", "01-sch", "Schematic graph device_count=2, net_count=4."),
      ("Recog", "02-recog", "Recognize nmos=1, pmos=1."),
      ("Extract", "03-extract", "Extract 4 layout nets."),
      ("Compare", "04-compare", "Compare mismatch_count=0, matched_nets=4."),
      ("OK", "05-ok", "GOLDEN: ok=True.")],
     "Open **lvs-engine**. Run engine; confirm ok.",
     "Call lvs_engine(); assert ok is True.",
     "Reporting partial stages. Changing toy without updating goldens.",
     "Next: offline compare, then wrap.",
     "engine: sch + recog + extract + bind + match + compare → ok",
     [{"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "matched_devices?", "choices": ["2", "1", "4", "0"], "answer": 0},
      {"q": "lay net count?", "choices": ["4", "2", "6", "9"], "answer": 0}]),
    ("module05-01-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline compare", None,
     "Print lvs_compare_metrics offline without the browser.", None,
     "Track A prints lvs_compare_metrics without the browser.",
     "Load tiny_lvs.json; print sch_devices, lay_devices, matched_nets, mismatch_count, ok."),
    ("module99-00-wrap", "wrap", "LVS path complete", "Wrap", None,
     "Recap schematic graph, device recog, net extract, layout graph, binding, match, compare, engine.", None,
     "You checked tiny_lvs: mn1/mp1 schematic; X0/X1 layout; 4 nets bound; matched_devices=2; engine ok.",
     "Natural next: learn_pex."),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_lvs.json`.
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

**learn_lvs** teaches layout vs schematic compare literacy — schematic graph, device recognition, net extraction, layout graph, pin binding, device match, LVS compare, and a tiny LVS engine.

**Prerequisite:** [learn_drc](../learn_drc/README.md). **Next:** [learn_pex](../learn_pex/README.md).

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

→ **learn_pex** ([`eda.md`](../../../eda.md))

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
                  "tiny_lvs: schematic mn1/mp1 INV; layout X0/X1; four bound nets.", "",
                  "## Slide 5 — Path", "",
                  "Schematic → recog → extract → layout → binding → match → compare → engine.", "",
                  "## Slide 6 — Begin", "", "Next: schematic connectivity graph.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "2 sch devices; X0/X1 layout; 4 nets; matched_devices=2; mismatch=0; engine ok.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can list the LVS pipeline stages.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  'python3 -c "from solvers import lvs_compare_metrics; print(lvs_compare_metrics())" in common/', "",
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
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_drc", "learn_pex", "learn_erc"], "answer": 0},
            {"id": "q3", "question": "matched_devices golden?", "choices": ["2", "1", "4", "0"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_lvs — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))
    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nLayout vs schematic compare literacy: schematic graph, device recognition, "
          "net extraction, layout graph, pin binding, device match, LVS compare, tiny lvs_engine.\n"
          "In: schematic → layout extract → binding → compare goldens on tiny_lvs.\n"
          "Out: full hierarchical LVS, parasitic extract (see learn_pex).\n")
    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_lvs.json`\n"
          "- **B:** platform `#lvs` browser tools\n")
    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_lvs

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-LVS-orange)](docs/MODULES.md)

**learn_lvs** is the open learning path for *layout vs schematic compare* — schematic graph, device recognition, net extraction, layout graph, pin binding, device match, LVS compare, and a tiny LVS engine on `tiny_lvs.json`.

**Prerequisite:** [learn_drc](../learn_drc/README.md). **Next:** [learn_pex](../learn_pex/README.md).

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

Open [platform courses](../../platform/courses/learn_lvs/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_lvs/scripts/scaffold_course.py
bash courses/learn_lvs/scripts/capture_all_walkthroughs.sh
bash courses/learn_lvs/scripts/capture_lab_snaps.sh
bash courses/learn_lvs/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_lvs --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#lvs` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#lvs

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
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_lvs.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_lvs.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_lvs.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_lvs
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {mid} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_lvs/{mid}" --inject-transcript'
              for mid in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_lvs/module*/; do
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
