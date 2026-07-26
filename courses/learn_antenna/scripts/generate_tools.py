#!/usr/bin/env python3

"""Generate learn_antenna tools + wire walkthrough."""

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



IMP = """import { GOLDENS } from "../../assets/antenna-core.js";

import { createInteractiveAntennaLab } from "../../assets/interactive-antenna-lab.js";

const root = document.getElementById("lab-root");

"""





def ch(title, lead, challenges_js):

    return {

        "title": title,

        "lead": lead,

        "js": IMP

        + f"\ncreateInteractiveAntennaLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",

    }





LABS = {

    "metal-area": ch(

        "Metal area",

        "Sum metal area per net; confirm n1=25.",

        """    { id: "run", title: "Metal", level: "Intro", prompt: "Click Metal.",

      setup: (_c, api) => api.showMetal(), check: (_c, api) => api.getMode() === "metal" },

    { id: "n1", title: "n1=25", level: "Intro", prompt: "n1 metal area 25.",

      setup: (_c, api) => api.showMetal(), check: (_c, api) => api.getLast().n1 === GOLDENS.metalAreaN1 },

    { id: "n3", title: "n3=45", level: "Practice", prompt: "n3 metal sum 45.",

      setup: (_c, api) => api.showMetal(), check: (_c, api) => api.getLast().n3 === 45 },

    { id: "n2", title: "n2=8", level: "Practice", prompt: "n2 metal 8.",

      setup: (_c, api) => api.showMetal(), check: (_c, api) => api.getLast().n2 === 8 },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Click net n1.",

      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },

    { id: "mc", title: "Four metals", level: "Practice", prompt: "metalCount 4.", check: (_c, api) => api.getStats().metalCount === GOLDENS.metalCount },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode metal.",

      setup: (_c, api) => api.showMetal(), check: (_c, api) => api.getMode()==="metal" },

    { id: "golden", title: "metalAreaN1", level: "Challenge", prompt: "metalAreaN1=25.", check: () => GOLDENS.metalAreaN1 === 25 },""",

    ),

    "gate-area": ch(

        "Gate area",

        "Sum gate area; confirm n1 gate=1.",

        """    { id: "run", title: "Gates", level: "Intro", prompt: "Click Gates.",

      setup: (_c, api) => api.showGates(), check: (_c, api) => api.getMode() === "gates" },

    { id: "n1", title: "n1=1", level: "Intro", prompt: "n1 gate area 1.",

      setup: (_c, api) => api.showGates(), check: (_c, api) => api.getLast().n1 === GOLDENS.gateAreaN1 },

    { id: "n2", title: "n2=2", level: "Practice", prompt: "n2 gate 2.",

      setup: (_c, api) => api.showGates(), check: (_c, api) => api.getLast().n2 === 2 },

    { id: "n3", title: "n3=1", level: "Practice", prompt: "n3 gate 1.",

      setup: (_c, api) => api.showGates(), check: (_c, api) => api.getLast().n3 === 1 },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",

      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },

    { id: "gc", title: "Three gates", level: "Practice", prompt: "gateCount 3.", check: (_c, api) => api.getStats().gateCount === GOLDENS.gateCount },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode gates.",

      setup: (_c, api) => api.showGates(), check: (_c, api) => api.getMode()==="gates" },

    { id: "golden", title: "gateAreaN1", level: "Challenge", prompt: "gateAreaN1=1.", check: () => GOLDENS.gateAreaN1 === 1 },""",

    ),

    "antenna-ratio": ch(

        "Antenna ratio",

        "Compute metal/gate; n1=25, n2=4, n3=45.",

        """    { id: "run", title: "Ratio", level: "Intro", prompt: "Click Ratio.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getMode() === "ratio" },

    { id: "n1", title: "n1=25", level: "Intro", prompt: "n1 ratio 25.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getLast().ratios.n1 === GOLDENS.ratioN1 },

    { id: "n2", title: "n2=4", level: "Practice", prompt: "n2 ratio 4.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getLast().ratios.n2 === GOLDENS.ratioN2 },

    { id: "n3", title: "n3=45", level: "Practice", prompt: "n3 ratio 45.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getLast().ratios.n3 === GOLDENS.ratioN3 },

    { id: "sel", title: "Select n3", level: "Practice", prompt: "Select n3.",

      setup: (_c, api) => api.selectNet("n3"), check: (_c, api) => api.getSelected().includes("n3") },

    { id: "metal", title: "Metal n1", level: "Practice", prompt: "n1 metal 25.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getLast().metal.n1 === 25 },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode ratio.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getMode()==="ratio" },

    { id: "golden", title: "ratioN1", level: "Challenge", prompt: "ratioN1=25.", check: () => GOLDENS.ratioN1 === 25 },""",

    ),

    "charge-accumulation": ch(

        "Charge accumulation",

        "Q=k×metal; confirm charge n1=25.",

        """    { id: "run", title: "Charge", level: "Intro", prompt: "Click Charge.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getMode() === "charge" },

    { id: "n1", title: "Q n1=25", level: "Intro", prompt: "charge n1 25.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getLast().charge.n1 === GOLDENS.chargeN1 },

    { id: "k", title: "k=1", level: "Practice", prompt: "charge_k 1.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getLast().k === 1 },

    { id: "n3", title: "Q n3", level: "Practice", prompt: "charge n3 45.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getLast().charge.n3 === 45 },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",

      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },

    { id: "metal", title: "Uses metal", level: "Practice", prompt: "metal n1 25.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getLast().metal.n1 === 25 },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode charge.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getMode()==="charge" },

    { id: "golden", title: "chargeN1", level: "Challenge", prompt: "chargeN1=25.", check: () => GOLDENS.chargeN1 === 25 },""",

    ),

    "threshold-rules": ch(

        "Threshold rules",

        "Raw violations without diode: 2 (n1,n3).",

        """    { id: "run", title: "Threshold", level: "Intro", prompt: "Click Threshold.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => api.getMode() === "threshold" },

    { id: "c2", title: "Count 2", level: "Intro", prompt: "raw violations 2.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => api.getLast().count === GOLDENS.rawViolationCount },

    { id: "n1", title: "n1 hit", level: "Practice", prompt: "n1 violates.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => api.getLast().hits.some(h=>h.net==="n1") },

    { id: "n3", title: "n3 hit", level: "Practice", prompt: "n3 violates.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => api.getLast().hits.some(h=>h.net==="n3") },

    { id: "n2ok", title: "n2 ok", level: "Practice", prompt: "n2 not in hits.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => !api.getLast().hits.some(h=>h.net==="n2") },

    { id: "sel", title: "Select n3", level: "Practice", prompt: "Select n3.",

      setup: (_c, api) => api.selectNet("n3"), check: (_c, api) => api.getSelected().includes("n3") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode threshold.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => api.getMode()==="threshold" },

    { id: "golden", title: "rawViolationCount", level: "Challenge", prompt: "rawViolationCount=2.", check: () => GOLDENS.rawViolationCount === 2 },""",

    ),

    "diode-protection": ch(

        "Diode protection",

        "Diode on n3 → violations=1 (n1 only).",

        """    { id: "run", title: "Diode", level: "Intro", prompt: "Click Diode.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => api.getMode() === "diode" },

    { id: "c1", title: "Count 1", level: "Intro", prompt: "violations 1.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => api.getLast().count === GOLDENS.violationCount },

    { id: "n1", title: "n1 only", level: "Practice", prompt: "hit is n1.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => api.getLast().hits[0].net==="n1" },

    { id: "prot", title: "n3 protected", level: "Practice", prompt: "n3 protected.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => api.getLast().protected.includes("n3") },

    { id: "notn3", title: "Not n3", level: "Practice", prompt: "n3 not in hits.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => !api.getLast().hits.some(h=>h.net==="n3") },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",

      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode diode.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => api.getMode()==="diode" },

    { id: "golden", title: "violationCount", level: "Challenge", prompt: "violationCount=1.", check: () => GOLDENS.violationCount === 1 },""",

    ),

    "jumper-break": ch(

        "Jumper break",

        "Jumper max_layer=1 on n1 → ratio 0.",

        """    { id: "run", title: "Jumper", level: "Intro", prompt: "Click Jumper.",

      setup: (_c, api) => api.applyJumperBreak(), check: (_c, api) => api.getMode() === "jumper" },

    { id: "after", title: "After 0", level: "Intro", prompt: "after ratio 0.",

      setup: (_c, api) => api.applyJumperBreak(), check: (_c, api) => api.getLast().afterRatio === GOLDENS.jumperN1Ratio },

    { id: "before", title: "Before 25", level: "Practice", prompt: "before ratio 25.",

      setup: (_c, api) => api.applyJumperBreak(), check: (_c, api) => api.getLast().beforeRatio === 25 },

    { id: "ratio", title: "Show ratio", level: "Practice", prompt: "n1 ratio 0 after.",

      setup: (_c, api) => { api.applyJumperBreak(); api.showRatio(); }, check: (_c, api) => api.getLast().ratios.n1 === 0 },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",

      setup: (_c, api) => { api.applyJumperBreak(); api.selectNet("n1"); }, check: (_c, api) => api.getSelected().includes("n1") },

    { id: "jmp", title: "Jumper set", level: "Practice", prompt: "jumper on design.",

      setup: (_c, api) => api.applyJumperBreak(), check: (_c, api) => api.getDesign().jumpers.some(j=>j.net==="n1") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode jumper.",

      setup: (_c, api) => api.applyJumperBreak(), check: (_c, api) => api.getMode()==="jumper" },

    { id: "golden", title: "jumperN1Ratio", level: "Challenge", prompt: "jumperN1Ratio=0.", check: () => GOLDENS.jumperN1Ratio === 0 },""",

    ),

    "antenna-markers": ch(

        "Antenna markers",

        "Collect markers; confirm count=1.",

        """    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",

      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode() === "markers" },

    { id: "c1", title: "Count 1", level: "Intro", prompt: "marker count 1.",

      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().count === GOLDENS.markerCount },

    { id: "n1", title: "n1 marker", level: "Practice", prompt: "marker on n1.",

      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers[0].net==="n1" },

    { id: "kind", title: "Kind", level: "Practice", prompt: "kind antenna_ratio.",

      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers[0].kind==="antenna_ratio" },

    { id: "notn3", title: "Not n3", level: "Practice", prompt: "no n3 marker.",

      setup: (_c, api) => api.collect(), check: (_c, api) => !api.getLast().markers.some(m=>m.net==="n3") },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",

      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode markers.",

      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode()==="markers" },

    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=1.", check: () => GOLDENS.markerCount === 1 },""",

    ),

    "antenna-engine": ch(

        "Antenna engine",

        "Run engine; confirm ok and markers=1.",

        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },

    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },

    { id: "m1", title: "Markers 1", level: "Practice", prompt: "markers 1.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().markers.count === 1 },

    { id: "viol", title: "Viol 1", level: "Practice", prompt: "violations 1.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().violations.count === 1 },

    { id: "r1", title: "Ratio n1", level: "Practice", prompt: "n1 ratio 25.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ratios.ratios.n1 === 25 },

    { id: "jmp", title: "Jumper", level: "Practice", prompt: "jumper after 0.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().jumper.afterRatio === 0 },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode engine.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode()==="engine" },

    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=1.", check: () => GOLDENS.markerCount === 1 },""",

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

    write(WALK / "antenna-algos.js", (Path(__file__).parent / "_antenna_algos.js").read_text(encoding="utf-8"))



    wt = WALK / "walkthrough.js"

    text = wt.read_text(encoding="utf-8")

    if "ANTENNA_ALGOS" not in text:

        text = text.replace(

            'import { ERC_ALGOS } from "./erc-algos.js";\n'

            'import { drawErc, STARTER as ERC_STARTER } from "../../assets/erc-core.js";\n',

            'import { ERC_ALGOS } from "./erc-algos.js";\n'

            'import { drawErc, STARTER as ERC_STARTER } from "../../assets/erc-core.js";\n'

            'import { ANTENNA_ALGOS } from "./antenna-algos.js";\n'

            'import { drawAntenna, STARTER as ANTENNA_STARTER } from "../../assets/antenna-core.js";\n',

        )

        text = text.replace(

            "  ...ERC_ALGOS,\n};",

            "  ...ERC_ALGOS,\n  ...ANTENNA_ALGOS,\n};",

        )

        if 'pack.kind === "antenna"' not in text:

            text = text.replace(

                '  } else if (pack.kind === "erc") {',

                '''  } else if (pack.kind === "antenna") {

    drawAntenna(canvas, {

      design: s.design || ANTENNA_STARTER,

      highlight: s.highlight || [],

      selected: s.selected || [],

      markers: s.markers || [],

      metricText: s.metricText || null,

    });

  } else if (pack.kind === "erc") {''',

            )

        wt.write_text(text, encoding="utf-8", newline="\n")

        print("Patched walkthrough.js")



    cap = CAPTURE.read_text(encoding="utf-8")

    if '"antenna-engine"' not in cap:

        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)

        needle = '"erc-engine": ("erc-engine", 5),'

        if needle in cap:

            cap = cap.replace(needle, needle + "\n    " + block + ",")

            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")

            print("Patched LAB_TO_ALGO")

        else:

            needle2 = '"mp-engine": ("mp-engine", 5),'

            if needle2 in cap and "antenna-engine" not in cap:

                cap = cap.replace(needle2, needle2 + "\n    " + block + ",")

                CAPTURE.write_text(cap, encoding="utf-8", newline="\n")

                print("Patched LAB_TO_ALGO (via mp-engine)")



    idx = TOOLS / "index.html"

    it = idx.read_text(encoding="utf-8")

    if 'id="antenna"' not in it:

        section = """

    <section class="tool-section" id="antenna">

      <h2>Antenna checks</h2>

      <ul class="tool-list">

        <li><a href="metal-area/">Metal area</a></li>

        <li><a href="gate-area/">Gate area</a></li>

        <li><a href="antenna-ratio/">Antenna ratio</a></li>

        <li><a href="charge-accumulation/">Charge accumulation</a></li>

        <li><a href="threshold-rules/">Threshold rules</a></li>

        <li><a href="diode-protection/">Diode protection</a></li>

        <li><a href="jumper-break/">Jumper break</a></li>

        <li><a href="antenna-markers/">Antenna markers</a></li>

        <li><a href="antenna-engine/">Antenna engine</a></li>

      </ul>

    </section>



"""

        erc_end = '    </section>\n\n    <section class="tool-section" id="spice">'
        if erc_end in it:
            it = it.replace(
                erc_end,
                '    </section>\n' + section + '\n    <section class="tool-section" id="spice">',
            )
        elif 'id="spice"' in it:

            it = it.replace(

                '    <section class="tool-section" id="spice">',

                section + '    <section class="tool-section" id="spice">',

            )

        else:

            it = it.replace(

                '    <section class="tool-section" id="multi-patterning">',

                section + '    <section class="tool-section" id="multi-patterning">',

            )

        idx.write_text(it, encoding="utf-8", newline="\n")

        print("Patched tools/index.html")

    print("OK")





if __name__ == "__main__":

    main()

