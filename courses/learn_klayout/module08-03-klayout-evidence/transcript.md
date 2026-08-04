# Real KLayout evidence

**Module id:** module08-03-klayout-evidence
**Lab:** klayout-evidence

## Slide 1 — Why real KLayout

Run the full real KLayout engine against goldens.

## Slide 2 — The idea

GOLDEN: real_klayout_engine ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Full recipe

![Full recipe](assets/steps/01-recipe.png)

Golden recipe has five stages.

## Slide 4 — Stream golden

![Stream golden](assets/steps/02-stream.png)

Still 2 shapes streamed.

## Slide 5 — DRC golden

![DRC golden](assets/steps/03-drc.png)

Still 1 width violation.

## Slide 6 — Markers golden

![Markers golden](assets/steps/04-mark.png)

Still 1 marker.

## Slide 7 — Engine

![Engine](assets/steps/05-golden.png)

GOLDEN: real_klayout_engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **klayout-evidence**.

## Slide 9 — Implement track

Run real_solvers.py — REAL_KLAYOUT_OK.

## Slide 10 — Pitfalls

Editing goldens without re-running scripts.

## Slide 11 — Try these

From the common folder, run the real KLayout self-test.

```bash
cd courses/learn_klayout/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
real_klayout_engine ok=True.
ok if goldens match
```

## Slide 13 — Next

Continue Part B evidence track.
