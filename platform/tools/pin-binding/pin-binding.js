import { GOLDENS } from "../../assets/lvs-core.js";
import { createInteractiveLvsLab } from "../../assets/interactive-lvs-lab.js";
const root = document.getElementById("lab-root");

createInteractiveLvsLab(root, {
  defaultMode: "binding",
  starterHtml: `<p><strong>Your job:</strong> Inspect binding table; select X0 and mn1; confirm 4 net binds.</p>`,
  challenges: [
    { id: "run", title: "Binding", level: "Intro", prompt: "Click Binding.",
      setup: (_c, api) => api.runBinding(), check: (_c, api) => api.getMode() === "binding" },
    { id: "x0mn1", title: "X0→mn1", level: "Intro", prompt: "devices X0 maps mn1.",
      setup: (_c, api) => api.runBinding(), check: (_c, api) => api.getLast().devices.X0 === "mn1" },
    { id: "x1mp1", title: "X1→mp1", level: "Practice", prompt: "devices X1 maps mp1.",
      setup: (_c, api) => api.runBinding(), check: (_c, api) => api.getLast().devices.X1 === "mp1" },
    { id: "n4", title: "Four nets", level: "Practice", prompt: "netCount 4.",
      setup: (_c, api) => api.runBinding(), check: (_c, api) => api.getLast().netCount === 4 },
    { id: "selx0", title: "Select X0", level: "Practice", prompt: "Click X0.",
      setup: (_c, api) => { api.runBinding(); api.select("X0"); }, check: (_c, api) => api.getSelected().includes("X0") },
    { id: "selmn1", title: "Select mn1", level: "Practice", prompt: "Click mn1.",
      setup: (_c, api) => { api.runBinding(); api.select("mn1"); }, check: (_c, api) => api.getSelected().includes("mn1") },
    { id: "neta", title: "net_a→a", level: "Practice", prompt: "nets net_a maps a.",
      setup: (_c, api) => api.runBinding(), check: (_c, api) => api.getLast().nets.net_a === "a" },
    { id: "golden", title: "device binds", level: "Challenge", prompt: "deviceCount=2.", check: (_c, api) => api.runBinding().deviceCount === 2 },
  ],
});
