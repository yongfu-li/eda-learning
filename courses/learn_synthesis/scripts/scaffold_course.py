#!/usr/bin/env python3
"""Scaffold learn_synthesis with module-slides stubs."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"

# (id, kind, title, short, lab, outcomes, algorithm, hook, idea, walk[5], browser, impl, pitfalls, next, pseudo)
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to logic synthesis for EDA", "Welcome", None,
     "Explain AIG-based synthesis: rewrite, cuts, techmap, area/delay.", None,
     "RTL becomes gates through logic synthesis: build an AIG, rewrite, map to a library.",
     "This course uses a tiny AIG for f = (~(a∧b) ∧ c) ∧ (a∧c) with a six-cell library."),
    ("module01-01-boolean-network", "lab", "Boolean network / subject graph", "Boolean net", "boolean-network",
     "Read the subject graph: PIs, AND nodes, PO edge complements.",
     "boolean network as AIG subject graph",
     "Synthesis starts from a technology-independent subject graph.",
     "Our subject graph is an And-Inverter Graph: AND nodes with optional complemented edges.",
     [("Graph", "01-graph", "Seven nodes: three PIs, four ANDs, one PO f."),
      ("PIs", "02-pis", "Primary inputs a, b, c sit at the top."),
      ("AND boxes", "03-ands", "Green boxes are AND2 nodes in the AIG."),
      ("Bubbles", "04-comp", "Purple dots mark complemented fanins."),
      ("PO", "05-po", "Node 7 drives output f.")],
     "Open **boolean-network**. Click nodes; toggle PIs and watch f.",
     "Load tiny_synth.json; print aig_stats.",
     "Treating INV as a separate AIG node type. Ignoring complement bubbles.",
     "Next: AIG node types in detail.",
     "stats ← count PI, AND, PO"),
    ("module01-03-aig-nodes", "lab", "And-Inverter Graph nodes", "AIG nodes", "aig-nodes",
     "Identify PI, AND, complemented fanin, and PO on the toy AIG.",
     "AIG node kinds and complemented edges",
     "AIGs use only AND + optional edge complement — not arbitrary gates yet.",
     "Each AND has two fanins (id, complemented). Evaluate bottom-up with bitwise AND.",
     [("Kinds", "01-kinds", "PI circles vs AND rectangles."),
      ("Fanin", "02-fanin", "Node 5 takes ~4 and c."),
      ("Eval", "03-eval", "With a=1,b=0,c=1 the PO f equals 1."),
      ("Select", "04-sel", "Select node 5 to highlight fanins."),
      ("Count", "05-count", "GOLDENS: 3 PI, 4 AND, 1 PO.")],
     "Open **aig-nodes**. Toggle to a=1,b=1,c=1 and confirm f=0.",
     "Call output_value for assignments (1,0,1) and (1,1,1).",
     "Evaluating complemented edges wrongly. Mixing PI names with ids.",
     "Next: structural hashing.",
     "values[and] ← val(in0) AND val(in1) with complements"),
    ("module02-01-aig-strash", "lab", "Structural hashing (strash)", "Strash", "aig-strash",
     "Build a structural hash table keyed by sorted AND fanin literals.",
     "AIG structural hashing",
     "Strash reuses identical AND structures so the graph stays compact.",
     "Canonical key sorts the two literals; table maps key → node id.",
     [("Table", "01-table", "Four AND nodes → four strash entries on the toy."),
      ("Key", "02-key", "Key orders fanin literals so AND(a,b)=AND(b,a)."),
      ("Lookup", "03-lookup", "Identical fanins would hit the same entry."),
      ("No dup", "04-dup", "Toy has no duplicate keys."),
      ("Why", "05-why", "Strash is the first cleanup before rewrite.")],
     "Open **aig-strash**. Confirm strash entries = 4.",
     "Call build_strash_table; assert len==4.",
     "Forgetting to sort fanins. Hashing node id instead of literals.",
     "Next: local rewrite opportunities.",
     "key ← sorted(lit0, lit1); table[key]=node"),
    ("module02-03-rewrite-local", "lab", "Local AIG rewrite", "Rewrite", "rewrite-local",
     "Detect rewrite opportunities (complements, AND children) and both-comp → NOR mapping hints.",
     "local AIG rewrite / inverter push lite",
     "Rewriting reshapes the AIG before mapping without changing function.",
     "Count nodes with complemented edges or AND children; flag AND(~x,~y) as NOR-friendly.",
     [("Opportunities", "01-opp", "Several AND nodes qualify as rewrite candidates."),
      ("Both comp", "02-both", "AND(~, ~) is a NOR mapping hint."),
      ("Push", "03-push", "Inverter-push report lists those nodes."),
      ("Preserve", "04-fn", "Function f stays the same under rewrite bookkeeping."),
      ("Map later", "05-map", "Techmap will use NOR2 when both comps appear.")],
     "Open **rewrite-local**. Read rewrite opportunity count.",
     "Call local_rewrite_count and apply_inverter_push.",
     "Mutating function accidentally. Counting PIs as rewrite targets.",
     "Next: k-feasible cuts.",
     "if both fanins complemented: suggest NOR mapping"),
    ("module02-05-cut-enumeration", "lab", "K-feasible cut enumeration", "Cuts", "cut-enumeration",
     "Enumerate k-feasible cuts bottom-up for each AIG node.",
     "k-feasible cut enumeration",
     "Cuts describe which leaves a subgraph may stand on for techmapping.",
     "PI cut={self}. AND cuts = unions of fanin cuts with size ≤ k, plus trivial {self}.",
     [("K=3", "01-k", "Toy uses cut_k=3."),
      ("PI cuts", "02-pi", "Each PI has a single cut."),
      ("Combine", "03-comb", "AND cuts combine child cuts under the k limit."),
      ("PO cuts", "04-po", "Node 7 lists several feasible cuts."),
      ("Stats", "05-stats", "total_cuts grows with graph depth.")],
     "Open **cut-enumeration**. Click Enumerate cuts; select node 7.",
     "Call enumerate_cuts(k=3); assert all |cut|≤3.",
     "Allowing cuts larger than k. Forgetting the trivial cut.",
     "Next: the cell library.",
     "cuts[n] ← { {n} } ∪ { c1∪c2 : |c1∪c2|≤k }"),
    ("module02-07-library-cells", "lab", "Cell library for mapping", "Library", "library-cells",
     "Read area/delay/inputs for INV, BUF, NAND2, NOR2, AND2, AOI21.",
     "tech library characterization lite",
     "Techmapping chooses library cells that cover AIG cuts.",
     "Six cells: area and delay costs; INV for complemented edges.",
     [("Six cells", "01-six", "Library size is six."),
      ("AND2", "02-and2", "AND2 area=2 delay=2."),
      ("NOR2", "03-nor2", "NOR2 covers AND(~,~)."),
      ("INV", "04-inv", "INV area=1 for edge bubbles."),
      ("AOI21", "05-aoi", "AOI21 is available for richer covers (toy).")],
     "Open **library-cells**. Confirm six cells; run techmap and see cell ids.",
     "Print data['library']; assert len==6.",
     "Ignoring area when comparing. Mapping without INV cost.",
     "Next: area-oriented techmap cover.",
     "cell ← {id, area, delay, inputs}"),
    ("module03-01-techmap-cover", "lab", "Techmapping cover (area)", "Techmap", "techmap-cover",
     "Map each AND to AND2/NOR2 and charge INV for complemented edges; report area.",
     "greedy area techmapping lite",
     "A cover assigns a library cell to each subject node (or cut).",
     "Greedy: AND→AND2, AND(~,~)→NOR2, plus INV per complemented edge; sum areas.",
     [("Run", "01-run", "Techmap area paints orange cells on ANDs."),
      ("Area", "02-area", "Total area includes AND cells plus INVs."),
      ("NOR", "03-nor", "Both-comp nodes prefer NOR2."),
      ("Inv", "04-inv", "Complement bubbles add INV area."),
      ("Cuts", "05-cuts", "Cut stats travel with the mapping report.")],
     "Open **techmap-cover**. Click Techmap area; read total area.",
     "Call techmap_area; assert area ≥ mapAreaMin.",
     "Forgetting INV cost. Mapping PIs to gates.",
     "Next: area vs delay tradeoff.",
     "for each AND: pick AND2 or NOR2; area += cell + INVs"),
    ("module03-03-area-delay", "lab", "Area vs delay tradeoff", "Area/delay", "area-delay",
     "Compare area-mode and delay-mode metrics on the same AIG.",
     "area/delay tradeoff reporting",
     "Mappers optimize different objectives: area, delay, or a blend.",
     "area_mode reports area + delay_sum; delay_mode reports depth×AND delay.",
     [("Trade", "01-trade", "Two modes share the same cover on this toy."),
      ("Area mode", "02-area", "Sum of cell areas (plus INV)."),
      ("Delay mode", "03-delay", "Depth proxy = #AND × AND2 delay."),
      ("Library", "04-lib", "Six cells bound the choice set."),
      ("Choice", "05-choice", "Real flows weight the two; we just report both.")],
     "Open **area-delay**. Run both techmap buttons; compare metrics.",
     "Call area_delay_tradeoff; print both modes.",
     "Treating delay_sum as critical path blindly. Ignoring depth.",
     "Next: full sequential synth pass.",
     "report area_mode and delay_mode side by side"),
    ("module04-01-sequential-synth", "lab", "Sequential synthesis pass", "Sequential", "sequential-synth",
     "Run stats → strash → rewrite → cuts → techmap as one pipeline.",
     "sequential synthesis pipeline",
     "A full pass chains cleanup and mapping like a tiny ABC script.",
     "sequential_synth returns stats, strash size, rewrite, cuts, mapping, tradeoff.",
     [("Pipeline", "01-pipe", "One click runs the full toy flow."),
      ("Stats", "02-stats", "PI/AND/PO match goldens."),
      ("Map", "03-map", "Orange cells after sequential synth."),
      ("Area", "04-area", "Mapped area is positive."),
      ("Done", "05-done", "Next: offline compare, then wrap toward STA.")],
     "Open **sequential-synth**. Click Sequential synth; confirm area and cuts.",
     "Call sequential_synth(data); assert mapping.area > 0.",
     "Skipping strash. Mixing delay and area covers without clearing.",
     "Next: offline benchmark, then wrap.",
     "return {stats, strash, rewrite, cuts, mapping, tradeoff}"),
    ("module05-01-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline", None,
     "Compare area vs delay reports offline on tiny_synth.", None,
     "Track A prints sequential_synth metrics without the browser.",
     "Load JSON; print area_mode vs delay_mode and cut totals."),
    ("module99-00-wrap", "wrap", "Logic synthesis path complete", "Wrap", None,
     "Recap AIG, strash, rewrite, cuts, techmap; continue to STA or retiming.", None,
     "You built a tiny ABC-style loop on one AIG.",
     "Natural next: learn_sta (already ready) or learn_retiming / learn_equivalence."),
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
            "status": "**ref**" if row[1] == "lab" else ("P" if row[1] == "offline" else "—"),
        }
        if row[1] == "lab":
            m["walk"] = row[9]
            m["browser"] = row[10]
            m["impl"] = row[11]
            m["pitfalls"] = row[12]
            m["next"] = row[13]
            m["pseudo"] = f"## Pseudocode\n\n```text\n{row[14]}\n```\n"
        out.append(m)
    return out


def lab_readme(m, modules):
    idx = next(i for i, x in enumerate(modules) if x["id"] == m["id"])
    key = m["id"].replace("module", "")
    prev = modules[idx - 1] if idx else None
    nxt = modules[idx + 1] if idx + 1 < len(modules) else None
    nav = f"{('[← '+prev['short']+'](../'+prev['id']+'/README.md)') if prev else '← Start'} · [Course README](../README.md) · {('['+nxt['short']+' →](../'+nxt['id']+'/README.md)') if nxt else 'End →'}"
    media = "| Artifact | Path |\n|----------|------|\n| Transcript | [transcript.md](transcript.md) |\n| Outline | [outline.yaml](outline.yaml) |\n| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |\n| Video | [video.mp4](video.mp4) |\n| Quiz | [quiz.json](quiz.json) |\n"
    files = f"```\n{m['id']}/\n├── README.md · CHECKLIST.md · EXAMPLES.md\n├── outline.yaml · transcript.md · quiz.json\n└── (optional) examples/ · assets/\n```\n"
    if m["kind"] == "lab":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `lab` · Primary lab: `{m['lab']}` · **ref**

{nav}

## Outcomes

After this module you can: **{m['outcomes']}**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_synth.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `./scripts/module.sh {key} --check`

### Track B — Browser lab (online)

1. Local: http://127.0.0.1:8080/tools/{m['lab']}/
2. Live: {LIVE}/{m['lab']}/
3. Load the starter AIG, run tools, Check challenges.

> Concept labs teach synthesis literacy — not production ABC/Yosys.

## Media

{media}

## Files

{files}
"""
    if m["kind"] == "intro":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `intro` · Dual-track course welcome

