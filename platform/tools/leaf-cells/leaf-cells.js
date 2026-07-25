import { GOLDENS } from "../../assets/compaction-core.js";
import { createInteractiveCompactionLab } from "../../assets/interactive-compaction-lab.js";
const root = document.getElementById("lab-root");

createInteractiveCompactionLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Inspect leaf cells and bbox metrics.</p>`,
  challenges: [
    { id: "n4", title: "Four objects", level: "Intro", prompt: "objectCount is 4.", check: (_c, api) => api.getStats().objectCount === GOLDENS.objectCount },
    { id: "w20", title: "Width 20", level: "Intro", prompt: "Initial width is 20.", check: (_c, api) => api.getStats().width === GOLDENS.initialWidth },
    { id: "h6", title: "Height 6", level: "Practice", prompt: "Initial height is 6.", check: (_c, api) => api.getStats().height === GOLDENS.initialHeight },
    { id: "sel-a", title: "Select A", level: "Practice", prompt: "Select cell A.", check: (_c, api) => api.getSelected() === "A" },
    { id: "has-w", title: "Has wire W", level: "Practice", prompt: "Objects include W.", check: (_c, api) => api.getObjects().some(o => o.id==="W") },
    { id: "cells3", title: "Three cells", level: "Practice", prompt: "Three kind=cell.", check: (_c, api) => api.getObjects().filter(o=>o.kind==="cell").length===3 },
    { id: "legal", title: "Legal", level: "Practice", prompt: "Starter is legal.", check: (_c, api) => api.isLegal() },
    { id: "golden", title: "GOLDENS", level: "Challenge", prompt: "initialWidth golden 20.", check: () => GOLDENS.initialWidth === 20 },
  ],
});
