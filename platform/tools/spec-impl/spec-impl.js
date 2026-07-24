import { GOLDENS } from "../../assets/equivalence-core.js";
import { createInteractiveEquivalenceLab } from "../../assets/interactive-equivalence-lab.js";
const root = document.getElementById("lab-root");

createInteractiveEquivalenceLab(root, {
  defaultView: "spec",
  starterHtml: `<p><strong>Your job:</strong> Compare spec, good rewrite, and bad rewrite.</p>`,
  challenges: [
    { id: "gates-spec", title: "Spec 2 gates", level: "Intro", prompt: "Spec has 2 gates.", check: (_c, api) => { api.showSpec(); return api.getCircuit().gates.length === GOLDENS.specGateCount; } },
    { id: "gates-good", title: "Good 5 gates", level: "Intro", prompt: "Good impl has 5 gates.", check: (_c, api) => { api.showGood(); return api.getCircuit().gates.length === GOLDENS.goodGateCount; } },
    { id: "gates-bad", title: "Bad 2 gates", level: "Practice", prompt: "Bad impl has 2 gates.", check: (_c, api) => { api.showBad(); return api.getCircuit().gates.length === GOLDENS.badGateCount; } },
    { id: "cex-asn", title: "Set cex", level: "Practice", prompt: "Set a=1,b=1,c=0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.getAssignment().a===1 && api.getAssignment().b===1 && api.getAssignment().c===0 },
    { id: "spec1", title: "Spec at cex =1", level: "Practice", prompt: "At cex, spec evaluates to 1.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalSpec() === 1 },
    { id: "bad0", title: "Bad at cex =0", level: "Practice", prompt: "At cex, bad evaluates to 0.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalBad() === 0 },
    { id: "good1", title: "Good matches", level: "Practice", prompt: "At cex, good equals spec.",
      setup: (_c, api) => api.setAssignment({a:1,b:1,c:0}), check: (_c, api) => api.evalGood() === api.evalSpec() },
    { id: "view-good", title: "Show good", level: "Challenge", prompt: "Switch view to good.",
      setup: (_c, api) => api.showGood(), check: (_c, api) => api.getView() === "good" },
  ],
});
