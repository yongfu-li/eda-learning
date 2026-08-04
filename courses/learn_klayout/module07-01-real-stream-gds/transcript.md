# Real stream GDS

**Module id:** module07-01-real-stream-gds
**Lab:** real-stream-gds

## Slide 1 — Why real KLayout

Stream tiny_rect.gds with two shapes.

## Slide 2 — The idea

GOLDEN: shape_count=2; stream_ok=True; cell=tiny_rect.

<!-- algorithm-walkthrough -->

## Slide 3 — tiny_rect.gds

![tiny_rect.gds](assets/steps/01-gds.png)

Stream tiny_rect.gds — 2 shapes.

## Slide 4 — Cell name

![Cell name](assets/steps/02-cell.png)

Cell name tiny_rect.

## Slide 5 — Layer map

![Layer map](assets/steps/03-layers.png)

poly and metal1 from layer map.

## Slide 6 — stream ok

![stream ok](assets/steps/04-ok.png)

Stream completes without error.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: shape_count=2 stream_ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **real-stream-gds**.

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
shape_count=2; stream_ok=True; cell=tiny_rect.
ok if goldens match
```

## Slide 13 — Next

Continue Part B evidence track.
