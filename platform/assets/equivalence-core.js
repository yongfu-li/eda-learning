/**
 * Tiny equivalence instance — CEC / SEC literacy for learn_equivalence.
 * Spec f=(a∧b)∨c; impl_good De Morgan; impl_bad (a∧b)∧c; cex a=1,b=1,c=0.
 */
import { fitHiDpiCanvas, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const PI = ["a", "b", "c"];

export const SPEC = {
  pis: ["a", "b", "c"],
  pos: ["f"],
  gates: [
    { id: "g1", op: "AND", inputs: ["a", "b"] },
    { id: "g2", op: "OR", inputs: ["g1", "c"], output: true },
  ],
};

export const IMPL_GOOD = {
  pis: ["a", "b", "c"],
  pos: ["f"],
  gates: [
    { id: "g1", op: "AND", inputs: ["a", "b"] },
    { id: "g2", op: "NOT", inputs: ["g1"] },
    { id: "g3", op: "NOT", inputs: ["c"] },
    { id: "g4", op: "AND", inputs: ["g2", "g3"] },
    { id: "g5", op: "NOT", inputs: ["g4"], output: true },
  ],
};

export const IMPL_BAD = {
  pis: ["a", "b", "c"],
  pos: ["f"],
  gates: [
    { id: "g1", op: "AND", inputs: ["a", "b"] },
    { id: "g2", op: "AND", inputs: ["g1", "c"], output: true },
  ],
};

export const SEQ_SPEC = {
  pis: ["a"],
  pos: ["y"],
  state: ["q"],
  init: { q: 0 },
  gates: [
    { id: "n1", op: "NOT", inputs: ["q"] },
    { id: "n2", op: "AND", inputs: ["a", "n1"] },
    { id: "n3", op: "NOT", inputs: ["a"] },
    { id: "n4", op: "AND", inputs: ["n3", "q"] },
    { id: "d_q", op: "OR", inputs: ["n2", "n4"] },
    { id: "y", op: "BUF", inputs: ["q"], output: true },
  ],
  ffs: [{ id: "ff0", d: "d_q", q: "q" }],
};

export const SEQ_GOOD = {
  pis: ["a"],
  pos: ["y"],
  state: ["q"],
  init: { q: 0 },
  gates: [
    { id: "x1", op: "XOR", inputs: ["a", "q"] },
    { id: "d_q", op: "BUF", inputs: ["x1"] },
    { id: "y", op: "BUF", inputs: ["q"], output: true },
  ],
  ffs: [{ id: "ff0", d: "d_q", q: "q" }],
};

export const SEQ_BAD = {
  pis: ["a"],
  pos: ["y"],
  state: ["q"],
  init: { q: 0 },
  gates: [
    { id: "d_q", op: "NOT", inputs: ["q"] },
    { id: "y", op: "BUF", inputs: ["q"], output: true },
  ],
  ffs: [{ id: "ff0", d: "d_q", q: "q" }],
};

export const GOLDENS = {
  piCount: 3,
  truthRows: 8,
  cex: { a: 1, b: 1, c: 0 },
  specGateCount: 2,
  goodGateCount: 5,
  badGateCount: 2,
  seqSteps: 2,
};

export const CIRCUIT_LAYOUTS = {
  spec: { a: { x: 1, y: 6 }, b: { x: 1, y: 4 }, c: { x: 1, y: 2 }, g1: { x: 4, y: 5 }, g2: { x: 7, y: 3.5 } },
  good: {
    a: { x: 0.8, y: 6.5 },
    b: { x: 0.8, y: 5 },
    c: { x: 0.8, y: 2 },
    g1: { x: 3.2, y: 5.8 },
    g2: { x: 5.2, y: 5.8 },
    g3: { x: 3.2, y: 2 },
    g4: { x: 6.8, y: 4 },
    g5: { x: 9.2, y: 4 },
  },
  bad: { a: { x: 1, y: 6 }, b: { x: 1, y: 4 }, c: { x: 1, y: 2 }, g1: { x: 4, y: 5 }, g2: { x: 7, y: 3.5 } },
  miter: {
    a: { x: 0.6, y: 6 },
    b: { x: 0.6, y: 4.5 },
    c: { x: 0.6, y: 3 },
    g1: { x: 2.8, y: 5.5 },
    g2: { x: 4.8, y: 5 },
    i_g1: { x: 2.8, y: 2.5 },
    i_g2: { x: 4.8, y: 2.5 },
    miter_xor: { x: 7.5, y: 3.8 },
  },
};

function gateMap(c) {
  return Object.fromEntries((c.gates || []).map((g) => [g.id, g]));
}

export function topoOrder(c) {
  const gmap = gateMap(c);
  const ids = Object.keys(gmap);
  const indeg = Object.fromEntries(ids.map((i) => [i, 0]));
  const succ = Object.fromEntries(ids.map((i) => [i, []]));
  for (const g of c.gates || []) {
    for (const inp of g.inputs) {
      if (gmap[inp]) {
        succ[inp].push(g.id);
        indeg[g.id]++;
      }
    }
  }
  const q = ids.filter((i) => indeg[i] === 0);
  const order = [];
  const mut = { ...indeg };
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of succ[u]) {
      mut[v]--;
      if (mut[v] === 0) q.push(v);
    }
  }
  return order;
}

