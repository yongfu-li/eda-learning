/**
 * Floorplanning benchmark page app (platform/benchmarks/floorplanning).
 * Built-ins + user-uploaded JS modules; Example loads platform wrappers.
 */
import {
  BENCHMARK_ALGOS,
  BENCHMARK_INSTANCES,
  HARD_SUITE,
  FLOOR_METRIC_COLUMNS,
  SCALE_SUITE,
  TEACH_SUITE,
  runFloorAlgo,
  runFloorBenchmarkDataset,
} from "./floor-benchmark-core.js";
import { TINY_MODULES, drawFloorplan } from "./floorplanning-core.js";
import { el } from "./clustering-ui.js";
import {
  downloadPaperPng,
  downloadRedrawnPng,
  drawPaperCanvas,
  fmtMem,
  rowsToMetricXySeries,
  rowsToRuntimeMemorySeries,
  stylePaperGraphCanvas,
  wireCanvasResize,
} from "./partition-benchmark-plots.js";

const UPLOAD_STORE_KEY = "eda.benchmark.floor.uploads.v1";

const EXAMPLE_SOLVER = `/**
 * Upload contract: export floorplan (or pack / default).
 * @param {{ [id: string]: {x:number,y:number,w:number,h:number} }} pack
 * @param {{ outline?, modules?, lockedIds? }} opts
 * @returns {{ pack: object, detail?: string }}
 */
export function floorplan(pack, opts = {}) {
  void opts;
  // Example stub: identity — replace with SA / SP / polish.
  const out = {};
  for (const [id, r] of Object.entries(pack)) {
    out[id] = { x: r.x, y: r.y, w: r.w, h: r.h };
  }
  return { pack: out, detail: "example identity" };
}
`;

function assetHref(relPath) {
  return new URL(relPath, import.meta.url).href;
}

function exampleBanner(algo, note) {
  return `/**
 * Builtin example: ${algo.title}
 * Builtin id: ${algo.id}
 *
 * ${note}
 *
 * Contract: export floorplan(pack, opts) → { pack }
 */`;
}

