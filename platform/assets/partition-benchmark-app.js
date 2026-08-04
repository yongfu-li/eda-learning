/**
 * Partitioning benchmark page app (platform/benchmarks/partitioning).
 * Built-in solvers + user-uploaded JS modules on the shared dataset.
 */
import {
  BENCHMARK_ALGOS,
  BENCHMARK_INSTANCES,
  HARD_SUITE,
  runPartitionAlgo,
  runPartitionBenchmarkDataset,
} from "./partitioning-core.js";
import { el, metricsBlock } from "./clustering-ui.js";
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
import { METRIC_COLUMNS } from "./partition-metrics.js";
import {
  drawBipartitionView,
  wirePartitionCanvasResize,
} from "./partition-view.js";

const SCALE_SUITE = ["tiny", "small", "medium", "large", "xl"];
const TEACH_SUITE = ["tiny", "small", "medium", "large", "path20", "grid4x5"];

const UPLOAD_STORE_KEY = "eda.benchmark.partition.uploads.v1";
const EXAMPLE_SOLVER = `/**
 * Upload contract: export a function named partition (or default).
 * @param {{ nodes: string[], edges: {u:string,v:string,w:number}[], sizes: Record<string,number> }} graph
 * @param {{ seedAsn?: object, randomSeed?: number, maxPasses?: number }} opts
 * @returns {{ assignment: Record<string,string>, detail?: string }}
 */
export function partition(graph, opts = {}) {
  const { nodes, edges } = graph;
  // Example: put first half on side 0 (sorted ids) — replace with your algorithm.
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

/** Blob uploads cannot resolve relative imports — rewrite to absolute asset URLs. */
function rewriteRelativeImports(source, moduleHref) {
  return String(source).replace(
    /from\s*(["'])(\.\.?\/[^"']+)\1/g,
    (_m, q, rel) => `from ${q}${new URL(rel, moduleHref).href}${q}`
  );
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
 * Contract: export partition(graph, opts) → { assignment, detail? }
 */`;
}

/** Append upload entry after a platform source module. */
function withPartitionEntry(banner, moduleSource, partitionBody) {
  return `${banner}

${moduleSource.trim()}

/** Upload entry — same call path as the benchmark scoreboard. */
export async function partition(graph, opts = {}) {
${partitionBody}
}
`;
}

async function exampleFromFile(algo, relPath, partitionBody) {
  const { href, text } = await fetchAssetText(relPath);
  return withPartitionEntry(
    exampleBanner(
      algo,
      "Full platform source for this solver. Relative imports are rewritten so Register works. Edit, then Register."
    ),
    rewriteRelativeImports(text, href),
    partitionBody
  );
}

/**
 * Pasteable, Register-ready example for a builtin.
 * Dedicated algo modules are inlined in full; FM/KL/spectral include clustering-core;
 * simple constructors are extracted from partitioning-core.
 */
