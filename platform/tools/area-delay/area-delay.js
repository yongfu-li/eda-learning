import { GOLDENS, LIBRARY, AIG_NODES } from "../../assets/synthesis-core.js";
import { createInteractiveSynthesisLab } from "../../assets/interactive-synthesis-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSynthesisLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Compare area and delay mode metrics.</p>`,
  challenges: [
    { id: "trade", title: "Tradeoff object", level: "Intro", prompt: "runTradeoff works.",
      check: (_c, api) => api.runTradeoff().librarySize === 6 },
    { id: "area", title: "Area mode", level: "Practice", prompt: "areaMode.area > 0.",
      check: (_c, api) => api.runTradeoff().areaMode.area > 0 },
    { id: "delay", title: "Delay depth", level: "Practice", prompt: "delayDepth > 0.",
      check: (_c, api) => api.runTradeoff().delayMode.delayDepth > 0 },
    { id: "tm-a", title: "Techmap area btn", level: "Practice", prompt: "Techmap area.",
      setup: (_c, api) => api.runTechmapArea(), check: (_c, api) => api.getMode()==="techmap-area" },
    { id: "tm-d", title: "Techmap delay", level: "Practice", prompt: "Techmap delay.",
      setup: (_c, api) => api.runTechmapDelay(), check: (_c, api) => api.getMode()==="techmap-delay" },
    { id: "lib", title: "Lib size", level: "Intro", prompt: "librarySize 6.", check: (_c, api) => api.runTradeoff().librarySize===6 },
    { id: "map", title: "Has mapping", level: "Practice", prompt: "After delay map, mapping exists.",
      check: (_c, api) => { api.runTechmapDelay(); return api.getMapping().length===4; } },
    { id: "golden", title: "mapAreaMin", level: "Challenge", prompt: "Area ≥ golden min.",
      check: (_c, api) => api.runTechmapArea().area >= GOLDENS.mapAreaMin },
  ],
});
