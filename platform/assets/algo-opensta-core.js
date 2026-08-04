/**
 * Part C OpenSTA algorithms — mirrors courses/learn_opensta/common/algo_solvers.py
 */
import { fitHiDpiCanvas, fitGraphLayout } from "./canvas-hires.js";

export const ALGO_GOLDENS = {
  pinCount: 5,
  arcCount: 4,
  levels: { a: 0, b: 0, n1: 1, n2: 2, y: 3 },
  arrivalY: 2.0,
  requiredY: 10.0,
  slackY: 8.0,
  criticalPath: ["b", "n1", "n2", "y"],
  pathDelay: 2.0,
  engineOk: true,
};

export const PARTC_REAL = {
  afterReadCells: 3,
  pathDelay: 2.0,
  required: 10.0,
  slack: 8.0,
  endpoint: "y",
  startpoint: "b",
  engineOk: true,
};

export const STARTER = {
  clock: { name: "clk", period: 10 },
  pins: [
    { id: "a", kind: "input" },
    { id: "b", kind: "input" },
    { id: "n1", kind: "internal" },
    { id: "n2", kind: "internal" },
    { id: "y", kind: "output" },
  ],
  arcs: [
    { id: "u1A", from: "a", to: "n1", delay: 1.0, cell: "u1" },
    { id: "u1B", from: "b", to: "n1", delay: 1.0, cell: "u1" },
    { id: "u2", from: "n1", to: "n2", delay: 0.5, cell: "u2" },
    { id: "u3", from: "n2", to: "y", delay: 0.5, cell: "u3" },
  ],
};

export function algoGraphBuild(d = STARTER) {
  const pins = d.pins.map((p) => p.id);
  const ok = pins.length === ALGO_GOLDENS.pinCount && d.arcs.length === ALGO_GOLDENS.arcCount;
  return { ok, pins, arcCount: d.arcs.length, highlight: pins, pass: "graph_build", note: "Pins + arcs." };
}

export function algoLevelize(d = STARTER) {
  const levels = {};
  d.pins.filter((p) => p.kind === "input").forEach((p) => (levels[p.id] = 0));
  let changed = true;
  while (changed) {
    changed = false;
    for (const a of d.arcs) {
      if (levels[a.from] == null) continue;
      const nl = levels[a.from] + 1;
      if ((levels[a.to] ?? -1) < nl) {
        levels[a.to] = nl;
        changed = true;
      }
    }
  }
  const ok = JSON.stringify(levels) === JSON.stringify(ALGO_GOLDENS.levels);
  return { ok, levels, highlight: Object.keys(levels), pass: "levelize", note: "Levelize inputs→sinks." };
}

export function algoPropagate(d = STARTER) {
  const levels = algoLevelize(d).levels;
  const order = Object.keys(levels).sort((a, b) => levels[a] - levels[b]);
  const arrivals = {};
  d.pins.filter((p) => p.kind === "input").forEach((p) => (arrivals[p.id] = 0));
  for (const pin of order) {
    const preds = d.arcs.filter((a) => a.to === pin);
    if (!preds.length) continue;
    arrivals[pin] = Math.max(...preds.map((a) => (arrivals[a.from] ?? 0) + a.delay));
  }
  const required = { y: d.clock.period };
  const ok = Math.abs(arrivals.y - ALGO_GOLDENS.arrivalY) < 1e-9;
  return {
    ok,
    arrivals,
    required,
    arrivalY: arrivals.y,
    requiredY: required.y,
    highlight: ["a", "b", "n1", "n2", "y"],
    pass: "propagate",
    note: `A(y)=${arrivals.y} R(y)=${required.y}`,
  };
}

