/**
 * Placement benchmark page app (platform/benchmarks/placement).
 * Built-ins + user-uploaded JS modules; Example loads platform wrappers.
 */
import {
  BENCHMARK_ALGOS,
  BENCHMARK_INSTANCES,
  HARD_SUITE,
  PLACE_METRIC_COLUMNS,
  SCALE_SUITE,
  TEACH_SUITE,
  runPlaceAlgo,
  runPlaceBenchmarkDataset,
} from "./placement-benchmark-core.js";
import { CELLS, NETS } from "./placement-core.js";
import { drawPlacement, el } from "./placement-ui.js";
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

const UPLOAD_STORE_KEY = "eda.benchmark.place.uploads.v1";

const EXAMPLE_SOLVER = `/**
 * Upload contract: export place (or legalize / default).
 * @param {{ [id: string]: {x:number,y:number} }} positions
 * @param {{ fixed?: string[], nets?, weights?, cells? }} opts
 * @returns {{ positions: object, detail?: string }}
 */
export function place(positions, opts = {}) {
  void opts;
  // Example stub: identity — replace with force / SA / analytical.
  const out = {};
  for (const [id, p] of Object.entries(positions)) out[id] = { x: p.x, y: p.y };
  return { positions: out, detail: "example identity" };
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
 * Contract: export place(positions, opts) → { positions }
 */`;
}

