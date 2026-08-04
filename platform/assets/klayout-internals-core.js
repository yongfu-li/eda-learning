/**
 * Part D — KLayout internals (mirrors internals_solvers.py)
 */
import { drawKlayout, STARTER } from "./klayout-core.js";

export const INTERNALS_GOLDENS = {
  pillars: 3,
  pillarsNames: ["Layout", "Cell", "Instance"],
  drcStages: ["load_layout", "load_drc", "run_drc", "emit_markers", "report"],
  widthViolations: 1,
  markerCount: 1,
  contributePath: "src/lay/layMain/layMain.cc",
  engineOk: true,
};

export function layoutCellModel() {
  const pillars = [...INTERNALS_GOLDENS.pillarsNames];
  const ok = pillars.length === INTERNALS_GOLDENS.pillars;
  return { ok, pillars, pillarCount: pillars.length, highlight: pillars, pass: "layout_cell_model" };
}

export function readDrcRunner() {
  const ok =
    INTERNALS_GOLDENS.drcStages.length === 5 &&
    INTERNALS_GOLDENS.widthViolations === 1 &&
    INTERNALS_GOLDENS.markerCount === 1;
  return {
    ok,
    drcStages: [...INTERNALS_GOLDENS.drcStages],
    highlight: INTERNALS_GOLDENS.drcStages.slice(0, 3),
    pass: "read_drc_runner",
  };
}

export function contributeKlayout() {
  const ok = INTERNALS_GOLDENS.contributePath.endsWith(".cc");
  return { ok, path: INTERNALS_GOLDENS.contributePath, highlight: ["path", "build", "smoke"], pass: "contribute_klayout" };
}

export function partDEngine() {
  const a = layoutCellModel();
  const b = readDrcRunner();
  const c = contributeKlayout();
  const ok = a.ok && b.ok && c.ok;
  return { ok, pillars: a.pillarCount, drcStages: b.drcStages.length, pass: "engine" };
}

export function drawKlayoutInternals(canvas, opts = {}) {
  drawKlayout(canvas, {
    design: STARTER,
    highlight: opts.highlight || ["Layout", "Cell", "Instance"],
    selected: opts.selected || [],
    markers: [{ shape: "m0", type: "width" }],
    stageLabel: opts.stageLabel || "KLayout internals",
    metricText: opts.metricText || "Layout/Cell/Instance",
  });
}
