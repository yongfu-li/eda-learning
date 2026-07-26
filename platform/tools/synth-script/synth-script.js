import { GOLDENS } from "../../assets/yosys-core.js";
import { createInteractiveYosysLab } from "../../assets/interactive-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run Synth; full pass recipe completes.</p>`,
  challenges: [
    { id: "run", title: "Synth", level: "Intro", prompt: "Click Synth.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getMode() === "synth" },
    { id: "nand", title: "NAND mapped", level: "Intro", prompt: "nand count 6.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getLast().nandCount === GOLDENS.techmapNandCountArea },
    { id: "pass", title: "synth pass", level: "Practice", prompt: "pass synth.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getLast().pass === "synth" },
    { id: "nand2", title: "NAND2 cells", level: "Practice", prompt: "NAND2 in design.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "NAND2") },
    { id: "dff", title: "DFF kept", level: "Practice", prompt: "DFF present.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "DFF") },
    { id: "cells", title: "Cell count", level: "Practice", prompt: "cells > 6.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getLast().cellCount >= 7 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode synth.",
      setup: (_c, api) => api.showSynth(), check: (_c, api) => api.getMode()==="synth" },
    { id: "golden", title: "techmapNandCountArea", level: "Challenge", prompt: "recipe nand=6.", check: (_c, api) => { api.showSynth(); return api.getLast().nandCount === 6; } },
  ],
});
