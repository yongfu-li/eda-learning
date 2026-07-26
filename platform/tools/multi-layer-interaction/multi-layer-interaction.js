import { GOLDENS } from "../../assets/pattern-matching-core.js";
import { createInteractivePatternLab } from "../../assets/interactive-pattern-lab.js";
const root = document.getElementById("lab-root");

createInteractivePatternLab(root, {
  starterHtml: `<p><strong>Your job:</strong> List cross-layer overlaps; confirm A–V.</p>`,
  challenges: [
    { id: "run", title: "Interactions", level: "Intro", prompt: "Click Interactions.",
      setup: (_c, api) => api.interactions(), check: (_c, api) => api.getMode() === "interactions" },
    { id: "ge1", title: "At least 1", level: "Intro", prompt: "pairs.length ≥ 1.",
      setup: (_c, api) => api.interactions(), check: (_c, api) => api.getLast().pairs.length >= 1 },
    { id: "av", title: "Has A-V", level: "Practice", prompt: "Includes A and V.",
      setup: (_c, api) => api.interactions(), check: (_c, api) => api.getLast().pairs.some(p => { const s=new Set(p.shapes); return s.has("A")&&s.has("V"); }) },
    { id: "cross", title: "Cross layer", level: "Practice", prompt: "layers differ.",
      setup: (_c, api) => api.interactions(), check: (_c, api) => api.getLast().pairs.every(p => p.layers[0]!==p.layers[1]) },
    { id: "sel", title: "Select V", level: "Practice", prompt: "Select V.", check: (_c, api) => { api.setSelected("V"); return api.getSelected()==="V"; } },
    { id: "shapes5", title: "5 shapes", level: "Practice", prompt: "shapeCount 5.", check: (_c, api) => api.getStats().shapeCount === 5 },
    { id: "mode", title: "Mode set", level: "Practice", prompt: "mode interactions.",
      setup: (_c, api) => api.interactions(), check: (_c, api) => api.getMode()==="interactions" },
    { id: "golden", title: "shapeCount", level: "Challenge", prompt: "shapeCount=5.", check: () => GOLDENS.shapeCount === 5 },
  ],
});
