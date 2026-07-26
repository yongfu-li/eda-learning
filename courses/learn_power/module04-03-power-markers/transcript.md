# Power markers

**Module id:** module04-03-power-markers
**Lab:** power-markers
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why markers

Signoff power/IR emits markers for IR drop and EM hits.

## Slide 2 — The idea

GOLDEN: marker_count=4.

<!-- algorithm-walkthrough -->

## Slide 3 — IR marker

![IR marker](assets/steps/01-ir.png)

One IR drop hit at sink.

## Slide 4 — EM markers

![EM markers](assets/steps/02-em.png)

Three EM hits on e1,e2,e3.

## Slide 5 — Marker kinds

![Marker kinds](assets/steps/03-kind.png)

kind=ir_drop or em on each hit.

## Slide 6 — Collect all

![Collect all](assets/steps/04-collect.png)

Union IR + EM markers for signoff.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: marker_count=4.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **power-markers**. Run collect; confirm 4 markers.

## Slide 9 — Implement track

Call collect_markers(); assert count==4.

## Slide 10 — Pitfalls

Counting only IR. Missing EM edges.

## Slide 11 — Your turn

Next: power engine.
