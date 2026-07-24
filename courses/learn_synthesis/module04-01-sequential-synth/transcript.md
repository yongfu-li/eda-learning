# Sequential synthesis pass

**Module id:** module04-01-sequential-synth
**Lab:** sequential-synth
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Sequential

A full pass chains cleanup and mapping like a tiny ABC script.

## Slide 2 — The idea

sequential_synth returns stats, strash size, rewrite, cuts, mapping, tradeoff.

<!-- algorithm-walkthrough -->

## Slide 3 — Pipeline

![Pipeline](assets/steps/01-pipe.png)

One click runs the full toy flow.

## Slide 4 — Stats

![Stats](assets/steps/02-stats.png)

PI/AND/PO match goldens.

## Slide 5 — Map

![Map](assets/steps/03-map.png)

Orange cells after sequential synth.

## Slide 6 — Area

![Area](assets/steps/04-area.png)

Mapped area is positive.

## Slide 7 — Done

![Done](assets/steps/05-done.png)

Next: offline compare, then wrap toward STA.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **sequential-synth**. Click Sequential synth; confirm area and cuts.

## Slide 9 — Implement track

Call sequential_synth(data); assert mapping.area > 0.

## Slide 10 — Pitfalls

Skipping strash. Mixing delay and area covers without clearing.

## Slide 11 — Your turn

Next: offline benchmark, then wrap.
