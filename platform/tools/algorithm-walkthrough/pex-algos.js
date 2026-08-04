/** Walkthrough packs for learn_pex (kind: pex). */
import { STARTER, GOLDENS, cloneDesign, drawPex } from "../../assets/pex-core.js";

void drawPex;

function step(id, title, caption, bullets, metrics, extra = {}) {
  return {
    id,
    title,
    caption,
    bullets,
    metrics,
    design: cloneDesign(STARTER),
    ...extra,
  };
}

export const PEX_ALGOS = {
  "geometry-load": {
    kind: "pex",
    title: "Geometry load",
    module: "module01-01-geometry-load",
    steps: [
      step("segments", "Segments", "Four wire/via segments on net n1: s1, s2, v1, s3.", ["segments"], [`s=${GOLDENS.segmentCount}`], {
        mode: "geometry",
        highlight: ["s1", "s2", "v1", "s3"],
        metricText: "segs=4",
      }),
      step("layers", "Layers", "Three layers: M1, VIA, M2.", ["layers"], [`L=${GOLDENS.layerCount}`], {
        mode: "geometry",
        highlight: ["s1", "v1", "s3"],
        metricText: "layers=3",
      }),
      step("nets", "Nets", "Single net n1 with ports in and out.", ["nets"], ["n1"], {
        mode: "geometry",
        highlight: ["n1", "in", "out"],
        metricText: "net n1",
      }),
      step("ids", "Ids", "Segment ids s1/s2/v1/s3 in path order.", ["ids"], ["s1…s3"], {
        mode: "geometry",
        highlight: ["s1", "s2", "v1", "s3"],
        selected: ["s1"],
        metricText: "path order",
      }),
      step("golden", "Golden", "GOLDEN: segment_count=4, layer_count=3.", ["GOLDEN"], ["4/3"], {
        mode: "geometry",
        highlight: ["s1", "s2", "v1", "s3"],
        metricText: "segs=4 layers=3",
      }),
    ],
  },
  "resistance-extract": {
    kind: "pex",
    title: "Resistance extract",
    module: "module01-03-resistance-extract",
    steps: [
      step("formula", "Formula", "Metal R = rho*L/W; VIA uses lump rho.", ["formula"], ["rho*L/W"], {
        mode: "resistance",
        highlight: ["s1", "s2", "v1", "s3"],
        metricText: "R formula",
      }),
      step("s1", "s1", "s1 M1 segment: R=0.5 ohm.", ["s1"], [`R=${GOLDENS.rS1}`], {
        mode: "resistance",
        highlight: ["s1"],
        selected: ["s1"],
        metricText: "s1=0.5",
      }),
      step("s2", "s2", "s2 M1 segment: R=0.4 ohm.", ["s2"], [`R=${GOLDENS.rS2}`], {
        mode: "resistance",
        highlight: ["s2"],
        selected: ["s2"],
        metricText: "s2=0.4",
      }),
      step("v1", "v1", "v1 VIA lump: R=2.0 ohm.", ["v1"], [`R=${GOLDENS.rV1}`], {
        mode: "resistance",
        highlight: ["v1"],
        selected: ["v1"],
        metricText: "v1=2.0",
      }),
      step("golden", "Golden", "GOLDEN: R_total=3.06; s1=0.5.", ["GOLDEN"], [`${GOLDENS.rTotal}`], {
        mode: "resistance",
        highlight: ["s1", "s2", "v1", "s3"],
        metricText: "R_total=3.06",
      }),
    ],
  },
  "capacitance-extract": {
    kind: "pex",
    title: "Capacitance extract",
    module: "module01-05-capacitance-extract",
    steps: [
      step("formula", "Formula", "C = c_area*area + c_perim*perimeter on M1/M2.", ["formula"], ["area+perim"], {
        mode: "capacitance",
        highlight: ["s1", "s2", "s3"],
        metricText: "C formula",
      }),
      step("s1", "s1", "Ground C on s1 M1 segment.", ["s1"], ["C_s1"], {
        mode: "capacitance",
        highlight: ["s1"],
        selected: ["s1"],
        metricText: "C on s1",
      }),
      step("s2", "s2", "Ground C on s2 M1 segment.", ["s2"], ["C_s2"], {
        mode: "capacitance",
        highlight: ["s2"],
        selected: ["s2"],
        metricText: "C on s2",
      }),
      step("s3", "s3", "Ground C on s3 M2 segment.", ["s3"], ["C_s3"], {
        mode: "capacitance",
        highlight: ["s3"],
        selected: ["s3"],
        metricText: "C on s3",
      }),
      step("golden", "Golden", "GOLDEN: C_total=1.376; 3 caps.", ["GOLDEN"], [`${GOLDENS.cTotal}`], {
        mode: "capacitance",
        highlight: ["s1", "s2", "s3"],
        metricText: "C_total=1.376",
      }),
    ],
  },
  "rc-network": {
    kind: "pex",
    title: "RC network build",
    module: "module02-01-rc-network",
    steps: [
      step("order", "Order", "Series path: s1 → s2 → v1 → s3.", ["order"], ["s1→s3"], {
        mode: "network",
        highlight: ["s1", "s2", "v1", "s3"],
        metricText: "series path",
      }),
      step("resistors", "Resistors", "Four R edges in series from in to out.", ["resistors"], [`R=${GOLDENS.rCount}`], {
        mode: "network",
        highlight: ["s1", "s2", "v1", "s3"],
        metricText: "R edges=4",
      }),
      step("nodes", "Nodes", "Nodes include in and out ports.", ["nodes"], ["in/out"], {
        mode: "network",
        highlight: ["in", "out"],
        selected: ["in"],
        metricText: "in/out",
      }),
      step("caps", "Caps", "Three C branches to gnd on metal nodes.", ["caps"], [`C=${GOLDENS.cGndCount}`], {
        mode: "network",
        highlight: ["s1", "s2", "s3"],
        metricText: "C branches=3",
      }),
      step("golden", "Golden", "GOLDEN: series chain; nodes include in/out.", ["GOLDEN"], ["in/out"], {
        mode: "network",
        highlight: ["in", "out", "s1", "s3"],
        metricText: "chain ok",
      }),
    ],
  },
  "network-reduce": {
    kind: "pex",
    title: "Network reduction",
    module: "module02-03-network-reduce",
    steps: [
      step("before", "Before", "Full chain has 5 nodes before reduce.", ["before"], [`n=${GOLDENS.nodesBefore}`], {
        mode: "reduce",
        highlight: ["in", "out", "s1", "s2", "v1"],
        metricText: "before=5",
      }),
      step("series", "Series R", "Sum series R → R_eq=3.06.", ["series"], [`Req=${GOLDENS.rTotal}`], {
        mode: "reduce",
        highlight: ["R_eq"],
        selected: ["R_eq"],
        metricText: "R_eq=3.06",
      }),
      step("sumc", "Sum C", "Sum ground C → C_eq=1.376.", ["sum C"], [`Ceq=${GOLDENS.cTotal}`], {
        mode: "reduce",
        highlight: ["C_eq"],
        selected: ["C_eq"],
        metricText: "C_eq=1.376",
      }),
      step("after", "After", "Reduced to 2 signal ports (in/out).", ["after"], [`n=${GOLDENS.nodesAfter}`], {
        mode: "reduce",
        highlight: ["in", "out"],
        metricText: "after=2",
      }),
      step("golden", "Golden", "GOLDEN: after_nodes=2; R_eq=3.06 C_eq=1.376.", ["GOLDEN"], ["2/3.06"], {
        mode: "reduce",
        highlight: ["in", "out", "R_eq", "C_eq"],
        metricText: "reduce ok",
      }),
    ],
  },
  "back-annotate": {
    kind: "pex",
    title: "Back-annotate nets",
    module: "module03-01-back-annotate",
    steps: [
      step("net", "Net", "Target net n1 from tiny_pex.", ["net"], ["n1"], {
        mode: "annotate",
        highlight: ["n1"],
        selected: ["n1"],
        metricText: "net n1",
      }),
      step("r", "R total", "r_total=3.06 from reduced network.", ["R"], [`R=${GOLDENS.rTotal}`], {
        mode: "annotate",
        highlight: ["n1", "R_eq"],
        metricText: "r_total=3.06",
      }),
      step("c", "C total", "c_total=1.376 from reduced network.", ["C"], [`C=${GOLDENS.cTotal}`], {
        mode: "annotate",
        highlight: ["n1", "C_eq"],
        metricText: "c_total=1.376",
      }),
      step("ports", "Ports", "Ports in and out on n1.", ["ports"], ["in/out"], {
        mode: "annotate",
        highlight: ["in", "out", "n1"],
        metricText: "ports",
      }),
      step("golden", "Golden", "GOLDEN: net n1 annotated.", ["GOLDEN"], ["n1"], {
        mode: "annotate",
        highlight: ["n1"],
        metricText: "annotated",
      }),
    ],
  },
  "spef-lite": {
    kind: "pex",
    title: "SPEF-lite emit",
    module: "module03-03-spef-lite",
    steps: [
      step("header", "Header", "*SPEF_LITE header and *NET n1 line.", ["header"], ["*SPEF"], {
        mode: "spef",
        highlight: ["n1"],
        metricText: "*SPEF_LITE",
      }),
      step("res", "RES", "One *RES in out 3.06 line.", ["RES"], [`${GOLDENS.spefResCount}`], {
        mode: "spef",
        highlight: ["R_eq", "in", "out"],
        metricText: "1 RES",
      }),
      step("cap", "CAP", "One *CAP out 1.376 line.", ["CAP"], [`${GOLDENS.spefCapCount}`], {
        mode: "spef",
        highlight: ["C_eq", "out"],
        metricText: "1 CAP",
      }),
      step("counts", "Counts", "res_count=1, cap_count=1.", ["counts"], ["1/1"], {
        mode: "spef",
        highlight: ["R_eq", "C_eq"],
        metricText: "res/cap=1",
      }),
      step("golden", "Golden", "GOLDEN: 1 RES + 1 CAP.", ["GOLDEN"], ["1+1"], {
        mode: "spef",
        highlight: ["R_eq", "C_eq", "n1"],
        metricText: "SPEF ok",
      }),
    ],
  },
  "pex-engine": {
    kind: "pex",
    title: "PEX engine",
    module: "module04-01-pex-engine",
    steps: [
      step("geo", "Geo", "Geometry segment_count=4, layer_count=3.", ["geo"], [`s=${GOLDENS.segmentCount}`], {
        mode: "engine",
        highlight: ["s1", "s2", "v1", "s3"],
        metricText: "geo ok",
      }),
      step("rc", "R/C", "Resistance r_total=3.06; capacitance c_total=1.376.", ["R/C"], [`${GOLDENS.rTotal}/${GOLDENS.cTotal}`], {
        mode: "engine",
        highlight: ["s1", "s2", "s3"],
        metricText: "R/C ok",
      }),
      step("reduce", "Reduce", "Reduce after_nodes=2; R_eq/C_eq match.", ["reduce"], [`n=${GOLDENS.nodesAfter}`], {
        mode: "engine",
        highlight: ["in", "out", "R_eq", "C_eq"],
        metricText: "reduce ok",
      }),
      step("spef", "SPEF", "SPEF res_count=1, cap_count=1.", ["spef"], ["1/1"], {
        mode: "engine",
        highlight: ["R_eq", "C_eq"],
        metricText: "spef ok",
      }),
      step("ok", "OK", "GOLDEN: ok=True.", ["GOLDEN"], ["ok"], {
        mode: "engine",
        highlight: ["s1", "s2", "v1", "s3", "in", "out"],
        metricText: "ok=true",
      }),
    ],
  },
};
