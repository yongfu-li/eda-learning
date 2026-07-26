import { GOLDENS } from "../../assets/antenna-core.js";

import { createInteractiveAntennaLab } from "../../assets/interactive-antenna-lab.js";

const root = document.getElementById("lab-root");


createInteractiveAntennaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Sum metal area per net; confirm n1=25.</p>`,
  challenges: [
    { id: "run", title: "Metal", level: "Intro", prompt: "Click Metal.",

      setup: (_c, api) => api.showMetal(), check: (_c, api) => api.getMode() === "metal" },

    { id: "n1", title: "n1=25", level: "Intro", prompt: "n1 metal area 25.",

      setup: (_c, api) => api.showMetal(), check: (_c, api) => api.getLast().n1 === GOLDENS.metalAreaN1 },

    { id: "n3", title: "n3=45", level: "Practice", prompt: "n3 metal sum 45.",

      setup: (_c, api) => api.showMetal(), check: (_c, api) => api.getLast().n3 === 45 },

    { id: "n2", title: "n2=8", level: "Practice", prompt: "n2 metal 8.",

      setup: (_c, api) => api.showMetal(), check: (_c, api) => api.getLast().n2 === 8 },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Click net n1.",

      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },

    { id: "mc", title: "Four metals", level: "Practice", prompt: "metalCount 4.", check: (_c, api) => api.getStats().metalCount === GOLDENS.metalCount },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode metal.",

      setup: (_c, api) => api.showMetal(), check: (_c, api) => api.getMode()==="metal" },

    { id: "golden", title: "metalAreaN1", level: "Challenge", prompt: "metalAreaN1=25.", check: () => GOLDENS.metalAreaN1 === 25 },
  ],
});
