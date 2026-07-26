# OpenSTA engine (map)

**Module id:** module03-03-opensta-engine
**Lab:** opensta-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why OpenSTA

Run the full Part A engine; ok when every golden matches.

## Slide 2 — The idea

GOLDEN: opensta_engine ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Graph ok

![Graph ok](assets/steps/01-graph.png)

Timing graph stage passes.

## Slide 4 — SDC ok

![SDC ok](assets/steps/02-sdc.png)

Clock stage passes.

## Slide 5 — Arrival ok

![Arrival ok](assets/steps/03-arr.png)

Arrival and required stages pass.

## Slide 6 — Slack ok

![Slack ok](assets/steps/04-slack.png)

Slack and report stages pass.

## Slide 7 — Engine golden

![Engine golden](assets/steps/05-golden.png)

GOLDEN: opensta_engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **opensta-engine**. Run the stage buttons and Check the goldens.

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
opensta_engine ok=True.
ok if goldens match
```

## Slide 13 — Next

Continue the OpenSTA Part A map, then the real CLI track.
