# RC network build

**Module id:** module02-01-rc-network
**Lab:** rc-network
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — RC network

RC network chains segment resistors in series; attach ground C at metal nodes.

## Slide 2 — The idea

GOLDEN: series chain; nodes include in/out.

<!-- algorithm-walkthrough -->

## Slide 3 — Order

![Order](assets/steps/01-order.png)

Series path: s1 → s2 → v1 → s3.

## Slide 4 — Resistors

![Resistors](assets/steps/02-resistors.png)

Four R edges in series from in to out.

## Slide 5 — Nodes

![Nodes](assets/steps/03-nodes.png)

Nodes include in and out ports.

## Slide 6 — Caps

![Caps](assets/steps/04-caps.png)

Three C branches to gnd on metal nodes.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: series chain; nodes include in/out.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **rc-network**. Select in and out; confirm series chain.

## Slide 9 — Implement track

Call build_rc_network(); assert nodes include 'in' and 'out' and r_count==4.

## Slide 10 — Pitfalls

Parallel instead of series R. Attaching C on VIA node.

## Slide 11 — Your turn

Next: network reduction.
