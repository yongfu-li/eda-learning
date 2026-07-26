# Netlist connectivity graph

**Module id:** module01-01-netlist-graph
**Lab:** netlist-graph
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why graph

ERC starts from a connectivity graph — instances, nets, and pin edges.

## Slide 2 — The idea

GOLDEN: 8 nets, 4 instances, 14 pin edges.

<!-- algorithm-walkthrough -->

## Slide 3 — Nets

![Nets](assets/steps/01-nets.png)

Eight nets: supplies, ports, float_n, z, well_n.

## Slide 4 — Instances

![Instances](assets/steps/02-inst.png)

Four instances: u1, u2, u3, short1.

## Slide 5 — Edges

![Edges](assets/steps/03-edges.png)

Each pin attachment is an inst–net edge.

## Slide 6 — Walk

![Walk](assets/steps/04-walk.png)

Walk pins on u1 INV: A,Y,VDD,VSS.

## Slide 7 — Count

![Count](assets/steps/05-count.png)

GOLDEN: edge_count=14.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **netlist-graph**. Inspect tiny_erc; confirm 8 nets and 14 edges.

## Slide 9 — Implement track

Call design_stats() and build_connectivity(); assert net_count==8, edge_count==14.

## Slide 10 — Pitfalls

Counting wells as instances. Double-counting supply pins.

## Slide 11 — Your turn

Next: classify drivers vs loads.
