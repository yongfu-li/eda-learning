import { GOLDENS } from "../../assets/lvs-core.js";
import { createInteractiveLvsLab } from "../../assets/interactive-lvs-lab.js";
const root = document.getElementById("lab-root");

createInteractiveLvsLab(root, {
  defaultMode: "schematic",
  starterHtml: `<p><strong>Your job:</strong> Inspect schematic graph; select mn1 and confirm 2 devices, 4 nets.</p>`,
  challenges: [
    { id: "run", title: "Schematic", level: "Intro", prompt: "Click Schematic.",
      setup: (_c, api) => api.showSchematic(), check: (_c, api) => api.getMode() === "schematic" },
    { id: "d2", title: "Two devices", level: "Intro", prompt: "deviceCount 2.",
      setup: (_c, api) => api.showSchematic(), check: (_c, api) => api.getLast().deviceCount === GOLDENS.schDeviceCount },
    { id: "n4", title: "Four nets", level: "Practice", prompt: "netCount 4.",
      setup: (_c, api) => api.showSchematic(), check: (_c, api) => api.getLast().netCount === GOLDENS.schNetCount },
    { id: "mn1", title: "Select mn1", level: "Practice", prompt: "Click mn1.",
      setup: (_c, api) => { api.showSchematic(); api.select("mn1"); }, check: (_c, api) => api.getSelected().includes("mn1") },
    { id: "mp1", title: "Select mp1", level: "Practice", prompt: "Click mp1.",
      setup: (_c, api) => { api.showSchematic(); api.select("mp1"); }, check: (_c, api) => api.getSelected().includes("mp1") },
    { id: "a", title: "Net a", level: "Practice", prompt: "Select net a.",
      setup: (_c, api) => { api.showSchematic(); api.select("a"); }, check: (_c, api) => api.getSelected().includes("a") },
    { id: "e6", title: "Six edges", level: "Practice", prompt: "edgeCount 6.",
      setup: (_c, api) => api.showSchematic(), check: (_c, api) => api.getLast().edgeCount === 6 },
    { id: "golden", title: "schDeviceCount", level: "Challenge", prompt: "schDeviceCount=2.", check: () => GOLDENS.schDeviceCount === 2 },
  ],
});
