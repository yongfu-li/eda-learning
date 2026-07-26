"""Tiny circuit helpers for learn_spice."""
from __future__ import annotations

import copy
import json
import math
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent


def load_toy(path: Path | None = None) -> dict[str, Any]:
    p = path or (HERE / "tiny_spice.json")
    return json.loads(p.read_text(encoding="utf-8"))


def clone(data: dict[str, Any]) -> dict[str, Any]:
    return copy.deepcopy(data)


def unknown_nodes(data: dict[str, Any]) -> list[str]:
    g = data["ground"]
    return [n for n in data["nodes"] if n != g]


def mat_zeros(n: int) -> list[list[float]]:
    return [[0.0] * n for _ in range(n)]


def vec_zeros(n: int) -> list[float]:
    return [0.0] * n


def solve_dense(A: list[list[float]], b: list[float]) -> list[float]:
    """Gaussian elimination with partial pivoting (dense toy)."""
    n = len(b)
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    for col in range(n):
        piv = max(range(col, n), key=lambda r: abs(M[r][col]))
        if abs(M[piv][col]) < 1e-15:
            raise ValueError("singular matrix")
        M[col], M[piv] = M[piv], M[col]
        div = M[col][col]
        for j in range(col, n + 1):
            M[col][j] /= div
        for r in range(n):
            if r == col:
                continue
            f = M[r][col]
            for j in range(col, n + 1):
                M[r][j] -= f * M[col][j]
    return [M[i][n] for i in range(n)]


def diode_i(v: float, Is: float, Vt: float) -> float:
    # clamp exp for toy stability
    x = max(-40.0, min(40.0, v / Vt))
    return Is * (math.exp(x) - 1.0)


def diode_g(v: float, Is: float, Vt: float) -> float:
    x = max(-40.0, min(40.0, v / Vt))
    return Is * math.exp(x) / Vt
