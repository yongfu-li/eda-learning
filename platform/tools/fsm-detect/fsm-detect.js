import { ALGO_GOLDENS, PARTC_REAL, partcBind } from "../../assets/algo-yosys-core.js";
import { createInteractiveAlgoYosysLab } from "../../assets/interactive-algo-yosys-lab.js";
const root = document.getElementById("lab-root");

createInteractiveAlgoYosysLab(root, {
  starterHtml: `<p><strong>Your job:</strong> FSM detect: 3 states, 2 encoding bits. REAL: $fsm STATE_NUM=${PARTC_REAL.afterFsmStateNum} BITS=${PARTC_REAL.afterFsmStateBits} TRANS=${PARTC_REAL.afterFsmTransNum}.</p>`,
  challenges: [
    { id: "run", title: "FSM", level: "Intro", prompt: "Click FSM.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getMode() === "fsm" },
    { id: "s3", title: "states=3", level: "Intro", prompt: "states 3.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getLast().states === ALGO_GOLDENS.fsmStates },
    { id: "t3", title: "transitions=3", level: "Practice", prompt: "transitions 3 (teach edges).",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getLast().transitions === ALGO_GOLDENS.fsmTransitions },
    { id: "bits", title: "encoding bits", level: "Practice", prompt: "encodingBits 2.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getLast().encodingBits === ALGO_GOLDENS.fsmEncodingBits },
    { id: "reset", title: "Reset IDLE", level: "Practice", prompt: "reset IDLE.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getLast().resetState === "IDLE" },
    { id: "sel", title: "Select fsm", level: "Practice", prompt: "Select fsm0.",
      setup: (_c, api) => { api.showFsm(); api.select("fsm0"); }, check: (_c, api) => api.getSelected().includes("fsm0") },
    { id: "names", title: "Has RUN", level: "Challenge", prompt: "RUN in states.",
      setup: (_c, api) => api.showFsm(), check: (_c, api) => api.getLast().stateNames.includes("RUN") },
    { id: "bind", title: "Bind real fsm", level: "Challenge", prompt: "STATE_NUM=3 BITS=2 matches teach.",
      check: () => partcBind("fsm").ok === true },
    { id: "golden", title: "fsmStates", level: "Challenge", prompt: "fsmStates=3.",
      check: () => ALGO_GOLDENS.fsmStates === 3 },
  ],
});
