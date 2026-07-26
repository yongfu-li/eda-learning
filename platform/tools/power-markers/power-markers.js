import { GOLDENS } from "../../assets/power-core.js";
import { createInteractivePowerLab } from "../../assets/interactive-power-lab.js";
const root = document.getElementById("lab-root");

createInteractivePowerLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Collect IR + EM markers; count=4.</p>`,
  challenges: [
    { id: "run", title: "Markers", level: "Intro", prompt: "Click Markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode() === "markers" },
    { id: "c4", title: "Count 4", level: "Intro", prompt: "marker count 4.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().count === GOLDENS.markerCount },
    { id: "ir", title: "IR marker", level: "Practice", prompt: "one ir_drop marker.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.filter(m=>m.kind==="ir_drop").length === 1 },
    { id: "em", title: "EM markers", level: "Practice", prompt: "three em markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.filter(m=>m.kind==="em").length === 3 },
    { id: "sink", title: "sink IR", level: "Practice", prompt: "IR on sink.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getLast().markers.some(m=>m.kind==="ir_drop" && m.node==="sink") },
    { id: "sel", title: "Select n1", level: "Practice", prompt: "Select n1.",
      setup: (_c, api) => api.selectNet("n1"), check: (_c, api) => api.getSelected().includes("n1") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode markers.",
      setup: (_c, api) => api.collect(), check: (_c, api) => api.getMode()==="markers" },
    { id: "golden", title: "markerCount", level: "Challenge", prompt: "markerCount=4.", check: () => GOLDENS.markerCount === 4 },
  ],
});
