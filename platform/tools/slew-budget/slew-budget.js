import { GOLDENS, EDGES, BUFFER_LIBRARY, SINKS } from "../../assets/buffering-core.js";
import { createInteractiveBufferingLab } from "../../assets/interactive-buffering-lab.js";

createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "limit", title: "Limit 8", level: "Intro", prompt: "Slew limit is 8.",
      check: (_c, api) => api.getSlewLimit() === GOLDENS.slewLimit },
    { id: "e0-slew", title: "e0 slew finite", level: "Intro", prompt: "e0 slew is finite.",
      check: (_c, api) => Number.isFinite(api.edgeSlew("e0")) },
    { id: "ok-api", title: "slewOk API", level: "Practice", prompt: "slewOk(5) is true at limit 8.",
      check: (_c, api) => api.slewOk(5) === true },
    { id: "fail", title: "slewOk(20) false", level: "Practice", prompt: "slewOk(20) is false.",
      check: (_c, api) => api.slewOk(20) === false },
    { id: "all", title: "All edges slew", level: "Practice",
      prompt: "Every edge slew finite.",
      check: (_c, api) => EDGES.every(e => Number.isFinite(api.edgeSlew(e.id))) },
    { id: "select", title: "Select S2", level: "Practice", prompt: "Select sink S2.",
      check: (_c, api) => api.getSelected() === "S2" },
    { id: "stretch", title: "Stretch S1", level: "Challenge", prompt: "Move S1 to x≥10.",
      check: (_c, api) => api.getSinks().find(s => s.id === "S1").x >= 10 },
    { id: "golden", title: "Golden limit", level: "Intro", prompt: "GOLDENS.slewLimit is 8.",
      check: () => GOLDENS.slewLimit === 8 },
  ],
});
