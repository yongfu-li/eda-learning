"""Tiny pattern geometry helpers for learn_pattern_matching."""
from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent


def load_toy(path: Path | None = None) -> dict[str, Any]:
    p = path or (HERE / "tiny_patterns.json")
    return json.loads(p.read_text(encoding="utf-8"))


def clone(data: dict[str, Any]) -> dict[str, Any]:
    return copy.deepcopy(data)


def shape_by_id(data: dict[str, Any], sid: str) -> dict[str, Any]:
    for s in data["shapes"]:
        if s["id"] == sid:
            return s
    raise KeyError(sid)


def width(s: dict[str, Any]) -> int:
    return int(s["x1"] - s["x0"])


def height(s: dict[str, Any]) -> int:
    return int(s["y1"] - s["y0"])


def area(s: dict[str, Any]) -> int:
    return width(s) * height(s)


def on_layer(data: dict[str, Any], layer: str) -> list[dict[str, Any]]:
    return [s for s in data["shapes"] if s["layer"] == layer]


def edges_of(s: dict[str, Any]) -> list[dict[str, Any]]:
    """Four axis-aligned edges as (x0,y0)-(x1,y1) with orientation."""
    x0, y0, x1, y1 = s["x0"], s["y0"], s["x1"], s["y1"]
    return [
        {"shape": s["id"], "layer": s["layer"], "orient": "H", "x0": x0, "y0": y0, "x1": x1, "y1": y0, "side": "bottom"},
        {"shape": s["id"], "layer": s["layer"], "orient": "H", "x0": x0, "y0": y1, "x1": x1, "y1": y1, "side": "top"},
        {"shape": s["id"], "layer": s["layer"], "orient": "V", "x0": x0, "y0": y0, "x1": x0, "y1": y1, "side": "left"},
        {"shape": s["id"], "layer": s["layer"], "orient": "V", "x0": x1, "y0": y0, "x1": x1, "y1": y1, "side": "right"},
    ]


def all_edges(data: dict[str, Any]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for s in data["shapes"]:
        out.extend(edges_of(s))
    return out


def projects_overlap_x(a: dict[str, Any], b: dict[str, Any]) -> bool:
    return a["y0"] < b["y1"] and b["y0"] < a["y1"]


def projects_overlap_y(a: dict[str, Any], b: dict[str, Any]) -> bool:
    return a["x0"] < b["x1"] and b["x0"] < a["x1"]


def horiz_gap(a: dict[str, Any], b: dict[str, Any]) -> int | None:
    """Positive gap if a is left of b with y-projection overlap; else None."""
    if not projects_overlap_x(a, b):
        return None
    if a["x1"] <= b["x0"]:
        return int(b["x0"] - a["x1"])
    if b["x1"] <= a["x0"]:
        return int(a["x0"] - b["x1"])
    return 0  # overlap / touch


def contains(outer: dict[str, Any], inner: dict[str, Any]) -> bool:
    return (
        outer["x0"] <= inner["x0"]
        and outer["y0"] <= inner["y0"]
        and outer["x1"] >= inner["x1"]
        and outer["y1"] >= inner["y1"]
    )


def enclosure_margin(outer: dict[str, Any], inner: dict[str, Any]) -> dict[str, int] | None:
    if not contains(outer, inner):
        return None
    return {
        "left": int(inner["x0"] - outer["x0"]),
        "right": int(outer["x1"] - inner["x1"]),
        "bottom": int(inner["y0"] - outer["y0"]),
        "top": int(outer["y1"] - inner["y1"]),
    }


def rects_overlap(a: dict[str, Any], b: dict[str, Any]) -> bool:
    return a["x0"] < b["x1"] and b["x0"] < a["x1"] and a["y0"] < b["y1"] and b["y0"] < a["y1"]
