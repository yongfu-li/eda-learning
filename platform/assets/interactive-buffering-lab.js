/**
 * Interactive buffering lab — wire RC, candidates, Van Ginneken, slew-driven.
 */
import {
  DRIVER,
  SINKS,
  EDGES,
  SLEW_LIMIT,
  BUFFER_LIBRARY,
  GOLDENS,
  candidateSites,
  vanGinnekenNet,
  slewDrivenInsert,
  fanoutBufferTree,
  sequentialBuffer,
  polarityFix,
  wireRc,
  edgeLength,
  nodeMap,
  estimateSlew,
  slewOk,
  drawBuffering,
  canvasToPoint,
  hitSink,
} from "./buffering-core.js";
import { createChallengeLab, el, metricsBlock } from "./clustering-ui.js";

function cloneSinks(sinks) {
  return sinks.map((s) => ({ ...s }));
}

export function createInteractiveBufferingLab(root, opts = {}) {
  const seedSinks = () => cloneSinks(opts.initialSinks || SINKS);
  const slewLimit = opts.slewLimit ?? SLEW_LIMIT;

  let sinks = seedSinks();
  let sites = [];
  let buffers = [];
  let mode = null;
  let selectedId = sinks[0]?.id || "S0";
  let vgResult = null;
  let slewResult = null;

  const api = {
    getSinks: () => sinks,
    setSinks: (s) => {
      sinks = cloneSinks(s);
      sites = [];
      buffers = [];
      mode = null;
      vgResult = null;
      slewResult = null;
    },
    getDriver: () => ({ ...DRIVER }),
    getEdges: () => EDGES,
    getSites: () => sites,
    getBuffers: () => buffers,
    getMode: () => mode,
    getLibrary: () => BUFFER_LIBRARY,
    getSlewLimit: () => slewLimit,
    getVg: () => vgResult,
    getSlewResult: () => slewResult,
    getSelected: () => selectedId,
    setSelected: (id) => {
      selectedId = id;
    },
    showCandidates: () => {
      sites = candidateSites(undefined, EDGES, nodeMap(DRIVER, sinks));
      mode = "candidates";
    },
    runVanGinneken: () => {
      vgResult = vanGinnekenNet(DRIVER, sinks, EDGES);
      buffers = [];
      for (const [eid, res] of Object.entries(vgResult.perEdge)) {
        if (res.best.buf) {
          const e = EDGES.find((x) => x.id === eid);
          const nodes = nodeMap(DRIVER, sinks);
          const a = nodes[e.a];
          const b = nodes[e.b];
          buffers.push({
            edge: eid,
            buf: res.best.buf,
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2,
            invert: BUFFER_LIBRARY.find((c) => c.id === res.best.buf)?.invert,
          });
        }
      }
      mode = "van-ginneken";
      sites = candidateSites(undefined, EDGES, nodeMap(DRIVER, sinks));
    },
    runSlewDriven: () => {
      slewResult = slewDrivenInsert(slewLimit, DRIVER, sinks, EDGES);
      buffers = slewResult.insertions.map((i) => ({ ...i }));
      mode = "slew-driven";
    },
    runFanout: () => {
      const f = fanoutBufferTree(sinks);
      buffers = f.buffers.map((b) => ({ ...b }));
      mode = "fanout";
    },
    runSequential: () => {
      const seq = sequentialBuffer(opts.defaultMode || "van_ginneken");
      api.runVanGinneken();
      if (seq.fanout.inserted) {
        buffers = [...buffers, ...seq.fanout.buffers];
      }
      mode = "sequential";
      sites = seq.sites;
    },
    clearBuffers: () => {
      buffers = [];
      sites = [];
      mode = null;
      vgResult = null;
      slewResult = null;
    },
    polarityFix: (path) => polarityFix(path || buffers),
    wireRcForEdge: (edgeId) => {
      const e = EDGES.find((x) => x.id === edgeId);
      return wireRc(edgeLength(e, nodeMap(DRIVER, sinks)));
    },
    edgeSlew: (edgeId) => {
      const e = EDGES.find((x) => x.id === edgeId);
      const nodes = nodeMap(DRIVER, sinks);
      const cl = nodes[e.b]?.cload ?? 2;
      const rc = wireRc(edgeLength(e, nodes));
      return estimateSlew(rc.R, rc.C + cl);
    },
    slewOk: (slew) => slewOk(slew, slewLimit),
  };

  function moveSelectedTo(wx, wy) {
    const idx = sinks.findIndex((s) => s.id === selectedId);
    if (idx < 0) return;
    sinks = sinks.map((s, i) =>
      i === idx
        ? { ...s, x: Math.max(0, Math.min(11.5, wx)), y: Math.max(0, Math.min(7.5, wy)) }
        : s
    );
    buffers = [];
    sites = [];
    mode = null;
    vgResult = null;
  }

  function nudge(dx, dy) {
    const s = sinks.find((x) => x.id === selectedId);
    if (!s) return;
    moveSelectedTo(s.x + dx, s.y + dy);
  }

  createChallengeLab(root, {
    starterButtonLabel: "Reset workspace",
    idlePromptHtml:
      "Pick a challenge and click <strong>Start</strong>. Explore wire RC, candidates, Van Ginneken, or slew-driven insert, then <strong>Check</strong>.",
    starterHtml:
      opts.starterHtml ||
      `<p><strong>Your workspace:</strong> driver D feeds S0, which fans to S1/S2.
      Run Van Ginneken or slew-driven insertion; challenges score <em>your</em> delay/slew state.</p>`,
    loadStarter() {
      sinks = seedSinks();
      buffers = [];
      sites = [];
      mode = null;
      selectedId = sinks[0]?.id || "S0";
      vgResult = null;
      slewResult = null;
    },
    challenges: (opts.challenges || []).map((ch) => ({
      ...ch,
      setup: (ctx) => {
        sinks = seedSinks();
        buffers = [];
        sites = [];
        mode = null;
        vgResult = null;
        slewResult = null;
        selectedId = sinks[0]?.id || "S0";
        if (typeof ch.setup === "function") ch.setup(ctx, api);
      },
      check: (ctx) => (typeof ch.check === "function" ? !!ch.check(ctx, api) : false),
    })),
    extraActions(ctx) {
      const btns = [];
      for (const s of sinks) {
        btns.push(
          el("button", {
            className: "btn " + (selectedId === s.id ? "btn-primary" : "btn-secondary"),
            type: "button",
            text: s.id,
            onClick: () => {
              selectedId = s.id;
              ctx.rerender();
            },
          })
        );
      }
      btns.push(
        el("button", { className: "btn btn-ghost", type: "button", text: "←", onClick: () => { nudge(-0.5, 0); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "→", onClick: () => { nudge(0.5, 0); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "↑", onClick: () => { nudge(0, 0.5); ctx.rerender(); } }),
        el("button", { className: "btn btn-ghost", type: "button", text: "↓", onClick: () => { nudge(0, -0.5); ctx.rerender(); } }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Show candidates",
          onClick: () => { api.showCandidates(); ctx.rerender(); },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Van Ginneken",
          onClick: () => { api.runVanGinneken(); ctx.rerender(); },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Slew-driven",
          onClick: () => { api.runSlewDriven(); ctx.rerender(); },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Fanout buffer",
          onClick: () => { api.runFanout(); ctx.rerender(); },
        }),
        el("button", {
          className: "btn btn-secondary",
          type: "button",
          text: "Sequential pass",
          onClick: () => { api.runSequential(); ctx.rerender(); },
        })
      );
      return btns;
    },
    renderWorkspace(ctx) {
      const vg = vgResult;
      drawBuffering(ctx.canvas, {
        driver: DRIVER,
        sinks,
        edges: EDGES,
        sites,
        buffers,
        highlight: [selectedId],
        metricText: vg
          ? `VG delay ${vg.bestDelay.toFixed(1)} (wire ${vg.wireDelay.toFixed(1)})`
          : slewResult
            ? `slew inserts ${slewResult.count}`
            : `slew limit ${slewLimit}`,
      });
      ctx.canvas.onclick = (ev) => {
        const hit = hitSink(sinks, ctx.canvas, ev.clientX, ev.clientY);
        if (hit && !ev.shiftKey) {
          selectedId = hit;
          ctx.rerender();
          return;
        }
        const world = canvasToPoint(ctx.canvas, ev.clientX, ev.clientY);
        moveSelectedTo(world.x, world.y);
        ctx.rerender();
      };
      const sel = sinks.find((s) => s.id === selectedId);
      const lines = [
        `selected: ${selectedId} @ (${sel?.x.toFixed(1)},${sel?.y.toFixed(1)})`,
        `mode: ${mode || "(none)"} · buffers: ${buffers.length} · sites: ${sites.length}`,
        `library: ${BUFFER_LIBRARY.map((b) => b.id).join(", ")}`,
        `slew limit: ${slewLimit}`,
      ];
      if (vg) lines.push(`VG best ${vg.bestDelay.toFixed(2)} vs wire ${vg.wireDelay.toFixed(2)} · improved=${vg.improved}`);
      if (typeof opts.extraMetrics === "function") lines.push(...opts.extraMetrics(api));
      ctx.metrics.innerHTML = "";
      ctx.metrics.append(metricsBlock(lines));
    },
  });

  return api;
}

export { el, metricsBlock, GOLDENS };
