# GDS vocabulary

**Module id:** module06-03-gds-vocab
**Lab:** gds-vocab

## Slide 1 — Why real KLayout

Name layer numbers and shape vocabulary.

## Slide 2 — The idea

GOLDEN: layer_count=2; shape_count=2; dbu=0.001.

<!-- algorithm-walkthrough -->

## Slide 3 — poly=66

![poly=66](assets/steps/01-poly.png)

poly layer number 66.

## Slide 4 — metal1=68

![metal1=68](assets/steps/02-m1.png)

metal1 layer number 68.

## Slide 5 — DBU

![DBU](assets/steps/03-dbu.png)

Database unit 0.001 µm.

## Slide 6 — Two shapes

![Two shapes](assets/steps/04-shapes.png)

p0 and m0 rectangles.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: layer_count=2 shape_count=2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **gds-vocab**.

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
layer_count=2; shape_count=2; dbu=0.001.
ok if goldens match
```

## Slide 13 — Next

Continue Part B evidence track.
