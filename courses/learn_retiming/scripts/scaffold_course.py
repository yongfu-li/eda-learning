#!/usr/bin/env python3
"""Scaffold learn_retiming with module-slides stubs."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"

# (id, kind, title, short, lab, outcomes, algorithm, hook, idea, walk[5], browser, impl, pitfalls, next, pseudo, quiz_extra)
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to retiming for EDA", "Welcome", None,
     "Explain Leiserson–Saxe retiming: edge register counts, lag r(v), legal moves, clock period.",
     None,
     "After synthesis you have registers on edges — retiming moves them without changing I/O behavior.",
     "This course uses tiny_retime: PI u → a → b → c → PO v plus a→c; target clock period 5; baseline registers 2.",
     None, None, None, None, None, None, None),
    ("module01-01-sequential-graph", "lab", "Sequential circuit graph", "Seq graph", "sequential-graph",
     "Read the sequential graph: PI u, comb nodes a/b/c, PO v, and fanout edge a→c.",
     "sequential circuit graph literacy",
     "Retiming starts from a sequential circuit graph — not just a Boolean network.",
     "Nodes carry combinational delay; edges carry register counts w. Our toy has five nodes and five edges.",
     [("Topology", "01-topo", "PI u feeds a; main chain a→b→c→v; shortcut a→c."),
      ("Delays", "02-delay", "Delays: u=1, a=3, b=2, c=4, v=1."),
      ("Edges", "03-edges", "Five edges e0…e4; e0 u→a and e2 b→c hold registers."),
      ("Kinds", "04-kind", "PI u, PO v, comb boxes a/b/c."),
      ("Stats", "05-stats", "GOLDENS: 5 nodes, 5 edges, 3 comb nodes.")],
     "Open **sequential-graph**. Click nodes; read delay labels and edge ids.",
     "Load tiny_retime.json; call graph_stats — expect 5 nodes, 5 edges.",
     "Treating edge w as delay. Confusing PO v with a comb node.",
     "Next: edge register counts in detail.",
     "nodes ← PI/comb/PO; edges ← (src,dst,w)",
     [
         {"q": "How many comb nodes in tiny_retime?", "choices": ["3 (a,b,c)", "5", "2", "1"], "answer": 0},
         {"q": "Primary input id?", "choices": ["u", "a", "v", "e0"], "answer": 0},
         {"q": "Shortcut edge bypasses which node?", "choices": ["b (a→c)", "u", "v", "e3"], "answer": 0},
     ]),
    ("module01-03-register-count", "lab", "Edge register counts", "Registers", "register-count",
     "Sum edge weights w as register count; locate e0 and e2 as the two baseline registers.",
     "edge register count w on sequential edges",
     "In Leiserson–Saxe form, each edge weight w is how many registers sit on that wire.",
     "e0 u→a has w=1; e2 b→c has w=1; zero-weight edges are combinational.",
     [("e0", "01-e0", "e0 u→a: w=1 (one register)."),
      ("e2", "02-e2", "e2 b→c: w=1 (second register)."),
      ("Zero", "03-zero", "e1, e3, e4 have w=0 — pure comb paths."),
      ("Total", "04-total", "GOLDEN: baseline register count = 2."),
      ("Sum", "05-sum", "total_registers sums all edge w values.")],
     "Open **register-count**. Highlight e0 and e2; confirm total 2.",
     "Call total_registers(edges); assert sum == 2.",
     "Counting nodes instead of edges. Forgetting w on u→a.",
     "Next: zero-weight path delay / clock period.",
     "total ← Σ_e w(e); baseline GOLDEN = 2",
     [
         {"q": "Baseline register count on tiny_retime?", "choices": ["2", "5", "0", "8"], "answer": 0},
         {"q": "Which edge has w=1 on u→a?", "choices": ["e0", "e1", "e4", "e3"], "answer": 0},
         {"q": "Edge e1 a→b register count?", "choices": ["0", "1", "2", "-1"], "answer": 0},
     ]),
    ("module02-01-path-delay", "lab", "Zero-weight path delay", "Path delay", "path-delay",
     "Compute clock period as longest zero-weight path delay; baseline period GOLDEN = 8; target = 5.",
     "longest zero-weight path delay",
     "Clock period is the longest delay along paths that use only w=0 edges (registers break paths).",
     "Zero edges e1, e3, e4 form comb segments; longest chain a→b→c hits delays 3+2+4 → period 8.",
     [("Zero edges", "01-zero", "Only w=0 edges participate in the period path."),
      ("Chain", "02-chain", "Critical zero-weight chain runs a→b→c."),
      ("Delay sum", "03-sum", "Node delays on a→b→c: 3+2+4 — GOLDEN baseline period 8."),
      ("Target", "04-target", "clock_period_target = 5 — tighter than baseline 8."),
      ("Measure", "05-measure", "longest_zero_weight_path_delay returns 8.0 at r=0.")],
     "Open **path-delay**. Trace the critical zero-weight path; read period 8.",
     "Call clock_period(data, zero_retime(data)); assert ≈ 8.",
     "Including w=1 edges in the critical path. Summing edge delays instead of node delays.",
     "Next: forward retiming on node a.",
     "period ← max delay on paths using only w=0 edges; baseline=8",
     [
         {"q": "Baseline clock period (r=0)?", "choices": ["8", "5", "2", "10"], "answer": 0},
         {"q": "Target clock period in JSON?", "choices": ["5", "8", "2", "1"], "answer": 0},
         {"q": "Which edges have w=0?", "choices": ["e1, e3, e4", "e0, e2", "all five", "none"], "answer": 0},
     ]),
    ("module02-03-forward-retime", "lab", "Forward retiming", "Forward", "forward-retime",
     "Apply forward retime on a: r(a) decreases by 1; w_r = w + r(dst) − r(src); period drops to 5.",
     "forward retiming move on comb node",
     "Forward retiming pulls registers toward outputs — decrease r(v) on the chosen node.",
     "forward_retime('a', r, 1) sets r(a)=−1; e0 w_r becomes 0; e1/e4 gain registers.",
     [("Pick a", "01-pick", "Choose comb node a for forward retime."),
      ("Lag", "02-lag", "r(a) goes 0 → −1 (registers move forward)."),
      ("Formula", "03-formula", "w_r(e)=w(e)+r(dst)−r(src) on every edge."),
      ("e0", "04-e0", "e0 u→a: w_r = 1+(−1)−0 = 0."),
      ("Period", "05-period", "GOLDEN: legal move; period 8→5; registers 2→3.")],
     "Open **forward-retime**. Click Forward on a; read w_r labels and period 5.",
     "Call forward_retime('a', r, 1); print apply_retime edges and clock_period.",
     "Decreasing r on PI/PO. Applying forward on c first and breaking legality.",
     "Next: backward retiming on c.",
     "forward_retime(v,r,1): r[v] -= 1; recompute all w_r",
     [
         {"q": "After forward on a, r(a) equals?", "choices": ["−1", "0", "+1", "2"], "answer": 0},
         {"q": "Period after forward on a?", "choices": ["5", "8", "2", "10"], "answer": 0},
         {"q": "Register count after forward on a?", "choices": ["3", "2", "1", "0"], "answer": 0},
     ]),
    ("module02-05-backward-retime", "lab", "Backward retiming", "Backward", "backward-retime",
     "Apply backward retime on c: r(c) increases; e3 c→v gets w_r = −1 → illegal retiming.",
     "backward retiming move on comb node",
     "Backward retiming pushes registers toward inputs — increase r(v) on the chosen node.",
     "backward_retime('c', r, 1) sets r(c)=+1; e3 w_r = 0+0−1 = −1 violates w_r ≥ 0.",
     [("Pick c", "01-pick", "Choose node c for backward retime."),
      ("Lag up", "02-lag", "r(c) goes 0 → +1."),
      ("e3", "03-e3", "e3 c→v: w_r = 0 + r(v) − r(c) = −1."),
      ("Illegal", "04-bad", "Negative w_r → not a legal retiming."),
      ("Contrast", "05-contrast", "Forward on a was legal; backward on c is not on this toy.")],
     "Open **backward-retime**. Try Backward on c; see illegal flag on e3.",
     "Call backward_retime('c', r, 1); assert not is_legal(edges, r).",
     "Assuming backward is always safe. Ignoring PO-adjacent edges.",
     "Next: legal retiming check for all edges.",
     "backward_retime(v,r,1): r[v] += 1; legal iff all w_r ≥ 0",
     [
         {"q": "backward_retime on c makes e3 w_r?", "choices": ["−1 (illegal)", "0", "1", "2"], "answer": 0},
         {"q": "Backward retiming increases or decreases r(node)?", "choices": ["Increases r", "Decreases r", "Unchanged", "Resets to 0"], "answer": 0},
         {"q": "Legal retiming requires every w_r?", "choices": ["≥ 0", "= 1", "≤ 0", "even"], "answer": 0},
     ]),
    ("module02-07-legal-retime", "lab", "Legal retiming", "Legal", "legal-retime",
     "Verify is_legal: all retimed edge weights w_r ≥ 0; forward on a passes; backward on c fails.",
     "legal retiming predicate",
     "A retiming lag assignment r is legal only if every edge keeps a non-negative register count.",
     "Check w_r = w + r(dst) − r(src) for e0…e4; one negative edge breaks legality.",
     [("All edges", "01-all", "Inspect w_r on all five edges after a move."),
      ("Pass", "02-pass", "Forward on a: all w_r ∈ {0,1} — legal."),
      ("Fail", "03-fail", "Backward on c: e3 w_r = −1 — illegal."),
      ("Predicate", "04-pred", "is_legal returns True only if min w_r ≥ 0."),
      ("Apply", "05-apply", "apply_retime writes w_r back into edge list for inspection.")],
     "Open **legal-retime**. Toggle moves; green only when is_legal is true.",
     "Test is_legal after forward on a (True) and backward on c (False).",
     "Checking only one edge. Allowing fractional or negative w in the UI.",
     "Next: period bound / FEAS lite.",
     "legal(r) ← ∀e: w_r(e) ≥ 0",
     [
         {"q": "w_r formula?", "choices": ["w + r(dst) − r(src)", "w − r(dst)", "r(src) − w", "w × r(dst)"], "answer": 0},
         {"q": "Forward on a legal?", "choices": ["Yes", "No", "Only if target=8", "Unknown"], "answer": 0},
         {"q": "Backward on c legal?", "choices": ["No (e3 negative)", "Yes", "Always legal", "Only at period 8"], "answer": 0},
     ]),
    ("module03-01-period-bound", "lab", "Period bound / FEAS lite", "FEAS lite", "period-bound",
     "Use feas_check: legal r and clock_period ≤ target (5); forward on a meets target from baseline 8.",
     "FEAS lite period feasibility check",
     "Given target period φ, a retiming is feasible if it is legal and the clock period is at most φ.",
     "feas_check(data, 5, r) after forward on a: period 5 ≤ target 5 — passes.",
     [("Target", "01-target", "clock_period_target φ = 5."),
      ("Baseline", "02-base", "Baseline period 8 > 5 — needs retiming."),
      ("Check", "03-check", "feas_check combines is_legal AND period ≤ φ."),
      ("Move", "04-move", "Forward on a is a feasible retiming for φ=5."),
      ("Not WD", "05-lite", "Full WD/FEAS LP is out of scope — literacy only.")],
     "Open **period-bound**. Set target 5; run Check after forward on a.",
     "Call feas_check(DATA, 5, r) with forward-on-a r; expect True.",
     "Forgetting legality in FEAS. Comparing to target 8 instead of 5.",
     "Next: min-period search across candidate retimings.",
     "feas(φ,r) ← legal(r) ∧ clock_period(r) ≤ φ",
     [
         {"q": "Target period φ in tiny_retime?", "choices": ["5", "8", "2", "10"], "answer": 0},
         {"q": "feas_check needs which two conditions?", "choices": ["legal + period ≤ φ", "period only", "registers = 2", "backward move"], "answer": 0},
         {"q": "Does forward on a meet φ=5?", "choices": ["Yes (period 5)", "No", "Only illegal moves", "Unknown"], "answer": 0},
     ]),
    ("module03-03-min-period", "lab", "Min-period search", "Min period", "min-period",
     "Run min_period_binary_search: best legal r is forward on a; min period GOLDEN = 5 (from baseline 8).",
     "min-period search lite over candidate retimings",
     "Search a small candidate set of retimings — not full WD/FEAS — and pick the smallest legal period.",
     "Candidates include r=0, forward on a/b, backward on c; best is forward on a with period 5.",
     [("Candidates", "01-cand", "Try zero, forward a/b, backward c."),
      ("Best", "02-best", "GOLDEN best r: r(a)=−1, others 0."),
      ("Period", "03-period", "min period = 5.0 vs baseline 8.0."),
      ("Legal", "04-legal", "Skip illegal candidates (backward on c)."),
      ("Improved", "05-improved", "improved=True when min period < baseline.")],
     "Open **min-period**. Run search; confirm best period 5 and r(a)=−1.",
     "Call min_period_binary_search(DATA); assert period==5 and legal.",
     "Assuming backward on c helps. Expecting full LP optimality.",
     "Next: register/area tradeoff.",
     "best ← argmin period(r) over legal candidates r",
     [
         {"q": "min_period_binary_search best period?", "choices": ["5", "8", "2", "10"], "answer": 0},
         {"q": "Best retiming sets r(a) to?", "choices": ["−1", "0", "+1", "2"], "answer": 0},
         {"q": "Baseline period before search?", "choices": ["8", "5", "2", "3"], "answer": 0},
     ]),
    ("module03-05-area-registers", "lab", "Register area tradeoff", "Area/regs", "area-registers",
     "Compare register_count: baseline 2 vs forward-on-a 3 while period improves 8→5.",
     "register count vs clock period tradeoff",
     "Retiming trades register area for shorter clock period — same function, different register placement.",
     "forward on a: registers 2→3 (+1) but period 8→5; zero retiming keeps 2 registers at period 8.",
     [("Baseline", "01-base", "r=0: 2 registers, period 8."),
      ("Forward a", "02-fwd", "Forward on a: 3 registers, period 5."),
      ("Cost", "03-cost", "+1 register buys 3 units of period improvement."),
      ("Area", "04-area", "register_count sums w_r after retiming."),
      ("Choice", "05-choice", "Real flows pick Pareto points; here we report both metrics.")],
     "Open **area-registers**. Compare baseline vs forward-on-a register totals.",
     "Print register_count at r=0 and after forward on a (2 vs 3).",
     "Assuming retiming always reduces registers. Ignoring period when counting area.",
     "Next: offline benchmark, then wrap.",
     "report (registers, period) for baseline vs retimed",
     [
         {"q": "Baseline register count?", "choices": ["2", "3", "5", "0"], "answer": 0},
         {"q": "Registers after forward on a?", "choices": ["3", "2", "1", "0"], "answer": 0},
         {"q": "Period improves 8→5 by paying?", "choices": ["+1 register", "−1 register", "no change", "illegal move"], "answer": 0},
     ]),
    ("module05-01-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline", None,
     "Compare baseline vs min_period metrics offline on tiny_retime.", None,
     "Track A prints sequential_retime and min_period without the browser.",
     "Load JSON; print baseline period 8, best period 5, registers 2 vs 3.",
     None, None, None, None, None, None),
    ("module99-00-wrap", "wrap", "Retiming path complete", "Wrap", None,
     "Recap sequential graph, w_r, forward/backward moves, legal check, min period; continue to STA or equivalence.", None,
     "You can retime the toy graph: w_r formula, forward on a hits period 5, register tradeoff 2→3.",
     "Natural next: learn_sta timing closure or learn_equivalence checking.",
     None, None, None, None, None, None),
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
            "status": "**ref**" if row[1] == "lab" else ("—" if row[1] == "offline" else "—"),
        }
        if row[1] == "lab":
            m["walk"] = row[9]
            m["browser"] = row[10]
            m["impl"] = row[11]
            m["pitfalls"] = row[12]
            m["next"] = row[13]
            m["pseudo"] = f"## Pseudocode\n\n```text\n{row[14]}\n```\n"
            m["quiz_extra"] = row[15]
        out.append(m)
    return out


def lab_readme(m, modules):
    idx = next(i for i, x in enumerate(modules) if x["id"] == m["id"])
    key = m["id"].replace("module", "")
    prev = modules[idx - 1] if idx else None
    nxt = modules[idx + 1] if idx + 1 < len(modules) else None
    nav = f"{('[← '+prev['short']+'](../'+prev['id']+'/README.md)') if prev else '← Start'} · [Course README](../README.md) · {('['+nxt['short']+' →](../'+nxt['id']+'/README.md)') if nxt else 'End →'}"
    media = "| Artifact | Path |\n|----------|------|\n| Transcript | [transcript.md](transcript.md) |\n| Outline | [outline.yaml](outline.yaml) |\n| Slides | [slides.pptx](slides.pptx) · [slides.pdf](slides.pdf) |\n| Video | [video.mp4](video.mp4) |\n| Quiz | [quiz.json](quiz.json) |\n"
    files = f"```\n{m['id']}/\n├── README.md · CHECKLIST.md · EXAMPLES.md\n├── outline.yaml · transcript.md · slides.md · quiz.json\n└── (optional) examples/ · assets/\n```\n"
    if m["kind"] == "lab":
        return f"""# Module {key}: {m['title']}