async function builtinExampleSource(algo) {
  const id = algo.id;
  const coreHref = JSON.stringify(assetHref("./partitioning-core.js"));
  const clusterHref = JSON.stringify(assetHref("./clustering-core.js"));

  if (id === "gain_fill") {
    return exampleFromFile(
      algo,
      "./partition-algo-gainfill.js",
      `  const { nodes, edges, sizes } = graph;
  return gainFillBipartition(nodes, edges, sizes, opts);`
    );
  }
  if (id === "jacobi_diffusion") {
    return exampleFromFile(
      algo,
      "./partition-algo-diffusion.js",
      `  const { nodes, edges, sizes } = graph;
  return diffusionBipartition(nodes, edges, sizes, opts);`
    );
  }
  if (id === "bfs_inertial") {
    return exampleFromFile(
      algo,
      "./partition-algo-inertial.js",
      `  const { nodes, edges, sizes } = graph;
  return inertialBipartition(nodes, edges, sizes, {
    ...opts,
    layout: opts.layout,
  });`
    );
  }
  if (id === "metropolis_swap") {
    return exampleFromFile(
      algo,
      "./partition-algo-anneal.js",
      `  const { nodes, edges, sizes } = graph;
  const { assignment, detail, bestCut } = annealBipartition(nodes, edges, sizes, {
    ...opts,
    seedAsn: opts.seedAsn,
    randomSeed: opts.randomSeed ?? 7,
  });
  return {
    assignment,
    detail: detail || \`metropolis_swap bestCut=\${bestCut}\`,
    seedUsed: opts.seedAsn ? { ...opts.seedAsn } : undefined,
  };`
    );
  }
  if (id === "multistart_fm") {
    return exampleFromFile(
      algo,
      "./partition-algo-champion.js",
      `  const { nodes, edges, sizes } = graph;
  return championBipartition(nodes, edges, sizes, {
    balanceTol: opts.balanceTol ?? 0.25,
    maxPasses: opts.maxPasses ?? 12,
    randomSeed: opts.randomSeed ?? 7,
    terminals: graph.terminals || opts.terminals || null,
  });`
    );
  }

  if (id === "fm" || id === "kl" || id === "spectral") {
    const { text } = await fetchAssetText("./clustering-core.js");
    const need =
      id === "fm"
        ? ["adjacency", "cutsize", "dValues", "fiducciaMattheyses"]
        : id === "kl"
          ? ["adjacency", "cutsize", "dValues", "kernighanLin"]
          : ["cutsize", "laplacian", "dot", "norm", "spectralBisection"];
    const chunks = [];
    for (const name of need) {
      const src = extractTopLevelFunction(text, name);
      if (!src) throw new Error(`Could not extract ${name} from clustering-core.js`);
      chunks.push(stripExport(src));
    }
    const seedImport =
      id === "spectral"
        ? ""
        : `import { randomBipartition } from ${coreHref};\n\n`;
    const body =
      id === "fm"
        ? `  const { nodes, edges } = graph;
  const seedAsn = opts.seedAsn || randomBipartition(nodes, opts.randomSeed ?? 7);
  const maxPasses = opts.maxPasses ?? 10;
  const { assignment, history } = fiducciaMattheyses(
    nodes,
    edges,
    seedAsn,
    maxPasses
  );
  return {
    assignment,
    detail: \`passes=\${history?.length ?? 0}\`,
    history,
    seedUsed: { ...seedAsn },
  };`
        : id === "kl"
          ? `  const { nodes, edges } = graph;
  const seedAsn = opts.seedAsn || randomBipartition(nodes, opts.randomSeed ?? 7);
  const maxPasses = opts.maxPasses ?? 10;
  const { assignment, history } = kernighanLin(nodes, edges, seedAsn, maxPasses);
  return {
    assignment,
    detail: \`passes=\${history?.length ?? 0}\`,
    history,
    seedUsed: { ...seedAsn },
  };`
          : `  const { nodes, edges, sizes } = graph;
  const { assignment, order } = spectralBisection(nodes, edges, sizes);
  return {
    assignment,
    detail: \`fiedler order \${order?.map(([n]) => n).join("") || "?"}\`,
    order,
  };`;
    return `${exampleBanner(
      algo,
      "Full algorithm source from the platform (helpers included). Edit, then Register."
    )}

${seedImport}${chunks.join("\n\n")}

export async function partition(graph, opts = {}) {
${body}
}
`;
  }

  if (id === "random" || id === "greedy" || id === "grow") {
    const { text } = await fetchAssetText("./partitioning-core.js");
    const target =
      id === "random"
        ? "randomBipartition"
        : id === "greedy"
          ? "greedyInitialBipartition"
          : "growBipartition";
    const fn = extractTopLevelFunction(text, target);
    if (!fn) {
      throw new Error(`Could not extract ${target} from partitioning-core.js`);
    }
    const mulberry =
      id === "random" ? extractTopLevelFunction(text, "mulberry32") : null;
    if (id === "random" && !mulberry) {
      throw new Error("Could not extract mulberry32 from partitioning-core.js");
    }
    const imports =
      id === "greedy" || id === "grow"
        ? `import { adjacency } from ${clusterHref};\n\n`
        : "";
    const helpers =
      id === "random" ? `${stripExport(mulberry)}\n\n${stripExport(fn)}` : stripExport(fn);
    const body =
      id === "random"
        ? `  const assignment = randomBipartition(graph.nodes, opts.randomSeed ?? 7);
  return { assignment, detail: \`seed=\${opts.randomSeed ?? 7}\` };`
        : id === "greedy"
          ? `  const { nodes, edges } = graph;
  const assignment = greedyInitialBipartition(nodes, edges);
  return { assignment, detail: "heaviest-edge seed" };`
          : `  const { nodes, edges } = graph;
  const growSeed =
    opts.growSeed && nodes.includes(opts.growSeed)
      ? opts.growSeed
      : [...nodes].sort()[0];
  const assignment = growBipartition(nodes, edges, growSeed);
  return { assignment, detail: \`seed=\${growSeed}\` };`;
    return `${exampleBanner(
      algo,
      "Full constructor source extracted from the platform. Edit, then Register."
    )}

${imports}${helpers}

export async function partition(graph, opts = {}) {
${body}
}
`;
  }

  // multilevel / terminal_fm — call platform entry (large dependency graph)
  return `${exampleBanner(
    algo,
    "Runnable module that calls the platform builtin (same path as the scoreboard). Open partitioning-core.js in the repo for the full implementation."
  )}

import { runPartitionAlgo } from ${coreHref};

export async function partition(graph, opts = {}) {
  const out = await runPartitionAlgo(${JSON.stringify(id)}, graph, {
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

/** Legacy marker still supported for older saved uploads. */
function parseBuiltinIdFromCode(code) {
  const m = String(code || "").match(
    /export\s+const\s+__edaBuiltinId\s*=\s*["'`]([^"'`]+)["'`]/
  );
  return m ? m[1] : null;
}

