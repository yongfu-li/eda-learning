import { GOLDENS } from "../../assets/erc-core.js";
import { createInteractiveErcLab } from "../../assets/interactive-erc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveErcLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Classify drivers; z has 2, float_n has 0.</p>`,
  challenges: [
    { id: "run", title: "Drivers", level: "Intro", prompt: "Click Drivers.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getMode() === "drivers" },
    { id: "z2", title: "z drivers 2", level: "Intro", prompt: "z has 2 drivers.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getLast().byNet.z.drivers.length === 2 },
    { id: "f0", title: "float 0", level: "Practice", prompt: "float_n drivers 0.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getLast().byNet.float_n.drivers.length === 0 },
    { id: "fl", title: "float load", level: "Practice", prompt: "float_n has a load.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getLast().byNet.float_n.loads.length === 1 },
    { id: "y1", title: "y one", level: "Practice", prompt: "y has 1 driver.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getLast().byNet.y.drivers.length === 1 },
    { id: "selz", title: "Select z", level: "Practice", prompt: "Select net z.",
      setup: (_c, api) => api.selectNet("z"), check: (_c, api) => api.getSelected().includes("z") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode drivers.",
      setup: (_c, api) => api.showDrivers(), check: (_c, api) => api.getMode()==="drivers" },
    { id: "golden", title: "multi nets", level: "Challenge", prompt: "multiDrivenNets has z.", check: () => GOLDENS.multiDrivenNets[0]==="z" },
  ],
});
