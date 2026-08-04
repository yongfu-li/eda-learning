/**
 * Interactive Part C Yosys algorithm lab.
 */
import {
  ALGO_GOLDENS,
  PARTC_REAL,
  STARTER,
  algoAbcHandoff,
  algoExtractIso,
  algoFsmDetect,
  algoMemoryMap,
  algoOptClean,
  algoOptExpr,
  algoOptMerge,
  algoProcDff,
  algoProcMux,
  algoTechmapMapfile,
  cloneDesign,
  drawAlgoYosys,
  hitTestAlgo,
  partcBind,
  yosysAlgoEngine,
} from "./algo-yosys-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

function bindStageForMode(mode) {
  if (mode === "proc_mux" || mode === "proc_dff") return "proc";
  if (mode === "opt_clean" || mode === "opt_expr" || mode === "opt_merge") return "opt";
  if (mode === "techmap") return "techmap";
  if (mode === "extract") return "extract";
  if (mode === "memory") return "memory";
  if (mode === "fsm") return "fsm";
  if (mode === "abc") return "abc";
  return null;
}

export function createInteractiveAlgoYosysLab(root, opts = {}) {
  let design = cloneDesign(STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
  let selected = new Set();
  let stageLabel = null;
  let showMemory = false;
  let showFsm = false;

  const api = {
    getDesign: () => design,
    getMode: () => mode,
    getLast: () => last,
    getSelected: () => [...selected],
    getGoldens: () => ALGO_GOLDENS,
    getPartcReal: () => PARTC_REAL,
    partcBind: (stage) => partcBind(stage),
    reset: () => {
      design = cloneDesign(STARTER);
      mode = null;
      last = null;
      highlight = [];
      selected = new Set();
      stageLabel = null;
      showMemory = false;
      showFsm = false;
    },
    select: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showProcMux: () => {
      last = algoProcMux(STARTER);
      design = last.design;
      mode = "proc_mux";
      highlight = last.added;
      stageLabel = "proc_mux → $mux";
      showMemory = false;
      showFsm = false;
      return last;
    },
    showProcDff: () => {
      last = algoProcDff(STARTER);
      design = last.design;
      mode = "proc_dff";
      highlight = last.added;
      stageLabel = "proc_dff → $adff (+ARST)";
      showMemory = false;
      showFsm = false;
      return last;
    },
    showOptClean: () => {
      last = algoOptClean(STARTER);
      design = last.design;
      mode = "opt_clean";
      highlight = last.removed;
      stageLabel = "opt_clean";
      return last;
    },
    showOptExpr: () => {
      last = algoOptExpr(STARTER);
      design = last.design;
      mode = "opt_expr";
      highlight = last.folded;
      stageLabel = "opt_expr fold";
      return last;
    },
    showOptMerge: () => {
      last = algoOptMerge(STARTER);
      design = last.design;
      mode = "opt_merge";
      highlight = last.removed;
      stageLabel = "opt_merge";
      return last;
    },
    showTechmap: () => {
      last = algoTechmapMapfile(STARTER);
      design = last.design;
      mode = "techmap";
      highlight = design.cells.filter((c) => c.type === "$_NAND_" || c.type === "$_NOT_").map((c) => c.id);
      stageLabel = "techmap mapfile";
      return last;
    },
    showExtract: () => {
      last = algoExtractIso(STARTER);
      design = last.design;
      mode = "extract";
      highlight = design.cells.filter((c) => c.type === "ANDOR2").map((c) => c.id);
      stageLabel = "extract ANDOR2";
      return last;
    },
    showMemory: () => {
      last = algoMemoryMap();
      mode = "memory";
      showMemory = true;
      showFsm = false;
      stageLabel = "memory_map $mem";
      highlight = ["mem0"];
      return last;
    },
    showFsm: () => {
      last = algoFsmDetect();
      mode = "fsm";
      showFsm = true;
      showMemory = false;
      stageLabel = "fsm_detect";
      highlight = ["fsm0"];
      return last;
    },
    showAbc: () => {
      last = algoAbcHandoff(STARTER);
      design = algoOptMerge(STARTER).design;
      mode = "abc";
      stageLabel = "abc handoff";
      highlight = design.cells.filter((c) => c.type === "$and" || c.type === "$mux").map((c) => c.id);
      return last;
    },
    engine: () => {
      last = yosysAlgoEngine(STARTER);
      design = last.design;
      mode = "engine";
      stageLabel = "algo engine";
      highlight = [];
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Run algorithm passes, click cells, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Part C:</strong> Yosys algorithms on tiny_algo — GOLDEN mux=${ALGO_GOLDENS.procMuxCells}, adff type=${ALGO_GOLDENS.procDffType}, clean_removed=${ALGO_GOLDENS.optCleanRemoved}, abc_ands=${ALGO_GOLDENS.abcAigAnds}.</p>`,
    loadStarter() {
      api.reset();
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        api.reset();
        if (typeof ch.setup === "function") ch.setup(ctx, api);
      },
      check: (ctx) => (typeof ch.check === "function" ? !!ch.check(ctx, api) : false),
    })),
    extraActions(ctx) {
      const mk = (label, fn) =>
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: label,
          onClick: () => {
            fn();
            ctx.rerender();
          },
        });
      return [
        mk("ProcMux", () => api.showProcMux()),
        mk("ProcDff", () => api.showProcDff()),
        mk("OptClean", () => api.showOptClean()),
        mk("OptExpr", () => api.showOptExpr()),
        mk("OptMerge", () => api.showOptMerge()),
        mk("Techmap", () => api.showTechmap()),
        mk("Extract", () => api.showExtract()),
        mk("Memory", () => api.showMemory()),
        mk("FSM", () => api.showFsm()),
        mk("ABC", () => api.showAbc()),
        mk("Engine", () => api.engine()),
        mk("Reset", () => api.reset()),
      ];
    },
    renderWorkspace(ctx) {
      let metricText = `mode=${mode || "—"} cells=${(design.cells || []).length}`;
      if (last) {
        if (last.muxCount != null) metricText = `mux=${last.muxCount}`;
        else if (last.dffCount != null)
          metricText = `${last.regType || "$dff"}=${last.dffCount} arst=${last.hasArst} proc=${last.processes}`;
        else if (last.removedCount != null) metricText = `removed=${last.removedCount}`;
        else if (last.foldedCount != null) metricText = `folded=${last.foldedCount}`;
        else if (last.andCount != null) metricText = `ands=${last.andCount}`;
        else if (last.nandNotCount != null) metricText = `nand_not=${last.nandNotCount}`;
        else if (last.matches != null) metricText = `matches=${last.matches}`;
        else if (last.depth != null) metricText = `mem ${last.width}x${last.depth}`;
        else if (last.states != null) metricText = `fsm states=${last.states}`;
        else if (last.aigAnds != null) metricText = `aig_ands=${last.aigAnds}`;
        else if (last.ok != null) metricText = `ok=${last.ok}`;
      }
      drawAlgoYosys(ctx.canvas, {
        design,
        highlight,
        selected: [...selected],
        stageLabel,
        metricText,
        showMemory,
        showFsm,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestAlgo(ctx.canvas, design, ev.clientX, ev.clientY, { showMemory, showFsm });
        if (id) {
          api.select(id);
          ctx.rerender();
        }
      };
      const lines = [
        `mode: ${mode || "—"}`,
        `cells: ${(design.cells || []).length} · processes: ${(design.processes || []).length}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: mux=${ALGO_GOLDENS.procMuxCells} type=${ALGO_GOLDENS.procDffType} clean=${ALGO_GOLDENS.optCleanRemoved} abc=${ALGO_GOLDENS.abcAigAnds}`,
      ];
      const bindStage = bindStageForMode(mode);
      if (bindStage) {
        const b = partcBind(bindStage);
        const r = b.real || {};
        lines.push(
          `REAL ${bindStage}: ${Object.entries(r)
            .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join("|") : v}`)
            .join(" ")} · bind=${b.ok ? "ok" : "fail"}`,
        );
        if (b.note) lines.push(b.note);
      }
      if (last && last.ok != null) lines.push(`engine ok: ${last.ok}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}
