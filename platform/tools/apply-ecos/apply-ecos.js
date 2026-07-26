import { GOLDENS } from "../../assets/signoff-core.js";
import { createInteractiveSignoffLab } from "../../assets/interactive-signoff-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSignoffLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Apply ECOs; fail_count→0.</p>`,
  challenges: [
    { id: "run", title: "ApplyECO", level: "Intro", prompt: "Click ApplyECO.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getMode() === "apply_eco" },
    { id: "f0", title: "fail 0", level: "Intro", prompt: "fail count 0.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getLast().failCount === 0 },
    { id: "sta", title: "STA pass", level: "Practice", prompt: "STA passes.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getLast().checks.find(c => c.id === "sta")?.status === "pass" },
    { id: "ant", title: "antenna pass", level: "Practice", prompt: "antenna passes.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getLast().checks.find(c => c.id === "antenna")?.status === "pass" },
    { id: "drc", title: "DRC pass", level: "Practice", prompt: "DRC still pass.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getLast().checks.find(c => c.id === "drc")?.status === "pass" },
    { id: "sel", title: "Select drc", level: "Practice", prompt: "Select drc check.",
      setup: (_c, api) => api.selectCheck("drc"), check: (_c, api) => api.getSelected().includes("drc") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode apply_eco.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getMode()==="apply_eco" },
    { id: "golden", title: "failCount 0", level: "Challenge", prompt: "failCount=0 after apply.", check: (_c, api) => { api.applyEco(); return api.getLast().failCount === 0; } },
  ],
});
