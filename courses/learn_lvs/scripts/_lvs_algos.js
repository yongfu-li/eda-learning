/** Walkthrough packs for learn_lvs (kind: lvs). */
import { STARTER, GOLDENS, cloneDesign, drawLvs } from "../../assets/lvs-core.js";

void drawLvs;

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

export const LVS_ALGOS = {
  "schematic-graph": {
    kind: "lvs",
    title: "Schematic connectivity graph",
    module: "module01-01-schematic-graph",
    steps: [
      step("devices", "Devices", "Two schematic devices: mn1 (nmos) and mp1 (pmos).", ["devices"], [`d=${GOLDENS.schDeviceCount}`], {
        mode: "schematic",
        highlight: ["mn1", "mp1"],
        metricText: "mn1/mp1",
      }),
      step("nets", "Nets", "Four nets: a, y, vdd, vss.", ["nets"], [`n=${GOLDENS.schNetCount}`], {
        mode: "schematic",
        highlight: ["a", "y", "vdd", "vss"],
        metricText: "nets=4",
      }),
      step("pins", "Pins", "Each device pin attaches to a net (G/D/S).", ["pins"], ["G/D/S"], {
        mode: "schematic",
        highlight: ["mn1", "mp1", "a", "y"],
        metricText: "pin edges",
      }),
      step("edges", "Edges", "Six pin edges across mn1 and mp1.", ["edges"], ["6"], {
        mode: "schematic",
        highlight: ["mn1", "mp1", "a", "y", "vdd", "vss"],
        metricText: "edge_count=6",
      }),
      step("golden", "Golden", "GOLDEN: device_count=2, net_count=4.", ["GOLDEN"], ["2/4"], {
        mode: "schematic",
        highlight: ["mn1", "mp1", "a", "y"],
        metricText: "devices=2 nets=4",
      }),
    ],
  },
  "device-recog": {
    kind: "lvs",
    title: "Device recognition",
    module: "module01-03-device-recog",
    steps: [
      step("shapes", "Shapes", "Nine layout shapes: diff, poly, M1, implants.", ["shapes"], [`s=${GOLDENS.layShapeCount}`], {
        mode: "recognize",
        highlight: ["X0", "X1"],
        metricText: "shapes=9",
      }),
      step("x0", "X0", "X0 nmos from ndiff, poly, nplus.", ["X0"], ["nmos"], {
        mode: "recognize",
        highlight: ["X0"],
        selected: ["X0"],
        metricText: "X0 nmos",
      }),
      step("x1", "X1", "X1 pmos from pdiff, poly, pplus.", ["X1"], ["pmos"], {
        mode: "recognize",
        highlight: ["X1"],
        selected: ["X1"],
        metricText: "X1 pmos",
      }),
      step("types", "Types", "Classify each layout device by type.", ["types"], ["n/p"], {
        mode: "recognize",
        highlight: ["X0", "X1"],
        metricText: "nmos/pmos",
      }),
      step("golden", "Golden", "GOLDEN: nmos=1, pmos=1.", ["GOLDEN"], ["1/1"], {
        mode: "recognize",
        highlight: ["X0", "X1"],
        metricText: "nmos=1 pmos=1",
      }),
    ],
  },
  "net-extract": {
    kind: "lvs",
    title: "Net extraction",
    module: "module01-05-net-extract",
    steps: [
      step("shapes", "Shapes", "M1 and diffusion shapes carry connectivity.", ["shapes"], ["M1/DIFF"], {
        mode: "extract",
        highlight: ["net_a", "net_y", "net_vss", "net_vdd"],
        metricText: "layout shapes",
      }),
      step("net_a", "net_a", "net_a: poly + m1_a (gate net a).", ["net_a"], ["a"], {
        mode: "extract",
        highlight: ["net_a"],
        selected: ["net_a"],
        metricText: "net_a",
      }),
      step("net_y", "net_y", "net_y: m1_y (output y).", ["net_y"], ["y"], {
        mode: "extract",
        highlight: ["net_y"],
        selected: ["net_y"],
        metricText: "net_y",
      }),
      step("sup", "Supplies", "net_vss and net_vdd tie diff + M1.", ["supplies"], ["vss/vdd"], {
        mode: "extract",
        highlight: ["net_vss", "net_vdd"],
        metricText: "supplies",
      }),
      step("golden", "Golden", "GOLDEN: count=4 nets.", ["GOLDEN"], ["4"], {
        mode: "extract",
        highlight: ["net_a", "net_y", "net_vss", "net_vdd"],
        metricText: "nets=4",
      }),
    ],
  },
  "layout-graph": {
    kind: "lvs",
    title: "Layout device–net graph",
    module: "module02-01-layout-graph",
    steps: [
      step("devices", "Devices", "Two layout devices: X0 nmos, X1 pmos.", ["devices"], [`d=${GOLDENS.layDeviceCount}`], {
        mode: "layout",
        highlight: ["X0", "X1"],
        metricText: "X0/X1",
      }),
      step("nets", "Nets", "Four layout nets: net_a, net_y, net_vss, net_vdd.", ["nets"], [`n=${GOLDENS.layNetCount}`], {
        mode: "layout",
        highlight: ["net_a", "net_y", "net_vss", "net_vdd"],
        metricText: "layout nets",
      }),
      step("pins", "Pins", "Each device has G/D/S pins on layout nets.", ["pins"], ["G/D/S"], {
        mode: "layout",
        highlight: ["X0", "X1", "net_a", "net_y"],
        metricText: "pin attach",
      }),
      step("edges", "Edges", "Six pin edges (3 per device).", ["edges"], ["6"], {
        mode: "layout",
        highlight: ["X0", "X1", "net_a", "net_y", "net_vss", "net_vdd"],
        metricText: "edge_count=6",
      }),
      step("golden", "Golden", "GOLDEN: edge_count=6.", ["GOLDEN"], ["6"], {
        mode: "layout",
        highlight: ["X0", "X1"],
        metricText: "devices=2 edges=6",
      }),
    ],
  },
  "pin-binding": {
    kind: "lvs",
    title: "Pin / name binding",
    module: "module02-03-pin-binding",
    steps: [
      step("dev", "Dev bind", "Device binding: X0→mn1, X1→mp1.", ["devices"], ["2"], {
        mode: "binding",
        highlight: ["X0", "X1", "mn1", "mp1"],
        metricText: "X0→mn1 X1→mp1",
      }),
      step("net", "Net bind", "Net binding: net_a→a, net_y→y.", ["nets"], ["a/y"], {
        mode: "binding",
        highlight: ["net_a", "net_y", "a", "y"],
        metricText: "net_a→a",
      }),
      step("sup", "Supplies", "net_vss→vss, net_vdd→vdd.", ["supplies"], ["vss/vdd"], {
        mode: "binding",
        highlight: ["net_vss", "net_vdd", "vdd", "vss"],
        metricText: "supply bind",
      }),
      step("pairs", "Pairs", "Four net pairs and two device pairs.", ["pairs"], ["4/2"], {
        mode: "binding",
        highlight: ["X0", "mn1", "net_a", "a"],
        metricText: "bind pairs",
      }),
      step("golden", "Golden", "GOLDEN: device_count=2, net_count=4.", ["GOLDEN"], ["2/4"], {
        mode: "binding",
        highlight: ["X0", "X1", "net_a", "net_y"],
        metricText: "bind ok",
      }),
    ],
  },
  "device-match": {
    kind: "lvs",
    title: "Device matching",
    module: "module03-01-device-match",
    steps: [
      step("bind", "Bind", "Use device binding X0→mn1, X1→mp1.", ["bind"], ["2"], {
        mode: "match",
        highlight: ["X0", "X1", "mn1", "mp1"],
        metricText: "device bind",
      }),
      step("type", "Type", "Compare layout type to schematic type.", ["type"], ["n/p"], {
        mode: "match",
        highlight: ["X0", "mn1"],
        metricText: "type check",
      }),
      step("x0", "X0", "X0 nmos matches mn1 nmos.", ["X0"], ["ok"], {
        mode: "match",
        highlight: ["X0", "mn1"],
        selected: ["X0"],
        metricText: "X0↔mn1",
      }),
      step("x1", "X1", "X1 pmos matches mp1 pmos.", ["X1"], ["ok"], {
        mode: "match",
        highlight: ["X1", "mp1"],
        selected: ["X1"],
        metricText: "X1↔mp1",
      }),
      step("golden", "Golden", "GOLDEN: matched_devices=2.", ["GOLDEN"], ["2"], {
        mode: "match",
        highlight: ["X0", "X1"],
        metricText: "matched=2",
      }),
    ],
  },
  "lvs-compare": {
    kind: "lvs",
    title: "LVS graph compare",
    module: "module03-03-lvs-compare",
    steps: [
      step("rename", "Rename", "Map layout nets to schematic via binding.", ["rename"], ["bind"], {
        mode: "compare",
        highlight: ["net_a", "a", "net_y", "y"],
        metricText: "net rename",
      }),
      step("pins", "Pins", "Walk each device pin on both sides.", ["pins"], ["G/D/S"], {
        mode: "compare",
        highlight: ["X0", "mn1", "net_a", "a"],
        metricText: "pin walk",
      }),
      step("check", "Check", "Mapped layout net must equal schematic net.", ["check"], ["eq"], {
        mode: "compare",
        highlight: ["net_y", "y"],
        metricText: "net eq",
      }),
      step("nets", "Nets", "All four bound nets match.", ["nets"], ["4"], {
        mode: "compare",
        highlight: ["net_a", "net_y", "net_vss", "net_vdd"],
        metricText: "matched nets",
      }),
      step("golden", "Golden", "GOLDEN: mismatch_count=0, matched_nets=4.", ["GOLDEN"], ["0/4"], {
        mode: "compare",
        highlight: ["net_a", "net_y", "net_vss", "net_vdd"],
        metricText: "mismatch=0 nets=4",
      }),
    ],
  },
  "lvs-engine": {
    kind: "lvs",
    title: "LVS engine",
    module: "module04-01-lvs-engine",
    steps: [
      step("sch", "Sch", "Schematic graph device_count=2, net_count=4.", ["sch"], [`d=${GOLDENS.schDeviceCount}`], {
        mode: "engine",
        highlight: ["mn1", "mp1"],
        metricText: "sch ok",
      }),
      step("recog", "Recog", "Recognize nmos=1, pmos=1.", ["recog"], ["1/1"], {
        mode: "engine",
        highlight: ["X0", "X1"],
        metricText: "recog ok",
      }),
      step("extract", "Extract", "Extract 4 layout nets.", ["extract"], [`n=${GOLDENS.layNetCount}`], {
        mode: "engine",
        highlight: ["net_a", "net_y", "net_vss", "net_vdd"],
        metricText: "extract ok",
      }),
      step("compare", "Compare", "Compare mismatch_count=0, matched_nets=4.", ["compare"], ["0/4"], {
        mode: "engine",
        highlight: ["net_a", "net_y"],
        metricText: "compare ok",
      }),
      step("ok", "OK", "GOLDEN: ok=True.", ["GOLDEN"], ["ok"], {
        mode: "engine",
        highlight: ["mn1", "mp1", "X0", "X1"],
        metricText: "ok=true",
      }),
    ],
  },
};
