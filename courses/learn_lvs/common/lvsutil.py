"""Tiny LVS helpers — schematic + layout extract for learn_lvs."""
from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent


def load_toy(path: Path | None = None) -> dict[str, Any]:
    p = path or (HERE / "tiny_lvs.json")
    return json.loads(p.read_text(encoding="utf-8"))


def clone(data: dict[str, Any]) -> dict[str, Any]:
    return copy.deepcopy(data)


def sch_devices(data: dict[str, Any]) -> list[dict[str, Any]]:
    return list(data["schematic"]["devices"])


def lay_devices(data: dict[str, Any]) -> list[dict[str, Any]]:
    return list(data["layout"]["devices"])


def sch_nets(data: dict[str, Any]) -> list[str]:
    nets: set[str] = set()
    for d in data["schematic"]["devices"]:
        nets.update(d["pins"].values())
    nets.update(data["schematic"]["ports"].keys())
    return sorted(nets)


def lay_nets(data: dict[str, Any]) -> list[str]:
    return sorted(data["layout"]["nets"].keys())
