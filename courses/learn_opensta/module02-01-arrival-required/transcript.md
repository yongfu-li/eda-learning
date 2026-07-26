# Arrival & required

**Module id:** module02-01-arrival-required
**Lab:** arrival-required
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Arrival

Propagate arrivals and set required at the endpoint.

## Slide 2 — The idea

GOLDEN: A(y)=2.0; R(y)=10.0.

<!-- algorithm-walkthrough -->

## Slide 3 — Input arrivals

![Input arrivals](assets/steps/01-inputs.png)

Primary inputs a and b arrive at time 0.

## Slide 4 — Forward propagate

![Forward propagate](assets/steps/02-forward.png)

Arrival grows by cell delay along the cone.

## Slide 5 — Arrival at y

![Arrival at y](assets/steps/03-ay.png)

Arrival at endpoint y is 2.0.

## Slide 6 — Required at y

![Required at y](assets/steps/04-ry.png)

Required at y equals the clock period 10.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: A(y)=2 and R(y)=10.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **arrival-required**. Run the stage buttons and Check the goldens.

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
A(y)=2.0; R(y)=10.0.
ok if goldens match
```

## Slide 13 — Next

Continue the OpenSTA Part A map, then the real CLI track.
