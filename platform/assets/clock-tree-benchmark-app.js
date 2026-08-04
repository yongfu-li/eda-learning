/**
 * Clock-tree benchmark page app (platform/benchmarks/clock-tree).
 * Built-ins + user-uploaded JS modules; Example loads full platform source.
 */
import {
  BENCHMARK_ALGOS,
  BENCHMARK_INSTANCES,
  CTS_METRIC_COLUMNS,
  HARD_SUITE,
  TEACH_SUITE,
  SCALE_SUITE,
  runCtsAlgo,
  runCtsBenchmarkDataset,
} from "./clock-tree-benchmark-core.js";
import { drawClockTree } from "./clock-tree-core.js";
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

const UPLOAD_STORE_KEY = "eda.benchmark.cts.uploads.v1";

const EXAMPLE_SOLVER = `/**
 * Upload contract: export synthesize (or cts / default).
 * @param {{ positions: Record<string,{x:number,y:number}>, source:{x:number,y:number}, cells?: string[] }} instance
 * @param {{ maxWireLen?: number, skewBound?: number }} opts
 * @returns {{ tree: object, detail?: string }}
 *
 * tree: { source, sinks, edges:[{x1,y1,x2,y2}], steiners?, buffers? }
 */
export function synthesize(instance, opts = {}) {
  const { positions, source } = instance;
  const cells = instance.cells || Object.keys(positions).sort();
  const edges = [];
  for (const id of cells) {
    const p = positions[id];
    // L-route stub — replace with your CTS algorithm.
    if (p.x !== source.x) {
      edges.push({ x1: source.x, y1: source.y, x2: p.x, y2: source.y });
    }
    if (p.y !== source.y) {
      edges.push({ x1: p.x, y1: source.y, x2: p.x, y2: p.y });
    }
  }
  const sinks = cells.map((id) => ({ id, ...positions[id] }));
  return {
    tree: { source: { ...source }, sinks, edges, steiners: [], buffers: [] },
    detail: "example star L-routes",
  };
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
 * Contract: export synthesize(instance, opts) → { tree, detail? }
 */`;
}

