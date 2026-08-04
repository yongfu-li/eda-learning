import { GOLDENS } from "../../assets/drc-core.js";
import { createInteractiveDrcLab } from "../../assets/interactive-drc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveDrcLab(root, {
  defaultMode: "multilayer",
  starterHtml: `<p><strong>Your job:</strong> Confirm 2 enclosure rules; E.VIA_M2 fires on V.</p>`,
  challenges: [
    { id: "run", title: "Multi-layer", level: "Intro", prompt: "Click Multi-layer.",
      setup: (_c, api) => api.multiLayer(), check: (_c, api) => api.getMode() === "multilayer" },
    { id: "enc2", title: "Two enc", level: "Intro", prompt: "enclosure_count 2.",
      setup: (_c, api) => api.multiLayer(), check: (_c, api) => api.getLast().enclosureCount === GOLDENS.enclosureRules },
    { id: "fire", title: "Fire", level: "Practice", prompt: "fires count 1.",
      setup: (_c, api) => api.multiLayer(), check: (_c, api) => api.getLast().fires.count === 1 },
    { id: "rule", title: "E.VIA_M2", level: "Practice", prompt: "fire rule E.VIA_M2.",
      setup: (_c, api) => api.multiLayer(), check: (_c, api) => api.getLast().fires.violations[0].rule_id === "E.VIA_M2" },
    { id: "sel", title: "Select rule", level: "Practice", prompt: "Select E.VIA_M2.",
      setup: (_c, api) => { api.multiLayer(); api.selectRule("E.VIA_M2"); },
      check: (_c, api) => api.getSelectedRules().includes("E.VIA_M2") },
    { id: "selv", title: "Select V", level: "Practice", prompt: "Click shape V.",
      setup: (_c, api) => { api.multiLayer(); api.selectShape("V"); }, check: (_c, api) => api.getSelectedShapes().includes("V") },
    { id: "bool", title: "Boolean rule", level: "Practice", prompt: "has boolean rule.",
      setup: (_c, api) => api.multiLayer(), check: (_c, api) => api.getLast().booleanRules.includes("B.VIA_M1_not_M2") },
    { id: "golden", title: "enclosureRules", level: "Challenge", prompt: "enclosureRules=2.", check: () => GOLDENS.enclosureRules === 2 },
  ],
});
