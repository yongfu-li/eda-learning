import { GOLDENS } from "../../assets/yosys-core.js";
import { createInteractiveYosysLab } from "../../assets/interactive-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run Engine; confirm ok and report 7/11.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "opt", title: "Opt 5", level: "Practice", prompt: "opt cells 5.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().opt.cellCount === GOLDENS.afterOptCells },
    { id: "st", title: "Strash 4", level: "Practice", prompt: "strash cells 4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().strash.cellCount === GOLDENS.afterStrashCells },
    { id: "rep", title: "Report 7/11", level: "Practice", prompt: "report cells 7 wires 11.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().report.cellCount === GOLDENS.reportCellsSynth && api.getLast().report.wireCount === GOLDENS.reportWiresSynth },
    { id: "area", title: "NAND area 6", level: "Practice", prompt: "area nand 6.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().area.nandCount === GOLDENS.techmapNandCountArea },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode()==="engine" },
    { id: "golden", title: "engineOk", level: "Challenge", prompt: "engineOk=true.", check: () => GOLDENS.engineOk === true },
  ],
});
