import { GOLDENS } from "../../assets/lvs-core.js";
import { createInteractiveLvsLab } from "../../assets/interactive-lvs-lab.js";
const root = document.getElementById("lab-root");

createInteractiveLvsLab(root, {
  defaultMode: "match",
  starterHtml: `<p><strong>Your job:</strong> Run match; select X0; confirm matched_devices=2, mismatch_count=0.</p>`,
  challenges: [
    { id: "run", title: "Match", level: "Intro", prompt: "Click Match.",
      setup: (_c, api) => api.runMatch(), check: (_c, api) => api.getMode() === "match" },
    { id: "m2", title: "Matched 2", level: "Intro", prompt: "count 2.",
      setup: (_c, api) => api.runMatch(), check: (_c, api) => api.getLast().count === GOLDENS.matchedDevices },
    { id: "mm0", title: "No mismatch", level: "Practice", prompt: "mismatchCount 0.",
      setup: (_c, api) => api.runMatch(), check: (_c, api) => api.getLast().mismatchCount === 0 },
    { id: "x0", title: "Select X0", level: "Practice", prompt: "Click X0.",
      setup: (_c, api) => { api.runMatch(); api.select("X0"); }, check: (_c, api) => api.getSelected().includes("X0") },
    { id: "x1", title: "Select X1", level: "Practice", prompt: "Click X1.",
      setup: (_c, api) => { api.runMatch(); api.select("X1"); }, check: (_c, api) => api.getSelected().includes("X1") },
    { id: "mn1", title: "mn1 pair", level: "Practice", prompt: "matched includes X0→mn1.",
      setup: (_c, api) => api.runMatch(), check: (_c, api) => api.getLast().matched.some(m => m.layout === "X0" && m.schematic === "mn1") },
    { id: "mp1", title: "mp1 pair", level: "Practice", prompt: "matched includes X1→mp1.",
      setup: (_c, api) => api.runMatch(), check: (_c, api) => api.getLast().matched.some(m => m.layout === "X1" && m.schematic === "mp1") },
    { id: "golden", title: "matchedDevices", level: "Challenge", prompt: "matchedDevices=2.", check: () => GOLDENS.matchedDevices === 2 },
  ],
});
