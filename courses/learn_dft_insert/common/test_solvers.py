"""Golden smoke tests for learn_dft_insert solvers."""
from __future__ import annotations

from solvers import (
    GOLDENS,
    collect_markers,
    design_stats,
    dft_compare,
    dft_engine,
    find_lockups,
    identify_scan_flops,
    netlist_transform,
    scan_enable_port,
    scan_order_check,
    stitch_chain,
)


def test_stats():
    s = design_stats()
    assert s["flop_count"] == GOLDENS["flop_count"]
    assert s["domain_count"] == GOLDENS["domain_count"]


def test_scan_flops():
    c = identify_scan_flops()
    assert c["count"] == GOLDENS["scan_cell_count"]
    assert all(x["type"] == "SDFF" for x in c["cells"])


def test_ports():
    p = scan_enable_port()
    assert p["se"] == "scan_enable"
    assert p["si"] == "scan_in"


def test_stitch():
    st = stitch_chain()
    assert st["stitch_count"] == GOLDENS["stitch_count"]
    assert st["order"] == ["f1", "f2", "f3", "f4"]


def test_order():
    o = scan_order_check()
    assert o["length"] == GOLDENS["chain_length"]
    assert o["covers_all"] is True


def test_lockup():
    luk = find_lockups()
    assert luk["count"] == GOLDENS["lockup_count"]
    assert luk["hits"][0]["from"] == "f3" and luk["hits"][0]["to"] == "f4"


def test_transform():
    xf = netlist_transform()
    assert xf["edge_count"] == GOLDENS["transform_edge_count"]
    assert xf["lockup_count"] == 1


def test_markers_engine():
    m = collect_markers()
    assert m["count"] == GOLDENS["marker_count"]
    eng = dft_engine()
    assert eng["ok"] is True
    assert dft_compare()["ok"] is True


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print("ok", name)
    print("ALL_OK")
