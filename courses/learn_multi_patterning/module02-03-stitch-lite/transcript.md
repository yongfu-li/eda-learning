# Stitch lite (break odd cycle)

**Module id:** module02-03-stitch-lite
**Lab:** stitch-lite
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Stitch overview

Stitching splits a feature so conflicts drop — restoring DP feasibility without extra masks.

## Slide 2 — The idea

GOLDEN: stitch_makes_dp True after splitting C → C1, C2.

<!-- algorithm-walkthrough -->

## Slide 3 — Odd cycle

![Odd cycle](assets/steps/01-odd.png)

Triangle blocks DP.

## Slide 4 — Split C

![Split C](assets/steps/02-split.png)

Replace C with C1 and C2.

## Slide 5 — New edges

![New edges](assets/steps/03-new.png)

Conflict graph changes.

## Slide 6 — Re-color

![Re-color](assets/steps/04-re.png)

2-color the stitched layout.

## Slide 7 — DP OK

![DP OK](assets/steps/05-ok.png)

GOLDEN stitch makes DP ok.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **stitch-lite**. Run stitch; confirm dp_ok=True.

## Slide 9 — Implement track

Call stitch_feature('C'); assert dp_ok is True.

## Slide 10 — Pitfalls

Splitting without reducing conflicts. Assuming stitch always needs TP.

## Slide 11 — Your turn

Next: triple patterning with 3 colors.
