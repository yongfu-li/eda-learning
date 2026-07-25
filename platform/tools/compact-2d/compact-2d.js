import { GOLDENS } from "../../assets/compaction-core.js";
import { createInteractiveCompactionLab } from "../../assets/interactive-compaction-lab.js";
const root = document.getElementById("lab-root");

createInteractiveCompactionLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run X then Y compaction.</p>`,
  challenges: [
    { id: "run", title: "Compact 2D", level: "Intro", prompt: "Click Compact 2D.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getMode() === "compact-2d" },
    { id: "fw", title: "Final width 14", level: "Intro", prompt: "finalWidth 14.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getLast().finalWidth === 14 },
    { id: "iw", title: "Initial width 20", level: "Practice", prompt: "initialWidth 20.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getLast().initialWidth === 20 },
    { id: "imp", title: "Width improved", level: "Practice", prompt: "widthImproved true.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getLast().widthImproved === true },
    { id: "steps", title: "Two steps", level: "Practice", prompt: "steps length 2.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getLast().steps.length === 2 },
    { id: "legal", title: "Legal", level: "Practice", prompt: "Legal after 2D.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.isLegal() },
    { id: "order", title: "Order x,y", level: "Practice", prompt: "order starts with x.",
      setup: (_c, api) => api.compact2d(), check: (_c, api) => api.getLast().order[0] === "x" },
    { id: "golden", title: "initialWidth", level: "Challenge", prompt: "initialWidth golden 20.", check: () => GOLDENS.initialWidth === 20 },
  ],
});
