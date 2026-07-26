import { GOLDENS } from "../../assets/dft-core.js";

import { createInteractiveDftLab } from "../../assets/interactive-dft-lab.js";

const root = document.getElementById("lab-root");


createInteractiveDftLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run engine; confirm ok and markers=1.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },

    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },

    { id: "m1", title: "Markers 1", level: "Practice", prompt: "markers 1.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().markers.count === 1 },

    { id: "cells", title: "Cells 4", level: "Practice", prompt: "scan cells 4.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().cells.count === GOLDENS.scanCellCount },

    { id: "st", title: "Stitches 3", level: "Practice", prompt: "stitch count 3.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().chain.stitchCount === 3 },

    { id: "edges", title: "Edges 6", level: "Practice", prompt: "transform edges 6.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().transform.edgeCount === 6 },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode engine.",

      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode()==="engine" },

    { id: "golden", title: "engineOk", level: "Challenge", prompt: "engineOk=true.", check: () => GOLDENS.engineOk === true },
  ],
});
