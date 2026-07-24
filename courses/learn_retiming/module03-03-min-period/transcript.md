# Min-period search

**Module id:** module03-03-min-period
**Lab:** min-period
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Min period

Search a small candidate set of retimings — not full WD/FEAS — and pick the smallest legal period.

## Slide 2 — The idea

Candidates include r=0, forward on a/b, backward on c; best is forward on a with period 5.

<!-- algorithm-walkthrough -->

## Slide 3 — Try candidates

![Try candidates](assets/steps/01-search.png)

Lite search tries zero, forward a, backward c, forward b.

## Slide 4 — Best P=5

![Best P=5](assets/steps/02-best.png)

Best legal period found is 5 (forward on a).

## Slide 5 — Improved

![Improved](assets/steps/03-improve.png)

improved=true because 5 < baseline 8.

## Slide 6 — Cost registers

![Cost registers](assets/steps/04-regs.png)

Best solution uses 3 registers vs 2 baseline.

## Slide 7 — Sequential API

![Sequential API](assets/steps/05-seq.png)

sequential_retime(min_period) wraps the same search.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **min-period**. Run search; confirm best period 5 and r(a)=−1.

## Slide 9 — Implement track

Call min_period_binary_search(DATA); assert period==5 and legal.

## Slide 10 — Pitfalls

Assuming backward on c helps. Expecting full LP optimality.

## Slide 11 — Your turn

Next: register/area tradeoff.
