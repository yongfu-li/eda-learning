# Contact paint

**Module id:** module02-01-contact-paint
**Lab:** contact-paint
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why Contact

Paint a contact cut between poly and metal1.

## Slide 2 — The idea

GOLDEN: contact_count=1 (ca).

<!-- algorithm-walkthrough -->

## Slide 3 — Contact ca

![Contact ca](assets/steps/01-ca.png)

One contact between poly and metal1.

## Slide 4 — Between layers

![Between layers](assets/steps/02-between.png)

Contact bridges poly (g) and metal1 (m1y).

## Slide 5 — Contact paint

![Contact paint](assets/steps/03-paint.png)

Magic contact command paints the cut.

## Slide 6 — Highlight

![Highlight](assets/steps/04-highlight.png)

Contact + gate + m1y highlighted.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: contact_count=1.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **contact-paint**. Run the stage buttons and Check the goldens.

## Slide 9 — Implement track

From common/, run solvers.py and confirm MAGIC_PARTA_OK.

## Slide 10 — Pitfalls

Mixing KLayout viewer shortcuts with Magic paint commands. Forgetting min_width when reading DRC errors.

## Slide 11 — Try these

From the common folder, run the Magic map self-test.

```bash
cd courses/learn_magic/common
python3 solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
contact_count=1 (ca).
ok if goldens match
```

## Slide 13 — Next

Continue the Magic Part A map, then the real CLI track.
