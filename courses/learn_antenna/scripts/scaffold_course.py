#!/usr/bin/env python3

"""Scaffold learn_antenna with module-slides stubs. Lab status **ref**."""

from __future__ import annotations



import json

import shutil

from pathlib import Path



ROOT = Path(__file__).resolve().parents[1]

LIVE = "https://universal-verification-methodology.github.io/learning/tools"

COURSE = "learn_antenna"



# id, kind, title, short, lab, outcomes, algorithm, hook, idea,

# walk[5], browser, impl, pitfalls, next, pseudo, quiz

MODULES_META = [

    ("module00-00-intro", "intro", "Welcome to antenna checks", "Welcome", None,

     "Explain antenna ratio and charge checks on a tiny metal/gate layout after ERC literacy.",

     None,

     "After ERC you still need antenna rules — metal/gate ratio, charge, diodes, jumpers.",

     "Toy tiny_antenna: n1 ratio 25, n3 diode, jumper breaks n1 → 1 marker."),

    ("module01-01-metal-area", "lab", "Metal area per net", "Metal area", "metal-area",

     "Sum metal shape area per net; read layer and net ids.",

     "metal area aggregation per net",

     "Antenna checks start by summing metal area on each net.",

     "GOLDEN: metal_area n1=25.",

     [("Sum", "01-sum", "Sum metal area per net from layer shapes."),

      ("n1", "02-n1", "n1: m1 layer 2 area 25."),

      ("n2", "03-n2", "n2: m2 area 8."),

      ("n3", "04-n3", "n3: m3 + m3b sum to 45."),

      ("Golden", "05-golden", "GOLDEN: metal_area n1=25.")],

     "Open **metal-area**. Inspect tiny_antenna; confirm n1 metal=25.",

     "Call metal_area_by_net(); assert area['n1']==25.",

     "Double-counting after jumper cap. Ignoring layer filter.",

     "Next: gate area per net.",

     "metal[n] ← Σ area(m) for metals on net n (respect jumper max_layer)",

     [{"q": "metal_area n1 golden?", "choices": ["25", "1", "45", "8"], "answer": 0},

      {"q": "metal_count?", "choices": ["4", "3", "1", "8"], "answer": 0},

      {"q": "n3 metal sum?", "choices": ["45", "40", "25", "5"], "answer": 0}]),

    ("module01-03-gate-area", "lab", "Gate area per net", "Gate area", "gate-area",

     "Sum gate polygon area per net.",

     "gate area aggregation per net",

     "Antenna ratio divides metal area by gate area on the same net.",

     "GOLDEN: gate_area n1=1.",

     [("Gates", "01-gates", "Each gate shape contributes area on its net."),

      ("n1", "02-n1", "g1 on n1 area 1."),

      ("n2", "03-n2", "g2 on n2 area 2."),

      ("n3", "04-n3", "g3 on n3 area 1."),

      ("Golden", "05-golden", "GOLDEN: gate_area n1=1.")],

     "Open **gate-area**. Confirm n1 gate area=1.",

     "Call gate_area_by_net(); assert area['n1']==1.",

     "Mixing gate count with gate area. Using wrong net id.",

     "Next: antenna ratio.",

     "gate[n] ← Σ area(g) for gates on net n",

     [{"q": "gate_area n1?", "choices": ["1", "25", "2", "45"], "answer": 0},

      {"q": "gate_count?", "choices": ["3", "4", "1", "8"], "answer": 0},

      {"q": "n2 gate area?", "choices": ["2", "8", "1", "4"], "answer": 0}]),

    ("module02-01-antenna-ratio", "lab", "Antenna ratio", "Why ratio", "antenna-ratio",

     "Compute ratio = metal_area / gate_area per net.",

     "antenna ratio computation",

     "Foundry antenna rules compare metal exposure to gate area.",

     "GOLDEN: n1=25, n2=4, n3=45.",

     [("Formula", "01-formula", "ratio = metal / gate per net."),

      ("n1", "02-n1", "n1: 25/1 = 25."),

      ("n2", "03-n2", "n2: 8/2 = 4."),

      ("n3", "04-n3", "n3: 45/1 = 45."),

      ("Golden", "05-golden", "GOLDEN: n1=25, n2=4, n3=45.")],

     "Open **antenna-ratio**. Confirm the three golden ratios.",

     "Call antenna_ratios(); assert ratios['n1']==25, ratios['n2']==4, ratios['n3']==45.",

     "Dividing gate/metal. Forgetting multi-layer metal sum.",

     "Next: charge accumulation.",

     "ratio[n] ← metal[n] / gate[n]  (inf if gate=0)",

     [{"q": "ratio n1?", "choices": ["25", "4", "45", "1"], "answer": 0},

      {"q": "ratio n2?", "choices": ["4", "25", "8", "2"], "answer": 0},

      {"q": "ratio n3?", "choices": ["45", "40", "25", "5"], "answer": 0}]),

    ("module02-03-charge-accumulation", "lab", "Charge accumulation", "Charge", "charge-accumulation",

     "Compute Q = k × metal_area per net.",

     "charge accumulation model",

     "Plasma etch charge scales with exposed metal — toy uses Q=k×metal.",

     "GOLDEN: charge_n1=25.",

     [("k", "01-k", "Q = k × metal_area; k=1 on toy."),

      ("n1", "02-n1", "n1 metal 25 → Q=25."),

      ("n2", "03-n2", "n2 Q=8."),

      ("n3", "04-n3", "n3 Q=45."),

      ("Golden", "05-golden", "GOLDEN: charge_n1=25.")],

     "Open **charge-accumulation**. Confirm Q on n1=25.",

     "Call charge_by_net(); assert charge['n1']==25.",

     "Using ratio instead of metal for Q. Wrong k constant.",

     "Next: threshold rules.",

     "Q[n] ← k × metal[n]",

     [{"q": "charge n1?", "choices": ["25", "1", "10", "45"], "answer": 0},

      {"q": "charge_k on toy?", "choices": ["1", "10", "25", "0"], "answer": 0},

      {"q": "charge uses?", "choices": ["metal area", "gate area", "ratio only", "diode count"], "answer": 0}]),

    ("module03-01-threshold-rules", "lab", "Threshold rules", "Threshold", "threshold-rules",

     "Flag nets with ratio > limit_ratio (no diode protection).",

     "antenna threshold violation detection",

     "Raw violations before diode protection: any ratio above limit.",

     "GOLDEN: raw_violation_count=2 (n1, n3).",

     [("Limit", "01-limit", "limit_ratio=10; flag ratio > limit."),

      ("n1", "02-n1", "n1 ratio 25 > 10 — violation."),

      ("n2 ok", "03-n2", "n2 ratio 4 ≤ 10 — pass."),

      ("n3", "04-n3", "n3 ratio 45 > 10 — violation."),

      ("Golden", "05-golden", "GOLDEN: raw violations=2.")],

     "Open **threshold-rules**. Run raw check; confirm 2 violations.",

     "Call find_violations(apply_diodes=False); assert count==2.",

     "Applying diodes too early. Using charge instead of ratio.",

     "Next: diode protection.",

     "viol ← {n | ratio[n] > limit ∧ ¬diode_protected}",

     [{"q": "raw violation count?", "choices": ["2", "1", "3", "0"], "answer": 0},

      {"q": "limit_ratio?", "choices": ["10", "25", "45", "1"], "answer": 0},

      {"q": "n2 violates raw?", "choices": ["no", "yes", "only with diode", "always"], "answer": 0}]),

    ("module03-03-diode-protection", "lab", "Diode protection", "Why diode", "diode-protection",

     "Skip ratio check on nets with antenna diodes.",

     "diode protection waiver",

     "Foundry diode cells waive antenna on protected nets — n3 here.",

     "GOLDEN: violation_count=1 (n1 only after diode).",

     [("Protect diode", "01-diode", "d1 on n3 protects that net."),

      ("Skip", "02-skip", "Protected nets skip ratio check."),

      ("n1", "03-n1", "n1 ratio 25 still violates."),

      ("n3 waived", "04-n3", "n3 waived by diode."),

      ("Golden", "05-golden", "GOLDEN: violations=1.")],

     "Open **diode-protection**. Confirm only n1 violates.",

     "Call find_violations(apply_diodes=True); assert count==1 and hits[0]['net']=='n1'.",

     "Forgetting to apply diode list. Still flagging n3.",

     "Next: jumper break.",

     "viol ← raw violations minus diode-protected nets",

     [{"q": "violation count after diode?", "choices": ["1", "2", "0", "3"], "answer": 0},

      {"q": "Protected net?", "choices": ["n3", "n1", "n2", "none"], "answer": 0},

      {"q": "Remaining violation net?", "choices": ["n1", "n3", "n2", "all"], "answer": 0}]),

    ("module04-01-jumper-break", "lab", "Jumper break", "Why jumper", "jumper-break",

     "Cap max metal layer via jumper; recompute ratio.",

     "jumper layer break for antenna",

     "A jumper on lower metal breaks antenna path — drops high-layer metal.",

     "GOLDEN: jumper on n1 max_layer=1 → ratio 0.",

     [("Add jumper", "01-jumper", "Jumper caps max metal layer on a net."),

      ("Before", "02-before", "n1 ratio 25 with layer-2 metal."),

      ("Cap", "03-cap", "max_layer=1 drops m1 (layer 2)."),

      ("After", "04-after", "n1 metal area 0 → ratio 0."),

      ("Golden", "05-golden", "GOLDEN: jumper_n1_ratio=0.")],

     "Open **jumper-break**. Apply jumper; confirm n1 ratio=0.",

     "Call jumper_effect(); assert after_ratio==0.",

     "Not filtering by layer. Applying jumper to wrong net.",

     "Next: antenna markers.",

     "after_ratio ← metal_with_cap / gate  (jumper max_layer)",

     [{"q": "jumper n1 ratio after?", "choices": ["0", "25", "4", "45"], "answer": 0},

      {"q": "max_layer on n1?", "choices": ["1", "2", "3", "0"], "answer": 0},

      {"q": "Dropped metal?", "choices": ["m1 L2", "g1", "d1", "m3"], "answer": 0}]),

    ("module04-03-antenna-markers", "lab", "Antenna markers", "Markers", "antenna-markers",

     "Collect ratio violations as signoff markers.",

     "antenna marker collection",

     "Signoff antenna emits one marker per violating net (after diode).",

     "GOLDEN: marker_count=1 on tiny_antenna.",

     [("Viol", "01-viol", "Each ratio hit becomes a marker."),

      ("n1", "02-n1", "n1 ratio 25 > limit."),

      ("n3 skip", "03-n3", "n3 protected — no marker."),

      ("Kind", "04-kind", "kind=antenna_ratio on each hit."),

      ("Golden", "05-golden", "GOLDEN: marker_count=1.")],

     "Open **antenna-markers**. Run collect; confirm 1 marker.",

     "Call collect_markers(); assert count==1.",

     "Counting raw violations. Missing diode waiver.",

     "Next: antenna engine.",

     "markers ← antenna_ratio hits after diode protection",

     [{"q": "marker_count?", "choices": ["1", "2", "5", "0"], "answer": 0},

      {"q": "Marker net?", "choices": ["n1", "n3", "n2", "all"], "answer": 0},

      {"q": "Marker kind?", "choices": ["antenna_ratio", "floating", "multi_driven", "short"], "answer": 0}]),

    ("module05-01-antenna-engine", "lab", "Antenna engine integration", "Engine", "antenna-engine",

     "Run antenna_engine; confirm all goldens and ok=True.",

     "antenna engine integration",

     "A tiny engine chains area, ratio, charge, violations, jumper, markers.",

     "GOLDEN: ratios, violations=1, markers=1, jumper n1=0, ok=True.",

     [("Stats", "01-stats", "3 gates / 4 metals / 3 nets."),

      ("Ratios", "02-ratios", "n1=25, n2=4, n3=45."),

      ("Viol", "03-viol", "After diode: 1 violation on n1."),

      ("Jumper", "04-jumper", "Jumper demo: n1 ratio → 0."),

      ("OK", "05-ok", "GOLDEN: engine ok=True.")],

     "Open **antenna-engine**. Run engine; confirm ok.",

     "Call antenna_engine(); assert ok and markers.count==1.",

     "Reporting partial checks. Changing toy without updating goldens.",

     "Next: offline compare, then wrap.",

     "engine: all checks → markers; ok ← counts match GOLDENS",

     [{"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},

      {"q": "marker_count?", "choices": ["1", "2", "5", "0"], "answer": 0},

      {"q": "Engine includes jumper?", "choices": ["yes", "no", "diodes only", "ERC only"], "answer": 0}]),

    ("module05-03-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline compare", None,

     "Print antenna_compare metrics offline without the browser.", None,

     "Track A prints antenna_compare without the browser.",

     "Load tiny_antenna.json; print ratio_n1, violation_count, marker_count, ok."),

    ("module99-00-wrap", "wrap", "Antenna path complete", "Wrap", None,

     "Recap metal/gate area, ratio, charge, threshold, diode, jumper, markers, engine.", None,

     "You checked tiny_antenna: n1 ratio 25; n3 diode; 1 marker; jumper clears n1.",

     "Natural next: learn_power."),

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



1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_antenna.json`.

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



**learn_antenna** teaches antenna rule check literacy — metal/gate area, ratio, charge, threshold, diode protection, jumper break, markers, and a tiny antenna engine.



**Prerequisite:** [learn_erc](../learn_erc/README.md) or netlist/ERC literacy. **Next:** [learn_power](../learn_power/README.md).



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



→ **learn_power** ([`eda.md`](../../../eda.md))



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

                  "## Slide 4 — Toy layout", "",

                  "tiny_antenna: n1 ratio 25, n3 diode, jumper breaks n1 metal → 1 marker.", "",

                  "## Slide 5 — Path", "",

                  "Metal → gate → ratio → charge → threshold → diode → jumper → markers → engine.", "",

                  "## Slide 6 — Begin", "", "Next: metal area per net.", ""]

    elif m["kind"] == "wrap":

        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",

                  "## Slide 4 — Goldens", "",

                  "n1 ratio 25; raw viol=2; after diode=1; marker=1; jumper n1=0; engine ok.", "",

                  "## Slide 5 — Next steps", "", m["idea"], "",

                  "## Slide 6 — Close", "", "Mark the wrap done when you can explain diode and jumper fixes.", ""]

    else:

        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",

                  "## Slide 4 — Commands", "",

                  "python3 -c \"from solvers import antenna_compare; print(antenna_compare())\" in common/", "",

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

            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_erc", "learn_power", "learn_drc"], "answer": 0},

            {"id": "q3", "question": "marker_count golden?", "choices": ["1", "2", "5", "0"], "answer": 0},

        ]

    return {"module": m["id"], "questions": items}





def main() -> None:

    modules = parse_modules()

    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")



    rows = ["# learn_antenna — module index", "",

            "| Id | Kind | Title | Lab | Status |",

            "|----|------|-------|-----|--------|"]

    for m in modules:

        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")

        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")

    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))

    write(ROOT / "docs" / "SCOPE.md",

          "# Scope\n\nAntenna rule check literacy: metal/gate area, ratio, charge accumulation, "

          "threshold rules, diode protection, jumper layer break, marker collection, tiny antenna_engine.\n"

          "In: layout metal/gate → ratio/charge → violations → markers → engine goldens on tiny_antenna.\n"

          "Out: full foundry antenna decks, complex diode rules, layout DRC (see learn_drc).\n")

    write(ROOT / "docs" / "TWO_TRACKS.md",

          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_antenna.json`\n"

          "- **B:** platform `#antenna` browser tools\n")

    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]

    for m in modules:

        if m["kind"] == "lab":

            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")

    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))



    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)

    write(ROOT / "README.md", f"""# learn_antenna



[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)

[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)

[![Domain](https://img.shields.io/badge/domain-Antenna-orange)](docs/MODULES.md)



**learn_antenna** is the open learning path for *antenna rule checks* — metal/gate area, ratio, charge, threshold, diode protection, jumper break, markers, and a tiny antenna engine on `tiny_antenna.json`.



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



Open [platform courses](../../platform/courses/learn_antenna/) after publish, or work Track A under `common/`.



## Author: publish or update



```bash

python3 courses/learn_antenna/scripts/scaffold_course.py

bash courses/learn_antenna/scripts/capture_all_walkthroughs.sh

bash courses/learn_antenna/scripts/capture_lab_snaps.sh

bash courses/learn_antenna/scripts/build_all_media.sh

python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_antenna --modules

```



## Two learning tracks



| Track | Path |

|-------|------|

| A Implement | [`common/`](common/) |

| B Browser | platform tools `#antenna` |



See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).



## Module landings



| Module | README |

|--------|--------|

{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}



Full table: [docs/MODULES.md](docs/MODULES.md).



## Browser labs



http://127.0.0.1:8080/tools/index.html#antenna



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

                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_antenna.json`.\n")

            ex = d / "examples"

            ex.mkdir(parents=True, exist_ok=True)

            src = ROOT / "common" / "tiny_antenna.json"

            if src.is_file():

                shutil.copy(src, ex / "tiny_antenna.json")



    scripts = ROOT / "scripts"

    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"

source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"

cd "$ROOT"

bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"

python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_antenna

echo Done: "$COURSE_DIR"

""")

    labs = [m["id"] for m in modules if m["kind"] == "lab"]

    write(scripts / "capture_all_walkthroughs.sh",

          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"

          + "\n".join(

              f'echo "=== {mid} ==="\n'

              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '

              f'"courses/learn_antenna/{mid}" --inject-transcript'

              for mid in labs)

          + "\necho CAPTURE_OK\n")

    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash

set -euo pipefail

cd /mnt/d/proj/designs/eda_learning

for m in courses/learn_antenna/module*/; do

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

