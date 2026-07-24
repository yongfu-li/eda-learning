/**
 * Tiny buffering instance — driver D → S0 → {S1,S2} on 12×8 chip.
 * Van Ginneken lite / slew-driven buffer insertion for learn_buffering.
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const CHIP_W = 12;
export const CHIP_H = 8;

export const DRIVER = { id: "D", x: 1, y: 4 };

export const SINKS = [
  { id: "S0", x: 5, y: 4, cload: 1.0 },
  { id: "S1", x: 9, y: 2, cload: 1.5 },
  { id: "S2", x: 9, y: 6, cload: 1.2 },
];

export const EDGES = [
  { id: "e0", a: "D", b: "S0" },
  { id: "e1", a: "S0", b: "S1" },
  { id: "e2", a: "S0", b: "S2" },
];

export const R_PER = 1;
export const C_PER = 1;
export const SLEW_LIMIT = 8;
export const CANDIDATE_STEP = 2;

export const BUFFER_LIBRARY = [
  { id: "BUF_X1", cin: 1, rout: 1, delay: 1, invert: false },
  { id: "BUF_X2", cin: 2, rout: 0.5, delay: 0.8, invert: false },
  { id: "INV_X1", cin: 1, rout: 1, delay: 1.1, invert: true },
];

export const GOLDENS = {
  sinkCount: 3,
  edgeCount: 3,
  libCount: 3,
  slewLimit: 8,
  candidateStep: 2,
  wireRcLen4R: 4,
  vgImproves: true,
  fanoutInserted: true,
};

export function nodeMap(driver = DRIVER, sinks = SINKS) {
  const m = { [driver.id]: { x: driver.x, y: driver.y } };
  for (const s of sinks) m[s.id] = { x: s.x, y: s.y, cload: s.cload ?? 1 };
  return m;
}

export function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function edgeLength(edge, nodes = nodeMap()) {
  return manhattan(nodes[edge.a], nodes[edge.b]);
}

export function wireRc(length, rPer = R_PER, cPer = C_PER) {
  return { R: length * rPer, C: length * cPer, length };
}

export function elmoreDelay(R, Cself, Cload) {
  return R * (Cself / 2 + Cload);
}

export function estimateSlew(R, Ctotal, k = 2.2) {
  return k * R * Ctotal;
}

export function slewOk(slew, limit = SLEW_LIMIT) {
  return slew <= limit + 1e-9;
}

export function candidateSites(step = CANDIDATE_STEP, edges = EDGES, nodes = nodeMap()) {
  const sites = [];
  let sid = 0;
  for (const e of edges) {
    const a = nodes[e.a];
    const b = nodes[e.b];
    const length = manhattan(a, b);
    if (length < step) continue;
    const n = Math.floor(length / step);
    for (let i = 1; i <= n; i++) {
      const dist = i * step;
      if (dist >= length - 1e-9) break;
      let x;
      let y;
      if (a.x === b.x || a.y === b.y) {
        const t = dist / length;
        x = a.x + t * (b.x - a.x);
        y = a.y + t * (b.y - a.y);
      } else {
        const hlen = Math.abs(b.x - a.x);
        if (dist <= hlen) {
          x = a.x + (b.x >= a.x ? dist : -dist);
          y = a.y;
        } else {
          x = b.x;
          const rem = dist - hlen;
          y = a.y + (b.y >= a.y ? rem : -rem);
        }
      }
      sites.push({ id: `c${sid++}`, edge: e.id, x, y, t: dist / length });
    }
  }
  return sites;
}

export function dominatePrune(options) {
  const sorted = [...options].sort((a, b) => a.c - b.c || a.d - b.d);
  const kept = [];
  let bestD = Infinity;
  for (const o of sorted) {
    if (o.d < bestD - 1e-12) {
      kept.push({ ...o });
      bestD = o.d;
    }
  }
  return kept;
}

export function vanGinnekenEdge(length, cload, library = BUFFER_LIBRARY, allowInvert = false) {
  const rc = wireRc(length);
  const options = [];
  const dWire = elmoreDelay(rc.R, rc.C, cload);
  options.push({ c: rc.C + cload, d: dWire, buf: null, kind: "wire" });
  const mid = length / 2;
  for (const buf of library) {
    if (buf.invert && !allowInvert) continue;
    const rc1 = wireRc(mid);
    const rc2 = wireRc(mid);
    const dDown = elmoreDelay(rc2.R, rc2.C, cload) + buf.delay;
    const dUp = elmoreDelay(rc1.R, rc1.C, buf.cin) + dDown;
    options.push({ c: rc1.C + buf.cin, d: dUp, buf: buf.id, kind: "buffered" });
  }
  const pruned = dominatePrune(options);
  const best = pruned.reduce((a, b) => (a.d <= b.d ? a : b));
  return { options: pruned, best, wireOnly: options[0] };
}

export function vanGinnekenNet(driver = DRIVER, sinks = SINKS, edges = EDGES) {
  const nodes = nodeMap(driver, sinks);
  const branchC = sinks.reduce((s, x) => s + (x.cload ?? 1), 0);
  const per = {};
  const e0 = edges.find((e) => e.id === "e0");
  per.e0 = vanGinnekenEdge(edgeLength(e0, nodes), branchC);
  for (const [eid, sid] of [
    ["e1", "S1"],
    ["e2", "S2"],
  ]) {
    const e = edges.find((x) => x.id === eid);
    const sink = sinks.find((s) => s.id === sid);
    per[eid] = vanGinnekenEdge(edgeLength(e, nodes), sink?.cload ?? 1);
  }
  const bestDelay = per.e0.best.d + Math.max(per.e1.best.d, per.e2.best.d);
  const wireDelay = per.e0.wireOnly.d + Math.max(per.e1.wireOnly.d, per.e2.wireOnly.d);
  return { perEdge: per, bestDelay, wireDelay, improved: bestDelay < wireDelay - 1e-9 };
}

export function slewOnEdge(edgeId, cload, edges = EDGES, nodes = nodeMap()) {
  const e = edges.find((x) => x.id === edgeId);
  const rc = wireRc(edgeLength(e, nodes));
  return estimateSlew(rc.R, rc.C + cload);
}

export function slewDrivenInsert(limit = SLEW_LIMIT, driver = DRIVER, sinks = SINKS, edges = EDGES) {
  const nodes = nodeMap(driver, sinks);
  const insertions = [];
  for (const e of edges) {
    const cl = nodes[e.b]?.cload ?? 2;
    const sl = slewOnEdge(e.id, cl, edges, nodes);
    if (!slewOk(sl, limit)) {
      const a = nodes[e.a];
      const b = nodes[e.b];
      insertions.push({
        edge: e.id,
        buf: "BUF_X1",
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
        slewBefore: sl,
      });
    }
  }
  return { insertions, count: insertions.length, slewLimit: limit };
}

export function polarityFix(pathBufs, library = BUFFER_LIBRARY) {
  const byId = Object.fromEntries(library.map((b) => [b.id, b]));
  let flips = 0;
  for (const b of pathBufs) {
    const cell = byId[b.buf || b.id] || b;
    if (cell.invert) flips++;
  }
  return { flips, positive: flips % 2 === 0 };
}

export function fanoutBufferTree(sinks = SINKS, maxFanout = 2) {
  const need = sinks.length > maxFanout;
  const s0 = sinks.find((s) => s.id === "S0") || sinks[0];
  const buffers = need ? [{ id: "fanout_buf", buf: "BUF_X2", x: s0.x, y: s0.y }] : [];
  return { buffers, fanout: sinks.length, maxFanout, inserted: need };
}

export function sequentialBuffer(mode = "van_ginneken") {
  const vg = vanGinnekenNet();
  const slew = slewDrivenInsert();
  const fan = fanoutBufferTree();
  return {
    mode,
    vanGinneken: vg,
    slewDriven: slew,
    fanout: fan,
    primary: mode === "slew" ? slew : vg,
    sites: candidateSites(),
  };
}

export function drawBuffering(canvas, opts = {}) {
  const driver = opts.driver || DRIVER;
  const sinks = opts.sinks || SINKS;
  const edges = opts.edges || EDGES;
  const sites = opts.sites || [];
  const buffers = opts.buffers || [];
  const highlight = new Set(opts.highlight || []);
  const selectedEdge = opts.selectedEdge || null;
  const { ctx, w, h } = fitHiDpiCanvas(canvas, { w: 640, h: LAB_CANVAS_CSS_HEIGHT });
  ctx.clearRect(0, 0, w, h);
  const pad = 28;
  const scale = Math.min((w - 2 * pad) / CHIP_W, (h - 2 * pad) / CHIP_H);
  const ox = (w - CHIP_W * scale) / 2;
  const oy = h - pad - (h - 2 * pad - CHIP_H * scale) / 2;
  const toScreen = (x, y) => ({ sx: ox + x * scale, sy: oy - y * scale });

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  for (let x = 0; x <= CHIP_W; x++) {
    const a = toScreen(x, 0);
    const b = toScreen(x, CHIP_H);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }
  for (let y = 0; y <= CHIP_H; y++) {
    const a = toScreen(0, y);
    const b = toScreen(CHIP_W, y);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }

  const nodes = nodeMap(driver, sinks);
  for (const e of edges) {
    const a = nodes[e.a];
    const b = nodes[e.b];
    const p0 = toScreen(a.x, a.y);
    const p1 = toScreen(b.x, b.y);
    const hot = selectedEdge === e.id || highlight.has(e.id);
    ctx.strokeStyle = hot ? "rgba(234,179,8,0.95)" : "rgba(14,165,233,0.8)";
    ctx.lineWidth = hot ? 3.5 : 2.5;
    ctx.beginPath();
    ctx.moveTo(p0.sx, p0.sy);
    ctx.lineTo(p1.sx, p1.sy);
    ctx.stroke();
  }

  for (const s of sites) {
    const { sx, sy } = toScreen(s.x, s.y);
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.beginPath();
    ctx.arc(sx, sy, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const b of buffers) {
    const { sx, sy } = toScreen(b.x, b.y);
    ctx.fillStyle = b.invert || b.buf === "INV_X1" ? "#a855f7" : "#f59e0b";
    ctx.fillRect(sx - 7, sy - 7, 14, 14);
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx - 7, sy - 7, 14, 14);
  }

  const dSc = toScreen(driver.x, driver.y);
  ctx.fillStyle = "#eab308";
  ctx.beginPath();
  ctx.moveTo(dSc.sx, dSc.sy - 10);
  ctx.lineTo(dSc.sx + 9, dSc.sy + 8);
  ctx.lineTo(dSc.sx - 9, dSc.sy + 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#713f12";
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.fillText("D", dSc.sx + 10, dSc.sy - 4);

  const colors = { S0: "#22c55e", S1: "#3b82f6", S2: "#ef4444" };
  for (const s of sinks) {
    const { sx, sy } = toScreen(s.x, s.y);
    const active = highlight.has(s.id);
    ctx.beginPath();
    ctx.arc(sx, sy, active ? 10 : 7, 0, Math.PI * 2);
    ctx.fillStyle = colors[s.id] || "#1e293b";
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.fillText(s.id, sx + 8, sy - 8);
  }

  const origin = toScreen(0, CHIP_H);
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;
  ctx.strokeRect(origin.sx, origin.sy, CHIP_W * scale, CHIP_H * scale);

  if (opts.metricText) {
    ctx.fillStyle = "rgba(15,23,42,0.82)";
    ctx.fillRect(pad, pad - 4, 200, 22);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "13px ui-sans-serif, system-ui";
    ctx.fillText(opts.metricText, pad + 8, pad + 12);
  }

  return { scale, ox, oy, toScreen };
}

export function canvasToPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const w = canvas.clientWidth || rect.width || 640;
  const h = canvas.clientHeight || rect.height || LAB_CANVAS_CSS_HEIGHT;
  const pad = 28;
  const scale = Math.min((w - 2 * pad) / CHIP_W, (h - 2 * pad) / CHIP_H);
  const ox = (w - CHIP_W * scale) / 2;
  const oy = h - pad - (h - 2 * pad - CHIP_H * scale) / 2;
  return { x: (clientX - rect.left - ox) / scale, y: (oy - (clientY - rect.top)) / scale, scale };
}

export function hitSink(sinks, canvas, clientX, clientY) {
  const world = canvasToPoint(canvas, clientX, clientY);
  let best = null;
  let bestD = 12 / Math.max(world.scale, 1e-9);
  for (const s of sinks) {
    const d = Math.hypot(s.x - world.x, s.y - world.y);
    if (d <= bestD) {
      bestD = d;
      best = s.id;
    }
  }
  return best;
}
