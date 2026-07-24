"""Retiming instance helpers (Track A)."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Mapping, MutableMapping, Sequence


def load(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def node_map(data: Mapping[str, Any]) -> dict[str, dict[str, Any]]:
    return {n["id"]: n for n in data["nodes"]}


def edge_list(data: Mapping[str, Any]) -> List[dict[str, Any]]:
    return [dict(e) for e in data["edges"]]


def total_registers(edges: Sequence[Mapping[str, Any]]) -> int:
    return sum(int(e["w"]) for e in edges)
