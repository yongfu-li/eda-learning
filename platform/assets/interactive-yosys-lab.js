/**
 * Interactive Yosys lab — run passes, click cells, score goldens.
 */
import {
  STARTER,
  GOLDENS,
  cloneDesign,
  designStats,
  passProc,
  passHierarchyFlatten,
  passOptDce,
  passAigStrash,
  passRewrite,
  passTechmap,
  passSynthScript,
  reportStats,
  yosysEngine,
  drawYosys,
  hitTestCell,
} from "./yosys-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

export function createInteractiveYosysLab(root, opts = {}) {
  let design = cloneDesign(opts.initialDesign || STARTER);
  let mode = null;
  let last = null;
  let highlight = [];
  let removed = [];
  let merged = [];
  let selected = new Set();
  let stageLabel = null;
  let showNand = false;

  const api = {
    getDesign: () => design,
    getStats: () => designStats(design),
    getLast: () => last,
    getMode: () => mode,
    getSelected: () => [...selected],
    getGoldens: () => GOLDENS,
    reset: () => {
      design = cloneDesign(STARTER);
      mode = null;
      last = null;
      highlight = [];
      removed = [];
      merged = [];
      selected = new Set();
      stageLabel = null;
      showNand = false;
    },
    selectCell: (id) => {
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
    },
    showProc: () => {
      last = passProc(STARTER);
      design = last.design;
      mode = "proc";
      highlight = design.cells.map((c) => c.id);
      removed = [];
      merged = [];
      stageLabel = "proc — RTL elaboration";
      showNand = false;
      return last;
    },
    showFlatten: () => {
      last = passHierarchyFlatten(STARTER);
      design = last.design;
      mode = "flatten";
      highlight = design.cells.filter((c) => c.module === "top").map((c) => c.id);
      removed = [];
      merged = [];
      stageLabel = "flatten — hierarchy";
      showNand = false;
      return last;
    },
    showOpt: () => {
      last = passOptDce(STARTER);
      design = last.design;
      mode = "opt";
      highlight = last.removed;
      removed = last.removed;
      merged = [];
      stageLabel = "opt — DCE removes c4";
      showNand = false;
      return last;
    },
    showStrash: () => {
      last = passAigStrash(STARTER);
      design = last.design;
      mode = "strash";
      highlight = ["c3"];
      removed = ["c3"];
      merged = last.merged;
      stageLabel = "strash — merge duplicate AND";
      showNand = false;
      return last;
    },
    showRewrite: () => {
      last = passRewrite(STARTER);
      design = last.design;
      mode = "rewrite";
      highlight = ["c2", "c5", "rw_c2"].filter((id) => design.cells.some((c) => c.id === id));
      removed = ["c2", "c5"];
      merged = [];
      stageLabel = "rewrite — OR+NOT → NOR";
      showNand = false;
      return last;
    },
    showTechmapArea: () => {
      last = passTechmap(STARTER, "area");
      design = last.design;
      mode = "techmap_area";
      highlight = design.cells.filter((c) => c.type === "NAND2").map((c) => c.id);
      removed = [];
      merged = [];
      stageLabel = "techmap — area NAND library";
      showNand = true;
      return last;
    },
    showTechmapDelay: () => {
      last = passTechmap(STARTER, "delay");
      design = last.design;
      mode = "techmap_delay";
      highlight = design.cells.filter((c) => c.type === "NAND2").map((c) => c.id);
      removed = [];
      merged = [];
      stageLabel = "techmap — delay NAND library";
      showNand = true;
      return last;
    },
    showSynth: () => {
      last = passSynthScript(STARTER);
      design = last.design;
      mode = "synth";
      highlight = design.cells.map((c) => c.id);
      removed = [];
      merged = [];
      stageLabel = "synth — full pass recipe";
      showNand = true;
      return last;
    },
    engine: () => {
      last = yosysEngine(STARTER);
      design = last.report.design;
      mode = "engine";
      highlight = design.cells.map((c) => c.id);
      removed = [];
      merged = [];
      stageLabel = "yosys_engine — report";
      showNand = true;
      return last;
    },
  };

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and <strong>Start</strong>. Run Yosys passes, click cells to select, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> tiny_yosys — GOLDEN cells=${GOLDENS.rtlCellCount}, after_opt=${GOLDENS.afterOptCells}, nand_area=${GOLDENS.techmapNandCountArea}.</p>`,
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
      return [
        el("button", { className: "btn btn-secondary", type: "button", text: "Proc", onClick: () => { api.showProc(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Flatten", onClick: () => { api.showFlatten(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Opt", onClick: () => { api.showOpt(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Strash", onClick: () => { api.showStrash(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Rewrite", onClick: () => { api.showRewrite(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "TechmapArea", onClick: () => { api.showTechmapArea(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "TechmapDelay", onClick: () => { api.showTechmapDelay(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Synth", onClick: () => { api.showSynth(); ctx.rerender(); } }),
        el("button", { className: "btn btn-secondary", type: "button", text: "Engine", onClick: () => { api.engine(); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "Reset", onClick: () => { api.reset(); ctx.rerender(); } }),
      ];
    },
    renderWorkspace(ctx) {
      const st = api.getStats();
      let metricText = `cells=${st.cellCount} modules=${st.moduleCount} selected=${[...selected].join(",") || "—"}`;
      if (mode === "proc" && last) metricText = `cells=${last.cellCount}`;
      else if (mode === "flatten" && last) metricText = `modules=${last.moduleCount}`;
      else if (mode === "opt" && last) metricText = `cells=${last.cellCount} removed=${last.removed.join(",")}`;
      else if (mode === "strash" && last) metricText = `cells=${last.cellCount} merged=${last.merged.join(",")}`;
      else if (mode === "rewrite" && last) metricText = `cells=${last.cellCount} comb=${last.combCount} seq=${last.seqCount}`;
      else if (mode === "techmap_area" && last) metricText = `nand=${last.nandCount} cells=${last.cellCount}`;
      else if (mode === "techmap_delay" && last) metricText = `nand=${last.nandCount} cells=${last.cellCount}`;
      else if (mode === "synth" && last) metricText = `nand=${last.nandCount} cells=${last.cellCount}`;
      else if (mode === "engine" && last) metricText = `ok=${last.ok} report=${last.report.cellCount}/${last.report.wireCount}`;

      drawYosys(ctx.canvas, {
        design,
        highlight,
        removed,
        merged,
        selected: [...selected],
        stageLabel,
        metricText,
        showNand,
      });
      ctx.canvas.onclick = (ev) => {
        const id = hitTestCell(ctx.canvas, design, ev.clientX, ev.clientY);
        if (id) {
          api.selectCell(id);
          ctx.rerender();
        }
      };
      const lines = [
        `cells: ${st.cellCount} · modules: ${st.moduleCount}`,
        `mode: ${mode || "—"}`,
        `selected: ${[...selected].join(",") || "—"}`,
        `GOLDENS: rtl=${GOLDENS.rtlCellCount} opt=${GOLDENS.afterOptCells} strash=${GOLDENS.afterStrashCells}`,
      ];
      if (last && last.nandCount != null) lines.push(`nand_count: ${last.nandCount}`);
      if (last && last.ok != null) lines.push(`engine ok: ${last.ok}`);
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
