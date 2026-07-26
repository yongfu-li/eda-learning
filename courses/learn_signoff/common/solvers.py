"""Track A signoff solvers — corners, checks, ECO, tapeout, engine."""
from __future__ import annotations

from typing import Any

from signoffutil import clone, load_toy

GOLDENS = {
    "corner_count": 3,
    "signoff_corner": "ss_0p9_125",
    "signoff_derate": 1.1,
    "check_count": 6,
    "fail_count": 2,  # sta, antenna
    "pass_count": 4,
    "eco_count": 2,
    "eco_fixes_all": True,  # ecos cover sta + antenna
    "tapeout_required": 4,
    "tapeout_ready_before_eco": False,
    "tapeout_ready_after_eco": True,
    "marker_count": 2,
    "engine_ok": True,
}


def design_stats(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    return {
        "corner_count": len(d["corners"]),
        "check_count": len(d["checks"]),
        "eco_count": len(d["ecos"]),
        "tapeout_count": len(d["tapeout_items"]),
        "signoff_corner": d["signoff_corner"],
    }


def list_corners(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    return {"corners": list(d["corners"]), "count": len(d["corners"])}


def pick_signoff_corner(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    cid = d["signoff_corner"]
    corner = next(c for c in d["corners"] if c["id"] == cid)
    return {"corner": corner, "derate": float(corner["derate"])}


def apply_derate(delay: float, data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    pick = pick_signoff_corner(d)
    derate = pick["derate"]
    return {"delay": delay, "derate": derate, "derated": delay * derate}


def run_checks(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    fails = [c for c in d["checks"] if c["status"] == "fail"]
    passes = [c for c in d["checks"] if c["status"] == "pass"]
    return {
        "checks": list(d["checks"]),
        "fails": fails,
        "passes": passes,
        "fail_count": len(fails),
        "pass_count": len(passes),
    }


def eco_plan(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    fails = {c["id"] for c in d["checks"] if c["status"] == "fail"}
    covered = set()
    for eco in d["ecos"]:
        covered |= set(eco["fixes"])
    return {
        "ecos": list(d["ecos"]),
        "eco_count": len(d["ecos"]),
        "fails": sorted(fails),
        "covered": sorted(covered),
        "fixes_all": fails <= covered,
    }


def apply_ecos(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Return checks with ECO-fixed items flipped to pass."""
    d = clone(data or load_toy())
    plan = eco_plan(d)
    fixed = set(plan["covered"])
    checks = []
    for c in d["checks"]:
        cc = dict(c)
        if cc["id"] in fixed and cc["status"] == "fail":
            cc["status"] = "pass"
            if "slack" in cc:
                cc["slack"] = 0.02
            if "count" in cc:
                cc["count"] = 0
        checks.append(cc)
    d2 = clone(d)
    d2["checks"] = checks
    return {"design": d2, "checks": checks, "fail_count": sum(1 for c in checks if c["status"] == "fail")}


def tapeout_checklist(data: dict[str, Any] | None = None, *, after_eco: bool = False) -> dict[str, Any]:
    d = clone(data or load_toy())
    if after_eco:
        d = apply_ecos(d)["design"]
    checks = run_checks(d)
    # Map tapeout items to check results (simplified)
    item_ok = {}
    fails = {c["id"] for c in checks["fails"]}
    item_ok["t1"] = True  # corners picked — always true in toy once signoff_corner set
    item_ok["t2"] = not ({"drc", "lvs", "erc"} & fails)
    item_ok["t3"] = "antenna" not in fails
    item_ok["t4"] = "ir" not in fails
    item_ok["t5"] = True  # optional docs — treat as done in toy
    items = []
    for t in d["tapeout_items"]:
        ok = item_ok.get(t["id"], False)
        items.append({**t, "ok": ok})
    required = [i for i in items if i["required"]]
    ready = all(i["ok"] for i in required)
    return {
        "items": items,
        "required_count": len(required),
        "ready": ready,
        "after_eco": after_eco,
    }


def collect_markers(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    markers = [{"kind": "check_fail", "check": c["id"], "name": c["name"]} for c in run_checks(d)["fails"]]
    return {"markers": markers, "count": len(markers)}


def signoff_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    stats = design_stats(d)
    corner = pick_signoff_corner(d)
    checks = run_checks(d)
    ecos = eco_plan(d)
    before = tapeout_checklist(d, after_eco=False)
    after = tapeout_checklist(d, after_eco=True)
    markers = collect_markers(d)
    ok = (
        stats["corner_count"] == GOLDENS["corner_count"]
        and corner["corner"]["id"] == GOLDENS["signoff_corner"]
        and abs(corner["derate"] - GOLDENS["signoff_derate"]) < 1e-9
        and checks["fail_count"] == GOLDENS["fail_count"]
        and ecos["fixes_all"] == GOLDENS["eco_fixes_all"]
        and before["ready"] == GOLDENS["tapeout_ready_before_eco"]
        and after["ready"] == GOLDENS["tapeout_ready_after_eco"]
        and markers["count"] == GOLDENS["marker_count"]
    )
    return {
        "stats": stats,
        "corner": corner,
        "checks": checks,
        "ecos": ecos,
        "tapeout_before": before,
        "tapeout_after": after,
        "markers": markers,
        "ok": ok,
    }


def signoff_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    eng = signoff_engine(data)
    return {
        "corner_count": eng["stats"]["corner_count"],
        "signoff_corner": eng["corner"]["corner"]["id"],
        "fail_count": eng["checks"]["fail_count"],
        "eco_count": eng["ecos"]["eco_count"],
        "tapeout_before": eng["tapeout_before"]["ready"],
        "tapeout_after": eng["tapeout_after"]["ready"],
        "marker_count": eng["markers"]["count"],
        "ok": eng["ok"],
    }
