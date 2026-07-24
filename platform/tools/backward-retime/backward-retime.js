import { GOLDENS, PERIOD_TARGET } from "../../assets/retiming-core.js";
import { createInteractiveRetimingLab } from "../../assets/interactive-retiming-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRetimingLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Try backward retiming on c and see the illegal edge.</p>`,
  challenges: [
    { id: "run", title: "Backward on c", level: "Intro", prompt: "Click Backward on c.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => api.getR().c === 1 },
    { id: "illegal", title: "Illegal", level: "Intro", prompt: "Backward on c alone is illegal.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => !api.isLegal() },
    { id: "e3", title: "e3 negative", level: "Practice", prompt: "e3.w becomes −1.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => api.getEdges().find(e=>e.id==="e3").w === -1 },
    { id: "period", title: "P reported", level: "Practice", prompt: "Period still computes (toy).",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => Number.isFinite(api.getPeriod()) },
    { id: "mode", title: "Mode", level: "Practice", prompt: "Mode backward-c.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => api.getMode() === "backward-c" },
    { id: "reset-legal", title: "Reset legal", level: "Practice", prompt: "Zero r is legal again.",
      check: (_c, api) => { api.backwardC(); api.resetR(); return api.isLegal(); } },
    { id: "sel", title: "Selected c", level: "Practice", prompt: "Selected is c.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => api.getSelected() === "c" },
    { id: "contrast", title: "Forward ok", level: "Challenge", prompt: "Forward a is legal (contrast).",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() },
  ],
});
