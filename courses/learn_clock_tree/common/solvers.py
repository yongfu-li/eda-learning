"""Clock tree synthesis solvers (Track A)."""
from __future__ import annotations

from typing import Any, Dict, List, Mapping, MutableMapping, Optional, Sequence, Tuple

from ctsutil import _xy, chip_bbox, manhattan, normalize_edge, sink_points

Point = Tuple[float, float]
Edge = Tuple[Point, Point]


def latency(path: Sequence[Point], wire_delay: float = 1.0) -> float:
    total = 0.0
    for i in range(len(path) - 1):
        total += manhattan(path[i], path[i + 1]) * wire_delay
    return total


def skew(latencies: Mapping[str, float] | Sequence[float]) -> float:
    vals = list(latencies.values()) if isinstance(latencies, Mapping) else list(latencies)
    if not vals:
        return 0.0
    return max(vals) - min(vals)


def _pt(p: Point | Mapping[str, float]) -> Point:
    if isinstance(p, (tuple, list)):
        return (float(p[0]), float(p[1]))
    return (float(p["x"]), float(p["y"]))


def _mean(points: Sequence[Mapping[str, float]]) -> Point:
    if not points:
        return (0.0, 0.0)
    sx = sum(float(p["x"]) for p in points)
    sy = sum(float(p["y"]) for p in points)
    n = len(points)
    return (sx / n, sy / n)


def h_tree(source: Mapping[str, float], bbox: Mapping[str, float]) -> dict[str, Any]:
    """Recursive H segments covering chip quadrants from clock source."""
    sx, sy = _pt(source)
    if "W" in bbox and "H" in bbox:
        xmin, ymin, xmax, ymax = 0.0, 0.0, float(bbox["W"]), float(bbox["H"])
    else:
        xmin = float(bbox.get("xmin", 0.0))
        ymin = float(bbox.get("ymin", 0.0))
        xmax = float(bbox.get("xmax", bbox.get("W", 12.0)))
        ymax = float(bbox.get("ymax", bbox.get("H", 8.0)))

    edges: List[Edge] = []

    def add(a: Point, b: Point) -> None:
        edges.append(normalize_edge(a, b))

    def recurse(x0: float, y0: float, x1: float, y1: float, depth: int) -> None:
        if depth <= 0 or (x1 - x0) < 1.0 or (y1 - y0) < 1.0:
            return
        mx = (x0 + x1) / 2.0
        my = (y0 + y1) / 2.0
        add((mx, y0), (mx, y1))
        add((x0, my), (x1, my))
        recurse(x0, y0, mx, my, depth - 1)
        recurse(mx, y0, x1, my, depth - 1)
        recurse(x0, my, mx, y1, depth - 1)
        recurse(mx, my, x1, y1, depth - 1)

    add((sx, ymin), (sx, ymax))
    add((xmin, sy), (xmax, sy))
    recurse(xmin, ymin, xmax, ymax, depth=2)
    uniq: dict[Edge, None] = {}
    for e in edges:
        uniq[e] = None
    return {"edges": list(uniq.keys()), "source": (sx, sy), "kind": "h_tree"}


def zero_skew_merge(a: Point, b: Point, da: float, db: float) -> Point:
    """DME lite: merge point balancing da + dist(a,p) and db + dist(b,p) (Manhattan)."""
    ax, ay = _pt(a)
    bx, by = _pt(b)
    if ay == by:
        x = (da - db + ax + bx) / 2.0
        x = max(min(ax, bx), min(max(ax, bx), x))
        return (x, ay)
    if ax == bx:
        y = (da - db + ay + by) / 2.0
        y = max(min(ay, by), min(max(ay, by), y))
        return (ax, y)
    # HV elbow from a: horizontal then vertical toward b
    x = (da - db + ax + bx) / 2.0
    x = max(min(ax, bx), min(max(ax, bx), x))
    da_h = da + abs(x - ax)
    db_h = db + abs(bx - x) + abs(by - ay)
    if abs(da_h - db_h) <= 1e-6:
        return (x, ay)
    # VH elbow from a
    y = (da - db + ay + by) / 2.0
    y = max(min(ay, by), min(max(ay, by), y))
    da_v = da + abs(by - ay) + abs(bx - ax)
    db_v = db + abs(y - ay)
    if abs(da_v - db_v) < abs(da_h - db_h):
        return (ax, y)
    return (x, ay)


