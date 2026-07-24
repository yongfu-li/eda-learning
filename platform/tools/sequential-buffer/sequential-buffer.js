import { GOLDENS, EDGES, BUFFER_LIBRARY, SINKS } from "../../assets/buffering-core.js";
import { createInteractiveBufferingLab } from "../../assets/interactive-buffering-lab.js";

createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "run", title: "Sequential pass", level: "Intro", prompt: "Click Sequential pass.",
      setup: (_c, api) => api.runSequential(),
      check: (_c, api) => api.getMode() === "sequential" },
    { id: "vg", title: "VG computed", level: "Intro",
      prompt: "VG result present.",
      check: (_c, api) => { if (!api.getVg()) api.runSequential(); return !!api.getVg(); } },
    { id: "sites", title: "Sites", level: "Practice",
      prompt: "Sites after pass.",
      check: (_c, api) => { if (!api.getSites().length) api.runSequential(); return api.getSites().length > 0; } },
    { id: "improved", title: "Delay OK", level: "Practice",
      prompt: "bestDelay ≤ wireDelay.",
      check: (_c, api) => { if (!api.getVg()) api.runSequential(); const v = api.getVg(); return v.bestDelay <= v.wireDelay + 1e-6; } },
    { id: "bufs", title: "Some buffers", level: "Practice",
      prompt: "At least one buffer after pass (VG or fanout).",
      check: (_c, api) => { api.runSequential(); return api.getBuffers().length >= 1; } },
    { id: "mode", title: "Mode sequential", level: "Practice",
      prompt: "Mode is sequential.",
      setup: (_c, api) => api.runSequential(),
      check: (_c, api) => api.getMode() === "sequential" },
    { id: "sinks", title: "Three sinks", level: "Intro", prompt: "Still three sinks.",
      check: (_c, api) => api.getSinks().length === 3 },
    { id: "rerun", title: "Idempotent mode", level: "Challenge",
      prompt: "Rerun keeps sequential mode.",
      check: (_c, api) => { api.runSequential(); api.runSequential(); return api.getMode() === "sequential"; } },
  ],
});
