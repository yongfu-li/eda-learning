import { GOLDENS } from "../../assets/pex-core.js";
import { createInteractivePexLab } from "../../assets/interactive-pex-lab.js";
const root = document.getElementById("lab-root");

createInteractivePexLab(root, {
  defaultMode: "reduce",
  starterHtml: `<p><strong>Your job:</strong> Reduce network; select R_eq; confirm after_nodes=2, R_eq=3.06, C_eq=1.376.</p>`,
  challenges: [
    { id: "run", title: "Reduce", level: "Intro", prompt: "Click Reduce.",
      setup: (_c, api) => api.runReduce(), check: (_c, api) => api.getMode() === "reduce" },
    { id: "n2", title: "Two nodes", level: "Intro", prompt: "afterNodes 2.",
      setup: (_c, api) => api.runReduce(), check: (_c, api) => api.getLast().afterNodes === GOLDENS.nodesAfter },
    { id: "req", title: "R_eq", level: "Practice", prompt: "rEq 3.06.",
      setup: (_c, api) => api.runReduce(), check: (_c, api) => api.getLast().rEq === GOLDENS.rTotal },
    { id: "ceq", title: "C_eq", level: "Practice", prompt: "cEq 1.376.",
      setup: (_c, api) => api.runReduce(), check: (_c, api) => api.getLast().cEq === GOLDENS.cTotal },
    { id: "selr", title: "Select R_eq", level: "Practice", prompt: "Click R_eq.",
      setup: (_c, api) => { api.runReduce(); api.select("R_eq"); }, check: (_c, api) => api.getSelected().includes("R_eq") },
    { id: "selc", title: "Select C_eq", level: "Practice", prompt: "Click C_eq.",
      setup: (_c, api) => { api.runReduce(); api.select("C_eq"); }, check: (_c, api) => api.getSelected().includes("C_eq") },
    { id: "in", title: "Select in", level: "Practice", prompt: "Click in.",
      setup: (_c, api) => { api.runReduce(); api.select("in"); }, check: (_c, api) => api.getSelected().includes("in") },
    { id: "golden", title: "rEq", level: "Challenge", prompt: "rEq=3.06.", check: () => GOLDENS.rTotal === 3.06 },
  ],
});
