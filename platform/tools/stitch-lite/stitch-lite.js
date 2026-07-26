import { GOLDENS } from "../../assets/multi-patterning-core.js";
import { createInteractiveMpLab } from "../../assets/interactive-multi-patterning-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMpLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Stitch C; confirm DP becomes ok.</p>`,
  challenges: [
    { id: "run", title: "Stitch", level: "Intro", prompt: "Click Stitch C.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getMode() === "stitch" },
    { id: "ok", title: "DP OK", level: "Intro", prompt: "dpOk true.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getLast().dpOk === GOLDENS.stitchMakesDp },
    { id: "c1", title: "Has C1", level: "Practice", prompt: "C1 present.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getFeatures().some(f=>f.id==="C1") },
    { id: "c2", title: "Has C2", level: "Practice", prompt: "C2 present.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getFeatures().some(f=>f.id==="C2") },
    { id: "no-c", title: "No C", level: "Practice", prompt: "C removed.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => !api.getFeatures().some(f=>f.id==="C") },
    { id: "added", title: "Added", level: "Practice", prompt: "added C1,C2.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getLast().added.join(",")==="C1,C2" },
    { id: "n7", title: "Seven feats", level: "Practice", prompt: "featureCount 7.",
      setup: (_c, api) => api.stitch(), check: (_c, api) => api.getStats().featureCount === 7 },
    { id: "golden", title: "stitchMakesDp", level: "Challenge", prompt: "stitchMakesDp true.", check: () => GOLDENS.stitchMakesDp === true },
  ],
});
