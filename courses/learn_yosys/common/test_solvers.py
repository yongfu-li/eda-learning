"""Golden smoke tests for learn_yosys solvers."""
from __future__ import annotations

from solvers import (
    GOLDENS,
    design_stats,
    pass_aig_strash,
    pass_hierarchy_flatten,
    pass_opt_dce,
    pass_proc,
    pass_rewrite,
    pass_techmap,
    report_stats,
    yosys_compare,
    yosys_engine,
)


def test_stats():
    s = design_stats()
    assert s["cell_count"] == GOLDENS["rtl_cell_count"]
    assert s["module_count"] == GOLDENS["module_count"]


def test_proc_flatten_opt():
    assert pass_proc()["cell_count"] == 6
    assert pass_hierarchy_flatten()["module_count"] == 1
    assert pass_opt_dce()["cell_count"] == GOLDENS["after_opt_cells"]


def test_strash_rewrite():
    assert pass_aig_strash()["cell_count"] == GOLDENS["after_strash_cells"]
    rw = pass_rewrite()
    assert rw["cell_count"] == GOLDENS["after_rewrite_cells"]
    assert rw["comb_count"] == GOLDENS["after_rewrite_comb"]


def test_techmap():
    assert pass_techmap(mode="area")["nand_count"] == GOLDENS["techmap_nand_count_area"]
    assert pass_techmap(mode="delay")["nand_count"] == GOLDENS["techmap_nand_count_delay"]


def test_report_engine():
    r = report_stats()
    assert r["cell_count"] == GOLDENS["report_cells_synth"]
    assert r["wire_count"] == GOLDENS["report_wires_synth"]
    eng = yosys_engine()
    assert eng["ok"] is True
    assert yosys_compare()["ok"] is True


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print("ok", name)
    print("ALL_OK")
