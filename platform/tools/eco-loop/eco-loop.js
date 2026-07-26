import { GOLDENS } from "../../assets/signoff-core.js";
import { createInteractiveSignoffLab } from "../../assets/interactive-signoff-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSignoffLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Plan ECOs; eco_count=2 fixes sta+antenna.</p>`,
  challenges: [
    { id: "run", title: "ECO", level: "Intro", prompt: "Click ECO.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getMode() === "eco" },
    { id: "c2", title: "eco 2", level: "Intro", prompt: "eco count 2.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getLast().ecoCount === GOLDENS.ecoCount },
    { id: "all", title: "fixes all", level: "Practice", prompt: "fixes_all true.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getLast().fixesAll === true },
    { id: "e1", title: "eco1 sta", level: "Practice", prompt: "eco1 fixes sta.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getLast().ecos.find(e => e.id === "eco1")?.fixes.includes("sta") },
    { id: "e2", title: "eco2 ant", level: "Practice", prompt: "eco2 fixes antenna.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getLast().ecos.find(e => e.id === "eco2")?.fixes.includes("antenna") },
    { id: "sel", title: "Select sta", level: "Practice", prompt: "Select sta check.",
      setup: (_c, api) => api.selectCheck("sta"), check: (_c, api) => api.getSelected().includes("sta") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode eco.",
      setup: (_c, api) => api.showEco(), check: (_c, api) => api.getMode()==="eco" },
    { id: "golden", title: "ecoFixesAll", level: "Challenge", prompt: "ecoFixesAll=true.", check: () => GOLDENS.ecoFixesAll === true },
  ],
});
