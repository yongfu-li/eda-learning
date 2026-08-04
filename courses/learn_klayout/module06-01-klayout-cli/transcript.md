# KLayout CLI & scripts

**Module id:** module06-01-klayout-cli
**Lab:** klayout-cli

## Slide 1 — Why real KLayout

Invoke klayout -b -r script.drc; recipe starts stream_gds→load_drc.

## Slide 2 — The idea

GOLDEN: First two cmds: stream_gds, load_drc.

<!-- algorithm-walkthrough -->

## Slide 3 — klayout -b

![klayout -b](assets/steps/01-invoke.png)

KLayout runs batch mode with -r script.drc.

## Slide 4 — stream gds

![stream gds](assets/steps/02-stream.png)

First stream tiny_rect.gds.

## Slide 5 — load drc

![load drc](assets/steps/03-load.png)

Then load DRC Ruby script.

## Slide 6 — run drc

![run drc](assets/steps/04-run.png)

Run width/spacing checks.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: recipe prefix stream_gds→load_drc.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **klayout-cli**.

## Slide 9 — Implement track

Run real_solvers.py — REAL_KLAYOUT_OK.

## Slide 10 — Pitfalls

Editing goldens without re-running scripts.

## Slide 11 — Try these

From the common folder, run the real KLayout self-test.

```bash
cd courses/learn_klayout/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
First two cmds: stream_gds, load_drc.
ok if goldens match
```

## Slide 13 — Next

Continue Part B evidence track.
