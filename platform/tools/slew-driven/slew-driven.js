import { GOLDENS, EDGES, BUFFER_LIBRARY, SINKS } from "../../assets/buffering-core.js";
import { createInteractiveBufferingLab } from "../../assets/interactive-buffering-lab.js";

createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "run", title: "Run slew-driven", level: "Intro", prompt: "Click Slew-driven.",
      setup: (_c, api) => api.runSlewDriven(),
      check: (_c, api) => api.getMode() === "slew-driven" },
    { id: "result", title: "Has result", level: "Intro",
      prompt: "Slew result object exists.",
      check: (_c, api) => { if (!api.getSlewResult()) api.runSlewDriven(); return !!api.getSlewResult(); } },
    { id: "count", title: "Count ≥ 0", level: "Practice",
      prompt: "Insertion count is a number ≥ 0.",
      check: (_c, api) => { if (!api.getSlewResult()) api.runSlewDriven(); return api.getSlewResult().count >= 0; } },
    { id: "bufs", title: "Buffers array", level: "Practice",
      prompt: "Buffers array matches insertions.",
      check: (_c, api) => { if (!api.getSlewResult()) api.runSlewDriven(); return api.getBuffers().length === api.getSlewResult().count; } },
    { id: "limit", title: "Limit readable", level: "Intro", prompt: "Slew limit readable.",
      check: (_c, api) => api.getSlewLimit() === GOLDENS.slewLimit },
    { id: "mode", title: "Mode set", level: "Practice",
      prompt: "Mode is slew-driven.",
      setup: (_c, api) => api.runSlewDriven(),
      check: (_c, api) => api.getMode() === "slew-driven" },
    { id: "clear", title: "Clear works", level: "Practice",
      prompt: "Clear empties buffers.",
      check: (_c, api) => { api.runSlewDriven(); api.clearBuffers(); return api.getBuffers().length === 0; } },
    { id: "rerun", title: "Rerun", level: "Challenge",
      prompt: "Rerun after clear.",
      check: (_c, api) => { api.clearBuffers(); api.runSlewDriven(); return api.getMode() === "slew-driven"; } },
  ],
});
