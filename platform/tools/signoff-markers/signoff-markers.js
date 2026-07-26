import { GOLDENS } from "../../assets/signoff-core.js";
import { createInteractiveSignoffLab } from "../../assets/interactive-signoff-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSignoffLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Collect fail markers; marker_count=2.</p>`,
  challenges: [
    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getMode() === "markers" },
    { id: "c2", title: "Count 2", level: "Intro", prompt: "marker count 2.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().count === GOLDENS.markerCount },
    { id: "sta", title: "STA marker", level: "Practice", prompt: "STA marker present.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().markers.some(m => m.check === "sta") },
    { id: "ant", title: "antenna marker", level: "Practice", prompt: "antenna marker present.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().markers.some(m => m.check === "antenna") },
    { id: "kind", title: "check_fail", level: "Practice", prompt: "kind check_fail.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getLast().markers.every(m => m.kind === "check_fail") },
    { id: "sel", title: "Select sta", level: "Practice", prompt: "Select sta check.",
      setup: (_c, api) => api.selectCheck("sta"), check: (_c, api) => api.getSelected().includes("sta") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode markers.",
      setup: (_c, api) => api.showMarkers(), check: (_c, api) => api.getMode()==="markers" },
    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=2.", check: () => GOLDENS.markerCount === 2 },
  ],
});
