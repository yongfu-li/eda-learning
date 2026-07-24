import { GOLDENS, PERIOD_TARGET } from "../../assets/retiming-core.js";
import { createInteractiveRetimingLab } from "../../assets/interactive-retiming-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRetimingLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Check feasibility: legal and period ≤ target.</p>`,
  challenges: [
    { id: "target", title: "Target 5", level: "Intro", prompt: "Target is 5.", check: (_c, api) => api.getTarget() === 5 },
    { id: "base-fail", title: "Baseline fails", level: "Intro", prompt: "Zero r is not feasible for target 5.",
      check: (_c, api) => !api.feas() },
    { id: "fwd-pass", title: "Forward passes", level: "Practice", prompt: "Forward a is feasible.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.feas() },
    { id: "bwd-fail", title: "Backward fails", level: "Practice", prompt: "Backward c fails feas (illegal).",
      setup: (_c, api) => api.backwardC(), check: (_c, api) => !api.feas() },
    { id: "legal-and", title: "Needs legal", level: "Practice", prompt: "feas requires legality.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.isLegal() && api.feas() },
    { id: "p-le", title: "P ≤ target", level: "Practice", prompt: "After forward, P ≤ 5.",
      setup: (_c, api) => api.forwardA(), check: (_c, api) => api.getPeriod() <= 5 },
    { id: "reset-fail", title: "Reset fails", level: "Practice", prompt: "After reset, feas false.",
      check: (_c, api) => { api.forwardA(); api.resetR(); return !api.feas(); } },
    { id: "golden", title: "GOLDENS.target", level: "Challenge", prompt: "periodTarget=5.", check: () => GOLDENS.periodTarget === 5 },
  ],
});
