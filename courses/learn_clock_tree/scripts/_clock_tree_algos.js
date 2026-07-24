import {
  PLACEMENT,
  GOLDENS,
  CLOCK_SOURCE,
  CELLS,
  hTree,
  mmmTree,
  zeroSkewMerge,
  sequentialCts,
  insertBuffers,
  tappingPoints,
  skew,
  latency,
} from "../../assets/clock-tree-core.js";

const spread = PLACEMENT;

function step(id, title, caption, bullets, metrics, positions, extra = {}) {
  return { id, title, caption, bullets, metrics, positions, ...extra };
}

export const CLOCK_TREE_ALGOS = {
  "clock-sinks": {
    title: "Clock sinks",
    module: "module01-01-clock-sinks",
    kind: "clock-tree",
    steps: [
      step("chip", "12×8 chip", "Six sinks A–F sit on the same spread placement as routing labs.", ["Same PD spine", "Toy CTS"], [`${CELLS.length} sinks`], spread),
      step("src", "Clock source", "CLK star at chip center (6,4) — the root of every tree.", ["Fixed source", "Yellow star"], [`(${GOLDENS.sourceX},${GOLDENS.sourceY})`], spread, { highlight: ["__source"] }),
      step("a", "Sink A", "A at (1,1) southwest corner.", ["Cell centers", "Drag to move"], ["A=(1,1)"], spread, { highlight: ["A"], selectedSink: "A" }),
      step("d", "Sink D", "D at (8,5) northeast.", ["Opposite corner", "Long path to A"], ["D=(8,5)"], spread, { highlight: ["D"], selectedSink: "D" }),
      step("all", "All six", "E/F sit near the center corridor beside the source.", ["E≈(5,3)", "F≈(6,3)"], ["Ready for trees"], spread, { highlight: ["E", "F"] }),
    ],
  },
  "latency-skew": {
    title: "Latency & skew",
    module: "module01-03-latency-skew",
    kind: "clock-tree",
    steps: [
      step("def", "Skew = max − min", "Per-sink latency is Manhattan length along the tree; skew is max minus min.", ["Wire delay = 1", "Primary CTS metric"], ["Document goldens"], spread),
      step("h", "H-tree skew", "Build H-tree on spread and read skew overlay.", ["Recursive splits"], [`skew≈${GOLDENS.spreadHTreeSkew}`], spread, (() => { const t = hTree(spread); return { tree: t }; })()),
      step("mmm", "MMM skew", "MMM merge may differ from H-tree on the same sinks.", ["Closest fragments"], [`skew≈${GOLDENS.spreadMmmSkew}`], spread, (() => { const t = mmmTree(spread); return { tree: t }; })()),
      step("path", "Path to A", "Highlight sink A — yellow edges show source→A path.", ["Selected sink"], [`lat A≈${latency(hTree(spread), "A", spread).toFixed?.(0) ?? latency(hTree(spread), "A", spread)}`], spread, (() => { const t = hTree(spread); return { tree: t, selectedSink: "A" }; })()),
      step("goal", "Drive skew down", "Move sinks or switch topology to clear challenge bounds.", ["Learner state", "Check scores skew"], ["Next: H-tree"], spread),
    ],
  },
  "h-tree": {
    title: "H-tree",
    module: "module02-01-h-tree",
    kind: "clock-tree",
    steps: [
      step("idea", "Recursive H", "Alternate horizontal and vertical splits from the source toward sink clusters.", ["Quadrant style", "Classic CTS shape"], ["Build H-tree"], spread),
      step("build", "Built tree", "H-tree edges fan from CLK to all six sinks.", ["Steiners at splits"], [`skew≈${GOLDENS.spreadHTreeSkew}`], spread, (() => ({ tree: hTree(spread) }))()),
      step("path", "Path highlight", "Select D to see the source→D corridor.", ["Yellow = path"], ["Latency D"], spread, (() => ({ tree: hTree(spread), selectedSink: "D" }))()),
      step("balance", "Balance goal", "Symmetric splits keep opposite corners similar — not perfect on this toy.", ["Not zero skew"], ["Compare MMM"], spread, (() => ({ tree: hTree(spread) }))()),
      step("use", "When H-tree", "Use H-trees when sinks fill a rectangle evenly; otherwise MMM or DME.", ["Regular arrays", "Next: MMM"], ["CTS toolbox"], spread),
    ],
  },
  "mmm-tree": {
    title: "MMM tree",
    module: "module02-03-mmm-tree",
    kind: "clock-tree",
    steps: [
      step("idea", "Means & medians", "Repeatedly merge the closest fragment roots at their midpoint.", ["Greedy merge", "Steiner at merge"], ["Build MMM"], spread),
      step("build", "Merged tree", "MMM connects all sinks then trunks to the source.", ["Fragment merge"], [`skew≈${GOLDENS.spreadMmmSkew}`], spread, (() => ({ tree: mmmTree(spread) }))()),
      step("steiners", "Merge points", "Steiners mark where two subtrees join.", ["Branch points"], ["Tapping lab"], spread, (() => ({ tree: mmmTree(spread) }))()),
      step("vs-h", "vs H-tree", "MMM adapts to irregular sink sets better than pure H geometry.", ["Data-driven", "Skew may differ"], ["Compare overlays"], spread, (() => ({ tree: mmmTree(spread) }))()),
      step("next", "Toward DME", "Zero-skew merge balances subtree delays explicitly.", ["DME lite next"], ["Skew focus"], spread),
    ],
  },
  "zero-skew-merge": {
    title: "Zero-skew merge",
    module: "module02-05-zero-skew-merge",
    kind: "clock-tree",
    steps: [
      step("idea", "DME lite", "Split sinks left/right of source; meet at a point that balances subtree radii.", ["Equalize delay", "Merge steiner"], [`golden skew=${GOLDENS.spreadZeroSkewMergeSkew}`], spread),
      step("demo", "Balanced meet", "Zero-skew demo places a merge steiner near CLK.", ["Left vs right"], ["Skew near 0–3"], spread, (() => ({ tree: zeroSkewMerge(spread) }))()),
      step("path", "Symmetric paths", "Opposite sinks should see similar source latency.", ["Select A vs B"], ["Compare latencies"], spread, (() => ({ tree: zeroSkewMerge(spread), selectedSink: "A" }))()),
      step("skew", "Read skew", "Overlay reports near-zero skew on the toy spread.", ["Primary metric"], [`≤ ${GOLDENS.skewBoundDefault}+1`], spread, (() => ({ tree: zeroSkewMerge(spread) }))()),
      step("limit", "Toy only", "Full DME embeds delay recursively on every merge — this lab is the intuition.", ["Not full DME", "Buffering next"], ["Skew bound lab"], spread),
    ],
  },
  "tapping-points": {
    title: "Tapping points",
    module: "module02-07-tapping-points",
    kind: "clock-tree",
    steps: [
      step("def", "Branch taps", "Tapping points are steiners with degree ≥ 3 — where the clock forks.", ["Not leaf sinks", "Internal nodes"], ["tappingPoints()"], spread),
      step("mmm", "On MMM", "MMM merge points are natural taps.", ["Count taps"], [`taps≥1`], spread, (() => ({ tree: mmmTree(spread) }))()),
      step("h", "On H-tree", "H splits also create high-degree junctions.", ["Steiners"], ["Compare counts"], spread, (() => ({ tree: hTree(spread) }))()),
      step("why", "Why care", "Buffers and gating often sit at taps; routing capacity concentrates there.", ["Buffer sites", "Congestion"], ["Clock buffering"], spread, (() => ({ tree: mmmTree(spread) }))()),
      step("api", "API", "Call tappingPoints(tree) after Build — challenges score tap count.", ["Learner tree", "Check"], ["Next: buffers"], spread),
    ],
  },
  "clock-buffering": {
    title: "Clock buffering",
    module: "module03-01-clock-buffering",
    kind: "clock-tree",
    steps: [
      step("idea", "Long wires", "Split edges longer than maxWireLen; place buffer squares at joints.", ["maxWire=4", "Orange squares"], [`delay=${GOLDENS.bufferDelay}`], spread),
      step("before", "Before buffers", "H-tree may have long Manhattan legs.", ["No buffers yet"], ["Build H-tree"], spread, (() => ({ tree: hTree(spread) }))()),
      step("after", "After insert", "Insert buffers — joints appear on long segments.", ["buffers[]"], ["Mode …+buf"], spread, (() => ({ tree: insertBuffers(hTree(spread)) }))()),
      step("latency", "Buffered latency", "bufferedLatencies adds bufferDelay per buffer on the path.", ["Wire + buf"], ["Not just length"], spread, (() => ({ tree: insertBuffers(hTree(spread)), selectedSink: "A" }))()),
      step("trade", "Trade-off", "Buffers restore slew but add delay — skew may rise or fall.", ["Skew bound lab", "learn_buffering next"], ["Toy model"], spread, (() => ({ tree: insertBuffers(hTree(spread)) }))()),
    ],
  },
  "skew-bound": {
    title: "Skew bound",
    module: "module03-03-skew-bound",
    kind: "clock-tree",
    steps: [
      step("bound", "Target bound", "Challenges ask skew ≤ GOLDENS.skewBoundDefault (2) on the toy.", ["Pass/fail", "skewBoundOk"], [`bound=${GOLDENS.skewBoundDefault}`], spread),
      step("zs", "Zero-skew helps", "Zero-skew merge often meets the bound without moving sinks.", ["Try demo"], ["skew ≤ 2–3"], spread, (() => ({ tree: zeroSkewMerge(spread) }))()),
      step("fail", "H may miss", "H-tree skew can exceed the tight bound on this spread.", ["Move sinks", "Or switch mode"], [`H≈${GOLDENS.spreadHTreeSkew}`], spread, (() => ({ tree: hTree(spread) }))()),
      step("buf", "Buffers + bound", "Buffering changes latencies — re-check the bound after insert.", ["Recompute skew"], ["Not automatic"], spread, (() => ({ tree: insertBuffers(zeroSkewMerge(spread)) }))()),
      step("signoff", "Toward signoff", "Real CTS targets skew under corners; this lab is the scalar habit.", ["learn_buffering", "learn_sta"], ["Next: sequential"], spread),
    ],
  },
  "sequential-cts": {
    title: "Sequential CTS",
    module: "module04-01-sequential-cts",
    kind: "clock-tree",
    steps: [
      step("order", "Net order", "Connect sinks A…F one-by-one to the nearest existing tree node.", ["Order matters", "Greedy attach"], ["Sequential CTS"], spread),
      step("build", "Built pass", "Sequential tree grows from CLK outward.", ["Six sinks"], [`skew≈${GOLDENS.spreadSequentialSkew}`], spread, (() => ({ tree: sequentialCts(spread) }))()),
      step("path", "Late sink", "Later sinks may attach far from source — skew can be higher than MMM.", ["Select F"], ["Compare modes"], spread, (() => ({ tree: sequentialCts(spread), selectedSink: "F" }))()),
      step("buf", "Optional buffers", "Insert buffers after sequential to split long legs.", ["…+buf"], ["Still toy"], spread, (() => ({ tree: insertBuffers(sequentialCts(spread)) }))()),
      step("done", "Handoff", "You can build H, MMM, DME-lite, sequential — next deepen buffering.", ["learn_buffering"], ["Course wrap"], spread),
    ],
  },
};

void tappingPoints;
void skew;
void CLOCK_SOURCE;
