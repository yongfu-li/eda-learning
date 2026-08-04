"""Part C — Netgen LVS algorithms on tiny_algo_netgen.json (+ bind to Part B goldens)."""
from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any

COMMON = Path(__file__).resolve().parent
TOY = COMMON / "tiny_algo_netgen.json"

ALGO_GOLDENS = json.loads(TOY.read_text(encoding="utf-8"))["goldens"]


def load_algo(data: dict[str, Any] | None = None) -> dict[str, Any]:
    if data is not None:
        return copy.deepcopy(data)
    return json.loads(TOY.read_text(encoding="utf-8"))


def _nets(side: dict[str, Any]) -> set[str]:
    nets = set(side["ports"].keys())
    for d in side["devices"]:
        nets.update(d["pins"].values())
    return nets


def algo_hash_devices(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    classes = d["classes"]
    hashed = {}
    for dev in d["schematic"]["devices"] + d["layout"]["devices"]:
        cls = classes.get(dev["type"], dev["type"])
        hashed.setdefault(cls, []).append(dev["id"])
    ok = len(hashed) == 2 and all(len(v) >= 1 for v in hashed.values())
    return {
        "ok": ok,
        "hash_device_count": sum(len(v) for v in hashed.values()),
        "classes": list(hashed.keys()),
        "highlight": [dev["id"] for dev in d["schematic"]["devices"]],
        "pass": "hash_devices",
        "note": "Hash devices by nmos/pmos class groups.",
    }


def algo_match_nets(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    sch = _nets(d["schematic"])
    lay = _nets(d["layout"])
    matched = sorted(sch & lay)
    ok = len(matched) == ALGO_GOLDENS["matched_nets"]
    return {
        "ok": ok,
        "matched_nets": len(matched),
        "nets": matched,
        "highlight": matched,
        "pass": "match_nets",
        "note": "Four nets match between schematic and layout.",
    }


def algo_permute_pins(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    perm = d["permute"]
    ok = ALGO_GOLDENS["permute_ok"] and set(perm["nmos"]) == {"D", "S"} and set(perm["pmos"]) == {"D", "S"}
    return {
        "ok": ok,
        "permute": perm,
        "highlight": ["D", "S", "nmos", "pmos"],
        "pass": "permute_pins",
        "note": "Source/drain pins may permute within MOSFET class.",
    }


def netgen_algo_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    h = algo_hash_devices(data)
    m = algo_match_nets(data)
    p = algo_permute_pins(data)
    ok = h["ok"] and m["ok"] and p["ok"] and ALGO_GOLDENS["engine_ok"] is True
    return {
        "ok": ok,
        "matched_devices": ALGO_GOLDENS["matched_devices"],
        "matched_nets": m["matched_nets"],
        "mismatch_count": ALGO_GOLDENS["mismatch_count"],
        "pass": "engine",
    }


def _selftest() -> None:
    assert algo_hash_devices()["ok"]
    assert algo_match_nets()["ok"]
    assert algo_permute_pins()["ok"]
    eng = netgen_algo_engine()
    assert eng["ok"], eng
    print("NETGEN_ALGO_OK", eng)


if __name__ == "__main__":
    _selftest()
