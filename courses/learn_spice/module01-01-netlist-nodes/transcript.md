# Netlist nodes and ground

**Module id:** module01-01-netlist-nodes
**Lab:** netlist-nodes
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why netlists

Every SPICE solve starts from a netlist — nodes, elements, and a ground reference.

## Slide 2 — The idea

GOLDEN: 5 elements, 2 unknown nodes (1, 2), ground 0.

<!-- algorithm-walkthrough -->

## Slide 3 — Netlist

![Netlist](assets/steps/01-nl.png)

Toy netlist with five elements.

## Slide 4 — Ground

![Ground](assets/steps/02-gnd.png)

Node 0 is ground reference.

## Slide 5 — Unknowns

![Unknowns](assets/steps/03-un.png)

Unknown voltages: nodes 1 and 2.

## Slide 6 — Elements

![Elements](assets/steps/04-el.png)

V, R, R, C, D types.

## Slide 7 — Count

![Count](assets/steps/05-cnt.png)

GOLDEN element_count=5.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **netlist-nodes**. Inspect tiny_spice; confirm 5 elements and 2 unknown nodes.

## Slide 9 — Implement track

Call netlist_stats(); assert element_count==5, unknown_nodes==2, ground=='0'.

## Slide 10 — Pitfalls

Counting ground as unknown. Ignoring element ids vs node names.

## Slide 11 — Your turn

Next: stamp R and V into MNA.
