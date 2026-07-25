# Leaf cells and bounding boxes

**Module id:** module01-01-leaf-cells
**Lab:** leaf-cells
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Leaf cells

Compaction starts from leaf geometries — cells and wires with axis-aligned boxes.

## Slide 2 — The idea

A,B,C are cells; W is a horizontal wire. GOLDEN: 4 objects, bbox width 20, height 6.

<!-- algorithm-walkthrough -->

## Slide 3 — Objects

![Objects](assets/steps/01-obj.png)

Four objects: cells A,B,C and wire W.

## Slide 4 — Cell A

![Cell A](assets/steps/02-a.png)

A sits at x0=0..4, y0=2..5.

## Slide 5 — B and C

![B and C](assets/steps/03-bc.png)

B and C sit further right with gaps.

## Slide 6 — BBox

![BBox](assets/steps/04-bbox.png)

Union bbox width=20 height=6.

## Slide 7 — Count

![Count](assets/steps/05-count.png)

GOLDENS: object_count=4.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **leaf-cells**. Click cells; read bbox metrics.

## Slide 9 — Implement track

Call layout_stats; assert object_count==4 and width==20.

## Slide 10 — Pitfalls

Treating wire as a cell. Confusing chip size with bbox.

## Slide 11 — Your turn

Next: spacing / gap rules.
