import { GOLDENS } from "../../assets/spice-core.js";
import { createInteractiveSpiceLab } from "../../assets/interactive-spice-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSpiceLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run Newton; confirm 1 iter and V2=3.</p>`,
  challenges: [
    { id: "run", title: "Newton", level: "Intro", prompt: "Click Newton.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getMode() === "nr" },
    { id: "conv", title: "Converged", level: "Intro", prompt: "converged true.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getLast().converged === true },
    { id: "it", title: "1 iter", level: "Practice", prompt: "iters is 1.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getLast().iters === GOLDENS.nrItersLinear },
    { id: "v2", title: "V2=3", level: "Practice", prompt: "v2 is 3.",
      setup: (_c, api) => api.newton(), check: (_c, api) => Math.abs(api.getLast().v2 - 3) < 1e-9 },
    { id: "volts", title: "Volts set", level: "Practice", prompt: "volts present.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getVolts() != null },
    { id: "res", title: "Residual", level: "Practice", prompt: "residuals nonempty.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getLast().residuals.length >= 1 },
    { id: "mode", title: "Mode nr", level: "Practice", prompt: "mode nr.",
      setup: (_c, api) => api.newton(), check: (_c, api) => api.getMode()==="nr" },
    { id: "golden", title: "nrItersLinear", level: "Challenge", prompt: "nrItersLinear=1.", check: () => GOLDENS.nrItersLinear === 1 },
  ],
});
