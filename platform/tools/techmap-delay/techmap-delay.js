import { GOLDENS } from "../../assets/yosys-core.js";
import { createInteractiveYosysLab } from "../../assets/interactive-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run TechmapDelay; nand_count=7.</p>`,
  challenges: [
    { id: "run", title: "TechmapDelay", level: "Intro", prompt: "Click TechmapDelay.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getMode() === "techmap_delay" },
    { id: "n7", title: "NAND 7", level: "Intro", prompt: "nand count 7.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getLast().nandCount === GOLDENS.techmapNandCountDelay },
    { id: "gt", title: "More than area", level: "Practice", prompt: "nand > area count.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getLast().nandCount > GOLDENS.techmapNandCountArea },
    { id: "mode", title: "delay mode", level: "Practice", prompt: "mode delay.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getLast().mode === "delay" },
    { id: "nand", title: "NAND2 cells", level: "Practice", prompt: "NAND2 present.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getDesign().cells.filter(c => c.type === "NAND2").length === 7 },
    { id: "sel", title: "Select nd1", level: "Practice", prompt: "Select nd1.",
      setup: (_c, api) => { api.showTechmapDelay(); api.selectCell("nd1"); }, check: (_c, api) => api.getSelected().includes("nd1") },
    { id: "dff", title: "DFF kept", level: "Practice", prompt: "DFF present.",
      setup: (_c, api) => api.showTechmapDelay(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "DFF") },
    { id: "golden", title: "techmapNandCountDelay", level: "Challenge", prompt: "techmapNandCountDelay=7.", check: () => GOLDENS.techmapNandCountDelay === 7 },
  ],
});
