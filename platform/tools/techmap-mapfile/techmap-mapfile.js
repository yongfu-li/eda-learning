import { ALGO_GOLDENS, PARTC_REAL, partcBind } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Techmap $and → NAND+NOT; nand_not=2. Real Yosys techmap types: ${PARTC_REAL.afterTechmapTypes.join(", ")}.</p>`,
  challenges: [
    { id: "run", title: "Techmap", level: "Intro", prompt: "Click Techmap.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getMode() === "techmap" },
    { id: "nn2", title: "nand_not=2", level: "Intro", prompt: "nandNotCount 2.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getLast().nandNotCount === ALGO_GOLDENS.techmapNandNot },
    { id: "nand", title: "Has NAND", level: "Practice", prompt: "$_NAND_ present.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$_NAND_") },
    { id: "not", title: "Has NOT", level: "Practice", prompt: "$_NOT_ present.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$_NOT_") },
    { id: "mapped", title: "Mapped and", level: "Practice", prompt: "mapped includes c_and1.",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getLast().mapped.includes("c_and1") },
    { id: "sel", title: "Select NAND", level: "Practice", prompt: "Select $_NAND_.",
      setup: (_c, api) => { api.showTechmap(); const n = api.getDesign().cells.find(c => c.type === "$_NAND_"); if (n) api.select(n.id); },
      check: (_c, api) => api.getSelected().some(id => api.getDesign().cells.find(c => c.id === id)?.type === "$_NAND_") },
    { id: "keep-adff", title: "Keep adff", level: "Challenge", prompt: "Teaching keeps $adff (real maps to $_DFF_PP0_).",
      setup: (_c, api) => api.showTechmap(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$adff") },
    { id: "bind", title: "Bind real techmap", level: "Challenge", prompt: "Real types include $_DFF_PP0_/$_MUX_/$_AND_.",
      check: () => partcBind("techmap").ok === true },
    { id: "golden", title: "techmapNandNot", level: "Challenge", prompt: "techmapNandNot=2.",
      check: () => ALGO_GOLDENS.techmapNandNot === 2 },
  ],
});
