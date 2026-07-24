# Buffer candidate sites

**Module id:** module02-01-candidate-sites
**Lab:** candidate-sites
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Candidates

Van Ginneken and slew-driven flows only insert where candidates exist.

## Slide 2 — The idea

Walk each edge; every candidate_step units place a site excluding endpoints. Gray dots mark legal insert points.

<!-- algorithm-walkthrough -->

## Slide 3 — Step size

![Step size](assets/steps/01-step.png)

candidate_step = 2 on the toy.

## Slide 4 — Show sites

![Show sites](assets/steps/02-show.png)

Show candidates paints gray dots on e0–e2.

## Slide 5 — Count

![Count](assets/steps/03-count.png)

Longer edges yield more sites.

## Slide 6 — Exclude ends

![Exclude ends](assets/steps/04-ends.png)

Driver and sink pins are not candidates.

## Slide 7 — Ready for DP

![Ready for DP](assets/steps/05-dp.png)

Sites feed Van Ginneken options next.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **candidate-sites**. Click Show candidates. Count gray dots on e0.

## Slide 9 — Implement track

Call `candidate_sites(data)`. Assert length > 0 for tiny_buf.

## Slide 10 — Pitfalls

Placing sites past the far endpoint. Using step zero. Forgetting diagonal HV walk.

## Slide 11 — Your turn

Next: the buffer library cells you can instantiate.
