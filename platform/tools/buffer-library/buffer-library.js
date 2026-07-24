import { GOLDENS, EDGES, BUFFER_LIBRARY, SINKS } from "../../assets/buffering-core.js";
import { createInteractiveBufferingLab } from "../../assets/interactive-buffering-lab.js";

createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "three", title: "Three cells", level: "Intro", prompt: "Library has three cells.",
      check: () => BUFFER_LIBRARY.length === GOLDENS.libCount },
    { id: "x1", title: "Has BUF_X1", level: "Intro", prompt: "BUF_X1 exists.",
      check: () => BUFFER_LIBRARY.some(b => b.id === "BUF_X1") },
    { id: "inv", title: "Has INV", level: "Intro", prompt: "INV_X1 inverts.",
      check: () => BUFFER_LIBRARY.find(b => b.id === "INV_X1")?.invert === true },
    { id: "x2", title: "X2 stronger rout", level: "Practice", prompt: "BUF_X2 rout < BUF_X1 rout.",
      check: () => BUFFER_LIBRARY.find(b => b.id === "BUF_X2").rout < BUFFER_LIBRARY.find(b => b.id === "BUF_X1").rout },
    { id: "vg", title: "VG uses library", level: "Practice", prompt: "Run Van Ginneken.",
      setup: (_c, api) => api.runVanGinneken(),
      check: (_c, api) => api.getMode() === "van-ginneken" },
    { id: "api", title: "getLibrary", level: "Practice", prompt: "API returns three cells.",
      check: (_c, api) => api.getLibrary().length === 3 },
    { id: "cin", title: "All have cin", level: "Practice", prompt: "Every cell has cin > 0.",
      check: () => BUFFER_LIBRARY.every(b => b.cin > 0) },
    { id: "golden", title: "libCount", level: "Intro", prompt: "GOLDENS.libCount is 3.",
      check: () => GOLDENS.libCount === 3 },
  ],
});
