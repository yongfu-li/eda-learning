"""Logic synthesis solvers — AIG, rewrite, cuts, techmap (Track A)."""
from __future__ import annotations

from typing import Any, Dict, List, Mapping, Optional, Sequence, Set, Tuple

from synthutil import and_nodes, fanin_pairs, load, node_by_id, primary_inputs, strash_key

Lit = Tuple[int, bool]
Cut = frozenset  # set of PI/node ids in leaves


def aig_stats(data: Mapping[str, Any]) -> dict[str, int]:
    nodes = data["aig"]["nodes"]
    return {
        "pi": sum(1 for n in nodes if n["type"] == "pi"),
        "and": sum(1 for n in nodes if n["type"] == "and"),
        "po": sum(1 for n in nodes if n.get("po")),
        "total": len(nodes),
    }


def eval_aig(data: Mapping[str, Any], assignment: Mapping[str, int]) -> dict[str, int]:
    """Evaluate AIG under 0/1 PI assignment; return node id → value."""
    by_id = node_by_id(data)
    values: dict[int, int] = {}
    for nid in sorted(by_id):
        n = by_id[nid]
        if n["type"] == "pi":
            values[nid] = int(assignment[n["name"]]) & 1
        else:
            bits = []
            for cid, comp in fanin_pairs(n):
                v = values[cid]
                bits.append((1 - v) if comp else v)
            values[nid] = bits[0] & bits[1]
    return values


def output_value(data: Mapping[str, Any], assignment: Mapping[str, int], po: str = "f") -> int:
    by_id = node_by_id(data)
    vals = eval_aig(data, assignment)
    for n in by_id.values():
        if n.get("po") == po:
            return vals[int(n["id"])]
    raise KeyError(po)


def build_strash_table(data: Mapping[str, Any]) -> dict[Tuple[Lit, Lit], int]:
    table: dict[Tuple[Lit, Lit], int] = {}
    by_id = node_by_id(data)
    for nid in and_nodes(data):
        fins = fanin_pairs(by_id[nid])
        key = strash_key(fins[0], fins[1])
        table[key] = nid
    return table


def strash_lookup(table: Mapping[Tuple[Lit, Lit], int], a: Lit, b: Lit) -> Optional[int]:
    return table.get(strash_key(a, b))


def local_rewrite_count(data: Mapping[str, Any]) -> dict[str, Any]:
    """
    Toy rewrite: count AND nodes that are candidates for complement push /
    associativity (both fanins non-PI or one complemented).
    Does not mutate; reports opportunities.
    """
    by_id = node_by_id(data)
    opportunities = []
    for nid in and_nodes(data):
        fins = fanin_pairs(by_id[nid])
        comps = sum(1 for _, c in fins if c)
        children_and = sum(1 for cid, _ in fins if by_id[cid]["type"] == "and")
        if comps >= 1 or children_and >= 1:
            opportunities.append({"node": nid, "comps": comps, "and_children": children_and})
    return {"count": len(opportunities), "nodes": opportunities}


def apply_inverter_push(data: Mapping[str, Any]) -> dict[str, Any]:
    """
    Lite rewrite: if AND has both fanins complemented, flip to De Morgan style
    bookkeeping — report that node can become OR-of-inverted (library later).
    Returns suggested rewrites without mutating JSON structure deeply.
    """
    by_id = node_by_id(data)
    rewrites = []
    for nid in and_nodes(data):
        fins = fanin_pairs(by_id[nid])
        if fins[0][1] and fins[1][1]:
            rewrites.append(
                {
                    "node": nid,
                    "rule": "both_comp_and",
                    "note": "AND(~x,~y) ≡ NOR(x,y) for mapping",
                }
            )
    return {"rewrites": rewrites, "applied": len(rewrites)}