{nav}

## What this course is

**learn_synthesis** teaches *AIG rewrite, cuts, and techmapping* with two tracks.

| Track | Where |
|-------|-------|
| **A** | `common/` |
| **B** | platform tools `#synthesis` |

**Next after this course:** [learn_sta](../learn_sta/README.md) (ready) or [learn_retiming](../learn_retiming/README.md).

## Setup (Track B)

`python3 -m http.server 8080 --directory platform` → http://127.0.0.1:8080/tools/#synthesis

## Media

{media}

## Files

{files}
"""
    if m["kind"] == "wrap":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `wrap`

{nav}

## Outcomes

**{m['outcomes']}**

## Next

→ **learn_sta** or **learn_retiming** / **learn_equivalence** ([`eda.md`](../../../eda.md))

## Media

{media}

## Files

{files}
"""
    return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `offline`

{nav}

## Outcomes

**{m['outcomes']}**

## Track A

Load `../common/tiny_synth.json` and print `sequential_synth` metrics.

## Media

{media}

## Files

{files}
"""


def transcript(m):
    if m["kind"] != "lab":
        parts = [f"# {m['title']}", "", f"**Module id:** {m['id']}", "**Tracks:** A", ""]
        for i, (t, b) in enumerate([
            ("Hook", m["hook"]), ("The idea", m["idea"]), ("What you will do", m["outcomes"]),
            ("Pitfalls", "Skipping goldens."), ("Your turn", "Complete the checklist."), ("Next", "Continue."),
        ], 1):
            parts += [f"## Slide {i} — {t}", "", b, ""]
        return "\n".join(parts)
    parts = [f"# {m['title']}", "", f"**Module id:** {m['id']}", f"**Lab:** {m['lab']}",
             "**Tracks:** A (implement) · B (browser lab)", "",
             f"## Slide 1 — {m['short']}", "", m["hook"], "",
             "## Slide 2 — The idea", "", m["idea"], "",
             "<!-- algorithm-walkthrough -->", ""]
    n = 3
    for title, img, cap in m["walk"]:
        parts += [f"## Slide {n} — {title}", "", f"![{title}](assets/steps/{img}.png)", "", cap, ""]
        n += 1
    parts += ["<!-- /algorithm-walkthrough -->", "", f"## Slide {n} — Browser lab track", "",
              "![Browser lab starter](assets/lab-starter.png)", "", m["browser"], ""]
    n += 1
    parts += [f"## Slide {n} — Implement track", "", m["impl"], ""]
    n += 1
    parts += [f"## Slide {n} — Pitfalls", "", m["pitfalls"], ""]
    n += 1
    parts += [f"## Slide {n} — Your turn", "", m["next"], ""]
    return "\n".join(parts)


def main():
    modules = parse_modules()
    rows = "\n".join(f"| `{m['id'].replace('module','')}` | [{m['title']}]({m['id']}/README.md) | `{m['kind']}` |" for m in modules)
    labs = "\n".join(f"- [{m['lab']}]({LIVE}/{m['lab']}/)" for m in modules if m.get("lab"))
    write(ROOT / "README.md", f"""# learn_synthesis

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-synthesis-orange)](docs/MODULES.md)

