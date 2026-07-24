#!/usr/bin/env python3
"""Smoke tests for synthesis solvers."""
from __future__ import annotations

import unittest
from pathlib import Path

from solvers import (
    aig_stats,
    apply_inverter_push,
    area_delay_tradeoff,
    build_strash_table,
    enumerate_cuts,
    eval_aig,
    local_rewrite_count,
    output_value,
    sequential_synth,
    techmap_area,
)
from synthutil import load, primary_inputs

ROOT = Path(__file__).resolve().parent
DATA = load(ROOT / "tiny_synth.json")


class TestSynthesis(unittest.TestCase):
    def test_stats(self) -> None:
        s = aig_stats(DATA)
        self.assertEqual(s["pi"], 3)
        self.assertEqual(s["and"], 4)
        self.assertEqual(s["po"], 1)

    def test_eval_truth(self) -> None:
        # f = (~(a&b) & c) & (a&c) — quick checks
        self.assertEqual(output_value(DATA, {"a": 0, "b": 0, "c": 0}), 0)
        self.assertEqual(output_value(DATA, {"a": 1, "b": 0, "c": 1}), 1)
        self.assertEqual(output_value(DATA, {"a": 1, "b": 1, "c": 1}), 0)

    def test_strash(self) -> None:
        table = build_strash_table(DATA)
        self.assertEqual(len(table), 4)

    def test_cuts(self) -> None:
        cuts = enumerate_cuts(DATA, k=3)
        self.assertIn(1, cuts)
        self.assertGreaterEqual(len(cuts[7]), 1)
        self.assertTrue(all(len(c) <= 3 for cs in cuts.values() for c in cs))

    def test_rewrite(self) -> None:
        r = local_rewrite_count(DATA)
        self.assertGreaterEqual(r["count"], 1)
        inv = apply_inverter_push(DATA)
        self.assertIsInstance(inv["applied"], int)

    def test_techmap_area(self) -> None:
        m = techmap_area(DATA)
        self.assertGreater(m["area"], 0)
        self.assertEqual(len(m["mapping"]), 4)

    def test_tradeoff(self) -> None:
        t = area_delay_tradeoff(DATA)
        self.assertEqual(t["library_size"], 6)

    def test_sequential(self) -> None:
        s = sequential_synth(DATA)
        self.assertEqual(s["stats"]["and"], 4)
        self.assertGreater(s["mapping"]["area"], 0)

    def test_pis(self) -> None:
        self.assertEqual(len(primary_inputs(DATA)), 3)
        vals = eval_aig(DATA, {"a": 1, "b": 1, "c": 0})
        self.assertIn(7, vals)


if __name__ == "__main__":
    unittest.main()
