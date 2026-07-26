import { GOLDENS } from "../../assets/erc-core.js";
import { createInteractiveErcLab } from "../../assets/interactive-erc-lab.js";
const root = document.getElementById("lab-root");

createInteractiveErcLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Confirm nw1 nwell error.</p>`,
  challenges: [
    { id: "run", title: "Wells", level: "Intro", prompt: "Click Wells.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getMode() === "wells" },
    { id: "c1", title: "Count 1", level: "Intro", prompt: "well errors 1.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getLast().count === GOLDENS.wellErrorCount },
    { id: "nw1", title: "nw1", level: "Practice", prompt: "hit id nw1.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getLast().hits[0].id==="nw1" },
    { id: "exp", title: "Expect power", level: "Practice", prompt: "expected power.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getLast().hits[0].expected==="power" },
    { id: "sel", title: "Select well_n", level: "Practice", prompt: "Select well_n.",
      setup: (_c, api) => api.selectNet("well_n"), check: (_c, api) => api.getSelected().includes("well_n") },
    { id: "got", title: "Got ground", level: "Practice", prompt: "got ground.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getLast().hits[0].got==="ground" },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode wells.",
      setup: (_c, api) => api.checkWells(), check: (_c, api) => api.getMode()==="wells" },
    { id: "golden", title: "wellErrorCount", level: "Challenge", prompt: "wellErrorCount=1.", check: () => GOLDENS.wellErrorCount === 1 },
  ],
});
