# Multi-layer rule deck

**Module id:** module03-01-multi-layer-deck
**Lab:** multi-layer-deck
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Multi-layer

Real decks span layers — enclosure and boolean tie VIA to M1/M2.

## Slide 2 — The idea

GOLDEN: 2 enclosure rules; fires E.VIA_M2.

<!-- algorithm-walkthrough -->

## Slide 3 — Cross

![Cross](assets/steps/01-cross.png)

Deck rules span M1, M2, and VIA.

## Slide 4 — Enc rules

![Enc rules](assets/steps/02-enc.png)

Two enclosure rules: E.VIA_M1 and E.VIA_M2.

## Slide 5 — Boolean

![Boolean](assets/steps/03-bool.png)

B.VIA_M1_not_M2 boolean rule on VIA.

## Slide 6 — Fire

![Fire](assets/steps/04-fire.png)

E.VIA_M2 fires — V not enclosed by M2.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: 2 enclosure rules; fires E.VIA_M2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **multi-layer-deck**. Run multi-layer view; confirm E.VIA_M2 fires.

## Slide 9 — Implement track

Call multi_layer_rules(); assert enclosure_count==2 and fires count==1.

## Slide 10 — Pitfalls

Counting width rules as cross-layer. Ignoring boolean deck entries.

## Slide 11 — Your turn

Next: deck boolean rules.
