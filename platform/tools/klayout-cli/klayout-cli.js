import { REAL_GOLDENS, realKlayoutEngine, recipePrefixOk, GOLDEN_RECIPE_IDS } from "../../assets/real-klayout-core.js";
import { createInteractiveRealKlayoutLab } from "../../assets/interactive-real-klayout-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRealKlayoutLab(root, {
  starterHtml: `<p><strong>Your job:</strong> KLayout CLI & scripts. Build the recipe or open stages, then Check.</p>`,
  defaultStage: "empty",
  challenges: [
    { id: "stage", title: "Open stage", level: "Intro", prompt: "Show the empty stage.",
      setup: (_c, api) => api.showStage("empty"), check: (_c, api) => api.getStage()?.id === "empty" || api.getMode() === "empty" },
    { id: "layers", title: "Layers 2", level: "Intro", prompt: "layerCount=2.",
      check: () => REAL_GOLDENS.layerCount === 2 },
    { id: "prefix", title: "Recipe prefix", level: "Practice", prompt: "Load golden recipe; prefix ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix(2) },
    { id: "viol", title: "Width violation", level: "Practice", prompt: "widthViolations=1 on m0.",
      check: () => REAL_GOLDENS.widthViolations === 1 },
    { id: "markers", title: "Marker golden", level: "Practice", prompt: "markerCount=1.",
      check: () => REAL_GOLDENS.markerCount === 1 },
    { id: "select", title: "Select m0", level: "Challenge", prompt: "Select m0.",
      setup: (_c, api) => { api.showStage("drc_script"); api.select("m0"); },
      check: (_c, api) => api.getSelected().includes("m0") },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.engine().ok === true || realKlayoutEngine(GOLDEN_RECIPE_IDS).ok },
  ],
});
