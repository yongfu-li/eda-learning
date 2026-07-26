import { GOLDENS } from "../../assets/signoff-core.js";
import { createInteractiveSignoffLab } from "../../assets/interactive-signoff-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSignoffLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run checks; fail_count=2 (sta, antenna).</p>`,
  challenges: [
    { id: "run", title: "Checks", level: "Intro", prompt: "Click Checks.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getMode() === "checks" },
    { id: "f2", title: "fail 2", level: "Intro", prompt: "fail count 2.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getLast().failCount === GOLDENS.failCount },
    { id: "p4", title: "pass 4", level: "Practice", prompt: "pass count 4.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getLast().passCount === GOLDENS.passCount },
    { id: "sta", title: "STA fail", level: "Practice", prompt: "STA fails.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getLast().fails.some(c => c.id === "sta") },
    { id: "ant", title: "antenna fail", level: "Practice", prompt: "antenna fails.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getLast().fails.some(c => c.id === "antenna") },
    { id: "sel", title: "Select antenna", level: "Practice", prompt: "Select antenna check.",
      setup: (_c, api) => api.selectCheck("antenna"), check: (_c, api) => api.getSelected().includes("antenna") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode checks.",
      setup: (_c, api) => api.showChecks(), check: (_c, api) => api.getMode()==="checks" },
    { id: "golden", title: "failCount", level: "Challenge", prompt: "failCount=2.", check: () => GOLDENS.failCount === 2 },
  ],
});
