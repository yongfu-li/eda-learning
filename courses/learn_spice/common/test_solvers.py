#!/usr/bin/env python3
"""Golden smoke tests for learn_spice."""
from __future__ import annotations

import unittest

from solvers import (
    GOLDENS,
    build_mna_linear_dc,
    dc_linear_solve,
    device_callback_diode,
    diode_loop_newton,
    netlist_stats,
    newton_raphson_dc,
    sparse_lu_lite,
    spice_compare,
    spice_engine,
    transient_be,
)


class TestSpiceSolvers(unittest.TestCase):
    def test_stats(self):
        st = netlist_stats()
        self.assertEqual(st["element_count"], GOLDENS["element_count"])
        self.assertEqual(st["unknown_nodes"], GOLDENS["unknown_nodes"])

    def test_dc(self):
        r = dc_linear_solve()
        self.assertAlmostEqual(r["volts"]["1"], GOLDENS["v1_dc_linear"], places=9)
        self.assertAlmostEqual(r["volts"]["2"], GOLDENS["v2_dc_linear"], places=9)
        self.assertEqual(r["size"], GOLDENS["mna_size_dc_linear"])

    def test_mna_nnz(self):
        m = build_mna_linear_dc()
        lu = sparse_lu_lite(m["G"])
        self.assertEqual(lu["nnz"], GOLDENS["nnz_mna"])

    def test_nr_linear(self):
        r = newton_raphson_dc(include_diode=False)
        self.assertTrue(r["converged"])
        self.assertEqual(r["iters"], GOLDENS["nr_iters_linear"])
        self.assertAlmostEqual(r["v2"], 3.0, places=9)

    def test_diode_callback(self):
        cb = device_callback_diode(0.0)
        self.assertAlmostEqual(cb["i"], 0.0, places=15)

    def test_diode_nr(self):
        r = diode_loop_newton()
        self.assertEqual(r["converged"], GOLDENS["diode_nr_converged"])
        self.assertTrue(r["iters"] >= 1)

    def test_tran(self):
        tr = transient_be()
        self.assertEqual(len(tr["history"]), GOLDENS["tran_steps"])
        self.assertAlmostEqual(tr["final_v2"], GOLDENS["tran_final_v2"], places=5)

    def test_engine(self):
        e = spice_engine()
        self.assertTrue(e["ok"])
        self.assertAlmostEqual(e["dc_v2"], GOLDENS["engine_v2_dc"], places=9)
        self.assertTrue(e["diode"]["converged"])

    def test_compare(self):
        c = spice_compare()
        self.assertEqual(c["element_count"], 5)
        self.assertTrue(c["ok"])


if __name__ == "__main__":
    unittest.main()
