import { GOLDENS, PERIOD_TARGET } from "../../assets/retiming-core.js";
import { createInteractiveRetimingLab } from "../../assets/interactive-retiming-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRetimingLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Trade flip-flop count for a better period.</p>`,
  challenges: [
    { id: "base2", title: "Baseline 2", level: "Intro", prompt: "Start with 2 registers.", check: (_c, api) => api.getRegisters() === 2 },
    { id: "trade", title: "Buy timing", level: "Intro", prompt: "Forward a → 3 regs, P=5.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getRegisters() === 3 && api.getPeriod() === 5 },
    { id: "cost", title: "+1 FF", level: "Practice", prompt: "One extra register vs baseline.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getRegisters() - api.getBaselineRegisters() === 1 },
    { id: "min", title: "Min period cost", level: "Practice", prompt: "Min period also costs 3 regs.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.getRegisters() === 3 },
    { id: "e-labels", title: "e1 has FF", level: "Practice", prompt: "After forward a, e1.w=1.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getEdges().find(e=>e.id==="e1").w === 1 },
    { id: "cheap-slow", title: "Cheap is slow", level: "Practice", prompt: "2 regs ⇒ P=8.",
      check: (_c, api) => api.getRegisters() === 2 && api.getPeriod() === 8 },
    { id: "reset", title: "Reset cheap", level: "Practice", prompt: "Reset restores 2 regs.",
      check: (_c, api) => { api.forwardA(); api.resetR(); return api.getRegisters() === 2; } },
    { id: "golden", title: "forwardARegisters", level: "Challenge", prompt: "GOLDENS.forwardARegisters=3.", check: () => GOLDENS.forwardARegisters === 3 },
  ],
});
