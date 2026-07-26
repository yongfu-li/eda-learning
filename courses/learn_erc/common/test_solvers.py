"""Golden smoke tests for learn_erc solvers."""
from __future__ import annotations

from solvers import (
    GOLDENS,
    build_connectivity,
    collect_markers,
    design_stats,
    drivers_and_loads,
    erc_compare,
    erc_engine,
    find_floating_nets,
    find_multi_driven,
    find_supply_shorts,
    find_undriven_inputs,
    find_well_errors,
)


def test_stats():
    s = design_stats()
    assert s["net_count"] == GOLDENS["net_count"]
    assert s["instance_count"] == GOLDENS["instance_count"]


def test_connectivity():
    g = build_connectivity()
    assert g["edge_count"] == GOLDENS["edge_count"]


def test_drivers():
    dl = drivers_and_loads()
    assert len(dl["by_net"]["z"]["drivers"]) == 2
    assert len(dl["by_net"]["y"]["drivers"]) == 1
    assert len(dl["by_net"]["float_n"]["drivers"]) == 0


def test_floating():
    f = find_floating_nets()
    assert f["count"] == GOLDENS["floating_count"]
    assert f["nets"] == GOLDENS["floating_nets"]


def test_undriven():
    u = find_undriven_inputs()
    assert u["count"] == GOLDENS["undriven_count"]
    assert u["hits"][0]["net"] == "float_n"


def test_multi():
    m = find_multi_driven()
    assert m["count"] == GOLDENS["multi_driven_count"]
    assert m["nets"] == GOLDENS["multi_driven_nets"]


def test_shorts():
    s = find_supply_shorts()
    assert s["count"] == GOLDENS["supply_short_count"]


def test_wells():
    w = find_well_errors()
    assert w["count"] == GOLDENS["well_error_count"]


def test_markers_engine():
    m = collect_markers()
    assert m["count"] == GOLDENS["marker_count"]
    eng = erc_engine()
    assert eng["ok"] is True
    cmp = erc_compare()
    assert cmp["ok"] is True
    assert cmp["marker_count"] == 5


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print("ok", name)
    print("ALL_OK")
