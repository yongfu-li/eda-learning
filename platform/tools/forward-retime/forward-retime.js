import { GOLDENS, PERIOD_TARGET } from "../../assets/retiming-core.js";
import { createInteractiveRetimingLab } from "../../assets/interactive-retiming-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRetimingLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Push registers forward across node a (−r).</p>`,
  challenges: [
    { id: "run", title: "Forward on a", level: "Intro", prompt: "Click Forward on a.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getR().a === -1 },
    { id: "period", title: "P=5", level: "Intro", prompt: "Period becomes 5.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getPeriod() === GOLDENS.forwardAPeriod },
    { id: "regs", title: "Regs=3", level: "Practice", prompt: "Registers become 3.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getRegisters() === 3 },
    { id: "e0", title: "e0 → 0", level: "Practice", prompt: "After forward a, e0.w=0.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getEdges().find(e=>e.id==="e0").w === 0 },
    { id: "e1", title: "e1 → 1", level: "Practice", prompt: "e1.w becomes 1.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getEdges().find(e=>e.id==="e1").w === 1 },
    { id: "legal", title: "Legal", level: "Practice", prompt: "Forward a is legal.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() },
    { id: "mode", title: "Mode", level: "Practice", prompt: "Mode forward-a.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getMode() === "forward-a" },
    { id: "sel", title: "Selected a", level: "Challenge", prompt: "Selected node is a.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getSelected() === "a" },
  ],
});
