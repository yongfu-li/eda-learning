# Geometry load

**Module id:** module01-01-geometry-load
**Lab:** geometry-load
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Geometry load

PEX starts from annotated layout segments — layers, nets, and segment ids.

## Slide 2 — The idea

GOLDEN: 4 segments, 3 layers.

<!-- algorithm-walkthrough -->

## Slide 3 — Segments

![Segments](assets/steps/01-segments.png)

Four wire/via segments on net n1: s1, s2, v1, s3.

## Slide 4 — Layers

![Layers](assets/steps/02-layers.png)

Three layers: M1, VIA, M2.

## Slide 5 — Nets

![Nets](assets/steps/03-nets.png)

Single net n1 with ports in and out.

## Slide 6 — Ids

![Ids](assets/steps/04-ids.png)

Segment ids s1/s2/v1/s3 in path order.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: segment_count=4, layer_count=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **geometry-load**. Inspect tiny_pex; confirm 4 segments, 3 layers.

## Slide 9 — Implement track

Call load_geometry(); assert segment_count==4 and layer_count==3.

## Slide 10 — Pitfalls

Counting ports as segments. Ignoring VIA layer in layer_count.

## Slide 11 — Your turn

Next: resistance extract.
