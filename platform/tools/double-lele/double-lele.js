import { GOLDENS } from "../../assets/multi-patterning-core.js";
import { createInteractiveMpLab } from "../../assets/interactive-multi-patterning-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMpLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run LELE DP; confirm it fails on the toy.</p>`,
  challenges: [
    { id: "run", title: "Run LELE", level: "Intro", prompt: "Click LELE DP.",
      setup: (_c, api) => api.lele(), check: (_c, api) => api.getMode() === "lele" },
    { id: "fail", title: "DP fails", level: "Intro", prompt: "ok is false.",
      setup: (_c, api) => api.lele(), check: (_c, api) => api.getLast().ok === GOLDENS.dpColorable },
    { id: "conflict", title: "Has conflict", level: "Practice", prompt: "conflict pair set.",
      setup: (_c, api) => api.lele(), check: (_c, api) => api.getLast().conflict != null },
    { id: "edges", title: "Edges 5", level: "Practice", prompt: "edgeCount 5.",
      setup: (_c, api) => api.lele(), check: (_c, api) => api.getLast().edgeCount === 5 },
    { id: "masks", title: "Masks null", level: "Practice", prompt: "masks is null.",
      setup: (_c, api) => api.lele(), check: (_c, api) => api.getLast().masks == null },
    { id: "sel", title: "Select C", level: "Practice", prompt: "Select C.", check: (_c, api) => { api.setSelected("C"); return api.getSelected()==="C"; } },
    { id: "n6", title: "Six feats", level: "Practice", prompt: "featureCount 6.", check: (_c, api) => api.getStats().featureCount === 6 },
    { id: "golden", title: "dpColorable", level: "Challenge", prompt: "dpColorable false.", check: () => GOLDENS.dpColorable === false },
  ],
});
