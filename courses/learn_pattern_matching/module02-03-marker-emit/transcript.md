# Marker emit

**Module id:** module02-03-marker-emit
**Lab:** marker-emit
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Markers

A marker is a typed hit (width/space/…) pointing at shapes — DRC later maps markers to violations.

## Slide 2 — The idea

emit_markers combines width and space → at least 2 markers (D + A–B).

<!-- algorithm-walkthrough -->

## Slide 3 — Types

![Types](assets/steps/01-types.png)

Markers carry type, layer, shapes, value, limit.

## Slide 4 — Width hit

![Width hit](assets/steps/02-w.png)

Width marker on D.

## Slide 5 — Space hit

![Space hit](assets/steps/03-s.png)

Space marker on A,B.

## Slide 6 — List

![List](assets/steps/04-list.png)

emit_markers returns the combined list.

## Slide 7 — Count

![Count](assets/steps/05-n.png)

At least 2 single-layer markers.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **marker-emit**. Run Emit markers; confirm ≥2 markers.

## Slide 9 — Implement track

Call emit_markers(); assert len >= 2.

## Slide 10 — Pitfalls

Dropping value/limit fields. Mixing multi-layer into emit early.

## Slide 11 — Your turn

Next: multi-layer via enclosure.
