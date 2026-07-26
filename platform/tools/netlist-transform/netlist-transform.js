import { GOLDENS } from "../../assets/dft-core.js";

import { createInteractiveDftLab } from "../../assets/interactive-dft-lab.js";

const root = document.getElementById("lab-root");


createInteractiveDftLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Apply DFT insert edges; transform_edge_count=6.</p>`,
  challenges: [
    { id: "run", title: "Transform", level: "Intro", prompt: "Click Transform.",

      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getMode() === "transform" },

    { id: "e6", title: "Edges 6", level: "Intro", prompt: "edge count 6.",

      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getLast().edgeCount === GOLDENS.transformEdgeCount },

    { id: "st", title: "Stitches 3", level: "Practice", prompt: "stitchCount 3.",

      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getLast().stitchCount === GOLDENS.stitchCount },

    { id: "lk", title: "Lockup 1", level: "Practice", prompt: "lockupCount 1.",

      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getLast().lockupCount === GOLDENS.lockupCount },

    { id: "si", title: "SI edge", level: "Practice", prompt: "One SI edge.",

      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getLast().edges.some(e => e.kind === "si") },

    { id: "so", title: "SO edge", level: "Practice", prompt: "One SO edge.",

      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getLast().edges.some(e => e.kind === "so") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode transform.",

      setup: (_c, api) => api.showTransform(), check: (_c, api) => api.getMode()==="transform" },

    { id: "golden", title: "transformEdgeCount", level: "Challenge", prompt: "transformEdgeCount=6.", check: () => GOLDENS.transformEdgeCount === 6 },
  ],
});
