import { GOLDENS } from "../../assets/spice-core.js";
import { createInteractiveSpiceLab } from "../../assets/interactive-spice-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSpiceLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Diode callback + 1-D NR converges.</p>`,
  challenges: [
    { id: "run", title: "Diode NR", level: "Intro", prompt: "Click Diode NR.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => api.getMode() === "diode" },
    { id: "conv", title: "Converged", level: "Intro", prompt: "loop converged.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => api.getLast().loop.converged === GOLDENS.diodeNrConverged },
    { id: "cb", title: "cb at 0", level: "Practice", prompt: "i≈0 at v=0.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => Math.abs(api.getLast().cb.i) < 1e-14 },
    { id: "g", title: "Has g", level: "Practice", prompt: "g defined.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => api.getLast().cb.g > 0 },
    { id: "iters", title: "iters≥1", level: "Practice", prompt: "iters >= 1.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => api.getLast().loop.iters >= 1 },
    { id: "vd", title: "vd set", level: "Practice", prompt: "vd number.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => typeof api.getLast().loop.vd === "number" },
    { id: "mode", title: "Mode diode", level: "Practice", prompt: "mode diode.",
      setup: (_c, api) => api.diodeCb(), check: (_c, api) => api.getMode()==="diode" },
    { id: "golden", title: "diodeNrConverged", level: "Challenge", prompt: "diodeNrConverged true.", check: () => GOLDENS.diodeNrConverged === true },
  ],
});
