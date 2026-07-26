# Real report_checks

**Module id:** module08-01-real-report-checks
**Lab:** real-report-checks
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why real OpenSTA

Read real report_checks path delay and slack.

## Slide 2 — The idea

GOLDEN: endpoint y; delay 2.0; slack 8.0 MET.

<!-- algorithm-walkthrough -->

## Slide 3 — report_checks

![report_checks](assets/steps/01-cmd.png)

report_checks -path_delay max prints the worst path.

## Slide 4 — Startpoint

![Startpoint](assets/steps/02-start.png)

Startpoint is input b.

## Slide 5 — Endpoint

![Endpoint](assets/steps/03-end.png)

Endpoint is output y.

## Slide 6 — Slack MET

![Slack MET](assets/steps/04-slack.png)

Arrival 2.0 required 10.0 → slack 8.0 MET.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: path_delay=2 slack=8.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **real-report-checks**. Build the Tcl recipe or open evidence stages, then Check.

## Slide 9 — Implement track

From common/, run real_solvers.py and confirm REAL_OPENSTA_OK.

## Slide 10 — Pitfalls

Editing goldens by hand without re-running sta. Confusing Part A map JSON with real liberty delays.

## Slide 11 — Try these

From the common folder, run the real OpenSTA self-test.

```bash
cd courses/learn_opensta/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
endpoint y; delay 2.0; slack 8.0 MET.
ok if goldens match
```

## Slide 13 — Next

Continue the Part B evidence track, then wrap — algorithms and internals come later.
