# Register area tradeoff

**Module id:** module03-05-area-registers
**Lab:** area-registers
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Area/regs

Retiming trades register area for shorter clock period — same function, different register placement.

## Slide 2 — The idea

forward on a: registers 2→3 (+1) but period 8→5; zero retiming keeps 2 registers at period 8.

<!-- algorithm-walkthrough -->

## Slide 3 — Registers ≈ area

![Registers ≈ area](assets/steps/01-proxy.png)

Total w is a stand-in for flip-flop area.

## Slide 4 — Baseline 2

![Baseline 2](assets/steps/02-base.png)

Starter has two registers.

## Slide 5 — Timing vs area

![Timing vs area](assets/steps/03-trade.png)

Forward on a buys P=5 for one extra register.

## Slide 6 — Where they sit

![Where they sit](assets/steps/04-edges.png)

After forward a, registers sit on e1, e2, e4.

## Slide 7 — Done

![Done](assets/steps/05-done.png)

Next: offline compare, then wrap toward equivalence or STA.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **area-registers**. Compare baseline vs forward-on-a register totals.

## Slide 9 — Implement track

Print register_count at r=0 and after forward on a (2 vs 3).

## Slide 10 — Pitfalls

Assuming retiming always reduces registers. Ignoring period when counting area.

## Slide 11 — Your turn

Next: offline benchmark, then wrap.
