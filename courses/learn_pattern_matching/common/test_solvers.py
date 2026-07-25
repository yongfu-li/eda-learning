#!/usr/bin/env python3
"""Golden smoke tests for learn_pattern_matching Track A solvers."""
from __future__ import annotations

import unittest

from solvers import (
    GOLDENS,
    emit_markers,
    geometry_stats,
    layered_boolean,
    match_enclosure,
    match_engine,
    match_space,
    match_width,
    multi_layer_interactions,
    multi_layer_via_check,
    pattern_compare,
    scanline_events,
)


class TestPatternSolvers(unittest.TestCase):
    def test_geometry(self):
        st = geometry_stats()
        self.assertEqual(st["shape_count"], GOLDENS["shape_count"])
        self.assertEqual(st["layer_count"], GOLDENS["layer_count"])
        self.assertEqual(st["edge_count"], GOLDENS["edge_count"])
        self.assertEqual(st["m1_shape_count"], GOLDENS["m1_shape_count"])

    def test_width(self):
        m = match_width()
        self.assertEqual(len(m), GOLDENS["width_markers"])
        self.assertEqual(m[0]["shapes"], ["D"])

    def test_space(self):
        m = match_space(layer="M1")
        self.assertEqual(len(m), GOLDENS["space_markers"])
        self.assertEqual(set(m[0]["shapes"]), {"A", "B"})

    def test_enclosure_m1_ok(self):
        self.assertEqual(match_enclosure(outer_layer="M1"), [])

    def test_enclosure_m2_fail(self):
        m = match_enclosure(outer_layer="M2")
        self.assertEqual(len(m), GOLDENS["enclosure_markers"])

    def test_scanline(self):
        ev = scanline_events(layer="M1")
        self.assertEqual(len(ev), GOLDENS["m1_shape_count"] * 2)

    def test_emit_markers(self):
        m = emit_markers()
        self.assertGreaterEqual(len(m), GOLDENS["width_markers"] + GOLDENS["space_markers"])

    def test_via_multi(self):
        r = multi_layer_via_check()
        self.assertTrue(r["m1_ok"])
        self.assertFalse(r["m2_ok"])
        self.assertEqual(r["enclosure_markers"], 1)

    def test_interactions(self):
        pairs = multi_layer_interactions()
        # V overlaps A (M1); V may not overlap C (M2)
        self.assertGreaterEqual(len(pairs), 1)
        ids = {tuple(sorted(p["shapes"])) for p in pairs}
        self.assertIn(("A", "V"), ids)

    def test_boolean(self):
        hits = layered_boolean(mode="and_not")
        self.assertEqual(len(hits), GOLDENS["boolean_and_hits"])
        self.assertEqual(hits[0]["shape"], "V")

    def test_engine(self):
        eng = match_engine()
        self.assertEqual(eng["count"], GOLDENS["match_engine_markers"])
        self.assertEqual(eng["width"], 1)
        self.assertEqual(eng["space"], 1)
        self.assertEqual(eng["enclosure"], 1)

    def test_compare(self):
        c = pattern_compare()
        self.assertEqual(c["marker_count"], 3)
        self.assertEqual(c["shape_count"], 5)


if __name__ == "__main__":
    unittest.main()
