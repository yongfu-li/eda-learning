# Read compare C

**Module id:** module14-03-read-compare-c
**Lab:** read-compare-c

## Slide 1 — Why Netgen internals

Read the compare flow bound to Part B goldens.

## Slide 2 — The idea

GOLDEN: read_sch→read_lay→hash→match→emit (matched=2/4).

<!-- algorithm-walkthrough -->

## Slide 3 — read_sch

![read_sch](assets/steps/01-sch.png)

Parse schematic SPICE into Netlist.

## Slide 4 — read_lay

![read_lay](assets/steps/02-lay.png)

Parse layout SPICE into Netlist.

## Slide 5 — hash_devices

![hash_devices](assets/steps/03-hash.png)

Group devices by class.

## Slide 6 — match_nets

![match_nets](assets/steps/04-match.png)

Compare net connectivity.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: matched=2/4 mismatch=0.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **read-compare-c**.

## Slide 9 — Implement track

Call read_compare_c() in internals_solvers.

## Slide 10 — Pitfalls

Treating browser JSON as the C API.

## Slide 11 — Try these

From the common folder, run the internals self-test.

```bash
cd courses/learn_netgen/common
python3 internals_solvers.py
```

## Slide 12 — Pseudocode

Here is the checklist in plain steps.

```text
read_sch→read_lay→hash→match→emit (matched=2/4).
ok if goldens match INTERNALS_GOLDENS
```

## Slide 13 — Next

Wrap the Netgen path.
