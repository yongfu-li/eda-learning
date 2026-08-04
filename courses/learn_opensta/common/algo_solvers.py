"""Part C — OpenSTA timing algorithms on tiny_algo_sta.json (+ bind to Part B goldens)."""
from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any

COMMON = Path(__file__).resolve().parent
TOY = COMMON / "tiny_algo_sta.json"
EVID = COMMON / "evidence" / "goldens.json"

ALGO_GOLDENS = json.loads(TOY.read_text(encoding="utf-8"))["goldens"]


def load_algo(data: dict[str, Any] | None = None) -> dict[str, Any]:
    if data is not None:
        return copy.deepcopy(data)
    return json.loads(TOY.read_text(encoding="utf-8"))


def algo_graph_build(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    pins = [p["id"] for p in d["pins"]]
    arcs = list(d["arcs"])
    ok = len(pins) == ALGO_GOLDENS["pin_count"] and len(arcs) == ALGO_GOLDENS["arc_count"]
    return {
        "ok": ok,
        "pins": pins,
        "arc_count": len(arcs),
        "cells": sorted({a["cell"] for a in arcs}),
        "pass": "graph_build",
        "highlight": pins,
        "note": "Pins + delay arcs form the timing graph.",
    }


def algo_levelize(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    levels: dict[str, int] = {p["id"]: 0 for p in d["pins"] if p["kind"] == "input"}
    changed = True
    while changed:
        changed = False
        for a in d["arcs"]:
            src = levels.get(a["from"])
            if src is None:
                continue
            dst = a["to"]
            nl = src + 1
            if levels.get(dst, -1) < nl:
                levels[dst] = nl
                changed = True
    ok = levels == ALGO_GOLDENS["levels"]
    return {
        "ok": ok,
        "levels": levels,
        "pass": "levelize",
        "highlight": list(levels.keys()),
        "note": "Levelize: inputs at 0; each arc sinks level = pred+1.",
    }


def algo_propagate(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    levels = algo_levelize(d)["levels"]
    order = sorted(levels.keys(), key=lambda p: levels[p])
    arr: dict[str, float] = {p["id"]: 0.0 for p in d["pins"] if p["kind"] == "input"}
    for pin in order:
        preds = [a for a in d["arcs"] if a["to"] == pin]
        if not preds:
            continue
        arr[pin] = max(float(arr.get(a["from"], 0.0)) + float(a["delay"]) for a in preds)
    req = {p["id"]: float(d["clock"]["period"]) for p in d["pins"] if p["kind"] == "output"}
    ok = abs(arr.get("y", -1) - ALGO_GOLDENS["arrival_y"]) < 1e-9 and abs(
        req.get("y", -1) - ALGO_GOLDENS["required_y"]
    ) < 1e-9
    return {
        "ok": ok,
        "arrivals": arr,
        "required": req,
        "arrival_y": arr.get("y"),
        "required_y": req.get("y"),
        "pass": "propagate",
        "highlight": ["a", "b", "n1", "n2", "y"],
        "note": "Forward max arrival; required(y)=period.",
    }


def algo_slack(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    prop = algo_propagate(d)
    ay = float(prop["arrival_y"])
    ry = float(prop["required_y"])
    slack = ry - ay
    # critical path: choose max-delay predecessors
    arr = prop["arrivals"]
    path = ["y"]
    cur = "y"
    while True:
        preds = [a for a in d["arcs"] if a["to"] == cur]
        if not preds:
            break
        best = max(
            preds,
            key=lambda a: (float(arr.get(a["from"], 0.0)) + float(a["delay"]), a["from"]),
        )
        cur = best["from"]
        path.append(cur)
    path.reverse()
    ok = (
        abs(slack - ALGO_GOLDENS["slack_y"]) < 1e-9
        and abs(ay - ALGO_GOLDENS["path_delay"]) < 1e-9
        and path == ALGO_GOLDENS["critical_path"]
    )
    return {
        "ok": ok,
        "slack": slack,
        "path_delay": ay,
        "critical_path": path,
        "pass": "slack",
        "highlight": path,
        "note": "slack=R−A; critical path b→n1→n2→y.",
    }


def opensta_algo_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    g = algo_graph_build(data)
    l = algo_levelize(data)
    p = algo_propagate(data)
    s = algo_slack(data)
    ok = g["ok"] and l["ok"] and p["ok"] and s["ok"] and ALGO_GOLDENS["engine_ok"] is True
    return {
        "ok": ok,
        "pins": g["arc_count"] and ALGO_GOLDENS["pin_count"],
        "arc_count": g["arc_count"],
        "arrival_y": p["arrival_y"],
        "slack": s["slack"],
        "path": s["critical_path"],
        "pass": "engine",
    }


def _selftest() -> None:
    assert algo_graph_build()["ok"]
    assert algo_levelize()["ok"]
    assert algo_propagate()["ok"]
    assert algo_slack()["ok"]
    eng = opensta_algo_engine()
    assert eng["ok"], eng
    print("OPENSTA_ALGO_OK", eng)


if __name__ == "__main__":
    _selftest()
