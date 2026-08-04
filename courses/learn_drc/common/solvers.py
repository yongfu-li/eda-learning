"""Track A DRC solvers — rule deck → width/space/enclosure/boolean → violations → engine."""
from __future__ import annotations

from typing import Any

from drcutil import (
    clone,
    contains,
    deck_by_type,
    enclosure_margin,
    height,
    horiz_gap,
    load_toy,
    on_layer,
    rects_overlap,
    width,
)

GOLDENS = {
    "shape_count": 5,
    "layer_count": 3,
    "rule_count": 8,
    "width_rules": 3,
    "space_rules": 2,
    "enclosure_rules": 2,
    "boolean_rules": 1,
    "width_violations": 1,
    "space_violations": 1,
    "enclosure_violations": 1,
    "boolean_hits": 1,
    "violation_count": 3,
    "engine_ok": True,
}


def load_deck(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    by_type: dict[str, list] = {}
    for r in d["deck"]:
        by_type.setdefault(r["type"], []).append(r["id"])
    return {
        "rule_count": len(d["deck"]),
        "rules": list(d["deck"]),
        "by_type": by_type,
        "layers": list(d["layers"]),
        "shape_count": len(d["shapes"]),
    }


def check_width(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    violations = []
    for rule in deck_by_type(d, "width"):
        layer = rule["layer"]
        limit = rule["limit"]
        for s in on_layer(d, layer):
            thin = min(width(s), height(s))
            if thin < limit:
                violations.append(
                    {
                        "rule_id": rule["id"],
                        "type": "width",
                        "layer": layer,
                        "shapes": [s["id"]],
                        "value": thin,
                        "limit": limit,
                    }
                )
    return {"violations": violations, "count": len(violations)}


def check_spacing(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    violations = []
    for rule in deck_by_type(d, "space"):
        layer = rule["layer"]
        limit = rule["limit"]
        shapes = on_layer(d, layer)
        for i, a in enumerate(shapes):
            for b in shapes[i + 1 :]:
                gap = horiz_gap(a, b)
                if gap is None:
                    continue
                if gap < limit:
                    left, right = (a, b) if a["x0"] <= b["x0"] else (b, a)
                    violations.append(
                        {
                            "rule_id": rule["id"],
                            "type": "space",
                            "layer": layer,
                            "shapes": [left["id"], right["id"]],
                            "value": gap,
                            "limit": limit,
                        }
                    )
    return {"violations": violations, "count": len(violations)}


def check_enclosure(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    violations = []
    for rule in deck_by_type(d, "enclosure"):
        inner_layer = rule["inner"]
        outer_layer = rule["outer"]
        limit = rule["limit"]
        for inn in on_layer(d, inner_layer):
            best_ok = False
            best = None
            for out in on_layer(d, outer_layer):
                m = enclosure_margin(out, inn)
                if m is None:
                    continue
                if all(v >= limit for v in m.values()):
                    best_ok = True
                    break
                if best is None:
                    best = {"outer": out["id"], "margins": m}
            if not best_ok:
                violations.append(
                    {
                        "rule_id": rule["id"],
                        "type": "enclosure",
                        "shapes": [inn["id"]],
                        "inner": inn["id"],
                        "outer_layer": outer_layer,
                        "inner_layer": inner_layer,
                        "limit": limit,
                        "detail": best,
                    }
                )
    return {"violations": violations, "count": len(violations)}


def check_boolean(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Deck boolean: VIA covered by M1 AND not by M2 → hit (expect V)."""
    d = clone(data or load_toy())
    hits = []
    for rule in deck_by_type(d, "boolean"):
        if rule.get("mode") != "and_not":
            continue
        must = on_layer(d, rule["must"])
        must_not = on_layer(d, rule["must_not"])
        for inn in on_layer(d, rule["inner"]):
            # Covered = overlap (VIA on metal); V∩A, V∩C false on tiny_drc
            in_must = any(rects_overlap(o, inn) for o in must)
            in_not = any(rects_overlap(o, inn) for o in must_not)
            if in_must and not in_not:
                hits.append(
                    {
                        "rule_id": rule["id"],
                        "type": "boolean",
                        "shapes": [inn["id"]],
                        "mode": "and_not",
                    }
                )
    return {"hits": hits, "count": len(hits)}


def collect_violations(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Width + space + enclosure violations (engine set; boolean separate)."""
    d = clone(data or load_toy())
    viols = (
        check_width(d)["violations"]
        + check_spacing(d)["violations"]
        + check_enclosure(d)["violations"]
    )
    return {"violations": viols, "count": len(viols)}


def multi_layer_rules(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Which deck rules involve VIA / cross-layer."""
    d = clone(data or load_toy())
    enc = [r for r in d["deck"] if r["type"] == "enclosure"]
    boolean = [r for r in d["deck"] if r["type"] == "boolean"]
    return {
        "enclosure_rules": [r["id"] for r in enc],
        "boolean_rules": [r["id"] for r in boolean],
        "enclosure_count": len(enc),
        "fires": check_enclosure(d),
    }


def drc_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    deck = load_deck(d)
    width = check_width(d)
    space = check_spacing(d)
    enc = check_enclosure(d)
    boolean = check_boolean(d)
    viols = collect_violations(d)
    ok = (
        deck["rule_count"] == GOLDENS["rule_count"]
        and width["count"] == GOLDENS["width_violations"]
        and space["count"] == GOLDENS["space_violations"]
        and enc["count"] == GOLDENS["enclosure_violations"]
        and viols["count"] == GOLDENS["violation_count"]
        and boolean["count"] == GOLDENS["boolean_hits"]
    )
    return {
        "deck": deck,
        "width": width,
        "space": space,
        "enclosure": enc,
        "boolean": boolean,
        "violations": viols,
        "ok": ok,
    }


def drc_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    eng = drc_engine(data)
    return {
        "rule_count": eng["deck"]["rule_count"],
        "width_violations": eng["width"]["count"],
        "space_violations": eng["space"]["count"],
        "enclosure_violations": eng["enclosure"]["count"],
        "boolean_hits": eng["boolean"]["count"],
        "violation_count": eng["violations"]["count"],
        "ok": eng["ok"],
    }


def _selftest() -> None:
    deck = load_deck()
    assert deck["rule_count"] == 8, deck
    w = check_width()
    assert w["count"] == 1 and w["violations"][0]["shapes"] == ["D"], w
    s = check_spacing()
    assert s["count"] == 1 and set(s["violations"][0]["shapes"]) == {"A", "B"}, s
    e = check_enclosure()
    assert e["count"] == 1 and e["violations"][0]["inner"] == "V", e
    b = check_boolean()
    assert b["count"] == 1 and b["hits"][0]["shapes"] == ["V"], b
    eng = drc_engine()
    assert eng["ok"], eng
    print("DRC_OK", drc_compare())


if __name__ == "__main__":
    _selftest()
