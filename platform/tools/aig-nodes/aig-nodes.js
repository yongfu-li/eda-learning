import { GOLDENS, LIBRARY, AIG_NODES } from "../../assets/synthesis-core.js";
import { createInteractiveSynthesisLab } from "../../assets/interactive-synthesis-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSynthesisLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Identify PI/AND/complements and evaluate.</p>`,
  challenges: [
    { id: "pi", title: "PI count", level: "Intro", prompt: "PI=3.", check: (_c, api) => api.getStats().pi === 3 },
    { id: "and", title: "AND count", level: "Intro", prompt: "AND=4.", check: (_c, api) => api.getStats().and === 4 },
    { id: "eval", title: "Eval f", level: "Practice", prompt: "f finite.", check: (_c, api) => api.output() === 0 || api.output() === 1 },
    { id: "101", title: "Golden 101", level: "Practice", prompt: "a1b0c1 → f1.",
      setup: (_c, api) => api.setAssignment({a:1,b:0,c:1}), check: (_c, api) => api.output() === 1 },
    { id: "111", title: "Golden 111", level: "Practice", prompt: "111 → f0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:1}), check: (_c, api) => api.output() === 0 },
    { id: "sel5", title: "Select 5", level: "Practice", prompt: "Select node 5.", check: (_c, api) => { api.setSelected(5); return api.getSelected() === 5; } },
    { id: "vals", title: "Eval map", level: "Practice", prompt: "eval returns node 7.", check: (_c, api) => 7 in api.eval() },
    { id: "golden", title: "Goldens", level: "Intro", prompt: "GOLDENS.and is 4.", check: () => GOLDENS.and === 4 },
  ],
});
