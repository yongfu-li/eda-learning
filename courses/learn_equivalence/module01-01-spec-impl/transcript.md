# Spec vs implementation

**Module id:** module01-01-spec-impl
**Lab:** spec-impl
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Spec vs impl

Equivalence checking always compares two circuits: a golden spec and a candidate implementation.

## Slide 2 — The idea

Spec computes f=(a∧b)∨c with two gates; impl_good rewrites with De Morgan; impl_bad uses (a∧b)∧c — same PIs, different logic.

<!-- algorithm-walkthrough -->

## Slide 3 — Spec netlist

![Spec netlist](assets/steps/01-spec.png)

Spec computes f = (a∧b)∨c with two gates.

## Slide 4 — Good rewrite

![Good rewrite](assets/steps/02-good.png)

Impl good is a De Morgan form of the same function.

## Slide 5 — Bad rewrite

![Bad rewrite](assets/steps/03-bad.png)

Impl bad uses (a∧b)∧c — wrong when c=0.

## Slide 6 — Eval at cex

![Eval at cex](assets/steps/04-eval.png)

At a=1,b=1,c=0: spec=1, good=1, bad=0.

## Slide 7 — CEC goal

![CEC goal](assets/steps/05-goal.png)

Prove good ≡ spec; find a witness that bad ≢ spec.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **spec-impl**. Compare spec vs impl_good vs impl_bad truth tables side by side.

## Slide 9 — Implement track

Load tiny_equiv.json; call evaluate_circuit on spec and both impls for all 8 rows.

## Slide 10 — Pitfalls

Swapping spec and impl. Comparing only one input corner.

## Slide 11 — Your turn

Next: build the miter (XOR of outputs).
