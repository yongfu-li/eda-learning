import { GOLDENS } from "../../assets/equivalence-core.js";
import { createInteractiveEquivalenceLab } from "../../assets/interactive-equivalence-lab.js";
const root = document.getElementById("lab-root");

createInteractiveEquivalenceLab(root, {
  defaultView: "miter-good",
  starterHtml: `<p><strong>Your job:</strong> Build and evaluate good/bad miters.</p>`,
  challenges: [
    { id: "show-mg", title: "Show miter good", level: "Intro", prompt: "Open miter good view.",
      setup: (_c, api) => api.showMiterGood(), check: (_c, api) => api.getView() === "miter-good" },
    { id: "xor", title: "Has XOR", level: "Intro", prompt: "Miter has miter_xor gate.",
      setup: (_c, api) => api.showMiterGood(), check: (_c, api) => api.getCircuit().gates.some(g => g.id==="miter_xor") },
    { id: "zero", title: "Good miter 0", level: "Practice", prompt: "At cex, good miter is 0.",
      setup: (_c, api) => { api.showMiterGood(); api.setAssignment({a:1,b:1,c:0}); },
      check: (_c, api) => api.eval() === 0 },
    { id: "bad-view", title: "Show miter bad", level: "Practice", prompt: "Open miter bad.",
      setup: (_c, api) => api.showMiterBad(), check: (_c, api) => api.getView() === "miter-bad" },
    { id: "one", title: "Bad miter 1", level: "Practice", prompt: "At cex, bad miter is 1.",
      setup: (_c, api) => { api.showMiterBad(); api.setAssignment({a:1,b:1,c:0}); },
      check: (_c, api) => api.eval() === 1 },
    { id: "shared", title: "3 PIs", level: "Practice", prompt: "Miter has 3 PIs.",
      setup: (_c, api) => api.showMiterGood(), check: (_c, api) => api.getCircuit().pis.length === 3 },
    { id: "good-api", title: "miterGood exists", level: "Practice", prompt: "miterGood returns gates.",
      check: (_c, api) => api.miterGood().gates.length > 2 },
    { id: "golden", title: "GOLDENS.cex", level: "Challenge", prompt: "GOLDENS.cex.c is 0.", check: () => GOLDENS.cex.c === 0 },
  ],
});
