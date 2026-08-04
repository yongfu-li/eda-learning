import { ALGO_GOLDENS, PARTC_REAL, magicAlgoEngine, partcBind } from "../../assets/algo-magic-core.js";
import { createInteractiveAlgoMagicLab } from "../../assets/interactive-algo-magic-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoMagicLab(root, {
  starterHtml: `<p><strong>Your job:</strong> DRC region algorithm. Run stages / bind, then Check.</p>`,
  defaultMode: "drc_region",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open drc_region.",
      setup: (_c, api) => api.showDrcRegion(), check: (_c, api) => api.getMode() === "drc_region" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.showDrcRegion(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "contact", title: "Contact golden", level: "Practice", prompt: "contactCount=1.",
      check: () => ALGO_GOLDENS.contactCount === 1 },
    { id: "bind", title: "Bind DRC", level: "Practice", prompt: "Bind drc ok.",
      setup: (_c, api) => api.showBind("drc"), check: (_c, api) => api.getLast()?.ok === true },
    { id: "real", title: "Real DRC", level: "Practice", prompt: "PARTC_REAL.drcErrorCount=1.",
      check: () => PARTC_REAL.drcErrorCount === 1 },
    { id: "select", title: "Select shape", level: "Challenge", prompt: "Select a shape.",
      setup: (_c, api) => { api.showDrcRegion(); const h = api.getHighlight(); if (h[0]) api.select(h[0]); },
      check: (_c, api) => api.getSelected().length >= 1 },
    { id: "gds", title: "GDS golden", level: "Challenge", prompt: "gdsLayerCount=6.",
      check: () => ALGO_GOLDENS.gdsLayerCount === 6 },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true || magicAlgoEngine().ok },
  ],
});
