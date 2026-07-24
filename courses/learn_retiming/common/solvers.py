"""Retiming solvers — Leiserson–Saxe literacy (Track A)."""
from __future__ import annotations

from typing import Any, Dict, List, Mapping, MutableMapping, Optional, Sequence, Tuple

from retimeutil import edge_list, node_map, total_registers

Retime = Mapping[str, int]  # r(v)


def graph_stats(data: Mapping[str, Any]) -> dict[str, int]:
    return {
        "nodes": len(data["nodes"]),
        "edges": len(data["edges"]),
        "registers": total_registers(data["edges"]),
        "comb": sum(1 for n in data["nodes"] if n["kind"] == "comb"),
    }


def retime_edge_weight(edge: Mapping[str, Any], r: Retime) -> int:
    """w_r(e) = w(e) + r(dst) - r(src) for e: src→dst."""
    return int(edge["w"]) + int(r.get(edge["dst"], 0)) - int(r.get(edge["src"], 0))


def apply_retime(edges: Sequence[Mapping[str, Any]], r: Retime) -> List[dict[str, Any]]:
    out = []
    for e in edges:
        ne = dict(e)
        ne["w"] = retime_edge_weight(e, r)
        out.append(ne)
    return out


def is_legal(edges: Sequence[Mapping[str, Any]], r: Retime) -> bool:
    return all(retime_edge_weight(e, r) >= 0 for e in edges)


def forward_retime(node: str, r: MutableMapping[str, int], amount: int = 1) -> None:
    """Decrease r(node) by amount → registers move forward across node (toward outputs)."""
    r[node] = int(r.get(node, 0)) - amount


def backward_retime(node: str, r: MutableMapping[str, int], amount: int = 1) -> None:
    """Increase r(node) by amount → registers move backward across node (toward inputs)."""
    r[node] = int(r.get(node, 0)) + amount


def zero_retime(data: Mapping[str, Any]) -> dict[str, int]:
    return {n["id"]: 0 for n in data["nodes"]}


def path_comb_delay(
    data: Mapping[str, Any],
    path: Sequence[str],
    edges: Optional[Sequence[Mapping[str, Any]]] = None,
) -> float:
    """Sum of node delays on path, excluding PI/PO endpoints' contribution optionally counted."""
    nodes = node_map(data)
    total = 0.0
    for vid in path:
        total += float(nodes[vid]["delay"])
    return total


def longest_zero_weight_path_delay(
    data: Mapping[str, Any],
    edges: Sequence[Mapping[str, Any]],
) -> float:
    """
    Longest combinational path delay: paths that only traverse edges with w==0.
    DP on DAG (toy graphs are DAGs).
    """
    nodes = node_map(data)
    ids = [n["id"] for n in data["nodes"]]
    # adjacency for w==0 edges
    succ: dict[str, List[str]] = {i: [] for i in ids}
    for e in edges:
        if int(e["w"]) == 0:
            succ[e["src"]].append(e["dst"])

    # topo order (Kahn-ish via repeated peel — small)
    indeg = {i: 0 for i in ids}
    for u in ids:
        for v in succ[u]:
            indeg[v] += 1
    queue = [i for i in ids if indeg[i] == 0]
    order: List[str] = []
    indeg_mut = dict(indeg)
    while queue:
        u = queue.pop(0)
        order.append(u)
        for v in succ[u]:
            indeg_mut[v] -= 1
            if indeg_mut[v] == 0:
                queue.append(v)
    if len(order) < len(ids):
        # cycle among zero-weight — fall back to max node delay
        return max(float(nodes[i]["delay"]) for i in ids)

    best: dict[str, float] = {i: float(nodes[i]["delay"]) for i in ids}
    for u in order:
        for v in succ[u]:
            cand = best[u] + float(nodes[v]["delay"])
            if cand > best[v]:
                best[v] = cand
    return max(best.values()) if best else 0.0


def clock_period(data: Mapping[str, Any], r: Optional[Retime] = None) -> float:
    edges = edge_list(data)
    if r is not None:
        edges = apply_retime(edges, r)
    return longest_zero_weight_path_delay(data, edges)


def register_count(data: Mapping[str, Any], r: Optional[Retime] = None) -> int:
    edges = edge_list(data)
    if r is not None:
        edges = apply_retime(edges, r)
    return total_registers(edges)


def feas_check(data: Mapping[str, Any], period: float, r: Retime) -> bool:
    """Legal retiming and clock period ≤ target."""
    return is_legal(data["edges"], r) and clock_period(data, r) <= period + 1e-9


def min_period_binary_search(
    data: Mapping[str, Any],
    candidates: Optional[Sequence[Retime]] = None,
) -> dict[str, Any]:
    """
    Lite min-period: try a few retimings (including zero and hand-crafted)
    and pick legal one with smallest period. Not full WD/FEAS — literacy toy.
    """
    opts: List[Retime] = list(candidates or [])
    opts.append(zero_retime(data))
    # try forward across a, backward across c
    r1 = zero_retime(data)
    forward_retime("a", r1, 1)
    opts.append(dict(r1))
    r2 = zero_retime(data)
    backward_retime("c", r2, 1)
    opts.append(dict(r2))
    r3 = zero_retime(data)
    forward_retime("b", r3, 1)
    opts.append(dict(r3))

    best = None
    best_p = float("inf")
    for r in opts:
        if not is_legal(data["edges"], r):
            continue
        p = clock_period(data, r)
        if p < best_p - 1e-12:
            best_p = p
            best = dict(r)

    assert best is not None
    return {
        "r": best,
        "period": best_p,
        "registers": register_count(data, best),
        "baseline_period": clock_period(data, zero_retime(data)),
        "improved": best_p < clock_period(data, zero_retime(data)) - 1e-9,
    }


def sequential_retime(data: Mapping[str, Any], mode: str = "min_period") -> dict[str, Any]:
    stats = graph_stats(data)
    base_r = zero_retime(data)
    base_p = clock_period(data, base_r)
    if mode == "forward_a":
        r = zero_retime(data)
        forward_retime("a", r, 1)
        return {
            "mode": mode,
            "stats": stats,
            "r": r,
            "legal": is_legal(data["edges"], r),
            "period": clock_period(data, r),
            "registers": register_count(data, r),
            "baseline_period": base_p,
        }
    result = min_period_binary_search(data)
    return {"mode": mode, "stats": stats, **result, "legal": True}
