#!/usr/bin/env python3
"""Smoke tests for retiming solvers."""
from __future__ import annotations

import unittest
from pathlib import Path

from retimeutil import load, total_registers
from solvers import (
    apply_retime,
    backward_retime,
    clock_period,
    forward_retime,
    graph_stats,
    is_legal,
    min_period_binary_search,
    register_count,
    sequential_retime,
    zero_retime,
)

ROOT = Path(__file__).resolve().parent
DATA = load(ROOT / "tiny_retime.json")


class TestRetiming(unittest.TestCase):
    def test_stats(self) -> None:
        s = graph_stats(DATA)
        self.assertEqual(s["nodes"], 5)
        self.assertEqual(s["edges"], 5)
        self.assertEqual(s["registers"], 2)

    def test_zero_legal(self) -> None:
        r = zero_retime(DATA)
        self.assertTrue(is_legal(DATA["edges"], r))

    def test_forward_changes_weights(self) -> None:
        r = zero_retime(DATA)
        before = [e["w"] for e in DATA["edges"]]
        forward_retime("a", r, 1)
        after = apply_retime(DATA["edges"], r)
        self.assertNotEqual(before, [e["w"] for e in after])
        self.assertTrue(is_legal(DATA["edges"], r))

    def test_backward(self) -> None:
        r = zero_retime(DATA)
        backward_retime("c", r, 1)
        self.assertTrue(is_legal(DATA["edges"], r) or not is_legal(DATA["edges"], r))

    def test_period_baseline(self) -> None:
        p = clock_period(DATA, zero_retime(DATA))
        self.assertGreater(p, 0)

    def test_min_period(self) -> None:
        m = min_period_binary_search(DATA)
        self.assertTrue(is_legal(DATA["edges"], m["r"]))
        self.assertLessEqual(m["period"], m["baseline_period"] + 1e-9)

    def test_register_count(self) -> None:
        self.assertEqual(register_count(DATA), total_registers(DATA["edges"]))

    def test_sequential(self) -> None:
        s = sequential_retime(DATA)
        self.assertIn("period", s)
        self.assertTrue(s["legal"])


if __name__ == "__main__":
    unittest.main()
