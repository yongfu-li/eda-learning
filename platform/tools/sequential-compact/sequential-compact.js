import { GOLDENS } from "../../assets/compaction-core.js";
import { createInteractiveCompactionLab } from "../../assets/interactive-compaction-lab.js";
const root = document.getElementById("lab-root");

createInteractiveCompactionLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run the full sequential compaction pipeline.</p>`,
  challenges: [
    { id: "run", title: "Sequential", level: "Intro", prompt: "Click Sequential.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getMode() === "sequential" },
    { id: "fw", title: "Final 14", level: "Intro", prompt: "finalWidth 14.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getLast().finalWidth === 14 },
    { id: "legal", title: "Legal true", level: "Practice", prompt: "legal true.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getLast().legal === true },
    { id: "imp", title: "Improved", level: "Practice", prompt: "improved true.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getLast().improved === true },
    { id: "iw", title: "Initial 20", level: "Practice", prompt: "initialWidth 20.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getLast().initialWidth === 20 },
    { id: "xc", title: "X constraints", level: "Practice", prompt: "xConstraints > 0.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getLast().xConstraints > 0 },
    { id: "stats", title: "Stats width 14", level: "Practice", prompt: "stats.width 14.",
      setup: (_c, api) => api.sequential(), check: (_c, api) => api.getStats().width === 14 },
    { id: "golden", title: "compactXWidth", level: "Challenge", prompt: "compactXWidth=14.", check: () => GOLDENS.compactXWidth === 14 },
  ],
});
