import { GOLDENS } from "../../assets/antenna-core.js";

import { createInteractiveAntennaLab } from "../../assets/interactive-antenna-lab.js";

const root = document.getElementById("lab-root");


createInteractiveAntennaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Collect markers; confirm count=1.</p>`,
  challenges: [
    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",

      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode() === "markers" },

    { id: "c1", title: "Count 1", level: "Intro", prompt: "marker count 1.",

      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().count === GOLDENS.markerCount },

    { id: "n1", title: "n1 marker", level: "Practice", prompt: "marker on n1.",

      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers[0].net==="n1" },

    { id: "kind", title: "Kind", level: "Practice", prompt: "kind antenna_ratio.",

      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers[0].kind==="antenna_ratio" },

    { id: "notn3", title: "Not n3", level: "Practice", prompt: "no n3 marker.",

      setup: (_c, api) => api.collect(), check: (_c, api) => !api.getLast().markers.some(m=>m.net==="n3") },

    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",

      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode markers.",

      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode()==="markers" },

    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=1.", check: () => GOLDENS.markerCount === 1 },
  ],
});
