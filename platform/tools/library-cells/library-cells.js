import { GOLDENS, LIBRARY, AIG_NODES } from "../../assets/synthesis-core.js";
import { createInteractiveSynthesisLab } from "../../assets/interactive-synthesis-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSynthesisLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Inspect the six-cell library.</p>`,
  challenges: [
    { id: "six", title: "Six cells", level: "Intro", prompt: "Library length 6.", check: () => LIBRARY.length === GOLDENS.libCount },
    { id: "and2", title: "Has AND2", level: "Intro", prompt: "AND2 present.", check: () => LIBRARY.some(c => c.id==="AND2") },
    { id: "inv", title: "Has INV", level: "Intro", prompt: "INV present.", check: () => LIBRARY.some(c => c.id==="INV") },
    { id: "api", title: "getLibrary", level: "Practice", prompt: "API library length 6.", check: (_c, api) => api.getLibrary().length === 6 },
    { id: "area", title: "AND2 area 2", level: "Practice", prompt: "AND2.area=2.", check: () => LIBRARY.find(c=>c.id==="AND2").area === 2 },
    { id: "map", title: "Techmap runs", level: "Practice", prompt: "Techmap area mode.",
      setup: (_c, api) => api.runTechmapArea(), check: (_c, api) => api.getMode()==="techmap-area" },
    { id: "nor", title: "NOR2", level: "Practice", prompt: "NOR2 in library.", check: () => LIBRARY.some(c=>c.id==="NOR2") },
    { id: "golden", title: "libCount", level: "Intro", prompt: "GOLDENS.libCount=6.", check: () => GOLDENS.libCount===6 },
  ],
});
