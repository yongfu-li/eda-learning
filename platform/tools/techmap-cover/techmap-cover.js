import { GOLDENS, LIBRARY, AIG_NODES } from "../../assets/synthesis-core.js";
import { createInteractiveSynthesisLab } from "../../assets/interactive-synthesis-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSynthesisLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Map AIG to library cells by area.</p>`,
  challenges: [
    { id: "run", title: "Techmap area", level: "Intro", prompt: "Run Techmap area.",
      setup: (_c, api) => api.runTechmapArea(), check: (_c, api) => api.getMode()==="techmap-area" },
    { id: "map4", title: "4 mappings", level: "Intro", prompt: "Four mapped ANDs.",
      check: (_c, api) => { if (!api.getMapping()) api.runTechmapArea(); return api.getMapping().length===4; } },
    { id: "area", title: "Area ≥ min", level: "Practice", prompt: "Area ≥ mapAreaMin.",
      check: (_c, api) => { const m=api.runTechmapArea(); return m.area >= GOLDENS.mapAreaMin; } },
    { id: "cells", title: "Cell ids", level: "Practice", prompt: "Mappings have cell ids.",
      check: (_c, api) => { if (!api.getMapping()) api.runTechmapArea(); return api.getMapping().every(x=>x.cell); } },
    { id: "inv", title: "invCount ≥0", level: "Practice", prompt: "invCount number.",
      check: (_c, api) => typeof api.runTechmapArea().invCount === "number" },
    { id: "mode", title: "Mode", level: "Practice", prompt: "Mode techmap-area.",
      setup: (_c, api) => api.runTechmapArea(), check: (_c, api) => api.getMode()==="techmap-area" },
    { id: "clear", title: "Clear map", level: "Practice", prompt: "Clear empties mapping.",
      check: (_c, api) => { api.runTechmapArea(); api.clearMap(); return api.getMapping()==null; } },
    { id: "rerun", title: "Rerun", level: "Challenge", prompt: "Rerun after clear.",
      check: (_c, api) => { api.clearMap(); api.runTechmapArea(); return api.getMapping().length===4; } },
  ],
});
