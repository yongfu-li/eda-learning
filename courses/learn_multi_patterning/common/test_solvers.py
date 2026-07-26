#!/usr/bin/env python3
"""Golden smoke tests for learn_multi_patterning."""
from __future__ import annotations

import unittest

from solvers import (
    GOLDENS,
    build_conflict_graph,
    geometry_stats,
    lele_double,
    mp_compare,
    mp_engine,
    path_lele,
    quad_pattern,
    sadp_assign,
    stitch_feature,
    triple_pattern,
)


class TestMpSolvers(unittest.TestCase):
    def test_geometry(self):
        st = geometry_stats()
        self.assertEqual(st["feature_count"], GOLDENS["feature_count"])

    def test_conflicts(self):
        g = build_conflict_graph()
        self.assertEqual(g["edge_count"], GOLDENS["conflict_edges"])

    def test_dp_fails(self):
        self.assertFalse(lele_double()["ok"])
        self.assertEqual(lele_double()["ok"], GOLDENS["dp_colorable"])

    def test_path_dp(self):
        self.assertTrue(path_lele()["ok"])
        self.assertEqual(path_lele()["ok"], GOLDENS["path_dp_colorable"])

    def test_tp(self):
        r = triple_pattern()
        self.assertTrue(r["ok"])
        self.assertEqual(r["colors_used"], GOLDENS["tp_colors_used"])

    def test_qp(self):
        r = quad_pattern()
        self.assertTrue(r["ok"])
        self.assertLessEqual(r["colors_used"], 4)
        self.assertEqual(r["colors_used"], GOLDENS["qp_colors_used"])

    def test_sadp(self):
        r = sadp_assign()
        self.assertEqual(r["mandrel_count"], GOLDENS["sadp_mandrel_count"])

    def test_stitch(self):
        r = stitch_feature()
        self.assertTrue(r["dp_ok"])
        self.assertEqual(r["dp_ok"], GOLDENS["stitch_makes_dp"])

    def test_engine(self):
        e = mp_engine()
        self.assertEqual(e["best_masks"], GOLDENS["engine_best_masks"])
        self.assertFalse(e["dp_ok"])
        self.assertTrue(e["tp_ok"])

    def test_compare(self):
        c = mp_compare()
        self.assertEqual(c["conflict_edges"], 5)
        self.assertEqual(c["best_masks"], 3)


if __name__ == "__main__":
    unittest.main()
