import { GOLDENS, PLACEMENT, CLOCK_SOURCE, CELLS } from "../../assets/clock-tree-core.js";
import { createInteractiveClockTreeLab } from "../../assets/interactive-clock-tree-lab.js";

const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> run Zero-skew merge demo and check balanced skew.</p>`,
  challenges: [
    { id: "demo", title: "Run demo", level: "Intro",
      prompt: "Click Zero-skew merge demo.",
      setup: (_c, api) => api.zeroSkewMergeDemo(),
      check: (_c, api) => api.getTreeMode() === "zero-skew" },
    { id: "edges", title: "Has edges", level: "Intro",
      prompt: "Merge tree has edges.",
      check: (_c, api) => { if (!api.getTree()) api.zeroSkewMergeDemo(); return api.getTree().edges.length > 0; } },
    { id: "skew-le5", title: "Skew ≤ 5", level: "Practice",
      prompt: "Zero-skew demo skew ≤ 5.",
      setup: (_c, api) => api.zeroSkewMergeDemo(),
      check: (_c, api) => api.getSkew() <= 5 },
    { id: "skew-le3", title: "Skew ≤ 3", level: "Practice",
      prompt: "Skew ≤ 3 after demo.",
      check: (_c, api) => { if (api.getTreeMode() !== "zero-skew") api.zeroSkewMergeDemo(); return api.getSkew() <= 3; } },
    { id: "steiners", title: "Merge steiner", level: "Practice",
      prompt: "At least one steiner exists.",
      check: (_c, api) => { if (!api.getTree()) api.zeroSkewMergeDemo(); return (api.getTree().steiners?.length || 0) >= 1; } },
    { id: "golden", title: "Golden near zero", level: "Intro",
      prompt: "GOLDENS.spreadZeroSkewMergeSkew is 0.",
      check: () => GOLDENS.spreadZeroSkewMergeSkew === 0 },
    { id: "lat", title: "All latencies", level: "Challenge",
      prompt: "Every sink latency finite.",
      check: (_c, api) => { if (!api.getTree()) api.zeroSkewMergeDemo(); return CELLS.every(id => Number.isFinite(api.getLatency(id))); } },
    { id: "mode", title: "Mode zero-skew", level: "Intro",
      prompt: "Tree mode is zero-skew.",
      setup: (_c, api) => api.zeroSkewMergeDemo(),
      check: (_c, api) => api.getTreeMode() === "zero-skew" },
  ],
});
