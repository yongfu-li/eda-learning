# Undriven inputs

**Module id:** module02-03-undriven-inputs
**Lab:** undriven-inputs
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why undriven

Undriven inputs are the pin-level view of floating connectivity.

## Slide 2 — The idea

GOLDEN: one hit — u2.A on float_n.

<!-- algorithm-walkthrough -->

## Slide 3 — Scan loads

![Scan loads](assets/steps/01-scan.png)

Walk every input pin attachment.

## Slide 4 — Driver?

![Driver?](assets/steps/02-drv.png)

Skip if the net already has a driver.

## Slide 5 — Primary in

![Primary in](assets/steps/03-pi.png)

Primary input ports are allowed undriven.

## Slide 6 — Hit

![Hit](assets/steps/04-hit.png)

u2.A on float_n is the golden hit.

## Slide 7 — Count

![Count](assets/steps/05-count.png)

GOLDEN: undriven_count=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **undriven-inputs**. Confirm u2.A undriven.

## Slide 9 — Implement track

Call find_undriven_inputs(); assert count==1 and hits[0].net=='float_n'.

## Slide 10 — Pitfalls

Flagging port a as undriven. Missing the float_n load.

## Slide 11 — Your turn

Next: multi-driven nets.
