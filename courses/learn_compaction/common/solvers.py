"""Layout compaction solvers — constraint-graph literacy (Track A)."""
from __future__ import annotations

from copy import deepcopy
from typing import Any, Dict, List, Literal, Mapping, MutableMapping, Optional, Sequence, Tuple

from compactutil import bbox, clone, object_area, objects, span, width, height

Axis = Literal["x", "y"]
ConstraintEdge = Tuple[str, str, int]  # dst >= src + weight


def layout_stats(data: Mapping[str, Any]) -> dict[str, Any]:
    """Bounding box, span, and whitespace / area proxy for the layout."""
    objs = objects(data)
    bb = bbox(objs)
    w, h = span(bb)
    chip = data.get("chip", {})
    chip_w = int(chip.get("x1", bb["x1"])) - int(chip.get("x0", bb["x0"]))
    chip_h = int(chip.get("y1", bb["y1"])) - int(chip.get("y0", bb["y0"]))
    chip_area = max(chip_w * chip_h, 1)
    obj_area = object_area(objs)
    return {
        "bbox": bb,
        "width": w,
        "height": h,
        "chip_width": chip_w,
        "chip_height": chip_h,
        "object_area": obj_area,
        "whitespace": chip_area - obj_area,
        "object_count": len(objs),
    }


def _edge_nodes(obj_id: str, axis: Axis) -> tuple[str, str]:
    if axis == "x":
        return f"L_{obj_id}", f"R_{obj_id}"
    return f"B_{obj_id}", f"T_{obj_id}"


def _interval(obj: Mapping[str, Any], axis: Axis) -> tuple[int, int]:
    if axis == "x":
        return int(obj["x0"]), int(obj["x1"])
    return int(obj["y0"]), int(obj["y1"])


def _projects_overlap(a: Mapping[str, Any], b: Mapping[str, Any], axis: Axis) -> bool:
    """Overlap on the orthogonal axis (needed for spacing constraints)."""
    if axis == "x":
        return int(a["y0"]) < int(b["y1"]) and int(b["y0"]) < int(a["y1"])
    return int(a["x0"]) < int(b["x1"]) and int(b["x0"]) < int(a["x1"])


def build_constraint_graph(data: Mapping[str, Any], axis: Axis = "x") -> dict[str, Any]:
    """
    Build a constraint graph: nodes are left/right (or bottom/top) edges;
    edges mean dst >= src + gap (longest-path compaction form).
    """
    objs = [o for o in objects(data) if o.get("kind") != "wire" or axis == "x"]
    gap = int(data.get("min_gap", 1))
    edges: List[ConstraintEdge] = []
    nodes: set[str] = set()

    for o in objs:
        lo, hi = _edge_nodes(o["id"], axis)
        nodes.add(lo)
        nodes.add(hi)
        size = width(o) if axis == "x" else height(o)
        if size <= 0:
            size = 1
        edges.append((hi, lo, size))

    ordered = sorted(objs, key=lambda o: _interval(o, axis)[0])
    for i, left in enumerate(ordered):
        for right in ordered[i + 1 :]:
            if not _projects_overlap(left, right, axis):
                continue
            lo_l, hi_l = _edge_nodes(left["id"], axis)
            lo_r, _hi_r = _edge_nodes(right["id"], axis)
            if _interval(left, axis)[1] <= _interval(right, axis)[0]:
                edges.append((lo_r, hi_l, gap))
            elif _interval(right, axis)[1] <= _interval(left, axis)[0]:
                edges.append((lo_l, _edge_nodes(right["id"], axis)[1], gap))
            break

    chip = data.get("chip")
    if chip:
        anchor = "SRC_X" if axis == "x" else "SRC_Y"
        nodes.add(anchor)
        for o in objs:
            lo, _hi = _edge_nodes(o["id"], axis)
            edges.append((lo, anchor, 0))

    return {"axis": axis, "nodes": sorted(nodes), "edges": edges, "min_gap": gap}


def longest_path_compact(graph: Mapping[str, Any]) -> dict[str, float]:
    """Place each node at longest-path distance from source nodes (classic 1-D compaction)."""
    nodes: List[str] = list(graph["nodes"])
    edges: List[ConstraintEdge] = [(e[0], e[1], int(e[2])) for e in graph["edges"]]
    pos: dict[str, float] = {n: 0.0 for n in nodes}
    sources = [n for n in nodes if n.startswith("SRC_")]

    for _ in range(len(edges) + len(nodes) + 1):
        changed = False
        for dst, src, w in edges:
            cand = pos.get(src, 0.0) + w
            if cand > pos.get(dst, 0.0) + 1e-12:
                pos[dst] = cand
                changed = True
        if not changed:
            break

    for s in sources:
        pos[s] = 0.0
    return pos


def _apply_axis_positions(data: MutableMapping[str, Any], axis: Axis, positions: Mapping[str, float]) -> None:
    for o in data["objects"]:
        lo, hi = _edge_nodes(o["id"], axis)
        if lo not in positions or hi not in positions:
            continue
        lo_v, hi_v = int(round(positions[lo])), int(round(positions[hi]))
        if axis == "x":
            o["x0"], o["x1"] = lo_v, hi_v
        else:
            o["y0"], o["y1"] = lo_v, hi_v


def compact_1d(layout: Mapping[str, Any], axis: Axis = "x") -> dict[str, Any]:
    """Apply longest-path compaction along one axis."""
    data = clone(layout)
    before = layout_stats(data)
    graph = build_constraint_graph(data, axis)
    positions = longest_path_compact(graph)
    _apply_axis_positions(data, axis, positions)
    after = layout_stats(data)
    key = "width" if axis == "x" else "height"
    return {
        "layout": data,
        "axis": axis,
        "graph": graph,
        "positions": positions,
        "constraint_count": len(graph["edges"]),
        "before_span": before[key],
        "after_span": after[key],
        "improved": after[key] < before[key],
    }


