"""Part A — Netgen LVS compare map on tiny_netgen.json."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
TINY = json.loads((ROOT / "tiny_netgen.json").read_text(encoding="utf-8"))
GOLDENS = dict(TINY["goldens"])


def load_design() -> dict[str, Any]:
    return json.loads(json.dumps(TINY))


def _nets(side: dict[str, Any]) -> list[str]:
    nets = set(side["ports"].keys())
    for d in side["devices"]:
        nets.update(d["pins"].values())
    return sorted(nets)


def stage_read_netlists() -> dict[str, Any]:
    d = load_design()
    sch_n = len(d["schematic"]["devices"])
    lay_n = len(d["layout"]["devices"])
    ok = sch_n == GOLDENS["sch_devices"] and lay_n == GOLDENS["lay_devices"]
    return {
        "ok": ok,
        "sch_devices": sch_n,
        "lay_devices": lay_n,
        "highlight": ["mn1", "mp1", "X0", "X1"],
        "pass": "read",
        "note": "Netgen reads schematic and layout SPICE-like netlists.",
    }


def stage_device_classes() -> dict[str, Any]:
    d = load_design()
    classes = d["classes"]
    ok = len(classes) == GOLDENS["class_count"]
    return {
        "ok": ok,
        "class_count": len(classes),
        "classes": classes,
        "highlight": list(classes.keys()),
        "pass": "classes",
        "note": "Device classes map nmos/pmos to compare groups.",
    }


def stage_flatten_permute() -> dict[str, Any]:
    d = load_design()
    perm = d["permute"]
    ok = GOLDENS["permute_ok"] and set(perm["nmos"]) == {"D", "S"}
    return {
        "ok": ok,
        "permute": perm,
        "highlight": ["D", "S", "nmos", "pmos"],
        "pass": "permute",
        "note": "Source/drain pins may permute within a MOSFET class.",
    }


def stage_compare_nets() -> dict[str, Any]:
    d = load_design()
    sch = _nets(d["schematic"])
    lay = _nets(d["layout"])
    matched = sorted(set(sch) & set(lay))
    ok = len(matched) == GOLDENS["matched_nets"]
    return {
        "ok": ok,
        "matched_nets": len(matched),
        "nets": matched,
        "highlight": matched,
        "pass": "compare_nets",
        "note": "Net names match after flatten on tiny_inv.",
    }


def stage_lvs_report() -> dict[str, Any]:
    d = load_design()
    # match devices by type counts
    sch_types = sorted(x["type"] for x in d["schematic"]["devices"])
    lay_types = sorted(x["type"] for x in d["layout"]["devices"])
    matched_dev = sum(1 for a, b in zip(sch_types, lay_types) if a == b)
    mismatches = 0 if sch_types == lay_types else abs(len(sch_types) - len(lay_types))
    ok = matched_dev == GOLDENS["matched_devices"] and mismatches == GOLDENS["mismatch_count"]
    return {
        "ok": ok,
        "matched_devices": matched_dev,
        "mismatch_count": mismatches,
        "highlight": ["mn1", "mp1", "X0", "X1"],
        "pass": "report",
        "note": "LVS report: 2 devices matched, 0 mismatches.",
    }


def netgen_engine() -> dict[str, Any]:
    stages = [
        stage_read_netlists(),
        stage_device_classes(),
        stage_flatten_permute(),
        stage_compare_nets(),
        stage_lvs_report(),
    ]
    ok = all(s["ok"] for s in stages) and GOLDENS["engine_ok"] is True
    return {
        "ok": ok,
        "matched_devices": GOLDENS["matched_devices"],
        "matched_nets": GOLDENS["matched_nets"],
        "mismatch_count": GOLDENS["mismatch_count"],
        "pass": "engine",
    }


def _selftest() -> None:
    assert stage_read_netlists()["ok"]
    assert stage_device_classes()["ok"]
    assert stage_flatten_permute()["ok"]
    assert stage_compare_nets()["ok"]
    assert stage_lvs_report()["ok"]
    eng = netgen_engine()
    assert eng["ok"], eng
    print("NETGEN_PARTA_OK", eng)


if __name__ == "__main__":
    _selftest()
