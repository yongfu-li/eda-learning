"""Part C bind — teaching algo goldens ↔ real KLayout Part B evidence."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from algo_solvers import (
    ALGO_GOLDENS,
    algo_layer_query,
    algo_marker_emit,
    algo_width_spacing,
    klayout_algo_engine,
)

COMMON = Path(__file__).resolve().parent
EVID = COMMON / "evidence" / "goldens.json"


def load_real() -> dict[str, Any]:
    return json.loads(EVID.read_text(encoding="utf-8"))


def bind_layer_query() -> dict[str, Any]:
    teach = algo_layer_query()
    real = load_real()
    ok = teach["ok"] and teach["layer_query_count"] == real["layer_count"]
    return {
        "ok": ok,
        "stage": "layer_query",
        "teach": {"layers": teach["layer_query_count"]},
        "real": {"layers": real["layer_count"]},
        "note": "Teaching layer query ↔ gds_vocab golden.",
    }


def bind_width() -> dict[str, Any]:
    teach = algo_width_spacing()
    real = load_real()
    ok = teach["ok"] and teach["width_violations"] == real["width_violations"]
    return {
        "ok": ok,
        "stage": "width_spacing",
        "teach": {"violations": teach["width_violations"]},
        "real": {"violations": real["width_violations"]},
        "note": "Teaching width check ↔ drc_script golden.",
    }


def bind_markers() -> dict[str, Any]:
    teach = algo_marker_emit()
    real = load_real()
    ok = teach["ok"] and teach["marker_count"] == real["marker_count"]
    return {
        "ok": ok,
        "stage": "markers",
        "teach": {"markers": teach["marker_count"]},
        "real": {"markers": real["marker_count"]},
        "note": "Teaching marker emit ↔ markers golden.",
    }


def bind_engine() -> dict[str, Any]:
    teach = klayout_algo_engine()
    real = load_real()
    checks = [bind_layer_query(), bind_width(), bind_markers()]
    ok = teach["ok"] and all(c["ok"] for c in checks) and real["engine_ok"] is True
    return {
        "ok": ok,
        "teach_violations": teach["width_violations"],
        "real_violations": real["width_violations"],
        "teach_markers": teach["marker_count"],
        "real_markers": real["marker_count"],
        "algo_ok": teach["ok"],
        "goldens": ALGO_GOLDENS,
    }


def _selftest() -> None:
    assert bind_layer_query()["ok"]
    assert bind_width()["ok"]
    assert bind_markers()["ok"]
    eng = bind_engine()
    assert eng["ok"], eng
    print("PARTC_BIND_OK", eng)


if __name__ == "__main__":
    _selftest()
