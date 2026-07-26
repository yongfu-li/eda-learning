"""Golden smoke tests for learn_power solvers."""
from __future__ import annotations

from solvers import (
    GOLDENS,
    activity_factors,
    build_power_grid,
    collect_markers,
    design_stats,
    find_em_violations,
    find_ir_violations,
    ir_drop_solve,
    leakage_power,
    power_compare,
    power_engine,
    switching_power,
    total_power,
)


def test_stats():
    s = design_stats()
    assert s["net_count"] == GOLDENS["net_count"]
    assert s["edge_count"] == GOLDENS["edge_count"]


def test_switching():
    sw = switching_power()
    assert abs(sw["by_net"]["n1"] - GOLDENS["psw_n1"]) < 1e-9
    assert abs(sw["total"] - GOLDENS["chip_psw"]) < 1e-9


def test_leakage():
    lk = leakage_power()
    assert abs(lk["by_net"]["n1"] - GOLDENS["plk_n1"]) < 1e-9
    assert abs(lk["total"] - GOLDENS["chip_plk"]) < 1e-9


def test_total():
    t = total_power()
    assert abs(t["by_net"]["n1"] - GOLDENS["ptot_n1"]) < 1e-9
    assert abs(t["total"] - GOLDENS["chip_ptot"]) < 1e-9


def test_activity():
    a = activity_factors()
    assert a["alphas"]["n1"] == 0.5
    assert abs(a["mean"] - (0.5 + 0.2 + 1.0) / 3) < 1e-9


def test_grid_ir():
    g = build_power_grid()
    assert g["edge_count"] == 3
    ir = ir_drop_solve()
    assert abs(ir["v_sink"] - GOLDENS["v_sink"]) < 1e-9
    assert abs(ir["ir_drop_sink"] - GOLDENS["ir_drop_sink"]) < 1e-9


def test_violations():
    ir = find_ir_violations()
    assert ir["count"] == GOLDENS["ir_violation_count"]
    em = find_em_violations()
    assert em["count"] == GOLDENS["em_violation_count"]


def test_markers_engine():
    m = collect_markers()
    assert m["count"] == GOLDENS["marker_count"]
    eng = power_engine()
    assert eng["ok"] is True
    assert power_compare()["ok"] is True


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print("ok", name)
    print("ALL_OK")
