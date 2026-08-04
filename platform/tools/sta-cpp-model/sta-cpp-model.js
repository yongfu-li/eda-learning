import { INTERNALS_GOLDENS, partDEngine } from "../../assets/opensta-internals-core.js";
import { createInteractiveOpenstaInternalsLab } from "../../assets/interactive-opensta-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveOpenstaInternalsLab(root, {
  starterHtml: `<p><strong>Your job:</strong> STA C++ model. Use the stage buttons, then Check.</p>`,
  defaultMode: "sta",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open the sta stage.",
      setup: (_c, api) => api.showMode("sta"), check: (_c, api) => api.getMode() === "sta" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.showMode("sta"), check: (_c, api) => api.getLast()?.ok === true },
    { id: "engine", title: "Engine", level: "Practice", prompt: "Part D engine ok.",
      setup: (_c, api) => api.runEngine(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "select", title: "Select step", level: "Practice", prompt: "Select a highlighted step.",
      setup: (_c, api) => { api.showMode("sta"); const h = api.getHighlight(); if (h[0]) api.select(h[0]); },
      check: (_c, api) => api.getSelected().length >= 1 },
    { id: "pillars", title: "Goldens exist", level: "Practice", prompt: "INTERNALS_GOLDENS present.",
      check: () => INTERNALS_GOLDENS.pillars === 4 },
    { id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is sta.",
      setup: (_c, api) => api.showMode("sta"), check: (_c, api) => api.getMode() === "sta" },
    { id: "note", title: "Has note", level: "Challenge", prompt: "last has note string.",
      setup: (_c, api) => api.showMode("sta"), check: (_c, api) => typeof api.getLast()?.note === "string" },
    { id: "golden", title: "Engine golden", level: "Challenge", prompt: "partDEngine ok.",
      check: () => partDEngine().ok === true },
  ],
});
