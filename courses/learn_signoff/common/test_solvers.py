"""Golden smoke tests for learn_signoff solvers."""
from __future__ import annotations

from solvers import (
    GOLDENS,
    apply_derate,
    apply_ecos,
    collect_markers,
    design_stats,
    eco_plan,
    list_corners,
    pick_signoff_corner,
    run_checks,
    signoff_compare,
    signoff_engine,
    tapeout_checklist,
)


def test_stats():
    s = design_stats()
    assert s["corner_count"] == GOLDENS["corner_count"]
    assert s["check_count"] == GOLDENS["check_count"]


def test_corners():
    c = list_corners()
    assert c["count"] == 3
    p = pick_signoff_corner()
    assert p["corner"]["id"] == GOLDENS["signoff_corner"]
    assert abs(p["derate"] - GOLDENS["signoff_derate"]) < 1e-9


def test_derate():
    d = apply_derate(1.0)
    assert abs(d["derated"] - 1.1) < 1e-9


def test_checks():
    r = run_checks()
    assert r["fail_count"] == GOLDENS["fail_count"]
    assert r["pass_count"] == GOLDENS["pass_count"]


def test_eco():
    e = eco_plan()
    assert e["eco_count"] == GOLDENS["eco_count"]
    assert e["fixes_all"] is True
    a = apply_ecos()
    assert a["fail_count"] == 0


def test_tapeout():
    b = tapeout_checklist(after_eco=False)
    assert b["ready"] is False
    a = tapeout_checklist(after_eco=True)
    assert a["ready"] is True
    assert b["required_count"] == GOLDENS["tapeout_required"]


def test_markers_engine():
    m = collect_markers()
    assert m["count"] == GOLDENS["marker_count"]
    eng = signoff_engine()
    assert eng["ok"] is True
    assert signoff_compare()["ok"] is True


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print("ok", name)
    print("ALL_OK")
