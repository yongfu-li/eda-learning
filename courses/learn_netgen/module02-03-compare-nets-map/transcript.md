# Compare nets map

**Module id:** module02-03-compare-nets-map
**Lab:** compare-nets-map
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Compare

Match net names between schematic and layout.

## Slide 2 — The idea

GOLDEN: matched_nets=4.

<!-- algorithm-walkthrough -->

## Slide 3 — Four nets

![Four nets](assets/steps/01-nets.png)

A, Y, VDD, VSS appear on both sides.

## Slide 4 — All match

![All match](assets/steps/02-match.png)

Set intersection gives four matched nets.

## Slide 5 — Schematic nets

![Schematic nets](assets/steps/03-sch.png)

Schematic net names from devices + ports.

## Slide 6 — Layout nets

![Layout nets](assets/steps/04-lay.png)

Layout net names from extract SPICE.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: matched_nets=4.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **compare-nets-map**. Run the stage buttons and Check the goldens.

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
matched_nets=4.
ok if goldens match
```

## Slide 13 — Next

Continue the Netgen Part A map, then the real CLI track.
