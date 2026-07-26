import { GOLDENS } from "../../assets/erc-core.js";
import { createInteractiveErcLab } from "../../assets/interactive-erc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveErcLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Confirm short1 bridges vdd↔vss.</p>`,
  challenges: [
    { id: "run", title: "Shorts", level: "Intro", prompt: "Click Shorts.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getMode() === "shorts" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "short count 1.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getLast().count === GOLDENS.supplyShortCount },
    { id: "id", title: "short1", level: "Practice", prompt: "hit inst short1.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getLast().hits[0].inst==="short1" },
    { id: "selv", title: "Select vdd", level: "Practice", prompt: "Select vdd.",
      setup: (_c, api) => api.selectNet("vdd"), check: (_c, api) => api.getSelected().includes("vdd") },
    { id: "nets", title: "Has vss", level: "Practice", prompt: "hit nets include vss.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getLast().hits[0].nets.includes("vss") },
    { id: "mk", title: "Marker", level: "Practice", prompt: "markers nonempty.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getMarkers().length >= 1 },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode shorts.",
      setup: (_c, api) => api.checkShorts(), check: (_c, api) => api.getMode()==="shorts" },
    { id: "golden", title: "supplyShortCount", level: "Challenge", prompt: "supplyShortCount=1.", check: () => GOLDENS.supplyShortCount === 1 },
  ],
});
