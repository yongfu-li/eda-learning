import { ALGO_GOLDENS, PARTC_REAL, partcBind } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Extract AND→OR as ANDOR2; matches=1. REAL: ANDOR2×${PARTC_REAL.afterExtractMatches}.</p>`,
  challenges: [
    { id: "run", title: "Extract", level: "Intro", prompt: "Click Extract.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => api.getMode() === "extract" },
    { id: "m1", title: "matches=1", level: "Intro", prompt: "matches 1.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => api.getLast().matches === ALGO_GOLDENS.extractMatches },
    { id: "macro", title: "ANDOR2", level: "Practice", prompt: "macro ANDOR2.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => api.getLast().macro === "ANDOR2" },
    { id: "cell", title: "Macro cell", level: "Practice", prompt: "ANDOR2 cell present.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "ANDOR2") },
    { id: "no-or", title: "OR absorbed", level: "Practice", prompt: "no $or left from pattern.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => !api.getDesign().cells.some(c => c.id === "c_or") },
    { id: "sel", title: "Select macro", level: "Practice", prompt: "Select ANDOR2.",
      setup: (_c, api) => { api.showExtract(); const m = api.getDesign().cells.find(c => c.type === "ANDOR2"); if (m) api.select(m.id); },
      check: (_c, api) => api.getSelected().some(id => api.getDesign().cells.find(c => c.id === id)?.type === "ANDOR2") },
    { id: "mux", title: "Mux kept", level: "Challenge", prompt: "$mux kept.",
      setup: (_c, api) => api.showExtract(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$mux") },
    { id: "bind", title: "Bind real extract", level: "Challenge", prompt: "Real ANDOR2×1 matches teach.",
      check: () => partcBind("extract").ok === true },
    { id: "golden", title: "extractMatches", level: "Challenge", prompt: "extractMatches=1.",
      check: () => ALGO_GOLDENS.extractMatches === 1 },
  ],
});
