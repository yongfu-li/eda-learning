# Scope

**In:** Spec vs implementation, miter (XOR outputs), exhaustive truth-table CEC, structural hashing / FRAIG-lite, SAT/CNF encoding lite, counterexamples, don't-care masks, sequential unrolling, inductive sequential CEC lite.

**Out:** Full industrial engines (Conformal/Formality/Jasper), k-induction proofs, UIF/PI, word-level EC, equivalence after aggressive optimization — see formal verification flows.

**Toy instance:** `common/tiny_equiv.json` — comb spec f=(a∧b)∨c; impl_good equivalent; impl_bad cex a=1,b=1,c=0; sequential XOR pair for 2-step SEC lite.
