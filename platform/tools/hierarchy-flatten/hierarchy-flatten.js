import { GOLDENS } from "../../assets/yosys-core.js";
import { createInteractiveYosysLab } from "../../assets/interactive-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run flatten; module_count→1.</p>`,
  challenges: [
    { id: "run", title: "Flatten", level: "Intro", prompt: "Click Flatten.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getMode() === "flatten" },
    { id: "m1", title: "Modules 1", level: "Intro", prompt: "module count 1.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getLast().moduleCount === GOLDENS.afterFlattenModules },
    { id: "top", title: "All top", level: "Practice", prompt: "c6 module top.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getDesign().cells.find(c => c.id === "c6")?.module === "top" },
    { id: "c6", title: "DFF kept", level: "Practice", prompt: "c6 still present.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getDesign().cells.some(c => c.id === "c6") },
    { id: "sel", title: "Select c6", level: "Practice", prompt: "Select c6.",
      setup: (_c, api) => { api.showFlatten(); api.selectCell("c6"); }, check: (_c, api) => api.getSelected().includes("c6") },
    { id: "cells", title: "Cells 6", level: "Practice", prompt: "still 6 cells.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getDesign().cells.length === 6 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode flatten.",
      setup: (_c, api) => api.showFlatten(), check: (_c, api) => api.getMode()==="flatten" },
    { id: "golden", title: "afterFlattenModules", level: "Challenge", prompt: "afterFlattenModules=1.", check: () => GOLDENS.afterFlattenModules === 1 },
  ],
});
