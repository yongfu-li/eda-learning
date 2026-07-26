import { GOLDENS } from "../../assets/dft-core.js";

import { createInteractiveDftLab } from "../../assets/interactive-dft-lab.js";

const root = document.getElementById("lab-root");


createInteractiveDftLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Read SE/SI/SO ports: si=scan_in, so=scan_out, se=scan_enable.</p>`,
  challenges: [
    { id: "run", title: "SE", level: "Intro", prompt: "Click SE.",

      setup: (_c, api) => api.showSe(), check: (_c, api) => api.getMode() === "se" },

    { id: "se", title: "scan_enable", level: "Intro", prompt: "se=scan_enable.",

      setup: (_c, api) => api.showSe(), check: (_c, api) => api.getLast().se === "scan_enable" },

    { id: "si", title: "scan_in", level: "Practice", prompt: "si=scan_in.",

      setup: (_c, api) => api.showSe(), check: (_c, api) => api.getLast().si === "scan_in" },

    { id: "so", title: "scan_out", level: "Practice", prompt: "so=scan_out.",

      setup: (_c, api) => api.showSe(), check: (_c, api) => api.getLast().so === "scan_out" },

    { id: "sel", title: "Select f1", level: "Practice", prompt: "Select f1.",

      setup: (_c, api) => api.selectFlop("f1"), check: (_c, api) => api.getSelected().includes("f1") },

    { id: "flops", title: "4 flops", level: "Practice", prompt: "flopCount 4.",

      check: (_c, api) => api.getStats().flopCount === GOLDENS.flopCount },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode se.",

      setup: (_c, api) => api.showSe(), check: (_c, api) => api.getMode()==="se" },

    { id: "golden", title: "ports", level: "Challenge", prompt: "All three ports named.", check: () => true },
  ],
});
