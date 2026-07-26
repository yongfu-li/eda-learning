"""Track A ERC solvers — connectivity, floating, undriven, multi-drive, shorts, wells, engine."""
from __future__ import annotations

from typing import Any

from ercutil import clone, iter_pin_attachments, load_toy

GOLDENS = {
    "net_count": 8,
    "instance_count": 4,
    "edge_count": 14,  # pin attachments: 3×4 + SHORT×2
    "floating_count": 1,
    "floating_nets": ["float_n"],
    "undriven_count": 1,
    "multi_driven_count": 1,
    "multi_driven_nets": ["z"],
    "supply_short_count": 1,
    "well_error_count": 1,
    "marker_count": 5,
    "engine_ok": True,
}


def design_stats(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    edges = list(iter_pin_attachments(d))
    return {
        "net_count": len(d["nets"]),
        "instance_count": len(d["instances"]),
        "edge_count": len(edges),
        "port_count": len(d["ports"]),
        "supply_count": len(d["supplies"]),
        "well_count": len(d["wells"]),
        "nets": list(d["nets"]),
        "instances": [i["id"] for i in d["instances"]],
    }


def build_connectivity(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Bipartite-ish graph: instances and nets linked by pin edges."""
    d = clone(data or load_toy())
    edges = []
    for inst_id, pin, net, direction in iter_pin_attachments(d):
        edges.append({"inst": inst_id, "pin": pin, "net": net, "dir": direction})
    return {
        "nets": list(d["nets"]),
        "instances": [i["id"] for i in d["instances"]],
        "edges": edges,
        "edge_count": len(edges),
    }


def drivers_and_loads(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Per-net: drivers (out), loads (in), power/ground ties."""
    d = clone(data or load_toy())
    by_net: dict[str, dict[str, list]] = {
        n: {"drivers": [], "loads": [], "power": [], "ground": [], "io": []} for n in d["nets"]
    }
    for inst_id, pin, net, direction in iter_pin_attachments(d):
        entry = {"inst": inst_id, "pin": pin}
        if direction == "out":
            by_net[net]["drivers"].append(entry)
        elif direction == "in":
            by_net[net]["loads"].append(entry)
        elif direction == "power":
            by_net[net]["power"].append(entry)
        elif direction == "ground":
            by_net[net]["ground"].append(entry)
        else:
            by_net[net]["io"].append(entry)
    driver_pin_count = sum(len(v["drivers"]) for v in by_net.values())
    return {"by_net": by_net, "driver_pin_count": driver_pin_count}


def find_floating_nets(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Nets with no driver, not a primary input/output port, not a named supply."""
    d = clone(data or load_toy())
    dl = drivers_and_loads(d)
    floating = []
    for net, info in dl["by_net"].items():
        if net in d["supplies"]:
            continue
        if net in d["ports"]:
            continue
        if info["drivers"]:
            continue
        if not info["loads"] and not info["io"]:
            # unused net (well_n has no pin attachments except wells) — skip if no loads
            # well_n is in wells; treat nets with zero pin edges as not "floating gate"
            continue
        floating.append(net)
    floating.sort()
    return {"nets": floating, "count": len(floating)}


def find_undriven_inputs(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Input pins whose net has no driver and is not a primary input port."""
    d = clone(data or load_toy())
    dl = drivers_and_loads(d)
    hits = []
    for net, info in dl["by_net"].items():
        if net in d["ports"] and d["ports"][net] == "input":
            continue
        if info["drivers"]:
            continue
        for load in info["loads"]:
            hits.append({"inst": load["inst"], "pin": load["pin"], "net": net})
    hits.sort(key=lambda h: (h["inst"], h["pin"]))
    return {"hits": hits, "count": len(hits)}


def find_multi_driven(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    dl = drivers_and_loads(d)
    multi = []
    detail = {}
    for net, info in dl["by_net"].items():
        if len(info["drivers"]) >= 2:
            multi.append(net)
            detail[net] = info["drivers"]
    multi.sort()
    return {"nets": multi, "count": len(multi), "detail": detail}


def find_supply_shorts(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """SHORT cells bridging a power supply to a ground supply."""
    d = clone(data or load_toy())
    supplies = d["supplies"]
    hits = []
    for inst in d["instances"]:
        if inst["cell"] != "SHORT":
            continue
        nets = list(inst["pins"].values())
        if len(nets) < 2:
            continue
        kinds = {supplies.get(n) for n in nets}
        if "power" in kinds and "ground" in kinds:
            hits.append({"inst": inst["id"], "nets": nets})
    return {"hits": hits, "count": len(hits)}


def find_well_errors(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """nwell should tie to power; pwell to ground."""
    d = clone(data or load_toy())
    supplies = d["supplies"]
    hits = []
    for w in d["wells"]:
        tied = w["tied_to"]
        kind = supplies.get(tied)
        if w["type"] == "nwell" and kind != "power":
            hits.append({**w, "expected": "power", "got": kind})
        elif w["type"] == "pwell" and kind != "ground":
            hits.append({**w, "expected": "ground", "got": kind})
    return {"hits": hits, "count": len(hits)}


def collect_markers(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    markers = []
    for net in find_floating_nets(d)["nets"]:
        markers.append({"kind": "floating", "net": net})
    for h in find_undriven_inputs(d)["hits"]:
        markers.append({"kind": "undriven", **h})
    for net in find_multi_driven(d)["nets"]:
        markers.append({"kind": "multi_driven", "net": net})
    for h in find_supply_shorts(d)["hits"]:
        markers.append({"kind": "supply_short", **h})
    for h in find_well_errors(d)["hits"]:
        markers.append({"kind": "well_error", "well": h["id"], "net": h["net"]})
    return {"markers": markers, "count": len(markers)}


def erc_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    stats = design_stats(d)
    floating = find_floating_nets(d)
    undriven = find_undriven_inputs(d)
    multi = find_multi_driven(d)
    shorts = find_supply_shorts(d)
    wells = find_well_errors(d)
    markers = collect_markers(d)
    ok = (
        floating["count"] == GOLDENS["floating_count"]
        and undriven["count"] == GOLDENS["undriven_count"]
        and multi["count"] == GOLDENS["multi_driven_count"]
        and shorts["count"] == GOLDENS["supply_short_count"]
        and wells["count"] == GOLDENS["well_error_count"]
        and markers["count"] == GOLDENS["marker_count"]
    )
    return {
        "stats": stats,
        "floating": floating,
        "undriven": undriven,
        "multi": multi,
        "shorts": shorts,
        "wells": wells,
        "markers": markers,
        "ok": ok,
    }


def erc_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    eng = erc_engine(data)
    return {
        "net_count": eng["stats"]["net_count"],
        "instance_count": eng["stats"]["instance_count"],
        "floating_count": eng["floating"]["count"],
        "undriven_count": eng["undriven"]["count"],
        "multi_driven_count": eng["multi"]["count"],
        "supply_short_count": eng["shorts"]["count"],
        "well_error_count": eng["wells"]["count"],
        "marker_count": eng["markers"]["count"],
        "ok": eng["ok"],
    }
