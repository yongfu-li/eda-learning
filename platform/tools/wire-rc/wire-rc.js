import { GOLDENS, EDGES, BUFFER_LIBRARY, SINKS } from "../../assets/buffering-core.js";
import { createInteractiveBufferingLab } from "../../assets/interactive-buffering-lab.js";

createInteractiveBufferingLab(document.getElementById("lab-root"), {
  starterHtml: `<p><strong>Your job:</strong> confirm edge lengths and R/C with unit parasitics.</p>`,
  challenges: [
    { id: "edges", title: "Three edges", level: "Intro", prompt: "Net has three edges.", check: () => EDGES.length === GOLDENS.edgeCount },
    { id: "sinks", title: "Three sinks", level: "Intro", prompt: "Three sinks.", check: () => SINKS.length === GOLDENS.sinkCount },
    { id: "e0-rc", title: "e0 R=4", level: "Practice", prompt: "e0 length maps to R≈4.",
      check: (_c, api) => Math.abs(api.wireRcForEdge("e0").R - GOLDENS.wireRcLen4R) < 0.2 },
    { id: "e0-c", title: "e0 C=4", level: "Practice", prompt: "e0 C≈4.",
      check: (_c, api) => Math.abs(api.wireRcForEdge("e0").C - 4) < 0.2 },
    { id: "finite", title: "All RC finite", level: "Practice",
      prompt: "Every edge has finite R.",
      check: (_c, api) => EDGES.every(e => Number.isFinite(api.wireRcForEdge(e.id).R)) },
    { id: "driver", title: "Driver D", level: "Intro", prompt: "Driver id is D.",
      check: (_c, api) => api.getDriver().id === "D" },
    { id: "move", title: "Move S1", level: "Challenge", prompt: "Move S1 so x≥10.",
      check: (_c, api) => api.getSinks().find(s => s.id === "S1").x >= 10 },
    { id: "golden", title: "Golden R", level: "Intro", prompt: "GOLDENS.wireRcLen4R is 4.",
      check: () => GOLDENS.wireRcLen4R === 4 },
  ],
});
