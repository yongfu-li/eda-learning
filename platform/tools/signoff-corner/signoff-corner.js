import { GOLDENS } from "../../assets/signoff-core.js";
import { createInteractiveSignoffLab } from "../../assets/interactive-signoff-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSignoffLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Pick signoff_corner ss_0p9_125 with derate=1.1.</p>`,
  challenges: [
    { id: "run", title: "SignoffCorner", level: "Intro", prompt: "Click SignoffCorner.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getMode() === "signoff_corner" },
    { id: "id", title: "ss id", level: "Intro", prompt: "corner ss_0p9_125.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().corner.id === GOLDENS.signoffCorner },
    { id: "der", title: "derate 1.1", level: "Practice", prompt: "derate 1.1.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().derate === GOLDENS.signoffDerate },
    { id: "vdd", title: "Vdd 0.9", level: "Practice", prompt: "Vdd 0.9.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().corner.vdd === 0.9 },
    { id: "temp", title: "temp 125", level: "Practice", prompt: "temp 125.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().corner.temp === 125 },
    { id: "proc", title: "process ss", level: "Practice", prompt: "process ss.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getLast().corner.process === "ss" },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode signoff_corner.",
      setup: (_c, api) => api.showSignoffCorner(), check: (_c, api) => api.getMode()==="signoff_corner" },
    { id: "golden", title: "signoffCorner", level: "Challenge", prompt: "signoffCorner=ss_0p9_125.", check: () => GOLDENS.signoffCorner === "ss_0p9_125" },
  ],
});
