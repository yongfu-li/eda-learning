import { GOLDENS } from "../../assets/equivalence-core.js";
import { createInteractiveEquivalenceLab } from "../../assets/interactive-equivalence-lab.js";
const root = document.getElementById("lab-root");

createInteractiveEquivalenceLab(root, {
  defaultView: "seqSpec",
  starterHtml: `<p><strong>Your job:</strong> Compare sequential good and bad over 2 steps.</p>`,
  challenges: [
    { id: "good", title: "SEC good", level: "Intro", prompt: "Click SEC good — equivalent.",
      setup: (_c, api) => api.seqCecGood(), check: (_c, api) => api.getLastSeq().equivalent === true },
    { id: "bad", title: "SEC bad", level: "Intro", prompt: "Click SEC bad — not equivalent.",
      setup: (_c, api) => api.seqCecBad(), check: (_c, api) => api.getLastSeq().equivalent === false },
    { id: "steps", title: "Steps 2", level: "Practice", prompt: "SEC uses steps=2.",
      setup: (_c, api) => api.seqCecGood(), check: (_c, api) => api.getLastSeq().steps === 2 },
    { id: "mode-g", title: "Mode seq-good", level: "Practice", prompt: "Mode seq-good.",
      setup: (_c, api) => api.seqCecGood(), check: (_c, api) => api.getMode() === "seq-good" },
    { id: "mode-b", title: "Mode seq-bad", level: "Practice", prompt: "Mode seq-bad.",
      setup: (_c, api) => api.seqCecBad(), check: (_c, api) => api.getMode() === "seq-bad" },
    { id: "cex", title: "Bad has cex", level: "Practice", prompt: "Bad SEC has counterexample.",
      setup: (_c, api) => api.seqCecBad(), check: (_c, api) => !!api.getLastSeq().counterexample },
    { id: "golden", title: "seqSteps", level: "Practice", prompt: "seqSteps golden 2.", check: () => GOLDENS.seqSteps === 2 },
    { id: "api", title: "Both APIs", level: "Challenge", prompt: "good true and bad false.",
      check: (_c, api) => api.seqCecGood().equivalent && !api.seqCecBad().equivalent },
  ],
});
