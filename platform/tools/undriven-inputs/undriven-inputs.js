import { GOLDENS } from "../../assets/erc-core.js";
import { createInteractiveErcLab } from "../../assets/interactive-erc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveErcLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Confirm u2.A undriven on float_n.</p>`,
  challenges: [
    { id: "run", title: "Undriven", level: "Intro", prompt: "Click Undriven.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => api.getMode() === "undriven" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "undriven count 1.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => api.getLast().count === GOLDENS.undrivenCount },
    { id: "u2", title: "u2.A", level: "Practice", prompt: "hit is u2.A.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => api.getLast().hits[0].inst==="u2" && api.getLast().hits[0].pin==="A" },
    { id: "net", title: "float_n", level: "Practice", prompt: "hit net float_n.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => api.getLast().hits[0].net==="float_n" },
    { id: "sel", title: "Select float_n", level: "Practice", prompt: "Select float_n.",
      setup: (_c, api) => api.selectNet("float_n"), check: (_c, api) => api.getSelected().includes("float_n") },
    { id: "nota", title: "Not port a", level: "Practice", prompt: "no hit on port a.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => !api.getLast().hits.some(h=>h.net==="a") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode undriven.",
      setup: (_c, api) => api.checkUndriven(), check: (_c, api) => api.getMode()==="undriven" },
    { id: "golden", title: "undrivenCount", level: "Challenge", prompt: "undrivenCount=1.", check: () => GOLDENS.undrivenCount === 1 },
  ],
});
