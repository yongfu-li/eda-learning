# Contribute to Netgen — step-by-step (for slides / transcript)

**Module:** `module15-03-contribute-netgen`  
**Lab / algo:** `contribute-netgen`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=contribute-netgen&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Tree layout

![Step 1](steps/01-tree.png)

**Caption (transcript):** netcomp/ and tclcmd/ hold compare and Tcl.

**Slide bullets:**

- tclcmd

**On-screen metrics:**

```
tree
```

## Step 2 — Stub file

![Step 2](steps/02-stub.png)

**Caption (transcript):** Minimal .c: Tcl command lvs registration.

**Slide bullets:**

- stub

**On-screen metrics:**

```
.c
```

## Step 3 — Makefile hook

![Step 3](steps/03-build.png)

**Caption (transcript):** Add object to Makefile and rebuild Netgen.

**Slide bullets:**

- makefile

**On-screen metrics:**

```
build
```

## Step 4 — Smoke

![Step 4](steps/04-smoke.png)

**Caption (transcript):** netgen help lvs proves the command exists.

**Slide bullets:**

- netgen help

**On-screen metrics:**

```
smoke
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: path + tcl + makefile + rebuild + help.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

