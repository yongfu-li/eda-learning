"""Part C bind — teaching algo goldens ↔ real OpenSTA Part B evidence."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from algo_solvers import (
    ALGO_GOLDENS,
    algo_graph_build,
    algo_levelize,
    algo_propagate,
    algo_slack,
    opensta_algo_engine,
)

COMMON = Path(__file__).resolve().parent
EVID = COMMON / "evidence" / "goldens.json"


def load_real() -> dict[str, Any]:
    return json.loads(EVID.read_text(encoding="utf-8"))


def bind_graph() -> dict[str, Any]:
    teach = algo_graph_build()
    real = load_real()
    ok = teach["ok"] and real["after_read_cells"] == 3
    return {
        "ok": ok,
        "stage": "graph",
        "teach": {"pins": teach["pins"], "arcs": teach["arc_count"]},
        "real": {"cells": real["after_read_cells"]},
        "note": "Teaching pins/arcs ↔ linked liberty instances u1/u2/u3.",
    }


def bind_propagate() -> dict[str, Any]:
    teach = algo_propagate()
    real = load_real()["stages"]["report_checks"]
    ok = (
        teach["ok"]
        and abs(float(teach["arrival_y"]) - float(real["path_delay"])) < 1e-6
        and abs(float(teach["required_y"]) - float(real["required"])) < 1e-6
    )
    return {
        "ok": ok,
        "stage": "propagate",
        "teach": {"A(y)": teach["arrival_y"], "R(y)": teach["required_y"]},
        "real": {"path_delay": real["path_delay"], "required": real["required"]},
        "note": "Teaching arrival/required ↔ report_checks path times.",
    }


def bind_slack() -> dict[str, Any]:
    teach = algo_slack()
    real = load_real()["stages"]["report_checks"]
    ok = teach["ok"] and abs(float(teach["slack"]) - float(real["slack"])) < 1e-6
    return {
        "ok": ok,
        "stage": "slack",
        "teach": {"slack": teach["slack"], "path": teach["critical_path"]},
        "real": {"slack": real["slack"], "endpoint": real["endpoint"], "startpoint": real["startpoint"]},
        "note": "Teaching slack/path ↔ report_checks slack MET.",
    }


def bind_engine() -> dict[str, Any]:
    teach = opensta_algo_engine()
    real = load_real()
    checks = [bind_graph(), bind_propagate(), bind_slack()]
    ok = teach["ok"] and all(c["ok"] for c in checks) and real["engine_ok"] is True
    return {
        "ok": ok,
        "teach_slack": teach["slack"],
        "real_slack": real["slack"],
        "algo_ok": teach["ok"],
        "goldens": ALGO_GOLDENS,
    }


def _selftest() -> None:
    assert algo_levelize()["ok"]
    assert bind_graph()["ok"]
    assert bind_propagate()["ok"]
    assert bind_slack()["ok"]
    eng = bind_engine()
    assert eng["ok"], eng
    print("PARTC_BIND_OK", eng)


if __name__ == "__main__":
    _selftest()