export function algoSlack(d = STARTER) {
  const prop = algoPropagate(d);
  const slack = prop.requiredY - prop.arrivalY;
  const path = ["y"];
  let cur = "y";
  while (true) {
    const preds = d.arcs.filter((a) => a.to === cur);
    if (!preds.length) break;
    const best = preds.reduce((x, y) => {
      const sx = (prop.arrivals[x.from] ?? 0) + x.delay;
      const sy = (prop.arrivals[y.from] ?? 0) + y.delay;
      if (sy !== sx) return sy > sx ? y : x;
      return y.from > x.from ? y : x;
    });
    cur = best.from;
    path.push(cur);
  }
  path.reverse();
  const ok = Math.abs(slack - ALGO_GOLDENS.slackY) < 1e-9 && path.join() === ALGO_GOLDENS.criticalPath.join();
  return {
    ok,
    slack,
    pathDelay: prop.arrivalY,
    criticalPath: path,
    highlight: path,
    pass: "slack",
    note: `slack=${slack} path=${path.join("→")}`,
  };
}

export function openstaAlgoEngine(d = STARTER) {
  const g = algoGraphBuild(d);
  const l = algoLevelize(d);
  const p = algoPropagate(d);
  const s = algoSlack(d);
  const ok = g.ok && l.ok && p.ok && s.ok && ALGO_GOLDENS.engineOk;
  return { ok, pinCount: ALGO_GOLDENS.pinCount, arcCount: g.arcCount, arrivalY: p.arrivalY, slack: s.slack, path: s.criticalPath, pass: "engine" };
}

export function partcBind(stage) {
  if (stage === "graph") {
    const t = algoGraphBuild();
    const ok = t.ok && PARTC_REAL.afterReadCells === 3;
    return { ok, stage, teach: { arcs: t.arcCount }, real: { cells: PARTC_REAL.afterReadCells }, note: "graph ↔ linked cells" };
  }
  if (stage === "propagate") {
    const t = algoPropagate();
    const ok = t.ok && Math.abs(t.arrivalY - PARTC_REAL.pathDelay) < 1e-6;
    return { ok, stage, teach: { Ay: t.arrivalY }, real: { pathDelay: PARTC_REAL.pathDelay }, note: "arrival ↔ report path" };
  }
  if (stage === "slack") {
    const t = algoSlack();
    const ok = t.ok && Math.abs(t.slack - PARTC_REAL.slack) < 1e-6;
    return { ok, stage, teach: { slack: t.slack }, real: { slack: PARTC_REAL.slack }, note: "slack ↔ report MET" };
  }
  const eng = openstaAlgoEngine();
  const ok = eng.ok && PARTC_REAL.engineOk;
  return { ok, stage: "engine", teach: eng, real: PARTC_REAL, note: "algo engine ↔ Part B goldens" };
}

export function drawAlgoOpensta(canvas, opts = {}) {
  const { ctx, w: W, h: H } = fitHiDpiCanvas(canvas);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillText(opts.stageLabel || "OpenSTA algo", 16, 28);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.fillText(opts.metricText || "", 16, 50);

  const items = (opts.highlight || STARTER.pins.map((p) => p.id)).map((id) => ({ id }));
  const layout = {};
  items.forEach((it, i) => {
    layout[it.id] = { x: 70 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90 };
  });
  const fitted = fitGraphLayout(layout, W, H, { pad: 48 });
  const selected = new Set(opts.selected || []);
  for (const [id, pos] of Object.entries(fitted.layout)) {
    const hot = selected.has(id);
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(pos.x - 48, pos.y - 22, 96, 44, 8);
    else ctx.rect(pos.x - 48, pos.y - 22, 96, 44);
    ctx.fillStyle = hot ? "#0ea5e9" : "#1e293b";
    ctx.fill();
    ctx.strokeStyle = hot ? "#38bdf8" : "#475569";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "12px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(id, pos.x, pos.y);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

export function hitTestAlgoOpensta(canvas, highlight, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const layout = {};
  (highlight || []).forEach((id, i) => {
    layout[id] = { x: 70 + (i % 4) * 130, y: 120 + Math.floor(i / 4) * 90 };
  });
  const fitted = fitGraphLayout(layout, canvas.clientWidth, canvas.clientHeight, { pad: 48 });
  for (const [id, pos] of Object.entries(fitted.layout)) {
    if (x >= pos.x - 48 && x <= pos.x + 48 && y >= pos.y - 22 && y <= pos.y + 22) return id;
  }
  return null;
}
