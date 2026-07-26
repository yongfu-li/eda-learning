"""Geometry helpers for learn_multi_patterning."""
from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent


def load_toy(path: Path | None = None) -> dict[str, Any]:
    p = path or (HERE / "tiny_mp.json")
    return json.loads(p.read_text(encoding="utf-8"))


def clone(data: dict[str, Any]) -> dict[str, Any]:
    return copy.deepcopy(data)


def feature_by_id(data: dict[str, Any], fid: str) -> dict[str, Any]:
    for f in data["features"]:
        if f["id"] == fid:
            return f
    raise KeyError(fid)


def bbox_gap(a: dict[str, Any], b: dict[str, Any]) -> int:
    """Non-negative Euclidean separation between AABBs (0 if touch/overlap)."""
    import math

    dx = max(0, max(a["x0"] - b["x1"], b["x0"] - a["x1"]))
    dy = max(0, max(a["y0"] - b["y1"], b["y0"] - a["y1"]))
    if dx == 0 and dy == 0:
        return 0
    return int(math.floor(math.hypot(dx, dy)))


def center(f: dict[str, Any]) -> tuple[float, float]:
    return ((f["x0"] + f["x1"]) / 2, (f["y0"] + f["y1"]) / 2)
