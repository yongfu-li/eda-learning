import { GOLDENS } from "../../assets/compaction-core.js";
import { createInteractiveCompactionLab } from "../../assets/interactive-compaction-lab.js";
const root = document.getElementById("lab-root");

createInteractiveCompactionLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Check min_gap legality on the toy.</p>`,
  challenges: [
    { id: "gap", title: "min_gap 1", level: "Intro", prompt: "GOLDENS.minGap is 1.", check: () => GOLDENS.minGap === 1 },
    { id: "legal", title: "Legal starter", level: "Intro", prompt: "isLegal true.", check: (_c, api) => api.isLegal() },
    { id: "reset", title: "Reset legal", level: "Practice", prompt: "After reset still legal.", check: (_c, api) => { api.reset(); return api.isLegal(); } },
    { id: "sel", title: "Select B", level: "Practice", prompt: "Select B.", check: (_c, api) => { api.setSelected("B"); return api.getSelected()==="B"; } },
    { id: "width", title: "Width 20", level: "Practice", prompt: "Width still 20 before compact.", check: (_c, api) => api.getStats().width === 20 },
    { id: "cells", title: "Cells exist", level: "Practice", prompt: "A present.", check: (_c, api) => api.getObjects().some(o=>o.id==="A") },
    { id: "ws", title: "Whitespace >0", level: "Practice", prompt: "whitespace positive.", check: (_c, api) => api.getStats().whitespace > 0 },
    { id: "golden", title: "objectCount", level: "Challenge", prompt: "objectCount=4.", check: () => GOLDENS.objectCount === 4 },
  ],
});
