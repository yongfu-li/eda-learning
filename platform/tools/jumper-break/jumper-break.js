import { GOLDENS } from "../../assets/antenna-core.js";

import { createInteractiveAntennaLab } from "../../assets/interactive-antenna-lab.js";

const root = document.getElementById("lab-root");


createInteractiveAntennaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Jumper max_layer=1 on n1 → ratio 0.</p>`,
  challenges: [
    { id: "run", title: "Jumper", level: "Intro", prompt: "Click Jumper.",

      setup: (_c, api) => api.applyJumperBreak(), check: (_c, api) => api.getMode() === "jumper" },

    { id: "after", title: "After 0", level: "Intro", prompt: "after ratio 0.",

      setup: (_c, api) => api.applyJumperBreak(), check: (_c, api) => api.getLast().afterRatio === GOLDENS.jumperN1Ratio },

    { id: "before", title: "Before 25", level: "Practice", prompt: "before ratio 25.",

      setup: (_c, api) => api.applyJumperBreak(), check: (_c, api) => api.getLast().beforeRatio === 25 },

    { id: "ratio", title: "Show ratio", level: "Practice", prompt: "n1 ratio 0 after.",

      setup: (_c, api) => { api.applyJumperBreak(); api.showRatio(); }, check: (_c, api) => api.getLast().ratios.n1 === 0 },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",

      setup: (_c, api) => { api.applyJumperBreak(); api.selectNet("n1"); }, check: (_c, api) => api.getSelected().includes("n1") },

    { id: "jmp", title: "Jumper set", level: "Practice", prompt: "jumper on design.",

      setup: (_c, api) => api.applyJumperBreak(), check: (_c, api) => api.getDesign().jumpers.some(j=>j.net==="n1") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode jumper.",

      setup: (_c, api) => api.applyJumperBreak(), check: (_c, api) => api.getMode()==="jumper" },

    { id: "golden", title: "jumperN1Ratio", level: "Challenge", prompt: "jumperN1Ratio=0.", check: () => GOLDENS.jumperN1Ratio === 0 },
  ],
});
