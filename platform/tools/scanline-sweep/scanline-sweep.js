import { GOLDENS } from "../../assets/pattern-matching-core.js";
import { createInteractivePatternLab } from "../../assets/interactive-pattern-lab.js";
const root = document.getElementById("lab-root");

createInteractivePatternLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Build M1 scanline events; confirm 6.</p>`,
  challenges: [
    { id: "run", title: "Run scanline", level: "Intro", prompt: "Click Scanline M1.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => api.getMode() === "scanline" },
    { id: "six", title: "Six events", level: "Intro", prompt: "6 events.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => api.getLast().events.length === GOLDENS.scanEventsM1 },
    { id: "enter", title: "Has enter", level: "Practice", prompt: "Has enter kind.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => api.getLast().events.some(e => e.kind==="enter") },
    { id: "leave", title: "Has leave", level: "Practice", prompt: "Has leave kind.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => api.getLast().events.some(e => e.kind==="leave") },
    { id: "a", title: "Includes A", level: "Practice", prompt: "Events mention A.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => api.getLast().events.some(e => e.shape==="A") },
    { id: "sorted", title: "Sorted x", level: "Practice", prompt: "Nondecreasing x.",
      setup: (_c, api) => api.scanline(), check: (_c, api) => { const e=api.getLast().events; return e.every((x,i)=> i===0 || e[i-1].x<=x.x); } },
    { id: "m1", title: "M1 shapes 3", level: "Practice", prompt: "m1ShapeCount 3.", check: (_c, api) => api.getStats().m1ShapeCount === 3 },
    { id: "golden", title: "scanEventsM1", level: "Challenge", prompt: "scanEventsM1=6.", check: () => GOLDENS.scanEventsM1 === 6 },
  ],
});
