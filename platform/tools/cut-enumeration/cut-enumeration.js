import { GOLDENS, LIBRARY, AIG_NODES } from "../../assets/synthesis-core.js";
import { createInteractiveSynthesisLab } from "../../assets/interactive-synthesis-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSynthesisLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Enumerate cuts with k=3.</p>`,
  challenges: [
    { id: "run", title: "Enumerate", level: "Intro", prompt: "Click Enumerate cuts.",
      setup: (_c, api) => api.runCuts(), check: (_c, api) => api.getMode() === "cuts" },
    { id: "total", title: "Total cuts >0", level: "Intro", prompt: "totalCuts > 0.",
      check: (_c, api) => { if (!api.getCuts()) api.runCuts(); return api.cutStats().totalCuts > 0; } },
    { id: "k", title: "cutK golden", level: "Intro", prompt: "GOLDENS.cutK=3.", check: () => GOLDENS.cutK === 3 },
    { id: "po", title: "Node 7 cuts", level: "Practice", prompt: "Node 7 has ≥1 cut.",
      check: (_c, api) => { if (!api.getCuts()) api.runCuts(); return api.getCuts()[7].length >= 1; } },
    { id: "pi", title: "PI cut size 1", level: "Practice", prompt: "PI 1 cut size 1.",
      check: (_c, api) => { if (!api.getCuts()) api.runCuts(); return api.getCuts()[1].length >= 1; } },
    { id: "mode", title: "Mode cuts", level: "Practice", prompt: "Mode is cuts.",
      setup: (_c, api) => api.runCuts(), check: (_c, api) => api.getMode() === "cuts" },
    { id: "max", title: "maxPerNode", level: "Practice", prompt: "maxPerNode ≥1.",
      check: (_c, api) => { if (!api.getCuts()) api.runCuts(); return api.cutStats().maxPerNode >= 1; } },
    { id: "clear", title: "Clear", level: "Challenge", prompt: "Clear then re-run.",
      check: (_c, api) => { api.clearMap(); api.runCuts(); return api.getMode()==="cuts"; } },
  ],
});
