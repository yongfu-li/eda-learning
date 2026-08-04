"""Part A — Magic layout/DRC/GDS map on tiny_magic.json."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
TINY = json.loads((ROOT / "tiny_magic.json").read_text(encoding="utf-8"))
GOLDENS = dict(TINY["goldens"])


def load_cell() -> dict[str, Any]:
    return json.loads(json.dumps(TINY))


def width(r: dict[str, Any]) -> int:
    return int(r["x1"] - r["x0"])


def height(r: dict[str, Any]) -> int:
    return int(r["y1"] - r["y0"])


def on_layer(cell: dict[str, Any], layer: str) -> list[dict[str, Any]]:
    return [r for r in cell["rects"] if r["layer"] == layer]


def stage_paint_layers() -> dict[str, Any]:
    c = load_cell()
    m1 = on_layer(c, "metal1")
    ok = len(c["rects"]) == GOLDENS["rect_count"] and len(m1) == GOLDENS["paint_metal1"]
    return {
        "ok": ok,
        "rect_count": len(c["rects"]),
        "paint_metal1": len(m1),
        "layers": list(c["layers"]),
        "highlight": [r["id"] for r in c["rects"]],
        "pass": "paint",
        "note": "Magic paint places rectangles on named layers.",
    }


def stage_select_box() -> dict[str, Any]:
    c = load_cell()
    # select the thin metal rect
    thin = next(r for r in c["rects"] if r["id"] == GOLDENS["thin_shape"])
    ok = thin["id"] == "thin" and width(thin) == 1
    return {
        "ok": ok,
        "selected": thin["id"],
        "box": [thin["x0"], thin["y0"], thin["x1"], thin["y1"]],
        "highlight": [thin["id"]],
        "pass": "select",
        "note": "box + select picks geometry for edit / DRC focus.",
    }


def stage_contact() -> dict[str, Any]:
    c = load_cell()
    contacts = c["contacts"]
    ok = len(contacts) == GOLDENS["contact_count"]
    return {
        "ok": ok,
        "contact_count": len(contacts),
        "contacts": [x["id"] for x in contacts],
        "highlight": [x["id"] for x in contacts] + ["g", "m1y"],
        "pass": "contact",
        "note": "contact paints a cut between poly and metal1.",
    }


def check_drc(cell: dict[str, Any] | None = None) -> dict[str, Any]:
    c = cell or load_cell()
    mw = c["tech"]["min_width"]
    errors = []
    for r in c["rects"]:
        lim = mw.get(r["layer"])
        if lim is None:
            continue
        thin = min(width(r), height(r))
        if thin < lim:
            errors.append(
                {
                    "type": "width",
                    "layer": r["layer"],
                    "shape": r["id"],
                    "value": thin,
                    "limit": lim,
                }
            )
    return {"errors": errors, "count": len(errors)}


def stage_drc_check() -> dict[str, Any]:
    drc = check_drc()
    ok = drc["count"] == GOLDENS["drc_error_count"] and any(
        e["shape"] == GOLDENS["thin_shape"] for e in drc["errors"]
    )
    return {
        "ok": ok,
        "error_count": drc["count"],
        "errors": drc["errors"],
        "highlight": [e["shape"] for e in drc["errors"]],
        "pass": "drc",
        "note": "drc check finds metal1 width error on thin.",
    }


def stage_gds_write() -> dict[str, Any]:
    c = load_cell()
    gds = c["gds_map"]
    ok = len(gds) == GOLDENS["gds_layer_count"] and gds.get("metal1") == 49
    return {
        "ok": ok,
        "gds_layer_count": len(gds),
        "gds_map": gds,
        "highlight": list(gds.keys()),
        "pass": "gds",
        "note": "gds write maps Magic layers to GDS numbers (metal1→49).",
    }


def magic_engine() -> dict[str, Any]:
    stages = [
        stage_paint_layers(),
        stage_select_box(),
        stage_contact(),
        stage_drc_check(),
        stage_gds_write(),
    ]
    ok = all(s["ok"] for s in stages) and GOLDENS["engine_ok"] is True
    return {
        "ok": ok,
        "rects": GOLDENS["rect_count"],
        "drc_errors": GOLDENS["drc_error_count"],
        "gds_layers": GOLDENS["gds_layer_count"],
        "pass": "engine",
    }


def _selftest() -> None:
    assert stage_paint_layers()["ok"]
    assert stage_select_box()["ok"]
    assert stage_contact()["ok"]
    assert stage_drc_check()["ok"]
    assert stage_gds_write()["ok"]
    eng = magic_engine()
    assert eng["ok"], eng
    print("MAGIC_PARTA_OK", eng)


if __name__ == "__main__":
    _selftest()
