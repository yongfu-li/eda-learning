#!/usr/bin/env python3
"""Smoke tests for clock tree synthesis solvers."""
from __future__ import annotations

import unittest
from pathlib import Path

from ctsutil import load, manhattan, sink_points
from solvers import (
    buffered_latencies,
    h_tree,
    insert_buffers,
    latency,
    mmm_tree,
    sequential_cts,
    skew,
    skew_bound_ok,
    tapping_points,
    zero_skew_merge,
)

ROOT = Path(__file__).resolve().parent
DATA = load(ROOT / "tiny_cts.json")


class TestClockTree(unittest.TestCase):
    def test_sink_points(self) -> None:
        pts = sink_points(DATA["placement"], DATA["sinks"])
        self.assertEqual(len(pts), 6)
        self.assertEqual(pts[0]["id"], "A")
        self.assertEqual(pts[0]["x"], 1)

    def test_mmm_connects_all_sinks(self) -> None:
        sinks = sink_points(DATA["placement"], DATA["sinks"])
        tree = mmm_tree(DATA["clock_source"], sinks)
        edges = tree["edges"]
        self.assertGreater(len(edges), 0)
        endpoints = set()
        for a, b in edges:
            endpoints.add(a)
            endpoints.add(b)
        for s in sinks:
            sp = (s["x"], s["y"])
            self.assertIn(sp, endpoints)

    def test_h_tree_covers_bbox(self) -> None:
        tree = h_tree(DATA["clock_source"], DATA["chip"])
        edges = tree["edges"]
        self.assertGreater(len(edges), 2)
        xs: list[float] = []
        ys: list[float] = []
        for a, b in edges:
            xs.extend([a[0], b[0]])
            ys.extend([a[1], b[1]])
        self.assertLessEqual(min(xs), 0.0 + 1e-6)
        self.assertGreaterEqual(max(xs), DATA["chip"]["W"] - 1e-6)
        self.assertLessEqual(min(ys), 0.0 + 1e-6)
        self.assertGreaterEqual(max(ys), DATA["chip"]["H"] - 1e-6)

    def test_zero_skew_merge_balances(self) -> None:
        a = (1.0, 1.0)
        b = (9.0, 1.0)
        da, db = 0.0, 0.0
        m = zero_skew_merge(a, b, da, db)
        la = da + manhattan(a, m)
        lb = db + manhattan(b, m)
        self.assertAlmostEqual(la, lb, places=3)

    def test_buffering_reduces_effective_span(self) -> None:
        edge = ((0.0, 0.0), (10.0, 0.0))
        sub, bufs = insert_buffers(edge, max_span=4.0, buffer_delay=2.0)
        self.assertGreater(len(sub), 1)
        self.assertGreater(len(bufs), 0)
        max_seg = max(manhattan(a, b) for a, b in sub)
        self.assertLessEqual(max_seg, 4.0 + 1e-6)

    def test_sequential_skew_on_spread(self) -> None:
        result = sequential_cts(DATA, mode="mmm")
        self.assertIn("latencies", result)
        self.assertEqual(len(result["latencies"]), 6)
        # Golden: MMM wire skew on spread is finite and within documented bound.
        self.assertLessEqual(
            result["skew"],
            10.0,
            msg=f"skew={result['skew']} latencies={result['latencies']}",
        )

    def test_tapping_points_internal(self) -> None:
        sinks = sink_points(DATA["placement"], DATA["sinks"])
        tree = mmm_tree(DATA["clock_source"], sinks)
        taps = tapping_points(tree)
        self.assertGreater(len(taps), 0)

    def test_latency_and_skew(self) -> None:
        path = [(0.0, 0.0), (3.0, 0.0), (3.0, 4.0)]
        self.assertAlmostEqual(latency(path, 1.0), 7.0)
        self.assertAlmostEqual(skew({"A": 1.0, "B": 4.0}), 3.0)
        self.assertTrue(skew_bound_ok({"A": 1.0, "B": 1.5}, 1.0))


if __name__ == "__main__":
    unittest.main()
