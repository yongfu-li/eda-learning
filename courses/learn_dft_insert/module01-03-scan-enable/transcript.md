# Scan enable

**Module id:** module01-03-scan-enable
**Lab:** scan-enable
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why scan enable

Scan enable muxes functional vs scan data; SI/SO bookend the chain.

## Slide 2 — The idea

GOLDEN: se=scan_enable, si=scan_in, so=scan_out.

<!-- algorithm-walkthrough -->

## Slide 3 — SE port

![SE port](assets/steps/01-se.png)

scan_enable drives mux select on all SDFFs.

## Slide 4 — SI port

![SI port](assets/steps/02-si.png)

scan_in hooks first cell in chain.

## Slide 5 — SO port

![SO port](assets/steps/03-so.png)

scan_out hooks last cell Q.

## Slide 6 — Port names

![Port names](assets/steps/04-hook.png)

si=scan_in, so=scan_out, se=scan_enable.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: se=scan_enable, si=scan_in, so=scan_out.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **scan-enable**. Confirm the three port names.

## Slide 9 — Implement track

Call scan_enable_port(); assert se/si/so match goldens.

## Slide 10 — Pitfalls

Confusing SI with functional D. Wrong port order.

## Slide 11 — Your turn

Next: chain stitch.
