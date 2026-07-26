import { GOLDENS } from "../../assets/spice-core.js";
import { createInteractiveSpiceLab } from "../../assets/interactive-spice-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSpiceLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Stamp MNA; confirm size 3.</p>`,
  challenges: [
    { id: "run", title: "Stamp", level: "Intro", prompt: "Click Stamp MNA.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getMode() === "mna" },
    { id: "sz", title: "Size 3", level: "Intro", prompt: "size is 3.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getLast().size === GOLDENS.mnaSize },
    { id: "g", title: "Has G", level: "Practice", prompt: "G is 3x3.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getLast().G.length === 3 },
    { id: "b", title: "Has b", level: "Practice", prompt: "b length 3.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getLast().b.length === 3 },
    { id: "idx", title: "Has node 2", level: "Practice", prompt: "idx has 2.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getLast().idx["2"] != null },
    { id: "vb", title: "Vin branch", level: "Practice", prompt: "vBranch Vin.",
      setup: (_c, api) => api.stampMna(), check: (_c, api) => api.getLast().vBranch.Vin != null },
    { id: "els", title: "5 elems", level: "Practice", prompt: "elementCount 5.", check: (_c, api) => api.getStats().elementCount === 5 },
    { id: "golden", title: "mnaSize", level: "Challenge", prompt: "mnaSize=3.", check: () => GOLDENS.mnaSize === 3 },
  ],
});