def compact_2d(layout: Mapping[str, Any], order: Tuple[Axis, Axis] = ("x", "y")) -> dict[str, Any]:
    """Compact along two axes sequentially; report span improvement."""
    data = clone(layout)
    init = layout_stats(data)
    steps: List[dict[str, Any]] = []
    for axis in order:
        graph = build_constraint_graph(data, axis)
        positions = longest_path_compact(graph)
        _apply_axis_positions(data, axis, positions)
        st = layout_stats(data)
        steps.append(
            {
                "axis": axis,
                "constraint_count": len(graph["edges"]),
                "width": st["width"],
                "height": st["height"],
            }
        )
    final = layout_stats(data)
    return {
        "layout": data,
        "order": order,
        "initial_width": init["width"],
        "initial_height": init["height"],
        "final_width": final["width"],
        "final_height": final["height"],
        "width_improved": final["width"] < init["width"],
        "height_improved": final["height"] < init["height"],
        "steps": steps,
    }


def _wire_endpoints(wire: Mapping[str, Any]) -> tuple[tuple[int, int], tuple[int, int]]:
    x0, y0, x1, y1 = int(wire["x0"]), int(wire["y0"]), int(wire["x1"]), int(wire["y1"])
    if y0 == y1:
        return (x0, y0), (x1, y1)
    if x0 == x1:
        return (x0, y0), (x1, y1)
    return (x0, y0), (x1, y1)


def add_jog(wire: MutableMapping[str, Any], jog_x: int, jog_y: int) -> MutableMapping[str, Any]:
    """Add a simple jog point so a wire can stretch during compaction (literacy API)."""
    w = dict(wire)
    (x0, y0), (x1, y1) = _wire_endpoints(w)
    w["jog"] = {"x": int(jog_x), "y": int(jog_y)}
    w["points"] = [{"x": x0, "y": y0}, {"x": int(jog_x), "y": int(jog_y)}, {"x": x1, "y": y1}]
    w["stretched"] = True
    return w


def stretch_wire_to_bbox(wire: MutableMapping[str, Any], bb: Mapping[str, int]) -> MutableMapping[str, Any]:
    """Stretch a horizontal wire span to match a target x extent (wire jog literacy)."""
    w = dict(wire)
    y = int(w.get("y0", w.get("y1", 0)))
    w["x0"] = int(bb["x0"])
    w["x1"] = int(bb["x1"])
    w["y0"] = y
    w["y1"] = y
    if "jog" in w:
        w["jog"]["x"] = (int(bb["x0"]) + int(bb["x1"])) // 2
    return w


def shear_channel_lite(
    layout: Mapping[str, Any],
    x_lo: int,
    x_hi: int,
    delta_y: int,
) -> dict[str, Any]:
    """Shift objects whose bbox intersects [x_lo,x_hi] by delta_y (channel shear lite)."""
    data = clone(layout)
    moved: List[str] = []
    for o in data["objects"]:
        if int(o["x1"]) <= x_lo or int(o["x0"]) >= x_hi:
            continue
        o["y0"] = int(o["y0"]) + delta_y
        o["y1"] = int(o["y1"]) + delta_y
        moved.append(o["id"])
    return {"layout": data, "moved": moved, "delta_y": delta_y, "channel": (x_lo, x_hi)}


def is_legal(layout: Mapping[str, Any], min_gap: Optional[int] = None) -> bool:
    """No overlap and min spacing between non-wire rects on both axes."""
    gap = int(min_gap if min_gap is not None else layout.get("min_gap", 1))
    rects = [o for o in objects(layout) if o.get("kind") != "wire"]
    for i, a in enumerate(rects):
        for b in rects[i + 1 :]:
            dx = max(0, max(int(a["x0"]) - int(b["x1"]), int(b["x0"]) - int(a["x1"])))
            dy = max(0, max(int(a["y0"]) - int(b["y1"]), int(b["y0"]) - int(a["y1"])))
            if dx == 0 and dy == 0:
                return False
            if dx == 0 and 0 < dy < gap:
                return False
            if dy == 0 and 0 < dx < gap:
                return False
    return True


def sequential_compact(layout: Mapping[str, Any]) -> dict[str, Any]:
    """Pipeline: X compact → Y compact → optional wire stretch → legality report."""
    data = clone(layout)
    init = layout_stats(data)
    x_pass = compact_1d(data, "x")
    data = x_pass["layout"]
    y_pass = compact_1d(data, "y")
    data = y_pass["layout"]

    wires = [o for o in data["objects"] if o.get("kind") == "wire"]
    if wires:
        bb = bbox([o for o in data["objects"] if o.get("kind") != "wire"])
        for i, w in enumerate(data["objects"]):
            if w.get("kind") == "wire":
                data["objects"][i] = stretch_wire_to_bbox(w, bb)

    final = layout_stats(data)
    legal = is_legal(data)
    return {
        "layout": data,
        "initial_width": init["width"],
        "initial_height": init["height"],
        "final_width": final["width"],
        "final_height": final["height"],
        "x_constraints": x_pass["constraint_count"],
        "y_constraints": y_pass["constraint_count"],
        "legal": legal,
        "improved": final["width"] < init["width"] or final["height"] < init["height"],
    }


def compaction_compare(layout: Mapping[str, Any]) -> dict[str, Any]:
    """Offline benchmark: initial vs sequential compact metrics."""
    init = layout_stats(layout)
    seq = sequential_compact(layout)
    return {
        "initial": init,
        "sequential": seq,
        "width_delta": init["width"] - seq["final_width"],
        "height_delta": init["height"] - seq["final_height"],
    }
