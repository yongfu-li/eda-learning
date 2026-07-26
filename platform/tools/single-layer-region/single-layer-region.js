import { GOLDENS } from "../../assets/pattern-matching-core.js";
import { createInteractivePatternLab } from "../../assets/interactive-pattern-lab.js";
const root = document.getElementById("lab-root");

createInteractivePatternLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Match width; confirm marker on D.</p>`,
  challenges: [
    { id: "run", title: "Run width", level: "Intro", prompt: "Click Match width.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMode() === "width" },
    { id: "one", title: "One marker", level: "Intro", prompt: "One width marker.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMarkers().length === GOLDENS.widthMarkers },
    { id: "d", title: "On D", level: "Practice", prompt: "Marker on D.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMarkers()[0].shapes[0] === "D" },
    { id: "val", title: "Value 1", level: "Practice", prompt: "value is 1.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMarkers()[0].value === 1 },
    { id: "lim", title: "Limit 3", level: "Practice", prompt: "limit is 3.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMarkers()[0].limit === 3 },
    { id: "sel", title: "Select D", level: "Practice", prompt: "Select D.", check: (_c, api) => { api.setSelected("D"); return api.getSelected()==="D"; } },
    { id: "type", title: "Type width", level: "Practice", prompt: "type width.",
      setup: (_c, api) => api.matchWidth(), check: (_c, api) => api.getMarkers()[0].type === "width" },
    { id: "golden", title: "widthMarkers", level: "Challenge", prompt: "widthMarkers=1.", check: () => GOLDENS.widthMarkers === 1 },
  ],
});
