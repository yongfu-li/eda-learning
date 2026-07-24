"""Buffer insertion solvers — Van Ginneken lite / slew-driven (Track A)."""
from __future__ import annotations

from typing import Any, Dict, List, Mapping, Optional, Sequence, Tuple

from bufutil import edge_length, manhattan, node_map, wire_rc

Option = Dict[str, float]  # {c, d} downstream cap seen / delay to sink


def elmore_delay(R: float, C_self: float, C_load: float) -> float:
    """Lumped Elmore: R * (C_self/2 + C_load)."""
    return R * (C_self / 2.0 + C_load)


def estimate_slew(R: float, C_total: float, k: float = 2.2) -> float:
    """Toy transition: k * R * C."""
    return k * R * C_total


def slew_ok(slew: float, limit: float) -> bool:
    return slew <= limit + 1e-9


def candidate_sites(
    data: Mapping[str, Any],
    step: Optional[float] = None,
) -> List[dict[str, Any]]:
    """Place candidate buffer sites every `step` units along each edge (excluding endpoints)."""
    step = float(step if step is not None else data.get("candidate_step", 2.0))
    nodes = node_map(data)
    sites: List[dict[str, Any]] = []
    sid = 0
    for e in data["edges"]:
        a, b = nodes[e["a"]], nodes[e["b"]]
        length = manhattan(a, b)
        if length < step:
            continue
        n = int(length // step)
        for i in range(1, n + 1):
            t = (i * step) / length
            if t >= 1.0 - 1e-9:
                break
            x = a["x"] + t * (b["x"] - a["x"])
            y = a["y"] + t * (b["y"] - a["y"])
            # L-route HV: if not axis-aligned, place on first axis then second
            if a["x"] != b["x"] and a["y"] != b["y"]:
                # walk HV: horizontal then vertical
                hlen = abs(b["x"] - a["x"])
                dist = i * step
                if dist <= hlen:
                    x = a["x"] + (dist if b["x"] >= a["x"] else -dist)
                    y = a["y"]
                else:
                    x = b["x"]
                    rem = dist - hlen
                    y = a["y"] + (rem if b["y"] >= a["y"] else -rem)
            sites.append(
                {
                    "id": f"c{sid}",
                    "edge": e["id"],
                    "x": x,
                    "y": y,
                    "t": t,
                }
            )
            sid += 1
    return sites


def library_by_id(data: Mapping[str, Any]) -> dict[str, dict[str, Any]]:
    return {b["id"]: b for b in data["buffer_library"]}


def dominate_prune(options: Sequence[Option]) -> List[Option]:
    """Keep non-dominated (c, d) pairs: smaller c and smaller d is better."""
    sorted_opts = sorted(options, key=lambda o: (o["c"], o["d"]))
    kept: List[Option] = []
    best_d = float("inf")
    for o in sorted_opts:
        if o["d"] < best_d - 1e-12:
            kept.append(dict(o))
            best_d = o["d"]
    return kept


def van_ginneken_edge(
    length: float,
    cload: float,
    library: Sequence[Mapping[str, Any]],
    r_per: float = 1.0,
    c_per: float = 1.0,
    allow_invert: bool = False,
) -> dict[str, Any]:
    """
    1-edge Van Ginneken lite: options at driver looking into the edge.
    Candidate: no buffer (wire only) or one buffer near mid with each library cell.
    """
    rc = wire_rc(length, r_per, c_per)
    options: List[Option] = []
    # Wire-only
    d_wire = elmore_delay(rc["R"], rc["C"], cload)
    options.append({"c": rc["C"] + cload, "d": d_wire, "buf": None, "kind": "wire"})

    mid_len = length / 2.0
    for buf in library:
        if buf.get("invert") and not allow_invert:
            continue
        # driver --wire--> buffer --wire--> load
        rc1 = wire_rc(mid_len, r_per, c_per)
        rc2 = wire_rc(mid_len, r_per, c_per)
        d_down = elmore_delay(rc2["R"], rc2["C"], cload) + float(buf["delay"])
        # Looking into buffer input: cin; upstream wire sees cin
        d_up = elmore_delay(rc1["R"], rc1["C"], float(buf["cin"])) + d_down
        # Effective load at driver: C_wire1 + cin
        c_eff = rc1["C"] + float(buf["cin"])
        options.append(
            {
                "c": c_eff,
                "d": d_up,
                "buf": buf["id"],
                "kind": "buffered",
            }
        )

    pruned = dominate_prune(options)
    best = min(pruned, key=lambda o: o["d"])
    return {"options": pruned, "best": best, "wire_only": options[0]}


def van_ginneken_net(data: Mapping[str, Any]) -> dict[str, Any]:
    """Run VG lite per sink path from driver (tree: D-S0, S0-S1, S0-S2)."""
    r_per = float(data.get("r_per_unit", 1.0))
    c_per = float(data.get("c_per_unit", 1.0))
    lib = data["buffer_library"]
    nodes = node_map(data)
    results: dict[str, Any] = {}
    # Path D→S0
    e0 = next(e for e in data["edges"] if e["id"] == "e0")
    L0 = edge_length(data, e0)
    # Downstream of S0 includes S1 and S2 loads + their wires — use sum cload for toy
    branch_c = sum(float(s.get("cload", 1.0)) for s in data["sinks"])
    results["e0"] = van_ginneken_edge(L0, branch_c, lib, r_per, c_per)
    for eid, sid in (("e1", "S1"), ("e2", "S2")):
        e = next(x for x in data["edges"] if x["id"] == eid)
        L = edge_length(data, e)
        cl = float(nodes[sid].get("cload", 1.0))
        results[eid] = van_ginneken_edge(L, cl, lib, r_per, c_per)
    # Total delay estimate: best on e0 + max(best e1, best e2)
    total = results["e0"]["best"]["d"] + max(results["e1"]["best"]["d"], results["e2"]["best"]["d"])
    wire_total = results["e0"]["wire_only"]["d"] + max(
        results["e1"]["wire_only"]["d"], results["e2"]["wire_only"]["d"]
    )
    return {
        "per_edge": results,
        "best_delay": total,
        "wire_delay": wire_total,
        "improved": total < wire_total - 1e-9,
    }


def slew_on_edge(data: Mapping[str, Any], edge_id: str, cload: float) -> float:
    e = next(x for x in data["edges"] if x["id"] == edge_id)
    L = edge_length(data, e)
    rc = wire_rc(L, float(data.get("r_per_unit", 1.0)), float(data.get("c_per_unit", 1.0)))
    return estimate_slew(rc["R"], rc["C"] + cload)


def slew_driven_insert(data: Mapping[str, Any]) -> dict[str, Any]:
    """Greedy: if edge slew > limit, insert BUF_X1 at mid."""
    limit = float(data.get("slew_limit", 8.0))
    lib = library_by_id(data)
    default_buf = lib.get("BUF_X1") or data["buffer_library"][0]
    insertions: List[dict[str, Any]] = []
    nodes = node_map(data)
    for e in data["edges"]:
        # load approx: if sink endpoint use cload else sum
        b = e["b"]
        cl = float(nodes.get(b, {}).get("cload", 2.0))
        sl = slew_on_edge(data, e["id"], cl)
        if not slew_ok(sl, limit):
            a, bp = nodes[e["a"]], nodes[e["b"]]
            insertions.append(
                {
                    "edge": e["id"],
                    "buf": default_buf["id"],
                    "x": (a["x"] + bp["x"]) / 2.0,
                    "y": (a["y"] + bp["y"]) / 2.0,
                    "slew_before": sl,
                }
            )
    return {"insertions": insertions, "count": len(insertions), "slew_limit": limit}


def polarity_fix(
    path_buffers: Sequence[Mapping[str, Any]],
    library: Mapping[str, Mapping[str, Any]],
) -> dict[str, Any]:
    """Count inverters; polarity flips each invert=True cell."""
    flips = 0
    for b in path_buffers:
        cell = library.get(b.get("buf") or b.get("id", ""), b)
        if cell.get("invert"):
            flips += 1
    return {"flips": flips, "positive": flips % 2 == 0}


def fanout_buffer_tree(data: Mapping[str, Any], max_fanout: int = 2) -> dict[str, Any]:
    """If driver fanout > max_fanout, insert a buffer at S0 junction."""
    sinks = data["sinks"]
    nodes = node_map(data)
    s0 = nodes.get("S0", nodes[sinks[0]["id"]])
    need = len(sinks) > max_fanout
    buffers = []
    if need:
        buffers.append({"id": "fanout_buf", "buf": "BUF_X2", "x": s0["x"], "y": s0["y"]})
    return {"buffers": buffers, "fanout": len(sinks), "max_fanout": max_fanout, "inserted": need}


def sequential_buffer(data: Mapping[str, Any], mode: str = "van_ginneken") -> dict[str, Any]:
    """Full pass: VG or slew-driven + optional fanout fix."""
    vg = van_ginneken_net(data)
    slew = slew_driven_insert(data)
    fan = fanout_buffer_tree(data)
    if mode == "slew":
        primary = slew
    else:
        primary = vg
    return {
        "mode": mode,
        "van_ginneken": vg,
        "slew_driven": slew,
        "fanout": fan,
        "primary": primary,
        "sites": candidate_sites(data),
    }
