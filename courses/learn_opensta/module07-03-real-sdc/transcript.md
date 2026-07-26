# Real SDC + create_clock

**Module id:** module07-03-real-sdc
**Lab:** real-sdc
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real OpenSTA

Apply create_clock period 10 and I/O delays.

## Slide 2 — The idea

GOLDEN: clock clk period=10.

<!-- algorithm-walkthrough -->

## Slide 3 — create_clock

![create_clock](assets/steps/01-clk.png)

create_clock -name clk -period 10.

## Slide 4 — Input delay

![Input delay](assets/steps/02-in.png)

set_input_delay 0 on all inputs.

## Slide 5 — Output delay

![Output delay](assets/steps/03-out.png)

set_output_delay 0 on all outputs.

## Slide 6 — Ideal network

![Ideal network](assets/steps/04-ideal.png)

Clock network delay is ideal in this lab.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: clock clk period=10.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **real-sdc**. Build the Tcl recipe or open evidence stages, then Check.

## Slide 9 — Implement track

From common/, run real_solvers.py and confirm REAL_OPENSTA_OK.

## Slide 10 — Pitfalls

Editing goldens by hand without re-running sta. Confusing Part A map JSON with real liberty delays.

## Slide 11 — Try these

From the common folder, run the real OpenSTA self-test.

```bash
cd courses/learn_opensta/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
clock clk period=10.
ok if goldens match
```

## Slide 13 — Next

Continue the Part B evidence track, then wrap — algorithms and internals come later.
