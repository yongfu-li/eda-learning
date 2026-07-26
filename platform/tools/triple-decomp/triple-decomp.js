import { GOLDENS } from "../../assets/multi-patterning-core.js";
import { createInteractiveMpLab } from "../../assets/interactive-multi-patterning-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMpLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Compare greedy vs backtrack 3-color.</p>`,
  challenges: [
    { id: "g", title: "Greedy", level: "Intro", prompt: "Click Triple greedy.",
      setup: (_c, api) => api.tripleGreedy(), check: (_c, api) => api.getMode() === "triple-greedy" },
    { id: "gok", title: "Greedy ok", level: "Intro", prompt: "greedy ok.",
      setup: (_c, api) => api.tripleGreedy(), check: (_c, api) => api.getLast().ok === true },
    { id: "bt", title: "Backtrack", level: "Practice", prompt: "Triple BT ok.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().ok === true },
    { id: "used", title: "Used 3", level: "Practice", prompt: "greedy used 3.",
      setup: (_c, api) => api.tripleGreedy(), check: (_c, api) => api.getLast().colorsUsed === 3 },
    { id: "meth", title: "Method greedy", level: "Practice", prompt: "method greedy.",
      setup: (_c, api) => api.tripleGreedy(), check: (_c, api) => api.getLast().method === "greedy" },
    { id: "btm", title: "Method BT", level: "Practice", prompt: "BT method.",
      setup: (_c, api) => api.triple(), check: (_c, api) => api.getLast().method === "backtrack" },
    { id: "sel", title: "Select A", level: "Practice", prompt: "Select A.", check: (_c, api) => { api.setSelected("A"); return api.getSelected()==="A"; } },
    { id: "golden", title: "tpColorsUsed", level: "Challenge", prompt: "tpColorsUsed=3.", check: () => GOLDENS.tpColorsUsed === 3 },
  ],
});
