# Timing graph map

**Module id:** module01-01-timing-graph-map
**Lab:** timing-graph-map
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Timing

Map netlist cells to the OpenSTA timing graph.

## Slide 2 — The idea

GOLDEN: 3 cells u1/u2/u3; graph nodes = cells + pins.

<!-- algorithm-walkthrough -->

## Slide 3 — Three cells

![Three cells](assets/steps/01-cells.png)

Tiny netlist has AND2, BUF, and INV.

## Slide 4 — Pins

![Pins](assets/steps/02-pins.png)

Primary pins a, b, y plus internal nets.

## Slide 5 — Delay arcs

![Delay arcs](assets/steps/03-arcs.png)

Each cell carries a delay that becomes a timing arc.

## Slide 6 — Timing graph

![Timing graph](assets/steps/04-graph.png)

OpenSTA builds a graph from cells and pins.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: cell_count=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **timing-graph-map**. Run the stage buttons and Check the goldens.

## Slide 9 — Implement track

From common/, run solvers.py and confirm OPENSTA_MAP_OK.

## Slide 10 — Pitfalls

Mixing algorithm STA from learn_sta with OpenSTA command names. Forgetting the clock period when reading slack.

## Slide 11 — Try these

From the common folder, run the OpenSTA map self-test.

```bash
cd courses/learn_opensta/common
python3 solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
3 cells u1/u2/u3; graph nodes = cells + pins.
ok if goldens match
```

## Slide 13 — Next

Continue the OpenSTA Part A map, then the real CLI track.
