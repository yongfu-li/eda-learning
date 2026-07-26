import { GOLDENS } from "../../assets/dft-core.js";

import { createInteractiveDftLab } from "../../assets/interactive-dft-lab.js";

const root = document.getElementById("lab-root");


createInteractiveDftLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Identify SDFF scan cells; confirm count=4.</p>`,
  challenges: [
    { id: "run", title: "Flops", level: "Intro", prompt: "Click Flops.",

      setup: (_c, api) => api.showFlops(), check: (_c, api) => api.getMode() === "flops" },

    { id: "c4", title: "Count 4", level: "Intro", prompt: "scan cell count 4.",

      setup: (_c, api) => api.showFlops(), check: (_c, api) => api.getLast().count === GOLDENS.scanCellCount },

    { id: "sdff", title: "SDFF", level: "Practice", prompt: "All cells type SDFF.",

      setup: (_c, api) => api.showFlops(), check: (_c, api) => api.getLast().cells.every(c => c.type === "SDFF") },

    { id: "f1", title: "Select f1", level: "Practice", prompt: "Click flop f1.",

      setup: (_c, api) => api.selectFlop("f1"), check: (_c, api) => api.getSelected().includes("f1") },

    { id: "f4", title: "Select f4", level: "Practice", prompt: "Click flop f4.",

      setup: (_c, api) => api.selectFlop("f4"), check: (_c, api) => api.getSelected().includes("f4") },

    { id: "dom", title: "2 domains", level: "Practice", prompt: "domainCount 2.",

      check: (_c, api) => api.getStats().domainCount === GOLDENS.domainCount },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode flops.",

      setup: (_c, api) => api.showFlops(), check: (_c, api) => api.getMode()==="flops" },

    { id: "golden", title: "scanCellCount", level: "Challenge", prompt: "scanCellCount=4.", check: () => GOLDENS.scanCellCount === 4 },
  ],
});
