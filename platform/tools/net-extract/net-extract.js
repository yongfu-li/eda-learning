import { GOLDENS } from "../../assets/lvs-core.js";
import { createInteractiveLvsLab } from "../../assets/interactive-lvs-lab.js";
const root = document.getElementById("lab-root");

createInteractiveLvsLab(root, {
  defaultMode: "extract",
  starterHtml: `<p><strong>Your job:</strong> Extract layout nets; select net_a and net_y; confirm 4 nets.</p>`,
  challenges: [
    { id: "run", title: "Extract", level: "Intro", prompt: "Click Extract.",
      setup: (_c, api) => api.runExtract(), check: (_c, api) => api.getMode() === "extract" },
    { id: "c4", title: "Four nets", level: "Intro", prompt: "count 4.",
      setup: (_c, api) => api.runExtract(), check: (_c, api) => api.getLast().count === GOLDENS.layNetCount },
    { id: "na", title: "net_a", level: "Practice", prompt: "ids include net_a.",
      setup: (_c, api) => api.runExtract(), check: (_c, api) => api.getLast().ids.includes("net_a") },
    { id: "ny", title: "net_y", level: "Practice", prompt: "ids include net_y.",
      setup: (_c, api) => api.runExtract(), check: (_c, api) => api.getLast().ids.includes("net_y") },
    { id: "sela", title: "Select net_a", level: "Practice", prompt: "Click net_a.",
      setup: (_c, api) => { api.runExtract(); api.select("net_a"); }, check: (_c, api) => api.getSelected().includes("net_a") },
    { id: "sely", title: "Select net_y", level: "Practice", prompt: "Click net_y.",
      setup: (_c, api) => { api.runExtract(); api.select("net_y"); }, check: (_c, api) => api.getSelected().includes("net_y") },
    { id: "vdd", title: "net_vdd", level: "Practice", prompt: "ids include net_vdd.",
      setup: (_c, api) => api.runExtract(), check: (_c, api) => api.getLast().ids.includes("net_vdd") },
    { id: "golden", title: "layNetCount", level: "Challenge", prompt: "layNetCount=4.", check: () => GOLDENS.layNetCount === 4 },
  ],
});
