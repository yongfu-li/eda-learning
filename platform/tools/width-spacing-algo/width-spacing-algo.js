import { ALGO_GOLDENS, PARTC_REAL, klayoutAlgoEngine, partcBind } from "../../assets/algo-klayout-core.js";
import { createInteractiveAlgoKlayoutLab } from "../../assets/interactive-algo-klayout-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoKlayoutLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Width spacing algorithm. Run stages / bind, then Check.</p>`,
  defaultMode: "width_spacing",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open width_spacing.",
      setup: (_c, api) => api.showWidthSpacing(), check: (_c, api) => api.getMode() === "width_spacing" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.showWidthSpacing(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "layers", title: "Layer query", level: "Practice", prompt: "layerQueryCount=2.",
      check: () => ALGO_GOLDENS.layerQueryCount === 2 },
    { id: "viol", title: "Width violation", level: "Practice", prompt: "widthViolations=1 on m0.",
      check: () => ALGO_GOLDENS.widthViolations === 1 },
    { id: "bind", title: "Bind markers", level: "Practice", prompt: "Bind markers ok.",
      setup: (_c, api) => api.showBind("markers"), check: (_c, api) => api.getLast()?.ok === true },
    { id: "real", title: "Real markers", level: "Practice", prompt: "PARTC_REAL.markerCount=1.",
      check: () => PARTC_REAL.markerCount === 1 },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true || klayoutAlgoEngine().ok },
  ],
});
