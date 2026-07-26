import { GOLDENS } from "../../assets/yosys-core.js";
import { createInteractiveYosysLab } from "../../assets/interactive-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run strash; merge c3; cells=4.</p>`,
  challenges: [
    { id: "run", title: "Strash", level: "Intro", prompt: "Click Strash.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => api.getMode() === "strash" },
    { id: "c4", title: "Cells 4", level: "Intro", prompt: "cell count 4.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => api.getLast().cellCount === GOLDENS.afterStrashCells },
    { id: "mg", title: "Merged n3", level: "Practice", prompt: "n3 merged.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => api.getLast().merged.includes("n3") },
    { id: "no", title: "No c3", level: "Practice", prompt: "c3 removed.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => !api.getDesign().cells.some(c => c.id === "c3") },
    { id: "sel", title: "Select c1", level: "Practice", prompt: "Select c1.",
      setup: (_c, api) => { api.showStrash(); api.selectCell("c1"); }, check: (_c, api) => api.getSelected().includes("c1") },
    { id: "and", title: "One AND", level: "Practice", prompt: "one AND left.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => api.getDesign().cells.filter(c => c.type === "AND").length === 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode strash.",
      setup: (_c, api) => api.showStrash(), check: (_c, api) => api.getMode()==="strash" },
    { id: "golden", title: "afterStrashCells", level: "Challenge", prompt: "afterStrashCells=4.", check: () => GOLDENS.afterStrashCells === 4 },
  ],
});
