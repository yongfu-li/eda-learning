import { GOLDENS } from "../../assets/compaction-core.js";
import { createInteractiveCompactionLab } from "../../assets/interactive-compaction-lab.js";
const root = document.getElementById("lab-root");

createInteractiveCompactionLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Shear a channel band covering B.</p>`,
  challenges: [
    { id: "run", title: "Shear", level: "Intro", prompt: "Click Shear.",
      setup: (_c, api) => api.shear(), check: (_c, api) => api.getMode() === "shear" },
    { id: "moved", title: "Moved nonempty", level: "Intro", prompt: "moved has ids.",
      setup: (_c, api) => api.shear(), check: (_c, api) => api.getLast().moved.length > 0 },
    { id: "b", title: "B moved", level: "Practice", prompt: "B is among moved.",
      setup: (_c, api) => api.shear(), check: (_c, api) => api.getLast().moved.includes("B") },
    { id: "dy", title: "deltaY 1", level: "Practice", prompt: "deltaY is 1.",
      setup: (_c, api) => api.shear(), check: (_c, api) => api.getLast().deltaY === 1 },
    { id: "channel", title: "Channel band", level: "Practice", prompt: "channel is array.",
      setup: (_c, api) => api.shear(), check: (_c, api) => Array.isArray(api.getLast().channel) },
    { id: "reset", title: "Reset", level: "Practice", prompt: "Reset restores y of B.",
      check: (_c, api) => { api.shear(); api.reset(); return api.getObjects().find(o=>o.id==="B").y0 === 2; } },
    { id: "legal", title: "Check legal", level: "Practice", prompt: "Call isLegal after shear.",
      setup: (_c, api) => api.shear(), check: (_c, api) => typeof api.isLegal() === "boolean" },
    { id: "golden", title: "objectCount", level: "Challenge", prompt: "objectCount=4.", check: () => GOLDENS.objectCount === 4 },
  ],
});
