/**
 * Real Netgen evidence core — mirrors courses/learn_netgen/common/real_solvers.py.
 */
import { drawNetgen, STARTER, GOLDENS, stageRead, stageReport } from "./netgen-core.js";
import { fitHiDpiCanvas } from "./canvas-hires.js";

export const GOLDEN_RECIPE_IDS = [
  "read_sch",
  "read_lay",
  "device_classes",
  "compare_nets",
  "lvs_report",
  "lvs_done",
];

export const CMD_PALETTE = [
  { id: "read_sch", label: "read sch", hint: "Read schematic SPICE" },
  { id: "read_lay", label: "read lay", hint: "Read layout SPICE" },
  { id: "device_classes", label: "device classes", hint: "Map nmos/pmos classes" },
  { id: "compare_nets", label: "compare nets", hint: "Match net names" },
  { id: "lvs_report", label: "lvs report", hint: "LVS summary" },
  { id: "lvs_done", label: "lvs done", hint: "Finish LVS run" },
];

export const STAGES = {
  empty: {
    id: "empty",
    title: "empty",
    schDevices: null,
    layDevices: null,
    matchedNets: null,
    matchedDevices: null,
    mismatchCount: null,
    note: "No netlists loaded yet.",
  },
  spice_vocab: {
    id: "spice_vocab",
    title: "SPICE vocabulary",
    deviceCount: 2,
    netCount: 4,
    classes: ["nmos", "pmos"],
    schDevices: null,
    layDevices: null,
    matchedNets: null,
    matchedDevices: null,
    mismatchCount: null,
    note: "SPICE device prefixes M/X; ports A,Y,VDD,VSS.",
  },
  read_spice: {
    id: "read_spice",
    title: "after read sch + lay",
    schDevices: 2,
    layDevices: 2,
    schNets: 4,
    layNets: 4,
    matchedNets: null,
    matchedDevices: null,
    mismatchCount: null,
    cell: "tiny_inv",
    note: "tiny_inv — 2 devices each side, 4 nets.",
  },
  lvs_compare: {
    id: "lvs_compare",
    title: "after compare",
    schDevices: 2,
    layDevices: 2,
    matchedNets: 4,
    matchedDevices: 2,
    mismatchCount: 0,
    note: "Four nets matched; two devices matched.",
  },
  lvs_report: {
    id: "lvs_report",
    title: "after lvs report",
    schDevices: 2,
    layDevices: 2,
    matchedNets: 4,
    matchedDevices: 2,
    mismatchCount: 0,
    classCount: 2,
    note: "LVS report: 2/2 devices, 4/4 nets, 0 mismatches.",
  },
};

export const REAL_GOLDENS = {
  schDevices: 2,
  layDevices: 2,
  matchedNets: 4,
  matchedDevices: 2,
  mismatchCount: 0,
  classCount: 2,
  cell: "tiny_inv",
  recipeIds: GOLDEN_RECIPE_IDS,
  engineOk: true,
};

export function recipePrefixOk(ids, n = null) {
  const want = n == null ? GOLDEN_RECIPE_IDS : GOLDEN_RECIPE_IDS.slice(0, n);
  return (ids || []).slice(0, want.length).join() === want.join();
}

export function stageForRecipe(ids = []) {
  if (!ids.length) return STAGES.empty;
  if (ids.includes("lvs_report") || ids.includes("lvs_done")) return STAGES.lvs_report;
  if (ids.includes("compare_nets")) return STAGES.lvs_compare;
  if (ids.includes("read_lay") || ids.includes("read_sch")) return STAGES.read_spice;
  if (ids.includes("device_classes")) return STAGES.spice_vocab;
  return STAGES.empty;
}

export function realNetgenEngine(ids = GOLDEN_RECIPE_IDS) {
  const stage = stageForRecipe(ids);
  const ok =
    recipePrefixOk(ids) &&
    stage.matchedDevices === REAL_GOLDENS.matchedDevices &&
    stage.matchedNets === REAL_GOLDENS.matchedNets &&
    stage.mismatchCount === REAL_GOLDENS.mismatchCount &&
    REAL_GOLDENS.engineOk;
  return { ok, recipeOk: recipePrefixOk(ids), stage, goldens: REAL_GOLDENS };
}

export function drawRealNetgen(canvas, opts = {}) {
  const stage = opts.stage || STAGES.empty;
  if (stage.schDevices != null && stage.id !== "empty") {
    const read = stageRead(STARTER);
    drawNetgen(canvas, {
      highlight: opts.highlight || read.highlight,
      selected: opts.selected || [],
      stageLabel: opts.stageLabel || stage.title,
      metricText:
        opts.metricText ||
        `sch=${stage.schDevices ?? "—"} lay=${stage.layDevices ?? "—"} nets=${stage.matchedNets ?? "—"} dev=${stage.matchedDevices ?? "—"} mism=${stage.mismatchCount ?? "—"}`,
    });
    return;
  }
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || stage.title || "Netgen evidence", 16, 28);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.fillText(stage.note || "", 16, 52);
}

export function hitTestRealNetgen(canvas, highlight, clientX, clientY) {
  if (!highlight?.length) return null;
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const layout = {};
  (highlight || []).forEach((id, i) => {
    layout[id] = { x: 70 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90 };
  });
  for (const [id, pos] of Object.entries(layout)) {
    if (Math.abs(x - pos.x) <= 50 && Math.abs(y - pos.y) <= 22) return id;
  }
  return null;
}
