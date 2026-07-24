import { GOLDENS, PLACEMENT, CLOCK_SOURCE, CELLS } from "../../assets/clock-tree-core.js";
import { createInteractiveClockTreeLab } from "../../assets/interactive-clock-tree-lab.js";

const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> build an H-tree and clear skew challenges.</p>`,
  challenges: [
    { id: "build-h", title: "Build H-tree", level: "Intro",
      prompt: "Click Build H-tree.",
      setup: (_c, api) => api.buildHTree(),
      check: (_c, api) => api.getTreeMode() === "h-tree" && (api.getTree()?.edges?.length || 0) > 0 },
    { id: "edges", title: "Has edges", level: "Intro",
      prompt: "H-tree has at least 5 edges.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildHTree(); return api.getTree().edges.length >= 5; } },
    { id: "skew-le8", title: "Skew ≤ 8", level: "Practice",
      prompt: "H-tree skew ≤ 8 on spread.",
      setup: (_c, api) => api.buildHTree(),
      check: (_c, api) => api.getSkew() <= 8 },
    { id: "skew-le6", title: "Skew ≤ 6", level: "Practice",
      prompt: "H-tree skew ≤ 6.",
      check: (_c, api) => { if (api.getTreeMode() !== "h-tree") api.buildHTree(); return api.getSkew() <= 6; } },
    { id: "src-star", title: "Source present", level: "Intro",
      prompt: "Tree source matches CLK.",
      check: (_c, api) => { if (!api.getTree()) api.buildHTree(); return api.getTree().source.x === 6; } },
    { id: "all-sinks", title: "Six sinks in tree", level: "Practice",
      prompt: "Tree lists six sinks.",
      check: (_c, api) => { if (!api.getTree()) api.buildHTree(); return api.getTree().sinks.length === 6; } },
    { id: "move-rebuild", title: "Rebuild after move", level: "Challenge",
      prompt: "Move A then rebuild H-tree with finite skew.",
      check: (_c, api) => { api.buildHTree(); return Number.isFinite(api.getSkew()); } },
    { id: "vs-mmm", title: "Compare modes", level: "Challenge",
      prompt: "Build H-tree (mode is h-tree).",
      setup: (_c, api) => api.buildHTree(),
      check: (_c, api) => api.getTreeMode() === "h-tree" },
  ],
});
