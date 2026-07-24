import { GOLDENS, LIBRARY, AIG_NODES } from "../../assets/synthesis-core.js";
import { createInteractiveSynthesisLab } from "../../assets/interactive-synthesis-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSynthesisLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Count rewrite opportunities.</p>`,
  challenges: [
    { id: "count", title: "Opportunities ≥1", level: "Intro", prompt: "Rewrite count ≥1.", check: (_c, api) => api.rewriteCount().count >= 1 },
    { id: "push", title: "Inverter push", level: "Practice", prompt: "inverterPush returns applied.", check: (_c, api) => typeof api.inverterPush().applied === "number" },
    { id: "fn", title: "f preserved 101", level: "Practice", prompt: "f(1,0,1)=1.",
      setup: (_c, api) => api.setAssignment({a:1,b:0,c:1}), check: (_c, api) => api.output() === 1 },
    { id: "nodes", title: "Has node list", level: "Practice", prompt: "rewrite nodes array.", check: (_c, api) => Array.isArray(api.rewriteCount().nodes) },
    { id: "and", title: "AND=4", level: "Intro", prompt: "Still 4 ANDs.", check: (_c, api) => api.getStats().and === 4 },
    { id: "sel", title: "Select 5", level: "Practice", prompt: "Select 5.", check: (_c, api) => { api.setSelected(5); return api.getSelected()===5; } },
    { id: "push2", title: "Push list", level: "Practice", prompt: "rewrites is array.", check: (_c, api) => Array.isArray(api.inverterPush().rewrites) },
    { id: "golden", title: "fAt111", level: "Challenge", prompt: "111→0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:1}), check: (_c, api) => api.output() === 0 },
  ],
});
