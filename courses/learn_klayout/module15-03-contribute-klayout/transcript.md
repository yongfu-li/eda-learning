# Contribute to KLayout

**Module id:** module15-03-contribute-klayout
**Lab:** contribute-klayout

## Slide 1 — Why KLayout internals

Know where a new Ruby command lives and the minimal stub to build.

## Slide 2 — The idea

GOLDEN: layMain.cc + register + build + klayout -h smoke.

<!-- algorithm-walkthrough -->

## Slide 3 — Tree layout

![Tree layout](assets/steps/01-tree.png)

src/lay/ holds viewer and DRC integration.

## Slide 4 — Entry point

![Entry point](assets/steps/02-stub.png)

layMain.cc is the application entry.

## Slide 5 — Build hook

![Build hook](assets/steps/03-build.png)

qmake/cmake build and install KLayout.

## Slide 6 — Smoke

![Smoke](assets/steps/04-smoke.png)

klayout -h proves the binary runs.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: path + build + smoke help.

<!-- /algorithm-walkthrough -->

## Slide 8 — Browser lab

Open **contribute-klayout**.

## Slide 9 — Implement track

Call contribute_klayout() in internals_solvers.

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
layMain.cc + register + build + klayout -h smoke.
ok if goldens match INTERNALS_GOLDENS
```

## Slide 13 — Next

Wrap the KLayout path.
