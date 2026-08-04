import { GOLDENS } from "../../assets/lvs-core.js";
import { createInteractiveLvsLab } from "../../assets/interactive-lvs-lab.js";
const root = document.getElementById("lab-root");

createInteractiveLvsLab(root, {
  defaultMode: "layout",
  starterHtml: `<p><strong>Your job:</strong> Build layout graph; select X0 and confirm 2 devices, 6 edges.</p>`,
  challenges: [
    { id: "run", title: "Layout", level: "Intro", prompt: "Click Layout.",
      setup: (_c, api) => api.showLayout(), check: (_c, api) => api.getMode() === "layout" },
    { id: "d2", title: "Two devices", level: "Intro", prompt: "deviceCount 2.",
      setup: (_c, api) => api.showLayout(), check: (_c, api) => api.getLast().deviceCount === GOLDENS.layDeviceCount },
    { id: "n4", title: "Four nets", level: "Practice", prompt: "netCount 4.",
      setup: (_c, api) => api.showLayout(), check: (_c, api) => api.getLast().netCount === GOLDENS.layNetCount },
    { id: "e6", title: "Six edges", level: "Practice", prompt: "edgeCount 6.",
      setup: (_c, api) => api.showLayout(), check: (_c, api) => api.getLast().edgeCount === 6 },
    { id: "x0", title: "Select X0", level: "Practice", prompt: "Click X0.",
      setup: (_c, api) => { api.showLayout(); api.select("X0"); }, check: (_c, api) => api.getSelected().includes("X0") },
    { id: "x1", title: "Select X1", level: "Practice", prompt: "Click X1.",
      setup: (_c, api) => { api.showLayout(); api.select("X1"); }, check: (_c, api) => api.getSelected().includes("X1") },
    { id: "net", title: "Select net_a", level: "Practice", prompt: "Click net_a.",
      setup: (_c, api) => { api.showLayout(); api.select("net_a"); }, check: (_c, api) => api.getSelected().includes("net_a") },
    { id: "golden", title: "layDeviceCount", level: "Challenge", prompt: "layDeviceCount=2.", check: () => GOLDENS.layDeviceCount === 2 },
  ],
});
