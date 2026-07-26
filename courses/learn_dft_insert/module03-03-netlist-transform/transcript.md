# Netlist transform

**Module id:** module03-03-netlist-transform
**Lab:** netlist-transform
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why transform

DFT insert adds scan wiring edges to the netlist.

## Slide 2 — The idea

GOLDEN: transform_edge_count=6 (SI + 3 stitches + SO + 1 lockup).

<!-- algorithm-walkthrough -->

## Slide 3 — SI edge

![SI edge](assets/steps/01-si.png)

SI→f1 hook edge.

## Slide 4 — Stitch edges

![Stitch edges](assets/steps/02-st.png)

Three flop-to-flop stitch edges.

## Slide 5 — SO edge

![SO edge](assets/steps/03-so.png)

f4→SO hook edge.

## Slide 6 — Lockup edge

![Lockup edge](assets/steps/04-lk.png)

One lockup edge on d0→d1 crossing.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: transform_edge_count=6.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **netlist-transform**. Confirm 6 transform edges.

## Slide 9 — Implement track

Call netlist_transform(); assert edge_count==6.

## Slide 10 — Pitfalls

Double-counting stitches. Forgetting lockup edge.

## Slide 11 — Your turn

Next: DFT markers.
