import { GOLDENS } from "../../assets/signoff-core.js";
import { createInteractiveSignoffLab } from "../../assets/interactive-signoff-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSignoffLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Apply derate; derated=1.1 for delay=1.0.</p>`,
  challenges: [
    { id: "run", title: "Derate", level: "Intro", prompt: "Click Derate.",
      setup: (_c, api) => api.showDerate(1.0), check: (_c, api) => api.getMode() === "derate" },
    { id: "d11", title: "derated 1.1", level: "Intro", prompt: "derated 1.1.",
      setup: (_c, api) => api.showDerate(1.0), check: (_c, api) => Math.abs(api.getLast().derated - 1.1) < 1e-9 },
    { id: "rate", title: "derate 1.1", level: "Practice", prompt: "derate 1.1.",
      setup: (_c, api) => api.showDerate(1.0), check: (_c, api) => api.getLast().derate === 1.1 },
    { id: "in", title: "delay 1", level: "Practice", prompt: "input delay 1.0.",
      setup: (_c, api) => api.showDerate(1.0), check: (_c, api) => api.getLast().delay === 1.0 },
    { id: "sel", title: "Select sta", level: "Practice", prompt: "Click check sta.",
      setup: (_c, api) => api.selectCheck("sta"), check: (_c, api) => api.getSelected().includes("sta") },
    { id: "corner", title: "signoff corner", level: "Practice", prompt: "signoff corner ss.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().corner.id === GOLDENS.signoffCorner },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode derate.",
      setup: (_c, api) => api.showDerate(), check: (_c, api) => api.getMode()==="derate" },
    { id: "golden", title: "signoffDerate", level: "Challenge", prompt: "signoffDerate=1.1.", check: () => GOLDENS.signoffDerate === 1.1 },
  ],
});
