import { GOLDENS } from "../../assets/lvs-core.js";
import { createInteractiveLvsLab } from "../../assets/interactive-lvs-lab.js";
const root = document.getElementById("lab-root");

createInteractiveLvsLab(root, {
  defaultMode: "recognize",
  starterHtml: `<p><strong>Your job:</strong> Recognize layout MOS; select X0/X1 and confirm nmos=1, pmos=1.</p>`,
  challenges: [
    { id: "run", title: "Recognize", level: "Intro", prompt: "Click Recognize.",
      setup: (_c, api) => api.runRecognize(), check: (_c, api) => api.getMode() === "recognize" },
    { id: "c2", title: "Two devices", level: "Intro", prompt: "count 2.",
      setup: (_c, api) => api.runRecognize(), check: (_c, api) => api.getLast().count === GOLDENS.layDeviceCount },
    { id: "n1", title: "One nmos", level: "Practice", prompt: "nmos 1.",
      setup: (_c, api) => api.runRecognize(), check: (_c, api) => api.getLast().nmos === GOLDENS.recogNmos },
    { id: "p1", title: "One pmos", level: "Practice", prompt: "pmos 1.",
      setup: (_c, api) => api.runRecognize(), check: (_c, api) => api.getLast().pmos === GOLDENS.recogPmos },
    { id: "x0", title: "Select X0", level: "Practice", prompt: "Click X0.",
      setup: (_c, api) => { api.runRecognize(); api.select("X0"); }, check: (_c, api) => api.getSelected().includes("X0") },
    { id: "x1", title: "Select X1", level: "Practice", prompt: "Click X1.",
      setup: (_c, api) => { api.runRecognize(); api.select("X1"); }, check: (_c, api) => api.getSelected().includes("X1") },
    { id: "sh9", title: "Nine shapes", level: "Practice", prompt: "shapeCount 9.",
      setup: (_c, api) => api.runRecognize(), check: (_c, api) => api.getLast().shapeCount === GOLDENS.layShapeCount },
    { id: "golden", title: "recogNmos", level: "Challenge", prompt: "recogNmos=1.", check: () => GOLDENS.recogNmos === 1 },
  ],
});
