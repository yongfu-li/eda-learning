import { GOLDENS } from "../../assets/dft-core.js";

import { createInteractiveDftLab } from "../../assets/interactive-dft-lab.js";

const root = document.getElementById("lab-root");


createInteractiveDftLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Collect lockup markers; marker_count=1.</p>`,
  challenges: [
    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",

      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getMode() === "markers" },

    { id: "c1", title: "Count 1", level: "Intro", prompt: "marker count 1.",

      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().count === GOLDENS.markerCount },

    { id: "kind", title: "Lockup kind", level: "Practice", prompt: "kind lockup.",

      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().markers[0].kind === "lockup" },

    { id: "f34", title: "f3→f4", level: "Practice", prompt: "Marker on f3→f4.",

      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().markers[0].from === "f3" },

    { id: "sel", title: "Select f3", level: "Practice", prompt: "Select f3.",

      setup: (_c, api) => api.selectFlop("f3"), check: (_c, api) => api.getSelected().includes("f3") },

    { id: "dom", title: "Domains", level: "Practice", prompt: "Two clock domains.",

      check: (_c, api) => api.getStats().domainCount === 2 },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode markers.",

      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getMode()==="markers" },

    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=1.", check: () => GOLDENS.markerCount === 1 },
  ],
});
