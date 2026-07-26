import { GOLDENS } from "../../assets/pattern-matching-core.js";
import { createInteractivePatternLab } from "../../assets/interactive-pattern-lab.js";
const root = document.getElementById("lab-root");

createInteractivePatternLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Emit width+space markers; confirm ≥2.</p>`,
  challenges: [
    { id: "run", title: "Emit", level: "Intro", prompt: "Click Emit markers.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMode() === "emit" },
    { id: "ge2", title: "At least 2", level: "Intro", prompt: "markers.length ≥ 2.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMarkers().length >= 2 },
    { id: "has-w", title: "Has width", level: "Practice", prompt: "Includes width.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMarkers().some(m => m.type==="width") },
    { id: "has-s", title: "Has space", level: "Practice", prompt: "Includes space.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMarkers().some(m => m.type==="space") },
    { id: "d", title: "Width on D", level: "Practice", prompt: "Width shapes D.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMarkers().some(m => m.type==="width" && m.shapes[0]==="D") },
    { id: "ab", title: "Space A B", level: "Practice", prompt: "Space involves A.",
      setup: (_c, api) => api.emitMarkers(), check: (_c, api) => api.getMarkers().some(m => m.type==="space" && m.shapes.includes("A")) },
    { id: "reset", title: "Reset", level: "Practice", prompt: "Reset clears markers.",
      setup: (_c, api) => { api.emitMarkers(); api.reset(); }, check: (_c, api) => api.getMarkers().length === 0 },
    { id: "golden", title: "W+S", level: "Challenge", prompt: "width+space goldens 1+1.", check: () => GOLDENS.widthMarkers+GOLDENS.spaceMarkers === 2 },
  ],
});
