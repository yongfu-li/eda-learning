"""Part C — Magic layout algorithms on tiny_algo_magic.json (+ bind to Part B goldens)."""
from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any

COMMON = Path(__file__).resolve().parent
TOY = COMMON / "tiny_algo_magic.json"
EVID = COMMON / "evidence" / "goldens.json"

ALGO_GOLDENS = json.loads(TOY.read_text(encoding="utf-8"))["goldens"]


def load_algo(data: dict[str, Any] | None = None) -> dict[str, Any]:
    if data is not None:
        return copy.deepcopy(data)
    return json.loads(TOY.read_text(encoding="utf-8"))


def _rects_touch(a: dict[str, Any], b: dict[str, Any]) -> bool:
    if a["x1"] < b["x0"] or b["x1"] < a["x0"]:
        return False
    if a["y1"] < b["y0"] or b["y1"] < a["y0"]:
        return False
    return True


def _connected_components(rects: list[dict[str, Any]], bridge: list[dict[str, Any]] | None = None) -> list[list[str]]:
    items = list(rects) + list(bridge or [])
    parent = {r["id"]: r["id"] for r in items}

    def find(x: str) -> str:
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a: str, b: str) -> None:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    by_id = {r["id"]: r for r in items}
    for i, a in enumerate(items):
        for b in items[i + 1 :]:
            la = a.get("layer")
            lb = b.get("layer")
            if la is not None and lb is not None and la == lb and _rects_touch(a, b):
                union(a["id"], b["id"])
    for c in bridge or []:
        for layer in c.get("between", []):
            for r in rects:
                if r["layer"] == layer and _rects_touch(r, c):
                    union(r["id"], c["id"])
    groups: dict[str, list[str]] = {}
    for r in items:
        root = find(r["id"])
        groups.setdefault(root, []).append(r["id"])
    return list(groups.values())


def algo_paint_connectivity(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    m1 = [r for r in d["rects"] if r["layer"] == "metal1"]
    nets = _connected_components(m1, d["contacts"])
    m1_net = next((g for g in nets if "m1y" in g), [])
    ok = (
        len(nets) >= 1
        and len(m1_net) == ALGO_GOLDENS["metal1_net_shapes"]
        and len(d["contacts"]) == ALGO_GOLDENS["contact_count"]
    )
    return {
        "ok": ok,
        "net_count": len(nets),
        "metal1_net_shapes": len(m1_net),
        "contact_count": len(d["contacts"]),
        "highlight": m1_net + [c["id"] for c in d["contacts"]],
        "pass": "connectivity",
        "note": "Flood-fill metal1; contact bridges poly and metal1.",
    }


def algo_drc_region(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    mw = d["tech"]["min_width"]
    errors = []
    for r in d["rects"]:
        lim = mw.get(r["layer"])
        if lim is None:
            continue
        thin = min(int(r["x1"] - r["x0"]), int(r["y1"] - r["y0"]))
        if thin < lim:
            errors.append({"shape": r["id"], "layer": r["layer"], "value": thin, "limit": lim})
    ok = len(errors) == ALGO_GOLDENS["drc_error_count"] and any(
        e["shape"] == ALGO_GOLDENS["drc_violation_shape"] for e in errors
    )
    return {
        "ok": ok,
        "error_count": len(errors),
        "errors": errors,
        "highlight": [e["shape"] for e in errors],
        "pass": "drc_region",
        "note": "Region scan finds width violation on thin metal1.",
    }


def algo_extract(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = load_algo(data)
    nodes = []
    for r in d["rects"]:
        if r["layer"] in ("poly", "ndiff", "pdiff"):
            nodes.append({"id": r["id"], "layer": r["layer"]})
    ok = len(nodes) == ALGO_GOLDENS["extract_nodes"]
    return {
        "ok": ok,
        "extract_nodes": len(nodes),
        "nodes": [n["id"] for n in nodes],
        "highlight": [n["id"] for n in nodes],
        "pass": "extract",
        "note": "Extract active/device nodes from painted layers.",
    }


def magic_algo_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    c = algo_paint_connectivity(data)
    d = algo_drc_region(data)
    e = algo_extract(data)
    ok = c["ok"] and d["ok"] and e["ok"] and ALGO_GOLDENS["engine_ok"] is True
    return {
        "ok": ok,
        "contact_count": c["contact_count"],
        "drc_errors": d["error_count"],
        "extract_nodes": e["extract_nodes"],
        "gds_layers": ALGO_GOLDENS["gds_layer_count"],
        "pass": "engine",
    }


def _selftest() -> None:
    assert algo_paint_connectivity()["ok"]
    assert algo_drc_region()["ok"]
    assert algo_extract()["ok"]
    eng = magic_algo_engine()
    assert eng["ok"], eng
    print("MAGIC_ALGO_OK", eng)


if __name__ == "__main__":
    _selftest()
