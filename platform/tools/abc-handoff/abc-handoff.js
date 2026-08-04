import { ALGO_GOLDENS, PARTC_REAL, partcBind } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> ABC handoff aig_ands=3 (teach). REAL aigmap: $_AND_=${PARTC_REAL.afterAbcAnd} $_NOT_=${PARTC_REAL.afterAbcNot}.</p>`,
  challenges: [
    { id: "run", title: "ABC", level: "Intro", prompt: "Click ABC.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getMode() === "abc" },
    { id: "a3", title: "aig_ands=3", level: "Intro", prompt: "aigAnds 3.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getLast().aigAnds === ALGO_GOLDENS.abcAigAnds },
    { id: "types", title: "Has $and", level: "Practice", prompt: "$and in types.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getLast().cellTypes.includes("$and") },
    { id: "mux", title: "Has $mux", level: "Practice", prompt: "$mux in types.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getLast().cellTypes.includes("$mux") },
    { id: "note", title: "External ABC", level: "Practice", prompt: "mode abc.",
      setup: (_c, api) => api.showAbc(), check: (_c, api) => api.getMode() === "abc" },
    { id: "sel", title: "Select and/mux", level: "Practice", prompt: "Select a cell.",
      setup: (_c, api) => { api.showAbc(); const c = api.getDesign().cells[0]; if (c) api.select(c.id); },
      check: (_c, api) => api.getSelected().length === 1 },
    { id: "bind", title: "Bind real aigmap", level: "Challenge", prompt: "Real $_AND_ handoff + teach aig=3.",
      check: () => partcBind("abc").ok === true },
    { id: "golden", title: "abcAigAnds", level: "Challenge", prompt: "abcAigAnds=3.",
      check: () => ALGO_GOLDENS.abcAigAnds === 3 },
  ],
});
