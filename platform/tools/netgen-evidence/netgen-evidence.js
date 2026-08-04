import { REAL_GOLDENS, realNetgenEngine, recipePrefixOk, GOLDEN_RECIPE_IDS } from "../../assets/real-netgen-core.js";
import { createInteractiveRealNetgenLab } from "../../assets/interactive-real-netgen-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRealNetgenLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Real Netgen evidence. Build the recipe or open stages, then Check.</p>`,
  defaultStage: "lvs_report",
  challenges: [
    { id: "stage", title: "Open stage", level: "Intro", prompt: "Show the lvs_report stage.",
      setup: (_c, api) => api.showStage("lvs_report"), check: (_c, api) => api.getStage()?.id === "lvs_report" || api.getMode() === "lvs_report" },
    { id: "dev", title: "Devices 2", level: "Intro", prompt: "matchedDevices=2.",
      check: () => REAL_GOLDENS.matchedDevices === 2 },
    { id: "prefix", title: "Recipe prefix", level: "Practice", prompt: "Load golden recipe; prefix ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix(2) },
    { id: "nets", title: "Nets golden", level: "Practice", prompt: "matchedNets=4.",
      check: () => REAL_GOLDENS.matchedNets === 4 },
    { id: "mism", title: "Mismatch golden", level: "Practice", prompt: "mismatchCount=0.",
      check: () => REAL_GOLDENS.mismatchCount === 0 },
    { id: "select", title: "Select device", level: "Challenge", prompt: "Select mn1.",
      setup: (_c, api) => { api.showStage("lvs_compare"); api.select("mn1"); },
      check: (_c, api) => api.getSelected().includes("mn1") },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.engine().ok === true || realNetgenEngine(GOLDEN_RECIPE_IDS).ok },
  ],
});