function evalOp(op, ins) {
  const o = String(op).toUpperCase();
  if (o === "NOT") return ins[0] ? 0 : 1;
  if (o === "BUF") return ins[0] ? 1 : 0;
  if (o === "AND") return ins[0] & ins[1];
  if (o === "OR") return ins[0] | ins[1];
  if (o === "XOR") return ins[0] ^ ins[1];
  throw new Error(op);
}

function resolve(name, vals, gmap) {
  if (name in vals) return vals[name];
  if (gmap[name]) return vals[name];
  return 0;
}

export function evaluateCircuit(c, assignment) {
  const vals = { ...assignment };
  const gmap = gateMap(c);
  for (const pi of c.pis || []) vals[pi] = vals[pi] ?? 0;
  for (const st of c.state || []) vals[st] = vals[st] ?? 0;
  for (const gid of topoOrder(c)) {
    const g = gmap[gid];
    const ins = g.inputs.map((i) => (i in vals ? vals[i] : resolve(i, vals, gmap)));
    vals[gid] = evalOp(g.op, ins);
  }
  const out = (c.gates || []).find((g) => g.output);
  if (!out) return 0;
  return vals[out.id] ?? 0;
}

export function allAssignments(pis = PI) {
  const n = pis.length;
  const out = [];
  for (let mask = 0; mask < 1 << n; mask++) {
    const a = {};
    for (let i = 0; i < n; i++) a[pis[i]] = (mask >> i) & 1;
    out.push(a);
  }
  return out;
}

export function buildMiter(spec, impl) {
  const pis = [...spec.pis];
  const gates = [];
  for (const g of spec.gates || []) gates.push({ ...g, output: false });
  const prefix = "i_";
  const imap = gateMap(impl);
  for (const g of impl.gates || []) {
    gates.push({
      ...g,
      id: prefix + g.id,
      inputs: g.inputs.map((x) => (imap[x] ? prefix + x : x)),
      output: false,
    });
  }
  const specOut = (spec.gates || []).find((g) => g.output);
  const implOut = (impl.gates || []).find((g) => g.output);
  gates.push({
    id: "miter_xor",
    op: "XOR",
    inputs: [specOut.id, prefix + implOut.id],
    output: true,
  });
  return { pis, pos: ["miter_out"], gates };
}

export function truthTableCec(spec, impl, dontCare = null) {
  const pis = spec.pis;
  const dc = dontCare || {};
  let rows = 0;
  for (const asn of allAssignments(pis)) {
    let skip = false;
    for (const pi of pis) {
      if (dc[pi] === -1) continue;
      if (pi in dc && (dc[pi] === 0 || dc[pi] === 1) && asn[pi] !== dc[pi]) {
        skip = true;
        break;
      }
    }
    if (skip) continue;
    rows++;
    const s = evaluateCircuit(spec, asn);
    const i = evaluateCircuit(impl, asn);
    if (s !== i) {
      return {
        equivalent: false,
        rowsChecked: rows,
        counterexample: { ...asn },
        specOut: s,
        implOut: i,
      };
    }
  }
  return { equivalent: true, rowsChecked: rows, counterexample: null };
}

export function findCounterexample(spec, impl) {
  return truthTableCec(spec, impl).counterexample;
}

