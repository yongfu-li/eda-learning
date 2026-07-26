/** Walkthrough packs for learn_multi_patterning (kind: multipattern). */
import {
  STARTER,
  CHIP,
  GOLDENS,
  cloneFeatures,
  buildConflictGraph,
  leleDouble,
  pathLele,
  triplePattern,
  quadPattern,
  sadpAssign,
  stitchFeature,
  mpEngine,
} from "../../assets/multi-patterning-core.js";

function step(id, title, caption, bullets, metrics, extra = {}) {
  return {
    id,
    title,
    caption,
    bullets,
    metrics,
    features: cloneFeatures(STARTER),
    chip: CHIP,
    ...extra,
  };
}

export const MULTI_PATTERN_ALGOS = {
  "conflict-graph": {
    title: "Conflict graph",
    module: "module01-01-conflict-graph",
    kind: "multipattern",
    steps: [
      step("feat", "Features", "Six features A–F on the toy.", ["A–F"], [`n=${GOLDENS.featureCount}`], {
        highlight: ["A", "B", "C", "D", "E", "F"],
        metricText: "n=6",
      }),
      step("min", "Min space", "min_same_mask=2.", ["rule"], ["2"], { metricText: "min=2" }),
      step("edges", "Edges", "Conflict if gap < 2 → 5 edges.", ["graph"], [`E=${GOLDENS.conflictEdges}`], (() => {
        const g = buildConflictGraph(STARTER);
        return { graph: g, metricText: `edges=${g.edgeCount}` };
      })()),
      step("tri", "Triangle", "A–B–C form a triangle.", ["odd"], ["ABC"], {
        highlight: ["A", "B", "C"],
        graph: buildConflictGraph(STARTER),
        metricText: "triangle",
      }),
      step("path", "Path", "D–E–F is a path.", ["bipartite piece"], ["DEF"], {
        highlight: ["D", "E", "F"],
        graph: buildConflictGraph(STARTER),
        metricText: "path",
      }),
    ],
  },
  "double-lele": {
    title: "Double LELE",
    module: "module01-03-double-lele",
    kind: "multipattern",
    steps: [
      step("idea", "LELE idea", "LELE DP = two masks via 2-coloring.", ["LELE"], ["2 masks"], {}),
      step("two", "Two masks", "Assign color 0/1 to features.", ["2-color"], ["0/1"], {}),
      step("try", "Color attempt", "BFS 2-color the conflict graph.", ["BFS"], ["attempt"], (() => {
        const r = leleDouble(STARTER);
        return { graph: r.graph, colors: r.colors, metricText: `ok=${r.ok}` };
      })()),
      step("odd", "Odd cycle", "Triangle A-B-C is an odd cycle.", ["odd"], ["fail"], {
        highlight: ["A", "B", "C"],
        graph: buildConflictGraph(STARTER),
      }),
      step("fail", "Fail", "GOLDEN: lele_double ok=False.", ["GOLDEN"], ["ok=false"], (() => {
        const r = leleDouble(STARTER);
        return { graph: r.graph, colors: r.colors, metricText: "DP fail" };
      })()),
    ],
  },
  "bipartite-check": {
    title: "Bipartite check",
    module: "module01-05-bipartite-check",
    kind: "multipattern",
    steps: [
      step("sub", "Subgraph", "Restrict to D–E–F.", ["subset"], ["DEF"], { highlight: ["D", "E", "F"] }),
      step("bfs", "BFS color", "2-color BFS on the path.", ["BFS"], ["bipartite"], {}),
      step("def", "Path DEF", "Path has no odd cycle.", ["path"], ["ok"], { highlight: ["D", "E", "F"] }),
      step("cols", "Colors 0/1", "Alternate colors along the path.", ["0/1"], ["alt"], (() => {
        const r = pathLele(STARTER);
        return { colors: r.colors, highlight: ["D", "E", "F"], metricText: "0/1" };
      })()),
      step("ok", "OK", "GOLDEN: path_lele ok=True.", ["GOLDEN"], ["ok"], (() => {
        const r = pathLele(STARTER);
        return { colors: r.colors, highlight: ["D", "E", "F"], metricText: `ok=${r.ok}` };
      })()),
    ],
  },
  "double-sadp": {
    title: "Double SADP",
    module: "module02-01-double-sadp",
    kind: "multipattern",
    steps: [
      step("man", "Mandrel", "SADP starts from mandrel features.", ["mandrel"], ["core"], {}),
      step("sp", "Spacer", "Neighbors can be spacer-defined.", ["spacer"], ["process"], {}),
      step("ind", "Independent set", "Mandrels form an independent set.", ["MIS"], ["no edge"], {}),
      step("asg", "Assign", "Greedy MIS → mandrels A,D,F.", ["greedy"], ["A,D,F"], (() => {
        const r = sadpAssign(STARTER);
        return { graph: r.graph, mandrels: r.mandrels, metricText: `m=${r.mandrelCount}` };
      })()),
      step("n", "Count 3", "GOLDEN mandrel_count=3.", ["GOLDEN"], [`n=${GOLDENS.sadpMandrelCount}`], (() => {
        const r = sadpAssign(STARTER);
        return { mandrels: r.mandrels, graph: r.graph, metricText: "mandrels=3" };
      })()),
    ],
  },
  "stitch-lite": {
    title: "Stitch lite",
    module: "module02-03-stitch-lite",
    kind: "multipattern",
    steps: [
      step("odd", "Odd cycle", "Triangle blocks DP.", ["odd"], ["ABC"], { highlight: ["A", "B", "C"] }),
      step("split", "Split C", "Replace C with C1 and C2.", ["stitch"], ["C→C1,C2"], {}),
      step("new", "New edges", "Conflict graph changes.", ["repair"], ["edges"], (() => {
        const r = stitchFeature(STARTER);
        return { features: r.features, graph: r.graph, metricText: `E=${r.edgeCount}` };
      })()),
      step("re", "Re-color", "2-color the stitched layout.", ["LELE"], ["retry"], (() => {
        const r = stitchFeature(STARTER);
        return { features: r.features, graph: r.graph, colors: r.colors, metricText: "recolor" };
      })()),
      step("ok", "DP OK", "GOLDEN stitch makes DP ok.", ["GOLDEN"], ["dp_ok"], (() => {
        const r = stitchFeature(STARTER);
        return { features: r.features, graph: r.graph, colors: r.colors, metricText: `dpOk=${r.dpOk}` };
      })()),
    ],
  },
  "triple-color": {
    title: "Triple color",
    module: "module03-01-triple-color",
    kind: "multipattern",
    steps: [
      step("need", "Need 3", "Triangle needs a third mask.", ["TP"], ["k=3"], { highlight: ["A", "B", "C"] }),
      step("bt", "Backtrack", "Search a valid 3-coloring.", ["BT"], ["complete"], {}),
      step("asg", "Assign", "Assign colors 1..3.", ["assign"], ["1..3"], (() => {
        const r = triplePattern(STARTER);
        return { graph: r.graph, colors: r.colors, metricText: "assign" };
      })()),
      step("used", "Used 3", "colors_used=3.", ["used"], ["3"], (() => {
        const r = triplePattern(STARTER);
        return { graph: r.graph, colors: r.colors, metricText: `used=${r.colorsUsed}` };
      })()),
      step("ok", "Success", "GOLDEN TP ok with 3 masks.", ["GOLDEN"], ["ok"], (() => {
        const r = triplePattern(STARTER);
        return { graph: r.graph, colors: r.colors, metricText: `ok=${r.ok}` };
      })()),
    ],
  },
  "triple-decomp": {
    title: "Triple decomp",
    module: "module03-03-triple-decomp",
    kind: "multipattern",
    steps: [
      step("g", "Greedy", "Greedy 3-color in id order.", ["greedy"], ["fast"], (() => {
        const r = triplePattern(STARTER, "greedy");
        return { graph: r.graph, colors: r.colors, metricText: `g used=${r.colorsUsed}` };
      })()),
      step("b", "Backtrack", "Backtrack finds a valid coloring.", ["BT"], ["exact"], (() => {
        const r = triplePattern(STARTER, "backtrack");
        return { graph: r.graph, colors: r.colors, metricText: `bt used=${r.colorsUsed}` };
      })()),
      step("same", "Same used", "Both use 3 on the toy.", ["parity"], ["3"], { metricText: "used=3" }),
      step("meth", "Methods", "Decomp literacy: greedy vs search.", ["methods"], ["tradeoff"], {}),
      step("ch", "Choose", "Prefer BT when greedy fails.", ["choose"], ["BT"], {}),
    ],
  },
  "quad-color": {
    title: "Quad color",
    module: "module03-05-quad-color",
    kind: "multipattern",
    steps: [
      step("four", "Four masks", "QP allows up to 4 masks.", ["QP"], ["k=4"], {}),
      step("gr", "Greedy", "Greedy 4-color the graph.", ["greedy"], ["k=4"], (() => {
        const r = quadPattern(STARTER);
        return { graph: r.graph, colors: r.colors, metricText: "greedy" };
      })()),
      step("u3", "Used 3", "Toy only needs 3 colors.", ["used"], ["3≤4"], (() => {
        const r = quadPattern(STARTER);
        return { graph: r.graph, colors: r.colors, metricText: `used=${r.colorsUsed}` };
      })()),
      step("head", "Headroom", "Extra mask is headroom.", ["slack"], ["mask4"], {}),
      step("ok", "OK", "GOLDEN qp ok colors_used=3.", ["GOLDEN"], ["ok"], (() => {
        const r = quadPattern(STARTER);
        return { graph: r.graph, colors: r.colors, metricText: `ok=${r.ok}` };
      })()),
    ],
  },
  "mp-engine": {
    title: "MP engine",
    module: "module04-01-mp-engine",
    kind: "multipattern",
    steps: [
      step("dp", "Try DP", "First try LELE double.", ["DP"], ["2"], {}),
      step("fail", "Fail", "DP fails on the triangle.", ["fail"], ["ok=false"], (() => {
        const e = mpEngine(STARTER);
        return { metricText: `dp=${e.dpOk}` };
      })()),
      step("tp", "Try TP", "Fall back to triple.", ["TP"], ["3"], (() => {
        const e = mpEngine(STARTER);
        return { colors: e.colors, metricText: `tp=${e.tpOk}` };
      })()),
      step("best", "Best 3", "best_masks=3.", ["best"], [`${GOLDENS.engineBestMasks}`], (() => {
        const e = mpEngine(STARTER);
        return { colors: e.colors, metricText: `best=${e.bestMasks}` };
      })()),
      step("rep", "Report", "Engine reports DP/TP/QP outcome.", ["report"], ["GOLDEN"], (() => {
        const e = mpEngine(STARTER);
        return { colors: e.colors, metricText: `best=${e.bestMasks}` };
      })()),
    ],
  },
};
