import { GOLDENS } from "../../assets/power-core.js";
import { createInteractivePowerLab } from "../../assets/interactive-power-lab.js";
const root = document.getElementById("lab-root");

createInteractivePowerLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run engine; confirm ok and markers=4.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "m4", title: "Markers 4", level: "Practice", prompt: "markers 4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().markers.count === 4 },
    { id: "ptot", title: "Ptot", level: "Practice", prompt: "chip Ptot 5.55.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().total.total === GOLDENS.chipPtot },
    { id: "ir", title: "IR drop", level: "Practice", prompt: "ir_drop_sink 0.4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ir.ir.irDropSink === GOLDENS.irDropSink },
    { id: "em", title: "EM 3", level: "Practice", prompt: "EM violations 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().em.count === 3 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode()==="engine" },
    { id: "golden", title: "engineOk", level: "Challenge", prompt: "engineOk=true.", check: () => GOLDENS.engineOk === true },
  ],
});
