/**
 * Clustering benchmark page app (platform/benchmarks/clustering).
 * Built-ins + user-uploaded JS modules; Example loads full platform source.
 */
import {
  BENCHMARK_ALGOS,
  BENCHMARK_INSTANCES,
  CLUSTER_METRIC_COLUMNS,
  HARD_SUITE,
  TEACH_SUITE,
  SCALE_SUITE,
  HYPER_SUITE,
  runClusterAlgo,
  runClusterBenchmarkDataset,
} from "./clustering-benchmark-core.js";
import { drawGraph, el } from "./clustering-ui.js";
import {
  buildScalingSeries,
  downloadPaperPng,
  downloadRedrawnPng,
  drawPaperCanvas,
  fmtMem,
  rowsToMetricXySeries,
  rowsToRuntimeMemorySeries,
  stylePaperGraphCanvas,
  wireCanvasResize,
} from "./partition-benchmark-plots.js";
import { starterLayout } from "./clustering-core.js";

const UPLOAD_STORE_KEY = "eda.benchmark.cluster.uploads.v1";

const EXAMPLE_SOLVER = `/**
 * Upload contract: export cluster (or partition / default).
 * @param {{ nodes: string[], edges: {u:string,v:string,w:number}[], sizes?: object, hedges?: object[] }} graph
 * @param {{ seedAsn?: object, randomSeed?: number, maxPasses?: number, targetK?: number }} opts
 * @returns {{ assignment: Record<string,string>, detail?: string }}
 */
export function cluster(graph, opts = {}) {
  const { nodes } = graph;
  const sorted = [...nodes].sort();
  const half = Math.floor(sorted.length / 2);
  const left = new Set(sorted.slice(0, half));
  const assignment = Object.fromEntries(
    nodes.map((n) => [n, left.has(n) ? "0" : "1"])
  );
  return { assignment, detail: "example half-split" };
}
`;

function assetHref(relPath) {
  return new URL(relPath, import.meta.url).href;
}

async function fetchAssetText(relPath) {
  const href = assetHref(relPath);
  const res = await fetch(href);
  if (!res.ok) throw new Error(`Could not load ${relPath} (${res.status})`);
  return { href, text: await res.text() };
}

function extractTopLevelFunction(source, name) {
  const patterns = [
    new RegExp(`export\\s+async\\s+function\\s+${name}\\b`),
    new RegExp(`export\\s+function\\s+${name}\\b`),
    new RegExp(`(?:^|\\n)async\\s+function\\s+${name}\\b`),
    new RegExp(`(?:^|\\n)function\\s+${name}\\b`),
  ];
  let matchStart = -1;
  for (const re of patterns) {
    const m = re.exec(source);
    if (!m) continue;
    matchStart = m.index + (m[0].startsWith("\n") ? 1 : 0);
    break;
  }
  if (matchStart < 0) return null;
  const brace = source.indexOf("{", matchStart);
  if (brace < 0) return null;
  let depth = 0;
  let inStr = null;
  let escape = false;
  for (let i = brace; i < source.length; i++) {
    const c = source[i];
    if (inStr) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return source.slice(matchStart, i + 1).trim();
    }
  }
  return null;
}

function stripExport(fnSrc) {
  return String(fnSrc).replace(/^export\s+/, "");
}

function exampleBanner(algo, note) {
  return `/**
 * Builtin example: ${algo.title}
 * Builtin id: ${algo.id}
 *
 * ${note}
 *
 * Contract: export cluster(graph, opts) → { assignment, detail? }
 */`;
}

