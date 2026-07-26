import { GOLDENS } from "../../assets/spice-core.js";
import { createInteractiveSpiceLab } from "../../assets/interactive-spice-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSpiceLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Inspect netlist; confirm 5 elements and 2 unknowns.</p>`,
  challenges: [
    { id: "run", title: "Show netlist", level: "Intro", prompt: "Click Netlist.",
      setup: (_c, api) => api.showNetlist(), check: (_c, api) => api.getMode() === "netlist" },
    { id: "n5", title: "Five elems", level: "Intro", prompt: "elementCount 5.", check: (_c, api) => api.getStats().elementCount === GOLDENS.elementCount },
    { id: "un", title: "Two unknowns", level: "Practice", prompt: "unknownNodes 2.", check: (_c, api) => api.getStats().unknownNodes === GOLDENS.unknownNodes },
    { id: "gnd", title: "Ground 0", level: "Practice", prompt: "ground is 0.", check: (_c, api) => api.getNet().ground === "0" },
    { id: "vin", title: "Has Vin", level: "Practice", prompt: "Vin present.", check: (_c, api) => api.getNet().elements.some(e=>e.id==="Vin") },
    { id: "c", title: "Has C", level: "Practice", prompt: "Cload present.", check: (_c, api) => api.getNet().elements.some(e=>e.id==="Cload") },
    { id: "d", title: "Has D", level: "Practice", prompt: "Dprot present.", check: (_c, api) => api.getNet().elements.some(e=>e.id==="Dprot") },
    { id: "golden", title: "elementCount", level: "Challenge", prompt: "elementCount=5.", check: () => GOLDENS.elementCount === 5 },
  ],
});