async function builtinExampleSource(algo) {
  const id = algo.id;
  const coreHref = JSON.stringify(assetHref("./floorplanning-core.js"));
  const advHref = JSON.stringify(assetHref("./floor-algo-advanced.js"));
  const benchHref = JSON.stringify(assetHref("./floor-benchmark-core.js"));

  const CORE = {
    polish: null,
    bstar: null,
    sp: null,
    hierarchical: null,
  };

  if (id === "polish") {
    return `${exampleBanner(algo, "Calls platform evalPolish(GOLDEN_POLISH).")}

import { GOLDEN_POLISH, TINY_MODULES, evalPolish } from ${coreHref};

export async function floorplan(pack, opts = {}) {
  void pack;
  const modules = opts.modules || TINY_MODULES;
  return { pack: evalPolish(GOLDEN_POLISH, modules).pack, detail: "evalPolish" };
}
`;
  }
  if (id === "bstar") {
    return `${exampleBanner(algo, "Calls platform packBstar(GOLDEN_BSTAR).")}

import { GOLDEN_BSTAR, TINY_MODULES, packBstar } from ${coreHref};

export async function floorplan(pack, opts = {}) {
  void pack;
  const modules = opts.modules || TINY_MODULES;
  return { pack: packBstar(GOLDEN_BSTAR, modules), detail: "packBstar" };
}
`;
  }
  if (id === "sp") {
    return `${exampleBanner(algo, "Calls platform packSequencePair(GOLDEN_SP).")}

import { GOLDEN_SP, TINY_MODULES, packSequencePair } from ${coreHref};

export async function floorplan(pack, opts = {}) {
  void pack;
  const modules = opts.modules || TINY_MODULES;
  return {
    pack: packSequencePair(GOLDEN_SP.pos, GOLDEN_SP.neg, modules),
    detail: "packSequencePair",
  };
}
`;
  }
  if (id === "hierarchical") {
    return `${exampleBanner(algo, "Calls platform packHierarchical.")}

import { packHierarchical } from ${coreHref};

export async function floorplan(pack, opts = {}) {
  void pack; void opts;
  return { pack: packHierarchical(), detail: "packHierarchical" };
}
`;
  }

  const ADV = {
    clamp: "clampToOutline",
    repair: "repairOverlaps",
    bottom_left: "bottomLeftDefault",
    bl_permute: "blPermutePack",
    skyline: "skylinePack",
    compact: "compactPack",
    polish_search: "polishSearch",
    sp_multi: "spMultistart",
    sp_sa: "spSaPack",
    sp_sa_multi: "spSaMultiPack",
    soft: "softAwarePack",
    wire_force: "wireForcePack",
    sa: "saFloorplan",
    sa_multi: "saMultiseedFloorplan",
    hpwl_sa: "hpwlSaPack",
    repair_sa: "repairThenSa",
    wire_polish: "wirePolishPack",
    legal_pareto: "legalParetoPack",
    multistart: "multistartFloorplan",
    portfolio: "portfolioFloorplan",
  };
  if (ADV[id]) {
    const fn = ADV[id];
    const seedFns = new Set([
      "clamp",
      "repair",
      "compact",
      "wire_force",
      "sa",
      "sa_multi",
      "hpwl_sa",
      "repair_sa",
      "wire_polish",
      "legal_pareto",
      "multistart",
      "portfolio",
    ]);
    const moduleFns = new Set([
      "bottom_left",
      "bl_permute",
      "skyline",
      "polish_search",
      "sp_multi",
      "sp_sa",
      "sp_sa_multi",
      "soft",
    ]);
    let call;
    if (seedFns.has(id)) {
      if (id === "compact") {
        call = `compactPack(pack, opts)`;
      } else {
        call = `${fn}(pack, opts)`;
      }
    } else if (moduleFns.has(id)) {
      call =
        id === "bottom_left"
          ? `bottomLeftDefault(opts.modules, opts.outline)`
          : id === "bl_permute"
            ? `blPermutePack(opts.modules, opts.outline, opts)`
            : id === "skyline"
              ? `skylinePack(opts.modules, opts.outline)`
              : id === "polish_search"
                ? `polishSearch(opts.modules, opts.outline)`
                : id === "sp_multi"
                  ? `spMultistart(opts.modules, opts.outline)`
                  : id === "sp_sa"
                    ? `spSaPack(opts.modules, opts.outline, opts)`
                    : id === "sp_sa_multi"
                      ? `spSaMultiPack(opts.modules, opts.outline, opts)`
                      : `softAwarePack(opts.modules, opts.outline)`;
    } else {
      call = `${fn}(pack, opts)`;
    }
    return `${exampleBanner(algo, `Calls platform ${fn}.`)}

import { ${fn}${id === "compact" ? "" : ""} } from ${advHref};

export async function floorplan(pack, opts = {}) {
  const out = ${call};
  return { pack: out.pack || out, detail: out.detail || ${JSON.stringify(fn)} };
}
`;
  }

  if (id === "golden") {
    return `${exampleBanner(algo, "Returns GOLDEN_PACK.")}

import { GOLDEN_PACK, clonePack } from ${coreHref};

export async function floorplan(pack, opts = {}) {
  void pack; void opts;
  return { pack: clonePack(GOLDEN_PACK), detail: "GOLDEN_PACK" };
}
`;
  }

  void CORE;
  return `${exampleBanner(
    algo,
    "Runnable wrapper calling the platform builtin (same path as the scoreboard)."
  )}

import { runFloorAlgo } from ${benchHref};

export async function floorplan(pack, opts = {}) {
  const out = await runFloorAlgo(${JSON.stringify(id)}, { pack, ...opts }, {
    ...opts,
    extraAlgos: [],
  });
  return { pack: out.pack, detail: out.detail };
}
`;
}

