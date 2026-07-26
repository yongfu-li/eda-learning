"""Track A power solvers — switching/leakage, IR drop, EM, engine."""
from __future__ import annotations

from typing import Any

from powerutil import clone, load_toy

GOLDENS = {
    "net_count": 3,
    "edge_count": 3,
    "psw_n1": 1.0,  # 0.5 * 2 * 1^2 * 1
    "plk_n1": 0.1,  # 0.1 * 1
    "ptot_n1": 1.1,
    "chip_psw": 5.2,  # 1 + 0.2 + 4
    "chip_plk": 0.35,
    "chip_ptot": 5.55,
    "i_sink": 0.1,
    "v_sink": 0.6,  # 1 - 0.1*(1+2+1)
    "ir_drop_sink": 0.4,
    "ir_violation_count": 1,
    "em_violation_count": 3,  # I=0.1 > 0.08 on all edges
    "marker_count": 4,
    "engine_ok": True,
}


def design_stats(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    return {
        "net_count": len(d["nets"]),
        "edge_count": len(d["grid"]["edges"]),
        "node_count": len(d["grid"]["nodes"]),
        "vdd": d["vdd"],
        "freq": d["freq"],
        "nets": [n["id"] for n in d["nets"]],
    }


def switching_power(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Psw = α · C · V² · f per net."""
    d = clone(data or load_toy())
    v2 = float(d["vdd"]) ** 2
    f = float(d["freq"])
    by_net = {}
    for n in d["nets"]:
        by_net[n["id"]] = float(n["alpha"]) * float(n["c"]) * v2 * f
    return {"by_net": by_net, "total": sum(by_net.values()), "vdd": d["vdd"], "freq": f}


def leakage_power(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Pleak = Ileak · V per net."""
    d = clone(data or load_toy())
    v = float(d["vdd"])
    by_net = {n["id"]: float(n["ileak"]) * v for n in d["nets"]}
    return {"by_net": by_net, "total": sum(by_net.values()), "vdd": v}


def total_power(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    sw = switching_power(d)
    lk = leakage_power(d)
    by_net = {nid: sw["by_net"][nid] + lk["by_net"][nid] for nid in sw["by_net"]}
    return {
        "switching": sw,
        "leakage": lk,
        "by_net": by_net,
        "total": sw["total"] + lk["total"],
    }


def activity_factors(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    alphas = {n["id"]: float(n["alpha"]) for n in d["nets"]}
    return {"alphas": alphas, "mean": sum(alphas.values()) / len(alphas)}


def build_power_grid(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    g = d["grid"]
    return {
        "nodes": list(g["nodes"]),
        "edges": [dict(e) for e in g["edges"]],
        "v_src": g["v_src"],
        "i_sink": g["i_sink"],
        "edge_count": len(g["edges"]),
    }


def ir_drop_solve(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Series path src→…→sink: same I on every edge; accumulate IR."""
    d = clone(data or load_toy())
    g = d["grid"]
    i = float(g["i_sink"])
    v = float(g["v_src"])
    volts = {g["nodes"][0]: v}
    edge_drops = []
    # Assume edges are ordered along the path
    for e in g["edges"]:
        drop = i * float(e["r"])
        edge_drops.append({"id": e["id"], "i": i, "r": e["r"], "drop": drop})
        v -= drop
        volts[e["v"]] = v
    sink = g["nodes"][-1]
    return {
        "volts": volts,
        "edge_drops": edge_drops,
        "i_sink": i,
        "v_sink": volts[sink],
        "ir_drop_sink": float(g["v_src"]) - volts[sink],
    }


def find_ir_violations(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    limit = float(d["ir_limit"])
    ir = ir_drop_solve(d)
    hits = []
    if ir["ir_drop_sink"] > limit:
        hits.append(
            {
                "node": d["grid"]["nodes"][-1],
                "drop": ir["ir_drop_sink"],
                "limit": limit,
            }
        )
    return {"limit": limit, "hits": hits, "count": len(hits), "ir": ir}


def find_em_violations(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    limit = float(d["em_limit"])
    i = float(d["grid"]["i_sink"])
    hits = []
    for e in d["grid"]["edges"]:
        if i > limit:
            hits.append({"edge": e["id"], "i": i, "limit": limit})
    return {"limit": limit, "hits": hits, "count": len(hits)}


def collect_markers(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    markers = []
    for h in find_ir_violations(d)["hits"]:
        markers.append({"kind": "ir_drop", **h})
    for h in find_em_violations(d)["hits"]:
        markers.append({"kind": "em", **h})
    return {"markers": markers, "count": len(markers)}


def power_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    stats = design_stats(d)
    tot = total_power(d)
    ir = find_ir_violations(d)
    em = find_em_violations(d)
    markers = collect_markers(d)
    ok = (
        abs(tot["switching"]["by_net"]["n1"] - GOLDENS["psw_n1"]) < 1e-9
        and abs(tot["total"] - GOLDENS["chip_ptot"]) < 1e-9
        and abs(ir["ir"]["ir_drop_sink"] - GOLDENS["ir_drop_sink"]) < 1e-9
        and ir["count"] == GOLDENS["ir_violation_count"]
        and em["count"] == GOLDENS["em_violation_count"]
        and markers["count"] == GOLDENS["marker_count"]
    )
    return {
        "stats": stats,
        "total": tot,
        "ir": ir,
        "em": em,
        "markers": markers,
        "ok": ok,
    }


def power_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    eng = power_engine(data)
    return {
        "net_count": eng["stats"]["net_count"],
        "chip_ptot": eng["total"]["total"],
        "psw_n1": eng["total"]["switching"]["by_net"]["n1"],
        "ir_drop_sink": eng["ir"]["ir"]["ir_drop_sink"],
        "ir_violation_count": eng["ir"]["count"],
        "em_violation_count": eng["em"]["count"],
        "marker_count": eng["markers"]["count"],
        "ok": eng["ok"],
    }
