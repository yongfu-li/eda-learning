import { INTERNALS_GOLDENS, partDEngine } from "../../assets/magic-internals-core.js";
import { createInteractiveMagicInternalsLab } from "../../assets/interactive-magic-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMagicInternalsLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Tile / Plane model. Use the stage buttons, then Check.</p>`,
  defaultMode: "tile",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open the tile stage.",
      setup: (_c, api) => api.showMode("tile"), check: (_c, api) => api.getMode() === "tile" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.showMode("tile"), check: (_c, api) => api.getLast()?.ok === true },
    { id: "engine", title: "Engine", level: "Practice", prompt: "Part D engine ok.",
      setup: (_c, api) => api.runEngine(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "select", title: "Select step", level: "Practice", prompt: "Select a highlighted step.",
      setup: (_c, api) => { api.showMode("tile"); const h = api.getHighlight(); if (h[0]) api.select(h[0]); },
      check: (_c, api) => api.getSelected().length >= 1 },
    { id: "pillars", title: "Goldens exist", level: "Practice", prompt: "INTERNALS_GOLDENS present.",
      check: () => INTERNALS_GOLDENS.pillars === 3 },
    { id: "drc", title: "DRC bind", level: "Challenge", prompt: "drcErrorCount=1.",
      check: () => INTERNALS_GOLDENS.drcErrorCount === 1 },
    { id: "note", title: "Has note", level: "Challenge", prompt: "last has note string.",
      setup: (_c, api) => api.showMode("tile"), check: (_c, api) => typeof api.getLast()?.note === "string" },
    { id: "golden", title: "Engine golden", level: "Challenge", prompt: "partDEngine ok.",
      check: () => partDEngine().ok === true },
  ],
});
