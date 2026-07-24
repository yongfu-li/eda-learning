#!/usr/bin/env python3
"""Scaffold learn_equivalence with module-slides stubs."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://universal-verification-methodology.github.io/learning/tools"

# (id, kind, title, short, lab, outcomes, algorithm, hook, idea, walk[5], browser, impl, pitfalls, next, pseudo, quiz_extra)
MODULES_META = [
    ("module00-00-intro", "intro", "Welcome to equivalence checking", "Welcome", None,
     "Explain combinational and sequential equivalence: spec vs impl, miter, truth-table CEC, SAT lite, counterexamples.",
     None,
     "After synthesis you must prove the netlist matches the spec — equivalence checking is the formal backbone of ECO and signoff.",
     "This course uses tiny_equiv: spec f=(a∧b)∨c over PIs a,b,c; impl_good De Morgan equivalent; impl_bad differs at a=1,b=1,c=0; sequential XOR pair for unroll/SEC lite.",
     None, None, None, None, None, None, None),
    ("module01-01-spec-impl", "lab", "Spec vs implementation", "Spec vs impl", "spec-impl",
     "Load spec and impl gate lists; evaluate f for all 8 assignments; see impl_good match and impl_bad differ at a=1,b=1,c=0.",
     "spec vs implementation circuit literacy",
     "Equivalence checking always compares two circuits: a golden spec and a candidate implementation.",
     "Spec computes f=(a∧b)∨c with two gates; impl_good rewrites with De Morgan; impl_bad uses (a∧b)∧c — same PIs, different logic.",
     [("Spec netlist", "01-spec", "Spec: g1=AND(a,b); g2=OR(g1,c) — golden f."),
      ("Impl good", "02-good", "Impl good: five gates, De Morgan form — still f."),
      ("Impl bad", "03-bad", "Impl bad: AND(a,b) then AND with c — wrong when c=0."),
      ("Eight rows", "04-eight", "GOLDEN: 8 input combinations for 3 PIs."),
      ("Evaluate", "05-eval", "evaluate_circuit returns PO for each assignment.")],
     "Open **spec-impl**. Compare spec vs impl_good vs impl_bad truth tables side by side.",
     "Load tiny_equiv.json; call evaluate_circuit on spec and both impls for all 8 rows.",
     "Swapping spec and impl. Comparing only one input corner.",
     "Next: build the miter (XOR of outputs).",
     "for each assignment in 2^|PI|: eval spec PO; eval impl PO; compare",
     [
         {"q": "Spec function over a,b,c?", "choices": ["(a∧b)∨c", "(a∧b)∧c", "a⊕b⊕c", "a∨b∨c"], "answer": 0},
         {"q": "How many truth-table rows for 3 PIs?", "choices": ["8", "6", "3", "16"], "answer": 0},
         {"q": "Impl bad differs when?", "choices": ["a=1,b=1,c=0", "a=0,b=0,c=0", "c=1 always", "never"], "answer": 0},
     ]),
    ("module01-03-miter-build", "lab", "Miter construction", "Miter build", "miter-build",
     "Build a miter: shared PIs, XOR of spec PO and impl PO; miter PO=0 for all inputs when equivalent.",
     "miter construction (XOR outputs)",
     "A miter merges spec and impl and XORs their outputs — equivalent designs yield miter PO=0 everywhere.",
     "build_miter(spec, impl_good) adds i_-prefixed impl gates and miter_xor = spec_f XOR impl_f.",
     [("Shared PIs", "01-pis", "Miter shares PIs a,b,c — one stimulus drives both sides."),
      ("Side by side", "02-side", "Spec gates on left; impl gates prefixed i_ on right."),
      ("XOR cone", "03-xor", "miter_xor = spec_out XOR impl_out."),
      ("Equivalent", "04-zero", "GOLDEN: miter PO=0 for all 8 rows when spec≡impl_good."),
      ("Nonzero", "05-one", "spec vs impl_bad: miter PO=1 at a=1,b=1,c=0.")],
     "Open **miter-build**. Build miter; highlight XOR output; confirm all-zero for good pair.",
     "Call build_miter(spec, impl_good); miter_output must be 0 on every assignment.",
     "XORing inputs instead of outputs. Forgetting to clear old output flags.",
     "Next: exhaustive truth-table CEC.",
     "miter ← shared PI spec ∥ impl; PO_miter ← spec_PO XOR impl_PO",
     [
         {"q": "Miter PO when spec≡impl?", "choices": ["0 for all inputs", "1 always", "X", "matches c"], "answer": 0},
         {"q": "Miter combines outputs with?", "choices": ["XOR", "AND", "OR", "BUF"], "answer": 0},
         {"q": "Impl gates in miter are prefixed?", "choices": ["i_", "m_", "spec_", "none"], "answer": 0},
     ]),
    ("module02-01-truth-table-cec", "lab", "Truth-table CEC", "Truth-table CEC", "truth-table-cec",
     "Run truth_table_cec: spec≡impl_good True over 8 rows; spec≡impl_bad False with counterexample a=1,b=1,c=0.",
     "exhaustive truth-table combinational equivalence",
     "Truth-table CEC enumerates every PI assignment — fine for tiny circuits, infeasible for wide buses.",
     "truth_table_cec walks all 8 rows; returns equivalent=True or counterexample dict.",
     [("Enumerate", "01-enum", "Loop 2^3 assignments for PIs a,b,c."),
      ("Compare POs", "02-cmp", "spec PO vs impl PO each row."),
      ("Good pass", "03-pass", "GOLDEN: spec≡impl_good → equivalent True, 8 rows checked."),
      ("Bad fail", "04-fail", "GOLDEN: spec≡impl_bad → equivalent False."),
      ("Cex", "05-cex", "Counterexample: a=1, b=1, c=0 (spec=1, impl=0).")],
     "Open **truth-table-cec**. Run CEC on good and bad pairs; read counterexample panel.",
     "Call truth_table_cec(spec, impl_good) and (spec, impl_bad); assert goldens.",
     "Stopping at first match instead of first mismatch. Missing a PI bit in enumeration.",
     "Next: structural hashing / FRAIG lite.",
     "for asn in all_assignments: if eval(spec,asn)≠eval(impl,asn): return cex",
     [
         {"q": "truth_table_cec spec≡impl_good?", "choices": ["True (8 rows)", "False", "Unknown", "Only 4 rows"], "answer": 0},
         {"q": "Counterexample for impl_bad?", "choices": ["a=1,b=1,c=0", "a=0,b=0,c=0", "c=1", "none"], "answer": 0},
         {"q": "Truth-table CEC rows for 3 PIs?", "choices": ["8", "3", "6", "16"], "answer": 0},
     ]),
    ("module02-03-structural-hash", "lab", "Structural hash / FRAIG lite", "Struct hash", "structural-hash",
     "Compute structural_hash_stats / fraig_lite: hash (op, child hashes); count unique vs redundant nodes.",
     "structural hashing / FRAIG-lite node sharing",
     "Structural hashing finds functionally identical subexpressions — the idea behind FRAIG and AIG strashing.",
     "Spec has 2 unique gates; impl_good has 5 gates but fewer unique hashes after sharing literals.",
     [("Hash leaf", "01-leaf", "PI a,b,c get signatures PI:a, PI:b, PI:c."),
      ("Hash gate", "02-gate", "AND(a,b) → sig AND(PI:a,PI:b)."),
      ("Collide", "03-coll", "Identical subexpressions share one hash bucket."),
      ("Stats", "04-stats", "structural_hash_stats: total_gates vs unique_hashes."),
      ("FRAIG", "05-fraig", "fraig_lite reports fraig_nodes = unique_hashes.")],
     "Open **structural-hash**. Highlight hash buckets; compare spec vs impl_good gate counts.",
     "Call structural_hash_stats(spec) and fraig_lite(impl_good).",
     "Hashing by gate id instead of structure. Expecting full industrial FRAIG fixpoint.",
     "Next: SAT / CNF encoding lite.",
     "hash(node) ← op + sorted(hash(children)); unique ← |distinct hashes|",
     [
         {"q": "structural_hash_stats counts?", "choices": ["total vs unique hashes", "only PI count", "miter XOR", "FF states"], "answer": 0},
         {"q": "FRAIG-lite goal?", "choices": ["Find structurally equivalent nodes", "Place cells", "Route wires", "Retiming"], "answer": 0},
         {"q": "Spec gate count in tiny_equiv?", "choices": ["2", "5", "8", "1"], "answer": 0},
     ]),
    ("module02-05-sat-cnf-lite", "lab", "SAT / CNF encoding lite", "SAT CNF lite", "sat-cnf-lite",
     "encode_sat_cnf_lite with Tseitin clauses; report num_vars and num_clauses; optional tiny DPLL satisfiability.",
     "Tseitin SAT / CNF encoding literacy",
     "Industrial CEC uses SAT on a miter — first learn clause count on a tiny netlist.",
     "encode_sat_cnf_lite assigns PI vars 1..3 and adds clauses per AND/OR/NOT gate.",
     [("PI vars", "01-vars", "PIs a,b,c → CNF variables 1,2,3."),
      ("Tseitin", "02-step", "Each gate gets a fresh output variable + 3–4 clauses."),
      ("Clause count", "03-count", "GOLDEN literacy: num_clauses grows with gate count."),
      ("Assert PO", "04-po", "Assert spec output=1 → ask sat_satisfiable."),
      ("Not full SAT", "05-lite", "Full ABC/ECO SAT is out of scope — counts + tiny DPLL only.")],
     "Open **sat-cnf-lite**. Show CNF stats; toggle assert PO=1 and run Check.",
     "Call encode_sat_cnf_lite(spec); print num_vars, num_clauses; sat_satisfiable on asserted PO.",
     "CNF on outputs without Tseitin auxiliaries. Expecting full Glucose run.",
     "Next: counterexample debug from CEC.",
     "for each gate: add Tseitin clauses linking inputs → output var",
     [
         {"q": "encode_sat_cnf_lite returns?", "choices": ["num_vars + num_clauses", "only miter XOR", "placement cost", "FF count"], "answer": 0},
         {"q": "Tseitin encoding adds?", "choices": ["Clauses per gate", "Only PI names", "Routing layers", "Clock trees"], "answer": 0},
         {"q": "Industrial CEC often uses?", "choices": ["SAT on miter", "Only simulation", "Only placement", "CTS only"], "answer": 0},
     ]),
    ("module02-07-counterexample", "lab", "Counterexample debug", "Counterexample", "counterexample",
     "Use find_counterexample and read spec vs impl PO values at a=1,b=1,c=0; trace mismatched miter XOR.",
     "counterexample-driven debug",
     "When CEC fails, the counterexample is your shortest bug story — one input pattern where POs differ.",
     "find_counterexample(spec, impl_bad) returns {'a':1,'b':1,'c':0}; spec_out=1, impl_out=0.",
     [("Fail CEC", "01-fail", "truth_table_cec returns equivalent=False."),
      ("Cex pattern", "02-pattern", "GOLDEN: a=1, b=1, c=0."),
      ("PO values", "03-po", "At cex: spec f=1 (OR path), impl_bad f=0 (AND with c=0)."),
      ("Miter XOR", "04-miter", "miter PO=1 at cex — XOR flagged."),
      ("Debug", "05-debug", "Waveform / simulation would replay the same pattern.")],
     "Open **counterexample**. Load bad impl; highlight cex row in truth table.",
     "Call find_counterexample(spec, impl_bad); print spec and impl PO at cex.",
     "Ignoring cex and random sim. Fixing only one corner without regression.",
     "Next: don't-care CEC.",
     "cex ← first asn where eval(spec)≠eval(impl); report PO values",
     [
         {"q": "Counterexample for impl_bad?", "choices": ["a=1,b=1,c=0", "a=0,b=0,c=0", "all zeros", "c=1 only"], "answer": 0},
         {"q": "At cex spec_out for impl_bad case?", "choices": ["1", "0", "X", "Z"], "answer": 0},
         {"q": "Miter XOR at cex?", "choices": ["1 (mismatch)", "0", "undefined", "always 0"], "answer": 0},
     ]),
    ("module03-01-dont-care", "lab", "Don't-care CEC", "Don't-care", "dont-care",
     "Apply dont_care_mask: treat some PI bits as X; CEC only over care assignments (e.g. c=0 slice).",
     "don't-care / X-valued PI literacy",
     "Real specs have don't-cares — CEC must only compare care inputs, not illegal or unconstrained bits.",
     "dont_care_mask with c fixed to 0 still finds a=1,b=1,c=0 mismatch on impl_bad.",
     [("X mask", "01-x", "mask[pi]=-1 means don't-care (any value)."),
      ("Care bits", "02-care", "Fixed 0/1 in mask restricts rows checked."),
      ("Slice", "03-slice", "Example: c=0 slice — 4 rows instead of 8."),
      ("Still fail", "04-fail", "impl_bad still fails at a=1,b=1,c=0 in care slice."),
      ("Optional X", "05-opt", "Full 8-row CEC is the no-don't-care baseline.")],
     "Open **dont-care**. Set c care=0; run masked CEC; read reduced row count.",
     "Call dont_care_mask(spec, impl_bad, {'a':-1,'b':-1,'c':0}).",
     "Treating X as 0. Checking illegal input combinations as failures.",
     "Next: sequential unrolling.",
     "skip rows violating care mask; CEC on remaining assignments only",
     [
         {"q": "Don't-care mask value for X?", "choices": ["-1", "0", "1", "2"], "answer": 0},
         {"q": "Fixing c=0 checks how many rows?", "choices": ["4 of 8", "8 of 8", "1", "0"], "answer": 0},
         {"q": "Masked CEC on impl_bad still fails?", "choices": ["Yes at a=1,b=1,c=0", "No", "Only when c=1", "Unknown"], "answer": 0},
     ]),
    ("module03-03-sequential-unroll", "lab", "Sequential unrolling", "Seq unroll", "sequential-unroll",
     "Unroll sequential pair for n=2: PIs a_0,a_1 plus q_0; expose combo clouds per cycle.",
     "sequential unrolling for SEC literacy",
     "Sequential equivalence often unrolls both designs for k cycles and runs combinational CEC on the unrolled POs.",
     "sequential_unroll(spec, 2) expands FF next_q = a XOR q into time-stamped gates q_0,a_0,a_1,q_1,q_2.",
     [("FF pair", "01-ff", "Spec: one FF, next_q = a XOR q (De Morgan or XOR form)."),
      ("Unroll n=2", "02-n2", "Two time steps: a_0 then a_1; state q_0→q_1→q_2."),
      ("PIs grow", "03-pis", "Unrolled PIs: q_0, a_0, a_1."),
      ("Combo cloud", "04-cloud", "Each cycle's gates get _t suffix."),
      ("Literacy", "05-lite", "Full k-induction is out of scope — 2-step unroll only.")],
     "Open **sequential-unroll**. Show unrolled netlist view for n=2.",
     "Call sequential_unroll(DATA['sequential']['spec'], 2); inspect gates and PIs.",
     "Unrolling without resetting state. Confusing PO y with next state.",
     "Next: sequential CEC lite.",
     "for t in 0..n-1: duplicate combo cloud; wire q_{t+1} ← D_t",
     [
         {"q": "sequential_unroll(2) exposes?", "choices": ["a_0, a_1 time steps", "only comb spec", "8 truth rows", "CTS skew"], "answer": 0},
         {"q": "State register in sequential pair?", "choices": ["q", "c", "miter_xor", "f"], "answer": 0},
         {"q": "Unrolling purpose?", "choices": ["Reduce SEC to comb CEC over frames", "Place macros", "Legalize", "Buffer"], "answer": 0},
     ]),
    ("module03-05-sequential-cec", "lab", "Sequential CEC lite", "Sequential CEC", "sequential-cec",
     "Run sequential_cec_lite for 2 steps: spec≡impl_good True; spec≡impl_bad False (next_q=NOT q ignores a).",
     "inductive sequential CEC lite (2-step)",
     "Sequential CEC asks whether two FSMs agree on all input sequences — we check 2 unroll steps as literacy.",
     "sequential_cec_lite enumerates input sequences; spec vs impl_good match; impl_bad diverges when a matters.",
     [("Init", "01-init", "Both start q=0 from init in tiny_equiv."),
      ("Good pair", "02-good", "GOLDEN: spec≡impl_good for 2 steps."),
      ("Bad pair", "03-bad", "impl_bad: next_q=NOT q — ignores input a."),
      ("Trace", "04-trace", "simulate_cycle returns (y, next_state) each cycle."),
      ("Lite", "05-lite", "Full k-induction + BMC engines — literacy only.")],
     "Open **sequential-cec**. Run 2-step SEC on good vs bad sequential pair.",
     "Call sequential_cec_lite(seq_spec, seq_good, 2) True; seq_bad False.",
     "Checking one reset cycle only. Comparing comb outputs without state update.",
     "Next: offline benchmark, then wrap.",
     "for each input sequence length n: simulate spec & impl; compare output vectors",
     [
         {"q": "sequential_cec_lite good pair (2 steps)?", "choices": ["equivalent True", "False always", "unknown", "8 rows"], "answer": 0},
         {"q": "impl_bad sequential bug?", "choices": ["next_q=NOT q ignores a", "same XOR", "extra AND", "no FF"], "answer": 0},
         {"q": "Initial state q in JSON?", "choices": ["0", "1", "X", "undefined"], "answer": 0},
     ]),
    ("module05-01-offline-benchmark-compare", "offline", "Offline benchmark compare", "Offline", None,
     "Compare combo_pair_report metrics offline: 8 rows, spec≡impl_good, spec≡impl_bad, miter all-zero, CNF clauses.", None,
     "Track A prints combo_pair_report without the browser.",
     "Load tiny_equiv.json; print truth_table_rows=8, cex a=1,b=1,c=0, miter_good_all_zero=True.",
     None, None, None, None, None, None),
    ("module99-00-wrap", "wrap", "Equivalence path complete", "Wrap", None,
     "Recap spec/impl, miter XOR, 8-row CEC, structural hash, SAT CNF lite, cex a=1,b=1,c=0, sequential unroll/SEC lite.", None,
     "You can prove tiny_equiv: truth-table CEC, miter PO=0 when equivalent, and 2-step sequential check.",
     "Natural next: formal property checking courses or full industrial CEC tools.",
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
            "status": "**ref**" if row[1] == "lab" else ("—" if row[1] in ("offline", "intro", "wrap") else "—"),
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

1. Open [EXAMPLES.md](EXAMPLES.md); implement **{m['algorithm']}** on `examples/tiny_equiv.json`.
2. Complete [CHECKLIST.md](CHECKLIST.md).
3. Optional: `./scripts/module.sh {key} --check`

### Track B — Browser lab (online)

1. Local: http://127.0.0.1:8080/tools/{m['lab']}/
2. Live: {LIVE}/{m['lab']}/
3. Load the starter circuit, apply moves, Check challenges.

> Concept labs teach equivalence literacy — not production Conformal/Formality flows.

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

**learn_equivalence** teaches *combinational and sequential equivalence checking* with two tracks.

| Track | Where |
|-------|-------|
| **A** | `common/` |
| **B** | platform tools `#equivalence` |

**Prerequisite:** [learn_synthesis](../learn_synthesis/README.md) / [learn_retiming](../learn_retiming/README.md). **Next:** formal verification flows in [`eda.md`](../../../eda.md).

## Setup (Track B)

`python3 -m http.server 8080 --directory platform` → http://127.0.0.1:8080/tools/#equivalence

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

→ Formal verification / industrial CEC ([`eda.md`](../../../eda.md))

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

Load `../common/tiny_equiv.json` and print `combo_pair_report` metrics.

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
            ("Pitfalls", "Skipping goldens on tiny_equiv (8 rows, cex a=1,b=1,c=0)."), ("Your turn", "Complete the checklist."), ("Next", "Continue the path."),
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
        parts += [f"## Slide {n} — Walkthrough: {title}", "", f"![Walkthrough {title}](assets/steps/{img}.png)", "", cap, ""]
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
            lines += ["---", "", f"## Walkthrough: {title}", f"![Walkthrough {title}](assets/steps/{img}.png)", ""]
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
            {"q": f"Goal of {m['title']}?", "choices": [m["outcomes"][:90], "Skip equivalence", "Only placement", "Ignore miter"], "answer": 0},
            {"q": "Truth-table rows for 3 PIs?", "choices": ["8", "3", "6", "16"], "answer": 0},
            {"q": "Counterexample for impl_bad?", "choices": ["a=1,b=1,c=0", "a=0,b=0,c=0", "never", "c=1 only"], "answer": 0},
        ]
    items = list(m["quiz_extra"])
    items.append({"q": "Lab id for this module?", "choices": [m["lab"], "aig-strash", "wire-rc", "techmap-cover"], "answer": 0})
    items.append({"q": "Miter PO when equivalent?", "choices": ["0 for all inputs", "1 always", "X", "matches c only"], "answer": 0})
    return items


def enhance_common_readme():
    text = """# Track A — equivalence checking