def mmm_tree(source: Mapping[str, float], sinks: Sequence[Mapping[str, float]]) -> dict[str, Any]:
    """Method of Means and Medians: median split alternating x/y, connect cluster means."""
    src = _pt(source)
    edges: List[Edge] = []
    taps: List[dict[str, float]] = []

    def attach(parent: Point, child: Point) -> None:
        if parent != child:
            edges.append(normalize_edge(parent, child))

    def build(pts: Sequence[Mapping[str, float]], parent: Point, depth: int) -> Point:
        if not pts:
            return parent
        if len(pts) == 1:
            leaf = _pt(pts[0])
            attach(parent, leaf)
            return leaf

        axis = "x" if depth % 2 == 0 else "y"
        key = lambda p: float(p[axis])
        ordered = sorted(pts, key=key)
        med = key(ordered[len(ordered) // 2])
        left = [p for p in pts if key(p) <= med]
        right = [p for p in pts if key(p) > med]
        if not left:
            left, right = [ordered[0]], ordered[1:]
        if not right:
            left, right = ordered[:-1], [ordered[-1]]

        mean_l = _mean(left)
        mean_r = _mean(right)
        tap = zero_skew_merge(mean_l, mean_r, 0.0, 0.0)
        taps.append({"x": tap[0], "y": tap[1]})
        attach(parent, tap)
        build(left, tap, depth + 1)
        build(right, tap, depth + 1)
        return tap

    build(list(sinks), src, 0)
    return {"edges": edges, "taps": taps, "source": src, "kind": "mmm"}


def tapping_points(tree: Mapping[str, Any]) -> List[Point]:
    """Internal Steiner / branch points (not source or leaf-only endpoints)."""
    edges = tree.get("edges", [])
    if not edges:
        return []
    degree: MutableMapping[Point, int] = {}
    for a, b in edges:
        pa, pb = _pt(a), _pt(b)
        degree[pa] = degree.get(pa, 0) + 1
        degree[pb] = degree.get(pb, 0) + 1
    taps = tree.get("taps") or []
    tap_set = {_pt(t) for t in taps}
    internal = [p for p, d in degree.items() if d >= 2]
    out = list(dict.fromkeys(internal + list(tap_set)))
    src = tree.get("source")
    if src is not None:
        sp = _pt(src)
        out = [p for p in out if p != sp]
    return out


def _manhattan_path(a: Point, b: Point) -> List[Point]:
    ax, ay = a
    bx, by = b
    if ax == bx or ay == by:
        return [a, b]
    return [a, (bx, ay), b]


def insert_buffers(
    edge: Edge,
    max_span: float,
    buffer_delay: float,
) -> Tuple[List[Edge], List[dict[str, Any]]]:
    """Split a long Manhattan edge with buffer sites every max_span wire units."""
    a, b = _pt(edge[0]), _pt(edge[1])
    path = _manhattan_path(a, b)
    sub_edges: List[Edge] = []
    buffers: List[dict[str, Any]] = []
    for i in range(len(path) - 1):
        p0, p1 = path[i], path[i + 1]
        seg_len = manhattan(p0, p1)
        if seg_len <= max_span or seg_len <= 1e-9:
            sub_edges.append(normalize_edge(p0, p1))
            continue
        steps = int(seg_len // max_span)
        if seg_len % max_span > 1e-9:
            steps += 1
        dx = (p1[0] - p0[0]) / steps
        dy = (p1[1] - p0[1]) / steps
        prev = p0
        for s in range(1, steps + 1):
            nxt = (p0[0] + dx * s, p0[1] + dy * s) if s < steps else p1
            sub_edges.append(normalize_edge(prev, nxt))
            if s < steps:
                buffers.append({"x": nxt[0], "y": nxt[1], "delay": buffer_delay})
            prev = nxt
    return sub_edges, buffers


def _build_adj(edges: Sequence[Edge]) -> dict[Point, List[Point]]:
    adj: dict[Point, List[Point]] = {}
    for a, b in edges:
        pa, pb = _pt(a), _pt(b)
        adj.setdefault(pa, []).append(pb)
        adj.setdefault(pb, []).append(pa)
    return adj


def _path_latency(
    path: Sequence[Point],
    wire_d: float,
    buffer_at: Mapping[Point, float],
) -> float:
    total = 0.0
    for i in range(len(path) - 1):
        total += manhattan(path[i], path[i + 1]) * wire_d
        total += buffer_at.get(path[i + 1], 0.0)
    return total


def _shortest_path_tree(adj: Mapping[Point, Sequence[Point]], root: Point) -> dict[Point, Optional[Point]]:
    parent: dict[Point, Optional[Point]] = {root: None}
    stack = [root]
    while stack:
        cur = stack.pop()
        for nb in adj.get(cur, []):
            if nb not in parent:
                parent[nb] = cur
                stack.append(nb)
    return parent


def buffered_latencies(
    tree: Mapping[str, Any],
    buffers: Sequence[Mapping[str, Any]],
    wire_d: float,
    buf_d: float,
    sinks: Sequence[Mapping[str, float]],
) -> dict[str, float]:
    edges = tree.get("edges", [])
    src = _pt(tree.get("source", (0.0, 0.0)))
    adj = _build_adj(edges)
    parent = _shortest_path_tree(adj, src)
    buffer_at: dict[Point, float] = {}
    for b in buffers:
        p = _pt(b)
        buffer_at[p] = buffer_at.get(p, 0.0) + float(b.get("delay", buf_d))

    sink_map = {_pt(s): s["id"] for s in sinks}
    out: dict[str, float] = {}
    for sp, sid in sink_map.items():
        if sp not in parent:
            continue
        path: List[Point] = []
        cur: Optional[Point] = sp
        while cur is not None:
            path.append(cur)
            cur = parent.get(cur)
        path.reverse()
        out[sid] = _path_latency(path, wire_d, buffer_at)
    return out


def skew_bound_ok(latencies: Mapping[str, float], bound: float) -> bool:
    return skew(latencies) <= bound + 1e-9


def _buffer_long_edges(
    tree: dict[str, Any],
    max_span: float,
    buffer_delay: float,
) -> Tuple[List[Edge], List[dict[str, Any]]]:
    all_edges: List[Edge] = []
    all_buffers: List[dict[str, Any]] = []
    for edge in tree.get("edges", []):
        segs, bufs = insert_buffers(edge, max_span, buffer_delay)
        all_edges.extend(segs)
        all_buffers.extend(bufs)
    uniq: dict[Edge, None] = {}
    for e in all_edges:
        uniq[e] = None
    return list(uniq.keys()), all_buffers


def sequential_cts(data: Mapping[str, Any], mode: str = "mmm") -> dict[str, Any]:
    """Full CTS pass: topology, optional buffering, per-sink latencies and skew."""
    source = data["clock_source"]
    sinks = sink_points(data["placement"], data["sinks"])
    wire_d = float(data.get("wire_delay_per_unit", 1.0))
    buf_d = float(data.get("buffer_delay", 2.0))
    target = float(data.get("target_skew", 4.0))
    max_span = float(data.get("max_wire_span", 4.0))
    do_buffer = bool(data.get("insert_buffers", mode == "buffered"))

    if mode in ("h_tree", "buffered_h"):
        tree = h_tree(source, data.get("chip", chip_bbox(data.get("chip", {"W": 12, "H": 8}))))
        # Attach each sink to nearest H-tree vertex so latencies are defined.
        verts: List[Point] = []
        for a, b in tree["edges"]:
            verts.extend([_pt(a), _pt(b)])
        verts.append(_pt(source))
        attach_edges: List[Edge] = []
        for s in sinks:
            sp = _pt(s)
            nearest = min(verts, key=lambda v: manhattan(v, sp))
            if nearest != sp:
                attach_edges.append(normalize_edge(nearest, sp))
        tree = dict(tree)
        tree["edges"] = list(tree["edges"]) + attach_edges
    elif mode in ("mmm", "buffered"):
        tree = mmm_tree(source, sinks)
    else:
        raise ValueError(f"unknown mode: {mode}")

    buffers: List[dict[str, Any]] = []
    tree_out = dict(tree)
    if do_buffer or mode.startswith("buffered"):
        edges, buffers = _buffer_long_edges(tree, max_span, buf_d)
        tree_out["edges"] = edges

    latencies = buffered_latencies(tree_out, buffers, wire_d, buf_d, sinks)
    sk = skew(latencies)

    return {
        "tree": tree_out,
        "buffers": buffers,
        "latencies": latencies,
        "skew": sk,
        "skew_ok": skew_bound_ok(latencies, target),
        "mode": mode,
    }


def cts_from_data(data: Mapping[str, Any], mode: str = "mmm") -> dict[str, Any]:
    return sequential_cts(data, mode=mode)