def enumerate_cuts(data: Mapping[str, Any], k: Optional[int] = None) -> dict[int, List[frozenset]]:
    """
    K-feasible cuts bottom-up. PI cut = {self}.
    AND cuts = combine fanin cuts with |leaves| ≤ k, plus trivial {self}.
    """
    k = int(k if k is not None else data.get("cut_k", 3))
    by_id = node_by_id(data)
    cuts: dict[int, List[frozenset]] = {}

    for nid in sorted(by_id):
        n = by_id[nid]
        if n["type"] == "pi":
            cuts[nid] = [frozenset([nid])]
            continue
        fins = fanin_pairs(n)
        left = cuts[fins[0][0]]
        right = cuts[fins[1][0]]
        combined: Set[frozenset] = {frozenset([nid])}
        for c1 in left:
            for c2 in right:
                u = frozenset(set(c1) | set(c2))
                if len(u) <= k:
                    combined.add(u)
        # limit explosion
        cuts[nid] = sorted(combined, key=lambda c: (len(c), sorted(c)))[:16]
    return cuts


def cut_stats(cuts: Mapping[int, Sequence[frozenset]]) -> dict[str, Any]:
    total = sum(len(v) for v in cuts.values())
    max_c = max((len(v) for v in cuts.values()), default=0)
    return {"nodes": len(cuts), "total_cuts": total, "max_per_node": max_c}


def techmap_area(
    data: Mapping[str, Any],
    cuts: Optional[Mapping[int, Sequence[frozenset]]] = None,
) -> dict[str, Any]:
    """
    Greedy area techmap lite: each AND node mapped to AND2 (area 2) or
    NAND2+INV if both comps; PIs free. Prefer library cell with matching inputs.
    """
    lib = {c["id"]: c for c in data["library"]}
    by_id = node_by_id(data)
    if cuts is None:
        cuts = enumerate_cuts(data)
    mapping: List[dict[str, Any]] = []
    area = 0
    delay_depth = 0
    for nid in and_nodes(data):
        fins = fanin_pairs(by_id[nid])
        both_comp = fins[0][1] and fins[1][1]
        if both_comp and "NOR2" in lib:
            cell = lib["NOR2"]
            note = "map AND(~, ~) as NOR"
        else:
            cell = lib.get("AND2") or lib.get("NAND2")
            note = "map AND"
        assert cell is not None
        mapping.append({"node": nid, "cell": cell["id"], "area": cell["area"], "note": note})
        area += int(cell["area"])
        delay_depth += int(cell["delay"])
    # optional INV for complemented edges count
    inv_count = 0
    for nid in and_nodes(data):
        for _, comp in fanin_pairs(by_id[nid]):
            if comp:
                inv_count += 1
    inv_area = inv_count * int(lib.get("INV", {"area": 1})["area"])
    return {
        "mapping": mapping,
        "area": area + inv_area,
        "and_area": area,
        "inv_area": inv_area,
        "inv_count": inv_count,
        "delay_sum": delay_depth,
        "cuts_used": cut_stats(cuts),
    }


def techmap_delay(data: Mapping[str, Any]) -> dict[str, Any]:
    """Prefer faster cells when available (same cover, delay metric)."""
    area_map = techmap_area(data)
    # delay = sum of cell delays on longest AND chain (toy: #AND * min delay)
    lib = {c["id"]: c for c in data["library"]}
    and_delay = int(lib.get("AND2", lib.get("NAND2", {"delay": 2}))["delay"])
    depth = len(and_nodes(data))
    return {
        **area_map,
        "delay_depth": depth * and_delay,
        "mode": "delay",
    }


def area_delay_tradeoff(data: Mapping[str, Any]) -> dict[str, Any]:
    a = techmap_area(data)
    d = techmap_delay(data)
    return {
        "area_mode": {"area": a["area"], "delay_sum": a["delay_sum"]},
        "delay_mode": {"area": d["area"], "delay_depth": d["delay_depth"]},
        "library_size": len(data["library"]),
    }


def sequential_synth(data: Mapping[str, Any]) -> dict[str, Any]:
    """Full toy pass: stats → strash → rewrite → cuts → area map."""
    stats = aig_stats(data)
    table = build_strash_table(data)
    rewrite = apply_inverter_push(data)
    cuts = enumerate_cuts(data)
    mapped = techmap_area(data, cuts)
    trade = area_delay_tradeoff(data)
    return {
        "stats": stats,
        "strash_entries": len(table),
        "rewrite": rewrite,
        "cuts": cut_stats(cuts),
        "mapping": mapped,
        "tradeoff": trade,
    }
