"""Load / clone tiny DFT design helpers."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent


def load_toy(path: Path | None = None) -> dict[str, Any]:
    p = path or (HERE / "tiny_dft.json")
    return json.loads(p.read_text(encoding="utf-8"))


def clone(data: dict[str, Any] | None = None) -> dict[str, Any]:
    return json.loads(json.dumps(data or load_toy()))