async function builtinExampleSource(algo) {
  const id = algo.id;
  const coreHref = JSON.stringify(assetHref("./clock-tree-core.js"));
  const benchHref = JSON.stringify(assetHref("./clock-tree-benchmark-core.js"));

  const map = {
    h_tree: { fn: "hTree", call: "hTree(instance.positions, instance.source)" },
    mmm: { fn: "mmmTree", call: "mmmTree(instance.positions, instance.source)" },
    zero_skew: {
      fn: "zeroSkewMerge",
      call: "zeroSkewMerge(instance.positions, instance.source)",
    },
    sequential: {
      fn: "sequentialCts",
      call: "sequentialCts(instance.positions, instance.cells, instance.source)",
    },
  };

  if (map[id]) {
    const { fn, call } = map[id];
    return `${exampleBanner(
      algo,
      `Calls platform ${fn} from clock-tree-core.js. Edit, then Register.`
    )}

import { ${fn} } from ${coreHref};

export async function synthesize(instance, opts = {}) {
  void opts;
  const tree = ${call};
  return { tree, detail: ${JSON.stringify(fn)} };
}
`;
  }

  if (id === "h_tree_buf" || id === "mmm_buf" || id === "zero_skew_buf") {
    const base =
      id === "h_tree_buf" ? "hTree" : id === "mmm_buf" ? "mmmTree" : "zeroSkewMerge";
    return `${exampleBanner(algo, "Platform tree + insertBuffers.")}

import { ${base}, insertBuffers, GOLDENS } from ${coreHref};

export async function synthesize(instance, opts = {}) {
  const maxWire = opts.maxWireLen ?? GOLDENS.maxWireLenDefault;
  const tree = insertBuffers(${base}(instance.positions, instance.source), maxWire);
  return { tree, detail: "${base}+buf" };
}
`;
  }

  return `${exampleBanner(
    algo,
    "Runnable wrapper calling the platform builtin (same path as the scoreboard)."
  )}

import { runCtsAlgo } from ${benchHref};

export async function synthesize(instance, opts = {}) {
  const out = await runCtsAlgo(${JSON.stringify(id)}, instance, {
    ...opts,
    extraAlgos: [],
  });
  return { tree: out.tree, detail: out.detail };
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

export function mountCtsBenchmarkApp(root) {
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
      state.report = await runCtsBenchmarkDataset(ids, state.algoIds, {
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
        run: async (instance, opts = {}) =>
          runCtsAlgo(bid, instance, { ...opts, extraAlgos: [] }),
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
    const smokeInst = BENCHMARK_INSTANCES.spread.instance();
    const smoke = await Promise.resolve(run(smokeInst, {}));
    if (!smoke?.tree?.edges) throw new Error("synthesize() must return { tree } with edges");
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
      <p><strong>Clock-tree benchmarks</strong> — compare CTS engines on shared sink
      placements by <em>skew</em>, latency, wirelength, buffers, runtime, and memory.
      Upload your own JS module; it appears <strong>above</strong> the built-in list.</p>
      <p class="chal-hint">Client-side only. Uploaded code runs in this tab — only load
      solvers you trust. Memory marked * is a structural estimate when heap deltas are unavailable.</p>
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
        <p>ES module exporting <code>synthesize(instance, opts)</code> (or <code>cts</code> / <code>default</code>).
        Use <em>Example</em> to load a platform builtin wrapper, then Register.</p>
        <div class="tool-actions bench-example-row">
          <label class="btn btn-secondary">
            Choose .js file
            <input type="file" accept=".js,text/javascript" hidden id="bench-file" />
          </label>
          <label class="bench-example-pick">
            Example
            <select id="bench-example-algo" aria-label="Example algorithm">
              <option value="stub">Minimal star L-route stub</option>
              ${BENCHMARK_ALGOS.map(
                (a) =>
                  `<option value="${a.id}">${a.title.replace(/</g, "")}</option>`
              ).join("")}
            </select>
          </label>
          <button type="button" class="btn btn-ghost" id="bench-load-example">Load example</button>
        </div>
        <label for="bench-title">Display name</label>
        <input id="bench-title" type="text" placeholder="My CTS" style="width:100%;margin:0.35rem 0 0.75rem" />
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
    score.append(el("div", { className: "panel-head" }, [el("h2", { text: "1 · Scoreboard" })]));
    const scoreBody = el("div", { className: "panel-body" });
    score.append(scoreBody);

    const viz = el("section", { className: "panel" });
    const vizHead = el("div", { className: "panel-head bench-scatter-head" });
    vizHead.append(el("h2", { text: "2 · Clock tree view" }));
    const saveGraphBtn = el("button", {
      type: "button",
      className: "btn btn-ghost",
      text: "Save PNG",
    });
    vizHead.append(saveGraphBtn);
    viz.append(vizHead);
    const vizBody = el("div", { className: "panel-body" });
    const vizMeta = el("div", {
      className: "bench-part-meta",
      id: "bench-cts-meta",
    });
    const graphCanvas = el("canvas", {
      className: "cluster-canvas bench-paper",
      id: "bench-graph",
    });
    stylePaperGraphCanvas(graphCanvas);
    vizBody.append(
      el("p", {
        className: "chal-hint",
        text: "Selected scoreboard row — paper style (same palette as the plots).",
      }),
      vizMeta,
      graphCanvas
    );
    viz.append(vizBody);

    function paintGraphView(target) {
      const rowNow = selectedRow();
      const rep = state.report;
      if (!rep?.instance || !rowNow?.tree) return;
      drawClockTree(target, {
        paper: true,
        positions: rep.instance.positions,
        tree: rowNow.tree,
      });
    }

    saveGraphBtn.onclick = () =>
      downloadRedrawnPng(paintGraphView, "clock-tree");

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
    const skewWlSeries = () => rowsToMetricXySeries(rows(), "skew", "wl");
    const skewWlOpts = () => ({
      xLabel: "Skew",
      yLabel: "Wirelength",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => fmt(v, 1),
      emptyText: "Run benchmark to plot skew vs WL",
    });
    const skewLatSeries = () => rowsToMetricXySeries(rows(), "skew", "maxLatency");
    const skewLatOpts = () => ({
      xLabel: "Skew",
      yLabel: "Max latency",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => fmt(v, 2),
      emptyText: "Run benchmark to plot skew vs max latency",
    });

    const plotRm = makePlotPanel(
      "3 · Runtime vs memory",
      "bench-scatter-rm",
      rmSeries,
      rmOpts,
      "cts-runtime-memory"
    );
    plotRm.hint.textContent = "One point per solver. Save PNG for paper figures.";
    const plotSkewWl = makePlotPanel(
      "4 · Skew vs wirelength",
      "bench-scatter-skew-wl",
      skewWlSeries,
      skewWlOpts,
      "cts-skew-wl"
    );
    const plotSkewLat = makePlotPanel(
      "5 · Skew vs max latency",
      "bench-scatter-skew-lat",
      skewLatSeries,
      skewLatOpts,
      "cts-skew-latency"
    );

    const skewExtentOpts = () => ({
      xLabel: "Mean Manhattan from CLK",
      yLabel: "Skew",
      selectedId: state.selectedAlgo,
      connect: true,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => fmt(v, 2),
      emptyText: "Select 2+ instances and Run for skew vs sink extent",
    });
    /** Per-instance skew vs placement extent (n sinks is fixed at 6 on this suite). */
    const skewExtentSeries = () => {
      const per = state.report?.perInstance;
      if (!per?.length) return [];
      const map = new Map();
      for (const inst of per) {
        for (const r of inst.rows || []) {
          if (r.error) continue;
          const x = r.extent;
          const y = r.skew;
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
    const plotSkewExtent = makePlotPanel(
      "6 · Skew vs sink extent",
      "bench-scatter-skew-extent",
      skewExtentSeries,
      skewExtentOpts,
      "cts-skew-vs-extent"
    );
    plotSkewExtent.hint.textContent =
      "X is mean distance from the clock source to sinks (varies by placement). All suite instances currently have 6 sinks.";

    root.append(
      intro,
      controls,
      upload,
      actions,
      score,
      viz,
      plotRm.panel,
      plotSkewWl.panel,
      plotSkewLat.panel,
      plotSkewExtent.panel
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
      const sel = root.querySelector("#bench-example-algo");
      const pick = sel?.value || "stub";
      const codeEl = root.querySelector("#bench-code");
      const titleEl = root.querySelector("#bench-title");
      if (pick === "stub") {
        codeEl.value = EXAMPLE_SOLVER;
        titleEl.value = "Example star L-routes";
        return;
      }
      const algo = BENCHMARK_ALGOS.find((a) => a.id === pick);
      if (!algo) return;
      try {
        codeEl.value = "/* Loading example… */";
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
      for (const col of CTS_METRIC_COLUMNS) hr.append(el("th", { text: col.label }));
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
              colSpan: CTS_METRIC_COLUMNS.length,
            })
          );
        } else {
          tr.append(el("td", { text: String(i + 1) }), el("td", { text: r.title }));
          for (const col of CTS_METRIC_COLUMNS) {
            tr.append(el("td", { className: "num", text: col.fmt(r[col.key], r) }));
          }
        }
        tbody.append(tr);
      });
      table.append(tbody);
      scoreBody.append(table);
      if (report.notes) {
        scoreBody.append(el("p", { className: "chal-hint", text: report.notes }));
      }

      const allPlots = [plotRm, plotSkewWl, plotSkewLat, plotSkewExtent];
      requestAnimationFrame(() => {
        if (report.instance && row?.tree) {
          vizMeta.textContent = `${row.title} · skew=${fmt(row.skew)} · WL=${fmt(row.wl, 1)} · bufs=${row.buffers ?? 0}`;
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
      scoreBody.append(el("p", { text: "Click Run benchmark to compare solvers." }));
    }
  }

  hydrateUploads().then(() => {
    render();
    runBench();
  });

  return { runBench, render, state };
}

async function compileUserSolver(code) {
  const blob = new Blob([code], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  try {
    const mod = await import(/* webpackIgnore: true */ url);
    const fn = mod.synthesize || mod.cts || mod.default || mod.run;
    if (typeof fn !== "function") {
      throw new Error(
        "Module must export synthesize(instance, opts) or cts/default function"
      );
    }
    return (instance, opts) => fn(instance, opts);
  } finally {
    URL.revokeObjectURL(url);
  }
}
