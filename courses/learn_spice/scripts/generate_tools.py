#!/usr/bin/env python3
"""Generate learn_spice tools + wire walkthrough."""
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

IMP = """import { GOLDENS } from "../../assets/spice-core.js";
import { createInteractiveSpiceLab } from "../../assets/interactive-spice-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveSpiceLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "netlist-nodes": ch(
        "Netlist nodes",
        "Inspect netlist; confirm 5 elements and 2 unknowns.",
        """    { id: "run", title: "Show netlist", level: "Intro", prompt: "Click Netlist.",
      setup: (_c, api) => api.showNetlist(), check: (_c, api) => api.getMode() === "netlist" },
    { id: "n5", title: "Five elems", level: "Intro", prompt: "elementCount 5.", check: (_c, api) => api.getStats().elementCount === GOLDENS.elementCount },
    { id: "un", title: "Two unknowns", level: "Practice", prompt: "unknownNodes 2.", check: (_c, api) => api.getStats().unknownNodes === GOLDENS.unknownNodes },
    { id: "gnd", title: "Ground 0", level: "Practice", prompt: "ground is 0.", check: (_c, api) => api.getNet().ground === "0" },
    { id: "vin", title: "Has Vin", level: "Practice", prompt: "Vin present.", check: (_c, api) => api.getNet().elements.some(e=>e.id==="Vin") },
    { id: "c", title: "Has C", level: "Practice", prompt: "Cload present.", check: (_c, api) => api.getNet().elements.some(e=>e.id==="Cload") },
    { id: "d", title: "Has D", level: "Practice", prompt: "Dprot present.", check: (_c, api) => api.getNet().elements.some(e=>e.id==="Dprot") },
    { id: "golden", title: "elementCount", level: "Challenge", prompt: "elementCount=5.", check: () => GOLDENS.elementCount === 5 },""",
    ),
    "mna-stamps": ch(
        "MNA stamps",
        "Stamp MNA; confirm size 3.",
        """    { id: "run", title: "Stamp", level: "Intro", prompt: "Click Stamp MNA.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getMode() === "mna" },
    { id: "sz", title: "Size 3", level: "Intro", prompt: "size is 3.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getLast().size === GOLDENS.mnaSize },
    { id: "g", title: "Has G", level: "Practice", prompt: "G is 3x3.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getLast().G.length === 3 },
    { id: "b", title: "Has b", level: "Practice", prompt: "b length 3.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getLast().b.length === 3 },
    { id: "idx", title: "Has node 2", level: "Practice", prompt: "idx has 2.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getLast().idx["2"] != null },
    { id: "vb", title: "Vin branch", level: "Practice", prompt: "vBranch Vin.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getLast().vBranch.Vin != null },
    { id: "els", title: "5 elems", level: "Practice", prompt: "elementCount 5.", check: (_c, api) => api.getStats().elementCount === 5 },
    { id: "golden", title: "mnaSize", level: "Challenge", prompt: "mnaSize=3.", check: () => GOLDENS.mnaSize === 3 },""",
    ),
    "dc-linear": ch(
        "DC linear",
        "DC solve; confirm V2=3.",
        """    { id: "run", title: "DC solve", level: "Intro", prompt: "Click DC solve.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => api.getMode() === "dc" },
    { id: "v2", title: "V2=3", level: "Intro", prompt: "volts[2] is 3.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => Math.abs(api.getVolts()["2"] - GOLDENS.v2Dc) < 1e-9 },
    { id: "v1", title: "V1=5", level: "Practice", prompt: "volts[1] is 5.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => Math.abs(api.getVolts()["1"] - GOLDENS.v1Dc) < 1e-9 },
    { id: "sz", title: "Size 3", level: "Practice", prompt: "size 3.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => api.getLast().size === 3 },
    { id: "x", title: "x len 3", level: "Practice", prompt: "x length 3.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => api.getLast().x.length === 3 },
    { id: "mode", title: "Mode dc", level: "Practice", prompt: "mode dc.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => api.getMode()==="dc" },
    { id: "reset", title: "Reset", level: "Practice", prompt: "Reset clears volts.",
      setup: (_c, api) => { api.dcSolve(); api.reset(); }, check: (_c, api) => api.getVolts() == null },
    { id: "golden", title: "v2Dc", level: "Challenge", prompt: "v2Dc=3.", check: () => GOLDENS.v2Dc === 3 },""",
    ),
    "sparse-lu": ch(
        "Sparse LU",
        "Factor G; confirm nnz=6.",
        """    { id: "run", title: "LU", level: "Intro", prompt: "Click Sparse LU.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getMode() === "lu" },
    { id: "nnz", title: "NNZ 6", level: "Intro", prompt: "nnz is 6.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getLast().nnz === GOLDENS.nnz },
    { id: "n", title: "n 3", level: "Practice", prompt: "n is 3.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getLast().n === 3 },
    { id: "L", title: "Has L", level: "Practice", prompt: "L present.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getLast().L.length === 3 },
    { id: "U", title: "Has U", level: "Practice", prompt: "U present.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getLast().U.length === 3 },
    { id: "diag", title: "L diag 1", level: "Practice", prompt: "L[0][0]=1.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getLast().L[0][0] === 1 },
    { id: "mode", title: "Mode lu", level: "Practice", prompt: "mode lu.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getMode()==="lu" },
    { id: "golden", title: "nnz", level: "Challenge", prompt: "nnz=6.", check: () => GOLDENS.nnz === 6 },""",
    ),
    "newton-raphson": ch(
        "Newton–Raphson",
        "Run Newton; confirm 1 iter and V2=3.",
        """    { id: "run", title: "Newton", level: "Intro", prompt: "Click Newton.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getMode() === "nr" },
    { id: "conv", title: "Converged", level: "Intro", prompt: "converged true.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getLast().converged === true },
    { id: "it", title: "1 iter", level: "Practice", prompt: "iters is 1.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getLast().iters === GOLDENS.nrItersLinear },
    { id: "v2", title: "V2=3", level: "Practice", prompt: "v2 is 3.",
      setup: (_c, api) => api.newton(), check: (_c, api) => Math.abs(api.getLast().v2 - 3) < 1e-9 },
    { id: "volts", title: "Volts set", level: "Practice", prompt: "volts present.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getVolts() != null },
    { id: "res", title: "Residual", level: "Practice", prompt: "residuals nonempty.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getLast().residuals.length >= 1 },
    { id: "mode", title: "Mode nr", level: "Practice", prompt: "mode nr.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getMode()==="nr" },
    { id: "golden", title: "nrItersLinear", level: "Challenge", prompt: "nrItersLinear=1.", check: () => GOLDENS.nrItersLinear === 1 },""",
    ),
    "device-callbacks": ch(
        "Device callbacks",
        "Diode callback + 1-D NR converges.",
        """    { id: "run", title: "Diode NR", level: "Intro", prompt: "Click Diode NR.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => api.getMode() === "diode" },
    { id: "conv", title: "Converged", level: "Intro", prompt: "loop converged.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => api.getLast().loop.converged === GOLDENS.diodeNrConverged },
    { id: "cb", title: "cb at 0", level: "Practice", prompt: "i≈0 at v=0.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => Math.abs(api.getLast().cb.i) < 1e-14 },
    { id: "g", title: "Has g", level: "Practice", prompt: "g defined.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => api.getLast().cb.g > 0 },
    { id: "iters", title: "iters≥1", level: "Practice", prompt: "iters >= 1.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => api.getLast().loop.iters >= 1 },
    { id: "vd", title: "vd set", level: "Practice", prompt: "vd number.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => typeof api.getLast().loop.vd === "number" },
    { id: "mode", title: "Mode diode", level: "Practice", prompt: "mode diode.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => api.getMode()==="diode" },
    { id: "golden", title: "diodeNrConverged", level: "Challenge", prompt: "diodeNrConverged true.", check: () => GOLDENS.diodeNrConverged === true },""",
    ),
    "transient-be": ch(
        "Transient BE",
        "TRAN BE; confirm 4 steps and final≈2.255.",
        """    { id: "run", title: "TRAN", level: "Intro", prompt: "Click TRAN BE.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getMode() === "tran" },
    { id: "steps", title: "4 steps", level: "Intro", prompt: "history length 4.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getHistory().length === GOLDENS.tranSteps },
    { id: "fin", title: "Final≈2.255", level: "Practice", prompt: "finalV2≈2.255.",
      setup: (_c, api) => api.transient(), check: (_c, api) => Math.abs(api.getLast().finalV2 - GOLDENS.tranFinalV2) < 1e-5 },
    { id: "dt", title: "dt 0.5", level: "Practice", prompt: "dt is 0.5.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getLast().dt === GOLDENS.tranDt },
    { id: "t1", title: "t1=0.5", level: "Practice", prompt: "first t=0.5.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getHistory()[0].t === 0.5 },
    { id: "rise", title: "Rising", level: "Practice", prompt: "v2 increases.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getHistory()[3].v2 > api.getHistory()[0].v2 },
    { id: "mode", title: "Mode tran", level: "Practice", prompt: "mode tran.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getMode()==="tran" },
    { id: "golden", title: "tranSteps", level: "Challenge", prompt: "tranSteps=4.", check: () => GOLDENS.tranSteps === 4 },""",
    ),
    "op-tran-pipeline": ch(
        "OP→TRAN pipeline",
        "Run OP→TRAN pipeline.",
        """    { id: "run", title: "Pipeline", level: "Intro", prompt: "Click OP→TRAN.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getMode() === "pipeline" },
    { id: "dc", title: "DC 3", level: "Intro", prompt: "dc v2 is 3.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => Math.abs(api.getLast().dc.volts["2"] - 3) < 1e-9 },
    { id: "tr", title: "TRAN 4", level: "Practice", prompt: "tran 4 steps.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getLast().tr.history.length === 4 },
    { id: "hist", title: "History", level: "Practice", prompt: "history set.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getHistory().length === 4 },
    { id: "volts", title: "Volts OP", level: "Practice", prompt: "volts from OP.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getVolts()["1"] === 5 },
    { id: "fin", title: "Final", level: "Practice", prompt: "tran final set.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getLast().tr.finalV2 > 2 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode pipeline.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getMode()==="pipeline" },
    { id: "golden", title: "v2Dc", level: "Challenge", prompt: "v2Dc=3.", check: () => GOLDENS.v2Dc === 3 },""",
    ),
    "spice-engine": ch(
        "SPICE engine",
        "Run engine; confirm ok and dcV2=3.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "dc", title: "dcV2=3", level: "Practice", prompt: "dcV2 is 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => Math.abs(api.getLast().dcV2 - 3) < 1e-9 },
    { id: "nr", title: "NR conv", level: "Practice", prompt: "nrConverged.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().nrConverged === true },
    { id: "diode", title: "Diode ok", level: "Practice", prompt: "diode converged.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().diode.converged === true },
    { id: "tran", title: "TRAN", level: "Practice", prompt: "tranFinalV2 > 2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().tranFinalV2 > 2 },
    { id: "sz", title: "MNA 3", level: "Practice", prompt: "mnaSize 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().mnaSize === 3 },
    { id: "golden", title: "v2Dc", level: "Challenge", prompt: "v2Dc=3.", check: () => GOLDENS.v2Dc === 3 },""",
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
    write(WALK / "spice-algos.js", (Path(__file__).parent / "_spice_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "SPICE_ALGOS" not in text:
        text = text.replace(
            'import { MULTI_PATTERN_ALGOS } from "./multi-patterning-algos.js";\n'
            'import { drawMultiPatterning, STARTER as MP_STARTER, CHIP as MP_CHIP } from "../../assets/multi-patterning-core.js";\n',
            'import { MULTI_PATTERN_ALGOS } from "./multi-patterning-algos.js";\n'
            'import { drawMultiPatterning, STARTER as MP_STARTER, CHIP as MP_CHIP } from "../../assets/multi-patterning-core.js";\n'
            'import { SPICE_ALGOS } from "./spice-algos.js";\n'
            'import { drawSpice, STARTER as SPICE_STARTER } from "../../assets/spice-core.js";\n',
        )
        text = text.replace(
            "  ...MULTI_PATTERN_ALGOS,\n};",
            "  ...MULTI_PATTERN_ALGOS,\n  ...SPICE_ALGOS,\n};",
        )
        if 'pack.kind === "spice"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "multipattern") {',
                '''  } else if (pack.kind === "spice") {
    drawSpice(canvas, {
      net: s.net || SPICE_STARTER,
      volts: s.volts || null,
      history: s.history || null,
      highlight: s.highlight || [],
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "multipattern") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"spice-engine"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"mp-engine": ("mp-engine", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="spice"' not in it:
        section = """
    <section class="tool-section" id="spice">
      <h2>SPICE / circuit sim</h2>
      <ul class="tool-list">
        <li><a href="netlist-nodes/">Netlist nodes</a></li>
        <li><a href="mna-stamps/">MNA stamps</a></li>
        <li><a href="dc-linear/">DC linear</a></li>
        <li><a href="sparse-lu/">Sparse LU</a></li>
        <li><a href="newton-raphson/">Newton–Raphson</a></li>
        <li><a href="device-callbacks/">Device callbacks</a></li>
        <li><a href="transient-be/">Transient BE</a></li>
        <li><a href="op-tran-pipeline/">OP→TRAN pipeline</a></li>
        <li><a href="spice-engine/">SPICE engine</a></li>
      </ul>
    </section>

"""
        it = it.replace(
            '    <section class="tool-section" id="multi-patterning">',
            section + '    <section class="tool-section" id="multi-patterning">',
        )
        idx.write_text(it, encoding="utf-8", newline="\n")
        print("Patched tools/index.html")
    print("OK")


if __name__ == "__main__":
    main()
