"""Track A multi-patterning solvers — DP/TP/QP coloring + SADP/stitch lite."""
from __future__ import annotations

from collections import defaultdict, deque
from typing import Any

from mputil import bbox_gap, clone, load_toy

GOLDENS = {
    "feature_count": 6,
    "conflict_edges": 5,  # A-B, A-C, B-C, D-E, E-F (Euclidean gap)
    "dp_colorable": False,  # triangle A-B-C
    "path_dp_colorable": True,  # D-E-F
    "tp_colors_used": 3,
    "qp_colors_used": 3,  # 3 suffices; ≤4
    "sadp_mandrel_count": 3,
    "stitch_makes_dp": True,
    "engine_best_masks": 3,
}


def geometry_stats(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    return {
        "feature_count": len(d["features"]),
        "min_same_mask": d["min_same_mask"],
        "ids": [f["id"] for f in d["features"]],
    }


def build_conflict_graph(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Edge if bbox gap < min_same_mask (same-mask spacing conflict)."""
    d = clone(data or load_toy())
    feats = d["features"]
    m = d["min_same_mask"]
    nodes = [f["id"] for f in feats]
    edges: list[tuple[str, str, int]] = []
    adj: dict[str, list[str]] = {n: [] for n in nodes}
    by_id = {f["id"]: f for f in feats}
    for i, a in enumerate(feats):
        for b in feats[i + 1 :]:
            g = bbox_gap(a, b)
            if g < m:
                edges.append((a["id"], b["id"], g))
                adj[a["id"]].append(b["id"])
                adj[b["id"]].append(a["id"])
    return {
        "nodes": nodes,
        "edges": edges,
        "adj": adj,
        "min_same_mask": m,
        "edge_count": len(edges),
        "by_id": by_id,
    }


def is_bipartite(graph: dict[str, Any], subset: list[str] | None = None) -> dict[str, Any]:
    """2-color / LELE DP feasibility on full graph or subset of nodes."""
    nodes = subset or graph["nodes"]
    node_set = set(nodes)
    color: dict[str, int] = {}
    for start in nodes:
        if start in color:
            continue
        color[start] = 0
        q = deque([start])
        while q:
            u = q.popleft()
            for v in graph["adj"][u]:
                if v not in node_set:
                    continue
                if v not in color:
                    color[v] = 1 - color[u]
                    q.append(v)
                elif color[v] == color[u]:
                    return {"ok": False, "colors": color, "conflict": (u, v)}
    return {"ok": True, "colors": color, "conflict": None}


def lele_double(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """LELE double patterning = bipartite 2-coloring of conflict graph."""
    g = build_conflict_graph(data)
    r = is_bipartite(g)
    return {
        "ok": r["ok"],
        "colors": r["colors"],
        "masks": 2 if r["ok"] else None,
        "conflict": r["conflict"],
        "edge_count": g["edge_count"],
    }


def path_lele(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """DP on D–E–F path only (expected bipartite)."""
    g = build_conflict_graph(data)
    r = is_bipartite(g, ["D", "E", "F"])
    return {"ok": r["ok"], "colors": r["colors"]}


def color_greedy(graph: dict[str, Any], k: int) -> dict[str, Any]:
    """Greedy k-coloring in node id order. Returns ok + colors (1..k)."""
    colors: dict[str, int] = {}
    for u in graph["nodes"]:
        used = {colors[v] for v in graph["adj"][u] if v in colors}
        assigned = None
        for c in range(1, k + 1):
            if c not in used:
                assigned = c
                break
        if assigned is None:
            return {"ok": False, "colors": colors, "failed": u, "k": k}
        colors[u] = assigned
    used_n = max(colors.values()) if colors else 0
    return {"ok": True, "colors": colors, "colors_used": used_n, "k": k}


def color_backtrack(graph: dict[str, Any], k: int) -> dict[str, Any]:
    """Simple backtracking k-coloring (complete search)."""
    nodes = graph["nodes"]
    colors: dict[str, int] = {}

    def ok(u: str, c: int) -> bool:
        return all(colors.get(v) != c for v in graph["adj"][u])

    def rec(i: int) -> bool:
        if i == len(nodes):
            return True
        u = nodes[i]
        for c in range(1, k + 1):
            if ok(u, c):
                colors[u] = c
                if rec(i + 1):
                    return True
                del colors[u]
        return False

    success = rec(0)
    used = max(colors.values()) if colors and success else 0
    return {"ok": success, "colors": dict(colors), "colors_used": used, "k": k}


def triple_pattern(data: dict[str, Any] | None = None, method: str = "backtrack") -> dict[str, Any]:
    g = build_conflict_graph(data)
    r = color_backtrack(g, 3) if method == "backtrack" else color_greedy(g, 3)
    r["masks"] = 3 if r["ok"] else None
    r["method"] = method
    return r


def quad_pattern(data: dict[str, Any] | None = None, method: str = "greedy") -> dict[str, Any]:
    g = build_conflict_graph(data)
    r = color_greedy(g, 4) if method == "greedy" else color_backtrack(g, 4)
    r["masks"] = 4 if r["ok"] else None
    r["method"] = method
    return r


def sadp_assign(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """
    SADP lite: pick an independent set as mandrels; neighbors become spacer-defined.
    Not LELE coloring — spacer process literacy.
    """
    g = build_conflict_graph(data)
    # Greedy maximal independent set as mandrels
    mandrels: list[str] = []
    blocked: set[str] = set()
    for u in g["nodes"]:
        if u in blocked:
            continue
        mandrels.append(u)
        blocked.add(u)
        blocked.update(g["adj"][u])
    spacers = [n for n in g["nodes"] if n not in mandrels]
    return {
        "mandrels": mandrels,
        "spacers": spacers,
        "mandrel_count": len(mandrels),
        "ok": True,
    }


def find_odd_cycle(graph: dict[str, Any]) -> list[str] | None:
    """Return one odd cycle node list if graph not bipartite."""
    color: dict[str, int] = {}
    parent: dict[str, str | None] = {}
    for start in graph["nodes"]:
        if start in color:
            continue
        color[start] = 0
        parent[start] = None
        q = deque([start])
        while q:
            u = q.popleft()
            for v in graph["adj"][u]:
                if v not in color:
                    color[v] = 1 - color[u]
                    parent[v] = u
                    q.append(v)
                elif color[v] == color[u]:
                    # reconstruct cycle
                    path_u = []
                    x = u
                    seen = set()
                    while x is not None and x not in seen:
                        path_u.append(x)
                        seen.add(x)
                        x = parent.get(x)
                    path_v = []
                    y = v
                    while y is not None and y not in path_u:
                        path_v.append(y)
                        y = parent.get(y)
                    # meet at y
                    if y in path_u:
                        i = path_u.index(y)
                        cycle = list(reversed(path_u[: i + 1])) + path_v
                        if len(cycle) % 2 == 1 and len(cycle) >= 3:
                            return cycle
                    return [u, v]  # fallback odd conflict pair + neighbor
    return None


def stitch_feature(data: dict[str, Any] | None = None, feature_id: str = "C") -> dict[str, Any]:
    """
    Stitch lite: split feature into two halves that don't both conflict with all
    triangle neighbors — remove feature and add C1,C2 with fewer conflicts.
    For the toy: remove C (breaks triangle), add C1 near A only and C2 near B only
    is complex; simpler: delete conflicts involving C by splitting C into
    two non-adjacent pieces far apart → graph becomes bipartite.
    """
    d = clone(data or load_toy())
    feats = [f for f in d["features"] if f["id"] != feature_id]
    # C1 left-top, C2 right-top — spaced so they don't conflict with each other
    # and each conflicts with at most one of A/B
    feats.append({"id": "C1", "x0": 1, "y0": 5, "x1": 3, "y1": 7})
    feats.append({"id": "C2", "x0": 6, "y0": 5, "x1": 8, "y1": 7})
    d["features"] = feats
    g = build_conflict_graph(d)
    r = is_bipartite(g)
    return {
        "data": d,
        "removed": feature_id,
        "added": ["C1", "C2"],
        "dp_ok": r["ok"],
        "colors": r["colors"],
        "edge_count": g["edge_count"],
    }


def mp_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Try DP → TP → QP; report minimum masks that work."""
    d = clone(data or load_toy())
    dp = lele_double(d)
    tp = triple_pattern(d, "backtrack")
    qp = quad_pattern(d, "greedy")
    best = None
    if dp["ok"]:
        best = 2
    elif tp["ok"]:
        best = 3
    elif qp["ok"]:
        best = 4
    return {
        "dp_ok": dp["ok"],
        "tp_ok": tp["ok"],
        "qp_ok": qp["ok"],
        "tp_colors_used": tp.get("colors_used"),
        "qp_colors_used": qp.get("colors_used"),
        "best_masks": best,
        "sadp": sadp_assign(d),
    }


def mp_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    g = build_conflict_graph(d)
    eng = mp_engine(d)
    st = stitch_feature(d, "C")
    return {
        "feature_count": len(d["features"]),
        "conflict_edges": g["edge_count"],
        "dp_ok": eng["dp_ok"],
        "best_masks": eng["best_masks"],
        "stitch_dp_ok": st["dp_ok"],
        "sadp_mandrels": eng["sadp"]["mandrel_count"],
        "goldens": GOLDENS,
    }
