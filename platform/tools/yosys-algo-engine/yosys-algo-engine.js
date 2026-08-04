import { ALGO_GOLDENS } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run Engine; all Part C goldens; ok=True.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "ok", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "mux", title: "mux golden", level: "Practice", prompt: "mux=1.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().mux === 1 },
    { id: "clean", title: "clean golden", level: "Practice", prompt: "cleanRemoved=2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().cleanRemoved === 2 },
    { id: "abc", title: "abc golden", level: "Practice", prompt: "abcAnds=3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().abcAnds === 3 },
    { id: "fsm", title: "fsm golden", level: "Practice", prompt: "fsmStates=3.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().fsmStates === 3 },
    { id: "tech", title: "techmap golden", level: "Challenge", prompt: "techmapNandNot=2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().techmapNandNot === 2 },
    { id: "golden", title: "engineOk", level: "Challenge", prompt: "engineOk.",
      check: () => ALGO_GOLDENS.engineOk === true },
  ],
});
