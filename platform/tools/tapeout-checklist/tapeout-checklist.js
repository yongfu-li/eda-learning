import { GOLDENS } from "../../assets/signoff-core.js";
import { createInteractiveSignoffLab } from "../../assets/interactive-signoff-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSignoffLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Tapeout ready only after ECO; required=4.</p>`,
  challenges: [
    { id: "before", title: "Before", level: "Intro", prompt: "Tapeout before ECO not ready.",
      setup: (_c, api) => api.showTapeout(false), check: (_c, api) => api.getLast().ready === false },
    { id: "after", title: "After ECO", level: "Intro", prompt: "Apply ECO then tapeout ready.",
      setup: (_c, api) => { api.applyEco(); api.showTapeout(true); }, check: (_c, api) => api.getLast().ready === true },
    { id: "req", title: "required 4", level: "Practice", prompt: "required_count 4.",
      setup: (_c, api) => api.showTapeout(false), check: (_c, api) => api.getLast().requiredCount === GOLDENS.tapeoutRequired },
    { id: "t3", title: "t3 block", level: "Practice", prompt: "t3 blocked before ECO.",
      setup: (_c, api) => api.showTapeout(false), check: (_c, api) => api.getLast().items.find(i => i.id === "t3")?.ok === false },
    { id: "t2", title: "t2 pass", level: "Practice", prompt: "t2 pass before ECO.",
      setup: (_c, api) => api.showTapeout(false), check: (_c, api) => api.getLast().items.find(i => i.id === "t2")?.ok === true },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode tapeout.",
      setup: (_c, api) => api.showTapeout(false), check: (_c, api) => api.getMode()==="tapeout" },
    { id: "eco", title: "Apply first", level: "Practice", prompt: "Apply ECO fixes antenna gate.",
      setup: (_c, api) => api.applyEco(), check: (_c, api) => api.getLast().failCount === 0 },
    { id: "golden", title: "tapeoutAfter", level: "Challenge", prompt: "tapeoutReadyAfterEco=true.", check: () => GOLDENS.tapeoutReadyAfterEco === true },
  ],
});
