import { GOLDENS } from "../../assets/lvs-core.js";
import { createInteractiveLvsLab } from "../../assets/interactive-lvs-lab.js";
const root = document.getElementById("lab-root");

createInteractiveLvsLab(root, {
  defaultMode: "compare",
  starterHtml: `<p><strong>Your job:</strong> Run compare; select net_a; confirm mismatch_count=0, matched_nets=4.</p>`,
  challenges: [
    { id: "run", title: "Compare", level: "Intro", prompt: "Click Compare.",
      setup: (_c, api) => api.runCompare(), check: (_c, api) => api.getMode() === "compare" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.runCompare(), check: (_c, api) => api.getLast().ok === true },
    { id: "mm0", title: "Zero mismatch", level: "Practice", prompt: "mismatchCount 0.",
      setup: (_c, api) => api.runCompare(), check: (_c, api) => api.getLast().mismatchCount === GOLDENS.mismatchCount },
    { id: "mn4", title: "Four nets", level: "Practice", prompt: "matchedNetCount 4.",
      setup: (_c, api) => api.runCompare(), check: (_c, api) => api.getLast().matchedNetCount === GOLDENS.matchedNets },
    { id: "sel", title: "Select net_a", level: "Practice", prompt: "Click net_a.",
      setup: (_c, api) => { api.runCompare(); api.select("net_a"); }, check: (_c, api) => api.getSelected().includes("net_a") },
    { id: "sely", title: "Select net_y", level: "Practice", prompt: "Click net_y.",
      setup: (_c, api) => { api.runCompare(); api.select("net_y"); }, check: (_c, api) => api.getSelected().includes("net_y") },
    { id: "md2", title: "Devices 2", level: "Practice", prompt: "matchedDevices 2.",
      setup: (_c, api) => api.runCompare(), check: (_c, api) => api.getLast().matchedDevices === GOLDENS.matchedDevices },
    { id: "golden", title: "mismatchCount", level: "Challenge", prompt: "mismatchCount=0.", check: () => GOLDENS.mismatchCount === 0 },
  ],
});
