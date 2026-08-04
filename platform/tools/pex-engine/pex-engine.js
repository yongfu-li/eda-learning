import { GOLDENS } from "../../assets/pex-core.js";
import { createInteractivePexLab } from "../../assets/interactive-pex-lab.js";
const root = document.getElementById("lab-root");

createInteractivePexLab(root, {
  defaultMode: "engine",
  starterHtml: `<p><strong>Your job:</strong> Run engine; select s1; confirm ok=True.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "geo", title: "Geometry", level: "Practice", prompt: "segmentCount 4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().geometry.segmentCount === GOLDENS.segmentCount },
    { id: "rt", title: "R total", level: "Practice", prompt: "resistance rTotal 3.06.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().resistance.rTotal === GOLDENS.rTotal },
    { id: "ct", title: "C total", level: "Practice", prompt: "capacitance cTotal 1.376.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().capacitance.cTotal === GOLDENS.cTotal },
    { id: "red", title: "Reduce", level: "Practice", prompt: "reduced afterNodes 2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().reduced.afterNodes === GOLDENS.nodesAfter },
    { id: "s1", title: "Select s1", level: "Practice", prompt: "Click s1.",
      setup: (_c, api) => { api.engine(); api.select("s1"); }, check: (_c, api) => api.getSelected().includes("s1") },
    { id: "golden", title: "ok", level: "Challenge", prompt: "ok=true.", check: (_c, api) => api.engine().ok === true },
  ],
});
