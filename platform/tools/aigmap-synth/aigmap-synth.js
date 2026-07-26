import { REAL_GOLDENS } from "../../assets/real-yosys-core.js";
import { createInteractiveRealYosysLab } from "../../assets/interactive-real-yosys-lab.js";
const root = document.getElementById("lab-root");
createInteractiveRealYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> aigmap cells=7; synth → $_AOI3_ + $_DFF_P_ (2 cells).</p>`,
  challenges: [
    { id: "aig", title: "Show aigmap", level: "Intro", prompt: "aigmap stage.",
      setup: (_c, api) => api.showStage("aigmap"), check: (_c, api) => api.getStage().id === "aigmap" },
    { id: "c7", title: "Cells 7", level: "Intro", prompt: "cells=7.",
      setup: (_c, api) => api.showStage("aigmap"), check: (_c, api) => api.getStage().cellCount === 7 },
    { id: "synth", title: "Show synth", level: "Practice", prompt: "synth stage.",
      setup: (_c, api) => api.showStage("synth"), check: (_c, api) => api.getStage().id === "synth" },
    { id: "c2", title: "Cells 2", level: "Practice", prompt: "cells=2.",
      setup: (_c, api) => api.showStage("synth"), check: (_c, api) => api.getStage().cellCount === 2 },
    { id: "aoi", title: "Has $_AOI3_", level: "Practice", prompt: "$_AOI3_ present.",
      setup: (_c, api) => api.showStage("synth"), check: (_c, api) => api.getStage().types.includes("$_AOI3_") },
    { id: "dff", title: "Has $_DFF_P_", level: "Practice", prompt: "$_DFF_P_ present.",
      setup: (_c, api) => api.showStage("synth"), check: (_c, api) => api.getStage().types.includes("$_DFF_P_") },
    { id: "sel", title: "Select AOI3", level: "Challenge", prompt: "Select $_AOI3_.",
      setup: (_c, api) => { api.showStage("synth"); api.selectType("$_AOI3_"); },
      check: (_c, api) => api.getSelected().includes("$_AOI3_") },
    { id: "golden", title: "synth golden", level: "Challenge", prompt: "cells=2 AOI+DFF.",
      setup: (_c, api) => api.showStage("synth"),
      check: (_c, api) => api.getStage().cellCount === 2 && api.getStage().types.includes("$_AOI3_") },
  ],
});
