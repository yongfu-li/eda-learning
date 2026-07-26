import { GOLDENS } from "../../assets/multi-patterning-core.js";
import { createInteractiveMpLab } from "../../assets/interactive-multi-patterning-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMpLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Triple backtrack; confirm colors_used=3.</p>`,
  challenges: [
    { id: "run", title: "Triple BT", level: "Intro", prompt: "Click Triple BT.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getMode() === "triple" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().ok === true },
    { id: "used", title: "Used 3", level: "Practice", prompt: "colorsUsed 3.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().colorsUsed === GOLDENS.tpColorsUsed },
    { id: "masks", title: "Masks 3", level: "Practice", prompt: "masks 3.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().masks === 3 },
    { id: "method", title: "Method BT", level: "Practice", prompt: "method backtrack.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().method === "backtrack" },
    { id: "ca", title: "A colored", level: "Practice", prompt: "A has color.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().colors.A != null },
    { id: "sel", title: "Select B", level: "Practice", prompt: "Select B.", check: (_c, api) => { api.setSelected("B"); return api.getSelected()==="B"; } },
    { id: "golden", title: "tpColorsUsed", level: "Challenge", prompt: "tpColorsUsed=3.", check: () => GOLDENS.tpColorsUsed === 3 },
  ],
});
