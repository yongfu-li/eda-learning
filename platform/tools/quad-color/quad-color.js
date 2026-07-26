import { GOLDENS } from "../../assets/multi-patterning-core.js";
import { createInteractiveMpLab } from "../../assets/interactive-multi-patterning-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMpLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Quad greedy; confirm colors_used=3.</p>`,
  challenges: [
    { id: "run", title: "Quad", level: "Intro", prompt: "Click Quad.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getMode() === "quad" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getLast().ok === true },
    { id: "used", title: "Used 3", level: "Practice", prompt: "colorsUsed 3.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getLast().colorsUsed === GOLDENS.qpColorsUsed },
    { id: "k", title: "k 4", level: "Practice", prompt: "k is 4.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getLast().k === 4 },
    { id: "masks", title: "Masks 4", level: "Practice", prompt: "masks 4.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getLast().masks === 4 },
    { id: "method", title: "Greedy", level: "Practice", prompt: "method greedy.",
      setup: (_c, api) => api.quad(), check: (_c, api) => api.getLast().method === "greedy" },
    { id: "sel", title: "Select F", level: "Practice", prompt: "Select F.", check: (_c, api) => { api.setSelected("F"); return api.getSelected()==="F"; } },
    { id: "golden", title: "qpColorsUsed", level: "Challenge", prompt: "qpColorsUsed=3.", check: () => GOLDENS.qpColorsUsed === 3 },
  ],
});
