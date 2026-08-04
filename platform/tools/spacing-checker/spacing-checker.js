import { GOLDENS } from "../../assets/drc-core.js";
import { createInteractiveDrcLab } from "../../assets/interactive-drc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveDrcLab(root, {
  defaultMode: "space",
  starterHtml: `<p><strong>Your job:</strong> Find the spacing pair A–B; select both and confirm S.M1.</p>`,
  challenges: [
    { id: "run", title: "Space", level: "Intro", prompt: "Click Space.",
      setup: (_c, api) => api.runSpace(), check: (_c, api) => api.getMode() === "space" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "space count 1.",
      setup: (_c, api) => api.runSpace(), check: (_c, api) => api.getLast().count === GOLDENS.spaceViolations },
    { id: "ab", title: "A and B", level: "Practice", prompt: "shapes A,B.",
      setup: (_c, api) => api.runSpace(), check: (_c, api) => {
        const s = new Set(api.getLast().violations[0].shapes);
        return s.has("A") && s.has("B");
      } },
    { id: "sela", title: "Select A", level: "Practice", prompt: "Click shape A.",
      setup: (_c, api) => { api.runSpace(); api.selectShape("A"); }, check: (_c, api) => api.getSelectedShapes().includes("A") },
    { id: "selb", title: "Select B", level: "Practice", prompt: "Click shape B too.",
      setup: (_c, api) => { api.runSpace(); api.selectShape("A"); api.selectShape("B"); },
      check: (_c, api) => api.getSelectedShapes().includes("A") && api.getSelectedShapes().includes("B") },
    { id: "rule", title: "S.M1", level: "Practice", prompt: "rule_id S.M1.",
      setup: (_c, api) => api.runSpace(), check: (_c, api) => api.getLast().violations[0].rule_id === "S.M1" },
    { id: "gap", title: "Gap 1", level: "Practice", prompt: "gap value 1.",
      setup: (_c, api) => api.runSpace(), check: (_c, api) => api.getLast().violations[0].value === 1 },
    { id: "golden", title: "spaceViolations", level: "Challenge", prompt: "spaceViolations=1.", check: () => GOLDENS.spaceViolations === 1 },
  ],
});
