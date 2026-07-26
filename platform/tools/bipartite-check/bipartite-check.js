import { GOLDENS } from "../../assets/multi-patterning-core.js";
import { createInteractiveMpLab } from "../../assets/interactive-multi-patterning-lab.js";
const root = document.getElementById("lab-root");

createInteractiveMpLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Path DEF is 2-colorable.</p>`,
  challenges: [
    { id: "run", title: "Path DEF", level: "Intro", prompt: "Click Path DEF.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getMode() === "path-lele" },
    { id: "ok", title: "Path OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getLast().ok === GOLDENS.pathDpColorable },
    { id: "d", title: "Colors D", level: "Practice", prompt: "D colored.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getLast().colors.D != null },
    { id: "e", title: "Colors E", level: "Practice", prompt: "E colored.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getLast().colors.E != null },
    { id: "alt", title: "D≠E", level: "Practice", prompt: "D and E differ.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getLast().colors.D !== api.getLast().colors.E },
    { id: "f", title: "D=F", level: "Practice", prompt: "D and F same.",
      setup: (_c, api) => api.pathLele(), check: (_c, api) => api.getLast().colors.D === api.getLast().colors.F },
    { id: "sel", title: "Select E", level: "Practice", prompt: "Select E.", check: (_c, api) => { api.setSelected("E"); return api.getSelected()==="E"; } },
    { id: "golden", title: "pathDpColorable", level: "Challenge", prompt: "pathDpColorable true.", check: () => GOLDENS.pathDpColorable === true },
  ],
});
