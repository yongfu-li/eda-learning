import { GOLDENS } from "../../assets/pex-core.js";
import { createInteractivePexLab } from "../../assets/interactive-pex-lab.js";
const root = document.getElementById("lab-root");

createInteractivePexLab(root, {
  defaultMode: "network",
  starterHtml: `<p><strong>Your job:</strong> Build RC network; select in/out; confirm series chain with 4 R edges.</p>`,
  challenges: [
    { id: "run", title: "Network", level: "Intro", prompt: "Click Network.",
      setup: (_c, api) => api.showNetwork(), check: (_c, api) => api.getMode() === "network" },
    { id: "in", title: "Node in", level: "Intro", prompt: "nodes include in.",
      setup: (_c, api) => api.showNetwork(), check: (_c, api) => api.getLast().nodes.includes("in") },
    { id: "out", title: "Node out", level: "Practice", prompt: "nodes include out.",
      setup: (_c, api) => api.showNetwork(), check: (_c, api) => api.getLast().nodes.includes("out") },
    { id: "selin", title: "Select in", level: "Practice", prompt: "Click in.",
      setup: (_c, api) => { api.showNetwork(); api.select("in"); }, check: (_c, api) => api.getSelected().includes("in") },
    { id: "selout", title: "Select out", level: "Practice", prompt: "Click out.",
      setup: (_c, api) => { api.showNetwork(); api.select("out"); }, check: (_c, api) => api.getSelected().includes("out") },
    { id: "r4", title: "Four R", level: "Practice", prompt: "rCount 4.",
      setup: (_c, api) => api.showNetwork(), check: (_c, api) => api.getLast().rCount === GOLDENS.rCount },
    { id: "c3", title: "Three C", level: "Practice", prompt: "cCount 3.",
      setup: (_c, api) => api.showNetwork(), check: (_c, api) => api.getLast().cCount === GOLDENS.cGndCount },
    { id: "golden", title: "in/out", level: "Challenge", prompt: "nodes include in and out.", check: (_c, api) => { const n = api.showNetwork().nodes; return n.includes("in") && n.includes("out"); } },
  ],
});
