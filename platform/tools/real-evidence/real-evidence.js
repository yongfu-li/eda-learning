import { REAL_GOLDENS } from "../../assets/real-yosys-core.js";
import { createInteractiveRealYosysLab } from "../../assets/interactive-real-yosys-lab.js";
const root = document.getElementById("lab-root");
createInteractiveRealYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run the real evidence engine; ok=True on the golden recipe.</p>`,
  challenges: [
    { id: "recipe", title: "Build golden recipe", level: "Intro", prompt: "Load golden recipe.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix() },
    { id: "engine", title: "Run Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => { api.loadGoldenRecipe(); api.engine(); }, check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "ok true", level: "Practice", prompt: "engine ok.",
      setup: (_c, api) => { api.loadGoldenRecipe(); api.engine(); }, check: (_c, api) => api.getLast().ok === true },
    { id: "synth2", title: "synth cells 2", level: "Practice", prompt: "stage cells=2.",
      setup: (_c, api) => { api.loadGoldenRecipe(); api.engine(); }, check: (_c, api) => api.getStage().cellCount === 2 },
    { id: "types", title: "AOI+DFF", level: "Practice", prompt: "both types.",
      setup: (_c, api) => api.showStage("synth"),
      check: (_c, api) => api.getStage().types.includes("$_AOI3_") && api.getStage().types.includes("$_DFF_P_") },
    { id: "prefix", title: "Full prefix", level: "Practice", prompt: "full recipe order.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix() },
    { id: "sel", title: "Select DFF_P", level: "Challenge", prompt: "Select $_DFF_P_.",
      setup: (_c, api) => { api.showStage("synth"); api.selectType("$_DFF_P_"); },
      check: (_c, api) => api.getSelected().includes("$_DFF_P_") },
    { id: "golden", title: "evidence ok", level: "Challenge", prompt: "engineOk golden.",
      setup: (_c, api) => { api.loadGoldenRecipe(); api.engine(); }, check: (_c, api) => api.getLast().ok === true },
  ],
});
