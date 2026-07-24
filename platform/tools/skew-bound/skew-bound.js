import { GOLDENS, PLACEMENT, CLOCK_SOURCE, CELLS } from "../../assets/clock-tree-core.js";
import { createInteractiveClockTreeLab } from "../../assets/interactive-clock-tree-lab.js";

const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> meet skew bound ${GOLDENS.skewBoundDefault} (or relax by moving sinks).</p>`,
  challenges: [
    { id: "bound", title: "Bound is 2", level: "Intro",
      prompt: "Default skew bound is 2.",
      check: (_c, api) => api.getSkewBound() === GOLDENS.skewBoundDefault },
    { id: "build", title: "Build tree", level: "Intro",
      prompt: "Build any tree.",
      check: (_c, api) => { if (!api.getTree()) api.buildHTree(); return !!api.getTree()?.edges?.length; } },
    { id: "check-fn", title: "skewBoundOk API", level: "Practice",
      prompt: "Call skewBoundOk after zero-skew demo.",
      setup: (_c, api) => api.zeroSkewMergeDemo(),
      check: (_c, api) => typeof api.skewBoundOk() === "boolean" },
    { id: "zs-ok", title: "Zero-skew meets bound", level: "Practice",
      prompt: "Zero-skew merge meets bound 2 (or skew ≤ 3).",
      setup: (_c, api) => api.zeroSkewMergeDemo(),
      check: (_c, api) => api.skewBoundOk() || api.getSkew() <= 3 },
    { id: "le4", title: "Skew ≤ 4", level: "Practice",
      prompt: "Any topology with skew ≤ 4.",
      check: (_c, api) => { if (!api.getTree()) api.zeroSkewMergeDemo(); return api.getSkew() <= 4; } },
    { id: "le2", title: "Skew ≤ 2", level: "Challenge",
      prompt: "Meet skew ≤ 2 (try zero-skew or move sinks).",
      check: (_c, api) => { if (!api.getTree()) api.zeroSkewMergeDemo(); return api.getSkew() <= 2; } },
    { id: "buf-help", title: "Buffer then check", level: "Challenge",
      prompt: "Build, buffer, skew still finite.",
      check: (_c, api) => { api.buildMMM(); api.insertBuffers(); return Number.isFinite(api.getSkew()); } },
    { id: "api", title: "Bound readable", level: "Intro",
      prompt: "getSkewBound returns a number.",
      check: (_c, api) => Number.isFinite(api.getSkewBound()) },
  ],
});
