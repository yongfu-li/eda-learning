/**
 * Tiny SPICE-lite — MNA / NR / LU / TRAN for learn_spice.
 * Divider Vin=5, R1=2, R2=3 → V2=3; BE TRAN final≈2.255; diode 1-D NR converges.
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  elementCount: 5,
  unknownNodes: 2,
  mnaSize: 3,
  v2Dc: 3.0,
  v1Dc: 5.0,
  nnz: 6,
  nrItersLinear: 1,
  tranDt: 0.5,
  tranSteps: 4,
  tranFinalV2: 2.255181,
  diodeNrConverged: true,
};

export const STARTER = {
  ground: "0",
  nodes: ["0", "1", "2"],
  elements: [
    { id: "Vin", type: "V", p: "1", n: "0", dc: 5.0 },
    { id: "R1", type: "R", a: "1", b: "2", r: 2.0 },
    { id: "R2", type: "R", a: "2", b: "0", r: 3.0 },
    { id: "Cload", type: "C", a: "2", b: "0", c: 1.0 },
    { id: "Dprot", type: "D", a: "1", b: "2", Is: 1e-14, Vt: 0.026 },
  ],
};

export function cloneNet(net = STARTER) {
  return JSON.parse(JSON.stringify(net));
}

export function netlistStats(net = STARTER) {
  const un = net.nodes.filter((n) => n !== net.ground);
  return {
    elementCount: net.elements.length,
    nodeCount: net.nodes.length,
    unknownNodes: un.length,
    ground: net.ground,
    ids: net.elements.map((e) => e.id),
  };
}

function matZeros(n) {
  return Array.from({ length: n }, () => Array(n).fill(0));
}
function vecZeros(n) {
  return Array(n).fill(0);
}

export function solveDense(A, b) {
  const n = b.length;
  const M = A.map((row, i) => row.slice().concat([b[i]]));
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    if (Math.abs(M[piv][col]) < 1e-15) throw new Error("singular");
    [M[col], M[piv]] = [M[piv], M[col]];
    const div = M[col][col];
    for (let j = col; j <= n; j++) M[col][j] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      for (let j = col; j <= n; j++) M[r][j] -= f * M[col][j];
    }
  }
  return M.map((row) => row[n]);
}

function idxMap(net) {
  const un = net.nodes.filter((n) => n !== net.ground);
  return Object.fromEntries(un.map((n, i) => [n, i]));
}

function stampG(G, idx, a, b, g) {
  const ia = idx[a];
  const ib = idx[b];
  const add = (i, j, v) => {
    if (i == null || j == null) return;
    G[i][j] += v;
  };
  add(ia, ia, g);
  add(ib, ib, g);
  add(ia, ib, -g);
  add(ib, ia, -g);
}

export function buildMnaLinearDc(net = STARTER) {
  const idx = idxMap(net);
  const vs = net.elements.filter((e) => e.type === "V");
  const nNode = Object.keys(idx).length;
  const n = nNode + vs.length;
  const G = matZeros(n);
  const b = vecZeros(n);
  const vBranch = {};
  vs.forEach((e, k) => {
    vBranch[e.id] = nNode + k;
  });
  for (const e of net.elements) {
    if (e.type === "R") stampG(G, idx, e.a, e.b, 1 / e.r);
    else if (e.type === "V") {
      const bi = vBranch[e.id];
      const ip = idx[e.p];
      const inn = idx[e.n];
      if (ip != null) {
        G[ip][bi] += 1;
        G[bi][ip] += 1;
      }
      if (inn != null) {
        G[inn][bi] -= 1;
        G[bi][inn] -= 1;
      }
      b[bi] += e.dc;
    }
  }
  return { G, b, idx, vBranch, size: n };
}

export function dcLinearSolve(net = STARTER) {
  const m = buildMnaLinearDc(net);
  const x = solveDense(m.G, m.b);
  const volts = Object.fromEntries(Object.entries(m.idx).map(([n, i]) => [n, x[i]]));
  return { volts, x, size: m.size, G: m.G, b: m.b };
}

export function sparseLuLite(A) {
  const n = A.length;
  const L = matZeros(n);
  const U = A.map((r) => r.slice());
  for (let i = 0; i < n; i++) {
    L[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      L[j][i] = U[j][i] / U[i][i];
      for (let k = i; k < n; k++) U[j][k] -= L[j][i] * U[i][k];
    }
  }
  let nnz = 0;
  for (const row of A) for (const v of row) if (Math.abs(v) > 1e-15) nnz++;
  return { L, U, nnz, n };
}

function diodeI(v, Is, Vt) {
  const x = Math.max(-40, Math.min(40, v / Vt));
  return Is * (Math.exp(x) - 1);
}
function diodeG(v, Is, Vt) {
  const x = Math.max(-40, Math.min(40, v / Vt));
  return (Is * Math.exp(x)) / Vt;
}

export function deviceCallbackDiode(v, Is = 1e-14, Vt = 0.026) {
  return { i: diodeI(v, Is, Vt), g: diodeG(v, Is, Vt), v };
}

export function newtonRaphsonDc(net = STARTER, includeDiode = false, maxIter = 20, tol = 1e-9) {
  const lin = dcLinearSolve(net);
  const idx = idxMap(net);
  const vs = net.elements.filter((e) => e.type === "V");
  const nNode = Object.keys(idx).length;
  const n = nNode + vs.length;
  const vBranch = Object.fromEntries(vs.map((e, k) => [e.id, nNode + k]));
  let x = lin.x.slice();
  const residuals = [];
  let iters = 0;
  for (let it = 0; it < maxIter; it++) {
    iters = it + 1;
    const G = matZeros(n);
    const rhs = vecZeros(n);
    for (const e of net.elements) {
      if (e.type === "R") stampG(G, idx, e.a, e.b, 1 / e.r);
      else if (e.type === "V") {
        const bi = vBranch[e.id];
        const ip = idx[e.p];
        const inn = idx[e.n];
        if (ip != null) {
          G[ip][bi] += 1;
          G[bi][ip] += 1;
        }
        if (inn != null) {
          G[inn][bi] -= 1;
          G[bi][inn] -= 1;
        }
        rhs[bi] += e.dc;
      } else if (e.type === "D" && includeDiode) {
        const ia = idx[e.a];
        const ib = idx[e.b];
        const va = ia != null ? x[ia] : 0;
        const vb = ib != null ? x[ib] : 0;
        const vd = va - vb;
        const g = diodeG(vd, e.Is, e.Vt);
        const i = diodeI(vd, e.Is, e.Vt);
        stampG(G, idx, e.a, e.b, g);
        const ieq = i - g * vd;
        if (ia != null) rhs[ia] -= ieq;
        if (ib != null) rhs[ib] += ieq;
      }
    }
    const xNew = solveDense(G, rhs);
    const err = Math.max(...xNew.map((v, i) => Math.abs(v - x[i])));
    residuals.push(err);
    x = xNew;
    if (err < tol) break;
  }
  const volts = Object.fromEntries(Object.entries(idx).map(([nm, i]) => [nm, x[i]]));
  return { volts, x, iters, residuals, converged: residuals.length && residuals.at(-1) < tol, v2: volts["2"] };
}

export function diodeLoopNewton(V = 1, R = 1000, Is = 1e-12, Vt = 0.026, maxIter = 30, tol = 1e-12) {
  let vd = 0;
  const residuals = [];
  for (let it = 0; it < maxIter; it++) {
    const cb = deviceCallbackDiode(vd, Is, Vt);
    const f = (V - vd) / R - cb.i;
    const df = -1 / R - cb.g;
    const dvd = -f / df;
    vd += dvd;
    residuals.push(Math.abs(dvd));
    if (Math.abs(dvd) < tol) return { vd, iters: it + 1, converged: true, residuals, i: diodeI(vd, Is, Vt) };
  }
  return { vd, iters: maxIter, converged: false, residuals, i: diodeI(vd, Is, Vt) };
}

export function transientBe(net = STARTER, dt = 0.5, steps = 4, v2Init = 0) {
  const caps = net.elements.filter((e) => e.type === "C");
  const hist = [];
  const vc = Object.fromEntries(caps.map((e) => [e.id, v2Init]));
  for (let s = 0; s < steps; s++) {
    const idx = idxMap(net);
    const vs = net.elements.filter((e) => e.type === "V");
    const nNode = Object.keys(idx).length;
    const n = nNode + vs.length;
    const vBranch = Object.fromEntries(vs.map((e, k) => [e.id, nNode + k]));
    const G = matZeros(n);
    const rhs = vecZeros(n);
    for (const e of net.elements) {
      if (e.type === "R") stampG(G, idx, e.a, e.b, 1 / e.r);
      else if (e.type === "V") {
        const bi = vBranch[e.id];
        const ip = idx[e.p];
        const inn = idx[e.n];
        if (ip != null) {
          G[ip][bi] += 1;
          G[bi][ip] += 1;
        }
        if (inn != null) {
          G[inn][bi] -= 1;
          G[bi][inn] -= 1;
        }
        rhs[bi] += e.dc;
      } else if (e.type === "C") {
        const gc = e.c / dt;
        stampG(G, idx, e.a, e.b, gc);
        const ia = idx[e.a];
        const ib = idx[e.b];
        const ieq = gc * vc[e.id];
        if (ia != null) rhs[ia] += ieq;
        if (ib != null) rhs[ib] -= ieq;
      }
    }
    const x = solveDense(G, rhs);
    const volts = Object.fromEntries(Object.entries(idx).map(([nm, i]) => [nm, x[i]]));
    for (const e of caps) vc[e.id] = (volts[e.a] || 0) - (volts[e.b] || 0);
    hist.push({ step: s + 1, t: (s + 1) * dt, volts, v2: volts["2"] || 0 });
  }
  return { history: hist, dt, steps, finalV2: hist.at(-1)?.v2 };
}

export function spiceEngine(net = STARTER) {
  const lin = dcLinearSolve(net);
  const nr = newtonRaphsonDc(net, false);
  const tr = transientBe(net, GOLDENS.tranDt, GOLDENS.tranSteps, 0);
  return {
    dcV2: lin.volts["2"],
    nrV2: nr.v2,
    nrIters: nr.iters,
    nrConverged: nr.converged,
    tranFinalV2: tr.finalV2,
    mnaSize: lin.size,
    diode: diodeLoopNewton(),
    ok: Math.abs(lin.volts["2"] - GOLDENS.v2Dc) < 1e-9,
  };
}

export function drawSpice(canvas, opts = {}) {
  const net = opts.net || STARTER;
  const volts = opts.volts || null;
  const history = opts.history || null;
  const metricText = opts.metricText || null;
  const highlight = new Set(opts.highlight || []);
  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f7f5f0";
  ctx.fillRect(0, 0, W, H);

  // Schematic-ish layout
  const nodes = {
    "0": { x: 80, y: H - 80 },
    "1": { x: 80, y: 100 },
    "2": { x: W / 2, y: 100 },
  };
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  // Vin
  ctx.beginPath();
  ctx.moveTo(nodes["0"].x, nodes["0"].y);
  ctx.lineTo(nodes["1"].x, nodes["1"].y);
  ctx.stroke();
  ctx.fillStyle = highlight.has("Vin") ? "#bc4749" : "#2a6f97";
  ctx.fillRect(nodes["1"].x - 18, (nodes["0"].y + nodes["1"].y) / 2 - 12, 36, 24);
  ctx.fillStyle = "#fff";
  ctx.font = "12px ui-monospace, monospace";
  ctx.fillText("Vin", nodes["1"].x - 12, (nodes["0"].y + nodes["1"].y) / 2 + 4);
  // R1
  ctx.strokeStyle = "#333";
  ctx.beginPath();
  ctx.moveTo(nodes["1"].x, nodes["1"].y);
  ctx.lineTo(nodes["2"].x, nodes["2"].y);
  ctx.stroke();
  ctx.fillStyle = highlight.has("R1") ? "#bc4749" : "#6a994e";
  ctx.fillRect((nodes["1"].x + nodes["2"].x) / 2 - 20, nodes["1"].y - 14, 40, 28);
  ctx.fillStyle = "#fff";
  ctx.fillText("R1", (nodes["1"].x + nodes["2"].x) / 2 - 10, nodes["1"].y + 4);
  // R2 / C to gnd
  ctx.strokeStyle = "#333";
  ctx.beginPath();
  ctx.moveTo(nodes["2"].x, nodes["2"].y);
  ctx.lineTo(nodes["2"].x, nodes["0"].y);
  ctx.stroke();
  ctx.fillStyle = highlight.has("R2") ? "#bc4749" : "#e09f3e";
  ctx.fillRect(nodes["2"].x - 20, (nodes["2"].y + nodes["0"].y) / 2 - 30, 40, 24);
  ctx.fillStyle = "#fff";
  ctx.fillText("R2", nodes["2"].x - 10, (nodes["2"].y + nodes["0"].y) / 2 - 14);
  ctx.fillStyle = highlight.has("Cload") ? "#bc4749" : "#9b2226";
  ctx.fillRect(nodes["2"].x - 20, (nodes["2"].y + nodes["0"].y) / 2 + 10, 40, 24);
  ctx.fillStyle = "#fff";
  ctx.fillText("C", nodes["2"].x - 6, (nodes["2"].y + nodes["0"].y) / 2 + 26);

  for (const [id, p] of Object.entries(nodes)) {
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
    const v = volts ? (volts[id] != null ? volts[id].toFixed(3) : "0") : "—";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(`n${id}=${v}`, p.x + 10, p.y + 4);
  }

  // Waveform strip
  if (history && history.length) {
    const x0 = W * 0.55;
    const y0 = 60;
    const ww = W * 0.4;
    const hh = 160;
    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(x0, y0, ww, hh);
    const ys = history.map((h) => h.v2);
    const maxY = Math.max(...ys, 3.5);
    ctx.strokeStyle = "#2a6f97";
    ctx.beginPath();
    history.forEach((h, i) => {
      const x = x0 + ((i + 1) / history.length) * ww;
      const y = y0 + hh - (h.v2 / maxY) * hh;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = "#333";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("v2(t) TRAN", x0, y0 - 8);
  }

  ctx.fillStyle = "#333";
  ctx.font = "13px system-ui, sans-serif";
  ctx.fillText(metricText || `elements=${net.elements.length}`, 12, 20);
}

export function hitElement(net, canvas, clientX, clientY) {
  // coarse: return highlighted by proximity to center labels — optional
  void net;
  void canvas;
  void clientX;
  void clientY;
  return null;
}
