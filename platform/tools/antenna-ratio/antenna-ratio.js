import { GOLDENS } from "../../assets/antenna-core.js";

import { createInteractiveAntennaLab } from "../../assets/interactive-antenna-lab.js";

const root = document.getElementById("lab-root");


createInteractiveAntennaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Compute metal/gate; n1=25, n2=4, n3=45.</p>`,
  challenges: [
    { id: "run", title: "Ratio", level: "Intro", prompt: "Click Ratio.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getMode() === "ratio" },

    { id: "n1", title: "n1=25", level: "Intro", prompt: "n1 ratio 25.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getLast().ratios.n1 === GOLDENS.ratioN1 },

    { id: "n2", title: "n2=4", level: "Practice", prompt: "n2 ratio 4.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getLast().ratios.n2 === GOLDENS.ratioN2 },

    { id: "n3", title: "n3=45", level: "Practice", prompt: "n3 ratio 45.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getLast().ratios.n3 === GOLDENS.ratioN3 },

    { id: "sel", title: "Select n3", level: "Practice", prompt: "Select n3.",

      setup: (_c, api) => api.selectNet("n3"), check: (_c, api) => api.getSelected().includes("n3") },

    { id: "metal", title: "Metal n1", level: "Practice", prompt: "n1 metal 25.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getLast().metal.n1 === 25 },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode ratio.",

      setup: (_c, api) => api.showRatio(), check: (_c, api) => api.getMode()==="ratio" },

    { id: "golden", title: "ratioN1", level: "Challenge", prompt: "ratioN1=25.", check: () => GOLDENS.ratioN1 === 25 },
  ],
});
