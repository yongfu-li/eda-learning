# Sequential CEC lite

**Module id:** module03-05-sequential-cec
**Lab:** sequential-cec
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Sequential CEC

Sequential CEC asks whether two FSMs agree on all input sequences — we check 2 unroll steps as literacy.

## Slide 2 — The idea

sequential_cec_lite enumerates input sequences; spec vs impl_good match; impl_bad diverges when a matters.

<!-- algorithm-walkthrough -->

## Slide 3 — Good SEC

![Good SEC](assets/steps/01-good.png)

XOR impl matches OR-of-ANDs for 2 steps.

## Slide 4 — Bad SEC

![Bad SEC](assets/steps/02-bad.png)

NOT-q impl ignores a and fails within 2 steps.

## Slide 5 — Bounded only

![Bounded only](assets/steps/03-bound.png)

This is bounded SEC — not full infinite-horizon proof.

## Slide 6 — Same init

![Same init](assets/steps/04-init.png)

Both start from q=0.

## Slide 7 — Done

![Done](assets/steps/05-done.png)

Next: offline compare, then wrap toward formal / STA.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **sequential-cec**. Run 2-step SEC on good vs bad sequential pair.

## Slide 9 — Implement track

Call sequential_cec_lite(seq_spec, seq_good, 2) True; seq_bad False.

## Slide 10 — Pitfalls

Checking one reset cycle only. Comparing comb outputs without state update.

## Slide 11 — Your turn

Next: offline benchmark, then wrap.
