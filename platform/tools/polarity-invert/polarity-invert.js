import { GOLDENS, EDGES, BUFFER_LIBRARY, SINKS } from "../../assets/buffering-core.js";
import { createInteractiveBufferingLab } from "../../assets/interactive-buffering-lab.js";

createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "inv", title: "INV exists", level: "Intro", prompt: "Library has INV_X1.",
      check: () => BUFFER_LIBRARY.some(b => b.id === "INV_X1" && b.invert) },
    { id: "one", title: "One flip", level: "Practice", prompt: "One INV → flips=1.",
      check: (_c, api) => api.polarityFix([{ buf: "INV_X1" }]).flips === 1 },
    { id: "neg", title: "Negative", level: "Practice", prompt: "One INV → not positive.",
      check: (_c, api) => api.polarityFix([{ buf: "INV_X1" }]).positive === false },
    { id: "two", title: "Two flips", level: "Practice", prompt: "Two INV → positive.",
      check: (_c, api) => api.polarityFix([{ buf: "INV_X1" }, { buf: "INV_X1" }]).positive === true },
    { id: "buf", title: "BUF no flip", level: "Practice", prompt: "BUF_X1 alone stays positive.",
      check: (_c, api) => api.polarityFix([{ buf: "BUF_X1" }]).positive === true },
    { id: "mix", title: "Mix", level: "Practice",
      prompt: "INV+BUF → flips=1.",
      check: (_c, api) => api.polarityFix([{ buf: "INV_X1" }, { buf: "BUF_X1" }]).flips === 1 },
    { id: "lib", title: "Three cells", level: "Intro", prompt: "Three library cells.",
      check: (_c, api) => api.getLibrary().length === 3 },
    { id: "zero", title: "Empty path", level: "Challenge", prompt: "Empty path positive.",
      check: (_c, api) => api.polarityFix([]).positive === true },
  ],
});
