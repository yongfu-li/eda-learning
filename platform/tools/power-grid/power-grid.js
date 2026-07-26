import { GOLDENS } from "../../assets/power-core.js";
import { createInteractivePowerLab } from "../../assets/interactive-power-lab.js";
const root = document.getElementById("lab-root");

createInteractivePowerLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Build grid: 4 nodes, 3 series edges.</p>`,
  challenges: [
    { id: "run", title: "Grid", level: "Intro", prompt: "Click Grid.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getMode() === "grid" },
    { id: "nodes", title: "4 nodes", level: "Intro", prompt: "4 grid nodes.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getLast().nodes.length === 4 },
    { id: "edges", title: "3 edges", level: "Practice", prompt: "edgeCount 3.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getLast().edgeCount === GOLDENS.edgeCount },
    { id: "i", title: "i_sink", level: "Practice", prompt: "i_sink 0.1.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getLast().i_sink === GOLDENS.iSink },
    { id: "vsrc", title: "v_src", level: "Practice", prompt: "v_src 1.0.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getLast().v_src === 1 },
    { id: "e1", title: "e1 R=1", level: "Practice", prompt: "e1 resistance 1.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getLast().edges.find(e=>e.id==="e1").r === 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode grid.",
      setup: (_c, api) => api.showGrid(), check: (_c, api) => api.getMode()==="grid" },
    { id: "golden", title: "edgeCount", level: "Challenge", prompt: "edgeCount=3.", check: () => GOLDENS.edgeCount === 3 },
  ],
});
