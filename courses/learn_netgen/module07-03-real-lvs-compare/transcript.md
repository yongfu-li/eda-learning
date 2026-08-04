# Real LVS compare

**Module id:** module07-03-real-lvs-compare
**Lab:** real-lvs-compare

## Slide 1 — Why real Netgen

Compare nets and devices between sch and lay.

## Slide 2 — The idea

GOLDEN: matched_nets=4; matched_devices=2; mismatch=0.

<!-- algorithm-walkthrough -->

## Slide 3 — compare

![compare](assets/steps/01-cmd.png)

Netgen compare matches nets/devices.

## Slide 4 — Four nets

![Four nets](assets/steps/02-nets.png)

Four nets matched.

## Slide 5 — Two devices

![Two devices](assets/steps/03-dev.png)

Two devices matched.

## Slide 6 — Zero mismatch

![Zero mismatch](assets/steps/04-mism.png)

MISMATCH=0 in log.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: matched_nets=4 matched_devices=2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **real-lvs-compare**.

## Slide 9 — Implement track

Run real_solvers.py — REAL_NETGEN_OK.

## Slide 10 — Pitfalls

Editing goldens without re-running scripts.

## Slide 11 — Try these

From the common folder, run the real Netgen self-test.

```bash
cd courses/learn_netgen/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
matched_nets=4; matched_devices=2; mismatch=0.
ok if goldens match
```

## Slide 13 — Next

Continue Part B evidence track.
