import { GOLDENS } from "../../assets/drc-core.js";
import { createInteractiveDrcLab } from "../../assets/interactive-drc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveDrcLab(root, {
  defaultMode: "engine",
  starterHtml: `<p><strong>Your job:</strong> Run engine; confirm ok and violations=3.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "v3", title: "Viol 3", level: "Practice", prompt: "violations 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().violations.count === GOLDENS.violationCount },
    { id: "w1", title: "Width 1", level: "Practice", prompt: "width 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().width.count === 1 },
    { id: "s1", title: "Space 1", level: "Practice", prompt: "space 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().space.count === 1 },
    { id: "e1", title: "Enc 1", level: "Practice", prompt: "enclosure 1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().enclosure.count === 1 },
    { id: "sel", title: "Select D", level: "Practice", prompt: "Click shape D.",
      setup: (_c, api) => { api.engine(); api.selectShape("D"); }, check: (_c, api) => api.getSelectedShapes().includes("D") },
    { id: "golden", title: "violationCount", level: "Challenge", prompt: "violationCount=3.", check: () => GOLDENS.violationCount === 3 },
  ],
});
