import { GOLDENS, LIBRARY, AIG_NODES } from "../../assets/synthesis-core.js";
import { createInteractiveSynthesisLab } from "../../assets/interactive-synthesis-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSynthesisLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Explore the toy AIG subject graph.</p>`,
  challenges: [
    { id: "and4", title: "Four ANDs", level: "Intro", prompt: "AIG has 4 AND nodes.", check: (_c, api) => api.getStats().and === GOLDENS.and },
    { id: "pi3", title: "Three PIs", level: "Intro", prompt: "Three PIs.", check: (_c, api) => api.getStats().pi === GOLDENS.pi },
    { id: "po", title: "One PO", level: "Intro", prompt: "One PO.", check: (_c, api) => api.getStats().po === GOLDENS.po },
    { id: "nodes7", title: "Seven nodes", level: "Practice", prompt: "Seven nodes total.", check: (_c, api) => api.getNodes().length === 7 },
    { id: "f101", title: "f at 101", level: "Practice", prompt: "Set a=1,b=0,c=1 → f=1.",
      setup: (_c, api) => api.setAssignment({a:1,b:0,c:1}),
      check: (_c, api) => api.output() === GOLDENS.fAt101 },
    { id: "f111", title: "f at 111", level: "Practice", prompt: "a=b=c=1 → f=0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:1}),
      check: (_c, api) => api.output() === GOLDENS.fAt111 },
    { id: "sel", title: "Select 7", level: "Practice", prompt: "Select node 7.", check: (_c, api) => api.getSelected() === 7 },
    { id: "toggle", title: "Toggle b", level: "Challenge", prompt: "Set b=1.", check: (_c, api) => api.getAssignment().b === 1 },
  ],
});
