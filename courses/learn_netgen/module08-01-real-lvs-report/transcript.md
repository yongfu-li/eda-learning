# Real LVS report

**Module id:** module08-01-real-lvs-report
**Lab:** real-lvs-report

## Slide 1 — Why real Netgen

LVS report with class count.

## Slide 2 — The idea

GOLDEN: matched=2/4; mismatch=0; classes=2.

<!-- algorithm-walkthrough -->

## Slide 3 — report cmd

![report cmd](assets/steps/01-report.png)

Netgen report summarizes LVS.

## Slide 4 — Devices

![Devices](assets/steps/02-dev.png)

MATCHED_DEVICES=2.

## Slide 5 — Nets

![Nets](assets/steps/03-nets.png)

MATCHED_NETS=4.

## Slide 6 — Classes

![Classes](assets/steps/04-class.png)

CLASSES=2.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: mismatch=0.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **real-lvs-report**.

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
matched=2/4; mismatch=0; classes=2.
ok if goldens match
```

## Slide 13 — Next

Continue Part B evidence track.
