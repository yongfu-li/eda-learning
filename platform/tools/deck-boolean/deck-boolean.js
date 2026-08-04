import { GOLDENS } from "../../assets/drc-core.js";
import { createInteractiveDrcLab } from "../../assets/interactive-drc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveDrcLab(root, {
  defaultMode: "boolean",
  starterHtml: `<p><strong>Your job:</strong> Select V; confirm boolean hit=1 (V in M1 not M2).</p>`,
  challenges: [
    { id: "run", title: "Boolean", level: "Intro", prompt: "Click Boolean.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getMode() === "boolean" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "boolean count 1.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getLast().count === GOLDENS.booleanHits },
    { id: "v", title: "Shape V", level: "Practice", prompt: "hit shape V.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getLast().hits[0].shapes[0] === "V" },
    { id: "sel", title: "Select V", level: "Practice", prompt: "Click shape V.",
      setup: (_c, api) => { api.runBoolean(); api.selectShape("V"); }, check: (_c, api) => api.getSelectedShapes().includes("V") },
    { id: "rule", title: "Deck rule", level: "Practice", prompt: "rule B.VIA_M1_not_M2.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getLast().hits[0].rule_id === "B.VIA_M1_not_M2" },
    { id: "mode", title: "and_not", level: "Practice", prompt: "mode and_not.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getLast().hits[0].mode === "and_not" },
    { id: "mk", title: "Marker", level: "Practice", prompt: "markers length 1.",
      setup: (_c, api) => api.runBoolean(), check: (_c, api) => api.getMarkers().length === 1 },
    { id: "golden", title: "booleanHits", level: "Challenge", prompt: "booleanHits=1.", check: () => GOLDENS.booleanHits === 1 },
  ],
});