**Module id:** `{m['id']}`  
**Kind:** `lab` · Primary lab: `{m['lab']}` · **ref**

{nav}

## Outcomes

After this module you can: **{m['outcomes']}**

## Two tracks (pick one or both)

### Track A — Implement (hands-on)

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_retime.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `./scripts/module.sh {key} --check`

### Track B — Browser lab (online)

1. Local: http://127.0.0.1:8080/tools/{m['lab']}/
2. Live: {LIVE}/{m['lab']}/
3. Load the starter graph, apply retiming moves, Check challenges.

> Concept labs teach retiming literacy — not production OpenROAD/ABC retime.

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

**learn_retiming** teaches *Leiserson–Saxe retiming* with two tracks.

| Track | Where |
|-------|-------|
| **A** | `common/` |
| **B** | platform tools `#retiming` |

**Prerequisite:** [learn_synthesis](../learn_synthesis/README.md). **Next:** [learn_sta](../learn_sta/README.md) or equivalence courses.

## Setup (Track B)

`python3 -m http.server 8080 --directory platform` → http://127.0.0.1:8080/tools/#retiming

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

## You can now

**{m['outcomes']}**

## Next course

→ **learn_sta** or **learn_equivalence** ([`eda.md`](../../../eda.md))

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

Load `../common/tiny_retime.json` and print `min_period_binary_search` vs baseline metrics.

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
            ("Pitfalls", "Skipping goldens on tiny_retime."), ("Your turn", "Complete the checklist."), ("Next", "Continue the path."),
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


