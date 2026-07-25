import { GOLDENS } from "../../assets/compaction-core.js";
import { createInteractiveCompactionLab } from "../../assets/interactive-compaction-lab.js";
const root = document.getElementById("lab-root");

createInteractiveCompactionLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Add a jog on wire W.</p>`,
  challenges: [
    { id: "jog", title: "Jog W", level: "Intro", prompt: "Click Jog W.",
      setup: (_c, api) => api.jogW(), check: (_c, api) => api.getMode() === "jog" },
    { id: "has-jog", title: "Has jog field", level: "Intro", prompt: "W has jog.",
      setup: (_c, api) => api.jogW(), check: (_c, api) => !!api.getObjects().find(o=>o.id==="W").jog },
    { id: "points", title: "Has points", level: "Practice", prompt: "W.points length ≥3.",
      setup: (_c, api) => api.jogW(), check: (_c, api) => api.getObjects().find(o=>o.id==="W").points.length >= 3 },
    { id: "sel", title: "Select W", level: "Practice", prompt: "Select W.",
      check: (_c, api) => { api.setSelected("W"); return api.getSelected()==="W"; } },
    { id: "stretched", title: "stretched flag", level: "Practice", prompt: "W.stretched true.",
      setup: (_c, api) => api.jogW(), check: (_c, api) => api.getObjects().find(o=>o.id==="W").stretched === true },
    { id: "compact", title: "Compact after jog", level: "Practice", prompt: "Compact X still works.",
      check: (_c, api) => { api.jogW(); return api.compactX().afterSpan === 14; } },
    { id: "legal", title: "Legal", level: "Practice", prompt: "Legal after jog.",
      setup: (_c, api) => api.jogW(), check: (_c, api) => api.isLegal() },
    { id: "golden", title: "minGap", level: "Challenge", prompt: "minGap=1.", check: () => GOLDENS.minGap === 1 },
  ],
});
