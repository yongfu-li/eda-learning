import { GOLDENS, PERIOD_TARGET } from "../../assets/retiming-core.js";
import { createInteractiveRetimingLab } from "../../assets/interactive-retiming-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRetimingLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run the lite min-period search and confirm improvement.</p>`,
  challenges: [
    { id: "run", title: "Min period", level: "Intro", prompt: "Click Min period.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.getMode() === "min-period" },
    { id: "p5", title: "Best P=5", level: "Intro", prompt: "Best period is 5.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.getPeriod() === 5 },
    { id: "improved", title: "Improved", level: "Practice", prompt: "Search reports improved.",
      check: (_c, api) => api.runMinPeriod().improved === true },
    { id: "legal", title: "Legal best", level: "Practice", prompt: "Best retiming is legal.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.isLegal() },
    { id: "regs3", title: "Regs 3", level: "Practice", prompt: "Best uses 3 registers.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.getRegisters() === 3 },
    { id: "r-a", title: "r(a)=−1", level: "Practice", prompt: "Best has r(a)=−1.",
      setup: (_c, api) => api.runMinPeriod(), check: (_c, api) => api.getR().a === -1 },
    { id: "search", title: "getSearch", level: "Practice", prompt: "getSearch has period.",
      check: (_c, api) => { api.runMinPeriod(); return api.getSearch().period === 5; } },
    { id: "seq", title: "Sequential", level: "Challenge", prompt: "sequential min_period works.",
      setup: (_c, api) => api.runSequential("min_period"), check: (_c, api) => api.getMode() === "sequential" && api.getPeriod() === 5 },
  ],
});
