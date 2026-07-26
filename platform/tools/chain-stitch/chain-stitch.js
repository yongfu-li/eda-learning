import { GOLDENS } from "../../assets/dft-core.js";

import { createInteractiveDftLab } from "../../assets/interactive-dft-lab.js";

const root = document.getElementById("lab-root");


createInteractiveDftLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Stitch Q→SI between flops; stitch_count=3.</p>`,
  challenges: [
    { id: "run", title: "Stitch", level: "Intro", prompt: "Click Stitch.",

      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getMode() === "stitch" },

    { id: "c3", title: "Count 3", level: "Intro", prompt: "stitch count 3.",

      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getLast().stitchCount === GOLDENS.stitchCount },

    { id: "ord", title: "Order", level: "Practice", prompt: "order f1→f2→f3→f4.",

      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getLast().order.join(",") === "f1,f2,f3,f4" },

    { id: "s12", title: "f1→f2", level: "Practice", prompt: "First stitch f1→f2.",

      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getLast().stitches[0].from === "f1" },

    { id: "s34", title: "f3→f4", level: "Practice", prompt: "Last stitch f3→f4.",

      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getLast().stitches[2].to === "f4" },

    { id: "sel", title: "Select f3", level: "Practice", prompt: "Select f3.",

      setup: (_c, api) => api.selectFlop("f3"), check: (_c, api) => api.getSelected().includes("f3") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode stitch.",

      setup: (_c, api) => api.showStitch(), check: (_c, api) => api.getMode()==="stitch" },

    { id: "golden", title: "stitchCount", level: "Challenge", prompt: "stitchCount=3.", check: () => GOLDENS.stitchCount === 3 },
  ],
});
