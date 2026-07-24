import { GOLDENS, LIBRARY, AIG_NODES } from "../../assets/synthesis-core.js";
import { createInteractiveSynthesisLab } from "../../assets/interactive-synthesis-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSynthesisLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Run the full toy pipeline.</p>`,
  challenges: [
    { id: "run", title: "Sequential", level: "Intro", prompt: "Click Sequential synth.",
      setup: (_c, api) => api.runSequential(), check: (_c, api) => api.getMode()==="sequential" },
    { id: "seq", title: "Seq object", level: "Intro", prompt: "getSeq exists.",
      check: (_c, api) => { if (!api.getSeq()) api.runSequential(); return !!api.getSeq(); } },
    { id: "area", title: "Area >0", level: "Practice", prompt: "Mapped area >0.",
      check: (_c, api) => { if (!api.getSeq()) api.runSequential(); return api.getSeq().mapping.area > 0; } },
    { id: "cuts", title: "Cuts present", level: "Practice", prompt: "Cuts after seq.",
      check: (_c, api) => { api.runSequential(); return !!api.getCuts(); } },
    { id: "map", title: "Mapping 4", level: "Practice", prompt: "4 mapped nodes.",
      check: (_c, api) => { api.runSequential(); return api.getMapping().length===4; } },
    { id: "stats", title: "Stats AND 4", level: "Practice", prompt: "seq.stats.and=4.",
      check: (_c, api) => { api.runSequential(); return api.getSeq().stats.and===4; } },
    { id: "strash", title: "Strash entries", level: "Practice", prompt: "strashEntries=4.",
      check: (_c, api) => { api.runSequential(); return api.getSeq().strashEntries===4; } },
    { id: "mode", title: "Mode sequential", level: "Challenge", prompt: "Mode sequential.",
      setup: (_c, api) => api.runSequential(), check: (_c, api) => api.getMode()==="sequential" },
  ],
});
