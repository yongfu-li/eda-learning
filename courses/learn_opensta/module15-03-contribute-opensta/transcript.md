# Contribute to OpenSTA

**Module id:** module15-03-contribute-opensta
**Lab:** contribute-opensta
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why contribute

Reading is not enough. A contributor knows where a command lives and how it enters the build.

## Slide 2 — The idea

GOLDEN: add app/HelloCmd.cc, register the Tcl command, hook CMake, rebuild, sta -help hello_cmd.

<!-- algorithm-walkthrough -->

## Slide 3 — Tree layout

![Tree layout](assets/steps/01-tree.png)

network/graph/sdc/search hold the engine; app/ holds Tcl cmds.

## Slide 4 — Stub file

![Stub file](assets/steps/02-stub.png)

Minimal .cc: Cmd subclass and command name hello_cmd.

## Slide 5 — CMake hook

![CMake hook](assets/steps/03-build.png)

Add the object to CMakeLists and rebuild OpenSTA.

## Slide 6 — Smoke

![Smoke](assets/steps/04-smoke.png)

sta -help hello_cmd proves the command exists.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: path + tcl_cmd + cmake + rebuild + help smoke.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **contribute-opensta**. Assemble the contribute checklist and check.

## Slide 9 — Implement track

Call contribute_opensta(); assert checklist length and smoke cmd.

## Slide 10 — Pitfalls

Editing only docs. Forgetting the CMake entry. Skipping help smoke.

## Slide 11 — Try these

From the common folder, call contribute_opensta and print the checklist.

```bash
cd courses/learn_opensta/common
python3 -c "from internals_solvers import contribute_opensta; print(contribute_opensta())"
```

## Slide 12 — Pseudocode

Here is the contribute checklist in plain steps.

```text
path ← app/HelloCmd.cc
register Tcl cmd hello_cmd
add to CMake; rebuild
smoke ← sta -help hello_cmd
```

## Slide 13 — Next

Wrap the OpenSTA path — you can use OpenSTA and open the C++ tree with intent.
