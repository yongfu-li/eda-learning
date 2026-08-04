# LVS report map

**Module id:** module03-01-lvs-report-map
**Lab:** lvs-report-map
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why LVS

LVS report: matched devices and mismatches.

## Slide 2 — The idea

GOLDEN: matched_devices=2; mismatch=0.

<!-- algorithm-walkthrough -->

## Slide 3 — Device match

![Device match](assets/steps/01-dev.png)

Two devices matched by type count.

## Slide 4 — nmos/pmos

![nmos/pmos](assets/steps/02-type.png)

One nmos + one pmos each side.

## Slide 5 — Zero mismatch

![Zero mismatch](assets/steps/03-mism.png)

mismatch_count=0 on tiny_inv.

## Slide 6 — LVS report

![LVS report](assets/steps/04-report.png)

Netgen report summarizes compare.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: matched_devices=2 mismatch=0.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **lvs-report-map**. Run the stage buttons and Check the goldens.

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
matched_devices=2; mismatch=0.
ok if goldens match
```

## Slide 13 — Next

Continue the Netgen Part A map, then the real CLI track.
