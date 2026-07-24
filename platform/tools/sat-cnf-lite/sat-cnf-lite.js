import { GOLDENS } from "../../assets/equivalence-core.js";
import { createInteractiveEquivalenceLab } from "../../assets/interactive-equivalence-lab.js";
const root = document.getElementById("lab-root");

createInteractiveEquivalenceLab(root, {
  defaultView: "spec",
  starterHtml: `<p><strong>Your job:</strong> Encode CNF and ask SAT if the bad miter can be 1.</p>`,
  challenges: [
    { id: "clauses", title: "Spec clauses >0", level: "Intro", prompt: "Spec CNF has clauses.", check: (_c, api) => api.cnfSpec().numClauses > 0 },
    { id: "vars", title: "Vars >3", level: "Intro", prompt: "Spec numVars > 3.", check: (_c, api) => api.cnfSpec().numVars > 3 },
    { id: "sat", title: "SAT finds diff", level: "Practice", prompt: "Click SAT miter≠0 — satisfiable.",
      setup: (_c, api) => api.satMiterDiff(), check: (_c, api) => api.satMiterDiff() === true },
    { id: "mode", title: "Mode sat", level: "Practice", prompt: "Mode is sat.",
      setup: (_c, api) => api.satMiterDiff(), check: (_c, api) => api.getMode() === "sat" },
    { id: "cnf-store", title: "CNF stored", level: "Practice", prompt: "getLastCnf has clauses.",
      setup: (_c, api) => api.satMiterDiff(), check: (_c, api) => api.getLastCnf().numClauses > 0 },
    { id: "assert", title: "Assert CNF", level: "Practice", prompt: "cnfMiterAssertOne has clauses.",
      check: (_c, api) => api.cnfMiterAssertOne().numClauses > 0 },
    { id: "miter-bad", title: "Show miter bad", level: "Practice", prompt: "View miter-bad.",
      setup: (_c, api) => api.showMiterBad(), check: (_c, api) => api.getView() === "miter-bad" },
    { id: "golden", title: "truthRows", level: "Challenge", prompt: "truthRows=8.", check: () => GOLDENS.truthRows === 8 },
  ],
});
