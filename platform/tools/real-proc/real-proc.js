import { REAL_GOLDENS } from "../../assets/real-yosys-core.js";
import { createInteractiveRealYosysLab } from "../../assets/interactive-real-yosys-lab.js";
const root = document.getElementById("lab-root");
createInteractiveRealYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Show real proc: processes→0 and $dff appears.</p>`,
  challenges: [
    { id: "before", title: "Before proc", level: "Intro", prompt: "Show read stage (no $dff).",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => !api.getStage().types.includes("$dff") },
    { id: "after", title: "Show proc", level: "Intro", prompt: "Show proc stage.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getStage().id === "proc" },
    { id: "proc0", title: "Processes 0", level: "Practice", prompt: "processes=0.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getStage().processes === 0 },
    { id: "dff", title: "Has $dff", level: "Practice", prompt: "$dff present.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getStage().types.includes("$dff") },
    { id: "sel", title: "Select $dff", level: "Practice", prompt: "Click $dff.",
      setup: (_c, api) => { api.showStage("proc"); api.selectType("$dff"); },
      check: (_c, api) => api.getSelected().includes("$dff") },
    { id: "and", title: "Still $and", level: "Practice", prompt: "$and remains.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getStage().types.includes("$and") },
    { id: "recipe", title: "Recipe ends proc", level: "Challenge", prompt: "Build through proc.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getRecipe().includes("proc") },
    { id: "golden", title: "proc golden", level: "Challenge", prompt: "processes=0 + $dff.",
      setup: (_c, api) => api.showStage("proc"),
      check: (_c, api) => api.getStage().processes === 0 && api.getStage().types.includes("$dff") },
  ],
});
