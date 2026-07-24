import { GOLDENS, PERIOD_TARGET } from "../../assets/retiming-core.js";
import { createInteractiveRetimingLab } from "../../assets/interactive-retiming-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRetimingLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Explore the toy sequential graph topology.</p>`,
  challenges: [
    { id: "nodes5", title: "Five nodes", level: "Intro", prompt: "Graph has 5 nodes.", check: (_c, api) => api.getStats().nodes === GOLDENS.nodeCount },
    { id: "edges5", title: "Five edges", level: "Intro", prompt: "Five edges.", check: (_c, api) => api.getStats().edges === GOLDENS.edgeCount },
    { id: "comb3", title: "Three comb", level: "Intro", prompt: "Three combinational nodes.", check: (_c, api) => api.getStats().comb === GOLDENS.combCount },
    { id: "regs2", title: "Two registers", level: "Practice", prompt: "Baseline registers = 2.", check: (_c, api) => api.getBaselineRegisters() === GOLDENS.baseRegisters },
    { id: "sel-a", title: "Select a", level: "Practice", prompt: "Select node a.", check: (_c, api) => api.getSelected() === "a" },
    { id: "sel-c", title: "Select c", level: "Practice", prompt: "Select node c.", check: (_c, api) => { api.setSelected("c"); return api.getSelected() === "c"; } },
    { id: "zero-legal", title: "Zero legal", level: "Practice", prompt: "Zero retiming is legal.", check: (_c, api) => api.isLegal() },
    { id: "base-p", title: "Baseline period", level: "Challenge", prompt: "Baseline period is 8.", check: (_c, api) => api.getBaselinePeriod() === GOLDENS.baselinePeriod },
  ],
});