function parseBuiltinIdFromCode(code) {
  const m = String(code || "").match(
    /export\s+const\s+__edaBuiltinId\s*=\s*["'`]([^"'`]+)["'`]/
  );
  return m ? m[1] : null;
}

function fmt(v, digits = 2) {
  if (v == null || Number.isNaN(v)) return "—";
  return Number(v).toFixed(digits);
}

export function mountFloorBenchmarkApp(root) {
  const DEFAULT_ALGOS = BENCHMARK_ALGOS.map((a) => a.id);
  const ALL_INSTANCES = Object.keys(BENCHMARK_INSTANCES);

  const state = {
    mode: "average",
    instanceIds: [...HARD_SUITE],
    algoIds: [...DEFAULT_ALGOS],
    report: null,
    selectedAlgo: null,
    uploads: loadUploads(),
    status: "",
    busy: false,
  };

  function selectedRow() {
    const rows = state.report?.rows || [];
    if (!rows.length) return null;
    if (state.selectedAlgo) {
      const hit = rows.find((r) => r.algoId === state.selectedAlgo);
      if (hit) return hit;
    }
    return rows.find((r) => !r.error) || rows[0];
  }

  async function runBench() {
    state.busy = true;
    state.status = "Running…";
    render();
    try {
      let mode = state.mode;
      const ids = state.instanceIds.length ? state.instanceIds : [...HARD_SUITE];
      if (ids.length >= 2) mode = "average";
      state.report = await runFloorBenchmarkDataset(ids, state.algoIds, {
        mode,
        extraAlgos: state.uploads
          .filter((u) => typeof u.run === "function")
          .map((u) => ({
            id: u.id,
            title: u.title,
            isUser: true,
            run: u.run,
          })),
      });
      state.selectedAlgo = selectedRow()?.algoId || null;
      state.status = `Done — ${state.report.rows.length} solvers`;
    } catch (err) {
      state.status = `Failed: ${err?.message || err}`;
    } finally {
      state.busy = false;
      render();
    }
  }

  async function resolveUploadRunner(code) {
    const builtinId = parseBuiltinIdFromCode(code);
    if (builtinId && BENCHMARK_ALGOS.some((a) => a.id === builtinId)) {
      const bid = builtinId;
      return {
        builtinId: bid,
        run: async (pack, opts = {}) =>
          runFloorAlgo(bid, { pack, ...opts }, { ...opts, extraAlgos: [] }),
      };
    }
    return { builtinId: null, run: await compileUserSolver(code) };
  }

  async function registerUpload({ title, code, fileName }) {
    const idBase = (fileName || title || "solver")
      .replace(/\.js$/i, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    const id = `user:${idBase || "solver"}-${Date.now().toString(36)}`;
    const { builtinId, run } = await resolveUploadRunner(code);
    const smokeInst = BENCHMARK_INSTANCES.overlap.instance();
    const smoke = await Promise.resolve(
      run(smokeInst.pack, {
        outline: smokeInst.outline,
        modules: smokeInst.modules,
        lockedIds: smokeInst.lockedIds,
      })
    );
    const pl = smoke?.pack || smoke;
    if (!pl || typeof pl !== "object") {
      throw new Error("floorplan() must return { pack }");
    }
    for (const m of TINY_MODULES) {
      const r = pl[m.id];
      if (
        !r ||
        !Number.isFinite(r.x) ||
        !Number.isFinite(r.y) ||
        !Number.isFinite(r.w) ||
        !Number.isFinite(r.h)
      ) {
        throw new Error(`floorplan() missing finite rect for ${m.id}`);
      }
    }
    const meta = BENCHMARK_ALGOS.find((a) => a.id === builtinId);
    const entry = {
      id,
      title:
        title ||
        (meta ? `${meta.title} (example)` : null) ||
        fileName ||
        idBase ||
        "Uploaded solver",
      code,
      run,
      builtinId,
    };
    state.uploads.push(entry);
    persistUploads();
    state.status = `Uploaded “${entry.title}” — running…`;
    await runBench();
    return entry;
  }

  function removeUpload(uid) {
    state.uploads = state.uploads.filter((u) => u.id !== uid);
    persistUploads();
    state.status = "Removed uploaded solver";
    render();
  }

  function persistUploads() {
    try {
      const slim = state.uploads.map(({ id, title, code }) => ({ id, title, code }));
      localStorage.setItem(UPLOAD_STORE_KEY, JSON.stringify(slim));
    } catch {
      /* ignore */
    }
  }

  function loadUploads() {
    try {
      const raw = localStorage.getItem(UPLOAD_STORE_KEY);
      if (!raw) return [];
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list.map((u) => ({ ...u, run: null })) : [];
    } catch {
      return [];
    }
  }

  async function hydrateUploads() {
    const next = [];
    for (const u of state.uploads) {
      if (typeof u.run === "function") {
        next.push(u);
        continue;
      }
      try {
        const { builtinId, run } = await resolveUploadRunner(u.code);
        next.push({ ...u, run, builtinId: builtinId || u.builtinId || null });
      } catch {
        /* drop */
      }
    }
    state.uploads = next;
  }

  function makePlotPanel(title, canvasId, getSeries, plotOpts, exportStem) {
    const panel = el("section", { className: "panel" });
    const head = el("div", { className: "panel-head bench-scatter-head" });
    head.append(el("h2", { text: title }));
    const saveBtn = el("button", {
      type: "button",
      className: "btn btn-ghost",
      text: "Save PNG",
    });
    saveBtn.onclick = () =>
      downloadPaperPng(getSeries(), plotOpts(), exportStem || canvasId);
    head.append(saveBtn);
    panel.append(head);
    const body = el("div", { className: "panel-body bench-scatter-wrap" });
    const hint = el("p", { className: "chal-hint" });
    body.append(hint);
    const canvas = el("canvas", {
      className: "cluster-canvas bench-scatter",
      id: canvasId,
    });
    body.append(canvas);
    panel.append(body);
    return { panel, canvas, hint, getSeries, plotOpts };
  }

  function redrawPlot(canvas, getSeries, plotOpts) {
    drawPaperCanvas(canvas, getSeries(), plotOpts());
  }

  function render() {
    const report = state.report;
    const row = selectedRow();
    root.innerHTML = "";

    const intro = el("div", { className: "starter-note" });
    intro.innerHTML = `
      <p><strong>Floorplanning benchmarks</strong> — compare polish / B* / SP / SA packers
      on shared seeds by <em>legality first</em>, then cost and HPWL.
      Upload your own JS module; it appears <strong>above</strong> the built-in list.</p>
      <p class="chal-hint">Client-side only. Uploaded code runs in this tab — only load solvers you trust.</p>
    `;

    const controls = el("div", { className: "bench-controls" });
    const modeFs = el("fieldset");
    modeFs.append(el("legend", { text: "Dataset mode" }));
    for (const [val, label] of [
      ["selective", "Selective (one instance)"],
      ["average", "Dataset average"],
    ]) {
      const lab = el("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "bench-mode";
      radio.value = val;
      radio.checked = state.mode === val;
      radio.onchange = () => {
        state.mode = val;
        if (val === "average" && state.instanceIds.length < 2) {
          state.instanceIds = [...HARD_SUITE];
        }
      };
      lab.append(radio, document.createTextNode(label));
      modeFs.append(lab);
    }
    controls.append(modeFs);

    const instFs = el("fieldset");
    instFs.append(el("legend", { text: "Instances" }));
    const presets = el("div", { className: "tool-actions" });
    for (const [label, ids] of [
      ["Hard", HARD_SUITE],
      ["Teach", TEACH_SUITE],
      ["Scale", SCALE_SUITE],
      ["All", ALL_INSTANCES],
    ]) {
      presets.append(
        el("button", {
          type: "button",
          className: "btn btn-ghost",
          text: label,
          onClick: () => {
            state.instanceIds = [...ids];
            if (ids.length >= 2) state.mode = "average";
            render();
          },
        })
      );
    }
    instFs.append(presets);
    for (const id of ALL_INSTANCES) {
      const inst = BENCHMARK_INSTANCES[id];
      const lab = el("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = state.instanceIds.includes(id);
      cb.onchange = () => {
        if (cb.checked) {
          if (!state.instanceIds.includes(id)) state.instanceIds.push(id);
        } else {
          state.instanceIds = state.instanceIds.filter((x) => x !== id);
        }
        if (state.instanceIds.length >= 2) state.mode = "average";
        else if (state.instanceIds.length === 1) state.mode = "selective";
      };
      lab.append(cb, document.createTextNode(` ${inst.title}`));
      instFs.append(lab);
    }
    controls.append(instFs);

    const algoFs = el("fieldset");
    algoFs.append(el("legend", { text: "Algorithms" }));
    for (const a of BENCHMARK_ALGOS) {
      const lab = el("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = state.algoIds.includes(a.id);
      cb.onchange = () => {
        if (cb.checked) {
          if (!state.algoIds.includes(a.id)) state.algoIds.push(a.id);
        } else {
          state.algoIds = state.algoIds.filter((x) => x !== a.id);
        }
      };
      lab.append(cb, document.createTextNode(` ${a.title}`));
      algoFs.append(lab);
    }
    controls.append(algoFs);

    const upload = el("section", { className: "panel bench-upload" });
    upload.innerHTML = `
      <div class="panel-head"><h2>Upload your algorithm</h2></div>
      <div class="panel-body">
        <p>ES module exporting <code>floorplan(pack, opts)</code>
        (or <code>pack</code> / <code>default</code>).
        Use <em>Example</em> to load a platform builtin wrapper, then Register.</p>
        <div class="tool-actions bench-example-row">
          <label class="btn btn-secondary">
            Choose .js file
            <input type="file" accept=".js,text/javascript" hidden id="bench-file" />
          </label>
          <label class="bench-example-pick">
            Example
            <select id="bench-example-algo" aria-label="Example algorithm">
              <option value="stub">Minimal identity stub</option>
              ${BENCHMARK_ALGOS.map(
                (a) =>
                  `<option value="${a.id}">${a.title.replace(/</g, "")}</option>`
              ).join("")}
            </select>
          </label>
          <button type="button" class="btn btn-ghost" id="bench-load-example">Load example</button>
        </div>
        <label for="bench-title">Display name</label>
        <input id="bench-title" type="text" placeholder="My floorplanner" style="width:100%;margin:0.35rem 0 0.75rem" />
        <label for="bench-code">Or paste module source</label>
        <textarea id="bench-code" rows="10" spellcheck="false"
          style="width:100%;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:0.82rem"></textarea>
        <div class="tool-actions" style="margin-top:0.5rem">
          <button type="button" class="btn btn-primary" id="bench-register">Register solver</button>
        </div>
        <div id="bench-upload-list"></div>
      </div>
    `;

    const actions = el("div", { className: "tool-actions lab-extra-actions" });
    actions.append(
      el("button", {
        className: "btn btn-primary",
        type: "button",
        text: state.busy ? "Running…" : "Run benchmark",
        disabled: state.busy,
        onClick: () => runBench(),
      })
    );
    if (state.status) {
      actions.append(el("span", { className: "chal-hint", text: state.status }));
    }

    const score = el("section", { className: "panel" });
    score.append(
      el("div", { className: "panel-head" }, [el("h2", { text: "1 · Scoreboard" })])
    );
    const scoreBody = el("div", { className: "panel-body" });
    score.append(scoreBody);

    const viz = el("section", { className: "panel" });
    const vizHead = el("div", { className: "panel-head bench-scatter-head" });
    vizHead.append(el("h2", { text: "2 · Floorplan view" }));
    const saveGraphBtn = el("button", {
      type: "button",
      className: "btn btn-ghost",
      text: "Save PNG",
    });
    vizHead.append(saveGraphBtn);
    viz.append(vizHead);
    const vizBody = el("div", { className: "panel-body" });
    const vizMeta = el("div", { className: "bench-part-meta" });
    const graphCanvas = el("canvas", {
      className: "cluster-canvas bench-paper",
      id: "bench-graph",
    });
    stylePaperGraphCanvas(graphCanvas);
    vizBody.append(
      el("p", {
        className: "chal-hint",
        text: "Selected scoreboard row — paper style (same palette as the plots); modules + fixed outline.",
      }),
      vizMeta,
      graphCanvas
    );
    viz.append(vizBody);

    function paintGraphView(target) {
      const rowNow = selectedRow();
      const rep = state.report;
      if (!rep?.instance || !rowNow || rowNow.error || !rowNow.pack) return;
      drawFloorplan(target, {
        paper: true,
        pack: rowNow.pack,
        outline: rep.instance.outline,
        metricText: `${rowNow.title} · cost ${fmt(rowNow.cost, 1)} · HPWL ${fmt(rowNow.hpwl, 1)}`,
      });
    }

    saveGraphBtn.onclick = () =>
      downloadRedrawnPng(paintGraphView, "floor-view");

    const rows = () => state.report?.rows || [];
    const rmSeries = () => rowsToRuntimeMemorySeries(rows());
    const rmOpts = () => ({
      xLabel: "Runtime (ms)",
      yLabel: "Memory",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => fmtMem(v),
      emptyText: "Run benchmark to plot runtime vs memory",
    });
    const hpwlCostSeries = () => rowsToMetricXySeries(rows(), "hpwl", "cost");
    const hpwlCostOpts = () => ({
      xLabel: "HPWL",
      yLabel: "Cost",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 1),
      formatY: (v) => fmt(v, 1),
      emptyText: "Run benchmark to plot HPWL vs cost",
    });
    const illegalHpwlSeries = () =>
      rowsToMetricXySeries(rows(), "illegal", "hpwl");
    const illegalHpwlOpts = () => ({
      xLabel: "Illegal (0/1)",
      yLabel: "HPWL",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => String(Math.round(v)),
      formatY: (v) => fmt(v, 1),
      emptyText: "Run benchmark to plot illegal vs HPWL",
    });
    const hpwlStressOpts = () => ({
      xLabel: "Seed stress",
      yLabel: "Result HPWL",
      selectedId: state.selectedAlgo,
      connect: true,
      formatX: (v) => fmt(v, 1),
      formatY: (v) => fmt(v, 1),
      emptyText: "Select 2+ instances and Run for HPWL vs seed stress",
    });
    const hpwlStressSeries = () => {
      const per = state.report?.perInstance;
      if (!per?.length) return [];
      const map = new Map();
      for (const inst of per) {
        for (const r of inst.rows || []) {
          if (r.error) continue;
          const x = r.stress;
          const y = r.hpwl;
          if (x == null || y == null || Number.isNaN(y)) continue;
          if (!map.has(r.algoId)) {
            map.set(r.algoId, {
              id: r.algoId,
              title: r.title,
              isUser: !!r.isUser,
              points: [],
            });
          }
          map.get(r.algoId).points.push({ x, y });
        }
      }
      return [...map.values()].map((s) => ({
        ...s,
        points: s.points.sort((a, b) => a.x - b.x),
      }));
    };

    const plotRm = makePlotPanel(
      "3 · Runtime vs memory",
      "bench-scatter-rm",
      rmSeries,
      rmOpts,
      "floor-runtime-memory"
    );
    plotRm.hint.textContent = "One point per solver.";
    const plotHpwlCost = makePlotPanel(
      "4 · HPWL vs cost",
      "bench-scatter-hpwl-cost",
      hpwlCostSeries,
      hpwlCostOpts,
      "floor-hpwl-cost"
    );
    const plotIllegalHpwl = makePlotPanel(
      "5 · Illegal vs HPWL",
      "bench-scatter-illegal-hpwl",
      illegalHpwlSeries,
      illegalHpwlOpts,
      "floor-illegal-hpwl"
    );
    const plotHpwlStress = makePlotPanel(
      "6 · Result HPWL vs seed stress",
      "bench-scatter-hpwl-stress",
      hpwlStressSeries,
      hpwlStressOpts,
      "floor-hpwl-stress"
    );
    plotHpwlStress.hint.textContent =
      "X is seed HPWL (+100 if illegal). Module count is fixed on this suite.";

    root.append(
      intro,
      controls,
      upload,
      actions,
      score,
      viz,
      plotRm.panel,
      plotHpwlCost.panel,
      plotIllegalHpwl.panel,
      plotHpwlStress.panel
    );

    const listHost = root.querySelector("#bench-upload-list");
    if (!state.uploads.length) {
      listHost.innerHTML = `<p class="chal-hint">No uploads yet.</p>`;
    } else {
      for (const u of state.uploads) {
        const rowEl = el("div", { className: "tool-actions" });
        rowEl.append(
          el("span", { text: u.title }),
          el("button", {
            className: "btn btn-ghost",
            type: "button",
            text: "Remove",
            onClick: () => removeUpload(u.id),
          })
        );
        listHost.append(rowEl);
      }
    }

    root.querySelector("#bench-load-example").onclick = async () => {
      const pick = root.querySelector("#bench-example-algo")?.value || "stub";
      const codeEl = root.querySelector("#bench-code");
      const titleEl = root.querySelector("#bench-title");
      if (pick === "stub") {
        codeEl.value = EXAMPLE_SOLVER;
        titleEl.value = "Example identity pack";
        return;
      }
      const algo = BENCHMARK_ALGOS.find((a) => a.id === pick);
      if (!algo) return;
      try {
        codeEl.value = await builtinExampleSource(algo);
        titleEl.value = `${algo.title} (example)`;
      } catch (err) {
        state.status = `Example load failed: ${err.message || err}`;
        render();
      }
    };
    root.querySelector("#bench-file").onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      root.querySelector("#bench-code").value = await file.text();
      if (!root.querySelector("#bench-title").value) {
        root.querySelector("#bench-title").value = file.name.replace(/\.js$/i, "");
      }
    };
    root.querySelector("#bench-register").onclick = async () => {
      const code = root.querySelector("#bench-code").value.trim();
      const title = root.querySelector("#bench-title").value.trim();
      if (!code) {
        state.status = "Paste or choose a .js module first";
        render();
        return;
      }
      try {
        await registerUpload({ title, code });
      } catch (err) {
        state.status = `Upload failed: ${err?.message || err}`;
        render();
      }
    };

    if (report) {
      const table = el("table", { className: "rank-table" });
      const thead = el("thead");
      const hr = el("tr");
      hr.append(el("th", { text: "#" }), el("th", { text: "Algo" }));
      for (const col of FLOOR_METRIC_COLUMNS) {
        hr.append(el("th", { text: col.label }));
      }
      thead.append(hr);
      table.append(thead);
      const tbody = el("tbody");
      report.rows.forEach((r, i) => {
        const tr = el("tr", {
          className: [
            r.isUser ? "is-user" : "",
            r.algoId === state.selectedAlgo ? "is-selected" : "",
          ]
            .filter(Boolean)
            .join(" "),
        });
        tr.dataset.algo = r.algoId;
        tr.onclick = () => {
          state.selectedAlgo = r.algoId;
          render();
        };
        if (r.error) {
          tr.append(
            el("td", { text: String(i + 1) }),
            el("td", { text: r.title }),
            el("td", {
              className: "num",
              text: r.error,
              colSpan: FLOOR_METRIC_COLUMNS.length,
            })
          );
        } else {
          tr.append(el("td", { text: String(i + 1) }), el("td", { text: r.title }));
          for (const col of FLOOR_METRIC_COLUMNS) {
            tr.append(
              el("td", { className: "num", text: col.fmt(r[col.key], r) })
            );
          }
        }
        tbody.append(tr);
      });
      table.append(tbody);
      scoreBody.append(table);
      if (report.instanceTitle) {
        scoreBody.append(
          el("p", {
            className: "chal-hint",
            text: `${report.instanceTitle}${report.mode === "average" ? " (means)" : ""}`,
          })
        );
      }
      if (report.notes) {
        scoreBody.append(el("p", { className: "chal-hint", text: report.notes }));
      }

      const allPlots = [plotRm, plotHpwlCost, plotIllegalHpwl, plotHpwlStress];
      requestAnimationFrame(() => {
        if (report.instance && row && !row.error && row.pack) {
          vizMeta.textContent = `${row.title} · illegal=${Math.round(row.illegal || 0)} · cost=${fmt(row.cost, 1)} · HPWL=${fmt(row.hpwl, 1)}`;
          const paint = () => paintGraphView(graphCanvas);
          paint();
          wireCanvasResize(graphCanvas, paint);
        }
        for (const p of allPlots) {
          redrawPlot(p.canvas, p.getSeries, p.plotOpts);
          wireCanvasResize(p.canvas, () =>
            redrawPlot(p.canvas, p.getSeries, p.plotOpts)
          );
        }
      });
    } else {
      scoreBody.append(
        el("p", { text: "Click Run benchmark to compare solvers." })
      );
    }
  }

  hydrateUploads().then(() => {
    render();
    runBench();
  });
}

async function compileUserSolver(code) {
  const blob = new Blob([code], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  try {
    const mod = await import(/* webpackIgnore: true */ url);
    const fn = mod.floorplan || mod.pack || mod.default || mod.run;
    if (typeof fn !== "function") {
      throw new Error(
        "Module must export floorplan(pack, opts) or pack/default function"
      );
    }
    return (pack, opts) => fn(pack, opts);
  } finally {
    URL.revokeObjectURL(url);
  }
}
