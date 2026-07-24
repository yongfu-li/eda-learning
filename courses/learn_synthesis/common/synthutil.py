"""Logic synthesis helpers (Track A)."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Mapping, Sequence, Tuple


def load(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def node_by_id(data: Mapping[str, Any]) -> dict[int, dict[str, Any]]:
    return {int(n["id"]): n for n in data["aig"]["nodes"]}


def primary_inputs(data: Mapping[str, Any]) -> List[int]:
    return [int(n["id"]) for n in data["aig"]["nodes"] if n["type"] == "pi"]


def and_nodes(data: Mapping[str, Any]) -> List[int]:
    return [int(n["id"]) for n in data["aig"]["nodes"] if n["type"] == "and"]


def fanin_pairs(node: Mapping[str, Any]) -> List[Tuple[int, bool]]:
    """Return list of (child_id, complemented)."""
    out = []
    for pair in node.get("fanin", []):
        out.append((int(pair[0]), bool(pair[1])))
    return out


def lit(nid: int, comp: bool = False) -> Tuple[int, bool]:
    return (nid, comp)


def strash_key(a: Tuple[int, bool], b: Tuple[int, bool]) -> Tuple[Tuple[int, bool], Tuple[int, bool]]:
    """Canonical AND key with sorted fanins."""
    return (a, b) if a <= b else (b, a)
