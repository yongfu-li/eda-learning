import { ALGO_GOLDENS } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> OptClean removes 2; OptExpr folds 1 const buf.</p>`,
  challenges: [
    { id: "clean", title: "OptClean", level: "Intro", prompt: "Click OptClean.",
      setup: (_c, api) => api.showOptClean(), check: (_c, api) => api.getMode() === "opt_clean" },
    { id: "rm2", title: "removed=2", level: "Intro", prompt: "removedCount 2.",
      setup: (_c, api) => api.showOptClean(), check: (_c, api) => api.getLast().removedCount === ALGO_GOLDENS.optCleanRemoved },
    { id: "expr", title: "OptExpr", level: "Practice", prompt: "Click OptExpr.",
      setup: (_c, api) => api.showOptExpr(), check: (_c, api) => api.getMode() === "opt_expr" },
    { id: "fold1", title: "folded=1", level: "Practice", prompt: "foldedCount 1.",
      setup: (_c, api) => api.showOptExpr(), check: (_c, api) => api.getLast().foldedCount === ALGO_GOLDENS.optExprFolded },
    { id: "no-buf", title: "No dead buf", level: "Practice", prompt: "c_buf0 gone after clean.",
      setup: (_c, api) => api.showOptClean(), check: (_c, api) => !api.getDesign().cells.some(c => c.id === "c_buf0") },
    { id: "keep-mux", title: "Keep mux", level: "Practice", prompt: "$mux kept.",
      setup: (_c, api) => api.showOptClean(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$mux") },
    { id: "sel", title: "Select and", level: "Challenge", prompt: "Select an $and.",
      setup: (_c, api) => { api.showOptClean(); const a = api.getDesign().cells.find(c => c.type === "$and"); if (a) api.select(a.id); },
      check: (_c, api) => api.getSelected().some(id => api.getDesign().cells.find(c => c.id === id)?.type === "$and") },
    { id: "golden", title: "clean+expr goldens", level: "Challenge", prompt: "removed=2 folded=1.",
      check: () => ALGO_GOLDENS.optCleanRemoved === 2 && ALGO_GOLDENS.optExprFolded === 1 },
  ],
});
