import { GOLDENS } from "../../assets/yosys-core.js";
import { createInteractiveYosysLab } from "../../assets/interactive-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run TechmapArea; nand_count=6.</p>`,
  challenges: [
    { id: "run", title: "TechmapArea", level: "Intro", prompt: "Click TechmapArea.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getMode() === "techmap_area" },
    { id: "n6", title: "NAND 6", level: "Intro", prompt: "nand count 6.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getLast().nandCount === GOLDENS.techmapNandCountArea },
    { id: "nand", title: "NAND2 cells", level: "Practice", prompt: "NAND2 present.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "NAND2") },
    { id: "dff", title: "DFF kept", level: "Practice", prompt: "DFF still present.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "DFF") },
    { id: "mode", title: "area mode", level: "Practice", prompt: "mode area.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getLast().mode === "area" },
    { id: "sel", title: "Select NAND", level: "Practice", prompt: "Select a NAND2.",
      setup: (_c, api) => { api.showTechmapArea(); api.selectCell("nd1"); }, check: (_c, api) => api.getSelected().includes("nd1") },
    { id: "cells", title: "Cell count", level: "Practice", prompt: "cells > 3.",
      setup: (_c, api) => api.showTechmapArea(), check: (_c, api) => api.getLast().cellCount > 3 },
    { id: "golden", title: "techmapNandCountArea", level: "Challenge", prompt: "techmapNandCountArea=6.", check: () => GOLDENS.techmapNandCountArea === 6 },
  ],
});