def slides_md_stub(m):
    """Minimal Marp stub synced later by transcript_to_outline.py."""
    lines = [
        "---",
        "marp: true",
        f"title: {m['short']}",
        "paginate: true",
        "---",
        "",
        f"# {m['short']}",
        "",
        m.get("hook") or m["title"],
        "",
        "---",
        "",
        "## The idea",
        f"- {m.get('idea') or m['outcomes']}",
        "",
    ]
    if m.get("walk"):
        for title, img, cap in m["walk"]:
            lines += ["---", "", f"## {title}", f"![{title}](assets/steps/{img}.png)", ""]
        lines += ["---", "", "## Browser lab track", "![Browser lab starter](assets/lab-starter.png)", ""]
    lines += [
        "---",
        "",
        "## Implement track",
        f"- {m.get('impl') or m['outcomes']}",
        "",
        "---",
        "",
        "## Pitfalls",
        f"- {m.get('pitfalls') or 'Review goldens.'}",
        "",
        "---",
        "",
        "## Your turn",
        f"- {m.get('next') or 'Complete CHECKLIST.md.'}",
        "",
    ]
    return "\n".join(lines)


def quiz_items(m):
    if m["kind"] != "lab":
        return [
            {"q": f"Goal of {m['title']}?", "choices": [m["outcomes"][:90], "Skip retiming", "Only CTS", "Ignore w_r"], "answer": 0},
            {"q": "Toy graph baseline registers?", "choices": ["2", "5", "0", "8"], "answer": 0},
            {"q": "Target clock period?", "choices": ["5", "8", "2", "10"], "answer": 0},
        ]
    items = list(m["quiz_extra"])
    items.append({"q": "Lab id for this module?", "choices": [m["lab"], "aig-strash", "wire-rc", "techmap-cover"], "answer": 0})
    items.append({"q": "w_r retiming formula?", "choices": ["w + r(dst) − r(src)", "w − r(src)", "r(dst) only", "w × delay"], "answer": 0})
    return items


