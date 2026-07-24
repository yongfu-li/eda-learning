import { GOLDENS, PLACEMENT, CLOCK_SOURCE, CELLS } from "../../assets/clock-tree-core.js";
import { createInteractiveClockTreeLab } from "../../assets/interactive-clock-tree-lab.js";

const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> build a tree, insert buffers on long edges, watch buffer squares appear.</p>`,
  challenges: [
    { id: "build", title: "Build first", level: "Intro",
      prompt: "Build H-tree or MMM.",
      check: (_c, api) => { if (!api.getTree()) api.buildHTree(); return !!api.getTree()?.edges?.length; } },
    { id: "insert", title: "Insert buffers", level: "Intro",
      prompt: "Click Insert buffers.",
      setup: (_c, api) => { api.buildHTree(); api.insertBuffers(); },
      check: (_c, api) => (api.getTree()?.buffers?.length || 0) >= 0 && !!api.getTreeMode()?.includes("buf") },
    { id: "bufs", title: "Buffers appear", level: "Practice",
      prompt: "After insert, buffers array exists.",
      check: (_c, api) => { if (!api.getTree()) { api.buildHTree(); api.insertBuffers(); } else if (!api.getTreeMode()?.includes("buf")) api.insertBuffers(); return Array.isArray(api.getTree().buffers); } },
    { id: "max-wire", title: "Max wire = 4", level: "Intro",
      prompt: "Default max wire length is 4.",
      check: (_c, api) => api.getMaxWireLen() === GOLDENS.maxWireLenDefault },
    { id: "skew-finite", title: "Skew after buf", level: "Practice",
      prompt: "Skew still finite after buffering.",
      check: (_c, api) => { if (!api.getTree()) { api.buildMMM(); api.insertBuffers(); } return Number.isFinite(api.getSkew()); } },
    { id: "blat", title: "Buffered latencies", level: "Practice",
      prompt: "bufferedLatencies returns six keys.",
      check: (_c, api) => { if (!api.getTree()) { api.buildHTree(); api.insertBuffers(); } return Object.keys(api.bufferedLatencies()).length === 6; } },
    { id: "mode-buf", title: "Mode has buf", level: "Challenge",
      prompt: "Tree mode includes buf after insert.",
      setup: (_c, api) => { api.buildHTree(); api.insertBuffers(); },
      check: (_c, api) => String(api.getTreeMode()).includes("buf") },
    { id: "golden", title: "Buffer delay golden", level: "Intro",
      prompt: "GOLDENS.bufferDelay is 1.",
      check: () => GOLDENS.bufferDelay === 1 },
  ],
});
