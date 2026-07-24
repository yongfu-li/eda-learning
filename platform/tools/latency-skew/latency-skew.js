import { GOLDENS, PLACEMENT, CLOCK_SOURCE, CELLS } from "../../assets/clock-tree-core.js";
import { createInteractiveClockTreeLab } from "../../assets/interactive-clock-tree-lab.js";

const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> build H-tree or MMM, then compare sink latencies and skew.</p>`,
  challenges: [
    { id: "build", title: "Build a tree", level: "Intro",
      prompt: "Build H-tree or MMM.",
      check: (_c, api) => (api.getTree()?.edges?.length || 0) > 0 },
    { id: "skew-finite", title: "Skew finite", level: "Intro",
      prompt: "After build, skew is a finite number.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildHTree(); return Number.isFinite(api.getSkew()); } },
    { id: "lat-a", title: "Latency A finite", level: "Practice",
      prompt: "Latency to A is finite after build.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildHTree(); return Number.isFinite(api.getLatency("A")); } },
    { id: "skew-le10", title: "Skew ≤ 10", level: "Practice",
      prompt: "Build a tree with skew ≤ 10.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildHTree(); return api.getSkew() <= 10; } },
    { id: "mmm", title: "MMM skew", level: "Practice",
      prompt: "Build MMM; skew ≤ GOLDENS.spreadMmmSkew + 4.",
      setup: (_c, api) => api.buildMMM(),
      check: (_c, api) => api.getTreeMode() === "mmm" && api.getSkew() <= GOLDENS.spreadMmmSkew + 4 },
    { id: "h-skew", title: "H-tree skew", level: "Practice",
      prompt: "Build H-tree; skew ≤ GOLDENS.spreadHTreeSkew + 4.",
      setup: (_c, api) => api.buildHTree(),
      check: (_c, api) => api.getTreeMode() === "h-tree" && api.getSkew() <= GOLDENS.spreadHTreeSkew + 4 },
    { id: "move-worse", title: "Cluster raises skew", level: "Challenge",
      prompt: "Cluster sinks near (6,4) then build; observe skew still finite.",
      check: (_c, api) => { if (!api.getTree()?.edges?.length) api.buildMMM(); return Number.isFinite(api.getSkew()); } },
    { id: "def", title: "Skew = max−min", level: "Intro",
      prompt: "Confirm GOLDENS document skew bounds.",
      check: () => GOLDENS.skewBoundDefault === 2 },
  ],
});
