# Newton-Raphson DC

**Module id:** module03-01-newton-raphson
**Lab:** newton-raphson
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Newton

Newton-Raphson linearizes nonlinear devices and iterates until the residual drops.

## Slide 2 — The idea

GOLDEN: 1 iteration with linear-only stamps; v2=3.0.

<!-- algorithm-walkthrough -->

## Slide 3 — Guess

![Guess](assets/steps/01-guess.png)

Start from linear OP.

## Slide 4 — Jacobian

![Jacobian](assets/steps/02-jac.png)

Restamp G each iteration.

## Slide 5 — Update

![Update](assets/steps/03-upd.png)

Solve and update x.

## Slide 6 — Residual

![Residual](assets/steps/04-res.png)

Stop when |dx| small.

## Slide 7 — Converged

![Converged](assets/steps/05-conv.png)

GOLDEN: 1 iter, v2=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **newton-raphson**. Run NR without diode; confirm 1 iter and v2=3.

## Slide 9 — Implement track

Call newton_raphson_dc(include_diode=False); assert iters==1 and v2≈3.0.

## Slide 10 — Pitfalls

Enabling diode when the lesson is linear convergence. Wrong tolerance units.

## Slide 11 — Your turn

Next: device callbacks for diodes.
