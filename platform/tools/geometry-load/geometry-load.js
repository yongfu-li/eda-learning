import { GOLDENS } from "../../assets/pex-core.js";
import { createInteractivePexLab } from "../../assets/interactive-pex-lab.js";
const root = document.getElementById("lab-root");

createInteractivePexLab(root, {
  defaultMode: "geometry",
  starterHtml: `<p><strong>Your job:</strong> Inspect geometry; select s1 and confirm 4 segments, 3 layers.</p>`,
  challenges: [
    { id: "run", title: "Geometry", level: "Intro", prompt: "Click Geometry.",
      setup: (_c, api) => api.showGeometry(), check: (_c, api) => api.getMode() === "geometry" },
    { id: "s4", title: "Four segments", level: "Intro", prompt: "segmentCount 4.",
      setup: (_c, api) => api.showGeometry(), check: (_c, api) => api.getLast().segmentCount === GOLDENS.segmentCount },
    { id: "l3", title: "Three layers", level: "Practice", prompt: "layerCount 3.",
      setup: (_c, api) => api.showGeometry(), check: (_c, api) => api.getLast().layerCount === GOLDENS.layerCount },
    { id: "s1", title: "Select s1", level: "Practice", prompt: "Click s1.",
      setup: (_c, api) => { api.showGeometry(); api.select("s1"); }, check: (_c, api) => api.getSelected().includes("s1") },
    { id: "s2", title: "Select s2", level: "Practice", prompt: "Click s2.",
      setup: (_c, api) => { api.showGeometry(); api.select("s2"); }, check: (_c, api) => api.getSelected().includes("s2") },
    { id: "v1", title: "Select v1", level: "Practice", prompt: "Click v1.",
      setup: (_c, api) => { api.showGeometry(); api.select("v1"); }, check: (_c, api) => api.getSelected().includes("v1") },
    { id: "s3", title: "Select s3", level: "Practice", prompt: "Click s3.",
      setup: (_c, api) => { api.showGeometry(); api.select("s3"); }, check: (_c, api) => api.getSelected().includes("s3") },
    { id: "golden", title: "segmentCount", level: "Challenge", prompt: "segmentCount=4.", check: () => GOLDENS.segmentCount === 4 },
  ],
});
