"""Track A DFT-insert solvers — scan flops, stitch, lockup, engine."""
from __future__ import annotations

from typing import Any

from dftutil import clone, load_toy

GOLDENS = {
    "flop_count": 4,
    "scan_cell_count": 4,
    "chain_length": 4,
    "stitch_count": 3,  # f1→f2, f2→f3, f3→f4 (plus SI→f1, f4→SO not stitches between flops)
    "domain_count": 2,
    "lockup_count": 1,  # d0→d1 between f3 and f4
    "transform_edge_count": 6,  # SI + 3 stitches + SO + 1 lockup
    "marker_count": 1,  # lockup on f3→f4 domain crossing
    "engine_ok": True,
}


def design_stats(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    domains = sorted({f["domain"] for f in d["flops"]})
    return {
        "flop_count": len(d["flops"]),
        "domain_count": len(domains),
        "domains": domains,
        "ports": dict(d["ports"]),
        "flop_ids": [f["id"] for f in d["flops"]],
    }


def identify_scan_flops(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """All flops become scan cells in this toy (full-scan)."""
    d = clone(data or load_toy())
    cells = [
        {
            "id": f["id"],
            "type": "SDFF",
            "d": f["d"],
            "q": f["q"],
            "clk": f["clk"],
            "domain": f["domain"],
            "si": None,
            "se": d["ports"]["se"],
        }
        for f in d["flops"]
    ]
    return {"cells": cells, "count": len(cells)}


def scan_enable_port(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    return {"se": d["ports"]["se"], "si": d["ports"]["si"], "so": d["ports"]["so"]}


def stitch_chain(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Stitch Q of previous scan flop to SI of next in scan_order."""
    d = clone(data or load_toy())
    order = list(d["scan_order"])
    by_id = {f["id"]: f for f in d["flops"]}
    stitches = []
    for a, b in zip(order, order[1:]):
        stitches.append(
            {
                "from": a,
                "to": b,
                "net": f"scan_{a}_{b}",
                "src_q": by_id[a]["q"],
            }
        )
    return {
        "order": order,
        "stitches": stitches,
        "stitch_count": len(stitches),
        "si_hook": {"port": d["ports"]["si"], "to": order[0]},
        "so_hook": {"from": order[-1], "port": d["ports"]["so"]},
    }


def scan_order_check(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    order = list(d["scan_order"])
    ids = {f["id"] for f in d["flops"]}
    ok = set(order) == ids and len(order) == len(ids)
    return {"order": order, "length": len(order), "covers_all": ok}


def find_lockups(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Insert lockup when consecutive scan flops cross lockup_between domains."""
    d = clone(data or load_toy())
    order = list(d["scan_order"])
    by_id = {f["id"]: f for f in d["flops"]}
    pairs = {tuple(p) for p in d.get("lockup_between", [])}
    hits = []
    for a, b in zip(order, order[1:]):
        da, db = by_id[a]["domain"], by_id[b]["domain"]
        if (da, db) in pairs or (db, da) in pairs:
            hits.append({"from": a, "to": b, "domains": [da, db], "cell": f"lockup_{a}_{b}"})
    return {"hits": hits, "count": len(hits)}


def netlist_transform(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Apply DFT insert: scan cells + stitch edges + lockups + SI/SO hooks."""
    d = clone(data or load_toy())
    cells = identify_scan_flops(d)["cells"]
    chain = stitch_chain(d)
    lockups = find_lockups(d)
    # Wire SI into first cell, SO from last
    cells[0]["si"] = d["ports"]["si"]
    for i, st in enumerate(chain["stitches"]):
        # next cell index i+1
        cells[i + 1]["si"] = st["net"]
    edges = (
        [{"kind": "si", "from": d["ports"]["si"], "to": chain["order"][0]}]
        + [{"kind": "stitch", **st} for st in chain["stitches"]]
        + [{"kind": "so", "from": chain["order"][-1], "to": d["ports"]["so"]}]
        + [{"kind": "lockup", **h} for h in lockups["hits"]]
    )
    return {
        "cells": cells,
        "edges": edges,
        "edge_count": len(edges),
        "lockup_count": lockups["count"],
        "stitch_count": chain["stitch_count"],
    }


def collect_markers(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Markers = lockup cells required on domain crossings."""
    d = clone(data or load_toy())
    lockups = find_lockups(d)
    markers = [{"kind": "lockup", **h} for h in lockups["hits"]]
    return {"markers": markers, "count": len(markers)}


def dft_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    stats = design_stats(d)
    cells = identify_scan_flops(d)
    chain = stitch_chain(d)
    order = scan_order_check(d)
    lockups = find_lockups(d)
    xf = netlist_transform(d)
    markers = collect_markers(d)
    ok = (
        cells["count"] == GOLDENS["scan_cell_count"]
        and chain["stitch_count"] == GOLDENS["stitch_count"]
        and order["length"] == GOLDENS["chain_length"]
        and lockups["count"] == GOLDENS["lockup_count"]
        and xf["edge_count"] == GOLDENS["transform_edge_count"]
        and markers["count"] == GOLDENS["marker_count"]
        and order["covers_all"]
    )
    return {
        "stats": stats,
        "cells": cells,
        "chain": chain,
        "order": order,
        "lockups": lockups,
        "transform": xf,
        "markers": markers,
        "ok": ok,
    }


def dft_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    eng = dft_engine(data)
    return {
        "flop_count": eng["stats"]["flop_count"],
        "scan_cell_count": eng["cells"]["count"],
        "stitch_count": eng["chain"]["stitch_count"],
        "chain_length": eng["order"]["length"],
        "lockup_count": eng["lockups"]["count"],
        "transform_edge_count": eng["transform"]["edge_count"],
        "marker_count": eng["markers"]["count"],
        "ok": eng["ok"],
    }
