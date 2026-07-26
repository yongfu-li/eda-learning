/** Walkthrough packs for learn_dft_insert (kind: dft). */

import { STARTER, GOLDENS, cloneDesign } from "../../assets/dft-core.js";



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



export const DFT_ALGOS = {

  "scan-flops": {

    kind: "dft",

    title: "Scan flops",

    module: "module01-01-scan-flops",

    steps: [

      step("sdff", "SDFF cells", "Each flop becomes a scan SDFF cell.", ["SDFF"], ["4 cells"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "SDFF ×4" }),

      step("f1", "Flop f1", "f1: domain d0, clk=clk.", ["f1"], ["d0"], { highlight: ["f1"], metricText: "f1 d0" }),

      step("f2", "Flop f2", "f2: Q→n2 feeds f3.", ["f2"], ["d0"], { highlight: ["f2"], metricText: "f2 d0" }),

      step("f3", "Flop f3", "f3: last flop in d0.", ["f3"], ["d0"], { highlight: ["f3"], metricText: "f3 d0" }),

      step("golden", "Golden", "GOLDEN: scan_cell_count=4.", ["GOLDEN"], ["4"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "cells=4" }),

    ],

  },

  "scan-enable": {

    kind: "dft",

    title: "Scan enable",

    module: "module01-03-scan-enable",

    steps: [

      step("se", "SE port", "scan_enable drives mux select on all SDFFs.", ["SE"], ["scan_enable"], { highlight: ["se"], metricText: "SE port" }),

      step("si", "SI port", "scan_in hooks first cell in chain.", ["SI"], ["scan_in"], { highlight: ["si", "f1"], metricText: "SI→f1" }),

      step("so", "SO port", "scan_out hooks last cell Q.", ["SO"], ["scan_out"], { highlight: ["f4", "so"], metricText: "f4→SO" }),

      step("hook", "Port names", "si=scan_in, so=scan_out, se=scan_enable.", ["ports"], ["3"], { highlight: ["si", "so", "se"], metricText: "3 ports" }),

      step("golden", "Golden", "GOLDEN: se=scan_enable, si=scan_in, so=scan_out.", ["GOLDEN"], ["ok"], { highlight: ["si", "so", "se"], metricText: "ports ok" }),

    ],

  },

  "chain-stitch": {

    kind: "dft",

    title: "Chain stitch",

    module: "module02-01-chain-stitch",

    steps: [

      step("rule", "Stitch rule", "Q of previous flop → SI of next in scan_order.", ["stitch"], ["Q→SI"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "Q→SI" }),

      step("s12", "f1→f2", "Stitch f1 Q to f2 SI.", ["f1", "f2"], ["1"], { highlight: ["f1", "f2"], metricText: "stitch 1" }),

      step("s23", "f2→f3", "Stitch f2 Q to f3 SI.", ["f2", "f3"], ["2"], { highlight: ["f2", "f3"], metricText: "stitch 2" }),

      step("s34", "f3→f4", "Stitch f3 Q to f4 SI (crosses domain).", ["f3", "f4"], ["3"], { highlight: ["f3", "f4"], metricText: "stitch 3" }),

      step("golden", "Golden", "GOLDEN: stitch_count=3.", ["GOLDEN"], ["3"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "stitches=3" }),

    ],

  },

  "scan-order": {

    kind: "dft",

    title: "Scan order",

    module: "module02-03-scan-order",

    steps: [

      step("list", "Order list", "scan_order defines chain sequence left→right.", ["order"], ["4"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "f1→f4" }),

      step("f1", "First f1", "Chain starts at f1.", ["f1"], ["1"], { highlight: ["f1", "si"], metricText: "head=f1" }),

      step("mid", "Middle f2 f3", "f2 and f3 in domain d0.", ["f2", "f3"], ["2"], { highlight: ["f2", "f3"], metricText: "mid chain" }),

      step("tail", "Tail f4", "Chain ends at f4 in d1.", ["f4"], ["4"], { highlight: ["f4", "so"], metricText: "tail=f4" }),

      step("golden", "Golden", "GOLDEN: chain_length=4, covers_all=true.", ["GOLDEN"], ["4"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "length=4" }),

    ],

  },

  "lockup-latch": {

    kind: "dft",

    title: "Lockup latch",

    module: "module03-01-lockup-latch",

    steps: [

      step("cross", "Domain crossing", "lockup_between d0 and d1 requires lockup.", ["domain"], ["d0→d1"], { highlight: ["f3", "f4"], metricText: "d0→d1" }),

      step("pair", "f3→f4 pair", "Consecutive flops f3 (d0) and f4 (d1).", ["f3", "f4"], ["pair"], { highlight: ["f3", "f4"], metricText: "f3→f4" }),

      step("cell", "Lockup cell", "Insert lockup_f3_f4 between domains.", ["lockup"], ["1"], { highlight: ["f3", "f4"], markers: [{ kind: "lockup", from: "f3", to: "f4" }], metricText: "lockup cell" }),

      step("clk", "Clock domains", "f4 uses clk2; f1–f3 use clk.", ["clk"], ["2 clk"], { highlight: ["f4"], metricText: "clk2" }),

      step("golden", "Golden", "GOLDEN: lockup_count=1 on f3→f4.", ["GOLDEN"], ["1"], { highlight: ["f3", "f4"], markers: [{ kind: "lockup", from: "f3", to: "f4" }], metricText: "lockups=1" }),

    ],

  },

  "netlist-transform": {

    kind: "dft",

    title: "Netlist transform",

    module: "module03-03-netlist-transform",

    steps: [

      step("si", "SI edge", "SI→f1 hook edge.", ["SI"], ["1"], { highlight: ["si", "f1"], metricText: "SI edge" }),

      step("st", "Stitch edges", "Three flop-to-flop stitch edges.", ["stitch"], ["3"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "3 stitches" }),

      step("so", "SO edge", "f4→SO hook edge.", ["SO"], ["1"], { highlight: ["f4", "so"], metricText: "SO edge" }),

      step("lk", "Lockup edge", "One lockup edge on d0→d1 crossing.", ["lockup"], ["1"], { highlight: ["f3", "f4"], markers: [{ kind: "lockup", from: "f3", to: "f4" }], metricText: "1 lockup" }),

      step("golden", "Golden", "GOLDEN: transform_edge_count=6.", ["GOLDEN"], ["6"], { highlight: ["si", "f1", "f2", "f3", "f4", "so"], metricText: "edges=6" }),

    ],

  },

  "dft-markers": {

    kind: "dft",

    title: "DFT markers",

    module: "module04-01-dft-markers",

    steps: [

      step("kind", "Lockup marker", "kind=lockup on domain crossings.", ["lockup"], ["1"], { highlight: ["f3", "f4"], markers: [{ kind: "lockup", from: "f3", to: "f4" }], metricText: "lockup marker" }),

      step("cross", "d0→d1 hit", "Marker on f3→f4 crossing.", ["d0", "d1"], ["cross"], { highlight: ["f3", "f4"], metricText: "d0→d1" }),

      step("collect", "Collect", "Union lockup hits for signoff.", ["collect"], ["1"], { metricText: "collect" }),

      step("report", "Report", "One marker required for this toy.", ["report"], ["1"], { markers: [{ kind: "lockup", from: "f3", to: "f4" }], metricText: "report" }),

      step("golden", "Golden", "GOLDEN: marker_count=1.", ["GOLDEN"], ["1"], { highlight: ["f3", "f4"], markers: [{ kind: "lockup", from: "f3", to: "f4" }], metricText: "markers=1" }),

    ],

  },

  "scan-chain-view": {

    kind: "dft",

    title: "Scan chain view",

    module: "module04-03-scan-chain-view",

    steps: [

      step("draw", "Draw chain", "Visualize full scan path SI→f1→…→f4→SO.", ["chain"], ["4 flops"], { highlight: ["si", "f1", "f2", "f3", "f4", "so"], metricText: "full chain" }),

      step("stitches", "Stitch lines", "Three stitch edges between flops.", ["stitch"], ["3"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "3 stitches" }),

      step("lockup", "Lockup highlight", "Lockup dashed between f3 and f4.", ["lockup"], ["1"], { highlight: ["f3", "f4"], markers: [{ kind: "lockup", from: "f3", to: "f4" }], metricText: "lockup view" }),

      step("se", "SE label", "scan_enable shown above chain.", ["SE"], ["se"], { highlight: ["se"], metricText: "SE label" }),

      step("golden", "Golden", "GOLDEN: f1→f2→f3→f4 with lockup f3→f4.", ["GOLDEN"], ["ok"], { highlight: ["f1", "f2", "f3", "f4"], markers: [{ kind: "lockup", from: "f3", to: "f4" }], metricText: "chain ok" }),

    ],

  },

  "dft-engine": {

    kind: "dft",

    title: "DFT engine",

    module: "module05-01-dft-engine",

    steps: [

      step("stats", "Stats snapshot", "4 flops, 2 domains, 3 ports.", ["stats"], ["4/2"], { metricText: "4 flops / 2 domains" }),

      step("cells", "Scan cells", "4 SDFF cells identified.", ["cells"], ["4"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "cells=4" }),

      step("chain", "Chain check", "stitch_count=3, chain_length=4.", ["chain"], ["3/4"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "chain ok" }),

      step("lockup", "Lockup check", "lockup_count=1, edges=6.", ["lockup"], ["1/6"], { highlight: ["f3", "f4"], markers: [{ kind: "lockup", from: "f3", to: "f4" }], metricText: "lockup+edges" }),

      step("ok", "Engine OK", "GOLDEN: engine ok=True.", ["GOLDEN"], ["ok"], { highlight: ["f1", "f2", "f3", "f4"], metricText: "ok=true" }),

    ],

  },

};
