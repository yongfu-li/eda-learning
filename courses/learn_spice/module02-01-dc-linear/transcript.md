# Linear DC solve

**Module id:** module02-01-dc-linear
**Lab:** dc-linear
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why DC

Linear DC finds the operating point before Newton or transient analysis.

## Slide 2 — The idea

GOLDEN: V1=5.0, V2=3.0 from the divider 5×3/(2+3).

<!-- algorithm-walkthrough -->

## Slide 3 — Build

![Build](assets/steps/01-build.png)

Stamp linear R+V system.

## Slide 4 — Solve

![Solve](assets/steps/02-solve.png)

Dense solve Gx=b.

## Slide 5 — V1=5

![V1=5](assets/steps/03-v1.png)

Node 1 fixed by Vin.

## Slide 6 — V2=3

![V2=3](assets/steps/04-v2.png)

Divider 5·3/(2+3)=3.

## Slide 7 — Golden

![Golden](assets/steps/05-g.png)

GOLDEN v2_dc=3.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **dc-linear**. Solve DC; confirm V2=3.0.

## Slide 9 — Implement track

Call dc_linear_solve(); assert abs(volts['2']-3.0)<1e-9 and volts['1']==5.0.

## Slide 10 — Pitfalls

Including diode in linear DC. Wrong divider formula.

## Slide 11 — Your turn

Next: sparse LU literacy on G.
