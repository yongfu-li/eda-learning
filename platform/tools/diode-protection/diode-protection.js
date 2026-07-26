import { GOLDENS } from "../../assets/antenna-core.js";

import { createInteractiveAntennaLab } from "../../assets/interactive-antenna-lab.js";

const root = document.getElementById("lab-root");


createInteractiveAntennaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Diode on n3 → violations=1 (n1 only).</p>`,
  challenges: [
    { id: "run", title: "Diode", level: "Intro", prompt: "Click Diode.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => api.getMode() === "diode" },

    { id: "c1", title: "Count 1", level: "Intro", prompt: "violations 1.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => api.getLast().count === GOLDENS.violationCount },

    { id: "n1", title: "n1 only", level: "Practice", prompt: "hit is n1.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => api.getLast().hits[0].net==="n1" },

    { id: "prot", title: "n3 protected", level: "Practice", prompt: "n3 protected.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => api.getLast().protected.includes("n3") },

    { id: "notn3", title: "Not n3", level: "Practice", prompt: "n3 not in hits.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => !api.getLast().hits.some(h=>h.net==="n3") },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",

      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode diode.",

      setup: (_c, api) => api.checkDiode(), check: (_c, api) => api.getMode()==="diode" },

    { id: "golden", title: "violationCount", level: "Challenge", prompt: "violationCount=1.", check: () => GOLDENS.violationCount === 1 },
  ],
});
