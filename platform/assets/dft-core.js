/**
 * Tiny DFT-insert — scan flops, stitch, lockup for learn_dft_insert.
 * Goldens: flopCount=4, stitchCount=3, lockupCount=1, edgeCount=6, markers=1, engine ok.
 */
import { fitHiDpiCanvas, fitGraphLayout, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  flopCount: 4,
  scanCellCount: 4,
  chainLength: 4,
  stitchCount: 3,
  domainCount: 2,
  lockupCount: 1,
  transformEdgeCount: 6,
  markerCount: 1,
  engineOk: true,
};

export const STARTER = {
  flops: [
    { id: "f1", d: "n_a", q: "n1", clk: "clk", domain: "d0" },
    { id: "f2", d: "n1", q: "n2", clk: "clk", domain: "d0" },
    { id: "f3", d: "n2", q: "n3", clk: "clk", domain: "d0" },
    { id: "f4", d: "n_b", q: "n4", clk: "clk2", domain: "d1" },
  ],
  ports: { si: "scan_in", so: "scan_out", se: "scan_enable" },
  scan_order: ["f1", "f2", "f3", "f4"],
  lockup_between: [["d0", "d1"]],
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

export function designStats(d = STARTER) {
  const domains = [...new Set(d.flops.map((f) => f.domain))].sort();
  return {
    flopCount: d.flops.length,
    domainCount: domains.length,
    domains,
    ports: { ...d.ports },
    flopIds: d.flops.map((f) => f.id),
  };
}

export function identifyScanFlops(d = STARTER) {
  const cells = d.flops.map((f) => ({
    id: f.id,
    type: "SDFF",
    d: f.d,
    q: f.q,
    clk: f.clk,
    domain: f.domain,
    si: null,
    se: d.ports.se,
  }));
  return { cells, count: cells.length };
}

export function scanEnablePort(d = STARTER) {
  return { se: d.ports.se, si: d.ports.si, so: d.ports.so };
}

export function stitchChain(d = STARTER) {
  const order = [...d.scan_order];
  const byId = Object.fromEntries(d.flops.map((f) => [f.id, f]));
  const stitches = [];
  for (let i = 0; i < order.length - 1; i += 1) {
    const a = order[i];
    const b = order[i + 1];
    stitches.push({
      from: a,
      to: b,
      net: `scan_${a}_${b}`,
      src_q: byId[a].q,
    });
  }
  return {
    order,
    stitches,
    stitchCount: stitches.length,
    siHook: { port: d.ports.si, to: order[0] },
    soHook: { from: order[order.length - 1], port: d.ports.so },
  };
}

export function scanOrderCheck(d = STARTER) {
  const order = [...d.scan_order];
  const ids = new Set(d.flops.map((f) => f.id));
  const ok = order.length === ids.size && order.every((id) => ids.has(id));
  return { order, length: order.length, coversAll: ok };
}

export function findLockups(d = STARTER) {
  const order = [...d.scan_order];
  const byId = Object.fromEntries(d.flops.map((f) => [f.id, f]));
  const pairs = new Set(
    (d.lockup_between || []).flatMap(([a, b]) => [`${a}|${b}`, `${b}|${a}`])
  );
  const hits = [];
  for (let i = 0; i < order.length - 1; i += 1) {
    const a = order[i];
    const b = order[i + 1];
    const da = byId[a].domain;
    const db = byId[b].domain;
    if (pairs.has(`${da}|${db}`)) {
      hits.push({ from: a, to: b, domains: [da, db], cell: `lockup_${a}_${b}` });
    }
  }
  return { hits, count: hits.length };
}

export function netlistTransform(d = STARTER) {
  const cells = identifyScanFlops(d).cells.map((c) => ({ ...c }));
  const chain = stitchChain(d);
  const lockups = findLockups(d);
  cells[0].si = d.ports.si;
  chain.stitches.forEach((st, i) => {
    cells[i + 1].si = st.net;
  });
  const edges = [
    { kind: "si", from: d.ports.si, to: chain.order[0] },
    ...chain.stitches.map((st) => ({ kind: "stitch", ...st })),
    { kind: "so", from: chain.order[chain.order.length - 1], to: d.ports.so },
    ...lockups.hits.map((h) => ({ kind: "lockup", ...h })),
  ];
  return {
    cells,
    edges,
    edgeCount: edges.length,
    lockupCount: lockups.count,
    stitchCount: chain.stitchCount,
  };
}

export function collectMarkers(d = STARTER) {
  const lockups = findLockups(d);
  const markers = lockups.hits.map((h) => ({ kind: "lockup", ...h }));
  return { markers, count: markers.length };
}

export function dftEngine(d = STARTER) {
  const stats = designStats(d);
  const cells = identifyScanFlops(d);
  const chain = stitchChain(d);
  const order = scanOrderCheck(d);
  const lockups = findLockups(d);
  const transform = netlistTransform(d);
  const markers = collectMarkers(d);
  const ok =
    cells.count === GOLDENS.scanCellCount &&
    chain.stitchCount === GOLDENS.stitchCount &&
    order.length === GOLDENS.chainLength &&
    lockups.count === GOLDENS.lockupCount &&
    transform.edgeCount === GOLDENS.transformEdgeCount &&
    markers.count === GOLDENS.markerCount &&
    order.coversAll;
  return { stats, cells, chain, order, lockups, transform, markers, ok };
}

function layoutPositions(d = STARTER) {
  const nodes = {};
  const order = d.scan_order;
  const baseX = 120;
  const stepX = 100;
  const y = 120;
  order.forEach((id, i) => {
    const flop = d.flops.find((f) => f.id === id);
    nodes[id] = { x: baseX + i * stepX, y, kind: "flop", domain: flop?.domain };
  });
  nodes.si = { x: 40, y, kind: "port", label: d.ports.si };
  nodes.so = { x: baseX + order.length * stepX + 20, y, kind: "port", label: d.ports.so };
  nodes.se = { x: baseX + (order.length - 1) * stepX * 0.5, y: 40, kind: "se", label: d.ports.se };
  for (let i = 0; i < order.length - 1; i += 1) {
    const a = order[i];
    const b = order[i + 1];
    const edgeId = `stitch_${a}_${b}`;
    const na = nodes[a];
    const nb = nodes[b];
    nodes[edgeId] = {
      x: (na.x + nb.x) / 2,
      y: na.y - 24,
      kind: "stitch",
      from: a,
      to: b,
    };
  }
  const lockups = findLockups(d);
  lockups.hits.forEach((h) => {
    const na = nodes[h.from];
    const nb = nodes[h.to];
    if (!na || !nb) return;
    nodes[`lockup_${h.from}_${h.to}`] = {
      x: (na.x + nb.x) / 2,
      y: na.y + 36,
      kind: "lockup",
      from: h.from,
      to: h.to,
      cell: h.cell,
    };
  });
  nodes.si_edge = { x: (nodes.si.x + nodes[order[0]].x) / 2, y: y - 24, kind: "si_edge" };
  nodes.so_edge = {
    x: (nodes[order[order.length - 1]].x + nodes.so.x) / 2,
    y: y - 24,
    kind: "so_edge",
  };
  return nodes;
}

export function drawDft(canvas, opts = {}) {
  const d = opts.design || STARTER;
  const highlight = new Set(opts.highlight || []);
  const selected = new Set(opts.selected || []);
  const metricText = opts.metricText || null;
  const markers = opts.markers || [];
  const showChain = opts.showChain !== false;
  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight || LAB_CANVAS_CSS_HEIGHT;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f7f5f0";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#5c6570";
  ctx.font = "600 11px ui-sans-serif, system-ui";
  ctx.textAlign = "left";
  ctx.fillText("Scan chain (left → right)", 12, 18);

  const raw = layoutPositions(d);
  const { layout, nodeR, fontPx } = fitGraphLayout(raw, W, H, { pad: 36 });

  const drawEdge = (u, v, style) => {
    const s = layout[u];
    const t = layout[v];
    if (!s || !t) return;
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    if (style.dash) ctx.setLineDash(style.dash);
    else ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(t.x, t.y);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  if (showChain) {
    const order = d.scan_order;
    drawEdge("si", order[0], { color: "#4a6fa5", width: 2 });
    for (let i = 0; i < order.length - 1; i += 1) {
      const a = order[i];
      const b = order[i + 1];
      const hot = highlight.has(a) || highlight.has(b) || highlight.has(`stitch_${a}_${b}`);
      drawEdge(a, b, { color: hot ? "#c45c26" : "#7a8a99", width: hot ? 2.5 : 1.5 });
    }
    drawEdge(order[order.length - 1], "so", { color: "#4a6fa5", width: 2 });
  }

  for (const m of markers) {
    if (m.kind !== "lockup" || !m.from || !m.to) continue;
    const s = layout[m.from];
    const t = layout[m.to];
    if (!s || !t) continue;
    ctx.strokeStyle = "#8b1e1e";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(s.x, s.y + 18);
    ctx.lineTo(t.x, t.y + 18);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#8b1e1e";
    ctx.font = `${Math.max(9, fontPx - 2)}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.fillText("lockup", (s.x + t.x) / 2, s.y + 34);
  }

  for (const [id, s] of Object.entries(layout)) {
    const kind = raw[id]?.kind;
    const on = highlight.has(id) || selected.has(id);
    if (kind === "flop") {
      const w = 56;
      const h = 32;
      const domain = raw[id].domain;
      ctx.fillStyle = on ? "#ffd9a8" : domain === "d1" ? "#e8eef5" : "#d4e4f7";
      ctx.fillRect(s.x - w / 2, s.y - h / 2, w, h);
      ctx.strokeStyle = on ? "#c45c26" : "#4a6fa5";
      ctx.lineWidth = on ? 2.5 : 1.5;
      ctx.strokeRect(s.x - w / 2, s.y - h / 2, w, h);
      ctx.fillStyle = "#1a1f24";
      ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(id, s.x, s.y - 4);
      ctx.font = `${Math.max(9, fontPx - 2)}px ui-sans-serif, system-ui`;
      ctx.fillText(domain, s.x, s.y + 10);
    } else if (kind === "port") {
      ctx.fillStyle = on ? "#ffe8d6" : "#f0ebe3";
      ctx.fillRect(s.x - 28, s.y - 14, 56, 28);
      ctx.strokeStyle = on ? "#c45c26" : "#5c6570";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(s.x - 28, s.y - 14, 56, 28);
      ctx.fillStyle = "#1a1f24";
      ctx.font = `${Math.max(9, fontPx - 2)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(raw[id].label, s.x, s.y);
    } else if (kind === "se") {
      ctx.fillStyle = "#5c6570";
      ctx.font = `600 ${Math.max(10, fontPx - 1)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(`SE: ${raw[id].label}`, s.x, s.y);
    }
  }

  if (markers.length) {
    ctx.fillStyle = "#8b1e1e";
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.textAlign = "left";
    markers.slice(0, 8).forEach((m, i) => {
      const label = m.kind + (m.from ? `:${m.from}→${m.to}` : "");
      ctx.fillText(`• ${label}`, 12, H - 80 + i * 14);
    });
  }
  if (metricText) {
    ctx.fillStyle = "#1a1f24";
    ctx.font = "600 13px ui-sans-serif, system-ui";
    ctx.textAlign = "right";
    ctx.fillText(metricText, W - 12, H - 14);
  }
}

export function hitTestFlop(canvas, design, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const W = canvas.clientWidth;
  const H = canvas.clientHeight || LAB_CANVAS_CSS_HEIGHT;
  const raw = layoutPositions(design);
  const { layout } = fitGraphLayout(raw, W, H, { pad: 36 });
  for (const id of design.scan_order) {
    const s = layout[id];
    if (!s) continue;
    const w = 56;
    const h = 32;
    if (x >= s.x - w / 2 && x <= s.x + w / 2 && y >= s.y - h / 2 && y <= s.y + h / 2) return id;
  }
  return null;
}
