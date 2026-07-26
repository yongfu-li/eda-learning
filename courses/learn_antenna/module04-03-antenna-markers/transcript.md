# Antenna markers

**Module id:** module04-03-antenna-markers
**Lab:** antenna-markers
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Markers

Signoff antenna emits one marker per violating net (after diode).

## Slide 2 — The idea

GOLDEN: marker_count=1 on tiny_antenna.

<!-- algorithm-walkthrough -->

## Slide 3 — Violations

![Violations](assets/steps/01-viol.png)

Each ratio hit becomes a marker.

## Slide 4 — n1 marker

![n1 marker](assets/steps/02-n1m.png)

n1 ratio 25 > limit.

## Slide 5 — n3 skipped

![n3 skipped](assets/steps/03-n3skip.png)

n3 protected by diode — no marker.

## Slide 6 — Kind

![Kind](assets/steps/04-kind.png)

kind=antenna_ratio on each hit.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: marker_count=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **antenna-markers**. Run collect; confirm 1 marker.

## Slide 9 — Implement track

Call collect_markers(); assert count==1.

## Slide 10 — Pitfalls

Counting raw violations. Missing diode waiver.

## Slide 11 — Your turn

Next: antenna engine.
