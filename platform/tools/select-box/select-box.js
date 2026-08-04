import { GOLDENS, magicEngine } from "../../assets/magic-core.js";
import { createInteractiveMagicLab } from "../../assets/interactive-magic-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMagicLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Select box. Use stage buttons, then Check.</p>`,
  defaultMode: "select",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open the select stage.",
      setup: (_c, api) => api.showSelect(), check: (_c, api) => api.getMode() === "select" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.showSelect(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "rects", title: "Rects golden", level: "Practice", prompt: "rectCount=6.",
      check: () => GOLDENS.rectCount === 6 },
    { id: "select", title: "Select shape", level: "Practice", prompt: "Select a highlighted shape.",
      setup: (_c, api) => { api.showSelect(); const h = api.getHighlight(); if (h[0]) api.select(h[0]); },
      check: (_c, api) => api.getSelected().length >= 1 },
    { id: "metal1", title: "metal1 paint", level: "Practice", prompt: "paintMetal1=2.",
      check: () => GOLDENS.paintMetal1 === 2 },
    { id: "drc", title: "DRC golden", level: "Challenge", prompt: "drcErrorCount=1 on thin.",
      check: () => GOLDENS.drcErrorCount === 1 && GOLDENS.thinShape === "thin" },
    { id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is select.",
      setup: (_c, api) => api.showSelect(), check: (_c, api) => api.getMode() === "select" },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast()?.ok === true || magicEngine().ok },
  ],
});
