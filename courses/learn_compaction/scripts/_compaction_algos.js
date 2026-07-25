import {
  STARTER,
  GOLDENS,
  CHIP,
  cloneObjects,
  layoutStats,
  buildConstraintGraph,
  compact1d,
  compact2d,
  sequentialCompact,
  addJog,
  shearChannelLite,
  isLegal,
} from "../../assets/compaction-core.js";

function step(id, title, caption, bullets, metrics, _p, extra = {}) {
  return {
    id,
    title,
    caption,
    bullets,
    metrics,
    objects: cloneObjects(STARTER),
    chip: CHIP,
    ...extra,
  };
}

export const COMPACTION_ALGOS = {
  "leaf-cells": {
    title: "Leaf cells",
    module: "module01-01-leaf-cells",
    kind: "compaction",
    steps: [
      step("obj", "Objects", "Four objects: cells A,B,C and wire W.", ["stick layout"], [`n=${GOLDENS.objectCount}`], null),
      step("a", "Cell A", "A sits at x0=0..4, y0=2..5.", ["cell"], ["left"], null, { highlight: ["A"], selected: "A" }),
      step("bc", "B and C", "B and C sit further right with gaps.", ["whitespace"], ["gaps"], null, { highlight: ["B", "C"] }),
      step("bbox", "BBox", "Union bbox width=20 height=6.", ["bbox"], [`W=${GOLDENS.initialWidth}`], null, {
        metricText: JSON.stringify(layoutStats(STARTER)),
      }),
      step("count", "Count", "GOLDENS: object_count=4.", ["stats"], ["4"], null),
    ],
  },
  "spacing-rules": {
    title: "Spacing",
    module: "module01-03-spacing-rules",
    kind: "compaction",
    steps: [
      step("gap", "Gap one", "GOLDEN min_gap = 1.", ["rule"], [`gap=${GOLDENS.minGap}`], null),
      step("legal", "Legal init", "Starter layout is_legal → True.", ["ok"], ["True"], null, {
        metricText: `legal=${isLegal(STARTER)}`,
      }),
      step("overlap", "Overlap fail", "Overlapping rects fail legality.", ["reject"], ["dx=dy=0"], null),
      step("proj", "Project", "Spacing applies when orthogonal projections overlap.", ["filter"], ["Y overlap for X gap"], null),
      step("why", "Why", "Constraints encode these gaps in the graph next.", ["next"], ["graph"], null),
    ],
  },
  "constraint-graph": {
    title: "Constraint graph",
    module: "module02-01-constraint-graph",
    kind: "compaction",
    steps: [
      step("nodes", "Nodes", "Left/right edge nodes per object.", ["L_/R_"], ["vars"], null),
      step("size", "Size", "R_id ≥ L_id + width(id).", ["size edge"], ["width"], null, { highlight: ["A"] }),
      step("space", "Spacing", "Next cell’s left ≥ previous right + gap.", ["gap edge"], ["min_gap"], null, { highlight: ["A", "B"] }),
      step("src", "Source", "SRC_X anchors the left of the chip.", ["anchor"], ["0"], null),
      step("count", "Count", "GOLDEN: about 10 constraint edges on X.", ["|E|"], [`≥${GOLDENS.xConstraintMin}`], null, (() => {
        const g = buildConstraintGraph(STARTER, "x");
        return { graph: g, metricText: `edges=${g.edges.length}` };
      })()),
    ],
  },
  "longest-path": {
    title: "Longest path",
    module: "module02-03-longest-path",
    kind: "compaction",
    steps: [
      step("src", "Source", "SRC_X at position 0.", ["origin"], ["0"], null),
      step("relax", "Relax", "Update dst ← max(dst, src + w).", ["Bellman-ish"], ["relax"], null),
      step("stable", "Stable", "Stop when no position increases.", ["fixpoint"], ["done"], null),
      step("pack", "Left pack", "Cells pack left under spacing.", ["compact"], ["toward SRC"], null),
      step("ready", "Ready", "Positions feed compact_1d next.", ["apply"], ["1-D"], null),
    ],
  },
  "compact-1d": {
    title: "1-D compact",
    module: "module02-05-compact-1d",
    kind: "compaction",
    steps: [
      step("before", "Before", "Initial X span = 20.", ["span"], [`${GOLDENS.initialWidth}`], null, {
        metricText: `W=${layoutStats(STARTER).width}`,
      }),
      step("run", "Run", "compact_1d(layout, 'x').", ["API"], ["X"], null),
      step("after", "After", "After X span = 14.", ["GOLDEN"], [`${GOLDENS.compactXWidth}`], null, (() => {
        const r = compact1d(STARTER, "x");
        return { objects: r.objects, metricText: `${r.beforeSpan}→${r.afterSpan}`, highlight: ["A", "B", "C"] };
      })()),
      step("gaps", "Gaps", "Whitespace between A–B–C shrinks to min_gap.", ["pack"], ["gap=1"], null, (() => {
        const r = compact1d(STARTER, "x");
        return { objects: r.objects };
      })()),
      step("y", "Y untouched", "Y coordinates unchanged in a pure X pass.", ["axis"], ["X only"], null),
    ],
  },
  "compact-2d": {
    title: "2-D compact",
    module: "module02-07-compact-2d",
    kind: "compaction",
    steps: [
      step("order", "Order", "Default order is X then Y.", ["axes"], ["x,y"], null),
      step("xstep", "X step", "First step shrinks width.", ["pass 1"], ["X"], null),
      step("ystep", "Y step", "Second step rebuilds Y constraints.", ["pass 2"], ["Y"], null),
      step("final", "Final", "final_width=14 on the toy.", ["GOLDEN"], ["14"], null, (() => {
        const r = compact2d(STARTER);
        return { objects: r.objects, metricText: `${r.initialWidth}→${r.finalWidth}` };
      })()),
      step("trade", "Trade", "Axis order can change results in richer layouts.", ["order"], ["literacy"], null),
    ],
  },
  "wire-jogs": {
    title: "Wire jogs",
    module: "module03-01-wire-jogs",
    kind: "compaction",
    steps: [
      step("w", "Wire W", "W is horizontal at y=7 spanning x=4..16.", ["wire"], ["M1"], null, { highlight: ["W"], selected: "W" }),
      step("jog", "Jog", "add_jog records a bend point.", ["bend"], ["polyline"], null, (() => {
        const objs = cloneObjects(STARTER).map((o) => (o.id === "W" ? addJog(o, 10, 8) : o));
        return { objects: objs, highlight: ["W"] };
      })()),
      step("stretch", "Stretch", "After compact, stretch W to cell bbox.", ["retarget"], ["x0/x1"], null),
      step("pts", "Points", "points list holds polyline vertices.", ["geometry"], ["3 pts"], null),
      step("why", "Why", "Without jogs, wires disconnect from moving pins.", ["connectivity"], ["need bend"], null),
    ],
  },
  "shear-lite": {
    title: "Shear",
    module: "module03-03-shear-lite",
    kind: "compaction",
    steps: [
      step("ch", "Channel", "Pick an X band covering B.", ["band"], ["7..13"], null, { highlight: ["B"] }),
      step("dy", "Delta", "Apply delta_y to intersecting objects.", ["shift Y"], ["+1"], null),
      step("moved", "Moved", "Report which ids moved.", ["ids"], ["B…"], null, (() => {
        const r = shearChannelLite(STARTER, 7, 13, 1);
        return { objects: r.objects, metricText: `moved=${r.moved.join(",")}`, highlight: r.moved };
      })()),
      step("legal", "Legal check", "Re-check spacing after shear.", ["is_legal"], ["gate"], null),
      step("use", "Use", "Shear is a local cleanup before another compact pass.", ["iterate"], ["next seq"], null),
    ],
  },
  "sequential-compact": {
    title: "Sequential",
    module: "module03-05-sequential-compact",
    kind: "compaction",
    steps: [
      step("pipe", "Pipeline", "X compact then Y compact then wire stretch.", ["seq"], ["full pass"], null),
      step("width", "Width", "final_width=14.", ["GOLDEN"], ["14"], null, (() => {
        const r = sequentialCompact(STARTER);
        return { objects: r.objects, metricText: `${r.initialWidth}→${r.finalWidth}` };
      })()),
      step("legal", "Legal", "legal flag True on the toy.", ["ok"], ["True"], null, (() => {
        const r = sequentialCompact(STARTER);
        return { objects: r.objects, metricText: `legal=${r.legal}` };
      })()),
      step("imp", "Improved", "improved True vs initial span.", ["delta"], ["yes"], null),
      step("done", "Done", "Next: offline compare, then wrap.", ["pattern matching"], ["Wrap"], null),
    ],
  },
};
