import { GOLDENS } from "../../assets/dft-core.js";

import { createInteractiveDftLab } from "../../assets/interactive-dft-lab.js";

const root = document.getElementById("lab-root");


createInteractiveDftLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Verify scan_order covers all flops; chain_length=4.</p>`,
  challenges: [
    { id: "run", title: "Order", level: "Intro", prompt: "Click Order.",

      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getMode() === "order" },

    { id: "len", title: "Length 4", level: "Intro", prompt: "chain length 4.",

      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getLast().length === GOLDENS.chainLength },

    { id: "cov", title: "Covers all", level: "Practice", prompt: "covers_all true.",

      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getLast().coversAll === true },

    { id: "head", title: "Head f1", level: "Practice", prompt: "First flop f1.",

      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getLast().order[0] === "f1" },

    { id: "tail", title: "Tail f4", level: "Practice", prompt: "Last flop f4.",

      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getLast().order[3] === "f4" },

    { id: "sel", title: "Select f2", level: "Practice", prompt: "Select f2.",

      setup: (_c, api) => api.selectFlop("f2"), check: (_c, api) => api.getSelected().includes("f2") },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode order.",

      setup: (_c, api) => api.showOrder(), check: (_c, api) => api.getMode()==="order" },

    { id: "golden", title: "chainLength", level: "Challenge", prompt: "chainLength=4.", check: () => GOLDENS.chainLength === 4 },
  ],
});
