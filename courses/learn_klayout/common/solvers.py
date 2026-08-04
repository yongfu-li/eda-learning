"""Part A — KLayout viewer/stream/DRC map on tiny_klayout.json."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
TINY = json.loads((ROOT / "tiny_klayout.json").read_text(encoding="utf-8"))
GOLDENS = dict(TINY["goldens"])


def load_design() -> dict[str, Any]:
    return json.loads(json.dumps(TINY))


def _width(shape: dict[str, Any]) -> float:
    x0, y0, x1, y1 = shape["box"]
    return min(abs(x1 - x0), abs(y1 - y0))


def stage_layers() -> dict[str, Any]:
    d = load_design()
    layers = d["layers"]
    ok = len(layers) == GOLDENS["layer_count"]
    return {
        "ok": ok,
        "layer_count": len(layers),
        "layers": layers,
        "highlight": list(layers.keys()),
        "pass": "layers",
        "note": "KLayout layer view maps layer names to GDS layer numbers.",
    }


def stage_hierarchy() -> dict[str, Any]:
    d = load_design()
    h = d["hierarchy"]
    ok = h["top"] == d["cell"] and h["instances"] == GOLDENS["instance_count"]
    return {
        "ok": ok,
        "top": h["top"],
        "instances": h["instances"],
        "highlight": [h["top"]],
        "pass": "hierarchy",
        "note": "Cell hierarchy: top cell with zero child instances on tiny_rect.",
    }


def stage_stream() -> dict[str, Any]:
    d = load_design()
    ok = GOLDENS["stream_ok"] and len(d["shapes"]) == GOLDENS["shape_count"]
    return {
        "ok": ok,
        "shape_count": len(d["shapes"]),
        "stream_ok": GOLDENS["stream_ok"],
        "highlight": [s["id"] for s in d["shapes"]],
        "pass": "stream",
        "note": "Stream GDS writes shapes with layer/datatype from the layer map.",
    }


def _width_violations(d: dict[str, Any]) -> list[dict[str, Any]]:
    violations = []
    rules = d["rules"]
    for s in d["shapes"]:
        layer = s["layer"]
        lim = rules.get(layer, {}).get("min_width")
        if lim is None:
            continue
        w = _width(s)
        if w < lim:
            violations.append({"shape": s["id"], "layer": layer, "width": w, "limit": lim})
    return violations


def stage_drc_script() -> dict[str, Any]:
    d = load_design()
    vios = _width_violations(d)
    ok = len(vios) == GOLDENS["width_violations"]
    return {
        "ok": ok,
        "width_violations": len(vios),
        "violations": vios,
        "highlight": [v["shape"] for v in vios],
        "pass": "drc_script",
        "note": "DRC script finds m0 width 20 < min_width 40.",
    }


def stage_markers() -> dict[str, Any]:
    drc = stage_drc_script()
    ok = drc["ok"] and drc["width_violations"] == GOLDENS["marker_count"]
    markers = [{"shape": v["shape"], "type": "width", "layer": v["layer"]} for v in drc["violations"]]
    return {
        "ok": ok,
        "marker_count": len(markers),
        "markers": markers,
        "highlight": [m["shape"] for m in markers],
        "pass": "markers",
        "note": "DRC markers emitted for width violation on m0.",
    }


def klayout_engine() -> dict[str, Any]:
    stages = [
        stage_layers(),
        stage_hierarchy(),
        stage_stream(),
        stage_drc_script(),
        stage_markers(),
    ]
    ok = all(s["ok"] for s in stages) and GOLDENS["engine_ok"] is True
    return {
        "ok": ok,
        "layer_count": GOLDENS["layer_count"],
        "width_violations": GOLDENS["width_violations"],
        "marker_count": GOLDENS["marker_count"],
        "pass": "engine",
    }


def _selftest() -> None:
    assert stage_layers()["ok"]
    assert stage_hierarchy()["ok"]
    assert stage_stream()["ok"]
    assert stage_drc_script()["ok"]
    assert stage_markers()["ok"]
    eng = klayout_engine()
    assert eng["ok"], eng
    print("KLAYOUT_PARTA_OK", eng)


if __name__ == "__main__":
    _selftest()
