import { REAL_GOLDENS } from "../../assets/real-yosys-core.js";
import { createInteractiveRealYosysLab } from "../../assets/interactive-real-yosys-lab.js";
const root = document.getElementById("lab-root");
createInteractiveRealYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Build read_verilog → hierarchy → proc as the first three Yosys commands.</p>`,
  challenges: [
    { id: "read", title: "Add read_verilog", level: "Intro", prompt: "Click read_verilog.",
      check: (_c, api) => api.getRecipe()[0] === "read_verilog" },
    { id: "hier", title: "Add hierarchy", level: "Intro", prompt: "Second cmd hierarchy.",
      check: (_c, api) => api.getRecipe()[1] === "hierarchy" },
    { id: "proc", title: "Add proc", level: "Practice", prompt: "Third cmd proc.",
      check: (_c, api) => api.getRecipe()[2] === "proc" },
    { id: "prefix", title: "Prefix ok", level: "Practice", prompt: "First three match golden.",
      check: (_c, api) => api.checkPrefix(3) },
    { id: "len", title: "Length 3+", level: "Practice", prompt: "At least 3 commands.",
      check: (_c, api) => api.getRecipe().length >= 3 },
    { id: "stage", title: "Stage proc", level: "Practice", prompt: "Stage shows proc.",
      setup: (_c, api) => api.showStage("proc"), check: (_c, api) => api.getStage().id === "proc" },
    { id: "not-synth-first", title: "Not synth first", level: "Challenge", prompt: "Do not start with synth.",
      check: (_c, api) => api.getRecipe().length > 0 && api.getRecipe()[0] !== "synth" },
    { id: "golden", title: "CLI golden", level: "Challenge", prompt: "prefix of 3 is golden.",
      check: (_c, api) => api.checkPrefix(3) },
  ],
});
