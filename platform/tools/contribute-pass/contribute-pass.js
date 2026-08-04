import { INTERNALS_GOLDENS, partDEngine } from "../../assets/yosys-internals-core.js";
import { createInteractiveYosysInternalsLab } from "../../assets/interactive-yosys-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysInternalsLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Contribute a pass. Use the stage buttons, then Check.</p>`,
  defaultMode: "contribute",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open the contribute stage.",
      setup: (_c, api) => api.showMode("contribute"), check: (_c, api) => api.getMode() === "contribute" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.showMode("contribute"), check: (_c, api) => api.getLast()?.ok === true },
    { id: "engine", title: "Engine", level: "Practice", prompt: "Part D engine ok.",
      setup: (_c, api) => api.runEngine(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "select", title: "Select step", level: "Practice", prompt: "Select a highlighted step.",
      setup: (_c, api) => { api.showMode("contribute"); const h = api.getHighlight(); if (h[0]) api.select(h[0]); },
      check: (_c, api) => api.getSelected().length >= 1 },
    { id: "pillars", title: "Goldens exist", level: "Practice", prompt: "INTERNALS_GOLDENS present.",
      check: () => INTERNALS_GOLDENS.pillars === 5 },
    { id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is contribute.",
      setup: (_c, api) => api.showMode("contribute"), check: (_c, api) => api.getMode() === "contribute" },
    { id: "note", title: "Has note", level: "Challenge", prompt: "last has note string.",
      setup: (_c, api) => api.showMode("contribute"), check: (_c, api) => typeof api.getLast()?.note === "string" },
    { id: "golden", title: "Engine golden", level: "Challenge", prompt: "partDEngine ok.",
      check: () => partDEngine().ok === true },
  ],
});
