import { GOLDENS } from "../../assets/antenna-core.js";

import { createInteractiveAntennaLab } from "../../assets/interactive-antenna-lab.js";

const root = document.getElementById("lab-root");


createInteractiveAntennaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Q=k×metal; confirm charge n1=25.</p>`,
  challenges: [
    { id: "run", title: "Charge", level: "Intro", prompt: "Click Charge.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getMode() === "charge" },

    { id: "n1", title: "Q n1=25", level: "Intro", prompt: "charge n1 25.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getLast().charge.n1 === GOLDENS.chargeN1 },

    { id: "k", title: "k=1", level: "Practice", prompt: "charge_k 1.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getLast().k === 1 },

    { id: "n3", title: "Q n3", level: "Practice", prompt: "charge n3 45.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getLast().charge.n3 === 45 },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",

      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },

    { id: "metal", title: "Uses metal", level: "Practice", prompt: "metal n1 25.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getLast().metal.n1 === 25 },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode charge.",

      setup: (_c, api) => api.showCharge(), check: (_c, api) => api.getMode()==="charge" },

    { id: "golden", title: "chargeN1", level: "Challenge", prompt: "chargeN1=25.", check: () => GOLDENS.chargeN1 === 25 },
  ],
});
