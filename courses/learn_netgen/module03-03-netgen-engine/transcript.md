# Netgen engine (map)

**Module id:** module03-03-netgen-engine
**Lab:** netgen-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Netgen

Run the full Part A engine; ok when every golden matches.

## Slide 2 — The idea

GOLDEN: netgen_engine ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Read ok

![Read ok](assets/steps/01-read.png)

Read netlists stage passes.

## Slide 4 — Classes ok

![Classes ok](assets/steps/02-class.png)

Device classes stage passes.

## Slide 5 — Permute ok

![Permute ok](assets/steps/03-perm.png)

Flatten permute stage passes.

## Slide 6 — Compare ok

![Compare ok](assets/steps/04-cmp.png)

Compare nets stage passes.

## Slide 7 — Engine golden

![Engine golden](assets/steps/05-golden.png)

GOLDEN: netgen_engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **netgen-engine**. Run the stage buttons and Check the goldens.

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
netgen_engine ok=True.
ok if goldens match
```

## Slide 13 — Next

Continue the Netgen Part A map, then the real CLI track.
