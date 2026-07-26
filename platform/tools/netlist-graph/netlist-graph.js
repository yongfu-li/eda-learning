import { GOLDENS } from "../../assets/erc-core.js";
import { createInteractiveErcLab } from "../../assets/interactive-erc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveErcLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Inspect connectivity; confirm 8 nets and 14 edges.</p>`,
  challenges: [
    { id: "run", title: "Show graph", level: "Intro", prompt: "Click Graph.",
      setup: (_c, api) => api.showGraph(), check: (_c, api) => api.getMode() === "graph" },
    { id: "n8", title: "Eight nets", level: "Intro", prompt: "netCount 8.", check: (_c, api) => api.getStats().netCount === GOLDENS.netCount },
    { id: "e14", title: "Fourteen edges", level: "Practice", prompt: "edgeCount 14.",
      setup: (_c, api) => api.showGraph(), check: (_c, api) => api.getLast().edgeCount === GOLDENS.edgeCount },
    { id: "i4", title: "Four instances", level: "Practice", prompt: "instanceCount 4.", check: (_c, api) => api.getStats().instanceCount === GOLDENS.instanceCount },
    { id: "sel", title: "Select a", level: "Practice", prompt: "Click net a.",
      setup: (_c, api) => api.selectNet("a"), check: (_c, api) => api.getSelected().includes("a") },
    { id: "has", title: "Has float_n", level: "Practice", prompt: "float_n in nets.", check: (_c, api) => api.getDesign().nets.includes("float_n") },
    { id: "u1", title: "Has u1", level: "Practice", prompt: "u1 present.", check: (_c, api) => api.getDesign().instances.some(i=>i.id==="u1") },
    { id: "golden", title: "edgeCount", level: "Challenge", prompt: "edgeCount=14.", check: () => GOLDENS.edgeCount === 14 },
  ],
});
