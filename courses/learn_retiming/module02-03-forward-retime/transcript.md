# Forward retiming

**Module id:** module02-03-forward-retime
**Lab:** forward-retime
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Forward

Forward retiming pulls registers toward outputs — decrease r(v) on the chosen node.

## Slide 2 — The idea

forward_retime('a', r, 1) sets r(a)=−1; e0 w_r becomes 0; e1/e4 gain registers.

<!-- algorithm-walkthrough -->

## Slide 3 — Forward −r

![Forward −r](assets/steps/01-def.png)

Forward retiming decreases r(v): registers move toward outputs across v.

## Slide 4 — Pick a

![Pick a](assets/steps/02-pick.png)

Select node a — the first comb after the PI register.

## Slide 5 — Apply forward

![Apply forward](assets/steps/03-apply.png)

Set r(a)=−1. Edge weights become w + r(dst) − r(src).

## Slide 6 — Period 8→5

![Period 8→5](assets/steps/04-period.png)

After forward on a, period drops from 8 to 5.

## Slide 7 — Registers 2→3

![Registers 2→3](assets/steps/05-regs.png)

Register count rises to 3 — timing vs area tradeoff.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **forward-retime**. Click Forward on a; read w_r labels and period 5.

## Slide 9 — Implement track

Call forward_retime('a', r, 1); print apply_retime edges and clock_period.

## Slide 10 — Pitfalls

Decreasing r on PI/PO. Applying forward on c first and breaking legality.

## Slide 11 — Your turn

Next: backward retiming on c.
