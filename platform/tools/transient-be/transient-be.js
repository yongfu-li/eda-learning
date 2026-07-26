import { GOLDENS } from "../../assets/spice-core.js";
import { createInteractiveSpiceLab } from "../../assets/interactive-spice-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSpiceLab(root, {
  starterHtml: `<p><strong>Your job:</strong> TRAN BE; confirm 4 steps and final≈2.255.</p>`,
  challenges: [
    { id: "run", title: "TRAN", level: "Intro", prompt: "Click TRAN BE.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getMode() === "tran" },
    { id: "steps", title: "4 steps", level: "Intro", prompt: "history length 4.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getHistory().length === GOLDENS.tranSteps },
    { id: "fin", title: "Final≈2.255", level: "Practice", prompt: "finalV2≈2.255.",
      setup: (_c, api) => api.transient(), check: (_c, api) => Math.abs(api.getLast().finalV2 - GOLDENS.tranFinalV2) < 1e-5 },
    { id: "dt", title: "dt 0.5", level: "Practice", prompt: "dt is 0.5.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getLast().dt === GOLDENS.tranDt },
    { id: "t1", title: "t1=0.5", level: "Practice", prompt: "first t=0.5.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getHistory()[0].t === 0.5 },
    { id: "rise", title: "Rising", level: "Practice", prompt: "v2 increases.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getHistory()[3].v2 > api.getHistory()[0].v2 },
    { id: "mode", title: "Mode tran", level: "Practice", prompt: "mode tran.",
      setup: (_c, api) => api.transient(), check: (_c, api) => api.getMode()==="tran" },
    { id: "golden", title: "tranSteps", level: "Challenge", prompt: "tranSteps=4.", check: () => GOLDENS.tranSteps === 4 },
  ],
});
