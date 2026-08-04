import { GOLDENS } from "../../assets/drc-core.js";
import { createInteractiveDrcLab } from "../../assets/interactive-drc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveDrcLab(root, {
  defaultMode: "width",
  starterHtml: `<p><strong>Your job:</strong> Find the width violator; select D and confirm W.M1.</p>`,
  challenges: [
    { id: "run", title: "Width", level: "Intro", prompt: "Click Width.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => api.getMode() === "width" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "width count 1.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => api.getLast().count === GOLDENS.widthViolations },
    { id: "d", title: "Shape D", level: "Practice", prompt: "violator is D.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => api.getLast().violations[0].shapes[0] === "D" },
    { id: "sel", title: "Select D", level: "Practice", prompt: "Click shape D.",
      setup: (_c, api) => { api.runWidth(); api.selectShape("D"); }, check: (_c, api) => api.getSelectedShapes().includes("D") },
    { id: "rule", title: "W.M1", level: "Practice", prompt: "rule_id W.M1.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => api.getLast().violations[0].rule_id === "W.M1" },
    { id: "layer", title: "M1 layer", level: "Practice", prompt: "violation on M1.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => api.getLast().violations[0].layer === "M1" },
    { id: "notab", title: "Not A/B", level: "Practice", prompt: "A and B pass width.",
      setup: (_c, api) => api.runWidth(), check: (_c, api) => !api.getLast().violations.some(v => v.shapes.includes("A") || v.shapes.includes("B")) },
    { id: "golden", title: "widthViolations", level: "Challenge", prompt: "widthViolations=1.", check: () => GOLDENS.widthViolations === 1 },
  ],
});
