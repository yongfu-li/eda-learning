"""Part C bind — teaching algo goldens ↔ real Magic Part B evidence."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from algo_solvers import (
    ALGO_GOLDENS,
    algo_drc_region,
    algo_extract,
    algo_paint_connectivity,
    magic_algo_engine,
)

COMMON = Path(__file__).resolve().parent
EVID = COMMON / "evidence" / "goldens.json"


def load_real() -> dict[str, Any]:
    return json.loads(EVID.read_text(encoding="utf-8"))


def bind_connectivity() -> dict[str, Any]:
    teach = algo_paint_connectivity()
    real = load_real()
    ok = teach["ok"] and teach["contact_count"] == real["contact_count"]
    return {
        "ok": ok,
        "stage": "connectivity",
        "teach": {"contacts": teach["contact_count"]},
        "real": {"contacts": real["contact_count"]},
        "note": "Teaching contact count ↔ paint_save golden.",
    }


def bind_drc() -> dict[str, Any]:
    teach = algo_drc_region()
    real = load_real()
    ok = teach["ok"] and teach["error_count"] == real["drc_error_count"]
    return {
        "ok": ok,
        "stage": "drc",
        "teach": {"errors": teach["error_count"]},
        "real": {"errors": real["drc_error_count"]},
        "note": "Teaching DRC region ↔ drc check golden (thin metal1).",
    }


def bind_gds() -> dict[str, Any]:
    teach = magic_algo_engine()
    real = load_real()
    ok = teach["ok"] and ALGO_GOLDENS["gds_layer_count"] == real["gds_layer_count"]
    return {
        "ok": ok,
        "stage": "gds",
        "teach": {"gds_layers": ALGO_GOLDENS["gds_layer_count"]},
        "real": {"gds_layers": real["gds_layer_count"]},
        "note": "Teaching GDS map count ↔ gds write golden.",
    }


def bind_engine() -> dict[str, Any]:
    teach = magic_algo_engine()
    real = load_real()
    checks = [bind_connectivity(), bind_drc(), bind_gds()]
    ok = teach["ok"] and all(c["ok"] for c in checks) and real["engine_ok"] is True
    return {
        "ok": ok,
        "teach_drc": teach["drc_errors"],
        "real_drc": real["drc_error_count"],
        "algo_ok": teach["ok"],
        "goldens": ALGO_GOLDENS,
    }


def _selftest() -> None:
    assert bind_connectivity()["ok"]
    assert bind_drc()["ok"]
    assert bind_gds()["ok"]
    eng = bind_engine()
    assert eng["ok"], eng
    print("PARTC_BIND_OK", eng)


if __name__ == "__main__":
    _selftest()
