#!/usr/bin/env python3
"""Scaffold learn_drc with module-slides stubs. Lab status **ref**."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"
COURSE = "learn_drc"

# id, kind, title, short, lab, outcomes, algorithm, hook, idea,
# walk[5], browser, impl, pitfalls, next, pseudo, quiz
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to DRC", "Welcome", None,
     "Explain design rule checks on a tiny layout after pattern-matching literacy.",
     None,
     "After pattern matching you still need a rule deck — width, spacing, enclosure, boolean, violations.",
     "Toy tiny_drc: five shapes + eight rules → three geometry violations + one boolean hit."),
    ("module01-01-rule-deck", "lab", "Rule deck load", "Rule deck", "rule-deck",
     "Load the DRC rule deck; count rules by type and layer.",
     "rule deck load",
     "DRC starts from a rule deck — typed rules with limits on each layer.",
     "GOLDEN: rule_count=8.",
     [("Deck", "01-deck", "Eight rules in the tiny_drc deck."),
      ("Types", "02-types", "width, space, enclosure, boolean rule types."),
      ("Layers", "03-layers", "Rules reference M1, M2, and VIA layers."),
      ("Load", "04-load", "load_deck returns rules and by_type buckets."),
      ("Count", "05-count", "GOLDEN: rule_count=8.")],
     "Open **rule-deck**. Inspect the deck; confirm 8 rules.",
     "Call load_deck(); assert rule_count==8.",
     "Counting shapes as rules. Ignoring boolean rules in the total.",
     "Next: width checker.",
     "deck ← load(tiny_drc); rule_count ← |deck.rules|",
     [{"q": "rule_count golden?", "choices": ["8", "5", "3", "12"], "answer": 0},
      {"q": "width rules?", "choices": ["3", "2", "8", "1"], "answer": 0},
      {"q": "Deck layer count?", "choices": ["3", "5", "8", "2"], "answer": 0}]),
    ("module01-03-width-checker", "lab", "Width checker", "Width", "width-checker",
     "Run width rules; find shapes thinner than the limit.",
     "width checker",
     "Width rules flag shapes whose min(width,height) is below the deck limit.",
     "GOLDEN: width viol=1 on D, rule W.M1.",
     [("Rule", "01-rule", "W.M1 width limit 3 on M1 layer."),
      ("Scan", "02-scan", "Walk M1 shapes A, B, and D."),
      ("Measure", "03-measure", "Compare min(width,height) to limit."),
      ("Hit", "04-hit", "Shape D is too narrow — width=1."),
      ("Golden", "05-golden", "GOLDEN: width viol=1, rule W.M1.")],
     "Open **width-checker**. Select D; run width check.",
     "Call check_width(); assert count==1 and violations[0].shapes==['D'].",
     "Using max edge instead of min dimension. Missing rule_id on violations.",
     "Next: spacing checker.",
     "for each width rule on layer: if min(w,h) < limit → violation(rule_id, shape)",
     [{"q": "width violation count?", "choices": ["1", "0", "2", "3"], "answer": 0},
      {"q": "Violating shape?", "choices": ["D", "A", "B", "V"], "answer": 0},
      {"q": "Golden rule id?", "choices": ["W.M1", "S.M1", "E.VIA_M2", "B.VIA_M1_not_M2"], "answer": 0}]),
    ("module01-05-spacing-checker", "lab", "Spacing checker", "Spacing", "spacing-checker",
     "Run spacing rules; find same-layer pairs closer than the limit.",
     "spacing checker",
     "Spacing rules compare horizontal gaps between overlapping-y shapes.",
     "GOLDEN: space=1 A–B, rule S.M1.",
     [("Rule", "01-rule", "S.M1 spacing limit 2 on M1."),
      ("Pairs", "02-pairs", "Compare M1 pairs with y-projection overlap."),
      ("Gap", "03-gap", "horiz_gap A–B equals 1, below limit 2."),
      ("Hit", "04-hit", "Shapes A and B violate S.M1."),
      ("Golden", "05-golden", "GOLDEN: space=1 A–B, rule S.M1.")],
     "Open **spacing-checker**. Select A and B; run spacing check.",
     "Call check_spacing(); assert count==1 and set(shapes)=={'A','B'}.",
     "Measuring vertical gap when shapes are side-by-side. Ignoring y overlap requirement.",
     "Next: enclosure checker.",
     "for each space rule: for overlapping-y pairs: if horiz_gap < limit → violation",
     [{"q": "space violation count?", "choices": ["1", "0", "2", "3"], "answer": 0},
      {"q": "Violating pair?", "choices": ["A–B", "A–D", "B–C", "D–V"], "answer": 0},
      {"q": "Golden rule id?", "choices": ["S.M1", "W.M1", "E.VIA_M1", "S.M2"], "answer": 0}]),
    ("module02-01-enclosure-checker", "lab", "Enclosure checker", "Enclosure", "enclosure-checker",
     "Run enclosure rules; inner shape must sit inside outer with margin.",
     "enclosure checker",
     "Enclosure rules require VIA (inner) to sit inside metal (outer) by a margin.",
     "GOLDEN: enc=1 V vs M2, E.VIA_M2.",
     [("Rule", "01-rule", "E.VIA_M2: VIA inside M2 by limit 1."),
      ("VIA", "02-via", "Inner shape V on VIA layer."),
      ("M2", "03-m2", "Outer M2 shape C should enclose V."),
      ("Margin", "04-margin", "V is not enclosed by M2 — violation."),
      ("Golden", "05-golden", "GOLDEN: enc=1 V vs M2, E.VIA_M2.")],
     "Open **enclosure-checker**. Select V; run enclosure check.",
     "Call check_enclosure(); assert count==1 and inner=='V'.",
     "Checking M1 enclosure when M2 is the failing outer. Using overlap instead of contains.",
     "Next: collect violation markers.",
     "for each enclosure rule: inner must be contained in outer with margin ≥ limit",
     [{"q": "enclosure violation count?", "choices": ["1", "0", "2", "3"], "answer": 0},
      {"q": "Inner shape?", "choices": ["V", "D", "A", "C"], "answer": 0},
      {"q": "Golden rule id?", "choices": ["E.VIA_M2", "E.VIA_M1", "S.M1", "W.M1"], "answer": 0}]),
    ("module02-03-violation-markers", "lab", "DRC violations", "Violations", "violation-markers",
     "Collect width, spacing, and enclosure violations with rule_id.",
     "DRC violation collection",
     "Signoff DRC emits markers — one record per geometry violation with rule_id.",
     "GOLDEN: violation_count=3 with rule_id.",
     [("Width m", "01-width", "Width violation marker on D (W.M1)."),
      ("Space m", "02-space", "Spacing marker on shapes A and B (S.M1)."),
      ("Enc m", "03-enc", "Enclosure marker on V (E.VIA_M2)."),
      ("Rule id", "04-rule", "Each violation carries a rule_id field."),
      ("Golden", "05-golden", "GOLDEN: violation_count=3 with rule_id.")],
     "Open **violation-markers**. Run collect; confirm 3 violations.",
     "Call collect_violations(); assert count==3 and all have rule_id.",
     "Double-counting boolean hits as geometry violations. Missing rule_id field.",
     "Next: multi-layer deck rules.",
     "markers ← width ∪ space ∪ enclosure violations (each with rule_id)",
     [{"q": "violation_count?", "choices": ["3", "1", "4", "8"], "answer": 0},
      {"q": "Includes width on D?", "choices": ["yes", "no", "only space", "only enc"], "answer": 0},
      {"q": "Each has rule_id?", "choices": ["yes", "no", "optional", "deck only"], "answer": 0}]),
    ("module03-01-multi-layer-deck", "lab", "Multi-layer rule deck", "Multi-layer", "multi-layer-deck",
     "Identify cross-layer enclosure and boolean rules in the deck.",
     "multi-layer deck rules",
     "Real decks span layers — enclosure and boolean tie VIA to M1/M2.",
     "GOLDEN: 2 enclosure rules; fires E.VIA_M2.",
     [("Cross", "01-cross", "Deck rules span M1, M2, and VIA."),
      ("Enc rules", "02-enc", "Two enclosure rules: E.VIA_M1 and E.VIA_M2."),
      ("Boolean", "03-bool", "B.VIA_M1_not_M2 boolean rule on VIA."),
      ("Fire", "04-fire", "E.VIA_M2 fires — V not enclosed by M2."),
      ("Golden", "05-golden", "GOLDEN: 2 enclosure rules; fires E.VIA_M2.")],
     "Open **multi-layer-deck**. Run multi-layer view; confirm E.VIA_M2 fires.",
     "Call multi_layer_rules(); assert enclosure_count==2 and fires count==1.",
     "Counting width rules as cross-layer. Ignoring boolean deck entries.",
     "Next: deck boolean rules.",
     "enc_rules ← deck[type=enclosure]; fires ← check_enclosure(deck)",
     [{"q": "enclosure rule count?", "choices": ["2", "1", "3", "8"], "answer": 0},
      {"q": "Firing rule?", "choices": ["E.VIA_M2", "E.VIA_M1", "W.M1", "S.M2"], "answer": 0},
      {"q": "Includes boolean?", "choices": ["yes", "no", "width only", "M1 only"], "answer": 0}]),
    ("module03-03-deck-boolean", "lab", "Deck boolean rules", "Boolean", "deck-boolean",
     "Run deck boolean and_not: VIA in M1 but not M2.",
     "deck boolean rules",
     "Boolean deck rules express layer interactions — VIA covered by M1 and not M2.",
     "GOLDEN: boolean hit=1 on V.",
     [("Rule", "01-rule", "and_not: VIA in M1 must_not overlap M2."),
      ("VIA", "02-via", "Inner shape V on VIA layer."),
      ("M1", "03-m1", "V overlaps M1 shape A."),
      ("M2", "04-m2", "V does not overlap M2 shape C."),
      ("Golden", "05-golden", "GOLDEN: boolean hit=1 on V.")],
     "Open **deck-boolean**. Select V; run boolean check.",
     "Call check_boolean(); assert count==1 and hits[0].shapes==['V'].",
     "Treating enclosure failures as boolean hits. Requiring full containment for overlap.",
     "Next: DRC engine integration.",
     "hit ← VIA overlaps must layer ∧ ¬ overlaps must_not layer",
     [{"q": "boolean hit count?", "choices": ["1", "0", "2", "3"], "answer": 0},
      {"q": "Hit shape?", "choices": ["V", "A", "C", "D"], "answer": 0},
      {"q": "Rule mode?", "choices": ["and_not", "and", "or", "xor"], "answer": 0}]),
    ("module04-01-drc-engine", "lab", "DRC engine pass", "Engine", "drc-engine",
     "Run drc_engine; confirm all goldens and ok=True.",
     "DRC engine integration",
     "A tiny engine chains every checker and reports ok when goldens match.",
     "GOLDEN: ok=True viol=3.",
     [("Deck", "01-deck", "Load deck rule_count=8."),
      ("Checks", "02-checks", "Run width, space, and enclosure checkers."),
      ("Viol", "03-viol", "Collect geometry violations count=3."),
      ("Bool", "04-bool", "Boolean hit=1 on V (separate from viol count)."),
      ("OK", "05-ok", "GOLDEN: ok=True viol=3.")],
     "Open **drc-engine**. Run engine; confirm ok.",
     "Call drc_engine(); assert ok and violations.count==3.",
     "Reporting partial checks. Changing the toy without updating goldens.",
     "Next: offline compare, then wrap.",
     "engine: deck + checks → violations; ok ← counts match GOLDENS",
     [{"q": "engine ok?", "choices": ["True", "False", "unknown", "N/A"], "answer": 0},
      {"q": "violation_count?", "choices": ["3", "1", "4", "8"], "answer": 0},
      {"q": "Engine includes boolean?", "choices": ["yes", "no", "violations only", "deck only"], "answer": 0}]),
    ("module05-01-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline compare", None,
     "Print drc_compare metrics offline without the browser.", None,
     "Track A prints drc_compare without the browser.",
     "Load tiny_drc.json; print rule_count, violation_count, boolean_hits, ok."),
    ("module99-00-wrap", "wrap", "DRC path complete", "Wrap", None,
     "Recap deck, width, spacing, enclosure, markers, multi-layer, boolean, engine.", None,
     "You checked tiny_drc: 8 rules; D width; A–B space; V enclosure; boolean hit; engine ok.",
     "Natural next: learn_lvs."),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_drc.json`.
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

**learn_drc** teaches design rule check literacy — rule deck load, width/spacing/enclosure checkers, violation markers, multi-layer rules, deck boolean, and a tiny DRC engine.

**Prerequisite:** [learn_pattern_matching](../learn_pattern_matching/README.md) or layout/pattern literacy. **Next:** [learn_lvs](../learn_lvs/README.md).

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

→ **learn_lvs** ([`eda.md`](../../../eda.md))

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
                  "tiny_drc: shapes A,B,D on M1; C on M2; V on VIA; eight-rule deck.", "",
                  "## Slide 5 — Path", "",
                  "Deck → width → spacing → enclosure → markers → multi-layer → boolean → engine.", "",
                  "## Slide 6 — Begin", "", "Next: rule deck load.", ""]
    elif m["kind"] == "wrap":
        lines += ["## Slide 3 — Recap", "", m["outcomes"], "",
                  "## Slide 4 — Goldens", "",
                  "8 rules; D width; A–B space; V enclosure; boolean V; violations=3; engine ok.", "",
                  "## Slide 5 — Next steps", "", m["idea"], "",
                  "## Slide 6 — Close", "", "Mark the wrap done when you can list the three geometry violation kinds.", ""]
    else:
        lines += ["## Slide 3 — Why offline", "", m["outcomes"], "",
                  "## Slide 4 — Commands", "",
                  'python3 -c "from solvers import drc_compare; print(drc_compare())" in common/', "",
                  "## Slide 5 — What to compare", "", m["idea"], "",
                  "## Slide 6 — Next", "", "Continue to the wrap module.", ""]
    return "\n".join(lines)


def quiz(m):
    if m["kind"] == "lab":
        items = [{"id": f"q{i+1}", "question": q["q"], "choices": q["choices"], "answer": q["answer"]}
                 for i, q in enumerate(m["quiz_extra"])]
    else:
        items = [
            {"id": "q1", "question": f"Focus of {m['short']}?", "choices": [m["outcomes"][:60], "Place only", "CTS only", "ERC floating"], "answer": 0},
            {"id": "q2", "question": "Course id?", "choices": [COURSE, "learn_pattern_matching", "learn_lvs", "learn_erc"], "answer": 0},
            {"id": "q3", "question": "violation_count golden?", "choices": ["3", "1", "8", "0"], "answer": 0},
        ]
    return {"module": m["id"], "questions": items}


def main() -> None:
    modules = parse_modules()
    write(ROOT / "LICENSE", "Creative Commons Attribution 4.0 International (CC BY 4.0)\n")

    rows = ["# learn_drc — module index", "",
            "| Id | Kind | Title | Lab | Status |",
            "|----|------|-------|-----|--------|"]
    for m in modules:
        lab = f"`{m['lab']}`" if m["lab"] else ("offline" if m["kind"] == "offline" else "—")
        rows.append(f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | {lab} | {m['status']} |")
    write(ROOT / "docs" / "MODULES.md", "\n".join(rows))
    write(ROOT / "docs" / "SCOPE.md",
          "# Scope\n\nDesign rule check literacy: rule deck load, width/spacing/enclosure checkers, "
          "violation markers, multi-layer deck rules, deck boolean, tiny drc_engine.\n"
          "In: rule deck → geometry checkers → markers → engine goldens on tiny_drc.\n"
          "Out: full foundry DRC decks, hierarchical layout, LVS (see learn_lvs).\n")
    write(ROOT / "docs" / "TWO_TRACKS.md",
          "# Two tracks\n\n- **A:** `common/` Python solvers on `tiny_drc.json`\n"
          "- **B:** platform `#drc` browser tools\n")
    walk_rows = ["# Walkthroughs", "", "| Lab | Module | Steps |", "|-----|--------|-------|"]
    for m in modules:
        if m["kind"] == "lab":
            walk_rows.append(f"| `{m['lab']}` | `{m['id']}` | 5 |")
    write(ROOT / "docs" / "WALKTHROUGHS.md", "\n".join(walk_rows))

    toc = "\n".join(f"- [{m['title']}]({m['id']}/README.md)" for m in modules)
    write(ROOT / "README.md", f"""# learn_drc

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-DRC-orange)](docs/MODULES.md)

