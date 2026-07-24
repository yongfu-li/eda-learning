import { GOLDENS, PLACEMENT, CLOCK_SOURCE, CELLS } from "../../assets/clock-tree-core.js";
import { createInteractiveClockTreeLab } from "../../assets/interactive-clock-tree-lab.js";

const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> build a tree and inspect tapping points (branch steiners).</p>`,
  challenges: [
    { id: "build", title: "Build tree", level: "Intro",
      prompt: "Build MMM or H-tree.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildMMM(); return api.getTree().edges.length > 0; } },
    { id: "taps", title: "Has taps", level: "Practice",
      prompt: "tappingPoints returns ≥ 1 point.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return api.tappingPoints().length >= 1; } },
    { id: "mmm-taps", title: "MMM taps", level: "Practice",
      prompt: "MMM has taps.",
      setup: (_c, api) => api.buildMMM(),
      check: (_c, api) => api.tappingPoints().length >= 1 },
    { id: "h-taps", title: "H-tree taps", level: "Practice",
      prompt: "H-tree has taps or steiners.",
      setup: (_c, api) => api.buildHTree(),
      check: (_c, api) => api.tappingPoints().length >= 1 || (api.getTree().steiners?.length || 0) >= 1 },
    { id: "count", title: "Tap count ≥ 1", level: "Intro",
      prompt: "At least one branch point.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return api.tappingPoints().length >= 1; } },
    { id: "skew", title: "Skew still finite", level: "Practice",
      prompt: "Skew finite after build.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return Number.isFinite(api.getSkew()); } },
    { id: "rebuild", title: "Taps after move", level: "Challenge",
      prompt: "Move sinks, rebuild, still have taps.",
      check: (_c, api) => { api.buildMMM(); return api.tappingPoints().length >= 1; } },
    { id: "mode", title: "Tree built", level: "Intro",
      prompt: "Tree mode is set.",
      check: (_c, api) => { if (!api.getTreeMode()) api.buildMMM(); return !!api.getTreeMode(); } },
  ],
});
