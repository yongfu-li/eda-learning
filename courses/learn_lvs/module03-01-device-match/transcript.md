# Device matching

**Module id:** module03-01-device-match
**Lab:** device-match
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Device match

Device match checks binding plus type agreement (nmos↔nmos).

## Slide 2 — The idea

GOLDEN: matched_devices=2.

<!-- algorithm-walkthrough -->

## Slide 3 — Bind

![Bind](assets/steps/01-bind.png)

Use device binding X0→mn1, X1→mp1.

## Slide 4 — Type

![Type](assets/steps/02-type.png)

Compare layout type to schematic type.

## Slide 5 — X0

![X0](assets/steps/03-x0.png)

X0 nmos matches mn1 nmos.

## Slide 6 — X1

![X1](assets/steps/04-x1.png)

X1 pmos matches mp1 pmos.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: matched_devices=2.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **device-match**. Run match; confirm 2 matched devices.

## Slide 9 — Implement track

Call match_devices(); assert count==2 and mismatch_count==0.

## Slide 10 — Pitfalls

Matching by name only without type check. Skipping unbound devices.

## Slide 11 — Your turn

Next: LVS graph compare.
