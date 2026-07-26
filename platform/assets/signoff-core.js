/**
 * Tiny signoff — corners, checks, ECO, tapeout for learn_signoff.
 * Goldens: cornerCount=3, failCount=2, ecoCount=2, markers=2, engine ok.
 */
import { fitHiDpiCanvas, fitGraphLayout, LAB_CANVAS_CSS_HEIGHT } from "./canvas-hires.js";

export const GOLDENS = {
  cornerCount: 3,
  signoffCorner: "ss_0p9_125",
  signoffDerate: 1.1,
  checkCount: 6,
  failCount: 2,
  passCount: 4,
  ecoCount: 2,
  ecoFixesAll: true,
  tapeoutRequired: 4,
  tapeoutReadyBeforeEco: false,
  tapeoutReadyAfterEco: true,
  markerCount: 2,
  engineOk: true,
};

export const STARTER = {
  corners: [
    { id: "ss_0p9_125", process: "ss", vdd: 0.9, temp: 125, derate: 1.1 },
    { id: "tt_1p0_25", process: "tt", vdd: 1.0, temp: 25, derate: 1.0 },
    { id: "ff_1p1_m40", process: "ff", vdd: 1.1, temp: -40, derate: 0.9 },
  ],
  signoff_corner: "ss_0p9_125",
  checks: [
    { id: "sta", name: "STA", status: "fail", slack: -0.05 },
    { id: "drc", name: "DRC", status: "pass", count: 0 },
    { id: "lvs", name: "LVS", status: "pass", count: 0 },
    { id: "erc", name: "ERC", status: "pass", count: 0 },
    { id: "antenna", name: "Antenna", status: "fail", count: 1 },
    { id: "ir", name: "IR", status: "pass", drop: 0.04 },
  ],
  ecos: [
    { id: "eco1", kind: "buffer", net: "n_crit", fixes: ["sta"] },
    { id: "eco2", kind: "jumper", net: "n_ant", fixes: ["antenna"] },
  ],
  tapeout_items: [
    { id: "t1", label: "All corners clean", required: true },
    { id: "t2", label: "DRC/LVS/ERC pass", required: true },
    { id: "t3", label: "Antenna clean", required: true },
    { id: "t4", label: "IR within budget", required: true },
    { id: "t5", label: "Release notes filed", required: false },
  ],
};

export function cloneDesign(d = STARTER) {
  return JSON.parse(JSON.stringify(d));
}

export function designStats(d = STARTER) {
  return {
    cornerCount: d.corners.length,
    checkCount: d.checks.length,
    ecoCount: d.ecos.length,
    tapeoutCount: d.tapeout_items.length,
    signoffCorner: d.signoff_corner,
  };
}

export function listCorners(d = STARTER) {
  return { corners: d.corners.map((c) => ({ ...c })), count: d.corners.length };
}

export function pickSignoffCorner(d = STARTER) {
  const cid = d.signoff_corner;
  const corner = d.corners.find((c) => c.id === cid);
  return { corner: { ...corner }, derate: corner.derate };
}

export function applyDerate(delay, d = STARTER) {
  const pick = pickSignoffCorner(d);
  const derate = pick.derate;
  return { delay, derate, derated: delay * derate };
}

export function runChecks(d = STARTER) {
  const checks = d.checks.map((c) => ({ ...c }));
  const fails = checks.filter((c) => c.status === "fail");
  const passes = checks.filter((c) => c.status === "pass");
  return {
    checks,
    fails,
    passes,
    failCount: fails.length,
    passCount: passes.length,
  };
}

export function ecoPlan(d = STARTER) {
  const fails = new Set(d.checks.filter((c) => c.status === "fail").map((c) => c.id));
  const covered = new Set();
  for (const eco of d.ecos) {
    for (const fix of eco.fixes) covered.add(fix);
  }
  return {
    ecos: d.ecos.map((e) => ({ ...e, fixes: [...e.fixes] })),
    ecoCount: d.ecos.length,
    fails: [...fails].sort(),
    covered: [...covered].sort(),
    fixesAll: [...fails].every((id) => covered.has(id)),
  };
}

export function applyEcos(d = STARTER) {
  const plan = ecoPlan(d);
  const fixed = new Set(plan.covered);
  const checks = d.checks.map((c) => {
    const cc = { ...c };
    if (fixed.has(cc.id) && cc.status === "fail") {
      cc.status = "pass";
      if ("slack" in cc) cc.slack = 0.02;
      if ("count" in cc) cc.count = 0;
    }
    return cc;
  });
  const d2 = cloneDesign(d);
  d2.checks = checks;
  return {
    design: d2,
    checks,
    failCount: checks.filter((c) => c.status === "fail").length,
  };
}

