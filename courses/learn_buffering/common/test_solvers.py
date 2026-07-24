#!/usr/bin/env python3
"""Smoke tests for buffering solvers."""
from __future__ import annotations

import unittest
from pathlib import Path

from bufutil import load, wire_rc
from solvers import (
    candidate_sites,
    dominate_prune,
    elmore_delay,
    estimate_slew,
    fanout_buffer_tree,
    polarity_fix,
    sequential_buffer,
    slew_driven_insert,
    slew_ok,
    van_ginneken_edge,
    van_ginneken_net,
)

ROOT = Path(__file__).resolve().parent
DATA = load(ROOT / "tiny_buf.json")


class TestBuffering(unittest.TestCase):
    def test_wire_rc(self) -> None:
        rc = wire_rc(4.0, 1.0, 1.0)
        self.assertAlmostEqual(rc["R"], 4.0)
        self.assertAlmostEqual(rc["C"], 4.0)

    def test_elmore(self) -> None:
        self.assertAlmostEqual(elmore_delay(2.0, 4.0, 1.0), 2.0 * (2.0 + 1.0))

    def test_candidates(self) -> None:
        sites = candidate_sites(DATA, step=2.0)
        self.assertGreater(len(sites), 0)

    def test_dominate_prune(self) -> None:
        opts = [
            {"c": 5.0, "d": 10.0},
            {"c": 6.0, "d": 9.0},
            {"c": 7.0, "d": 11.0},  # dominated
            {"c": 4.0, "d": 12.0},
        ]
        kept = dominate_prune(opts)
        self.assertTrue(all(o["d"] <= 12.0 for o in kept))
        self.assertFalse(any(o["c"] == 7.0 and o["d"] == 11.0 for o in kept))

    def test_van_ginneken_improves_or_equals(self) -> None:
        r = van_ginneken_net(DATA)
        self.assertIn("best_delay", r)
        self.assertLessEqual(r["best_delay"], r["wire_delay"] + 1e-6)

    def test_vg_edge_has_options(self) -> None:
        r = van_ginneken_edge(8.0, 2.0, DATA["buffer_library"])
        self.assertGreaterEqual(len(r["options"]), 1)
        self.assertIn("d", r["best"])

    def test_slew_driven(self) -> None:
        # Lower limit to force insertions
        data = dict(DATA)
        data["slew_limit"] = 1.0
        r = slew_driven_insert(data)
        self.assertGreaterEqual(r["count"], 1)

    def test_slew_ok(self) -> None:
        self.assertTrue(slew_ok(5.0, 8.0))
        self.assertFalse(slew_ok(9.0, 8.0))
        self.assertGreater(estimate_slew(2.0, 3.0), 0)

    def test_polarity(self) -> None:
        lib = {b["id"]: b for b in DATA["buffer_library"]}
        r = polarity_fix([{"buf": "INV_X1"}, {"buf": "BUF_X1"}], lib)
        self.assertEqual(r["flips"], 1)
        self.assertFalse(r["positive"])

    def test_fanout_and_sequential(self) -> None:
        f = fanout_buffer_tree(DATA, max_fanout=2)
        self.assertTrue(f["inserted"])  # 3 sinks > 2
        seq = sequential_buffer(DATA, mode="van_ginneken")
        self.assertEqual(len(seq["sites"]), len(candidate_sites(DATA)))
        self.assertIn("van_ginneken", seq)


if __name__ == "__main__":
    unittest.main()
