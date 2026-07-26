import { GOLDENS } from "../../assets/spice-core.js";
import { createInteractiveSpiceLab } from "../../assets/interactive-spice-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSpiceLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run OP→TRAN pipeline.</p>`,
  challenges: [
    { id: "run", title: "Pipeline", level: "Intro", prompt: "Click OP→TRAN.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getMode() === "pipeline" },
    { id: "dc", title: "DC 3", level: "Intro", prompt: "dc v2 is 3.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => Math.abs(api.getLast().dc.volts["2"] - 3) < 1e-9 },
    { id: "tr", title: "TRAN 4", level: "Practice", prompt: "tran 4 steps.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getLast().tr.history.length === 4 },
    { id: "hist", title: "History", level: "Practice", prompt: "history set.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getHistory().length === 4 },
    { id: "volts", title: "Volts OP", level: "Practice", prompt: "volts from OP.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getVolts()["1"] === 5 },
    { id: "fin", title: "Final", level: "Practice", prompt: "tran final set.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getLast().tr.finalV2 > 2 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode pipeline.",
      setup: (_c, api) => api.pipeline(), check: (_c, api) => api.getMode()==="pipeline" },
    { id: "golden", title: "v2Dc", level: "Challenge", prompt: "v2Dc=3.", check: () => GOLDENS.v2Dc === 3 },
  ],
});