export function mountPartitionBenchmarkApp(root) {
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
    uploads: loadUploads(), // [{ id, title, code }]
    status: "Idle",
    busy: false,
  };

  function primaryInstanceId() {
    return state.instanceIds[0] || "tiny";
  }

  function extraAlgos() {
    return state.uploads.map((u) => ({
      id: u.id,
      title: u.title,
      isUser: true,
      run: u.run,
    }));
  }

  function vizInstanceLabel(row, report) {
    const id =
      row?.vizInstanceId ||
      row?.instanceId ||
      report?.instanceId ||
      primaryInstanceId();
    return BENCHMARK_INSTANCES[id]?.title || id;
  }

  async function runBench() {
    state.busy = true;
    state.status = "Running…";
    render();
    try {
      let ids =
        state.mode === "average"
          ? state.instanceIds.length
            ? state.instanceIds
            : ALL_INSTANCES
          : [primaryInstanceId()];
      // Scaling plots need ≥2 instances → run average / multi-instance path.
      let mode = state.mode;
      if (state.instanceIds.length >= 2 && state.mode === "selective") {
        ids = [...state.instanceIds];
        mode = "average";
      }
      state.report = await runPartitionBenchmarkDataset(ids, state.algoIds, {
        mode,
        randomSeed: state.randomSeed,
        maxPasses: state.maxPasses,
        extraAlgos: extraAlgos(),
        seedTrials: 2,
      });
      const best = state.report.rows.find((r) => !r.error);
      state.selectedAlgo = best?.algoId || state.report.rows[0]?.algoId || null;
      const label =
        state.report.mode === "average"
          ? `avg ${state.report.instanceIds.join("+")}`
          : state.report.instanceId;
      state.status = `Done — ${state.report.rows.length} solvers (${label})`;
    } catch (err) {
      state.status = `Error: ${err?.message || err}`;
    } finally {
      state.busy = false;
      render();
    }
  }

  function selectedRow() {
    return state.report?.rows.find((r) => r.algoId === state.selectedAlgo) || null;
  }

  function fmt(n, digits = 3) {
    if (n == null || Number.isNaN(n)) return "—";
    if (typeof n === "number" && !Number.isInteger(n)) return n.toFixed(digits);
    return String(n);
  }


  function fmtMetric(row, col) {
    const v = row[col.key];
    if (col.fmt === "na" || v == null || Number.isNaN(v)) {
      if (col.fmt === "na" || col.key in (row.metricNotes || {})) return "N/A";
      return "—";
    }
    if (col.fmt === "bool") return v ? "yes" : "no";
    if (col.fmt === "mem") {
      const memNote = row.memSource === "estimate" ? "*" : "";
      return `${fmtMem(v)}${memNote}`;
    }
    if (col.fmt === "ms") {
      if (reportIsAverage() && row.msMin != null) {
        return `${fmt(v, 2)} (${fmt(row.msMin, 2)}–${fmt(row.msMax, 2)})`;
      }
      return `${fmt(v, 2)} ms`;
    }
    if (col.fmt === "num3") return fmt(v, 3);
    if (col.fmt === "num2") return fmt(v, 2);
    if (col.fmt === "num1") return fmt(v, 1);
    if (col.fmt === "num") return fmt(v, reportIsAverage() ? 2 : 0);
    return String(v);
  }

  function reportIsAverage() {
    return state.report?.mode === "average";
  }

  function buildScoreboard() {
    const report = state.report;
    if (!report) return el("p", { text: "Run a benchmark to fill the scoreboard." });
    const wrap = el("div", { className: "bench-table-scroll" });
    const table = el("table", { className: "rank-table bench-metrics-table", id: "bench-table" });
    const headCells = ["", "Algo", ...METRIC_COLUMNS.map((c) => c.label), "Parts"];
    table.innerHTML = `
      <thead>
        <tr>${headCells.map((h) => `<th>${h}</th>`).join("")}</tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");
    const colSpan = headCells.length;
    for (const row of report.rows) {
      const tr = document.createElement("tr");
      tr.dataset.algo = row.algoId;
      if (row.algoId === state.selectedAlgo) tr.classList.add("is-selected");
      if (row.isUser) tr.classList.add("is-user");
      if (row.error) {
        tr.innerHTML = `<td colspan="${colSpan}">${row.isUser ? "Yours" : ""} ${row.title}: ${row.error}</td>`;
      } else {
        const cells = [
          row.isUser ? '<span class="pill pill-muted">Yours</span>' : "",
          row.title,
          ...METRIC_COLUMNS.map((c) => fmtMetric(row, c)),
          row.parts || "—",
        ];
        tr.innerHTML = cells
          .map((c, i) => `<td class="${i >= 2 ? "num" : ""}">${c}</td>`)
          .join("");
      }
      tr.onclick = () => {
        if (row.error) return;
        state.selectedAlgo = row.algoId;
        render();
      };
      tbody.append(tr);
    }
    wrap.append(table);
    return wrap;
  }

  function buildMetricDetail(row) {
    if (!row || row.error) {
      return el("p", {
        className: "chal-hint",
        text: "Select a scoreboard row for the full metric dictionary (including N/A fields).",
      });
    }
    const dl = el("dl", { className: "bench-metric-dl" });
    for (const col of METRIC_COLUMNS) {
      dl.append(
        el("dt", { text: col.label }),
        el("dd", {
          text:
            fmtMetric(row, col) +
            (row.metricNotes?.[col.key] ? ` · ${row.metricNotes[col.key]}` : ""),
        })
      );
    }
    dl.append(
      el("dt", { text: "Parts" }),
      el("dd", { text: row.parts || "—" }),
      el("dt", { text: "Detail" }),
      el("dd", { text: row.detail || "—" })
    );
    return dl;
  }

  // fmtMem imported from partition-benchmark-plots.js

  function setStatusMsg(msg) {
    state.status = msg;
    const statusEl = root.querySelector(".challenge-status");
    if (statusEl) statusEl.textContent = msg;
  }

  function makePlotPanel(numTitle, canvasId, getSeries, plotOpts, fileStem) {
    const panel = el("section", { className: "panel" });
    const head = el("div", { className: "panel-head bench-scatter-head" });
    head.append(el("h2", { text: numTitle }));
    const saveBtn = el("button", {
      className: "btn btn-secondary",
      type: "button",
      text: "Save PNG (4800×3200)",
    });
    saveBtn.onclick = async () => {
      const series = getSeries();
      if (!series?.length) {
        setStatusMsg("Nothing to save — run with 2+ instances for scaling plots");
        return;
      }
      const res = await downloadPaperPng(series, plotOpts(), fileStem);
      setStatusMsg(res.message);
    };
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
    return { panel, canvas, hint, saveBtn, getSeries, plotOpts };
  }

  function redrawPlot(canvas, getSeries, plotOpts) {
    drawPaperCanvas(canvas, getSeries(), plotOpts());
  }

  async function resolveUploadRunner(code) {
    const builtinId = parseBuiltinIdFromCode(code);
    if (builtinId && BENCHMARK_ALGOS.some((a) => a.id === builtinId)) {
      const bid = builtinId;
      return {
        builtinId: bid,
        run: async (graph, opts = {}) =>
          runPartitionAlgo(bid, graph, { ...opts, extraAlgos: [] }),
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
    // Smoke-test on tiny
    const tiny = BENCHMARK_INSTANCES.tiny.graph();
    const smoke = await Promise.resolve(run(tiny, { randomSeed: 7, maxPasses: 2 }));
    if (!smoke?.assignment) throw new Error("partition() must return { assignment }");
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
        (meta ? `${meta.title} (clone)` : null) ||
        fileName ||
        idBase ||
        "Uploaded solver",
      code,
      run,
      builtinId,
    };
    state.uploads.push(entry);
    persistUploads();
    state.status = builtinId
      ? `Cloned “${entry.title}” — running on dataset…`
      : `Uploaded “${entry.title}” — running on dataset…`;
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
      /* quota / private mode */
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
        /* drop broken stored code */
      }
    }
    state.uploads = next;
  }

  function render() {
    const report = state.report;
    const row = selectedRow();

    root.innerHTML = "";

    const intro = el("div", { className: "starter-note" });
    intro.innerHTML = `
      <p><strong>Partitioning benchmarks</strong> — compare solvers on shared instances
      by <em>runtime</em> and <em>memory</em> (plus cut / balance). Upload your own JS
      module; it runs on the same dataset and appears <strong>above</strong> the built-in list.</p>
      <p class="chal-hint">Client-side only. Uploaded code runs in this browser tab — only load
      solvers you trust. Memory marked * is a structural estimate when heap deltas are unavailable.</p>
    `;

    const controls = el("div", { className: "bench-controls" });

    // Mode
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
          state.instanceIds = [...ALL_INSTANCES];
        }
      };
      lab.append(radio, document.createTextNode(label));
      modeFs.append(lab);
    }

    // Instances
    const instFs = el("fieldset");
    instFs.append(el("legend", { text: "Instances" }));
    const presetRow = el("div", { className: "tool-actions" });
    const mkPreset = (label, ids) =>
      el("button", {
        className: "btn btn-ghost",
        type: "button",
        text: label,
        onClick: () => {
          state.instanceIds = ids.filter((id) => BENCHMARK_INSTANCES[id]);
          if (state.instanceIds.length >= 2) state.mode = "average";
          render();
        },
      });
    presetRow.append(
      mkPreset("Hard suite (composite game)", HARD_SUITE),
      mkPreset("Scale suite (5–40)", SCALE_SUITE),
      mkPreset("Teach suite", TEACH_SUITE),
      mkPreset("All instances", ALL_INSTANCES),
      mkPreset("Tiny only", ["tiny"])
    );
    instFs.append(presetRow);
    for (const [id, inst] of Object.entries(BENCHMARK_INSTANCES)) {
      const lab = el("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = id;
      cb.checked = state.instanceIds.includes(id);
      cb.onchange = () => {
        const checked = [...instFs.querySelectorAll('input[type="checkbox"]:checked')].map(
          (x) => x.value
        );
        if (!checked.length) {
          cb.checked = true;
          state.instanceIds = [id];
        } else {
          state.instanceIds = checked;
        }
      };
      const n = inst.nNodes ?? "?";
      const hardTag = inst.hard ? " [hard]" : "";
      lab.append(cb, document.createTextNode(`${inst.title}${hardTag}`));
      instFs.append(lab);
    }

    // Built-in algos
    const algoFs = el("fieldset");
    algoFs.append(el("legend", { text: "Built-in algorithms" }));
    for (const a of BENCHMARK_ALGOS) {
      const lab = el("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = a.id;
      cb.checked = state.algoIds.includes(a.id);
      cb.onchange = () => {
        state.algoIds = [...algoFs.querySelectorAll("input:checked")].map((x) => x.value);
      };
      lab.append(cb, document.createTextNode(a.title));
      algoFs.append(lab);
    }

    const seedFs = el("fieldset");
    seedFs.append(el("legend", { text: "Controls" }));
    const seedLab = el("label", { text: "Random seed " });
    const seedIn = document.createElement("input");
    seedIn.type = "number";
    seedIn.value = String(state.randomSeed);
    seedIn.onchange = () => {
      state.randomSeed = Number(seedIn.value) || 0;
    };
    seedLab.append(seedIn);
    const passLab = el("label", { text: "Max passes " });
    const passIn = document.createElement("input");
    passIn.type = "number";
    passIn.value = String(state.maxPasses);
    passIn.min = "1";
    passIn.max = "50";
    passIn.onchange = () => {
      state.maxPasses = Math.max(1, Number(passIn.value) || 10);
    };
    passLab.append(passIn);
    seedFs.append(seedLab, passLab);

    controls.append(modeFs, instFs, algoFs, seedFs);

    // Upload panel
    const upload = el("section", { className: "panel bench-upload" });
    upload.innerHTML = `
      <div class="panel-head"><h2>Upload your algorithm</h2></div>
      <div class="panel-body">
        <p>ES module exporting <code>partition(graph, opts)</code> or <code>default</code>.
        Results show on top of the built-in scoreboard. Use <em>Example</em> to load the
        full platform source for a builtin (editable), then Register.</p>
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
        <input id="bench-title" type="text" placeholder="My FM variant" style="width:100%;margin:0.35rem 0 0.75rem" />
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
    });
    runBtn.disabled = state.busy;
    runBtn.onclick = () => runBench();
    const status = el("span", {
      className: "challenge-status idle",
      text: state.status,
    });
    actions.append(runBtn, status);

    const stack = el("div", { className: "bench-stack" });

    const scorePanel = el("section", { className: "panel" });
    scorePanel.append(el("div", { className: "panel-head" }, [el("h2", { text: "1 · Scoreboard" })]));
    const scoreBody = el("div", { className: "panel-body metrics-body" });
    scorePanel.append(scoreBody);

    const partPanel = el("section", { className: "panel" });
    const partHead = el("div", { className: "panel-head bench-scatter-head" });
    partHead.append(el("h2", { text: "2 · Partition view" }));
    const saveGraphBtn = el("button", {
      type: "button",
      className: "btn btn-ghost",
      text: "Save PNG",
    });
    partHead.append(saveGraphBtn);
    partPanel.append(partHead);
    const partBody = el("div", { className: "panel-body" });
    const partHint = el("p", {
      className: "chal-hint",
      id: "bench-part-hint",
      text: "Selected scoreboard row — paper style (same palette as the plots); crimson edges are the cut.",
    });
    const partMeta = el("div", {
      className: "bench-part-meta",
      id: "bench-part-meta",
    });
    const graphCanvas = el("canvas", {
      className: "cluster-canvas bench-partition bench-paper",
      id: "bench-graph",
    });
    stylePaperGraphCanvas(graphCanvas);
    partBody.append(partHint, partMeta, graphCanvas);
    partPanel.append(partBody);

    function paintGraphView(target) {
      const rowNow = selectedRow();
      const rep = state.report;
      if (!rep) return;
      const graph = rowNow?.graph || rep.graph;
      const asn = rowNow?.assignment || rep.seedAsn;
      if (!graph || !asn || (rowNow && rowNow.error)) return;
      drawBipartitionView(target, graph, {
        assignment: asn,
        title: rowNow?.title || "Partition",
      });
    }

    saveGraphBtn.onclick = () =>
      downloadRedrawnPng(paintGraphView, "partition-view");

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
    const cutNcutSeries = () => rowsToMetricXySeries(rows(), "cut", "normalizedCut");
    const cutNcutOpts = () => ({
      xLabel: "Edge cut",
      yLabel: "Normalized cut",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => fmt(v, 3),
      emptyText: "Run benchmark to plot cut vs normalized cut",
    });
    const cutHpwlSeries = () => rowsToMetricXySeries(rows(), "cut", "hpwlProxy");
    const cutHpwlOpts = () => ({
      xLabel: "Edge cut",
      yLabel: "HPWL proxy",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => fmt(v, 1),
      emptyText: "Run benchmark to plot cut vs HPWL proxy",
    });
    const cutCondSeries = () => rowsToMetricXySeries(rows(), "cut", "conductance");
    const cutCondOpts = () => ({
      xLabel: "Edge cut",
      yLabel: "Conductance",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => fmt(v, 3),
      emptyText: "Run benchmark to plot cut vs conductance",
    });
    const seedRobustSeries = () =>
      rowsToMetricXySeries(rows(), "seedCutMean", "seedCutStd");
    const seedRobustOpts = () => ({
      xLabel: "Seed cut μ",
      yLabel: "Seed cut σ",
      selectedId: state.selectedAlgo,
      connect: false,
      formatX: (v) => fmt(v, 2),
      formatY: (v) => fmt(v, 2),
      emptyText: "Run benchmark for seed-robustness scatter",
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
    const memNSeries = () => buildScalingSeries(state.report, "memBytes");
    const memNOpts = () => ({
      xLabel: "Number of nodes",
      yLabel: "Memory",
      selectedId: state.selectedAlgo,
      connect: true,
      formatX: (v) => String(Math.round(v)),
      formatY: (v) => fmtMem(v),
      emptyText: "Select 2+ instances and Run for memory vs n",
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
    const condNSeries = () => buildScalingSeries(state.report, "conductance");
    const condNOpts = () => ({
      xLabel: "Number of nodes",
      yLabel: "Conductance",
      selectedId: state.selectedAlgo,
      connect: true,
      formatX: (v) => String(Math.round(v)),
      formatY: (v) => fmt(v, 3),
      emptyText: "Select 2+ instances and Run for conductance vs n",
    });
    const hpwlNSeries = () => buildScalingSeries(state.report, "hpwlProxy");
    const hpwlNOpts = () => ({
      xLabel: "Number of nodes",
      yLabel: "HPWL proxy",
      selectedId: state.selectedAlgo,
      connect: true,
      formatX: (v) => String(Math.round(v)),
      formatY: (v) => fmt(v, 1),
      emptyText: "Select 2+ instances and Run for HPWL vs n",
    });

    const plotRm = makePlotPanel(
      "3 · Runtime vs memory",
      "bench-scatter-rm",
      rmSeries,
      rmOpts,
      "partition-runtime-memory"
    );
    plotRm.hint.textContent =
      "One point per solver on the current scoreboard. Paper style; Save PNG at 4800×3200.";

    const plotCutNcut = makePlotPanel(
      "4 · Edge cut vs normalized cut",
      "bench-scatter-cut-ncut",
      cutNcutSeries,
      cutNcutOpts,
      "partition-cut-vs-ncut"
    );
    plotCutNcut.hint.textContent =
      "Lower-left is better (small cut and small normalized cut).";

    const plotCutCond = makePlotPanel(
      "5 · Edge cut vs conductance",
      "bench-scatter-cut-cond",
      cutCondSeries,
      cutCondOpts,
      "partition-cut-vs-conductance"
    );
    plotCutCond.hint.textContent =
      "Conductance = cut / min(volume); lower is a sharper community cut.";

    const plotCutHpwl = makePlotPanel(
      "6 · Edge cut vs HPWL proxy",
      "bench-scatter-cut-hpwl",
      cutHpwlSeries,
      cutHpwlOpts,
      "partition-cut-vs-hpwl"
    );
    plotCutHpwl.hint.textContent =
      "Teaching wirelength proxy from layout or synthetic part columns.";

    const plotCutImb = makePlotPanel(
      "7 · Edge cut vs imbalance",
      "bench-scatter-cut-imb",
      cutImbSeries,
      cutImbOpts,
      "partition-cut-vs-imbalance"
    );
    plotCutImb.hint.textContent =
      "Quality–balance tradeoff; scoreboard prefers imbalance ≤ 0.25, then cut/HPWL/seed σ.";

    const plotSeed = makePlotPanel(
      "8 · Seed robustness (μ vs σ)",
      "bench-scatter-seed",
      seedRobustSeries,
      seedRobustOpts,
      "partition-seed-robustness"
    );
    plotSeed.hint.textContent =
      "From 2 seed trials — low σ means stable cut across seeds.";

    const plotRtN = makePlotPanel(
      "9 · Runtime vs number of nodes",
      "bench-scatter-rtn",
      rtNSeries,
      rtNOpts,
      "partition-runtime-vs-nodes"
    );
    plotRtN.hint.textContent =
      "Needs 2+ instances (use Scale suite or Dataset average). Lines connect each solver across sizes.";

    const plotMemN = makePlotPanel(
      "10 · Memory vs number of nodes",
      "bench-scatter-memn",
      memNSeries,
      memNOpts,
      "partition-memory-vs-nodes"
    );
    plotMemN.hint.textContent =
      "Same instance sweep as plot 9 — structural or heap memory vs n.";

    const plotCutN = makePlotPanel(
      "11 · Edge cut vs number of nodes",
      "bench-scatter-cutn",
      cutNSeries,
      cutNOpts,
      "partition-cut-vs-nodes"
    );
    plotCutN.hint.textContent = "How cut scales with instance size.";

    const plotCondN = makePlotPanel(
      "12 · Conductance vs number of nodes",
      "bench-scatter-condn",
      condNSeries,
      condNOpts,
      "partition-conductance-vs-nodes"
    );
    plotCondN.hint.textContent = "Conductance scaling across the instance suite.";

    const plotHpwlN = makePlotPanel(
      "13 · HPWL proxy vs number of nodes",
      "bench-scatter-hpwln",
      hpwlNSeries,
      hpwlNOpts,
      "partition-hpwl-vs-nodes"
    );
    plotHpwlN.hint.textContent = "HPWL proxy scaling across the instance suite.";

    const allPlots = [
      plotRm,
      plotCutNcut,
      plotCutCond,
      plotCutHpwl,
      plotCutImb,
      plotSeed,
      plotRtN,
      plotMemN,
      plotCutN,
      plotCondN,
      plotHpwlN,
    ];

    stack.append(
      scorePanel,
      partPanel,
      ...allPlots.map((p) => p.panel)
    );
    root.append(intro, controls, upload, actions, stack);

    // Upload list
    const listHost = root.querySelector("#bench-upload-list");
    if (!state.uploads.length) {
      listHost.innerHTML = `<p class="chal-hint">No uploads yet.</p>`;
    } else {
      for (const u of state.uploads) {
        const row = el("div", {
          className: "tool-actions",
          html: "",
        });
        row.append(
          el("span", { text: u.title }),
          el("button", {
            className: "btn btn-ghost",
            type: "button",
            text: "Remove",
            onClick: () => removeUpload(u.id),
          })
        );
        listHost.append(row);
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
        render();
      } catch (err) {
        state.status = `Upload failed: ${err?.message || err}`;
        render();
      }
    };

    // Fill the three stacked views
    if (report) {
      scoreBody.append(
        el("p", { text: `${report.instanceTitle} — ${report.notes}` })
      );
      scoreBody.append(
        el("p", {
          className: "chal-hint",
          text: "Composite rank: terminal viol. → bal≤0.25 → cut → critical-net cut → HPWL → seed σ → runtime. Hard suite is the default. Parallel/energy stay N/A in-browser.",
        })
      );
      scoreBody.append(buildScoreboard());
      scoreBody.append(el("h3", { className: "bench-metric-h", text: "Selected solver — metric dictionary" }));
      scoreBody.append(buildMetricDetail(row));
      const lines = [
        `mode: ${report.mode} · instances: ${(report.instanceIds || []).join(", ")}`,
        `uploaded: ${state.uploads.length} · builtins selected: ${state.algoIds.length}`,
        row && !row.error
          ? `${row.isUser ? "[yours] " : ""}${row.title}: ${fmt(row.ms, 2)} ms · ${fmtMem(row.memBytes)} · cut=${fmt(row.cut, 2)} · ncut=${fmt(row.normalizedCut, 3)} · hpwl≈${fmt(row.hpwlProxy, 1)}`
          : "click a scoreboard row to inspect partition + scatter",
        "* memory estimate when heap delta unavailable",
      ];
      scoreBody.append(metricsBlock(lines));

      const graph = row?.graph || report.graph;
      const asn = row?.assignment || report.seedAsn;
      const graphCanvasEl = root.querySelector("#bench-graph");
      const partMeta = root.querySelector("#bench-part-meta");
      const partHint = root.querySelector("#bench-part-hint");
      if (partHint) {
        partHint.textContent = row?.error
          ? "Selected solver failed — pick another scoreboard row."
          : "Selected scoreboard row — paper style (same palette as the plots); left / right = parts · red edges = cut.";
      }
      if (partMeta) {
        partMeta.replaceChildren();
        if (row && !row.error) {
          const instName = vizInstanceLabel(row, report);
          partMeta.append(
            el("span", {
              className: "bench-part-pill",
              text: row.isUser ? `[yours] ${row.title}` : row.title,
            }),
            el("span", {
              className: "bench-part-pill muted",
              text:
                report.mode === "average"
                  ? `view · ${instName}`
                  : instName,
            }),
            el("span", {
              className: "bench-part-pill",
              text:
                report.mode === "average"
                  ? `avg cut ${fmt(row.cut, 2)}`
                  : `cut ${fmt(row.cut, 2)}`,
            }),
            el("span", {
              className: "bench-part-pill",
              text: `balance ${fmt(row.ratio, 2)}`,
            }),
            el("span", {
              className: "bench-part-pill muted",
              text: `${fmt(row.ms, 2)} ms · ${fmtMem(row.memBytes)}`,
            })
          );
        } else if (!row) {
          partMeta.append(
            el("span", {
              className: "chal-hint",
              text: "Click a scoreboard row to inspect its bipartition.",
            })
          );
        }
      }
      if (graph && graphCanvasEl && asn && !(row && row.error)) {
        const paintPart = () => paintGraphView(graphCanvasEl);
        requestAnimationFrame(() => {
          paintPart();
          wirePartitionCanvasResize(graphCanvasEl, paintPart);
          for (const p of allPlots) {
            redrawPlot(p.canvas, p.getSeries, p.plotOpts);
            wireCanvasResize(p.canvas, () =>
              redrawPlot(p.canvas, p.getSeries, p.plotOpts)
            );
          }
        });
      } else {
        requestAnimationFrame(() => {
          for (const p of allPlots) {
            redrawPlot(p.canvas, p.getSeries, p.plotOpts);
            wireCanvasResize(p.canvas, () =>
              redrawPlot(p.canvas, p.getSeries, p.plotOpts)
            );
          }
        });
      }
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
    const fn = mod.partition || mod.default || mod.run;
    if (typeof fn !== "function") {
      throw new Error("Module must export partition(graph, opts) or default function");
    }
    return (graph, opts) => fn(graph, opts);
  } finally {
    URL.revokeObjectURL(url);
  }
}
