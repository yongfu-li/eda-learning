"""Tiny PEX geometry helpers for learn_pex."""
from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent


def load_toy(path: Path | None = None) -> dict[str, Any]:
    p = path or (HERE / "tiny_pex.json")
    return json.loads(p.read_text(encoding="utf-8"))


def clone(data: dict[str, Any]) -> dict[str, Any]:
    return copy.deepcopy(data)


def width(s: dict[str, Any]) -> float:
    return float(abs(s["x1"] - s["x0"]))


def height(s: dict[str, Any]) -> float:
    return float(abs(s["y1"] - s["y0"]))


def length(s: dict[str, Any]) -> float:
    """Wire length = long side; via uses height as stack height proxy."""
    w, h = width(s), height(s)
    if s["layer"] == "VIA":
        return max(w, h)
    return max(w, h)


def wire_width(s: dict[str, Any]) -> float:
    w, h = width(s), height(s)
    return min(w, h)


def area(s: dict[str, Any]) -> float:
    return width(s) * height(s)


def perimeter(s: dict[str, Any]) -> float:
    return 2.0 * (width(s) + height(s))
