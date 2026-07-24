import { GOLDENS, EDGES, BUFFER_LIBRARY, SINKS } from "../../assets/buffering-core.js";
import { createInteractiveBufferingLab } from "../../assets/interactive-buffering-lab.js";

createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "run", title: "Run fanout", level: "Intro", prompt: "Click Fanout buffer.",
      setup: (_c, api) => api.runFanout(),
      check: (_c, api) => api.getMode() === "fanout" },
    { id: "inserted", title: "Inserted", level: "Practice", prompt: "Buffer appears (3>2).",
      setup: (_c, api) => api.runFanout(),
      check: (_c, api) => api.getBuffers().length >= 1 },
    { id: "at-s0", title: "Near S0", level: "Practice",
      prompt: "Buffer near S0 coordinates.",
      check: (_c, api) => { api.runFanout(); const b = api.getBuffers()[0]; const s0 = api.getSinks().find(s => s.id === "S0"); return Math.abs(b.x - s0.x) < 0.1 && Math.abs(b.y - s0.y) < 0.1; } },
    { id: "x2", title: "BUF_X2", level: "Practice", prompt: "Uses BUF_X2.",
      check: (_c, api) => { api.runFanout(); return api.getBuffers()[0].buf === "BUF_X2"; } },
    { id: "sinks3", title: "Three sinks", level: "Intro", prompt: "Fanout three.",
      check: (_c, api) => api.getSinks().length === 3 },
    { id: "golden", title: "Golden inserted", level: "Intro", prompt: "GOLDENS.fanoutInserted.",
      check: () => GOLDENS.fanoutInserted === true },
    { id: "mode", title: "Mode fanout", level: "Practice",
      prompt: "Mode is fanout.",
      setup: (_c, api) => api.runFanout(),
      check: (_c, api) => api.getMode() === "fanout" },
    { id: "clear", title: "Clear", level: "Challenge",
      prompt: "Clear removes fanout buffer.",
      check: (_c, api) => { api.runFanout(); api.clearBuffers(); return api.getBuffers().length === 0; } },
  ],
});
