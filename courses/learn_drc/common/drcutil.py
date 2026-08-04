"""Tiny DRC layout + rule-deck helpers for learn_drc."""
from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent


def load_toy(path: Path | None = None) -> dict[str, Any]:
    p = path or (HERE / "tiny_drc.json")
    return json.loads(p.read_text(encoding="utf-8"))


def clone(data: dict[str, Any]) -> dict[str, Any]:
    return copy.deepcopy(data)


def width(s: dict[str, Any]) -> int:
    return int(s["x1"] - s["x0"])


def height(s: dict[str, Any]) -> int:
    return int(s["y1"] - s["y0"])


def on_layer(data: dict[str, Any], layer: str) -> list[dict[str, Any]]:
    return [s for s in data["shapes"] if s["layer"] == layer]


def projects_overlap_x(a: dict[str, Any], b: dict[str, Any]) -> bool:
    return a["y0"] < b["y1"] and b["y0"] < a["y1"]


def horiz_gap(a: dict[str, Any], b: dict[str, Any]) -> int | None:
    if not projects_overlap_x(a, b):
        return None
    if a["x1"] <= b["x0"]:
        return int(b["x0"] - a["x1"])
    if b["x1"] <= a["x0"]:
        return int(a["x0"] - b["x1"])
    return 0


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


def deck_by_type(data: dict[str, Any], rtype: str) -> list[dict[str, Any]]:
    return [r for r in data["deck"] if r["type"] == rtype]
