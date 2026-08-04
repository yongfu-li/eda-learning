import { ALGO_GOLDENS, PARTC_REAL, openstaAlgoEngine, partcBind } from "../../assets/algo-opensta-core.js";
import { createInteractiveAlgoOpenstaLab } from "../../assets/interactive-algo-opensta-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoOpenstaLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Slack algorithm. Run stages / bind, then Check.</p>`,
  defaultMode: "slack",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open slack.",
      setup: (_c, api) => api.showSlack(), check: (_c, api) => api.getMode() === "slack" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.showSlack(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "slack", title: "Slack golden", level: "Practice", prompt: "slackY=8.",
      check: () => ALGO_GOLDENS.slackY === 8 },
    { id: "bind", title: "Bind slack", level: "Practice", prompt: "Bind slack ok.",
      setup: (_c, api) => api.showBind("slack"), check: (_c, api) => api.getLast()?.ok === true },
    { id: "real", title: "Real slack", level: "Practice", prompt: "PARTC_REAL.slack=8.",
      check: () => PARTC_REAL.slack === 8 },
    { id: "select", title: "Select pin", level: "Challenge", prompt: "Select a pin.",
      setup: (_c, api) => { api.showSlack(); const h = api.getHighlight(); if (h[0]) api.select(h[0]); },
      check: (_c, api) => api.getSelected().length >= 1 },
    { id: "path", title: "Critical path", level: "Challenge", prompt: "path starts with b.",
      check: () => ALGO_GOLDENS.criticalPath[0] === "b" },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.showEngine(), check: (_c, api) => api.getLast()?.ok === true || openstaAlgoEngine().ok },
  ],
});
