import { GOLDENS } from "../../assets/equivalence-core.js";
import { createInteractiveEquivalenceLab } from "../../assets/interactive-equivalence-lab.js";
const root = document.getElementById("lab-root");

createInteractiveEquivalenceLab(root, {
  defaultView: "spec",
  starterHtml: `<p><strong>Your job:</strong> Run CEC under a don't-care / care mask.</p>`,
  challenges: [
    { id: "mask", title: "Set c=0 care", level: "Intro", prompt: "Set don't-care mask c=0.",
      setup: (_c, api) => api.setDontCare({a:-1,b:-1,c:0}), check: (_c, api) => api.getDontCare().c === 0 },
    { id: "run", title: "DC check fails", level: "Intro", prompt: "dontCareCheck with c=0 still fails on bad.",
      setup: (_c, api) => api.dontCareCheck({a:-1,b:-1,c:0}), check: (_c, api) => api.getLastCec().equivalent === false },
    { id: "cex-c", title: "Cex keeps c=0", level: "Practice", prompt: "Counterexample has c=0.",
      setup: (_c, api) => api.dontCareCheck({a:-1,b:-1,c:0}), check: (_c, api) => api.getLastCec().counterexample.c === 0 },
    { id: "mode", title: "Mode dont-care", level: "Practice", prompt: "Mode is dont-care.",
      setup: (_c, api) => api.dontCareCheck({a:-1,b:-1,c:0}), check: (_c, api) => api.getMode() === "dont-care" },
    { id: "rows", title: "Fewer rows", level: "Practice", prompt: "rowsChecked ≤ 8.",
      setup: (_c, api) => api.dontCareCheck({a:-1,b:-1,c:0}), check: (_c, api) => api.getLastCec().rowsChecked <= 8 },
    { id: "x-bits", title: "a is X", level: "Practice", prompt: "Mask a is −1.",
      setup: (_c, api) => api.setDontCare({a:-1,b:-1,c:0}), check: (_c, api) => api.getDontCare().a === -1 },
    { id: "full", title: "Full still fails", level: "Practice", prompt: "Full CEC bad still fails.",
      check: (_c, api) => api.cecBad().equivalent === false },
    { id: "golden", title: "piCount", level: "Challenge", prompt: "piCount=3.", check: () => GOLDENS.piCount === 3 },
  ],
});
