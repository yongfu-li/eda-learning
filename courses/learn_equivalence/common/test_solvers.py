#!/usr/bin/env python3
"""Smoke tests for equivalence solvers."""
from __future__ import annotations

import unittest
from pathlib import Path

from equivutil import evaluate_circuit, get_combo, load, truth_table
from solvers import (
    build_miter,
    combo_pair_report,
    dont_care_mask,
    encode_sat_cnf_lite,
    find_counterexample,
    fraig_lite,
    miter_output,
    sat_satisfiable,
    sequential_cec_lite,
    sequential_unroll,
    structural_hash_stats,
    truth_table_cec,
)

ROOT = Path(__file__).resolve().parent
DATA = load(ROOT / "tiny_equiv.json")
SPEC = get_combo(DATA, "spec")
GOOD = get_combo(DATA, "impl_good")
BAD = get_combo(DATA, "impl_bad")
SEQ_SPEC = DATA["sequential"]["spec"]
SEQ_GOOD = DATA["sequential"]["impl_good"]
SEQ_BAD = DATA["sequential"]["impl_bad"]


class TestCombinational(unittest.TestCase):
    def test_truth_table_eight_rows(self) -> None:
        tt = truth_table(SPEC)
        self.assertEqual(len(tt), 8)

    def test_spec_impl_good_equivalent(self) -> None:
        r = truth_table_cec(SPEC, GOOD)
        self.assertTrue(r["equivalent"])
        self.assertEqual(r["rows_checked"], 8)
        self.assertIsNone(r["counterexample"])

    def test_spec_impl_bad_not_equivalent(self) -> None:
        r = truth_table_cec(SPEC, BAD)
        self.assertFalse(r["equivalent"])
        cex = r["counterexample"]
        self.assertIsNotNone(cex)
        self.assertEqual(cex["a"], 1)
        self.assertEqual(cex["b"], 1)
        self.assertEqual(cex["c"], 0)

    def test_find_counterexample(self) -> None:
        cex = find_counterexample(SPEC, BAD)
        self.assertEqual(cex, {"a": 1, "b": 1, "c": 0})

    def test_miter_good_all_zero(self) -> None:
        miter = build_miter(SPEC, GOOD)
        for a in range(2):
            for b in range(2):
                for c in range(2):
                    out = miter_output(miter, {"a": a, "b": b, "c": c})
                    self.assertEqual(out, 0, f"miter nonzero at a={a} b={b} c={c}")

    def test_miter_bad_has_one(self) -> None:
        miter = build_miter(SPEC, BAD)
        self.assertEqual(miter_output(miter, {"a": 1, "b": 1, "c": 0}), 1)

    def test_structural_hash(self) -> None:
        s = structural_hash_stats(SPEC)
        self.assertEqual(s["total_gates"], 2)
        self.assertGreaterEqual(s["unique_hashes"], 2)
        f = fraig_lite(GOOD)
        self.assertIn("fraig_nodes", f)

    def test_cnf_lite(self) -> None:
        cnf = encode_sat_cnf_lite(SPEC)
        self.assertGreater(cnf["num_clauses"], 0)
        self.assertGreater(cnf["num_vars"], 3)

    def test_sat_satisfiable(self) -> None:
        cnf = encode_sat_cnf_lite(SPEC, assert_output=1)
        self.assertTrue(sat_satisfiable(cnf))

    def test_dont_care_mask(self) -> None:
        # c is don't-care (X): only check rows with c=0
        r = dont_care_mask(SPEC, BAD, {"a": -1, "b": -1, "c": 0})
        self.assertFalse(r["equivalent"])
        self.assertEqual(r["counterexample"]["c"], 0)


class TestSequential(unittest.TestCase):
    def test_unroll_two_steps(self) -> None:
        u = sequential_unroll(SEQ_SPEC, 2)
        self.assertEqual(u["steps"], 2)
        self.assertGreater(len(u["gates"]), 0)

    def test_sequential_good_equivalent_two_steps(self) -> None:
        r = sequential_cec_lite(SEQ_SPEC, SEQ_GOOD, steps=2)
        self.assertTrue(r["equivalent"])

    def test_sequential_bad_not_equivalent(self) -> None:
        r = sequential_cec_lite(SEQ_SPEC, SEQ_BAD, steps=2)
        self.assertFalse(r["equivalent"])


class TestReport(unittest.TestCase):
    def test_combo_pair_report(self) -> None:
        rep = combo_pair_report(DATA)
        self.assertEqual(rep["truth_table_rows"], 8)
        self.assertTrue(rep["spec_impl_good"])
        self.assertFalse(rep["spec_impl_bad"])
        self.assertTrue(rep["miter_good_all_zero"])


if __name__ == "__main__":
    unittest.main()
