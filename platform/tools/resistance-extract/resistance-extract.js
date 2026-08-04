import { GOLDENS } from "../../assets/pex-core.js";
import { createInteractivePexLab } from "../../assets/interactive-pex-lab.js";
const root = document.getElementById("lab-root");

createInteractivePexLab(root, {
  defaultMode: "resistance",
  starterHtml: `<p><strong>Your job:</strong> Extract segment R; select s1 and confirm R_total=3.06.</p>`,
  challenges: [
    { id: "run", title: "Resistance", level: "Intro", prompt: "Click Resistance.",
      setup: (_c, api) => api.runResistance(), check: (_c, api) => api.getMode() === "resistance" },
    { id: "rt", title: "R total", level: "Intro", prompt: "rTotal 3.06.",
      setup: (_c, api) => api.runResistance(), check: (_c, api) => api.getLast().rTotal === GOLDENS.rTotal },
    { id: "c4", title: "Four R", level: "Practice", prompt: "count 4.",
      setup: (_c, api) => api.runResistance(), check: (_c, api) => api.getLast().count === GOLDENS.rCount },
    { id: "s1", title: "Select s1", level: "Practice", prompt: "Click s1.",
      setup: (_c, api) => { api.runResistance(); api.select("s1"); }, check: (_c, api) => api.getSelected().includes("s1") },
    { id: "s2", title: "Select s2", level: "Practice", prompt: "Click s2.",
      setup: (_c, api) => { api.runResistance(); api.select("s2"); }, check: (_c, api) => api.getSelected().includes("s2") },
    { id: "v1", title: "Select v1", level: "Practice", prompt: "Click v1.",
      setup: (_c, api) => { api.runResistance(); api.select("v1"); }, check: (_c, api) => api.getSelected().includes("v1") },
    { id: "rs1", title: "R s1", level: "Practice", prompt: "s1 R=0.5.",
      setup: (_c, api) => api.runResistance(), check: (_c, api) => api.getLast().resistors.find(r => r.segment === "s1").value === GOLDENS.rS1 },
    { id: "golden", title: "rTotal", level: "Challenge", prompt: "rTotal=3.06.", check: () => GOLDENS.rTotal === 3.06 },
  ],
});