**learn_drc** is the open learning path for *design rule checks* — rule deck load, width/spacing/enclosure checkers, violation markers, multi-layer rules, deck boolean, and a tiny DRC engine on `tiny_drc.json`.

**Prerequisite:** [learn_pattern_matching](../learn_pattern_matching/README.md). **Next:** [learn_lvs](../learn_lvs/README.md).

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

Open [platform courses](../../platform/courses/learn_drc/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_drc/scripts/scaffold_course.py
bash courses/learn_drc/scripts/capture_all_walkthroughs.sh
bash courses/learn_drc/scripts/capture_lab_snaps.sh
bash courses/learn_drc/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_drc --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#drc` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
{chr(10).join(f"| `{m['id']}` | [{m['title']}]({m['id']}/README.md) |" for m in modules)}

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#drc

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
                  f"# Examples\n\n{m['pseudo']}\n\nUse `examples/tiny_drc.json`.\n")
            ex = d / "examples"
            ex.mkdir(parents=True, exist_ok=True)
            src = ROOT / "common" / "tiny_drc.json"
            if src.is_file():
                shutil.copy(src, ex / "tiny_drc.json")

    scripts = ROOT / "scripts"
    write(scripts / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_drc
echo Done: "$COURSE_DIR"
""")
    labs = [m["id"] for m in modules if m["kind"] == "lab"]
    write(scripts / "capture_all_walkthroughs.sh",
          "#!/usr/bin/env bash\nset -euo pipefail\ncd /mnt/d/proj/designs/eda_learning\n"
          + "\n".join(
              f'echo "=== {mid} ==="\n'
              f'python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py '
              f'"courses/learn_drc/{mid}" --inject-transcript'
              for mid in labs)
          + "\necho CAPTURE_OK\n")
    write(scripts / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_drc/module*/; do
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
    print(f"Scaffolded {len(modules)} modules → {ROOT}")


if __name__ == "__main__":
    main()
