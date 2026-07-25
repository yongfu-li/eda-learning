"""Layout compaction instance helpers (Track A)."""
from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, List, Mapping, MutableMapping, Sequence


def load(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def clone(data: Mapping[str, Any]) -> dict[str, Any]:
    return deepcopy(dict(data))


def objects(data: Mapping[str, Any]) -> List[dict[str, Any]]:
    return [dict(o) for o in data["objects"]]


def obj_map(data: Mapping[str, Any]) -> dict[str, dict[str, Any]]:
    return {o["id"]: o for o in data["objects"]}


def width(o: Mapping[str, Any]) -> int:
    return int(o["x1"]) - int(o["x0"])


def height(o: Mapping[str, Any]) -> int:
    return int(o["y1"]) - int(o["y0"])


def bbox(objects_list: Sequence[Mapping[str, Any]]) -> dict[str, int]:
    if not objects_list:
        return {"x0": 0, "y0": 0, "x1": 0, "y1": 0}
    x0 = min(int(o["x0"]) for o in objects_list)
    y0 = min(int(o["y0"]) for o in objects_list)
    x1 = max(int(o["x1"]) for o in objects_list)
    y1 = max(int(o["y1"]) for o in objects_list)
    return {"x0": x0, "y0": y0, "x1": x1, "y1": y1}


def span(bb: Mapping[str, int]) -> tuple[int, int]:
    return int(bb["x1"]) - int(bb["x0"]), int(bb["y1"]) - int(bb["y0"])


def object_area(objects_list: Sequence[Mapping[str, Any]]) -> int:
    total = 0
    for o in objects_list:
        w = width(o)
        h = height(o)
        if h == 0:
            h = 1
        total += w * h
    return total


def set_objects(data: MutableMapping[str, Any], objs: Sequence[Mapping[str, Any]]) -> None:
    data["objects"] = [dict(o) for o in objs]
