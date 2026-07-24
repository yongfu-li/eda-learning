import { GOLDENS, PERIOD_TARGET } from "../../assets/retiming-core.js";
import { createInteractiveRetimingLab } from "../../assets/interactive-retiming-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRetimingLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Read edge weights and total register count.</p>`,
  challenges: [
    { id: "base", title: "Sum = 2", level: "Intro", prompt: "Baseline registers = 2.", check: (_c, api) => api.getRegisters() === 2 },
    { id: "e0", title: "e0 w=1", level: "Intro", prompt: "Edge e0 has w=1 at baseline.", check: (_c, api) => api.getEdges().find(e => e.id==="e0").w === 1 },
    { id: "e1", title: "e1 w=0", level: "Practice", prompt: "e1 has w=0.", check: (_c, api) => api.getEdges().find(e => e.id==="e1").w === 0 },
    { id: "e2", title: "e2 w=1", level: "Practice", prompt: "e2 has w=1.", check: (_c, api) => api.getEdges().find(e => e.id==="e2").w === 1 },
    { id: "stats", title: "Stats regs", level: "Practice", prompt: "stats.registers = 2.", check: (_c, api) => api.getStats().registers === 2 },
    { id: "fwd-regs", title: "Forward raises", level: "Challenge", prompt: "Forward on a → 3 registers.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getRegisters() === GOLDENS.forwardARegisters },
    { id: "reset", title: "Reset to 2", level: "Practice", prompt: "Zero r restores 2.",
      check: (_c, api) => { api.forwardA(); api.resetR(); return api.getRegisters() === 2; } },
    { id: "golden", title: "GOLDENS", level: "Intro", prompt: "GOLDENS.baseRegisters is 2.", check: () => GOLDENS.baseRegisters === 2 },
  ],
});