def enhance_common_readme():
    text = """# Track A — retiming

Shared helpers for **learn_retiming** (Leiserson–Saxe literacy).

| File | Role |
|------|------|
| `tiny_retime.json` | Toy sequential graph (PI u → a → b → c → PO v, plus a→c) |
| `retimeutil.py` | `load`, `total_registers`, `edge_list` |
| `solvers.py` | `w_r`, forward/backward, `clock_period`, `min_period_binary_search` |
| `test_solvers.py` | Unit tests / goldens |

## Toy goldens

| Metric | Value |
|--------|-------|
| Nodes / edges | 5 / 5 |
| Baseline registers | **2** (e0, e2) |
| Baseline clock period | **8** |
| Target period φ | **5** |
| Best move (lite search) | forward on **a** → period **5**, registers **3** |
| `w_r` formula | `w + r(dst) − r(src)` |

```bash
python3 test_solvers.py -v
```
"""
    write(ROOT / "common" / "README.md", text)


def main():
    modules = parse_modules()
    enhance_common_readme()

    rows = "\n".join(
        f"| `{m['id'].replace('module','')}` | [{m['title']}]({m['id']}/README.md) | `{m['kind']}` |"
        for m in modules
    )
    labs_md = "\n".join(f"- [{m['lab']}]({LIVE}/{m['lab']}/)" for m in modules if m.get("lab"))

    write(ROOT / "README.md", f"""# learn_retiming

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Labs](https://img.shields.io/badge/labs-9-green)](docs/MODULES.md)
[![Domain](https://img.shields.io/badge/domain-retiming-orange)](docs/MODULES.md)

**learn_retiming** is the open learning path for *Leiserson–Saxe retiming*: edge register counts, lag assignments, legal moves, and clock-period search on a tiny sequential graph.

Use Track A (`common/`) or browser labs (Track B) after module-slides media is built.

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
learn_retiming/
├── README.md · LICENSE · common/ · docs/ · scripts/ · module*/
```

Optional per module: `slides.pptx`, `slides.pdf`, `audio/`, `video.mp4` (module-slides pipeline).

## Browse or clone

```bash
cd courses/learn_retiming
python3 common/test_solvers.py -v
```

## Consume from the parent

Prerequisite: [learn_synthesis](../learn_synthesis/README.md). Next: [learn_sta](../learn_sta/README.md). Lane: [`eda.md`](../../eda.md).

## Author: publish or update

```bash
python3 courses/learn_retiming/scripts/scaffold_course.py
bash courses/learn_retiming/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_retiming
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_retiming --modules
```

## Two learning tracks

| Track | Where |
|-------|-------|
| **A — Implement** | `common/tiny_retime.json`, `solvers.py` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
| **B — Browser lab** | `platform/tools/<lab-id>/` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |

## Module landings

| Key | Module | Kind |
|-----|--------|------|
{rows}

Full index: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

{labs_md}

## License

[CC BY 4.0](LICENSE)
""")

    if not (ROOT / "LICENSE").is_file():
        write(ROOT / "LICENSE", "CC BY 4.0\n")

    md_rows = "\n".join(
        f"| `{m['id']}` | `{m['kind']}` | [{m['title']}](../{m['id']}/README.md) | "
        f"{('`'+m['lab']+'`') if m.get('lab') else ('offline' if m['kind']=='offline' else '—')} | {m['status']} |"
        for m in modules
    )
    write(ROOT / "docs" / "MODULES.md", f"# learn_retiming — module index\n\n| Id | Kind | Title | Lab | Status |\n|----|------|-------|-----|--------|\n{md_rows}\n")
    write(ROOT / "docs" / "SCOPE.md", """# Scope

**In:** Sequential circuit graphs, edge register counts w, retiming lag r(v), w_r = w + r(dst) − r(src), forward/backward moves, legal retiming (w_r ≥ 0), clock period as longest zero-weight path delay, FEAS lite, min-period search over candidates, register/area tradeoff.

**Out:** Full Whitney–Daniels (WD) / FEAS linear programs, multi-clock retiming, clock gating, physical placement — see STA and implementation flows.

**Toy instance:** `common/tiny_retime.json` — target period 5, baseline period 8, baseline registers 2.
""")
    write(ROOT / "docs" / "TWO_TRACKS.md", """# Two tracks

| Track | Materials |
|-------|-----------|
| **A — Implement** | `common/tiny_retime.json`, `retimeutil.py`, `solvers.py`, module `examples/` copies |
| **B — Browser lab** | `platform/tools/<lab-id>/` interactive graph + `algorithm-walkthrough` frames |

Run Track A tests: `python3 common/test_solvers.py -v`.

Track B labs (planned): sequential-graph, register-count, path-delay, forward-retime, backward-retime, legal-retime, period-bound, min-period, area-registers.
""")
    wrows = "\n".join(f"| `{m['lab']}` | `{m['id']}` | 5 |" for m in modules if m.get("lab"))
    write(ROOT / "docs" / "WALKTHROUGHS.md", f"# Walkthroughs\n\nAlgorithm walkthrough lab ids (capture after platform tools ship):\n\n| Lab | Module | Steps |\n|-----|--------|-------|\n{wrows}\n")

    tiny = (ROOT / "common" / "tiny_retime.json").read_text(encoding="utf-8")
    created = []
    for m in modules:
        d = ROOT / m["id"]
        write(d / "README.md", lab_readme(m, modules))
        write(d / "CHECKLIST.md", f"# Checklist — {m['title']}\n\n- [ ] {m['outcomes']}\n" + (f"- [ ] Cleared `{m['lab']}` browser challenges\n" if m.get("lab") else ""))
        ex = f"# Examples — {m['title']}\n\n1. Load `tiny_retime.json` (or `../common/tiny_retime.json`)\n2. {m['outcomes']}\n\n"
        if m.get("pseudo"):
            ex += m["pseudo"]
        write(d / "EXAMPLES.md", ex)
        write(d / "transcript.md", transcript(m))
        write(d / "outline.yaml", f"title: {m['short']}\nfooter: learn_retiming\nslides: []\n")
        write(d / "slides.md", slides_md_stub(m))
        write(d / "quiz.json", json.dumps({"module": m["id"], "items": quiz_items(m)}, indent=2) + "\n")
        if m.get("lab"):
            write(d / "examples" / "tiny_retime.json", tiny)
        created.append(m["id"])

    labs = " \\\n  ".join(m["id"] for m in modules if m.get("lab"))
    algo_list = ", ".join(f'"{m["lab"]}"' for m in modules if m.get("lab"))

    write(ROOT / "scripts" / "build_all_media.sh", """#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
source "${ROOT}/.cursor/skills/module-slides/scripts/_require_unix.sh"
cd "$ROOT"
bash "${ROOT}/.cursor/skills/module-slides/scripts/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_retiming
echo Done: "$COURSE_DIR"
""")
    write(ROOT / "scripts" / "capture_all_walkthroughs.sh", f"""#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in \\
  {labs}
do
  echo "=== $m ==="
  python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_retiming/$m" --inject-transcript
done
echo CAPTURE_OK
""")
    write(ROOT / "scripts" / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_retiming/module*/; do
  base=$(basename "$m")
  case "$base" in module00-*|module05-*|module99-*) continue ;; esac
  python3 .cursor/skills/module-slides/scripts/capture_lab_snapshot.py "$m" || true
done
echo LAB_SNAPS_OK
""")
    write(ROOT / "scripts" / "smoke_walkthrough.py", f"""#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

ALGOS = [{algo_list}]


def main():
    errs = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_page()
        page.on("pageerror", lambda e: errs.append(str(e)))
        for a in ALGOS:
            for s in range(1, 6):
                page.goto(
                    f"http://127.0.0.1:8080/tools/algorithm-walkthrough/?algo={{a}}&step={{s}}",
                    wait_until="networkidle",
                )
                page.wait_for_selector("#walk-frame[data-ready='1']", timeout=15000)
                print(f"ok {{a}} step {{s}}")
                if errs:
                    print(errs)
                    return 1
        b.close()
    print("WALK_SMOKE_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
""")
    write(ROOT / "scripts" / "module.sh", """#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 -c "
import sys
sys.path.insert(0, '$ROOT/common')
from solvers import min_period_binary_search
from retimeutil import load
m = min_period_binary_search(load('$ROOT/common/tiny_retime.json'))
print('period', m['period'], 'registers', m['registers'])
"
""")

    print(f"Scaffolded {len(created)} modules:")
    for mid in created:
        print(f"  {mid}")


if __name__ == "__main__":
    main()
