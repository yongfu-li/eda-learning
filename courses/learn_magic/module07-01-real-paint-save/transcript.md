# Real paint / save

**Module id:** module07-01-real-paint-save
**Lab:** real-paint-save
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real Magic

Load tiny_inv, verify paint counts, save .mag.

## Slide 2 — The idea

GOLDEN: rect_count=6; contact_count=1; cell=tiny_inv.

<!-- algorithm-walkthrough -->

## Slide 3 — tiny_inv

![tiny_inv](assets/steps/01-cell.png)

Load cell tiny_inv from layouts/.

## Slide 4 — Six rects

![Six rects](assets/steps/02-rects.png)

Paint verify counts six rectangles.

## Slide 5 — One contact

![One contact](assets/steps/03-contact.png)

Contact ca bridges poly and metal1.

## Slide 6 — save

![save](assets/steps/04-save.png)

save writes the .mag file.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: rect_count=6 contact_count=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **real-paint-save**. Build the Magic recipe or open evidence stages, then Check.

## Slide 9 — Implement track

From common/, run real_solvers.py and confirm REAL_MAGIC_OK.

## Slide 10 — Pitfalls

Editing goldens by hand without re-running scripts. Confusing Part A map JSON with checked-in logs.

## Slide 11 — Try these

From the common folder, run the real Magic self-test.

```bash
cd courses/learn_magic/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
rect_count=6; contact_count=1; cell=tiny_inv.
ok if goldens match
```

## Slide 13 — Next

Continue the Part B evidence track, then algorithms and internals.
