import { GOLDENS } from "../../assets/dft-core.js";

import { createInteractiveDftLab } from "../../assets/interactive-dft-lab.js";

const root = document.getElementById("lab-root");


createInteractiveDftLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Find lockup on d0→d1 crossing; lockup_count=1 on f3→f4.</p>`,
  challenges: [
    { id: "run", title: "Lockup", level: "Intro", prompt: "Click Lockup.",

      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getMode() === "lockup" },

    { id: "c1", title: "Count 1", level: "Intro", prompt: "lockup count 1.",

      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getLast().count === GOLDENS.lockupCount },

    { id: "f34", title: "f3→f4", level: "Practice", prompt: "Lockup between f3 and f4.",

      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getLast().hits[0].from === "f3" && api.getLast().hits[0].to === "f4" },

    { id: "dom", title: "d0→d1", level: "Practice", prompt: "Domains d0 and d1.",

      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getLast().hits[0].domains.join(",") === "d0,d1" },

    { id: "sel", title: "Select f4", level: "Practice", prompt: "Select f4.",

      setup: (_c, api) => api.selectFlop("f4"), check: (_c, api) => api.getSelected().includes("f4") },

    { id: "mark", title: "Marker", level: "Practice", prompt: "One lockup marker shown.",

      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getMarkers().length === 1 },

    { id: "mode", title: "Mode", level: "Practice", prompt: "mode lockup.",

      setup: (_c, api) => api.showLockup(), check: (_c, api) => api.getMode()==="lockup" },

    { id: "golden", title: "lockupCount", level: "Challenge", prompt: "lockupCount=1.", check: () => GOLDENS.lockupCount === 1 },
  ],
});
