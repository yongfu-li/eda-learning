# Real Netgen evidence

**Module id:** module08-03-netgen-evidence
**Lab:** netgen-evidence

## Slide 1 — Why real Netgen

Run the full real Netgen engine against goldens.

## Slide 2 — The idea

GOLDEN: real_netgen_engine ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Full recipe

![Full recipe](assets/steps/01-recipe.png)

Golden recipe has six Tcl stages.

## Slide 4 — Read golden

![Read golden](assets/steps/02-read.png)

Still 2 sch + 2 lay devices.

## Slide 5 — Compare golden

![Compare golden](assets/steps/03-cmp.png)

Still 4 matched nets.

## Slide 6 — Report golden

![Report golden](assets/steps/04-rep.png)

Still mismatch=0.

## Slide 7 — Engine

![Engine](assets/steps/05-golden.png)

GOLDEN: real_netgen_engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **netgen-evidence**.

## Slide 9 — Implement track

Run real_solvers.py — REAL_NETGEN_OK.

## Slide 10 — Pitfalls

Editing goldens without re-running scripts.

## Slide 11 — Try these

From the common folder, run the real Netgen self-test.

```bash
cd courses/learn_netgen/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
real_netgen_engine ok=True.
ok if goldens match
```

## Slide 13 — Next

Continue Part B evidence track.
