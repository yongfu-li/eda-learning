import { INTERNALS_GOLDENS, partDEngine } from "../../assets/netgen-internals-core.js";
import { createInteractiveNetgenInternalsLab } from "../../assets/interactive-netgen-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveNetgenInternalsLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Read compare C. Use stage buttons, then Check.</p>`,
  defaultMode: "read_compare_c",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open read_compare_c.",
      setup: (_c, api) => api.showMode("read_compare_c"), check: (_c, api) => api.getMode() === "read_compare_c" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.showMode("read_compare_c"), check: (_c, api) => api.getLast()?.ok === true },
    { id: "engine", title: "Engine", level: "Practice", prompt: "Part D engine ok.",
      setup: (_c, api) => api.runEngine(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "pillars", title: "Pillars", level: "Practice", prompt: "INTERNALS_GOLDENS.pillars=3.",
      check: () => INTERNALS_GOLDENS.pillars === 3 },
    { id: "bind", title: "Part B bind", level: "Challenge", prompt: "matchedDevices=2.",
      check: () => INTERNALS_GOLDENS.matchedDevices === 2 },
    { id: "golden", title: "Engine golden", level: "Challenge", prompt: "partDEngine ok.",
      check: () => partDEngine().ok === true },
  ],
});