export function structuralHashStats(circuit) {
  const gmap = gateMap(circuit);
  const pis = new Set(circuit.pis || []);
  const state = new Set(circuit.state || []);
  const memo = {};
  function hashSig(name) {
    if (memo[name]) return memo[name];
    if (pis.has(name) || state.has(name)) {
      memo[name] = `PI:${name}`;
      return memo[name];
    }
    const g = gmap[name];
    const child = [...g.inputs.map(hashSig)].sort();
    memo[name] = `${g.op}(${child.join(",")})`;
    return memo[name];
  }
  const gateHashes = {};
  for (const gid of topoOrder(circuit)) gateHashes[gid] = hashSig(gid);
  const unique = new Set(Object.values(gateHashes)).size;
  return {
    totalGates: Object.keys(gateHashes).length,
    uniqueHashes: unique,
    redundant: Object.keys(gateHashes).length - unique,
    gateHashes,
  };
}

export function fraigLite(circuit) {
  const s = structuralHashStats(circuit);
  return { ...s, fraigNodes: s.uniqueHashes };
}

export function encodeSatCnfLite(circuit, assertOutput = null) {
  const pis = circuit.pis || [];
  const varOf = Object.fromEntries(pis.map((p, i) => [p, i + 1]));
  let nextVar = pis.length + 1;
  const clauses = [];
  const gmap = gateMap(circuit);

  function tseitin(g) {
    const op = g.op.toUpperCase();
    const inVars = g.inputs.map((i) => varOf[i]);
    const out = nextVar++;
    if (op === "NOT") {
      const a = inVars[0];
      clauses.push([-a, -out], [a, out]);
    } else if (op === "AND") {
      const [a, b] = inVars;
      clauses.push([-a, -b, out], [a, -out], [b, -out]);
    } else if (op === "OR") {
      const [a, b] = inVars;
      clauses.push([a, b, -out], [-a, out], [-b, out]);
    } else if (op === "XOR") {
      const [a, b] = inVars;
      clauses.push([-a, -b, -out], [a, b, -out], [-a, b, out], [a, -b, out]);
    } else if (op === "BUF") {
      const a = inVars[0];
      clauses.push([-a, out], [a, -out]);
    }
    varOf[g.id] = out;
  }

  for (const gid of topoOrder(circuit)) tseitin(gmap[gid]);
  const outG = (circuit.gates || []).find((g) => g.output);
  const outVar = varOf[outG.id];
  if (assertOutput === 1) clauses.push([outVar]);
  if (assertOutput === 0) clauses.push([-outVar]);
  return { numVars: nextVar - 1, numClauses: clauses.length, clauses, varOf, outputVar: outVar };
}

export function satSatisfiable(cnf) {
  const n = cnf.numVars;
  const order = Array.from({ length: n }, (_, i) => i + 1);
  const assignment = {};

  function clauseOk(cl) {
    let unass = false;
    for (const lit of cl) {
      const v = Math.abs(lit);
      if (!(v in assignment)) {
        unass = true;
        continue;
      }
      const val = assignment[v];
      if ((lit > 0 && val) || (lit < 0 && !val)) return true;
    }
    return unass ? null : false;
  }

  function allSat() {
    for (const cl of cnf.clauses) {
      if (clauseOk(cl) === false) return false;
    }
    return true;
  }

  function dpll() {
    if (!allSat()) return false;
    if (Object.keys(assignment).length === order.length) return true;
    for (const v of order) {
      if (v in assignment) continue;
      for (const val of [false, true]) {
        assignment[v] = val;
        if (allSat() && dpll()) return true;
        delete assignment[v];
      }
      return false;
    }
    return allSat();
  }
  return dpll();
}

export function dontCareMask(spec, impl, mask) {
  return truthTableCec(spec, impl, mask);
}

export function simulateCycle(circuit, assignment) {
  const vals = { ...assignment };
  for (const pi of circuit.pis || []) vals[pi] = vals[pi] ?? 0;
  for (const st of circuit.state || []) vals[st] = vals[st] ?? 0;
  const gmap = gateMap(circuit);
  for (const gid of topoOrder(circuit)) {
    const g = gmap[gid];
    vals[gid] = evalOp(
      g.op,
      g.inputs.map((i) => vals[i] ?? 0)
    );
  }
  const out = (circuit.gates || []).find((g) => g.output);
  const y = vals[out.id] ?? 0;
  const nextState = {};
  for (const ff of circuit.ffs || []) nextState[ff.q] = vals[ff.d] ?? 0;
  return { y, nextState };
}

