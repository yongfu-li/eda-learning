import { ALGO_GOLDENS, PARTC_REAL, partcBind } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Memory map → $mem width=4 depth=8. REAL: mem=${PARTC_REAL.afterMemoryMem} WIDTH=${PARTC_REAL.afterMemoryWidth} SIZE=${PARTC_REAL.afterMemorySize}.</p>`,
  challenges: [
    { id: "run", title: "Memory", level: "Intro", prompt: "Click Memory.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getMode() === "memory" },
    { id: "d8", title: "depth=8", level: "Intro", prompt: "depth 8.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getLast().depth === ALGO_GOLDENS.memoryDepth },
    { id: "w4", title: "width=4", level: "Practice", prompt: "width 4.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getLast().width === ALGO_GOLDENS.memoryWidth },
    { id: "type", title: "$mem type", level: "Practice", prompt: "cell type $mem.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getLast().cell.type === "$mem" },
    { id: "sel", title: "Select mem", level: "Practice", prompt: "Select mem0.",
      setup: (_c, api) => { api.showMemory(); api.select("mem0"); }, check: (_c, api) => api.getSelected().includes("mem0") },
    { id: "count", title: "memCount 1", level: "Practice", prompt: "memCount 1.",
      setup: (_c, api) => api.showMemory(), check: (_c, api) => api.getLast().memCount === 1 },
    { id: "bind", title: "Bind real mem", level: "Challenge", prompt: "Teach 4×8 matches real $mem.",
      check: () => partcBind("memory").ok === true },
    { id: "golden", title: "memoryDepth", level: "Challenge", prompt: "memoryDepth=8.",
      check: () => ALGO_GOLDENS.memoryDepth === 8 },
  ],
});