async function builtinExampleSource(algo) {
  const id = algo.id;
  const coreHref = JSON.stringify(assetHref("./placement-core.js"));
  const advHref = JSON.stringify(assetHref("./placement-algo-advanced.js"));
  const benchHref = JSON.stringify(assetHref("./placement-benchmark-core.js"));

  const CORE = {
    force: "forceDirectedPlace",
    quadratic: "quadraticPlace",
    analytical: "analyticalPlace",
    spread: "spreadCells",
  };
  if (CORE[id]) {
    const fn = CORE[id];
    return `${exampleBanner(algo, `Calls platform ${fn}.`)}

import { ${fn} } from ${coreHref};

export async function place(positions, opts = {}) {
  const fixed = opts.fixed || [];
  const out = ${fn === "spreadCells" ? `spreadCells(positions)` : fn === "forceDirectedPlace" ? `forceDirectedPlace(positions, { fixed })` : `${fn}(positions, { fixed: fixed.length ? fixed : ["A","D"] })`};
  return { positions: out.positions || out, detail: ${JSON.stringify(fn)} };
}
`;
  }

  if (id === "sa") {
    return `${exampleBanner(algo, "Calls platform saPlace.")}

import { saPlace } from ${coreHref};

export async function place(positions, opts = {}) {
  void opts;
  const out = saPlace(positions, { seed: 42 });
  return { positions: out.positions, detail: "saPlace/42" };
}
`;
  }

  const ADV = {
    force_deep: "forceDeepPlace",
    force_spread: "forceThenSpread",
    dens_force: "densForcePlace",
    timing_force: "timingForcePlace",
    analytical_deep: "analyticalDeepPlace",
    sa_deep: "saDeepPlace",
    sa_multi: "saMultiseedPlace",
    dens_sa: "densSaPlace",
    dens_sa_multi: "densSaMultiPlace",
    legalize_aware: "legalizeAwarePlace",
    fqs: "forceQuadSaPlace",
    dens_pareto: "densParetoPlace",
    multistart: "multistartPlace",
    portfolio: "portfolioPlace",
    golden: "goldenRefPlace",
  };
  if (ADV[id]) {
    const fn = ADV[id];
    return `${exampleBanner(algo, `Calls platform ${fn}.`)}

import { ${fn} } from ${advHref};

export async function place(positions, opts = {}) {
  const out = ${fn}(positions, { fixed: opts.fixed || [], nets: opts.nets, weights: opts.weights });
  return { positions: out.positions || out, detail: out.detail || ${JSON.stringify(fn)} };
}
`;
  }

  return `${exampleBanner(
    algo,
    "Runnable wrapper calling the platform builtin (same path as the scoreboard)."
  )}

import { runPlaceAlgo } from ${benchHref};

export async function place(positions, opts = {}) {
  const out = await runPlaceAlgo(${JSON.stringify(id)}, { positions, ...opts }, {
    ...opts,
    extraAlgos: [],
  });
  return { positions: out.positions, detail: out.detail };
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

export function mountPlaceBenchmarkApp(root) {
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
      state.report = await runPlaceBenchmarkDataset(ids, state.algoIds, {
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
        run: async (positions, opts = {}) =>
          runPlaceAlgo(bid, { positions, ...opts }, { ...opts, extraAlgos: [] }),
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
    const smokeInst = BENCHMARK_INSTANCES.starter.instance();
    const smoke = await Promise.resolve(run(smokeInst.positions, smokeInst));
    const pl = smoke?.positions || smoke?.placement || smoke;
    if (!pl || typeof pl !== "object") {
      throw new Error("place() must return { positions }");
    }
    for (const c of CELLS) {
      if (!pl[c] || !Number.isFinite(pl[c].x) || !Number.isFinite(pl[c].y)) {
        throw new Error(`place() missing finite coords for ${c}`);
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
      <p><strong>Placement benchmarks</strong> — compare force / quadratic / analytical / SA placers
      on shared netlists by <em>density overflow first</em>, then cost (HPWL+λ·dens) and HPWL.
      Collapse no longer wins. Upload your own JS module; it appears <strong>above</strong> the built-in list.</p>
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
        <p>ES module exporting <code>place(positions, opts)</code>
        (or <code>legalize</code> / <code>default</code>).
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
        <input id="bench-title" type="text" placeholder="My placer" style="width:100%;margin:0.35rem 0 0.75rem" />
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
    vizHead.append(el("h2", { text: "2 · Placement view" }));
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
        text: "Selected scoreboard row — paper style (same palette as the plots); cells + net bboxes.",
      }),
      vizMeta,
      graphCanvas
    );
    viz.append(vizBody);

    function paintGraphView(target) {
      const rowNow = selectedRow();
      const rep = state.report;
      if (!rep?.instance || !rowNow || rowNow.error || !rowNow.positions) return;
      drawPlacement(
        target,
        CELLS,
        rowNow.positions,
        rep.instance.nets || NETS,
        {
          paper: true,
          grid: 2,
          metricText: `${rowNow.title} · HPWL ${fmt(rowNow.hpwl, 1)} · dens ${rowNow.overflow ?? "—"}`,
        }
      );
    }

    saveGraphBtn.onclick = () =>
      downloadRedrawnPng(paintGraphView, "place-view");

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
    const hpwlOvSeries = () => rowsToMetricXySeries(rows(), "hpwl", "overflow");
    const hpwlOvOpts = () => ({
      xLabel: "HPWL",
      yLabel: "Density overflow",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 1),
      formatY: (v) => String(Math.round(v)),
      emptyText: "Run benchmark to plot HPWL vs density overflow",
    });
    const hpwlTauSeries = () =>
      rowsToMetricXySeries(rows(), "hpwl", "timingHpwl");
    const hpwlTauOpts = () => ({
      xLabel: "HPWL",
      yLabel: "Timing HPWL",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 1),
      formatY: (v) => fmt(v, 1),
      emptyText: "Run benchmark to plot HPWL vs timing HPWL",
    });
    const hpwlStressOpts = () => ({
      xLabel: "Seed HPWL stress",
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
      "place-runtime-memory"
    );
    plotRm.hint.textContent = "One point per solver.";
    const plotHpwlOv = makePlotPanel(
      "4 · HPWL vs density overflow",
      "bench-scatter-hpwl-ov",
      hpwlOvSeries,
      hpwlOvOpts,
      "place-hpwl-overflow"
    );
    const plotHpwlTau = makePlotPanel(
      "5 · HPWL vs timing HPWL",
      "bench-scatter-hpwl-tau",
      hpwlTauSeries,
      hpwlTauOpts,
      "place-hpwl-timing"
    );
    const plotHpwlStress = makePlotPanel(
      "6 · Result HPWL vs seed stress",
      "bench-scatter-hpwl-stress",
      hpwlStressSeries,
      hpwlStressOpts,
      "place-hpwl-stress"
    );
    plotHpwlStress.hint.textContent =
      "X is seed total HPWL (varies with how spread the instance is).";

    root.append(
      intro,
      controls,
      upload,
      actions,
      score,
      viz,
      plotRm.panel,
      plotHpwlOv.panel,
      plotHpwlTau.panel,
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
        titleEl.value = "Example identity";
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
      for (const col of PLACE_METRIC_COLUMNS) {
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
              colSpan: PLACE_METRIC_COLUMNS.length,
            })
          );
        } else {
          tr.append(el("td", { text: String(i + 1) }), el("td", { text: r.title }));
          for (const col of PLACE_METRIC_COLUMNS) {
            tr.append(
              el("td", { className: "num", text: col.fmt(r[col.key], r) })
            );
          }
        }
        tbody.append(tr);
      });
      table.append(tbody);
      scoreBody.append(table);
      if (report.notes) {
        scoreBody.append(el("p", { className: "chal-hint", text: report.notes }));
      }

      const allPlots = [plotRm, plotHpwlOv, plotHpwlTau, plotHpwlStress];
      requestAnimationFrame(() => {
        if (report.instance && row && !row.error && row.positions) {
          vizMeta.textContent = `${row.title} · HPWL=${fmt(row.hpwl, 1)} · τ=${fmt(row.timingHpwl, 1)} · dens=${row.overflow ?? "—"}`;
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
    const fn = mod.place || mod.legalize || mod.default || mod.run;
    if (typeof fn !== "function") {
      throw new Error(
        "Module must export place(positions, opts) or legalize/default"
      );
    }
    return (positions, opts) => fn(positions, opts);
  } finally {
    URL.revokeObjectURL(url);
  }
}
