"""Track A LVS solvers — schematic → device recog → net extract → match → compare → engine."""
from __future__ import annotations

from typing import Any

from lvsutil import clone, lay_devices, lay_nets, load_toy, sch_devices, sch_nets

GOLDENS = {
    "sch_device_count": 2,
    "sch_net_count": 4,
    "sch_port_count": 4,
    "lay_shape_count": 9,
    "lay_device_count": 2,
    "lay_net_count": 4,
    "recog_nmos": 1,
    "recog_pmos": 1,
    "matched_devices": 2,
    "matched_nets": 4,
    "mismatch_count": 0,
    "engine_ok": True,
}


def schematic_graph(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    devices = sch_devices(d)
    nets = sch_nets(d)
    edges = []
    for dev in devices:
        for pin, net in sorted(dev["pins"].items()):
            edges.append({"device": dev["id"], "pin": pin, "net": net, "type": dev["type"]})
    return {
        "devices": [x["id"] for x in devices],
        "types": {x["id"]: x["type"] for x in devices},
        "nets": nets,
        "ports": dict(d["schematic"]["ports"]),
        "edges": edges,
        "device_count": len(devices),
        "net_count": len(nets),
        "port_count": len(d["schematic"]["ports"]),
        "edge_count": len(edges),
    }


def recognize_devices(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Device recognition from annotated layout devices (teaching stub of geometry→MOS)."""
    d = clone(data or load_toy())
    devices = lay_devices(d)
    by_type: dict[str, list[str]] = {}
    for dev in devices:
        by_type.setdefault(dev["type"], []).append(dev["id"])
    return {
        "devices": devices,
        "count": len(devices),
        "by_type": by_type,
        "nmos": len(by_type.get("nmos", [])),
        "pmos": len(by_type.get("pmos", [])),
        "shape_count": len(d["layout"]["shapes"]),
    }


def extract_nets(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    nets = d["layout"]["nets"]
    rows = []
    for nid, info in sorted(nets.items()):
        rows.append(
            {
                "id": nid,
                "shapes": list(info["shapes"]),
                "port": info.get("port"),
                "shape_count": len(info["shapes"]),
            }
        )
    return {"nets": rows, "count": len(rows), "ids": [r["id"] for r in rows]}


def layout_graph(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    devices = lay_devices(d)
    nets = lay_nets(d)
    edges = []
    for dev in devices:
        for pin, net in sorted(dev["pins"].items()):
            edges.append({"device": dev["id"], "pin": pin, "net": net, "type": dev["type"]})
    return {
        "devices": [x["id"] for x in devices],
        "types": {x["id"]: x["type"] for x in devices},
        "nets": nets,
        "edges": edges,
        "device_count": len(devices),
        "net_count": len(nets),
        "edge_count": len(edges),
    }


def pin_binding(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Bind layout nets/devices to schematic names via binding table."""
    d = clone(data or load_toy())
    bind = d["binding"]
    return {
        "devices": dict(bind["devices"]),
        "nets": dict(bind["nets"]),
        "device_pairs": sorted(bind["devices"].items()),
        "net_pairs": sorted(bind["nets"].items()),
        "device_count": len(bind["devices"]),
        "net_count": len(bind["nets"]),
    }


def match_devices(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Match layout devices to schematic by binding + type check."""
    d = clone(data or load_toy())
    bind = d["binding"]["devices"]
    sch = {x["id"]: x for x in sch_devices(d)}
    lay = {x["id"]: x for x in lay_devices(d)}
    matched = []
    mismatches = []
    for lid, sid in sorted(bind.items()):
        L = lay[lid]
        S = sch[sid]
        ok = L["type"] == S["type"]
        entry = {"layout": lid, "schematic": sid, "type": L["type"], "ok": ok}
        if ok:
            matched.append(entry)
        else:
            mismatches.append(entry)
    return {
        "matched": matched,
        "mismatches": mismatches,
        "count": len(matched),
        "mismatch_count": len(mismatches),
    }


def lvs_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Compare bound nets: each pin connectivity must agree after rename."""
    d = clone(data or load_toy())
    bind_dev = d["binding"]["devices"]
    bind_net = d["binding"]["nets"]
    sch = {x["id"]: x for x in sch_devices(d)}
    lay = {x["id"]: x for x in lay_devices(d)}
    mismatches = []
    matched_nets = set()
    for lid, sid in sorted(bind_dev.items()):
        L = lay[lid]
        S = sch[sid]
        if L["type"] != S["type"]:
            mismatches.append({"kind": "device_type", "layout": lid, "schematic": sid})
            continue
        for pin in sorted(set(L["pins"]) | set(S["pins"])):
            ln = L["pins"].get(pin)
            sn = S["pins"].get(pin)
            if ln is None or sn is None:
                mismatches.append({"kind": "pin_missing", "device": lid, "pin": pin})
                continue
            mapped = bind_net.get(ln)
            if mapped != sn:
                mismatches.append(
                    {
                        "kind": "net_mismatch",
                        "device": lid,
                        "pin": pin,
                        "layout_net": ln,
                        "expected": sn,
                        "mapped": mapped,
                    }
                )
            else:
                matched_nets.add(ln)
    # also count all bound nets that appear
    for ln, sn in bind_net.items():
        if ln in d["layout"]["nets"] and sn in sch_nets(d):
            matched_nets.add(ln)
    return {
        "mismatches": mismatches,
        "mismatch_count": len(mismatches),
        "matched_nets": sorted(matched_nets),
        "matched_net_count": len(matched_nets),
        "matched_devices": match_devices(d)["count"],
        "ok": len(mismatches) == 0,
    }


def lvs_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    sch = schematic_graph(d)
    recog = recognize_devices(d)
    nets = extract_nets(d)
    lay = layout_graph(d)
    bind = pin_binding(d)
    match = match_devices(d)
    cmp_ = lvs_compare(d)
    ok = (
        sch["device_count"] == GOLDENS["sch_device_count"]
        and sch["net_count"] == GOLDENS["sch_net_count"]
        and recog["count"] == GOLDENS["lay_device_count"]
        and recog["nmos"] == GOLDENS["recog_nmos"]
        and recog["pmos"] == GOLDENS["recog_pmos"]
        and nets["count"] == GOLDENS["lay_net_count"]
        and match["count"] == GOLDENS["matched_devices"]
        and cmp_["matched_net_count"] == GOLDENS["matched_nets"]
        and cmp_["mismatch_count"] == GOLDENS["mismatch_count"]
        and cmp_["ok"]
    )
    return {
        "schematic": sch,
        "recognize": recog,
        "extract": nets,
        "layout": lay,
        "binding": bind,
        "match": match,
        "compare": cmp_,
        "ok": ok,
    }


def lvs_compare_metrics(data: dict[str, Any] | None = None) -> dict[str, Any]:
    eng = lvs_engine(data)
    return {
        "sch_devices": eng["schematic"]["device_count"],
        "lay_devices": eng["recognize"]["count"],
        "lay_nets": eng["extract"]["count"],
        "matched_devices": eng["match"]["count"],
        "matched_nets": eng["compare"]["matched_net_count"],
        "mismatch_count": eng["compare"]["mismatch_count"],
        "ok": eng["ok"],
    }


def _selftest() -> None:
    sch = schematic_graph()
    assert sch["device_count"] == 2 and sch["net_count"] == 4, sch
    r = recognize_devices()
    assert r["nmos"] == 1 and r["pmos"] == 1, r
    n = extract_nets()
    assert n["count"] == 4, n
    m = match_devices()
    assert m["count"] == 2 and m["mismatch_count"] == 0, m
    c = lvs_compare()
    assert c["ok"] and c["matched_net_count"] == 4, c
    eng = lvs_engine()
    assert eng["ok"], eng
    print("LVS_OK", lvs_compare_metrics())


if __name__ == "__main__":
    _selftest()
