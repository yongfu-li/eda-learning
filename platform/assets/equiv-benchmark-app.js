/**
 * Equivalence benchmark page app (platform/benchmarks/equivalence).
 */
import {
  BENCHMARK_ALGOS,
  BENCHMARK_INSTANCES,
  EQUIV_METRIC_COLUMNS,
  HARD_SUITE,
  SCALE_SUITE,
  TEACH_SUITE,
  runEquivAlgo,
  runEquivBenchmarkDataset,
} from "./equiv-benchmark-core.js";
import { SPEC, drawEquivalence } from "./equivalence-core.js";
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

const UPLOAD_STORE_KEY = "eda.benchmark.equiv.uploads.v1";

const EXAMPLE_SOLVER = `/**
 * Upload contract: export check (or cec / default).
 * @param {{ pis, gates, ... }} spec
 * @param {{ pis, gates, ... }} impl
 * @param {{ dontCare?, steps? }} opts
 * @returns {{ equivalent: boolean, counterexample?: object, rowsChecked?: number, detail?: string }}
 */
export function check(spec, impl, opts = {}) {
  void spec;
  void impl;
  void opts;
  return { equivalent: true, detail: "example identity (may fail)" };
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
 * Contract: export check(spec, impl, opts) → { equivalent, counterexample? }
 */`;
}

