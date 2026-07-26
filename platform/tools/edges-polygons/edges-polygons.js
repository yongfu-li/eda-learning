import { GOLDENS } from "../../assets/pattern-matching-core.js";
import { createInteractivePatternLab } from "../../assets/interactive-pattern-lab.js";
const root = document.getElementById("lab-root");

createInteractivePatternLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Inspect shapes and edge counts.</p>`,
  challenges: [
    { id: "n5", title: "Five shapes", level: "Intro", prompt: "shapeCount is 5.", check: (_c, api) => api.getStats().shapeCount === GOLDENS.shapeCount },
    { id: "e20", title: "Edges 20", level: "Intro", prompt: "edgeCount is 20.", check: (_c, api) => api.getStats().edgeCount === GOLDENS.edgeCount },
    { id: "layers", title: "3 layers", level: "Practice", prompt: "layerCount is 3.", check: (_c, api) => api.getStats().layerCount === GOLDENS.layerCount },
    { id: "m1", title: "3 on M1", level: "Practice", prompt: "m1ShapeCount is 3.", check: (_c, api) => api.getStats().m1ShapeCount === GOLDENS.m1ShapeCount },
    { id: "sel-a", title: "Select A", level: "Practice", prompt: "Select A.", check: (_c, api) => api.getSelected() === "A" },
    { id: "has-v", title: "Has via V", level: "Practice", prompt: "Shapes include V.", check: (_c, api) => api.getShapes().some(s => s.id==="V") },
    { id: "has-d", title: "Has thin D", level: "Practice", prompt: "D present.", check: (_c, api) => api.getShapes().some(s => s.id==="D") },
    { id: "golden", title: "GOLDENS", level: "Challenge", prompt: "shapeCount golden 5.", check: () => GOLDENS.shapeCount === 5 },
  ],
});
