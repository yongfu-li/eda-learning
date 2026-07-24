"""Buffering instance helpers (Track A)."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Mapping, Sequence, Tuple, Union

Point = Union[Dict[str, float], Tuple[float, float], List[float]]


def load(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def _xy(p: Point) -> Tuple[float, float]:
    if isinstance(p, (tuple, list)):
        return float(p[0]), float(p[1])
    return float(p["x"]), float(p["y"])


def manhattan(a: Point, b: Point) -> float:
    ax, ay = _xy(a)
    bx, by = _xy(b)
    return abs(ax - bx) + abs(ay - by)


def node_map(data: Mapping[str, Any]) -> dict[str, dict[str, float]]:
    nodes: dict[str, dict[str, float]] = {
        data["driver"]["id"]: {"x": float(data["driver"]["x"]), "y": float(data["driver"]["y"])}
    }
    for s in data["sinks"]:
        nodes[s["id"]] = {"x": float(s["x"]), "y": float(s["y"]), "cload": float(s.get("cload", 1.0))}
    return nodes


def edge_length(data: Mapping[str, Any], edge: Mapping[str, Any]) -> float:
    nodes = node_map(data)
    return manhattan(nodes[edge["a"]], nodes[edge["b"]])


def wire_rc(length: float, r_per: float = 1.0, c_per: float = 1.0) -> dict[str, float]:
    return {"R": length * r_per, "C": length * c_per, "length": length}
