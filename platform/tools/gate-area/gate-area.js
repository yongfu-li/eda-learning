import { GOLDENS } from "../../assets/antenna-core.js";

import { createInteractiveAntennaLab } from "../../assets/interactive-antenna-lab.js";

const root = document.getElementById("lab-root");


createInteractiveAntennaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Sum gate area; confirm n1 gate=1.</p>`,
  challenges: [
    { id: "run", title: "Gates", level: "Intro", prompt: "Click Gates.",

      setup: (_c, api) => api.showGates(), check: (_c, api) => api.getMode() === "gates" },

    { id: "n1", title: "n1=1", level: "Intro", prompt: "n1 gate area 1.",

      setup: (_c, api) => api.showGates(), check: (_c, api) => api.getLast().n1 === GOLDENS.gateAreaN1 },

    { id: "n2", title: "n2=2", level: "Practice", prompt: "n2 gate 2.",

      setup: (_c, api) => api.showGates(), check: (_c, api) => api.getLast().n2 === 2 },

    { id: "n3", title: "n3=1", level: "Practice", prompt: "n3 gate 1.",

      setup: (_c, api) => api.showGates(), check: (_c, api) => api.getLast().n3 === 1 },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",

      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },

    { id: "gc", title: "Three gates", level: "Practice", prompt: "gateCount 3.", check: (_c, api) => api.getStats().gateCount === GOLDENS.gateCount },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode gates.",

      setup: (_c, api) => api.showGates(), check: (_c, api) => api.getMode()==="gates" },

    { id: "golden", title: "gateAreaN1", level: "Challenge", prompt: "gateAreaN1=1.", check: () => GOLDENS.gateAreaN1 === 1 },
  ],
});
