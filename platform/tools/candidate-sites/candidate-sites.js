import { GOLDENS, EDGES, BUFFER_LIBRARY, SINKS } from "../../assets/buffering-core.js";
import { createInteractiveBufferingLab } from "../../assets/interactive-buffering-lab.js";

createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "show", title: "Show candidates", level: "Intro", prompt: "Click Show candidates.",
      setup: (_c, api) => api.showCandidates(),
      check: (_c, api) => api.getMode() === "candidates" && api.getSites().length > 0 },
    { id: "count", title: "Sites ≥ 1", level: "Intro", prompt: "At least one site.",
      check: (_c, api) => { if (!api.getSites().length) api.showCandidates(); return api.getSites().length >= 1; } },
    { id: "ge3", title: "Sites ≥ 3", level: "Practice", prompt: "At least three sites on the toy.",
      check: (_c, api) => { if (!api.getSites().length) api.showCandidates(); return api.getSites().length >= 3; } },
    { id: "mode", title: "Mode candidates", level: "Practice", prompt: "Mode is candidates.",
      setup: (_c, api) => api.showCandidates(),
      check: (_c, api) => api.getMode() === "candidates" },
    { id: "edge-field", title: "Sites have edge", level: "Practice",
      prompt: "Each site references an edge id.",
      check: (_c, api) => { if (!api.getSites().length) api.showCandidates(); return api.getSites().every(s => s.edge); } },
    { id: "step", title: "Step golden", level: "Intro", prompt: "candidateStep golden is 2.",
      check: () => GOLDENS.candidateStep === 2 },
    { id: "clear", title: "Can clear", level: "Practice", prompt: "Clear then show again.",
      check: (_c, api) => { api.clearBuffers(); api.showCandidates(); return api.getSites().length > 0; } },
    { id: "coords", title: "On chip", level: "Challenge",
      prompt: "All sites inside chip bounds.",
      check: (_c, api) => { if (!api.getSites().length) api.showCandidates(); return api.getSites().every(s => s.x >= 0 && s.x <= 12 && s.y >= 0 && s.y <= 8); } },
  ],
});
