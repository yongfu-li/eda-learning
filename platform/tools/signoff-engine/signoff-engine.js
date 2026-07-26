import { GOLDENS } from "../../assets/signoff-core.js";
import { createInteractiveSignoffLab } from "../../assets/interactive-signoff-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSignoffLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run engine; confirm ok and markers=2.</p>`,
  challenges: [
    { id: "run", title: "Engine", level: "Intro", prompt: "Click Engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode() === "engine" },
    { id: "ok", title: "OK", level: "Intro", prompt: "ok true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ok === true },
    { id: "m2", title: "Markers 2", level: "Practice", prompt: "markers 2.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().markers.count === 2 },
    { id: "fail", title: "Fails 2", level: "Practice", prompt: "fail count 2 before ECO.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().checks.failCount === GOLDENS.failCount },
    { id: "eco", title: "ECO ok", level: "Practice", prompt: "fixes_all true.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().ecos.fixesAll === true },
    { id: "tape", title: "Tapeout", level: "Practice", prompt: "tapeout after ready.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getLast().tapeoutAfter.ready === true },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode engine.",
      setup: (_c, api) => api.engine(), check: (_c, api) => api.getMode()==="engine" },
    { id: "golden", title: "engineOk", level: "Challenge", prompt: "engineOk=true.", check: () => GOLDENS.engineOk === true },
  ],
});