async function builtinExampleSource(algo) {
  const id = algo.id;
  const advHref = JSON.stringify(assetHref("./equiv-algo-advanced.js"));
  const benchHref = JSON.stringify(assetHref("./equiv-benchmark-core.js"));

  const ADV = {
    identity: "identityCheck",
    truth_table: "truthTableCheck",
    miter_eval: "miterEvalCheck",
    gray_walk: "grayWalkCheck",
    structural: "structuralHashCheck",
    fraig: "fraigCheck",
    sat_miter: "satMiterCheck",
    random_sim: "randomSimCheck",
    guided_cex: "guidedCexCheck",
    dont_care: "dontCareCheck",
    sequential: "sequentialCheck",
    multistart: "multistartCheck",
    portfolio: "portfolioCheck",
  };
  if (ADV[id]) {
    const fn = ADV[id];
    return `${exampleBanner(algo, `Calls platform ${fn}.`)}

import { ${fn} } from ${advHref};

export async function check(spec, impl, opts = {}) {
  const out = ${fn}(spec, impl, opts);
  return {
    equivalent: out.equivalent,
    counterexample: out.counterexample,
    rowsChecked: out.rowsChecked,
    detail: out.detail || ${JSON.stringify(fn)},
  };
}
`;
  }

  return `${exampleBanner(algo, "Platform builtin wrapper.")}

import { runEquivAlgo } from ${benchHref};

export async function check(spec, impl, opts = {}) {
  const out = await runEquivAlgo(${JSON.stringify(id)}, { spec, impl, runOpts: opts }, {
    ...opts,
    extraAlgos: [],
  });
  return {
    equivalent: out.equivalent,
    counterexample: out.counterexample,
    rowsChecked: out.rowsChecked,
    detail: out.detail,
  };
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

function fmtCex(cex) {
  if (!cex) return "—";
  return Object.entries(cex)
    .map(([k, v]) => `${k}=${v}`)
    .join(",");
}

export function mountEquivBenchmarkApp(root) {
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
      state.report = await runEquivBenchmarkDataset(ids, state.algoIds, {
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
        run: async (pair, opts = {}) =>
          runEquivAlgo(
            bid,
            { spec: pair.spec, impl: pair.impl, runOpts: opts },
            { ...opts, extraAlgos: [] }
          ),
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
    const smokeInst = BENCHMARK_INSTANCES.course_bad.instance();
    const smoke = await Promise.resolve(
      run(
        { spec: smokeInst.spec, impl: smokeInst.impl },
        { ...(smokeInst.runOpts || {}) }
      )
    );
    if (smoke == null || typeof smoke.equivalent !== "boolean") {
      throw new Error("check() must return { equivalent: boolean, ... }");
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
      <p><strong>Equivalence benchmarks</strong> — compare CEC/SEC engines on shared
      spec/impl pairs by <em>fail vs gold first</em>, then counterexample match and runtime.
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
        <p>ES module exporting <code>check(spec, impl, opts)</code>
        (or <code>cec</code> / <code>default</code>). Use <em>Example</em> then Register.</p>
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
        <input id="bench-title" type="text" placeholder="My CEC" style="width:100%;margin:0.35rem 0 0.75rem" />
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
    vizHead.append(el("h2", { text: "2 · Circuit view" }));
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
        text: "Selected scoreboard row — paper style (same palette as the plots); assignment shows cex when present.",
      }),
      vizMeta,
      graphCanvas
    );
    viz.append(vizBody);

    function paintGraphView(target) {
      const rowNow = selectedRow();
      const rep = state.report;
      if (!rep?.instance || !rowNow || rowNow.error) return;
      const circuit =
        rep.instance.viewCircuit || rep.instance.impl || SPEC;
      const cex =
        rowNow.counterexample ||
        (rep.mode === "selective" ? rep.gold?.counterexample : null);
      drawEquivalence(target, {
        paper: true,
        circuit,
        layoutHint: rep.instance.layoutHint || "spec",
        assignment: cex && !("a_0" in (cex || {})) ? cex : null,
        highlight: cex ? Object.keys(cex) : [],
        metricText: `${rowNow.title} · ≡=${rowNow.equivalent ? "yes" : "no"} · fail=${Math.round(rowNow.fail || 0)} · cex ${fmtCex(cex)}`,
      });
    }

    saveGraphBtn.onclick = () =>
      downloadRedrawnPng(paintGraphView, "equiv-circuit");

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
    const failMsSeries = () => rowsToMetricXySeries(rows(), "ms", "fail");
    const failMsOpts = () => ({
      xLabel: "Runtime (ms)",
      yLabel: "Fail vs gold",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => String(Math.round(v)),
      emptyText: "Run benchmark to plot ms vs fail",
    });
    const cexRowsSeries = () => rowsToMetricXySeries(rows(), "rowsChecked", "cexMatch");
    const cexRowsOpts = () => ({
      xLabel: "Rows checked",
      yLabel: "Cex match",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 0),
      formatY: (v) => String(Math.round(v)),
      emptyText: "Run benchmark to plot rows vs cex✓",
    });
    const stressOpts = () => ({
      xLabel: "Seed stress (bug?)",
      yLabel: "Fail rate",
      selectedId: state.selectedAlgo,
      connect: true,
      formatX: (v) => fmt(v, 0),
      formatY: (v) => fmt(v, 2),
      emptyText: "Select 2+ instances and Run for fail vs stress",
    });
    const stressSeries = () => {
      const per = state.report?.perInstance;
      if (!per?.length) return [];
      const map = new Map();
      for (const inst of per) {
        for (const r of inst.rows || []) {
          if (r.error) continue;
          const x = r.stress;
          const y = r.fail;
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
      "equiv-runtime-memory"
    );
    plotRm.hint.textContent = "One point per solver.";
    const plotFail = makePlotPanel(
      "4 · Runtime vs fail",
      "bench-scatter-fail",
      failMsSeries,
      failMsOpts,
      "equiv-ms-fail"
    );
    const plotCex = makePlotPanel(
      "5 · Rows vs cex match",
      "bench-scatter-cex",
      cexRowsSeries,
      cexRowsOpts,
      "equiv-rows-cex"
    );
    const plotStress = makePlotPanel(
      "6 · Fail vs seed stress",
      "bench-scatter-stress",
      stressSeries,
      stressOpts,
      "equiv-fail-stress"
    );

    root.append(
      intro,
      controls,
      upload,
      actions,
      score,
      viz,
      plotRm.panel,
      plotFail.panel,
      plotCex.panel,
      plotStress.panel
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
      for (const col of EQUIV_METRIC_COLUMNS) {
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
              colSpan: EQUIV_METRIC_COLUMNS.length,
            })
          );
        } else {
          tr.append(el("td", { text: String(i + 1) }), el("td", { text: r.title }));
          for (const col of EQUIV_METRIC_COLUMNS) {
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

      const allPlots = [plotRm, plotFail, plotCex, plotStress];
      requestAnimationFrame(() => {
        if (report.instance && row && !row.error) {
          vizMeta.textContent = `${row.title} · fail=${Math.round(row.fail || 0)} · ≡=${row.equivalent ? "yes" : "no"} · cex ${fmtCex(row.counterexample)}`;
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
    const fn = mod.check || mod.cec || mod.default || mod.run;
    if (typeof fn !== "function") {
      throw new Error("Module must export check(spec, impl, opts) or default");
    }
    return (pair, opts) => fn(pair.spec, pair.impl, opts);
  } finally {
    URL.revokeObjectURL(url);
  }
}
