import { GOLDENS } from "../../assets/power-core.js";
import { createInteractivePowerLab } from "../../assets/interactive-power-lab.js";
const root = document.getElementById("lab-root");

createInteractivePowerLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Compute Psw = α·C·V²·f; confirm n1=1.0.</p>`,
  challenges: [
    { id: "run", title: "Switching", level: "Intro", prompt: "Click Switching.",
      setup: (_c, api) => api.showSwitching(), check: (_c, api) => api.getMode() === "switching" },
    { id: "n1", title: "n1=1.0", level: "Intro", prompt: "n1 Psw 1.0.",
      setup: (_c, api) => api.showSwitching(), check: (_c, api) => api.getLast().byNet.n1 === GOLDENS.pswN1 },
    { id: "chip", title: "chip=5.2", level: "Practice", prompt: "chip Psw 5.2.",
      setup: (_c, api) => api.showSwitching(), check: (_c, api) => api.getLast().total === GOLDENS.chipPsw },
    { id: "n3", title: "n3=4", level: "Practice", prompt: "n3 Psw 4.0.",
      setup: (_c, api) => api.showSwitching(), check: (_c, api) => api.getLast().byNet.n3 === 4 },
    { id: "sel", title: "Select n1", level: "Practice", prompt: "Click net n1.",
      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },
    { id: "nc", title: "Three nets", level: "Practice", prompt: "netCount 3.", check: (_c, api) => api.getStats().netCount === GOLDENS.netCount },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode switching.",
      setup: (_c, api) => api.showSwitching(), check: (_c, api) => api.getMode()==="switching" },
    { id: "golden", title: "pswN1", level: "Challenge", prompt: "pswN1=1.0.", check: () => GOLDENS.pswN1 === 1.0 },
  ],
});
