# SDC clocks

**Module id:** module01-03-sdc-clocks
**Lab:** sdc-clocks
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why SDC

Declare create_clock period and name on clk.

## Slide 2 — The idea

GOLDEN: create_clock -period 10 → clk period=10.

<!-- algorithm-walkthrough -->

## Slide 3 — Clock port

![Clock port](assets/steps/01-port.png)

Port clk is the clock source.

## Slide 4 — create_clock

![create_clock](assets/steps/02-create.png)

SDC create_clock names the clock and sets period.

## Slide 5 — Period 10

![Period 10](assets/steps/03-period.png)

Period is 10 time units on this tiny design.

## Slide 6 — Ideal network

![Ideal network](assets/steps/04-ideal.png)

Part A uses an ideal clock — no network latency yet.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: clock clk period=10.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **sdc-clocks**. Run the stage buttons and Check the goldens.

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
create_clock -period 10 → clk period=10.
ok if goldens match
```

## Slide 13 — Next

Continue the OpenSTA Part A map, then the real CLI track.
