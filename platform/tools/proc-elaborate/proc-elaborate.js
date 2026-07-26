import { GOLDENS } from "../../assets/yosys-core.js";
import { createInteractiveYosysLab } from "../../assets/interactive-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run proc; confirm rtl_cell_count=6.</p>`,
  challenges: [
    { id: "run", title: "Proc", level: "Intro", prompt: "Click Proc.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getMode() === "proc" },
    { id: "c6", title: "Cells 6", level: "Intro", prompt: "cell count 6.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getLast().cellCount === GOLDENS.rtlCellCount },
    { id: "c1", title: "AND c1", level: "Practice", prompt: "c1 present.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getDesign().cells.some(c => c.id === "c1" && c.type === "AND") },
    { id: "c2", title: "OR c2", level: "Practice", prompt: "c2 OR present.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getDesign().cells.some(c => c.id === "c2") },
    { id: "sel", title: "Select c3", level: "Practice", prompt: "Click c3.",
      setup: (_c, api) => { api.showProc(); api.selectCell("c3"); }, check: (_c, api) => api.getSelected().includes("c3") },
    { id: "mod", title: "Modules 2", level: "Practice", prompt: "module count 2.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getStats().moduleCount === GOLDENS.moduleCount },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode proc.",
      setup: (_c, api) => api.showProc(), check: (_c, api) => api.getMode()==="proc" },
    { id: "golden", title: "rtlCellCount", level: "Challenge", prompt: "rtlCellCount=6.", check: () => GOLDENS.rtlCellCount === 6 },
  ],
});
