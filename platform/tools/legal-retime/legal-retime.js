import { GOLDENS, PERIOD_TARGET } from "../../assets/retiming-core.js";
import { createInteractiveRetimingLab } from "../../assets/interactive-retiming-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRetimingLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Distinguish legal vs illegal retimings.</p>`,
  challenges: [
    { id: "zero", title: "Zero legal", level: "Intro", prompt: "r≡0 is legal.", check: (_c, api) => api.isLegal() },
    { id: "fwd", title: "Forward legal", level: "Intro", prompt: "Forward a is legal.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() },
    { id: "bwd", title: "Backward illegal", level: "Practice", prompt: "Backward c is illegal.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => !api.isLegal() },
    { id: "neg", title: "Has negative w", level: "Practice", prompt: "Some edge w < 0 after backward c.",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => api.getEdges().some(e => e.w < 0) },
    { id: "all-nonneg", title: "All ≥0 forward", level: "Practice", prompt: "All edges ≥0 after forward a.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getEdges().every(e => e.w >= 0) },
    { id: "reset", title: "Reset", level: "Practice", prompt: "Reset restores legality.",
      check: (_c, api) => { api.backwardC(); api.resetR(); return api.isLegal(); } },
    { id: "period-gate", title: "Legal before trust", level: "Challenge", prompt: "Only trust P when legal: forward a.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() && api.getPeriod() === 5 },
    { id: "golden", title: "Target", level: "Intro", prompt: "Target period 5.", check: () => PERIOD_TARGET === 5 },
  ],
});