**learn_synthesis** — AIG, structural hashing, rewrite, k-cuts, techmapping, area/delay.

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

```
learn_synthesis/
├── README.md · LICENSE · common/ · docs/ · scripts/ · module*/
```

## Browse or clone

```bash
cd courses/learn_synthesis
```

## Consume from the parent

Next: [learn_sta](../learn_sta/README.md) · [learn_retiming](../learn_retiming/README.md). Lane: [`eda.md`](../../eda.md).

## Author: publish or update

```bash
python3 courses/learn_synthesis/scripts/scaffold_course.py
bash courses/learn_synthesis/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_synthesis
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_synthesis --modules
```

## Two learning tracks

| Track | Where |
|-------|-------|
| **A** | `common/` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
| **B** | platform `#synthesis` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |

## Module landings

| Key | Module | Kind |
|-----|--------|------|
{rows}

## Browser labs

{labs}

## License

[CC BY 4.0](LICENSE)
""")
    write(ROOT / "LICENSE", "CC BY 4.0\n")
    md_rows = "\n".join(
        f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | "
        f"{('`'+m['lab']+'`') if m.get('lab') else ('offline' if m['kind']=='offline' else '—')} | {m['status']} |"
        for m in modules
    )
    write(ROOT / "docs" / "MODULES.md", f"# learn_synthesis — module index\n\n| Id | Kind | Title | Lab | Status |\n|----|------|-------|-----|--------|\n{md_rows}\n")
    write(ROOT / "docs" / "SCOPE.md", "# Scope\n\n**In:** AIG, strash, rewrite lite, k-cuts, techmap area/delay, library.\n\n**Out:** Full ABC, FPGA LUT-map, sequential retiming (see learn_retiming), formal EQ.\n")
    write(ROOT / "docs" / "TWO_TRACKS.md", "# Two tracks\n\n| A | `common/tiny_synth.json`, solvers |\n| B | `platform/tools/<lab>/` + walkthrough |\n")
    wrows = "\n".join(f"| `{m['lab']}` | `{m['id']}` | 5 |" for m in modules if m.get("lab"))
    write(ROOT / "docs" / "WALKTHROUGHS.md", f"# Walkthroughs\n\n| Lab | Module | Steps |\n|-----|--------|-------|\n{wrows}\n")
    tiny = (ROOT / "common" / "tiny_synth.json").read_text(encoding="utf-8")
    for m in modules:
        d = ROOT / m["id"]
        write(d / "README.md", lab_readme(m, modules))
        write(d / "CHECKLIST.md", f"# Checklist — {m['title']}\n\n- [ ] {m['outcomes']}\n" + (f"- [ ] Cleared `{m['lab']}`\n" if m.get("lab") else ""))
        ex = f"# Examples — {m['title']}\n\n1. Load tiny_synth.json\n2. {m['outcomes']}\n\n"
        if m.get("pseudo"):
            ex += m["pseudo"]
        write(d / "EXAMPLES.md", ex)
        write(d / "transcript.md", transcript(m))
        write(d / "outline.yaml", f"title: {m['short']}\nfooter: learn_synthesis\nslides: []\n")
        items = [
            {"q": f"Goal of {m['title']}?", "choices": [m["outcomes"][:80], "Ignore AIG", "Only CTS", "Skip techmap"], "answer": 0},
            {"q": "Toy AIG has how many AND nodes?", "choices": ["4", "1", "10", "0"], "answer": 0},
            {"q": "Techmap uses a…", "choices": ["cell library", "GCell grid", "clock tree", "PDN"], "answer": 0},
        ]
        if m.get("lab"):
            items.append({"q": "Lab id?", "choices": [m["lab"], "h-tree", "wire-rc", "lee-maze"], "answer": 0})
        items.append({"q": "Natural next course?", "choices": ["learn_sta", "learn_unix", "learn_git", "learn_drc"], "answer": 0})
        write(d / "quiz.json", json.dumps({"module": m["id"], "items": items}, indent=2) + "\n")
        if m.get("lab"):
            write(d / "examples" / "tiny_synth.json", tiny)

    labs = " \\\n  ".join(m["id"] for m in modules if m.get("lab"))
    write(ROOT / "scripts" / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_synthesis
echo Done: "$COURSE_DIR"
""")
    write(ROOT / "scripts" / "capture_all_walkthroughs.sh", f"""#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in \\
  {labs}
do
  echo "=== $m ==="
  python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_synthesis/$m" --inject-transcript
done
echo CAPTURE_OK
""")
    write(ROOT / "scripts" / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_synthesis/module*/; do
  base=$(basename "$m")
  case "$base" in module00-*|module05-*|module99-*) continue ;; esac
  python3 .cursor/skills/module-slides/scripts/capture_lab_snapshot.py "$m" || true
