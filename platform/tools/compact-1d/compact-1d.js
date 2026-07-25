import { GOLDENS } from "../../assets/compaction-core.js";
import { createInteractiveCompactionLab } from "../../assets/interactive-compaction-lab.js";
const root = document.getElementById("lab-root");

createInteractiveCompactionLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Compact along X and confirm 20→14.</p>`,
  challenges: [
    { id: "run", title: "Compact X", level: "Intro", prompt: "Click Compact X.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.getMode() === "compact-x" },
    { id: "after", title: "After 14", level: "Intro", prompt: "afterSpan is 14.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.getLast().afterSpan === GOLDENS.compactXWidth },
    { id: "before", title: "Before 20", level: "Practice", prompt: "beforeSpan was 20.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.getLast().beforeSpan === 20 },
    { id: "improved", title: "Improved", level: "Practice", prompt: "improved true.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.getLast().improved === true },
    { id: "width", title: "Stats width 14", level: "Practice", prompt: "layout width 14.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.getStats().width === 14 },
    { id: "legal", title: "Legal after", level: "Practice", prompt: "Still legal.",
      setup: (_c, api) => api.compactX(), check: (_c, api) => api.isLegal() },
    { id: "reset", title: "Reset restores 20", level: "Practice", prompt: "Reset → width 20.",
      check: (_c, api) => { api.compactX(); api.reset(); return api.getStats().width === 20; } },
    { id: "golden", title: "GOLDEN", level: "Challenge", prompt: "compactXWidth=14.", check: () => GOLDENS.compactXWidth === 14 },
  ],
});
