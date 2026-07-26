import { GOLDENS } from "../../assets/pattern-matching-core.js";
import { createInteractivePatternLab } from "../../assets/interactive-pattern-lab.js";
const root = document.getElementById("lab-root");

createInteractivePatternLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run full engine; confirm count=3.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Match engine.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "three", title: "Count 3", level: "Intro", prompt: "count is 3.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getLast().count === GOLDENS.matchEngineMarkers },
    { id: "w", title: "Width 1", level: "Practice", prompt: "width=1.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getLast().width === 1 },
    { id: "s", title: "Space 1", level: "Practice", prompt: "space=1.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getLast().space === 1 },
    { id: "e", title: "Encl 1", level: "Practice", prompt: "enclosure=1.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getLast().enclosure === 1 },
    { id: "markers", title: "Markers 3", level: "Practice", prompt: "markers.length 3.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getMarkers().length === 3 },
    { id: "bool", title: "Boolean hit", level: "Practice", prompt: "boolean_and_not length 1.",
      setup: (_c, api) => api.matchEngine(), check: (_c, api) => api.getLast().boolean_and_not.length === 1 },
    { id: "golden", title: "matchEngineMarkers", level: "Challenge", prompt: "matchEngineMarkers=3.", check: () => GOLDENS.matchEngineMarkers === 3 },
  ],
});
