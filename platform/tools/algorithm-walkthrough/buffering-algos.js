import {
  DRIVER,
  SINKS,
  EDGES,
  GOLDENS,
  BUFFER_LIBRARY,
  candidateSites,
  vanGinnekenNet,
  slewDrivenInsert,
  fanoutBufferTree,
  sequentialBuffer,
  wireRc,
  edgeLength,
  nodeMap,
} from "../../assets/buffering-core.js";

const sinks = SINKS;

function step(id, title, caption, bullets, metrics, positions, extra = {}) {
  // positions unused for buffering (fixed net); keep arg for step() parity with other courses
  return { id, title, caption, bullets, metrics, sinks: positions || sinks, ...extra };
}

export const BUFFERING_ALGOS = {
  "wire-rc": {
    title: "Wire RC",
    module: "module01-01-wire-rc",
    kind: "buffering",
    steps: [
      step("net", "Net topology", "Driver D feeds S0; S0 fans to S1 and S2 on the 12×8 chip.", ["Three sinks", "Three edges"], [`${GOLDENS.edgeCount} edges`], sinks),
      step("e0", "Edge e0 length", "D→S0 is four units Manhattan on the starter.", ["Manhattan", "Unit parasitics"], ["len≈4"], sinks, { selectedEdge: "e0", highlight: ["e0"] }),
      step("rc", "R and C", "With unit parasitics, length four yields R=4 and C=4.", ["r_per=1", "c_per=1"], [`R=${GOLDENS.wireRcLen4R}`], sinks, { selectedEdge: "e0", metricText: "R=4 C=4" }),
      step("elmore", "Elmore", "Delay ≈ R·(C/2 + Cload) on a lumped segment.", ["Lumped model", "Toy"], ["Elmore"], sinks, { selectedEdge: "e0" }),
      step("why", "Why it matters", "Longer edges dominate slew and delay — candidates appear next.", ["RC drives insert", "Next lab"], ["Slew budget"], sinks),
    ],
  },
  "slew-budget": {
    title: "Slew budget",
    module: "module01-03-slew-budget",
    kind: "buffering",
    steps: [
      step("def", "Slew definition", "Toy transition ≈ 2.2 · R · C_total on the segment.", ["k≈2.2", "Not delay"], ["estimateSlew"], sinks),
      step("limit", "Limit eight", "GOLDENS.slewLimit = 8 on tiny_buf.", ["Pass/fail gate"], [`limit=${GOLDENS.slewLimit}`], sinks, { metricText: `slew limit ${GOLDENS.slewLimit}` }),
      step("hot", "Hot edge", "Long e0 with branch load can approach or exceed the limit.", ["Branch C"], ["e0"], sinks, { selectedEdge: "e0", highlight: ["e0"] }),
      step("ok", "Pass/fail", "slew_ok gates whether slew-driven insertion fires.", ["Boolean check"], ["slewOk"], sinks),
      step("next", "Toward insert", "Failing edges get buffer candidates in later labs.", ["Candidates next"], ["Show sites"], sinks),
    ],
  },
  "candidate-sites": {
    title: "Candidate sites",
    module: "module02-01-candidate-sites",
    kind: "buffering",
    steps: [
      step("step", "Step size", "candidate_step = 2 on the toy.", ["Every 2 units"], [`step=${GOLDENS.candidateStep}`], sinks),
      step("show", "Show sites", "Show candidates paints gray dots on e0–e2.", ["Gray dots"], ["Exclude ends"], sinks, (() => ({ sites: candidateSites() }))()),
      step("count", "Count", "Longer edges yield more sites.", ["e0 denser"], [`sites≥1`], sinks, (() => ({ sites: candidateSites() }))()),
      step("ends", "Exclude ends", "Driver and sink pins are not candidates.", ["Internal only"], ["Legal inserts"], sinks, (() => ({ sites: candidateSites() }))()),
      step("dp", "Ready for DP", "Sites feed Van Ginneken options next.", ["Library next"], ["VG lab"], sinks, (() => ({ sites: candidateSites() }))()),
    ],
  },
  "buffer-library": {
    title: "Buffer library",
    module: "module02-03-buffer-library",
    kind: "buffering",
    steps: [
      step("three", "Three cells", "Library has BUF_X1, BUF_X2, INV_X1.", ["cin/rout/delay"], [`lib=${GOLDENS.libCount}`], sinks),
      step("x2", "BUF_X2 stronger", "BUF_X2: higher cin, lower rout, slightly less intrinsic delay.", ["Drive strength"], ["Trade cin"], sinks, { metricText: "BUF_X2" }),
      step("inv", "Inverter", "INV_X1 flips polarity — used in polarity labs.", ["invert=true"], ["Purple later"], sinks),
      step("pick", "Pick for DP", "VG options reference library ids on buffered solutions.", ["buf id"], ["Van Ginneken"], sinks, (() => {
        const vg = vanGinnekenNet();
        const buffers = [];
        for (const [eid, res] of Object.entries(vg.perEdge)) {
          if (res.best.buf) {
            const e = EDGES.find((x) => x.id === eid);
            const n = nodeMap();
            buffers.push({ edge: eid, buf: res.best.buf, x: (n[e.a].x + n[e.b].x) / 2, y: (n[e.a].y + n[e.b].y) / 2 });
          }
        }
        return { buffers, metricText: `VG ${vg.bestDelay.toFixed(1)}` };
      })()),
      step("area", "Area trade", "Real flows also score area; this toy scores delay/slew only.", ["Toy scope"], ["Next: VG"], sinks),
    ],
  },
  "van-ginneken": {
    title: "Van Ginneken",
    module: "module02-05-van-ginneken",
    kind: "buffering",
    steps: [
      step("opts", "Options", "Wire-only plus one option per library buffer at mid.", ["(c,d) pairs"], ["DP lite"], sinks),
      step("prune", "Prune", "Drop pairs with worse cap and worse delay.", ["dominatePrune"], ["Pareto front"], sinks),
      step("best", "Best edge", "Each edge keeps its min-delay survivor.", ["perEdge"], ["Buffers"], sinks, (() => {
        const vg = vanGinnekenNet();
        const buffers = [];
        for (const [eid, res] of Object.entries(vg.perEdge)) {
          if (!res.best.buf) continue;
          const e = EDGES.find((x) => x.id === eid);
          const n = nodeMap();
          buffers.push({ edge: eid, buf: res.best.buf, x: (n[e.a].x + n[e.b].x) / 2, y: (n[e.a].y + n[e.b].y) / 2 });
        }
        return { buffers, sites: candidateSites(), metricText: `best ${vg.bestDelay.toFixed(1)}` };
      })()),
      step("net", "Net delay", "Toy total ≈ e0 best + max(e1,e2) best.", ["Tree compose"], ["Compare wire"], sinks, (() => {
        const vg = vanGinnekenNet();
        return { metricText: `VG ${vg.bestDelay.toFixed(1)} / wire ${vg.wireDelay.toFixed(1)}`, buffers: [] };
      })()),
      step("win", "Improved", "Buffered solution should beat or match wire-only delay.", ["improved flag"], [`vgImproves=${GOLDENS.vgImproves}`], sinks, (() => {
        const vg = vanGinnekenNet();
        return { metricText: `improved=${vg.improved}` };
      })()),
    ],
  },
  "slew-driven": {
    title: "Slew-driven",
    module: "module02-07-slew-driven",
    kind: "buffering",
    steps: [
      step("check", "Check slew", "Compare estimate_slew to slew_limit.", ["Per edge"], ["Gate"], sinks),
      step("tight", "Tight limit", "Limit 1 forces inserts on the toy.", ["Heuristic"], ["count≥1"], sinks, (() => {
        const r = slewDrivenInsert(1);
        return { buffers: r.insertions, metricText: `inserts ${r.count}` };
      })()),
      step("mid", "Mid buffer", "Insertion sits at edge midpoint.", ["BUF_X1"], ["Orange square"], sinks, (() => {
        const r = slewDrivenInsert(1);
        return { buffers: r.insertions };
      })()),
      step("count", "Count", "Challenges score insertion count.", ["Learner state", "Check"], [`limit=${GOLDENS.slewLimit}`], sinks, (() => {
        const r = slewDrivenInsert(GOLDENS.slewLimit);
        return { buffers: r.insertions, metricText: `count ${r.count}` };
      })()),
      step("vs", "vs VG", "Slew-driven is local; VG optimizes delay options.", ["Complementary"], ["Both useful"], sinks),
    ],
  },
  "polarity-invert": {
    title: "Polarity",
    module: "module03-01-polarity-invert",
    kind: "buffering",
    steps: [
      step("flag", "Invert flag", "INV_X1 has invert=true in the library.", ["Library"], ["Purple"], sinks),
      step("one", "One flip", "A single INV yields negative polarity.", ["flips=1"], ["positive=false"], sinks, {
        buffers: [{ buf: "INV_X1", x: 5, y: 4, invert: true }],
        metricText: "flips=1",
      }),
      step("two", "Two flips", "Two INVs restore positive sense.", ["Parity"], ["positive=true"], sinks, {
        buffers: [
          { buf: "INV_X1", x: 3, y: 4, invert: true },
          { buf: "INV_X1", x: 7, y: 4, invert: true },
        ],
        metricText: "flips=2",
      }),
      step("mix", "Mix with BUF", "BUF cells do not flip.", ["BUF_X1"], ["Parity unchanged"], sinks, {
        buffers: [
          { buf: "INV_X1", x: 3, y: 4, invert: true },
          { buf: "BUF_X1", x: 7, y: 4 },
        ],
      }),
      step("rule", "Design rule", "Useful-skew flows may allow phase; this toy tracks parity.", ["Toy scope"], ["Fanout next"], sinks),
    ],
  },
  "fanout-tree": {
    title: "Fanout tree",
    module: "module03-03-fanout-tree",
    kind: "buffering",
    steps: [
      step("fo", "Fanout three", "Tiny net has three sinks.", ["S0/S1/S2"], [`sinks=${GOLDENS.sinkCount}`], sinks),
      step("max", "Max two", "max_fanout=2 → must insert.", ["Limit"], ["inserted"], sinks),
      step("s0", "At S0", "Junction buffer sits on S0.", ["Steiner-ish"], ["Fork"], sinks, (() => {
        const f = fanoutBufferTree();
        return { buffers: f.buffers, highlight: ["S0"] };
      })()),
      step("x2", "BUF_X2", "Stronger cell for the fork.", ["Drive"], ["BUF_X2"], sinks, (() => ({ buffers: fanoutBufferTree().buffers }))()),
      step("compose", "Compose", "Sequential pass can combine VG + fanout.", ["Pipeline"], ["Next lab"], sinks),
    ],
  },
  "sequential-buffer": {
    title: "Sequential buffer",
    module: "module04-01-sequential-buffer",
    kind: "buffering",
    steps: [
      step("pipe", "Pipeline", "Sites → VG/slew → fanout compose.", ["Full pass"], ["Toy flow"], sinks),
      step("run", "Run pass", "Sequential pass paints buffers and sites.", ["One click"], ["Compose"], sinks, (() => {
        const seq = sequentialBuffer();
        const vg = seq.vanGinneken;
        const buffers = [...seq.fanout.buffers];
        for (const [eid, res] of Object.entries(vg.perEdge)) {
          if (!res.best.buf) continue;
          const e = EDGES.find((x) => x.id === eid);
          const n = nodeMap();
          buffers.push({ edge: eid, buf: res.best.buf, x: (n[e.a].x + n[e.b].x) / 2, y: (n[e.a].y + n[e.b].y) / 2 });
        }
        return { buffers, sites: seq.sites, metricText: `VG ${vg.bestDelay.toFixed(1)}` };
      })()),
      step("met", "Metrics", "Read VG delay vs wire delay.", ["improved"], ["Overlay"], sinks, (() => {
        const vg = vanGinnekenNet();
        return { metricText: `${vg.bestDelay.toFixed(1)} vs ${vg.wireDelay.toFixed(1)}` };
      })()),
      step("slew", "Mode slew", "Alternate primary mode is slew-driven.", ["Heuristic"], ["Compare"], sinks, (() => {
        const r = slewDrivenInsert(1);
        return { buffers: r.insertions, metricText: `slew inserts ${r.count}` };
      })()),
      step("done", "Handoff", "Next deepen timing/signoff courses.", ["learn_signoff", "learn_sta"], ["Wrap"], sinks),
    ],
  },
};

void DRIVER;
void BUFFER_LIBRARY;
void wireRc;
void edgeLength;
