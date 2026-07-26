import { GOLDENS } from "../../assets/antenna-core.js";

import { createInteractiveAntennaLab } from "../../assets/interactive-antenna-lab.js";

const root = document.getElementById("lab-root");


createInteractiveAntennaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Raw violations without diode: 2 (n1,n3).</p>`,
  challenges: [
    { id: "run", title: "Threshold", level: "Intro", prompt: "Click Threshold.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => api.getMode() === "threshold" },

    { id: "c2", title: "Count 2", level: "Intro", prompt: "raw violations 2.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => api.getLast().count === GOLDENS.rawViolationCount },

    { id: "n1", title: "n1 hit", level: "Practice", prompt: "n1 violates.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => api.getLast().hits.some(h=>h.net==="n1") },

    { id: "n3", title: "n3 hit", level: "Practice", prompt: "n3 violates.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => api.getLast().hits.some(h=>h.net==="n3") },

    { id: "n2ok", title: "n2 ok", level: "Practice", prompt: "n2 not in hits.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => !api.getLast().hits.some(h=>h.net==="n2") },

    { id: "sel", title: "Select n3", level: "Practice", prompt: "Select n3.",

      setup: (_c, api) => api.selectNet("n3"), check: (_c, api) => api.getSelected().includes("n3") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode threshold.",

      setup: (_c, api) => api.checkThreshold(), check: (_c, api) => api.getMode()==="threshold" },

    { id: "golden", title: "rawViolationCount", level: "Challenge", prompt: "rawViolationCount=2.", check: () => GOLDENS.rawViolationCount === 2 },
  ],
});