/** Map builtin id → extracted sources + entry body. */
async function builtinExampleSource(algo) {
  const id = algo.id;
  const coreHref = JSON.stringify(assetHref("./clustering-core.js"));
  const benchHref = JSON.stringify(assetHref("./clustering-benchmark-core.js"));
  const { text } = await fetchAssetText("./clustering-core.js");

  const pack = async (names, body, note) => {
    const chunks = [];
    for (const name of names) {
      const src = extractTopLevelFunction(text, name);
      if (!src) throw new Error(`Could not extract ${name}`);
      chunks.push(stripExport(src));
    }
    return `${exampleBanner(algo, note)}

${chunks.join("\n\n")}

export async function cluster(graph, opts = {}) {
${body}
}
`;
  };

  if (id === "greedy_k2" || id === "greedy_k3") {
    const k = id === "greedy_k2" ? 2 : 3;
    return `${exampleBanner(
      algo,
      "Calls platform greedyPairMerge (full source in clustering-core.js)."
    )}

import { greedyPairMerge } from ${coreHref};

export async function cluster(graph, opts = {}) {
  const { nodes, edges, sizes } = graph;
  const { assignment, mergeLog } = greedyPairMerge(nodes, edges, sizes, ${k});
  return { assignment, detail: \`merges=\${mergeLog?.length ?? 0}\` };
}
`;
  }

  if (id === "label_prop") {
    return pack(
      ["adjacency", "labelPropagation"],
      `  const { nodes, edges } = graph;
  const { labels, iters } = labelPropagation(nodes, edges, opts.maxIters ?? 50);
  return { assignment: labels, detail: \`iters=\${iters}\` };`,
      "Full label-propagation source. Edit, then Register."
    );
  }

  if (id === "spectral") {
    return pack(
      ["cutsize", "laplacian", "dot", "norm", "spectralBisection"],
      `  const { nodes, edges, sizes } = graph;
  const { assignment, order } = spectralBisection(nodes, edges, sizes);
  return {
    assignment,
    detail: \`fiedler \${order?.map(([n]) => n).join("") || "?"}\`,
    order,
  };`,
      "Full spectral bisection + helpers. Edit, then Register."
    );
  }

  if (id === "fm" || id === "kl") {
    const fn = id === "fm" ? "fiducciaMattheyses" : "kernighanLin";
    return `${exampleBanner(
      algo,
      "Full algorithm source from clustering-core. Edit, then Register."
    )}

import { randomBipartition } from ${benchHref};

${["adjacency", "cutsize", "dValues", fn]
  .map((n) => {
    const src = extractTopLevelFunction(text, n);
    if (!src) throw new Error(`Could not extract ${n}`);
    return stripExport(src);
  })
  .join("\n\n")}

export async function cluster(graph, opts = {}) {
  const { nodes, edges } = graph;
  const seedAsn = opts.seedAsn || randomBipartition(nodes, opts.randomSeed ?? 7);
  const maxPasses = opts.maxPasses ?? 10;
  const { assignment, history } = ${fn}(nodes, edges, seedAsn, maxPasses);
  return {
    assignment,
    detail: \`passes=\${history?.length ?? 0}\`,
    history,
    seedUsed: { ...seedAsn },
  };
}
`;
  }

  if (id === "hyper_greedy") {
    const pairKeySrc = extractTopLevelFunction(text, "pairKey");
    const hgSrc = extractTopLevelFunction(text, "hypergraphGreedyCluster");
    if (pairKeySrc && hgSrc) {
      return `${exampleBanner(
        algo,
        "Full hypergraph greedy source. Edit, then Register."
      )}

${stripExport(pairKeySrc)}

${stripExport(hgSrc)}

export async function cluster(graph, opts = {}) {
  const { nodes, sizes } = graph;
  const hedges = graph.hedges?.length
    ? graph.hedges
    : (graph.edges || []).map((e) => ({ pins: [e.u, e.v], w: e.w ?? 1 }));
  const assignment = hypergraphGreedyCluster(nodes, hedges, sizes, 2);
  return { assignment, detail: \`nets=\${hedges.length}\` };
}
`;
    }
    return `${exampleBanner(algo, "Platform hypergraphGreedyCluster wrapper.")}

import { hypergraphGreedyCluster } from ${coreHref};

export async function cluster(graph, opts = {}) {
  const { nodes, sizes } = graph;
  const hedges = graph.hedges?.length
    ? graph.hedges
    : (graph.edges || []).map((e) => ({ pins: [e.u, e.v], w: e.w ?? 1 }));
  const assignment = hypergraphGreedyCluster(nodes, hedges, sizes, 2);
  return { assignment, detail: \`nets=\${hedges.length}\` };
}
`;
  }

  // multilevel / congestion / timing — thin platform call (large deps)
  return `${exampleBanner(
    algo,
    "Runnable wrapper calling the platform builtin (same path as the scoreboard)."
  )}

import { runClusterAlgo } from ${benchHref};

export async function cluster(graph, opts = {}) {
  const out = await runClusterAlgo(${JSON.stringify(id)}, graph, {
    ...opts,
    extraAlgos: [],
  });
  return {
    assignment: out.assignment,
    detail: out.detail,
    history: out.history,
    seedUsed: out.seedUsed,
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

export function mountClusterBenchmarkApp(root) {
  const DEFAULT_ALGOS = BENCHMARK_ALGOS.map((a) => a.id);
  const ALL_INSTANCES = Object.keys(BENCHMARK_INSTANCES);

  const state = {
    mode: "average",
    instanceIds: [...HARD_SUITE],
    algoIds: [...DEFAULT_ALGOS],
    randomSeed: 7,
    maxPasses: 10,
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
      const ids = state.instanceIds.length
        ? state.instanceIds
        : [...HARD_SUITE];
      if (ids.length >= 2) mode = "average";
      state.report = await runClusterBenchmarkDataset(ids, state.algoIds, {
        mode,
        randomSeed: state.randomSeed,
        maxPasses: state.maxPasses,
        extraAlgos: state.uploads
          .filter((u) => typeof u.run === "function")
          .map((u) => ({
            id: u.id,
            title: u.title,
            isUser: true,
            run: u.run,
          })),
        seedTrials: 2,
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
        run: async (graph, opts = {}) =>
          runClusterAlgo(bid, graph, { ...opts, extraAlgos: [] }),
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
    const tiny = BENCHMARK_INSTANCES.tiny.graph();
    const smoke = await Promise.resolve(run(tiny, { randomSeed: 7, maxPasses: 2 }));
    if (!smoke?.assignment) throw new Error("cluster() must return { assignment }");
    for (const n of tiny.nodes) {
      if (smoke.assignment[n] == null) {
        throw new Error(`assignment missing node ${n}`);
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

  function removeUpload(id) {
    state.uploads = state.uploads.filter((u) => u.id !== id);
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
      <p><strong>Clustering benchmarks</strong> — compare solvers on shared instances
      by <em>runtime</em>, <em>memory</em>, cut, and balance. Upload your own JS
      module; it appears <strong>above</strong> the built-in list.</p>
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
      ["Hyper", HYPER_SUITE],
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

    const optsFs = el("fieldset");
    optsFs.append(el("legend", { text: "Options" }));
    const seedLab = el("label", { text: "Seed " });
    const seedIn = document.createElement("input");
    seedIn.type = "number";
    seedIn.value = String(state.randomSeed);
    seedIn.onchange = () => {
      state.randomSeed = Number(seedIn.value) || 7;
    };
    seedLab.append(seedIn);
    const passLab = el("label", { text: "Max passes " });
    const passIn = document.createElement("input");
    passIn.type = "number";
    passIn.value = String(state.maxPasses);
    passIn.onchange = () => {
      state.maxPasses = Number(passIn.value) || 10;
    };
    passLab.append(passIn);
    optsFs.append(seedLab, passLab);
    controls.append(optsFs);

    const upload = el("section", { className: "panel bench-upload" });
    upload.innerHTML = `
      <div class="panel-head"><h2>Upload your algorithm</h2></div>
      <div class="panel-body">
        <p>ES module exporting <code>cluster(graph, opts)</code> (or <code>partition</code> / <code>default</code>).
        Use <em>Example</em> to load full platform source for a builtin, then Register.</p>
        <div class="tool-actions bench-example-row">
          <label class="btn btn-secondary">
            Choose .js file
            <input type="file" accept=".js,text/javascript" hidden id="bench-file" />
          </label>
          <label class="bench-example-pick">
            Example
            <select id="bench-example-algo" aria-label="Example algorithm">
              <option value="stub">Minimal half-split stub</option>
              ${BENCHMARK_ALGOS.map(
                (a) =>
                  `<option value="${a.id}">${a.title.replace(/</g, "")}</option>`
              ).join("")}
            </select>
          </label>
          <button type="button" class="btn btn-ghost" id="bench-load-example">Load example</button>
        </div>
        <label for="bench-title">Display name</label>
        <input id="bench-title" type="text" placeholder="My clusterer" style="width:100%;margin:0.35rem 0 0.75rem" />
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
    const runBtn = el("button", {
      className: "btn btn-primary",
      type: "button",
      text: state.busy ? "Running…" : "Run benchmark",
      disabled: state.busy,
      onClick: () => runBench(),
    });
    actions.append(runBtn);
    if (state.status) actions.append(el("span", { className: "chal-hint", text: state.status }));

    const score = el("section", { className: "panel" });
    score.append(el("div", { className: "panel-head" }, [el("h2", { text: "1 · Scoreboard" })]));
    const scoreBody = el("div", { className: "panel-body" });
    score.append(scoreBody);

    const viz = el("section", { className: "panel" });
    const vizHead = el("div", { className: "panel-head bench-scatter-head" });
    vizHead.append(el("h2", { text: "2 · Cluster view" }));
    const saveGraphBtn = el("button", {
      type: "button",
      className: "btn btn-ghost",
      text: "Save PNG",
    });
    vizHead.append(saveGraphBtn);
    viz.append(vizHead);
    const vizBody = el("div", { className: "panel-body" });
    const vizHint = el("p", {
      className: "chal-hint",
      text: "Selected scoreboard row — paper style (same palette as the plots); cut edges in crimson.",
    });
    const vizMeta = el("div", {
      className: "bench-part-meta",
      id: "bench-cluster-meta",
    });
    const graphCanvas = el("canvas", {
      className: "cluster-canvas bench-paper",
      id: "bench-graph",
    });
    stylePaperGraphCanvas(graphCanvas);
    vizBody.append(vizHint, vizMeta, graphCanvas);
    viz.append(vizBody);

    function paintGraphView(target) {
      const rowNow = selectedRow();
      const rep = state.report;
      const g = rep?.graph;
      if (!g || !rowNow?.assignment) return;
      const layout =
        g.nodes.length <= 5 && g.nodes.includes("A") ? starterLayout() : null;
      let lay = layout;
      if (!lay) {
        lay = {};
        const n = g.nodes.length;
        g.nodes.forEach((name, i) => {
          const a = (i / n) * Math.PI * 2;
          lay[name] = {
            x: 200 + 140 * Math.cos(a),
            y: 180 + 140 * Math.sin(a),
          };
        });
      }
      drawGraph(target, g, {
        paper: true,
        assignment: rowNow.assignment,
        layout: lay,
      });
    }

    saveGraphBtn.onclick = () =>
      downloadRedrawnPng(paintGraphView, "cluster-view");

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
    const cutImbSeries = () => rowsToMetricXySeries(rows(), "cut", "imbalance");
    const cutImbOpts = () => ({
      xLabel: "Edge cut",
      yLabel: "Imbalance",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => fmt(v, 3),
      emptyText: "Run benchmark to plot cut vs imbalance",
    });
    const cutHyperSeries = () => rowsToMetricXySeries(rows(), "cut", "hyperCut");
    const cutHyperOpts = () => ({
      xLabel: "Edge cut",
      yLabel: "Hyperedge cut",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => fmt(v, 2),
      emptyText: "Run benchmark to plot cut vs hypercut",
    });
    const rtNSeries = () => buildScalingSeries(state.report, "ms");
    const rtNOpts = () => ({
      xLabel: "Number of nodes",
      yLabel: "Runtime (ms)",
      selectedId: state.selectedAlgo,
      connect: true,
      formatX: (v) => String(Math.round(v)),
      formatY: (v) => fmt(v, 2),
      emptyText: "Select 2+ instances and Run for runtime vs n",
    });
    const cutNSeries = () => buildScalingSeries(state.report, "cut");
    const cutNOpts = () => ({
      xLabel: "Number of nodes",
      yLabel: "Edge cut",
      selectedId: state.selectedAlgo,
      connect: true,
      formatX: (v) => String(Math.round(v)),
      formatY: (v) => fmt(v, 2),
      emptyText: "Select 2+ instances and Run for cut vs n",
    });

    const plotRm = makePlotPanel(
      "3 · Runtime vs memory",
      "bench-scatter-rm",
      rmSeries,
      rmOpts,
      "cluster-runtime-memory"
    );
    plotRm.hint.textContent = "One point per solver. Save PNG for paper figures.";
    const plotCutImb = makePlotPanel(
      "4 · Cut vs imbalance",
      "bench-scatter-cut-imb",
      cutImbSeries,
      cutImbOpts,
      "cluster-cut-imbalance"
    );
    const plotCutHyper = makePlotPanel(
      "5 · Cut vs hypercut",
      "bench-scatter-cut-hyper",
      cutHyperSeries,
      cutHyperOpts,
      "cluster-cut-hypercut"
    );
    const plotRtN = makePlotPanel(
      "6 · Runtime vs n",
      "bench-scatter-rt-n",
      rtNSeries,
      rtNOpts,
      "cluster-runtime-vs-n"
    );
    const plotCutN = makePlotPanel(
      "7 · Cut vs n",
      "bench-scatter-cut-n",
      cutNSeries,
      cutNOpts,
      "cluster-cut-vs-n"
    );

    root.append(
      intro,
      controls,
      upload,
      actions,
      score,
      viz,
      plotRm.panel,
      plotCutImb.panel,
      plotCutHyper.panel,
      plotRtN.panel,
      plotCutN.panel
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
        titleEl.value = "Example half-split";
        return;
      }
      const algo = BENCHMARK_ALGOS.find((a) => a.id === pick);
      if (!algo) return;
      try {
        codeEl.value = "/* Loading full builtin source… */";
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
      const text = await file.text();
      root.querySelector("#bench-code").value = text;
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
      for (const col of CLUSTER_METRIC_COLUMNS) {
        hr.append(el("th", { text: col.label }));
      }
      hr.append(el("th", { text: "Parts" }));
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
              colSpan: CLUSTER_METRIC_COLUMNS.length + 1,
            })
          );
        } else {
          tr.append(el("td", { text: String(i + 1) }), el("td", { text: r.title }));
          for (const col of CLUSTER_METRIC_COLUMNS) {
            tr.append(
              el("td", {
                className: "num",
                text: col.fmt(r[col.key], r),
              })
            );
          }
          tr.append(el("td", { className: "num", text: r.parts || "—" }));
        }
        tbody.append(tr);
      });
      table.append(tbody);
      scoreBody.append(table);
      if (report.notes) {
        scoreBody.append(el("p", { className: "chal-hint", text: report.notes }));
      }

      const allPlots = [plotRm, plotCutImb, plotCutHyper, plotRtN, plotCutN];
      requestAnimationFrame(() => {
        if (report.graph && row?.assignment) {
          vizMeta.textContent = `${row.title} · cut=${row.cut} · k=${row.k} · ${row.parts || ""}`;
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
    const fn = mod.cluster || mod.partition || mod.default || mod.run;
    if (typeof fn !== "function") {
      throw new Error(
        "Module must export cluster(graph, opts) or partition/default function"
      );
    }
    return (graph, opts) => fn(graph, opts);
  } finally {
    URL.revokeObjectURL(url);
  }
}
