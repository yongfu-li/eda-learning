"""Golden smoke tests for learn_antenna solvers."""
from __future__ import annotations

from solvers import (
    GOLDENS,
    antenna_compare,
    antenna_engine,
    antenna_ratios,
    apply_jumper,
    charge_by_net,
    collect_markers,
    design_stats,
    find_violations,
    gate_area_by_net,
    jumper_effect,
    metal_area_by_net,
)


def test_stats():
    s = design_stats()
    assert s["gate_count"] == GOLDENS["gate_count"]
    assert s["metal_count"] == GOLDENS["metal_count"]
    assert s["net_count"] == GOLDENS["net_count"]


def test_areas():
    assert metal_area_by_net()["n1"] == GOLDENS["metal_area_n1"]
    assert gate_area_by_net()["n1"] == GOLDENS["gate_area_n1"]


def test_ratios():
    r = antenna_ratios()["ratios"]
    assert abs(r["n1"] - GOLDENS["ratio_n1"]) < 1e-9
    assert abs(r["n2"] - GOLDENS["ratio_n2"]) < 1e-9
    assert abs(r["n3"] - GOLDENS["ratio_n3"]) < 1e-9


def test_charge():
    c = charge_by_net()
    assert abs(c["charge"]["n1"] - GOLDENS["charge_n1"]) < 1e-9


def test_violations():
    raw = find_violations(apply_diodes=False)
    assert raw["count"] == GOLDENS["raw_violation_count"]
    viol = find_violations(apply_diodes=True)
    assert viol["count"] == GOLDENS["violation_count"]
    assert [h["net"] for h in viol["hits"]] == GOLDENS["violation_nets"]


def test_jumper():
    j = jumper_effect()
    assert abs(j["before_ratio"] - 25.0) < 1e-9
    assert abs(j["after_ratio"] - GOLDENS["jumper_n1_ratio"]) < 1e-9
    d = apply_jumper(net="n1", max_layer=1)
    assert metal_area_by_net(d).get("n1", 0.0) == 0.0


def test_markers_engine():
    m = collect_markers()
    assert m["count"] == GOLDENS["marker_count"]
    eng = antenna_engine()
    assert eng["ok"] is True
    assert antenna_compare()["ok"] is True


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print("ok", name)
    print("ALL_OK")
