import { REAL_GOLDENS, realEngine, recipePrefixOk, GOLDEN_RECIPE_IDS } from "../../assets/real-opensta-core.js";
import { createInteractiveRealOpenstaLab } from "../../assets/interactive-real-opensta-lab.js";
const root = document.getElementById("lab-root");

createInteractiveRealOpenstaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Liberty vocabulary. Build the recipe or open stages, then Check.</p>`,
  defaultStage: "read_link",
  challenges: [
    { id: "stage", title: "Open stage", level: "Intro", prompt: "Show the read_link stage.",
      setup: (_c, api) => api.showStage("read_link"), check: (_c, api) => api.getStage()?.id === "read_link" || api.getMode() === "read_link" },
    { id: "cells", title: "Cells 3", level: "Intro", prompt: "afterReadCells=3.",
      check: () => REAL_GOLDENS.afterReadCells === 3 },
    { id: "prefix", title: "Recipe prefix", level: "Practice", prompt: "Load golden recipe; prefix ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.checkPrefix(3) },
    { id: "slack", title: "Slack golden", level: "Practice", prompt: "slack=8.",
      check: () => REAL_GOLDENS.slack === 8 },
    { id: "delay", title: "Delay golden", level: "Practice", prompt: "pathDelay=2.",
      check: () => REAL_GOLDENS.pathDelay === 2 },
    { id: "select", title: "Select cell", level: "Challenge", prompt: "Select a cell.",
      setup: (_c, api) => { api.showStage("read_link"); api.select("u1"); },
      check: (_c, api) => api.getSelected().includes("u1") },
    { id: "endpoint", title: "Endpoint", level: "Challenge", prompt: "endpoint y.",
      check: () => REAL_GOLDENS.endpoint === "y" },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.loadGoldenRecipe(), check: (_c, api) => api.engine().ok === true || realEngine(GOLDEN_RECIPE_IDS).ok },
  ],
});
