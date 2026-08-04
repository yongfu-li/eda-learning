# Read DRC runner

**Module id:** module14-03-read-drc-runner
**Lab:** read-drc-runner

## Slide 1 — Why KLayout internals

Read the DRC runner flow bound to Part B goldens.

## Slide 2 — The idea

GOLDEN: load_layout→load_drc→run_drc→emit_markers→report (viol=1).

<!-- algorithm-walkthrough -->

## Slide 3 — load_layout

![load_layout](assets/steps/01-load.png)

Load GDS into Layout database.

## Slide 4 — load_drc

![load_drc](assets/steps/02-drc.png)

Load Ruby DRC script.

## Slide 5 — run_drc

![run_drc](assets/steps/03-run.png)

Execute width/spacing checks.

## Slide 6 — emit_markers

![emit_markers](assets/steps/04-emit.png)

Emit violation markers.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: width_violations=1 marker_count=1.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab

Open **read-drc-runner**.

## Slide 9 — Implement track

Call read_drc_runner() in internals_solvers.

## Slide 10 — Pitfalls

Treating browser JSON as the C++ API.

## Slide 11 — Try these

From the common folder, run the internals self-test.

```bash
cd courses/learn_klayout/common
python3 internals_solvers.py
```

## Slide 12 — Pseudocode

Here is the checklist in plain steps.

```text
load_layout→load_drc→run_drc→emit_markers→report (viol=1).
ok if goldens match INTERNALS_GOLDENS
```

## Slide 13 — Next

Wrap the KLayout path.
