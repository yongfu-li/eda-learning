# Single-layer region (width)

**Module id:** module01-05-single-layer-region
**Lab:** single-layer-region
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Region width

Width patterns treat a polygon as a region and measure its smallest extent.

## Slide 2 — The idea

D is 1×6 on M1; min_width[M1]=3 → width marker. GOLDEN width_markers=1.

<!-- algorithm-walkthrough -->

## Slide 3 — Thin D

![Thin D](assets/steps/01-d.png)

D width=1 height=6.

## Slide 4 — Min width

![Min width](assets/steps/02-mw.png)

min_width[M1]=3.

## Slide 5 — Measure

![Measure](assets/steps/03-min.png)

thin = min(w,h) = 1.

## Slide 6 — Marker

![Marker](assets/steps/04-mark.png)

Emit width marker on D.

## Slide 7 — Others

![Others](assets/steps/05-ok.png)

A,B,C,V pass their layer min_width.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **single-layer-region**. Run Match width; confirm marker on D.

## Slide 9 — Implement track

Call match_width(); assert one marker on D.

## Slide 10 — Pitfalls

Using area instead of min(w,h). Applying M2 limits to M1.

## Slide 11 — Your turn

Next: scanline sweep.
