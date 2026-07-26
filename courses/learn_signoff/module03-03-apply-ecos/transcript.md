# Apply fixes

**Module id:** module03-03-apply-ecos
**Lab:** apply-ecos
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why apply ECOs

Applying ECOs flips fixed checks from fail to pass.

## Slide 2 — The idea

GOLDEN: fail_count→0 after apply_ecos.

<!-- algorithm-walkthrough -->

## Slide 3 — Flip fails

![Flip fails](assets/steps/01-apply.png)

Apply ECOs — flip sta and antenna to pass.

## Slide 4 — STA fixed

![STA fixed](assets/steps/02-sta.png)

STA slack becomes +0.02 after buffer.

## Slide 5 — Antenna fixed

![Antenna fixed](assets/steps/03-ant.png)

Antenna count zero after jumper.

## Slide 6 — Others hold

![Others hold](assets/steps/04-rest.png)

DRC/LVS/ERC/IR remain pass.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: fail_count→0 after ECO.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **apply-ecos**. Apply ECOs; confirm fail_count=0.

## Slide 9 — Implement track

Call apply_ecos(); assert fail_count==0.

## Slide 10 — Pitfalls

Applying ECO without updating check status. Partial apply.

## Slide 11 — Your turn

Next: tapeout checklist.