export function tapeoutChecklist(d = STARTER, afterEco = false) {
  let work = d;
  if (afterEco) work = applyEcos(d).design;
  const checks = runChecks(work);
  const fails = new Set(checks.fails.map((c) => c.id));
  const itemOk = {
    t1: true,
    t2: !["drc", "lvs", "erc"].some((id) => fails.has(id)),
    t3: !fails.has("antenna"),
    t4: !fails.has("ir"),
    t5: true,
  };
  const items = work.tapeout_items.map((t) => ({
    ...t,
    ok: itemOk[t.id] ?? false,
  }));
  const required = items.filter((i) => i.required);
  return {
    items,
    requiredCount: required.length,
    ready: required.every((i) => i.ok),
    afterEco,
  };
}

export function collectMarkers(d = STARTER) {
  const fails = runChecks(d).fails;
  const markers = fails.map((c) => ({ kind: "check_fail", check: c.id, name: c.name }));
  return { markers, count: markers.length };
}

export function signoffEngine(d = STARTER) {
  const stats = designStats(d);
  const corner = pickSignoffCorner(d);
  const checks = runChecks(d);
  const ecos = ecoPlan(d);
  const tapeoutBefore = tapeoutChecklist(d, false);
  const tapeoutAfter = tapeoutChecklist(d, true);
  const markers = collectMarkers(d);
  const ok =
    stats.cornerCount === GOLDENS.cornerCount &&
    corner.corner.id === GOLDENS.signoffCorner &&
    Math.abs(corner.derate - GOLDENS.signoffDerate) < 1e-9 &&
    checks.failCount === GOLDENS.failCount &&
    ecos.fixesAll === GOLDENS.ecoFixesAll &&
    tapeoutBefore.ready === GOLDENS.tapeoutReadyBeforeEco &&
    tapeoutAfter.ready === GOLDENS.tapeoutReadyAfterEco &&
    markers.count === GOLDENS.markerCount;
  return {
    stats,
    corner,
    checks,
    ecos,
    tapeoutBefore,
    tapeoutAfter,
    markers,
    ok,
  };
}

export function signoffCompare(d = STARTER) {
  const eng = signoffEngine(d);
  return {
    cornerCount: eng.stats.cornerCount,
    signoffCorner: eng.corner.corner.id,
    failCount: eng.checks.failCount,
    ecoCount: eng.ecos.ecoCount,
    tapeoutBefore: eng.tapeoutBefore.ready,
    tapeoutAfter: eng.tapeoutAfter.ready,
    markerCount: eng.markers.count,
    ok: eng.ok,
  };
}

function layoutPositions(d = STARTER, opts = {}) {
  const checks = opts.checks || d.checks;
  const nodes = {};
  const baseX = 80;
  const stepX = 110;
  const yCorner = 36;
  d.corners.forEach((c, i) => {
    nodes[c.id] = { x: baseX + i * stepX, y: yCorner, kind: "corner", label: c.id };
  });
  const yCheck = 110;
  checks.forEach((c, i) => {
    nodes[c.id] = {
      x: 60 + i * 88,
      y: yCheck,
      kind: "check",
      status: c.status,
      label: c.name,
    };
  });
  const yEco = 190;
  d.ecos.forEach((e, i) => {
    nodes[e.id] = { x: 120 + i * 160, y: yEco, kind: "eco", label: e.id, fixes: e.fixes };
    e.fixes.forEach((fix, j) => {
      nodes[`${e.id}_arrow_${fix}`] = {
        x: (nodes[e.id].x + (nodes[fix]?.x || 0)) / 2,
        y: (yEco + yCheck) / 2 + j * 8,
        kind: "eco_arrow",
        from: e.id,
        to: fix,
      };
    });
  });
  const yTape = 268;
  d.tapeout_items.forEach((t, i) => {
    nodes[t.id] = {
      x: 50 + i * 72,
      y: yTape,
      kind: "tapeout",
      label: t.label,
      required: t.required,
      ok: opts.tapeoutOk?.[t.id],
    };
  });
  return nodes;
}

