import { GOLDENS } from "../../assets/equivalence-core.js";
import { createInteractiveEquivalenceLab } from "../../assets/interactive-equivalence-lab.js";
const root = document.getElementById("lab-root");

createInteractiveEquivalenceLab(root, {
  defaultView: "spec",
  starterHtml: `<p><strong>Your job:</strong> Inspect structural hashes on the toy circuits.</p>`,
  challenges: [
    { id: "spec2", title: "Spec 2 gates", level: "Intro", prompt: "Spec totalGates=2.", check: (_c, api) => api.hashSpec().totalGates === 2 },
    { id: "unique", title: "Unique ≥2", level: "Intro", prompt: "Spec uniqueHashes ≥ 2.", check: (_c, api) => api.hashSpec().uniqueHashes >= 2 },
    { id: "fraig", title: "Fraig good", level: "Practice", prompt: "fraigGood has fraigNodes.", check: (_c, api) => typeof api.fraigGood().fraigNodes === "number" },
    { id: "good-more", title: "Good more gates", level: "Practice", prompt: "Good has more gates than spec.",
      check: (_c, api) => { api.showGood(); return api.getCircuit().gates.length > 2; } },
    { id: "show-spec", title: "Show spec", level: "Practice", prompt: "View is spec.",
      setup: (_c, api) => api.showSpec(), check: (_c, api) => api.getView() === "spec" },
    { id: "redundant", title: "redundant ≥0", level: "Practice", prompt: "redundant is a number ≥0.",
      check: (_c, api) => api.hashSpec().redundant >= 0 },
    { id: "hashes", title: "Has gateHashes", level: "Practice", prompt: "gateHashes object exists.",
      check: (_c, api) => typeof api.hashSpec().gateHashes === "object" },
    { id: "golden", title: "specGateCount", level: "Challenge", prompt: "GOLDENS.specGateCount=2.", check: () => GOLDENS.specGateCount === 2 },
  ],
});
