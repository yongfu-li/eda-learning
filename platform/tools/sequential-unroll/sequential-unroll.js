import { GOLDENS } from "../../assets/equivalence-core.js";
import { createInteractiveEquivalenceLab } from "../../assets/interactive-equivalence-lab.js";
const root = document.getElementById("lab-root");

createInteractiveEquivalenceLab(root, {
  defaultView: "seqSpec",
  starterHtml: `<p><strong>Your job:</strong> Unroll the sequential toy for two steps.</p>`,
  challenges: [
    { id: "steps", title: "steps=2", level: "Intro", prompt: "Unroll steps is 2.", check: (_c, api) => api.unroll(2).steps === 2 },
    { id: "gates", title: "Has gates", level: "Intro", prompt: "Unroll produces gates.", check: (_c, api) => api.unroll(2).gates.length > 0 },
    { id: "pis", title: "Has frame PIs", level: "Practice", prompt: "Unroll pis include a_0.",
      check: (_c, api) => api.unroll(2).pis.includes("a_0") },
    { id: "q0", title: "Has q_0", level: "Practice", prompt: "Unroll pis include q_0.",
      check: (_c, api) => api.unroll(2).pis.includes("q_0") },
    { id: "golden", title: "seqSteps", level: "Intro", prompt: "GOLDENS.seqSteps=2.", check: () => GOLDENS.seqSteps === 2 },
    { id: "y", title: "PO y", level: "Practice", prompt: "Unroll pos is y.", check: (_c, api) => api.unroll(2).pos[0] === "y" },
    { id: "more", title: "3 steps more", level: "Practice", prompt: "3-step unroll has more gates than 2.",
      check: (_c, api) => api.unroll(3).gates.length > api.unroll(2).gates.length },
    { id: "view", title: "Show seqSpec", level: "Challenge", prompt: "Switch to seqSpec view.",
      setup: (_c, api) => api.setView("seqSpec"), check: (_c, api) => api.getView() === "seqSpec" },
  ],
});
