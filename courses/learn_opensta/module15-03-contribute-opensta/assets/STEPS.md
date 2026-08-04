# Contribute to OpenSTA — step-by-step (for slides / transcript)

**Module:** `module15-03-contribute-opensta`  
**Lab / algo:** `contribute-opensta`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=contribute-opensta&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Tree layout

![Step 1](steps/01-tree.png)

**Caption (transcript):** network/graph/sdc/search hold the engine; app/ holds Tcl cmds.

**Slide bullets:**

- network
- app

**On-screen metrics:**

```
tree
```

## Step 2 — Stub file

![Step 2](steps/02-stub.png)

**Caption (transcript):** Minimal .cc: Cmd subclass and command name hello_cmd.

**Slide bullets:**

- stub

**On-screen metrics:**

```
.cc
```

## Step 3 — CMake hook

![Step 3](steps/03-build.png)

**Caption (transcript):** Add the object to CMakeLists and rebuild OpenSTA.

**Slide bullets:**

- cmake

**On-screen metrics:**

```
build
```

## Step 4 — Smoke

![Step 4](steps/04-smoke.png)

**Caption (transcript):** sta -help hello_cmd proves the command exists.

**Slide bullets:**

- sta -help

**On-screen metrics:**

```
smoke
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: path + tcl_cmd + cmake + rebuild + help smoke.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

