import { GOLDENS } from "../../assets/yosys-core.js";
import { createInteractiveYosysLab } from "../../assets/interactive-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run rewrite; OR+NOT→NOR; cells=3.</p>`,
  challenges: [
    { id: "run", title: "Rewrite", level: "Intro", prompt: "Click Rewrite.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getMode() === "rewrite" },
    { id: "c3", title: "Cells 3", level: "Intro", prompt: "cell count 3.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getLast().cellCount === GOLDENS.afterRewriteCells },
    { id: "comb", title: "Comb 2", level: "Practice", prompt: "comb count 2.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getLast().combCount === GOLDENS.afterRewriteComb },
    { id: "seq", title: "Seq 1", level: "Practice", prompt: "seq count 1.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getLast().seqCount === GOLDENS.afterRewriteSeq },
    { id: "nor", title: "NOR cell", level: "Practice", prompt: "NOR present.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "NOR") },
    { id: "sel", title: "Select DFF", level: "Practice", prompt: "Select c6.",
      setup: (_c, api) => { api.showRewrite(); api.selectCell("c6"); }, check: (_c, api) => api.getSelected().includes("c6") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode rewrite.",
      setup: (_c, api) => api.showRewrite(), check: (_c, api) => api.getMode()==="rewrite" },
    { id: "golden", title: "afterRewriteCells", level: "Challenge", prompt: "afterRewriteCells=3.", check: () => GOLDENS.afterRewriteCells === 3 },
  ],
});
