import { GOLDENS } from "../../assets/erc-core.js";
import { createInteractiveErcLab } from "../../assets/interactive-erc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveErcLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run engine; confirm ok and markers=5.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "m5", title: "Markers 5", level: "Practice", prompt: "markers 5.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().markers.count === 5 },
    { id: "fl", title: "Floating 1", level: "Practice", prompt: "floating 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().floating.count === 1 },
    { id: "multi", title: "Multi 1", level: "Practice", prompt: "multi 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().multi.count === 1 },
    { id: "short", title: "Short 1", level: "Practice", prompt: "shorts 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().shorts.count === 1 },
    { id: "well", title: "Well 1", level: "Practice", prompt: "wells 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().wells.count === 1 },
    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=5.", check: () => GOLDENS.markerCount === 5 },
  ],
});
