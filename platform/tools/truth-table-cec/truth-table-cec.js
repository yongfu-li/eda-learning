import { GOLDENS } from "../../assets/equivalence-core.js";
import { createInteractiveEquivalenceLab } from "../../assets/interactive-equivalence-lab.js";
const root = document.getElementById("lab-root");

createInteractiveEquivalenceLab(root, {
  defaultView: "spec",
  starterHtml: `<p><strong>Your job:</strong> Run exhaustive truth-table equivalence checks.</p>`,
  challenges: [
    { id: "rows", title: "8 rows", level: "Intro", prompt: "GOLDENS.truthRows is 8.", check: () => GOLDENS.truthRows === 8 },
    { id: "good", title: "CEC good pass", level: "Intro", prompt: "Click CEC good; equivalent true.",
      setup: (_c, api) => api.runCecGood(), check: (_c, api) => api.getLastCec().equivalent === true },
    { id: "bad", title: "CEC bad fail", level: "Practice", prompt: "Click CEC bad; equivalent false.",
      setup: (_c, api) => api.runCecBad(), check: (_c, api) => api.getLastCec().equivalent === false },
    { id: "cex", title: "Cex captured", level: "Practice", prompt: "Bad CEC cex is a1b1c0.",
      setup: (_c, api) => api.runCecBad(),
      check: (_c, api) => { const x=api.getLastCec().counterexample; return x.a===1&&x.b===1&&x.c===0; } },
    { id: "rows8", title: "Rows checked 8", level: "Practice", prompt: "Good CEC checked 8 rows.",
      setup: (_c, api) => api.runCecGood(), check: (_c, api) => api.getLastCec().rowsChecked === 8 },
    { id: "mode", title: "Mode cec-bad", level: "Practice", prompt: "Mode is cec-bad after run.",
      setup: (_c, api) => api.runCecBad(), check: (_c, api) => api.getMode() === "cec-bad" },
    { id: "api-good", title: "cecGood API", level: "Practice", prompt: "api.cecGood().equivalent.",
      check: (_c, api) => api.cecGood().equivalent === true },
    { id: "api-bad", title: "cecBad API", level: "Challenge", prompt: "api.cecBad not equivalent.",
      check: (_c, api) => api.cecBad().equivalent === false },
  ],
});
