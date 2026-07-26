import { GOLDENS } from "../../assets/erc-core.js";
import { createInteractiveErcLab } from "../../assets/interactive-erc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveErcLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Collect markers; confirm count=5.</p>`,
  challenges: [
    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode() === "markers" },
    { id: "c5", title: "Count 5", level: "Intro", prompt: "marker count 5.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().count === GOLDENS.markerCount },
    { id: "kinds", title: "Has floating", level: "Practice", prompt: "has floating kind.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.some(m=>m.kind==="floating") },
    { id: "multi", title: "Has multi", level: "Practice", prompt: "has multi_driven.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.some(m=>m.kind==="multi_driven") },
    { id: "well", title: "Has well", level: "Practice", prompt: "has well_error.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.some(m=>m.kind==="well_error") },
    { id: "short", title: "Has short", level: "Practice", prompt: "has supply_short.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.some(m=>m.kind==="supply_short") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode()==="markers" },
    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=5.", check: () => GOLDENS.markerCount === 5 },
  ],
});
