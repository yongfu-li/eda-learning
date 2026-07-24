import { GOLDENS, EDGES, BUFFER_LIBRARY, SINKS } from "../../assets/buffering-core.js";
import { createInteractiveBufferingLab } from "../../assets/interactive-buffering-lab.js";

createInteractiveBufferingLab(document.getElementById("lab-root"), {
  challenges: [
    { id: "run", title: "Run VG", level: "Intro", prompt: "Click Van Ginneken.",
      setup: (_c, api) => api.runVanGinneken(),
      check: (_c, api) => api.getMode() === "van-ginneken" },
    { id: "result", title: "Has result", level: "Intro", prompt: "VG result exists.",
      check: (_c, api) => { if (!api.getVg()) api.runVanGinneken(); return !!api.getVg(); } },
    { id: "improved", title: "Improved or equal", level: "Practice",
      prompt: "bestDelay ≤ wireDelay.",
      check: (_c, api) => { if (!api.getVg()) api.runVanGinneken(); const v = api.getVg(); return v.bestDelay <= v.wireDelay + 1e-6; } },
    { id: "finite", title: "Finite delay", level: "Practice",
      prompt: "bestDelay is finite.",
      check: (_c, api) => { if (!api.getVg()) api.runVanGinneken(); return Number.isFinite(api.getVg().bestDelay); } },
    { id: "sites", title: "Sites shown", level: "Practice",
      prompt: "Sites populated after VG.",
      check: (_c, api) => { if (!api.getVg()) api.runVanGinneken(); return api.getSites().length > 0; } },
    { id: "per-edge", title: "Three edge results", level: "Practice",
      prompt: "perEdge has e0,e1,e2.",
      check: (_c, api) => { if (!api.getVg()) api.runVanGinneken(); const p = api.getVg().perEdge; return p.e0 && p.e1 && p.e2; } },
    { id: "golden", title: "vgImproves golden", level: "Intro", prompt: "GOLDENS.vgImproves is true.",
      check: () => GOLDENS.vgImproves === true },
    { id: "rebuild", title: "Rebuild after move", level: "Challenge",
      prompt: "Move S2 then rerun VG with finite delay.",
      check: (_c, api) => { api.runVanGinneken(); return Number.isFinite(api.getVg().bestDelay); } },
  ],
});
