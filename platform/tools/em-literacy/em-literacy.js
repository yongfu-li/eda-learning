import { GOLDENS } from "../../assets/power-core.js";
import { createInteractivePowerLab } from "../../assets/interactive-power-lab.js";
const root = document.getElementById("lab-root");

createInteractivePowerLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Flag edges where I > em_limit; count=3.</p>`,
  challenges: [
    { id: "run", title: "EM", level: "Intro", prompt: "Click EM.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getMode() === "em" },
    { id: "c3", title: "Count 3", level: "Intro", prompt: "EM violations 3.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getLast().count === GOLDENS.emViolationCount },
    { id: "e1", title: "e1 hit", level: "Practice", prompt: "e1 violates.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getLast().hits.some(h=>h.edge==="e1") },
    { id: "e2", title: "e2 hit", level: "Practice", prompt: "e2 violates.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getLast().hits.some(h=>h.edge==="e2") },
    { id: "e3", title: "e3 hit", level: "Practice", prompt: "e3 violates.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getLast().hits.some(h=>h.edge==="e3") },
    { id: "lim", title: "limit", level: "Practice", prompt: "em_limit 0.08.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getLast().limit === GOLDENS.emLimit },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode em.",
      setup: (_c, api) => api.checkEm(), check: (_c, api) => api.getMode()==="em" },
    { id: "golden", title: "emViolationCount", level: "Challenge", prompt: "emViolationCount=3.", check: () => GOLDENS.emViolationCount === 3 },
  ],
});
