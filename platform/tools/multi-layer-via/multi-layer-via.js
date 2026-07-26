import { GOLDENS } from "../../assets/pattern-matching-core.js";
import { createInteractivePatternLab } from "../../assets/interactive-pattern-lab.js";
const root = document.getElementById("lab-root");

createInteractivePatternLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Via check: M1 OK, M2 fails.</p>`,
  challenges: [
    { id: "run", title: "Via check", level: "Intro", prompt: "Click Via check.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getMode() === "via" },
    { id: "m1", title: "m1_ok", level: "Intro", prompt: "m1_ok true.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getLast().m1_ok === true },
    { id: "m2", title: "m2 fail", level: "Practice", prompt: "m2_ok false.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getLast().m2_ok === false },
    { id: "one", title: "One marker", level: "Practice", prompt: "enclosure_markers=1.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getLast().enclosure_markers === GOLDENS.enclosureMarkers },
    { id: "type", title: "Type encl", level: "Practice", prompt: "type enclosure.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getMarkers()[0].type === "enclosure" },
    { id: "inner", title: "Inner V", level: "Practice", prompt: "inner is V.",
      setup: (_c, api) => api.viaCheck(), check: (_c, api) => api.getMarkers()[0].inner === "V" },
    { id: "sel", title: "Select V", level: "Practice", prompt: "Select V.", check: (_c, api) => { api.setSelected("V"); return api.getSelected()==="V"; } },
    { id: "golden", title: "enclosureMarkers", level: "Challenge", prompt: "enclosureMarkers=1.", check: () => GOLDENS.enclosureMarkers === 1 },
  ],
});
