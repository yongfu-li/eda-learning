import { GOLDENS } from "../../assets/compaction-core.js";
import { createInteractiveCompactionLab } from "../../assets/interactive-compaction-lab.js";
const root = document.getElementById("lab-root");

createInteractiveCompactionLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Build and inspect the X constraint graph.</p>`,
  challenges: [
    { id: "show", title: "Show X graph", level: "Intro", prompt: "Click X graph.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getMode() === "graph-x" },
    { id: "edges", title: "Edges ≥8", level: "Intro", prompt: "constraint edges ≥ 8.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getGraph().edges.length >= GOLDENS.xConstraintMin },
    { id: "nodes", title: "Has SRC_X", level: "Practice", prompt: "nodes include SRC_X.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getGraph().nodes.includes("SRC_X") },
    { id: "axis", title: "Axis x", level: "Practice", prompt: "graph.axis is x.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getGraph().axis === "x" },
    { id: "gap", title: "minGap 1", level: "Practice", prompt: "graph.minGap is 1.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getGraph().minGap === 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode graph-x.",
      setup: (_c, api) => api.showGraphX(), check: (_c, api) => api.getMode()==="graph-x" },
    { id: "legal", title: "Still legal", level: "Practice", prompt: "Layout still legal.", check: (_c, api) => api.isLegal() },
    { id: "golden", title: "xConstraintMin", level: "Challenge", prompt: "xConstraintMin=8.", check: () => GOLDENS.xConstraintMin === 8 },
  ],
});
