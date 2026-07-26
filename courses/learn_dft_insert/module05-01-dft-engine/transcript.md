# DFT engine integration

**Module id:** module05-01-dft-engine
**Lab:** dft-engine
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Engine

A tiny engine chains scan cells, stitch, lockup, transform, and markers.

## Slide 2 — The idea

GOLDEN: scan cells=4, stitches=3, lockups=1, edges=6, markers=1, ok=True.

<!-- algorithm-walkthrough -->

## Slide 3 — Stats snapshot

![Stats snapshot](assets/steps/01-stats.png)

4 flops, 2 domains, 3 ports.

## Slide 4 — Scan cells

![Scan cells](assets/steps/02-cells.png)

4 SDFF cells identified.

## Slide 5 — Chain check

![Chain check](assets/steps/03-chain.png)

stitch_count=3, chain_length=4.

## Slide 6 — Lockup check

![Lockup check](assets/steps/04-lockup.png)

lockup_count=1, edges=6.

## Slide 7 — Engine OK

![Engine OK](assets/steps/05-ok.png)

GOLDEN: engine ok=True.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **dft-engine**. Run engine; confirm ok.

## Slide 9 — Implement track

Call dft_engine(); assert ok and markers.count==1.

## Slide 10 — Pitfalls

Reporting partial checks. Changing toy without updating goldens.

## Slide 11 — Your turn

Next: offline compare, then wrap.
