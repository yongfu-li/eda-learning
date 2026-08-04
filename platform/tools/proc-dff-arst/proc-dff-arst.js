import { ALGO_GOLDENS, PARTC_REAL, partcBind } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run ProcDff; real Yosys emits <code>$adff</code> when async reset is present; processes=0. REAL: adff=${PARTC_REAL.afterProcAdff} mux=${PARTC_REAL.afterProcMux}.</p>`,
  challenges: [
    { id: "run", title: "ProcDff", level: "Intro", prompt: "Click ProcDff.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getMode() === "proc_dff" },
    { id: "dff1", title: "reg=1", level: "Intro", prompt: "dffCount 1.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getLast().dffCount === 1 },
    { id: "adff", title: "Type $adff", level: "Intro", prompt: "regType is $adff (real Yosys).",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getLast().regType === "$adff" },
    { id: "arst", title: "Has ARST", level: "Practice", prompt: "hasArst true.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getLast().hasArst === true },
    { id: "proc0", title: "processes=0", level: "Practice", prompt: "no processes.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getLast().processes === 0 },
    { id: "mux", title: "Mux too", level: "Practice", prompt: "$mux also present.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$mux") },
    { id: "sel", title: "Select adff", level: "Practice", prompt: "Select $adff.",
      setup: (_c, api) => { api.showProcDff(); api.select(api.getLast().added[0]); },
      check: (_c, api) => api.getSelected().length === 1 },
    { id: "q", title: "Q is q", level: "Challenge", prompt: "$adff Q=q.",
      setup: (_c, api) => api.showProcDff(), check: (_c, api) => api.getDesign().cells.find(c => c.type === "$adff")?.Q === "q" },
    { id: "bind", title: "Bind real", level: "Challenge", prompt: "Teach $adff matches real after_proc adff=1.",
      check: () => partcBind("proc").ok === true },
    { id: "golden", title: "procDffType", level: "Challenge", prompt: "procDffType=$adff.",
      check: () => ALGO_GOLDENS.procDffType === "$adff" && ALGO_GOLDENS.procDffCells === 1 },
  ],
});