export function sequentialUnroll(circuit, steps) {
  const pis = circuit.pis || [];
  const state = circuit.state || [];
  const gatesOut = [];
  const unrollPis = state.map((s) => `${s}_0`);
  for (let t = 0; t < steps; t++) for (const pi of pis) unrollPis.push(`${pi}_${t}`);
  for (let t = 0; t < steps; t++) {
    const rename = {};
    for (const pi of pis) rename[pi] = `${pi}_${t}`;
    for (const s of state) rename[s] = `${s}_${t}`;
    for (const g of circuit.gates || []) {
      if (g.output) continue;
      gatesOut.push({
        id: `${g.id}_${t}`,
        op: g.op,
        inputs: g.inputs.map((i) => rename[i] || i),
      });
    }
    for (const ff of circuit.ffs || []) {
      gatesOut.push({ id: `${ff.q}_${t + 1}`, op: "BUF", inputs: [`${ff.d}_${t}`] });
    }
  }
  const last = steps - 1;
  const ySrc = (circuit.gates || []).find((g) => g.output);
  const yIn = ySrc.inputs[0];
  const ySig = `${yIn}_${last}`;
  gatesOut.push({ id: "y_out", op: "BUF", inputs: [ySig], output: true });
  return { pis: unrollPis, pos: ["y"], gates: gatesOut, steps };
}

export function sequentialCecLite(spec, impl, steps = 2) {
  const init = { ...(spec.init || {}) };
  const pis = spec.pis || [];

  function runTrace(circuit, inputs) {
    let state = { ...init };
    const outs = [];
    for (const inp of inputs) {
      const { y, nextState } = simulateCycle(circuit, { ...inp, ...state });
      outs.push(y);
      state = nextState;
    }
    return outs;
  }

  const nIn = pis.length;
  for (let mask = 0; mask < 1 << (nIn * steps); mask++) {
    const seq = [];
    for (let t = 0; t < steps; t++) {
      const inp = {};
      for (let i = 0; i < nIn; i++) inp[pis[i]] = (mask >> (t * nIn + i)) & 1;
      seq.push(inp);
    }
    const oS = runTrace(spec, seq);
    const oI = runTrace(impl, seq);
    if (oS.join(",") !== oI.join(",")) {
      const cex = {};
      seq.forEach((inp, t) => Object.entries(inp).forEach(([k, v]) => (cex[`${k}_${t}`] = v)));
      return { equivalent: false, steps, counterexample: cex };
    }
  }
  const u = sequentialUnroll(spec, steps);
  return { equivalent: true, steps, counterexample: null, unrollPis: u.pis.length };
}

export function comboPairReport() {
  const miterG = buildMiter(SPEC, IMPL_GOOD);
  const cecGood = truthTableCec(SPEC, IMPL_GOOD);
  const cecBad = truthTableCec(SPEC, IMPL_BAD);
  const miterGoodAllZero = allAssignments().every((a) => evaluateCircuit(miterG, a) === 0);
  return {
    truthTableRows: 8,
    specImplGood: cecGood.equivalent,
    specImplBad: cecBad.equivalent,
    badCounterexample: cecBad.counterexample,
    miterGoodAllZero,
    structuralSpec: structuralHashStats(SPEC),
    cnfSpecClauses: encodeSatCnfLite(SPEC).numClauses,
  };
}

function layoutFor(circuit, hint) {
  if (hint && CIRCUIT_LAYOUTS[hint]) return CIRCUIT_LAYOUTS[hint];
  const layout = {};
  (circuit.pis || []).forEach((p, i) => {
    layout[p] = { x: 1, y: 6.5 - i * 1.5 };
  });
  topoOrder(circuit).forEach((gid, i) => {
    layout[gid] = { x: 3.5 + (i % 4) * 2, y: 6 - Math.floor(i / 4) * 2 };
  });
  return layout;
}

