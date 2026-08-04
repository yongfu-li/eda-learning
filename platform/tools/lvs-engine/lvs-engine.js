import { GOLDENS } from "../../assets/lvs-core.js";
import { createInteractiveLvsLab } from "../../assets/interactive-lvs-lab.js";
const root = document.getElementById("lab-root");

createInteractiveLvsLab(root, {
  defaultMode: "engine",
  starterHtml: `<p><strong>Your job:</strong> Run engine; select mn1; confirm ok=True.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "sch2", title: "Sch devices", level: "Practice", prompt: "schematic deviceCount 2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().schematic.deviceCount === GOLDENS.schDeviceCount },
    { id: "lay2", title: "Lay devices", level: "Practice", prompt: "recognize count 2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().recognize.count === GOLDENS.layDeviceCount },
    { id: "nets4", title: "Four nets", level: "Practice", prompt: "extract count 4.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().extract.count === GOLDENS.layNetCount },
    { id: "cmp", title: "Compare ok", level: "Practice", prompt: "compare ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().compare.ok === true },
    { id: "sel", title: "Select mn1", level: "Practice", prompt: "Click mn1.",
      setup: (_c, api) => { api.engine(); api.select("mn1"); }, check: (_c, api) => api.getSelected().includes("mn1") },
    { id: "golden", title: "matchedNets", level: "Challenge", prompt: "matchedNets=4.", check: () => GOLDENS.matchedNets === 4 },
  ],
});
