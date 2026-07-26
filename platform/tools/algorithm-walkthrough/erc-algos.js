/** Walkthrough packs for learn_erc (kind: erc). */
import { STARTER, GOLDENS, cloneDesign } from "../../assets/erc-core.js";

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

export const ERC_ALGOS = {
  "netlist-graph": {
    kind: "erc",
    title: "Netlist connectivity graph",
    module: "module01-01-netlist-graph",
    steps: [
      step("nets", "Nets", "Eight nets: supplies, ports, float_n, z, well_n.", ["nets"], [`n=${GOLDENS.netCount}`], { highlight: ["vdd", "vss", "a", "b", "y", "float_n", "z", "well_n"], metricText: "nets=8" }),
      step("inst", "Instances", "Four instances: u1, u2, u3, short1.", ["instances"], [`i=${GOLDENS.instanceCount}`], { highlight: ["u1", "u2", "u3", "short1"], metricText: "instances=4" }),
      step("edges", "Edges", "Each pin attachment is an inst–net edge.", ["edges"], [`e=${GOLDENS.edgeCount}`], { highlight: ["u1", "a", "y", "vdd", "vss"], metricText: "pin edges" }),
      step("walk", "Walk", "Walk pins on u1 INV: A,Y,VDD,VSS.", ["u1"], ["A/Y/VDD/VSS"], { highlight: ["u1", "a", "y"], metricText: "u1 pins" }),
      step("count", "Count", "GOLDEN: edge_count=14.", ["GOLDEN"], ["14"], { metricText: "edge_count=14" }),
    ],
  },
  "drivers-loads": {
    kind: "erc",
    title: "Drivers and loads",
    module: "module01-03-drivers-loads",
    steps: [
      step("out", "Out pins", "Y pins are drivers (dir=out).", ["out"], ["Y"], { highlight: ["y", "z"], metricText: "drivers" }),
      step("in", "In pins", "A pins are loads (dir=in).", ["in"], ["A"], { highlight: ["a", "b", "float_n"], metricText: "loads" }),
      step("z", "z drivers", "Net z: u2.Y and u3.Y — two drivers.", ["z"], ["2"], { highlight: ["z", "u2", "u3"], metricText: "z drivers=2" }),
      step("float", "float", "float_n: zero drivers, one load (u2.A).", ["float_n"], ["0"], { highlight: ["float_n", "u2"], metricText: "float drivers=0" }),
      step("count", "Count", "GOLDEN: float_n drivers=0, z drivers=2.", ["GOLDEN"], ["ok"], { highlight: ["float_n", "z"], metricText: "classify ok" }),
    ],
  },
  "floating-nets": {
    kind: "erc",
    title: "Floating nets",
    module: "module02-01-floating-nets",
    steps: [
      step("nodrv", "No driver", "float_n has zero output pins.", ["no-driver"], ["0"], { highlight: ["float_n"], metricText: "no driver" }),
      step("load", "Has load", "u2.A loads float_n.", ["load"], ["u2.A"], { highlight: ["float_n", "u2"], metricText: "has load" }),
      step("port", "Not port", "float_n is not a primary port.", ["ports"], ["a/b/y"], { highlight: ["a", "b", "y"], metricText: "ports ≠ float" }),
      step("sup", "Not supply", "float_n is not vdd/vss.", ["supplies"], ["vdd/vss"], { highlight: ["vdd", "vss"], metricText: "supplies ok" }),
      step("golden", "Golden", "GOLDEN: floating_count=1.", ["GOLDEN"], ["1"], { highlight: ["float_n"], markers: [{ kind: "floating", net: "float_n" }], metricText: "floating=1" }),
    ],
  },
  "undriven-inputs": {
    kind: "erc",
    title: "Undriven inputs",
    module: "module02-03-undriven-inputs",
    steps: [
      step("scan", "Scan loads", "Walk every input pin attachment.", ["scan"], ["loads"], { highlight: ["a", "b", "float_n"], metricText: "scan loads" }),
      step("drv", "Driver?", "Skip if the net already has a driver.", ["skip"], ["driven"], { highlight: ["y", "z"], metricText: "driven ok" }),
      step("pi", "Primary in", "Primary input ports are allowed undriven.", ["ports"], ["ok"], { highlight: ["a", "b"], metricText: "ports ok" }),
      step("hit", "Hit", "u2.A on float_n is the golden hit.", ["u2.A"], ["float_n"], { highlight: ["u2", "float_n"], metricText: "u2.A" }),
      step("count", "Count", "GOLDEN: undriven_count=1.", ["GOLDEN"], ["1"], { highlight: ["float_n"], markers: [{ kind: "undriven", inst: "u2", pin: "A", net: "float_n" }], metricText: "undriven=1" }),
    ],
  },
  "multi-driven": {
    kind: "erc",
    title: "Multi-driven nets",
    module: "module03-01-multi-driven",
    steps: [
      step("count", "Count drivers", "Per net, count dir=out pins.", ["count"], ["out"], { highlight: ["y", "z"], metricText: "count out" }),
      step("thr", "Threshold", "Flag when drivers ≥ 2.", [">=2"], ["flag"], { highlight: ["z"], metricText: "≥2" }),
      step("fight", "z fight", "u2.Y and u3.Y both drive z.", ["fight"], ["u2+u3"], { highlight: ["z", "u2", "u3"], metricText: "fight" }),
      step("yok", "y ok", "y has a single driver — legal.", ["y"], ["1"], { highlight: ["y", "u1"], metricText: "y ok" }),
      step("golden", "Golden", "GOLDEN: multi_driven_count=1.", ["GOLDEN"], ["1"], { highlight: ["z"], markers: [{ kind: "multi_driven", net: "z" }], metricText: "multi=1" }),
    ],
  },
  "supply-shorts": {
    kind: "erc",
    title: "Supply shorts",
    module: "module03-03-supply-shorts",
    steps: [
      step("short", "SHORT cell", "short1 is a SHORT instance.", ["SHORT"], ["short1"], { highlight: ["short1"], metricText: "SHORT" }),
      step("pins", "Pins", "P1→vdd, P2→vss.", ["pins"], ["vdd/vss"], { highlight: ["short1", "vdd", "vss"], metricText: "pins" }),
      step("kinds", "Kinds", "power and ground both present.", ["kinds"], ["power+ground"], { highlight: ["vdd", "vss"], metricText: "power+ground" }),
      step("flag", "Flag", "Record the short hit.", ["flag"], ["1"], { highlight: ["short1"], metricText: "flag" }),
      step("golden", "Golden", "GOLDEN: supply_short_count=1.", ["GOLDEN"], ["1"], { highlight: ["vdd", "vss", "short1"], markers: [{ kind: "supply_short", inst: "short1" }], metricText: "shorts=1" }),
    ],
  },
  "well-substrate": {
    kind: "erc",
    title: "Well and substrate ties",
    module: "module04-01-well-substrate",
    steps: [
      step("nwell", "nwell rule", "nwell must tie to a power supply.", ["nwell"], ["power"], { highlight: ["well_n", "vdd"], metricText: "nwell→power" }),
      step("bad", "Bad tie", "nw1.tied_to = vss (ground) — wrong.", ["bad"], ["vss"], { highlight: ["well_n", "vss"], metricText: "tied vss" }),
      step("exp", "Expected", "Expected power (vdd).", ["expect"], ["power"], { highlight: ["vdd"], metricText: "expect power" }),
      step("pwell", "pwell note", "pwell would require ground.", ["pwell"], ["ground"], { highlight: ["vss"], metricText: "pwell note" }),
      step("golden", "Golden", "GOLDEN: well_error_count=1.", ["GOLDEN"], ["1"], { highlight: ["well_n"], markers: [{ kind: "well_error", well: "nw1", net: "well_n" }], metricText: "wells=1" }),
    ],
  },
  "erc-markers": {
    kind: "erc",
    title: "ERC markers",
    module: "module04-03-erc-markers",
    steps: [
      step("float", "Floating m", "One floating marker on float_n.", ["floating"], ["1"], { highlight: ["float_n"], markers: [{ kind: "floating", net: "float_n" }], metricText: "float" }),
      step("undrv", "Undriven m", "One undriven marker on u2.A.", ["undriven"], ["1"], { highlight: ["float_n", "u2"], markers: [{ kind: "undriven", net: "float_n" }], metricText: "undriven" }),
      step("multi", "Multi m", "One multi-driven marker on z.", ["multi"], ["1"], { highlight: ["z"], markers: [{ kind: "multi_driven", net: "z" }], metricText: "multi" }),
      step("sw", "Short+well", "Supply short + well error markers.", ["short", "well"], ["2"], { highlight: ["vdd", "vss", "well_n"], metricText: "short+well" }),
      step("count", "Count 5", "GOLDEN: marker_count=5.", ["GOLDEN"], ["5"], { highlight: ["float_n", "z", "well_n"], metricText: "markers=5" }),
    ],
  },
  "erc-engine": {
    kind: "erc",
    title: "ERC engine",
    module: "module05-01-erc-engine",
    steps: [
      step("stats", "Stats", "8 nets / 4 instances.", ["stats"], ["8/4"], { metricText: "8 nets / 4 inst" }),
      step("fu", "Float+undrv", "float_n + u2.A.", ["float", "undriven"], ["2"], { highlight: ["float_n", "u2"], metricText: "float+undrv" }),
      step("ms", "Multi+short", "z fight + vdd↔vss short.", ["multi", "short"], ["2"], { highlight: ["z", "vdd", "vss"], metricText: "multi+short" }),
      step("well", "Well", "nw1 nwell error.", ["well"], ["1"], { highlight: ["well_n"], metricText: "well" }),
      step("ok", "OK", "GOLDEN: engine ok=True.", ["GOLDEN"], ["ok"], { highlight: ["float_n", "z", "well_n"], metricText: "ok=true markers=5" }),
    ],
  },
};
