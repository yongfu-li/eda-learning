import { GOLDENS } from "../../assets/drc-core.js";
import { createInteractiveDrcLab } from "../../assets/interactive-drc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveDrcLab(root, {
  defaultMode: "enclosure",
  starterHtml: `<p><strong>Your job:</strong> Select V; confirm VIA not enclosed by M2 (E.VIA_M2).</p>`,
  challenges: [
    { id: "run", title: "Enclosure", level: "Intro", prompt: "Click Enclosure.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getMode() === "enclosure" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "enc count 1.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getLast().count === GOLDENS.enclosureViolations },
    { id: "v", title: "Inner V", level: "Practice", prompt: "inner V.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getLast().violations[0].inner === "V" },
    { id: "sel", title: "Select V", level: "Practice", prompt: "Click shape V.",
      setup: (_c, api) => { api.runEnclosure(); api.selectShape("V"); }, check: (_c, api) => api.getSelectedShapes().includes("V") },
    { id: "rule", title: "E.VIA_M2", level: "Practice", prompt: "rule_id E.VIA_M2.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getLast().violations[0].rule_id === "E.VIA_M2" },
    { id: "m2", title: "M2 outer", level: "Practice", prompt: "outer_layer M2.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getLast().violations[0].outer_layer === "M2" },
    { id: "mk", title: "Marker", level: "Practice", prompt: "markers nonempty.",
      setup: (_c, api) => api.runEnclosure(), check: (_c, api) => api.getMarkers().length >= 1 },
    { id: "golden", title: "enclosureViolations", level: "Challenge", prompt: "enclosureViolations=1.", check: () => GOLDENS.enclosureViolations === 1 },
  ],
});
