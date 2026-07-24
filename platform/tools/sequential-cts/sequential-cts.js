import { GOLDENS, PLACEMENT, CLOCK_SOURCE, CELLS } from "../../assets/clock-tree-core.js";
import { createInteractiveClockTreeLab } from "../../assets/interactive-clock-tree-lab.js";

const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> run Sequential CTS, optionally buffer, and clear skew.</p>`,
  challenges: [
    { id: "seq", title: "Run sequential", level: "Intro",
      prompt: "Click Sequential CTS.",
      setup: (_c, api) => api.sequentialCts(),
      check: (_c, api) => api.getTreeMode() === "sequential" },
    { id: "edges", title: "Has edges", level: "Intro",
      prompt: "Sequential tree has edges.",
      check: (_c, api) => { if (!api.getTree()) api.sequentialCts(); return api.getTree().edges.length > 0; } },
    { id: "six", title: "Six sinks", level: "Intro",
      prompt: "Tree lists six sinks.",
      check: (_c, api) => { if (!api.getTree()) api.sequentialCts(); return api.getTree().sinks.length === 6; } },
    { id: "skew-le12", title: "Skew ≤ 12", level: "Practice",
      prompt: "Sequential skew ≤ 12.",
      setup: (_c, api) => api.sequentialCts(),
      check: (_c, api) => api.getSkew() <= 12 },
    { id: "skew-le8", title: "Skew ≤ 8", level: "Practice",
      prompt: "Skew ≤ 8 (move sinks or compare MMM).",
      check: (_c, api) => { if (!api.getTree()) api.sequentialCts(); return api.getSkew() <= 8; } },
    { id: "buf", title: "Buffer sequential", level: "Practice",
      prompt: "Sequential then Insert buffers.",
      setup: (_c, api) => { api.sequentialCts(); api.insertBuffers(); },
      check: (_c, api) => String(api.getTreeMode()).includes("buf") },
    { id: "lat", title: "All latencies", level: "Challenge",
      prompt: "Every sink has finite latency.",
      check: (_c, api) => { if (!api.getTree()) api.sequentialCts(); return CELLS.every(id => Number.isFinite(api.getLatency(id))); } },
    { id: "golden", title: "Golden documented", level: "Intro",
      prompt: "GOLDENS.spreadSequentialSkew is finite.",
      check: () => Number.isFinite(GOLDENS.spreadSequentialSkew) },
  ],
});
