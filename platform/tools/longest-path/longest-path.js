import { GOLDENS } from "../../assets/compaction-core.js";
import { createInteractiveCompactionLab } from "../../assets/interactive-compaction-lab.js";
const root = document.getElementById("lab-root");

createInteractiveCompactionLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run longest-path on the X graph.</p>`,
  challenges: [
    { id: "run", title: "Longest X", level: "Intro", prompt: "Run longest path bookkeeping.",
      setup: (_c, api) => api.longestX(), check: (_c, api) => api.getMode() === "longest-x" },
    { id: "pos", title: "Has positions", level: "Intro", prompt: "last.positions exists.",
      setup: (_c, api) => api.longestX(), check: (_c, api) => !!api.getLast().positions },
    { id: "src0", title: "SRC at 0", level: "Practice", prompt: "SRC_X position is 0.",
      setup: (_c, api) => api.longestX(), check: (_c, api) => api.getLast().positions.SRC_X === 0 },
    { id: "graph", title: "Graph set", level: "Practice", prompt: "getGraph non-null.",
      setup: (_c, api) => api.longestX(), check: (_c, api) => !!api.getGraph() },
    { id: "compact", title: "Then compact", level: "Practice", prompt: "Compact X works after.",
      check: (_c, api) => { api.longestX(); return api.compactX().afterSpan === 14; } },
    { id: "legal", title: "Legal", level: "Practice", prompt: "Still legal before apply.", check: (_c, api) => api.isLegal() },
    { id: "width", title: "Width unchanged yet", level: "Practice", prompt: "Longest alone doesn't move geometry until compact.",
      setup: (_c, api) => api.longestX(), check: (_c, api) => api.getStats().width === 20 },
    { id: "golden", title: "compactXWidth", level: "Challenge", prompt: "compactXWidth=14.", check: () => GOLDENS.compactXWidth === 14 },
  ],
});
