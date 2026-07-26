import { REAL_GOLDENS } from "../../assets/real-yosys-core.js";
import { createInteractiveRealYosysLab } from "../../assets/interactive-real-yosys-lab.js";
const root = document.getElementById("lab-root");
createInteractiveRealYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Flatten to 1 module / 4 cells; opt keeps $and=1.</p>`,
  challenges: [
    { id: "flat", title: "Show flatten", level: "Intro", prompt: "flatten stage.",
      setup: (_c, api) => api.showStage("flatten"), check: (_c, api) => api.getStage().id === "flatten" },
    { id: "mods", title: "Modules 1", level: "Intro", prompt: "modules=1.",
      setup: (_c, api) => api.showStage("flatten"), check: (_c, api) => api.getStage().moduleCount === 1 },
    { id: "cells", title: "Cells 4", level: "Practice", prompt: "cells=4.",
      setup: (_c, api) => api.showStage("flatten"), check: (_c, api) => api.getStage().cellCount === 4 },
    { id: "opt", title: "Show opt", level: "Practice", prompt: "opt stage.",
      setup: (_c, api) => api.showStage("opt"), check: (_c, api) => api.getStage().id === "opt" },
    { id: "and1", title: "$and=1", level: "Practice", prompt: "$and count 1.",
      setup: (_c, api) => api.showStage("opt"), check: (_c, api) => api.getStage().cells.$and === 1 },
    { id: "dff", title: "DFF kept", level: "Practice", prompt: "$dff present.",
      setup: (_c, api) => api.showStage("opt"), check: (_c, api) => api.getStage().types.includes("$dff") },
    { id: "sel", title: "Select $and", level: "Challenge", prompt: "Select $and.",
      setup: (_c, api) => { api.showStage("opt"); api.selectType("$and"); },
      check: (_c, api) => api.getSelected().includes("$and") },
    { id: "golden", title: "flatten/opt golden", level: "Challenge", prompt: "flat cells=4 and=1.",
      setup: (_c, api) => api.showStage("opt"),
      check: (_c, api) => api.getStage().cellCount === 4 && api.getStage().cells.$and === 1 },
  ],
});
