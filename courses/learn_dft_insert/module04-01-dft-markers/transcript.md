# DFT markers

**Module id:** module04-01-dft-markers
**Lab:** dft-markers
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why markers

Signoff DFT emits markers for required lockups on domain crossings.

## Slide 2 — The idea

GOLDEN: marker_count=1.

<!-- algorithm-walkthrough -->

## Slide 3 — Lockup marker

![Lockup marker](assets/steps/01-kind.png)

kind=lockup on domain crossings.

## Slide 4 — d0→d1 hit

![d0→d1 hit](assets/steps/02-cross.png)

Marker on f3→f4 crossing.

## Slide 5 — Collect

![Collect](assets/steps/03-collect.png)

Union lockup hits for signoff.

## Slide 6 — Report

![Report](assets/steps/04-report.png)

One marker required for this toy.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: marker_count=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **dft-markers**. Run collect; confirm 1 marker.

## Slide 9 — Implement track

Call collect_markers(); assert count==1.

## Slide 10 — Pitfalls

Counting stitches as markers. Missing domain cross.

## Slide 11 — Your turn

Next: scan chain view.
