import { GOLDENS } from "../../assets/spice-core.js";
import { createInteractiveSpiceLab } from "../../assets/interactive-spice-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSpiceLab(root, {
  starterHtml: `<p><strong>Your job:</strong> DC solve; confirm V2=3.</p>`,
  challenges: [
    { id: "run", title: "DC solve", level: "Intro", prompt: "Click DC solve.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => api.getMode() === "dc" },
    { id: "v2", title: "V2=3", level: "Intro", prompt: "volts[2] is 3.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => Math.abs(api.getVolts()["2"] - GOLDENS.v2Dc) < 1e-9 },
    { id: "v1", title: "V1=5", level: "Practice", prompt: "volts[1] is 5.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => Math.abs(api.getVolts()["1"] - GOLDENS.v1Dc) < 1e-9 },
    { id: "sz", title: "Size 3", level: "Practice", prompt: "size 3.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => api.getLast().size === 3 },
    { id: "x", title: "x len 3", level: "Practice", prompt: "x length 3.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => api.getLast().x.length === 3 },
    { id: "mode", title: "Mode dc", level: "Practice", prompt: "mode dc.",
      setup: (_c, api) => api.dcSolve(), check: (_c, api) => api.getMode()==="dc" },
    { id: "reset", title: "Reset", level: "Practice", prompt: "Reset clears volts.",
      setup: (_c, api) => { api.dcSolve(); api.reset(); }, check: (_c, api) => api.getVolts() == null },
    { id: "golden", title: "v2Dc", level: "Challenge", prompt: "v2Dc=3.", check: () => GOLDENS.v2Dc === 3 },
  ],
});
