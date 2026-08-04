"""Part C — KLayout DRC algorithms on tiny_algo_klayout.json (+ bind to Part B goldens)."""
from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any

COMMON = Path(__file__).resolve().parent
TOY = COMMON / "tiny_algo_klayout.json"

ALGO_GOLDENS = json.loads(TOY.read_text(encoding="utf-8"))["goldens"]


def load_algo(data: dict[str, Any] | None = None) -> dict[str, Any]:
    if data is not None:
        return copy.deepcopy(data)
    return json.loads(TOY.read_text(encoding="utf-8"))


def _width(shape: dict[str, Any]) -> float:
    x0, y0, x1, y1 = shape["box"]
    return min(abs(x1 - x0), abs(y1 - y0))


def algo_layer_query(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    layers = d["layers"]
    by_layer = {}
    for s in d["shapes"]:
        by_layer.setdefault(s["layer"], []).append(s["id"])
    ok = len(layers) == ALGO_GOLDENS["layer_query_count"] and len(by_layer) == 2
    return {
        "ok": ok,
        "layer_query_count": len(layers),
        "by_layer": by_layer,
        "highlight": list(layers.keys()),
        "pass": "layer_query",
        "note": "Layer query groups shapes by poly/metal1.",
    }


def algo_width_spacing(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    violations = []
    for s in d["shapes"]:
        layer = s["layer"]
        lim = d["rules"].get(layer, {}).get("min_width")
        if lim is None:
            continue
        w = _width(s)
        if w < lim:
            violations.append({"shape": s["id"], "layer": layer, "width": w, "limit": lim})
    ok = len(violations) == ALGO_GOLDENS["width_violations"]
    return {
        "ok": ok,
        "width_violations": len(violations),
        "violations": violations,
        "highlight": [v["shape"] for v in violations],
        "pass": "width_spacing",
        "note": "Width check: m0 width 20 < min_width 40.",
    }


def algo_marker_emit(data: dict[str, Any] | None = None) -> dict[str, Any]:
    ws = algo_width_spacing(data)
    markers = [{"shape": v["shape"], "type": "width"} for v in ws["violations"]]
    ok = len(markers) == ALGO_GOLDENS["marker_count"]
    return {
        "ok": ok,
        "marker_count": len(markers),
        "markers": markers,
        "highlight": [m["shape"] for m in markers],
        "pass": "marker_emit",
        "note": "Emit one DRC marker for m0 width violation.",
    }


def klayout_algo_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    lq = algo_layer_query(data)
    ws = algo_width_spacing(data)
    me = algo_marker_emit(data)
    ok = lq["ok"] and ws["ok"] and me["ok"] and ALGO_GOLDENS["engine_ok"] is True
    return {
        "ok": ok,
        "layer_query_count": lq["layer_query_count"],
        "width_violations": ws["width_violations"],
        "marker_count": me["marker_count"],
        "pass": "engine",
    }


def _selftest() -> None:
    assert algo_layer_query()["ok"]
    assert algo_width_spacing()["ok"]
    assert algo_marker_emit()["ok"]
    eng = klayout_algo_engine()
    assert eng["ok"], eng
    print("KLAYOUT_ALGO_OK", eng)


if __name__ == "__main__":
    _selftest()
