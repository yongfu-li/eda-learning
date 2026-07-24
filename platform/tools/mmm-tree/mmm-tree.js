import { GOLDENS, PLACEMENT, CLOCK_SOURCE, CELLS } from "../../assets/clock-tree-core.js";
import { createInteractiveClockTreeLab } from "../../assets/interactive-clock-tree-lab.js";

const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> build MMM and compare skew to H-tree.</p>`,
  challenges: [
    { id: "build-m", title: "Build MMM", level: "Intro",
      prompt: "Click Build MMM.",
      setup: (_c, api) => api.buildMMM(),
      check: (_c, api) => api.getTreeMode() === "mmm" },
    { id: "edges", title: "Edges exist", level: "Intro",
      prompt: "MMM has edges.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return api.getTree().edges.length > 0; } },
    { id: "skew-le10", title: "Skew ≤ 10", level: "Practice",
      prompt: "MMM skew ≤ 10.",
      setup: (_c, api) => api.buildMMM(),
      check: (_c, api) => api.getSkew() <= 10 },
    { id: "steiners", title: "Has steiners", level: "Practice",
      prompt: "MMM creates at least one steiner.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return (api.getTree().steiners?.length || 0) >= 1; } },
    { id: "skew-le7", title: "Skew ≤ 7", level: "Practice",
      prompt: "MMM skew ≤ 7 on spread.",
      check: (_c, api) => { if (api.getTreeMode() !== "mmm") api.buildMMM(); return api.getSkew() <= 7; } },
    { id: "lat-f", title: "Latency F", level: "Practice",
      prompt: "Latency to F is finite.",
      check: (_c, api) => { if (!api.getTree()) api.buildMMM(); return Number.isFinite(api.getLatency("F")); } },
    { id: "rebuild", title: "Rebuild after move", level: "Challenge",
      prompt: "Move C then rebuild MMM.",
      check: (_c, api) => { api.buildMMM(); return api.getTreeMode() === "mmm"; } },
    { id: "better", title: "Skew documented", level: "Intro",
      prompt: "GOLDENS.spreadMmmSkew is documented.",
      check: () => Number.isFinite(GOLDENS.spreadMmmSkew) },
  ],
});
