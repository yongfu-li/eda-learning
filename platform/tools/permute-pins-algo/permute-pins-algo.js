import { ALGO_GOLDENS, PARTC_REAL, netgenAlgoEngine, partcBind } from "../../assets/algo-netgen-core.js";
import { createInteractiveAlgoNetgenLab } from "../../assets/interactive-algo-netgen-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoNetgenLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Permute pins algorithm. Run stages / bind, then Check.</p>`,
  defaultMode: "permute_pins",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open permute_pins.",
      setup: (_c, api) => api.showPermutePins(), check: (_c, api) => api.getMode() === "permute_pins" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.showPermutePins(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "nets", title: "Nets golden", level: "Practice", prompt: "matchedNets=4.",
      check: () => ALGO_GOLDENS.matchedNets === 4 },
    { id: "bind", title: "Bind mismatch", level: "Practice", prompt: "Bind mismatch ok.",
      setup: (_c, api) => api.showBind("mismatch"), check: (_c, api) => api.getLast()?.ok === true },
    { id: "real", title: "Real matched", level: "Practice", prompt: "PARTC_REAL.matchedDevices=2.",
      check: () => PARTC_REAL.matchedDevices === 2 },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true || netgenAlgoEngine().ok },
  ],
});
