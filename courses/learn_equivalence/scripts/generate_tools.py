#!/usr/bin/env python3
"""Generate learn_equivalence tools + wire walkthrough."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
TOOLS = ROOT / "platform" / "tools"
WALK = TOOLS / "algorithm-walkthrough"
CAPTURE = ROOT / ".cursor" / "skills" / "module-slides" / "scripts" / "capture_algorithm_walkthrough.py"

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} — EDA Algorithms Platform</title>
  <link rel="stylesheet" href="../../assets/site.css">
  <link rel="stylesheet" href="../../assets/tools-shared.css">
  <link rel="stylesheet" href="../../assets/clustering-lab.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="site-header-inner">
    <p class="brand"><a href="../../index.html">EDA Algorithms Platform</a></p>
    <nav class="site-nav"><a href="../index.html" class="is-active">Tools</a></nav>
  </div></header>
  <main id="main">
    <div class="eyebrow">Interactive tool</div>
    <section class="hero"><h1>{title}</h1><p class="lead">{lead}</p></section>
    <div id="lab-root"></div>
  </main>
  <script type="module" src="{lab}.js"></script>
  <script src="../../assets/site.js"></script>
</body>
</html>
"""

IMP = """import { GOLDENS } from "../../assets/equivalence-core.js";
import { createInteractiveEquivalenceLab } from "../../assets/interactive-equivalence-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(lab, title, lead, challenges_js, default_view="spec"):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveEquivalenceLab(root, {{\n  defaultView: \"{default_view}\",\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "spec-impl": ch(
        "spec-impl",
        "Spec vs implementation",
        "Compare spec, good rewrite, and bad rewrite.",
        """    { id: "gates-spec", title: "Spec 2 gates", level: "Intro", prompt: "Spec has 2 gates.", check: (_c, api) => { api.showSpec(); return api.getCircuit().gates.length === GOLDENS.specGateCount; } },
    { id: "gates-good", title: "Good 5 gates", level: "Intro", prompt: "Good impl has 5 gates.", check: (_c, api) => { api.showGood(); return api.getCircuit().gates.length === GOLDENS.goodGateCount; } },
    { id: "gates-bad", title: "Bad 2 gates", level: "Practice", prompt: "Bad impl has 2 gates.", check: (_c, api) => { api.showBad(); return api.getCircuit().gates.length === GOLDENS.badGateCount; } },
    { id: "cex-asn", title: "Set cex", level: "Practice", prompt: "Set a=1,b=1,c=0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.getAssignment().a===1 && api.getAssignment().b===1 && api.getAssignment().c===0 },
    { id: "spec1", title: "Spec at cex =1", level: "Practice", prompt: "At cex, spec evaluates to 1.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalSpec() === 1 },
    { id: "bad0", title: "Bad at cex =0", level: "Practice", prompt: "At cex, bad evaluates to 0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalBad() === 0 },
    { id: "good1", title: "Good matches", level: "Practice", prompt: "At cex, good equals spec.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalGood() === api.evalSpec() },
    { id: "view-good", title: "Show good", level: "Challenge", prompt: "Switch view to good.",
      setup: (_c, api) => api.showGood(), check: (_c, api) => api.getView() === "good" },""",
    ),
    "miter-build": ch(
        "miter-build",
        "Miter construction",
        "Build and evaluate good/bad miters.",
        """    { id: "show-mg", title: "Show miter good", level: "Intro", prompt: "Open miter good view.",
      setup: (_c, api) => api.showMiterGood(), check: (_c, api) => api.getView() === "miter-good" },
    { id: "xor", title: "Has XOR", level: "Intro", prompt: "Miter has miter_xor gate.",
      setup: (_c, api) => api.showMiterGood(), check: (_c, api) => api.getCircuit().gates.some(g => g.id==="miter_xor") },
    { id: "zero", title: "Good miter 0", level: "Practice", prompt: "At cex, good miter is 0.",
      setup: (_c, api) => { api.showMiterGood(); api.setAssignment({a:1,b:1,c:0}); },
      check: (_c, api) => api.eval() === 0 },
    { id: "bad-view", title: "Show miter bad", level: "Practice", prompt: "Open miter bad.",
      setup: (_c, api) => api.showMiterBad(), check: (_c, api) => api.getView() === "miter-bad" },
    { id: "one", title: "Bad miter 1", level: "Practice", prompt: "At cex, bad miter is 1.",
      setup: (_c, api) => { api.showMiterBad(); api.setAssignment({a:1,b:1,c:0}); },
      check: (_c, api) => api.eval() === 1 },
    { id: "shared", title: "3 PIs", level: "Practice", prompt: "Miter has 3 PIs.",
      setup: (_c, api) => api.showMiterGood(), check: (_c, api) => api.getCircuit().pis.length === 3 },
    { id: "good-api", title: "miterGood exists", level: "Practice", prompt: "miterGood returns gates.",
      check: (_c, api) => api.miterGood().gates.length > 2 },
    { id: "golden", title: "GOLDENS.cex", level: "Challenge", prompt: "GOLDENS.cex.c is 0.", check: () => GOLDENS.cex.c === 0 },""",
        "miter-good",
    ),
    "truth-table-cec": ch(
        "truth-table-cec",
        "Truth-table CEC",
        "Run exhaustive truth-table equivalence checks.",
        """    { id: "rows", title: "8 rows", level: "Intro", prompt: "GOLDENS.truthRows is 8.", check: () => GOLDENS.truthRows === 8 },
    { id: "good", title: "CEC good pass", level: "Intro", prompt: "Click CEC good; equivalent true.",
      setup: (_c, api) => api.runCecGood(), check: (_c, api) => api.getLastCec().equivalent === true },
    { id: "bad", title: "CEC bad fail", level: "Practice", prompt: "Click CEC bad; equivalent false.",
      setup: (_c, api) => api.runCecBad(), check: (_c, api) => api.getLastCec().equivalent === false },
    { id: "cex", title: "Cex captured", level: "Practice", prompt: "Bad CEC cex is a1b1c0.",
      setup: (_c, api) => api.runCecBad(),
      check: (_c, api) => { const x=api.getLastCec().counterexample; return x.a===1&&x.b===1&&x.c===0; } },
    { id: "rows8", title: "Rows checked 8", level: "Practice", prompt: "Good CEC checked 8 rows.",
      setup: (_c, api) => api.runCecGood(), check: (_c, api) => api.getLastCec().rowsChecked === 8 },
    { id: "mode", title: "Mode cec-bad", level: "Practice", prompt: "Mode is cec-bad after run.",
      setup: (_c, api) => api.runCecBad(), check: (_c, api) => api.getMode() === "cec-bad" },
    { id: "api-good", title: "cecGood API", level: "Practice", prompt: "api.cecGood().equivalent.",
      check: (_c, api) => api.cecGood().equivalent === true },
    { id: "api-bad", title: "cecBad API", level: "Challenge", prompt: "api.cecBad not equivalent.",
      check: (_c, api) => api.cecBad().equivalent === false },""",
    ),
    "structural-hash": ch(
        "structural-hash",
        "Structural hash / FRAIG lite",
        "Inspect structural hashes on the toy circuits.",
        """    { id: "spec2", title: "Spec 2 gates", level: "Intro", prompt: "Spec totalGates=2.", check: (_c, api) => api.hashSpec().totalGates === 2 },
    { id: "unique", title: "Unique ≥2", level: "Intro", prompt: "Spec uniqueHashes ≥ 2.", check: (_c, api) => api.hashSpec().uniqueHashes >= 2 },
    { id: "fraig", title: "Fraig good", level: "Practice", prompt: "fraigGood has fraigNodes.", check: (_c, api) => typeof api.fraigGood().fraigNodes === "number" },
    { id: "good-more", title: "Good more gates", level: "Practice", prompt: "Good has more gates than spec.",
      check: (_c, api) => { api.showGood(); return api.getCircuit().gates.length > 2; } },
    { id: "show-spec", title: "Show spec", level: "Practice", prompt: "View is spec.",
      setup: (_c, api) => api.showSpec(), check: (_c, api) => api.getView() === "spec" },
    { id: "redundant", title: "redundant ≥0", level: "Practice", prompt: "redundant is a number ≥0.",
      check: (_c, api) => api.hashSpec().redundant >= 0 },
    { id: "hashes", title: "Has gateHashes", level: "Practice", prompt: "gateHashes object exists.",
      check: (_c, api) => typeof api.hashSpec().gateHashes === "object" },
    { id: "golden", title: "specGateCount", level: "Challenge", prompt: "GOLDENS.specGateCount=2.", check: () => GOLDENS.specGateCount === 2 },""",
    ),
    "sat-cnf-lite": ch(
        "sat-cnf-lite",
        "SAT / CNF encoding lite",
        "Encode CNF and ask SAT if the bad miter can be 1.",
        """    { id: "clauses", title: "Spec clauses >0", level: "Intro", prompt: "Spec CNF has clauses.", check: (_c, api) => api.cnfSpec().numClauses > 0 },
    { id: "vars", title: "Vars >3", level: "Intro", prompt: "Spec numVars > 3.", check: (_c, api) => api.cnfSpec().numVars > 3 },
    { id: "sat", title: "SAT finds diff", level: "Practice", prompt: "Click SAT miter≠0 — satisfiable.",
      setup: (_c, api) => api.satMiterDiff(), check: (_c, api) => api.satMiterDiff() === true },
    { id: "mode", title: "Mode sat", level: "Practice", prompt: "Mode is sat.",
      setup: (_c, api) => api.satMiterDiff(), check: (_c, api) => api.getMode() === "sat" },
    { id: "cnf-store", title: "CNF stored", level: "Practice", prompt: "getLastCnf has clauses.",
      setup: (_c, api) => api.satMiterDiff(), check: (_c, api) => api.getLastCnf().numClauses > 0 },
    { id: "assert", title: "Assert CNF", level: "Practice", prompt: "cnfMiterAssertOne has clauses.",
      check: (_c, api) => api.cnfMiterAssertOne().numClauses > 0 },
    { id: "miter-bad", title: "Show miter bad", level: "Practice", prompt: "View miter-bad.",
      setup: (_c, api) => api.showMiterBad(), check: (_c, api) => api.getView() === "miter-bad" },
    { id: "golden", title: "truthRows", level: "Challenge", prompt: "truthRows=8.", check: () => GOLDENS.truthRows === 8 },""",
    ),
    "counterexample": ch(
        "counterexample",
        "Counterexample debug",
        "Find and simulate the golden counterexample.",
        """    { id: "find", title: "Find cex", level: "Intro", prompt: "findCex returns a1b1c0.",
      check: (_c, api) => { const x=api.findCex(); return x.a===1&&x.b===1&&x.c===0; } },
    { id: "set", title: "Load cex", level: "Intro", prompt: "Set assignment to cex.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.getAssignment().c === 0 },
    { id: "spec1", title: "Spec 1", level: "Practice", prompt: "Spec at cex is 1.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalSpec() === 1 },
    { id: "bad0", title: "Bad 0", level: "Practice", prompt: "Bad at cex is 0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalBad() === 0 },
    { id: "miter1", title: "Miter 1", level: "Practice", prompt: "Bad miter at cex is 1.",
      setup: (_c, api) => { api.showMiterBad(); api.setAssignment({a:1,b:1,c:0}); }, check: (_c, api) => api.eval() === 1 },
    { id: "cec", title: "CEC bad", level: "Practice", prompt: "CEC bad fails.",
      setup: (_c, api) => api.runCecBad(), check: (_c, api) => !api.getLastCec().equivalent },
    { id: "good-ok", title: "Good still ok", level: "Practice", prompt: "Good still matches at cex.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalGood() === 1 },
    { id: "golden", title: "GOLDENS.cex.a", level: "Challenge", prompt: "cex.a is 1.", check: () => GOLDENS.cex.a === 1 },""",
    ),
    "dont-care": ch(
        "dont-care",
        "Don't-care CEC",
        "Run CEC under a don't-care / care mask.",
        """    { id: "mask", title: "Set c=0 care", level: "Intro", prompt: "Set don't-care mask c=0.",
      setup: (_c, api) => api.setDontCare({a:-1,b:-1,c:0}), check: (_c, api) => api.getDontCare().c === 0 },
    { id: "run", title: "DC check fails", level: "Intro", prompt: "dontCareCheck with c=0 still fails on bad.",
      setup: (_c, api) => api.dontCareCheck({a:-1,b:-1,c:0}), check: (_c, api) => api.getLastCec().equivalent === false },
    { id: "cex-c", title: "Cex keeps c=0", level: "Practice", prompt: "Counterexample has c=0.",
      setup: (_c, api) => api.dontCareCheck({a:-1,b:-1,c:0}), check: (_c, api) => api.getLastCec().counterexample.c === 0 },
    { id: "mode", title: "Mode dont-care", level: "Practice", prompt: "Mode is dont-care.",
      setup: (_c, api) => api.dontCareCheck({a:-1,b:-1,c:0}), check: (_c, api) => api.getMode() === "dont-care" },
    { id: "rows", title: "Fewer rows", level: "Practice", prompt: "rowsChecked ≤ 8.",
      setup: (_c, api) => api.dontCareCheck({a:-1,b:-1,c:0}), check: (_c, api) => api.getLastCec().rowsChecked <= 8 },
    { id: "x-bits", title: "a is X", level: "Practice", prompt: "Mask a is −1.",
      setup: (_c, api) => api.setDontCare({a:-1,b:-1,c:0}), check: (_c, api) => api.getDontCare().a === -1 },
    { id: "full", title: "Full still fails", level: "Practice", prompt: "Full CEC bad still fails.",
      check: (_c, api) => api.cecBad().equivalent === false },
    { id: "golden", title: "piCount", level: "Challenge", prompt: "piCount=3.", check: () => GOLDENS.piCount === 3 },""",
    ),
    "sequential-unroll": ch(
        "sequential-unroll",
        "Sequential unrolling",
        "Unroll the sequential toy for two steps.",
        """    { id: "steps", title: "steps=2", level: "Intro", prompt: "Unroll steps is 2.", check: (_c, api) => api.unroll(2).steps === 2 },
    { id: "gates", title: "Has gates", level: "Intro", prompt: "Unroll produces gates.", check: (_c, api) => api.unroll(2).gates.length > 0 },
    { id: "pis", title: "Has frame PIs", level: "Practice", prompt: "Unroll pis include a_0.",
      check: (_c, api) => api.unroll(2).pis.includes("a_0") },
    { id: "q0", title: "Has q_0", level: "Practice", prompt: "Unroll pis include q_0.",
      check: (_c, api) => api.unroll(2).pis.includes("q_0") },
    { id: "golden", title: "seqSteps", level: "Intro", prompt: "GOLDENS.seqSteps=2.", check: () => GOLDENS.seqSteps === 2 },
    { id: "y", title: "PO y", level: "Practice", prompt: "Unroll pos is y.", check: (_c, api) => api.unroll(2).pos[0] === "y" },
    { id: "more", title: "3 steps more", level: "Practice", prompt: "3-step unroll has more gates than 2.",
      check: (_c, api) => api.unroll(3).gates.length > api.unroll(2).gates.length },
    { id: "view", title: "Show seqSpec", level: "Challenge", prompt: "Switch to seqSpec view.",
      setup: (_c, api) => api.setView("seqSpec"), check: (_c, api) => api.getView() === "seqSpec" },""",
        "seqSpec",
    ),
    "sequential-cec": ch(
        "sequential-cec",
        "Sequential CEC lite",
        "Compare sequential good and bad over 2 steps.",
        """    { id: "good", title: "SEC good", level: "Intro", prompt: "Click SEC good — equivalent.",
      setup: (_c, api) => api.seqCecGood(), check: (_c, api) => api.getLastSeq().equivalent === true },
    { id: "bad", title: "SEC bad", level: "Intro", prompt: "Click SEC bad — not equivalent.",
      setup: (_c, api) => api.seqCecBad(), check: (_c, api) => api.getLastSeq().equivalent === false },
    { id: "steps", title: "Steps 2", level: "Practice", prompt: "SEC uses steps=2.",
      setup: (_c, api) => api.seqCecGood(), check: (_c, api) => api.getLastSeq().steps === 2 },
    { id: "mode-g", title: "Mode seq-good", level: "Practice", prompt: "Mode seq-good.",
      setup: (_c, api) => api.seqCecGood(), check: (_c, api) => api.getMode() === "seq-good" },
    { id: "mode-b", title: "Mode seq-bad", level: "Practice", prompt: "Mode seq-bad.",
      setup: (_c, api) => api.seqCecBad(), check: (_c, api) => api.getMode() === "seq-bad" },
    { id: "cex", title: "Bad has cex", level: "Practice", prompt: "Bad SEC has counterexample.",
      setup: (_c, api) => api.seqCecBad(), check: (_c, api) => !!api.getLastSeq().counterexample },
    { id: "golden", title: "seqSteps", level: "Practice", prompt: "seqSteps golden 2.", check: () => GOLDENS.seqSteps === 2 },
    { id: "api", title: "Both APIs", level: "Challenge", prompt: "good true and bad false.",
      check: (_c, api) => api.seqCecGood().equivalent && !api.seqCecBad().equivalent },""",
        "seqSpec",
    ),
}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")


def main() -> None:
    for lab, meta in LABS.items():
        write(TOOLS / lab / "index.html", HTML.format(title=meta["title"], lead=meta["lead"], lab=lab))
        write(TOOLS / lab / f"{lab}.js", meta["js"])
    print(f"Wrote {len(LABS)} tools")
    write(WALK / "equivalence-algos.js", (Path(__file__).parent / "_equivalence_algos.js").read_text(encoding="utf-8"))
    print("Wrote equivalence-algos.js")

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "EQUIVALENCE_ALGOS" not in text:
        text = text.replace(
            'import { RETIMING_ALGOS } from "./retiming-algos.js";\n',
            'import { RETIMING_ALGOS } from "./retiming-algos.js";\n'
            'import { EQUIVALENCE_ALGOS } from "./equivalence-algos.js";\n'
            'import { drawEquivalence } from "../../assets/equivalence-core.js";\n',
        )
        # fallback if retiming import style differs
        if "EQUIVALENCE_ALGOS" not in text:
            text = text.replace(
                'import { SYNTHESIS_ALGOS } from "./synthesis-algos.js";\n',
                'import { SYNTHESIS_ALGOS } from "./synthesis-algos.js";\n'
                'import { EQUIVALENCE_ALGOS } from "./equivalence-algos.js";\n'
                'import { drawEquivalence } from "../../assets/equivalence-core.js";\n',
            )
        text = text.replace(
            "  ...RETIMING_ALGOS,\n};",
            "  ...RETIMING_ALGOS,\n  ...EQUIVALENCE_ALGOS,\n};",
        )
        if "EQUIVALENCE_ALGOS" not in text or "...EQUIVALENCE_ALGOS" not in text:
            text = text.replace(
                "  ...SYNTHESIS_ALGOS,\n};",
                "  ...SYNTHESIS_ALGOS,\n  ...EQUIVALENCE_ALGOS,\n};",
            )
        if 'pack.kind === "equivalence"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "retiming") {',
                '''  } else if (pack.kind === "equivalence") {
    drawEquivalence(canvas, {
      circuit: s.circuit,
      layout: s.layout,
      layoutHint: s.layoutHint || null,
      selected: s.selected || null,
      assignment: s.assignment || null,
      highlight: s.highlight || [],
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "retiming") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"spec-impl"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        if '"area-registers": ("area-registers", 5),' in cap:
            cap = cap.replace(
                '"area-registers": ("area-registers", 5),',
                '"area-registers": ("area-registers", 5),\n    ' + block + ",",
            )
        elif '"sequential-synth": ("sequential-synth", 5),' in cap:
            cap = cap.replace(
                '"sequential-synth": ("sequential-synth", 5),',
                '"sequential-synth": ("sequential-synth", 5),\n    ' + block + ",",
            )
        else:
            cap = cap.replace("\n}", ",\n    " + block + ",\n}", 1)
        CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
        print("Patched LAB_TO_ALGO")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="equivalence"' not in it:
        section = """
    <section class="tool-section" id="equivalence">
      <h2>Equivalence checking</h2>
      <ul class="tool-list">
        <li><a href="spec-impl/">Spec vs implementation</a></li>
        <li><a href="miter-build/">Miter construction</a></li>
        <li><a href="truth-table-cec/">Truth-table CEC</a></li>
        <li><a href="structural-hash/">Structural hash / FRAIG lite</a></li>
        <li><a href="sat-cnf-lite/">SAT / CNF encoding lite</a></li>
        <li><a href="counterexample/">Counterexample debug</a></li>
        <li><a href="dont-care/">Don't-care CEC</a></li>
        <li><a href="sequential-unroll/">Sequential unrolling</a></li>
        <li><a href="sequential-cec/">Sequential CEC lite</a></li>
      </ul>
    </section>

"""
        it = it.replace(
            '    <section class="tool-section" id="retiming">',
            section + '    <section class="tool-section" id="retiming">',
        )
        if 'id="equivalence"' not in it:
            it = it.replace(
                '    <section class="tool-section" id="synthesis">',
                section + '    <section class="tool-section" id="synthesis">',
            )
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools/index.html")

    print("OK")


if __name__ == "__main__":
    main()
