import {
  AIG_NODES,
  LIBRARY,
  GOLDENS,
  LAYOUT,
  aigStats,
  outputValue,
  buildStrashTable,
  localRewriteCount,
  applyInverterPush,
  enumerateCuts,
  cutStats,
  techmapArea,
  areaDelayTradeoff,
  sequentialSynth,
} from "../../assets/synthesis-core.js";

const nodes = AIG_NODES;

function step(id, title, caption, bullets, metrics, _positions, extra = {}) {
  return { id, title, caption, bullets, metrics, nodes, layout: LAYOUT, ...extra };
}

function mapBuffers() {
  const m = techmapArea();
  return { mapping: m.mapping, metricText: `area ${m.area}` };
}

export const SYNTHESIS_ALGOS = {
  "boolean-network": {
    title: "Boolean network",
    module: "module01-01-boolean-network",
    kind: "synthesis",
    steps: [
      step("graph", "Graph", "Seven nodes: three PIs, four ANDs, one PO f.", ["Subject graph", "AIG"], [`AND=${GOLDENS.and}`], null),
      step("pis", "PIs", "Primary inputs a, b, c sit at the top.", ["Circles"], ["a b c"], null, { highlight: [1, 2, 3] }),
      step("ands", "AND boxes", "Green boxes are AND2 nodes in the AIG.", ["Rectangles"], ["4 AND"], null, { highlight: [4, 5, 6, 7] }),
      step("comp", "Bubbles", "Purple dots mark complemented fanins.", ["Edge invert"], ["Node 5"], null, { selectedNode: 5, highlight: [5] }),
      step("po", "PO", "Node 7 drives output f.", ["Primary out"], ["f"], null, { selectedNode: 7, highlight: [7] }),
    ],
  },
  "aig-nodes": {
    title: "AIG nodes",
    module: "module01-03-aig-nodes",
    kind: "synthesis",
    steps: [
      step("kinds", "Kinds", "PI circles vs AND rectangles.", ["Two shapes"], ["PI/AND"], null),
      step("fanin", "Fanin", "Node 5 takes ~4 and c.", ["Complement", "c"], ["id 5"], null, { selectedNode: 5 }),
      step("eval", "Eval", "With a=1,b=0,c=1 the PO f equals 1.", ["Simulate"], [`f=${GOLDENS.fAt101}`], null, { metricText: `f=${outputValue({ a: 1, b: 0, c: 1 })}` }),
      step("sel", "Select", "Select node 5 to highlight fanins.", ["Click node"], ["Highlight"], null, { selectedNode: 5, highlight: [5, 4, 3] }),
      step("count", "Count", "GOLDENS: 3 PI, 4 AND, 1 PO.", ["Stats"], [`PI=${GOLDENS.pi}`], null, { metricText: JSON.stringify(aigStats()) }),
    ],
  },
  "aig-strash": {
    title: "Strash",
    module: "module02-01-aig-strash",
    kind: "synthesis",
    steps: [
      step("table", "Table", "Four AND nodes → four strash entries on the toy.", ["Hash"], [`entries=${GOLDENS.strashEntries}`], null, { metricText: `strash ${Object.keys(buildStrashTable()).length}` }),
      step("key", "Key", "Key orders fanin literals so AND(a,b)=AND(b,a).", ["Canonical"], ["Sorted lits"], null),
      step("lookup", "Lookup", "Identical fanins would hit the same entry.", ["Reuse"], ["No dup AND"], null),
      step("dup", "No dup", "Toy has no duplicate keys.", ["Unique"], ["4 keys"], null),
      step("why", "Why", "Strash is the first cleanup before rewrite.", ["Compact AIG"], ["Next rewrite"], null),
    ],
  },
  "rewrite-local": {
    title: "Rewrite",
    module: "module02-03-rewrite-local",
    kind: "synthesis",
    steps: [
      step("opp", "Opportunities", "Several AND nodes qualify as rewrite candidates.", ["Complements", "AND kids"], [`n=${localRewriteCount().count}`], null),
      step("both", "Both comp", "AND(~, ~) is a NOR mapping hint.", ["De Morgan"], ["NOR2 later"], null, { selectedNode: 5 }),
      step("push", "Push", "Inverter-push report lists those nodes.", ["Lite rewrite"], [`applied=${applyInverterPush().applied}`], null),
      step("fn", "Preserve", "Function f stays the same under rewrite bookkeeping.", ["Equivalence"], ["Toy"], null, { metricText: `f101=${outputValue({ a: 1, b: 0, c: 1 })}` }),
      step("map", "Map later", "Techmap will use NOR2 when both comps appear.", ["Library"], ["Techmap"], null),
    ],
  },
  "cut-enumeration": {
    title: "Cuts",
    module: "module02-05-cut-enumeration",
    kind: "synthesis",
    steps: [
      step("k", "K=3", "Toy uses cut_k=3.", ["k-feasible"], [`k=${GOLDENS.cutK}`], null),
      step("pi", "PI cuts", "Each PI has a single cut.", ["{self}"], ["3 PIs"], null, { highlight: [1, 2, 3] }),
      step("comb", "Combine", "AND cuts combine child cuts under the k limit.", ["Union"], ["≤k leaves"], null, (() => {
        const cuts = enumerateCuts();
        return { cuts, selectedNode: 4, metricText: `cuts4=${cuts[4].length}` };
      })()),
      step("po", "PO cuts", "Node 7 lists several feasible cuts.", ["Root"], ["Select 7"], null, (() => {
        const cuts = enumerateCuts();
        return { cuts, selectedNode: 7, metricText: `cuts7=${cuts[7].length}` };
      })()),
      step("stats", "Stats", "total_cuts grows with graph depth.", ["cutStats"], [`total=${cutStats(enumerateCuts()).totalCuts}`], null, (() => {
        const cuts = enumerateCuts();
        return { cuts, metricText: `total ${cutStats(cuts).totalCuts}` };
      })()),
    ],
  },
  "library-cells": {
    title: "Library",
    module: "module02-07-library-cells",
    kind: "synthesis",
    steps: [
      step("six", "Six cells", "Library size is six.", ["INV…AOI21"], [`lib=${GOLDENS.libCount}`], null),
      step("and2", "AND2", "AND2 area=2 delay=2.", ["Default map"], ["area 2"], null),
      step("nor2", "NOR2", "NOR2 covers AND(~,~).", ["Both comp"], ["Mapping hint"], null),
      step("inv", "INV", "INV area=1 for edge bubbles.", ["Complement cost"], ["area 1"], null),
      step("aoi", "AOI21", "AOI21 is available for richer covers (toy).", ["3-input"], ["Optional"], null, mapBuffers()),
    ],
  },
  "techmap-cover": {
    title: "Techmap",
    module: "module03-01-techmap-cover",
    kind: "synthesis",
    steps: [
      step("run", "Run", "Techmap area paints orange cells on ANDs.", ["Cover"], ["AND2/NOR2"], null, mapBuffers()),
      step("area", "Area", "Total area includes AND cells plus INVs.", ["Sum"], [`≥${GOLDENS.mapAreaMin}`], null, (() => {
        const m = techmapArea();
        return { mapping: m.mapping, metricText: `area ${m.area}` };
      })()),
      step("nor", "NOR", "Both-comp nodes prefer NOR2.", ["Rewrite link"], ["NOR2"], null, mapBuffers()),
      step("inv", "Inv", "Complement bubbles add INV area.", ["invArea"], ["Cost"], null, (() => {
        const m = techmapArea();
        return { mapping: m.mapping, metricText: `inv ${m.invCount}` };
      })()),
      step("cuts", "Cuts", "Cut stats travel with the mapping report.", ["Accompanying"], ["Enumerate"], null, (() => {
        const m = techmapArea();
        return { mapping: m.mapping, cuts: enumerateCuts(), metricText: `cuts ${m.cuts.totalCuts}` };
      })()),
    ],
  },
  "area-delay": {
    title: "Area/delay",
    module: "module03-03-area-delay",
    kind: "synthesis",
    steps: [
      step("trade", "Trade", "Two modes share the same cover on this toy.", ["Objectives"], ["Report both"], null, mapBuffers()),
      step("area", "Area mode", "Sum of cell areas (plus INV).", ["areaMode"], ["Primary"], null, (() => {
        const t = areaDelayTradeoff();
        return { ...mapBuffers(), metricText: `area ${t.areaMode.area}` };
      })()),
      step("delay", "Delay mode", "Depth proxy = #AND × AND2 delay.", ["delayDepth"], ["Proxy"], null, (() => {
        const t = areaDelayTradeoff();
        return { ...mapBuffers(), metricText: `depth ${t.delayMode.delayDepth}` };
      })()),
      step("lib", "Library", "Six cells bound the choice set.", ["libCount"], ["6"], null),
      step("choice", "Choice", "Real flows weight the two; we just report both.", ["Literacy"], ["Next seq"], null),
    ],
  },
  "sequential-synth": {
    title: "Sequential synth",
    module: "module04-01-sequential-synth",
    kind: "synthesis",
    steps: [
      step("pipe", "Pipeline", "One click runs the full toy flow.", ["stats→map"], ["ABC-ish"], null),
      step("stats", "Stats", "PI/AND/PO match goldens.", ["aigStats"], [`AND=${GOLDENS.and}`], null, { metricText: JSON.stringify(aigStats()) }),
      step("map", "Map", "Orange cells after sequential synth.", ["Cover"], ["Mapped"], null, (() => {
        const s = sequentialSynth();
        return { mapping: s.mapping.mapping, cuts: enumerateCuts(), metricText: `area ${s.mapping.area}` };
      })()),
      step("area", "Area", "Mapped area is positive.", [">0"], ["Check"], null, (() => {
        const s = sequentialSynth();
        return { mapping: s.mapping.mapping, metricText: `area ${s.mapping.area}` };
      })()),
      step("done", "Done", "Next: offline compare, then wrap toward STA.", ["learn_sta"], ["Wrap"], null),
    ],
  },
};

void LIBRARY;
void localRewriteCount;
