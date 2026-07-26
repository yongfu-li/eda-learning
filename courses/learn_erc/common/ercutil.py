"""Load / clone tiny ERC netlist helpers."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent


def load_toy(path: Path | None = None) -> dict[str, Any]:
    p = path or (HERE / "tiny_erc.json")
    return json.loads(p.read_text(encoding="utf-8"))


def clone(data: dict[str, Any] | None = None) -> dict[str, Any]:
    return json.loads(json.dumps(data or load_toy()))


def pin_dir(design: dict[str, Any], cell: str, pin: str) -> str:
    return design["pin_dirs"][cell][pin]


def iter_pin_attachments(design: dict[str, Any]):
    """Yield (inst_id, pin, net, dir)."""
    for inst in design["instances"]:
        cell = inst["cell"]
        for pin, net in inst["pins"].items():
            yield inst["id"], pin, net, pin_dir(design, cell, pin)
