"""Track A antenna solvers — area, ratio, charge, diode, jumper, engine."""
from __future__ import annotations

from typing import Any

from antennautil import clone, load_toy

GOLDENS = {
    "gate_count": 3,
    "metal_count": 4,
    "net_count": 3,
    "metal_area_n1": 25.0,
    "gate_area_n1": 1.0,
    "ratio_n1": 25.0,
    "ratio_n2": 4.0,
    "ratio_n3": 45.0,
    "charge_n1": 25.0,
    "limit_ratio": 10.0,
    "raw_violation_count": 2,  # n1, n3 before diode
    "violation_count": 1,  # n1 only after diode
    "violation_nets": ["n1"],
    "diode_protected": ["n3"],
    "jumper_n1_ratio": 0.0,  # after dropping layer>=2 metal on n1
    "marker_count": 1,
    "engine_ok": True,
}


def design_stats(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    nets = sorted({g["net"] for g in d["gates"]} | {m["net"] for m in d["metals"]})
    return {
        "gate_count": len(d["gates"]),
        "metal_count": len(d["metals"]),
        "diode_count": len(d["diodes"]),
        "jumper_count": len(d["jumpers"]),
        "net_count": len(nets),
        "limit_ratio": d["limit_ratio"],
        "nets": nets,
    }


def metal_area_by_net(data: dict[str, Any] | None = None, max_layer: int | None = None) -> dict[str, float]:
    d = clone(data or load_toy())
    jumper_caps = {j["net"]: j.get("max_layer") for j in d.get("jumpers", [])}
    out: dict[str, float] = {}
    for m in d["metals"]:
        net = m["net"]
        cap = jumper_caps.get(net) if jumper_caps.get(net) is not None else max_layer
        if cap is not None and m["layer"] > cap:
            continue
        out[net] = out.get(net, 0.0) + float(m["area"])
    return out


def gate_area_by_net(data: dict[str, Any] | None = None) -> dict[str, float]:
    d = clone(data or load_toy())
    out: dict[str, float] = {}
    for g in d["gates"]:
        out[g["net"]] = out.get(g["net"], 0.0) + float(g["area"])
    return out


def antenna_ratios(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    metal = metal_area_by_net(d)
    gate = gate_area_by_net(d)
    ratios = {}
    for net in sorted(set(metal) | set(gate)):
        ga = gate.get(net, 0.0)
        ma = metal.get(net, 0.0)
        ratios[net] = (ma / ga) if ga > 0 else float("inf")
    return {"metal": metal, "gate": gate, "ratios": ratios}


def charge_by_net(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    metal = metal_area_by_net(d)
    k = float(d.get("charge_k", 1.0))
    charge = {n: k * a for n, a in metal.items()}
    return {"k": k, "charge": charge, "metal": metal}


def diode_nets(data: dict[str, Any] | None = None) -> list[str]:
    d = clone(data or load_toy())
    return sorted({x["net"] for x in d["diodes"]})


def find_violations(data: dict[str, Any] | None = None, *, apply_diodes: bool = True) -> dict[str, Any]:
    d = clone(data or load_toy())
    limit = float(d["limit_ratio"])
    ratios = antenna_ratios(d)["ratios"]
    protected = set(diode_nets(d)) if apply_diodes else set()
    viol = []
    for net, r in ratios.items():
        if net in protected:
            continue
        if r > limit:
            viol.append({"net": net, "ratio": r, "limit": limit})
    viol.sort(key=lambda x: x["net"])
    return {"limit": limit, "protected": sorted(protected), "hits": viol, "count": len(viol)}


def apply_jumper(data: dict[str, Any] | None = None, net: str = "n1", max_layer: int = 1) -> dict[str, Any]:
    """Attach a jumper that caps antenna metal layer for `net`."""
    d = clone(data or load_toy())
    d["jumpers"] = [j for j in d["jumpers"] if j["net"] != net]
    d["jumpers"].append({"id": f"j_{net}", "net": net, "max_layer": max_layer})
    return d


def jumper_effect(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Show n1 ratio before/after jumper capping layer to 1 (drops m1 layer 2)."""
    base = clone(data or load_toy())
    before = antenna_ratios(base)["ratios"].get("n1", 0.0)
    after_design = apply_jumper(base, "n1", 1)
    after = antenna_ratios(after_design)["ratios"].get("n1", 0.0)
    # n1 only had layer-2 metal → after area 0 → ratio 0
    return {"before_ratio": before, "after_ratio": after, "design": after_design}


def collect_markers(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    viol = find_violations(d, apply_diodes=True)
    markers = [{"kind": "antenna_ratio", **h} for h in viol["hits"]]
    return {"markers": markers, "count": len(markers)}


def antenna_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    stats = design_stats(d)
    ratios = antenna_ratios(d)
    charge = charge_by_net(d)
    raw = find_violations(d, apply_diodes=False)
    viol = find_violations(d, apply_diodes=True)
    markers = collect_markers(d)
    jmp = jumper_effect(d)
    ok = (
        abs(ratios["ratios"]["n1"] - GOLDENS["ratio_n1"]) < 1e-9
        and abs(ratios["ratios"]["n2"] - GOLDENS["ratio_n2"]) < 1e-9
        and viol["count"] == GOLDENS["violation_count"]
        and markers["count"] == GOLDENS["marker_count"]
        and abs(jmp["after_ratio"] - GOLDENS["jumper_n1_ratio"]) < 1e-9
    )
    return {
        "stats": stats,
        "ratios": ratios,
        "charge": charge,
        "raw": raw,
        "violations": viol,
        "markers": markers,
        "jumper": jmp,
        "ok": ok,
    }


def antenna_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    eng = antenna_engine(data)
    return {
        "gate_count": eng["stats"]["gate_count"],
        "metal_count": eng["stats"]["metal_count"],
        "ratio_n1": eng["ratios"]["ratios"]["n1"],
        "ratio_n2": eng["ratios"]["ratios"]["n2"],
        "violation_count": eng["violations"]["count"],
        "marker_count": eng["markers"]["count"],
        "jumper_n1_ratio": eng["jumper"]["after_ratio"],
        "ok": eng["ok"],
    }
