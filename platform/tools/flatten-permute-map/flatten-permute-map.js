import { GOLDENS, netgenEngine } from "../../assets/netgen-core.js";
import { createInteractiveNetgenLab } from "../../assets/interactive-netgen-lab.js";
const root = document.getElementById("lab-root");

createInteractiveNetgenLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Flatten permute map. Use stage buttons, then Check.</p>`,
  defaultMode: "permute",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open the permute stage.",
      setup: (_c, api) => api.showPermute(), check: (_c, api) => api.getMode() === "permute" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.showPermute(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "dev", title: "Devices golden", level: "Practice", prompt: "matchedDevices=2.",
      check: () => GOLDENS.matchedDevices === 2 },
    { id: "nets", title: "Nets golden", level: "Practice", prompt: "matchedNets=4.",
      check: () => GOLDENS.matchedNets === 4 },
    { id: "select", title: "Select device", level: "Practice", prompt: "Select a highlighted device.",
      setup: (_c, api) => { api.showPermute(); const h = api.getHighlight(); if (h[0]) api.select(h[0]); },
      check: (_c, api) => api.getSelected().length >= 1 },
    { id: "mism", title: "Mismatch golden", level: "Challenge", prompt: "mismatchCount=0.",
      check: () => GOLDENS.mismatchCount === 0 },
    { id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is permute.",
      setup: (_c, api) => api.showPermute(), check: (_c, api) => api.getMode() === "permute" },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast()?.ok === true || netgenEngine().ok },
  ],
});
