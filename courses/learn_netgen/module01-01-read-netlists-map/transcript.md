# Read netlists map

**Module id:** module01-01-read-netlists-map
**Lab:** read-netlists-map
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Read

Read schematic and layout SPICE-like netlists.

## Slide 2 — The idea

GOLDEN: sch/lay devices=2.

<!-- algorithm-walkthrough -->

## Slide 3 — Schematic

![Schematic](assets/steps/01-sch.png)

tiny_inv schematic has mn1 (nmos) and mp1 (pmos).

## Slide 4 — Layout

![Layout](assets/steps/02-lay.png)

Layout side has X0 (nmos) and X1 (pmos).

## Slide 5 — Four ports

![Four ports](assets/steps/03-ports.png)

Ports A, Y, VDD, VSS on both sides.

## Slide 6 — read command

![read command](assets/steps/04-read.png)

Netgen read loads SPICE-like netlists.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: sch_devices=2 lay_devices=2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **read-netlists-map**. Run the stage buttons and Check the goldens.

## Slide 9 — Implement track

From common/, run solvers.py and confirm NETGEN_PARTA_OK.

## Slide 10 — Pitfalls

Confusing schematic SPICE with layout extract. Forgetting permute on source/drain.

## Slide 11 — Try these

From the common folder, run the Netgen map self-test.

```bash
cd courses/learn_netgen/common
python3 solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
sch/lay devices=2.
ok if goldens match
```

## Slide 13 — Next

Continue the Netgen Part A map, then the real CLI track.
