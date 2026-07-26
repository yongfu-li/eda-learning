/** Walkthrough packs for learn_pattern_matching (kind: pattern). */
import {
  STARTER,
  CHIP,
  GOLDENS,
  cloneShapes,
  geometryStats,
  matchWidth,
  matchSpace,
  multiLayerViaCheck,
  multiLayerInteractions,
  layeredBoolean,
  matchEngine,
  emitMarkers,
  scanlineEvents,
} from "../../assets/pattern-matching-core.js";

function step(id, title, caption, bullets, metrics, extra = {}) {
  return {
    id,
    title,
    caption,
    bullets,
    metrics,
    shapes: cloneShapes(STARTER),
    chip: CHIP,
    ...extra,
  };
}

export const PATTERN_ALGOS = {
  "edges-polygons": {
    title: "Edges and polygons",
    module: "module01-01-edges-polygons",
    kind: "pattern",
    steps: [
      step("shapes", "Shapes", "Five rectangles: A,B,D on M1; C on M2; V on VIA.", ["layers"], [`n=${GOLDENS.shapeCount}`], {
        highlight: ["A", "B", "D", "C", "V"],
        metricText: "shapes=5",
      }),
      step("layers", "Layers", "Layers M1, M2, VIA — GOLDEN layer_count=3.", ["M1/M2/VIA"], [`layers=${GOLDENS.layerCount}`], {
        highlight: ["A", "B", "D"],
        selected: "A",
        metricText: "layers=3",
      }),
      step("edges", "Edges", "Each rect yields 4 edges → 20 total.", ["4×5"], [`edges=${GOLDENS.edgeCount}`], {
        selected: "A",
        highlight: ["A"],
        metricText: "edges=20",
      }),
      step("a", "Select A", "A is 8×4 on M1 at left.", ["M1"], ["8×4"], { selected: "A", highlight: ["A"], metricText: "A 8×4" }),
      step("stats", "Stats", "geometry_stats reports counts and widths.", ["stats"], ["GOLDEN 5/20"], {
        metricText: JSON.stringify(geometryStats(STARTER)),
      }),
    ],
  },
  "single-layer-edge-pair": {
    title: "Single-layer edge-pair",
    module: "module01-03-single-layer-edge-pair",
    kind: "pattern",
    steps: [
      step("nb", "Neighbors", "A left of B on M1 with y-projection overlap.", ["same layer"], ["A–B"], {
        selected: "A",
        highlight: ["A", "B"],
      }),
      step("gap", "Gap", "Gap A→B equals 1 (x 10→11).", ["gap"], ["1"], { highlight: ["A", "B"], metricText: "gap=1" }),
      step("limit", "Limit", "min_space[M1]=2.", ["rule"], ["2"], { highlight: ["A", "B"], metricText: "limit=2" }),
      step("mark", "Marker", "Emit space marker on shapes A,B.", ["space"], ["marker"], {
        highlight: ["A", "B"],
        markers: matchSpace(STARTER, "M1"),
        metricText: "space marker",
      }),
      step("count", "Count", "GOLDEN: one M1 space marker.", ["GOLDEN"], [`n=${GOLDENS.spaceMarkers}`], {
        highlight: ["A", "B"],
        markers: matchSpace(STARTER, "M1"),
        metricText: "GOLDEN 1",
      }),
    ],
  },
  "single-layer-region": {
    title: "Single-layer region width",
    module: "module01-05-single-layer-region",
    kind: "pattern",
    steps: [
      step("d", "Thin D", "D width=1 height=6.", ["thin"], ["w=1"], { selected: "D", highlight: ["D"], metricText: "D w=1" }),
      step("mw", "Min width", "min_width[M1]=3.", ["rule"], ["3"], { selected: "D", highlight: ["D"], metricText: "limit=3" }),
      step("min", "Measure", "thin = min(w,h) = 1.", ["min"], ["1"], { selected: "D", highlight: ["D"], metricText: "thin=1" }),
      step("mark", "Marker", "Emit width marker on D.", ["width"], ["D"], {
        selected: "D",
        highlight: ["D"],
        markers: matchWidth(STARTER),
        metricText: "width marker",
      }),
      step("ok", "Others", "A,B,C,V pass their layer min_width.", ["pass"], ["GOLDEN 1"], {
        highlight: ["A", "B", "C", "V"],
        markers: matchWidth(STARTER),
      }),
    ],
  },
  "scanline-sweep": {
    title: "Scanline sweep",
    module: "module02-01-scanline-sweep",
    kind: "pattern",
    steps: [
      step("enter", "Enter", "Enter event at shape x0.", ["enter"], ["x0"], { selected: "A", highlight: ["A"], metricText: "enter x0" }),
      step("leave", "Leave", "Leave event at shape x1.", ["leave"], ["x1"], { selected: "A", highlight: ["A"], metricText: "leave x1" }),
      step("sort", "Sort", "Sort by x; enters before leaves at same x.", ["order"], ["sorted"], {
        highlight: ["A", "B", "D"],
        metricText: "sorted",
      }),
      step("n", "M1 count", "GOLDEN: 6 events on M1.", ["events"], [`n=${GOLDENS.scanEventsM1}`], {
        highlight: ["A", "B", "D"],
        metricText: `events=${scanlineEvents(STARTER, "M1").length}`,
      }),
      step("use", "Use", "Active set between events drives pair checks.", ["sweep"], ["active"], {
        highlight: ["A", "B"],
        metricText: "sweep",
      }),
    ],
  },
  "marker-emit": {
    title: "Marker emit",
    module: "module02-03-marker-emit",
    kind: "pattern",
    steps: [
      step("types", "Types", "Markers carry type, layer, shapes, value, limit.", ["schema"], ["typed"], {}),
      step("w", "Width hit", "Width marker on D.", ["width"], ["D"], {
        selected: "D",
        highlight: ["D"],
        markers: matchWidth(STARTER),
      }),
      step("s", "Space hit", "Space marker on A,B.", ["space"], ["A,B"], {
        highlight: ["A", "B"],
        markers: matchSpace(STARTER, "M1"),
      }),
      step("list", "List", "emit_markers returns the combined list.", ["emit"], ["union"], {
        highlight: ["A", "B", "D"],
        markers: emitMarkers(STARTER),
        metricText: `n=${emitMarkers(STARTER).length}`,
      }),
      step("n", "Count", "At least 2 single-layer markers.", ["≥2"], ["GOLDEN"], {
        markers: emitMarkers(STARTER),
        metricText: "n≥2",
      }),
    ],
  },
  "multi-layer-via": {
    title: "Multi-layer via enclosure",
    module: "module03-01-multi-layer-via",
    kind: "pattern",
    steps: [
      step("v", "Via V", "V is 2×2 on VIA inside A.", ["via"], ["2×2"], { selected: "V", highlight: ["V", "A"] }),
      step("m1", "M1 OK", "Enclosed by A with margin ≥1.", ["encl"], ["m1_ok"], {
        selected: "V",
        highlight: ["V", "A"],
        metricText: "m1_ok",
      }),
      step("m2", "M2 fail", "C does not contain V.", ["fail"], ["M2"], { selected: "V", highlight: ["V", "C"], metricText: "m2 fail" }),
      step("mark", "Marker", "One enclosure marker (VIA vs M2).", ["marker"], ["1"], (() => {
        const r = multiLayerViaCheck(STARTER);
        return { selected: "V", highlight: ["V"], markers: r.markers, metricText: "encl marker" };
      })()),
      step("api", "API", "multi_layer_via_check reports m1_ok / m2_ok.", ["API"], [`E=${GOLDENS.enclosureMarkers}`], (() => {
        const r = multiLayerViaCheck(STARTER);
        return { selected: "V", highlight: ["V"], markers: r.markers, metricText: `m1=${r.m1_ok} m2=${r.m2_ok}` };
      })()),
    ],
  },
  "multi-layer-interaction": {
    title: "Multi-layer interactions",
    module: "module03-03-multi-layer-interaction",
    kind: "pattern",
    steps: [
      step("cross", "Cross", "Only different-layer pairs qualify.", ["cross"], ["≠layer"], { highlight: ["A", "V"] }),
      step("ov", "Overlap", "Axis-aligned rectangle overlap test.", ["AABB"], ["overlap"], { selected: "V", highlight: ["A", "V"] }),
      step("av", "AV", "Pair A–V is present.", ["A–V"], ["yes"], { selected: "A", highlight: ["A", "V"], metricText: "A-V" }),
      step("list", "List", "multi_layer_interactions returns pairs.", ["list"], [`n=${multiLayerInteractions(STARTER).length}`], {
        highlight: ["A", "V"],
        metricText: `pairs=${multiLayerInteractions(STARTER).length}`,
      }),
      step("use", "Use", "Interactions feed enclosure and boolean patterns.", ["next"], ["boolean"], {
        highlight: ["A", "V", "C"],
      }),
    ],
  },
  "layered-boolean": {
    title: "Layered boolean",
    module: "module03-05-layered-boolean",
    kind: "pattern",
    steps: [
      step("m1", "Cover M1", "V is covered (contained) by M1 A.", ["cover"], ["M1"], { selected: "V", highlight: ["V", "A"] }),
      step("m2", "Cover M2", "V is not covered by M2 C.", ["¬M2"], ["false"], { selected: "V", highlight: ["V", "C"] }),
      step("andnot", "And-not", "and_not = M1 ∧ ¬M2 matches V.", ["and_not"], ["hit"], {
        selected: "V",
        highlight: ["V"],
        markers: layeredBoolean(STARTER, "and_not").map((h) => ({ type: "boolean", shapes: [h.shape] })),
        metricText: "and_not",
      }),
      step("and", "And", "and = M1 ∧ M2 matches none on the toy.", ["and"], ["∅"], { selected: "V", highlight: ["V"], metricText: "and=∅" }),
      step("hit", "Hit", "GOLDEN: one and_not hit on V.", ["GOLDEN"], [`n=${GOLDENS.booleanAndHits}`], {
        selected: "V",
        highlight: ["V"],
        markers: layeredBoolean(STARTER, "and_not").map((h) => ({ type: "boolean", shapes: [h.shape] })),
        metricText: "GOLDEN 1",
      }),
    ],
  },
  "match-engine": {
    title: "Match engine",
    module: "module04-01-match-engine",
    kind: "pattern",
    steps: [
      step("pipe", "Pipeline", "Width → space → via enclosure.", ["pipe"], ["3 stages"], {}),
      step("w", "Width", "One width marker.", ["W"], ["1"], {
        selected: "D",
        highlight: ["D"],
        markers: matchWidth(STARTER),
        metricText: "W=1",
      }),
      step("s", "Space", "One space marker.", ["S"], ["1"], {
        highlight: ["A", "B"],
        markers: matchSpace(STARTER, "M1"),
        metricText: "S=1",
      }),
      step("e", "Encl", "One enclosure marker.", ["E"], ["1"], (() => {
        const r = multiLayerViaCheck(STARTER);
        return { selected: "V", highlight: ["V"], markers: r.markers, metricText: "E=1" };
      })()),
      step("n", "Total", "count=3 on tiny_patterns.", ["GOLDEN"], [`n=${GOLDENS.matchEngineMarkers}`], (() => {
        const eng = matchEngine(STARTER);
        return {
          highlight: ["A", "B", "D", "V"],
          markers: eng.markers,
          metricText: `GOLDEN ${eng.count}`,
        };
      })()),
    ],
  },
};
