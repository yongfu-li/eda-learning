import { GOLDENS } from "../../assets/multi-patterning-core.js";
import { createInteractiveMpLab } from "../../assets/interactive-multi-patterning-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMpLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run engine; confirm best_masks=3.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click MP engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "best", title: "Best 3", level: "Intro", prompt: "bestMasks 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().bestMasks === GOLDENS.engineBestMasks },
    { id: "dp", title: "DP fail", level: "Practice", prompt: "dpOk false.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().dpOk === false },
    { id: "tp", title: "TP ok", level: "Practice", prompt: "tpOk true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().tpOk === true },
    { id: "qp", title: "QP ok", level: "Practice", prompt: "qpOk true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().qpOk === true },
    { id: "tpu", title: "TP used 3", level: "Practice", prompt: "tpColorsUsed 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().tpColorsUsed === 3 },
    { id: "sadp", title: "SADP 3", level: "Practice", prompt: "sadp mandrels 3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().sadp.mandrelCount === 3 },
    { id: "golden", title: "engineBestMasks", level: "Challenge", prompt: "engineBestMasks=3.", check: () => GOLDENS.engineBestMasks === 3 },
  ],
});
