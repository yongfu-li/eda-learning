import { GOLDENS } from "../../assets/erc-core.js";
import { createInteractiveErcLab } from "../../assets/interactive-erc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveErcLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Find float_n; select it and confirm count=1.</p>`,
  challenges: [
    { id: "run", title: "Floating", level: "Intro", prompt: "Click Floating.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => api.getMode() === "floating" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "floating count 1.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => api.getLast().count === GOLDENS.floatingCount },
    { id: "net", title: "float_n", level: "Practice", prompt: "nets include float_n.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => api.getLast().nets.includes("float_n") },
    { id: "sel", title: "Select float_n", level: "Practice", prompt: "Click float_n.",
      setup: (_c, api) => api.selectNet("float_n"), check: (_c, api) => api.getSelected().includes("float_n") },
    { id: "notz", title: "Not z", level: "Practice", prompt: "z is not floating.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => !api.getLast().nets.includes("z") },
    { id: "mk", title: "Marker", level: "Practice", prompt: "markers length 1.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => api.getMarkers().length === 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode floating.",
      setup: (_c, api) => api.checkFloating(), check: (_c, api) => api.getMode()==="floating" },
    { id: "golden", title: "floatingCount", level: "Challenge", prompt: "floatingCount=1.", check: () => GOLDENS.floatingCount === 1 },
  ],
});
