import { GOLDENS } from "../../assets/antenna-core.js";

import { createInteractiveAntennaLab } from "../../assets/interactive-antenna-lab.js";

const root = document.getElementById("lab-root");


createInteractiveAntennaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run engine; confirm ok and markers=1.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },

    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },

    { id: "m1", title: "Markers 1", level: "Practice", prompt: "markers 1.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().markers.count === 1 },

    { id: "viol", title: "Viol 1", level: "Practice", prompt: "violations 1.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().violations.count === 1 },

    { id: "r1", title: "Ratio n1", level: "Practice", prompt: "n1 ratio 25.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ratios.ratios.n1 === 25 },

    { id: "jmp", title: "Jumper", level: "Practice", prompt: "jumper after 0.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().jumper.afterRatio === 0 },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode engine.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode()==="engine" },

    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=1.", check: () => GOLDENS.markerCount === 1 },
  ],
});
