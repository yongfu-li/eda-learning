import { REAL_GOLDENS, realMagicEngine, recipePrefixOk, GOLDEN_RECIPE_IDS } from "../../assets/real-magic-core.js";
import { createInteractiveRealMagicLab } from "../../assets/interactive-real-magic-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRealMagicLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Magic tech vocabulary. Build the recipe or open stages, then Check.</p>`,
  defaultStage: "tech_vocab",
  challenges: [
    { id: "stage", title: "Open stage", level: "Intro", prompt: "Show the tech_vocab stage.",
      setup: (_c, api) => api.showStage("tech_vocab"), check: (_c, api) => api.getStage()?.id === "tech_vocab" || api.getMode() === "tech_vocab" },
    { id: "rects", title: "Rects 6", level: "Intro", prompt: "rectCount=6.",
      check: () => REAL_GOLDENS.rectCount === 6 },
    { id: "prefix", title: "Recipe prefix", level: "Practice", prompt: "Load golden recipe; prefix ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix(2) },
    { id: "contact", title: "Contact golden", level: "Practice", prompt: "contactCount=1.",
      check: () => REAL_GOLDENS.contactCount === 1 },
    { id: "drc", title: "DRC golden", level: "Practice", prompt: "drcErrorCount=1.",
      check: () => REAL_GOLDENS.drcErrorCount === 1 },
    { id: "gds", title: "GDS golden", level: "Practice", prompt: "gdsLayerCount=6.",
      check: () => REAL_GOLDENS.gdsLayerCount === 6 },
    { id: "select", title: "Select shape", level: "Challenge", prompt: "Select thin.",
      setup: (_c, api) => { api.showStage("drc"); api.select("thin"); },
      check: (_c, api) => api.getSelected().includes("thin") },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.engine().ok === true || realMagicEngine(GOLDEN_RECIPE_IDS).ok },
  ],
});