Shared helpers for **learn_equivalence** (CEC literacy).

| File | Role |
|------|------|
| `tiny_equiv.json` | Toy spec/impl pairs (comb + sequential) |
| `equivutil.py` | `load`, `evaluate_circuit`, `truth_table` |
| `solvers.py` | `build_miter`, `truth_table_cec`, `structural_hash_stats`, `encode_sat_cnf_lite`, `sequential_cec_lite` |
| `test_solvers.py` | Unit tests / goldens |

## Toy goldens

| Metric | Value |
|--------|-------|
| PI count (comb) | 3 → **8** truth-table rows |
| Spec | f = **(a∧b)∨c** |
| spec ≡ impl_good | **True** (all 8 rows) |
| spec ≡ impl_bad | **False** — cex **a=1, b=1, c=0** |
| Miter (good pair) | PO = **0** for all inputs |
| Sequential (2-step) | spec ≡ impl_good **True**; impl_bad **False** |

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

    write(ROOT / "README.md", f"""# learn_equivalence

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Labs](https://img.shields.io/badge/labs-9-green)](docs/MODULES.md)
[![Domain](https://img.shields.io/badge/domain-equivalence-orange)](docs/MODULES.md)

**learn_equivalence** is the open learning path for *combinational and sequential equivalence checking*: spec vs impl, miter construction, truth-table CEC, structural hashing, SAT/CNF lite, counterexamples, don't-cares, and sequential unrolling.

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
learn_equivalence/
├── README.md · LICENSE · common/ · docs/ · scripts/ · module*/
```

Optional per module: `slides.pptx`, `slides.pdf`, `audio/`, `video.mp4` (module-slides pipeline).

## Browse or clone

```bash
cd courses/learn_equivalence
python3 common/test_solvers.py -v
```

## Consume from the parent

Prerequisite: [learn_synthesis](../learn_synthesis/README.md) · [learn_retiming](../learn_retiming/README.md). Lane: [`eda.md`](../../eda.md).

## Author: publish or update

```bash
python3 courses/learn_equivalence/scripts/scaffold_course.py
bash courses/learn_equivalence/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_equivalence
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_equivalence --modules
```

## Two learning tracks

| Track | Where |
|-------|-------|
| **A — Implement** | `common/tiny_equiv.json`, `solvers.py` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
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
    write(ROOT / "docs" / "MODULES.md", f"# learn_equivalence — module index\n\n| Id | Kind | Title | Lab | Status |\n|----|------|-------|-----|--------|\n{md_rows}\n")
    write(ROOT / "docs" / "SCOPE.md", """# Scope

**In:** Spec vs implementation, miter (XOR outputs), exhaustive truth-table CEC, structural hashing / FRAIG-lite, SAT/CNF encoding lite, counterexamples, don't-care masks, sequential unrolling, inductive sequential CEC lite.

**Out:** Full industrial engines (Conformal/Formality/Jasper), k-induction proofs, UIF/PI, word-level EC, equivalence after aggressive optimization — see formal verification flows.

**Toy instance:** `common/tiny_equiv.json` — comb spec f=(a∧b)∨c; impl_good equivalent; impl_bad cex a=1,b=1,c=0; sequential XOR pair for 2-step SEC lite.
""")
    write(ROOT / "docs" / "TWO_TRACKS.md", """# Two tracks

| Track | Materials |
|-------|-----------|
| **A — Implement** | `common/tiny_equiv.json`, `equivutil.py`, `solvers.py`, module `examples/` copies |
| **B — Browser lab** | `platform/tools/<lab-id>/` interactive circuit lab + `algorithm-walkthrough` frames |

Run Track A tests: `python3 common/test_solvers.py -v`.

Track B labs (planned): spec-impl, miter-build, truth-table-cec, structural-hash, sat-cnf-lite, counterexample, dont-care, sequential-unroll, sequential-cec.
""")
    wrows = "\n".join(f"| `{m['lab']}` | `{m['id']}` | 5 |" for m in modules if m.get("lab"))
    write(ROOT / "docs" / "WALKTHROUGHS.md", f"# Walkthroughs\n\nAlgorithm walkthrough lab ids (capture after platform tools ship):\n\n| Lab | Module | Steps |\n|-----|--------|-------|\n{wrows}\n")

    tiny = (ROOT / "common" / "tiny_equiv.json").read_text(encoding="utf-8")
    created = []
    for m in modules:
        d = ROOT / m["id"]
        write(d / "README.md", lab_readme(m, modules))
        write(d / "CHECKLIST.md", f"# Checklist — {m['title']}\n\n- [ ] {m['outcomes']}\n" + (f"- [ ] Cleared `{m['lab']}` browser challenges\n" if m.get("lab") else ""))
        ex = f"# Examples — {m['title']}\n\n1. Load `tiny_equiv.json` (or `../common/tiny_equiv.json`)\n2. {m['outcomes']}\n\n"
        if m.get("pseudo"):
            ex += m["pseudo"]
        write(d / "EXAMPLES.md", ex)
        write(d / "transcript.md", transcript(m))
        write(d / "outline.yaml", f"title: {m['short']}\nfooter: learn_equivalence\nslides: []\n")
        write(d / "slides.md", slides_md_stub(m))
        write(d / "quiz.json", json.dumps({"module": m["id"], "items": quiz_items(m)}, indent=2) + "\n")
        if m.get("lab"):
            write(d / "examples" / "tiny_equiv.json", tiny)
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
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_equivalence
echo Done: "$COURSE_DIR"
""")
    write(ROOT / "scripts" / "capture_all_walkthroughs.sh", f"""#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in \\
  {labs}
do
  echo "=== $m ==="
  python3 .cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py "courses/learn_equivalence/$m" --inject-transcript
done
echo CAPTURE_OK
""")
    write(ROOT / "scripts" / "capture_lab_snaps.sh", """#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
for m in courses/learn_equivalence/module*/; do
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
from solvers import combo_pair_report, truth_table_cec
from equivutil import get_combo, load
d = load('$ROOT/common/tiny_equiv.json')
spec = get_combo(d, 'spec')
good = get_combo(d, 'impl_good')
bad = get_combo(d, 'impl_bad')
print('good', truth_table_cec(spec, good))
print('bad', truth_table_cec(spec, bad))
print('report', combo_pair_report(d))
"
""")

    print(f"Scaffolded {len(created)} modules:")
    for mid in created:
        print(f"  {mid}")


if __name__ == "__main__":
    main()
