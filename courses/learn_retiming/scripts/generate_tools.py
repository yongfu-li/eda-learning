#!/usr/bin/env python3
"""Generate learn_retiming tools + wire walkthrough."""
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

IMP = """import { GOLDENS, PERIOD_TARGET } from "../../assets/retiming-core.js";
import { createInteractiveRetimingLab } from "../../assets/interactive-retiming-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(lab, title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveRetimingLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "sequential-graph": ch(
        "sequential-graph",
        "Sequential circuit graph",
        "Explore the toy sequential graph topology.",
        """    { id: "nodes5", title: "Five nodes", level: "Intro", prompt: "Graph has 5 nodes.", check: (_c, api) => api.getStats().nodes === GOLDENS.nodeCount },
    { id: "edges5", title: "Five edges", level: "Intro", prompt: "Five edges.", check: (_c, api) => api.getStats().edges === GOLDENS.edgeCount },
    { id: "comb3", title: "Three comb", level: "Intro", prompt: "Three combinational nodes.", check: (_c, api) => api.getStats().comb === GOLDENS.combCount },
    { id: "regs2", title: "Two registers", level: "Practice", prompt: "Baseline registers = 2.", check: (_c, api) => api.getBaselineRegisters() === GOLDENS.baseRegisters },
    { id: "sel-a", title: "Select a", level: "Practice", prompt: "Select node a.", check: (_c, api) => api.getSelected() === "a" },
    { id: "sel-c", title: "Select c", level: "Practice", prompt: "Select node c.", check: (_c, api) => { api.setSelected("c"); return api.getSelected() === "c"; } },
    { id: "zero-legal", title: "Zero legal", level: "Practice", prompt: "Zero retiming is legal.", check: (_c, api) => api.isLegal() },
    { id: "base-p", title: "Baseline period", level: "Challenge", prompt: "Baseline period is 8.", check: (_c, api) => api.getBaselinePeriod() === GOLDENS.baselinePeriod },""",
    ),
    "register-count": ch(
        "register-count",
        "Edge register counts",
        "Read edge weights and total register count.",
        """    { id: "base", title: "Sum = 2", level: "Intro", prompt: "Baseline registers = 2.", check: (_c, api) => api.getRegisters() === 2 },
    { id: "e0", title: "e0 w=1", level: "Intro", prompt: "Edge e0 has w=1 at baseline.", check: (_c, api) => api.getEdges().find(e => e.id==="e0").w === 1 },
    { id: "e1", title: "e1 w=0", level: "Practice", prompt: "e1 has w=0.", check: (_c, api) => api.getEdges().find(e => e.id==="e1").w === 0 },
    { id: "e2", title: "e2 w=1", level: "Practice", prompt: "e2 has w=1.", check: (_c, api) => api.getEdges().find(e => e.id==="e2").w === 1 },
    { id: "stats", title: "Stats regs", level: "Practice", prompt: "stats.registers = 2.", check: (_c, api) => api.getStats().registers === 2 },
    { id: "fwd-regs", title: "Forward raises", level: "Challenge", prompt: "Forward on a → 3 registers.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getRegisters() === GOLDENS.forwardARegisters },
    { id: "reset", title: "Reset to 2", level: "Practice", prompt: "Zero r restores 2.",
      check: (_c, api) => { api.forwardA(); api.resetR(); return api.getRegisters() === 2; } },
    { id: "golden", title: "GOLDENS", level: "Intro", prompt: "GOLDENS.baseRegisters is 2.", check: () => GOLDENS.baseRegisters === 2 },""",
    ),
    "path-delay": ch(
        "path-delay",
        "Zero-weight path delay",
        "Measure longest zero-weight combinational path delay.",
        """    { id: "base8", title: "P=8 baseline", level: "Intro", prompt: "Baseline period is 8.", check: (_c, api) => api.getBaselinePeriod() === 8 },
    { id: "curr8", title: "Current P=8", level: "Intro", prompt: "With zero r, period is 8.", check: (_c, api) => api.getPeriod() === 8 },
    { id: "target", title: "Target 5", level: "Intro", prompt: "Period target is 5.", check: (_c, api) => api.getTarget() === PERIOD_TARGET },
    { id: "fwd5", title: "Forward → 5", level: "Practice", prompt: "Forward on a makes P=5.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getPeriod() === 5 },
    { id: "legal", title: "Still legal", level: "Practice", prompt: "Forward a stays legal.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() },
    { id: "reset", title: "Reset period", level: "Practice", prompt: "Reset returns P=8.",
      check: (_c, api) => { api.forwardA(); api.resetR(); return api.getPeriod() === 8; } },
    { id: "golden", title: "GOLDENS.baseline", level: "Intro", prompt: "baselinePeriod=8.", check: () => GOLDENS.baselinePeriod === 8 },
    { id: "improve", title: "Improved", level: "Challenge", prompt: "After forward a, P < baseline.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getPeriod() < api.getBaselinePeriod() },""",
    ),
    "forward-retime": ch(
        "forward-retime",
        "Forward retiming",
        "Push registers forward across node a (−r).",
        """    { id: "run", title: "Forward on a", level: "Intro", prompt: "Click Forward on a.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getR().a === -1 },
    { id: "period", title: "P=5", level: "Intro", prompt: "Period becomes 5.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getPeriod() === GOLDENS.forwardAPeriod },
    { id: "regs", title: "Regs=3", level: "Practice", prompt: "Registers become 3.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getRegisters() === 3 },
    { id: "e0", title: "e0 → 0", level: "Practice", prompt: "After forward a, e0.w=0.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getEdges().find(e=>e.id==="e0").w === 0 },
    { id: "e1", title: "e1 → 1", level: "Practice", prompt: "e1.w becomes 1.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getEdges().find(e=>e.id==="e1").w === 1 },
    { id: "legal", title: "Legal", level: "Practice", prompt: "Forward a is legal.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() },
    { id: "mode", title: "Mode", level: "Practice", prompt: "Mode forward-a.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getMode() === "forward-a" },
    { id: "sel", title: "Selected a", level: "Challenge", prompt: "Selected node is a.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getSelected() === "a" },""",
    ),
    "backward-retime": ch(
        "backward-retime",
        "Backward retiming",
        "Try backward retiming on c and see the illegal edge.",
        """    { id: "run", title: "Backward on c", level: "Intro", prompt: "Click Backward on c.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => api.getR().c === 1 },
    { id: "illegal", title: "Illegal", level: "Intro", prompt: "Backward on c alone is illegal.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => !api.isLegal() },
    { id: "e3", title: "e3 negative", level: "Practice", prompt: "e3.w becomes −1.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => api.getEdges().find(e=>e.id==="e3").w === -1 },
    { id: "period", title: "P reported", level: "Practice", prompt: "Period still computes (toy).",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => Number.isFinite(api.getPeriod()) },
    { id: "mode", title: "Mode", level: "Practice", prompt: "Mode backward-c.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => api.getMode() === "backward-c" },
    { id: "reset-legal", title: "Reset legal", level: "Practice", prompt: "Zero r is legal again.",
      check: (_c, api) => { api.backwardC(); api.resetR(); return api.isLegal(); } },
    { id: "sel", title: "Selected c", level: "Practice", prompt: "Selected is c.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => api.getSelected() === "c" },
    { id: "contrast", title: "Forward ok", level: "Challenge", prompt: "Forward a is legal (contrast).",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() },""",
    ),
    "legal-retime": ch(
        "legal-retime",
        "Legal retiming",
        "Distinguish legal vs illegal retimings.",
        """    { id: "zero", title: "Zero legal", level: "Intro", prompt: "r≡0 is legal.", check: (_c, api) => api.isLegal() },
    { id: "fwd", title: "Forward legal", level: "Intro", prompt: "Forward a is legal.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() },
    { id: "bwd", title: "Backward illegal", level: "Practice", prompt: "Backward c is illegal.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => !api.isLegal() },
    { id: "neg", title: "Has negative w", level: "Practice", prompt: "Some edge w < 0 after backward c.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => api.getEdges().some(e => e.w < 0) },
    { id: "all-nonneg", title: "All ≥0 forward", level: "Practice", prompt: "All edges ≥0 after forward a.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getEdges().every(e => e.w >= 0) },
    { id: "reset", title: "Reset", level: "Practice", prompt: "Reset restores legality.",
      check: (_c, api) => { api.backwardC(); api.resetR(); return api.isLegal(); } },
    { id: "period-gate", title: "Legal before trust", level: "Challenge", prompt: "Only trust P when legal: forward a.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() && api.getPeriod() === 5 },
    { id: "golden", title: "Target", level: "Intro", prompt: "Target period 5.", check: () => PERIOD_TARGET === 5 },""",
    ),
    "period-bound": ch(
        "period-bound",
        "Period bound / FEAS lite",
        "Check feasibility: legal and period ≤ target.",
        """    { id: "target", title: "Target 5", level: "Intro", prompt: "Target is 5.", check: (_c, api) => api.getTarget() === 5 },
    { id: "base-fail", title: "Baseline fails", level: "Intro", prompt: "Zero r is not feasible for target 5.",
      check: (_c, api) => !api.feas() },
    { id: "fwd-pass", title: "Forward passes", level: "Practice", prompt: "Forward a is feasible.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.feas() },
    { id: "bwd-fail", title: "Backward fails", level: "Practice", prompt: "Backward c fails feas (illegal).",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => !api.feas() },
    { id: "legal-and", title: "Needs legal", level: "Practice", prompt: "feas requires legality.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() && api.feas() },
    { id: "p-le", title: "P ≤ target", level: "Practice", prompt: "After forward, P ≤ 5.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getPeriod() <= 5 },
    { id: "reset-fail", title: "Reset fails", level: "Practice", prompt: "After reset, feas false.",
      check: (_c, api) => { api.forwardA(); api.resetR(); return !api.feas(); } },
    { id: "golden", title: "GOLDENS.target", level: "Challenge", prompt: "periodTarget=5.", check: () => GOLDENS.periodTarget === 5 },""",
    ),
    "min-period": ch(
        "min-period",
        "Min-period search",
        "Run the lite min-period search and confirm improvement.",
        """    { id: "run", title: "Min period", level: "Intro", prompt: "Click Min period.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.getMode() === "min-period" },
    { id: "p5", title: "Best P=5", level: "Intro", prompt: "Best period is 5.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.getPeriod() === 5 },
    { id: "improved", title: "Improved", level: "Practice", prompt: "Search reports improved.",
      check: (_c, api) => api.runMinPeriod().improved === true },
    { id: "legal", title: "Legal best", level: "Practice", prompt: "Best retiming is legal.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.isLegal() },
    { id: "regs3", title: "Regs 3", level: "Practice", prompt: "Best uses 3 registers.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.getRegisters() === 3 },
    { id: "r-a", title: "r(a)=−1", level: "Practice", prompt: "Best has r(a)=−1.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.getR().a === -1 },
    { id: "search", title: "getSearch", level: "Practice", prompt: "getSearch has period.",
      check: (_c, api) => { api.runMinPeriod(); return api.getSearch().period === 5; } },
    { id: "seq", title: "Sequential", level: "Challenge", prompt: "sequential min_period works.",
      setup: (_c, api) => api.runSequential("min_period"), check: (_c, api) => api.getMode() === "sequential" && api.getPeriod() === 5 },""",
    ),
    "area-registers": ch(
        "area-registers",
        "Register area tradeoff",
        "Trade flip-flop count for a better period.",
        """    { id: "base2", title: "Baseline 2", level: "Intro", prompt: "Start with 2 registers.", check: (_c, api) => api.getRegisters() === 2 },
    { id: "trade", title: "Buy timing", level: "Intro", prompt: "Forward a → 3 regs, P=5.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getRegisters() === 3 && api.getPeriod() === 5 },
    { id: "cost", title: "+1 FF", level: "Practice", prompt: "One extra register vs baseline.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getRegisters() - api.getBaselineRegisters() === 1 },
    { id: "min", title: "Min period cost", level: "Practice", prompt: "Min period also costs 3 regs.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.getRegisters() === 3 },
    { id: "e-labels", title: "e1 has FF", level: "Practice", prompt: "After forward a, e1.w=1.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getEdges().find(e=>e.id==="e1").w === 1 },
    { id: "cheap-slow", title: "Cheap is slow", level: "Practice", prompt: "2 regs ⇒ P=8.",
      check: (_c, api) => api.getRegisters() === 2 && api.getPeriod() === 8 },
    { id: "reset", title: "Reset cheap", level: "Practice", prompt: "Reset restores 2 regs.",
      check: (_c, api) => { api.forwardA(); api.resetR(); return api.getRegisters() === 2; } },
    { id: "golden", title: "forwardARegisters", level: "Challenge", prompt: "GOLDENS.forwardARegisters=3.", check: () => GOLDENS.forwardARegisters === 3 },""",
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
    write(WALK / "retiming-algos.js", (Path(__file__).parent / "_retiming_algos.js").read_text(encoding="utf-8"))
    print("Wrote retiming-algos.js")

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "RETIMING_ALGOS" not in text:
        text = text.replace(
            'import { SYNTHESIS_ALGOS } from "./synthesis-algos.js";\n',
            'import { SYNTHESIS_ALGOS } from "./synthesis-algos.js";\n'
            'import { RETIMING_ALGOS } from "./retiming-algos.js";\n'
            'import { drawRetiming } from "../../assets/retiming-core.js";\n',
        )
        text = text.replace(
            "  ...SYNTHESIS_ALGOS,\n};",
            "  ...SYNTHESIS_ALGOS,\n  ...RETIMING_ALGOS,\n};",
        )
        if 'pack.kind === "retiming"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "synthesis") {',
                '''  } else if (pack.kind === "retiming") {
    drawRetiming(canvas, {
      nodes: s.nodes,
      edges: s.edges,
      layout: s.layout,
      r: s.r || null,
      selectedNode: s.selectedNode ?? null,
      highlight: s.highlight || [],
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "synthesis") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"sequential-graph"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        if '"sequential-synth": ("sequential-synth", 5),' in cap:
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
    if 'id="retiming"' not in it:
        section = """
    <section class="tool-section" id="retiming">
      <h2>Retiming</h2>
      <ul class="tool-list">
        <li><a href="sequential-graph/">Sequential circuit graph</a></li>
        <li><a href="register-count/">Edge register counts</a></li>
        <li><a href="path-delay/">Zero-weight path delay</a></li>
        <li><a href="forward-retime/">Forward retiming</a></li>
        <li><a href="backward-retime/">Backward retiming</a></li>
        <li><a href="legal-retime/">Legal retiming</a></li>
        <li><a href="period-bound/">Period bound / FEAS lite</a></li>
        <li><a href="min-period/">Min-period search</a></li>
        <li><a href="area-registers/">Register area tradeoff</a></li>
      </ul>
    </section>

"""
        it = it.replace(
            '    <section class="tool-section" id="synthesis">',
            section + '    <section class="tool-section" id="synthesis">',
        )
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools/index.html")

    print("OK")


if __name__ == "__main__":
    main()
