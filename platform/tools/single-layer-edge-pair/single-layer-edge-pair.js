import { GOLDENS } from "../../assets/pattern-matching-core.js";
import { createInteractivePatternLab } from "../../assets/interactive-pattern-lab.js";
const root = document.getElementById("lab-root");

createInteractivePatternLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Match M1 spacing; confirm A–B marker.</p>`,
  challenges: [
    { id: "run", title: "Run space", level: "Intro", prompt: "Click Match space.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => api.getMode() === "space" },
    { id: "one", title: "One marker", level: "Intro", prompt: "Exactly one space marker.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => api.getMarkers().length === GOLDENS.spaceMarkers },
    { id: "ab", title: "A and B", level: "Practice", prompt: "Marker shapes are A and B.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => { const m=api.getMarkers()[0]; return m && new Set(m.shapes).has("A") && new Set(m.shapes).has("B"); } },
    { id: "gap", title: "Gap 1", level: "Practice", prompt: "value is 1.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => api.getMarkers()[0].value === 1 },
    { id: "limit", title: "Limit 2", level: "Practice", prompt: "limit is 2.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => api.getMarkers()[0].limit === 2 },
    { id: "type", title: "Type space", level: "Practice", prompt: "type is space.",
      setup: (_c, api) => api.matchSpace(), check: (_c, api) => api.getMarkers()[0].type === "space" },
    { id: "reset", title: "Reset clears", level: "Practice", prompt: "After reset markers empty.",
      setup: (_c, api) => { api.matchSpace(); api.reset(); }, check: (_c, api) => api.getMarkers().length === 0 },
    { id: "golden", title: "spaceMarkers", level: "Challenge", prompt: "spaceMarkers=1.", check: () => GOLDENS.spaceMarkers === 1 },
  ],
});
