import { GOLDENS } from "../../assets/equivalence-core.js";
import { createInteractiveEquivalenceLab } from "../../assets/interactive-equivalence-lab.js";
const root = document.getElementById("lab-root");

createInteractiveEquivalenceLab(root, {
  defaultView: "spec",
  starterHtml: `<p><strong>Your job:</strong> Find and simulate the golden counterexample.</p>`,
  challenges: [
    { id: "find", title: "Find cex", level: "Intro", prompt: "findCex returns a1b1c0.",
      check: (_c, api) => { const x=api.findCex(); return x.a===1&&x.b===1&&x.c===0; } },
    { id: "set", title: "Load cex", level: "Intro", prompt: "Set assignment to cex.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.getAssignment().c === 0 },
    { id: "spec1", title: "Spec 1", level: "Practice", prompt: "Spec at cex is 1.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalSpec() === 1 },
    { id: "bad0", title: "Bad 0", level: "Practice", prompt: "Bad at cex is 0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalBad() === 0 },
    { id: "miter1", title: "Miter 1", level: "Practice", prompt: "Bad miter at cex is 1.",
      setup: (_c, api) => { api.showMiterBad(); api.setAssignment({a:1,b:1,c:0}); }, check: (_c, api) => api.eval() === 1 },
    { id: "cec", title: "CEC bad", level: "Practice", prompt: "CEC bad fails.",
      setup: (_c, api) => api.runCecBad(), check: (_c, api) => !api.getLastCec().equivalent },
    { id: "good-ok", title: "Good still ok", level: "Practice", prompt: "Good still matches at cex.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalGood() === 1 },
    { id: "golden", title: "GOLDENS.cex.a", level: "Challenge", prompt: "cex.a is 1.", check: () => GOLDENS.cex.a === 1 },
  ],
});
