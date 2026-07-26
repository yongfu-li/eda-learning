import { GOLDENS } from "../../assets/signoff-core.js";
import { createInteractiveSignoffLab } from "../../assets/interactive-signoff-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSignoffLab(root, {
  starterHtml: `<p><strong>Your job:</strong> List PVT corners; confirm corner_count=3.</p>`,
  challenges: [
    { id: "run", title: "Corners", level: "Intro", prompt: "Click Corners.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getMode() === "corners" },
    { id: "c3", title: "Count 3", level: "Intro", prompt: "corner count 3.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getLast().count === GOLDENS.cornerCount },
    { id: "ss", title: "ss corner", level: "Practice", prompt: "ss_0p9_125 present.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getLast().corners.some(c => c.id === "ss_0p9_125") },
    { id: "tt", title: "tt corner", level: "Practice", prompt: "tt_1p0_25 present.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getLast().corners.some(c => c.id === "tt_1p0_25") },
    { id: "ff", title: "ff corner", level: "Practice", prompt: "ff_1p1_m40 present.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getLast().corners.some(c => c.id === "ff_1p1_m40") },
    { id: "der", title: "ss derate", level: "Practice", prompt: "ss derate 1.1.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getLast().corners.find(c => c.id === "ss_0p9_125")?.derate === 1.1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode corners.",
      setup: (_c, api) => api.showCorners(), check: (_c, api) => api.getMode()==="corners" },
    { id: "golden", title: "cornerCount", level: "Challenge", prompt: "cornerCount=3.", check: () => GOLDENS.cornerCount === 3 },
  ],
});
