#!/usr/bin/env python3
"""Generate learn_signoff tools + wire walkthrough."""

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

IMP = """import { GOLDENS } from "../../assets/signoff-core.js";
import { createInteractiveSignoffLab } from "../../assets/interactive-signoff-lab.js";
const root = document.getElementById("lab-root");
"""


def ch(title, lead, challenges_js):
    return {
        "title": title,
        "lead": lead,
        "js": IMP
        + f"\ncreateInteractiveSignoffLab(root, {{\n  starterHtml: `<p><strong>Your job:</strong> {lead}</p>`,\n  challenges: [\n{challenges_js}\n  ],\n}});\n",
    }


LABS = {
    "corners": ch(
        "PVT corners",
        "List PVT corners; confirm corner_count=3.",
        """    { id: "run", title: "Corners", level: "Intro", prompt: "Click Corners.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getMode() === "corners" },
    { id: "c3", title: "Count 3", level: "Intro", prompt: "corner count 3.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getLast().count === GOLDENS.cornerCount },
    { id: "ss", title: "ss corner", level: "Practice", prompt: "ss_0p9_125 present.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getLast().corners.some(c => c.id === "ss_0p9_125") },
    { id: "tt", title: "tt corner", level: "Practice", prompt: "tt_1p0_25 present.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getLast().corners.some(c => c.id === "tt_1p0_25") },
    { id: "ff", title: "ff corner", level: "Practice", prompt: "ff_1p1_m40 present.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getLast().corners.some(c => c.id === "ff_1p1_m40") },
    { id: "der", title: "ss derate", level: "Practice", prompt: "ss derate 1.1.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getLast().corners.find(c => c.id === "ss_0p9_125")?.derate === 1.1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode corners.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getMode()==="corners" },
    { id: "golden", title: "cornerCount", level: "Challenge", prompt: "cornerCount=3.", check: () => GOLDENS.cornerCount === 3 },""",
    ),
    "signoff-corner": ch(
        "Signoff corner pick",
        "Pick signoff_corner ss_0p9_125 with derate=1.1.",
        """    { id: "run", title: "SignoffCorner", level: "Intro", prompt: "Click SignoffCorner.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getMode() === "signoff_corner" },
    { id: "id", title: "ss id", level: "Intro", prompt: "corner ss_0p9_125.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().corner.id === GOLDENS.signoffCorner },
    { id: "der", title: "derate 1.1", level: "Practice", prompt: "derate 1.1.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().derate === GOLDENS.signoffDerate },
    { id: "vdd", title: "Vdd 0.9", level: "Practice", prompt: "Vdd 0.9.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().corner.vdd === 0.9 },
    { id: "temp", title: "temp 125", level: "Practice", prompt: "temp 125.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().corner.temp === 125 },
    { id: "proc", title: "process ss", level: "Practice", prompt: "process ss.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().corner.process === "ss" },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode signoff_corner.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getMode()==="signoff_corner" },
    { id: "golden", title: "signoffCorner", level: "Challenge", prompt: "signoffCorner=ss_0p9_125.", check: () => GOLDENS.signoffCorner === "ss_0p9_125" },""",
    ),
    "derate": ch(
        "Derate formula",
        "Apply derate; derated=1.1 for delay=1.0.",
        """    { id: "run", title: "Derate", level: "Intro", prompt: "Click Derate.",
      setup: (_c, api) => api.showDerate(1.0), check: (_c, api) => api.getMode() === "derate" },
    { id: "d11", title: "derated 1.1", level: "Intro", prompt: "derated 1.1.",
      setup: (_c, api) => api.showDerate(1.0), check: (_c, api) => Math.abs(api.getLast().derated - 1.1) < 1e-9 },
    { id: "rate", title: "derate 1.1", level: "Practice", prompt: "derate 1.1.",
      setup: (_c, api) => api.showDerate(1.0), check: (_c, api) => api.getLast().derate === 1.1 },
    { id: "in", title: "delay 1", level: "Practice", prompt: "input delay 1.0.",
      setup: (_c, api) => api.showDerate(1.0), check: (_c, api) => api.getLast().delay === 1.0 },
    { id: "sel", title: "Select sta", level: "Practice", prompt: "Click check sta.",
      setup: (_c, api) => api.selectCheck("sta"), check: (_c, api) => api.getSelected().includes("sta") },
    { id: "corner", title: "signoff corner", level: "Practice", prompt: "signoff corner ss.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().corner.id === GOLDENS.signoffCorner },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode derate.",
      setup: (_c, api) => api.showDerate(), check: (_c, api) => api.getMode()==="derate" },
    { id: "golden", title: "signoffDerate", level: "Challenge", prompt: "signoffDerate=1.1.", check: () => GOLDENS.signoffDerate === 1.1 },""",
    ),
    "check-suite": ch(
        "Check suite",
        "Run checks; fail_count=2 (sta, antenna).",
        """    { id: "run", title: "Checks", level: "Intro", prompt: "Click Checks.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getMode() === "checks" },
    { id: "f2", title: "fail 2", level: "Intro", prompt: "fail count 2.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getLast().failCount === GOLDENS.failCount },
    { id: "p4", title: "pass 4", level: "Practice", prompt: "pass count 4.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getLast().passCount === GOLDENS.passCount },
    { id: "sta", title: "STA fail", level: "Practice", prompt: "STA fails.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getLast().fails.some(c => c.id === "sta") },
    { id: "ant", title: "antenna fail", level: "Practice", prompt: "antenna fails.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getLast().fails.some(c => c.id === "antenna") },
    { id: "sel", title: "Select antenna", level: "Practice", prompt: "Select antenna check.",
      setup: (_c, api) => api.selectCheck("antenna"), check: (_c, api) => api.getSelected().includes("antenna") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode checks.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getMode()==="checks" },
    { id: "golden", title: "failCount", level: "Challenge", prompt: "failCount=2.", check: () => GOLDENS.failCount === 2 },""",
    ),
    "eco-loop": ch(
        "ECO plan",
        "Plan ECOs; eco_count=2 fixes sta+antenna.",
        """    { id: "run", title: "ECO", level: "Intro", prompt: "Click ECO.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getMode() === "eco" },
    { id: "c2", title: "eco 2", level: "Intro", prompt: "eco count 2.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getLast().ecoCount === GOLDENS.ecoCount },
    { id: "all", title: "fixes all", level: "Practice", prompt: "fixes_all true.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getLast().fixesAll === true },
    { id: "e1", title: "eco1 sta", level: "Practice", prompt: "eco1 fixes sta.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getLast().ecos.find(e => e.id === "eco1")?.fixes.includes("sta") },
    { id: "e2", title: "eco2 ant", level: "Practice", prompt: "eco2 fixes antenna.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getLast().ecos.find(e => e.id === "eco2")?.fixes.includes("antenna") },
    { id: "sel", title: "Select sta", level: "Practice", prompt: "Select sta check.",
      setup: (_c, api) => api.selectCheck("sta"), check: (_c, api) => api.getSelected().includes("sta") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode eco.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getMode()==="eco" },
    { id: "golden", title: "ecoFixesAll", level: "Challenge", prompt: "ecoFixesAll=true.", check: () => GOLDENS.ecoFixesAll === true },""",
    ),
    "apply-ecos": ch(
        "Apply fixes",
        "Apply ECOs; fail_count→0.",
        """    { id: "run", title: "ApplyECO", level: "Intro", prompt: "Click ApplyECO.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getMode() === "apply_eco" },
    { id: "f0", title: "fail 0", level: "Intro", prompt: "fail count 0.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getLast().failCount === 0 },
    { id: "sta", title: "STA pass", level: "Practice", prompt: "STA passes.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getLast().checks.find(c => c.id === "sta")?.status === "pass" },
    { id: "ant", title: "antenna pass", level: "Practice", prompt: "antenna passes.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getLast().checks.find(c => c.id === "antenna")?.status === "pass" },
    { id: "drc", title: "DRC pass", level: "Practice", prompt: "DRC still pass.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getLast().checks.find(c => c.id === "drc")?.status === "pass" },
    { id: "sel", title: "Select drc", level: "Practice", prompt: "Select drc check.",
      setup: (_c, api) => api.selectCheck("drc"), check: (_c, api) => api.getSelected().includes("drc") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode apply_eco.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getMode()==="apply_eco" },
    { id: "golden", title: "failCount 0", level: "Challenge", prompt: "failCount=0 after apply.", check: (_c, api) => { api.applyEco(); return api.getLast().failCount === 0; } },""",
    ),
    "tapeout-checklist": ch(
        "Tapeout items",
        "Tapeout ready only after ECO; required=4.",
        """    { id: "before", title: "Before", level: "Intro", prompt: "Tapeout before ECO not ready.",
      setup: (_c, api) => api.showTapeout(false), check: (_c, api) => api.getLast().ready === false },
    { id: "after", title: "After ECO", level: "Intro", prompt: "Apply ECO then tapeout ready.",
      setup: (_c, api) => { api.applyEco(); api.showTapeout(true); }, check: (_c, api) => api.getLast().ready === true },
    { id: "req", title: "required 4", level: "Practice", prompt: "required_count 4.",
      setup: (_c, api) => api.showTapeout(false), check: (_c, api) => api.getLast().requiredCount === GOLDENS.tapeoutRequired },
    { id: "t3", title: "t3 block", level: "Practice", prompt: "t3 blocked before ECO.",
      setup: (_c, api) => api.showTapeout(false), check: (_c, api) => api.getLast().items.find(i => i.id === "t3")?.ok === false },
    { id: "t2", title: "t2 pass", level: "Practice", prompt: "t2 pass before ECO.",
      setup: (_c, api) => api.showTapeout(false), check: (_c, api) => api.getLast().items.find(i => i.id === "t2")?.ok === true },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode tapeout.",
      setup: (_c, api) => api.showTapeout(false), check: (_c, api) => api.getMode()==="tapeout" },
    { id: "eco", title: "Apply first", level: "Practice", prompt: "Apply ECO fixes antenna gate.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getLast().failCount === 0 },
    { id: "golden", title: "tapeoutAfter", level: "Challenge", prompt: "tapeoutReadyAfterEco=true.", check: () => GOLDENS.tapeoutReadyAfterEco === true },""",
    ),
    "signoff-markers": ch(
        "Fail markers",
        "Collect fail markers; marker_count=2.",
        """    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getMode() === "markers" },
    { id: "c2", title: "Count 2", level: "Intro", prompt: "marker count 2.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().count === GOLDENS.markerCount },
    { id: "sta", title: "STA marker", level: "Practice", prompt: "STA marker present.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().markers.some(m => m.check === "sta") },
    { id: "ant", title: "antenna marker", level: "Practice", prompt: "antenna marker present.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().markers.some(m => m.check === "antenna") },
    { id: "kind", title: "check_fail", level: "Practice", prompt: "kind check_fail.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().markers.every(m => m.kind === "check_fail") },
    { id: "sel", title: "Select sta", level: "Practice", prompt: "Select sta check.",
      setup: (_c, api) => api.selectCheck("sta"), check: (_c, api) => api.getSelected().includes("sta") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode markers.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getMode()==="markers" },
    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=2.", check: () => GOLDENS.markerCount === 2 },""",
    ),
    "signoff-engine": ch(
        "Signoff engine",
        "Run engine; confirm ok and markers=2.",
        """    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "m2", title: "Markers 2", level: "Practice", prompt: "markers 2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().markers.count === 2 },
    { id: "fail", title: "Fails 2", level: "Practice", prompt: "fail count 2 before ECO.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().checks.failCount === GOLDENS.failCount },
    { id: "eco", title: "ECO ok", level: "Practice", prompt: "fixes_all true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ecos.fixesAll === true },
    { id: "tape", title: "Tapeout", level: "Practice", prompt: "tapeout after ready.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().tapeoutAfter.ready === true },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode()==="engine" },
    { id: "golden", title: "engineOk", level: "Challenge", prompt: "engineOk=true.", check: () => GOLDENS.engineOk === true },""",
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

    write(WALK / "signoff-algos.js", (Path(__file__).parent / "_signoff_algos.js").read_text(encoding="utf-8"))

    wt = WALK / "walkthrough.js"
    text = wt.read_text(encoding="utf-8")
    if "SIGNOFF_ALGOS" not in text:
        text = text.replace(
            'import { DFT_ALGOS } from "./dft-algos.js";\n'
            'import { drawDft, STARTER as DFT_STARTER } from "../../assets/dft-core.js";\n',
            'import { DFT_ALGOS } from "./dft-algos.js";\n'
            'import { drawDft, STARTER as DFT_STARTER } from "../../assets/dft-core.js";\n'
            'import { SIGNOFF_ALGOS } from "./signoff-algos.js";\n'
            'import { drawSignoff, STARTER as SIGNOFF_STARTER } from "../../assets/signoff-core.js";\n',
        )
        text = text.replace(
            "  ...DFT_ALGOS,\n};",
            "  ...DFT_ALGOS,\n  ...SIGNOFF_ALGOS,\n};",
        )
        if 'pack.kind === "signoff"' not in text:
            text = text.replace(
                '  } else if (pack.kind === "erc") {',
                '''  } else if (pack.kind === "signoff") {
    drawSignoff(canvas, {
      design: s.design || SIGNOFF_STARTER,
      checks: s.checks || null,
      highlight: s.highlight || [],
      selected: s.selected || [],
      markers: s.markers || [],
      showEcos: s.showEcos !== false,
      showTapeout: s.showTapeout !== false,
      metricText: s.metricText || null,
    });
  } else if (pack.kind === "erc") {''',
            )
        wt.write_text(text, encoding="utf-8", newline="\n")
        print("Patched walkthrough.js")

    cap = CAPTURE.read_text(encoding="utf-8")
    if '"signoff-engine"' not in cap:
        block = ",\n    ".join(f'"{lab}": ("{lab}", 5)' for lab in LABS)
        needle = '"dft-engine": ("dft-engine", 5),'
        if needle in cap:
            cap = cap.replace(needle, needle + "\n    " + block + ",")
            CAPTURE.write_text(cap, encoding="utf-8", newline="\n")
            print("Patched LAB_TO_ALGO")
        else:
            print("WARN: could not patch LAB_TO_ALGO — dft-engine needle missing")

    idx = TOOLS / "index.html"
    it = idx.read_text(encoding="utf-8")
    if 'id="signoff"' not in it:
        section = """
    <section class="tool-section" id="signoff">
      <h2>Signoff</h2>
      <ul class="tool-list">
        <li><a href="corners/">PVT corners</a></li>
        <li><a href="signoff-corner/">Signoff corner pick</a></li>
        <li><a href="derate/">Derate formula</a></li>
        <li><a href="check-suite/">Check suite</a></li>
        <li><a href="eco-loop/">ECO plan</a></li>
        <li><a href="apply-ecos/">Apply fixes</a></li>
        <li><a href="tapeout-checklist/">Tapeout items</a></li>
        <li><a href="signoff-markers/">Fail markers</a></li>
        <li><a href="signoff-engine/">Signoff engine</a></li>
      </ul>
    </section>

"""
        dft_end = '    </section>\n\n\n    <section class="tool-section" id="spice">'
        if dft_end in it:
            it = it.replace(
                '    </section>\n\n\n    <section class="tool-section" id="spice">',
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
