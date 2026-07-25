# Wire jogs / stretch

**Module id:** module03-01-wire-jogs
**Lab:** wire-jogs
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Wire jogs

Wires must bend or stretch when cells move during compaction.

## Slide 2 — The idea

add_jog inserts a bend; stretch_wire_to_bbox retargets a horizontal wire to the cell union.

<!-- algorithm-walkthrough -->

## Slide 3 — Wire W

![Wire W](assets/steps/01-w.png)

W is horizontal at y=7 spanning x=4..16.

## Slide 4 — Jog

![Jog](assets/steps/02-jog.png)

add_jog records a bend point.

## Slide 5 — Stretch

![Stretch](assets/steps/03-stretch.png)

After compact, stretch W to cell bbox.

## Slide 6 — Points

![Points](assets/steps/04-pts.png)

points list holds polyline vertices.

## Slide 7 — Why

![Why](assets/steps/05-why.png)

Without jogs, wires disconnect from moving pins.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **wire-jogs**. Add a jog; stretch W after compact.

## Slide 9 — Implement track

Call add_jog on W; stretch_wire_to_bbox after compact_1d.

## Slide 10 — Pitfalls

Deleting the wire. Stretching without updating y.

## Slide 11 — Your turn

Next: shear lite.
