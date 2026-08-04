import { GOLDENS, openstaEngine } from "../../assets/opensta-core.js";
import { createInteractiveOpenstaLab } from "../../assets/interactive-opensta-lab.js";
const root = document.getElementById("lab-root");

createInteractiveOpenstaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> OpenSTA engine (map). Use stage buttons, then Check.</p>`,
  defaultMode: "engine",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open the engine stage.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "cells", title: "Cells golden", level: "Practice", prompt: "cellCount=3.",
      check: () => GOLDENS.cellCount === 3 },
    { id: "select", title: "Select node", level: "Practice", prompt: "Select a highlighted node.",
      setup: (_c, api) => { api.showEngine(); const h = api.getHighlight(); if (h[0]) api.select(h[0]); },
      check: (_c, api) => api.getSelected().length >= 1 },
    { id: "delay", title: "Path delay", level: "Practice", prompt: "pathDelay=2.",
      check: () => GOLDENS.pathDelay === 2 },
    { id: "slack", title: "Slack golden", level: "Challenge", prompt: "slack=8.",
      check: () => GOLDENS.slackAtPeriod10 === 8 },
    { id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is engine.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true || openstaEngine().ok },
  ],
});
