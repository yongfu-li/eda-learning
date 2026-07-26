import { GOLDENS } from "../../assets/power-core.js";
import { createInteractivePowerLab } from "../../assets/interactive-power-lab.js";
const root = document.getElementById("lab-root");

createInteractivePowerLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Solve IR; v_sink=0.6, ir_drop_sink=0.4.</p>`,
  challenges: [
    { id: "run", title: "IR", level: "Intro", prompt: "Click IR.",
      setup: (_c, api) => api.showIrDrop(), check: (_c, api) => api.getMode() === "ir" },
    { id: "vsink", title: "v_sink=0.6", level: "Intro", prompt: "v_sink 0.6.",
      setup: (_c, api) => api.showIrDrop(), check: (_c, api) => api.getLast().vSink === GOLDENS.vSink },
    { id: "drop", title: "drop=0.4", level: "Practice", prompt: "ir_drop_sink 0.4.",
      setup: (_c, api) => api.showIrDrop(), check: (_c, api) => api.getLast().irDropSink === GOLDENS.irDropSink },
    { id: "i", title: "I=0.1", level: "Practice", prompt: "i_sink 0.1.",
      setup: (_c, api) => api.showIrDrop(), check: (_c, api) => api.getLast().iSink === GOLDENS.iSink },
    { id: "viol", title: "IR viol", level: "Practice", prompt: "Run IR check; 1 violation.",
      setup: (_c, api) => api.checkIr(), check: (_c, api) => api.getLast().count === GOLDENS.irViolationCount },
    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",
      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode ir.",
      setup: (_c, api) => api.showIrDrop(), check: (_c, api) => api.getMode()==="ir" },
    { id: "golden", title: "irDropSink", level: "Challenge", prompt: "irDropSink=0.4.", check: () => GOLDENS.irDropSink === 0.4 },
  ],
});
