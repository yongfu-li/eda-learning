import { GOLDENS } from "../../assets/pex-core.js";
import { createInteractivePexLab } from "../../assets/interactive-pex-lab.js";
const root = document.getElementById("lab-root");

createInteractivePexLab(root, {
  defaultMode: "capacitance",
  starterHtml: `<p><strong>Your job:</strong> Extract ground C; select s1 and confirm C_total=1.376, 3 caps.</p>`,
  challenges: [
    { id: "run", title: "Capacitance", level: "Intro", prompt: "Click Capacitance.",
      setup: (_c, api) => api.runCapacitance(), check: (_c, api) => api.getMode() === "capacitance" },
    { id: "ct", title: "C total", level: "Intro", prompt: "cTotal 1.376.",
      setup: (_c, api) => api.runCapacitance(), check: (_c, api) => api.getLast().cTotal === GOLDENS.cTotal },
    { id: "c3", title: "Three caps", level: "Practice", prompt: "count 3.",
      setup: (_c, api) => api.runCapacitance(), check: (_c, api) => api.getLast().count === GOLDENS.cGndCount },
    { id: "s1", title: "Select s1", level: "Practice", prompt: "Click s1.",
      setup: (_c, api) => { api.runCapacitance(); api.select("s1"); }, check: (_c, api) => api.getSelected().includes("s1") },
    { id: "s2", title: "Select s2", level: "Practice", prompt: "Click s2.",
      setup: (_c, api) => { api.runCapacitance(); api.select("s2"); }, check: (_c, api) => api.getSelected().includes("s2") },
    { id: "s3", title: "Select s3", level: "Practice", prompt: "Click s3.",
      setup: (_c, api) => { api.runCapacitance(); api.select("s3"); }, check: (_c, api) => api.getSelected().includes("s3") },
    { id: "skip", title: "No VIA C", level: "Practice", prompt: "No capacitor on v1.",
      setup: (_c, api) => api.runCapacitance(), check: (_c, api) => !api.getLast().capacitors.some(c => c.segment === "v1") },
    { id: "golden", title: "cTotal", level: "Challenge", prompt: "cTotal=1.376.", check: () => GOLDENS.cTotal === 1.376 },
  ],
});
