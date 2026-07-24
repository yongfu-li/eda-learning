import { GOLDENS, PERIOD_TARGET } from "../../assets/retiming-core.js";
import { createInteractiveRetimingLab } from "../../assets/interactive-retiming-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRetimingLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Measure longest zero-weight combinational path delay.</p>`,
  challenges: [
    { id: "base8", title: "P=8 baseline", level: "Intro", prompt: "Baseline period is 8.", check: (_c, api) => api.getBaselinePeriod() === 8 },
    { id: "curr8", title: "Current P=8", level: "Intro", prompt: "With zero r, period is 8.", check: (_c, api) => api.getPeriod() === 8 },
    { id: "target", title: "Target 5", level: "Intro", prompt: "Period target is 5.", check: (_c, api) => api.getTarget() === PERIOD_TARGET },
    { id: "fwd5", title: "Forward → 5", level: "Practice", prompt: "Forward on a makes P=5.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getPeriod() === 5 },
    { id: "legal", title: "Still legal", level: "Practice", prompt: "Forward a stays legal.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() },
    { id: "reset", title: "Reset period", level: "Practice", prompt: "Reset returns P=8.",
      check: (_c, api) => { api.forwardA(); api.resetR(); return api.getPeriod() === 8; } },
    { id: "golden", title: "GOLDENS.baseline", level: "Intro", prompt: "baselinePeriod=8.", check: () => GOLDENS.baselinePeriod === 8 },
    { id: "improve", title: "Improved", level: "Challenge", prompt: "After forward a, P < baseline.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getPeriod() < api.getBaselinePeriod() },
  ],
});
