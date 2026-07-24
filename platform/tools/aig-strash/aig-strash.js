import { GOLDENS, LIBRARY, AIG_NODES } from "../../assets/synthesis-core.js";
import { createInteractiveSynthesisLab } from "../../assets/interactive-synthesis-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSynthesisLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Confirm strash table size.</p>`,
  challenges: [
    { id: "entries", title: "4 entries", level: "Intro", prompt: "Strash has 4 entries.", check: (_c, api) => Object.keys(api.strash()).length === GOLDENS.strashEntries },
    { id: "and", title: "Matches AND", level: "Practice", prompt: "Entries equal AND count.", check: (_c, api) => Object.keys(api.strash()).length === api.getStats().and },
    { id: "obj", title: "Object keys", level: "Practice", prompt: "Strash is object.", check: (_c, api) => typeof api.strash() === "object" },
    { id: "stats", title: "Stats ok", level: "Intro", prompt: "Stats and=4.", check: (_c, api) => api.getStats().and === 4 },
    { id: "f", title: "f still works", level: "Practice", prompt: "Output defined.", check: (_c, api) => Number.isFinite(api.output()) },
    { id: "golden", title: "Golden entries", level: "Intro", prompt: "GOLDENS.strashEntries=4.", check: () => GOLDENS.strashEntries === 4 },
    { id: "sel", title: "Select AND", level: "Practice", prompt: "Select node 4.", check: (_c, api) => { api.setSelected(4); return api.getSelected() === 4; } },
    { id: "nodes", title: "7 nodes", level: "Challenge", prompt: "Seven nodes.", check: (_c, api) => api.getNodes().length === 7 },
  ],
});
