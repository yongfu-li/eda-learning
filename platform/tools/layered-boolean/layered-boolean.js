import { GOLDENS } from "../../assets/pattern-matching-core.js";
import { createInteractivePatternLab } from "../../assets/interactive-pattern-lab.js";
const root = document.getElementById("lab-root");

createInteractivePatternLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Boolean and_not hits V.</p>`,
  challenges: [
    { id: "run", title: "Boolean", level: "Intro", prompt: "Click Boolean and_not.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getMode() === "boolean" },
    { id: "one", title: "One hit", level: "Intro", prompt: "hits.length=1.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getLast().hits.length === GOLDENS.booleanAndHits },
    { id: "v", title: "On V", level: "Practice", prompt: "hit shape V.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getLast().hits[0].shape === "V" },
    { id: "m1", title: "m1 true", level: "Practice", prompt: "m1 covered.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getLast().hits[0].m1 === true },
    { id: "m2", title: "m2 false", level: "Practice", prompt: "m2 not covered.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getLast().hits[0].m2 === false },
    { id: "mode", title: "Mode and_not", level: "Practice", prompt: "mode and_not.",
      setup: (_c, api) => api.booleanAndNot(), check: (_c, api) => api.getLast().hits[0].mode === "and_not" },
    { id: "sel", title: "Select V", level: "Practice", prompt: "Select V.", check: (_c, api) => { api.setSelected("V"); return api.getSelected()==="V"; } },
    { id: "golden", title: "booleanAndHits", level: "Challenge", prompt: "booleanAndHits=1.", check: () => GOLDENS.booleanAndHits === 1 },
  ],
});
