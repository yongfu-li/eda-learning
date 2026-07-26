import { GOLDENS } from "../../assets/dft-core.js";

import { createInteractiveDftLab } from "../../assets/interactive-dft-lab.js";

const root = document.getElementById("lab-root");


createInteractiveDftLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Visualize full chain SI→f1→f2→f3→f4→SO with lockup highlight.</p>`,
  challenges: [
    { id: "run", title: "Chain", level: "Intro", prompt: "Click Chain.",

      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getMode() === "chain" },

    { id: "ord", title: "Order", level: "Intro", prompt: "Chain f1→f2→f3→f4.",

      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getDesign().scan_order.join(",") === "f1,f2,f3,f4" },

    { id: "st", title: "Stitches 3", level: "Practice", prompt: "stitch count 3.",

      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getLast().chain.stitchCount === 3 },

    { id: "lk", title: "Lockup 1", level: "Practice", prompt: "lockup count 1.",

      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getLast().lockups.count === 1 },

    { id: "mark", title: "Marker", level: "Practice", prompt: "One marker shown.",

      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getMarkers().length === 1 },

    { id: "sel", title: "Select f1", level: "Practice", prompt: "Select f1.",

      setup: (_c, api) => api.selectFlop("f1"), check: (_c, api) => api.getSelected().includes("f1") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode chain.",

      setup: (_c, api) => api.showChain(), check: (_c, api) => api.getMode()==="chain" },

    { id: "golden", title: "chain ok", level: "Challenge", prompt: "Full chain golden.", check: () => GOLDENS.chainLength === 4 },
  ],
});
