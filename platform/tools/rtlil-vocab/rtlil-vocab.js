import { REAL_GOLDENS } from "../../assets/real-yosys-core.js";
import { createInteractiveRealYosysLab } from "../../assets/interactive-real-yosys-lab.js";
const root = document.getElementById("lab-root");
createInteractiveRealYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Inspect RTLIL after hierarchy: modules=2, processes=1, $and×2.</p>`,
  challenges: [
    { id: "stage", title: "Show read stage", level: "Intro", prompt: "Load read_hierarchy.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().id === "read_hierarchy" },
    { id: "mods", title: "Modules 2", level: "Intro", prompt: "modules=2.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().moduleCount === 2 },
    { id: "proc", title: "Processes 1", level: "Practice", prompt: "processes=1.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().processes === 1 },
    { id: "and", title: "$and count", level: "Practice", prompt: "$and===2.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().cells.$and === 2 },
    { id: "sel", title: "Select $and", level: "Practice", prompt: "Click $and.",
      setup: (_c, api) => { api.showStage("read_hierarchy"); api.selectType("$and"); },
      check: (_c, api) => api.getSelected().includes("$and") },
    { id: "types", title: "Has $or", level: "Practice", prompt: "$or in types.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().types.includes("$or") },
    { id: "not", title: "Has $not", level: "Challenge", prompt: "$not present.",
      setup: (_c, api) => api.showStage("read_hierarchy"), check: (_c, api) => api.getStage().types.includes("$not") },
    { id: "golden", title: "Vocab golden", level: "Challenge", prompt: "and=2 mods=2.",
      setup: (_c, api) => api.showStage("read_hierarchy"),
      check: (_c, api) => api.getStage().cells.$and === 2 && api.getStage().moduleCount === 2 },
  ],
});
