import { GOLDENS } from "../../assets/power-core.js";
import { createInteractivePowerLab } from "../../assets/interactive-power-lab.js";
const root = document.getElementById("lab-root");

createInteractivePowerLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Read alphas n1=0.5, n2=0.2, n3=1.0.</p>`,
  challenges: [
    { id: "run", title: "Activity", level: "Intro", prompt: "Click Activity.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => api.getMode() === "activity" },
    { id: "n1", title: "n1=0.5", level: "Intro", prompt: "n1 alpha 0.5.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => api.getLast().alphas.n1 === 0.5 },
    { id: "n2", title: "n2=0.2", level: "Practice", prompt: "n2 alpha 0.2.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => api.getLast().alphas.n2 === 0.2 },
    { id: "n3", title: "n3=1.0", level: "Practice", prompt: "n3 alpha 1.0.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => api.getLast().alphas.n3 === 1.0 },
    { id: "sel", title: "Select n3", level: "Practice", prompt: "Select n3.",
      setup: (_c, api) => api.selectNet("n3"), check: (_c, api) => api.getSelected().includes("n3") },
    { id: "mean", title: "Mean α", level: "Practice", prompt: "mean alpha ~0.57.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => Math.abs(api.getLast().mean - (0.5+0.2+1)/3) < 1e-9 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode activity.",
      setup: (_c, api) => api.showActivity(), check: (_c, api) => api.getMode()==="activity" },
    { id: "golden", title: "alphas", level: "Challenge", prompt: "n1 alpha 0.5.", check: () => true },
  ],
});
