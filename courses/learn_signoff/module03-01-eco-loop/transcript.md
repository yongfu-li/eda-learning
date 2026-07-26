# ECO plan

**Module id:** module03-01-eco-loop
**Lab:** eco-loop
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why ECO loop

Engineering change orders map fixes to failing checks.

## Slide 2 — The idea

GOLDEN: eco_count=2, fixes_all=true.

<!-- algorithm-walkthrough -->

## Slide 3 — ECO list

![ECO list](assets/steps/01-plan.png)

Two ECOs planned for failing checks.

## Slide 4 — Buffer ECO

![Buffer ECO](assets/steps/02-eco1.png)

eco1 buffer on n_crit fixes STA.

## Slide 5 — Jumper ECO

![Jumper ECO](assets/steps/03-eco2.png)

eco2 jumper on n_ant fixes antenna.

## Slide 6 — Covers all

![Covers all](assets/steps/04-cover.png)

Both fails covered by ECO fixes.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: eco_count=2, fixes_all=true.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **eco-loop**. Confirm 2 ECOs cover sta+antenna.

## Slide 9 — Implement track

Call eco_plan(); assert eco_count==2 and fixes_all.

## Slide 10 — Pitfalls

ECO missing a fail. Double-counting ECOs.

## Slide 11 — Your turn

Next: apply ECOs.
