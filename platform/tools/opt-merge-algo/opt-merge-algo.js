import { ALGO_GOLDENS, partcBind } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> OptMerge duplicate $and; andCount=1. Real Yosys after opt: and=1, keeps $adff.</p>`,
  challenges: [
    { id: "run", title: "OptMerge", level: "Intro", prompt: "Click OptMerge.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getMode() === "opt_merge" },
    { id: "and1", title: "ands=1", level: "Intro", prompt: "andCount 1.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getLast().andCount === ALGO_GOLDENS.optMergeAnds },
    { id: "rm", title: "Removed dup", level: "Practice", prompt: "removed has c_and2.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getLast().removed.includes("c_and2") },
    { id: "one-and", title: "One $and", level: "Practice", prompt: "exactly one $and.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getDesign().cells.filter(c => c.type === "$and").length === 1 },
    { id: "keep-adff", title: "Keep adff", level: "Practice", prompt: "$adff kept.",
      setup: (_c, api) => api.showOptMerge(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$adff") },
    { id: "sel", title: "Select and", level: "Practice", prompt: "Select remaining $and.",
      setup: (_c, api) => { api.showOptMerge(); const a = api.getDesign().cells.find(c => c.type === "$and"); if (a) api.select(a.id); },
      check: (_c, api) => api.getSelected().length === 1 },
    { id: "bind", title: "Bind real opt", level: "Challenge", prompt: "Teach and=1 matches real after_opt.",
      check: () => partcBind("opt").ok === true },
    { id: "golden", title: "optMergeAnds", level: "Challenge", prompt: "optMergeAnds=1.",
      check: () => ALGO_GOLDENS.optMergeAnds === 1 },
  ],
});
