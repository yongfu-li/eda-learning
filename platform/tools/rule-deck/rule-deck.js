import { GOLDENS } from "../../assets/drc-core.js";
import { createInteractiveDrcLab } from "../../assets/interactive-drc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveDrcLab(root, {
  defaultMode: "deck",
  starterHtml: `<p><strong>Your job:</strong> Inspect the deck; confirm 8 rules and select W.M1.</p>`,
  challenges: [
    { id: "run", title: "Show deck", level: "Intro", prompt: "Click Deck.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => api.getMode() === "deck" },
    { id: "r8", title: "Eight rules", level: "Intro", prompt: "ruleCount 8.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => api.getLast().ruleCount === GOLDENS.ruleCount },
    { id: "w3", title: "Width rules", level: "Practice", prompt: "Three width rules.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => (api.getLast().byType.width || []).length === GOLDENS.widthRules },
    { id: "enc2", title: "Enclosure rules", level: "Practice", prompt: "Two enclosure rules.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => (api.getLast().byType.enclosure || []).length === GOLDENS.enclosureRules },
    { id: "sel", title: "Select W.M1", level: "Practice", prompt: "Click rule W.M1.",
      setup: (_c, api) => { api.showDeck(); api.selectRule("W.M1"); }, check: (_c, api) => api.getSelectedRules().includes("W.M1") },
    { id: "layers", title: "Three layers", level: "Practice", prompt: "layers length 3.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => api.getLast().layers.length === GOLDENS.layerCount },
    { id: "shapes", title: "Five shapes", level: "Practice", prompt: "shapeCount 5.",
      setup: (_c, api) => api.showDeck(), check: (_c, api) => api.getLast().shapeCount === GOLDENS.shapeCount },
    { id: "golden", title: "ruleCount", level: "Challenge", prompt: "ruleCount=8.", check: () => GOLDENS.ruleCount === 8 },
  ],
});
