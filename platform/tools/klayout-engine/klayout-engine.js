import { GOLDENS, klayoutEngine } from "../../assets/klayout-core.js";
import { createInteractiveKlayoutLab } from "../../assets/interactive-klayout-lab.js";
const root = document.getElementById("lab-root");

createInteractiveKlayoutLab(root, {
  starterHtml: `<p><strong>Your job:</strong> KLayout engine (map). Use stage buttons, then Check.</p>`,
  defaultMode: "engine",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open the engine stage.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last result ok.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "layers", title: "Layers golden", level: "Practice", prompt: "layerCount=2.",
      check: () => GOLDENS.layerCount === 2 },
    { id: "viol", title: "Width violation", level: "Practice", prompt: "widthViolations=1 on m0.",
      check: () => GOLDENS.widthViolations === 1 },
    { id: "select", title: "Select shape", level: "Practice", prompt: "Select m0.",
      setup: (_c, api) => { api.engine(); api.select("m0"); },
      check: (_c, api) => api.getSelected().includes("m0") },
    { id: "markers", title: "Marker golden", level: "Challenge", prompt: "markerCount=1.",
      check: () => GOLDENS.markerCount === 1 },
    { id: "mode", title: "Mode sticky", level: "Challenge", prompt: "mode is engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "engine", title: "Engine", level: "Challenge", prompt: "engine ok.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast()?.ok === true || klayoutEngine().ok },
  ],
});
