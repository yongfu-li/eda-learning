import { ALGO_GOLDENS, partcBind } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run ProcMux; confirm one $mux cell. Real Yosys after full proc also keeps a $mux.</p>`,
  challenges: [
    { id: "run", title: "ProcMux", level: "Intro", prompt: "Click ProcMux.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => api.getMode() === "proc_mux" },
    { id: "mux1", title: "mux=1", level: "Intro", prompt: "muxCount 1.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => api.getLast().muxCount === ALGO_GOLDENS.procMuxCells },
    { id: "type", title: "$mux type", level: "Practice", prompt: "$mux present.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => api.getDesign().cells.some(c => c.type === "$mux") },
    { id: "no-combo", title: "Combo gone", level: "Practice", prompt: "no combo process.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => !api.getDesign().processes.some(p => p.kind === "combo") },
    { id: "sel", title: "Select mux", level: "Practice", prompt: "Select mux cell.",
      setup: (_c, api) => { api.showProcMux(); api.select(api.getLast().added[0]); },
      check: (_c, api) => api.getSelected().length === 1 },
    { id: "y", title: "Y is y", level: "Practice", prompt: "mux Y=y.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => api.getDesign().cells.find(c => c.type === "$mux")?.Y === "y" },
    { id: "sync-kept", title: "Sync kept", level: "Challenge", prompt: "sync process still there.",
      setup: (_c, api) => api.showProcMux(), check: (_c, api) => api.getDesign().processes.some(p => p.kind === "sync") },
    { id: "bind", title: "Bind real proc", level: "Challenge", prompt: "partcBind(proc) ok (real mux+adff).",
      check: () => partcBind("proc").ok === true },
    { id: "golden", title: "procMuxCells", level: "Challenge", prompt: "procMuxCells=1.",
      check: () => ALGO_GOLDENS.procMuxCells === 1 },
  ],
});
