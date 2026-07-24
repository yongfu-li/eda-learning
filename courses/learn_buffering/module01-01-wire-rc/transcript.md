# Wire R/C model

**Module id:** module01-01-wire-rc
**Lab:** wire-rc
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Wire RC

Every buffering decision starts from how much resistance and capacitance a wire segment carries.

## Slide 2 — The idea

wire_rc of length L returns R equals L times r_per and C equals L times c_per. Elmore delay uses R times C_self over two plus C_load.

<!-- algorithm-walkthrough -->

## Slide 3 — Net topology

![Net topology](assets/steps/01-net.png)

Driver D feeds S0; S0 fans to S1 and S2 on the 12×8 chip.

## Slide 4 — Edge e0 length

![Edge e0 length](assets/steps/02-e0.png)

D→S0 is four units Manhattan on the starter.

## Slide 5 — R and C

![R and C](assets/steps/03-rc.png)

With unit parasitics, length four yields R=4 and C=4.

## Slide 6 — Elmore

![Elmore](assets/steps/04-elmore.png)

Delay ≈ R·(C/2 + Cload) on a lumped segment.

## Slide 7 — Why it matters

![Why it matters](assets/steps/05-why.png)

Longer edges dominate slew and delay — candidates appear next.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **wire-rc**. Inspect edges e0–e2. Confirm length-four e0 maps to R=4, C=4 with unit parasitics.

## Slide 9 — Implement track

Call `wire_rc(length)` and `elmore_delay` in `common/`. Match GOLDENS.wireRcLen4R.

## Slide 10 — Pitfalls

Using Euclidean length. Forgetting C_load in Elmore. Mixing per-unit R with total R.

## Slide 11 — Your turn

Next: slew budgets on those RC segments.
