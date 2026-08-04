import { GOLDENS } from "../../assets/pex-core.js";
import { createInteractivePexLab } from "../../assets/interactive-pex-lab.js";
const root = document.getElementById("lab-root");

createInteractivePexLab(root, {
  defaultMode: "annotate",
  starterHtml: `<p><strong>Your job:</strong> Annotate net n1; select n1; confirm r_total and c_total goldens.</p>`,
  challenges: [
    { id: "run", title: "Annotate", level: "Intro", prompt: "Click Annotate.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getMode() === "annotate" },
    { id: "n1", title: "Net n1", level: "Intro", prompt: "net n1.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getLast().net === "n1" },
    { id: "c1", title: "One ann", level: "Practice", prompt: "count 1.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getLast().count === 1 },
    { id: "rt", title: "R total", level: "Practice", prompt: "rTotal 3.06.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getLast().rTotal === GOLDENS.rTotal },
    { id: "ct", title: "C total", level: "Practice", prompt: "cTotal 1.376.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getLast().cTotal === GOLDENS.cTotal },
    { id: "sel", title: "Select n1", level: "Practice", prompt: "Click n1.",
      setup: (_c, api) => { api.runAnnotate(); api.select("n1"); }, check: (_c, api) => api.getSelected().includes("n1") },
    { id: "ports", title: "Ports", level: "Practice", prompt: "annotations include in/out ports.",
      setup: (_c, api) => api.runAnnotate(), check: (_c, api) => api.getLast().annotations[0].ports.includes("in") },
    { id: "golden", title: "net n1", level: "Challenge", prompt: "net n1 annotated.", check: (_c, api) => api.runAnnotate().net === "n1" },
  ],
});
