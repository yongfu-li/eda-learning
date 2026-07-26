import { GOLDENS } from "../../assets/spice-core.js";
import { createInteractiveSpiceLab } from "../../assets/interactive-spice-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSpiceLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run engine; confirm ok and dcV2=3.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "dc", title: "dcV2=3", level: "Practice", prompt: "dcV2 is 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => Math.abs(api.getLast().dcV2 - 3) < 1e-9 },
    { id: "nr", title: "NR conv", level: "Practice", prompt: "nrConverged.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().nrConverged === true },
    { id: "diode", title: "Diode ok", level: "Practice", prompt: "diode converged.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().diode.converged === true },
    { id: "tran", title: "TRAN", level: "Practice", prompt: "tranFinalV2 > 2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().tranFinalV2 > 2 },
    { id: "sz", title: "MNA 3", level: "Practice", prompt: "mnaSize 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().mnaSize === 3 },
    { id: "golden", title: "v2Dc", level: "Challenge", prompt: "v2Dc=3.", check: () => GOLDENS.v2Dc === 3 },
  ],
});
