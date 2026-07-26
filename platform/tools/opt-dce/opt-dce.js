import { GOLDENS } from "../../assets/yosys-core.js";
import { createInteractiveYosysLab } from "../../assets/interactive-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run opt; remove c4; cells=5.</p>`,
  challenges: [
    { id: "run", title: "Opt", level: "Intro", prompt: "Click Opt.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => api.getMode() === "opt" },
    { id: "c5", title: "Cells 5", level: "Intro", prompt: "cell count 5.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => api.getLast().cellCount === GOLDENS.afterOptCells },
    { id: "rm", title: "Removed c4", level: "Practice", prompt: "c4 removed.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => api.getLast().removed.includes("c4") },
    { id: "no", title: "No c4", level: "Practice", prompt: "c4 gone from design.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => !api.getDesign().cells.some(c => c.id === "c4") },
    { id: "sel", title: "Select c1", level: "Practice", prompt: "Select c1.",
      setup: (_c, api) => { api.showOpt(); api.selectCell("c1"); }, check: (_c, api) => api.getSelected().includes("c1") },
    { id: "dff", title: "DFF kept", level: "Practice", prompt: "c6 still present.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => api.getDesign().cells.some(c => c.id === "c6") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode opt.",
      setup: (_c, api) => api.showOpt(), check: (_c, api) => api.getMode()==="opt" },
    { id: "golden", title: "afterOptCells", level: "Challenge", prompt: "afterOptCells=5.", check: () => GOLDENS.afterOptCells === 5 },
  ],
});
