# Read find_path / report

**Module id:** module14-03-read-find-path
**Lab:** read-find-path
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why read FindPath

Part C algorithms match moves. Now map those moves onto the real C++ and Tcl report shape.

## Slide 2 — The idea

GOLDEN: tag endpoints, walk back the worst path, emit pins, format report_checks — slack 8 like Part B.

<!-- algorithm-walkthrough -->

## Slide 3 — Tag endpoints

![Tag endpoints](assets/steps/01-tag.png)

Search tags which pins are report endpoints.

## Slide 4 — Walk back

![Walk back](assets/steps/02-walk.png)

From the worst slack endpoint, walk previous arcs.

## Slide 5 — Emit path

![Emit path](assets/steps/03-emit.png)

Emit the ordered pin list for the critical path.

## Slide 6 — report_checks

![report_checks](assets/steps/04-report.png)

report_checks formats delay 2 and slack 8 MET.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: tag → walk → emit → report; slack 8 path b→y.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **read-find-path**. Step the FindPath pipeline and check.

## Slide 9 — Implement track

Call read_find_path(); assert stage order and Part B slack bind.

## Slide 10 — Pitfalls

Expecting FindPath to replace Liberty. Ignoring the Part B delay and slack goldens.

## Slide 11 — Try these

From the common folder, call read_find_path and print the stages.

```bash
cd courses/learn_opensta/common
python3 -c "from internals_solvers import read_find_path; print(read_find_path())"
```

## Slide 12 — Pseudocode

Here is the FindPath teaching flow in plain steps.

```text
tag_endpoints
walk_back from worst slack
emit_path → [b, n1, n2, y]
report_checks → delay 2, slack 8 MET
```

## Slide 13 — Next

Next: contribute a minimal Tcl command of your own.
