import { INTERNALS_GOLDENS, partDEngine } from "../../assets/klayout-internals-core.js";
import { createInteractiveKlayoutInternalsLab } from "../../assets/interactive-klayout-internals-lab.js";
const root = document.getElementById("lab-root");

createInteractiveKlayoutInternalsLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Layout / Cell / Instance model. Use stage buttons, then Check.</p>`,
  defaultMode: "layout_cell_model",
  challenges: [
    { id: "run", title: "Run stage", level: "Intro", prompt: "Open layout_cell_model.",
      setup: (_c, api) => api.showMode("layout_cell_model"), check: (_c, api) => api.getMode() === "layout_cell_model" },
    { id: "ok", title: "Stage ok", level: "Intro", prompt: "Last ok.",
      setup: (_c, api) => api.showMode("layout_cell_model"), check: (_c, api) => api.getLast()?.ok === true },
    { id: "engine", title: "Engine", level: "Practice", prompt: "Part D engine ok.",
      setup: (_c, api) => api.runEngine(), check: (_c, api) => api.getLast()?.ok === true },
    { id: "pillars", title: "Pillars", level: "Practice", prompt: "INTERNALS_GOLDENS.pillars=3.",
      check: () => INTERNALS_GOLDENS.pillars === 3 },
    { id: "viol", title: "Part B bind", level: "Challenge", prompt: "widthViolations=1.",
      check: () => INTERNALS_GOLDENS.widthViolations === 1 },
    { id: "golden", title: "Engine golden", level: "Challenge", prompt: "partDEngine ok.",
      check: () => partDEngine().ok === true },
  ],
});
