import { GOLDENS } from "../../assets/power-core.js";
import { createInteractivePowerLab } from "../../assets/interactive-power-lab.js";
const root = document.getElementById("lab-root");

createInteractivePowerLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Compute Pleak = Ileak·V; confirm n1=0.1.</p>`,
  challenges: [
    { id: "run", title: "Leakage", level: "Intro", prompt: "Click Leakage.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getMode() === "leakage" },
    { id: "n1", title: "n1=0.1", level: "Intro", prompt: "n1 Pleak 0.1.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getLast().byNet.n1 === GOLDENS.plkN1 },
    { id: "chip", title: "chip=0.35", level: "Practice", prompt: "chip Pleak 0.35.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getLast().total === GOLDENS.chipPlk },
    { id: "n2", title: "n2=0.05", level: "Practice", prompt: "n2 Pleak 0.05.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getLast().byNet.n2 === 0.05 },
    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",
      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode leakage.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getMode()==="leakage" },
    { id: "vdd", title: "Vdd=1", level: "Practice", prompt: "Vdd 1.0.",
      setup: (_c, api) => api.showLeakage(), check: (_c, api) => api.getLast().vdd === 1 },
    { id: "golden", title: "plkN1", level: "Challenge", prompt: "plkN1=0.1.", check: () => GOLDENS.plkN1 === 0.1 },
  ],
});
