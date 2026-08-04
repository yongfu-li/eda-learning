import { INTERNALS_GOLDENS, partDEngine } from "../../assets/opensta-internals-core.js";
import { createInteractiveOpenstaInternalsLab } from "../../assets/interactive-opensta-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveOpenstaInternalsLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Read find_path / report. Use the stage buttons, then Check.</p>`,
  defaultMode: "find_path",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open the find_path stage.",
      setup: (_c, api) => api.showMode("find_path"), check: (_c, api) => api.getMode() === "find_path" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.showMode("find_path"), check: (_c, api) => api.getLast()?.ok === true },
    { id: "engine", title: "Engine", level: "Practice", prompt: "Part D engine ok.",
      setup: (_c, api) => api.runEngine(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "select", title: "Select step", level: "Practice", prompt: "Select a highlighted step.",
      setup: (_c, api) => { api.showMode("find_path"); const h = api.getHighlight(); if (h[0]) api.select(h[0]); },
      check: (_c, api) => api.getSelected().length >= 1 },
    { id: "pillars", title: "Goldens exist", level: "Practice", prompt: "INTERNALS_GOLDENS present.",
      check: () => INTERNALS_GOLDENS.pillars === 4 },
    { id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is find_path.",
      setup: (_c, api) => api.showMode("find_path"), check: (_c, api) => api.getMode() === "find_path" },
    { id: "note", title: "Has note", level: "Challenge", prompt: "last has note string.",
      setup: (_c, api) => api.showMode("find_path"), check: (_c, api) => typeof api.getLast()?.note === "string" },
    { id: "golden", title: "Engine golden", level: "Challenge", prompt: "partDEngine ok.",
      check: () => partDEngine().ok === true },
  ],
});
