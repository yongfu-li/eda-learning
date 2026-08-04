import { GOLDENS } from "../../assets/drc-core.js";
import { createInteractiveDrcLab } from "../../assets/interactive-drc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveDrcLab(root, {
  defaultMode: "markers",
  starterHtml: `<p><strong>Your job:</strong> Collect markers; confirm 3 violations with rule_id.</p>`,
  challenges: [
    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode() === "markers" },
    { id: "c3", title: "Count 3", level: "Intro", prompt: "violation count 3.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().count === GOLDENS.violationCount },
    { id: "width", title: "Width kind", level: "Practice", prompt: "has width violation.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().violations.some(v => v.type === "width") },
    { id: "space", title: "Space kind", level: "Practice", prompt: "has space violation.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().violations.some(v => v.type === "space") },
    { id: "enc", title: "Enc kind", level: "Practice", prompt: "has enclosure violation.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().violations.some(v => v.type === "enclosure") },
    { id: "seld", title: "Select D", level: "Practice", prompt: "Click shape D.",
      setup: (_c, api) => { api.collect(); api.selectShape("D"); }, check: (_c, api) => api.getSelectedShapes().includes("D") },
    { id: "rid", title: "rule_id", level: "Practice", prompt: "all have rule_id.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().violations.every(v => v.rule_id) },
    { id: "golden", title: "violationCount", level: "Challenge", prompt: "violationCount=3.", check: () => GOLDENS.violationCount === 3 },
  ],
});
