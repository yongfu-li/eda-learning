import { GOLDENS } from "../../assets/multi-patterning-core.js";
import { createInteractiveMpLab } from "../../assets/interactive-multi-patterning-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMpLab(root, {
  starterHtml: `<p><strong>Your job:</strong> SADP mandrels; confirm count 3.</p>`,
  challenges: [
    { id: "run", title: "Run SADP", level: "Intro", prompt: "Click SADP.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getMode() === "sadp" },
    { id: "n3", title: "Mandrels 3", level: "Intro", prompt: "mandrelCount 3.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getLast().mandrelCount === GOLDENS.sadpMandrelCount },
    { id: "has-a", title: "Has A", level: "Practice", prompt: "A is mandrel.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getLast().mandrels.includes("A") },
    { id: "has-d", title: "Has D", level: "Practice", prompt: "D is mandrel.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getLast().mandrels.includes("D") },
    { id: "sp", title: "Has spacers", level: "Practice", prompt: "spacers nonempty.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getLast().spacers.length > 0 },
    { id: "ok", title: "ok", level: "Practice", prompt: "ok true.",
      setup: (_c, api) => api.sadp(), check: (_c, api) => api.getLast().ok === true },
    { id: "sel", title: "Select A", level: "Practice", prompt: "Select A.", check: (_c, api) => { api.setSelected("A"); return api.getSelected()==="A"; } },
    { id: "golden", title: "sadpMandrelCount", level: "Challenge", prompt: "sadpMandrelCount=3.", check: () => GOLDENS.sadpMandrelCount === 3 },
  ],
});
