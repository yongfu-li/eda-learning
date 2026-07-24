# Welcome to equivalence checking

**Module id:** module00-00-intro
**Tracks:** A

## Slide 1 — Hook

After synthesis you must prove the netlist matches the spec — equivalence checking is the formal backbone of ECO and signoff.

## Slide 2 — The idea

This course uses tiny_equiv: spec f=(a∧b)∨c over PIs a,b,c; impl_good De Morgan equivalent; impl_bad differs at a=1,b=1,c=0; sequential XOR pair for unroll/SEC lite.

## Slide 3 — What you will do

Explain combinational and sequential equivalence: spec vs impl, miter, truth-table CEC, SAT lite, counterexamples.

## Slide 4 — Pitfalls

Skipping goldens on tiny_equiv (8 rows, cex a=1,b=1,c=0).

## Slide 5 — Your turn

Complete the checklist.

## Slide 6 — Next

Continue the path.
