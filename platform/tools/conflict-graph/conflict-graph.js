import { GOLDENS } from "../../assets/multi-patterning-core.js";
import { createInteractiveMpLab } from "../../assets/interactive-multi-patterning-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMpLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Build the conflict graph; confirm 5 edges.</p>`,
  challenges: [
    { id: "n6", title: "Six features", level: "Intro", prompt: "featureCount is 6.", check: (_c, api) => api.getStats().featureCount === GOLDENS.featureCount },
    { id: "run", title: "Show graph", level: "Intro", prompt: "Click Conflict graph.",
      setup: (_c, api) => api.showGraph(), check: (_c, api) => api.getMode() === "graph" },
    { id: "e5", title: "Five edges", level: "Practice", prompt: "edgeCount is 5.",
      setup: (_c, api) => api.showGraph(), check: (_c, api) => api.getGraph().edgeCount === GOLDENS.conflictEdges },
    { id: "sel", title: "Select A", level: "Practice", prompt: "Select A.", check: (_c, api) => { api.setSelected("A"); return api.getSelected()==="A"; } },
    { id: "has-c", title: "Has C", level: "Practice", prompt: "C present.", check: (_c, api) => api.getFeatures().some(f=>f.id==="C") },
    { id: "ids", title: "Has F", level: "Practice", prompt: "F present.", check: (_c, api) => api.getFeatures().some(f=>f.id==="F") },
    { id: "reset", title: "Reset", level: "Practice", prompt: "Reset clears graph mode.",
      setup: (_c, api) => { api.showGraph(); api.reset(); }, check: (_c, api) => api.getMode() == null },
    { id: "golden", title: "conflictEdges", level: "Challenge", prompt: "conflictEdges=5.", check: () => GOLDENS.conflictEdges === 5 },
  ],
});
