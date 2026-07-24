import { GOLDENS, PLACEMENT, CLOCK_SOURCE, CELLS } from "../../assets/clock-tree-core.js";
import { createInteractiveClockTreeLab } from "../../assets/interactive-clock-tree-lab.js";

const root = document.getElementById("lab-root");
createInteractiveClockTreeLab(root, {
  initialPositions: PLACEMENT,
  starterHtml: `<p><strong>Your job:</strong> locate six sinks and the clock source at (${CLOCK_SOURCE.x},${CLOCK_SOURCE.y}).
    Move sinks and confirm count and positions.</p>`,
  challenges: [
    { id: "six", title: "Six sinks", level: "Intro",
      prompt: "Instance has six sinks A–F.",
      check: () => CELLS.length === GOLDENS.sinkCount },
    { id: "src", title: "Source at (6,4)", level: "Intro",
      prompt: "Clock source is at (6,4).",
      check: (_c, api) => { const s = api.getSource(); return s.x === GOLDENS.sourceX && s.y === GOLDENS.sourceY; } },
    { id: "a11", title: "A at (1,1)", level: "Intro",
      prompt: "Sink A starts at (1,1) on spread.",
      check: (_c, api) => { const p = api.getPositions().A; return p.x === 1 && p.y === 1; } },
    { id: "move", title: "Move a sink", level: "Practice",
      prompt: "Move sink B so x ≥ 9.",
      check: (_c, api) => api.getPositions().B.x >= 9 },
    { id: "select", title: "Select E", level: "Practice",
      prompt: "Select sink E (click the E button).",
      check: (_c, api) => api.getSelected() === "E" },
    { id: "d85", title: "D at top", level: "Practice",
      prompt: "Keep D near (8,5).",
      check: (_c, api) => { const p = api.getPositions().D; return Math.abs(p.x - 8) < 0.6 && Math.abs(p.y - 5) < 0.6; } },
    { id: "all-ids", title: "All six ids", level: "Intro",
      prompt: "Sink list includes A through F.",
      check: (_c, api) => api.getSinks().map(s => s.id).join("") === "ABCDEF" },
    { id: "chip", title: "On chip", level: "Challenge",
      prompt: "Every sink stays inside 0..12 × 0..8.",
      check: (_c, api) => Object.values(api.getPositions()).every(p => p.x >= 0 && p.x <= 12 && p.y >= 0 && p.y <= 8) },
  ],
});
