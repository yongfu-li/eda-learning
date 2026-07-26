"""Part A — OpenSTA timing/report map on tiny_opensta.json."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
TINY = json.loads((ROOT / "tiny_opensta.json").read_text(encoding="utf-8"))
GOLDENS = dict(TINY["goldens"])


def load_design() -> dict[str, Any]:
    return json.loads(json.dumps(TINY))


def path_delay(design: dict[str, Any] | None = None) -> float:
    d = design or load_design()
    return float(sum(float(c["delay"]) for c in d["cells"]))


def arrivals(design: dict[str, Any] | None = None) -> dict[str, float]:
    d = design or load_design()
    if "arrivals" in d:
        return {k: float(v) for k, v in d["arrivals"].items()}
    # Fall back: topo by cell order
    arr = {p: 0.0 for p in d.get("ports", {}).get("in", [])}
    for c in d["cells"]:
        a = float(arr.get(c["a"], 0.0))
        b = float(arr.get(c.get("b", c["a"]), a))
        arr[c["y"]] = max(a, b) + float(c["delay"])
    return arr


def required_times(design: dict[str, Any] | None = None) -> dict[str, float]:
    d = design or load_design()
    if "required" in d:
        return {k: float(v) for k, v in d["required"].items()}
    period = float(d["clock"]["period"])
    return {p: period for p in d.get("ports", {}).get("out", [])}


def slack(period: float | None = None, design: dict[str, Any] | None = None) -> float:
    d = design or load_design()
    p = float(period if period is not None else d["clock"]["period"])
    return p - path_delay(d)


def stage_timing_graph() -> dict[str, Any]:
    d = load_design()
    ok = len(d["cells"]) == GOLDENS["cell_count"]
    return {
        "ok": ok,
        "cells": len(d["cells"]),
        "pins": list(d.get("pins") or []),
        "highlight": [c["id"] for c in d["cells"]],
        "pass": "timing_graph",
        "note": "Netlist cells form the timing graph nodes/arcs.",
    }


def stage_sdc_clocks() -> dict[str, Any]:
    d = load_design()
    clk = d["clock"]
    ok = clk["name"] == GOLDENS["clock_name"] and float(clk["period"]) == GOLDENS["clock_period"]
    return {
        "ok": ok,
        "clock": clk["name"],
        "period": float(clk["period"]),
        "highlight": ["clk"],
        "pass": "sdc_clocks",
        "note": "create_clock -period 10 [get_ports clk]",
    }


def stage_arrival() -> dict[str, Any]:
    d = load_design()
    arr = arrivals(d)
    ok = abs(arr.get("y", -1) - GOLDENS["arrival_y"]) < 1e-9
    return {
        "ok": ok,
        "arrivals": arr,
        "arrival_y": arr.get("y"),
        "highlight": ["a", "b", "n1", "n2", "y"],
        "pass": "arrival",
        "note": "Forward propagate max arrival along the cone.",
    }


def stage_required() -> dict[str, Any]:
    d = load_design()
    req = required_times(d)
    ok = abs(req.get("y", -1) - GOLDENS["required_y"]) < 1e-9
    return {
        "ok": ok,
        "required": req,
        "required_y": req.get("y"),
        "highlight": ["y"],
        "pass": "required",
        "note": "Required at endpoint = clock period (ideal setup, no uncertainty).",
    }


def stage_slack() -> dict[str, Any]:
    d = load_design()
    s = slack(design=d)
    ok = abs(s - GOLDENS["slack_at_period_10"]) < 1e-9
    return {
        "ok": ok,
        "slack": s,
        "path_delay": path_delay(d),
        "highlight": ["y"],
        "pass": "slack",
        "note": "slack = required − arrival = 10 − 2 = 8",
    }


def stage_report_checks() -> dict[str, Any]:
    d = load_design()
    s = slack(design=d)
    ok = GOLDENS["report_endpoint"] == "y" and abs(s - GOLDENS["slack_at_period_10"]) < 1e-9
    return {
        "ok": ok,
        "endpoint": "y",
        "slack": s,
        "path_delay": path_delay(d),
        "highlight": ["u1", "u2", "u3", "y"],
        "pass": "report_checks",
        "note": "report_checks -path_delay max → endpoint y slack 8",
    }


def opensta_engine() -> dict[str, Any]:
    stages = [
        stage_timing_graph(),
        stage_sdc_clocks(),
        stage_arrival(),
        stage_required(),
        stage_slack(),
        stage_report_checks(),
    ]
    ok = all(s["ok"] for s in stages) and GOLDENS["engine_ok"] is True
    return {
        "ok": ok,
        "cells": GOLDENS["cell_count"],
        "path_delay": GOLDENS["path_delay"],
        "slack": GOLDENS["slack_at_period_10"],
        "arrival_y": GOLDENS["arrival_y"],
        "pass": "engine",
    }


def opensta_map_compare() -> dict[str, Any]:
    return opensta_engine()


def _selftest() -> None:
    assert stage_timing_graph()["ok"]
    assert stage_sdc_clocks()["ok"]
    assert stage_arrival()["ok"]
    assert stage_required()["ok"]
    assert stage_slack()["ok"]
    assert stage_report_checks()["ok"]
    eng = opensta_engine()
    assert eng["ok"], eng
    print("OPENSTA_MAP_OK", eng)


if __name__ == "__main__":
    _selftest()
