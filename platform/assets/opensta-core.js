/**
 * Part A — OpenSTA timing/report map (mirrors courses/learn_opensta/common/solvers.py).
 */
import { fitHiDpiCanvas, fitGraphLayout } from "./canvas-hires.js";

export const GOLDENS = {
  cellCount: 3,
  pathDelay: 2.0,
  slackAtPeriod10: 8.0,
  arrivalY: 2.0,
  requiredY: 10.0,
  clockPeriod: 10.0,
  clockName: "clk",
  reportEndpoint: "y",
  engineOk: true,
};

export const STARTER = {
  clock: { name: "clk", period: 10.0 },
  ports: { in: ["a", "b"], out: ["y"], clk: ["clk"] },
  pins: ["a", "b", "n1", "n2", "y", "clk"],
  cells: [
    { id: "u1", type: "AND2", a: "a", b: "b", y: "n1", delay: 1.0 },
    { id: "u2", type: "BUF", a: "n1", y: "n2", delay: 0.5 },
    { id: "u3", type: "INV", a: "n2", y: "y", delay: 0.5 },
  ],
  arrivals: { a: 0, b: 0, n1: 1.0, n2: 1.5, y: 2.0 },
  required: { y: 10.0 },
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

export function pathDelay(d = STARTER) {
  return d.cells.reduce((s, c) => s + Number(c.delay), 0);
}

export function slack(d = STARTER) {
  return Number(d.clock.period) - pathDelay(d);
}

export function stageTimingGraph(d = STARTER) {
  const design = cloneDesign(d);
  return {
    ok: design.cells.length === GOLDENS.cellCount,
    cells: design.cells.length,
    highlight: design.cells.map((c) => c.id),
    design,
    pass: "timing_graph",
    note: "Netlist cells form the timing graph.",
    stageLabel: "timing graph",
    metricText: `cells=${design.cells.length}`,
  };
}

export function stageSdcClocks(d = STARTER) {
  const design = cloneDesign(d);
  const ok =
    design.clock.name === GOLDENS.clockName && Number(design.clock.period) === GOLDENS.clockPeriod;
  return {
    ok,
    clock: design.clock.name,
    period: Number(design.clock.period),
    highlight: ["clk"],
    design,
    pass: "sdc_clocks",
    note: "create_clock -period 10 [get_ports clk]",
    stageLabel: "SDC clocks",
    metricText: `period=${design.clock.period}`,
  };
}

export function stageArrival(d = STARTER) {
  const design = cloneDesign(d);
  const ay = Number(design.arrivals.y);
  return {
    ok: Math.abs(ay - GOLDENS.arrivalY) < 1e-9,
    arrivals: design.arrivals,
    arrivalY: ay,
    highlight: ["a", "b", "n1", "n2", "y"],
    design,
    pass: "arrival",
    note: "Forward max arrival → y=2.0",
    stageLabel: "arrival",
    metricText: `A(y)=${ay}`,
  };
}

export function stageRequired(d = STARTER) {
  const design = cloneDesign(d);
  const ry = Number(design.required.y);
  return {
    ok: Math.abs(ry - GOLDENS.requiredY) < 1e-9,
    required: design.required,
    requiredY: ry,
    highlight: ["y"],
    design,
    pass: "required",
    note: "Required(y)=period=10",
    stageLabel: "required",
    metricText: `R(y)=${ry}`,
  };
}

export function stageSlack(d = STARTER) {
  const design = cloneDesign(d);
  const s = slack(design);
  return {
    ok: Math.abs(s - GOLDENS.slackAtPeriod10) < 1e-9,
    slack: s,
    pathDelay: pathDelay(design),
    highlight: ["y"],
    design,
    pass: "slack",
    note: "slack = 10 − 2 = 8",
    stageLabel: "slack",
    metricText: `S=${s}`,
  };
}

export function stageReportChecks(d = STARTER) {
  const design = cloneDesign(d);
  const s = slack(design);
  return {
    ok: GOLDENS.reportEndpoint === "y" && Math.abs(s - GOLDENS.slackAtPeriod10) < 1e-9,
    endpoint: "y",
    slack: s,
    pathDelay: pathDelay(design),
    highlight: ["u1", "u2", "u3", "y"],
    design,
    pass: "report_checks",
    note: "report_checks → endpoint y slack 8",
    stageLabel: "report_checks",
    metricText: `endpoint=y S=${s}`,
  };
}

export function openstaEngine(d = STARTER) {
  const stages = [
    stageTimingGraph(d),
    stageSdcClocks(d),
    stageArrival(d),
    stageRequired(d),
    stageSlack(d),
    stageReportChecks(d),
  ];
  const ok = stages.every((s) => s.ok) && GOLDENS.engineOk;
  return {
    ok,
    cells: GOLDENS.cellCount,
    pathDelay: GOLDENS.pathDelay,
    slack: GOLDENS.slackAtPeriod10,
    arrivalY: GOLDENS.arrivalY,
    highlight: ["u1", "u2", "u3", "y"],
    design: cloneDesign(d),
    pass: "engine",
    stageLabel: "engine",
    metricText: ok ? "engine ok" : "engine fail",
  };
}

export function drawOpensta(canvas, opts = {}) {
  const design = opts.design || STARTER;
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || "OpenSTA map", 16, 28);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.fillText(opts.metricText || "", 16, 50);

  const items = [];
  for (const c of design.cells) items.push({ id: c.id, label: `${c.id}\n${c.type}`, kind: "cell" });
  for (const p of design.pins || []) {
    if (!items.some((it) => it.id === p)) items.push({ id: p, label: p, kind: "pin" });
  }

  const layout = {};
  items.forEach((it, i) => {
    layout[it.id] = { x: 70 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90, ...it };
  });
  const fitted = fitGraphLayout(layout, W, H, { pad: 48 });
  const selected = new Set(opts.selected || []);
  const highlight = new Set(opts.highlight || []);

  for (const [id, pos] of Object.entries(fitted.layout)) {
    const hot = selected.has(id) || highlight.has(id);
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(pos.x - 48, pos.y - 24, 96, 48, 8);
    else ctx.rect(pos.x - 48, pos.y - 24, 96, 48);
    ctx.fillStyle = hot ? "#0ea5e9" : pos.kind === "cell" ? "#1e293b" : "#334155";
    ctx.fill();
    ctx.strokeStyle = hot ? "#38bdf8" : "#475569";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "11px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = String(pos.label || id).split("\n");
    lines.forEach((ln, li) => ctx.fillText(ln, pos.x, pos.y + (li - (lines.length - 1) / 2) * 12));
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

export function hitTestOpensta(canvas, design, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const items = [];
  for (const c of (design || STARTER).cells) items.push({ id: c.id });
  for (const p of (design || STARTER).pins || []) items.push({ id: p });
  const layout = {};
  items.forEach((it, i) => {
    layout[it.id] = { x: 70 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90 };
  });
  const fitted = fitGraphLayout(layout, canvas.clientWidth, canvas.clientHeight, { pad: 48 });
  for (const [id, pos] of Object.entries(fitted.layout)) {
    if (x >= pos.x - 48 && x <= pos.x + 48 && y >= pos.y - 24 && y <= pos.y + 24) return id;
  }
  return null;
}
