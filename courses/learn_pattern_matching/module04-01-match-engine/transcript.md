# Match engine pass

**Module id:** module04-01-match-engine
**Lab:** match-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Engine

A tiny match engine chains single-layer and multi-layer patterns into one marker list.

## Slide 2 — The idea

GOLDEN match_engine_markers=3 (width 1 + space 1 + enclosure 1).

<!-- algorithm-walkthrough -->

## Slide 3 — Pipeline

![Pipeline](assets/steps/01-pipe.png)

Width → space → via enclosure.

## Slide 4 — Width

![Width](assets/steps/02-w.png)

One width marker.

## Slide 5 — Space

![Space](assets/steps/03-s.png)

One space marker.

## Slide 6 — Encl

![Encl](assets/steps/04-e.png)

One enclosure marker.

## Slide 7 — Total

![Total](assets/steps/05-n.png)

count=3 on tiny_patterns.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **match-engine**. Run Match engine; confirm count=3.

## Slide 9 — Implement track

Call match_engine(); assert count==3.

## Slide 10 — Pitfalls

Stopping after width only. Double-counting boolean as DRC markers.

## Slide 11 — Your turn

Next: offline compare, then wrap.
