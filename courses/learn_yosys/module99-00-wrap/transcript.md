# Yosys path complete

**Module id:** module99-00-wrap

## Slide 1 — Recap

You finished Part A toys and Part B real Yosys evidence on `tiny_and_or.v`.

## Slide 2 — Real goldens

After read: 2 modules, 1 process, $and×2. After proc: $dff. After flatten: 4 cells. After synth: $_AOI3_ + $_DFF_P_.

## Slide 3 — Commands you can run

```bash
cd courses/learn_yosys/common
yosys -s scripts/05_synth.ys
python3 -c "from real_solvers import real_yosys_compare; print(real_yosys_compare())"
```

## Slide 4 — Honesty

Toy labs teach pass *ideas*. Real modules teach the CLI, RTLIL, and checked-in Yosys evidence.

## Slide 5 — Next

Natural next: learn_openroad (place/route evidence).

## Slide 6 — Done

You can now open Yosys, write a short `.ys` script, and read `stat`/`dump` on a tiny design.
