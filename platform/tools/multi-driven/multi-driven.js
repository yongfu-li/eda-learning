import { GOLDENS } from "../../assets/erc-core.js";
import { createInteractiveErcLab } from "../../assets/interactive-erc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveErcLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Select z; confirm multi-driven count=1.</p>`,
  challenges: [
    { id: "run", title: "Multi", level: "Intro", prompt: "Click Multi.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => api.getMode() === "multi" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "multi count 1.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => api.getLast().count === GOLDENS.multiDrivenCount },
    { id: "z", title: "Net z", level: "Practice", prompt: "nets include z.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => api.getLast().nets.includes("z") },
    { id: "sel", title: "Select z", level: "Practice", prompt: "Select z.",
      setup: (_c, api) => api.selectNet("z"), check: (_c, api) => api.getSelected().includes("z") },
    { id: "drv", title: "Two drivers", level: "Practice", prompt: "z detail length 2.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => api.getLast().detail.z.length === 2 },
    { id: "noty", title: "Not y", level: "Practice", prompt: "y not multi.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => !api.getLast().nets.includes("y") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode multi.",
      setup: (_c, api) => api.checkMulti(), check: (_c, api) => api.getMode()==="multi" },
    { id: "golden", title: "multiDrivenCount", level: "Challenge", prompt: "multiDrivenCount=1.", check: () => GOLDENS.multiDrivenCount === 1 },
  ],
});