export function drawEquivalence(canvas, opts = {}) {
  const circuit = opts.circuit || SPEC;
  const layout = opts.layout || layoutFor(circuit, opts.layoutHint || "spec");
  const highlight = new Set(opts.highlight || []);
  const selected = opts.selected || null;
  const assignment = opts.assignment || null;
  const values = assignment ? (() => {
    const vals = { ...assignment };
    const gmap = gateMap(circuit);
    for (const gid of topoOrder(circuit)) {
      const g = gmap[gid];
      vals[gid] = evalOp(
        g.op,
        g.inputs.map((i) => vals[i] ?? 0)
      );
    }
    return vals;
  })() : null;

  const { ctx, w, h } = fitHiDpiCanvas(canvas, { w: 640, h: LAB_CANVAS_CSS_HEIGHT });
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, w, h);
  const pad = 28;
  const CHIP_W = 11;
  const CHIP_H = 8;
  const scale = Math.min((w - 2 * pad) / CHIP_W, (h - 2 * pad) / CHIP_H);
  const ox = (w - CHIP_W * scale) / 2;
  const oy = h - pad - (h - 2 * pad - CHIP_H * scale) / 2;
  const toScreen = (x, y) => ({ sx: ox + x * scale, sy: oy - y * scale });

  for (const g of circuit.gates || []) {
    for (const inp of g.inputs) {
      const a = layout[inp];
      const b = layout[g.id];
      if (!a || !b) continue;
      const p0 = toScreen(a.x, a.y);
      const p1 = toScreen(b.x, b.y);
      const hot = highlight.has(g.id) || highlight.has(inp);
      ctx.strokeStyle = hot ? "rgba(234,179,8,0.95)" : "rgba(100,116,139,0.75)";
      ctx.lineWidth = hot ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(p0.sx, p0.sy);
      ctx.lineTo(p1.sx, p1.sy);
      ctx.stroke();
    }
  }

  for (const pi of circuit.pis || []) {
    const p = layout[pi];
    if (!p) continue;
    const { sx, sy } = toScreen(p.x, p.y);
    const active = selected === pi || highlight.has(pi);
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(sx, sy, active ? 15 : 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.fillText(pi, sx - 4, sy + 4);
    if (values) {
      ctx.fillStyle = "#1d4ed8";
      ctx.fillText(String(values[pi] ?? 0), sx + 12, sy - 10);
    }
  }

  for (const st of circuit.state || []) {
    const p = layout[st];
    if (!p) continue;
    const { sx, sy } = toScreen(p.x, p.y);
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(sx - 14, sy - 12, 28, 24);
    ctx.fillStyle = "#fff";
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillText(st, sx - 6, sy + 4);
  }

  for (const g of circuit.gates || []) {
    const p = layout[g.id];
    if (!p) continue;
    const { sx, sy } = toScreen(p.x, p.y);
    const active = selected === g.id || highlight.has(g.id);
    const isOut = !!g.output;
    ctx.fillStyle = isOut ? "#ef4444" : active ? "#22c55e" : "#4ade80";
    ctx.fillRect(sx - 22, sy - 14, 44, 28);
    ctx.strokeStyle = "#14532d";
    ctx.strokeRect(sx - 22, sy - 14, 44, 28);
    ctx.fillStyle = "#0f172a";
    ctx.font = "10px ui-sans-serif, system-ui";
    ctx.fillText(g.op, sx - 14, sy - 2);
    ctx.fillText(g.id, sx - 10, sy + 12);
    if (values && values[g.id] != null) {
      ctx.fillStyle = "#7c3aed";
      ctx.fillText(`=${values[g.id]}`, sx + 24, sy + 4);
    }
  }

  if (opts.metricText) {
    ctx.fillStyle = "rgba(15,23,42,0.85)";
    ctx.fillRect(pad, pad - 4, Math.min(420, w - 2 * pad), 22);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "13px ui-sans-serif, system-ui";
    ctx.fillText(opts.metricText, pad + 8, pad + 12);
  }

  return { layout, toScreen };
}

export function hitNode(layout, canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const w = canvas.clientWidth || rect.width || 640;
  const h = canvas.clientHeight || rect.height || LAB_CANVAS_CSS_HEIGHT;
  const pad = 28;
  const CHIP_W = 11;
  const CHIP_H = 8;
  const scale = Math.min((w - 2 * pad) / CHIP_W, (h - 2 * pad) / CHIP_H);
  const ox = (w - CHIP_W * scale) / 2;
  const oy = h - pad - (h - 2 * pad - CHIP_H * scale) / 2;
  const wx = (clientX - rect.left - ox) / scale;
  const wy = (oy - (clientY - rect.top)) / scale;
  let best = null;
  let bestD = 0.75;
  for (const [id, p] of Object.entries(layout)) {
    const d = Math.hypot(p.x - wx, p.y - wy);
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  }
  return best;
}
