#!/usr/bin/env python3
"""Smoke tests for layout compaction solvers."""
from __future__ import annotations

import unittest
from pathlib import Path

from compactutil import load
from solvers import (
    add_jog,
    build_constraint_graph,
    compact_1d,
    compact_2d,
    compaction_compare,
    is_legal,
    layout_stats,
    longest_path_compact,
    sequential_compact,
    shear_channel_lite,
)

ROOT = Path(__file__).resolve().parent
DATA = load(ROOT / "tiny_compact.json")

# Documented goldens for tiny_compact.json
GOLDEN_INITIAL_WIDTH = 20
GOLDEN_INITIAL_HEIGHT = 6
GOLDEN_COMPACTED_WIDTH = 14
GOLDEN_MIN_GAP = 1


class TestCompaction(unittest.TestCase):
    def test_layout_stats(self) -> None:
        s = layout_stats(DATA)
        self.assertEqual(s["width"], GOLDEN_INITIAL_WIDTH)
        self.assertEqual(s["height"], GOLDEN_INITIAL_HEIGHT)
        self.assertEqual(s["object_count"], 4)

    def test_constraint_graph_x(self) -> None:
        g = build_constraint_graph(DATA, "x")
        self.assertEqual(g["axis"], "x")
        self.assertEqual(g["min_gap"], GOLDEN_MIN_GAP)
        self.assertGreaterEqual(len(g["edges"]), 5)
        self.assertIn("L_A", g["nodes"])
        self.assertIn("R_C", g["nodes"])

    def test_longest_path_compact_x(self) -> None:
        g = build_constraint_graph(DATA, "x")
        pos = longest_path_compact(g)
        self.assertAlmostEqual(pos["L_A"], 0.0)
        self.assertAlmostEqual(pos["R_A"], 4.0)
        self.assertAlmostEqual(pos["L_B"], 5.0)
        self.assertAlmostEqual(pos["R_B"], 9.0)
        self.assertAlmostEqual(pos["L_C"], 10.0)
        self.assertAlmostEqual(pos["R_C"], 14.0)

    def test_compact_1d_x(self) -> None:
        r = compact_1d(DATA, "x")
        self.assertTrue(r["improved"])
        self.assertEqual(r["before_span"], GOLDEN_INITIAL_WIDTH)
        self.assertEqual(r["after_span"], GOLDEN_COMPACTED_WIDTH)
        self.assertTrue(is_legal(r["layout"]))

    def test_compact_2d(self) -> None:
        r = compact_2d(DATA)
        self.assertTrue(r["width_improved"])
        self.assertEqual(r["initial_width"], GOLDEN_INITIAL_WIDTH)
        self.assertEqual(r["final_width"], GOLDEN_COMPACTED_WIDTH)
        self.assertTrue(is_legal(r["layout"]))

    def test_add_jog(self) -> None:
        wire = next(o for o in DATA["objects"] if o["id"] == "W")
        j = add_jog(dict(wire), 10, 8)
        self.assertTrue(j.get("stretched"))
        self.assertEqual(len(j["points"]), 3)

    def test_shear_channel_lite(self) -> None:
        r = shear_channel_lite(DATA, 8, 13, 1)
        self.assertIn("B", r["moved"])

    def test_sequential_compact(self) -> None:
        r = sequential_compact(DATA)
        self.assertTrue(r["improved"])
        self.assertTrue(r["legal"])
        self.assertEqual(r["final_width"], GOLDEN_COMPACTED_WIDTH)
        self.assertLess(r["final_width"], r["initial_width"])
        self.assertGreater(r["x_constraints"], 0)

    def test_compaction_compare(self) -> None:
        c = compaction_compare(DATA)
        self.assertGreater(c["width_delta"], 0)


if __name__ == "__main__":
    unittest.main()