done
echo LAB_SNAPS_OK
""")
    write(ROOT / "scripts" / "smoke_walkthrough.py", """#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
ALGOS = ["boolean-network","aig-nodes","aig-strash","rewrite-local","cut-enumeration",
         "library-cells","techmap-cover","area-delay","sequential-synth"]
def main():
    errs=[]
    with sync_playwright() as p:
        b=p.chromium.launch(); page=b.new_page()
        page.on("pageerror", lambda e: errs.append(str(e)))
        for a in ALGOS:
            for s in range(1,6):
                page.goto(f"http://127.0.0.1:8080/tools/algorithm-walkthrough/?algo={a}&step={s}", wait_until="networkidle")
                page.wait_for_selector("#walk-frame[data-ready='1']", timeout=15000)
                print(f"ok {a} step {s}")
                if errs:
                    print(errs); return 1
        b.close()
    print("WALK_SMOKE_OK"); return 0
if __name__ == "__main__":
    raise SystemExit(main())
""")
    write(ROOT / "scripts" / "module.sh", """#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 -c "import sys; sys.path.insert(0,'$ROOT/common'); from solvers import sequential_synth; from synthutil import load; print(sequential_synth(load('$ROOT/common/tiny_synth.json'))['mapping']['area'])"
""")
    print(f"Scaffolded {len(modules)} modules")


if __name__ == "__main__":
    main()
