# Contribute to Netgen

**Module id:** module15-03-contribute-netgen
**Lab:** contribute-netgen

## Slide 1 — Why Netgen internals

Know where a new Tcl command lives and the minimal stub to build.

## Slide 2 — The idea

GOLDEN: tclcmd/cmd_lvs.c + register + Makefile + netgen help lvs.

<!-- algorithm-walkthrough -->

## Slide 3 — Tree layout

![Tree layout](assets/steps/01-tree.png)

netcomp/ and tclcmd/ hold compare and Tcl.

## Slide 4 — Stub file

![Stub file](assets/steps/02-stub.png)

Minimal .c: Tcl command lvs registration.

## Slide 5 — Makefile hook

![Makefile hook](assets/steps/03-build.png)

Add object to Makefile and rebuild Netgen.

## Slide 6 — Smoke

![Smoke](assets/steps/04-smoke.png)

netgen help lvs proves the command exists.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: path + tcl + makefile + rebuild + help.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab

Open **contribute-netgen**.

## Slide 9 — Implement track

Call contribute_netgen() in internals_solvers.

## Slide 10 — Pitfalls

Treating browser JSON as the C API.

## Slide 11 — Try these

From the common folder, run the internals self-test.

```bash
cd courses/learn_netgen/common
python3 internals_solvers.py
```

## Slide 12 — Pseudocode

Here is the checklist in plain steps.

```text
tclcmd/cmd_lvs.c + register + Makefile + netgen help lvs.
ok if goldens match INTERNALS_GOLDENS
```

## Slide 13 — Next

Wrap the Netgen path.
