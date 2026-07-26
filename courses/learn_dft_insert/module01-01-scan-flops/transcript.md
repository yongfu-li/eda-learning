# Scan flops

**Module id:** module01-01-scan-flops
**Lab:** scan-flops
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why scan flops

Every flop becomes a scan SDFF in this full-scan toy.

## Slide 2 — The idea

GOLDEN: scan_cell_count=4.

<!-- algorithm-walkthrough -->

## Slide 3 — SDFF cells

![SDFF cells](assets/steps/01-sdff.png)

Each flop becomes a scan SDFF cell.

## Slide 4 — Flop f1

![Flop f1](assets/steps/02-f1.png)

f1: domain d0, clk=clk.

## Slide 5 — Flop f2

![Flop f2](assets/steps/03-f2.png)

f2: Q→n2 feeds f3.

## Slide 6 — Flop f3

![Flop f3](assets/steps/04-f3.png)

f3: last flop in d0.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: scan_cell_count=4.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **scan-flops**. Inspect tiny_dft; confirm 4 SDFF cells.

## Slide 9 — Implement track

Call identify_scan_flops(); assert count==4.

## Slide 10 — Pitfalls

Counting only functional flops. Missing SE hook.

## Slide 11 — Your turn

Next: scan enable ports.
