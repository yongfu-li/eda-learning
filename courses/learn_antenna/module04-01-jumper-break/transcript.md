# Jumper break

**Module id:** module04-01-jumper-break
**Lab:** jumper-break
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why jumper

A jumper on lower metal breaks antenna path — drops high-layer metal.

## Slide 2 — The idea

GOLDEN: jumper on n1 max_layer=1 → ratio 0.

<!-- algorithm-walkthrough -->

## Slide 3 — Add jumper

![Add jumper](assets/steps/01-jumper.png)

Jumper caps max metal layer on a net.

## Slide 4 — Before

![Before](assets/steps/02-before.png)

n1 ratio 25 with layer-2 metal.

## Slide 5 — Cap L1

![Cap L1](assets/steps/03-cap.png)

max_layer=1 drops m1 (layer 2).

## Slide 6 — After

![After](assets/steps/04-after.png)

n1 metal area 0 → ratio 0.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: jumper_n1_ratio=0.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **jumper-break**. Apply jumper; confirm n1 ratio=0.

## Slide 9 — Implement track

Call jumper_effect(); assert after_ratio==0.

## Slide 10 — Pitfalls

Not filtering by layer. Applying jumper to wrong net.

## Slide 11 — Your turn

Next: antenna markers.
