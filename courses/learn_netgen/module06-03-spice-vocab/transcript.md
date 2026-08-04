# SPICE vocabulary

**Module id:** module06-03-spice-vocab
**Lab:** spice-vocab

## Slide 1 — Why real Netgen

Name device prefixes and port/pin vocabulary.

## Slide 2 — The idea

GOLDEN: Devices=2; nets=4; classes nmos/pmos.

<!-- algorithm-walkthrough -->

## Slide 3 — M/X prefixes

![M/X prefixes](assets/steps/01-prefix.png)

SPICE devices use M or X prefixes.

## Slide 4 — Four ports

![Four ports](assets/steps/02-ports.png)

Ports A, Y, VDD, VSS.

## Slide 5 — G,D,S pins

![G,D,S pins](assets/steps/03-pins.png)

MOSFET pins gate, drain, source.

## Slide 6 — Classes

![Classes](assets/steps/04-class.png)

nmos and pmos device classes.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: device_count=2 net_count=4.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **spice-vocab**.

## Slide 9 — Implement track

Run real_solvers.py — REAL_NETGEN_OK.

## Slide 10 — Pitfalls

Editing goldens without re-running scripts.

## Slide 11 — Try these

From the common folder, run the real Netgen self-test.

```bash
cd courses/learn_netgen/common
python3 real_solvers.py
```

## Slide 12 — Pseudocode

Here is the check in plain steps.

```text
Devices=2; nets=4; classes nmos/pmos.
ok if goldens match
```

## Slide 13 — Next

Continue Part B evidence track.
