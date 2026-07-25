"""Track A pattern-matching solvers for learn_pattern_matching."""
from __future__ import annotations

from typing import Any

from patternutil import (
    all_edges,
    area,
    clone,
    enclosure_margin,
    height,
    horiz_gap,
    load_toy,
    on_layer,
    projects_overlap_x,
    rects_overlap,
    width,
)

# Goldens for tiny_patterns.json
GOLDENS = {
    "shape_count": 5,
    "layer_count": 3,
    "edge_count": 20,  # 5 shapes × 4
    "m1_shape_count": 3,
    "width_markers": 1,  # D width=1 < min 3
    "space_markers": 1,  # A–B gap=1 < min 2
    "region_enclosure_ok_m1": True,  # V inside A with margins ≥1
    "region_enclosure_fail_m2": True,  # V not inside C
    "enclosure_markers": 1,  # VIA vs M2
    "scan_events_m1": 12,  # 3 shapes × 4 edges → 2 events each = 12? wait edges=12 for M1, events=24
    "interaction_pairs": 2,  # V∩A, (V∩C false) — count overlapping cross-layer pairs involving V
    "boolean_and_hits": 1,  # V covered by M1 AND not by M2
    "match_engine_markers": 3,  # width + space + enclosure
}


def geometry_stats(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    edges = all_edges(d)
    layers = sorted({s["layer"] for s in d["shapes"]})
    return {
        "shape_count": len(d["shapes"]),
        "layer_count": len(layers),
        "layers": layers,
        "edge_count": len(edges),
        "m1_shape_count": len(on_layer(d, "M1")),
        "areas": {s["id"]: area(s) for s in d["shapes"]},
        "widths": {s["id"]: width(s) for s in d["shapes"]},
        "heights": {s["id"]: height(s) for s in d["shapes"]},
    }


def match_width(data: dict[str, Any] | None = None, layer: str | None = None) -> list[dict[str, Any]]:
    """Single-layer width: marker when min(w,h) < min_width[layer]."""
    d = clone(data or load_toy())
    rules = d["rules"]["min_width"]
    markers = []
    for s in d["shapes"]:
        if layer and s["layer"] != layer:
            continue
        mw = rules.get(s["layer"])
        if mw is None:
            continue
        thin = min(width(s), height(s))
        if thin < mw:
            markers.append(
                {
                    "type": "width",
                    "layer": s["layer"],
                    "shapes": [s["id"]],
                    "value": thin,
                    "limit": mw,
                }
            )
    return markers


def match_space(data: dict[str, Any] | None = None, layer: str = "M1") -> list[dict[str, Any]]:
    """Single-layer edge-pair spacing: horizontal neighbors with y-projection overlap."""
    d = clone(data or load_toy())
    ms = d["rules"]["min_space"].get(layer)
    if ms is None:
        return []
    shapes = on_layer(d, layer)
    markers = []
    for i, a in enumerate(shapes):
        for b in shapes[i + 1 :]:
            gap = horiz_gap(a, b)
            if gap is None:
                continue
            if gap < ms:
                left, right = (a, b) if a["x0"] <= b["x0"] else (b, a)
                markers.append(
                    {
                        "type": "space",
                        "layer": layer,
                        "shapes": [left["id"], right["id"]],
                        "value": gap,
                        "limit": ms,
                    }
                )
    return markers


def match_enclosure(
    data: dict[str, Any] | None = None,
    inner_layer: str = "VIA",
    outer_layer: str = "M1",
) -> list[dict[str, Any]]:
    """Region pattern: each inner shape must be enclosed by some outer with min margin."""
    d = clone(data or load_toy())
    key = f"{inner_layer}_in_{outer_layer}"
    # rules use VIA_in_M1 style
    rule_key = f"{inner_layer}_in_{outer_layer}"
    if inner_layer == "VIA" and outer_layer == "M1":
        rule_key = "VIA_in_M1"
    elif inner_layer == "VIA" and outer_layer == "M2":
        rule_key = "VIA_in_M2"
    limit = d["rules"]["min_enclosure"].get(rule_key, 1)
    inners = on_layer(d, inner_layer)
    outers = on_layer(d, outer_layer)
    markers = []
    for inn in inners:
        best = None
        for out in outers:
            m = enclosure_margin(out, inn)
            if m is None:
                continue
            ok = all(v >= limit for v in m.values())
            if ok:
                best = {"outer": out["id"], "margins": m, "ok": True}
                break
            if best is None:
                best = {"outer": out["id"], "margins": m, "ok": False}
        if best is None or not best.get("ok"):
            markers.append(
                {
                    "type": "enclosure",
                    "inner": inn["id"],
                    "outer_layer": outer_layer,
                    "inner_layer": inner_layer,
                    "limit": limit,
                    "detail": best,
                }
            )
    return markers


def scanline_events(data: dict[str, Any] | None = None, layer: str = "M1") -> list[dict[str, Any]]:
    """Scanline edge sweep: emit left/right (or bottom/top) events for edges on a layer."""
    d = clone(data or load_toy())
    events = []
    for s in on_layer(d, layer):
        events.append({"kind": "enter", "x": s["x0"], "shape": s["id"], "y0": s["y0"], "y1": s["y1"]})
        events.append({"kind": "leave", "x": s["x1"], "shape": s["id"], "y0": s["y0"], "y1": s["y1"]})
    events.sort(key=lambda e: (e["x"], 0 if e["kind"] == "enter" else 1, e["shape"]))
    return events


def emit_markers(data: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    """Collect width + space markers (single-layer) into a marker list."""
    d = clone(data or load_toy())
    return match_width(d) + match_space(d, "M1") + match_space(d, "M2")


def multi_layer_via_check(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Via enclosure vs M1 and M2."""
    d = clone(data or load_toy())
    m1 = match_enclosure(d, "VIA", "M1")
    m2 = match_enclosure(d, "VIA", "M2")
    return {
        "m1_ok": len(m1) == 0,
        "m2_ok": len(m2) == 0,
        "markers": m1 + m2,
        "enclosure_markers": len(m1) + len(m2),
    }


def multi_layer_interactions(data: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    """Cross-layer overlapping shape pairs (interaction candidates)."""
    d = clone(data or load_toy())
    pairs = []
    shapes = d["shapes"]
    for i, a in enumerate(shapes):
        for b in shapes[i + 1 :]:
            if a["layer"] == b["layer"]:
                continue
            if rects_overlap(a, b):
                pairs.append({"shapes": [a["id"], b["id"]], "layers": [a["layer"], b["layer"]]})
    return pairs


def layered_boolean(
    data: dict[str, Any] | None = None,
    mode: str = "and_not",
) -> list[dict[str, Any]]:
    """
    Toy boolean region pattern on vias:
    - and_not: VIA covered by M1 AND not covered by M2 → hit (expect V)
    - and: VIA covered by M1 AND M2
    - or: VIA covered by M1 OR M2
    """
    d = clone(data or load_toy())
    vias = on_layer(d, "VIA")
    m1s = on_layer(d, "M1")
    m2s = on_layer(d, "M2")

    def covered(v, outs):
        return any(enclosure_margin(o, v) is not None for o in outs)

    hits = []
    for v in vias:
        c1 = covered(v, m1s)
        c2 = covered(v, m2s)
        ok = False
        if mode == "and_not":
            ok = c1 and not c2
        elif mode == "and":
            ok = c1 and c2
        elif mode == "or":
            ok = c1 or c2
        if ok:
            hits.append({"type": "boolean", "mode": mode, "shape": v["id"], "m1": c1, "m2": c2})
    return hits


def match_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Full single+multi pass: width, space, enclosure → combined markers."""
    d = clone(data or load_toy())
    width_m = match_width(d)
    space_m = match_space(d, "M1") + match_space(d, "M2")
    enc = multi_layer_via_check(d)
    markers = width_m + space_m + enc["markers"]
    return {
        "markers": markers,
        "count": len(markers),
        "width": len(width_m),
        "space": len(space_m),
        "enclosure": enc["enclosure_markers"],
        "interactions": multi_layer_interactions(d),
        "boolean_and_not": layered_boolean(d, "and_not"),
    }


def pattern_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Offline compare: stats + match_engine summary."""
    d = clone(data or load_toy())
    st = geometry_stats(d)
    eng = match_engine(d)
    return {
        "shape_count": st["shape_count"],
        "edge_count": st["edge_count"],
        "marker_count": eng["count"],
        "width_markers": eng["width"],
        "space_markers": eng["space"],
        "enclosure_markers": eng["enclosure"],
        "boolean_hits": len(eng["boolean_and_not"]),
        "goldens": GOLDENS,
    }


# silence unused import warning for projects_overlap_x in some linters
_ = projects_overlap_x
