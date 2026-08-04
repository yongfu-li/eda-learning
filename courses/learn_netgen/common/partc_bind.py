"""Part C bind — teaching algo goldens ↔ real Netgen Part B evidence."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from algo_solvers import (
    ALGO_GOLDENS,
    algo_hash_devices,
    algo_match_nets,
    netgen_algo_engine,
)

COMMON = Path(__file__).resolve().parent
EVID = COMMON / "evidence" / "goldens.json"


def load_real() -> dict[str, Any]:
    return json.loads(EVID.read_text(encoding="utf-8"))


def bind_hash_devices() -> dict[str, Any]:
    teach = algo_hash_devices()
    real = load_real()
    ok = teach["ok"] and real["matched_devices"] == ALGO_GOLDENS["matched_devices"]
    return {
        "ok": ok,
        "stage": "hash_devices",
        "teach": {"devices": ALGO_GOLDENS["matched_devices"]},
        "real": {"devices": real["matched_devices"]},
        "note": "Teaching device hash ↔ read_spice golden.",
    }


def bind_match_nets() -> dict[str, Any]:
    teach = algo_match_nets()
    real = load_real()
    ok = teach["ok"] and teach["matched_nets"] == real["matched_nets"]
    return {
        "ok": ok,
        "stage": "match_nets",
        "teach": {"nets": teach["matched_nets"]},
        "real": {"nets": real["matched_nets"]},
        "note": "Teaching net match ↔ lvs_compare golden.",
    }


def bind_mismatch() -> dict[str, Any]:
    teach = netgen_algo_engine()
    real = load_real()
    ok = teach["ok"] and teach["mismatch_count"] == real["mismatch_count"]
    return {
        "ok": ok,
        "stage": "mismatch",
        "teach": {"mismatch": teach["mismatch_count"]},
        "real": {"mismatch": real["mismatch_count"]},
        "note": "Teaching mismatch count ↔ lvs_report golden (0).",
    }


def bind_engine() -> dict[str, Any]:
    teach = netgen_algo_engine()
    real = load_real()
    checks = [bind_hash_devices(), bind_match_nets(), bind_mismatch()]
    ok = teach["ok"] and all(c["ok"] for c in checks) and real["engine_ok"] is True
    return {
        "ok": ok,
        "teach_matched": teach["matched_devices"],
        "real_matched": real["matched_devices"],
        "teach_nets": teach["matched_nets"],
        "real_nets": real["matched_nets"],
        "algo_ok": teach["ok"],
        "goldens": ALGO_GOLDENS,
    }


def _selftest() -> None:
    assert bind_hash_devices()["ok"]
    assert bind_match_nets()["ok"]
    assert bind_mismatch()["ok"]
    eng = bind_engine()
    assert eng["ok"], eng
    print("PARTC_BIND_OK", eng)


if __name__ == "__main__":
    _selftest()
