# Slack & critical path

**Module id:** module02-03-slack-critical
**Lab:** slack-critical
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Slack

Compute slack = required − arrival on the critical path.

## Slide 2 — The idea

GOLDEN: slack = 10 − 2 = 8.

<!-- algorithm-walkthrough -->

## Slide 3 — Critical path

![Critical path](assets/steps/01-path.png)

The only data path is a/b → u1 → u2 → u3 → y.

## Slide 4 — Path delay

![Path delay](assets/steps/02-delay.png)

Sum of cell delays is 2.0.

## Slide 5 — Slack formula

![Slack formula](assets/steps/03-formula.png)

Slack equals required minus arrival.

## Slide 6 — Slack value

![Slack value](assets/steps/04-value.png)

With period 10 and arrival 2, slack is 8.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: slack=8 at period 10.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **slack-critical**. Run the stage buttons and Check the goldens.

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
slack = 10 − 2 = 8.
ok if goldens match
```

## Slide 13 — Next

Continue the OpenSTA Part A map, then the real CLI track.
