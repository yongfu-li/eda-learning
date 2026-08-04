import { GOLDENS } from "../../assets/pex-core.js";
import { createInteractivePexLab } from "../../assets/interactive-pex-lab.js";
const root = document.getElementById("lab-root");

createInteractivePexLab(root, {
  defaultMode: "spef",
  starterHtml: `<p><strong>Your job:</strong> Emit SPEF-lite; confirm 1 RES + 1 CAP.</p>`,
  challenges: [
    { id: "run", title: "SPEF", level: "Intro", prompt: "Click SPEF.",
      setup: (_c, api) => api.runSpef(), check: (_c, api) => api.getMode() === "spef" },
    { id: "r1", title: "One RES", level: "Intro", prompt: "resCount 1.",
      setup: (_c, api) => api.runSpef(), check: (_c, api) => api.getLast().resCount === GOLDENS.spefResCount },
    { id: "c1", title: "One CAP", level: "Practice", prompt: "capCount 1.",
      setup: (_c, api) => api.runSpef(), check: (_c, api) => api.getLast().capCount === GOLDENS.spefCapCount },
    { id: "req", title: "R_eq", level: "Practice", prompt: "rEq 3.06.",
      setup: (_c, api) => api.runSpef(), check: (_c, api) => api.getLast().rEq === GOLDENS.rTotal },
    { id: "ceq", title: "C_eq", level: "Practice", prompt: "cEq 1.376.",
      setup: (_c, api) => api.runSpef(), check: (_c, api) => api.getLast().cEq === GOLDENS.cTotal },
    { id: "selr", title: "Select R_eq", level: "Practice", prompt: "Click R_eq.",
      setup: (_c, api) => { api.runSpef(); api.select("R_eq"); }, check: (_c, api) => api.getSelected().includes("R_eq") },
    { id: "seln", title: "Select n1", level: "Practice", prompt: "Click n1.",
      setup: (_c, api) => { api.runSpef(); api.select("n1"); }, check: (_c, api) => api.getSelected().includes("n1") },
    { id: "golden", title: "resCount", level: "Challenge", prompt: "resCount=1.", check: () => GOLDENS.spefResCount === 1 },
  ],
});