export function drawSignoff(canvas, opts = {}) {
  const d = opts.design || STARTER;
  const highlight = new Set(opts.highlight || []);
  const selected = new Set(opts.selected || []);
  const markers = opts.markers || [];
  const metricText = opts.metricText || null;
  const showEcos = opts.showEcos !== false;
  const showTapeout = opts.showTapeout !== false;
  const checks = opts.checks || d.checks;

  const { ctx } = fitHiDpiCanvas(canvas, { cssHeight: LAB_CANVAS_CSS_HEIGHT });
  const W = canvas.clientWidth;
  const H = canvas.clientHeight || LAB_CANVAS_CSS_HEIGHT;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f7f5f0";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#5c6570";
  ctx.font = "600 11px ui-sans-serif, system-ui";
  ctx.textAlign = "left";
  ctx.fillText("Signoff flow (corners → checks → ECO → tapeout)", 12, 16);

  const tapeout = opts.tapeoutItems || null;
  const tapeoutOk = {};
  if (tapeout?.items) {
    for (const t of tapeout.items) tapeoutOk[t.id] = t.ok;
  }

  const raw = layoutPositions(d, { checks, tapeoutOk });
  const { layout, fontPx } = fitGraphLayout(raw, W, H, { pad: 28 });

  const drawArrow = (fromId, toId, color) => {
    const s = layout[fromId];
    const t = layout[toId];
    if (!s || !t) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - 12);
    ctx.lineTo(t.x, t.y + 14);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  if (showEcos) {
    for (const eco of d.ecos) {
      for (const fix of eco.fixes) {
        const hot = highlight.has(eco.id) || highlight.has(fix);
        drawArrow(eco.id, fix, hot ? "#c45c26" : "#9a8a7a");
      }
    }
  }

  for (const [id, s] of Object.entries(layout)) {
    const meta = raw[id];
    if (!meta) continue;
    const on = highlight.has(id) || selected.has(id);
    if (meta.kind === "corner") {
      const w = 96;
      const h = 36;
      const isSignoff = id === d.signoff_corner;
      ctx.fillStyle = on ? "#ffd9a8" : isSignoff ? "#d4e4f7" : "#eef2f6";
      ctx.fillRect(s.x - w / 2, s.y - h / 2, w, h);
      ctx.strokeStyle = on ? "#c45c26" : isSignoff ? "#4a6fa5" : "#7a8a99";
      ctx.lineWidth = isSignoff || on ? 2 : 1.2;
      ctx.strokeRect(s.x - w / 2, s.y - h / 2, w, h);
      ctx.fillStyle = "#1a1f24";
      ctx.font = `${Math.max(9, fontPx - 2)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(meta.label, s.x, s.y);
    } else if (meta.kind === "check") {
      const w = 72;
      const h = 28;
      const fail = meta.status === "fail";
      ctx.fillStyle = on ? "#ffd9a8" : fail ? "#f5d0d0" : "#d4edda";
      ctx.fillRect(s.x - w / 2, s.y - h / 2, w, h);
      ctx.strokeStyle = on ? "#c45c26" : fail ? "#8b1e1e" : "#2d6a3f";
      ctx.lineWidth = on ? 2 : 1.2;
      ctx.strokeRect(s.x - w / 2, s.y - h / 2, w, h);
      ctx.fillStyle = fail ? "#8b1e1e" : "#2d6a3f";
      ctx.font = `600 ${Math.max(9, fontPx - 2)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(meta.label, s.x, s.y - 4);
      ctx.font = `${Math.max(8, fontPx - 3)}px ui-sans-serif, system-ui`;
      ctx.fillText(fail ? "FAIL" : "PASS", s.x, s.y + 8);
    } else if (meta.kind === "eco") {
      const w = 64;
      const h = 26;
      ctx.fillStyle = on ? "#ffe8d6" : "#f0ebe3";
      ctx.fillRect(s.x - w / 2, s.y - h / 2, w, h);
      ctx.strokeStyle = on ? "#c45c26" : "#5c6570";
      ctx.lineWidth = on ? 2 : 1.2;
      ctx.strokeRect(s.x - w / 2, s.y - h / 2, w, h);
      ctx.fillStyle = "#1a1f24";
      ctx.font = `${Math.max(9, fontPx - 2)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(meta.label, s.x, s.y);
    } else if (meta.kind === "tapeout" && showTapeout) {
      const w = 64;
      const h = 22;
      const ok = meta.ok;
      ctx.fillStyle = on ? "#ffd9a8" : ok === true ? "#d4edda" : ok === false ? "#f5d0d0" : "#eef2f6";
      ctx.fillRect(s.x - w / 2, s.y - h / 2, w, h);
      ctx.strokeStyle = on ? "#c45c26" : meta.required ? "#4a6fa5" : "#aaa";
      ctx.lineWidth = meta.required ? 1.5 : 1;
      ctx.strokeRect(s.x - w / 2, s.y - h / 2, w, h);
      ctx.fillStyle = "#1a1f24";
      ctx.font = `${Math.max(7, fontPx - 4)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(meta.label.slice(0, 12), s.x, s.y);
    }
  }

  if (markers.length) {
    ctx.fillStyle = "#8b1e1e";
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.textAlign = "left";
    markers.slice(0, 6).forEach((m, i) => {
      ctx.fillText(`• ${m.kind}:${m.check || m.name || ""}`, 12, H - 72 + i * 14);
    });
  }
  if (metricText) {
    ctx.fillStyle = "#1a1f24";
    ctx.font = "600 13px ui-sans-serif, system-ui";
    ctx.textAlign = "right";
    ctx.fillText(metricText, W - 12, H - 14);
  }
}

export function hitTestCheck(canvas, design, clientX, clientY, checks = null) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const W = canvas.clientWidth;
  const H = canvas.clientHeight || LAB_CANVAS_CSS_HEIGHT;
  const ck = checks || design.checks;
  const raw = layoutPositions(design, { checks: ck });
  const { layout } = fitGraphLayout(raw, W, H, { pad: 28 });
  for (const c of ck) {
    const s = layout[c.id];
    if (!s) continue;
    const w = 72;
    const h = 28;
    if (x >= s.x - w / 2 && x <= s.x + w / 2 && y >= s.y - h / 2 && y <= s.y + h / 2) return c.id;
  }
  return null;
}
